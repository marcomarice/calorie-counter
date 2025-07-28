import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

function mapFoods(data) {
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
  return { byName, byId, byCode, list: data };
}

const defaultValori = {
  byName: {},
  byId: {},
  byCode: {},
  list: [],
  preps: [] // NEW: preparazioni
};

const ValoriContext = createContext(defaultValori);

export function ValoriProvider({ children }) {
  const [valori, setValori] = useState(defaultValori);

  useEffect(() => {
    async function fetchData() {
      try {
        // Carica alimenti
        const foodsRes = await fetch("/data/foods.json");
        const foodsData = await foodsRes.json();
        const mappedFoods = mapFoods(foodsData);

        // Carica preparazioni
        const prepsRes = await fetch("/data/preps.json");
        const prepsData = await prepsRes.json();

        setValori({
          ...mappedFoods,
          preps: prepsData // NEW: aggiungi preps
        });
      } catch (err) {
        console.error("Errore nel caricamento dei dati", err);
      }
    }
    fetchData();
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
