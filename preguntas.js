/* =========================================================
   TRIVIA DEL CUMPLE — preguntas de cultura general, nivel intermedio
   (música, cine, deportes y cultura general, con subtítulos en japonés)

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
  // ---------- Música ----------
  {
    id: 1,
    pregunta: '¿Quién compuso "Las cuatro estaciones"?',
    preguntaJa: '『四季』を作曲したのは誰？',
    opciones: ['Mozart', 'Bach', 'Beethoven', 'Vivaldi'],
    opcionesJa: ['モーツァルト', 'バッハ', 'ベートーヴェン', 'ヴィヴァルディ'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 2,
    pregunta: '¿Cuántas sinfonías completó Beethoven?',
    preguntaJa: 'ベートーヴェンが完成させた交響曲はいくつ？',
    opciones: ['9', '5', '7', '12'],
    opcionesJa: ['9曲', '5曲', '7曲', '12曲'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 3,
    pregunta: '¿Qué cantante es conocido como "el Rey del Pop"?',
    preguntaJa: '「キング・オブ・ポップ」と呼ばれる歌手は？',
    opciones: ['Elvis Presley', 'Michael Jackson', 'Prince', 'Freddie Mercury'],
    opcionesJa: ['エルヴィス・プレスリー', 'マイケル・ジャクソン', 'プリンス', 'フレディ・マーキュリー'],
    correcta: 1,
    tiempo: 15,
  },
  {
    id: 4,
    pregunta: '¿Qué banda argentina grabó "De música ligera"?',
    preguntaJa: '「De música ligera」を歌ったアルゼンチンのバンドは？',
    opciones: ['Los Redondos', 'Sumo', 'Soda Stereo', 'Los Fabulosos Cadillacs'],
    opcionesJa: ['ロス・レドンドス', 'スモ', 'ソーダ・ステレオ', 'ファブロソス・キャディラックス'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 5,
    pregunta: '¿Qué instrumento tocaba Astor Piazzolla?',
    preguntaJa: 'アストル・ピアソラが演奏した楽器は？',
    opciones: ['Guitarra', 'Piano', 'Violín', 'Bandoneón'],
    opcionesJa: ['ギター', 'ピアノ', 'バイオリン', 'バンドネオン'],
    correcta: 3,
    tiempo: 20,
  },

  // ---------- Cine ----------
  {
    id: 6,
    pregunta: '¿Cuál de estas películas ganó 11 premios Oscar?',
    preguntaJa: 'この中で、アカデミー賞を11部門受賞した映画は？',
    opciones: ['Titanic', 'Avatar', 'Forrest Gump', 'Gladiador'],
    opcionesJa: ['タイタニック', 'アバター', 'フォレスト・ガンプ／一期一会', 'グラディエーター'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 7,
    pregunta: '¿Quién dirigió "Pulp Fiction"?',
    preguntaJa: '『パルプ・フィクション』の監督は？',
    opciones: ['Martin Scorsese', 'Quentin Tarantino', 'Christopher Nolan', 'David Fincher'],
    opcionesJa: ['マーティン・スコセッシ', 'クエンティン・タランティーノ', 'クリストファー・ノーラン', 'デヴィッド・フィンチャー'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 8,
    pregunta: 'En "El Señor de los Anillos", ¿qué hobbit lleva el Anillo hasta Mordor?',
    preguntaJa: '『ロード・オブ・ザ・リング』で、指輪をモルドールまで運ぶホビットは？',
    opciones: ['Bilbo', 'Sam', 'Frodo', 'Pippin'],
    opcionesJa: ['ビルボ', 'サム', 'フロド', 'ピピン'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 9,
    pregunta: '¿Qué película de Damián Szifron cuenta seis historias de venganza?',
    preguntaJa: 'ダミアン・ジフロン監督の、6つの復讐の物語からなるアルゼンチン映画は？',
    opciones: ['Nueve reinas', 'El clan', 'Esperando la carroza', 'Relatos salvajes'],
    opcionesJa: ['ナイン・クイーンズ', 'エル・クラン', 'エスペランド・ラ・カローサ', '人生スイッチ'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 10,
    pregunta: '¿Cuál fue el primer largometraje animado de Disney?',
    preguntaJa: 'ディズニー初の長編アニメーション映画は？',
    opciones: ['Blancanieves', 'Pinocho', 'Fantasía', 'Dumbo'],
    opcionesJa: ['白雪姫', 'ピノキオ', 'ファンタジア', 'ダンボ'],
    correcta: 0,
    tiempo: 20,
  },

  // ---------- Deportes ----------
  {
    id: 11,
    pregunta: '¿Cuántos jugadores tiene en la cancha un equipo de rugby?',
    preguntaJa: 'ラグビーユニオンで、1チームがフィールドに出る人数は？',
    opciones: ['11', '15', '13', '18'],
    opcionesJa: ['11人', '15人', '13人', '18人'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 12,
    pregunta: '¿En qué país se inventó el básquet?',
    preguntaJa: 'バスケットボールが考案された国は？',
    opciones: ['Canadá', 'Inglaterra', 'Estados Unidos', 'Francia'],
    opcionesJa: ['カナダ', 'イギリス', 'アメリカ', 'フランス'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 13,
    pregunta: '¿Qué país ganó el primer Mundial de fútbol, en 1930?',
    preguntaJa: '1930年の第1回サッカーW杯で優勝した国は？',
    opciones: ['Argentina', 'Brasil', 'Italia', 'Uruguay'],
    opcionesJa: ['アルゼンチン', 'ブラジル', 'イタリア', 'ウルグアイ'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 14,
    pregunta: '¿Quién ganó más medallas olímpicas en la historia?',
    preguntaJa: 'オリンピックで史上最も多くのメダルを獲得した選手は？',
    opciones: ['Michael Phelps', 'Usain Bolt', 'Carl Lewis', 'Simone Biles'],
    opcionesJa: ['マイケル・フェルプス', 'ウサイン・ボルト', 'カール・ルイス', 'シモーネ・バイルズ'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 15,
    pregunta: '¿Cuánto mide una maratón?',
    preguntaJa: 'フルマラソンの距離は？',
    opciones: ['40 km', '42,195 km', '21,097 km', '50 km'],
    opcionesJa: ['40km', '42.195km', '21.0975km', '50km'],
    correcta: 1,
    tiempo: 20,
  },

  // ---------- Cultura general ----------
  {
    id: 16,
    pregunta: '¿Cuál es el elemento químico más abundante del universo?',
    preguntaJa: '宇宙で一番多い元素は？',
    opciones: ['Oxígeno', 'Helio', 'Hidrógeno', 'Carbono'],
    opcionesJa: ['酸素', 'ヘリウム', '水素', '炭素'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 17,
    pregunta: '¿Quién escribió "Cien años de soledad"?',
    preguntaJa: '『百年の孤独』を書いたのは誰？',
    opciones: ['Mario Vargas Llosa', 'Julio Cortázar', 'Pablo Neruda', 'Gabriel García Márquez'],
    opcionesJa: ['マリオ・バルガス・リョサ', 'フリオ・コルタサル', 'パブロ・ネルーダ', 'ガブリエル・ガルシア＝マルケス'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 18,
    pregunta: '¿Cuál es la capital de Nueva Zelanda?',
    preguntaJa: 'ニュージーランドの首都は？',
    opciones: ['Wellington', 'Auckland', 'Christchurch', 'Queenstown'],
    opcionesJa: ['ウェリントン', 'オークランド', 'クライストチャーチ', 'クイーンズタウン'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 19,
    pregunta: '¿Cuál es el país con más habitantes del mundo?',
    preguntaJa: '人口が世界で一番多い国は？',
    opciones: ['China', 'India', 'Estados Unidos', 'Indonesia'],
    opcionesJa: ['中国', 'インド', 'アメリカ', 'インドネシア'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 20,
    pregunta: '¿Quién pintó el techo de la Capilla Sixtina?',
    preguntaJa: 'システィーナ礼拝堂の天井画を描いたのは誰？',
    opciones: ['Rafael', 'Leonardo da Vinci', 'Miguel Ángel', 'Botticelli'],
    opcionesJa: ['ラファエロ', 'レオナルド・ダ・ヴィンチ', 'ミケランジェロ', 'ボッティチェリ'],
    correcta: 2,
    tiempo: 20,
  },
];
