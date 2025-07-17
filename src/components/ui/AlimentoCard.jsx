export default function AlimentoCard({ nome, quantita, unita, onAdd, onRemove, attivo, onToggle }) {
  return (
    <div className="flex items-center justify-between border rounded px-2 py-1 text-sm">
      <div className="flex items-center gap-2">
        <button onClick={onRemove} className="px-2 py-1 bg-red-100 hover:bg-red-200 rounded">−</button>
        <button onClick={onAdd} className="px-2 py-1 bg-green-100 hover:bg-green-200 rounded">+</button>
        <span className={`ml-2 ${attivo ? "" : "line-through text-gray-400"}`}>
          {nome} {quantita}{unita}
        </span>
      </div>
      <button onClick={onToggle} title="Attiva/Disattiva">
        {attivo ? "👁️" : "🚫"}
      </button>
    </div>
  );
}
