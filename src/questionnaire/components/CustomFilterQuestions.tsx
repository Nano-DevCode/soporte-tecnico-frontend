import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomDebouncedSearch } from "@/components/custom/CustomDebounceSearch";
import type { Table } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { SurveyQuestion } from "../interfaces/all-questions.interface";
import type { QuestionsTableColumnId } from "../interfaces/questions-table-columns-id";
import { useQuestionFilters } from "../hooks/useQuestionsFilters";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";

interface Props {
    table: Table<SurveyQuestion>;
    totalData: number;
    isLoadingData: boolean;
}

type StatusNameType =
    "common.filters.status.options.active" |
    "common.filters.status.options.inactive"

const StatusOptions: { value: string, label: StatusNameType }[] = [
    {
        value: 'true',
        label: "common.filters.status.options.active"
    },
    {
        value: 'false',
        label: "common.filters.status.options.inactive"
    }
]

export const CustomFilterQuestions = ({ table, totalData, isLoadingData }: Props) => {
    const { t } = useTranslation();
    const { filters, updateFilter, resetFilters, hasActiveFilters } = useQuestionFilters();

    type ColumnsNameTranslationKey = `surveys.questions.data.${QuestionsTableColumnId}`;

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card/50 shadow-sm">

            <div className="flex flex-wrap items-center gap-2">
                <CustomDebouncedSearch
                    defaultValue={filters.search}
                    placeholder={t('common.filters.search')}
                    onSearch={(value) => updateFilter("search", value)}
                    className="min-w-1/1 lg:min-w-3/5"
                    totalData={totalData}
                    isLoadingData={isLoadingData}
                />
                <div className="sm:w-40">
                    <CustomFilterSelect
                        label={t("common.filters.status.name")}
                        defaultValue={filters.status}
                        onChange={(v) => updateFilter("is_active", v)}
                        options={StatusOptions.map((opt) => ({
                            value: opt.value,
                            label: t(opt.label),
                        }))}
                    />
                </div>

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
                                                {t(`surveys.questions.data.${column.id}` as ColumnsNameTranslationKey)}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    }
                                    return acumulador;
                                }, [])}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {
                hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={resetFilters}
                        type="button"
                        className="md:self-end text-muted-foreground border hover:text-destructive hover:bg-destructive/10"
                    >
                        <FilterX className="h-4 w-4" />
                        <span>{t("common.filters.clean")}</span>
                    </Button>
                )
            }

        </div >
    );
};