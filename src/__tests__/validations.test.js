import { isValidAlimento } from "../utils/validations";

describe("isValidAlimento", () => {
  const valido = {
    code: "ABC123",
    name: "Banana",
    quantity: 100,
    nutrients: {
      calories: 90,
      carbs: 20,
      proteins: 1,
      fats: 0.5,
      fibers: 2,
    }
  };

  it("ritorna true per oggetto valido", () => {
    expect(isValidAlimento(valido)).toBe(true);
  });

  it("ritorna false se mancano nutrienti", () => {
    const invalido = { ...valido, nutrients: undefined };
    expect(isValidAlimento(invalido)).toBe(false);
  });

  it("ritorna false se quantity non è numero", () => {
    const invalido = { ...valido, quantity: "100" };
    expect(isValidAlimento(invalido)).toBe(false);
  });

  it("ritorna false se manca code", () => {
    const invalido = { ...valido };
    delete invalido.code;
    expect(isValidAlimento(invalido)).toBe(false);
  });
});
