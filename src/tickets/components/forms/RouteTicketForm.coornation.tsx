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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RouteTicketSchema, type RouteTicketFormInput, type RouteTicketFormOutput } from "@/tickets/shcemas/route-ticket.schema";
import { sileo } from "sileo";
import { useNavigate } from "react-router";
import { useCoordinations } from "@/users/hooks/useCoordinations";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";

interface Props {
    isPending: boolean;
    onSubmit: (data: RouteTicketFormOutput) => void;
    onCancel: () => void;
}

export const RouteTicketFormCoor = ({ onSubmit, isPending, onCancel }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => RouteTicketSchema(t), [t]);
    const { isLoading, isError, data: coordinations } = useCoordinations();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (isError || !coordinations)) {
            sileo.error({
                title: 'p',
                description: 'p',
                duration: 6000,
            });

            navigate('/tickets', { replace: true });
        }
    }, [isError, isLoading, coordinations, navigate, t]);

    const form = useForm<RouteTicketFormInput, unknown, RouteTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            coordination_id: "",
        },
    });

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!coordinations) {
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

                        {/* Campo: Área de Coordinación */}
                        <FormField
                            control={form.control}
                            name="coordination_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('tickets.form.route.fields.coordination.label')}
                                    </FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={t('tickets.form.route.fields.coordination.placeholder')}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {coordinations.map((coordination) => (
                                                <SelectItem key={coordination.id} value={coordination.id} className="py-3">
                                                    {coordination.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo: Notas adicionales (Opcional) */}
                        {/* <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('tickets.channel.fields.notes.label')} <span className="text-muted-foreground font-normal">(Opcional)</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('tickets.channel.fields.notes.placeholder')}
                                            className="resize-none min-h-24"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
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