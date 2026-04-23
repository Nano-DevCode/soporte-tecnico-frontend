import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useCenterManager } from "../hooks/useCenterManager";
import { useEffect } from "react";
import { sileo } from "sileo";
import { CenterManagerDetails } from "../components/CenterManagerDetails";

export const ViewCenterManagerPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { isLoading, isError, data: manager } = useCenterManager(id);

    useEffect(() => {
        if (!isLoading && (isError || !manager)) {
            sileo.error({
                title: t('center_managers.view_page.not_found.title'),
                description: t('center_managers.view_page.not_found.message'),
                duration: 6000,
            });

            navigate('/center-managers', { replace: true });
        }
    }, [isError, isLoading, manager, id, navigate, t]);


    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!manager) {
        return null;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
                <CustomTitlePageWithBack
                    backLink="/center-managers"
                    title={t('center_managers.view_page.title')}
                    description={t('center_managers.view_page.description')}
                />

                <Button asChild className="w-full sm:w-auto">
                    <Link to={`/center-managers/${manager.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('common.buttons.edit')}
                    </Link>
                </Button>
            </div>

            <CenterManagerDetails manager={manager} />
        </div>
    );
};