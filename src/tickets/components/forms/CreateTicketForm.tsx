import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, Save, User, X } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { TicketSchema, type TicketFormInput, type TicketFormOutput } from "@/tickets/shcemas/ticket.schema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllIssueTypes } from "@/IssueTypes/hooks/useAllIssueTypes";
import { sileo } from "sileo";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { useNavigate } from "react-router";

interface Props {
    ticket?: TicketDetailsResponse,
    isPending: boolean,
    titleButton: string,

    onSubmit: (ticket: TicketFormOutput) => void,
    onCancel: () => void,

}

export const CreateTicketForm = ({ ticket, onSubmit, isPending, titleButton, onCancel }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: issueTypes, isLoading, isError } = useAllIssueTypes();
    const schema = useMemo(() => TicketSchema(t), [t]);

    useEffect(() => {
        if (!isLoading && (isError || !issueTypes)) {
            sileo.error({
                title: t('center_managers.view_page.not_found.title'),
                description: t('center_managers.view_page.not_found.message'),
                duration: 6000,
            });

            navigate('/center-managers', { replace: true });
        }
    }, [isError, isLoading, issueTypes, navigate, t]);

    const form = useForm<TicketFormInput, unknown, TicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            description: "",
            affected_name: "",
            evidence_url: "",
            contact_email: "",
            available_hours: "",
            equipment_location: "",
            issue_type: 0,
        },
        values: ticket ? {
            ...ticket,
            evidence_url: ticket.evidence_url ?? "",
            issue_type: ticket.issue_type?.id ?? 0,
        } : undefined,
    });

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

    if (!issueTypes) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.header.title')}
                    description={t('tickets.form.header.description')}
                    icon={User}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-ticket">
                        <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 items-start">
                            {/* Fila 1: Afectado y Contacto */}
                            <FormField
                                control={form.control}
                                name="affected_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.affected_name.label')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoFocus
                                                placeholder={t('tickets.form.fields.affected_name.placeholder')}
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
                                name="contact_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.contact_email.label')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder={t('tickets.form.fields.contact_email.placeholder')}
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Fila 2: Ubicación y Horarios */}
                            <FormField
                                control={form.control}
                                name="equipment_location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.equipment_location.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.fields.equipment_location.placeholder')}
                                                className="resize-none min-h-15"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />

                                        {/* <FormLabel>{t('tickets.form.fields.equipment_location.label')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('tickets.form.fields.equipment_location.placeholder')}
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage /> */}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="available_hours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.available_hours.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.fields.available_hours.placeholder')}
                                                className="resize-none min-h-15"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {/* 
                                        <FormLabel>{t('tickets.form.fields.available_hours.label')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('tickets.form.fields.available_hours.placeholder')}
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage /> */}
                                    </FormItem>
                                )}
                            />

                            {/* Fila 3: Categoría (Select) y Evidencia */}
                            <FormField
                                control={form.control}
                                name="issue_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.issue_type.label')}</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            // Shadcn Select maneja strings, onValueChange lo inyecta al form
                                            onValueChange={field.onChange}
                                            defaultValue={field.value ? String(field.value) : undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('tickets.form.fields.issue_type.placeholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {issueTypes.map((type) => (
                                                    <SelectItem key={type.id} value={String(type.id)}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* <FormField
                                control={form.control}
                                name="evidence_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.evidence_url.label')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="File"
                                                accept="image/*"

                                                placeholder={t('tickets.form.fields.evidence_url.placeholder')}
                                                disabled={isPending}
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            {t('tickets.form.fields.evidence_url.description')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            {/* Fila 4: Descripción del problema (Ocupa las 2 columnas) */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>{t('tickets.form.fields.description.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.fields.description.placeholder')}
                                                className="resize-none min-h-30"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                    form="form-ticket"
                    disabled={isPending || (!form.formState.isDirty && !!ticket)}
                    className="w-full sm:w-auto"
                >
                    {isPending ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-1.5 h-4 w-4" />
                    )}
                    {titleButton}
                </Button>
            </CardFooter>

        </Card>
    );
};