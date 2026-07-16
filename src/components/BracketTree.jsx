import { ArrowLeft, Award, AlertTriangle, GitBranch } from 'lucide-react';
import BracketTree from './BracketTree';

const STAGES = [
  { key: "octavos", full: "Octavos" },
  { key: "cuartos", full: "Cuartos" },
  { key: "semis", full: "Semis" },
  { key: "final", full: "Final" },
  { key: "campeon", full: "Campeón" },
];

export default function DetailWidget({ player, onBack }) {
  const { breakdown, track } = player;
  return (
    <div className="widget-card detail-card">
      <button onClick={onBack} className="back-btn">
        <ArrowLeft size={15} /> Volver a la clasificación
      </button>

      <div className="score-hero">
        <div>
          <div className="name">{player.name}</div>
          <div className="name-sub">{player.email}</div>
        </div>
        <div>
          <div className="total mono">{breakdown.total} pts</div>
          <div className="total-label">Puntuación total</div>
        </div>
      </div>

      <div className="progress-track">
        {STAGES.map(s => (
          <div key={s.key} className={`stage-chip ${track[s.key].status}`}>
            <div className="n mono">{track[s.key].count}</div>
            <div className="l">{s.full}</div>
          </div>
        ))}
      </div>

      <div className="detail-grid">
        <div className="detail-bracket-col">
          <h3 className="bracket-title"><GitBranch size={15} /> Cuadro real del torneo</h3>
          <p className="bracket-legend">
            En <span className="hit-txt">verde</span>, lo que {player.name.split(' ')[0]} acertó. En <span className="miss-txt">rojo</span>, el equipo que realmente pasó cuando falló (con su pick tachado debajo).
          </p>
          <BracketTree player={player} />
        </div>

        <div className="detail-breakdown-col">
          <section className="breakdown-section pos">
            <h3><Award size={15} /> Aciertos</h3>
            {breakdown.positive.length > 0 ? breakdown.positive.map((p, i) => (
              <div key={i} className="bd-row pos">
                <span className="reason">{p.reason}</span>
                <span className="pts mono">+{p.points}</span>
              </div>
            )) : <p className="empty-note">Sin aciertos todavía.</p>}
          </section>

          <section className="breakdown-section neg">
            <h3><AlertTriangle size={15} /> Penalizaciones</h3>
            {breakdown.penalties.length > 0 ? breakdown.penalties.map((p, i) => (
              <div key={i} className="bd-row neg">
                <span className="reason">{p.reason}</span>
                <span className="pts mono">{p.points}</span>
              </div>
            )) : <p className="empty-note">Sin penalizaciones. Limpio.</p>}
          </section>
        </div>
      </div>
    </div>
  );
}