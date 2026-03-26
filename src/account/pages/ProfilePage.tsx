import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  UserCircle, Mail, Briefcase, Hash, Send, 
  Building, ShieldCheck, User 
} from "lucide-react";
import { CustomReadOnlyField } from "../components/CustomReadOnlyField";
import { useProfile } from "../hooks/useUserProfile";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { data: user, isLoading} = useProfile();

  if (isLoading) return <p className="p-8 text-center text-muted-foreground">Cargando perfil...</p>;

  return (
    <div className="flex w-full max-w-5xl flex-col p-4 md:p-8 mx-auto animate-in fade-in duration-500">
      
      <CustomTitleCard 
        title={t("profile_page_title")}
        description={t("profile_page_description")}
        icon={User} 
      />

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardContent className="flex flex-col items-center p-6 text-center">
            
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-muted border-4 border-background shadow-sm flex items-center justify-center mb-4">
              <UserCircle className="h-12 w-12 md:h-14 md:w-14 text-muted-foreground/50" />
            </div>
            
            <h2 className="text-lg md:text-xl font-bold text-foreground">{user?.staff.name}</h2>
            <h2 className="text-lg md:text-xl font-bold text-foreground">{user?.staff.paternalSurname} {user?.staff.maternalSurname}</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">{user?.role.name}</p>
            
            <div className="mt-5 w-full flex items-center justify-center gap-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 py-1.5 px-3 rounded-full text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              {t("profile_page_active")}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3 shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4 pt-5 px-4 md:px-6">
            <CardTitle className="text-base md:text-lg">{t("profile_page_info_user")}</CardTitle>
            <CardDescription>{t("profile_page_info_user_description")}</CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              
              <div className="md:col-span-2">
                <CustomReadOnlyField 
                  icon={Mail} 
                  label={t("profile_page_email")}
                  value={user?.email} 
                />
              </div>

              <div className="md:col-span-2 mt-1">
                <CustomReadOnlyField 
                  icon={UserCircle} 
                  label={t("profile_page_names")} 
                  value={user?.staff.name} 
                />
              </div>

              <CustomReadOnlyField 
                icon={UserCircle} 
                label={t("profile_page_first_last_name")}
                value={user?.staff.paternalSurname} 
              />
              <CustomReadOnlyField 
                icon={UserCircle} 
                label={t("profile_page_second_last_name")}
                value={user?.staff.maternalSurname} 
              />

              <Separator className="md:col-span-2 my-2 bg-border/60" />

              <CustomReadOnlyField 
                icon={Hash} 
                label={t("profile_page_control_number")} 
                value={user?.staff.num_control} 
              />
              {
                user?.staff.idTelegram && (
                  <CustomReadOnlyField 
                    icon={Send} 
                    label={t("profile_page_id_telegram")}
                    value={user?.staff.idTelegram || t("profile_page_telegram_unvinculate")} 
                  />
                )
              }

              <CustomReadOnlyField 
                icon={Building} 
                label={t("profile_page_departament")}
                value={user?.staff.department.name} 
              />
              <CustomReadOnlyField 
                icon={Briefcase} 
                label={t("profile_page_role")} 
                value={user?.role.name} 
              />
              
              {user?.staff.coordination.name !== 'Sin Coordianción' && (
                <CustomReadOnlyField 
                  icon={Briefcase} 
                  label={t("profile_page_coordination")} 
                  value={user?.staff.coordination.name} 
                />
              )}

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};