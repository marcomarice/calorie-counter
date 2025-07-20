import { useState } from "react";
import { useAlimenti } from "../../context/AlimentiContext";
import { useValori } from "../../context/ValoriContext";
import { useTranslation } from "react-i18next"; // ✅ import per i18n

const pasti = ["Colazione", "Spuntino", "Pranzo", "Merenda", "Cena"];

const incrementiPerUnita = {
  g: [100, 25, 10, 1],
  ml: [250, 125, 15, 5],
  pz: [1, 0.5, 0.25],
};

export default function Sidebar({ giorno }) {
  const { dispatch } = useAlimenti();
  const { list: alimentiDisponibili } = useValori();
  const [pastoSelezionato, setPastoSelezionato] = useState("Colazione");
  const [categorieVisibili, setCategorieVisibili] = useState({});
  const { t } = useTranslation("categories"); // ✅ inizializza traduzioni

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
        carbs: food.nutrients.carbs * ratio,
        proteins: food.nutrients.proteins * ratio,
        fats: food.nutrients.fats * ratio,
        fibers: food.nutrients.fibers * ratio,
      },
      attivo: true,
    };

    if (pastoSelezionato === "All") {
      for (let i = 0; i < 5; i++) {
        dispatch({
          type: "ADD_ALIMENTO",
          payload: { giorno, pasto: i, alimento },
        });
      }
    } else {
      const pastoIdx = pasti.indexOf(pastoSelezionato);
      if (pastoIdx === -1) return;
      dispatch({
        type: "ADD_ALIMENTO",
        payload: { giorno, pasto: pastoIdx, alimento },
      });
    }
  }

  function toggleCategoria(cat) {
    setCategorieVisibili((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  }

  const alimentiPerCategoria = alimentiDisponibili.reduce((acc, alimento) => {
    const cat = alimento.categoryId || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(alimento);
    return acc;
  }, {});

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
            <option key={idx} value={nome}>
              {nome}
            </option>
          ))}
          <option value="All">Tutti i pasti</option>
        </select>
      </div>

      {/* Lista alimenti per categoria */}
      <div className="space-y-4">
        {Object.entries(alimentiPerCategoria)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([categoriaId, alimenti]) => (
            <div key={categoriaId}>
              <button
                onClick={() => toggleCategoria(categoriaId)}
                className="w-full text-left font-semibold bg-gray-100 px-2 py-1 rounded mb-1 hover:bg-gray-200"
              >
                {t(categoriaId, categoriaId)}{" "}
                {categorieVisibili[categoriaId] ? "▲" : "▼"}
              </button>

              {categorieVisibili[categoriaId] &&
                alimenti.map((food) => {
                  const unita = food.unit || "g";
                  const incrementi = incrementiPerUnita[unita] || [];

                  return (
                    <div key={food.code} className="space-y-1 mb-2 ml-2">
                      <div className="font-medium">{food.name}</div>
                      <div className="flex flex-wrap gap-2">
                        {incrementi.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => aggiungiAlimento(food, q)}
                            className="bg-green-200 hover:bg-green-300 px-2 py-1 text-xs rounded"
                          >
                            +{q}
                            {unita}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    </aside>
  );
}
