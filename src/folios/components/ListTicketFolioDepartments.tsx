import { useTranslation } from "react-i18next"
import { useGetTicketFolioDepartments } from "../hooks/useGetTicketFolioDepartments";
import { useCustomTable } from "@/components/hooks/useCustomTable";
import { useCallback, useMemo } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertCircle, FileDigit, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { useNavigate, useSearchParams } from "react-router";
import { CustomEmptyListState } from "@/components/custom/CustomEmptyListState";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomFilterTicketFolios } from "./CustomFilterTicketFolios";
import { getTicketFoliosColumns } from "../hooks/useGetTicketFoliosColumns";
import { getAxiosErrorMessage } from "@/lib/helpers/getAxiosErrorMessage";

export const ListTicketFolioDepartments = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { data, isLoading: skeletonLoading, isError, refetch, isFetching, error } = useGetTicketFolioDepartments();

    const limitNum = Number(searchParams.get('limit')) || 10;
    const pageNum = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';

    const dataList = data ?? [];

    const columns = useMemo(
        () => getTicketFoliosColumns(t),
        [t]
    );

    const table = useCustomTable({
        data: dataList,
        columns,
        manualSorting: false,
        manualPagination: false,
        manualFiltering: false,
        pagination: {
            pageIndex: pageNum - 1,
            pageSize: limitNum
        },
        globalFilter: search
    });

    const handleCardClick = useCallback((id: string) => {
        navigate(`/folios/tickets/${id}`);
    }, [navigate]);

    return (
        <>
            {isError ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={'icon'}>
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>
                            {t('folios.list_page.error.title')}
                        </EmptyTitle>
                        <EmptyDescription>
                            {getAxiosErrorMessage(error) || t('folios.list_page.error.description')}
                        </EmptyDescription>
                    </EmptyHeader>
                    <Button
                        variant="secondary"
                        onClick={() => refetch()}
                    >
                        <RefreshCcw className={isFetching ? 'animate-spin' : ''} />
                        {t('common.buttons.retry')}
                    </Button>
                </Empty>
            ) :
                (<>
                    <CustomFilterTicketFolios
                        table={table}
                        totalData={table.getRowCount()}
                        isLoadingData={skeletonLoading} />

                    <DataTable
                        table={table}
                        columnsLength={columns.length}
                        onRowClick={(row) => handleCardClick(row.original.department_id)}
                        isLoading={skeletonLoading}
                        emptyState={
                            <CustomEmptyListState
                                icon={FileDigit}
                                title={t("folios.list_page.empty.title")}
                                description={t("folios.list_page.empty.description")}
                            />}
                    />

                    <CustomPagination totalPages={table.getPageCount()} />
                </>)
            }
        </>
    )
}
