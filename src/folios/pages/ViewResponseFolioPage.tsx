import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useGetResponseFolio } from "../hooks/useGetResponseFolio";
import { useEffect } from "react";
import { sileo } from "sileo";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsTicketFolioSkeleton } from "../components/skeletons/DetailsTicketFolioSkeleton";
import { Separator } from "@/components/ui/separator";
import { CardFooter } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Can } from "@/common/permission/Can";
import { DetailsResponseFolio } from "../components/DetailsResponseFolio";

export const ViewResponseFolioPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { navigateFallback } = useSmartNavigation('/');

    const { isLoading, isError, data: responseFolio } = useGetResponseFolio();

    useEffect(() => {
        if (isLoading) return;

        if (isError || !responseFolio) {
            sileo.error({
                title: t('folios.responses.not_found.title'),
                description: t('folios.responses.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, t, navigateFallback, responseFolio]);

    if (isLoading || !responseFolio) {
        return (
            <CustomFormPageLayout
                title={t('folios.responses.view_page.title')}
                description={t('folios.responses.view_page.description')}
                backLink={"/"}
            >
                <DetailsTicketFolioSkeleton />
            </CustomFormPageLayout>
        );
    }
    return (
        <CustomFormPageLayout
            title={t('folios.responses.view_page.title')}
            description={t('folios.responses.view_page.description')}
            backLink={"/"}
        >
            <DetailsResponseFolio responseFolio={responseFolio} >
                <Can permission={'EDIT_RESPONSE_FOLIO'}>
                    <Separator />
                    <CardFooter>
                        <Button
                            className="ml-auto"
                            variant={"default"}
                            onClick={() => navigate('/folios/responses/edit')}
                        >
                            <PencilLine />
                            {t('folios.actions.config_folio')}
                        </Button>
                    </CardFooter>
                </Can>
            </DetailsResponseFolio>
        </CustomFormPageLayout>
    )
}
