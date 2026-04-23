import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';

interface Props {
    isActive: boolean;
}

export const CustomIsActiveBadge = ({ isActive }: Props) => {
    const { t } = useTranslation();
    return (
        <Badge
            className={cn(
                'uppercase',
                isActive
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"

            )}
        >
            {isActive ?
                t("common.state.active") :
                t("common.state.inactive")}
        </Badge>
    )
}
