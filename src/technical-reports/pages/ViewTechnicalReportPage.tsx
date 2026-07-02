import { useSmartNavigation } from '@/components/hooks/useSmartNavigation';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useGetTechnicalReportById } from '../hooks/useGetTechnicalReportById';
import { sileo } from 'sileo';
import { CustomTitlePageWithBack } from '@/components/custom/CustomTitlePageWithBack';
import { useEffect } from 'react';
import { DetailsTechnicalReport } from '../components/DetailsTechnicalReport';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CustomHeaderCard } from '@/components/custom/CustomHeaderCard';
import { ClipboardSignature, PencilLineIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { DetailsTechnicalReportSkeleton } from '../components/skeletons/DetailsTechnicalReportSkeleton';

export const ViewTechnicalReportPage = () => {

    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { navigateFallback } = useSmartNavigation('/technical-reports');

    const { isLoading, isError, data: technicalReports } = useGetTechnicalReportById(id);

    useEffect(() => {
        if (isLoading) return;

        if (isError || !technicalReports) {
            sileo.error({
                title: t('technical_reports.not_found.title'),
                description: t('technical_reports.not_found.description'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, technicalReports, t, navigateFallback]);

    if (isLoading || !technicalReports) {
        return (
            <div className="space-y-4">
                <CustomTitlePageWithBack
                    backLink="/technical-reports"
                    title={t('technical_reports.view_page.title')}
                    description={t('technical_reports.view_page.description')}
                />

                <Card>
                    <CardHeader className='gap-0'>
                        <CustomHeaderCard
                            title={t('technical_reports.view_page.details.header.title')}
                            description={t('technical_reports.view_page.details.header.description')}
                            icon={ClipboardSignature}
                        />
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <DetailsTechnicalReportSkeleton />
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            <CustomTitlePageWithBack
                backLink="/technical-reports"
                title={t('technical_reports.view_page.title')}
                description={t('technical_reports.view_page.description')}
            />

            <Card>
                <CardHeader className='gap-0'>
                    <CustomHeaderCard
                        title={t('technical_reports.view_page.details.header.title')}
                        description={t('technical_reports.view_page.details.header.description')}
                        icon={ClipboardSignature}
                    />
                </CardHeader>
                <Separator />
                <CardContent>
                    <DetailsTechnicalReport technicalReport={technicalReports} />
                </CardContent>
                <Separator />
                <CardFooter>
                    <Button className='ml-auto' onClick={() => {
                        navigate(`/technical-reports/${id}/edit`)
                    }}>
                        <PencilLineIcon />
                        {t('common.buttons.edit')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
