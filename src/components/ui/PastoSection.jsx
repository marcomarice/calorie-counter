export default function PastoSection({ titolo, alimenti }) {
  return (
    <section className="mb-4">
      <h3 className="font-bold text-gray-800 mb-2">{titolo}</h3>
      {alimenti.length === 0 ? (
        <p className="text-gray-400 italic">Nessun alimento aggiunto</p>
      ) : (
        <ul className="text-sm text-gray-700 pl-4 list-disc space-y-1">
          {alimenti.map((al, idx) => (
            <li key={idx}>
              {al.nome} {al.quantita}{al.unita} {al.attivo ? "👁️" : "🚫"}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
