/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { InfiniteScrollSelectconsumables } from "../components/infinite-scroll-selectconsu";

// interface ExtendedCatalogProperties {
//     id: string;
//     name: string;
//     folio?: string;
// }

interface UISelectOption {
    id: string;
    name: string;
}

interface CatalogHook {
    options: any[];
    isLoading: boolean;
    setSearch: (term: string) => void;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isCreating: boolean;
    onCreate: (data: any) => Promise<any>;
    setSelectedId: (id: string | null) => void;
    isFetchingNextPage: boolean;
    singleData?: any | null;
}

interface CatalogSelectorProps {
    hook: CatalogHook;
    value: UISelectOption | null;
    onChange: (val: UISelectOption | null) => void;
    placeholder?: string;
    allowCreate?: boolean;
    disabled?: boolean;
    onCreate?: (name: string) => Promise<void> | void;
}

export const CatalogSelector = ({
    hook,
    value,
    onChange,
    placeholder,
    allowCreate = true,
    disabled = false,
    onCreate: customOnCreate
}: CatalogSelectorProps) => {
    const {
        options,
        isLoading,
        setSearch,
        fetchNextPage,
        hasNextPage,
        isCreating,
        onCreate: defaultOnCreate,
        setSelectedId,
        isFetchingNextPage,
        singleData
    } = hook;

    // --- Sincronización para edición, hidratación y asincronía ---
    useEffect(() => {
        if (value?.id) {
            setSelectedId(value.id);
        } else {
            setSelectedId(null);
        }
    }, [value?.id, setSelectedId]);

    // --- Mapeador inteligente de nombres según las llaves del objeto ---
    // --- Mapeador inteligente de nombres según las llaves del objeto ---
    const formattedOptions = useMemo<UISelectOption[]>(() => {
        // Si por alguna razón 'options' no es un arreglo válido, evitamos que rompa el componente
        const safeOptions = Array.isArray(options) ? options : [];

        // 1. Mapeamos las opciones de la lista paginada
        const listOptions = safeOptions.map((opt: any) => {
            if (!opt) return { id: "", name: "Elemento inválido" };

            // CASO 1: Es un Ticket (Tiene folio)
            if (opt.folio) {
                const ticketDesc = opt.description ? ` - ${opt.description}` : '';
                return {
                    id: String(opt.id),
                    name: `Ticket: ${opt.folio}${ticketDesc}`.replace(/\s+/g, ' ').trim()
                };
            }

            // CASO 2: Tiene marca y modelo (Es un equipo/consumible)
            if (opt.brand || opt.model) {
                return {
                    id: String(opt.id),
                    name: `${opt.brand || ''} ${opt.model || ''} ${opt.description || ''}`.trim()
                };
            }

            // CASO 3: Catálogo genérico (Tiene name)
            if (opt.name) {
                return {
                    id: String(opt.id),
                    name: String(opt.name).trim()
                };
            }

            // CASO 4: ULTRA-FALLBACK (Si no tiene nada, muestra el ID o un texto de emergencia)
            return {
                id: String(opt.id || ''),
                name: opt.id ? `ID: ${opt.id}` : "Sin nombre o folio asignado"
            };
        });

        // 2. Hidratación: Para cuando se carga un registro existente (singleData)
        if (singleData && !listOptions.some(opt => opt.id === String(singleData.id))) {
            let singleName = "";

            if (singleData.folio) {
                const singleDesc = singleData.description ? ` - ${singleData.description}` : '';
                singleName = `Ticket: ${singleData.folio}${singleDesc}`;
            } else if (singleData.brand || singleData.model) {
                singleName = `${singleData.brand || ''} ${singleData.model || ''} ${singleData.description || ''}`;
            } else {
                singleName = singleData.name || `ID: ${singleData.id}`;
            }

            listOptions.unshift({
                id: String(singleData.id),
                name: singleName.trim()
            });
        }

        return listOptions;
    }, [options, singleData]);
    const handleCreate = async (name: string) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        // Si en ConsumableFields pasaste handleCreateType, handleCreateBrand, etc., se ejecuta aquí
        if (customOnCreate) {
            await customOnCreate(trimmedName);
            return;
        }

        // Fallback por si se usa directo sin handler customizado en el componente padre
        try {
            const newItem = await defaultOnCreate({ name: trimmedName });
            if (newItem) {
                const displayName = (newItem.brand && newItem.model)
                    ? `${newItem.brand} ${newItem.model} ${newItem.description || ""}`.trim()
                    : String(newItem.name || newItem.first_name || trimmedName);

                onChange({
                    id: newItem.id,
                    name: displayName
                });
            }
        } catch (error) {
            console.error("Error controlado en CatalogSelector:", error);
        }
    };

    return (
        <InfiniteScrollSelectconsumables
            options={formattedOptions}
            value={value}
            onChange={onChange}
            onSearch={setSearch}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading || isCreating}
            isFetchingNextPage={isFetchingNextPage}
            placeholder={placeholder}
            allowCreate={allowCreate && !disabled}
            onCreate={handleCreate}
            disabled={disabled}
        />
    );
};