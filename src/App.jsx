import { useState, useMemo } from 'react';
import './App.css';
import { Trophy, Flag } from 'lucide-react';
import LeaderboardWidget from './components/LeaderboardWidget';
import DetailWidget from './components/DetailWidget';
import RulesWidget from './components/RulesWidget';
import ChampionBanner from './components/ChampionBanner';
import { RAW_PLAYERS } from './data/players';
import { REAL_RESULTS } from './data/realResults';
import { buildPlayerStats, display } from './utils/scoring';

function App() {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const players = useMemo(
    () => RAW_PLAYERS.map(buildPlayerStats).sort((a, b) => b.breakdown.total - a.breakdown.total),
    []
  );

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-text">
          <p className="header-eyebrow"><span className="dot" aria-hidden="true" />Mundial 2026 · Cuadro en vivo</p>
          <h1 className="dashboard-title">Predicción Mundial 2026</h1>
          <p className="sub">Clasificación en vivo de las {players.length} predicciones, con el desglose completo de aciertos y penalizaciones de cada uno.</p>
        </div>
      </header>

      <ChampionBanner champion={REAL_RESULTS.campeon} players={players} />

      <div className="pitch-divider" aria-hidden="true"><span /></div>

      <div className="grid-layout">
        <div>
          {selectedIdx === null ? (
            <LeaderboardWidget players={players} onSelect={setSelectedIdx} />
          ) : (
            <DetailWidget player={players[selectedIdx]} onBack={() => setSelectedIdx(null)} />
          )}
        </div>
        <div className="widget-card rules-widget">
          <h2 className="widget-title"><Flag className="icon-blue" size={18} /> Estado del torneo</h2>
          <div className="results-mini">
            <div className="row"><span className="k">Campeón</span><span className="v">{REAL_RESULTS.campeon ? display(REAL_RESULTS.campeon) : "Pendiente (19 julio)"}</span></div>
          </div>
          <RulesWidget compact />
        </div>
      </div>
    </div>
  );
}

export default App;