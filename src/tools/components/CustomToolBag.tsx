export const TOOL_BAG_EVENT = "toolBagUpdated";
const STORAGE_KEY = "custom_tool_bag";

// Cambiado: Ahora recibe 'toolId: string'
export const addToToolBag = (toolId: string) => {
  // Leemos el arreglo que ahora es de puros strings
  const currentBag: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // Verificamos si el ID ya existe usando .includes()
  if (!currentBag.includes(toolId)) {
    const newBag = [...currentBag, toolId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBag));
    window.dispatchEvent(new Event(TOOL_BAG_EVENT));
  }
};

// Se mantiene igual: Recibe 'toolId: string'
export const removeFromToolBag = (toolId: string) => {
  const currentBag: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // Filtramos los strings directamente
  const newBag = currentBag.filter((id: string) => id !== toolId);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBag));
  window.dispatchEvent(new Event(TOOL_BAG_EVENT)); 
};