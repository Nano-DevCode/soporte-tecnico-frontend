import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, ClipboardSignature, Save, X, BrushCleaning } from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Textarea } from "@/components/ui/textarea";
import { CustomOptionalInput } from "@/components/custom/CustomOptionalInput";
import { InfiniteScrollComboboxEquipments } from "@/Equipments/components/InfiniteScrollComboboxEquipments";
import type { FaultValidity } from "@/common/fault-validities/interfaces/fault-validity.interface";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditTechnicalReportSchema, type EditTechnicalReportFormInput, type EditTechnicalReportFormOutput } from "@/technical-reports/schemas/edit-technical-report.schema";
import type { TechnicalReportDetails } from "@/technical-reports/interfaces/technical-report-details.interface";

interface Props {
    isPending: boolean;
    faultValidities: FaultValidity[];
    technicalReport: TechnicalReportDetails
    onSubmit: (data: EditTechnicalReportFormOutput) => void;
    onCancel: () => void;
}

export const EditTechnicalReportForm = ({ onSubmit, isPending, onCancel, faultValidities, technicalReport }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => EditTechnicalReportSchema(t), [t]);

    const form = useForm<EditTechnicalReportFormInput, unknown, EditTechnicalReportFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            diagnosis: technicalReport.diagnosis || "",
            work_performed: technicalReport.work_performed || "",
            materials_used: technicalReport.materials_used || "",
            equipment_ids: technicalReport.equipments,
            fault_validity_id: technicalReport.fault_validity.id,
        },
    });

    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    const isBusy = isPending || form.formState.isSubmitting;

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.intervene.header.title')}
                    description={t('tickets.form.intervene.header.description')}
                    icon={ClipboardSignature}
                />
            </CardHeader>
            <Separator />
            <CardContent >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-intervene-ticket">
                        <div className="space-y-6">

                            <FormField
                                control={form.control}
                                name="diagnosis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.diagnosis.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                autoFocus
                                                placeholder={t('tickets.form.intervene.fields.diagnosis.placeholder')}
                                                className="resize-none min-h-24"
                                                disabled={isBusy}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="work_performed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.work_performed.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.intervene.fields.work_performed.placeholder')}
                                                className="resize-none min-h-24"
                                                disabled={isBusy}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="materials_used"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.required_materials.label')}<CustomOptionalInput /></FormLabel>
                                        <FormDescription>{t('tickets.form.intervene.fields.required_materials.description')}</FormDescription>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.intervene.fields.required_materials.placeholder')}
                                                className="resize-none min-h-24"
                                                disabled={isBusy}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="equipment_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.equipment_ids.label')}<CustomOptionalInput /></FormLabel>
                                        <FormDescription>{t('tickets.form.intervene.fields.equipment_ids.description')}</FormDescription>
                                        <FormControl>
                                            <InfiniteScrollComboboxEquipments
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={isBusy}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fault_validity_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.fault_validity.label')}</FormLabel>
                                        <FormDescription>{t('tickets.form.intervene.fields.fault_validity.description')}</FormDescription>
                                        <Select
                                            disabled={isBusy}
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('tickets.form.intervene.fields.fault_validity.placeholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {faultValidities.map((fault) => (
                                                        <SelectItem key={fault.id} value={fault.id.toString()}>{fault.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                    </form>
                </Form>

            </CardContent>
            <Separator />
            <CardFooter className="flex flex-wrap-reverse sm:flex-row justify-end gap-3">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isBusy || !form.formState.isDirty}
                    onClick={() => form.reset()}
                    className="w-full sm:w-auto"
                >
                    <BrushCleaning className="mr-2 h-4 w-4" />
                    {t('common.buttons.clean')}
                </Button>

                <Button
                    variant="outline"
                    type="button"
                    disabled={isBusy}
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                >
                    <X className="mr-1.5 w-4 h-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-intervene-ticket"
                    disabled={isBusy || !form.formState.isDirty}
                    className="w-full sm:w-auto"
                >
                    {isBusy ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-1.5 h-4 w-4" />
                    )}
                    {t('tickets.form.intervene.buttons.submit')}
                </Button>
            </CardFooter>
        </Card >
    );
};