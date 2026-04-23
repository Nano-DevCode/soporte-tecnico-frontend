import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus, AlertTriangle, LayoutGrid, Monitor, Printer, Network, Box } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { Button } from "@/components/ui/button";
import { CustomEquipmentFilters } from "../components/CustomEquipmentFilters";
import { CustomEquipmentDesktopTable } from "../components/CustomEquipmentDesktopTable";
import { CustomEquipmentMobileCard } from "../components/CustomEquipmentMobileCard";
import { useEquipments } from "../hooks/useEquipments";
import type { EquipmentCategory } from "../interfaces/equipment.interface";

const GET_HEADER_CONFIG = (category: string) => {
  const configs: Record<string, { title: string; icon: any }> = {
    all: { title: 'General', icon: LayoutGrid },
    computer: { title: 'Cómputo', icon: Monitor },
    computadora: { title: 'Cómputo', icon: Monitor },
    printer: { title: 'Impresión', icon: Printer },
    impresora: { title: 'Impresión', icon: Printer },
    network: { title: 'Red', icon: Network },
    red: { title: 'Red', icon: Network },
  };
  return configs[category.toLowerCase()] || { title: category, icon: Box };
};

export const EquipmentPage = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
  const { title, icon } = GET_HEADER_CONFIG(currentCategory);

  const { equipments, meta, isLoading } = useEquipments();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDeleteClick = useCallback((id: string) => {
    setSelectedId(id);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (selectedId) {
      // await deleteEquipment(selectedId);
      setIsDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CustomTitleCard
          title="Gestión de Equipos"
          description={currentCategory === 'all' ? "Inventario completo" : `Equipos de ${title}`}
          icon={icon}
        />
        <Button asChild className="bg-blue-700 hover:bg-blue-800">
          <Link to={currentCategory === 'all' ? '/equipments/create' : `/equipments/create?category=${currentCategory}`}>
            <Plus className="mr-2 h-4 w-4" />
            {/* Lógica dinámica para el texto del botón */}
            {currentCategory === 'all'
              ? 'Agregar Equipo'
              : `Agregar un Equipo  ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`
            }
          </Link>
        </Button>
      </div>

      <CustomEquipmentFilters />

      {isLoading ? (
        <CustomSkeletonTableCard />
      ) : (
        <div className="space-y-4">
          <CustomEquipmentDesktopTable
            equipments={equipments}
            category={currentCategory}
            onDelete={handleDeleteClick}
          />
          <CustomEquipmentMobileCard
            equipments={equipments}
            category={currentCategory}
            onDelete={handleDeleteClick}
          />

          {/* Sincronización con lastPage del backend */}
          <CustomPagination totalPages={meta?.lastPage ?? 0} />
        </div>
      )}

      <CustomDialogConfirm
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="¿Confirmar eliminación?"
        description="Esta acción marcará el equipo como 'Baja' en el sistema."
        icon={AlertTriangle}
        variant="danger"
      />
    </div>
  );
};



// import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
// import { CustomPagination } from "@/components/custom/CustomPagination";
// import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
// import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
// import { Button } from "@/components/ui/button";
// import { AlertTriangle, ArrowUpCircle, Plus, Users } from "lucide-react";
// import { useState, useCallback, useMemo } from "react";
// import { Link } from "react-router";
// import type { Department } from "../interfaces/department.interface";
// import { useDepartments } from "../hooks/useDepartments";
// import { CustomEquipmentDesktopTable } from "../components/CustomEquipmentDesktopTable";
// import { cn } from "@/lib/utils";
// import { CustomEquipmentFilters } from "../components/CustomEquipmentFilters";
// import { CustomDepartmentMobileCard } from "../components/CustomDepartmentMobileCard";

// export const EquipmentPage = () => {
//   const { departments, meta, isLoading: skelettonLoading, isUpdating, changeStatus } = useDepartments();
//   const [statusDialogOpen, setStatusDialogOpen] = useState(false);
//   const [departmentSelect, setDepartmentSeleccionado] = useState<Department | null>(null);

//   const handleDownClick = useCallback((department: Department) => {
//     setDepartmentSeleccionado(department);
//     setStatusDialogOpen(true);
//   }, []);

//   const handleDownConfirm = async () => {
//     if (!departmentSelect) return;

//     try {
//       await changeStatus({
//         id: departmentSelect.id || "",
//         status: !departmentSelect.status
//       });
//       setStatusDialogOpen(false);
//     } catch (error) {
//       console.error("Error al actualizar el estado:", error);
//     }
//   };

//   const dialogDescription = useMemo(() => {
//     if (!departmentSelect) return null;

//     return (
//       <div className="space-y-2">
//         <div className={cn(
//           "rounded-lg p-3 border",
//           departmentSelect.status
//             ? "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50"
//             : "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50"
//         )}>
//           <p className={cn(
//             "font-bold text-lg",
//             departmentSelect.status ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"
//           )}>
//             {departmentSelect.name ?? 'Nombre no disponible'}
//           </p>
//           <p className={cn(
//             "text-[10px] font-mono mt-1",
//             departmentSelect.status ? "text-red-600/70 dark:text-red-400/50" : "text-blue-600/70 dark:text-blue-400/50"
//           )}>
//             ID: {departmentSelect.id}
//           </p>
//         </div>

//         <p className="text-sm italic pt-1 text-muted-foreground">
//           {departmentSelect.status
//             ? "Esta acción impedirá que el departamento sea asignado a nuevos registros."
//             : "Esta acción permitirá que el departamento vuelva a aparecer en las listas de selección."}
//         </p>
//       </div>
//     );
//   }, [departmentSelect]);

//   return (
//     <div className="space-y-6">

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <CustomTitleCard icon={Users} title="Este es una prueba" description="Administra los departamentos del sistema"/>
//         <Button className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800" asChild>
//           <Link to="/department/create">
//             <Plus className="mr-2 h-4 w-4" />
//             AQUI ESTA LA VITA GENERAL
//           </Link>
//         </Button>
//       </div>

//       {/* Custom Dialog para cambiar el estatus del departamento */}
//       <CustomDialogConfirm
//         open={statusDialogOpen}
//         isLoading={isUpdating}
//         variant={departmentSelect?.status ? "danger" : "primary"}
//         title={departmentSelect?.status ? "Confirmar baja del departamento" : "Confirmar alta del departamento"}
//         description={dialogDescription}
//         icon={departmentSelect?.status ? AlertTriangle : ArrowUpCircle}
//         onConfirm={handleDownConfirm}
//         onOpenChange={setStatusDialogOpen}
//         confirmText={departmentSelect?.status ? "Sí, dar de baja" : "Sí, dar de alta"}
//         cancelText="Cancelar"
//       />

//       {/* Filtro personalizado para departamentos */}
//       <CustomEquipmentFilters/>

//       {/* Tabla de departamentos en PC y Cards para Mobile con skeletton*/}
//       {skelettonLoading ? (
//         <CustomSkeletonTableCard/>
//       ) : (
//         <>
//           {/* Version PC */}
//           <CustomEquipmentDesktopTable
//             departments={departments}
//             handleDownClick={handleDownClick}
//           />
//           {/* Version Mobile */}
//           <CustomDepartmentMobileCard
//             departments={departments}
//             handleDownClick={handleDownClick}
//           />

//           <CustomPagination totalPages={meta?.lastPage ?? 0} />
//         </>
//       )}
//     </div>
//   );
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7
// import { useCallback, useState } from "react";
// import { Link, useSearchParams } from "react-router";
// import { Plus, AlertTriangle, LayoutGrid, Monitor, Printer, Network, Box } from "lucide-react";

// import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
// import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
// import { CustomPagination } from "@/components/custom/CustomPagination";
// import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
// import { Button } from "@/components/ui/button";

// import { CustomEquipmentFilters } from "../components/CustomEquipmentFilters";
// import { CustomEquipmentDesktopTable } from "../components/CustomEquipmentDesktopTable";
// import { CustomEquipmentMobileCard } from "../components/CustomEquipmentMobileCard";

// import { useEquipments } from "../hooks/useEquipments";
// import type { EquipmentCategory } from "../interfaces/equipment.interface";

// // 1. Mapeo dinámico de iconos y títulos para el Header
// const GET_HEADER_CONFIG = (category: string) => {
//   const configs: Record<string, { title: string; icon: any }> = {
//     all: { title: 'General', icon: LayoutGrid },
//     computer: { title: 'Cómputo', icon: Monitor },
//     computadora: { title: 'Cómputo', icon: Monitor },
//     printer: { title: 'Impresión', icon: Printer },
//     impresora: { title: 'Impresión', icon: Printer },
//     network: { title: 'Red', icon: Network },
//     red: { title: 'Red', icon: Network },
//   };

//   return configs[category.toLowerCase()] || { title: category, icon: Box };
// };
// // EquipmentPage.tsx
// export const EquipmentPage = () => {
//   const [searchParams] = useSearchParams();
//   const currentCategory = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
//   const { title, icon } = GET_HEADER_CONFIG(currentCategory);

//   const { equipments, isLoading, meta } = useEquipments();

//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState<string | null>(null);

//   const handleDeleteClick = useCallback((id: string) => {
//     setSelectedId(id);
//     setIsDeleteDialogOpen(true);
//   }, []);

//   const handleConfirmDelete = async () => {
//     if (selectedId) {
//       // await deleteEquipment(selectedId);
//       setIsDeleteDialogOpen(false);
//       setSelectedId(null);
//     }
//   };

//   return (
//     <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <CustomTitleCard
//           title="Gestión de Equipos"
//           description={currentCategory === 'all' ? "Inventario completo" : `Equipos de ${title}`}
//           icon={icon}
//         />
//         <Button asChild>
//           <Link to={currentCategory === 'all' ? '/equipments/create' : `/equipments/create?category=${currentCategory}`}>
//             <Plus className="mr-2 h-4 w-4" /> Nuevo Equipo
//           </Link>
//         </Button>
//       </div>

//       <CustomEquipmentFilters />

//       {isLoading ? (
//         <CustomSkeletonTableCard />
//       ) : (
//         <div className="space-y-4">
//           <CustomEquipmentDesktopTable
//             equipments={equipments}
//             category={currentCategory}
//             onDelete={handleDeleteClick}
//           />

//           <CustomEquipmentMobileCard
//             equipments={equipments}
//             category={currentCategory}
//             onDelete={handleDeleteClick}
//           />

//           {/* Pasamos el totalPages del meta que viene del servidor */}
//           {/* <CustomPagination totalPages={(meta as any)?.lastPage ?? 0} /> */}<CustomPagination totalPages={meta?.lastPage ?? 0} />

//         </div>
//       )}

//       <CustomDialogConfirm
//         open={isDeleteDialogOpen}
//         onOpenChange={setIsDeleteDialogOpen}
//         onConfirm={handleConfirmDelete}
//         title="¿Confirmar eliminación?"
//         description="Esta acción marcará el equipo como 'Baja'."
//         icon={AlertTriangle}
//       />
//     </div>
//   );
// };