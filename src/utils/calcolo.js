// src/utils/calcolo.js
export function calcolaTotali(alimenti = [], valori) {
  if (!valori) return { kcal: 0, pro: 0, carb: 0, fat: 0, fiber: 0, kcalMacro: 1 };
  let kcal = 0, pro = 0, carb = 0, fat = 0, fiber = 0;

  for (const a of alimenti) {
    if (!a.attivo) continue;

    // Se è una preparazione
    if (a.type === "prep") {
      const prep = valori.preps.find(p => p.id === a.id);
      if (!prep) continue;

      const pezzi = a.quantity || 1;

      for (const ing of prep.ingredients) {
        const alimento = valori.byId[ing.foodId];
        if (!alimento) continue;

        const ingQ = (ing.quantity / alimento.multiplier) * pezzi;
        kcal  += (alimento.cal || 0)  * ingQ;
        pro   += (alimento.prot || 0) * ingQ;
        carb  += (alimento.carb || 0) * ingQ;
        fat   += (alimento.fat || 0)  * ingQ;
        fiber += (alimento.fib || 0)  * ingQ;
      }
      continue;
    }

    // Alimento normale
    const { quantity = 0, multiplier = 100, reference = "per_100", nutrients } = a;
    if (!nutrients) continue;

    let ratio = 1;
    if (reference === "per_100" && multiplier === 100) {
      ratio = quantity / multiplier;
    } else if (reference === "per_100" && multiplier !== 100) {
      ratio = quantity * (multiplier / 100);
    } else if (reference === "per_piece") {
      ratio = quantity * multiplier;
    }

    kcal  += nutrients.calories * ratio;
    pro   += nutrients.proteins * ratio;
    carb  += nutrients.carbs    * ratio;
    fat   += nutrients.fats     * ratio;
    fiber += nutrients.fibers   * ratio;
  }

  const kcalMacro = pro * 4 + carb * 4 + fat * 9 || 1;
  return { kcal, pro, carb, fat, fiber, kcalMacro };
}
