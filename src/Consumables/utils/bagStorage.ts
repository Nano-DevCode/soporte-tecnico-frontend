export const CONSUMABLE_BAG_EVENT = "custom_consumable_bag_changed";
const STORAGE_KEY = "custom_consumable_bag";

export const getConsumableBagIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveConsumableBagIds = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    // Notificamos a cualquier componente o custom hook que escuche
    window.dispatchEvent(new Event(CONSUMABLE_BAG_EVENT));
  } catch (error) {
    console.error("Error guardando la bolsa:", error);
  }
};