export function normalizzaAlimento(al, quantitaSelezionata) {
  const fallbackQuantity = al.unit === "pz" || al.unit === "pezzo" ? 1 : 100;
  const quantity = quantitaSelezionata ?? al.multiplier ?? fallbackQuantity;

  return {
    id: al.id,
    code: al.code,
    name: al.name,
    quantity,
    unit: al.unit,
    reference: al.reference,
    multiplier: al.multiplier,
    attivo: true,
    nutrients: {
      calories: al.nutrients?.calories ?? 0,
      carbs: al.nutrients?.carbs ?? 0,
      proteins: al.nutrients?.proteins ?? 0,
      fats: al.nutrients?.fats ?? 0,
      fibers: al.nutrients?.fibers ?? 0,
    },
  };
}
