import type { TFunction } from "i18next";
import type { KpiTone } from "../interfaces/kpis";

export const getEffectivenessTone = (value: number, t: TFunction): KpiTone => {
  if (value >= 80) return {
    label: t("users.pages.techniciansResolutionKpiPage.tones.excellent"), 
    border: "border-l-emerald-500", 
    avatar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badge: "bg-emerald-100/50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300", 
    text: "text-emerald-600 dark:text-emerald-400", 
    progress: "[&>div]:bg-emerald-500", 
    bar: "bg-emerald-500 dark:bg-emerald-400",
    surface: "border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
  };
  if (value >= 60) return {
    label: t("users.pages.techniciansResolutionKpiPage.tones.regular"), 
    border: "border-l-amber-500", 
    avatar: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    badge: "bg-amber-100/50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300", 
    text: "text-amber-600 dark:text-amber-400", 
    progress: "[&>div]:bg-amber-500", 
    bar: "bg-amber-500 dark:bg-amber-400",
    surface: "border-amber-200/60 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20"
  };
  return {
    label: t("users.pages.techniciansResolutionKpiPage.tones.attention"), 
    border: "border-l-rose-500", 
    avatar: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    badge: "bg-rose-100/50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300", 
    text: "text-rose-600 dark:text-rose-400", 
    progress: "[&>div]:bg-rose-500", 
    bar: "bg-rose-500 dark:bg-rose-400",
    surface: "border-rose-200/60 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20"
  };
};

export const getPendingTone = (value: number, t: TFunction): KpiTone => value === 0
  ? getEffectivenessTone(100, t)
  : value <= 2 ? getEffectivenessTone(60, t) : getEffectivenessTone(0, t);

export const getResolvedTone = (assigned: number, resolved: number, t: TFunction): KpiTone =>
  getEffectivenessTone(assigned === 0 ? 100 : (resolved / assigned) * 100, t);

export const getTimeTone = (hours: number, t: TFunction): KpiTone => {
  if (hours <= 24 && hours >= 0) return getEffectivenessTone(100, t); 
  if (hours <= 72) return getEffectivenessTone(60, t);
  return getEffectivenessTone(0, t);
};