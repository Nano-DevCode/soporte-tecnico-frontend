import { memo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getFullName, getInitials } from "../util/extraUtil";
import { Users, Shield } from "lucide-react";
import { CustomUserActionsMenu } from "./CustomUserActionsMenu";
import { Badge } from "@/components/ui/badge";
import type { User } from "../interfaces/users.response";
import { useTranslation } from 'react-i18next';

interface Props {
  users: User[];
  handleStatusClick: (user: User) => void;
}

export const CustomUserDesktopTable = memo(({ users, handleStatusClick }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden">
      <Table>
        {/* Cabecera con el fondo tintado que pediste, pero limpia de íconos extra */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 items-center justify-center text-center">
              {t("users.components.customUserDesktopTable.headControl")}
            </TableHead>
            <TableHead className="w-75 text-left">
              {t("users.components.customUserDesktopTable.headUser")}
            </TableHead>
            <TableHead className="w-62.5 text-left">
              {t("users.components.customUserDesktopTable.headDepartment")}
            </TableHead>
            <TableHead className="w-30 text-center">
              {t("users.components.customUserDesktopTable.headRole")}
            </TableHead>
            <TableHead className="w-25 text-center">
              {t("users.components.customUserDesktopTable.headStatus")}
            </TableHead>
            <TableHead className="w-20 text-center">
              {t("users.components.customUserDesktopTable.headActions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="group transition-colors hover:bg-muted/30">
              
              {/* NÚMERO DE CONTROL */}
              <TableCell className="font-mono text-xs font-semibold text-muted-foreground align-middle text-center py-4">
                #{user.staff.num_control}
              </TableCell>
              
              {/* USUARIO */}
              <TableCell className="align-middle py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0 border border-border shadow-sm">
                    <AvatarFallback className="bg-muted text-foreground text-xs font-bold uppercase">
                      {getInitials(user.staff.name, user.staff.paternalSurname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-bold text-foreground truncate max-w-60">
                      {getFullName(user.staff.name, user.staff.paternalSurname, user.staff.maternalSurname)}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-60">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* DEPARTAMENTO */}
              <TableCell className="align-middle py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground max-w-62.5 line-clamp-2">
                    {user.staff.department.name}
                  </span>
                </div>
              </TableCell>

              {/* ROL */}
              <TableCell className="align-middle text-center py-4">
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold border border-border">
                    <Shield className="h-3 w-3 opacity-50" />
                    {user.role.name}
                  </span>
                </div>
              </TableCell>
              
              {/* ESTADO */}
              <TableCell className="align-middle text-center py-4 uppercase">
                <Badge 
                  variant={user.status ? "default" : "destructive"}
                  className="font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
                >
                  {user.status ? t("users.components.customUserDesktopTable.active") : t("users.components.customUserDesktopTable.inactive")}
                </Badge>
              </TableCell>
              
              {/* ACCIONES */}
              <TableCell className="text-center align-middle py-4">
                <div className="flex justify-center">
                  <CustomUserActionsMenu 
                    user={user} 
                    handleStatusClick={handleStatusClick} 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY STATE */}
          {users.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="h-75 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Users className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      {t("users.components.customUserDesktopTable.notFound")}
                    </p>
                    <p className="text-sm">
                      {t("users.components.customUserDesktopTable.settingFilters")}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
          
        </TableBody>
      </Table>
    </div>
  );
});