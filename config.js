/* =========================================================
   TRIVIA DEL CUMPLE — configuración
   ========================================================= */
'use strict';

// ✏️ Título que se ve en la TV y en los celulares.
const TITULO = '¡Trivia del Cumple!';

// Máximo de jugadores por sala.
const MAX_JUGADORES = 20;

// ✏️ Subtítulos en japonés debajo de cada pregunta y respuesta (en la TV).
//    Poné false para mostrar solo el español.
const MOSTRAR_JAPONES = true;

// ✏️ Preguntas por partida: se eligen al azar entre todas las de preguntas.js.
const PREGUNTAS_POR_PARTIDA = 20;

/*
  ✏️ Puntos finales (podio, tabla final y celulares): los puntos de la trivia
  se dividen por este número y se redondean, para que queden en la misma
  escala que la ruleta. Con 1000: 1.800 → 2, 3.400 → 3, 500 → 1.
  Con 20 preguntas el máximo es 20; si querés que el máximo sea 10, poné 2000.
*/
const PUNTOS_TRIVIA_POR_PUNTO = 1000;

/*
  ✏️ PEGÁ ACÁ LA CONFIGURACIÓN DE TU PROYECTO DE FIREBASE
  (ver guia_firebase.md, paso 4). Firebase te da un bloque igual a este:
  copiá los valores y reemplazá los "PEGAR_AQUI".
  Estas claves NO son secretas: identifican tu proyecto, y lo que protege
  los datos son las reglas de seguridad (database.rules.json).
*/
const firebaseConfig = {
  apiKey: 'AIzaSyDkkKBUIJxPnQtRXj8Xtz-cwLia4XhBVbM',
  authDomain: 'trivia-cumple-d0aa9.firebaseapp.com',
  databaseURL: 'https://trivia-cumple-d0aa9-default-rtdb.firebaseio.com',
  projectId: 'trivia-cumple-d0aa9',
  storageBucket: 'trivia-cumple-d0aa9.firebasestorage.app',
  messagingSenderId: '675926581432',
  appId: '1:675926581432:web:f3eeaddc3d0d4920edd44d',
};

// Dirección publicada. Si la TV se abre en local (localhost o el archivo),
// el QR igual manda a los celulares acá, porque no pueden abrir la compu.
const URL_PUBLICA = 'https://rodfox31.github.io/preguntas-cumple/';
