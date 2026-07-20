import { Trophy } from 'lucide-react';
import { getFlag } from '../data/flags';
import { normalize, display } from '../utils/scoring';

// Confeti puramente decorativo: un puñado de tiras de colores que caen
// en bucle. Se generan una vez (fuera del componente) para no recalcular
// posiciones/retardos en cada render.
const CONFETTI_COLORS = ['#fbbf24', '#f87171', '#60a5fa', '#34d399', '#f4f6fb'];
const CONFETTI_PIECES = Array.from({ length: 24 }, (_, i) => ({
  left: `${(i * 4.3) % 100}%`,
  delay: `${(i % 8) * 0.4}s`,
  duration: `${3.2 + (i % 5) * 0.5}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 5 + (i % 3) * 2,
}));

export default function ChampionBanner({ champion, players }) {
  if (!champion) return null;

  const champNorm = normalize(champion);
  // `players` ya viene ordenado por puntuación total descendente, así que
  // el primero de este filtrado es quien más puntos tiene entre los que
  // acertaron el campeón.
  const winners = players.filter(p => normalize(p.campeon) === champNorm);
  const topWinner = winners[0] || null;

  return (
    <div className="champion-banner">
      <div className="confetti-layer" aria-hidden="true">
        {CONFETTI_PIECES.map((c, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: c.left,
              animationDelay: c.delay,
              animationDuration: c.duration,
              background: c.color,
              width: c.size,
              height: c.size * 2.4,
            }}
          />
        ))}
      </div>

      <div className="champion-banner-inner">
        <div className="champion-flag" aria-hidden="true">{getFlag(champion)}</div>
        <div className="champion-text">
          <div className="champion-eyebrow"><Trophy size={13} /> Campeón del mundo · Mundial 2026</div>
          <div className="champion-title">{display(champion)}</div>
        </div>
        <div className="champion-flag" aria-hidden="true">{getFlag(champion)}</div>
      </div>

      {topWinner && (
        <div className="champion-winners">
          <span className="champion-winners-label">GANADOR DE LA PREDICCIÓN</span>
          <div className="champion-winners-list">
            <span className="champion-winner-pill">
              {topWinner.name} · {topWinner.breakdown.total} pts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}