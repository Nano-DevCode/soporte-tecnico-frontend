import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, ClipboardSignature, Save, X } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { InterveneTicketSchema, type InterveneTicketFormInput, type InterveneTicketFormOutput } from "@/tickets/shcemas/intervene-ticket.schema";
import { Item, ItemActions, ItemContent } from "@/components/ui/item";


interface Props {
    isPending: boolean;
    onSubmit: (data: InterveneTicketFormOutput) => void;
    onCancel: () => void;
}

export const InterveneTicketForm = ({ onSubmit, isPending, onCancel }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => InterveneTicketSchema(t), [t]);

    const form = useForm<InterveneTicketFormInput, unknown, InterveneTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            diagnosis: "",
            work_performed: "",
            required_materials: "",
            is_resolved: false,
        },
    });

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
                    title={t('tickets.form.intervene.header.title')}
                    description={t('tickets.form.intervene.header.description')}
                    icon={ClipboardSignature}
                />
            </CardHeader>
            <Separator />
            <CardContent >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-intervene-ticket">
                        <div className="space-y-6">

                            {/* Diagnóstico */}
                            <FormField
                                control={form.control}
                                name="diagnosis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.diagnosis.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                autoFocus
                                                placeholder={t('tickets.form.intervene.fields.diagnosis.placeholder')}
                                                className="resize-none min-h-24"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Trabajo Realizado */}
                            <FormField
                                control={form.control}
                                name="work_performed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.work_performed.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.intervene.fields.work_performed.placeholder')}
                                                className="resize-none min-h-24"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Materiales Requeridos / Usados */}
                            <FormField
                                control={form.control}
                                name="required_materials"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.required_materials.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.intervene.fields.required_materials.placeholder')}
                                                className="resize-none min-h-16"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            {t('tickets.form.intervene.fields.required_materials.description')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Switch de Resolución (Destacado) */}
                            <FormField
                                control={form.control}
                                name="is_resolved"
                                render={({ field }) => (
                                    <FormItem>
                                        <Item variant={"muted"}>
                                            <ItemContent>
                                                <FormLabel>
                                                    {t('tickets.form.intervene.fields.is_resolved.label')}
                                                </FormLabel>
                                                <FormDescription>
                                                    {t('tickets.form.intervene.fields.is_resolved.description')}
                                                </FormDescription>
                                            </ItemContent>
                                            <ItemActions>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isPending}
                                                        className="data-[state=checked]:bg-green-600" // Opcional: Darle un color verde si está resuelto
                                                    />
                                                </FormControl>
                                            </ItemActions>
                                        </Item>
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
                    form="form-intervene-ticket"
                    disabled={isPending || !form.formState.isDirty}
                    className="w-full sm:w-auto"
                >
                    {isPending ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-1.5 h-4 w-4" />
                    )}
                    {t('tickets.form.intervene.buttons.submit')}
                </Button>
            </CardFooter>
        </Card>
    );
};