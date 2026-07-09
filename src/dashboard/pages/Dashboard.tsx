import { useTranslation } from 'react-i18next';
import { useGetCriticalAvailability } from '../hooks/useGetACriticalAvailabiity';
import { CriticalAvailabilityCard } from '../components/CriticalAvailability';
import { useGetMttr } from '../hooks/useGetMttrMetric';
import { MttrMetricCard } from '../components/MttrMetricCard';
import { useGetCriticalInterruptions } from '../hooks/useGetCriticalInterruptions';
import { useGetResolutionTime } from '../hooks/useGetResolutionTime';
import { FilterDashboard } from '../components/FilterDashboard';
import { useFirstLevelResolution } from '../hooks/useFirstLevelResolution';
import { FirstLevelResolutionCard } from '../components/FirstLevelResolution';
import { useGetSlaCompliance } from '../hooks/useGetSlaCompliance';
import { SlaComplianceCard } from '../components/SlaCompliance';
import { useGetPreventiveMaintenance } from '../hooks/usePreventiveMaintaince';
import { MaintenanceCard } from '../components/PreventiveMaintainence';
import { useGetCostPerIncident } from '../hooks/useGetCostPerIncident';
import { CostPerIncidentCard } from '../components/CostPerIncidentCard';
import { useGetTicketsByStatus } from '../hooks/useGetTicketsByStatus';
import { TicketsByStatusCards } from '../components/TicketsByStatus';
import { useGetUserSatisfaction } from '../hooks/useUserSatisfaction';
import { UserSatisfactionCard } from '../components/UserSatisfactionCard';
import { useGetTicketsByDepartment } from '../hooks/useGetTicketsByDepartment';
import { useGetTicketsByIssueType } from '../hooks/useGetTicketsByIssueType';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const CriticalInterruptionsChart = lazy(() => import('../components/CriticalInterruptionsChart').then(module => ({ default: module.CriticalInterruptionsChart })));
const ResolutionTimeChart = lazy(() => import('../components/ResolutionTimeChart').then(module => ({ default: module.ResolutionTimeChart })));
const TicketsByDepartmentChart = lazy(() => import('../components/TicketsByDepartmentChart').then(module => ({ default: module.TicketsByDepartmentChart })));
const TicketsByIssueTypeChart = lazy(() => import('../components/TicketsByIssueTypeChart').then(module => ({ default: module.TicketsByIssueTypeChart })));

const ChartFallback = () => {
    return (
        <div className="flex h-70 w-full items-center justify-center rounded-xl border bg-muted/20">
            <div className="flex h-70 w-full items-center justify-center rounded-xl border bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </div>
    );
};

export const Dashboard = () => {
    const { t } = useTranslation();

    const {
        data: availabilityData,
        isLoading: isAvailabilityLoading,
        isError: isAvailabilityError
    } = useGetCriticalAvailability();

    const {
        data: mttrData,
        isLoading: isMttrLoading,
        isError: isMttrError
    } = useGetMttr();

    const {
        data: interruptionsData,
        isLoading: isInterruptionsLoading,
        isError: isInterruptionsError
    } = useGetCriticalInterruptions();

    const {
        data: resolutionData,
        isLoading: isResolutionLoading,
        isError: isResolutionError
    } = useGetResolutionTime();

    const {
        data: fcrData,
        isLoading: isFcrLoading,
        isError: isFcrError
    } = useFirstLevelResolution();

    const {
        data: slaData,
        isLoading: isSlaLoading,
        isError: isSlaError
    } = useGetSlaCompliance();

    const {
        data: maintenanceData,
        isLoading: isMaintLoading,
        isError: isMaintError
    } = useGetPreventiveMaintenance();

    const {
        data: costData,
        isLoading: isCostLoading,
        isError: isCostError
    } = useGetCostPerIncident();

    const {
        data: statusData,
        isLoading: isStatusLoading,
    } = useGetTicketsByStatus();

    const {
        data: satisfactionData,
        isLoading: isSatisfactionLoading,
        isError: isSatisfactionError
    } = useGetUserSatisfaction();

    const {
        data: deptData,
        isLoading: isDeptLoading,
        isError: isDeptError
    } = useGetTicketsByDepartment();

    const {
        data: issueData,
        isLoading: isIssueLoading,
        isError: isIssueError
    } = useGetTicketsByIssueType();

    return (
        <>

            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-xl font-bold tracking-tight">
                    {t('dashboards.title')}
                </h2>
            </div>

            <FilterDashboard />

            <div className="mx-auto space-y-2 mt-3">

                <TicketsByStatusCards data={statusData} isLoading={isStatusLoading} />

                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {isAvailabilityError ? (
                        <div className="flex h-30 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {t('dashboards.metrics.error')}
                            </p>
                        </div>
                    ) : (
                        <CriticalAvailabilityCard
                            data={availabilityData!}
                            isLoading={isAvailabilityLoading}
                        />
                    )}

                    {isMttrError ? (
                        <div className="flex h-30 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {t('dashboards.metrics.error')}
                            </p>
                        </div>
                    ) : (
                        <MttrMetricCard
                            data={mttrData!}
                            isLoading={isMttrLoading}
                        />
                    )}

                    {isFcrError ? (
                        <div className="flex h-30 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {t('dashboards.metrics.error')}
                            </p>
                        </div>
                    ) : (
                        <FirstLevelResolutionCard
                            data={fcrData!}
                            isLoading={isFcrLoading}
                        />
                    )}

                    {isSlaError ? (
                        <div className="flex h-30 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {t('dashboards.metrics.error')}
                            </p>
                        </div>
                    ) : (
                        <SlaComplianceCard
                            data={slaData!}
                            isLoading={isSlaLoading}
                        />
                    )}

                    {isMaintError ? (
                        <div className="flex h-30 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {t('dashboards.metrics.error')}
                            </p>
                        </div>
                    ) : (
                        <MaintenanceCard
                            data={maintenanceData!}
                            isLoading={isMaintLoading}
                        />
                    )}

                    {isCostError ? (
                        <div className="flex h-30 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {t('dashboards.metrics.error')}
                            </p>
                        </div>
                    ) : (
                        <CostPerIncidentCard
                            data={costData!}
                            isLoading={isCostLoading}
                        />
                    )}
                </div>

                <div className="flex flex-row flex-wrap gap-2 mt-3">
                    {isSatisfactionError ? (
                        <div className="flex h-30 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {t('dashboards.metrics.error')}
                            </p>
                        </div>
                    ) : (
                        <UserSatisfactionCard
                            data={satisfactionData!}
                            isLoading={isSatisfactionLoading}
                        />
                    )}


                    <div className="flex-1 flex w-full min-w-100 min-h-80 max-h-100 ">
                        {isInterruptionsError ? (
                            <div className="flex flex-1 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <Suspense fallback={<ChartFallback />}>
                                <CriticalInterruptionsChart
                                    response={interruptionsData!}
                                    isLoading={isInterruptionsLoading}
                                />
                            </Suspense>
                        )}
                    </div>


                    <div className="flex flex-1 w-full min-w-100 min-h-80 max-h-100">
                        {isResolutionError ? (
                            <div className="flex flex-1 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <Suspense fallback={<ChartFallback />}>
                                <ResolutionTimeChart
                                    response={resolutionData!}
                                    isLoading={isResolutionLoading}
                                />
                            </Suspense>
                        )}
                    </div>

                    <div className="flex-1 flex w-full min-w-100 min-h-70 max-h-100">
                        {isDeptError ? (
                            <div className="flex flex-1 h-87.5 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <Suspense fallback={<ChartFallback />}>
                                <TicketsByDepartmentChart
                                    data={deptData}
                                    isLoading={isDeptLoading}
                                />
                            </Suspense>
                        )}
                    </div>

                    <div className="flex-1 flex w-full min-w-100 min-h-90 max-h-100">
                        {isIssueError ? (
                            <div className="flex flex-1 h-87.5 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <Suspense fallback={<ChartFallback />}>
                                <TicketsByIssueTypeChart
                                    data={issueData}
                                    isLoading={isIssueLoading}
                                />
                            </Suspense>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};