import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, ClipboardSignature, Save, X, Plus } from "lucide-react";

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
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";
import { Textarea } from "@/components/ui/textarea";
import { InterveneTicketSchema, type InterveneTicketFormInput, type InterveneTicketFormOutput } from "@/tickets/schemas/intervene-ticket.schema";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { CustomOptionalInput } from "@/components/custom/CustomOptionalInput";
import type { Tag } from "@/common/tags/interfaces/tag.interface";


interface Props {
    isPending: boolean;
    tags: Tag[]
    onSubmit: (data: InterveneTicketFormOutput) => void;
    onCancel: () => void;
}

export const InterveneTicketForm = ({ onSubmit, isPending, onCancel, tags }: Props) => {
    const { t } = useTranslation();

    const schema = useMemo(() => InterveneTicketSchema(t), [t]);

    const form = useForm<InterveneTicketFormInput, unknown, InterveneTicketFormOutput>({
        resolver: zodResolver(schema),
        defaultValues: {
            diagnosis: "",
            work_performed: "",
            required_materials: "",
            is_resolved: undefined,
            tags: [],
        },
    });

    const [inputValue, setInputValue] = useState("");

    const tagNames = useMemo(() => tags ? tags.map(t => t.name.toUpperCase()) : [], [tags]);

    const dynamicItems = useMemo(() => {
        const currentSelectedTags = form.getValues("tags") || [];
        const allKnownTags = Array.from(new Set([...tagNames, ...currentSelectedTags]));
        const normalizedInput = inputValue.trim().toUpperCase();
        if (normalizedInput && !allKnownTags.includes(normalizedInput)) {
            return [...allKnownTags, normalizedInput];
        }
        return allKnownTags;
    }, [form, inputValue, tagNames])

    const anchor = useComboboxAnchor()



    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    const handleAddTag = (newTag: string) => {
        const currentTags = form.getValues("tags") || [];

        if (currentTags.includes(newTag)) return;

        // setTagItem([...tagItems, newTag]);

        form.setValue("tags", [...currentTags, newTag], {
            shouldValidate: true,
            shouldDirty: true,
        });

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

                            <FormField
                                control={form.control}
                                name="required_materials"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.required_materials.label')}<CustomOptionalInput /></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('tickets.form.intervene.fields.required_materials.placeholder')}
                                                className="resize-none min-h-16"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => {

                                    return (
                                        <FormItem>
                                            <FormLabel>{t('tickets.form.intervene.fields.tags.label')}<CustomOptionalInput /></FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    items={dynamicItems}
                                                    multiple
                                                    autoHighlight
                                                    value={field.value || []}
                                                    onValueChange={field.onChange}
                                                    onInputValueChange={setInputValue}
                                                    disabled={isPending}
                                                >
                                                    <ComboboxChips ref={anchor}>
                                                        <ComboboxValue>
                                                            {(field.value || []).map((item) => (
                                                                <ComboboxChip key={item}>{item}</ComboboxChip>
                                                            ))}
                                                        </ComboboxValue>
                                                        <ComboboxChipsInput
                                                            placeholder={t('tickets.form.intervene.fields.tags.placeholder')}
                                                        />
                                                    </ComboboxChips>
                                                    <ComboboxContent anchor={anchor}>
                                                        <ComboboxEmpty>
                                                            <span>{t('tickets.form.intervene.fields.tags.not_found.label')}</span>
                                                        </ComboboxEmpty>
                                                        <ComboboxList>
                                                            {(item) => {
                                                                const isNewTag = !tagNames.includes(item) && !field.value?.includes(item);

                                                                return (
                                                                    <ComboboxItem
                                                                        key={item}
                                                                        value={item}
                                                                        className={isNewTag ? "text-primary bg-primary/5 hover:bg-primary/10 transition-colors" : ""}
                                                                    >
                                                                        {isNewTag ? (
                                                                            <div className="flex items-center gap-2" onClick={() => handleAddTag(item)}>
                                                                                <Plus className="h-4 w-4" />
                                                                                <span>
                                                                                    {t('tickets.form.intervene.fields.tags.create.label')} <strong className="font-semibold">"{item}"</strong>
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            item
                                                                        )}
                                                                    </ComboboxItem>
                                                                );
                                                            }}
                                                        </ComboboxList>
                                                    </ComboboxContent>
                                                </Combobox>
                                            </FormControl>
                                            <FormDescription>
                                                {t('tickets.form.intervene.fields.tags.description')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="is_resolved"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t('tickets.form.intervene.fields.is_resolved.label')}</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(value) => field.onChange(value === "true")}
                                                value={field.value === true ? "true" : (field.value === false ? "false" : undefined)}
                                                disabled={isPending}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                aria-invalid={fieldState.invalid}
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
        </Card >
    );
};