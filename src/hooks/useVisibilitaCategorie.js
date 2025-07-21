import { useEffect, useState } from "react";

const STORAGE_KEY = "categorieVisibili";

export function useVisibilitaCategorie() {
  const [categorieVisibili, setCategorieVisibili] = useState(() => {
    // Caricamento iniziale solo alla prima renderizzazione
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Errore parsing categorieVisibili:", err);
      }
    }
    return {}; // fallback
  });

  // Salvataggio automatico ogni volta che cambia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categorieVisibili));
  }, [categorieVisibili]);

  const toggle = (id) => {
    setCategorieVisibili((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const collassaTutte = (categorie) => {
    const iniziali = Object.fromEntries(
      categorie.map((cat) => [cat.id, false])
    );
    setCategorieVisibili(iniziali);
  };

  return {
    categorieVisibili,
    toggle,
    collassaTutte,
  };
}
