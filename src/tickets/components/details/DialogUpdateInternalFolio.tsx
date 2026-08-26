import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PencilLineIcon, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { UpdateInternalFolioSchema, type UpdateInternalFolioFormInput, type UpdateInternalFolioFormOutput } from '../../schemas/UpdateInternalFolio.schema';
import { useUpdateInternalFolio } from '../../hooks/useUpdateInternalFolio';

interface Props {
    ticketId: string;
    currentFolio?: string | null;
}

export const DialogUpdateInternalFolio = ({ ticketId, currentFolio }: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    
    const { mutate, isPending } = useUpdateInternalFolio();

    const form = useForm<UpdateInternalFolioFormInput, unknown, UpdateInternalFolioFormOutput>({
        resolver: zodResolver(UpdateInternalFolioSchema(t)),
        defaultValues: {
            internal_folio: currentFolio || '',
        },
    });

    const onSubmit = (data: UpdateInternalFolioFormOutput) => {
        mutate({ id: ticketId, updateInternalFolioPayload: data }, {
            onSuccess: () => {
                setOpen(false);
                form.reset({ internal_folio: data.internal_folio });
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && isPending) return;
        setOpen(newOpen);
        if (newOpen) {
            form.reset({ internal_folio: currentFolio || '' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" title="Modificar folio interno">
                    <PencilLineIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('common.buttons.edit')} Folio Interno</DialogTitle>
                    <DialogDescription>
                        Actualiza de forma manual el folio interno del ticket.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="update-internal-folio-form">
                        <FormField
                            control={form.control}
                            name="internal_folio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Folio Interno</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            autoFocus
                                            placeholder="Ej: OT-2026-0001-DEP"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        El formato anterior era CC-PERIODO-NUMERO, el nuevo es OT-AÑO-NUMERO-DEP.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        <X className="w-4 h-4 mr-2" />
                        {t('common.buttons.cancel')}
                    </Button>
                    <Button 
                        type="submit" 
                        form="update-internal-folio-form" 
                        disabled={isPending || !form.formState.isDirty}
                        className="w-full sm:w-auto"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {t('common.buttons.save_changes')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
