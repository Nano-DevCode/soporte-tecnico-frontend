import type { TFunction } from "i18next";
import { PeriodType } from "../interfaces/school-period.interface";

export const formatPeriodType = (type: PeriodType | string, t: TFunction) => {
  switch (type) {
    case PeriodType.ENERO_JUNIO:
      return t("period_type_enero-junio");

    case PeriodType.VERANO:
      return t("period_type_verano");

    case PeriodType.AGOSTO_DICIEMBRE:
      return t("period_type_agosto-diciembre");

    default:
      return type || '';
  }
};