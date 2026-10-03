/* =========================================================
   TRIVIA DEL CUMPLE — pantalla del jugador (celular)

   El celular no sabe las preguntas ni las respuestas: solo muestra los
   botones de colores, manda la opción elegida a Firebase y después
   muestra cómo le fue (los puntos los calcula la TV).
   ========================================================= */
'use strict';

const el = {
  titulo: $('#titulo'),
  jNombre: $('#jNombre'),
  jPuntos: $('#jPuntos'),
  jConexion: $('#jConexion'),
  vistas: {
    vIngreso: $('#vIngreso'),
    vEspera: $('#vEspera'),
    vPregunta: $('#vPregunta'),
    vEnviada: $('#vEnviada'),
    vResultado: $('#vResultado'),
    vPodio: $('#vPodio'),
    vMensaje: $('#vMensaje'),
  },
  formIngreso: $('#formIngreso'),
  inputCodigo: $('#inputCodigo'),
  inputNombre: $('#inputNombre'),
  botonEntrar: $('#botonEntrar'),
  errorIngreso: $('#errorIngreso'),
  esperaTitulo: $('#esperaTitulo'),
  esperaTexto: $('#esperaTexto'),
  jNumero: $('#jNumero'),
  jTiempo: $('#jTiempo'),
  jBotones: $('#jBotones'),
  jElegida: $('#jElegida'),
  resIcono: $('#resIcono'),
  resTitulo: $('#resTitulo'),
  resSuma: $('#resSuma'),
  resRacha: $('#resRacha'),
  resPuesto: $('#resPuesto'),
  podioMedalla: $('#podioMedalla'),
  podioTitulo: $('#podioTitulo'),
  podioPuntos: $('#podioPuntos'),
  podioDetalle: $('#podioDetalle'),
  mensajeEmoji: $('#mensajeEmoji'),
  mensajeTitulo: $('#mensajeTitulo'),
  mensajeTexto: $('#mensajeTexto'),
  mensajeBoton: $('#mensajeBoton'),
  botonSalir: $('#botonSalir'),
  jAviso: $('#jAviso'),
};

const CLAVE_GUARDADO = 'trivia.jugador';
const VISTAS_EN_JUEGO = ['vEspera', 'vPregunta', 'vEnviada', 'vResultado', 'vPodio'];

const sonido = crearSonido();
const db = conectarFirebase();
const ahora = db ? relojServidor(db) : () => Date.now();

let codigo = null;
let id = null;
let sala = null;
let estado = null;          // salas/<código>/estado
let jugadores = {};
let conectado = false;
let hostConectado = true;
let saliendo = false;
const respondidas = {};     // clave de pregunta → opción enviada
const chequeadas = {};      // claves cuya respuesta previa ya se buscó en Firebase
let vistaActual = null;
let botonesDe = null;       // clave de la pregunta cuyos botones están en pantalla
let timerTiempo = null;
let festejado = '';         // para no repetir sonidos y vibraciones del mismo resultado

/* ---------------------------------------------------------
   Utilidades
   --------------------------------------------------------- */

function mostrarVista(nombre) {
  Object.keys(el.vistas).forEach((clave) => { el.vistas[clave].hidden = clave !== nombre; });
  vistaActual = nombre;
  el.botonSalir.hidden = VISTAS_EN_JUEGO.indexOf(nombre) === -1;
  if (nombre !== 'vPregunta') {
    botonesDe = null;
    detenerTiempo();
  }
}

function mensaje({ emoji, titulo, texto, boton = 'Volver', alTocar = irAlIngreso }) {
  el.mensajeEmoji.textContent = emoji;
  el.mensajeTitulo.textContent = titulo;
  el.mensajeTexto.textContent = texto;
  el.mensajeBoton.textContent = boton;
  el.mensajeBoton.hidden = !boton;
  el.mensajeBoton.onclick = alTocar;
  mostrarVista('vMensaje');
}

/**
 * El jugador se guarda en dos lugares:
 * - sessionStorage: esta pestaña (si se recarga, vuelve sí o sí con su jugador).
 * - localStorage: el navegador (si se cerró y se vuelve a escanear el QR).
 */
function leerGuardado(dePestania = false) {
  try {
    const almacen = dePestania ? sessionStorage : localStorage;
    return JSON.parse(almacen.getItem(CLAVE_GUARDADO)) || {};
  } catch (e) {
    return {};
  }
}

function guardar(datos) {
  const texto = JSON.stringify(datos);
  try { localStorage.setItem(CLAVE_GUARDADO, texto); } catch (e) { /* sin almacenamiento */ }
  try { sessionStorage.setItem(CLAVE_GUARDADO, texto); } catch (e) { /* sin almacenamiento */ }
}

function actualizarAviso() {
  let texto = '';
  if (sala && !conectado) texto = 'Sin conexión. Reconectando…';
  else if (sala && !hostConectado) texto = 'La tele se desconectó. Esperando que vuelva…';
  el.jAviso.textContent = texto;
  el.jAviso.hidden = !texto;
  el.jConexion.dataset.estado = conectado ? 'ok' : 'error';
}

function ranking() {
  return Object.keys(jugadores)
    .filter((k) => jugadores[k] && typeof jugadores[k].nombre === 'string')
    .map((k) => Object.assign({ id: k }, jugadores[k]))
    .sort((a, b) => (b.puntos || 0) - (a.puntos || 0) || a.nombre.localeCompare(b.nombre));
}

function miPuesto() {
  const lista = ranking();
  return { puesto: lista.findIndex((j) => j.id === id) + 1, total: lista.length };
}

const claveActual = () => `${estado.partida}-${estado.indice}`;

/* ---------------------------------------------------------
   Arranque e ingreso a la sala
   --------------------------------------------------------- */

async function iniciar() {
  el.titulo.textContent = TITULO;
  document.title = `Jugar · ${TITULO.replace(/[¡!]/g, '').trim()}`;

  if (!db) {
    mensaje({
      emoji: '🔧',
      titulo: 'Falta configurar el juego',
      texto: 'Quien organiza tiene que pegar la configuración de Firebase en config.js.',
      boton: '',
    });
    return;
  }

  db.ref('.info/connected').on('value', (s) => {
    conectado = s.val() === true;
    actualizarAviso();
    if (conectado) registrarPresencia();
  });

  const salaEnLink = (new URLSearchParams(location.search).get('sala') || '').replace(/\D/g, '').slice(0, 4);
  const dePestania = leerGuardado(true);
  const delNavegador = leerGuardado();
  el.inputCodigo.value = salaEnLink || delNavegador.codigo || '';
  el.inputNombre.value = delNavegador.nombre || '';

  // ¿Ya estaba jugando en esta sala? (recargó la página o cerró el navegador) → vuelve con sus puntos
  const candidatos = [{ g: dePestania, propio: true }, { g: delNavegador, propio: false }];
  for (const { g, propio } of candidatos) {
    if (!g.id || !g.codigo || (salaEnLink && salaEnLink !== g.codigo)) continue;
    try {
      const j = (await db.ref(`salas/${g.codigo}/jugadores/${g.id}`).once('value')).val();
      // Uno guardado en el navegador solo se recupera si no lo está usando otra pestaña
      if (j && typeof j.nombre === 'string' && (propio || !j.conectado)) {
        entrar(g.codigo, g.id);
        return;
      }
    } catch (e) { /* si falla, que entre de nuevo */ }
  }
  irAlIngreso();
}

function irAlIngreso() {
  el.errorIngreso.hidden = true;
  el.jNombre.textContent = '';
  el.jPuntos.textContent = '';
  mostrarVista('vIngreso');
}

function errorIngreso(texto) {
  el.errorIngreso.textContent = texto;
  el.errorIngreso.hidden = false;
}

el.formIngreso.addEventListener('submit', async (e) => {
  e.preventDefault();
  sonido.activar();
  const c = el.inputCodigo.value.replace(/\D/g, '');
  const nombre = el.inputNombre.value.replace(/\s+/g, ' ').trim();
  if (c.length !== 4) {
    errorIngreso('El código de sala tiene 4 números: está en la tele.');
    return;
  }
  if (!nombre) {
    errorIngreso('Escribí tu nombre o un apodo.');
    return;
  }
  el.botonEntrar.disabled = true;
  el.errorIngreso.hidden = true;
  try {
    await ingresar(c, nombre.slice(0, 16));
  } catch (error) {
    errorIngreso(/permission/i.test(String(error && (error.code || error.message)))
      ? 'Firebase rechazó el acceso. Avisale a quien organiza (faltan las reglas).'
      : error.message || 'No se pudo entrar. Probá de nuevo.');
  } finally {
    el.botonEntrar.disabled = false;
  }
});

async function ingresar(c, nombre) {
  const host = (await db.ref(`salas/${c}/host`).once('value')).val();
  if (!host) throw new Error('No hay ninguna sala con ese código. Fijate el número en la tele.');

  const todos = (await db.ref(`salas/${c}/jugadores`).once('value')).val() || {};
  const lista = Object.keys(todos).map((k) => todos[k]).filter((j) => j && typeof j.nombre === 'string');
  if (lista.length >= MAX_JUGADORES) throw new Error(`La sala está llena (máximo ${MAX_JUGADORES} jugadores).`);

  // Si el nombre ya está, se le agrega un número
  const usados = new Set(lista.map((j) => j.nombre.toLowerCase()));
  let final = nombre;
  for (let n = 2; usados.has(final.toLowerCase()); n++) final = `${nombre.slice(0, 13)} ${n}`;

  const nuevoId = idAleatorio(12);
  await db.ref(`salas/${c}/jugadores/${nuevoId}`).set({
    nombre: final,
    puntos: 0,
    racha: 0,
    conectado: true,
    unido: MARCA_SERVIDOR(),
  });
  guardar({ codigo: c, id: nuevoId, nombre });
  entrar(c, nuevoId);
  if (final !== nombre) avisoBreve(`Ya había alguien con ese nombre: sos "${final}"`);
}

function entrar(c, idJugador) {
  codigo = c;
  id = idJugador;
  sala = db.ref(`salas/${c}`);
  saliendo = false;
  estado = null;
  mostrarVista('vEspera');
  registrarPresencia();

  sala.child('estado').on('value', (s) => {
    estado = s.val();
    if (!estado) {
      salaCerrada();
      return;
    }
    render();
  });
  sala.child('jugadores').on('value', (s) => {
    jugadores = s.val() || {};
    if (!jugadores[id] || typeof jugadores[id].nombre !== 'string') {
      fueraDeLaSala();
      return;
    }
    pintarCabecera();
    render();
  });
  sala.child('host/conectado').on('value', (s) => {
    hostConectado = s.val() !== false;
    actualizarAviso();
  });
  mantenerPantallaEncendida();
}

/** Marca al jugador como conectado y le pide a Firebase que lo marque desconectado si se corta. */
function registrarPresencia() {
  if (!sala || !id || !conectado) return;
  const yo = sala.child(`jugadores/${id}`);
  yo.child('conectado').onDisconnect().set(false);
  // Solo si el jugador sigue existiendo (si no, se crearía un jugador "fantasma" sin nombre)
  yo.child('nombre').once('value').then((n) => {
    if (n.exists()) yo.child('conectado').set(true);
  });
}

function soltarSala() {
  if (sala) {
    sala.child('estado').off();
    sala.child('jugadores').off();
    sala.child('host/conectado').off();
    if (id) sala.child(`jugadores/${id}/conectado`).onDisconnect().cancel();
  }
  sala = null;
  estado = null;
  jugadores = {};
  detenerTiempo();
  actualizarAviso();
}

function olvidarJugador() {
  const g = leerGuardado(true).id ? leerGuardado(true) : leerGuardado();
  guardar({ codigo: g.codigo, nombre: g.nombre });
}

function salaCerrada() {
  soltarSala();
  olvidarJugador();
  mensaje({ emoji: '📺', titulo: 'La sala se cerró', texto: 'Escaneá de nuevo el QR que está en la tele.' });
}

function fueraDeLaSala() {
  const voluntario = saliendo;
  soltarSala();
  olvidarJugador();
  if (voluntario) irAlIngreso();
  else mensaje({ emoji: '👋', titulo: 'Quedaste afuera', texto: 'Empezó una partida nueva mientras no estabas conectado.', boton: 'Volver a entrar' });
}

el.botonSalir.addEventListener('click', async () => {
  if (!sala || !id) return;
  if (!confirm('¿Salir de la partida? Vas a perder tus puntos.')) return;
  saliendo = true;
  const ref = sala.child(`jugadores/${id}`);
  try {
    await ref.child('conectado').onDisconnect().cancel();
    await ref.remove(); // el listener de jugadores se encarga del resto
  } catch (e) {
    saliendo = false;
    avisoBreve('No se pudo salir. ¿Hay internet?');
  }
});

/* ---------------------------------------------------------
   Qué se muestra según la fase del juego
   --------------------------------------------------------- */

function pintarCabecera() {
  const yo = jugadores[id];
  if (!yo) return;
  el.jNombre.textContent = yo.nombre;
  el.jPuntos.textContent = `${(yo.puntos || 0).toLocaleString('es-AR')} pts`;
}

function render() {
  if (!estado || !id || !jugadores[id]) return;
  const yo = jugadores[id];

  if (estado.fase === 'pregunta') {
    const clave = claveActual();
    if (yo.unido && estado.inicio && yo.unido > estado.inicio) {
      esperar('¡Bienvenido!', 'Entrás en la próxima pregunta. Mientras, mirá la tele.');
    } else if (respondidas[clave] !== undefined) {
      mostrarEnviada(respondidas[clave]);
    } else if (ahora() > estado.inicio + estado.duracion * 1000) {
      esperar('¡Se acabó el tiempo!', 'Mirá la tele para ver los resultados.');
    } else {
      mostrarBotones(clave);
      buscarRespuestaPrevia(clave);
    }
  } else if (estado.fase === 'resultados') {
    mostrarResultado(yo);
  } else if (estado.fase === 'podio' || estado.fase === 'tabla') {
    mostrarFinal(yo);
  } else {
    esperar('¡Estás adentro!', 'Mirá la tele: el juego empieza en un ratito.');
  }
}

function esperar(titulo, texto) {
  el.esperaTitulo.textContent = titulo;
  el.esperaTexto.textContent = texto;
  if (vistaActual !== 'vEspera') mostrarVista('vEspera');
}

/** Si recargó la página después de responder, no se le vuelven a mostrar los botones. */
function buscarRespuestaPrevia(clave) {
  if (chequeadas[clave]) return;
  chequeadas[clave] = true;
  sala.child(`respuestas/${clave}/${id}`).once('value').then((s) => {
    if (s.exists() && respondidas[clave] === undefined) {
      respondidas[clave] = s.val().opcion;
      render();
    }
  }).catch(() => {});
}

function mostrarBotones(clave) {
  if (vistaActual === 'vPregunta' && botonesDe === clave) return;
  el.jNumero.textContent = `Pregunta ${estado.indice + 1} de ${estado.total}`;
  el.jBotones.textContent = '';
  el.jBotones.dataset.cantidad = estado.opciones;
  for (let i = 0; i < estado.opciones; i++) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = `j-opcion j-opcion--${FORMAS[i].clase}`;
    boton.setAttribute('aria-label', `Respuesta ${i + 1}: ${FORMAS[i].nombre}`);
    boton.appendChild(iconoForma(i));
    boton.addEventListener('click', () => responder(i, clave));
    el.jBotones.appendChild(boton);
  }
  mostrarVista('vPregunta');
  botonesDe = clave;
  arrancarTiempo();
}

function arrancarTiempo() {
  detenerTiempo();
  const fin = estado.inicio + estado.duracion * 1000;
  const paso = () => {
    const segundos = Math.max(0, Math.ceil((fin - ahora()) / 1000));
    el.jTiempo.textContent = segundos;
    el.jTiempo.classList.toggle('urgente', segundos <= 5);
    if (segundos <= 0) {
      detenerTiempo();
      if (vistaActual === 'vPregunta') esperar('¡Se acabó el tiempo!', 'Mirá la tele para ver los resultados.');
    }
  };
  paso();
  timerTiempo = setInterval(paso, 250);
}

function detenerTiempo() {
  clearInterval(timerTiempo);
  timerTiempo = null;
}

function responder(opcion, clave) {
  if (respondidas[clave] !== undefined || !estado || claveActual() !== clave) return;
  if (ahora() > estado.inicio + estado.duracion * 1000) return;
  respondidas[clave] = opcion;
  sonido.activar();
  sonido.tocar('pop');
  vibrar(30);
  mostrarEnviada(opcion);

  // La hora la pone el servidor: así nadie gana por tener el reloj adelantado
  sala.child(`respuestas/${clave}/${id}`).set({ opcion, ts: MARCA_SERVIDOR() }).catch(async () => {
    // Si ya había una respuesta guardada (por ejemplo, doble toque), está todo bien
    const previa = await sala.child(`respuestas/${clave}/${id}`).once('value').catch(() => null);
    if (previa && previa.exists()) return;
    delete respondidas[clave];
    avisoBreve('No se pudo enviar la respuesta. Tocá de nuevo.');
    render();
  });
}

function mostrarEnviada(opcion) {
  if (vistaActual === 'vEnviada' && el.jElegida.dataset.opcion === String(opcion)) return;
  el.jElegida.textContent = '';
  el.jElegida.dataset.opcion = opcion;
  el.jElegida.className = `j-elegida j-opcion--${FORMAS[opcion].clase}`;
  el.jElegida.appendChild(iconoForma(opcion));
  mostrarVista('vEnviada');
}

function mostrarResultado(yo) {
  const u = yo.ultima;
  const clave = claveActual();
  const deEstaPregunta = u && u.partida === estado.partida && u.indice === estado.indice;
  if (!deEstaPregunta) {
    esperar('Calculando…', 'Mirá la tele.');
    return;
  }

  const seccion = el.vistas.vResultado;
  seccion.classList.remove('j-resultado--bien', 'j-resultado--mal');
  const llegoTarde = yo.unido && estado.inicio && yo.unido > estado.inicio;
  if (u.acierto) {
    seccion.classList.add('j-resultado--bien');
    el.resIcono.textContent = '✔';
    el.resTitulo.textContent = '¡Correcto!';
  } else {
    seccion.classList.add('j-resultado--mal');
    el.resIcono.textContent = u.opcion === -1 ? '⏱' : '✖';
    el.resTitulo.textContent = llegoTarde ? 'Esta no la jugaste' : (u.opcion === -1 ? 'No respondiste a tiempo' : 'Incorrecto');
  }
  el.resSuma.textContent = `+${(u.puntos || 0).toLocaleString('es-AR')}`;
  el.resRacha.hidden = !((yo.racha || 0) >= 2);
  el.resRacha.textContent = `🔥 ${yo.racha} seguidas`;
  const { puesto, total } = miPuesto();
  el.resPuesto.textContent = `Vas ${puesto}° de ${total} · ${(yo.puntos || 0).toLocaleString('es-AR')} pts`;

  if (vistaActual !== 'vResultado') mostrarVista('vResultado');
  if (festejado !== clave) {
    festejado = clave;
    if (u.acierto) {
      sonido.tocar('correcto');
      vibrar([40, 40, 80]);
    } else if (!llegoTarde) {
      sonido.tocar('incorrecto');
      vibrar(200);
    }
  }
}

function mostrarFinal(yo) {
  const { puesto, total } = miPuesto();
  const medallas = ['🥇', '🥈', '🥉'];
  el.podioMedalla.textContent = medallas[puesto - 1] || '🎉';
  el.podioTitulo.textContent = puesto === 1 ? '¡Ganaste!' : `¡Terminaste ${puesto}° de ${total}!`;
  // Puntos en la escala de la ruleta (1.800 → 2), con los de la trivia como referencia
  el.podioPuntos.textContent = textoPuntos(puntosFinales(yo.puntos));
  el.podioDetalle.textContent = `${formatoMiles(yo.puntos)} en la trivia · Mirá la tabla en la tele.`;
  if (vistaActual !== 'vPodio') mostrarVista('vPodio');
  const clave = `${estado.partida}-podio`;
  if (festejado !== clave) {
    festejado = clave;
    if (puesto <= 3) {
      sonido.tocar('fanfarria');
      vibrar([80, 60, 80, 60, 300]);
    }
  }
}

/* ---------------------------------------------------------
   Varios
   --------------------------------------------------------- */

let timerAviso = null;
function avisoBreve(texto) {
  el.jAviso.textContent = texto;
  el.jAviso.hidden = false;
  clearTimeout(timerAviso);
  timerAviso = setTimeout(actualizarAviso, 4000);
}

// Cualquier toque habilita el sonido (los celulares lo exigen)
document.addEventListener('pointerdown', () => sonido.activar());

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && sala) mantenerPantallaEncendida();
});

iniciar();
