import { 
  User as UserIcon, 
  Mail, 
  Building2, 
  Briefcase, 
  Hash, 
  Send, 
  ShieldCheck, 
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useUser } from "../hooks/useUser";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { CustomUserSkeleton } from "../components/CustomUserSkeleton";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { sileo } from "sileo";
import { formatDate } from "../util/formatDate";
import { t } from "i18next";

export const UserDetailsPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, isError } = useUser();

  if (isLoading) {
    return <CustomUserSkeleton />;
  }

  if (isError || !user) {
    sileo.error({
      title: t("user_details_page_sileo_error_title"),
      description: t("user_details_page_sileo_error_description"),
      duration: 9500,
    });
    navigate('/users');
    return null;
  }

  const renderDate = (dateString?: string | Date) => {
    return dateString ? formatDate(dateString) : <span className="text-muted-foreground italic">{t("user_details_page_non")}</span>;
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      
      <CustomBackToList onBack={() => navigate('/users')} backLabel={t("user_details_page_back_to_user")}actionUrl="user"/>

      <Card>

        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">

          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary">
                <UserIcon className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold leading-none tracking-tight">
                {user.staff?.name} {user.staff?.paternalSurname} {user.staff?.maternalSurname}
              </h3>
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">

            <Badge 
              variant={user.status ? "default" : "destructive"} 
              className={user.status ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
            >
              {user.status ? t("user_details_page_account_up") : t("user_details_page_account_down")}
            </Badge>

            <Badge 
              variant="secondary" 
              className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <ShieldCheck className="h-3 w-3" />
              {user.role?.name || t("user_details_page_non")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {t("user_details_page_information_laboral")}
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                
                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("user_details_page_n_control")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    {user.staff?.num_control || t("user_details_page_non")}
                  </dd>
                </div>
                
                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">RFC</dt>
                  <dd className="font-semibold uppercase">
                    {user.staff?.rfc || t("user_details_page_non")}
                  </dd>
                </div>

                {user.staff?.coordination?.name !== 'Sin Coordinación' && (
                  <div className="space-y-1">
                    <dt className="font-medium text-muted-foreground">ID {t("user_details_page_telegram")}</dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <Send className="h-3.5 w-3.5 text-muted-foreground" />
                      {user.staff?.idTelegram || t("user_details_page_non")}
                    </dd>
                  </div>
                )}

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("user_details_page_date_register")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    {renderDate(user.createdAt)}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("user_details_page_update_credentials")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    {renderDate(user.updatedAt)}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("user_details_page_update_info")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    {renderDate(user.staff?.updatedAt)}
                  </dd>
                </div>

              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t("user_details_page_department")}
              </h4>
              <dl className="grid grid-cols-1 gap-y-5 text-sm">
                
                <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                  <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider"> {t("user_details_page_department")} </dt>
                  <dd className="font-bold text-base">
                    {user.staff?.department?.name || t("user_details_page_non")}
                  </dd>
                </div>

                {user.staff?.coordination?.name !== 'Sin Coordinación' && (
                  <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                    <dt className="font-medium text-muted-foreground mb-1 text-xs uppercase tracking-wider">{t("user_details_page_coordination")}</dt>
                    <dd className="font-bold text-base">
                      {user.staff.coordination.name}
                    </dd>
                  </div>
                )}

              </dl>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};