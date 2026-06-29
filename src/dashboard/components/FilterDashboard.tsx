import { Button } from "@/components/ui/button";
import { Filter, FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDepartments } from "@/users/hooks/useDepartment";
import { useSchoolPeriods } from "@/school-periods/hooks/useSchoolPeriods";
import { useAllIssueTypes } from "@/IssueTypes/hooks/useAllIssueTypes";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { CustomFilterDate } from "@/components/custom/CustomFilterDate";
import { InfiniteScrollComboboxTags } from "@/common/tags/components/InfiniteScrollComboboxTags";
import { TicketPriorityLevel } from "@/tickets/interfaces/ticket-priority-level.type";
import { useDashboardFilters } from "../hooks/useDashboardFilter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
        <Accordion type="single" collapsible className="rounded-lg border shadow-sm">
            <AccordionItem value="filters" className="border-b px-2 last:border-b-0">
                <AccordionTrigger className=" py-2 text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <Filter className="h-3 w-3 " />
                        {t('common.filters.label')}
                    </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                    <div className="grid grid-cols-8 gap-2">
                        <div className="col-span-8 md:col-span-5 lg:col-span-4">
                            <CustomFilterSelect
                                label={t("tickets.list_page.table.headers.department")}
                                defaultValue={filters.department}
                                isLoading={loadingDepartments}
                                onChange={(v) => updateFilter("department", v)}
                                options={departments?.map(d => ({ value: d.id, label: d.name }))}
                            />
                        </div>
                        <div className="col-span-8 md:col-span-3 lg:col-span-4">
                            <CustomFilterSelect
                                label={t("tickets.list_page.table.headers.issue_type")}
                                defaultValue={filters.issue_type}
                                isLoading={loadingIssues}
                                onChange={(v) => updateFilter("issue_type", v)}
                                options={issueTypes?.map(i => ({ value: i.id.toString(), label: i.name }))}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-4 md:col-span-2">
                            <CustomFilterSelect
                                label={t("tickets.list_page.table.headers.priority")}
                                defaultValue={filters.priority}
                                onChange={(v) => updateFilter("priority", v)}
                                options={priorityOptions}
                            />
                        </div>

                        <div className="col-span-4 sm:col-span-4 md:col-span-2">
                            <CustomFilterSelect
                                label={t("tickets.list_page.table.headers.school_period")}
                                defaultValue={filters.school_period}
                                isLoading={loadingPeriods}
                                onChange={(v) => updateFilter("school_period", v)}
                                options={schoolPeriods?.data.map(p => ({ value: p.id, label: p.name }))}
                            />
                        </div>


                        <div className="col-span-4 md:col-span-2">
                            <CustomFilterDate
                                label={t('tickets.filters.date.from')}
                                value={filters.start_date}
                                onChange={(val) => updateMultipleFilters({ start_date: val })}
                                maxDate={filters.end_date ? new Date(`${filters.end_date}T00:00:00`) : undefined}
                            />
                        </div>

                        <div className="col-span-4 md:col-span-2">
                            <CustomFilterDate
                                label={t('tickets.filters.date.to')}
                                value={filters.end_date}
                                onChange={(val) => updateMultipleFilters({ end_date: val })}
                                minDate={filters.start_date ? new Date(`${filters.start_date}T00:00:00`) : undefined}
                            />
                        </div>

                        <div className="col-span-8">
                            <InfiniteScrollComboboxTags
                                value={filters.tags}
                                onChange={(newTagsArray) => updateFilter("tags", newTagsArray)}
                                creatable={false}
                            />
                        </div>

                        {hasActiveFilters && (
                            <div className="col-span-8 flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                    type="button"
                                    className="text-muted-foreground border hover:text-destructive hover:bg-destructive/10"
                                >
                                    <FilterX className="h-4 w-4" />
                                    <span>{t("common.filters.clean")}</span>
                                </Button>
                            </div>
                        )}

                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};