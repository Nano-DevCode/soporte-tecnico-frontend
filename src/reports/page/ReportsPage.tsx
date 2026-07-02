import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileSpreadsheet } from "lucide-react";

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
import { useSchoolPeriods } from "@/school-periods/hooks/useSchoolPeriods";
import { sileo } from "sileo";

export const ReportsPage = () => {
  const { t } = useTranslation();

  const { mutate: downloadTicketsExcel, isPending: isDownloadingTickets } = useGetTicketsSummaryExcel();
  const { data: schoolPeriods, isLoading: loadingPeriods } = useSchoolPeriods();

  const [period, setPeriod] = useState<string | undefined>(undefined);

  const handleDownloadTicketsReport = () => {
    if (period === undefined) {
      sileo.error({
        title: t('common.errors.title'),
        description: t('reports.errors.period_requiered')
      })
      return;
    }
    downloadTicketsExcel(period);
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
                value={period}
                onValueChange={(value) => setPeriod(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('tickets.list_page.table.headers.school_period')} />
                </SelectTrigger>
                <SelectContent>
                  {
                    schoolPeriods?.data.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleDownloadTicketsReport}
              disabled={isDownloadingTickets || !period}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloadingTickets ? t('common.buttons.downloading') : t('common.buttons.download_excel')}
            </Button>
          </CardFooter>
        </Card>

        {/* <Card className="flex flex-col opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {t('reports.performance.title')}
            </CardTitle>
            <CardDescription>
              {t('reports.performance.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground italic">
              {t('reports.coming_soon')}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <Download className="w-4 h-4 mr-2" />
              {t('common.buttons.download_pdf')}
            </Button>
          </CardFooter>
        </Card> */}

      </div>
    </div >
  );
};