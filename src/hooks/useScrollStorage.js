import { useEffect, useState } from "react";

export function useScrollStorage(storageKey = "scrollPos") {
  const [scrollPos, setScrollPos] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setScrollPos(JSON.parse(stored));
  }, [storageKey]);

  const updateScrollPos = (catId, value) => {
    const updated = { ...scrollPos, [catId]: value };
    setScrollPos(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return [scrollPos, updateScrollPos];
}
