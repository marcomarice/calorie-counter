// ProgressChart.jsx
import { useAlimenti } from "../../context/AlimentiContext";
import { useValoriPer100 } from "../../context/ValoriContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList
} from "recharts";
import { useMemo } from "react";

const giorni = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const pesoKg = 80;

export default function ProgressChart() {
  const { settimana } = useAlimenti();
  const valoriPer100 = useValoriPer100();

  const dati = useMemo(() => {
    const lista = settimana.map((giorno) => calcolaTotali(giorno.flat().filter(a => a.attivo), valoriPer100));

    const tot = lista.reduce((acc, cur) => sommaTotali(acc, cur), baseTotali());
    const media = dividiTotali(tot, lista.length);

    const tutti = [...lista, tot, media];

    return tutti.map((d, idx) => ({
      nome: giorni[idx] || (idx === 7 ? "Tot" : "Media"),
      kcal: d.kcal,
      carb: d.carb,
      pro: d.pro,
      fat: d.fat,
      fiber: d.fiber,
      carbPct: (d.carb * 4 / d.kcalMacro) * 100,
      proPct: (d.pro * 4 / d.kcalMacro) * 100,
      fatPct: (d.fat * 9 / d.kcalMacro) * 100,
    }));
  }, [settimana, valoriPer100]);

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Andamento settimanale</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dati} margin={{ top: 20, right: 20, left: 0, bottom: 30 }}>
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>

          <Bar dataKey="fiber" stackId="stack" fill="#a3e635" name="Fibre" />
          <Bar dataKey="fat" stackId="stack" fill="#f87171" name="Grassi" />
          <Bar dataKey="pro" stackId="stack" fill="#60a5fa" name="Proteine" />
          <Bar dataKey="carb" stackId="stack" fill="#facc15" name="Carboidrati" />
        </BarChart>
      </ResponsiveContainer>

      {/* Barre % macro */}
      <div className="grid grid-cols-9 gap-2 mt-6 text-xs text-center">
        {dati.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-full h-4 flex rounded overflow-hidden">
              <div style={{ width: `${d.carbPct}%` }} className="bg-yellow-300" />
              <div style={{ width: `${d.proPct}%` }} className="bg-blue-400" />
              <div style={{ width: `${d.fatPct}%` }} className="bg-red-400" />
            </div>
            <div className="mt-1">{d.nome}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper
function baseTotali() {
  return { kcal: 0, pro: 0, carb: 0, fat: 0, fiber: 0, kcalMacro: 1 };
}
function sommaTotali(a, b) {
  return {
    kcal: a.kcal + b.kcal,
    pro: a.pro + b.pro,
    carb: a.carb + b.carb,
    fat: a.fat + b.fat,
    fiber: a.fiber + b.fiber,
    kcalMacro: 1,
  };
}
function dividiTotali(t, n) {
  return {
    kcal: t.kcal / n,
    pro: t.pro / n,
    carb: t.carb / n,
    fat: t.fat / n,
    fiber: t.fiber / n,
    kcalMacro: 1,
  };
}
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
