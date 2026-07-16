import { ScrollText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RulesWidget({ compact = false, sticky = false }) {
  return (
    <div className={compact ? "" : `widget-card ${sticky ? 'rules-widget' : ''}`}>
      {!compact && (
        <div className="rules-header-sticky">
          <ScrollText className="icon-blue" size={18} />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>Reglamento oficial</h2>
        </div>
      )}

      <section className="rule-section">
        <h3 className="rule-subtitle green"><CheckCircle2 size={15} /> Positivas</h3>
        <table className="rule-table"><tbody>
          <tr className="pos"><td>Octavos (por equipo)</td><td className="pts">+1</td></tr>
          <tr className="pos"><td>Cuartos (por equipo)</td><td className="pts">+3</td></tr>
          <tr className="pos"><td>Semifinales (por equipo)</td><td className="pts">+7</td></tr>
          <tr className="pos"><td>Final (por equipo)</td><td className="pts">+12</td></tr>
          <tr className="pos"><td>Campeón acertado</td><td className="pts">+15</td></tr>
        </tbody></table>
      </section>

      <section className="rule-section">
        <h3 className="rule-subtitle red"><AlertTriangle size={15} /> Por sobrevalorar</h3>
        <table className="rule-table"><tbody>
          <tr className="neg"><td>Octavofinalista cae en grupos</td><td className="pts">-1</td></tr>
          <tr className="neg"><td>Cuartofinalista cae en grupos</td><td className="pts">-2</td></tr>
          <tr className="neg"><td>Semifinalista cae en grupos</td><td className="pts">-3</td></tr>
          <tr className="neg"><td>Semifinalista cae en 16avos</td><td className="pts">-1</td></tr>
          <tr className="neg"><td>Finalista cae en grupos</td><td className="pts">-4</td></tr>
          <tr className="neg"><td>Finalista cae en 16avos</td><td className="pts">-2</td></tr>
          <tr className="neg"><td>Finalista cae en octavos</td><td className="pts">-1</td></tr>
        </tbody></table>
        <p className="rule-note">Todas se duplican si ese equipo era además tu campeón elegido.</p>
      </section>

      {!compact && (
        <section className="rule-section">
          <h3 className="rule-subtitle red"><AlertTriangle size={15} /> Por infravalorar</h3>
          <table className="rule-table"><tbody>
            <tr className="neg"><td>Cuartofinalista fuera de tus octavos</td><td className="pts">-1</td></tr>
            <tr className="neg"><td>Semifinalista fuera de tus octavos</td><td className="pts">-2</td></tr>
            <tr className="neg"><td>Finalista fuera de tus octavos</td><td className="pts">-4</td></tr>
            <tr className="neg"><td>Finalista fuera de tus cuartos</td><td className="pts">-2</td></tr>
            <tr className="neg"><td>Campeón fuera de tus octavos</td><td className="pts">-6</td></tr>
            <tr className="neg"><td>Campeón fuera de tus cuartos</td><td className="pts">-3</td></tr>
          </tbody></table>
          <p className="rule-note">Solo se aplica la etapa más alta que alcanzó el equipo, no se acumulan varias.</p>
        </section>
      )}
    </div>
  );
}