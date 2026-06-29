/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";

interface BackendMeta {
    page: number;
    lastPage: number;
    total?: number;
}
interface BackendResponse {
    meta: BackendMeta;
    [key: string]: any;
}

interface FetchArgs {
    limit: number;
    offset: number;
    query?: string;
}

interface FactoryOptions {
    queryKey: string;
    dataKey: string;
    fetchFn: (args: FetchArgs) => Promise<BackendResponse>;
    createFn?: (data: any) => Promise<any>;
    getByIdFn?: (id: string) => Promise<any>;
    enabled?: boolean;
}

export const useCatalogFactory = ({
    queryKey,
    dataKey,
    fetchFn,
    createFn,
    getByIdFn,
    enabled = true
}: FactoryOptions) => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const query = useInfiniteQuery({
        queryKey: [queryKey, debouncedSearch],
        queryFn: ({ pageParam = 0 }) =>
            fetchFn({ limit: 10, offset: pageParam as number, query: debouncedSearch }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage?.meta || lastPage.meta.page >= lastPage.meta.lastPage) return undefined;
            return lastPage.meta.page * 10;
        },
        enabled: enabled,
        staleTime: 0, // Sincronizado a tu base funcional
    });

    const singleQuery = useQuery({
        queryKey: [queryKey, "single", selectedId],
        queryFn: () => getByIdFn!(selectedId!),
        enabled: !!getByIdFn && !!selectedId,
        staleTime: 1000 * 60 * 10,
    });

    const mutation = useMutation({
        mutationFn: (data: any) => createFn ? createFn(data) : Promise.reject(new Error("No create function")),
        onSuccess: (newItem) => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            return newItem;
        },
    });

    const options = useMemo(() => {
        const listData = query.data?.pages.flatMap((page) => {
            return Array.isArray(page[dataKey]) ? page[dataKey] : [];
        }) ?? [];

        if (singleQuery.data) {
            const exists = listData.some((item: any) => item.id === singleQuery.data.id);
            if (!exists) {
                return [singleQuery.data, ...listData];
            }
        }

        return listData;
    }, [query.data, singleQuery.data, dataKey]);

    return {
        options,
        singleData: singleQuery.data,
        isLoading: query.isLoading || (!!selectedId && singleQuery.isLoading),
        isFetchingNextPage: query.isFetchingNextPage,
        isCreating: mutation.isPending,
        searchTerm,
        setSearch: setSearchTerm,
        setSelectedId,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: !!query.hasNextPage,
        onCreate: async (data: any) => {
            return await mutation.mutateAsync(data);
        },
    };
};
