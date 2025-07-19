import { createContext, useContext, useEffect, useState } from "react";

const ValoriContext = createContext();

export function ValoriProvider({ children }) {
  const [valori, setValori] = useState({
    byName: {},
    byId: {},
    byCode: {},
    list: []
  });

  useEffect(() => {
    fetch("/data/foods.json")
      .then(res => res.json())
      .then(data => {
        const byName = {};
        const byId = {};
        const byCode = {};

        data.forEach(food => {
          const val = {
            cal: food.nutrients.calories,
            carb: food.nutrients.carbs,
            prot: food.nutrients.proteins,
            fat: food.nutrients.fats,
            fib: food.nutrients.fibers,
            unita: food.unit,
            name: food.name,
            id: food.id,
            code: food.code,
            categoryId: food.categoryId,
            tags: food.tags,
            reference: food.reference,
            multiplier: food.multiplier
          };

          byName[food.name] = val;
          byId[food.id] = val;
          byCode[food.code] = val;
        });

        setValori({
          byName,
          byId,
          byCode,
          list: data
        });
      })
      .catch(err =>
        console.error("Errore nel caricamento di foods.json", err)
      );
  }, []);

  return (
    <ValoriContext.Provider value={valori}>
      {children}
    </ValoriContext.Provider>
  );
}

export function useValori() {
  return useContext(ValoriContext);
}

export function useValoriPer100() {
  return useContext(ValoriContext).byName;
}
