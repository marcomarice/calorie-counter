// src/utils/macroTableRows.js
export function getMacroRows({ kcal, pro, carb, fat, fiber, kcalMacro }, pesoKg = 80, totaliGiorno = null, mostraGrKg = true) {
  return [
    {
      nome: "Carboidrati",
      val: carb,
      pct: (carb * 4 / kcalMacro) * 100,
      grkg: mostraGrKg ? carb / pesoKg : null,
      pctGiorno: totaliGiorno?.carb ? (carb / totaliGiorno.carb) * 100 : null,
    },
    {
      nome: "Proteine",
      val: pro,
      pct: (pro * 4 / kcalMacro) * 100,
      grkg: mostraGrKg ? pro / pesoKg : null,
      pctGiorno: totaliGiorno?.pro ? (pro / totaliGiorno.pro) * 100 : null,
    },
    {
      nome: "Grassi",
      val: fat,
      pct: (fat * 9 / kcalMacro) * 100,
      grkg: mostraGrKg ? fat / pesoKg : null,
      pctGiorno: totaliGiorno?.fat ? (fat / totaliGiorno.fat) * 100 : null,
    },
    {
      nome: "Fibre",
      val: fiber,
      pct: null,
      grkg: null,
      pctGiorno: totaliGiorno?.fiber ? (fiber / totaliGiorno.fiber) * 100 : null,
    },
  ];
}
