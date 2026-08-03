import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { BrushCleaning, Loader2, Send, Tickets, UserPlus, X } from "lucide-react";

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
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { getFullName } from "@/lib/helpers/toFullName";
import { AssignTicketSchema, type AssignTicketFormInput, type AssignTicketFormOutput } from "@/tickets/schemas/assign-ticket.schema";
import React from "react";
import type { Technician } from "@/common/technicians/interfaces/technicians.interface";
import type { TicketDetailsResponse } from "@/tickets/interfaces/ticket-details.response";
import { TicketStatus } from "@/tickets/utils/ticket-state-machine";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";

interface techValue {
    value: string;
    label: string;
    originalData: Technician;
}

interface Props {
    isPending: boolean;
    ticket: TicketDetailsResponse;
    technicians: Technician[];
    onSubmit: (data: AssignTicketFormOutput) => void;
    onCancel: () => void;
}

export const AssignTicketForm = ({ onSubmit, isPending, onCancel, ticket, technicians }: Props) => {
    const { t } = useTranslation();
    const anchor = useComboboxAnchor()

    const schema = useMemo(() => AssignTicketSchema(t), [t]);

    const technicianDefaultIds = ticket.attends
        ? ticket.attends.map((tech) => tech.technician.id)
        : [];

    const form = useForm<AssignTicketFormInput, unknown, AssignTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            technicianIds: technicianDefaultIds,
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
                                                disabled={isBusy}
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
                                                                >
                                                                    <Item size={"sm"} className="p-0 flex-1">
                                                                        <ItemContent>
                                                                            <ItemTitle >{item.label}</ItemTitle>
                                                                            <ItemDescription className="flex gap-2 text-xs items-center">
                                                                                <Badge variant={"secondary"}>
                                                                                    {item.originalData.num_control}
                                                                                </Badge>
                                                                                <span className="truncate">{item.originalData.user.email}</span>
                                                                            </ItemDescription>
                                                                        </ItemContent>
                                                                        <ItemActions className="ml-auto">
                                                                            <Badge variant={"secondary"} className="font-bold">
                                                                                <Tickets />
                                                                                {item.originalData.assignTicketsCount}
                                                                            </Badge>
                                                                        </ItemActions>
                                                                    </Item>
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
                    variant="ghost"
                    type="button"
                    disabled={isBusy}
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                >
                    <X className="mr-2 h-4 w-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-assign-ticket"
                    disabled={isBusy || (!form.formState.isDirty && ticket.currentStatusCode !== TicketStatus.NO_SOLUCIONADA && ticket.currentStatusCode !== TicketStatus.CANALIZADA)}
                    className="w-full sm:w-auto"
                >
                    {isBusy ? (
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