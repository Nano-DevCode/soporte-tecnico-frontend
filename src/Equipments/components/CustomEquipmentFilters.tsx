// import { memo, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { FilterX, Search, Monitor, Printer, Network } from "lucide-react";
// import { useSearchParams } from "react-router";

// export const CustomEquipmentFilters = memo(() => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Valores actuales de la URL
//   const searchTerm = searchParams.get("search") || "";
//   const currentCategory = searchParams.get("category") || "computer";

//   const updateFilters = (key: string, value: string) => {
//     const newParams = new URLSearchParams(searchParams);

//     if (!value || value === "all") {
//       newParams.delete(key);
//     } else {
//       newParams.set(key, value);
//     }

//     newParams.set("page", "1"); // Resetear a la primera página al filtrar
//     setSearchParams(newParams);
//   };

//   const resetFilters = () => {
//     // IMPORTANTE: Al resetear, mantenemos la categoría actual
//     setSearchParams({ category: currentCategory });
//     if (inputRef.current) inputRef.current.value = "";
//   };

//   const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key !== "Enter") return;
//     e.preventDefault();
//     updateFilters("search", inputRef.current?.value || "");
//   };

//   return (
//     <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">
      
//       {/* Buscador de Equipos (Folio o Modelo) */}
//       <div className="relative flex-1">
//         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
//         <Input
//           placeholder="Buscar por inventario, modelo o serie..."
//           className="pl-9 h-10 bg-background/60 focus-visible:ring-primary"
//           defaultValue={searchTerm}
//           ref={inputRef}
//           onKeyDown={handleSearch}
//         />
//       </div>

//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        
//         {/* Filtro de Categoría (IDs: 1, 2, 3) */}
//         <Select 
//           value={currentCategory} 
//           onValueChange={(v) => updateFilters("category", v)}
//         >
//           <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background/60">
//             <SelectValue placeholder="Tipo de Equipo" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="computer">
//               <div className="flex items-center gap-2">
//                 <Monitor className="h-4 w-4 text-blue-500" />
//                 <span>Computadoras</span>
//               </div>
//             </SelectItem>
//             <SelectItem value="printer">
//               <div className="flex items-center gap-2">
//                 <Printer className="h-4 w-4 text-emerald-500" />
//                 <span>Impresoras</span>
//               </div>
//             </SelectItem>
//             <SelectItem value="network">
//               <div className="flex items-center gap-2">
//                 <Network className="h-4 w-4 text-orange-500" />
//                 <span>Red / Otros</span>
//               </div>
//             </SelectItem>
//           </SelectContent>
//         </Select>

//         {/* Botón Limpiar Filtros (Solo se muestra si hay una búsqueda activa) */}
//         {searchTerm && (
//           <Button 
//             variant="ghost" 
//             onClick={resetFilters}
//             className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20"
//           >
//             <FilterX className="h-4 w-4 mr-2" />
//             <span>Limpiar</span>
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// });

import { memo, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { Search, FilterX, LayoutGrid, Laptop, Printer, Network, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEquipmentTypesAction } from "../actions/get-equipmentType.action";

// Mapa de iconos para que se vean bien según el nombre que mande el back
const ICON_MAP: Record<string, any> = {
  computadora: Laptop,
  impresora: Printer,
  red: Network,
  default: Box
};

export const CustomEquipmentFilters = memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";

  // --- CARGA AUTÓNOMA ---
  useEffect(() => {
    getEquipmentTypesAction().then(setCategories);
  }, []);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "all") newParams.delete(key);
    else newParams.set(key, value);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card/50 shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder="Buscar equipo..."
          className="pl-9 h-10"
          defaultValue={searchTerm}
          ref={inputRef}
          onKeyDown={(e) => e.key === "Enter" && updateFilters("search", inputRef.current?.value || "")}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={currentCategory} onValueChange={(v) => updateFilters("category", v)}>
          <SelectTrigger className="w-full sm:w-[200px] h-10">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {/* Opción General fija */}
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-slate-500" />
                <span>Todos los Equipos</span>
              </div>
            </SelectItem>

            {/* OPCIONES DINÁMICAS: Se rellenan solas con lo que mande el Back */}
            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.name.toLowerCase()] || ICON_MAP.default;
              return (
                <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="capitalize">{cat.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {(searchTerm || currentCategory !== "all") && (
          <Button variant="ghost" onClick={() => setSearchParams({category: "all"})} className="h-10">
            <FilterX className="h-4 w-4 mr-2" /> Limpiar
          </Button>
        )}
      </div>
    </div>
  );
});