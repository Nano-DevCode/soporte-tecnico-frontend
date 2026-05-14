import {
  Monitor, Printer, Network, Box,
  Cpu, User,
  Mail,
  Briefcase,
  IdCard,
  MapPinned,
  Info,
  MonitorCloud,
  MemoryStick,
  ServerIcon,
  ServerCog,
  PrinterCheck,
  FileArchive,
  FileImage,
  EthernetPortIcon,
  Router,
  PowerCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEquipment } from "../hooks/useEquipment";
import { useNavigate } from "react-router";
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
// import type { Equipment, EquipmentCategory } from "../interfaces/equipment.interface";
import { CustomBackToList } from "@/components/custom/CustomBackToList";

// interface Props {
//   equipments: Equipment[];
//   category: EquipmentCategory | 'all'; // Soporta vista general
//   onDelete: (id: string) => void;
// }

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

  const getTypeConfig = () => {
    if (equipment?.computer)
      return { type: 'computer', icon: Monitor, color: "bg-blue-100 text-blue-700", label: "Computadora" };
    if (equipment?.printer)
      return { type: 'printer', icon: Printer, color: "bg-purple-100 text-purple-700", label: "Impresora" };
    if (equipment?.network)
      return { type: 'network', icon: Network, color: "bg-amber-100 text-amber-700", label: "Red" };
    return { type: 'special', icon: Box, color: "bg-slate-100 text-slate-700", label: equipment?.type || "Equipo" };
  };
  const typestatus = () => {
    if (equipment?.status === true)
      return { color: "bg-emerald-100 text-emerald-700", label: "Activo" };
    if (equipment?.status === false)
      return { color: "bg-red-100 text-red-700", label: "Inactivo" };

  };

  const estado = typestatus()
  const config = getTypeConfig();
  const TypeIcon = config.icon;


  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">

      <CustomBackToList onBack={() => navigate('/equipments')} backLabel={"regreso"} actionUrl="equipments" />

      <Card>

        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">

          <div className="flex items-center gap-4">
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-sm", config.color)}>
              <TypeIcon className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold leading-none tracking-tight">
                # {equipment?.num_inventario ?? 'S/N'}
              </h1>

              <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                {/* AJUSTE AQUÍ: Se agregó el ? después de id_model */}
                {equipment?.id_model?.id_brand?.name ?? 'Sin marca'} - {equipment?.id_model?.name ?? 'Sin modelo'}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">

            <div className="space-y-2">
              <div>
              <Badge className={cn("w-fit mx-auto sm:mx-0 font-bold uppercase text-[12.5px] ")}>
                {equipment.id_departament?.name}
              </Badge>
              </div>
              <Badge className={cn("w-fit mx-auto sm:mx-0 font-bold uppercase text-[12.5  px]", config?.color)}>
                {config?.label}
              </Badge>

              <Badge className={cn("w-fit mx-auto sm:mx-0 font-bold uppercase text-[12.5  px]", estado?.color)}>
                <PowerCircle className="h-3.5 w-3.5" /> {estado?.label}
              </Badge>



            </div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-1 pt-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground " />
                Datos del responsable del equipo
              </h4>
              <div className="space-y-1">
                <dt className="font-medium text-muted-foreground">Nombre del responsable</dt>
                <dd className="font-semibold flex items-center gap-1.5">
                  <User className="h-4 w-4 text-muted-foreground " />
                  {equipment.id_responsable?.name} {equipment?.id_responsable?.first_name} {equipment?.id_responsable?.last_name}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="font-medium text-muted-foreground">Número de empleado </dt>
                <dd className="font-semibold flex items-center gap-1.5">
                  <IdCard className="h-4 w-4 text-muted-foreground " />
                  {equipment.id_responsable?.num_employe}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="font-medium text-muted-foreground">Correo </dt>
                <dd className="font-semibold flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-muted-foreground " />
                  {equipment?.id_responsable?.mail}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="font-medium text-muted-foreground">Área de traabajo </dt>
                <dd className="font-semibold flex items-center gap-1.5">
                  <MapPinned className="h-4 w-4 text-muted-foreground " />
                  {equipment?.id_responsable?.area}
                </dd>
              </div>
            </div>
          </div>

          <div className="  gap-2 ">
            {/* CASO: COMPUTADORA */}
            <h4 className="text-sm font-semibold border-l-2 border-primary pl-2 flex items-center gap-3">
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm ", config.color)}>
                <TypeIcon className="h-5 w-5" />
              </div>
              Datos específicos del equipo
            </h4>
            {/* Espacio  */}
            <br></br>

            {getTypeConfig().type === 'special' && (
              <div className="col-span-2 space-y-1">
                <dt className="font-medium text-muted-foreground">  Descripción del equipo</dt>
                <dd className="font-semibold flex items-top gap-1.5 text-justify flex-row">
                  <Info className="h-9 w-9 text-muted-foreground " />
                  {equipment?.description || "Sin descripción técnica disponible."}
                </dd>
              </div>
            )}

            {equipment?.computer && (
              <>
                <div className="grid grid-cols-2 gap-2 space-y-3">
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">Tipo de Equipo de Cómputo </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <MonitorCloud className="h-4 w-4 text-muted-foreground " />
                      {equipment?.computer?.id_type_equipment_computer?.name}
                    </dd>
                  </div>
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">Sistema Operativo </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <MonitorCloud className="h-4 w-4 text-muted-foreground " />
                      {equipment?.computer?.id_type_operating_system?.name}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-muted-foreground">Procesador </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 text-muted-foreground " />
                      {equipment.computer.id_processor?.brand} {equipment.computer.id_processor?.model} {equipment?.computer.id_processor?.description}
                    </dd>
                  </div>

                  <div className="space-y-1">
                    <dt className="font-medium text-muted-foreground">Memoria RAM </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <MemoryStick className="h-4 w-4 text-muted-foreground " />
                      {equipment?.computer?.ram}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-muted-foreground">Tipo de almacenamiento </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <ServerIcon className="h-4 w-4 text-muted-foreground " />
                      {equipment?.computer.id_type_storage?.name}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-muted-foreground">Almacenamiento total </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <ServerCog className="h-4 w-4 text-muted-foreground " />
                      {equipment?.computer?.capacity_storage}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-muted-foreground">Almacenamiento disponible </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <ServerCog className="h-4 w-4 text-muted-foreground " />
                      {equipment?.computer?.available_storage}
                    </dd>
                  </div>
                </div>
              </>
              // </div>
            )}

            {/* CASO: IMPRESORA */}
            {equipment?.printer && (
              <>
                <div className="grid grid-cols-2 gap-2 space-y-3 ">
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">Funcionalidad </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <PrinterCheck className="h-4 w-4 text-muted-foreground " />
                      {equipment?.printer.id_type_function?.name}
                    </dd>
                  </div>
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">Tipo de impresión </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <FileArchive className="h-4 w-4 text-muted-foreground " />
                      {equipment?.printer.id_type_printing?.name}
                    </dd>
                  </div>
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">Modelo de toner </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <Printer className="h-4 w-4 text-muted-foreground " />
                      <div className="w-[10ch] break-all">
                        {equipment?.printer?.model_toner}
                      </div>
                    </dd>
                  </div>
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">¿Imprime a color? </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <FileImage className="h-4 w-4 text-muted-foreground " />
                      {/* {equipment?.printer?.color} */}
                      <span className={equipment?.printer?.color ? "text-green-600 font-bold" : "text-gray-800"}>
                        {equipment?.printer?.color ? "Sí, Impresiones a Color y B/N" : "No, impresiones a Blanco y Negro"}
                      </span>
                    </dd>
                  </div>
                </div>
              </>
            )}

            {/* CASO: RED */}
            {equipment?.network && (
              <>
                <div className="grid grid-cols-2 gap-2 space-y-3">
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">Tipo de equipo </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <Router className="h-4 w-4 text-muted-foreground " />
                      {equipment?.network?.id_type_equipment_network?.name}
                    </dd>
                  </div>
                  <div className="space-y-1 ">
                    <dt className="font-medium text-muted-foreground">Número de puertos </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <EthernetPortIcon className="h-4 w-4 text-muted-foreground " />
                      {equipment?.network?.number_ports}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-medium text-muted-foreground">¿El equipo es PoE (Power over Ethernet)? </dt>
                    <dd className="font-semibold flex items-center gap-1.5">
                      <PowerCircle className="h-4 w-4 text-muted-foreground " />
                      <EthernetPortIcon className="h-4 w-4 text-muted-foreground " />
                      {equipment?.network?.PoE ? "Sí" : "No"}
                    </dd>
                  </div>
                </div>
              </>
            )}
          </div>

        </CardContent >
      </Card >
    </div >
  );
};