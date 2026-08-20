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
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { t } from "i18next";
import { CanAction } from "@/Consumables/permissions/Can";

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
      return { type: 'computer', icon: Monitor, color: "bg-blue-100 text-blue-700" };
    if (equipment?.printer)
      return { type: 'printer', icon: Printer, color: "bg-purple-100 text-purple-700" };
    if (equipment?.network)
      return { type: 'network', icon: Network, color: "bg-amber-100 text-amber-700" };
    return { type: 'special', icon: Box, color: "bg-slate-100 text-slate-700" };
  };

  const typestatus = () => {
    if (equipment?.status === true)
      return { color: "bg-green-600/100 text-white", label: t("eq_details_status_active") };
    if (equipment?.status === false)
      return { color: "bg-red-600/100 text-white", label: t("eq_details_status_inactive") };
  };

  const estado = typestatus();
  const config = getTypeConfig();
  const TypeIcon = config.icon;

  return (
    <CanAction permission="VIEW_DETAILS_EQUIPMENT">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <CustomBackToList
          onBack={() => navigate('/equipments')}
          backLabel={t("eq_details_back_label")}
          actionUrl="equipments"
        />

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
                  {equipment?.id_model?.id_brand?.name ?? t("eq_details_no_brand")} - {equipment?.id_model?.name ?? t("eq_details_no_model")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-10">
              <div className="flex flex-col items-end gap-2">
                <div className="bg-blue-900/90 border-white py-1.5 px-3 rounded-4xl flex items-center gap-3 text-white ">
                  <div className="flex flex-col">
                    <span className=" uppercase font-bold text-center text-[12.5px]">{equipment.id_departament?.name}</span>
                  </div>
                </div>
                <Badge className={cn("w-fit mx-auto sm:mx-0 font-bold uppercase text-[12.5px] space-x-10", config?.color)}>
                  {equipment.id_type_equipment?.name}
                </Badge>
                <Badge className={cn("w-fit mx-auto sm:mx-0 font-bold uppercase text-[12.5px]", estado?.color)}>
                  <PowerCircle className="h-3.5 w-3.5" /> {estado?.label}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-1 pt-2 space-y-5">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold mb-4 border-l-2 border-primary pl-2 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground " />
                  {t("eq_details_section_responsible")}
                </h4>
                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("eq_details_resp_name")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground " />
                    {equipment.id_responsable?.name} {equipment?.id_responsable?.first_name} {equipment?.id_responsable?.last_name}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("eq_details_resp_employee_num")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <IdCard className="h-4 w-4 text-muted-foreground " />
                    {equipment.id_responsable?.num_employe}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("eq_details_resp_email")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-muted-foreground " />
                    {equipment?.id_responsable?.mail}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium text-muted-foreground">{t("eq_details_resp_area")}</dt>
                  <dd className="font-semibold flex items-center gap-1.5">
                    <MapPinned className="h-4 w-4 text-muted-foreground " />
                    {equipment?.id_responsable?.area}
                  </dd>
                </div>
              </div>
            </div>

            <div className="gap-2 space-y-2 ">
              <h4 className="text-sm font-semibold border-l-2 border-primary pl-2 flex items-center gap-3">
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm ", config.color)}>
                  <TypeIcon className="h-5 w-5" />
                </div>
                {t("eq_details_section_specifics")}
              </h4>
              <br />

              <div className="col-span-2 space-y-1">
                <dt className="font-medium text-muted-foreground">{("Número de Serie")}</dt>
                <dd className="font-semibold flex items-top gap-1.5 text-justify flex-row">
                  {equipment?.num_serial || t("eq_details_no_notes")}
                </dd>
              </div>

              <div className="col-span-2 space-y-1">
                <dt className="font-medium text-muted-foreground">{t("eq_details_description_label")}</dt>
                <dd className="font-semibold flex items-top gap-1.5 text-justify flex-row">
                  {equipment?.description || t("eq_details_no_notes")}
                </dd>
              </div>

              {/* CASO: COMPUTADORA */}
              {equipment?.computer && (
                <>
                  <div className="grid grid-cols-2 gap-2 space-y-3">
                    <div className="space-y-1 ">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_comp_type")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <MonitorCloud className="h-4 w-4 text-muted-foreground " />
                        {equipment?.computer?.id_type_equipment_computer?.name}
                      </dd>
                    </div>
                    <div className="space-y-1 ">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_comp_os")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <MonitorCloud className="h-4 w-4 text-muted-foreground " />
                        {equipment?.computer?.id_type_operating_system?.name}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_comp_processor")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <Cpu className="h-4 w-4 text-muted-foreground " />
                        {equipment.computer.id_processor?.brand} {equipment.computer.id_processor?.model} {equipment?.computer.id_processor?.description}
                      </dd>
                    </div>

                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_comp_ram")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <MemoryStick className="h-4 w-4 text-muted-foreground " />
                        {equipment?.computer?.ram}<span className="font-bold ">GB</span>
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_comp_storage_type")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <ServerIcon className="h-4 w-4 text-muted-foreground " />
                        {equipment?.computer.id_type_storage?.name}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_comp_storage_total")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <ServerCog className="h-4 w-4 text-muted-foreground " />
                        {equipment?.computer?.capacity_storage} <span className="font-bold ">GB</span>
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_comp_storage_available")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <ServerCog className="h-4 w-4 text-muted-foreground " />
                        {equipment?.computer?.available_storage} <span className="font-bold ">GB</span>
                      </dd>
                    </div>
                  </div>
                </>
              )}

              {/* CASO: IMPRESORA */}
              {equipment?.printer && (
                <>
                  <div className="grid grid-cols-2 gap-2 space-y-3 ">
                    <div className="space-y-1 ">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_print_function")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <PrinterCheck className="h-4 w-4 text-muted-foreground " />
                        {equipment?.printer.id_type_function?.name}
                      </dd>
                    </div>
                    <div className="space-y-1 ">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_print_type")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <FileArchive className="h-4 w-4 text-muted-foreground " />
                        {equipment?.printer.id_type_printing?.name}
                      </dd>
                    </div>
                    <div className="space-y-1 ">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_print_toner")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <Printer className="h-4 w-4 text-muted-foreground " />
                        <div className="w-[10ch] break-all">
                          {equipment?.printer?.model_toner}
                        </div>
                      </dd>
                    </div>
                    <div className="space-y-1 ">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_print_color_label")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <FileImage className="h-4 w-4 text-muted-foreground " />
                        <span className={equipment?.printer?.color ? "text-green-500 font-bold" : "text-red-500"}>
                          {equipment?.printer?.color ? t("eq_details_print_color_yes") : t("eq_details_print_color_no")}
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
                      <dt className="font-medium text-muted-foreground">{t("eq_details_net_type")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <Router className="h-4 w-4 text-muted-foreground " />
                        {equipment?.network?.id_type_equipment_network?.name}
                      </dd>
                    </div>
                    <div className="space-y-1 ">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_net_ports")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <EthernetPortIcon className="h-4 w-4 text-muted-foreground " />
                        {equipment?.network?.number_ports}
                      </dd>
                    </div>
                    <div className="space-y-1">
                      <dt className="font-medium text-muted-foreground">{t("eq_details_net_poe_label")}</dt>
                      <dd className="font-semibold flex items-center gap-1.5">
                        <PowerCircle className="h-4 w-4 text-muted-foreground " />
                        <EthernetPortIcon className="h-4 w-4 text-muted-foreground " />
                        {equipment?.network?.PoE ? t("eq_details_generic_yes") : t("eq_details_generic_no")}
                      </dd>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent >
        </Card >
      </div >
    </CanAction>
  );
};