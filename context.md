# Predicción Mundial 2026 — contexto del proyecto

## Qué es

Quiniela del Mundial 2026 entre un grupo de amigos. Cada persona predijo, antes de empezar el torneo, qué equipos llegarían a Octavos, Cuartos, Semis, Final, y quién sería el Campeón. La app es un panel estático (React + Vite, sin backend) que compara esas predicciones contra los resultados reales, calcula la puntuación de cada uno y muestra una clasificación con el detalle de aciertos/fallos de cada jugador, incluido un cuadro visual del torneo.

No hay servidor ni base de datos: todo son archivos `.js` con datos hardcodeados. Actualizar el torneo = editar dos archivos de datos a mano y desplegar de nuevo.

## Cómo se actualiza durante el torneo

Según avanzan las rondas reales, hay que editar:
- **`src/data/realResults.js`** — listas de qué equipos llegaron a cada fase. El campo `campeon` se pone a `null` hasta que se juega la final; el 19/07/2026 se cambia por el nombre del ganador y todo se recalcula solo.
- **`src/data/realBracket.js`** — los emparejamientos reales partido a partido (para dibujar el cuadro). El último partido (`campeon`) también tiene `winner: null` hasta la final.

El resto de la app (puntuaciones, colores, cuadro) se recalcula automáticamente a partir de esos dos archivos: no hace falta tocar nada más.

## Estructura de archivos

```
src/
  main.jsx                    punto de entrada de Vite/React
  index.css                   estilos globales (fuente, fondo, scrollbar)
  App.jsx                     componente raíz: cabecera + layout de dos columnas
  App.css                     todo el CSS de la app (única hoja de estilos, incluye los breakpoints móviles)

  components/
    LeaderboardWidget.jsx     tabla de clasificación general (ordenada por puntos), clicable por fila
    DetailWidget.jsx          vista de detalle de un jugador: hero de puntuación, chips de progreso por fase, cuadro + desglose de aciertos/penalizaciones
    BracketTree.jsx           dibuja el cuadro real del torneo (Octavos→Cuartos→Semis→Final→Campeón) como SVG + chips posicionados en absoluto, coloreando aciertos/fallos del jugador
    RulesWidget.jsx           tabla del reglamento de puntuación (positivas y penalizaciones), se usa en la barra lateral y también existe en formato completo

  data/
    players.js                RAW_PLAYERS: un objeto por persona con email y sus picks en texto ("octavos", "cuartos", "semis", "final", "campeon" como strings separados por comas)
    realResults.js            REAL_RESULTS: qué equipos llegaron realmente a cada fase (listas planas) + STATUS_TEXT (texto del estado del torneo en la cabecera)
    realBracket.js             REAL_MATCHES: los cruces reales partido a partido, ronda a ronda — de aquí sale la estructura del árbol del cuadro (qué par de equipos alimenta qué partido siguiente)
    flags.js                  mapa nombre de país (normalizado) → emoji de bandera

  utils/
    scoring.js                toda la lógica: normalize/parseList (limpiar texto de picks), calculateBreakdown (puntos + razones de cada jugador), evaluatePick/getTrackHits (aciertos por fase para los puntitos de color), buildPlayerStats (junta todo por jugador), display (nombre "bonito" de un equipo)
```

## Cómo encajan las piezas

1. `App.jsx` carga `RAW_PLAYERS`, llama a `buildPlayerStats` (de `scoring.js`) por cada jugador y los ordena por puntuación.
2. `LeaderboardWidget` pinta esa lista; al hacer clic en un jugador, `App.jsx` cambia a `DetailWidget` para ese jugador.
3. `DetailWidget` muestra el desglose de puntos (ya calculado en `scoring.js`) y delega el dibujo del cuadro en `BracketTree`.
4. `BracketTree` reconstruye el árbol del torneo a partir de `realBracket.js` (no de `realResults.js`), y colorea cada casilla comparando el equipo real de esa ronda contra la lista de picks del jugador para esa misma ronda.
5. Todo el estilo vive en `App.css` — un único archivo, con secciones comentadas y con los ajustes de móvil ya integrados en los mismos bloques (`@media max-width: 640px` etc.), no en un archivo aparte.

## Reglas de puntuación (resumen)

- Positivos por acierto: Octavos +1, Cuartos +3, Semis +7, Final +12, Campeón +15 (por equipo acertado).
- Penalización por "sobrevalorar": si un equipo que el jugador puso en una fase cae antes de lo esperado, resta puntos (más si ese equipo era también su Campeón elegido).
- Penalización por "infravalorar": si un equipo llega muy lejos en la realidad y el jugador ni siquiera lo tenía en Octavos, también resta.
- El detalle exacto de cada regla y sus puntos está en `RulesWidget.jsx` y implementado en `calculateBreakdown` (`scoring.js`).

## Estado conocido / pendiente

- El `BracketTree.jsx` real se perdió en una subida anterior (se subió por error una copia de `DetailWidget.jsx`) y fue reconstruido desde cero a partir de `realBracket.js` y las clases CSS ya existentes en `App.css`. Verificado contra `calculateBreakdown` para que los aciertos por ronda coincidan exactamente.
- Falta confirmar que `index.html` tenga el meta viewport estándar de Vite (no se ha revisado, no estaba entre los archivos subidos).
- El 19/07/2026, tras la final, hay que editar `campeon` en `realResults.js` y `realBracket.js` con el resultado real.