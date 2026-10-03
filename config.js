/* =========================================================
   TRIVIA DEL CUMPLE — configuración
   ========================================================= */
'use strict';

// ✏️ Título que se ve en la TV y en los celulares.
const TITULO = '¡Trivia del Cumple!';

// Máximo de jugadores por sala.
const MAX_JUGADORES = 20;

/*
  ✏️ PEGÁ ACÁ LA CONFIGURACIÓN DE TU PROYECTO DE FIREBASE
  (ver guia_firebase.md, paso 4). Firebase te da un bloque igual a este:
  copiá los valores y reemplazá los "PEGAR_AQUI".
  Estas claves NO son secretas: identifican tu proyecto, y lo que protege
  los datos son las reglas de seguridad (database.rules.json).
*/
const firebaseConfig = {
  apiKey: 'PEGAR_AQUI',
  authDomain: 'PEGAR_AQUI.firebaseapp.com',
  databaseURL: 'https://PEGAR_AQUI-default-rtdb.firebaseio.com',
  projectId: 'PEGAR_AQUI',
  storageBucket: 'PEGAR_AQUI.appspot.com',
  messagingSenderId: 'PEGAR_AQUI',
  appId: 'PEGAR_AQUI',
};

// Dirección publicada. Si la TV se abre en local (localhost o el archivo),
// el QR igual manda a los celulares acá, porque no pueden abrir la compu.
const URL_PUBLICA = 'https://rodfox31.github.io/preguntas-cumple/';
