import { IdCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CenterManager } from "../interfaces/center-manager.interface";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFullName } from "@/users/util/extraUtil";

interface Props {
    manager: CenterManager | null;
    isActivate: boolean;
}

export const CardCenterManagerInfo = ({ manager, isActivate }: Props) => {
    const { t } = useTranslation();

    if (!manager) return null;

    const fullName = getFullName(
        manager.names,
        manager.first_last_name,
        manager.second_last_name
    );

    return (
        <div>
            <p className="text-sm text-muted-foreground mb-3">
                {isActivate
                    ? t('center_managers.dialog.active.description')
                    : t('center_managers.dialog.deactive.description')
                }
            </p>

            <Alert>
                <IdCard className="h-4 w-4" />
                <AlertTitle>{fullName}</AlertTitle>
                <AlertDescription className="font-mono uppercase tracking-widest">
                    {manager.rfc}
                </AlertDescription>
            </Alert>
        </div>
    );
};