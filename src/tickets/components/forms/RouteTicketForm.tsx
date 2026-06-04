import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { BrushCleaning, Loader2, Send, X } from "lucide-react";

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
import { RouteTicketSchema, type RouteTicketFormInput, type RouteTicketFormOutput } from "@/tickets/schemas/route-ticket.schema";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { getFullName } from "@/lib/helpers/toFullName";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Coordinator } from "@/common/coordinators/interfaces/get-coordinators.response";
import { CustomOptionalInput } from "@/components/custom/CustomOptionalInput";

interface Props {
    isPending: boolean;
    priorityDefault: number;
    coordinators: Coordinator[]
    onSubmit: (data: RouteTicketFormOutput) => void;
    onCancel: () => void;
}

export const RouteTicketForm = ({ onSubmit, isPending, onCancel, priorityDefault, coordinators }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => RouteTicketSchema(t), [t]);

    const form = useForm<RouteTicketFormInput, unknown, RouteTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            coordinatorId: "",
            priority: String(priorityDefault),
        }
    });

    const isBusy = isPending || form.formState.isSubmitting;

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('tickets.form.route.header.title')}
                    description={t('tickets.form.route.header.description')}
                    icon={Send}
                />
            </CardHeader>
            <Separator />
            <CardContent >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-route-ticket" className="space-y-6">

                        <FormField
                            control={form.control}
                            name="coordinatorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('tickets.form.route.fields.coordinator.label')}
                                    </FormLabel>
                                    <FormControl>
                                        <Combobox
                                            items={coordinators}
                                            itemToStringLabel={(coordinator) =>
                                                `${coordinator.name} ${coordinator.paternalSurname} ${coordinator.maternalSurname}`
                                            }
                                            value={coordinators.find((c) => c.id === field.value) || null}
                                            onValueChange={(selectedCoordinator) => {
                                                field.onChange(selectedCoordinator ? selectedCoordinator.id : "");
                                            }}
                                            disabled={isBusy}
                                            autoHighlight
                                        >
                                            <ComboboxInput autoFocus
                                                placeholder={t('tickets.form.route.fields.coordinator.placeholder')}
                                            />

                                            <ComboboxContent>
                                                <ComboboxEmpty>
                                                    {t('tickets.form.route.fields.coordinator.not_found')}
                                                </ComboboxEmpty>
                                                <ComboboxList>
                                                    {(coordinator) => (
                                                        <ComboboxItem
                                                            key={coordinator.id}
                                                            value={coordinator}
                                                            className="flex flex-col items-start py-2 px-3"
                                                        >
                                                            <div className="flex items-center w-full">
                                                                <span className="font-medium text-foreground">
                                                                    {getFullName(coordinator.name, coordinator.paternalSurname, coordinator.maternalSurname)}
                                                                </span>
                                                            </div>

                                                            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                                                <span className="font-semibold bg-secondary px-1.5 rounded">
                                                                    {coordinator.user.role.name}
                                                                </span>
                                                            </div>
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
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('tickets.form.route.fields.priority.label')}
                                        <CustomOptionalInput />
                                    </FormLabel>
                                    <Select
                                        name={field.name}
                                        disabled={isBusy}
                                        onValueChange={field.onChange}
                                        value={field.value as string}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('tickets.form.route.fields.priority.placeholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">{t('tickets.priority.1.name')}</SelectItem>
                                            <SelectItem value="2">{t('tickets.priority.2.name')}</SelectItem>
                                            <SelectItem value="3">{t('tickets.priority.3.name')}</SelectItem>
                                            <SelectItem value="4">{t('tickets.priority.4.name')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
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
                    variant="destructive"
                    type="button"
                    disabled={isBusy}
                    onClick={onCancel}
                    className="w-full sm:w-auto"
                >
                    <X className="mr-2 h-4 w-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-route-ticket"
                    disabled={isBusy || !form.formState.isDirty}
                    className="w-full sm:w-auto"
                >
                    {isBusy ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    {t('tickets.form.route.buttons.submit')}
                </Button>
            </CardFooter>
        </Card>
    );
};