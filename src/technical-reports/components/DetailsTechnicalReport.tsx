import { CustomInfoRow } from '@/components/custom/CustomInfoRow'
import { toFormatLocalDateString } from '@/lib/helpers/to-format-local-date-string'
import { Bug, CalendarClock, FileText, Info, Package, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TechnicalReportDetails } from '../interfaces/technical-report-details.interface'
import { CustomEquipmentSummaryCard } from '@/Equipments/components/CustomEquipmentSummaryCard'

interface Props {
    technicalReport: TechnicalReportDetails
}

export const DetailsTechnicalReport = ({ technicalReport }: Props) => {
    const { t, i18n } = useTranslation();
    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row flex-wrap gap-y-5 gap-x-2">
                <CustomInfoRow
                    icon={<Info className="w-4 h-4 text-muted-foreground" />}
                    label={t('technical_reports.data.is_resolved.label')}
                    value={
                        technicalReport.is_resolved
                            ? t('technical_reports.data.is_resolved.true')
                            : t('technical_reports.data.is_resolved.false')
                    }
                />
                <CustomInfoRow
                    icon={<Bug className="w-4 h-4 text-muted-foreground" />}
                    label={t('technical_reports.data.fault_validity')}
                    value={technicalReport.fault_validity.name}
                />
            </div>
            <CustomInfoRow
                icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                label={t('technical_reports.data.diagnosis')}
                value={technicalReport.diagnosis}
            />
            <CustomInfoRow
                icon={<Wrench className="w-4 h-4 text-muted-foreground" />}
                label={t('technical_reports.data.work_done')}
                value={technicalReport.work_performed}
            />
            <CustomInfoRow
                icon={<Package className="w-4 h-4 text-muted-foreground" />}
                label={t('technical_reports.data.equipments')}
                value={
                    <div className='flex flex-col sm:flex-row flex-wrap gap-2 mt-1'>
                        {(technicalReport.equipments && technicalReport.equipments.length > 0)
                            ? technicalReport.equipments.map((eq) => (
                                <CustomEquipmentSummaryCard key={eq.id} equipment={eq} />
                            ))
                            : t('technical_reports.data.materials_none_used')
                        }
                    </div>
                }
            />
            <CustomInfoRow
                icon={<Package className="w-4 h-4 text-muted-foreground" />}
                label={t('technical_reports.data.materials_used')}
                value={technicalReport.materials_used || t('technical_reports.data.materials_none_used')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
                <CustomInfoRow
                    icon={<CalendarClock className="w-4 h-4 text-muted-foreground" />}
                    label={t('technical_reports.data.date')}
                    value={toFormatLocalDateString(technicalReport.created_at, i18n.language, 'PPp')}
                />
            </div>
        </div>
    )
}
