import { Package, Plus } from "lucide-react";
import { Link } from "react-router";

import { CustomConsumableFilters } from "../components/CustomConsumableFilters";
import { ConsumableCard } from "../components/ConsumableCard";
import { useConsumables } from "../hooks/useConsumables";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
// CORREGIDO: Importamos el tipo Consumable directamente de tus interfaces centrales
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
    <div className="space-y-6">
      {/* --- ENCABEZADO DE LA PÁGINA --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CustomTitleCard
          icon={Package}
          title={t("consumable_page_custom_title_card")}
          description={t("consumable_page_custom_description_card")}
        />
        {/* CONTENEDOR DE ACCIONES (ACTUALIZADO) */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* OPCIÓN 1: REGISTRAR LOTES/REMESAS (Entrada) */}
          <Link to="batches/create" className="w-full sm:w-auto">
            <Button className="relative w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold animate-in fade-in zoom-in-95 duration-200">
              <Package className="mr-2 h-4 w-4" />
              Registrar remesa ({bagIds.length})
              {bagIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {bagIds.length}
                </span>
              )}
            </Button>
          </Link>

          {/* NUEVA OPCIÓN 2: GENERAR MOVIMIENTO DE SALIDA (Ticket, Uso Interno, Dañado) */}
          <Link to="consumables/outputs/create" className="w-full sm:w-auto">
            <Button className="relative w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold">
              <Package className="mr-2 h-4 w-4" />
              Generar Salida ({bagIds.length})
              {bagIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {bagIds.length}
                </span>
              )}
            </Button>
          </Link>

          {/* CREAR NUEVO CONSUMIBLE EN EL CATÁLOGO */}
          <Link to="/consumables/create" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-700 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              {t("consumable_page_create_consumable")}
            </Button>
          </Link>
        </div>
        </div>

        {/* CONTENEDOR DE ACCIONES */}
        {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"> */}
        {/* CORREGIDO: Si estás parado en la ruta /consumables, para ir a batches debe ser absoluta o subir un nivel si corresponde */}
        {/* <Link to="batches/create" className="w-full sm:w-auto">
            <Button className="relative w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold animate-in fade-in zoom-in-95 duration-200">
              <Package className="mr-2 h-4 w-4" />
              Registrar remesa ({bagIds.length})
              {bagIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {bagIds.length}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/consumables/create" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-700 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" />
              {t("consumable_page_create_consumable")}
            </Button>
          </Link>
        </div>
      </div> */}

        {/* --- BARRA DE FILTROS --- */}
        <CustomConsumableFilters />

        {/* --- RENDERIZADO CONDICIONAL --- */}
        {skeletonLoading ? (
          <CustomSkeletonTableCard />
        ) : (
          <>
            {/* Grid adaptable estilo e-commerce */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="text-center py-12 text-muted-foreground border rounded-xl bg-background/50">
                No se encontraron consumibles registrados
              </div>
            )}

            <CustomPagination totalPages={meta?.lastPage ?? 1} />
          </>
        )}
      </div>
      );
};