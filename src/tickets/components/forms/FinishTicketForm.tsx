import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, Flag, Save, X } from "lucide-react"; // Flag es un buen ícono para "Finalizar"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { useNavigate } from "react-router";
import { sileo } from "sileo";
import { useGetMaintenanceTypes } from "@/common/maintenance-type/hooks/useGetMaintenanceTypes";
import { useGetServiceTypes } from "@/common/service-types/hooks/useGetServiceTypes";
import { FinishTicketSchema, type FinishTicketFormInput, type FinishTicketFormOutput } from "@/tickets/shcemas/finish-ticket.schema";


interface Props {
    isPending: boolean;
    onSubmit: (data: FinishTicketFormOutput) => void;
    onCancel: () => void;
}

export const FinishTicketForm = ({ onSubmit, isPending, onCancel }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const schema = useMemo(() => FinishTicketSchema(t), [t]);

    const { data: maintenanceTypes, isLoading: isMaintenanceLoading, isError: isMaintenanceError } = useGetMaintenanceTypes();
    const { data: serviceTypes, isLoading: isServiceLoading, isError: isServiceError } = useGetServiceTypes();

    const isLoading = isMaintenanceLoading || isServiceLoading;
    const isError = isMaintenanceError || isServiceError;

    const form = useForm<FinishTicketFormInput, unknown, FinishTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            diagnosis: "",
            work_done: "",
            maintenance_type_id: "",
            service_type_id: "",
        },
    });

    useEffect(() => {
        if (!isLoading && isError) {
            sileo.error({
                title: t('common.errors.not_found_title', 'Error de Catálogos'),
                description: t('common.errors.not_found_desc', 'No se pudieron cargar los tipos de mantenimiento o servicio.'),
                duration: 6000,
            });
            navigate('/tickets', { replace: true });
        }
    }, [isError, isLoading, navigate, t]);

    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!maintenanceTypes || !serviceTypes) {
        return null;
    }

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
                                                disabled={isPending}
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
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="maintenance_type_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('tickets.form.finish.fields.maintenance_type.label')}</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
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
                                        <FormItem>
                                            <FormLabel>{t('tickets.form.finish.fields.service_type.label')}</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
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
            <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Button
                    variant="outline"
                    type="button"
                    disabled={isPending}
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                >
                    <X className="mr-1.5 w-4 h-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-finish-ticket"
                    disabled={isPending || !form.formState.isDirty}
                    className="w-full sm:w-auto"
                >
                    {isPending ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-1.5 h-4 w-4" />
                    )}
                    {t('tickets.form.finish.buttons.submit')}
                </Button>
            </CardFooter>
        </Card>
    );
};