import { getMacroRows } from "../utils/macroTableRows";

describe("getMacroRows", () => {
  const totali = {
    kcal: 400,
    pro: 20,
    carb: 30,
    fat: 10,
    fiber: 5,
    kcalMacro: 20 * 4 + 30 * 4 + 10 * 9
  };

  it("ritorna 4 righe con dati corretti", () => {
    const rows = getMacroRows(totali, 80);
    expect(rows.length).toBe(4);

    const [carbo, prot, grassi, fibre] = rows;
    expect(carbo.nome).toBe("Carboidrati");
    expect(prot.nome).toBe("Proteine");
    expect(grassi.nome).toBe("Grassi");
    expect(fibre.nome).toBe("Fibre");

    expect(prot.grkg).toBeCloseTo(0.25); // 20g / 80kg
  });

  it("ignora gr/kg se disabilitato", () => {
    const rows = getMacroRows(totali, 80, null, false);
    expect(rows[0].grkg).toBe(null);
  });

  it("calcola % Giorno se fornito totaliGiorno", () => {
    const rows = getMacroRows(totali, 80, { pro: 40, carb: 60, fat: 20, fiber: 10 });
    expect(rows[1].pctGiorno).toBeCloseTo(50); // 20 su 40
  });
});
