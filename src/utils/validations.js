// src/utils/validations.js

export function isValidAlimento(alimento) {
  return (
    alimento &&
    typeof alimento.code === "string" &&
    typeof alimento.name === "string" &&
    typeof alimento.quantity === "number" &&
    typeof alimento.nutrients === "object" &&
    typeof alimento.nutrients.calories === "number" &&
    typeof alimento.nutrients.carbs === "number" &&
    typeof alimento.nutrients.proteins === "number" &&
    typeof alimento.nutrients.fats === "number" &&
    typeof alimento.nutrients.fibers === "number"
  );
}
