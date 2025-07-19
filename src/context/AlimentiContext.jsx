import { createContext, useReducer, useContext } from "react";

// Inizializza la settimana: 7 giorni × 5 pasti
const initialSettimana = Array.from({ length: 7 }, () =>
  Array.from({ length: 5 }, () => [])
);

const initialState = {
  settimana: initialSettimana
};

function alimentiReducer(state, action) {
  switch (action.type) {
    case "ADD_ALIMENTO": {
      const { giorno, pasto, alimento } = action.payload;

      // Validazione struttura alimento
      console.log("Aggiungo alimento:", alimento);
      if (
        !alimento.code ||
        !alimento.name ||
        typeof alimento.quantity !== "number" ||
        !alimento.nutrients ||
        typeof alimento.nutrients.calories !== "number" ||
        typeof alimento.nutrients.carbs !== "number" ||
        typeof alimento.nutrients.proteins !== "number" ||
        typeof alimento.nutrients.fats !== "number" ||
        typeof alimento.nutrients.fibers !== "number"
      ) {
        throw new Error("Formato alimento non valido");
      }

      const nuovaSettimana = state.settimana.map((giornoData, i) => {
        if (i !== giorno) return giornoData;

        return giornoData.map((pastoData, j) => {
          if (j !== pasto) return pastoData;

          const index = pastoData.findIndex(a => a.code === alimento.code);

          if (index === -1) {
            return [
              ...pastoData,
              {
                ...alimento,
                attivo: true
              }
            ];
          } else {
            return pastoData.map((a, idx) =>
              idx === index
                ? {
                    ...a,
                    quantity: a.quantity + alimento.quantity,
                    attivo: true
                  }
                : a
            );
          }
        });
      });

      return { ...state, settimana: nuovaSettimana };
    }

    case "MODIFY_QUANTITA": {
      const { giorno, pasto, index, delta } = action.payload;

      const nuovaSettimana = state.settimana.map((giornoData, i) =>
        i === giorno
          ? giornoData.map((pastoData, j) =>
              j === pasto
                ? pastoData.map((a, k) =>
                    k === index
                      ? { ...a, quantity: Math.max(a.quantity + delta, 0) }
                      : a
                  )
                : pastoData
            )
          : giornoData
      );

      return { ...state, settimana: nuovaSettimana };
    }

    case "REMOVE_ALIMENTO": {
      const { giorno, pasto, index } = action.payload;

      const nuovaSettimana = state.settimana.map((giornoData, i) =>
        i === giorno
          ? giornoData.map((pastoData, j) =>
              j === pasto
                ? pastoData.filter((_, k) => k !== index)
                : pastoData
            )
          : giornoData
      );

      return { ...state, settimana: nuovaSettimana };
    }

    case "TOGGLE_ATTIVO": {
      const { giorno, pasto, index } = action.payload;

      const nuovaSettimana = state.settimana.map((giornoData, i) =>
        i === giorno
          ? giornoData.map((pastoData, j) =>
              j === pasto
                ? pastoData.map((a, k) =>
                    k === index ? { ...a, attivo: !a.attivo } : a
                  )
                : pastoData
            )
          : giornoData
      );

      return { ...state, settimana: nuovaSettimana };
    }

    case "DUPLICA_GIORNO": {
      const { from, to } = action.payload;

      const nuovaSettimana = state.settimana.map((giornoData, idx) =>
        idx === to
          ? state.settimana[from].map(pasto =>
              pasto.map(al => ({ ...al }))
            )
          : giornoData
      );

      return { ...state, settimana: nuovaSettimana };
    }

    case "RESET": {
      return {
        ...state,
        settimana: Array.from({ length: 7 }, () =>
          Array.from({ length: 5 }, () => [])
        )
      };
    }

    default:
      return state;
  }
}

const AlimentiContext = createContext();

export function AlimentiProvider({ children }) {
  const [state, dispatch] = useReducer(alimentiReducer, initialState);
  return (
    <AlimentiContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AlimentiContext.Provider>
  );
}

export function useAlimenti() {
  return useContext(AlimentiContext);
}
