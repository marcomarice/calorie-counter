import React from "react";
import { incrementiPerUnita } from "../../utils/constants";

export default function FoodList({ alimenti, filtro, onAggiungi }) {
  const testo = filtro.toLowerCase().trim();
  const termini = testo.split(/\s+/);

  const filtrati = alimenti.filter((a) => {
    const nome = a.name.toLowerCase();
    const tags = (a.tags || []).join(" ").toLowerCase();
    return termini.every((term) => nome.includes(term) || tags.includes(term));
  });

  return (
    <div className="space-y-3">
      {filtrati.map((food) => {
        const unita = food.unit || "g";
        const incrementi = incrementiPerUnita[unita] || [];

        return (
          <div key={food.code} className="space-y-1 mb-2 p-2 bg-white">
            <div className="font-medium">{food.name}</div>
            <div className="flex flex-wrap gap-2">
              {incrementi.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onAggiungi(food, q)}
                  className="bg-green-200 hover:bg-green-300 px-2 py-1 text-xs rounded min-w-[60px] text-center"
                >
                  +{q}{unita}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
