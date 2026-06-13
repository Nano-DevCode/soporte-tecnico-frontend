import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from "react-router";
import { getConsumablesAction } from '../actions/get-consumables.action';
import type { Consumable, ConsumablesResponse } from '../interfaces/consumable.interfaces';

export const useConsumables = () => {
    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const offset = (page - 1) * limit;
    const query = searchParams.get("search")?.trim() || undefined;

    const consumablesQuery = useQuery<ConsumablesResponse, Error>({
        queryKey: ['consumables', { query, limit, offset }],
        // CORREGIDO: Se pasa 'search' para que coincida con GetConsumablesOptions
        queryFn: async () => {
            const response = await getConsumablesAction({ search: query, limit, offset });
            const normalizedResponse: ConsumablesResponse = {
                ...response,
                consumables: response.consumables.map((item) => ({
                    ...item,
                    imageUrl: item.imageUrl ?? null,
                })),
            };
            return normalizedResponse;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        // CORREGIDO: Tu response ya trae directamente 'consumables' y 'meta' sin una capa '.data' intermedia
        select: (response) => ({
            consumables: response?.consumables ?? [],
            meta: response?.meta,
        }),
    });

    return {
        consumables: consumablesQuery.data?.consumables ?? [],
        meta: consumablesQuery.data?.meta,
        isLoading: consumablesQuery.isLoading,
        isFetching: consumablesQuery.isFetching,
        error: consumablesQuery.error,
        refetch: consumablesQuery.refetch,
    };
};

// --- HOOK: DETALLES DE LA BOLSA (SELECCIONADOS) ---
export const useConsumablesBagData = (ids: string[]) => {
    const bagQuery = useQuery<ConsumablesResponse, Error, Consumable[]>({
        queryKey: ['consumables-bag-details', ids],
        queryFn: async () => {
            if (ids.length === 0) return { consumables: [], meta: { total: 0, page: 1, lastPage: 1 } };
            // Traemos un bloque alto para buscar las coincidencias en memoria localmente
            const response = await getConsumablesAction({ limit: 100, offset: 0 });
            const normalizedResponse: ConsumablesResponse = {
                ...response,
                consumables: response.consumables.map((item) => ({
                    ...item,
                    imageUrl: item.imageUrl ?? null,
                })),
            };
            return normalizedResponse;
        },
        enabled: ids.length > 0,
        staleTime: 0,
        refetchOnMount: true,
        // CORREGIDO: Mapeo directo usando la estructura real consumibles de la respuesta
        select: (response) => {
            const dataArray = response?.consumables || [];
            return dataArray.filter((item) => ids.includes(String(item.id)));
        }
    });

    return {
        bagConsumables: bagQuery.data ?? [],
        isBagLoading: bagQuery.isLoading,
    };
};
