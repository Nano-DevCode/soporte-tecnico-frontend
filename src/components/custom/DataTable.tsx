import {
    flexRender,
    type Row,
    type Table as TanstackTable
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";

interface DataTableProps<TData> {
    table: TanstackTable<TData>;
    columnsLength: number;
    onRowClick?: (row: Row<TData>) => void;
    emptyState?: React.ReactNode;
    isLoading: boolean;
}

export function DataTable<TData>({
    table,
    columnsLength,
    onRowClick,
    emptyState,
    isLoading,
}: DataTableProps<TData>) {

    const { t } = useTranslation();

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead
                                    key={header.id}
                                    className={header.column.columnDef.meta?.classNameHead}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, rowIndex) => (
                        <TableRow key={`skeleton-row-${rowIndex}`}>
                            {table.getVisibleFlatColumns().map((_, colIndex) => (
                                <TableCell key={`skeleton-col-${colIndex}`}>
                                    <Skeleton className="h-4 w-[80%] max-w-50" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            onDoubleClick={() => onRowClick?.(row)}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell className="max-w-none" key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))) : (
                    <TableRow>
                        <TableCell colSpan={columnsLength} className="h-24 text-center">
                            {emptyState ? emptyState : t('common.notifications.empty_list')}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}