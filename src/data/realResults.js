// src/data/realResults.js
//
// EDITA ESTE ARCHIVO a medida que avance el torneo.
// El 19/07/2026, después de la final, cambia campeon: null
// por campeon: "ESPAÑA" o campeon: "ARGENTINA" (el nombre debe
// coincidir con el que aparece en "final") y todo se recalcula solo.

export const REAL_RESULTS = {
  // Los 8 que llegaron a cuartos pero no a semis
  cuartos: ["FRANCIA","MARRUECOS","ESPAÑA","BÉLGICA","INGLATERRA","NORUEGA","ARGENTINA","SUIZA"],
  // Los 16 que llegaron a octavos (incluye a los de cuartos/semis/final)
  octavos: ["CANADA","MARRUECOS","BRASIL","NORUEGA","PARAGUAY","FRANCIA","MEXICO","INGLATERRA",
            "BÉLGICA","ESTADOS UNIDOS","ESPAÑA","PORTUGAL","SUIZA","COLOMBIA","EGIPTO","ARGENTINA"],
  semis: ["FRANCIA","ESPAÑA","INGLATERRA","ARGENTINA"],
  final: ["ESPAÑA","ARGENTINA"],
  campeon: null, // se juega el 19/07/2026

  // Eliminados en dieciseisavos (ronda de 32): no llegaron a octavos
  eliminados_dieciseisavos: ["ALEMANIA","SUDAFRICA","JAPON","HOLANDA","COSTA DE MARFIL","SUECIA",
            "ECUADOR","REPUBLICA DEMOCRATICA DEL CONGO","SENEGAL","BOSNIA Y HERZEGOVINA","AUSTRIA",
            "CROACIA","ARGELIA","AUSTRALIA","CABO VERDE","GHANA"],

  // Eliminados en fase de grupos (no llegaron ni a dieciseisavos)
  eliminados_grupos: ["HAITI","TURQUIA","TUNEZ","JORDANIA","PANAMA","QATAR","REPUBLICA CHECA",
            "CURAZAO","URUGUAY","ARABIA SAUDITA","ESCOCIA","COREA DEL SUR","UZBEKISTAN","IRAN",
            "NUEVA ZELANDA"]
};

export const STATUS_TEXT = "Semifinales completas · Final ESPAÑA-ARGENTINA el 19/07";