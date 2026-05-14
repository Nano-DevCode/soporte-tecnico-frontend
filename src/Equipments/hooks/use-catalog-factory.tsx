/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";

interface FactoryOptions {
    queryKey: string;
    fetchFn: (args: { limit: number; offset: number; query?: string }) => Promise<any>;
    createFn?: (data: any) => Promise<any>;
    getByIdFn?: (id: string) => Promise<any>;
    enabled?: boolean;
}

export const useCatalogFactory = ({ queryKey, fetchFn, createFn, getByIdFn, enabled = true }: FactoryOptions) => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // 1. Query principal (Lista infinita)
    const query = useInfiniteQuery({
        queryKey: [queryKey, debouncedSearch],
        queryFn: ({ pageParam = 0 }) => fetchFn({ limit: 10, offset: pageParam, query: debouncedSearch }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            // Ajuste según la estructura de tu backend
            const nextOffset = lastPage.meta?.offset + 10;
            return lastPage.meta?.hasMore ? nextOffset : undefined;
        },
        enabled: enabled,
    });

    // 2. Query de recuperación por ID (Vital para Edición)
    const singleQuery = useQuery({
        queryKey: [queryKey, "single", selectedId],
        queryFn: () => getByIdFn!(selectedId!),
        enabled: !!getByIdFn && !!selectedId,
        staleTime: 1000 * 60 * 10, // Aumentado a 10 min para estabilidad
    });

    // 3. Mutación para crear
    const mutation = useMutation({
        mutationFn: (data: any) => createFn ? createFn(data) : Promise.reject("No create function"),
        onSuccess: (newItem) => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            return newItem;
        },
    });

    // 4. LÓGICA DE COMBINACIÓN (Ajuste importante)
    // Usamos useMemo para que no se recalculen las opciones en cada render
    const options = useMemo(() => {
        const listData = query.data?.pages.flatMap((page) => 
            Array.isArray(page) ? page : (page?.data || [])
        ) ?? [];

        // Si tenemos un dato recuperado por ID (singleData) y NO está en la lista actual,
        // lo inyectamos al principio. Esto evita que el selector se vea vacío en edición.
        if (singleQuery.data) {
            const exists = listData.some((item: any) => item.id === singleQuery.data.id);
            if (!exists) {
                return [singleQuery.data, ...listData];
            }
        }

        return listData;
    }, [query.data, singleQuery.data]);

    return {
        options,
        singleData: singleQuery.data,
        isLoading: query.isLoading || (!!selectedId && singleQuery.isLoading),
        isFetchingNextPage: query.isFetchingNextPage,
        isCreating: mutation.isPending,
        searchTerm, // Retornamos también el valor actual para el input
        setSearch: setSearchTerm,
        setSelectedId,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: !!query.hasNextPage,
        onCreate: async (data: any) => {
            return await mutation.mutateAsync(data);
        },
    };
};
