import { useState } from "react";
import { useAlimenti } from "../../context/AlimentiContext";
import { useValori } from "../../context/ValoriContext";

const pasti = ["Colazione", "Spuntino", "Pranzo", "Merenda", "Cena"];

const incrementiPerUnita = {
  g: [100, 25, 10, 1],
  ml: [250, 125, 15, 5],
  pz: [1, 0.5, 0.25],
};

export default function Sidebar({ giorno }) {
  const { dispatch } = useAlimenti();
  const { list: alimentiDisponibili } = useValori(); // ✅ prende la lista completa da foods.json
  const [pastoSelezionato, setPastoSelezionato] = useState("Colazione");

  function aggiungiAlimento(food, quantita) {
    const ratio = quantita / food.multiplier;

    const alimento = {
      name: food.name,
      code: food.code,
      unit: food.unit,
      quantity: quantita,
      categoryId: food.categoryId,
      tags: food.tags || [],
      reference: food.reference,
      multiplier: food.multiplier,
      nutrients: {
        calories: food.nutrients.calories * ratio,
        carbs:    food.nutrients.carbs    * ratio,
        proteins: food.nutrients.proteins * ratio,
        fats:     food.nutrients.fats     * ratio,
        fibers:   food.nutrients.fibers   * ratio
      },
      attivo: true
    };

    if (pastoSelezionato === "All") {
      for (let i = 0; i < 5; i++) {
        dispatch({ type: "ADD_ALIMENTO", payload: { giorno, pasto: i, alimento } });
      }
    } else {
      const pastoIdx = pasti.indexOf(pastoSelezionato);
      if (pastoIdx === -1) return;
      dispatch({ type: "ADD_ALIMENTO", payload: { giorno, pasto: pastoIdx, alimento } });
    }
  }

  return (
    <aside className="col-span-3 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Alimenti</h2>

      {/* Selezione pasto */}
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

      {/* Lista alimenti */}
      <div className="space-y-4">
        {alimentiDisponibili.map((food) => {
          const unita = food.unit || "g";
          const incrementi = incrementiPerUnita[unita] || [];

          return (
            <div key={food.code} className="space-y-1">
              <div className="font-medium">{food.name}</div>
              <div className="flex flex-wrap gap-2">
                {incrementi.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => aggiungiAlimento(food, q)}
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
