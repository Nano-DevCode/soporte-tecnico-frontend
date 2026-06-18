import { memo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FilterX, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CatalogSelector } from "./CatalogSelector";
import { CustomFilterDate } from "@/components/custom/CustomFilterDate";

import {
    useMovementTypesConsumables,
    useMovementAplicationsConsumables,
    useDepartmentsConsumables
} from "../hooks/useConsumableCatalog";

export const CustomMovementHistoryFilters = memo(() => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const typeHook = useMovementTypesConsumables();
    const applicationHook = useMovementAplicationsConsumables();
    const departmentHook = useDepartmentsConsumables();

    const queryFilter = searchParams.get("search") || "";
    const startDateFilter = searchParams.get("startDate") || "";
    const endDateFilter = searchParams.get("endDate") || "";

    const [textSearch, setTextSearch] = useState(queryFilter);

    // Guardamos una referencia para saber si el cambio de texto vino del teclado del usuario
    const isFirstRender = useRef(true);

    // Sincronizar el input si el parámetro 'search' cambia externamente (ej. al limpiar filtros)
    useEffect(() => {
        setTextSearch(queryFilter);
    }, [queryFilter]);

    // DEBOUNCE OPTIMIZADO: Solo altera la URL si el usuario escribe en el input
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            const currentUrlSearch = searchParams.get("search") || "";
            if (textSearch.trim() === currentUrlSearch.trim()) return;

            const newParams = new URLSearchParams(searchParams);
            if (textSearch.trim() === "") {
                newParams.delete("search");
            } else {
                newParams.set("search", textSearch.trim());
            }

            newParams.set("page", "1");
            setSearchParams(newParams);
        }, 400);

        return () => clearTimeout(timer);
    }, [textSearch]);

    const selectedType = searchParams.get("id_movement_type")
        ? {
            id: searchParams.get("id_movement_type")!,
            name: typeHook.options.find(o => String(o.id) === searchParams.get("id_movement_type"))?.name || ("Seleccionado...")
        }
        : null;

    const selectedApp = searchParams.get("id_movement_aplication")
        ? {
            id: searchParams.get("id_movement_aplication")!,
            name: applicationHook.options.find(o => String(o.id) === searchParams.get("id_movement_aplication"))?.acronym || ("Seleccionado...")
        }
        : null;

    const selectedDept = searchParams.get("id_departament_consumable")
        ? {
            id: searchParams.get("id_departament_consumable")!,
            name: departmentHook.options.find(o => String(o.id) === searchParams.get("id_departament_consumable"))?.name || ("Seleccionado...")
        }
        : null;

    const handleSelectChange = (key: string, value: { id: string | number; name: string } | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (!value) {
            newParams.delete(key);
        } else {
            newParams.set(key, String(value.id));
        }
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    // Helper para actualizar las fechas directamente en la URL manteniendo la consistencia
    const updateMultipleFilters = (filtersToUpdate: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(filtersToUpdate).forEach(([key, value]) => {
            if (!value) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });

        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    const resetFilters = () => {
        setSearchParams({});
        setTextSearch("");
    };

    const hasActiveFilters = searchParams.has("search") ||
        searchParams.has("id_movement_type") ||
        searchParams.has("id_movement_aplication") ||
        searchParams.has("id_departament_consumable") ||
        searchParams.has("startDate") ||
        searchParams.has("endDate");

    return (
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
            
            {/* FILA 1: BÚSQUEDA GENERAL + DEPARTAMENTO (50% y 50% en pantallas medianas/grandes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                        type="text"
                        placeholder="Buscar por Folio, observaciones o descripción..."
                        className="w-full pl-9 bg-background h-10 focus-visible:ring-primary"
                        value={textSearch}
                        onChange={(e) => setTextSearch(e.target.value)}
                    />
                </div>

                <CatalogSelector
                    hookResult={departmentHook}
                    value={selectedDept}
                    onChange={(val) => handleSelectChange("id_departament_consumable", val)}
                    placeholder="Departamento"
                    allowCreate={false}
                />
            </div>

            {/* FILA 2: LOS 4 FILTROS RESTANTES JUNTOS + BOTÓN LIMPIAR */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                {/* Grid secundario de 4 columnas perfectas para Tipo, Aplicación y Fechas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                    <CatalogSelector
                        hookResult={typeHook}
                        value={selectedType}
                        onChange={(val) => handleSelectChange("id_movement_type", val)}
                        placeholder="Tipo Movimiento"
                        allowCreate={false}
                    />

                    <CatalogSelector
                        hookResult={applicationHook}
                        value={selectedApp}
                        onChange={(val) => handleSelectChange("id_movement_aplication", val)}
                        placeholder="Aplicación"
                        allowCreate={false}
                    />

                    <CustomFilterDate
                        label={t('tickets.filters.date.from') || "Desde"}
                        value={startDateFilter}
                        onChange={(val) => updateMultipleFilters({ startDate: val })}
                        maxDate={endDateFilter ? new Date(`${endDateFilter}T00:00:00`) : undefined}
                    />

                    <CustomFilterDate
                        label={t('tickets.filters.date.to') || "Hasta"}
                        value={endDateFilter}
                        onChange={(val) => updateMultipleFilters({ endDate: val })}
                        minDate={startDateFilter ? new Date(`${startDateFilter}T00:00:00`) : undefined}
                    />
                </div>

                {/* Acción de limpiar filtros - Acoplado limpiamente a la derecha */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={resetFilters}
                        size="sm"
                        className="h-10 px-4 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-input transition-all rounded-md flex items-center justify-center gap-2 whitespace-nowrap shrink-0 w-full lg:w-auto"
                    >
                        <FilterX className="h-4 w-4" />
                        <span>{t("common.filters.clean") || "Limpiar"}</span>
                    </Button>
                )}
            </div>
        </div>
    );
});

CustomMovementHistoryFilters.displayName = "CustomMovementHistoryFilters";