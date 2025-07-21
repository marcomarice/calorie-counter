// src/utils/transformations.js

/**
 * Estrae tutte le categorie uniche dagli alimenti disponibili.
 * Ogni alimento ha un `categoryId`, che viene usato per raggruppare o visualizzare.
 */
export function getCategorieFromAlimenti(alimenti) {
  const uniche = Array.from(
    new Set(alimenti.map(a => a.categoryId).filter(Boolean))
  );
  return uniche.map(cat => ({
    id: cat,
    name: cat
  }));
}

/**
 * (Facoltativo) Raggruppa gli alimenti per categoria.
 */
export function raggruppaPerCategoria(alimenti) {
  return alimenti.reduce((acc, alimento) => {
    const cat = alimento.categoryId || "altro";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(alimento);
    return acc;
  }, {});
}
