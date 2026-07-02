import { 
  Building2, 
  Tag, 
  Fingerprint, 
  Type,
  CalendarDays
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { sileo } from "sileo";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useDepartment } from "../hooks/useDepartment";
import { formatDate } from "@/users/util/formatDate"; 
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { cn } from "@/lib/utils";

interface DepartmentDateProps {
  date?: string | Date;
}

const DepartmentDate = ({ date }: DepartmentDateProps) => {
  const { t } = useTranslation();
  
  return date ? (
    <>{formatDate(date)}</>
  ) : (
    <span className="text-muted-foreground italic">{t("departments.pages.departmentDetailsPage.non")}</span>
  );
};

export const DepartmentDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { department, error, isLoading } = useDepartment();

  useEffect(() => {
    if (error || (!isLoading && !department)) {
      sileo.error({
        title: t("departments.pages.departmentDetailsPage.notFoundTitle"),
        description: `${error?.message || t("departments.pages.departmentDetailsPage.notFoundDescription")}`,
        duration: 3500,
      });

      navigate("/departments", { replace: true });
    }
  }, [error, department, isLoading, navigate, t]);

  // Función auxiliar para normalizar y pintar los badges según la prioridad (1 a 4)
  const getPriorityDetails = (priority?: number | string) => {
    const p = Number(priority);
    switch (p) {
      case 1:
        return {
          label: t("departments.components.customDepartmentForm.priorityCritical"),
          className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
        };
      case 2:
        return {
          label: t("departments.components.customDepartmentForm.priorityHigh"),
          className: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
        };
      case 3:
        return {
          label: t("departments.components.customDepartmentForm.priorityMedium"),
          className: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
        };
      case 4:
      default:
        return {
          label: t("departments.components.customDepartmentForm.priorityLow"),
          className: "bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
        };
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <CustomTitlePageWithBack 
          backLink="/departments"
          title={t("departments.pages.departmentDetailsPage.title")}
          description={t("departments.pages.departmentDetailsPage.description")}
        />
        <CustomSkeletonInformation/>
      </div>
    );
  }

  const priorityDetails = getPriorityDetails(department?.priority);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      
      <CustomTitlePageWithBack 
        backLink="/departments"
        title={t("departments.pages.departmentDetailsPage.title")}
        description={t("departments.pages.departmentDetailsPage.description")}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">

          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Building2 className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold leading-none tracking-tight">
                {department?.name}
              </h3>
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Type className="h-3.5 w-3.5" />
                {t("departments.pages.departmentDetailsPage.acronym")} <span className="text-foreground uppercase">{department?.acronym}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={department?.status ? "default" : "destructive"} 
              className={department?.status ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
            >
              {department?.status ? t("departments.pages.departmentDetailsPage.active") : t("departments.pages.departmentDetailsPage.suspended")}
            </Badge>

            <Badge 
              variant="secondary" 
              className={cn("gap-1 hover:bg-opacity-80 transition-all", priorityDetails.className)}
            >
              <Tag className="h-3 w-3" />
              {priorityDetails.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t("departments.pages.departmentDetailsPage.title")}
              </h4>
              <dl className="grid grid-cols-1 gap-y-4 gap-x-6 text-sm">
                
                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("departments.pages.departmentDetailsPage.id")} </dt>
                  <dd className="font-mono text-xs text-foreground break-all flex items-center gap-1.5">
                    <Fingerprint className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {department?.id || t("departments.pages.departmentDetailsPage.non")}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("departments.pages.departmentDetailsPage.creationDate")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    <DepartmentDate date={department?.createdAt} />
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("departments.pages.departmentDetailsPage.lastModification")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    <DepartmentDate date={department?.updatedAt} />
                  </dd>
                </div>

              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {t("departments.pages.departmentDetailsPage.systemStatus")}
              </h4>
              <dl className="grid grid-cols-1 gap-y-5 text-sm">
                
                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                  <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider"> {t("departments.pages.departmentDetailsPage.status")} </dt>
                  <dd className="font-bold text-base">
                    {department?.status ? t("departments.pages.departmentDetailsPage.systemStatusUp") : t("departments.pages.departmentDetailsPage.systemStatusDown")}
                  </dd>
                </div>

                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                  <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider">{t("departments.pages.departmentDetailsPage.priorityLevel")}</dt>
                  <dd className="font-bold text-base">
                    {priorityDetails.label}
                  </dd>
                </div>

              </dl>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDetailsPage;