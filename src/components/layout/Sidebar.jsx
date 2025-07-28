import React, { useState, useEffect } from "react";
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
  const [pastoSelezionato, setPastoSelezionato] = useState(0);

  // Persistenza tab (alimenti/preparazioni)
  const [tab, setTab] = useState(() => localStorage.getItem("sidebarTab") || "foods");
  useEffect(() => {
    localStorage.setItem("sidebarTab", tab);
  }, [tab]);

  const { categorieVisibili, toggle, collassaTutte } = useVisibilitaCategorie();
  const categorie = getCategorieFromAlimenti(valori.list);
  const prepCategorie = getCategorieFromAlimenti(valori.preps || []);

  // Filtra alimenti e preparazioni
  const filtroLower = filtro.toLowerCase();
  const alimentiDisponibili = valori.list.filter((al) => {
    const testo = `${al.name} ${al.tags?.join(" ") ?? ""}`.toLowerCase();
    return testo.includes(filtroLower);
  });
  const preparazioniDisponibili = (valori.preps || []).filter((prep) =>
    prep.name.toLowerCase().includes(filtroLower)
  );

  const aggiungiAlimento = (alimento, quantita) => {
    const alimentoNormalizzato = normalizzaAlimento(alimento, quantita);
    dispatch({
      type: "ADD_ALIMENTO",
      payload: { giorno, pasto: pastoSelezionato, alimento: alimentoNormalizzato },
    });
  };

  const aggiungiPreparazione = (prep) => {
    // Aggiungi come blocco unico
    const nuovaPrep = {
      type: "prep",
      id: prep.id,
      name: prep.name,
      quantity: 1,
      unit: "pz",
      multiplier: 1,
      attivo: true
    };
    dispatch({
      type: "ADD_ALIMENTO",
      payload: { giorno, pasto: pastoSelezionato, alimento: nuovaPrep },
    });
  };

  const almenoUnaCategoriaAperta = Object.values(categorieVisibili).some(Boolean);

  return (
    <aside className="col-span-3 bg-white rounded-lg shadow p-4">
      {/* Dropdown pasto */}
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

      {/* Tab Switch */}
      <div className="flex mb-4">
        <button
          onClick={() => setTab("foods")}
          className={`flex-1 py-2 text-sm rounded-l ${
            tab === "foods" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {t("Alimenti", "Alimenti")}
        </button>
        <button
          onClick={() => setTab("preps")}
          className={`flex-1 py-2 text-sm rounded-r ${
            tab === "preps" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {t("Preparazioni", "Preparazioni")}
        </button>
      </div>

      {/* Barra di ricerca universale */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder=""
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full px-3 py-2 border rounded pr-8"
        />
        {filtro && (
          <button
            onClick={() => setFiltro("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Collassa tutte su entrambi i tab */}
      {almenoUnaCategoriaAperta && !filtro && (
        <button
          className="mb-4 text-sm text-blue-600 underline"
          onClick={() => collassaTutte(tab === "foods" ? categorie : prepCategorie)}
        >
          {t("Collassa tutte", "Collassa tutte")}
        </button>
      )}

      {/* Se c'è un filtro: mostra insieme alimenti e preparazioni */}
      {filtro && (
        <div className="border rounded-md bg-gray-50 px-3 py-2 mb-4">
          <h3 className="font-semibold text-sm mb-2">
            {t("Risultati ricerca", "Risultati ricerca")}
          </h3>
          {alimentiDisponibili.length > 0 && (
            <>
              <h4 className="text-xs font-medium text-gray-600 mb-1">
                {t("Alimenti", "Alimenti")}
              </h4>
              <FoodList
                alimenti={alimentiDisponibili}
                filtro={filtro}
                onAggiungi={aggiungiAlimento}
              />
            </>
          )}
          {preparazioniDisponibili.length > 0 && (
            <>
              <h4 className="text-xs font-medium text-gray-600 mt-3 mb-1">
                {t("Preparazioni", "Preparazioni")}
              </h4>
              <ul className="max-h-48 overflow-y-auto text-sm">
                {preparazioniDisponibili.map((prep) => (
                  <li
                    key={prep.id}
                    className="flex justify-between items-center border-b py-1"
                  >
                    <span>{prep.name}</span>
                    <button
                      className="text-xs text-blue-500 underline"
                      onClick={() => aggiungiPreparazione(prep)}
                    >
                      Aggiungi
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {alimentiDisponibili.length === 0 &&
            preparazioniDisponibili.length === 0 && (
              <p className="text-xs text-gray-500">
                {t("Nessun risultato trovato", "Nessun risultato trovato")}
              </p>
            )}
        </div>
      )}

      {/* Se non c'è filtro: vista normale */}
      {!filtro && tab === "foods" && (
        categorie.map((cat) => {
          const visibile = categorieVisibili[cat.id];
          const alimentiCat = valori.list.filter((a) => a.categoryId === cat.id);
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
                    onAggiungi={aggiungiAlimento}
                  />
                </div>
              )}
            </div>
          );
        })
      )}

      {!filtro && tab === "preps" && (
        prepCategorie.map((cat) => {
          const visibile = categorieVisibili[cat.id];
          const prepsCat = valori.preps.filter((p) => p.categoryId === cat.id);
          if (prepsCat.length === 0) return null;

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
                <ul className="max-h-48 overflow-y-auto pr-1 mt-2 text-sm">
                  {prepsCat.map((prep) => (
                    <li
                      key={prep.id}
                      className="flex justify-between items-center border-b py-1"
                    >
                      <span>{prep.name}</span>
                      <button
                        className="text-xs text-blue-500 underline"
                        onClick={() => aggiungiPreparazione(prep)}
                      >
                        Aggiungi
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      )}
    </aside>
  );
}

export default Sidebar;
