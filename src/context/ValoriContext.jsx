import React, { createContext, useContext, useState, useEffect } from "react";

const ValoriContext = createContext();

export const ValoriProvider = ({ children }) => {
  const [valori, setValori] = useState({
    list: [],
    byId: {},
    byName: {},
    preps: [],
    prepsById: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [foodsRes, prepsRes] = await Promise.all([
          fetch("/data/foods.json"),
          fetch("/data/preps.json")
        ]);

        if (!foodsRes.ok || !prepsRes.ok) {
          throw new Error("Errore nel caricamento dei dati");
        }

        const foodsData = await foodsRes.json();
        const prepsData = await prepsRes.json();

        // Normalizzazione alimenti
        const foods = foodsData.map(food => ({
          ...food,
          nutrients: { ...food.nutrients },
          reference: food.reference || "per_100",
          multiplier: food.multiplier || 100,
          price: food.price ?? 0,
          packageSize: food.packageSize ?? 1
        }));

        const byId = {};
        const byName = {};
        foods.forEach(food => {
          byId[food.id] = food;
          byName[food.name.toLowerCase()] = food;
        });

        // Normalizzazione preparazioni
        const preps = prepsData.map(prep => ({
          ...prep,
          reference: prep.reference || "per_piece",
          multiplier: prep.multiplier || 1
        }));

        const prepsById = {};
        preps.forEach(prep => {
          prepsById[prep.id] = prep;
        });

        // Settiamo tutto nel contesto
        setValori({
          list: foods,
          byId,
          byName,
          preps,
          prepsById
        });
      } catch (err) {
        console.error("Errore nel caricamento dei dati:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <ValoriContext.Provider value={{ ...valori, loading, error }}>
      {children}
    </ValoriContext.Provider>
  );
};

export const useValori = () => useContext(ValoriContext);
