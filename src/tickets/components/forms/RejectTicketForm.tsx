import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2, X, XCircle } from "lucide-react";

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
import { RejectTicketSchema, type RejectTicketFormInput, type RejectTicketFormOutput } from "@/tickets/schemas/reject-ticket.schema";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  isPending: boolean;
  onSubmit: (data: RejectTicketFormOutput) => void;
  onCancel: () => void;
}

export const RejectTicketForm = ({ onSubmit, isPending, onCancel }: Props) => {
  const { t } = useTranslation();
  const schema = useMemo(() => RejectTicketSchema(t), [t]);

  const form = useForm<RejectTicketFormInput, unknown, RejectTicketFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      justification: "",
    },
  });

  const handleCancel = () => {
    if (form.formState.isDirty) {
      const confirmDiscard = window.confirm(t('common.warnings.discard_changes', '¿Estás seguro de que deseas descartar los cambios?'));
      if (!confirmDiscard) return;
    }
    onCancel();
  };

  return (
    <Card>
      <CardHeader className="gap-0">
        <CustomHeaderCard
          title={t('tickets.form.reject.header.title')}
          description={t('tickets.form.reject.header.description')}
          icon={XCircle}
        />
      </CardHeader>
      <Separator />
      <CardContent >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="form-reject-ticket" className="space-y-6">

            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('tickets.form.reject.fields.justification.label')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      autoFocus
                      placeholder={t('tickets.form.reject.fields.justification.placeholder')}
                      className="resize-none min-h-32"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
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
          onClick={handleCancel}
          className="flex-auto"
        >
          <X className="mr-2 h-4 w-4" />
          {t('common.buttons.cancel')}
        </Button>

        <Button
          type="submit"
          form="form-reject-ticket"
          variant={"destructive"}
          disabled={isPending || !form.formState.isDirty}
          className="flex-auto"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          {t('tickets.form.reject.buttons.submit')}
        </Button>
      </CardFooter>
    </Card>
  );
};