/* =========================================================
   TRIVIA DEL CUMPLE — código compartido por la TV y los celulares
   Firebase, hora del servidor, formas de las respuestas y sonidos.
   ========================================================= */
'use strict';

const $ = (sel) => document.querySelector(sel);

/** Número aleatorio en [0, 1) con calidad criptográfica. */
function aleatorio() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] / 4294967296;
}

function idAleatorio(largo = 10) {
  const abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < largo; i++) s += abc[Math.floor(aleatorio() * abc.length)];
  return s;
}

/* ---------------------------------------------------------
   Firebase
   --------------------------------------------------------- */

/** true si en config.js ya se pegó la configuración real. */
function configuracionCompleta() {
  return (
    typeof firebaseConfig === 'object' &&
    /^https:\/\/\S+/.test(firebaseConfig.databaseURL || '') &&
    JSON.stringify(firebaseConfig).indexOf('PEGAR_AQUI') === -1
  );
}

/**
 * Conecta con Firebase y devuelve la base de datos (o null si falta configurar).
 * Para probar sin un proyecto real se puede usar el emulador oficial:
 * agregá ?emulador=127.0.0.1:9000 a la dirección.
 */
function conectarFirebase() {
  if (typeof firebase === 'undefined') return null;
  const emulador = new URLSearchParams(location.search).get('emulador');
  if (emulador) {
    const [host, puerto] = emulador.split(':');
    // El emulador aplica las reglas a la base "<proyecto>-default-rtdb"
    firebase.initializeApp({ projectId: 'demo-trivia', databaseURL: `http://${host}:${puerto}?ns=demo-trivia-default-rtdb` });
    const db = firebase.database();
    db.useEmulator(host, Number(puerto));
    return db;
  }
  if (!configuracionCompleta()) return null;
  firebase.initializeApp(firebaseConfig);
  return firebase.database();
}

/** Marca de tiempo que pone el servidor (igual para todos, no depende del reloj de cada aparato). */
const MARCA_SERVIDOR = () => firebase.database.ServerValue.TIMESTAMP;

/** Devuelve una función que da la hora del servidor de Firebase, en milisegundos. */
function relojServidor(db) {
  let diferencia = 0;
  db.ref('.info/serverTimeOffset').on('value', (s) => { diferencia = s.val() || 0; });
  return () => Date.now() + diferencia;
}

/** Lo que se agrega a los links para seguir usando el emulador (solo en pruebas). */
function parametroEmulador() {
  const emulador = new URLSearchParams(location.search).get('emulador');
  return emulador ? `&emulador=${encodeURIComponent(emulador)}` : '';
}

function esLocal() {
  return location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
}

/* ---------------------------------------------------------
   Puntos finales (escala de la ruleta)
   --------------------------------------------------------- */

/** Convierte los puntos de la trivia a la escala chica: 1.800 → 2. */
function puntosFinales(puntosTrivia) {
  return Math.round((puntosTrivia || 0) / PUNTOS_TRIVIA_POR_PUNTO);
}

const textoPuntos = (n) => `${n} ${n === 1 ? 'punto' : 'puntos'}`;
const formatoMiles = (n) => (n || 0).toLocaleString('es-AR');

/* ---------------------------------------------------------
   Formas y colores de las 4 respuestas (como en la TV)
   --------------------------------------------------------- */

const FORMAS = [
  { nombre: 'triángulo', clase: 'roja', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,10 94,88 6,88"/></svg>' },
  { nombre: 'rombo', clase: 'azul', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,4 96,50 50,96 4,50"/></svg>' },
  { nombre: 'círculo', clase: 'amarilla', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44"/></svg>' },
  { nombre: 'cuadrado', clase: 'verde', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="9" y="9" width="82" height="82" rx="6"/></svg>' },
];

/** Crea el ícono de la forma (los SVG son fijos, no vienen de afuera). */
function iconoForma(indice) {
  const span = document.createElement('span');
  span.className = 'forma';
  span.innerHTML = FORMAS[indice].svg;
  return span;
}

/* ---------------------------------------------------------
   Varios
   --------------------------------------------------------- */

async function mantenerPantallaEncendida() {
  try {
    if ('wakeLock' in navigator && document.visibilityState === 'visible') {
      await navigator.wakeLock.request('screen');
    }
  } catch (e) { /* no soportado: no pasa nada */ }
}

/** Los navegadores viejos (algunas Smart TV) no devuelven una promesa: se ignora el resultado. */
function sinErrores(resultado) {
  if (resultado && typeof resultado.catch === 'function') resultado.catch(() => {});
}

function vibrar(patron) {
  if (navigator.vibrate) {
    try { navigator.vibrate(patron); } catch (e) { /* nada */ }
  }
}

/* ---------------------------------------------------------
   Sonido (Web Audio API, sin archivos externos)
   --------------------------------------------------------- */

function crearSonido({ volumen = 0.8, alCambiar = () => {} } = {}) {
  let ctx = null;
  let salida = null;
  let mudo = false;

  /** Crea o despierta el audio. Los navegadores exigen un toque, clic o tecla antes. */
  function activar() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      const compresor = ctx.createDynamicsCompressor();
      compresor.connect(ctx.destination);
      salida = ctx.createGain();
      salida.gain.value = volumen;
      salida.connect(compresor);
      ctx.addEventListener('statechange', () => alCambiar(activo()));
    }
    if (ctx.state === 'suspended') sinErrores(ctx.resume());
    alCambiar(activo());
  }

  const activo = () => !!ctx && ctx.state === 'running';
  const disponible = () => activo() && !mudo;

  function nota(frecuencia, inicio, duracion, { tipo = 'square', vol = 0.12, vibrato = 0, hasta = null, destino = salida } = {}) {
    const osc = ctx.createOscillator();
    osc.type = tipo;
    osc.frequency.setValueAtTime(frecuencia, inicio);
    if (hasta) osc.frequency.linearRampToValueAtTime(hasta, inicio + duracion);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, inicio);
    env.gain.exponentialRampToValueAtTime(vol, inicio + 0.015);
    env.gain.setValueAtTime(vol, inicio + duracion * 0.7);
    env.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
    if (vibrato) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 6;
      const profundidad = ctx.createGain();
      profundidad.gain.value = vibrato;
      lfo.connect(profundidad).connect(osc.frequency);
      lfo.start(inicio);
      lfo.stop(inicio + duracion);
    }
    osc.connect(env).connect(destino);
    osc.start(inicio);
    osc.stop(inicio + duracion + 0.05);
  }

  /** Nota "de bronce": cuadrada + triangular superpuestas. */
  function metal(frecuencia, inicio, duracion, vibrato = 0) {
    nota(frecuencia, inicio, duracion, { tipo: 'square', vol: 0.06, vibrato });
    nota(frecuencia, inicio, duracion, { tipo: 'triangle', vol: 0.16, vibrato });
  }

  const N = { C4: 261.63, G4: 392, A4: 440, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G6: 1568 };

  const sonidos = {
    /** Tic de cada segundo de la cuenta regresiva. */
    tic() {
      nota(1000, ctx.currentTime, 0.05, { tipo: 'triangle', vol: 0.08 });
    },
    /** Pitido de los últimos 5 segundos (más agudo al final). */
    pitido(segundo) {
      nota(segundo <= 1 ? 1320 : 880, ctx.currentTime, 0.14, { tipo: 'square', vol: 0.1 });
    },
    /** Se terminó el tiempo. */
    tiempo() {
      const t = ctx.currentTime;
      nota(330, t, 0.5, { tipo: 'sawtooth', vol: 0.12, hasta: 220 });
    },
    /** Alguien respondió / tocó un botón. */
    pop() {
      nota(660, ctx.currentTime, 0.08, { tipo: 'sine', vol: 0.18, hasta: 990 });
    },
    /** Alguien entró a la sala. */
    entrada() {
      const t = ctx.currentTime;
      nota(N.E5, t, 0.09, { tipo: 'triangle', vol: 0.14 });
      nota(N.A5, t + 0.08, 0.14, { tipo: 'triangle', vol: 0.14 });
    },
    /** Aparece una pregunta. */
    pregunta() {
      const t = ctx.currentTime;
      [N.C5, N.E5, N.G5].forEach((f, i) => nota(f, t + i * 0.07, 0.12, { tipo: 'triangle', vol: 0.12 }));
    },
    /** Se revela la respuesta correcta. */
    revelar() {
      const t = ctx.currentTime;
      metal(N.G5, t, 0.12);
      metal(N.C6, t + 0.12, 0.5, 4);
    },
    correcto() {
      const t = ctx.currentTime;
      metal(N.C5, t, 0.1);
      metal(N.E5, t + 0.1, 0.1);
      metal(N.G5, t + 0.2, 0.35, 4);
    },
    incorrecto() {
      const t = ctx.currentTime;
      nota(N.G4, t, 0.18, { tipo: 'sawtooth', vol: 0.1 });
      nota(N.C4 * 1.5, t + 0.2, 0.35, { tipo: 'sawtooth', vol: 0.1, hasta: N.C4 });
    },
    /** Fanfarria final de ganadores. */
    fanfarria() {
      const t = ctx.currentTime + 0.05;
      const paso = 0.13;
      [N.G4, N.C5, N.E5, N.G5].forEach((f, i) => metal(f, t + i * paso, 0.18));
      metal(N.E5, t + 4 * paso, 0.12);
      metal(N.G5, t + 5 * paso, 0.12);
      [N.C5, N.E5, N.G5, N.C6].forEach((f) => metal(f, t + 6 * paso, 1.4, 5));
      const t2 = t + 6 * paso + 1.2;
      [N.C6, N.E6, N.G6].forEach((f, i) => metal(f, t2 + i * 0.09, 0.14));
      [N.C5, N.G5, N.C6, N.E6].forEach((f) => metal(f, t2 + 0.3, 1.6, 6));
    },
  };

  /** Reproduce un sonido por nombre (si el audio está habilitado y no está en silencio). */
  function tocar(nombre, ...args) {
    if (!disponible() || !sonidos[nombre]) return;
    try { sonidos[nombre](...args); } catch (e) { /* el sonido nunca debe frenar el juego */ }
  }

  function alternarMudo() {
    mudo = !mudo;
    return mudo;
  }

  return { activar, activo, tocar, alternarMudo };
}
