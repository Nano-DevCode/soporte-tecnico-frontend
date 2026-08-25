import { useSmartNavigation } from "@/components/hooks/useSmartNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useGetOTFolio } from "../hooks/useGetOTFolio";
import { useEffect } from "react";
import { sileo } from "sileo";
import { CustomFormPageLayout } from "@/components/custom/CustomFormPageLayout";
import { DetailsTicketFolioSkeleton } from "../components/skeletons/DetailsTicketFolioSkeleton";
import { Separator } from "@/components/ui/separator";
import { CardFooter } from "@/components/ui/card";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Can } from "@/common/permission/Can";
import { DetailsOTFolio } from "../components/DetailsOTFolio";

export const ViewOTFolioPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { navigateFallback } = useSmartNavigation('/');

    const { isLoading, isError, data: otFolio } = useGetOTFolio();

    useEffect(() => {
        if (isLoading) return;

        if (isError || !otFolio) {
            sileo.error({
                title: t('folios.ot.not_found.title'),
                description: t('folios.ot.not_found.message'),
                duration: 6000,
            });
            navigateFallback();
        }
    }, [isError, isLoading, t, navigateFallback, otFolio]);

    if (isLoading || !otFolio) {
        return (
            <CustomFormPageLayout
                title={t('folios.ot.view_page.title')}
                description={t('folios.ot.view_page.description')}
                backLink={"/"}
            >
                <DetailsTicketFolioSkeleton />
            </CustomFormPageLayout>
        );
    }
    return (
        <CustomFormPageLayout
            title={t('folios.ot.view_page.title')}
            description={t('folios.ot.view_page.description')}
            backLink={"/"}
        >
            <DetailsOTFolio otFolio={otFolio} >
                <Can permission={'EDIT_RESPONSE_FOLIO'}>
                    <Separator />
                    <CardFooter>
                        <Button
                            className="ml-auto"
                            variant={"primary"}
                            onClick={() => navigate('/folios/ot/edit')}
                        >
                            <PencilLine />
                            {t('folios.actions.config_folio')}
                        </Button>
                    </CardFooter>
                </Can>
            </DetailsOTFolio>
        </CustomFormPageLayout>
    )
}
