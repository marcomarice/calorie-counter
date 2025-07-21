import { calcolaTotali } from "../utils/calcolo";

describe("calcolaTotali", () => {
  const alimento = {
    quantity: 150,
    multiplier: 100,
    nutrients: {
      calories: 100,
      carbs: 10,
      proteins: 5,
      fats: 3,
      fibers: 2,
    }
  };

  it("calcola i valori corretti per un alimento singolo", () => {
    const result = calcolaTotali([alimento]);
    expect(result.kcal).toBeCloseTo(150);
    expect(result.pro).toBeCloseTo(7.5);
    expect(result.carb).toBeCloseTo(15);
    expect(result.fat).toBeCloseTo(4.5);
    expect(result.fiber).toBeCloseTo(3);
    expect(result.kcalMacro).toBeCloseTo(7.5 * 4 + 15 * 4 + 4.5 * 9);
  });

  it("gestisce un array vuoto", () => {
    expect(calcolaTotali([])).toEqual({
      kcal: 0, pro: 0, carb: 0, fat: 0, fiber: 0, kcalMacro: 1
    });
  });

  it("ignora alimenti non validi", () => {
    const invalid = [{ quantity: 100 }];
    const result = calcolaTotali(invalid);
    expect(result.kcal).toBe(0);
  });
});
