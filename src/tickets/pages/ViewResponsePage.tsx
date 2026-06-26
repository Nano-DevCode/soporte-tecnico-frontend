import { useSmartNavigation } from '@/components/hooks/useSmartNavigation';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { sileo } from 'sileo';
import { CustomTitlePageWithBack } from '@/components/custom/CustomTitlePageWithBack';
import { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CustomHeaderCard } from '@/components/custom/CustomHeaderCard';
import { MessageSquareReply } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useGetResponseByTicketId } from '@/responses/hooks/useGetResponseByTicketId';
import { DetailsTechnicalReportSkeleton } from '@/technical-reports/components/skeletons/DetailsTechnicalReportSkeleton';
import { DetailsResponse } from '@/responses/components/DetailsResponse';
import { Can } from '@/common/permission/Can';

export const ViewResponsePage = () => {

    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { navigateFallback } = useSmartNavigation('/tickets');

    const { isLoading, isError, data: response } = useGetResponseByTicketId(id);

    useEffect(() => {
        if (isLoading) return;

        if (isError || !response) {
            sileo.error({
                title: t('responses.not_found.title'),
                description: t('responses.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, response, t, navigateFallback]);

    if (isLoading || !response) {
        return (
            <div className="space-y-4">
                <CustomTitlePageWithBack
                    backLink={`/tickets/${id}`}
                    title={t('responses.view_page.title')}
                    description={t('responses.view_page.description')}
                />

                <Card>
                    <CardHeader className='gap-0'>
                        <CustomHeaderCard
                            title={t('responses.view_page.details.header.title')}
                            description={t('responses.view_page.details.header.description')}
                            icon={MessageSquareReply}
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
                backLink={`/tickets/${id}`}
                title={t('responses.view_page.title')}
                description={t('responses.view_page.description')}
            />

            <Card>
                <CardHeader className='gap-0'>
                    <CustomHeaderCard
                        title={t('responses.view_page.details.header.title')}
                        description={t('responses.view_page.details.header.description')}
                        icon={MessageSquareReply}
                    />
                </CardHeader>
                <Separator />
                <CardContent>
                    <DetailsResponse response={response} />
                </CardContent>
                <Separator />
                <CardFooter>
                    <Can permission='EDIT_RESPONSE_REPORT'>
                        <Button className='ml-auto' onClick={() => {
                            navigate(`/tickets/${id}/response/edit`)
                        }}>
                            {t('common.buttons.edit')}
                        </Button>
                    </Can>
                </CardFooter>
            </Card>
        </div>
    )
}
