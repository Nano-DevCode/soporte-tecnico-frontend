import { useState, useCallback, useMemo } from "react";
import { Users, Plus, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { Link } from "react-router";

import { CustomUserDesktopTable } from "../components/CustomUserDesktopTable";
import { CustomUserMobilCard } from "../components/CustomUserMobilCard";
import { CustomUserFilters } from "../components/CustomUserFilters";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../interfaces/users.response";
import { getFullName } from "../util/extraUtil";

import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "i18next";

const UserPage = () => {
  const { users = [], meta, isLoading: skelettonLoading, isUpdating, changeStatus } = useUsers();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [userSeleccionado, setUserSeleccionado] = useState<User | null>(null);

  const handleStatusClick = useCallback((user: User) => {
    setUserSeleccionado(user);
    setStatusDialogOpen(true);
  }, []);

  const handleStatusConfirm = async () => {
    if (!userSeleccionado) return;

    try {
      await changeStatus({ 
        id: userSeleccionado.id || "", 
        status: !userSeleccionado.status 
      });
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
    }
  };

  const dialogDescription = useMemo(() => {
    if (!userSeleccionado) return null;

    const fullName = getFullName(
      userSeleccionado.staff.name, 
      userSeleccionado.staff.paternalSurname, 
      userSeleccionado.staff.maternalSurname
    );

    return (
      <div className="space-y-2">
        <div className={cn(
          "rounded-lg p-3 border",
          userSeleccionado.status 
            ? "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50" 
            : "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50"
        )}>
          <p className={cn(
            "font-bold text-lg",
            userSeleccionado.status ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"
          )}>
            {fullName}
          </p>
          <div className="flex flex-col gap-0.5 mt-1">
            <span className={cn(
              "text-[10px] font-mono",
              userSeleccionado.status ? "text-red-600/70 dark:text-red-400/50" : "text-blue-600/70 dark:text-blue-400/50"
            )}>
              {t("users_page_n_control")} {userSeleccionado.staff.num_control}
            </span>
            <span className={cn(
              "text-[11px] font-medium",
              userSeleccionado.status ? "text-red-600/80 dark:text-red-400/70" : "text-blue-600/80 dark:text-blue-400/70"
            )}>
              {userSeleccionado.email}
            </span>
          </div>
        </div>

        <p className="text-sm italic pt-1 text-muted-foreground">
          {userSeleccionado.status 
            ? t("users_page_down_user")
            : t("users_page_up_user")}
        </p>
      </div>
    );
  }, [userSeleccionado]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Lado izquierdo */}
        <CustomTitleCard icon={Users} title={t("users_page_custom_title_card")} description={t("users_page_custom_description_card")}/>

        {/* Botón */}
        <Link to="/users/new">
          <Button className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800">
            <Plus className="mr-2 h-4 w-4" />
            {t("users_page_create_user")}
          </Button>
        </Link>
        
      </div>

      {/* Custom Dialog para cambiar el estatus del usuario */}
      <CustomDialogConfirm
        open={statusDialogOpen}
        isLoading={isUpdating}
        variant={userSeleccionado?.status ? "danger" : "primary"}
        title={userSeleccionado?.status ? "Confirmar baja del usuario" : "Confirmar alta del usuario"}
        description={dialogDescription}
        icon={userSeleccionado?.status ? AlertTriangle : ArrowUpCircle}
        onConfirm={handleStatusConfirm}
        onOpenChange={setStatusDialogOpen}
        confirmText={userSeleccionado?.status ? "Sí, dar de baja" : "Sí, dar de alta"}
        cancelText="Cancelar"
      />

      <CustomUserFilters/>

      {skelettonLoading ? (
        <CustomSkeletonTableCard/>
      ) : (
        <>
          <CustomUserDesktopTable
            users={users}
            handleStatusClick={handleStatusClick} 
          />
          <CustomUserMobilCard
            users={users}
            handleStatusClick={handleStatusClick} 
          />
          <CustomPagination totalPages={meta?.lastPage ?? 0} />
        </>
      )}
    </div>
  );
}

export default UserPage;