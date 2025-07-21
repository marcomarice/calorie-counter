import React from "react";
import { render, screen } from "@testing-library/react";
import TotaliTabella from "../components/shared/TotaliTabella";

describe("TotaliTabella", () => {
  const dati = {
    kcal: 800,
    pro: 60,
    carb: 70,
    fat: 30,
    fiber: 15,
    kcalMacro: 800
  };

  it("mostra calorie e tabella", () => {
    render(<TotaliTabella dati={dati} mostraGrKg={true} />);
    expect(screen.getByText("Calorie:")).toBeInTheDocument();
    expect(screen.getByText("Proteine")).toBeInTheDocument();
    expect(screen.getAllByText(/g/).length).toBeGreaterThan(0);
  });

  it("nasconde colonna gr/kg se disattivata", () => {
    render(<TotaliTabella dati={dati} mostraGrKg={false} />);
    expect(screen.queryByText("gr/kg")).toBeNull();
  });
});
