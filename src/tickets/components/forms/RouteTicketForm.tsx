import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, Send, X } from "lucide-react";

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
import { RouteTicketSchema, type RouteTicketFormInput, type RouteTicketFormOutput } from "@/tickets/schemas/route-ticket.schema";
import { sileo } from "sileo";
import { useNavigate } from "react-router";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { useGetCoordinators } from "@/common/coordinators/hooks/useGetCoordinators";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { getFullName } from "@/lib/helpers/toFullName";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    isPending: boolean;
    priorityDefault?: number;
    onSubmit: (data: RouteTicketFormOutput) => void;
    onCancel: () => void;
}

export const RouteTicketForm = ({ onSubmit, isPending, onCancel, priorityDefault }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => RouteTicketSchema(t), [t]);
    const { isLoading, isError, data: coordinators } = useGetCoordinators();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (isError || !coordinators)) {
            sileo.error({
                title: 'p',
                description: 'p',
                duration: 6000,
            });

            navigate('/tickets', { replace: true });
        }
    }, [isError, isLoading, coordinators, navigate, t]);

    const form = useForm<RouteTicketFormInput, unknown, RouteTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            coordinatorId: "",
            priority: priorityDefault || undefined,
        },
    });

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!coordinators) {
        return null;
    }

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
                                                field.onChange(selectedCoordinator ? selectedCoordinator.id : undefined);
                                            }}
                                            disabled={isPending}
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

                                                            {/* Detalles extra (Email y Rol) debajo del nombre */}
                                                            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                                                <span className="font-semibold bg-secondary px-1.5 rounded">
                                                                    {coordinator.user.role.name}
                                                                </span>
                                                                {/* <span className="truncate">{coordinator.user.email}</span> */}
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
                                        {t('tickets.form.route.fields.priority.label', 'Prioridad')}
                                        <span className="text-muted-foreground font-normal ml-1">
                                            ({t('common.labels.optional', 'Opcional')})
                                        </span>
                                    </FormLabel>
                                    <Select
                                        name={field.name}
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ? String(field.value) : undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('tickets.form.route.fields.priority.placeholder', 'Selecciona una prioridad')} />
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
                    variant="ghost"
                    type="button"
                    disabled={isPending}
                    onClick={onCancel}
                    className="flex-auto"
                >
                    <X className="mr-2 h-4 w-4" />
                    {t('common.buttons.cancel')}
                </Button>

                <Button
                    type="submit"
                    form="form-route-ticket"
                    disabled={isPending || !form.formState.isDirty}
                    className="flex-auto"
                >
                    {isPending ? (
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