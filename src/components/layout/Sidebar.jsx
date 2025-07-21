import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useValori } from "../../context/ValoriContext";
import { useAlimenti } from "../../context/AlimentiContext";
import { useVisibilitaCategorie } from "../../hooks/useVisibilitaCategorie";
import { getCategorieFromAlimenti } from "../../utils/transformations";
import { normalizzaAlimento } from "../../utils/normalizzaAlimento";
import FoodList from "../sidebar/FoodList";

export function Sidebar({ giorno }) {
  const { t } = useTranslation("categories");
  const valori = useValori();
  const { dispatch } = useAlimenti();

  const [filtro, setFiltro] = useState("");
  const [pastoSelezionato, setPastoSelezionato] = useState(0); // ✅ default: Colazione

  const categorie = getCategorieFromAlimenti(valori.list);
  const { categorieVisibili, toggle, collassaTutte } = useVisibilitaCategorie();

  const alimentiDisponibili = valori.list.filter((al) => {
    const testo = `${al.name} ${al.tags?.join(" ") ?? ""}`.toLowerCase();
    return testo.includes(filtro.toLowerCase());
  });

  return (
    <aside className="col-span-3 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">
        {t("Alimenti", "Alimenti")}
      </h2>

      {/* Campo ricerca */}
      <input
        type="text"
        placeholder={t("Cerca alimenti", "Cerca alimenti")}
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-2"
      />

      {/* Pulsante reset */}
      <button
        className="text-xs text-red-500 underline mb-4"
        onClick={() => setFiltro("")}
      >
        {t("Reset ricerca", "Reset ricerca")}
      </button>

      {/* Selettore pasto */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {t("Aggiungi a:", "Aggiungi a:")}
        </label>
        <select
          value={pastoSelezionato}
          onChange={(e) => setPastoSelezionato(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        >
          <option value={0}>{t("Colazione", "Colazione")}</option>
          <option value={1}>{t("Spuntino", "Spuntino")}</option>
          <option value={2}>{t("Pranzo", "Pranzo")}</option>
          <option value={3}>{t("Merenda", "Merenda")}</option>
          <option value={4}>{t("Cena", "Cena")}</option>
        </select>
      </div>

      {/* Collassa tutte */}
      <button
        className="mb-4 text-sm text-blue-600 underline"
        onClick={() => collassaTutte(categorie)}
      >
        {t("Collassa tutte", "Collassa tutte")}
      </button>

      {/* Ricerca attiva */}
      {filtro ? (
        <div className="border rounded-md bg-gray-50 px-3 py-2 mb-4">
          <h3 className="font-semibold text-sm mb-2">
            {t("Risultati ricerca", "Risultati ricerca")}
          </h3>
          <FoodList
            alimenti={alimentiDisponibili}
            filtro={filtro}
            onAggiungi={(alimento) =>
              dispatch({
                type: "ADD_ALIMENTO",
                payload: {
                  giorno,
                  pasto: pastoSelezionato,
                  alimento: normalizzaAlimento(alimento),
                },
              })
            }
          />
        </div>
      ) : (
        categorie.map((cat) => {
          const visibile = categorieVisibili[cat.id];
          const alimentiCat = valori.list.filter(
            (a) => a.categoryId === cat.id
          );

          if (alimentiCat.length === 0) return null;

          return (
            <div
              key={cat.id}
              className="border rounded-md bg-gray-50 px-3 py-2 mb-4"
            >
              <h3
                className="flex items-center justify-between cursor-pointer font-semibold text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                onClick={() => toggle(cat.id)}
              >
                <span>{t(cat.name, cat.name)}</span>
                <span className="text-xs">{visibile ? "▾" : "▸"}</span>
              </h3>

              {visibile && (
                <div className="max-h-48 overflow-y-auto pr-1 mt-2">
                  <FoodList
                    alimenti={alimentiCat}
                    filtro={filtro}
                    onAggiungi={(alimento) =>
                      dispatch({
                        type: "ADD_ALIMENTO",
                        payload: {
                          giorno,
                          pasto: pastoSelezionato,
                          alimento: normalizzaAlimento(alimento),
                        },
                      })
                    }
                  />
                </div>
              )}
            </div>
          );
        })
      )}
    </aside>
  );
}

export default Sidebar;
