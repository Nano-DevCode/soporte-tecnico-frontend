import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, Save, User, X } from "lucide-react";

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
import { useMemo } from "react";
import type { CenterManager } from "../interfaces/center-manager.interface";
import { CenterManagerSchema, type CenterManagerFormValues } from "../schemas/create-center-manager.schema";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomHeaderCard } from "@/components/custom/CustomHeaderCard";

interface Props {
    centerManager?: CenterManager,
    isPending: boolean,
    titleButton: string,

    onSubmit: (centerManager: CenterManagerFormValues) => void,
    onCancel: () => void,
}

export const CenterManagerForm = ({ centerManager, onSubmit, isPending, titleButton, onCancel }: Props) => {
    const { t } = useTranslation();
    const schema = useMemo(() => CenterManagerSchema(t), [t]);

    const form = useForm<CenterManagerFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            names: "",
            first_last_name: "",
            second_last_name: "",
            rfc: "",
        },
        values: centerManager,
    });

    const handleCancel = () => {
        if (form.formState.isDirty) {
            const confirmDiscard = window.confirm(t('common.warnings.discard_changes', 'Tienes cambios sin guardar. ¿Seguro que deseas salir?'));
            if (!confirmDiscard) return;
        }
        onCancel();
    };

    return (
        <Card>
            <CardHeader className="gap-0">
                <CustomHeaderCard
                    title={t('center_managers.form.header.title')}
                    description={t('center_managers.form.header.description')}
                    icon={User}
                />
            </CardHeader>
            <Separator />
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="form-center-manager">
                        <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2 items-start">
                            <FormField
                                control={form.control}
                                name="names"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>
                                            {t('center_managers.form.fields.names.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoFocus
                                                placeholder={t('center_managers.form.fields.names.placeholder')}
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
                                name="first_last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('center_managers.form.fields.first_last_name.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('center_managers.form.fields.first_last_name.placeholder')}
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
                                name="second_last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('center_managers.form.fields.second_last_name.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('center_managers.form.fields.second_last_name.placeholder')}
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
                                name="rfc"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>
                                            {t('center_managers.form.fields.rfc.label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('center_managers.form.fields.rfc.placeholder')}
                                                disabled={isPending}
                                                className="uppercase font-mono"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            {t('center_managers.form.fields.rfc.description')}
                                        </FormDescription>
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
                    form="form-center-manager"
                    disabled={isPending || (!form.formState.isDirty && !!centerManager)}
                    className="w-full sm:w-auto"
                >
                    {isPending ? (
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