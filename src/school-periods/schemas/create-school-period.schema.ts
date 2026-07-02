import * as z from "zod";
import type { TFunction } from "i18next";
import { PeriodType } from "../interfaces/school-period.interface";

export const schoolPeriodSchema = (t: TFunction) => z.object({
  period_type: z.enum(PeriodType, {
    message: t("school_period_form_error_period_type_required"),
  }),
  date_start: z.date({
    message: t("school_period_form_error_date_start_required"),
  }),
  date_end: z.date({
    message: t("school_period_form_error_date_end_required"),
  }),
}).refine((data) => data.date_end > data.date_start, {
  message: t("school_period_form_error_date_invalid_range"),
  path: ["date_end"],
});

export type SchoolPeriodFormInput = z.input<ReturnType<typeof schoolPeriodSchema>>;
export type SchoolPeriodFormOutput = z.output<ReturnType<typeof schoolPeriodSchema>>;