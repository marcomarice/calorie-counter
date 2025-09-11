import { useAlimenti } from "../../context/AlimentiContext";
import { useValori } from "../../context/ValoriContext";
import { calcolaTotali, calcolaMediaGiornaliera } from "../../utils/calcolo";
import { giorni } from "../../utils/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useMemo } from "react";

export default function ProgressChart() {
  const { settimana } = useAlimenti();
  const valori = useValori();

  const dati = useMemo(() => {
    // 1) Totali giornalieri (7 barre)
    const lista = settimana.map(giorno =>
      calcolaTotali(giorno.flat().filter(a => a.attivo), valori)
    );

    // 2) Media giornaliera (1 barra) — manteniamo solo questa, via il "Tot"
    const { media } = calcolaMediaGiornaliera(settimana, valori);

    // 3) Costruzione dataset: 7 giorni + Media (NO Totale)
    const tutti = [...lista, media];

    return tutti.map((d, idx) => {
      const kcalMacro = (d.prot * 4 + d.carb * 4 + d.fat * 9) || 1;
      const isDailyAverage = idx === 7; // pos. 8: dopo i 7 giorni
      return {
        nome: isDailyAverage ? "media giornaliera" : giorni[idx],
        kcal: d.kcal,
        carb: d.carb,
        prot: d.prot,
        fat: d.fat,
        fiber: d.fiber,
        carbPct: (d.carb * 4 / kcalMacro) * 100,
        protPct: (d.prot * 4 / kcalMacro) * 100,
        fatPct: (d.fat * 9 / kcalMacro) * 100,
      };
    });
  }, [settimana, valori]);

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 mb-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dati} margin={{ top: 20, right: 20, left: 0, bottom: 30 }}>
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Bar dataKey="fiber" stackId="stack" fill="#a3e635" name="Fibre" />
          <Bar dataKey="fat"   stackId="stack" fill="#f87171" name="Grassi" />
          <Bar dataKey="prot"  stackId="stack" fill="#60a5fa" name="Proteine" />
          <Bar dataKey="carb"  stackId="stack" fill="#facc15" name="Carboidrati" />
        </BarChart>
      </ResponsiveContainer>

      {/* Barre % macro (7 giorni + Media => 8 colonne) */}
      <div className="grid grid-cols-8 gap-2 mt-6 text-xs text-center">
        {dati.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-full h-4 flex rounded overflow-hidden">
              <div style={{ width: `${d.carbPct}%` }} className="bg-yellow-300" />
              <div style={{ width: `${d.protPct}%` }} className="bg-blue-400" />
              <div style={{ width: `${d.fatPct}%` }}  className="bg-red-400" />
            </div>
            <div className="mt-1">{d.nome}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
