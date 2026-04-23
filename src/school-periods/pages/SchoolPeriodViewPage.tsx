import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router";
import { useSchoolPeriod } from "../hooks/useSchoolPeriod";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { CalendarRange, Edit, CalendarDays, Tag, Activity } from "lucide-react";
import { formatPeriodType } from "../utils/format-period-type";
import { cn } from "@/lib/utils";

export const SchoolPeriodViewPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();

    const { isLoading, isError, data: schoolPeriod } = useSchoolPeriod(id || '');

    const currentLocale = i18n.language === 'en' ? enUS : es;

    if (isError) {
        return <Navigate to="/school-period" />;
    }

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!schoolPeriod) {
        return <Navigate to="/school-period" />;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">

            {/* ENCABEZADO Y BOTÓN AGRUPADOS EN UNA SOLA FILA/COLUMNA */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <CustomTitlePageWithBack
                    backLink="/school-period"
                    title={t('view_school_period_page_title')}
                    description={t('view_school_period_page_description')}
                />

                <Link
                    to={`/school-period/${schoolPeriod.id}/edit`}
                    className="w-full sm:w-auto mt-2 sm:mt-0"
                >
                    <Button className="w-full sm:w-auto">
                        <Edit className="mr-2 h-4 w-4" />
                        {t('view_school_period_button_update')}
                    </Button>
                </Link>

            </div>

            {/* TARJETA DE INFORMACIÓN */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <CustomTitleCard
                    title={t('view_school_period_section_data_title')}
                    description={t('view_school_period_section_data_description')}
                    icon={CalendarRange}
                />

                <Separator className="my-5" />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                    {/* DATO: Nombre*/}
                    <div className="space-y-1">
                        <div className="flex items-center text-sm font-semibold text-muted-foreground">
                            <Tag className="mr-2 h-4 w-4" />
                            {t('view_school_period_section_data_name')}
                        </div>
                        <p className="text-xl font-bold tracking-tight">{schoolPeriod.name}</p>
                    </div>

                    {/* DATO: Tipo de Periodo */}
                    <div className="space-y-1">
                        <div className="flex items-center text-sm font-semibold text-muted-foreground">
                            <CalendarRange className="mr-2 h-4 w-4" />
                            {t('view_school_period_section_data_period_type')}
                        </div>
                        <p className="text-xl font-medium">{formatPeriodType(schoolPeriod.period_type, t)}</p>
                    </div>

                    {/* DATO: Fecha de Inicio */}
                    <div className="space-y-1">
                        <div className="flex items-center text-sm font-semibold text-muted-foreground">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {t('view_school_period_section_data_date_start')}
                        </div>
                        <p className="text-lg">
                            {format(schoolPeriod.date_start, "PPP", { locale: currentLocale })}
                        </p>
                    </div>

                    {/* DATO: Fecha de Fin */}
                    <div className="space-y-1">
                        <div className="flex items-center text-sm font-semibold text-muted-foreground">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-50" />
                            {t('view_school_period_section_data_date_end')}
                        </div>
                        <p className="text-lg">
                            {format(schoolPeriod.date_end, "PPP", { locale: currentLocale })}
                        </p>
                    </div>

                    {/* DATO: Estado Activo/Inactivo */}
                    <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center text-sm font-semibold text-muted-foreground">
                            <Activity className="mr-2 h-4 w-4" />
                            {t("view_school_period_section_data_status")}
                        </div>
                        <div>
                            <Badge
                                className={cn(
                                    "font-semibold px-2.5 py-0.5 rounded-full shadow-sm",
                                    schoolPeriod.is_active === true
                                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                        : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                )}
                            >
                                {schoolPeriod.is_active === true ?
                                    t("view_school_period_section_data_status_active") :
                                    t("view_school_period_section_data_status_inactive")}
                            </Badge>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};