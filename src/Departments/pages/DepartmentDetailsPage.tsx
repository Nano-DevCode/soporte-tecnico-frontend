import { 
  Building2, 
  Hash, 
  Tag, 
  Fingerprint, 
  Type,
  CalendarDays
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { sileo } from "sileo";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useDepartment } from "../hooks/useDepartment";
import { formatDate } from "@/users/util/formatDate"; 
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { t } from "i18next";

interface DepartmentDateProps {
  date?: string | Date;
}

const DepartmentDate = ({ date }: DepartmentDateProps) => {
  return date ? (
    <>{formatDate(date)}</>
  ) : (
    <span className="text-muted-foreground italic">N/A</span>
  );
};

export const DepartmentDetailsPage = () => {
  const navigate = useNavigate();
  const { department, error, isLoading } = useDepartment();

  useEffect(() => {
    if (error || (!isLoading && !department)) {
      sileo.error({
        title: "Departamento no encontrado",
        description: `${error?.message || "El registro no existe."}`,
        duration: 3500,
      });

      navigate("/department", { replace: true });
    }
  }, [error, department, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <CustomBackToList onBack={() => navigate('/departments')} backLabel="Regresar a Departamentos" />
        <CustomSkeletonInformation/>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      
      <CustomBackToList onBack={() => navigate('/departments')} backLabel="Regresar a Departamentos" actionUrl="department"/>

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
                {t("department_deatils_page_acronym")} <span className="text-foreground uppercase">{department?.acronym}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge 
              variant={department?.status ? "default" : "destructive"} 
              className={department?.status ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
            >
              {department?.status ? t("department_deatils_page_active") : t("department_deatils_page_suspended")}
            </Badge>

            <Badge 
              variant="secondary" 
              className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <Tag className="h-3 w-3" />
              {t("department_deatils_page_priority")} {department?.priority}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t("department_deatils_page_details_department")}
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                
                <div className="space-y-1 sm:col-span-2">
                  <dt className="font-medium text-muted-foreground">{t("department_deatils_id")} </dt>
                  <dd className="font-mono text-xs text-foreground break-all flex items-center gap-1.5">
                    <Fingerprint className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {department?.id || t("department_deatils_page_non")}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("department_deatils_actual_folio")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    {department?.folio || t("department_deatils_page_non")}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">Fecha de Creación</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    <DepartmentDate date={department?.createdAt} />
                  </dd>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <dt className="font-medium text-muted-foreground">{t("department_deatils_last_modification")}</dt>
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
                {t("department_details_page_system_status")}
              </h4>
              <dl className="grid grid-cols-1 gap-y-5 text-sm">
                
                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                  <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider"> {t("department_deatils_page_status")} </dt>
                  <dd className="font-bold text-base">
                    {department?.status ? t("department_details_page_system_status_up") : t("department_details_page_system_status_down")}
                  </dd>
                </div>

                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                  <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider">{t("department_deatils_page_preority_level")}</dt>
                  <dd className="font-bold text-base">
                    {department?.priority}
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