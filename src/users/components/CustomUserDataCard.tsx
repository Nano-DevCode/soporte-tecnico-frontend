import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Lock, Mail, User, Hash, Send, Save } from "lucide-react";
import { useState } from "react";
import { useDepartments } from "../hooks/useDepartment";
import { useRoles } from "../hooks/userRoles";
import { Button } from "@/components/ui/button";

export const CustomUsersDataCard = () => {
  const { data: departments } = useDepartments();
  const { data: roles } = useRoles();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <CustomTitleCard
        title="Datos del Usuario"
        description="Informacion personal y credenciales de acceso"
        icon={User}
      />

      <Separator className="mb-5" />

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">

        {/* Correo */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="flex items-center gap-1.5 text-xs font-semibold">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Correo Electronico
          </Label>
          <Input type="email" placeholder="usuario@ejemplo.com" />
        </div>

        {/* Contraseña */}
        <div className="space-y-1.5 md:col-span-2">
          <Label className="flex items-center gap-1.5 text-xs font-semibold">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            Contraseña
          </Label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Minimo 8 caracteres"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Nombres */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Nombres</Label>
          <Input placeholder="Ej. Juan Carlos" />
        </div>

        {/* Primer Apellido */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Primer Apellido</Label>
          <Input placeholder="Ej. Rodriguez" />
        </div>

        {/* Segundo Apellido */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Segundo Apellido</Label>
          <Input placeholder="Ej. Martinez" />
        </div>

        {/* ID Telegram */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold">
            <Send className="h-3.5 w-3.5 text-muted-foreground" />
            ID Telegram
          </Label>
          <Input placeholder="Ej. 123456789" />
        </div>

        {/* Numero de Control */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            Numero de Control
          </Label>
          <Input placeholder="Ej. 20230045" />
        </div>

        {/* Rol */}
        <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Rol</Label>
        <Select>
            <SelectTrigger className="w-full h-10 bg-background">
                <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
                {
                    roles?.map(role =>(
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
        </div>

        {/* Departamento */}
        <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Departamento</Label>
        <Select>
            <SelectTrigger className="w-full h-10 bg-background">
                <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
                {
                    departments?.map(department =>(
                        <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
        </div>
      </div>
    </div>
    <Button type="submit" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
        <Save className="mr-1.5 h-4 w-4" />
        Crear Usuario
    </Button>
    </>
  );
};