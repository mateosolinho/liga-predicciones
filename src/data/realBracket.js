// src/data/realBracket.js
//
// Emparejamientos REALES del Mundial 2026, ronda a ronda.
// Cada entrada es un partido real: { home, away, winner }.
// El array está ordenado para que cada pareja consecutiva de
// ganadores alimente correctamente el partido de la siguiente ronda
// (así las líneas del bracket conectan los cruces reales).
//
// Las claves representan la ronda a la que ACCEDE el ganador:
// - octavos: los 16 partidos de dieciseisavos (ganador pasa a octavos)
// - cuartos: los 8 partidos de octavos (ganador pasa a cuartos)
// - semis:   los 4 partidos de cuartos (ganador pasa a semis)
// - final:   los 2 partidos de semis (ganador pasa a la final)
// - campeon: el partido de la final (winner: null hasta que se juegue)
//
// EDITA "campeon" el 19/07/2026 tras la final, poniendo el ganador real.

const M = (home, away, winner) => ({ home, away, winner });

export const REAL_MATCHES = {
  octavos: [
    M("ALEMANIA", "PARAGUAY", "PARAGUAY"),
    M("FRANCIA", "SUECIA", "FRANCIA"),
    M("SUDAFRICA", "CANADA", "CANADA"),
    M("HOLANDA", "MARRUECOS", "MARRUECOS"),
    M("PORTUGAL", "CROACIA", "PORTUGAL"),
    M("ESPAÑA", "AUSTRIA", "ESPAÑA"),
    M("ESTADOS UNIDOS", "BOSNIA Y HERZEGOVINA", "ESTADOS UNIDOS"),
    M("BÉLGICA", "SENEGAL", "BÉLGICA"),
    M("MEXICO", "ECUADOR", "MEXICO"),
    M("INGLATERRA", "REPUBLICA DEMOCRATICA DEL CONGO", "INGLATERRA"),
    M("BRASIL", "JAPON", "BRASIL"),
    M("COSTA DE MARFIL", "NORUEGA", "NORUEGA"),
    M("ARGENTINA", "CABO VERDE", "ARGENTINA"),
    M("AUSTRALIA", "EGIPTO", "EGIPTO"),
    M("SUIZA", "ARGELIA", "SUIZA"),
    M("COLOMBIA", "GHANA", "COLOMBIA"),
  ],
  cuartos: [
    M("PARAGUAY", "FRANCIA", "FRANCIA"),
    M("CANADA", "MARRUECOS", "MARRUECOS"),
    M("PORTUGAL", "ESPAÑA", "ESPAÑA"),
    M("ESTADOS UNIDOS", "BÉLGICA", "BÉLGICA"),
    M("MEXICO", "INGLATERRA", "INGLATERRA"),
    M("BRASIL", "NORUEGA", "NORUEGA"),
    M("ARGENTINA", "EGIPTO", "ARGENTINA"),
    M("SUIZA", "COLOMBIA", "SUIZA"),
  ],
  semis: [
    M("FRANCIA", "MARRUECOS", "FRANCIA"),
    M("ESPAÑA", "BÉLGICA", "ESPAÑA"),
    M("INGLATERRA", "NORUEGA", "INGLATERRA"),
    M("ARGENTINA", "SUIZA", "ARGENTINA"),
  ],
  final: [
    M("FRANCIA", "ESPAÑA", "ESPAÑA"),
    M("INGLATERRA", "ARGENTINA", "ARGENTINA"),
  ],
  campeon: [
    M("ESPAÑA", "ARGENTINA", "ESPAÑA"),
  ],
};