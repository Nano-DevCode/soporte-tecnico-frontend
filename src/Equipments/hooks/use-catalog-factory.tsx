/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface FactoryOptions {
    queryKey: string;
    fetchFn: (args: { limit: number; offset: number; query?: string }) => Promise<any>;
    createFn?: (data: any) => Promise<any>;
    enabled?: boolean;
}

export const useCatalogFactory = ({ queryKey, fetchFn, createFn, enabled = true }: FactoryOptions) => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const query = useInfiniteQuery({
        queryKey: [queryKey, debouncedSearch],
        queryFn: ({ pageParam = 0 }) => fetchFn({ limit: 10, offset: pageParam, query: debouncedSearch }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.meta?.hasMore ? lastPage.meta.offset + 10 : undefined,
        enabled: enabled,
    });

    const mutation = useMutation({
        mutationFn: (data: any) => createFn ? createFn(data) : Promise.reject("No create function"),
        onSuccess: () => {
            // Invalidamos la cache para que la lista se actualice con el nuevo item
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
    });

    return {
        options: query.data?.pages.flatMap((page) => Array.isArray(page) ? page : (page?.data || [])) ?? [],
        isLoading: query.isLoading,
        isCreating: mutation.isPending,
        setSearch: setSearchTerm,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: !!query.hasNextPage,
        // Retornamos la promesa para que el componente pueda esperar el resultado
        onCreate: async (data: any) => {
            return await mutation.mutateAsync(data);
        },
    };
};