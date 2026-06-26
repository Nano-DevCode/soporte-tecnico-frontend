import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDepartments } from "@/users/hooks/useDepartment";
import { useSchoolPeriods } from "@/school-periods/hooks/useSchoolPeriods";
import { useAllIssueTypes } from "@/IssueTypes/hooks/useAllIssueTypes";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { CustomFilterDate } from "@/components/custom/CustomFilterDate";
import { InfiniteScrollComboboxTags } from "@/common/tags/components/InfiniteScrollComboboxTags";
import { TicketPriorityLevel } from "@/tickets/interfaces/ticket-priority-level.type";
import { useDashboardFilters } from "../hooks/useDashboardFilter";

export const FilterDashboard = () => {
    const { t } = useTranslation();
    const { filters, updateFilter, updateMultipleFilters, resetFilters, hasActiveFilters } = useDashboardFilters();

    const { data: schoolPeriods, isLoading: loadingPeriods } = useSchoolPeriods();
    const { data: departments, isLoading: loadingDepartments } = useDepartments();
    const { data: issueTypes, isLoading: loadingIssues } = useAllIssueTypes();

    const priorityOptions = Object.entries(TicketPriorityLevel).map(([, value]) => ({
        value: value.toString(),
        label: t(`tickets.priority.${value}.name`)
    }));

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card/50 shadow-sm">

            <div className="flex flex-col md:flex-row flex-wrap items-center gap-2">
                <div className="flex-1 w-full md:min-w-1/2">
                    <CustomFilterSelect
                        label={t("tickets.list_page.table.headers.department")}
                        defaultValue={filters.department}
                        isLoading={loadingDepartments}
                        onChange={(v) => updateFilter("department", v)}
                        options={departments?.map(d => ({ value: d.id, label: d.name }))}
                    />
                </div>
                <div className="flex-1 w-full md:min-w-1/2">
                    <CustomFilterSelect
                        label={t("tickets.list_page.table.headers.issue_type")}
                        defaultValue={filters.issue_type}
                        isLoading={loadingIssues}
                        onChange={(v) => updateFilter("issue_type", v)}
                        options={issueTypes?.map(i => ({ value: i.id.toString(), label: i.name }))}
                    />
                </div>

                <CustomFilterSelect
                    label={t("tickets.list_page.table.headers.priority")}
                    defaultValue={filters.priority}
                    onChange={(v) => updateFilter("priority", v)}
                    options={priorityOptions}
                />

                <CustomFilterSelect
                    label={t("tickets.list_page.table.headers.school_period")}
                    defaultValue={filters.school_period}
                    isLoading={loadingPeriods}
                    onChange={(v) => updateFilter("school_period", v)}
                    options={schoolPeriods?.data.map(p => ({ value: p.id, label: p.name }))}
                />


                <div className="flex-1 flex flex-row flex-wrap md:flex-nowrap gap-2 w-full">
                    <CustomFilterDate
                        label={t('tickets.filters.date.from')}
                        value={filters.start_date}
                        onChange={(val) => updateMultipleFilters({ start_date: val })}
                        maxDate={filters.end_date ? new Date(`${filters.end_date}T00:00:00`) : undefined}
                    />

                    <CustomFilterDate
                        label={t('tickets.filters.date.to')}
                        value={filters.end_date}
                        onChange={(val) => updateMultipleFilters({ end_date: val })}
                        minDate={filters.start_date ? new Date(`${filters.start_date}T00:00:00`) : undefined}
                    />
                </div>
                <div className="w-full shrink-0">
                    <InfiniteScrollComboboxTags
                        value={filters.tags}
                        onChange={(newTagsArray) => updateFilter("tags", newTagsArray)}
                        creatable={false}
                    />
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