// src/utils/scoring.js
import { REAL_RESULTS } from '../data/realResults';

export function normalize(s) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}

export function parseList(str) {
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

const DISPLAY_NAME = {};
[...REAL_RESULTS.octavos, ...REAL_RESULTS.eliminados_dieciseisavos, ...REAL_RESULTS.eliminados_grupos]
  .forEach(t => { DISPLAY_NAME[normalize(t)] = t; });

export function display(team) {
  return DISPLAY_NAME[normalize(team)] || team;
}

const REAL_NORM = {
  cuartos: REAL_RESULTS.cuartos.map(normalize),
  octavos: REAL_RESULTS.octavos.map(normalize),
  semis: REAL_RESULTS.semis.map(normalize),
  final: REAL_RESULTS.final.map(normalize),
  campeon: REAL_RESULTS.campeon ? normalize(REAL_RESULTS.campeon) : null,
  eliminados_dieciseisavos: REAL_RESULTS.eliminados_dieciseisavos.map(normalize),
  eliminados_grupos: REAL_RESULTS.eliminados_grupos.map(normalize),
};

// etapa real más lejana alcanzada por un equipo (para las penalizaciones)
function realStage(teamNorm) {
  if (REAL_NORM.campeon && teamNorm === REAL_NORM.campeon) return "campeon";
  if (REAL_NORM.final.includes(teamNorm)) return "final";
  if (REAL_NORM.semis.includes(teamNorm)) return "semis";
  if (REAL_NORM.cuartos.includes(teamNorm)) return "cuartos";
  if (REAL_NORM.octavos.includes(teamNorm)) return "octavos";
  if (REAL_NORM.eliminados_dieciseisavos.includes(teamNorm)) return "dieciseisavos";
  return "grupos"; // fallback si no lo reconocemos
}

export function calculateBreakdown(p) {
  const octavos = parseList(p.octavos).map(normalize);
  const cuartos = parseList(p.cuartos).map(normalize);
  const semis = parseList(p.semis).map(normalize);
  const final = parseList(p.final).map(normalize);
  const campeon = normalize(p.campeon);

  const positive = [];
  const penalties = [];
  let total = 0;

  const addPos = (label, count, pts) => {
    if (count > 0) {
      positive.push({ reason: `${label}: ${count} acierto${count > 1 ? 's' : ''}`, points: count * pts });
      total += count * pts;
    }
  };
  const addPen = (reason, pts) => { penalties.push({ reason, points: pts }); total += pts; };

  // --- POSITIVOS ---
  addPos("Octavos de final", octavos.filter(t => REAL_NORM.octavos.includes(t)).length, 1);
  addPos("Cuartos de final", cuartos.filter(t => REAL_NORM.cuartos.includes(t)).length, 3);
  addPos("Semifinales", semis.filter(t => REAL_NORM.semis.includes(t)).length, 7);
  addPos("Final", final.filter(t => REAL_NORM.final.includes(t)).length, 12);
  if (REAL_NORM.campeon && campeon === REAL_NORM.campeon) {
    positive.push({ reason: "Campeón acertado", points: 15 });
    total += 15;
  }

  // --- PENALIZACIONES POR SOBREVALORAR ---
  octavos.forEach(t => {
    if (realStage(t) === "grupos") addPen(`Tu octavofinalista (${display(t)}) cae en fase de grupos`, -1);
  });
  cuartos.forEach(t => {
    if (realStage(t) === "grupos") addPen(`Tu cuartofinalista (${display(t)}) cae en fase de grupos`, -2);
  });
  semis.forEach(t => {
    const st = realStage(t);
    if (st === "grupos") addPen(`Tu semifinalista (${display(t)}) cae en fase de grupos`, -3);
    else if (st === "dieciseisavos") addPen(`Tu semifinalista (${display(t)}) cae en dieciseisavos`, -1);
  });
  final.forEach(t => {
    const st = realStage(t);
    const mult = (t === campeon) ? 2 : 1;
    if (st === "grupos") addPen(`Tu finalista (${display(t)}) cae en fase de grupos${mult === 2 ? ' (x2, era tu campeón)' : ''}`, -4 * mult);
    else if (st === "dieciseisavos") addPen(`Tu finalista (${display(t)}) cae en dieciseisavos${mult === 2 ? ' (x2, era tu campeón)' : ''}`, -2 * mult);
    else if (st === "octavos") addPen(`Tu finalista (${display(t)}) cae en octavos${mult === 2 ? ' (x2, era tu campeón)' : ''}`, -1 * mult);
  });

  // --- PENALIZACIONES POR INFRAVALORAR ---
  const realFinal = REAL_NORM.final;
  const realCampeon = REAL_NORM.campeon;
  const campeonBucket = realCampeon ? [realCampeon] : [];
  const finalBucket = realFinal.filter(t => t !== realCampeon);
  const semisBucket = REAL_NORM.semis.filter(t => !realFinal.includes(t));
  const cuartosBucket = REAL_NORM.cuartos.filter(t => !REAL_NORM.semis.includes(t));

  campeonBucket.forEach(t => {
    if (!octavos.includes(t)) addPen(`Campeón (${display(t)}) fuera de tus octavos`, -6);
    else if (!cuartos.includes(t)) addPen(`Campeón (${display(t)}) fuera de tus cuartos`, -3);
  });
  finalBucket.forEach(t => {
    if (!octavos.includes(t)) addPen(`Finalista (${display(t)}) fuera de tus octavos`, -4);
    else if (!cuartos.includes(t)) addPen(`Finalista (${display(t)}) fuera de tus cuartos`, -2);
  });
  semisBucket.forEach(t => {
    if (!octavos.includes(t)) addPen(`Semifinalista (${display(t)}) fuera de tus octavos`, -2);
  });
  cuartosBucket.forEach(t => {
    if (!octavos.includes(t)) addPen(`Cuartofinalista (${display(t)}) fuera de tus octavos`, -1);
  });

  return { total, positive, penalties };
}

// Evalúa un equipo concreto en una fase concreta: 'hit' | 'miss' | 'pending'
// (pending solo aplica al campeón mientras no se juegue la final)
export function evaluatePick(stage, teamNorm) {
  if (stage === 'campeon') {
    if (!REAL_NORM.campeon) return 'pending';
    return teamNorm === REAL_NORM.campeon ? 'hit' : 'miss';
  }
  return REAL_NORM[stage].includes(teamNorm) ? 'hit' : 'miss';
}

// Info de "recorrido" (para los puntitos del ranking y el detalle)
// status puede ser: 'hit' (verde, aciertas más de la mitad), 'half' (naranja,
// aciertas exactamente la mitad), 'miss' (rojo, menos de la mitad), o
// 'pending' (gris, todavía no se conoce el resultado real, solo el campeón)
function stageEntry(picks, realList) {
  const correct = picks.filter(t => realList.includes(t)).length;
  const total = picks.length;
  const ratio = total > 0 ? correct / total : 0;
  const status = ratio < 0.5 ? 'miss' : ratio === 0.5 ? 'half' : 'hit';
  return { status, count: `${correct}/${total}` };
}

export function getTrackHits(p) {
  const o = parseList(p.octavos).map(normalize);
  const c = parseList(p.cuartos).map(normalize);
  const s = parseList(p.semis).map(normalize);
  const f = parseList(p.final).map(normalize);
  const ch = normalize(p.campeon);

  let campeonEntry;
  if (!REAL_NORM.campeon) {
    campeonEntry = { status: 'pending', count: '?' };
  } else {
    campeonEntry = { status: ch === REAL_NORM.campeon ? 'hit' : 'miss', count: ch === REAL_NORM.campeon ? '✓' : '✗' };
  }

  return {
    octavos: stageEntry(o, REAL_NORM.octavos),
    cuartos: stageEntry(c, REAL_NORM.cuartos),
    semis: stageEntry(s, REAL_NORM.semis),
    final: stageEntry(f, REAL_NORM.final),
    campeon: campeonEntry,
  };
}

export function buildPlayerStats(raw) {
  return {
    ...raw,
    name: raw.email.split("@")[0],
    breakdown: calculateBreakdown(raw),
    track: getTrackHits(raw),
  };
}