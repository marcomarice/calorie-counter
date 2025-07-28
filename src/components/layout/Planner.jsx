import { useAlimenti } from "../../context/AlimentiContext";
import { useValori } from "../../context/ValoriContext";
import { calcolaTotali } from "../../utils/calcolo";
import TabellaPasto from "../shared/TabellaPasto";
import { giorni, pasti, incrementiPerUnita } from "../../utils/constants";

export default function Planner({ giorno, setGiorno }) {
  const { settimana, dispatch } = useAlimenti();
  const valori = useValori();
  const alimentiGiorno = settimana[giorno] || [];
  const totGiorno = calcolaTotali(settimana[giorno].flat().filter(a => a.attivo), valori);

  function rimuoviAlimento(pastoIdx, index) {
    dispatch({ type: "REMOVE_ALIMENTO", payload: { giorno, pasto: pastoIdx, index } });
  }

  function toggleAttivo(pastoIdx, index) {
    dispatch({ type: "TOGGLE_ATTIVO", payload: { giorno, pasto: pastoIdx, index } });
  }

  return (
    <main className="col-span-6 bg-white rounded-lg shadow p-4">
      {/* Duplica giorno */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm text-gray-600">Duplica questo giorno in:</span>
        <select
          className="border text-sm px-2 py-1 rounded"
          onChange={(e) => {
            const to = Number(e.target.value);
            if (!isNaN(to) && to !== giorno) {
              dispatch({ type: "DUPLICA_GIORNO", payload: { from: giorno, to } });
            }
          }}
        >
          <option value="">Seleziona giorno...</option>
          {giorni.map((g, i) => i !== giorno && <option key={i} value={i}>{g}</option>)}
        </select>
      </div>

      {/* Pulsanti giorni */}
      <div className="flex gap-1 mb-4">
        {giorni.map((nome, idx) => (
          <button
            key={idx}
            onClick={() => setGiorno(idx)}
            className={`flex-1 min-w-0 px-2.5 py-2 rounded text-sm text-center ${
              idx === giorno ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {nome}
          </button>
        ))}
      </div>

      {/* Pasti */}
      {pasti.map((nomePasto, pastoIdx) => {
        const alimenti = alimentiGiorno?.[pastoIdx] || [];
        const totPasto = calcolaTotali(alimenti.filter(a => a.attivo), valori);

        return (
          <section key={pastoIdx} className="mb-6">
            <h3 className="font-bold text-gray-800 text-lg">{nomePasto}</h3>
            <TabellaPasto dati={totPasto} totaliGiorno={totGiorno} />

            {alimenti.length === 0 ? (
              <p className="text-gray-400 italic">Nessun alimento aggiunto</p>
            ) : (
              <ul className="text-sm text-gray-700 pl-4 space-y-3">
                {alimenti.map((a, index) => {
                  const { kcal, pro, carb, fat, fiber } = calcolaTotali([a], valori);
                  const incrementi = a.type === "prep" ? [1, 0.5, 0.25] : incrementiPerUnita[a.unit] || [];

                  return (
                    <li key={index} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className={a.attivo ? "" : "line-through text-gray-400"}>
                          {`${a.name}${a.quantity > 1 ? " x" + a.quantity : ""}`}
                        </span>
                        <span className="text-xs font-mono text-right text-gray-500">
                          {`${kcal.toFixed(1)}  ${carb.toFixed(1)}  ${pro.toFixed(1)}  ${fat.toFixed(1)}  ${fiber.toFixed(1)}`}
                        </span>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => toggleAttivo(pastoIdx, index)}
                            className={`w-5 h-5 rounded border flex items-center justify-center
                              ${a.attivo ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
                            title="Attiva/Disattiva"
                          >
                            {a.attivo && <span className="text-white text-xs font-bold">✔</span>}
                          </button>
                          <button
                            onClick={() => rimuoviAlimento(pastoIdx, index)}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                          >
                            ➖
                          </button>
                        </div>
                      </div>

                      {/* Bottoni incremento */}
                      <div className="flex flex-wrap gap-3 ml-2">
                        {incrementi.map((step, i) => (
                          <div key={i} className="flex gap-1">
                            <button
                              onClick={() => dispatch({
                                type: "MODIFY_QUANTITA",
                                payload: { giorno, pasto: pastoIdx, index, delta: step }
                              })}
                              className="bg-blue-100 hover:bg-blue-200 text-xs px-2 py-1 rounded"
                            >
                              +{step}{a.unit}
                            </button>
                            <button
                              onClick={() => dispatch({
                                type: "MODIFY_QUANTITA",
                                payload: { giorno, pasto: pastoIdx, index, delta: -step }
                              })}
                              className="bg-red-100 hover:bg-red-200 text-xs px-2 py-1 rounded"
                            >
                              -{step}{a.unit}
                            </button>
                          </div>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}
