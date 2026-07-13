import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CustomDebouncedSearch } from "@/components/custom/CustomDebounceSearch";
import type { Table } from "@tanstack/react-table";
import type { Ticket } from "../interfaces/ticket.interface";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetStatus } from "@/common/status/hooks/useGetStatus";
import type { TicketStatusCode } from "../interfaces/ticket-status-code.interface";
import type { TicketColumnId } from "../interfaces/ticket-column-ids.types";
import { useDepartments } from "@/users/hooks/useDepartment";
import { useSchoolPeriods } from "@/school-periods/hooks/useSchoolPeriods";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTicketFilters } from "../hooks/useTicketFilters";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { CustomFilterDate } from "@/components/custom/CustomFilterDate";
import { Can } from "@/common/permission/Can";
import { TicketStatus } from "../utils/ticket-state-machine";
import { useCan } from "@/common/permission/useCan";

interface Props {
  table: Table<Ticket>;
  totalData: number;
  isLoadingData: boolean;
}

export const CustomFilterTicketsArchives = ({ table, totalData, isLoadingData }: Props) => {
  const { t } = useTranslation();
  const { can } = useCan()
  const { filters, updateFilter, updateMultipleFilters, resetFilters, hasActiveFilters } = useTicketFilters();

  const { data: statuses, isLoading: loadingStatuses } = useGetStatus();
  const { data: schoolPeriods, isLoading: loadingPeriods } = useSchoolPeriods({ enabled: can('WATCH_TICKET_PERIOD_ARCHIVE_FILTER') });
  const { data: departments, isLoading: loadingDepartments } = useDepartments({ enabled: can('WATCH_TICKET_DEPARTMENT_ARCHIVE_FILTER') });

  type StatusNameTranslationKey = `tickets.status.${TicketStatusCode}.name`;
  type ColumnsNameTranslationKey = `tickets.list_page.table.headers.${TicketColumnId}`;

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


        <CustomFilterSelect
          label={t("tickets.list_page.table.headers.status")}
          defaultValue={filters.status}
          isLoading={loadingStatuses}
          onChange={(v) => updateFilter("status", v)}
          options={
            statuses?.filter(s => s.code === TicketStatus.CERRADA || s.code === TicketStatus.ARCHIVADA)
              .map(s => ({
                value: s.code,
                label: t(`tickets.status.${s.code}.name` as StatusNameTranslationKey)
              }))
          }
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
                        {t(`tickets.list_page.table.headers.${column.id}` as ColumnsNameTranslationKey)}
                      </DropdownMenuCheckboxItem>
                    );
                  }
                  return acumulador;
                }, [])}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
      >
        <AccordionItem value="more-filters">
          <AccordionTrigger className="group justify-start py-0 underline hover:no-underline">
            <span className="group-data-[state=open]:hidden">
              {t("common.filters.more_filters")}
            </span>
            <span className="group-data-[state=closed]:hidden">
              {t("common.filters.less_filters")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-0" >
            <div className="flex flex-col md:flex-row flex-wrap items-center gap-2 py-0 pt-2">

              <Can permission='WATCH_TICKET_DEPARTMENT_ARCHIVE_FILTER'>
                <CustomFilterSelect
                  label={t("tickets.list_page.table.headers.department")}
                  defaultValue={filters.department}
                  isLoading={loadingDepartments}
                  onChange={(v) => updateFilter("department", v)}
                  options={departments?.map(d => ({ value: d.id, label: d.name }))}
                />
              </Can>

              <Can permission='WATCH_TICKET_PERIOD_ARCHIVE_FILTER'>
                <CustomFilterSelect
                  label={t("tickets.list_page.table.headers.school_period")}
                  defaultValue={filters.school_period}
                  isLoading={loadingPeriods}
                  onChange={(v) => updateFilter("school_period", v)}
                  options={schoolPeriods?.data.map(p => ({ value: p.id, label: p.name }))}
                />
              </Can>

              <div className="flex-1 flex flex-row gap-2 w-full">
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

            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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