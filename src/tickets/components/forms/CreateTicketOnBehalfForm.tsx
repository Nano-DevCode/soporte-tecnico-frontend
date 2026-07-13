import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { BrushCleaning, Loader2, Save, User, X } from "lucide-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IssueType } from "@/IssueTypes/interfaces/issue-type";
import { TicketOnBehalfSchema, type TicketOnBehalfFormInput, type TicketOnBehalfFormOutput } from "@/tickets/schemas/ticket-on-behalf.schema";
import type { DepartmentManager } from "@/common/department-managers/interfaces/department-manager.interface";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { getFullName } from "@/lib/helpers/toFullName";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { v4 as uuidv4 } from 'uuid';

interface Props {
    ticket?: TicketDetailsResponse,
    isPending: boolean,
    titleButton: string,
    issueTypes: IssueType[]
    departmentManagers: DepartmentManager[]

    onSubmit: (ticket: TicketOnBehalfFormOutput, idempotencyKey: string) => void,
    onCancel: () => void,

}

export const CreateTicketOnBehalfForm = ({ onSubmit, isPending, titleButton, onCancel, issueTypes, departmentManagers }: Props) => {
    const { t } = useTranslation();
    const [idempotencyKey] = useState(() => uuidv4());

    const schema = useMemo(() => TicketOnBehalfSchema(t), [t]);

    const form = useForm<TicketOnBehalfFormInput, unknown, TicketOnBehalfFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            user_id: "",
            description: "",
            affected_name: "",
            evidence_url: "",
            contact_email: "",
            available_hours: "",
            equipment_location: "",
            issue_type: "",
        }
    });

    const isBusy = isPending || form.formState.isSubmitting;

    const handleSafeSubmit = (data: TicketOnBehalfFormOutput) => {
        onSubmit(data, idempotencyKey);
    };

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
                    <form onSubmit={form.handleSubmit(handleSafeSubmit)} noValidate id="form-ticket">

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
                            <FormField
                                control={form.control}
                                name="user_id"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>{t('tickets.form.create_on_behalf.fields.department_manager.label')}</FormLabel>
                                        <FormDescription>{t('tickets.form.create_on_behalf.fields.department_manager.description')}</FormDescription>
                                        <FormControl>
                                            <Combobox
                                                items={departmentManagers}
                                                itemToStringLabel={(item: DepartmentManager) =>
                                                    getFullName(item.name, item.paternalSurname, item.maternalSurname)
                                                }
                                                value={departmentManagers.find(manager => manager.user.id === field.value) || null}
                                                onValueChange={(value) => field.onChange(value?.user.id)}
                                                filter={(jefe, query) => {
                                                    const textoBuscado = query.toLowerCase();
                                                    const nombreCompleto = `${jefe.name} ${jefe.paternalSurname} ${jefe.maternalSurname}`.toLowerCase();
                                                    const nombreDepartamento = jefe.department?.name?.toLowerCase() || "";
                                                    const acronimo = jefe.department?.acronym?.toLowerCase() || "";

                                                    return (
                                                        nombreCompleto.includes(textoBuscado) ||
                                                        nombreDepartamento.includes(textoBuscado) ||
                                                        acronimo.includes(textoBuscado)
                                                    );
                                                }}
                                                autoHighlight
                                            >
                                                <ComboboxInput autoFocus disabled={isBusy} placeholder={t('tickets.form.create_on_behalf.fields.department_manager.placeholder')} />
                                                <ComboboxContent>
                                                    <ComboboxEmpty>{t('tickets.form.create_on_behalf.fields.department_manager.empty')}</ComboboxEmpty>
                                                    <ComboboxList>
                                                        {(item: DepartmentManager) => (
                                                            <ComboboxItem key={item.user.id} value={item}>
                                                                <Item className="p-0">
                                                                    <ItemContent>
                                                                        <ItemTitle className="whitespace-nowrap">
                                                                            {getFullName(item.name, item.paternalSurname, item.maternalSurname)}
                                                                        </ItemTitle>
                                                                        <ItemDescription>
                                                                            {item.department.name} - {item.department.acronym}
                                                                        </ItemDescription>
                                                                    </ItemContent>
                                                                </Item>
                                                            </ComboboxItem>
                                                        )}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="affected_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.fields.affected_name.label')}</FormLabel>
                                        <FormControl>
                                            <Input
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
                    form="form-ticket"
                    disabled={isBusy || !form.formState.isDirty}
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