import React from "react";
import { getMacroRows } from "../../utils/macroTableRows";
import { pesoKg } from "../../utils/constants";

export default function TotaliTabella({ dati, mostraGrKg = true, totaliGiorno = null }) {
  const righe = getMacroRows(dati, pesoKg, totaliGiorno, mostraGrKg);

  return (
    <div className="space-y-2">
      <p><strong>Calorie:</strong> {dati.kcal.toFixed(1)} kcal</p>
      <table className="w-full text-xs border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-2 py-1 text-left">Macro</th>
            <th className="px-2 py-1 text-right">Quantità</th>
            <th className="px-2 py-1 text-right">% Macro</th>
            {mostraGrKg && <th className="px-2 py-1 text-right">gr/kg</th>}
            {totaliGiorno && <th className="px-2 py-1 text-right">% Giorno</th>}
          </tr>
        </thead>
        <tbody>
          {righe.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="px-2 py-1">{r.nome}</td>
              <td className="px-2 py-1 text-right">{r.val.toFixed(1)}g</td>
              <td className="px-2 py-1 text-right">{r.pct != null ? r.pct.toFixed(1) + "%" : "—"}</td>
              {mostraGrKg && (
                <td className="px-2 py-1 text-right">
                  {r.grkg != null ? r.grkg.toFixed(2) : "—"}
                </td>
              )}
              {totaliGiorno && (
                <td className="px-2 py-1 text-right">
                  {r.pctGiorno != null ? r.pctGiorno.toFixed(1) + "%" : "—"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
