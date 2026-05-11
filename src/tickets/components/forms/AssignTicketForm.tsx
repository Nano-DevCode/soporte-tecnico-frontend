import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, Send, UserPlus, X } from "lucide-react";

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
import { useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { sileo } from "sileo";
import { useNavigate } from "react-router";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { getFullName } from "@/lib/helpers/toFullName";
import { AssignTicketSchema, type AssignTicketFormInput, type AssignTicketFormOutput } from "@/tickets/shcemas/assign-ticket.schema";
import { useGetTechnicians } from "@/common/technicians/hooks/useGetTechnicians";
import React from "react";
import type { Technician } from "@/common/technicians/interfaces/technicians.interface";
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { TicketStatus } from "@/tickets/utils/ticket-state-machine";

interface techValue {
    value: string;
    label: string;
    originalData: Technician;
}

interface Props {
    isPending: boolean;
    ticket: TicketDetailsResponse;
    onSubmit: (data: AssignTicketFormOutput) => void;
    onCancel: () => void;
}

export const AssignTicketForm = ({ onSubmit, isPending, onCancel, ticket }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => AssignTicketSchema(t), [t]);
    const { isLoading, isError, data: technicians } = useGetTechnicians();
    const navigate = useNavigate();
    const anchor = useComboboxAnchor()

    const technicianDefaultIds = ticket.attends
        ? ticket.attends.map((tech) => tech.technician.id)
        : [];

    const form = useForm<AssignTicketFormInput, unknown, AssignTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            technicianIds: technicianDefaultIds,
        },
    });
    useEffect(() => {
        if (!isLoading && (isError || !technicians)) {
            sileo.error({
                title: 'p',
                description: 'p',
                duration: 6000,
            });

            navigate('/tickets', { replace: true });
        }
    }, [isError, isLoading, technicians, navigate, t]);

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

    if (!technicians) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.assign.header.title')}
                    description={t('tickets.form.assign.header.description')}
                    icon={UserPlus}
                />
            </CardHeader>
            <Separator />
            <CardContent >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-assign-ticket">

                        <FormField
                            control={form.control}
                            name="technicianIds"
                            render={({ field }) => {
                                const mappedTechnicians = technicians.map((tech): techValue => ({
                                    value: tech.id,
                                    label: getFullName(tech.name, tech.paternalSurname, tech.maternalSurname),
                                    originalData: tech
                                }));
                                const selectedItems = mappedTechnicians.filter(t => field.value.includes(t.value));
                                const isMaxSelected = field.value.length >= 4;

                                return (
                                    <FormItem>
                                        <FormLabel>
                                            {t('tickets.form.assign.fields.technicians.label')}
                                        </FormLabel>

                                        <FormControl>
                                            <Combobox
                                                items={mappedTechnicians}
                                                multiple
                                                value={selectedItems}
                                                onValueChange={(newSelectedItems) => {
                                                    field.onChange(newSelectedItems.map(item => item.value));
                                                }}
                                                disabled={isPending}
                                                autoHighlight
                                            >
                                                <ComboboxChips ref={anchor} className="">
                                                    <ComboboxValue>
                                                        {(values: techValue[]) => (
                                                            <React.Fragment>
                                                                {values.map((value) => (
                                                                    <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                                                                ))}
                                                                <ComboboxChipsInput autoFocus placeholder={t('tickets.form.assign.fields.technicians.placeholder')} />
                                                            </React.Fragment>
                                                        )}
                                                    </ComboboxValue>
                                                </ComboboxChips>

                                                <ComboboxContent anchor={anchor}>
                                                    <ComboboxEmpty>
                                                        {t('tickets.form.assign.fields.technicians.not_found')}
                                                    </ComboboxEmpty>
                                                    <ComboboxList>
                                                        {(item: techValue) => {
                                                            const isSelected = field.value.includes(item.value);
                                                            const isDisabled = (isMaxSelected && !isSelected);

                                                            return (
                                                                <ComboboxItem
                                                                    key={item.value}
                                                                    value={item}
                                                                    disabled={isDisabled}
                                                                    className="flex flex-col items-start py-2 px-3"
                                                                >
                                                                    <span className="font-medium">{item.label}</span>

                                                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                                                        <span className="font-semibold bg-secondary px-1.5 rounded-full">
                                                                            {item.originalData.num_control}
                                                                        </span>
                                                                        <span className="truncate">{item.originalData.user.email}</span>
                                                                    </div>
                                                                </ComboboxItem>
                                                            );
                                                        }}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription className="ml-auto">
                                            {field.value.length} / {t('tickets.form.assign.fields.technicians.description')}
                                        </FormDescription>
                                    </FormItem>
                                );
                            }}
                        />
                    </form>
                </Form>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-wrap-reverse sm:flex-row justify-end gap-3">
                <Button
                    variant="ghost"
                    type="button"
                    disabled={isPending}
                    onClick={handleCancel}
                    className="flex-auto"
                >
                    <X className="mr-2 h-4 w-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-assign-ticket"
                    disabled={isPending || (!form.formState.isDirty && ticket.currentStatusCode !== TicketStatus.NO_SOLUCIONADA)}
                    className="flex-auto"
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    {t('tickets.form.assign.buttons.submit')}
                </Button>
            </CardFooter>
        </Card>
    );
};