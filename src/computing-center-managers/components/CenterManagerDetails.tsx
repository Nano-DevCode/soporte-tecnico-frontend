import { CustomInfoRow } from '@/components/custom/CustomInfoRow'
import { Separator } from '@/components/ui/separator'
import { toFormatLocalDateString } from '@/lib/helpers/to-format-local-date-string'
import { CalendarDays, CheckCircle2, FileText, RefreshCw, User, UserRound, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { CenterManager } from '../interfaces/center-manager.interface'
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card'
import { CustomHeaderCard } from '@/components/custom/CustomHeaderCard'
import { CustomSectionInfo } from '@/components/custom/CustomSectionInfo'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { CustomIsActiveBadge } from '@/components/custom/CustomIsActiveBadge'

interface Props {
    manager: CenterManager
}

export const CenterManagerDetails = ({ manager }: Props) => {
    const { t, i18n } = useTranslation()

    return (
        <Card>
            <CardHeader className='gap-0'>
                <CustomHeaderCard
                    title={t('center_managers.form.header.title')}
                    description={t('center_managers.form.header.description')}
                    icon={User}
                />
                <CardAction className='self-end'>
                    <CustomIsActiveBadge isActive={manager.is_active} />
                </CardAction>
            </CardHeader>

            <Separator />

            <CardContent className='space-y-5'>
                <CustomSectionInfo label={t('center_managers.view_page.sections.personal_data')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <CustomInfoRow
                        icon={<UserRound className="w-4 h-4" />}
                        label={t('center_managers.form.fields.names.label')}
                        value={manager.names}
                    />
                    <CustomInfoRow
                        icon={<UserRound className="w-4 h-4" />}
                        label={t('center_managers.form.fields.first_last_name.label')}
                        value={manager.first_last_name}
                    />
                    <CustomInfoRow
                        icon={<UserRound className="w-4 h-4" />}
                        label={t('center_managers.form.fields.second_last_name.label')}
                        value={manager.second_last_name}
                    />
                    <CustomInfoRow
                        icon={<FileText className="w-4 h-4" />}
                        label={t('center_managers.form.fields.rfc.label')}
                        value={
                            <code className="font-mono text-sm tracking-widest text-foreground">
                                {manager.rfc}
                            </code>
                        }
                    />
                </div>

                <Separator />

                <CustomSectionInfo label={t('center_managers.view_page.sections.administrative_record')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <CustomInfoRow
                        icon={<CalendarDays className="w-4 h-4" />}
                        label={t('common.metadata.created_at')}
                        value={toFormatLocalDateString(manager.created_at, i18n.language, "PPP")}
                    />
                    <CustomInfoRow
                        icon={<RefreshCw className="w-4 h-4" />}
                        label={t('common.metadata.updated_at')}
                        value={toFormatLocalDateString(manager.updated_at, i18n.language, "PPP")}
                    />
                </div>

                <Separator />

                <CustomSectionInfo label={t('center_managers.view_page.sections.status')} />

                <Alert
                    className={manager.is_active
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                        : "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                    }
                >
                    {manager.is_active
                        ? (<CheckCircle2 />)
                        : (<XCircle />)}
                    <AlertTitle>
                        {manager.is_active
                            ? t('center_managers.view_page.status.active')
                            : t('center_managers.view_page.status.inactive')}
                    </AlertTitle>
                </Alert>
            </CardContent>
        </Card >
    )
}
