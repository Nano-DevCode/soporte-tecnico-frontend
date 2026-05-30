"use client"

import React from "react";
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";

interface UseCustomTableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
}

export function useCustomTable<TData, TValue>({
    data,
    columns,
    sorting = [],
    onSortingChange,
}: UseCustomTableProps<TData, TValue>) {

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        onSortingChange: (updaterOrValue) => {
            if (onSortingChange) {
                const newSortingValue = typeof updaterOrValue === 'function'
                    ? updaterOrValue(sorting)
                    : updaterOrValue;
                onSortingChange(newSortingValue);
            }
        },
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility,
        }
    });

    return table;
}