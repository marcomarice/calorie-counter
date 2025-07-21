import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "../components/layout/Sidebar";
import { ValoriProvider } from "../context/ValoriContext";
import { AlimentiProvider } from "../context/AlimentiContext";

// Mock i18next per evitare warning
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key, fallback) => fallback || key })
}));

// Mock fetch per il provider Valori
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 1,
            name: "Banana",
            unit: "g",
            nutrients: { calories: 89, carbs: 23, proteins: 1.1, fats: 0.3, fibers: 2.6 },
            categoryId: "frutta",
            code: "BNN",
            tags: ["giallo"],
            reference: "",
            multiplier: 1
          }
        ])
    })
  );
});

describe("Sidebar", () => {
  it("rende la sidebar con filtro", async () => {
    render(
      <ValoriProvider>
        <AlimentiProvider>
          <Sidebar giorno={0} />
        </AlimentiProvider>
      </ValoriProvider>
    );

    expect(await screen.findByText("Alimenti")).toBeInTheDocument();
    expect(await screen.findByPlaceholderText("Cerca alimenti")).toBeInTheDocument();
  });
});
