import { useAlimenti } from "../../context/AlimentiContext";
import { useValori } from "../../context/ValoriContext";
import { calcolaTotali, calcolaMediaGiornaliera } from "../../utils/calcolo";
import TotaliTabella from "../shared/TotaliTabella";
import { giorni } from "../../utils/constants";

export default function Totals({ giorno }) {
  const { settimana, dispatch } = useAlimenti();
  const valori = useValori();

  const { media, numeroGiorniValidi } = calcolaMediaGiornaliera(settimana, valori);
  const totSettimana = calcolaTotali(settimana.flat(2).filter(a => a.attivo), valori);
  const totGiorno = calcolaTotali(settimana[giorno].flat().filter(a => a.attivo), valori);

  return (
    <aside className="col-span-3 bg-white rounded-lg shadow p-4 text-sm space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Totali settimana</h2>
        <TotaliTabella dati={totSettimana} mostraGrKg={false} />
        {numeroGiorniValidi > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">
              Media giornaliera ({numeroGiorniValidi} giorni)
            </h3>
            <TotaliTabella dati={media} mostraGrKg={true} />
          </div>
        )}
      </section>

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
