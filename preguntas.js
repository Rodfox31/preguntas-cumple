/* =========================================================
   TRIVIA DEL CUMPLE — preguntas

   ✏️ EDITÁ ACÁ LAS PREGUNTAS
   En cada partida se eligen al azar PREGUNTAS_POR_PARTIDA (config.js)
   de esta lista. Si se juega otra partida, se prefieren las que no
   salieron en la anterior.

   - id:       número único (sirve para no repetir preguntas entre partidas).
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
  // ---------- Ciencia y naturaleza ----------
  { id: 1, pregunta: '¿Cuál es el planeta más grande del sistema solar?', opciones: ['Marte', 'Júpiter', 'Saturno', 'Neptuno'], correcta: 1, tiempo: 20 },
  { id: 2, pregunta: '¿Cuál es el planeta más cercano al Sol?', opciones: ['Venus', 'Tierra', 'Marte', 'Mercurio'], correcta: 3, tiempo: 15 },
  { id: 3, pregunta: '¿Qué planeta es conocido como "el planeta rojo"?', opciones: ['Marte', 'Venus', 'Júpiter', 'Mercurio'], correcta: 0, tiempo: 15 },
  { id: 4, pregunta: '¿Cuántas patas tiene una araña?', opciones: ['6', '10', '8', '12'], correcta: 2, tiempo: 15 },
  { id: 5, pregunta: '¿Cuántos corazones tiene un pulpo?', opciones: ['1', '3', '2', '4'], correcta: 1, tiempo: 20 },
  { id: 6, pregunta: '¿Cuál es el animal más grande del planeta?', opciones: ['Elefante africano', 'Tiburón ballena', 'Jirafa', 'Ballena azul'], correcta: 3, tiempo: 15 },
  { id: 7, pregunta: '¿Qué ave pone los huevos más grandes?', opciones: ['Avestruz', 'Emú', 'Cóndor', 'Pingüino emperador'], correcta: 0, tiempo: 20 },
  { id: 8, pregunta: '¿Qué gas toman las plantas del aire para hacer la fotosíntesis?', opciones: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Helio'], correcta: 2, tiempo: 20 },
  { id: 9, pregunta: '¿Cuál es el gas más abundante en el aire que respiramos?', opciones: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Argón'], correcta: 1, tiempo: 20 },
  { id: 10, pregunta: '¿Qué metal tiene el símbolo químico "Au"?', opciones: ['Plata', 'Aluminio', 'Cobre', 'Oro'], correcta: 3, tiempo: 15 },
  { id: 11, pregunta: '¿Qué vitamina produce el cuerpo cuando le da el sol?', opciones: ['Vitamina D', 'Vitamina C', 'Vitamina A', 'Vitamina K'], correcta: 0, tiempo: 15 },

  // ---------- Cuerpo humano ----------
  { id: 12, pregunta: '¿Cuál es el hueso más largo del cuerpo humano?', opciones: ['Húmero', 'Fémur', 'Tibia', 'Peroné'], correcta: 1, tiempo: 20 },
  { id: 13, pregunta: '¿Cuántos huesos tiene el cuerpo de una persona adulta?', opciones: ['106', '306', '206', '406'], correcta: 2, tiempo: 20 },
  { id: 14, pregunta: '¿Cuál es el órgano más grande del cuerpo humano?', opciones: ['Hígado', 'Cerebro', 'Pulmones', 'Piel'], correcta: 3, tiempo: 20 },

  // ---------- Geografía ----------
  { id: 15, pregunta: '¿Cuál es la capital de Australia?', opciones: ['Sídney', 'Canberra', 'Melbourne', 'Perth'], correcta: 1, tiempo: 20 },
  { id: 16, pregunta: '¿Cuál es la capital de Canadá?', opciones: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], correcta: 0, tiempo: 20 },
  { id: 17, pregunta: '¿Cuál es la capital de Brasil?', opciones: ['Río de Janeiro', 'San Pablo', 'Brasilia', 'Salvador'], correcta: 2, tiempo: 15 },
  { id: 18, pregunta: '¿Cuál es el país más grande del mundo?', opciones: ['China', 'Estados Unidos', 'Canadá', 'Rusia'], correcta: 3, tiempo: 15 },
  { id: 19, pregunta: '¿Cuál es el océano más grande del mundo?', opciones: ['Atlántico', 'Pacífico', 'Índico', 'Ártico'], correcta: 1, tiempo: 20 },
  { id: 20, pregunta: '¿Cuál es la montaña más alta del mundo?', opciones: ['K2', 'Aconcagua', 'Everest', 'Kilimanjaro'], correcta: 2, tiempo: 15 },
  { id: 21, pregunta: '¿Cuál es la montaña más alta de América?', opciones: ['Aconcagua', 'Denali', 'Chimborazo', 'Huascarán'], correcta: 0, tiempo: 20 },
  { id: 22, pregunta: '¿Cuál es el río más largo de América del Sur?', opciones: ['Paraná', 'Orinoco', 'Río de la Plata', 'Amazonas'], correcta: 3, tiempo: 20 },
  { id: 23, pregunta: '¿Cuál es el desierto más seco del mundo (sin contar los polos)?', opciones: ['Sahara', 'Atacama', 'Gobi', 'Kalahari'], correcta: 1, tiempo: 20 },
  { id: 24, pregunta: '¿En qué continente está Kenia?', opciones: ['Asia', 'Oceanía', 'África', 'América'], correcta: 2, tiempo: 15 },
  { id: 25, pregunta: '¿En qué país están las pirámides de Guiza?', opciones: ['Egipto', 'México', 'Perú', 'India'], correcta: 0, tiempo: 15 },

  // ---------- Historia, arte y cultura ----------
  { id: 26, pregunta: '¿Quién pintó la Mona Lisa?', opciones: ['Pablo Picasso', 'Miguel Ángel', 'Vincent van Gogh', 'Leonardo da Vinci'], correcta: 3, tiempo: 15 },
  { id: 27, pregunta: '¿Quién pintó "La noche estrellada"?', opciones: ['Claude Monet', 'Vincent van Gogh', 'Salvador Dalí', 'Pablo Picasso'], correcta: 1, tiempo: 20 },
  { id: 28, pregunta: '¿Quién escribió "Don Quijote de la Mancha"?', opciones: ['Jorge Luis Borges', 'Gabriel García Márquez', 'Miguel de Cervantes', 'Lope de Vega'], correcta: 2, tiempo: 15 },
  { id: 29, pregunta: '¿En qué año llegó el ser humano a la Luna por primera vez?', opciones: ['1965', '1969', '1967', '1972'], correcta: 1, tiempo: 20 },
  { id: 30, pregunta: '¿En qué año cayó el Muro de Berlín?', opciones: ['1989', '1985', '1991', '1995'], correcta: 0, tiempo: 20 },
  { id: 31, pregunta: '¿Qué científico propuso la teoría de la relatividad?', opciones: ['Isaac Newton', 'Galileo Galilei', 'Nikola Tesla', 'Albert Einstein'], correcta: 3, tiempo: 15 },
  { id: 32, pregunta: '¿Qué banda grabó el disco "Abbey Road"?', opciones: ['The Rolling Stones', 'Queen', 'The Beatles', 'Pink Floyd'], correcta: 2, tiempo: 20 },
  { id: 33, pregunta: '¿Qué idioma se habla oficialmente en Brasil?', opciones: ['Español', 'Portugués', 'Brasileño', 'Inglés'], correcta: 1, tiempo: 15 },
  { id: 34, pregunta: '¿Cuál es el idioma con más hablantes nativos del mundo?', opciones: ['Chino mandarín', 'Inglés', 'Español', 'Hindi'], correcta: 0, tiempo: 20 },

  // ---------- Deportes y música ----------
  { id: 35, pregunta: '¿Qué selección ganó el Mundial de fútbol de 2022?', opciones: ['Francia', 'Brasil', 'Croacia', 'Argentina'], correcta: 3, tiempo: 15 },
  { id: 36, pregunta: '¿Cuántos jugadores tiene un equipo de vóley en la cancha?', opciones: ['5', '6', '7', '9'], correcta: 1, tiempo: 15 },
  { id: 37, pregunta: '¿Cuántas cuerdas tiene una guitarra criolla?', opciones: ['4', '5', '6', '7'], correcta: 2, tiempo: 15 },
  { id: 38, pregunta: '¿Cuántas teclas tiene un piano estándar?', opciones: ['88', '76', '96', '104'], correcta: 0, tiempo: 20 },

  // ---------- Curiosidades ----------
  { id: 39, pregunta: '¿De qué color es la "caja negra" de los aviones?', opciones: ['Negra', 'Roja', 'Naranja', 'Amarilla'], correcta: 2, tiempo: 20 },
  { id: 40, pregunta: '¿Qué fruta tiene las semillas por fuera?', opciones: ['Kiwi', 'Banana', 'Uva', 'Frutilla'], correcta: 3, tiempo: 15 },
];
