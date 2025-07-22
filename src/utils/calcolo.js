// src/utils/calcolo.js
export function calcolaTotali(alimenti = []) {
  let kcal = 0, pro = 0, carb = 0, fat = 0, fiber = 0;

  for (const a of alimenti) {
    const { quantity = 0, multiplier = 100, reference = "per_100", nutrients } = a;
    if (
      !nutrients ||
      typeof nutrients.calories !== "number" ||
      typeof nutrients.proteins !== "number" ||
      typeof nutrients.carbs !== "number" ||
      typeof nutrients.fats !== "number" ||
      typeof nutrients.fibers !== "number"
    ) continue;

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