import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, ClipboardSignature, Save, X, BrushCleaning } from "lucide-react";

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
import { InterveneTicketSchema, type InterveneTicketFormInput, type InterveneTicketFormOutput } from "@/tickets/schemas/intervene-ticket.schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { CustomOptionalInput } from "@/components/custom/CustomOptionalInput";
import { InfiniteScrollComboboxEquipments } from "@/Equipments/components/InfiniteScrollComboboxEquipments";
import type { FaultValidity } from "@/common/fault-validities/interfaces/fault-validity.interface";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tag } from "@/common/tags/interfaces/tag.interface";
import { InfiniteScrollComboboxTags } from "@/common/tags/components/InfiniteScrollComboboxTags";
import type { IssueType } from "@/IssueTypes/interfaces/issue-type";
import { CustomSectionInfo } from "@/components/custom/CustomSectionInfo";

interface Props {
    isPending: boolean;
    faultValidities: FaultValidity[];
    ticketTags?: Tag[];
    ticketIssueType?: IssueType;
    issueTypes: IssueType[];
    onSubmit: (data: InterveneTicketFormOutput) => void;
    onCancel: () => void;
}

export const InterveneTicketForm = ({ onSubmit, isPending, onCancel, faultValidities, ticketTags, issueTypes, ticketIssueType }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => InterveneTicketSchema(t), [t]);

    const form = useForm<InterveneTicketFormInput, unknown, InterveneTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            diagnosis: "",
            work_performed: "",
            materials_used: "",
            is_resolved: undefined,
            tags: ticketTags?.map((tag) => tag.name) || [],
            equipment_ids: [],
            fault_validity_id: "",
            issue_type: ticketIssueType?.id ? String(ticketIssueType.id) : "",
        },
    });

    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    const isResolved = useWatch({
        control: form.control,
        name: 'is_resolved',
    });

    const isBusy = isPending || form.formState.isSubmitting;

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

                            <CustomSectionInfo label={t('tickets.form.intervene.sections.report')} />

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
                                name="work_performed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.work_performed.label')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.intervene.fields.work_performed.placeholder')}
                                                className="resize-none min-h-24"
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
                                name="materials_used"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.required_materials.label')}<CustomOptionalInput /></FormLabel>
                                        <FormDescription>{t('tickets.form.intervene.fields.required_materials.description')}</FormDescription>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.intervene.fields.required_materials.placeholder')}
                                                className="resize-none min-h-24"
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
                                name="is_resolved"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className={
                                            "flex items-center gap-2 text-sm leading-none font-medium select-none"} >
                                            {t('tickets.form.intervene.fields.is_resolved.label')}
                                        </div>
                                        <FormControl>
                                            <RadioGroup
                                                name={field.name}
                                                value={typeof field.value === "boolean" ? String(field.value) : ""}
                                                onValueChange={(value) => field.onChange(value === "true")}
                                                aria-invalid={fieldState.invalid}
                                                disabled={isBusy}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                <FieldLabel htmlFor="resolved-true">
                                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                        <FieldContent>
                                                            <FieldTitle>
                                                                {t('tickets.form.intervene.fields.is_resolved.options.yes.label')}
                                                            </FieldTitle>
                                                            <FieldDescription>
                                                                {t('tickets.form.intervene.fields.is_resolved.options.yes.description')}
                                                            </FieldDescription>
                                                        </FieldContent>
                                                        <RadioGroupItem value="true" id="resolved-true" aria-invalid={fieldState.invalid} />
                                                    </Field>
                                                </FieldLabel>

                                                <FieldLabel htmlFor="resolved-false">
                                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                        <FieldContent>
                                                            <FieldTitle>
                                                                {t('tickets.form.intervene.fields.is_resolved.options.no.label')}
                                                            </FieldTitle>
                                                            <FieldDescription>
                                                                {t('tickets.form.intervene.fields.is_resolved.options.no.description')}
                                                            </FieldDescription>
                                                        </FieldContent>
                                                        <RadioGroupItem value="false" id="resolved-false" aria-invalid={fieldState.invalid} />
                                                    </Field>
                                                </FieldLabel>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="equipment_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.equipment_ids.label')}<CustomOptionalInput /></FormLabel>
                                        <FormDescription>{t('tickets.form.intervene.fields.equipment_ids.description')}</FormDescription>
                                        <FormControl>
                                            <InfiniteScrollComboboxEquipments
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={isBusy}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fault_validity_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.fault_validity.label')}</FormLabel>
                                        <FormDescription>{t('tickets.form.intervene.fields.fault_validity.description')}</FormDescription>
                                        <Select
                                            disabled={isBusy}
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('tickets.form.intervene.fields.fault_validity.placeholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {faultValidities.map((fault) => (
                                                        <SelectItem key={fault.id} value={fault.id.toString()}>{fault.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <CustomSectionInfo label={t('tickets.form.intervene.sections.ticket_clasify')} />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field, fieldState }) => {

                                    let errorMessage = fieldState.error?.message;
                                    if (!errorMessage && Array.isArray(fieldState.error)) {
                                        const firstNestedError = fieldState.error.find((err) => err != null);
                                        if (firstNestedError) {
                                            errorMessage = firstNestedError.message;
                                        }
                                    }

                                    return (
                                        <FormItem>
                                            <FormLabel>{t('tickets.form.intervene.fields.tags.label')}{!isResolved && <CustomOptionalInput />}</FormLabel>
                                            <FormDescription>
                                                {t('tickets.form.intervene.fields.tags.description')}
                                            </FormDescription>
                                            <FormControl>
                                                <InfiniteScrollComboboxTags
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                    disabled={isBusy}
                                                />
                                            </FormControl>
                                            {errorMessage &&
                                                <p
                                                    data-slot="form-message"
                                                    className={"text-sm text-destructive"}
                                                >
                                                    {errorMessage}
                                                </p>
                                            }
                                        </FormItem>
                                    )
                                }}
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
                    form="form-intervene-ticket"
                    disabled={isBusy || !form.formState.isDirty}
                    className="w-full sm:w-auto"
                >
                    {isBusy ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-1.5 h-4 w-4" />
                    )}
                    {t('tickets.form.intervene.buttons.submit')}
                </Button>
            </CardFooter>
        </Card >
    );
};