/* eslint-disable @typescript-eslint/no-explicit-any */
// components/equipment/NetworkFields.tsx
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Importamos el selector genérico
import { CatalogSelector } from "../hooks/useCatalogs";

// Hook de Catálogo de Red
import { useNetworkTypes } from "../hooks/use-equipment-catalog";

interface NetworkFieldsProps {
    control: Control<any>;
    register: UseFormRegister<any>;
}

export const NetworkFields = ({ control, register }: NetworkFieldsProps) => {
    // 1. Instanciamos el hook (el factory interno maneja búsqueda y creación)
    const networkHook = useNetworkTypes();

    return (
        <div className="mt-6 p-6 border border-orange-200 rounded-xl bg-orange-100/50 grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold text-orange-700 flex items-center gap-2 border-b border-orange-200 pb-2">
                <Network size={18} className="text-orange-600" /> Detalles de Red
            </h3>

            {/* Tipo de Red (LAN, WLAN, VPN, etc.) */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Tipo de Red *</Label>
                <Controller
                    name="network.id_type_equipment_network"
                    control={control}
                    render={({ field }) => (
                        <CatalogSelector
                            hook={networkHook}
                            value={networkHook.options.find((t: any) => t.id === field.value) || null}
                            onChange={(val) => field.onChange(val?.id)}
                            placeholder="Seleccionar tipo..."
                        />
                    )}
                />
            </div>

            {/* Número de Puertos */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Número de Puertos</Label>
                <Input
                    type="number"
                    {...register("network.number_ports", { valueAsNumber: true })}
                    placeholder="Ej. 24"
                    className="bg-white border-zinc-300 focus:ring-orange-500"
                />
            </div>

            {/* PoE Checkbox con Controller para consistencia */}
            <div className="flex items-center space-x-4">
                <Controller
                    name="network.PoE"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is-poe"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-zinc-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                            />
                            <Label 
                                htmlFor="is-poe" 
                                className="text-sm font-medium leading-none cursor-pointer text-slate-700"
                            >
                                ¿Soporta PoE?
                            </Label>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

// import { Controller } from "react-hook-form";
// import { Network, Hash, Zap, ZapOff, Activity } from "lucide-react";

// // UI Components
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch"; // Asegúrate de tener el componente Switch de shadcn
// import { cn } from "@/lib/utils";

// // Componentes de Formulario compartidos
// import { InfiniteScrollSelect } from "./infinite-scroll-select";

// interface CatalogHook {
//     data: any[];
//     setSearch: (value: string) => void;
//     fetchNextPage: () => void;
//     hasNextPage: boolean | undefined;
//     isLoading: boolean;
//     isFetchingNextPage?: boolean;
// }

// interface NetworkFieldsProps {
//     form: any;
//     catalogs: {
//         networkTypes: CatalogHook; // Ej. Switch, Router, Firewall, AP
//     };
//     actions: {
//         onCreateNetworkType: (name: string) => Promise<void>;
//     };
// }

// export const NetworkFields = ({ form, catalogs, actions }: NetworkFieldsProps) => {
//     const { control, register, watch, formState: { errors } } = form;

//     // Observamos el valor de PoE para cambiar el estilo visual dinámicamente
//     const isPoE = watch("PoE");

//     return (
//         <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

//             {/* SECCIÓN 1: CATEGORIZACIÓN DE RED */}
//             <div className="space-y-2">
//                 <Label className={cn("text-[10px] font-bold uppercase tracking-widest text-muted-foreground", errors.id_type_equipment_network && "text-red-500")}>
//                     Tipo de Dispositivo de Red <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                     name="id_type_equipment_network"
//                     control={control}
//                     render={({ field }) => (
//                         <InfiniteScrollSelect
//                             options={catalogs.networkTypes.data}
//                             value={field.value}
//                             onChange={field.onChange}
//                             onSearch={catalogs.networkTypes.setSearch}
//                             fetchNextPage={catalogs.networkTypes.fetchNextPage}
//                             hasNextPage={!!catalogs.networkTypes.hasNextPage}
//                             isLoading={catalogs.networkTypes.isLoading}
//                             isFetchingNextPage={!!catalogs.networkTypes.isFetchingNextPage}
//                             placeholder="Ej. Switch Administrable, Router, Access Point..."
//                             allowCreate={true}
//                             onCreate={actions.onCreateNetworkType}
//                             icon={Network}
//                         />
//                     )}
//                 />
//                 {errors.id_type_equipment_network && <p className="text-xs font-medium text-red-500">{errors.id_type_equipment_network.message}</p>}
//             </div>

//             {/* SECCIÓN 2: ESPECIFICACIONES DE PUERTOS Y ENERGÍA */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                 {/* Número de Puertos */}
//                 <div className="space-y-2">
//                     <Label className={cn("text-[10px] font-bold uppercase tracking-widest text-muted-foreground", errors.number_ports && "text-red-500")}>
//                         Cantidad de Puertos
//                     </Label>
//                     <div className="relative">
//                         <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                         <Input
//                             {...register("number_ports", { valueAsNumber: true })}
//                             type="number"
//                             min="0"
//                             className="pl-9 bg-muted/10 border-zinc-800 focus:ring-primary"
//                             placeholder="Ej. 24"
//                         />
//                     </div>
//                     {errors.number_ports && <p className="text-xs font-medium text-red-500">{errors.number_ports.message}</p>}
//                 </div>

//                 {/* Switch PoE */}
//                 <div className={cn(
//                     "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
//                     isPoE
//                         ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)]"
//                         : "bg-zinc-950/50 border-zinc-800"
//                 )}>
//                     <div className="flex items-center gap-3">
//                         <div className={cn(
//                             "p-2 rounded-md transition-colors",
//                             isPoE ? "bg-amber-500/20 text-amber-500" : "bg-zinc-800 text-zinc-500"
//                         )}>
//                             {isPoE ? <Zap className="h-4 w-4 fill-current" /> : <ZapOff className="h-4 w-4" />}
//                         </div>
//                         <div>
//                             <p className="text-sm font-semibold">Soporta PoE</p>
//                             <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Power over Ethernet</p>
//                         </div>
//                     </div>

//                     <Controller
//                         name="PoE"
//                         control={control}
//                         render={({ field }) => (
//                             <Switch
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}
//                             />
//                         )}
//                     />
//                 </div>

//             </div>

//             {/* FOOTER DE ESTADO */}
//             <div className="flex items-center gap-2 px-1 text-muted-foreground/60 border-t border-zinc-900 pt-4">
//                 <Activity className="h-3 w-3" />
//                 <span className="text-[10px] uppercase tracking-widest font-medium">
//                     Configuración de infraestructura de red
//                 </span>
//             </div>
//         </div>
//     );
// };