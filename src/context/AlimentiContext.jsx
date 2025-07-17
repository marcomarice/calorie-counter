import { createContext, useReducer, useContext } from "react";

// Inizializza settimana: 7 giorni × 5 pasti
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
      const nuovaSettimana = state.settimana.map((giornoData, i) =>
        i === giorno
          ? giornoData.map((pastoData, j) =>
              j === pasto
                ? (() => {
                    const index = pastoData.findIndex(a => a.nome === alimento.nome);
                    if (index === -1) {
                      return [...pastoData, alimento];
                    } else {
                      return pastoData.map((a, idx) =>
                        idx === index
                          ? { ...a, quantita: a.quantita + alimento.quantita, attivo: true }
                          : a
                      );
                    }
                  })()
                : pastoData
            )
          : giornoData
      );
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
                      ? { ...a, quantita: Math.max(a.quantita + delta, 0) }
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
