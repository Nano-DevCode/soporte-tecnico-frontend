import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, Flag, Save, X, BrushCleaning } from "lucide-react"; // Flag es un buen ícono para "Finalizar"

import {
    Form,
    FormControl,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FinishTicketSchema, type FinishTicketFormInput, type FinishTicketFormOutput } from "@/tickets/schemas/finish-ticket.schema";
import type { MaintenanceType } from "@/common/maintenance-type/interfaces/maintenance-type.interface";
import type { ServiceType } from "@/common/service-types/interfaces/service-type.interface";
import type { ResponseDetails } from "@/responses/interfaces/get-response-by-ticket";


interface Props {
    isPending: boolean;
    maintenanceTypes: MaintenanceType[];
    serviceTypes: ServiceType[];
    response?: ResponseDetails;
    onSubmit: (data: FinishTicketFormOutput) => void;
    onCancel: () => void;
}

export const FinishTicketForm = ({ response, onSubmit, isPending, onCancel, maintenanceTypes, serviceTypes }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => FinishTicketSchema(t), [t]);

    const form = useForm<FinishTicketFormInput, unknown, FinishTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            diagnosis: response?.diagnosis || "",
            work_done: response?.work_done || "",
            maintenance_type_id: response?.maintenance_type.id || "",
            service_type_id: response?.service_type.id || "",
        },
    });

    const isBusy = isPending || form.formState.isSubmitting;

    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.finish.header.title')}
                    description={t('tickets.form.finish.header.description')}
                    icon={Flag}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-finish-ticket">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="diagnosis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.finish.fields.diagnosis.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                autoFocus
                                                placeholder={t('tickets.form.finish.fields.diagnosis.placeholder')}
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
                                name="work_done"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.finish.fields.work_done.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.finish.fields.work_done.placeholder')}
                                                className="resize-none min-h-24"
                                                disabled={isBusy}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col md:flex-row flex-wrap gap-6 ">
                                <FormField
                                    control={form.control}
                                    name="maintenance_type_id"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>{t('tickets.form.finish.fields.maintenance_type.label')}</FormLabel>
                                            <Select
                                                disabled={isBusy}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                name={field.name}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={t('tickets.form.finish.fields.maintenance_type.placeholder')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {maintenanceTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="service_type_id"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>{t('tickets.form.finish.fields.service_type.label')}</FormLabel>
                                            <Select
                                                disabled={isBusy}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                name={field.name}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={t('tickets.form.finish.fields.service_type.placeholder')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {serviceTypes.map((type) => (
                                                        <SelectItem key={type.id} value={type.id}>
                                                            {type.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                    form="form-finish-ticket"
                    disabled={isBusy || !form.formState.isDirty}
                    className="w-full sm:w-auto"
                >
                    {isBusy ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-1.5 h-4 w-4" />
                    )}
                    {response
                        ? t('common.buttons.save_changes')
                        : t('tickets.form.finish.buttons.submit')
                    }
                </Button>
            </CardFooter>
        </Card>
    );
};