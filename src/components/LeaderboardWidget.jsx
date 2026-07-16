import { Medal } from 'lucide-react';

const STAGES = [
  { key: "octavos", full: "Octavos" },
  { key: "cuartos", full: "Cuartos" },
  { key: "semis", full: "Semis" },
  { key: "final", full: "Final" },
  { key: "campeon", full: "Campeón" },
];

export default function LeaderboardWidget({ players, onSelect }) {
  return (
    <div className="widget-card">
      <h2 className="widget-title"><Medal className="icon-blue" size={20} /> Clasificación general</h2>
      <div className="player-list">
        {players.map((p, i) => {
          const rank = i + 1;
          const rankClass = rank === 1 ? 'r1' : rank === 2 ? 'r2' : rank === 3 ? 'r3' : '';
          return (
            <div key={p.email} className="player-row" onClick={() => onSelect(i)}>
              <div className={`rank mono ${rankClass}`}>{rank}</div>
              <div className="player-name-block">
                <div className="player-name">{p.name}</div>
                <div className="player-track">
                  {STAGES.map(s => (
                    <div key={s.key} className={`track-dot ${s.key === 'campeon' ? 'champ' : ''} ${p.track[s.key].status}`} title={s.full} />
                  ))}
                </div>
              </div>
              <div className="player-penalty-tag">
                {p.breakdown.penalties.length > 0 ? `${p.breakdown.penalties.length} penaliz.` : ''}
              </div>
              <div className="player-score">{p.breakdown.total} pts</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}