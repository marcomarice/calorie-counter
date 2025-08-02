export function getMacroRows({ kcal = 0, prot = 0, carb = 0, fat = 0, fiber = 0 }, pesoKg = 80, totaliGiorno = null, mostraGrKg = true) {
  const safePct = (val, tot) => (tot > 0 ? (val / tot) * 100 : 0);
  const safeGrKg = (val) => (pesoKg > 0 ? val / pesoKg : 0);
  const safePctGiorno = (val, tot) => (tot && tot > 0 ? (val / tot) * 100 : 0);

  return [
    {
      nome: "Carboidrati",
      val: carb,
      pct: safePct(carb * 4, kcal),
      grkg: mostraGrKg ? safeGrKg(carb) : null,
      pctGiorno: safePctGiorno(carb, totaliGiorno?.carb),
    },
    {
      nome: "Proteine",
      val: prot,
      pct: safePct(prot * 4, kcal),
      grkg: mostraGrKg ? safeGrKg(prot) : null,
      pctGiorno: safePctGiorno(prot, totaliGiorno?.prot),
    },
    {
      nome: "Grassi",
      val: fat,
      pct: safePct(fat * 9, kcal),
      grkg: mostraGrKg ? safeGrKg(fat) : null,
      pctGiorno: safePctGiorno(fat, totaliGiorno?.fat),
    },
    {
      nome: "Fibre",
      val: fiber,
      pct: null,
      grkg: mostraGrKg ? safeGrKg(fiber) : null,
      pctGiorno: safePctGiorno(fiber, totaliGiorno?.fiber),
    },
  ];
}
