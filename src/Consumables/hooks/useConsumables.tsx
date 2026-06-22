import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from "react-router";
import { getConsumablesAction } from '../actions/get-consumables.action';
import type { ConsumablesResponse } from '../interfaces/consumable.interfaces';

export const useConsumables = () => {
    const [searchParams] = useSearchParams();

    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;
    const offset = (page - 1) * limit;
    const query = searchParams.get("search")?.trim() || undefined;
    const id_type_consumable = searchParams.get("id_type_consumable") || undefined;
    const id_unit_measurement = searchParams.get("id_unit_measurement") || undefined;
    const id_ubication_consumable = searchParams.get("id_ubication_consumable") || undefined;

    const consumablesQuery = useQuery<ConsumablesResponse, Error>({
        queryKey: [
            'consumables', 
            { query, limit, offset, id_type_consumable, id_unit_measurement, id_ubication_consumable }
        ],
        queryFn: async () => {
            const response = await getConsumablesAction({ 
                query, 
                limit, 
                offset,
                id_type_consumable,
                id_unit_measurement,
                id_ubication_consumable
            });
            
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
    const bagQuery = useQuery({
        queryKey: ['consumables-bag-details', ids],
        queryFn: async () => {
            if (ids.length === 0) return [];

            // 1. Hacemos la primera llamada para saber cuántas páginas hay
            const firstPage = await getConsumablesAction({ limit: 100, offset: 0 });
            const totalPages = Math.ceil(firstPage.meta.total / 100);

            // 2. Si hay más páginas, traemos el resto en paralelo
            const allConsumables = [...firstPage.consumables];
            
            if (totalPages > 1) {
                const promises = [];
                for (let i = 1; i < totalPages; i++) {
                    promises.push(getConsumablesAction({ limit: 100, offset: i * 100 }));
                }
                const results = await Promise.all(promises);
                results.forEach(res => {
                    allConsumables.push(...res.consumables);
                });
            }

            // 3. Normalizamos y retornamos
            return allConsumables.map((item) => ({
                ...item,
                imageUrl: item.imageUrl ?? null,
            }));
        },
        enabled: ids.length > 0,
        // Filtramos aquí contra los IDs de la bolsa
        select: (data) => data.filter((item) => ids.includes(String(item.id)))
    });

    return {
        bagConsumables: bagQuery.data ?? [],
        isBagLoading: bagQuery.isLoading,
    };
};