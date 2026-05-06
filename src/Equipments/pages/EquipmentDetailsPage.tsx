import {
  Monitor, Printer, Network, Box, Edit, Trash2,
  ArrowLeft, Cpu, Hash, User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEquipment } from "../hooks/useEquipment";
import { useNavigate } from "react-router";
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";

export const EquipmentDetailsPage = () => {
  const navigate = useNavigate();
  const { equipment, isLoading } = useEquipment();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 p-6">
        <CustomSkeletonInformation />
      </div>
    );
  }

  // Configuración visual por tipo de equipo
  // Usamos la presencia de los objetos técnicos para determinar el tipo
  const getTypeConfig = () => {
    if (equipment?.computer)
      return { icon: Monitor, color: "bg-blue-100 text-blue-700", label: "Computadora" };
    if (equipment?.printer)
      return { icon: Printer, color: "bg-purple-100 text-purple-700", label: "Impresora" };
    if (equipment?.network)
      return { icon: Network, color: "bg-amber-100 text-amber-700", label: "Red" };
    return { icon: Box, color: "bg-slate-100 text-slate-700", label: "Equipo" };
  };

  const config = getTypeConfig();
  const TypeIcon = config.icon;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">

      {/* HEADER: Navegación y Acciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/inventory/equipments')}
          className="group flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Regresar al Inventario
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => navigate(`edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Editar
          </Button>
          <Button variant="destructive" size="sm" className="h-9">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </Button>
        </div>
      </div>

      {/* TARJETA PRINCIPAL: Identidad del Equipo */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">

          <div className="flex items-center gap-4">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm", config.color)}>
              <TypeIcon className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              {/* Agregué los ?. por seguridad */}
              <h1 className="text-2xl font-bold leading-none tracking-tigh text-[15px]">
                Numero de inventario: {equipment?.num_inventario}
              </h1>
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground font-black font-mono">
                <Box className="h-3.5 w-3.5" />
                {equipment.id_model?.name}
              </p>
            </div>
            <div>
              <Badge className={cn("w-fit mx-auto sm:mx-0 font-bold uppercase", config.color)}>
                {config.label}
              </Badge>
              </div>
          </div>

          {/* <div className="flex flex-col items-end gap-2">

            <Badge 
              variant={user.status ? "default" : "destructive"} 
              className={user.status ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}
            >
              {user.status ? "Cuenta Activa" : "Cuenta Suspendida"}
            </Badge>

            <Badge 
              variant="secondary" 
              className="gap-1 bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <ShieldCheck className="h-3 w-3" />
              {user.role?.name || "Sin Rol"}
            </Badge>
          </div> */}
        </CardHeader>

      </Card>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-sm", config.color)}>
            <TypeIcon className="h-6 w-6" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Badge className={cn("w-fit mx-auto sm:mx-0 font-bold uppercase", config.color)}>
                {config.label}
              </Badge>
              <div className="min-w-[180px] ">
                {equipment?.id_model?.name || 'Modelo no especificado'}
              </div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-muted-foreground">
              <span className="flex items-center gap-1.5 text-sm font-mono">
                <Hash className="h-4 w-4" /> Número de inventario : {equipment?.num_inventario}
              </span>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t">
          <InfoItem icon={User} label="Responsable" value="Departamento TI" />
          <InfoItem icon={Monitor} label="Estado" value="Operativo" isStatus status={true} />
        </div>
      </div>

      {/* SECCIÓN DINÁMICA: Especificaciones Técnicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" /> Especificaciones Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* CASO: COMPUTADORA */}
              {equipment?.computer && (
                <>
                  <DetailBlock
                    label="Procesador"
                    value={`${equipment.computer.id_processor.brand} ${equipment.computer.id_processor.model} (${equipment.computer.id_processor.description})`}
                  />
                  <DetailBlock label="Memoria RAM" value={equipment.computer.ram} />
                  <DetailBlock label="Sistema Operativo" value={equipment.computer.id_type_operating_system.name} />
                  <DetailBlock label="Almacenamiento" value={equipment.computer.capacity_storage} />
                </>
              )}

              {/* CASO: IMPRESORA */}
              {equipment?.printer && (
                <>
                  <DetailBlock label="Función" value={equipment.printer.id_type_function.name} />
                  <DetailBlock label="Tipo de Impresión" value={equipment.printer.id_type_printing.name} />
                  <DetailBlock label="Modelo de Tóner" value={equipment.printer.model_toner} />
                  <DetailBlock label="Color" value={equipment.printer.color} />
                </>
              )}

              {/* CASO: RED */}
              {equipment?.network && (
                <>
                  <DetailBlock label="Tipo de Dispositivo" value={equipment.network.id_type_equipment_network.name} />
                  <DetailBlock label="Número de Puertos" value={equipment.network.number_ports} />
                  <DetailBlock label="Soporte PoE" value={equipment.network.PoE ? "Sí" : "No"} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTES --- */

const InfoItem = ({ icon: Icon, label, value, isStatus, status }: any) => (
  <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors">
    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
    {isStatus ? (
      <span className={cn("text-sm font-bold", status ? "text-emerald-600" : "text-amber-600")}>
        {value}
      </span>
    ) : (
      <span className="text-sm font-semibold text-foreground">{value || '---'}</span>
    )}
  </div>
);

const DetailBlock = ({ label, value }: { label: string, value: any }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm font-bold text-foreground bg-muted/40 p-2 rounded-md border border-border/50">
      {value || 'No especificado'}
    </p>
  </div>
);