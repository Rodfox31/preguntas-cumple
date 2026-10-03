/* =========================================================
   TRIVIA DEL CUMPLE — preguntas

   ✏️ EDITÁ ACÁ LAS PREGUNTAS
   - id:       número único (no se muestra).
   - pregunta: el texto que se ve en grande en la TV.
   - opciones: de 2 a 4 respuestas. El orden define el color y la forma:
               1ª 🔺 roja · 2ª 🔷 azul · 3ª 🟡 amarilla · 4ª 🟩 verde.
   - correcta: posición de la respuesta correcta, contando desde 0
               (0 = la primera, 1 = la segunda, 2 = la tercera, 3 = la cuarta).
   - tiempo:   segundos para responder.

   Ojo: este archivo es público en la web; un invitado muy curioso podría
   leer las respuestas. Para un cumple alcanza.
   ========================================================= */
'use strict';

const PREGUNTAS = [
  {
    id: 1,
    pregunta: '¿Cuál es el planeta más grande del sistema solar?',
    opciones: ['Marte', 'Júpiter', 'Saturno', 'Neptuno'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 2,
    pregunta: '¿Cuál es la capital de Australia?',
    opciones: ['Sídney', 'Melbourne', 'Perth', 'Canberra'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 3,
    pregunta: '¿Cuántas patas tiene una araña?',
    opciones: ['8', '6', '10', '12'],
    correcta: 0,
    tiempo: 15,
  },
  {
    id: 4,
    pregunta: '¿En qué país están las pirámides de Guiza?',
    opciones: ['México', 'Perú', 'Egipto', 'India'],
    correcta: 2,
    tiempo: 15,
  },
  {
    id: 5,
    pregunta: '¿Cuál es el océano más grande del mundo?',
    opciones: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 6,
    pregunta: '¿Qué gas toman las plantas del aire para hacer la fotosíntesis?',
    opciones: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Helio'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 7,
    pregunta: '¿Quién pintó la Mona Lisa?',
    opciones: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Miguel Ángel'],
    correcta: 2,
    tiempo: 15,
  },
  {
    id: 8,
    pregunta: '¿Cuál es el hueso más largo del cuerpo humano?',
    opciones: ['Fémur', 'Húmero', 'Tibia', 'Peroné'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 9,
    pregunta: '¿En qué año llegó el ser humano a la Luna por primera vez?',
    opciones: ['1965', '1967', '1969', '1972'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 10,
    pregunta: '¿Qué idioma se habla oficialmente en Brasil?',
    opciones: ['Español', 'Portugués', 'Brasileño', 'Inglés'],
    correcta: 1,
    tiempo: 15,
  },
];
