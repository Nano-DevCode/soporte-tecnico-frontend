import type { SchoolPeriod } from "../interfaces/school-period.interface";
import { CalendarRange, Tag } from "lucide-react";
import { formatPeriodType } from "../utils/format-period-type";
import { toFormatLocalDateString } from "../../lib/helpers/to-format-local-date-string";
import { useTranslation } from "react-i18next";

interface Props {
    period: SchoolPeriod | null,
    isActivate: boolean
}

export const CardPeriodInfo = ({ period, isActivate }: Props) => {
    const { t, i18n } = useTranslation();

    if (!period) return null;

    return (
        <div className="flex flex-col gap-3 mt-1">
            <p className="text-sm text-muted-foreground">
                {isActivate
                    ? t('custom_dialog_active_school_period_page_description')
                    : t('custom_dialog_deactive_school_period_page_description')
                }
            </p>

            <div className="bg-background border rounded-xl p-3 text-left space-y-1.5 shadow-sm">
                <span className="font-bold text-foreground block text-sm">
                    {period.name}
                </span>

                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 shrink-0" />
                        <span className="capitalize">
                            {formatPeriodType(period.period_type, t)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CalendarRange className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            {toFormatLocalDateString(period.date_start, i18n.language)}
                            -
                            {toFormatLocalDateString(period.date_end, i18n.language)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};