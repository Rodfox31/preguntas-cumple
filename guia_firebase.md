# Guía rápida: conectar la trivia con Firebase (gratis, unos 5 minutos)

## 1. Crear el proyecto
1. Entrá a <https://console.firebase.google.com> con tu cuenta de Google.
2. **Crear un proyecto** (o "Agregar proyecto"). Nombre: por ejemplo `trivia-cumple`.
3. Cuando pregunte por **Google Analytics**, desactivalo: no hace falta.

## 2. Crear la base de datos
1. En el menú de la izquierda: **Compilación → Realtime Database** (en inglés: *Build → Realtime Database*).
2. **Crear base de datos** → elegí la ubicación que te ofrece (cualquiera sirve).
3. Elegí **Comenzar en modo de prueba** → **Habilitar**.

## 3. Pegar las reglas de seguridad
El modo de prueba deja la base abierta a cualquiera y se vence a los 30 días. Estas reglas no se vencen y solo permiten lo que usa el juego:
1. En Realtime Database, abrí la pestaña **Reglas**.
2. Borrá todo lo que hay y pegá el contenido del archivo **`database.rules.json`**.
3. **Publicar**.

## 4. Copiar la configuración al juego
1. Arriba a la izquierda, el ⚙️ → **Configuración del proyecto**.
2. En **Tus apps**, tocá el ícono **`</>`** (Web). Ponele un nombre (por ejemplo `trivia`), sin marcar Hosting → **Registrar app**.
3. Firebase te muestra un bloque `const firebaseConfig = { ... }`. Copiá esos valores en **`config.js`**, reemplazando los `PEGAR_AQUI`.
4. Fijate que esté el **`databaseURL`** (termina en `firebaseio.com` o `firebasedatabase.app`). Si no aparece, copialo de la parte de arriba de la página de Realtime Database.

## 5. Listo
Subí los cambios a GitHub y abrí la página en la tele. Si en la sala de espera dice **"Conectado: listo para jugar"**, ya está.

El plan gratis (Spark) alcanza de sobra: hasta 100 conexiones a la vez. Las claves de `config.js` no son secretas: lo que protege los datos son las reglas del paso 3.
