import { User, Loader2, Building, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStaff } from "@/users/hooks/useStaff"; 
import { Badge } from "@/components/ui/badge";

const getInitials = (name?: string, surname?: string) => {
  return `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase() || "U";
};

interface StaffDetailsCardProps {
  staffId?: string;
}

export const StaffDetailsCard = ({ staffId }: StaffDetailsCardProps) => {
  const { t } = useTranslation();

  const { staff: fullStaff, isLoadingStaff } = useStaff("", staffId);

  if (!staffId) return null;

  return (
    <div className="relative overflow-hidden bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-xl p-5 transition-all hover:shadow-md sm:col-span-1">
        {/* Ícono de fondo */}
        <div className="absolute -right-4 -bottom-4 text-amber-500/5 dark:text-amber-400/5 pointer-events-none">
            <User className="h-32 w-32" />
        </div>
        
        <div className="relative z-10 flex gap-4 items-start">
            
            {/* Avatar moderno con iniciales */}
            {isLoadingStaff ? (
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2.5 rounded-lg shrink-0 shadow-sm border border-amber-200 dark:border-amber-800 flex items-center justify-center h-11 w-11">
                    <Loader2 className="h-5 w-5 text-amber-700 dark:text-amber-400 animate-spin" />
                </div>
            ) : fullStaff ? (
                <div className="bg-amber-600 dark:bg-amber-700 text-amber-50 shrink-0 shadow-sm border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center h-12 w-12 rounded-full font-bold text-lg tracking-wider">
                    {getInitials(fullStaff.name, fullStaff.paternalSurname)}
                </div>
            ) : (
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2.5 rounded-lg shrink-0 shadow-sm border border-amber-200 dark:border-amber-800">
                    <User className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                </div>
            )}

            <div className="flex-1 space-y-1">
                <h4 className="text-xs font-bold text-amber-800/80 dark:text-amber-300/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    {t("users.components.staffDetailsCard.title")}
                </h4>
                
                {isLoadingStaff ? (
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="h-4 w-3/4 bg-amber-200/50 dark:bg-amber-800/50 rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-amber-200/30 dark:bg-amber-800/30 rounded animate-pulse mt-1" />
                    </div>
                ) : fullStaff ? (
                    <>
                        <p className="text-base font-black text-foreground leading-tight">
                            {`${fullStaff.name} ${fullStaff.paternalSurname} ${fullStaff.maternalSurname || ""}`.trim()}
                        </p>
                        
                        {/* Badges para los identificadores */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5 pb-2">
                            <Badge variant="secondary" className="bg-amber-100/80 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] px-1.5 py-0 hover:bg-amber-200/50">
                                {t("users.components.staffDetailsCard.nc")}: {fullStaff.num_control}
                            </Badge>
                            <Badge variant="secondary" className="bg-amber-100/80 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] px-1.5 py-0 hover:bg-amber-200/50">
                                {t("users.components.staffDetailsCard.rfc")}: {fullStaff.rfc}
                            </Badge>
                        </div>

                        {/* Departamento y Coordinación con íconos sutiles */}
                        <div className="space-y-1 mt-1 border-t border-amber-200/50 dark:border-amber-800/50 pt-2">
                            {fullStaff.department && (
                                <p className="text-[11px] font-medium text-muted-foreground leading-tight flex items-start gap-1.5">
                                    <Building className="h-3.5 w-3.5 text-amber-600/60 dark:text-amber-400/60 shrink-0 mt-0.5" />
                                    <span>{fullStaff.department.name}</span>
                                </p>
                            )}
                            {fullStaff.coordination && (
                                <p className="text-[11px] font-medium text-muted-foreground leading-tight flex items-start gap-1.5">
                                    <Briefcase className="h-3.5 w-3.5 text-amber-600/60 dark:text-amber-400/60 shrink-0 mt-0.5" />
                                    <span>{fullStaff.coordination.name}</span>
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {t("users.components.staffDetailsCard.noData")}
                    </p>
                )}
            </div>
        </div>
    </div>
  );
};