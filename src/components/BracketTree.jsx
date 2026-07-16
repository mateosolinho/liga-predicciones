import { getFlag } from '../data/flags';
import { REAL_MATCHES } from '../data/realBracket';
import { normalize, parseList, display } from '../utils/scoring';

// Layout constants (px). The bracket is drawn with absolute-positioned
// chips + an SVG overlay for the connector lines, then the whole thing
// scrolls horizontally inside .bracket-tree — that's intentional, it's
// the friendliest way to show a wide tournament tree on a phone.
const COL_W = 132;
const COL_GAP = 46;
const COL_STEP = COL_W + COL_GAP;
const CHIP_H = 40;
const LEAF_GAP = 12;
const LEAF_SLOT = CHIP_H + LEAF_GAP;

const COLUMNS = [
  { key: 'octavos', label: 'Octavos' },
  { key: 'cuartos', label: 'Cuartos' },
  { key: 'semis', label: 'Semis' },
  { key: 'final', label: 'Final' },
  { key: 'campeon', label: 'Campeón' },
];

// Given the y-centers of one column's chips, returns the y-centers of the
// next column (midpoint between each consecutive pair — real bracket data
// already guarantees consecutive pairs feed the same next-round match).
function nextCenters(centers) {
  const out = [];
  for (let i = 0; i < centers.length; i += 2) {
    out.push((centers[i] + centers[i + 1]) / 2);
  }
  return out;
}

// Real teams that reached a stage vs. what the player picked for that
// stage. Hits are matched by team. Misses show the real team (red) and,
// when available, one of the player's wrong picks for that same round
// (crossed out) — paired positionally since picks aren't stored per slot.
function stageChips(realTeams, playerRawPicks) {
  const realNorm = realTeams.map(normalize);
  const pickNorm = playerRawPicks.map(normalize);
  const wrongPicks = playerRawPicks.filter(p => !realNorm.includes(normalize(p)));
  let wrongIdx = 0;
  return realTeams.map(team => {
    if (pickNorm.includes(normalize(team))) return { team, status: 'hit', alt: null };
    const alt = wrongIdx < wrongPicks.length ? wrongPicks[wrongIdx] : null;
    wrongIdx += 1;
    return { team, status: 'miss', alt };
  });
}

// Elbow connector(s) from a column of children into the midpoints of the
// next column, drawn as one <path> per column transition.
function connectorPath(childRightX, childYs, parentX, parentYs) {
  const bridgeX = childRightX + COL_GAP / 2;
  const parts = [];
  parentYs.forEach((parentY, i) => {
    const y0 = childYs[2 * i];
    const y1 = childYs[2 * i + 1];
    parts.push(`M ${childRightX} ${y0} H ${bridgeX}`);
    parts.push(`M ${childRightX} ${y1} H ${bridgeX}`);
    parts.push(`M ${bridgeX} ${Math.min(y0, y1)} V ${Math.max(y0, y1)}`);
    parts.push(`M ${bridgeX} ${parentY} H ${parentX}`);
  });
  return parts.join(' ');
}

function Chip({ x, y, team, status, alt, champ }) {
  return (
    <div
      className={`pick-chip abs ${champ ? 'champ-chip' : ''} ${status}`}
      style={{ left: x, top: y, width: COL_W, height: CHIP_H }}
    >
      <div className="chip-main">
        <span className="flag">{getFlag(team)}</span>
        <span className="team-name">{display(team)}</span>
      </div>
      {alt && <div className="chip-alt">{display(alt)}</div>}
    </div>
  );
}

export default function BracketTree({ player }) {
  const octavosTeams = REAL_MATCHES.octavos.map(m => m.winner);
  const cuartosTeams = REAL_MATCHES.cuartos.map(m => m.winner);
  const semisTeams = REAL_MATCHES.semis.map(m => m.winner);
  const finalTeams = REAL_MATCHES.final.map(m => m.winner);
  const campeonTeam = REAL_MATCHES.campeon[0].winner; // null hasta el 19/07

  const leafCenters = octavosTeams.map((_, i) => i * LEAF_SLOT + CHIP_H / 2);
  const cuartosCenters = nextCenters(leafCenters);
  const semisCenters = nextCenters(cuartosCenters);
  const finalCenters = nextCenters(semisCenters);
  const campeonCenter = nextCenters(finalCenters)[0];

  const xByCol = {
    octavos: 0,
    cuartos: COL_STEP,
    semis: COL_STEP * 2,
    final: COL_STEP * 3,
    campeon: COL_STEP * 4,
  };

  const octavosChips = stageChips(octavosTeams, parseList(player.octavos));
  const cuartosChips = stageChips(cuartosTeams, parseList(player.cuartos));
  const semisChips = stageChips(semisTeams, parseList(player.semis));
  const finalChips = stageChips(finalTeams, parseList(player.final));

  let campeonChip = null;
  if (!campeonTeam) {
    const guess = parseList(player.campeon)[0];
    if (guess) campeonChip = { team: guess, status: 'pending', alt: null };
  } else {
    campeonChip = stageChips([campeonTeam], parseList(player.campeon))[0];
  }

  const totalWidth = xByCol.campeon + COL_W;
  const totalHeight = octavosTeams.length * LEAF_SLOT;

  const path1 = connectorPath(xByCol.octavos + COL_W, leafCenters, xByCol.cuartos, cuartosCenters);
  const path2 = connectorPath(xByCol.cuartos + COL_W, cuartosCenters, xByCol.semis, semisCenters);
  const path3 = connectorPath(xByCol.semis + COL_W, semisCenters, xByCol.final, finalCenters);
  const path4 = connectorPath(xByCol.final + COL_W, finalCenters, xByCol.campeon, [campeonCenter]);

  return (
    <div className="bracket-tree">
      <div className="bracket-titles" style={{ width: totalWidth }}>
        {COLUMNS.map(c => (
          <div key={c.key} className="bracket-col-title" style={{ left: xByCol[c.key], width: COL_W }}>
            {c.label}
          </div>
        ))}
      </div>

      <div className="bracket-body" style={{ width: totalWidth, height: totalHeight }}>
        <svg className="bracket-svg" width={totalWidth} height={totalHeight}>
          <path className="bracket-line" d={path1} />
          <path className="bracket-line" d={path2} />
          <path className="bracket-line" d={path3} />
          <path className="bracket-line" d={path4} />
        </svg>

        {octavosChips.map((c, i) => (
          <Chip key={`o-${i}`} x={xByCol.octavos} y={leafCenters[i] - CHIP_H / 2} {...c} />
        ))}
        {cuartosChips.map((c, i) => (
          <Chip key={`c-${i}`} x={xByCol.cuartos} y={cuartosCenters[i] - CHIP_H / 2} {...c} />
        ))}
        {semisChips.map((c, i) => (
          <Chip key={`s-${i}`} x={xByCol.semis} y={semisCenters[i] - CHIP_H / 2} {...c} />
        ))}
        {finalChips.map((c, i) => (
          <Chip key={`f-${i}`} x={xByCol.final} y={finalCenters[i] - CHIP_H / 2} {...c} />
        ))}
        {campeonChip && (
          <Chip key="champ" x={xByCol.campeon} y={campeonCenter - CHIP_H / 2} champ {...campeonChip} />
        )}
      </div>
    </div>
  );
}