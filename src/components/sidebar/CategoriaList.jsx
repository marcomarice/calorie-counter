import { FixedSizeList as List } from "react-window";
import { incrementiPerUnita } from "../../utils/constants";

export default function CategoriaList({
  alimentiPerCategoria,
  categorieVisibili,
  toggleCategoria,
  scrollPos,
  updateScrollPos,
  onAggiungi,
  refsCategorie
}) {
  return (
    <div className="space-y-4">
      {Object.entries(alimentiPerCategoria)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([categoriaId, alimenti]) => (
          <div
            key={categoriaId}
            ref={(el) => (refsCategorie.current[categoriaId] = el)}
          >
            <button
              onClick={() => toggleCategoria(categoriaId)}
              className="w-full text-left font-semibold bg-gray-100 px-2 py-1 rounded mb-1 hover:bg-gray-200"
            >
              {categoriaId} {categorieVisibili[categoriaId] ? "▲" : "▼"}
            </button>

            {categorieVisibili[categoriaId] && (
              <List
                height={alimenti.length > 7 ? 480 : alimenti.length * 70}
                itemCount={alimenti.length}
                itemSize={120}
                width="100%"
                initialScrollOffset={scrollPos[categoriaId] || 0}
                onScroll={({ scrollOffset }) =>
                  updateScrollPos(categoriaId, scrollOffset)
                }
              >
                {({ index, style }) => {
                  const food = alimenti[index];
                  const unita = food.unit || "g";
                  const incrementi = incrementiPerUnita[unita] || [];

                  return (
                    <div key={food.code} style={style}>
                      <div className="p-2 mb-2 bg-white rounded">
                        <div className="font-medium mb-1">{food.name}</div>
                        <div className="flex flex-wrap gap-2">
                          {incrementi.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => onAggiungi(food, q)}
                              className="bg-green-200 hover:bg-green-300 px-2 py-1 text-xs rounded min-w-[60px] text-center"
                            >
                              +{q}
                              {unita}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </List>
            )}
          </div>
        ))}
    </div>
  );
}
