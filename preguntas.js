/* =========================================================
   TRIVIA DEL CUMPLE — preguntas sobre Japón (con subtítulos en japonés)

   ✏️ EDITÁ ACÁ LAS PREGUNTAS
   En cada partida se eligen al azar PREGUNTAS_POR_PARTIDA (config.js)
   de esta lista, y no se repiten entre partidas hasta que salieron todas.
   Con 20 preguntas y 20 por partida, salen todas en cada partida, en
   orden distinto.

   - id:         número único (sirve para no repetir preguntas entre partidas).
   - pregunta:   el texto que se ve en grande en la TV.
   - preguntaJa: subtítulo en japonés de la pregunta (opcional).
   - opciones:   de 2 a 4 respuestas. El orden define el color y la forma:
                 1ª 🔺 roja · 2ª 🔷 azul · 3ª 🟡 amarilla · 4ª 🟩 verde.
   - opcionesJa: subtítulos en japonés, en el mismo orden que "opciones" (opcional).
   - correcta:   posición de la respuesta correcta, contando desde 0
                 (0 = la primera, 1 = la segunda, 2 = la tercera, 3 = la cuarta).
   - tiempo:     segundos para responder.

   Los subtítulos se prenden o apagan con MOSTRAR_JAPONES en config.js.

   Ojo: este archivo es público en la web; un invitado muy curioso podría
   leer las respuestas. Para un cumple alcanza.
   ========================================================= */
'use strict';

const PREGUNTAS = [
  // ---------- Geografía ----------
  {
    id: 1,
    pregunta: '¿Cuál es la capital de Japón?',
    preguntaJa: '日本の首都は？',
    opciones: ['Kioto', 'Osaka', 'Tokio', 'Hiroshima'],
    opcionesJa: ['京都', '大阪', '東京', '広島'],
    correcta: 2,
    tiempo: 15,
  },
  {
    id: 2,
    pregunta: '¿Cuál es la montaña más alta de Japón?',
    preguntaJa: '日本で一番高い山は？',
    opciones: ['Monte Aso', 'Monte Fuji', 'Monte Takao', 'Monte Kita'],
    opcionesJa: ['阿蘇山', '富士山', '高尾山', '北岳'],
    correcta: 1,
    tiempo: 15,
  },
  {
    id: 3,
    pregunta: '¿Qué océano está al este de Japón?',
    preguntaJa: '日本の東側に広がる海は？',
    opciones: ['Atlántico', 'Pacífico', 'Índico', 'Ártico'],
    opcionesJa: ['大西洋', '太平洋', 'インド洋', '北極海'],
    correcta: 1,
    tiempo: 15,
  },
  {
    id: 4,
    pregunta: '¿Qué ciudad fue la capital de Japón durante más de mil años?',
    preguntaJa: '千年以上にわたって日本の都だった街は？',
    opciones: ['Kioto', 'Osaka', 'Sapporo', 'Nagoya'],
    opcionesJa: ['京都', '大阪', '札幌', '名古屋'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 5,
    pregunta: '¿Cuál es la moneda de Japón?',
    preguntaJa: '日本のお金の単位は？',
    opciones: ['Yuan', 'Won', 'Dólar', 'Yen'],
    opcionesJa: ['元', 'ウォン', 'ドル', '円'],
    correcta: 3,
    tiempo: 15,
  },
  {
    id: 6,
    pregunta: '¿Qué hay dibujado en la bandera de Japón?',
    preguntaJa: '日本の国旗に描かれているのは？',
    opciones: ['Un círculo rojo', 'Una estrella', 'Una luna', 'Una flor'],
    opcionesJa: ['赤い丸', '星', '月', '花'],
    correcta: 0,
    tiempo: 15,
  },

  // ---------- Idioma y costumbres ----------
  {
    id: 7,
    pregunta: '¿Cómo se dice "gracias" en japonés?',
    preguntaJa: 'スペイン語の「Gracias」は日本語で何と言う？',
    opciones: ['Konnichiwa', 'Arigatou', 'Sayonara', 'Sumimasen'],
    opcionesJa: ['こんにちは', 'ありがとう', 'さようなら', 'すみません'],
    correcta: 1,
    tiempo: 15,
  },
  {
    id: 8,
    pregunta: '¿Qué se dice en Japón antes de comer?',
    preguntaJa: '日本で、食事の前に言うあいさつは？',
    opciones: ['Oyasumi', 'Gochisousama', 'Itadakimasu', 'Ittekimasu'],
    opcionesJa: ['おやすみ', 'ごちそうさま', 'いただきます', 'いってきます'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 9,
    pregunta: '¿Con qué se come tradicionalmente en Japón?',
    preguntaJa: '日本で伝統的にごはんを食べるときに使うのは？',
    opciones: ['Tenedor', 'Cuchara', 'Con las manos', 'Palitos'],
    opcionesJa: ['フォーク', 'スプーン', '手', '箸'],
    correcta: 3,
    tiempo: 15,
  },
  {
    id: 10,
    pregunta: '¿Cómo se llama la ropa tradicional japonesa?',
    preguntaJa: '日本の伝統的な服は？',
    opciones: ['Sari', 'Poncho', 'Kimono', 'Kilt'],
    opcionesJa: ['サリー', 'ポンチョ', '着物', 'キルト'],
    correcta: 2,
    tiempo: 15,
  },
  {
    id: 11,
    pregunta: '¿Qué flor es el símbolo de la primavera en Japón?',
    preguntaJa: '日本の春のシンボルの花は？',
    opciones: ['Rosa', 'Flor de cerezo', 'Girasol', 'Tulipán'],
    opcionesJa: ['バラ', '桜', 'ヒマワリ', 'チューリップ'],
    correcta: 1,
    tiempo: 15,
  },

  // ---------- Comida ----------
  {
    id: 12,
    pregunta: '¿Qué comida japonesa se hace con arroz y pescado crudo?',
    preguntaJa: 'ごはんと生の魚で作る日本料理は？',
    opciones: ['Sushi', 'Ramen', 'Tempura', 'Okonomiyaki'],
    opcionesJa: ['寿司', 'ラーメン', '天ぷら', 'お好み焼き'],
    correcta: 0,
    tiempo: 15,
  },

  // ---------- Deportes, inventos y tradiciones ----------
  {
    id: 13,
    pregunta: '¿Cómo se llama el tren bala de Japón?',
    preguntaJa: '日本の高速鉄道の名前は？',
    opciones: ['TGV', 'AVE', 'Shinkansen', 'Eurostar'],
    opcionesJa: ['TGV', 'AVE', '新幹線', 'ユーロスター'],
    correcta: 2,
    tiempo: 15,
  },
  {
    id: 14,
    pregunta: '¿Qué deporte tradicional japonés practican luchadores muy grandes?',
    preguntaJa: '体の大きな選手が戦う、日本の伝統的なスポーツは？',
    opciones: ['Judo', 'Karate', 'Kendo', 'Sumo'],
    opcionesJa: ['柔道', '空手', '剣道', '相撲'],
    correcta: 3,
    tiempo: 15,
  },
  {
    id: 15,
    pregunta: '¿Cómo se llama el arte japonés de doblar papel para hacer figuras?',
    preguntaJa: '紙を折っていろいろな形を作る、日本の伝統は？',
    opciones: ['Ikebana', 'Bonsái', 'Karaoke', 'Origami'],
    opcionesJa: ['生け花', '盆栽', 'カラオケ', '折り紙'],
    correcta: 3,
    tiempo: 15,
  },
  {
    id: 16,
    pregunta: '¿Qué invento japonés sirve para cantar sobre una pista de música?',
    preguntaJa: '音楽に合わせて歌う、日本生まれの楽しみは？',
    opciones: ['Karaoke', 'Walkman', 'Tamagotchi', 'Emoji'],
    opcionesJa: ['カラオケ', 'ウォークマン', 'たまごっち', '絵文字'],
    correcta: 0,
    tiempo: 15,
  },
  {
    id: 17,
    pregunta: '¿Cómo se llama el gato de la suerte que saluda con la patita en los negocios?',
    preguntaJa: 'お店に置かれる、手招きをする幸運の猫は？',
    opciones: ['Hello Kitty', 'Doraemon', 'Totoro', 'Maneki-neko'],
    opcionesJa: ['ハローキティ', 'ドラえもん', 'トトロ', '招き猫'],
    correcta: 3,
    tiempo: 20,
  },

  // ---------- Cultura pop ----------
  {
    id: 18,
    pregunta: '¿Qué empresa japonesa creó a Mario Bros?',
    preguntaJa: 'マリオを生んだ日本の会社は？',
    opciones: ['Nintendo', 'Sony', 'Sega', 'Toyota'],
    opcionesJa: ['任天堂', 'ソニー', 'セガ', 'トヨタ'],
    correcta: 0,
    tiempo: 15,
  },
  {
    id: 19,
    pregunta: 'En Pokémon, ¿cómo se llama el personaje amarillo que lanza electricidad?',
    preguntaJa: 'ポケモンで、黄色くて電気を出すキャラクターは？',
    opciones: ['Charmander', 'Pikachu', 'Bulbasaur', 'Squirtle'],
    opcionesJa: ['ヒトカゲ', 'ピカチュウ', 'フシギダネ', 'ゼニガメ'],
    correcta: 1,
    tiempo: 15,
  },
  {
    id: 20,
    pregunta: '¿Cómo se llaman los dibujos animados japoneses?',
    preguntaJa: '日本で作られる「絵が動く」テレビや映画の作品を何と呼ぶ？',
    opciones: ['Manga', 'Kabuki', 'Anime', 'Haiku'],
    opcionesJa: ['マンガ', '歌舞伎', 'アニメ', '俳句'],
    correcta: 2,
    tiempo: 15,
  },
];
