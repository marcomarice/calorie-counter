import { createContext, useContext, useEffect, useState } from "react";

// Crea il context
const ValoriContext = createContext();

// Provider globale da usare in App
export function ValoriProvider({ children }) {
  const [valori, setValori] = useState({});

  useEffect(() => {
    fetch("/data/alimenti.json")
      .then(res => res.json())
      .then(setValori)
      .catch(err => console.error("Errore nel caricamento di alimenti.json", err));
  }, []);

  return (
    <ValoriContext.Provider value={valori}>
      {children}
    </ValoriContext.Provider>
  );
}

// Hook per accedere al context nei componenti
export function useValoriPer100() {
  return useContext(ValoriContext);
}
