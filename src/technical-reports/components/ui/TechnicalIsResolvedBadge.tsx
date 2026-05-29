import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
    isResolved: boolean;
}
export const TechnicalIsResolvedBadge = ({ isResolved }: Props) => {
    const { t } = useTranslation();
    return (
        isResolved ? (
            <Badge className="bg-green-100 border-green-200 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 ">
                <CheckCircle2 className="h-3 w-3" /> {t('technical_reports.data.is_resolved.true')}
            </Badge>
        ) : (
            <Badge className="text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:text-yellow-500">
                <Clock className="h-3 w-3" /> {t('technical_reports.data.is_resolved.false')}
            </Badge>
        )

    )
}
