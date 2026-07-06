import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileSpreadsheet, SmilePlus } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetTicketsSummaryExcel } from "../hooks/useTicketsSummaryExcel";
import { useGetSurveysReportExcel } from "../hooks/useGetSurveysReportExcel"; // <-- Nuevo import
import { useSchoolPeriods } from "@/school-periods/hooks/useSchoolPeriods";
import { sileo } from "sileo";

export const ReportsPage = () => {
  const { t } = useTranslation();

  const { mutate: downloadTicketsExcel, isPending: isDownloadingTickets } = useGetTicketsSummaryExcel();
  const { mutate: downloadSurveysExcel, isPending: isDownloadingSurveys } = useGetSurveysReportExcel(); // <-- Hook de encuestas

  const { data: schoolPeriods, isLoading: loadingPeriods } = useSchoolPeriods();

  const [periodTickets, setPeriodTickets] = useState<string | undefined>(undefined);
  const [periodSurveys, setPeriodSurveys] = useState<string | undefined>(undefined);

  const handleDownloadTicketsReport = () => {
    if (periodTickets === undefined) {
      sileo.error({
        title: t('common.errors.title'),
        description: t('reports.errors.period_requiered')
      });
      return;
    }
    downloadTicketsExcel(periodTickets);
  };

  const handleDownloadSurveysReport = () => {
    if (periodSurveys === undefined) {
      sileo.error({
        title: t('common.errors.title'),
        description: t('reports.errors.period_requiered')
      });
      return;
    }
    downloadSurveysExcel(periodSurveys);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('reports.page_title')}</h1>
        <p className="text-muted-foreground">
          {t('reports.page_description')}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              {t('reports.tickets_summary.title')}
            </CardTitle>
            <CardDescription>
              {t('reports.tickets_summary.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label>{t('reports.tickets_summary.select_period')}</Label>
              <Select
                disabled={isDownloadingTickets || loadingPeriods}
                value={periodTickets}
                onValueChange={(value) => setPeriodTickets(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('tickets.list_page.table.headers.school_period')} />
                </SelectTrigger>
                <SelectContent>
                  {schoolPeriods?.data.map((sp) => (
                    <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleDownloadTicketsReport}
              disabled={isDownloadingTickets || !periodTickets}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloadingTickets ? t('common.buttons.downloading') : t('common.buttons.download_excel')}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SmilePlus className="w-5 h-5 text-emerald-600" />
              {t('reports.surveys_report.title', 'Encuestas de Satisfacción')}
            </CardTitle>
            <CardDescription>
              {t('reports.surveys_report.description', 'Descarga el historial y promedios de satisfacción de los tickets resueltos en Excel.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label>{t('reports.tickets_summary.select_period')}</Label>
              <Select
                disabled={isDownloadingSurveys || loadingPeriods}
                value={periodSurveys}
                onValueChange={(value) => setPeriodSurveys(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('tickets.list_page.table.headers.school_period')} />
                </SelectTrigger>
                <SelectContent>
                  {schoolPeriods?.data.map((sp) => (
                    <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleDownloadSurveysReport}
              disabled={isDownloadingSurveys || !periodSurveys}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloadingSurveys ? t('common.buttons.downloading') : t('common.buttons.download_excel')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};