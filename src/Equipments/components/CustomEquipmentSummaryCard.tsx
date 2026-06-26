import { Box, LucideBadgeInfo, Monitor, Network, PowerIcon, Printer, User, type LucideIcon } from "lucide-react";
import type { EquipmentSummary } from "../interfaces/euipment-item.interface";
import { useTranslation } from "react-i18next";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface Props {
  equipment: EquipmentSummary
}
export const CustomEquipmentSummaryCard = ({ equipment }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentType = equipment.type.toLowerCase() || 'default';

  const config: Record<string, { bg: string, text: string, icon: LucideIcon }> = {
    computadora: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor },
    computer: { bg: "bg-blue-100", text: "text-blue-800", icon: Monitor },
    impresora: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer },
    printer: { bg: "bg-purple-100", text: "text-purple-800", icon: Printer },
    red: { bg: "bg-amber-100", text: "text-amber-800", icon: Network },
    network: { bg: "bg-amber-100", text: "text-amber-800", icon: Network },
    default: { bg: "bg-slate-100", text: "text-slate-700", icon: Box },
  };

  const item = config[currentType] || config.default;
  const Icon = item.icon;

  return (
    <Item variant={"muted"} key={equipment.id} className="py-2 flex-1">

      <ItemMedia>
        <div className={`flex items-center justify-center h-9 w-9 rounded-full ${item.bg} ${item.text}`}>
          <Icon className="h-5 w-5" />
        </div>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="flex-wrap gap-y-0">
          <span ># {equipment.folio}</span>
          <span className="text-muted-foreground"> - {equipment.model}</span>
        </ItemTitle>

        <ItemDescription className="flex flex-wrap gap-x-7 gap-y-1 text-xs pt-2">
          <span className="flex items-center gap-1">
            <LucideBadgeInfo className="h-3.5 w-3.5 shrink-0" />
            <strong className="text-foreground/80">{equipment.type || t("eq_card_unassigned")}</strong>
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 shrink-0" />
            <strong className="text-foreground/80">{
              equipment.responsableName || t("eq_card_unassigned")}
            </strong>
          </span>

          <span className="flex items-center gap-1">
            <PowerIcon className={`h-3.5 w-3.5 shrink-0 ${equipment.status ? 'text-emerald-500' : 'text-red-500'}`} />
            <strong className={equipment.status ? 'text-emerald-600' : 'text-red-600'}>{equipment.status ? t("eq_card_status_active") : t("eq_card_status_inactive")}</strong>
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant={"secondary"} size={"xs"} onClick={() => {
          navigate(`/equipments/details/${equipment.id}`)
        }}>
          {t('common.buttons.view')}
        </Button>
      </ItemActions>
    </Item >
  )
}
