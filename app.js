/* =========================================================
   TRIVIA DEL CUMPLE — pantalla de la TV (anfitrión)

   La TV es la que manda: crea la sala, pasa las preguntas, calcula los
   puntos y escribe todo en Firebase. Los celulares solo leen el estado y
   mandan su respuesta.

   Fases (salas/<código>/estado/fase):
     lobby → pregunta → resultados → pregunta → … → podio → lobby
   Se avanza con OK en el control remoto (o Enter / espacio).
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   Puntaje estilo Kahoot
   --------------------------------------------------------- */

const PUNTOS_MAXIMOS = 1000;

/** Correcta: de 1000 (al instante) a 500 (en el último segundo). Incorrecta o sin responder: 0. */
function puntosPorRespuesta(acierto, msTardados, msTotales) {
  if (!acierto) return 0;
  const fraccion = Math.min(Math.max(msTardados / msTotales, 0), 1);
  return Math.round(PUNTOS_MAXIMOS * (1 - fraccion / 2));
}

// Margen para las respuestas del último instante, que tardan un poco en llegar al servidor.
const TOLERANCIA_MS = 1000;

/* ---------------------------------------------------------
   Elementos y estado
   --------------------------------------------------------- */

const el = {
  titulo: $('#titulo'),
  pantallas: {
    lobby: $('#pantallaLobby'),
    pregunta: $('#pantallaPregunta'),
    resultados: $('#pantallaResultados'),
    podio: $('#pantallaPodio'),
    tabla: $('#pantallaTabla'),
    configurar: $('#pantallaConfigurar'),
  },
  codigoSala: $('#codigoSala'),
  codigoChico: $('#codigoChico'),
  conexion: $('#conexion'),
  conexionTexto: $('#conexionTexto'),
  avisoLocal: $('#avisoLocal'),
  qr: $('#qr'),
  qrChico: $('#qrChico'),
  cantidadJugadores: $('#cantidadJugadores'),
  palabraJugadores: $('#palabraJugadores'),
  listaJugadores: $('#listaJugadores'),
  lobbyVacio: $('#lobbyVacio'),
  preguntaNumero: $('#preguntaNumero'),
  reloj: $('#reloj'),
  relojArco: $('#relojArco'),
  relojNumero: $('#relojNumero'),
  respondieron: $('#respondieron'),
  habilitados: $('#habilitados'),
  preguntaTexto: $('#preguntaTexto'),
  opciones: $('#opciones'),
  resNumero: $('#resNumero'),
  resPregunta: $('#resPregunta'),
  resCorrecta: $('#resCorrecta'),
  grafico: $('#grafico'),
  tabla: $('#tabla'),
  pistaResultados: $('#pistaResultados'),
  podioEscalones: $('#podioEscalones'),
  tablaFinal: $('#tablaFinal'),
  tablaNota: $('#tablaNota'),
  toast: $('#toast'),
  avisoSonido: $('#avisoSonido'),
  mudo: $('#mudo'),
  confeti: $('#confeti'),
};

/** Navegadores de Smart TV: menos confeti y sin efectos caros, para que no se trabe. */
const MODO_LIVIANO = /SMART-TV|SmartTV|Tizen|Web0S|webOS|NetCast|HbbTV|BRAVIA|AFT[A-Z]|CrKey|GoogleTV|Android TV/i.test(navigator.userAgent);

const CIRCUNFERENCIA_RELOJ = 2 * Math.PI * 44;
const CLAVE_GUARDADO = 'trivia.tv';

const sonido = crearSonido({ alCambiar: (activo) => { el.avisoSonido.hidden = activo; } });
const db = conectarFirebase();
const ahora = db ? relojServidor(db) : () => Date.now();

let codigo = null;
let hostId = null;
let sala = null;           // referencia a salas/<código>
let estado = { fase: 'lobby', indice: -1, partida: '' };
let jugadores = {};        // id → { nombre, puntos, racha, conectado, unido, ultima }
let respuestas = {};       // id → { opcion, ts } de la pregunta actual
let refRespuestas = null;
let timerReloj = null;
let ultimoSegundo = null;
let terminando = false;
let ocupado = false;       // evita que dos OK seguidos hagan dos cosas
let conectadosAntes = new Set();
let timerToast = null;

/* ---------------------------------------------------------
   Utilidades
   --------------------------------------------------------- */

/** La partida usa un subconjunto de PREGUNTAS, en el orden guardado en estado.orden. */
const preguntaActual = () => PREGUNTAS[Array.isArray(estado.orden) ? estado.orden[estado.indice] : estado.indice];
const totalPreguntas = () => (Array.isArray(estado.orden) ? estado.orden.length : PREGUNTAS.length);
const claveRespuestas = () => `${estado.partida}-${estado.indice}`;

function listaJugadores() {
  return Object.keys(jugadores)
    .filter((id) => jugadores[id] && typeof jugadores[id].nombre === 'string')
    .map((id) => Object.assign({ id }, jugadores[id]));
}

function ranking() {
  return listaJugadores().sort((a, b) => (b.puntos || 0) - (a.puntos || 0) || a.nombre.localeCompare(b.nombre));
}

/** Jugadores que pueden responder la pregunta actual: conectados y que entraron antes de que empezara. */
function habilitados() {
  return listaJugadores().filter((j) => j.conectado && (!estado.inicio || !j.unido || j.unido <= estado.inicio));
}

function mostrarPantalla(nombre) {
  Object.keys(el.pantallas).forEach((clave) => { el.pantallas[clave].hidden = clave !== nombre; });
}

function toast(texto, ms = 3500) {
  el.toast.textContent = texto;
  el.toast.hidden = false;
  clearTimeout(timerToast);
  timerToast = setTimeout(() => { el.toast.hidden = true; }, ms);
}

function mostrarConexion(estadoConexion, texto) {
  el.conexion.dataset.estado = estadoConexion;
  el.conexionTexto.textContent = texto;
}

function leerGuardado() {
  try { return JSON.parse(localStorage.getItem(CLAVE_GUARDADO)) || {}; } catch (e) { return {}; }
}

function guardar(datos) {
  try { localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ }
}

/** Explica en criollo los errores más comunes de Firebase. */
function explicarError(error) {
  const texto = String((error && (error.code || error.message)) || error);
  if (/permission/i.test(texto)) return 'Firebase rechazó el acceso: ¿pegaste las reglas de database.rules.json?';
  return `Error de Firebase: ${texto}`;
}

/** Ejecuta una acción del anfitrión sin que se superponga con otra. */
async function accion(fn) {
  if (ocupado) return;
  ocupado = true;
  try {
    await fn();
  } catch (e) {
    console.error('[trivia]', e);
    toast(explicarError(e), 6000);
  } finally {
    ocupado = false;
  }
}

/* ---------------------------------------------------------
   Arranque: crear (o recuperar) la sala
   --------------------------------------------------------- */

async function buscarCodigoLibre() {
  for (let intento = 0; intento < 30; intento++) {
    const c = String(1000 + Math.floor(aleatorio() * 9000));
    const host = await db.ref(`salas/${c}/host`).once('value');
    if (!host.exists()) return c;
  }
  throw new Error('No encontré un código de sala libre');
}

async function iniciar() {
  document.title = TITULO.replace(/[¡!]/g, '').trim();
  el.titulo.textContent = TITULO;
  if (MODO_LIVIANO) document.documentElement.classList.add('liviano');

  if (!db) {
    mostrarPantalla('configurar');
    return;
  }
  mostrarPantalla('lobby');
  vigilarConexion();

  try {
    // Si esta TV ya tenía una sala, se recupera (con partida y puntos incluidos)
    const guardado = leerGuardado();
    hostId = guardado.hostId || idAleatorio(12);
    codigo = guardado.codigo || null;
    let datos = codigo ? (await db.ref(`salas/${codigo}`).once('value')).val() : null;
    if (!datos || !datos.host || datos.host.id !== hostId) {
      codigo = await buscarCodigoLibre();
      datos = null;
    }
    guardar({ hostId, codigo });
    sala = db.ref(`salas/${codigo}`);

    if (!datos) {
      await sala.set({
        creado: MARCA_SERVIDOR(),
        host: { id: hostId, conectado: true },
        estado: { fase: 'lobby', indice: -1, partida: idAleatorio(6) },
      });
    }

    pintarCodigo();
    marcarHostConectado();
    sala.child('jugadores').on('value', (s) => {
      jugadores = s.val() || {};
      alCambiarJugadores();
    });

    const estadoGuardado = (await sala.child('estado').once('value')).val();
    reanudar(estadoGuardado || { fase: 'lobby', indice: -1, partida: idAleatorio(6) });
    limpiarSalasViejas();
  } catch (e) {
    console.error('[trivia]', e);
    mostrarConexion('error', explicarError(e));
  }
}

/** Avisa en la TV si se corta Firebase y mantiene marcado al anfitrión como conectado. */
function vigilarConexion() {
  let conectadoAlgunaVez = false;
  db.ref('.info/connected').on('value', (s) => {
    if (s.val()) {
      conectadoAlgunaVez = true;
      mostrarConexion('ok', 'Conectado: listo para jugar');
      marcarHostConectado();
    } else if (conectadoAlgunaVez) {
      mostrarConexion('conectando', 'Se cortó internet. Reconectando…');
    }
  });
  setTimeout(() => {
    if (!conectadoAlgunaVez) mostrarConexion('error', 'No conecta con Firebase. Revisá internet y el databaseURL de config.js');
  }, 12000);
}

function marcarHostConectado() {
  if (!sala) return;
  const host = sala.child('host');
  host.onDisconnect().update({ conectado: false });
  host.update({ conectado: true });
}

/** Si la TV se recargó en medio de la partida, sigue desde donde estaba. */
function reanudar(est) {
  estado = est;
  if (est.fase === 'pregunta' && preguntaActual()) {
    escucharRespuestas();
    mostrarPregunta();
    arrancarReloj();
  } else if (est.fase === 'resultados' && preguntaActual()) {
    mostrarResultados();
  } else if (est.fase === 'podio') {
    mostrarPodio(false);
  } else if (est.fase === 'tabla') {
    mostrarTabla();
  } else {
    estado.fase = 'lobby';
    mostrarLobby();
  }
}

/** Borra salas de más de 2 días para que la base no se llene de basura. */
async function limpiarSalasViejas() {
  try {
    const limite = ahora() - 2 * 24 * 60 * 60 * 1000;
    const viejas = await db.ref('salas').orderByChild('creado').endAt(limite).limitToFirst(25).once('value');
    viejas.forEach((hijo) => {
      if (hijo.key !== codigo) hijo.ref.remove();
    });
  } catch (e) { /* no es importante */ }
}

/* ---------------------------------------------------------
   Código y QR
   --------------------------------------------------------- */

function urlJugador() {
  const emulador = parametroEmulador();
  const base = esLocal() && !emulador ? URL_PUBLICA : location.href;
  const url = new URL('player.html', base);
  return `${url.origin}${url.pathname}?sala=${codigo}${emulador}`;
}

function pintarCodigo() {
  el.codigoSala.textContent = codigo;
  el.codigoChico.textContent = codigo;
  el.avisoLocal.hidden = !(esLocal() && !parametroEmulador());
  pintarQR();
}

function dibujarQR(canvas, texto) {
  if (typeof qrcode === 'undefined' || !canvas.clientWidth) return;
  const qr = qrcode(0, 'M');
  qr.addData(texto);
  qr.make();
  const modulos = qr.getModuleCount();
  const borde = 2;
  const total = modulos + borde * 2;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const porModulo = Math.max(2, Math.floor((canvas.clientWidth * dpr) / total));
  canvas.width = canvas.height = porModulo * total;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1b0640';
  for (let fila = 0; fila < modulos; fila++) {
    for (let col = 0; col < modulos; col++) {
      if (qr.isDark(fila, col)) ctx.fillRect((col + borde) * porModulo, (fila + borde) * porModulo, porModulo, porModulo);
    }
  }
}

function pintarQR() {
  if (!codigo) return;
  const url = urlJugador();
  dibujarQR(el.qr, url);
  dibujarQR(el.qrChico, url);
}

/* ---------------------------------------------------------
   Jugadores
   --------------------------------------------------------- */

const COLORES_CHIP = ['#FF2D87', '#7B2FF7', '#00A6E8', '#12B76A', '#FF7B00', '#E3243B', '#00B3A4', '#C13BF0'];

function colorDe(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COLORES_CHIP[h % COLORES_CHIP.length];
}

function alCambiarJugadores() {
  const conectados = listaJugadores().filter((j) => j.conectado);
  const nuevos = conectados.filter((j) => !conectadosAntes.has(j.id));
  if (nuevos.length && estado.fase === 'lobby' && conectadosAntes.size + nuevos.length > 0) sonido.tocar('entrada');
  conectadosAntes = new Set(conectados.map((j) => j.id));

  if (estado.fase === 'lobby') pintarLobby(nuevos.map((j) => j.id));
  else if (estado.fase === 'pregunta') actualizarContador();
  else if (estado.fase === 'resultados') pintarTabla();
}

function pintarLobby(idsNuevos = []) {
  const conectados = listaJugadores()
    .filter((j) => j.conectado)
    .sort((a, b) => (a.unido || 0) - (b.unido || 0));
  el.cantidadJugadores.textContent = conectados.length;
  el.palabraJugadores.textContent = conectados.length === 1 ? 'jugador' : 'jugadores';
  el.lobbyVacio.hidden = conectados.length > 0;

  const fragmento = document.createDocumentFragment();
  conectados.forEach((j) => {
    const chip = document.createElement('li');
    chip.className = idsNuevos.indexOf(j.id) !== -1 ? 'chip nuevo' : 'chip';
    chip.style.setProperty('--color', colorDe(j.id));
    chip.textContent = j.nombre;
    fragmento.appendChild(chip);
  });
  el.listaJugadores.textContent = '';
  el.listaJugadores.appendChild(fragmento);
}

/* ---------------------------------------------------------
   Lobby → partida
   --------------------------------------------------------- */

function mostrarLobby() {
  detenerReloj();
  dejarDeEscucharRespuestas();
  mostrarPantalla('lobby');
  pintarLobby();
  requestAnimationFrame(pintarQR);
}

async function empezarPartida() {
  if (!listaJugadores().some((j) => j.conectado)) {
    toast('Todavía no entró nadie: escaneen el QR 📱');
    return;
  }
  estado = Object.assign({}, estado, { orden: elegirPreguntas() });
  await irAPregunta(0);
}

const CLAVE_USADAS = 'trivia.usadas';

/**
 * Elige al azar PREGUNTAS_POR_PARTIDA preguntas (devuelve sus posiciones en PREGUNTAS).
 * Prefiere las que no salieron en la partida anterior, así dos partidas seguidas no se repiten.
 */
function elegirPreguntas() {
  let usadas = [];
  try { usadas = JSON.parse(localStorage.getItem(CLAVE_USADAS)) || []; } catch (e) { usadas = []; }
  const mezclar = (lista) => {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(aleatorio() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  };
  const posiciones = PREGUNTAS.map((_, i) => i);
  const nuevas = mezclar(posiciones.filter((i) => usadas.indexOf(PREGUNTAS[i].id) === -1));
  const repetidas = mezclar(posiciones.filter((i) => usadas.indexOf(PREGUNTAS[i].id) !== -1));
  const cantidad = Math.min(PREGUNTAS_POR_PARTIDA, PREGUNTAS.length);
  const elegidas = mezclar(nuevas.concat(repetidas).slice(0, cantidad));
  try { localStorage.setItem(CLAVE_USADAS, JSON.stringify(elegidas.map((i) => PREGUNTAS[i].id))); } catch (e) { /* sin almacenamiento */ }
  return elegidas;
}

async function irAPregunta(indice) {
  const p = PREGUNTAS[estado.orden[indice]];
  // Que no queden las respuestas de la pregunta anterior: si no, parecería que ya respondieron todos
  dejarDeEscucharRespuestas();
  respuestas = {};
  const nuevo = {
    fase: 'pregunta',
    indice,
    total: estado.orden.length,
    orden: estado.orden,
    partida: estado.partida,
    duracion: p.tiempo,
    opciones: p.opciones.length,
    inicio: MARCA_SERVIDOR(),
  };
  await sala.child('estado').set(nuevo);
  // La hora de inicio la pone el servidor: se lee la que quedó guardada
  const inicio = (await sala.child('estado/inicio').once('value')).val();
  estado = Object.assign({}, nuevo, { inicio });
  terminando = false;
  escucharRespuestas();
  mostrarPregunta();
  arrancarReloj();
  sonido.tocar('pregunta');
}

/* ---------------------------------------------------------
   Pregunta en curso
   --------------------------------------------------------- */

/**
 * Pone en `destino` el texto en español y, debajo, el subtítulo en japonés
 * (si está activado en config.js y la pregunta lo tiene).
 */
function textoConSubtitulo(destino, espanol, japones) {
  destino.textContent = '';
  const es = document.createElement('span');
  es.className = 'texto-es';
  es.textContent = espanol;
  destino.appendChild(es);
  if (MOSTRAR_JAPONES && japones) {
    const ja = document.createElement('span');
    ja.className = 'texto-ja';
    ja.lang = 'ja';
    ja.textContent = japones;
    destino.appendChild(ja);
  }
}

const tieneJapones = (p) => MOSTRAR_JAPONES && !!p.preguntaJa;
const opcionJa = (p, i) => (MOSTRAR_JAPONES && Array.isArray(p.opcionesJa) ? p.opcionesJa[i] : '');

function mostrarPregunta() {
  const p = preguntaActual();
  mostrarPantalla('pregunta');
  el.preguntaNumero.textContent = `Pregunta ${estado.indice + 1} de ${totalPreguntas()}`;
  textoConSubtitulo(el.preguntaTexto, p.pregunta, tieneJapones(p) ? p.preguntaJa : '');
  el.preguntaTexto.classList.toggle('larga', p.pregunta.length > 70);

  el.opciones.textContent = '';
  el.opciones.dataset.cantidad = p.opciones.length;
  el.opciones.classList.toggle('bilingue', tieneJapones(p));
  p.opciones.forEach((texto, i) => {
    const opcion = document.createElement('div');
    opcion.className = `opcion opcion--${FORMAS[i].clase}`;
    const etiqueta = document.createElement('span');
    etiqueta.className = 'opcion-texto';
    textoConSubtitulo(etiqueta, texto, opcionJa(p, i));
    opcion.append(iconoForma(i), etiqueta);
    el.opciones.appendChild(opcion);
  });
  actualizarContador();
  requestAnimationFrame(pintarQR);
}

function escucharRespuestas() {
  dejarDeEscucharRespuestas();
  respuestas = {};
  refRespuestas = sala.child(`respuestas/${claveRespuestas()}`);
  refRespuestas.on('value', (s) => {
    const nuevas = s.val() || {};
    if (Object.keys(nuevas).length > Object.keys(respuestas).length) sonido.tocar('pop');
    respuestas = nuevas;
    actualizarContador();
  });
}

function dejarDeEscucharRespuestas() {
  if (refRespuestas) refRespuestas.off();
  refRespuestas = null;
}

function actualizarContador() {
  if (estado.fase !== 'pregunta') return;
  const lista = habilitados();
  const cuantos = lista.filter((j) => respuestas[j.id]).length;
  el.respondieron.textContent = cuantos;
  el.habilitados.textContent = lista.length;
  // Si ya respondieron todos, no tiene sentido esperar al reloj
  if (lista.length > 0 && cuantos >= lista.length) terminarPregunta();
}

function arrancarReloj() {
  detenerReloj();
  ultimoSegundo = null;
  const total = estado.duracion * 1000;
  const fin = estado.inicio + total;
  el.relojArco.style.strokeDasharray = CIRCUNFERENCIA_RELOJ.toFixed(1);

  const paso = () => {
    const restante = Math.max(0, fin - ahora());
    const segundos = Math.ceil(restante / 1000);
    el.relojNumero.textContent = segundos;
    el.relojArco.style.strokeDashoffset = (CIRCUNFERENCIA_RELOJ * (1 - restante / total)).toFixed(1);
    el.reloj.classList.toggle('urgente', segundos <= 5);
    if (segundos !== ultimoSegundo) {
      if (ultimoSegundo !== null) {
        if (segundos === 0) sonido.tocar('tiempo');
        else sonido.tocar(segundos <= 5 ? 'pitido' : 'tic', segundos);
      }
      ultimoSegundo = segundos;
    }
    // Se espera un instante extra por las respuestas que vienen en camino
    if (ahora() >= fin + TOLERANCIA_MS) terminarPregunta();
  };
  paso();
  timerReloj = setInterval(paso, 100);
}

function detenerReloj() {
  clearInterval(timerReloj);
  timerReloj = null;
}

async function terminarPregunta() {
  if (estado.fase !== 'pregunta' || terminando) return;
  terminando = true;
  detenerReloj();
  dejarDeEscucharRespuestas();
  try {
    // Se vuelven a leer las respuestas para no perder ninguna de último momento
    respuestas = (await sala.child(`respuestas/${claveRespuestas()}`).once('value')).val() || {};
    await aplicarPuntos();
    mostrarResultados();
    sonido.tocar('revelar');
  } catch (e) {
    console.error('[trivia]', e);
    toast(`${explicarError(e)} Reintentando…`, 4000);
    terminando = false;
    setTimeout(terminarPregunta, 3000);
  }
}

/** Calcula los puntos de todos y los guarda junto con el cambio de fase, en una sola escritura. */
async function aplicarPuntos() {
  const p = preguntaActual();
  const total = estado.duracion * 1000;
  const fin = estado.inicio + total;
  const conteo = p.opciones.map(() => 0);
  const cambios = {};

  listaJugadores().forEach((j) => {
    const r = respuestas[j.id];
    const valida = !!r && typeof r.opcion === 'number' && r.opcion < p.opciones.length &&
      typeof r.ts === 'number' && r.ts <= fin + TOLERANCIA_MS;
    if (valida) conteo[r.opcion]++;
    const acierto = valida && r.opcion === p.correcta;
    const puntos = puntosPorRespuesta(acierto, valida ? r.ts - estado.inicio : 0, total);
    cambios[`jugadores/${j.id}/puntos`] = (j.puntos || 0) + puntos;
    cambios[`jugadores/${j.id}/racha`] = acierto ? (j.racha || 0) + 1 : 0;
    cambios[`jugadores/${j.id}/ultima`] = {
      partida: estado.partida,
      indice: estado.indice,
      opcion: valida ? r.opcion : -1,
      acierto,
      puntos,
    };
  });
  cambios['estado/fase'] = 'resultados';
  cambios['estado/correcta'] = p.correcta;
  cambios['estado/conteo'] = conteo;

  await sala.update(cambios);
  estado = Object.assign({}, estado, { fase: 'resultados', correcta: p.correcta, conteo });
}

/* ---------------------------------------------------------
   Resultados de la pregunta
   --------------------------------------------------------- */

function mostrarResultados() {
  const p = preguntaActual();
  const ultima = estado.indice + 1 >= totalPreguntas();
  mostrarPantalla('resultados');
  el.resNumero.textContent = `Pregunta ${estado.indice + 1} de ${totalPreguntas()}`;
  textoConSubtitulo(el.resPregunta, p.pregunta, tieneJapones(p) ? p.preguntaJa : '');

  el.resCorrecta.textContent = '';
  const marca = iconoForma(p.correcta);
  marca.classList.add(`forma--${FORMAS[p.correcta].clase}`);
  const texto = document.createElement('span');
  texto.className = 'correcta-texto';
  textoConSubtitulo(texto, p.opciones[p.correcta], opcionJa(p, p.correcta));
  el.resCorrecta.append(marca, texto);

  // Gráfico de barras: cuántos eligieron cada opción
  const conteo = p.opciones.map((_, i) => Number((estado.conteo || [])[i]) || 0);
  const maximo = Math.max(1, ...conteo);
  el.grafico.textContent = '';
  p.opciones.forEach((opcion, i) => {
    const columna = document.createElement('div');
    columna.className = `columna columna--${FORMAS[i].clase}${i === p.correcta ? ' columna--correcta' : ''}`;
    const numero = document.createElement('span');
    numero.className = 'columna-numero';
    numero.textContent = conteo[i];
    const barra = document.createElement('div');
    barra.className = 'columna-barra';
    barra.style.height = `${Math.max(4, (conteo[i] / maximo) * 100)}%`;
    const pie = document.createElement('div');
    pie.className = 'columna-pie';
    pie.appendChild(iconoForma(i));
    if (i === p.correcta) {
      const tilde = document.createElement('span');
      tilde.className = 'columna-tilde';
      tilde.textContent = '✔';
      pie.appendChild(tilde);
    }
    columna.append(numero, barra, pie);
    el.grafico.appendChild(columna);
  });

  pintarTabla();
  el.pistaResultados.textContent = '';
  el.pistaResultados.append(
    document.createTextNode('Apretá '),
    Object.assign(document.createElement('kbd'), { textContent: 'OK' }),
    document.createTextNode(ultima ? ' para ver el podio 🏆' : ' para la siguiente pregunta'),
  );
}

function pintarTabla() {
  const fragmento = document.createDocumentFragment();
  ranking().slice(0, 5).forEach((j, i) => {
    const fila = document.createElement('li');
    fila.className = 'tabla-fila';
    fila.style.setProperty('--color', colorDe(j.id));

    const puesto = document.createElement('span');
    puesto.className = 'tabla-puesto';
    puesto.textContent = i + 1;
    const nombre = document.createElement('span');
    nombre.className = 'tabla-nombre';
    nombre.textContent = j.nombre + ((j.racha || 0) >= 3 ? ' 🔥' : '');
    const puntos = document.createElement('span');
    puntos.className = 'tabla-puntos';
    puntos.textContent = (j.puntos || 0).toLocaleString('es-AR');
    fila.append(puesto, nombre, puntos);

    const u = j.ultima;
    if (u && u.partida === estado.partida && u.indice === estado.indice && u.puntos > 0) {
      const suma = document.createElement('span');
      suma.className = 'tabla-suma';
      suma.textContent = `+${u.puntos}`;
      fila.appendChild(suma);
    }
    fragmento.appendChild(fila);
  });
  el.tabla.textContent = '';
  el.tabla.appendChild(fragmento);
}

/* ---------------------------------------------------------
   Podio y nueva partida
   --------------------------------------------------------- */

async function irAlPodio() {
  await sala.child('estado/fase').set('podio');
  estado = Object.assign({}, estado, { fase: 'podio' });
  mostrarPodio(true);
}

function mostrarPodio(festejar) {
  mostrarPantalla('podio');
  const lista = ranking();
  const medallas = ['🥇', '🥈', '🥉'];
  // Orden visual: 2° - 1° - 3°
  const orden = [1, 0, 2];

  el.podioEscalones.textContent = '';
  orden.forEach((puesto) => {
    const j = lista[puesto];
    if (!j) return;
    const escalon = document.createElement('div');
    escalon.className = `escalon escalon--${puesto + 1}`;
    const medalla = document.createElement('span');
    medalla.className = 'escalon-medalla';
    medalla.textContent = medallas[puesto];
    const nombre = document.createElement('span');
    nombre.className = 'escalon-nombre';
    nombre.textContent = j.nombre;
    // Puntos en la escala de la ruleta (grande) y los de la trivia (chico)
    const puntos = document.createElement('span');
    puntos.className = 'escalon-puntos';
    puntos.textContent = textoPuntos(puntosFinales(j.puntos));
    const trivia = document.createElement('span');
    trivia.className = 'escalon-trivia';
    trivia.textContent = `${formatoMiles(j.puntos)} en la trivia`;
    const base = document.createElement('div');
    base.className = 'escalon-base';
    base.textContent = puesto + 1;
    escalon.append(medalla, nombre, puntos, trivia, base);
    el.podioEscalones.appendChild(escalon);
  });

  if (festejar) {
    sonido.tocar('fanfarria');
    confeti.lanzar();
    setTimeout(() => confeti.lanzar(), 1600);
  }
}

async function irALaTabla() {
  await sala.child('estado/fase').set('tabla');
  estado = Object.assign({}, estado, { fase: 'tabla' });
  mostrarTabla();
  sonido.tocar('revelar');
}

/** Tabla final con todos los jugadores y sus puntos en la escala de la ruleta. */
function mostrarTabla() {
  mostrarPantalla('tabla');
  el.tablaNota.textContent = `Cada ${formatoMiles(PUNTOS_TRIVIA_POR_PUNTO)} puntos de la trivia = 1 punto`;
  const lista = ranking();
  const medallas = ['🥇', '🥈', '🥉'];
  el.tablaFinal.classList.toggle('dos-columnas', lista.length > 10);

  const fragmento = document.createDocumentFragment();
  lista.forEach((j, i) => {
    const fila = document.createElement('li');
    fila.className = i < 3 ? `final-fila final-fila--${i + 1}` : 'final-fila';
    fila.style.setProperty('--color', colorDe(j.id));
    fila.style.animationDelay = `${Math.min(i, 19) * 0.06}s`;

    const puesto = document.createElement('span');
    puesto.className = 'final-puesto';
    puesto.textContent = medallas[i] || `${i + 1}°`;
    const nombre = document.createElement('span');
    nombre.className = 'final-nombre';
    nombre.textContent = j.nombre;
    const trivia = document.createElement('span');
    trivia.className = 'final-trivia';
    trivia.textContent = formatoMiles(j.puntos);
    const puntos = document.createElement('span');
    puntos.className = 'final-puntos';
    puntos.textContent = puntosFinales(j.puntos);
    fila.append(puesto, nombre, trivia, puntos);
    fragmento.appendChild(fila);
  });
  el.tablaFinal.textContent = '';
  el.tablaFinal.appendChild(fragmento);
}

/** Puntos a cero, borra las respuestas y vuelve a la sala de espera (los conectados siguen adentro). */
async function nuevaPartida() {
  const cambios = {
    respuestas: null,
    estado: { fase: 'lobby', indice: -1, partida: idAleatorio(6) },
  };
  Object.keys(jugadores).forEach((id) => {
    const j = jugadores[id];
    if (!j || typeof j.nombre !== 'string' || !j.conectado) {
      cambios[`jugadores/${id}`] = null; // se va quien ya no está
      return;
    }
    cambios[`jugadores/${id}/puntos`] = 0;
    cambios[`jugadores/${id}/racha`] = 0;
    cambios[`jugadores/${id}/ultima`] = null;
  });
  await sala.update(cambios);
  estado = cambios.estado;
  terminando = false;
  mostrarLobby();
  toast('¡Partida nueva! Los puntos volvieron a cero.');
}

/* ---------------------------------------------------------
   Control remoto / teclado
   --------------------------------------------------------- */

function avanzar() {
  if (!sala) return;
  accion(async () => {
    if (estado.fase === 'lobby') await empezarPartida();
    else if (estado.fase === 'resultados') {
      if (estado.indice + 1 < totalPreguntas()) await irAPregunta(estado.indice + 1);
      else await irAlPodio();
    } else if (estado.fase === 'podio') await irALaTabla();
    else if (estado.fase === 'tabla') await nuevaPartida();
    // Durante una pregunta no se hace nada: se espera el reloj o que respondan todos
  });
}

let yaActivado = false;
function activarTV() {
  sonido.activar();
  mantenerPantallaEncendida();
  if (!yaActivado) {
    yaActivado = true;
    const doc = document.documentElement;
    if (!document.fullscreenElement && doc.requestFullscreen) sinErrores(doc.requestFullscreen());
  }
}

const TECLAS_AVANZAR = ['Enter', ' ', 'PageDown', 'ArrowRight', 'MediaPlayPause'];

document.addEventListener('keydown', (e) => {
  if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  activarTV();
  const tecla = e.key.toLowerCase();
  if (TECLAS_AVANZAR.indexOf(e.key) !== -1 || e.keyCode === 13) {
    e.preventDefault();
    avanzar();
  } else if (tecla === 'n') {
    if (sala && confirm('¿Empezar una partida nueva? Los puntos vuelven a cero.')) accion(nuevaPartida);
  } else if (tecla === 'f') {
    if (document.fullscreenElement) sinErrores(document.exitFullscreen());
    else if (document.documentElement.requestFullscreen) sinErrores(document.documentElement.requestFullscreen());
  } else if (tecla === 'm') {
    el.mudo.hidden = !sonido.alternarMudo();
  }
});

document.addEventListener('pointerdown', activarTV);
// Con mouse también se puede avanzar tocando el cartel "Apretá OK…"
document.querySelectorAll('.pista-ok').forEach((p) => p.addEventListener('click', avanzar));

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && yaActivado) mantenerPantallaEncendida();
});

let esperaRedimension = null;
window.addEventListener('resize', () => {
  clearTimeout(esperaRedimension);
  esperaRedimension = setTimeout(() => {
    pintarQR();
    confeti.ajustar();
  }, 150);
});

/* ---------------------------------------------------------
   Confeti (Canvas)
   --------------------------------------------------------- */

const confeti = (() => {
  const ctx = el.confeti.getContext('2d');
  const COLORES = ['#FFD700', '#FF2D87', '#00C2FF', '#FFC83D', '#7CB800', '#FFFFFF', '#C13BF0', '#FF7B00'];
  let piezas = [];
  let corriendo = false;
  let anterior = 0;
  let ancho = 0;
  let alto = 0;

  function ajustar() {
    const dpr = MODO_LIVIANO ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    el.confeti.width = Math.round(ancho * dpr);
    el.confeti.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function lanzar() {
    ajustar();
    const cantidad = MODO_LIVIANO ? 120 : 320;
    for (let i = 0; i < cantidad; i++) {
      const izquierda = i % 2 === 0;
      const angulo = ((20 + aleatorio() * 38) * Math.PI) / 180;
      const velocidad = alto * (1.5 + aleatorio() * 1.3);
      const tam = alto / 80;
      piezas.push({
        x: izquierda ? -10 : ancho + 10,
        y: alto + 10,
        vx: Math.sin(angulo) * velocidad * (izquierda ? 1 : -1),
        vy: -Math.cos(angulo) * velocidad,
        w: tam * (0.6 + aleatorio() * 0.8),
        h: tam * (0.9 + aleatorio() * 1.1),
        giro: aleatorio() * Math.PI * 2,
        velGiro: (aleatorio() - 0.5) * 12,
        volteo: aleatorio() * Math.PI * 2,
        velVolteo: 4 + aleatorio() * 8,
        fase: aleatorio() * Math.PI * 2,
        color: COLORES[Math.floor(aleatorio() * COLORES.length)],
      });
    }
    if (!corriendo) {
      corriendo = true;
      anterior = performance.now();
      requestAnimationFrame(paso);
    }
  }

  function paso(t) {
    const dt = Math.min(0.033, (t - anterior) / 1000);
    anterior = t;
    const freno = Math.exp(-2.6 * dt);
    ctx.clearRect(0, 0, ancho, alto);
    piezas = piezas.filter((p) => {
      p.vx *= freno;
      p.vy = p.vy * freno + alto * 1.2 * dt;
      p.x += (p.vx + Math.sin(t / 300 + p.fase) * alto * 0.04) * dt;
      p.y += p.vy * dt;
      p.giro += p.velGiro * dt;
      p.volteo += p.velVolteo * dt;
      if (p.y > alto + 40) return false;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.scale(1, Math.cos(p.volteo));
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      return true;
    });
    if (piezas.length) requestAnimationFrame(paso);
    else {
      corriendo = false;
      ctx.clearRect(0, 0, ancho, alto);
    }
  }

  return { lanzar, ajustar };
})();

iniciar();
