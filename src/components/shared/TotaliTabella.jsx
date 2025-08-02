import React from "react";
import { getMacroRows } from "../../utils/macroTableRows";
import { pesoKg } from "../../utils/constants";

export default function TotaliTabella({ dati, mostraGrKg = true, totaliGiorno = null }) {
  // Se i dati non sono pronti, evita il rendering
  if (!dati || dati.kcal == null) {
    return <div className="text-xs text-gray-500">Calcolo in corso...</div>;
  }

  const righe = getMacroRows(dati, pesoKg, totaliGiorno, mostraGrKg);

  return (
    <div className="space-y-2">
      <p><strong>Calorie:</strong> {(dati.kcal ?? 0).toFixed(1)} kcal</p>
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
              <td className="px-2 py-1 text-right">{(r.val ?? 0).toFixed(1)}g</td>
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

      {/* BLOCCO COSTO */}
      {dati.price !== undefined && (
        <div className="mt-4 p-3 bg-yellow-200 border-2 border-yellow-500 rounded text-lg font-extrabold text-yellow-900 text-center shadow-md">
          Costo totale: {(dati.price ?? 0).toFixed(2)} €
        </div>
      )}
    </div>
  );
}
