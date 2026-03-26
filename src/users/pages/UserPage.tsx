import { useState } from "react";
import { Users, Heart, Plus} from "lucide-react";
import { CustomUserMobilCard } from "../components/CustomUserMobilCard";
import { CustomUserDesktopTable } from "../components/CustomUserDesktopTable";
import { CustomDialogConfirm } from "@/components/custom/CustomDialogCorfirm";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useUsers } from "../hooks/useUsers";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomUserFilters } from "../components/CustomUserFilters";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import type { User } from "../interfaces/users.response";

export function UserPage() {
  const { data, isLoading: skelettonLoading } = useUsers();

  const [bajaDialogOpen, setBajaDialogOpen] = useState(false);
  const [eliminarDialogOpen, setEliminarDialogOpen] = useState(false);
  const [userSeleccionado, setUserSeleccionado] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBajaClick = (user: User) => {
    setUserSeleccionado(user);
    setBajaDialogOpen(true);
  };

  const handleEliminarClick = (user: User) => {
    setUserSeleccionado(user);
    setEliminarDialogOpen(true);
  };

  const handleConfirmarBaja = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setBajaDialogOpen(false);
    } catch (error) {
      console.error("Error al dar de baja:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmarEliminar = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEliminarDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Lado izquierdo */}
        <CustomTitleCard icon={Users} title="Gestión de Usuarios" description="Administra los usuarios del sistema"/>

        {/* Botón */}
        <Link to="/user/new">
          <Button className="w-full sm:w-auto bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Crear Usuario
          </Button>
        </Link>

      </div>

      <CustomDialogConfirm
        open={bajaDialogOpen}
        isLoading={isLoading}
        title="Estas seguro de dar de baja al usuario"
        description="Este cambio pasara al usaurio a un estado que no permitira realizar operaciones"
        icon={Heart}
        onConfirm={handleConfirmarBaja}
        onOpenChange={setBajaDialogOpen}
      />

      <CustomDialogConfirm
        open={eliminarDialogOpen}
        isLoading={isLoading}
        title="Se eliminara de forma permanete al usuario"
        description={`${userSeleccionado?.staff.name}`}
        icon={Heart}
        onConfirm={handleConfirmarEliminar}
        onOpenChange={setEliminarDialogOpen}
      />

      <CustomUserFilters/>

      {skelettonLoading ? (
        <CustomSkeletonTableCard/>
      ) : (
        <>

          <CustomUserDesktopTable
            users={data?.users ?? []}
            handleBajaClick={handleBajaClick}
            handleEliminarClick={handleEliminarClick}
          />
          <CustomUserMobilCard
            users={data?.users ?? []}
            handleBajaClick={handleBajaClick}
            handleEliminarClick={handleEliminarClick}
          />
          <CustomPagination totalPages={data?.meta.lastPage ?? 0} />
        </>
      )}
    </div>
  );
}