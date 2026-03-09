import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getFullName, getInitials } from "../util/extraUtil";
import { Building2, Mail, Users } from "lucide-react";
import { CustomActionsMenuUser } from "./CustomActionsMenuUser";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User } from "../interfaces/users.response";

interface Props {
  users: User[];
  handleBajaClick: (user: User) => void;
  handleEliminarClick: (user: User) => void;
}

export const CustomMobilCardUsers = ({users, handleBajaClick, handleEliminarClick}: Props) => {
  return (
    <div className="md:hidden space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
        >
          <Avatar className="mt-0.5 h-10 w-10 shrink-0 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
              {getInitials(user.staff.name, user.staff.paternalSurname)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            {/* Top: ID + Rol */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {user.staff.num_control}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                {user.role.name}
              </span>
            </div>

            {/* Nombre Completo - Ahora baja si es muy largo */}
            <p className="text-sm font-bold text-foreground leading-snug whitespace-normal break-words">
              {getFullName(user.staff.name, user.staff.paternalSurname, user.staff.maternalSurname)}
            </p>

            {/* Email - Usa break-all por si el dominio es muy largo */}
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="whitespace-normal break-all leading-relaxed">
                {user.email}
              </span>
            </div>

            {/* Departamento */}
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="whitespace-normal break-words leading-relaxed">
                {user.staff.department.name}
              </span>
            </div>

            {/* Status */}
            <div className="pt-1">
              <Badge
                variant="outline"
                className={cn(
                  "font-semibold text-[10px] px-2 py-0 rounded-full border-none", 
                  user.status === true 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-red-100 text-red-600"
                )}
              >
                {user.status === true ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>

          <div className="shrink-0">
            <CustomActionsMenuUser 
              user={user} 
              handleBajaClick={handleBajaClick} 
              handleEliminarClick={handleEliminarClick}
            />
          </div>
        </div>
      ))}

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No se encontraron usuarios
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  )
}