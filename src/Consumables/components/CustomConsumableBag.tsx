export const CONSUMABLE_BAG_EVENT = "custom_consumable_bag_changed";
const STORAGE_KEY = "custom_consumable_bag";

export const getConsumableBagIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addToConsumableBag = (consumableId: string) => {
  const currentBag = getConsumableBagIds();
  if (!currentBag.includes(consumableId)) {
    const newBag = [...currentBag, consumableId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBag));
    window.dispatchEvent(new Event(CONSUMABLE_BAG_EVENT));
  }
};

export const removeFromConsumableBag = (consumableId: string) => {
  const currentBag = getConsumableBagIds();
  const newBag = currentBag.filter((id) => id !== consumableId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBag));
  window.dispatchEvent(new Event(CONSUMABLE_BAG_EVENT));
};

export const isInConsumableBag = (consumableId: string): boolean => {
  return getConsumableBagIds().includes(consumableId);
};