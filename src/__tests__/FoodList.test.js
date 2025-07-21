import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FoodList from "../components/sidebar/FoodList";

describe("FoodList", () => {
  const alimenti = [
    {
      code: "F01",
      name: "Banana",
      unit: "g",
      tags: ["frutta"],
      nutrients: {},
    },
    {
      code: "F02",
      name: "Mela",
      unit: "g",
      tags: ["frutta"],
      nutrients: {},
    }
  ];

  it("filtra correttamente e mostra bottoni", () => {
    const mockAdd = jest.fn();

    render(<FoodList alimenti={alimenti} filtro="ban" onAggiungi={mockAdd} />);
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.queryByText("Mela")).toBeNull();

    const button = screen.getByText("+100g");
    fireEvent.click(button);
    expect(mockAdd).toHaveBeenCalledWith(alimenti[0], 100);
  });
});
