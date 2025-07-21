import React from "react";
import { render, screen } from "@testing-library/react";
import TabellaPasto from "../components/shared/TabellaPasto";

describe("TabellaPasto", () => {
  const dati = {
    kcal: 500,
    pro: 40,
    carb: 30,
    fat: 20,
    fiber: 10,
    kcalMacro: 500,
  };

  it("mostra correttamente i valori", () => {
    render(<TabellaPasto dati={dati} totaliGiorno={dati} />);
    expect(screen.getByText("Calorie:")).toBeInTheDocument();
    expect(screen.getByText(/500.0 kcal/)).toBeInTheDocument();
    expect(screen.getByText("Carboidrati")).toBeInTheDocument();
    expect(screen.getByText("Proteine")).toBeInTheDocument();
  });
});
