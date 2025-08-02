export function calcolaTotali(alimenti, valori) {
  let kcal = 0,
      carb = 0,
      prot = 0,
      fat = 0,
      fiber = 0,
      price = 0;

  alimenti.forEach((a) => {
    const processAlimento = (alimento, quantity, multiplier = alimento.multiplier, pezzi = 1) => {
      if (!alimento) return;
      const ratio = alimento.reference === "per_100"
        ? quantity / multiplier
        : alimento.reference === "per_piece"
          ? quantity * multiplier
          : 0;

      const nutrients = alimento.nutrients || {};

      kcal   += (nutrients.calories  || 0) * ratio;
      carb   += (nutrients.carbs     || 0) * ratio;
      prot   += (nutrients.proteins  || 0) * ratio;
      fat    += (nutrients.fats      || 0) * ratio;
      fiber  += (nutrients.fibers    || 0) * ratio;

      const itemPrice = alimento.price ?? 0;
      const packageSize = alimento.packageSize ?? 1;
      price += (itemPrice / packageSize) * quantity * pezzi;
    };

    if (a.type === "prep") {
      const prep = valori.prepsById[a.id];
      if (!prep) return;
      const pezzi = a.quantity || 1;
      prep.ingredients.forEach((ing) => {
        const alimento = valori.byId[ing.foodId];
        processAlimento(alimento, ing.quantity, alimento?.multiplier, pezzi);
      });
    } else {
      const alimento = valori.byId[a.id];
      processAlimento(alimento, a.quantity || 0);
    }
  });

  return { kcal, carb, prot, fat, fiber, price };
}

/**
 * Calcola la media giornaliera su più giorni
 * @param {Array} settimana - Array con i dati della settimana (giorni -> pasti -> alimenti)
 * @param {Object} valori - Context dei valori nutrizionali
 * @returns {Object} { media, numeroGiorniValidi }
 */
export function calcolaMediaGiornaliera(settimana, valori) {
  const totaliGiornalieri = settimana.map(g =>
    calcolaTotali(g.flat().filter(a => a.attivo), valori)
  );

  const giorniValidi = totaliGiornalieri.filter(t => t.kcal > 0);
  const numeroGiorniValidi = giorniValidi.length;

  const media = { kcal: 0, prot: 0, carb: 0, fat: 0, fiber: 0, price: 0, kcalMacro: 1 };
  if (numeroGiorniValidi > 0) {
    for (const g of giorniValidi) {
      media.kcal  += g.kcal;
      media.prot  += g.prot;
      media.carb  += g.carb;
      media.fat   += g.fat;
      media.fiber += g.fiber;
      media.price += g.price;
    }
    media.kcal  /= numeroGiorniValidi;
    media.prot  /= numeroGiorniValidi;
    media.carb  /= numeroGiorniValidi;
    media.fat   /= numeroGiorniValidi;
    media.fiber /= numeroGiorniValidi;
    media.price /= numeroGiorniValidi;
    media.kcalMacro = media.prot * 4 + media.carb * 4 + media.fat * 9 || 1;
  }

  return { media, numeroGiorniValidi };
}
