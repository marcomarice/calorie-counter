import { isValidAlimento } from "../utils/validations";
import { createContext, useReducer, useContext } from "react";

// Inizializza la settimana: 7 giorni × 5 pasti
const initialSettimana = Array.from({ length: 7 }, () =>
  Array.from({ length: 5 }, () => [])
);

const initialState = { settimana: initialSettimana };

export function alimentiReducer(state, action) {
  switch (action.type) {
    case "ADD_ALIMENTO": {
      const { giorno, pasto, alimento } = action.payload;

      if (!isValidAlimento(alimento)) {
        console.error("❌ Alimento NON valido:", alimento);
        throw new Error("Formato alimento non valido");
      }

      const pastoCorrente = state.settimana[giorno][pasto];

      const indiceEsistente = pastoCorrente.findIndex(
        (a) => a.code === alimento.code
      );

      let nuovoPasto;
      if (indiceEsistente !== -1) {
        const alimentoEsistente = pastoCorrente[indiceEsistente];
        const quantitaTotale = alimentoEsistente.quantity + alimento.quantity;

        const alimentoAggiornato = {
          ...alimentoEsistente,
          quantity: quantitaTotale,
        };

        nuovoPasto = pastoCorrente.map((a, idx) =>
          idx === indiceEsistente ? alimentoAggiornato : a
        );
      } else {
        nuovoPasto = [...pastoCorrente, alimento];
      }

      const nuovaSettimana = state.settimana.map((g, i) =>
        i === giorno
          ? g.map((p, j) => (j === pasto ? nuovoPasto : p))
          : g
      );

      return { ...state, settimana: nuovaSettimana };
    }

    case "REMOVE_ALIMENTO": {
      const { giorno, pasto, index } = action.payload;
      const nuovaSettimana = state.settimana.map((g, i) =>
        i === giorno
          ? g.map((p, j) =>
              j === pasto ? p.filter((_, idx) => idx !== index) : p
            )
          : g
      );
      return { ...state, settimana: nuovaSettimana };
    }

    case "MODIFY_QUANTITA": {
      const { giorno, pasto, index, delta } = action.payload;
      const alimento = state.settimana[giorno][pasto][index];

      const nuovaQuantita = alimento.quantity + delta;
      if (nuovaQuantita <= 0) return state;

      const alimentoAggiornato = {
        ...alimento,
        quantity: nuovaQuantita,
      };

      const nuovaSettimana = state.settimana.map((g, i) =>
        i === giorno
          ? g.map((p, j) =>
              j === pasto
                ? p.map((a, idx) => (idx === index ? alimentoAggiornato : a))
                : p
            )
          : g
      );

      return { ...state, settimana: nuovaSettimana };
    }

    case "TOGGLE_ATTIVO": {
      const { giorno, pasto, index } = action.payload;

      const nuovaSettimana = state.settimana.map((g, i) =>
        i === giorno
          ? g.map((p, j) =>
              j === pasto
                ? p.map((a, idx) =>
                    idx === index ? { ...a, attivo: !a.attivo } : a
                  )
                : p
            )
          : g
      );

      return { ...state, settimana: nuovaSettimana };
    }

    case "CHANGE_QUANTITY": {
      const { giorno, pasto, index, nuovaQuantita } = action.payload;
      const nuovaSettimana = state.settimana.map((g, i) =>
        i === giorno
          ? g.map((p, j) =>
              j === pasto
                ? p.map((a, idx) =>
                    idx === index ? { ...a, quantity: nuovaQuantita } : a
                  )
                : p
            )
          : g
      );
      return { ...state, settimana: nuovaSettimana };
    }

    case "ADD_GIORNO": {
      return {
        ...state,
        settimana: [...state.settimana, [[], [], [], [], []]],
      };
    }

    case "DUPLICA_GIORNO": {
      const { from, to } = action.payload;
      const nuovaSettimana = state.settimana.map((g, idx) =>
        idx === to
          ? state.settimana[from].map((pasto) =>
              pasto.map((al) => ({ ...al }))
            )
          : g
      );
      return { ...state, settimana: nuovaSettimana };
    }

    case "RESET": {
      return {
        ...state,
        settimana: Array.from({ length: 7 }, () =>
          Array.from({ length: 5 }, () => [])
        ),
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
