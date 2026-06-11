import React from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table";

interface UseCustomTableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    sorting?: SortingState;
    initialColumnVisibility?: VisibilityState;

    manualSorting?: boolean;
    manualPagination?: boolean;
    manualFiltering?: boolean;

    pagination?: PaginationState;

    columnFilters?: ColumnFiltersState;

    onSortingChange?: (sorting: SortingState) => void;
}

export function useCustomTable<TData, TValue>({
    data,
    columns,
    sorting = [],
    initialColumnVisibility = {},
    manualSorting = true,
    manualPagination = true,
    manualFiltering = true,
    pagination,
    columnFilters,
    onSortingChange,
}: UseCustomTableProps<TData, TValue>) {

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility);

    const [automaticSorting, setAutomaticSorting] = React.useState<SortingState>([])

    const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),

        manualSorting: manualSorting,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: (updaterOrValue) => {
            if (onSortingChange) {
                const newSortingValue = typeof updaterOrValue === 'function'
                    ? updaterOrValue(sorting)
                    : updaterOrValue;
                onSortingChange(newSortingValue);
            } else if (!manualSorting) {
                setAutomaticSorting(updaterOrValue)
            }
        },

        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: manualPagination,

        onColumnVisibilityChange: setColumnVisibility,

        manualFiltering: manualFiltering,
        onColumnFiltersChange: setInternalColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),

        state: {
            sorting: manualSorting ? sorting : automaticSorting,
            columnVisibility,
            pagination,
            columnFilters: columnFilters !== undefined ? columnFilters : internalColumnFilters,
        }
    });

    return table;
}