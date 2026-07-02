import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ItemFolio } from "@/folios/interfaces/get-folios.interface"
import { TicketFolioSchema, type TicketFolioFormInput, type TicketFolioFormOutput } from "@/folios/schemas/UpdateTicketFolioDepartment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrushCleaning, Loader2, Save, X } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
    itemFolio?: ItemFolio,
    isPending: boolean,
    titleButton: string,

    onSubmit: (ticketFolioFormOutput: TicketFolioFormOutput) => void,
    onCancel: () => void,

}

const defaultFormValues = {
    requestedNextFolio: ""
};

export const TicketFolioForm = ({ itemFolio, onSubmit, isPending, titleButton, onCancel }: Props) => {
    const { t } = useTranslation();

    const schema = useMemo(() => TicketFolioSchema(t, itemFolio?.next_value ?? 0), [itemFolio?.next_value, t]);


    const form = useForm<TicketFolioFormInput, unknown, TicketFolioFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: defaultFormValues,
        values: defaultFormValues,
    });

    const isBusy = isPending || form.formState.isSubmitting;

    const requestedNextFolio = useWatch({
        control: form.control,
        name: 'requestedNextFolio',
    }) as string;

    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    return (
        <>
            <CardContent className="space-y-5">
                <Separator />
                <CustomSectionInfo label={t('folios.tickets.edit_page.details.sections.config')} />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate id="form-ticket">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
                            <FormField
                                control={form.control}
                                name="requestedNextFolio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('folios.tickets.forms.folio.fields.folio.label')}</FormLabel>
                                        <FormDescription>
                                            {t('folios.tickets.forms.folio.fields.folio.description')}
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                autoFocus
                                                type="number"
                                                placeholder={t('folios.tickets.forms.folio.fields.folio.placeholder')}
                                                disabled={isBusy}
                                                {...field}
                                                value={(field.value ?? "") as string | number}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem >
                                <FormLabel >{t('folios.tickets.forms.folio.fields.next_folio_preview.label')}</FormLabel>
                                <FormDescription >
                                    {t('folios.tickets.forms.folio.fields.next_folio_preview.description')}
                                </FormDescription>
                                <FormControl >
                                    <Input
                                        placeholder={t('folios.tickets.forms.folio.fields.next_folio_preview.placeholder')}
                                        disabled={true}
                                        value={
                                            requestedNextFolio
                                                ? `${itemFolio?.acronym}-${itemFolio?.period_name}-${String(requestedNextFolio).padStart(4, '0')}`
                                                : ""
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
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
                    disabled={isBusy || (!form.formState.isDirty && !!itemFolio)}
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
        </>
    )
}
