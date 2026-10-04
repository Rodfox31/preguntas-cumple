/* =========================================================
   TRIVIA DEL CUMPLE — preguntas de cultura general
   (música, cine, deportes y cultura general, con subtítulos en japonés)
   - id 1 a 20: nivel intermedio.
   - id 21 a 40: dificultad extrema.

   ✏️ EDITÁ ACÁ LAS PREGUNTAS
   En cada partida se eligen al azar PREGUNTAS_POR_PARTIDA (config.js)
   de esta lista, y no se repiten entre partidas hasta que salieron todas.
   Con 40 preguntas y 20 por partida: 2 partidas sin repetir.

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
  // =========================================================
  // NIVEL INTERMEDIO
  // =========================================================

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

  // =========================================================
  // DIFICULTAD EXTREMA
  // =========================================================

  // ---------- Música (extremo) ----------
  {
    id: 21,
    pregunta: '¿Cuál era el nombre real de Freddie Mercury?',
    preguntaJa: 'フレディ・マーキュリーの本名は？',
    opciones: ['Frederick Bulsara', 'Farid Mercurian', 'Frederick Bailey', 'Farrokh Bulsara'],
    opcionesJa: ['フレデリック・バルサラ', 'ファリド・マーキュリアン', 'フレデリック・ベイリー', 'ファルーク・バルサラ'],
    correcta: 3,
    tiempo: 25,
  },
  {
    id: 22,
    pregunta: 'En un piano estándar de 88 teclas, ¿cuántas teclas son negras?',
    preguntaJa: '88鍵の標準的なピアノで、黒鍵はいくつ？',
    opciones: ['36', '32', '40', '44'],
    opcionesJa: ['36個', '32個', '40個', '44個'],
    correcta: 0,
    tiempo: 25,
  },
  {
    id: 23,
    pregunta: '¿Cuál es el álbum más vendido de la historia en todo el mundo?',
    preguntaJa: '世界で最も売れたアルバムは？',
    opciones: ['Back in Black', 'The Dark Side of the Moon', 'Thriller', 'Abbey Road'],
    opcionesJa: ['バック・イン・ブラック', '狂気', 'スリラー', 'アビイ・ロード'],
    correcta: 2,
    tiempo: 25,
  },
  {
    id: 24,
    pregunta: '¿Qué tango compuso Carlos Gardel junto a Alfredo Le Pera?',
    preguntaJa: 'カルロス・ガルデルがアルフレド・レ・ペラと作ったタンゴは？',
    opciones: ['La cumparsita', 'Por una cabeza', 'Adiós Nonino', 'Caminito'],
    opcionesJa: ['ラ・クンパルシータ', 'ポル・ウナ・カベサ', 'アディオス・ノニーノ', 'カミニート'],
    correcta: 1,
    tiempo: 25,
  },
  {
    id: 25,
    pregunta: 'Según la numeración tradicional, ¿cuántas sinfonías compuso Mozart?',
    preguntaJa: '伝統的な番号付けで、モーツァルトの交響曲は第何番まである？',
    opciones: ['27', '35', '52', '41'],
    opcionesJa: ['第27番', '第35番', '第52番', '第41番'],
    correcta: 3,
    tiempo: 25,
  },

  // ---------- Cine (extremo) ----------
  {
    id: 26,
    pregunta: '¿Cuál fue la primera película en ganar el Oscar a Mejor Película?',
    preguntaJa: 'アカデミー作品賞を初めて受賞した映画は？',
    opciones: ['Amanecer (Sunrise)', 'El cantor de jazz', 'Alas (Wings)', 'Lo que el viento se llevó'],
    opcionesJa: ['サンライズ', 'ジャズ・シンガー', 'つばさ', '風と共に去りぬ'],
    correcta: 2,
    tiempo: 25,
  },
  {
    id: 27,
    pregunta: '¿Qué película ganó el primer Oscar a mejor película animada, en 2002?',
    preguntaJa: '2002年、初めてのアカデミー長編アニメ映画賞を受賞したのは？',
    opciones: ['Shrek', 'Monsters, Inc.', 'Jimmy Neutron', 'Lilo & Stitch'],
    opcionesJa: ['シュレック', 'モンスターズ・インク', 'ジミー・ニュートロン', 'リロ・アンド・スティッチ'],
    correcta: 0,
    tiempo: 25,
  },
  {
    id: 28,
    pregunta: 'En "El ciudadano Kane", ¿qué palabra está escrita en el trineo?',
    preguntaJa: '『市民ケーン』で、ソリに書かれている言葉は？',
    opciones: ['Xanadu', 'Rosebud', 'Charlie', 'Snowflake'],
    opcionesJa: ['ザナドゥ', 'ローズバッド', 'チャーリー', 'スノーフレーク'],
    correcta: 1,
    tiempo: 25,
  },
  {
    id: 29,
    pregunta: '¿Quién dirigió "El secreto de sus ojos", ganadora del Oscar?',
    preguntaJa: 'アカデミー賞を受賞した『瞳の奥の秘密』の監督は？',
    opciones: ['Damián Szifron', 'Lucrecia Martel', 'Fabián Bielinsky', 'Juan José Campanella'],
    opcionesJa: ['ダミアン・ジフロン', 'ルクレシア・マルテル', 'ファビアン・ビエリンスキー', 'フアン・ホセ・カンパネラ'],
    correcta: 3,
    tiempo: 25,
  },
  {
    id: 30,
    pregunta: '¿Cuántas veces ganó Alfred Hitchcock el Oscar a mejor director?',
    preguntaJa: 'アルフレッド・ヒッチコックがアカデミー監督賞を受賞した回数は？',
    opciones: ['Ninguna', 'Una', 'Dos', 'Tres'],
    opcionesJa: ['0回', '1回', '2回', '3回'],
    correcta: 0,
    tiempo: 25,
  },

  // ---------- Deportes (extremo) ----------
  {
    id: 31,
    pregunta: '¿Qué país ganó la primera Copa América, en 1916?',
    preguntaJa: '1916年の第1回コパ・アメリカで優勝した国は？',
    opciones: ['Argentina', 'Brasil', 'Uruguay', 'Chile'],
    opcionesJa: ['アルゼンチン', 'ブラジル', 'ウルグアイ', 'チリ'],
    correcta: 2,
    tiempo: 25,
  },
  {
    id: 32,
    pregunta: '¿A qué altura está el aro de básquet?',
    preguntaJa: 'バスケットボールのリングの高さは？',
    opciones: ['2,85 m', '3,05 m', '3,25 m', '3,50 m'],
    opcionesJa: ['2.85m', '3.05m', '3.25m', '3.50m'],
    correcta: 1,
    tiempo: 25,
  },
  {
    id: 33,
    pregunta: '¿Quién fue el goleador del Mundial 1978?',
    preguntaJa: '1978年W杯の得点王は？',
    opciones: ['Daniel Passarella', 'Leopoldo Luque', 'Rob Rensenbrink', 'Mario Kempes'],
    opcionesJa: ['ダニエル・パサレラ', 'レオポルド・ルーケ', 'ロブ・レンセンブリンク', 'マリオ・ケンペス'],
    correcta: 3,
    tiempo: 25,
  },
  {
    id: 34,
    pregunta: 'En el rugby, ¿cuántos puntos vale un try?',
    preguntaJa: 'ラグビーユニオンで、トライは何点？',
    opciones: ['3', '4', '5', '7'],
    opcionesJa: ['3点', '4点', '5点', '7点'],
    correcta: 2,
    tiempo: 25,
  },
  {
    id: 35,
    pregunta: '¿En qué año se jugó el primer partido internacional de fútbol (Escocia vs. Inglaterra)?',
    preguntaJa: 'サッカー初の国際試合（スコットランド対イングランド）が行われたのは何年？',
    opciones: ['1872', '1863', '1888', '1901'],
    opcionesJa: ['1872年', '1863年', '1888年', '1901年'],
    correcta: 0,
    tiempo: 25,
  },

  // ---------- Cultura general (extremo) ----------
  {
    id: 36,
    pregunta: '¿Cuál es el hueso más pequeño del cuerpo humano?',
    preguntaJa: '人体で一番小さい骨は？',
    opciones: ['Martillo', 'Estribo', 'Yunque', 'Falange'],
    opcionesJa: ['ツチ骨', 'アブミ骨', 'キヌタ骨', '指骨'],
    correcta: 1,
    tiempo: 25,
  },
  {
    id: 37,
    pregunta: '¿Cuál es la capital de Kazajistán?',
    preguntaJa: 'カザフスタンの首都は？',
    opciones: ['Almaty', 'Bishkek', 'Astaná', 'Taskent'],
    opcionesJa: ['アルマトイ', 'ビシュケク', 'アスタナ', 'タシケント'],
    correcta: 2,
    tiempo: 25,
  },
  {
    id: 38,
    pregunta: '¿Qué elemento químico tiene el símbolo "W"?',
    preguntaJa: '元素記号「W」の元素は？',
    opciones: ['Vanadio', 'Itrio', 'Xenón', 'Wolframio'],
    opcionesJa: ['バナジウム', 'イットリウム', 'キセノン', 'タングステン'],
    correcta: 3,
    tiempo: 25,
  },
  {
    id: 39,
    pregunta: '¿Cuántos países independientes hay en América del Sur?',
    preguntaJa: '南アメリカの独立国はいくつ？',
    opciones: ['12', '10', '13', '14'],
    opcionesJa: ['12か国', '10か国', '13か国', '14か国'],
    correcta: 0,
    tiempo: 25,
  },
  {
    id: 40,
    pregunta: '¿En qué museo está "La noche estrellada" de Van Gogh?',
    preguntaJa: 'ゴッホの『星月夜』を所蔵している美術館は？',
    opciones: ['Museo del Louvre', 'MoMA (Nueva York)', 'Museo Van Gogh', "Museo d'Orsay"],
    opcionesJa: ['ルーヴル美術館', 'ニューヨーク近代美術館', 'ゴッホ美術館', 'オルセー美術館'],
    correcta: 1,
    tiempo: 25,
  },
];
