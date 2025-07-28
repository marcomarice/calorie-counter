import { useAlimenti } from "../../context/AlimentiContext";
import { useValori } from "../../context/ValoriContext";
import { calcolaTotali } from "../../utils/calcolo";
import { giorni } from "../../utils/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useMemo } from "react";

export default function ProgressChart() {
  const { settimana } = useAlimenti();
  const valori = useValori();

  const dati = useMemo(() => {
    const lista = settimana.map(giorno => calcolaTotali(giorno.flat().filter(a => a.attivo), valori)); // FIX
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
  }, [settimana, valori]); // aggiunto valori

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 mb-6">
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

function baseTotali() {
  return { kcal: 0, pro: 0, carb: 0, fat: 0, fiber: 0, kcalMacro: 1 };
}
function sommaTotali(a, b) {
  const pro = a.pro + b.pro;
  const carb = a.carb + b.carb;
  const fat = a.fat + b.fat;
  return {
    kcal: a.kcal + b.kcal,
    pro,
    carb,
    fat,
    fiber: a.fiber + b.fiber,
    kcalMacro: pro * 4 + carb * 4 + fat * 9 || 1,
  };
}

function dividiTotali(t, n) {
  const pro = t.pro / n;
  const carb = t.carb / n;
  const fat = t.fat / n;
  return {
    kcal: t.kcal / n,
    pro,
    carb,
    fat,
    fiber: t.fiber / n,
    kcalMacro: pro * 4 + carb * 4 + fat * 9 || 1,
  };
}
