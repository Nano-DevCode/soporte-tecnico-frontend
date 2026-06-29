import { memo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { t } from "i18next"; // <-- Cambiado por el hook reactivo

// Importación de tus selectores e infraestructura factory
import { CatalogSelector } from "./CatalogSelector";
import {
    useTypeConsumables,
    useUnitMeasurementConsumables,
    useUbicationConsumables
} from "../hooks/useConsumableCatalog";

export const CustomConsumableFilters = memo(() => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Inicialización de los hooks del Factory
    const typeHook = useTypeConsumables();
    const unitHook = useUnitMeasurementConsumables();
    const ubicationHook = useUbicationConsumables();

    // Estado local de la barra de búsqueda (Debounce)
    const currentSearch = searchParams.get("search") || "";
    const [textSearch, setTextSearch] = useState(currentSearch);
    
    const isUserTyping = useRef(false);

    useEffect(() => {
        if (!isUserTyping.current) {
            setTextSearch(currentSearch);
        }
    }, [currentSearch]);

    useEffect(() => {
        if (!isUserTyping.current) return;

        const timer = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams);
            
            if (textSearch.trim() === "") {
                newParams.delete("search");
            } else {
                newParams.set("search", textSearch.trim());
            }
            
            newParams.set("page", "1"); 
            
            isUserTyping.current = false;
            setSearchParams(newParams);
        }, 300);

        return () => clearTimeout(timer);
    }, [textSearch, setSearchParams, searchParams]);

    // Rehidratación de los valores de los selectores
    const selectedType = searchParams.get("id_type_consumable")
        ? {
            id: searchParams.get("id_type_consumable")!,
            name: typeHook.options.find(o => String(o.id) === searchParams.get("id_type_consumable"))?.name || t("consumables.filters.selected_fallback")
        }
        : null;

    const selectedUnit = searchParams.get("id_unit_measurement")
        ? {
            id: searchParams.get("id_unit_measurement")!,
            name: unitHook.options.find(o => String(o.id) === searchParams.get("id_unit_measurement"))?.name || t("consumables.filters.selected_fallback")
        }
        : null;

    const selectedUbication = searchParams.get("id_ubication_consumable")
        ? {
            id: searchParams.get("id_ubication_consumable")!,
            name: ubicationHook.options.find(o => String(o.id) === searchParams.get("id_ubication_consumable"))?.name || t("consumables.filters.selected_fallback")
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

    const hasActiveFilters = searchParams.has("search") ||
        searchParams.has("id_type_consumable") ||
        searchParams.has("id_unit_measurement") ||
        searchParams.has("id_ubication_consumable");

    const resetFilters = () => {
        isUserTyping.current = false;
        setSearchParams({});
        setTextSearch("");
    };

    return (
        <div className="p-3 rounded-lg border border-border bg-card shadow-sm space-y-3">

            {/* 1. BUSCADOR PRINCIPAL (Nivel Superior) */}
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                    placeholder={t("consumables.filters.search_placeholder")}
                    className="pl-9 h-10 bg-background  w-full"
                    value={textSearch}
                    onChange={(e) => {
                        isUserTyping.current = true;
                        setTextSearch(e.target.value);
                    }}
                />
            </div>

            {/* 2. FILA DE SELECTORES Y ACCIÓN (Nivel Inferior) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                    {/* Selector 1: Clasificación */}
                    <CatalogSelector
                        hookResult={typeHook}
                        value={selectedType}
                        onChange={(val) => handleSelectChange("id_type_consumable", val)}
                        placeholder={t("consumables.filters.classification_placeholder")}
                        allowCreate={false}
                    />

                    {/* Selector 2: Unidad de Medida */}
                    <CatalogSelector
                        hookResult={unitHook}
                        value={selectedUnit}
                        onChange={(val) => handleSelectChange("id_unit_measurement", val)}
                        placeholder={t("consumables.filters.unit_placeholder")}
                        allowCreate={false}
                    />

                    {/* Selector 3: Ubicación */}
                    <CatalogSelector
                        hookResult={ubicationHook}
                        value={selectedUbication}
                        onChange={(val) => handleSelectChange("id_ubication_consumable", val)}
                        placeholder={t("consumables.filters.ubication_placeholder")}
                        allowCreate={false}
                    />
                </div>

                {/* Botón de Limpiar alineado al final de la fila */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={resetFilters}
                        size="sm"
                        className="h-10 px-3 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-input transition-all rounded-md flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                        <FilterX className="h-3.5 w-3.5" />
                        <span>{t("consumables.filters.clear_btn")}</span>
                    </Button>
                )}
            </div>

        </div>
    );
});

CustomConsumableFilters.displayName = "CustomConsumableFilters";