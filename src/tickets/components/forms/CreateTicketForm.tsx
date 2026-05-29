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
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { TicketSchema, type TicketFormInput, type TicketFormOutput } from "@/tickets/schemas/ticket.schema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IssueType } from "@/IssueTypes/interfaces/issue-type";

interface Props {
    ticket?: TicketDetailsResponse,
    isPending: boolean,
    titleButton: string,
    issueTypes: IssueType[]

    onSubmit: (ticket: TicketFormOutput) => void,
    onCancel: () => void,

}

export const CreateTicketForm = ({ ticket, onSubmit, isPending, titleButton, onCancel, issueTypes }: Props) => {
    const { t } = useTranslation();

    const schema = useMemo(() => TicketSchema(t), [t]);

    const defaultFormValues = {
        description: ticket?.description ?? "",
        affected_name: ticket?.affected_name ?? "",
        evidence_url: ticket?.evidence_url ?? "",
        contact_email: ticket?.contact_email ?? "",
        available_hours: ticket?.available_hours ?? "",
        equipment_location: ticket?.equipment_location ?? "",
        issue_type: ticket?.issue_type?.id ? String(ticket.issue_type.id) : "",
    };

    const form = useForm<TicketFormInput, unknown, TicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: defaultFormValues,
        values: defaultFormValues
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
                    title={t('tickets.form.header.title')}
                    description={t('tickets.form.header.description')}
                    icon={User}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-ticket">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
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
                                name="contact_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.contact_email.label')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder={t('tickets.form.fields.contact_email.placeholder')}
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
                                name="equipment_location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.equipment_location.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.fields.equipment_location.placeholder')}
                                                className="resize-none min-h-15"
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
                                name="available_hours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.available_hours.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.fields.available_hours.placeholder')}
                                                className="resize-none min-h-15"
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
                                name="issue_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.issue_type.label')}</FormLabel>
                                        <Select
                                            name={field.name}
                                            disabled={isBusy}
                                            onValueChange={field.onChange}
                                            value={field.value as string}
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
                                                disabled={isBusy}
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
                    disabled={isBusy}
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                >
                    <X className="mr-1.5 w-4 h-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-ticket"
                    disabled={isBusy || (!form.formState.isDirty && !!ticket)}
                    className="w-full sm:w-auto"
                >
                    {isBusy ? (
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