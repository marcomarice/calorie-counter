import { useState } from "react";
import { useAlimenti } from "../../context/AlimentiContext";
import { useValoriPer100 } from "../../context/ValoriContext"; // ✅ Importa il context

const pasti = ["Colazione", "Spuntino", "Pranzo", "Merenda", "Cena"];

// Configurazione incrementi per unità
const incrementiPerUnita = {
  g: [100, 25, 10, 1],
  ml: [250, 125, 15, 5],
  pz: [1, 0.5, 0.25],
};

export default function Sidebar({ giorno }) {
  const { dispatch } = useAlimenti();
  const valoriPer100 = useValoriPer100(); // ✅ Ottieni gli alimenti dal context
  const [pastoSelezionato, setPastoSelezionato] = useState("Colazione");

  function aggiungiAlimento(nome, quantita, unita) {
    if (!valoriPer100[nome]) {
      alert(`⚠️ L'alimento "${nome}" non è presente in alimenti.json`);
      return;
    }

    if (pastoSelezionato === "All") {
      for (let i = 0; i < 5; i++) {
        dispatch({
          type: "ADD_ALIMENTO",
          payload: {
            giorno,
            pasto: i,
            alimento: { nome, quantita, unita, attivo: true },
          },
        });
      }
    } else {
      const pastoIdx = pasti.indexOf(pastoSelezionato);
      if (pastoIdx === -1) return;

      dispatch({
        type: "ADD_ALIMENTO",
        payload: {
          giorno,
          pasto: pastoIdx,
          alimento: { nome, quantita, unita, attivo: true },
        },
      });
    }
  }

  return (
    <aside className="col-span-3 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Alimenti</h2>

      {/* Dropdown selezione pasto */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aggiungi a:
        </label>
        <select
          value={pastoSelezionato}
          onChange={(e) => setPastoSelezionato(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          {pasti.map((nome, idx) => (
            <option key={idx} value={nome}>{nome}</option>
          ))}
          <option value="All">Tutti i pasti</option>
        </select>
      </div>

      {/* Lista alimenti dal JSON */}
      <div className="space-y-4">
        {Object.entries(valoriPer100).map(([nome, info]) => {
          const unita = info.unita || "g"; // Default a grammi se non specificato

          return (
            <div key={nome} className="space-y-1">
              <div className="font-medium">{nome}</div>
              <div className="flex flex-wrap gap-2">
                {(incrementiPerUnita[unita] || []).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => aggiungiAlimento(nome, q, unita)}
                    className="bg-green-200 hover:bg-green-300 px-2 py-1 text-xs rounded"
                  >
                    +{q}{unita}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
