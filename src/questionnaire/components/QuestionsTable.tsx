import { useMemo } from 'react'
import { CustomPagination } from '@/components/custom/CustomPagination';
import { DataTable } from '@/components/custom/DataTable';
import { useTranslation } from 'react-i18next';
import { useCustomTable } from '@/components/hooks/useCustomTable';
import { AlertCircle, HelpCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { CustomEmptyListState } from '@/components/custom/CustomEmptyListState';
import { getTableQuestionsColumns } from '../hooks/useGetQuestionsColumn';
import { useAllQuestions } from '../hooks/useAllQuestions';
import { CustomFilterQuestions } from './CustomFilterQuestions';

export const QuestionsTable = () => {
    const { t } = useTranslation();
    const { data, isLoading: skeletonLoading, isError, refetch, isFetching } = useAllQuestions();

    const columns = useMemo(
        () => getTableQuestionsColumns(t),
        [t]
    );

    const questionsList = data?.data ?? [];
    const totalData = data?.meta.total || 0;
    const table = useCustomTable({
        data: questionsList,
        columns,
    });

    return (
        <>
            <CustomFilterQuestions table={table} totalData={totalData} isLoadingData={skeletonLoading} />

            {isError ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={'icon'}>
                            <AlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>
                            {t('surveys.questions.list_page.error.title')}
                        </EmptyTitle>
                        <EmptyDescription>
                            {t('surveys.questions.list_page.error.description')}
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
                    <DataTable
                        table={table}
                        columnsLength={columns.length}
                        isLoading={skeletonLoading}
                        emptyState={
                            <CustomEmptyListState
                                icon={HelpCircle}
                                title={t("surveys.questions.list_page.empty.title")}
                                description={t("surveys.questions.list_page.empty.description")}
                            />}
                    />

                    <CustomPagination totalPages={data?.meta.lastPage ?? 0} />
                </>)
            }
        </>
    )
}
