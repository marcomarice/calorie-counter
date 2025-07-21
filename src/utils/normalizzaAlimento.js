export function normalizzaAlimento(al) {
  return {
    id: al.id,
    code: al.code,
    name: al.name,
    quantity: 100,
    unit: al.unit,
    attivo: true,
    nutrients: {
      calories: al.nutrients.calories,
      carbs: al.nutrients.carbs,
      proteins: al.nutrients.proteins,
      fats: al.nutrients.fats,
      fibers: al.nutrients.fibers,
    },
  };
}
