import { useTranslation } from 'react-i18next';
import { useGetCriticalAvailability } from '../hooks/useGetACriticalAvailabiity';
import { CriticalAvailabilityCard } from '../components/CriticalAvailability';
import { useGetMttr } from '../hooks/useGetMttrMetric';
import { MttrMetricCard } from '../components/MttrMetricCard';
import { useGetCriticalInterruptions } from '../hooks/useGetCriticalInterruptions';
import { CriticalInterruptionsChart } from '../components/CriticalInterruptionsChart';
import { ResolutionTimeChart } from '../components/ResolutionTimeChart';
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
import { TicketsByDepartmentChart } from '../components/TicketsByDepartmentChart';
import { TicketsByIssueTypeChart } from '../components/TicketsByIssueTypeChart';

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

                <div className="flex flex-row flex-wrap gap-2 items-stretch mt-3">
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
                    <div className="flex-1 flex w-full">
                        {isInterruptionsError ? (
                            <div className="flex flex-1 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <CriticalInterruptionsChart
                                response={interruptionsData!}
                                isLoading={isInterruptionsLoading}
                            />
                        )}
                    </div>

                    <div className="flex-1 flex w-full">
                        {isDeptError ? (
                            <div className="flex flex-1 h-87.5 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <TicketsByDepartmentChart
                                data={deptData}
                                isLoading={isDeptLoading}
                            />
                        )}
                    </div>

                    <div className="flex-1 flex w-full">
                        {isIssueError ? (
                            <div className="flex flex-1 h-87.5 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <TicketsByIssueTypeChart
                                data={issueData}
                                isLoading={isIssueLoading}
                            />
                        )}
                    </div>

                    <div className="flex flex-1 w-full">
                        {isResolutionError ? (
                            <div className="flex flex-1 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-4 text-center">
                                <p className="text-sm font-medium text-destructive">
                                    {t('dashboards.metrics.error')}
                                </p>
                            </div>
                        ) : (
                            <ResolutionTimeChart
                                response={resolutionData!}
                                isLoading={isResolutionLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};