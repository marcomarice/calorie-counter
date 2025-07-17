import { useAlimenti } from "../../context/AlimentiContext";
import { useValoriPer100 } from "../../context/ValoriContext";

const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
const pasti = ["Colazione", "Spuntino", "Pranzo", "Merenda", "Cena"];
const pesoKg = 80;

const incrementiPerUnita = {
  g: [100, 25, 10, 1],
  ml: [250, 125, 15, 5],
  pz: [1, 0.5, 0.25],
};

function calcolaTotali(alimenti, valoriPer100) {
  let kcal = 0, pro = 0, carb = 0, fat = 0, fiber = 0;
  for (const a of alimenti) {
    const info = valoriPer100[a.nome];
    if (!info) continue;
    const q = a.quantita;
    kcal  += info.kcal  * q / 100;
    pro   += info.pro   * q / 100;
    carb  += info.carb  * q / 100;
    fat   += info.fat   * q / 100;
    fiber += info.fiber * q / 100;
  }
  const kcalMacro = pro * 4 + carb * 4 + fat * 9 || 1;
  return { kcal, pro, carb, fat, fiber, kcalMacro };
}

function TabellaPasto({ dati, totaliGiorno }) {
  const { kcal, pro, carb, fat, fiber, kcalMacro } = dati;

  const righe = [
    {
      nome: "Carboidrati",
      val: carb,
      pct: (carb * 4 / kcalMacro) * 100,
      grkg: carb / pesoKg,
      pctGiorno: totaliGiorno.carb ? (carb / totaliGiorno.carb) * 100 : 0,
    },
    {
      nome: "Proteine",
      val: pro,
      pct: (pro * 4 / kcalMacro) * 100,
      grkg: pro / pesoKg,
      pctGiorno: totaliGiorno.pro ? (pro / totaliGiorno.pro) * 100 : 0,
    },
    {
      nome: "Grassi",
      val: fat,
      pct: (fat * 9 / kcalMacro) * 100,
      grkg: fat / pesoKg,
      pctGiorno: totaliGiorno.fat ? (fat / totaliGiorno.fat) * 100 : 0,
    },
    {
      nome: "Fibre",
      val: fiber,
      pct: null,
      grkg: null,
      pctGiorno: totaliGiorno.fiber ? (fiber / totaliGiorno.fiber) * 100 : 0,
    },
  ];

  return (
    <div className="mb-2 mt-1">
      <p className="text-xs text-gray-600 mb-1">
        Calorie: <strong>{kcal.toFixed(1)} kcal</strong>
      </p>
      <table className="w-full text-xs border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 text-left">Macro</th>
            <th className="px-2 py-1 text-right">Quantità</th>
            <th className="px-2 py-1 text-right">% Macro</th>
            <th className="px-2 py-1 text-right">gr/kg</th>
            <th className="px-2 py-1 text-right">% Giorno</th>
          </tr>
        </thead>
        <tbody>
          {righe.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-2 py-1">{r.nome}</td>
              <td className="px-2 py-1 text-right">{r.val.toFixed(1)}g</td>
              <td className="px-2 py-1 text-right">{r.pct != null ? r.pct.toFixed(1) + "%" : "—"}</td>
              <td className="px-2 py-1 text-right">{r.grkg != null ? r.grkg.toFixed(2) : "—"}</td>
              <td className="px-2 py-1 text-right">{r.pctGiorno.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Planner({ giorno, setGiorno }) {
  const { settimana, dispatch } = useAlimenti();
  const valoriPer100 = useValoriPer100();
  const alimentiGiorno = settimana[giorno] || [];

  const totGiorno = calcolaTotali(settimana[giorno].flat().filter(a => a.attivo), valoriPer100);

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
              dispatch({
                type: "DUPLICA_GIORNO",
                payload: { from: giorno, to }
              });
            }
          }}
        >
          <option value="">Seleziona giorno...</option>
          {giorni.map((g, i) =>
            i !== giorno ? <option key={i} value={i}>{g}</option> : null
          )}
        </select>
      </div>

      {/* Tabs giorno */}
      <div className="flex gap-2 mb-4">
        {giorni.map((nome, idx) => (
          <button
            key={idx}
            onClick={() => setGiorno(idx)}
            className={`px-3 py-1 rounded ${idx === giorno ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {nome}
          </button>
        ))}
      </div>

      {pasti.map((nomePasto, pastoIdx) => {
        const alimenti = alimentiGiorno?.[pastoIdx] || [];
        const totPasto = calcolaTotali(alimenti.filter(a => a.attivo), valoriPer100);

        return (
          <section key={pastoIdx} className="mb-6">
            <h3 className="font-bold text-gray-800 text-lg">{nomePasto}</h3>
            <TabellaPasto dati={totPasto} totaliGiorno={totGiorno} />

            {alimenti.length === 0 ? (
              <p className="text-gray-400 italic">Nessun alimento aggiunto</p>
            ) : (
              <ul className="text-sm text-gray-700 pl-4 space-y-3">
                {alimenti.map((alimento, index) => {
                  const info = valoriPer100[alimento.nome];
                  const q = alimento.quantita;
                  const kcal = info ? info.kcal * q / 100 : 0;
                  const pro = info ? info.pro * q / 100 : 0;
                  const carb = info ? info.carb * q / 100 : 0;
                  const fat = info ? info.fat * q / 100 : 0;
                  const fiber = info ? info.fiber * q / 100 : 0;
                  const unita = alimento.unita;
                  const incrementi = incrementiPerUnita[unita] || [];

                  return (
                    <li key={index} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className={alimento.attivo ? "" : "line-through text-gray-400"}>
                          {alimento.nome} {alimento.quantita}{unita}
                        </span>
                        <span className="text-xs font-mono text-right text-gray-500">
                          {`${kcal.toFixed(1)}  ${carb.toFixed(1)}  ${pro.toFixed(1)}  ${fat.toFixed(1)}  ${fiber.toFixed(1)}`}
                        </span>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => toggleAttivo(pastoIdx, index)}
                            className={`w-5 h-5 rounded border flex items-center justify-center
                              ${alimento.attivo ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
                            title="Attiva/Disattiva"
                          >
                            {alimento.attivo && <span className="text-white text-xs font-bold">✔</span>}
                          </button>
                          <button
                            onClick={() => rimuoviAlimento(pastoIdx, index)}
                            className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                          >
                            ➖
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 ml-2">
                        {incrementi.map((step, i) => (
                          <div key={i} className="flex gap-1">
                            <button
                              onClick={() =>
                                dispatch({
                                  type: "MODIFY_QUANTITA",
                                  payload: {
                                    giorno,
                                    pasto: pastoIdx,
                                    index,
                                    delta: step
                                  }
                                })
                              }
                              className="bg-blue-100 hover:bg-blue-200 text-xs px-2 py-1 rounded"
                            >
                              +{step}{unita}
                            </button>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: "MODIFY_QUANTITA",
                                  payload: {
                                    giorno,
                                    pasto: pastoIdx,
                                    index,
                                    delta: -step
                                  }
                                })
                              }
                              className="bg-red-100 hover:bg-red-200 text-xs px-2 py-1 rounded"
                            >
                              -{step}{unita}
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
