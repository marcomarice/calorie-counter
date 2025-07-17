import { useAlimenti } from "../../context/AlimentiContext";
import { useValoriPer100 } from "../../context/ValoriContext";

const giorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
const pesoKg = 80;

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

function TotaliTabella({ dati, mostraGrKg = true }) {
  const { kcal, pro, carb, fat, fiber, kcalMacro } = dati;

  const righe = [
    {
      nome: "Carboidrati",
      val: carb,
      pct: (carb * 4 / kcalMacro) * 100,
      grkg: mostraGrKg ? carb / pesoKg : null,
    },
    {
      nome: "Proteine",
      val: pro,
      pct: (pro * 4 / kcalMacro) * 100,
      grkg: mostraGrKg ? pro / pesoKg : null,
    },
    {
      nome: "Grassi",
      val: fat,
      pct: (fat * 9 / kcalMacro) * 100,
      grkg: mostraGrKg ? fat / pesoKg : null,
    },
    {
      nome: "Fibre",
      val: fiber,
      pct: null,
      grkg: null,
    },
  ];

  return (
    <div className="space-y-2">
      <p><strong>Calorie:</strong> {kcal.toFixed(1)} kcal</p>
      <table className="w-full text-xs border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-2 py-1 text-left">Macro</th>
            <th className="px-2 py-1 text-right">Quantità</th>
            <th className="px-2 py-1 text-right">% Macro</th>
            {mostraGrKg && <th className="px-2 py-1 text-right">gr/kg</th>}
          </tr>
        </thead>
        <tbody>
          {righe.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-2 py-1">{r.nome}</td>
              <td className="px-2 py-1 text-right">{r.val.toFixed(1)}g</td>
              <td className="px-2 py-1 text-right">{r.pct != null ? r.pct.toFixed(1) + "%" : "—"}</td>
              {mostraGrKg && (
                <td className="px-2 py-1 text-right">{r.grkg != null ? r.grkg.toFixed(2) : "—"}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Totals({ giorno }) {
  const { settimana, dispatch } = useAlimenti();
  const valoriPer100 = useValoriPer100();

  const totaliGiornalieri = settimana.map(g =>
    calcolaTotali(g.flat().filter(a => a.attivo), valoriPer100)
  );

  const giorniValidi = totaliGiornalieri.filter(t => t.kcal > 0);
  const numeroGiorniValidi = giorniValidi.length;

  const mediaFinale = {
    kcal: 0, pro: 0, carb: 0, fat: 0, fiber: 0, kcalMacro: 1
  };

  if (numeroGiorniValidi > 0) {
    for (const g of giorniValidi) {
      mediaFinale.kcal += g.kcal;
      mediaFinale.pro += g.pro;
      mediaFinale.carb += g.carb;
      mediaFinale.fat += g.fat;
      mediaFinale.fiber += g.fiber;
    }
    mediaFinale.kcal /= numeroGiorniValidi;
    mediaFinale.pro /= numeroGiorniValidi;
    mediaFinale.carb /= numeroGiorniValidi;
    mediaFinale.fat /= numeroGiorniValidi;
    mediaFinale.fiber /= numeroGiorniValidi;
    mediaFinale.kcalMacro = mediaFinale.pro * 4 + mediaFinale.carb * 4 + mediaFinale.fat * 9 || 1;
  }

  const totSettimana = calcolaTotali(settimana.flat(2).filter(a => a.attivo), valoriPer100);
  const totGiorno = calcolaTotali(settimana[giorno].flat().filter(a => a.attivo), valoriPer100);

  return (
    <aside className="col-span-3 bg-white rounded-lg shadow p-4 text-sm space-y-6">
      {/* Totale settimana */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Totali settimana</h2>
        <TotaliTabella dati={totSettimana} mostraGrKg={false} />
        {numeroGiorniValidi > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">
              Media giornaliera ({numeroGiorniValidi} giorni)
            </h3>
            <TotaliTabella dati={mediaFinale} mostraGrKg={true} />
          </div>
        )}
      </section>

      {/* Totale giorno selezionato */}
      <section>
        <h2 className="text-lg font-semibold text-blue-700 mb-2">
          Totali {giorni[giorno]}
        </h2>
        <TotaliTabella dati={totGiorno} mostraGrKg={true} />
      </section>

      <hr className="my-4 border-gray-300" />

      <button
        onClick={() => dispatch({ type: "RESET" })}
        className="w-full bg-red-100 text-red-600 font-semibold py-2 rounded hover:bg-red-200"
      >
        Reset settimana
      </button>
    </aside>
  );
}
