import { alimentiReducer } from "../context/AlimentiContext";
import { isValidAlimento } from "../utils/validations";

describe("alimentiReducer", () => {
  const initialState = {
    settimana: [
      [[], [], [], [], []] // giorno 0 con 5 pasti vuoti
    ]
  };

  const banana = {
    name: "Banana",
    quantity: 100,
    nutrients: {
      calories: 89,
      carbs: 23,
      proteins: 1.1,
      fats: 0.3,
      fibers: 2.6
    }
  };

  it("aggiunge un alimento a giorno e pasto", () => {
    const action = {
      type: "ADD_ALIMENTO",
      payload: { giorno: 0, pasto: 2, alimento: banana }
    };
    const result = alimentiReducer(initialState, action);
    expect(result.settimana[0][2].length).toBe(1);
    expect(result.settimana[0][2][0].name).toBe("Banana");
  });

  it("non aggiunge alimenti invalidi", () => {
    const action = {
      type: "ADD_ALIMENTO",
      payload: { giorno: 0, pasto: 2, alimento: {} }
    };
    expect(() => alimentiReducer(initialState, action)).toThrow(
      "Formato alimento non valido"
    );
  });

  it("rimuove alimento per giorno e pasto", () => {
    const state = {
      settimana: [
        [[], [], [banana], [], []]
      ]
    };
    const action = {
      type: "REMOVE_ALIMENTO",
      payload: { giorno: 0, pasto: 2, index: 0 }
    };
    const result = alimentiReducer(state, action);
    expect(result.settimana[0][2]).toHaveLength(0);
  });

  it("modifica quantità alimento", () => {
    const state = {
      settimana: [
        [[], [], [{ ...banana, quantity: 100 }], [], []]
      ]
    };
    const action = {
      type: "CHANGE_QUANTITY",
      payload: { giorno: 0, pasto: 2, index: 0, nuovaQuantita: 300 }
    };
    const result = alimentiReducer(state, action);
    expect(result.settimana[0][2][0].quantity).toBe(300);
  });

  it("aggiunge giorno nuovo", () => {
    const state = {
      settimana: [
        [[], [], [], [], []]
      ]
    };
    const action = { type: "ADD_GIORNO" };
    const result = alimentiReducer(state, action);
    expect(result.settimana.length).toBe(2);
    expect(result.settimana[1]).toEqual([[], [], [], [], []]);
  });

  it("duplica giorno", () => {
    const state = {
      settimana: [
        [[{ ...banana }], [], [], [], []]
      ]
    };
    const action = {
      type: "DUPLICA_GIORNO",
      payload: { from: 0, to: 1 }
    };
    const result = alimentiReducer(
      {
        settimana: [
          ...state.settimana,
          [[], [], [], [], []] // giorno target vuoto da riempire
        ]
      },
      action
    );
    expect(result.settimana[1][0][0].name).toBe("Banana");
    expect(result.settimana[1][0][0]).not.toBe(state.settimana[0][0][0]); // deep copy
  });
});
