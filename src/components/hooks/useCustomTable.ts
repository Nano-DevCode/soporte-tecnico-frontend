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
    initialColumnVisibility?: VisibilityState;
    onSortingChange?: (sorting: SortingState) => void;
}

export function useCustomTable<TData, TValue>({
    data,
    columns,
    sorting = [],
    onSortingChange,
    initialColumnVisibility = {}

}: UseCustomTableProps<TData, TValue>) {

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility);

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