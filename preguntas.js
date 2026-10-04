/* =========================================================
   TRIVIA DEL CUMPLE — preguntas sobre Japón, nivel intermedio
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
    pregunta: '¿Qué compositor japonés hizo la música de casi todas las películas de Hayao Miyazaki?',
    preguntaJa: '宮崎駿監督のほとんどの映画で音楽を担当した作曲家は？',
    opciones: ['Ryuichi Sakamoto', 'Joe Hisaishi', 'Koji Kondo', 'Yoko Kanno'],
    opcionesJa: ['坂本龍一', '久石譲', '近藤浩治', '菅野よう子'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 2,
    pregunta: '¿Qué músico japonés ganó un Oscar por la banda sonora de "El último emperador" (1987)?',
    preguntaJa: '映画『ラストエンペラー』（1987年）の音楽でアカデミー賞を受賞した日本人は？',
    opciones: ['Joe Hisaishi', 'Toru Takemitsu', 'Ryuichi Sakamoto', 'Kitaro'],
    opcionesJa: ['久石譲', '武満徹', '坂本龍一', '喜多郎'],
    correcta: 2,
    tiempo: 25,
  },
  {
    id: 3,
    pregunta: '¿Cómo se llama la cantante virtual japonesa de pelo turquesa con dos colitas?',
    preguntaJa: 'ターコイズ色のツインテールが特徴の、日本のバーチャルシンガーは？',
    opciones: ['Kizuna AI', 'Kyary Pamyu Pamyu', 'Utada Hikaru', 'Hatsune Miku'],
    opcionesJa: ['キズナアイ', 'きゃりーぱみゅぱみゅ', '宇多田ヒカル', '初音ミク'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 4,
    pregunta: '¿Qué canción japonesa llegó al número 1 en Estados Unidos en 1963?',
    preguntaJa: '1963年にアメリカのビルボードで1位になった日本の歌は？',
    opciones: ['Sukiyaki', 'Sakura Sakura', 'Tsunami', 'Lemon'],
    opcionesJa: ['上を向いて歩こう（SUKIYAKI）', 'さくらさくら', 'TSUNAMI', 'Lemon'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 5,
    pregunta: '¿Qué instrumento japonés de cuerdas, largo, se toca apoyado en el piso?',
    preguntaJa: '床に置いて演奏する、長い胴をもつ日本の伝統的な弦楽器は？',
    opciones: ['Shamisen', 'Koto', 'Shakuhachi', 'Taiko'],
    opcionesJa: ['三味線', '箏（こと）', '尺八', '太鼓'],
    correcta: 1,
    tiempo: 20,
  },

  // ---------- Cine y animación ----------
  {
    id: 6,
    pregunta: '¿Quién dirigió "Los siete samuráis" (1954)?',
    preguntaJa: '映画『七人の侍』（1954年）の監督は？',
    opciones: ['Yasujirō Ozu', 'Hayao Miyazaki', 'Akira Kurosawa', 'Takeshi Kitano'],
    opcionesJa: ['小津安二郎', '宮崎駿', '黒澤明', '北野武'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 7,
    pregunta: '¿Qué monstruo gigante japonés apareció por primera vez en el cine en 1954?',
    preguntaJa: '1954年に初めて映画に登場した日本の怪獣は？',
    opciones: ['Mothra', 'Gamera', 'King Ghidorah', 'Godzilla'],
    opcionesJa: ['モスラ', 'ガメラ', 'キングギドラ', 'ゴジラ'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 8,
    pregunta: '¿Qué película japonesa ganó el Oscar a mejor película extranjera en 2009?',
    preguntaJa: '2009年にアカデミー外国語映画賞を受賞した日本映画は？',
    opciones: ['Okuribito (Departures)', 'Shoplifters', 'Drive My Car', 'Tampopo'],
    opcionesJa: ['おくりびと', '万引き家族', 'ドライブ・マイ・カー', 'タンポポ'],
    correcta: 0,
    tiempo: 25,
  },
  {
    id: 9,
    pregunta: 'En "El viaje de Chihiro", ¿en qué se convierten los padres de Chihiro?',
    preguntaJa: '『千と千尋の神隠し』で、千尋の両親は何に変えられてしまう？',
    opciones: ['En ranas', 'En cerdos', 'En dragones', 'En gatos'],
    opcionesJa: ['カエル', 'ブタ', '竜', '猫'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 10,
    pregunta: '¿Quién creó el manga "Dragon Ball"?',
    preguntaJa: '『ドラゴンボール』の作者は？',
    opciones: ['Eiichiro Oda', 'Masashi Kishimoto', 'Akira Toriyama', 'Osamu Tezuka'],
    opcionesJa: ['尾田栄一郎', '岸本斉史', '鳥山明', '手塚治虫'],
    correcta: 2,
    tiempo: 20,
  },

  // ---------- Deportes ----------
  {
    id: 11,
    pregunta: '¿En qué año Tokio organizó por primera vez los Juegos Olímpicos de verano?',
    preguntaJa: '東京で初めて夏季オリンピックが開かれたのは何年？',
    opciones: ['1948', '1972', '1988', '1964'],
    opcionesJa: ['1948年', '1972年', '1988年', '1964年'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 12,
    pregunta: '¿Cómo se llama el rango más alto de un luchador de sumo?',
    preguntaJa: '大相撲で一番上の位は？',
    opciones: ['Yokozuna', 'Ozeki', 'Sekiwake', 'Komusubi'],
    opcionesJa: ['横綱', '大関', '関脇', '小結'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 13,
    pregunta: '¿Qué beisbolista japonés es lanzador y bateador a la vez y juega en Los Angeles Dodgers?',
    preguntaJa: '投手と打者の「二刀流」で活躍し、ドジャースでプレーする日本人選手は？',
    opciones: ['Ichiro Suzuki', 'Shohei Ohtani', 'Hideki Matsui', 'Yu Darvish'],
    opcionesJa: ['イチロー', '大谷翔平', '松井秀喜', 'ダルビッシュ有'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 14,
    pregunta: '¿Qué tenista japonesa fue la primera de Asia en llegar al número 1 del mundo?',
    preguntaJa: 'アジア出身の選手として初めて世界ランキング1位になった日本の女子テニス選手は？',
    opciones: ['Kimiko Date', 'Ai Sugiyama', 'Naomi Osaka', 'Misaki Doi'],
    opcionesJa: ['伊達公子', '杉山愛', '大坂なおみ', '土居美咲'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 15,
    pregunta: 'En el Mundial 2022, ¿a qué dos campeones del mundo le ganó Japón en la fase de grupos?',
    preguntaJa: '2022年サッカーW杯のグループリーグで、日本が勝った「優勝経験国」の2チームは？',
    opciones: ['Brasil y Francia', 'Argentina e Italia', 'Inglaterra y Uruguay', 'Alemania y España'],
    opcionesJa: ['ブラジルとフランス', 'アルゼンチンとイタリア', 'イングランドとウルグアイ', 'ドイツとスペイン'],
    correcta: 3,
    tiempo: 25,
  },

  // ---------- Cultura general ----------
  {
    id: 16,
    pregunta: '¿Cómo se llama el poema japonés de tres versos de 5, 7 y 5 sílabas?',
    preguntaJa: '5・7・5の三つの句でできた、日本の短い詩は？',
    opciones: ['Haiku', 'Tanka', 'Kabuki', 'Ikebana'],
    opcionesJa: ['俳句', '短歌', '歌舞伎', '生け花'],
    correcta: 0,
    tiempo: 20,
  },
  {
    id: 17,
    pregunta: '¿Cómo se llama la ceremonia tradicional japonesa del té?',
    preguntaJa: '抹茶を点ててお客さんをもてなす、日本の伝統文化は？',
    opciones: ['Ikebana', 'Sadō', 'Shodō', 'Kendō'],
    opcionesJa: ['生け花', '茶道', '書道', '剣道'],
    correcta: 1,
    tiempo: 20,
  },
  {
    id: 18,
    pregunta: '¿Cuántos caracteres tiene el silabario hiragana básico?',
    preguntaJa: '基本のひらがな（五十音）は全部で何文字？',
    opciones: ['26', '72', '46', '100'],
    opcionesJa: ['26文字', '72文字', '46文字', '100文字'],
    correcta: 2,
    tiempo: 20,
  },
  {
    id: 19,
    pregunta: '¿Qué ciudad japonesa es famosa por sus ciervos que andan sueltos y hacen reverencias?',
    preguntaJa: 'シカが街を自由に歩き、おじぎをすることで有名な街は？',
    opciones: ['Kioto', 'Osaka', 'Kobe', 'Nara'],
    opcionesJa: ['京都', '大阪', '神戸', '奈良'],
    correcta: 3,
    tiempo: 20,
  },
  {
    id: 20,
    pregunta: '¿Qué significa "Nihon" (o "Nippon"), el nombre de Japón en japonés?',
    preguntaJa: '「日本（にほん・にっぽん）」という国名の意味は？',
    opciones: ['Origen del sol', 'Tierra de montañas', 'Isla del este', 'Reino del mar'],
    opcionesJa: ['日の本（太陽の昇るところ）', '山の国', '東の島', '海の王国'],
    correcta: 0,
    tiempo: 20,
  },
];
