import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { enUS, es } from "date-fns/locale";
import { toFormatLocalDateString } from "@/lib/helpers/to-format-local-date-string";

interface Props {
  label: string;
  value: string;
  minDate?: Date;
  maxDate?: Date;
  onChange: (date: string | null) => void;
}

export const CustomFilterDate = ({ label, value, onChange, maxDate, minDate }: Props) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const currentLocale = i18n.language === 'en' ? enUS : es;

  const parsedDate = value ? new Date(`${value}T00:00:00`) : undefined;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
  const dateValue = isValidDate ? parsedDate : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex-1 justify-start px-3 font-normal">
          <span className="text-muted-foreground">{label}:</span>
          {dateValue ? (
            toFormatLocalDateString(dateValue, i18n.language, 'PP')
          ) : (
            t('tickets.filters.date.wathever')
          )}
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
            let isOut = date > new Date() || date < new Date("1900-01-01");
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