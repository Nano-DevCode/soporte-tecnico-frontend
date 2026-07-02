import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PeriodType, type SchoolPeriod } from "@/school-periods/interfaces/school-period.interface";
import { schoolPeriodSchema, type SchoolPeriodFormInput, type SchoolPeriodFormOutput } from "@/school-periods/schemas/create-school-period.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { CalendarIcon, CalendarRange, Loader2, Save, X } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
    schoolPeriod?: SchoolPeriod,
    isPending: boolean,
    titleButton: string,

    onSubmit: (scholPeriodLike: SchoolPeriodFormOutput) => Promise<void>,
    onCancel: () => void
}
export const SchoolPeriodForm = ({ schoolPeriod, onSubmit, isPending, titleButton, onCancel }: Props) => {
    const { t, i18n } = useTranslation();
    const localizedSchema = useMemo(() => schoolPeriodSchema(t), [t]);

    const form = useForm<SchoolPeriodFormInput, unknown, SchoolPeriodFormOutput>({
        resolver: zodResolver(localizedSchema),
        defaultValues: schoolPeriod || {
            period_type: undefined,
            date_start: undefined,
            date_end: undefined,
        },
    });

    const watchStartDate = useWatch({
        control: form.control,
        name: "date_start",
    });

    const currentLocale = i18n.language === 'en' ? enUS : es;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <CustomTitleCard
                        title={t('school_period_form_title_section_data')}
                        description={t('school_period_form_description_section_data')}
                        icon={CalendarRange}
                    />

                    <Separator className="mb-5" />

                    <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">

                        {/* CAMPO: TIPO DE PERIODO */}
                        <FormField
                            control={form.control}
                            name="period_type"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1.5 md:col-span-2">
                                    <FormLabel className="font-semibold">
                                        {t('school_period_form_section_data_period_type')}
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        name={field.name}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('school_period_form_section_data_period_type_placeholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={PeriodType.ENERO_JUNIO}>{t('period_type_enero-junio')}</SelectItem>
                                            <SelectItem value={PeriodType.VERANO}>{t('period_type_verano')}</SelectItem>
                                            <SelectItem value={PeriodType.AGOSTO_DICIEMBRE}>{t('period_type_agosto-diciembre')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CAMPO: FECHA DE INICIO */}
                        <FormField
                            control={form.control}
                            name="date_start"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel className="font-semibold">
                                        {t('school_period_form_section_data_date_start')}
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: currentLocale })
                                                    ) : (
                                                        <span>{t('school_period_form_section_data_date_placeholder')}</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange} // RHF toma el control aquí
                                                disabled={(date) => date < new Date("1900-01-01")} // Evita fechas antiquísimas
                                                month={field.value}
                                                defaultMonth={field.value}
                                                locale={currentLocale}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CAMPO: FECHA FINAL */}
                        <FormField
                            control={form.control}
                            name="date_end"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel className="font-semibold">
                                        {t('school_period_form_section_data_date_end')}
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: currentLocale })
                                                    ) : (
                                                        <span>{t('school_period_form_section_data_date_placeholder')}</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => (watchStartDate ? date <= watchStartDate : false)}
                                                defaultMonth={field.value}
                                                month={field.value}
                                                locale={currentLocale}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </div>

                {/* BOTONES */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isPending}
                        onClick={onCancel}
                        className="w-full sm:w-auto flex items-center gap-2 rounded-xl"
                    >
                        <X className="mr-1.5 w-4 h-4" />
                        {t('school_period_form_button_cancel')}
                    </Button>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 rounded-xl transition-all active:scale-95"
                    >
                        {isPending ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-1.5 h-4 w-4" />
                        )}
                        {titleButton}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

