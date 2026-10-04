# 🎉 Trivia del Cumple

Juego de preguntas estilo Kahoot para proyectar en la tele, con hasta 20 celulares como controles. Corre entero en el navegador (GitHub Pages) y usa Firebase Realtime Database para sincronizar.

- **TV:** `index.html`. Sala de espera con código y QR, preguntas con cuenta regresiva, resultados con gráfico y Top 5, y el podio final.
- **Celular:** `player.html`. Se entra con el QR, se pone el nombre y se juega con 4 botones de colores y formas. Las respuestas se leen en la tele.

## Antes de la fiesta

1. Seguí **[guia_firebase.md](guia_firebase.md)** y pegá tu configuración en `config.js`.
2. Cambiá las preguntas en `preguntas.js` (y el título en `config.js`, si querés). Cada pregunta tiene subtítulos en japonés (`preguntaJa` y `opcionesJa`) que se ven en la TV; se apagan con `MOSTRAR_JAPONES` en `config.js`.
3. Subí los cambios. Si cambiaste el código (no solo las preguntas), subí el `?v=…` de `index.html` y `player.html` para que los navegadores no usen archivos viejos guardados.

## Cómo se juega

1. En la tele, abrí **`rodfox31.github.io/preguntas-cumple`** y apretá **OK** una vez: eso activa el sonido.
2. Los invitados escanean el QR (o entran a la página del juego y escriben el código de 4 números).
3. Con **OK** empieza la partida. Hay **20 preguntas de cultura general de nivel intermedio** (música, cine, deportes y cultura general) y cada partida usa 20, así que salen todas, en orden al azar. Si agregás más preguntas, se eligen 20 al azar sin repetir entre partidas hasta que salieron todas. Cada pregunta termina cuando se acaba el tiempo o cuando respondieron todos.
4. En los resultados, **OK** pasa a la siguiente pregunta. Después de la última: **OK** → podio → **OK** → tabla final con todos → **OK** → partida nueva.

### Teclas en la TV

| Tecla | Acción |
|---|---|
| `OK` / `Enter` / espacio / `→` | Avanzar |
| `N` | Partida nueva (pide confirmación) |
| `F` | Pantalla completa |
| `M` | Silenciar |

## Puntaje

Estilo Kahoot: una respuesta correcta da entre **1000 puntos** (al instante) y **500** (en el último segundo); una incorrecta, 0. La hora de cada respuesta la pone el servidor de Firebase, así que no influye el reloj de cada celular.

**Puntos finales:** en el podio, la tabla final y los celulares, los puntos se pasan a la escala de la ruleta: se dividen por 1.000 y se redondean (1.800 → **2**). Con 20 preguntas el máximo es 20. El divisor se cambia en `config.js` (`PUNTOS_TRIVIA_POR_PUNTO`; con 2000 el máximo queda en 10).

## Detalles

- **Si se recarga la TV o un celular**, cada uno vuelve a donde estaba, con sus puntos.
- **Si alguien llega tarde**, se suma desde la pregunta siguiente.
- **"Partida nueva"** pone los puntos en cero y saca a quien ya no está conectado.
- **Las salas de más de 2 días se borran solas.**
- **En una Smart TV** la página usa un modo liviano (menos confeti).
- **Las preguntas están en un archivo público:** un invitado muy curioso podría leer las respuestas.

## Probar sin Firebase (para programar)

Con el [emulador oficial](https://firebase.google.com/docs/emulator-suite) corriendo en `127.0.0.1:9000` con las reglas de `database.rules.json`, agregá `?emulador=127.0.0.1:9000` a la dirección de la TV. El QR lo pasa también a los celulares.
