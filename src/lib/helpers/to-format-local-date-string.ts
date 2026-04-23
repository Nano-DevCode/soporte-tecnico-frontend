import { format, isValid } from "date-fns";
import { es, enUS } from "date-fns/locale";

export const toFormatLocalDateString = (
    date: Date | string,
    language: string = 'es',
    formatStr: string = 'P'
) => {
    if (!date) return '';

    const parsedDate = new Date(date);
    if (!isValid(parsedDate)) return '';

    const currentLocale = language.startsWith('en') ? enUS : es;

    return format(parsedDate, formatStr, { locale: currentLocale });
};