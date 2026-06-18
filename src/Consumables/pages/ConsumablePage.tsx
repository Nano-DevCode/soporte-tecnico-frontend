import { Package, Plus } from "lucide-react";
import { Link } from "react-router";

import { CustomConsumableFilters } from "../components/CustomConsumableFilters";
import { ConsumableCard } from "../components/ConsumableCard";
import { useConsumables } from "../hooks/useConsumables";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import type { Consumable } from "../interfaces/consumable.interfaces";

import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { Button } from "@/components/ui/button";
import { t } from "i18next";

export const ConsumablePage = () => {
  const { consumables, meta, isLoading: skeletonLoading } = useConsumables();
  const { bagIds, toggleBagItem, isInBag } = useConsumableBagStore();

  return (
    // w-full asegura la expansión total del contenedor principal
    <div className="w-full space-y-6 px-1">
      {/* --- ENCABEZADO DE LA PÁGINA --- */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
        <div className="flex-1 w-full">
          <CustomTitleCard
            icon={Package}
            title={t("consumable_page_custom_title_card")}
            description={t("consumable_page_custom_description_card")}
          />
        </div>
        
        {/* CONTENEDOR DE ACCIONES (Expandido horizontalmente) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          {/* OPCIÓN 1: REGISTRAR LOTES/REMESAS (Entrada) */}
          <Link to="batches/create" className="w-full sm:w-auto">
            <Button className="relative w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold shadow-sm transition-all duration-200">
              <Package className="mr-2 h-4 w-4" />
              Registrar remesa ({bagIds.length})
              {bagIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {bagIds.length}
                </span>
              )}
            </Button>
          </Link>

          {/* NUEVA OPCIÓN 2: GENERAR MOVIMIENTO DE SALIDA */}
          <Link to="consumables/outputs/create" className="w-full sm:w-auto">
            <Button className="relative w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition-all duration-200">
              <Package className="mr-2 h-4 w-4" />
              Generar Salida ({bagIds.length})
              {bagIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {bagIds.length}
                </span>
              )}
            </Button>
          </Link>

          {/* CREAR NUEVO CONSUMIBLE EN EL CATÁLOGO */}
          <Link to="/consumables/create" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-700 hover:bg-blue-800 font-semibold shadow-sm transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              {t("consumable_page_create_consumable")}
            </Button>
          </Link>
        </div>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="w-full">
        <CustomConsumableFilters />
      </div>

      {/* --- RENDERIZADO CONDICIONAL --- */}
      {skeletonLoading ? (
        <div className="w-full">
          <CustomSkeletonTableCard />
        </div>
      ) : (
        <>
          {/* 
            Grid de pantalla completa optimizado: 
            Aumenta dinámicamente hasta 5 y 6 columnas en pantallas ultra anchas (FullHD, 2K o superiores)
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5 w-full">
            {consumables.map((item: Consumable) => {
              const stringId = String(item.id);
              const itemIsInBag = isInBag(stringId);

              return (
                <ConsumableCard
                  key={stringId}
                  item={item}
                  isInBag={itemIsInBag}
                  onToggleBag={() => toggleBagItem(stringId)}
                  handleDownClick={(consumable) => {
                    console.log("Acciones para:", consumable.description);
                  }}
                />
              );
            })}
          </div>

          {consumables.length === 0 && (
            <div className="w-full text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-background/50 shadow-sm">
              No se encontraron consumibles registrados
            </div>
          )}

          {/* Barra de paginación expandida */}
          <div className="w-full pt-4">
            <CustomPagination totalPages={meta?.lastPage ?? 1} />
          </div>
        </>
      )}
    </div>
  );
};