import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { enUS, es } from "date-fns/locale";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";
// 1. Asegúrate de importar useState y useEffect
import { useState, useEffect } from "react"; 

interface Props {
  label: string;
  value: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: string | null) => void;
}

// 2. Extraemos la fecha constante FUERA del componente
const MIN_DEFAULT_DATE = new Date("1900-01-01");

export const CustomFilterDate = ({ label, value, onChange, maxDate, minDate }: Props) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const currentLocale = i18n.language === 'en' ? enUS : es;

  const [today, setToday] = useState<Date | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setToday(new Date());
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const parsedDate = value ? new Date(`${value}T00:00:00`) : undefined;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
  const dateValue = isValidDate ? parsedDate : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex-1 justify-between px-3 font-normal">
          <span>
            <span className="text-muted-foreground ms-2">{label}:</span>
            {dateValue ? (
              toFormatLocalDateString(dateValue, i18n.language, 'PP')
            ) : (
              <span className="ms-2">
                {t('tickets.filters.date.wathever')}
              </span>
            )}
          </span>
          <ChevronDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : null);
          }}
          locale={currentLocale}
          defaultMonth={dateValue}
          disabled={(date) => {
            // 4. Si 'today' aún no se carga (estamos en el servidor), no bloqueamos nada para evitar errores
            if (!today) return false; 

            // 5. Usamos nuestras variables estables
            let isOut = date > today || date < MIN_DEFAULT_DATE;
            if (minDate) isOut = isOut || date < minDate;
            if (maxDate) isOut = isOut || date > maxDate;
            return isOut;
          }}
        />
        {dateValue && (
          <div className="p-1 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={() => onChange(null)}
            >
              <X /> {t('common.buttons.clean')}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};