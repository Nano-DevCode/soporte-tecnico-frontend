export const CONSUMABLE_BAG_EVENT = "custom_consumable_bag_changed";
const STORAGE_KEY = "custom_consumable_bag";

export const getConsumableBagIds = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveConsumableBagIds = (ids: string[]) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    // Notificamos a cualquier componente o custom hook que escuche
    window.dispatchEvent(new Event(CONSUMABLE_BAG_EVENT));
  } catch (error) {
    // console.error("Error en la bolsa:", error);
    void error;
  }
};