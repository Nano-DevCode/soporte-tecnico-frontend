import { useState, useEffect } from "react";
import { getConsumableBagIds, saveConsumableBagIds, CONSUMABLE_BAG_EVENT } from "../utils/bagStorage";
import type { Consumable } from "../interfaces/consumable.interfaces";

export const useConsumableBagStore = () => {
  const [bagIds, setBagIds] = useState<string[]>(() => getConsumableBagIds());

  // Escuchar eventos globales para mantener la bolsa sincronizada entre páginas/componentes
  useEffect(() => {
    const handleBagChange = () => {
      setBagIds(getConsumableBagIds());
    };

    window.addEventListener(CONSUMABLE_BAG_EVENT, handleBagChange);
    return () => window.removeEventListener(CONSUMABLE_BAG_EVENT, handleBagChange);
  }, []);
  const toggleBagItem = (id: string) => {
    const currentBag = getConsumableBagIds();
    const newBag = currentBag.includes(id)
      ? currentBag.filter((item) => item !== id)
      : [...currentBag, id];

    saveConsumableBagIds(newBag); // <- Llama a la utilidad que dispara el Custom Event
  };

  const removeItem = (id: string) => {
    const currentBag = getConsumableBagIds();
    const newBag = currentBag.filter((item) => item !== id);
    saveConsumableBagIds(newBag); // Los componentes se enterarán al instante
  };
  const clearBag = () => {
    saveConsumableBagIds([]);
  };
  const saveFormDraft = (data: Consumable) => {
    sessionStorage.setItem("form_draft", JSON.stringify(data));
  };

  const getFormDraft = (): Consumable | null => {
    const draft = sessionStorage.getItem("form_draft");
    return draft ? (JSON.parse(draft) as Consumable) : null;
  };

  return {
    bagIds,
    toggleBagItem,
    removeItem,
    clearBag,
    saveFormDraft,
    getFormDraft,
    isInBag: (id: string) => bagIds.includes(String(id)),
  };
};