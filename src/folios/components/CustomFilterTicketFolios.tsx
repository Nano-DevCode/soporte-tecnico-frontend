import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomDebouncedSearch } from "@/components/custom/CustomDebounceSearch";
import type { Table } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TicketFolioColumnId } from "../interfaces/ticket-folio-columns-id";
import type { ItemFolio } from "../interfaces/get-folios.interface";
import { useTicketFolioFilters } from "../hooks/useTicketFolioFilters";

interface Props {
    table: Table<ItemFolio>;
    totalData: number;
    isLoadingData: boolean;
}

export const CustomFilterTicketFolios = ({ table, totalData, isLoadingData }: Props) => {
    const { t } = useTranslation();
    const { filters, updateFilter, resetFilters, hasActiveFilters } = useTicketFolioFilters();

    const onSearch = (value: string) => {
        updateFilter("search", value)
    }

    type ColumnsNameTranslationKey = `folios.list_page.table.headers.${TicketFolioColumnId}`;

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card/50 shadow-sm">

            <div className="flex flex-wrap items-center gap-2">
                <CustomDebouncedSearch
                    defaultValue={filters.search}
                    placeholder={t('common.filters.search')}
                    onSearch={onSearch}
                    className="min-w-1/1 lg:min-w-3/5"
                    totalData={totalData}
                    isLoadingData={isLoadingData}
                />

                <div className="hidden md:block ml-auto">
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {t('common.filters.columns')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .reduce<React.ReactNode[]>((acumulador, column) => {
                                    if (column.getCanHide()) {
                                        acumulador.push(
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {t(`folios.list_page.table.headers.${column.id}` as ColumnsNameTranslationKey)}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    }
                                    return acumulador;
                                }, [])}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>


            {hasActiveFilters && (
                <Button
                    variant="outline"
                    onClick={resetFilters}
                    type="button"
                    className="md:self-end text-muted-foreground border hover:text-destructive hover:bg-destructive/10"
                >
                    <FilterX className="h-4 w-4" />
                    <span>{t("common.filters.clean")}</span>
                </Button>
            )}

        </div>
    );
};