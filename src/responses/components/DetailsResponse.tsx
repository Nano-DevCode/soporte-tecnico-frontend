import { Can } from '@/common/permission/Can'
import { CustomInfoRow } from '@/components/custom/CustomInfoRow'
import { toFormatLocalDateString } from '@/lib/helpers/to-format-local-date-string'
import { CalendarClock, FileText, Hash, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ResponseDetails } from '../interfaces/get-response-by-ticket'
import { DialogUpdateInternalFolio } from '@/tickets/components/details/DialogUpdateInternalFolio'

interface Props {
    response: ResponseDetails
}

export const DetailsResponse = ({ response }: Props) => {
    const { t, i18n } = useTranslation();
    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row flex-wrap gap-y-5 gap-x-2">
                <CustomInfoRow
                    icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                    label={t('responses.data.response_folio')}
                    value={
                        <div className="flex items-center">
                            {response.ticket.internal_folio}
                            <Can permission='EDIT_FOLIO_RESPONSE_REPORT'>
                                <DialogUpdateInternalFolio 
                                    ticketId={response.ticket.id} 
                                    currentFolio={response.ticket.internal_folio} 
                                />
                            </Can>
                        </div>
                    }
                />
                <CustomInfoRow
                    icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                    label={t('responses.data.ticket_folio')}
                    value={response.ticket.folio}
                />
            </div>
            <CustomInfoRow
                icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                label={t('responses.data.diagnosis')}
                value={response.diagnosis}
            />
            <CustomInfoRow
                icon={<Wrench className="w-4 h-4 text-muted-foreground" />}
                label={t('technical_reports.data.work_done')}
                value={response.work_done}
            />

            <div className="flex flex-col md:flex-row flex-wrap gap-y-5 gap-x-2">
                <CustomInfoRow
                    icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                    label={t('responses.data.maintenance_type')}
                    value={response.maintenance_type.name}
                />
                <CustomInfoRow
                    icon={<Hash className="w-4 h-4 text-muted-foreground" />}
                    label={t('responses.data.service_type')}
                    value={response.service_type.name}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                <CustomInfoRow
                    icon={<CalendarClock className="w-4 h-4 text-muted-foreground" />}
                    label={t('technical_reports.data.date')}
                    value={toFormatLocalDateString(response.created_at, i18n.language, 'PPp')}
                />
            </div>
        </div>
    )
}
