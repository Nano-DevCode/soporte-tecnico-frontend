import { useForm, type FieldValues, type UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Hash, MapPin, Mail, AlertCircle } from "lucide-react";
import { handleBackendFormErrors } from "../utils/backendFormHandlers";
import { t } from "i18next";

const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

// 1. Convertimos el esquema en una función que se ejecute en tiempo de renderizado
const getResponsibleSchema = () => z.object({
    num_employe: z
        .string()
        .trim()
        .min(2, t("valid_responsible_num_min"))
        .max(100, t("valid_responsible_num_max"))
        .regex(/^[a-zA-Z0-9-]+$/, t("valid_responsible_num_regex")),
    name: z
        .string()
        .trim()
        .min(2, t("valid_responsible_name_min"))
        .max(50, t("valid_responsible_name_max"))
        .regex(nameRegex, t("valid_responsible_name_regex")),
    first_name: z
        .string()
        .trim()
        .min(2, t("valid_responsible_firstname_min"))
        .max(50, t("valid_responsible_firstname_max"))
        .regex(nameRegex, t("valid_responsible_name_regex")),
    last_name: z
        .string()
        .trim()
        .min(2, t("valid_responsible_lastname_min"))
        .max(50, t("valid_responsible_lastname_max"))
        .regex(nameRegex, t("valid_responsible_name_regex")),
    area: z
        .string()
        .trim()
        .min(2, t("valid_responsible_area_min"))
        .max(150, t("valid_responsible_area_max")),
    mail: z
        .string()
        .trim()
        .min(1, t("valid_responsible_mail_min")) // Cambiado a 1 para que salte si está vacío
        .email(t("valid_responsible_mail_email")),
});

// Extraemos el tipo dinámicamente si lo necesitas fuera
type ResponsibleFormValues = z.infer<ReturnType<typeof getResponsibleSchema>>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ResponsibleFormValues, setError: UseFormSetError<FieldValues>) => Promise<void | unknown>;
    isSubmitting: boolean;
}

export const CreateResponsibleModal = ({ isOpen, onClose, onSave, isSubmitting }: Props) => {
    // 2. Pasamos el esquema ejecutado en el resolver para garantizar que i18n ya esté listo
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<ResponsibleFormValues>({
        resolver: zodResolver(getResponsibleSchema()), 
        defaultValues: {
            num_employe: "",
            name: "",
            first_name: "",
            last_name: "",
            area: "",
            mail: ""
        }
    });

    const onSubmit = async (data: ResponsibleFormValues) => {
        try {
            const result = await onSave(data, setError as unknown as UseFormSetError<FieldValues>);
            if (result) {
                reset();
                onClose();
            }
        } catch (error) {
            handleBackendFormErrors({
                error,
                defaultTitle: t("ui_responsible_error_title")
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-420px max-h-[65vh] md:max-h-none flex flex-col gap-0 p-0 overflow-y-auto md:overflow-visible custom-scrollbar">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="flex gap-2 font-bold items-center text-sm md:text-base ">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        {t("ui_responsible_modal_title")}
                    </DialogTitle>
                </DialogHeader>

                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit(onSubmit)(e);
                    }} 
                    className="flex flex-col flex-1"
                >
                    <div className="flex-1 px-6 py-4 space-y-4">
                        {/* Nº Empleado */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  flex items-center gap-1 ">
                                <Hash className="h-3.5 w-3.5 text-zinc-400" /> {t("ui_responsible_num_label")}
                            </Label>
                            <Input
                                {...register("num_employe")}
                                className={errors.num_employe ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                placeholder={t("ui_responsible_num_placeholder")}
                                disabled={isSubmitting}
                            />
                            {errors.num_employe && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.num_employe.message}
                                </p>
                            )}
                        </div>

                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  ">{t("ui_responsible_name_label")}</Label>
                            <Input
                                {...register("name")}
                                className={errors.name ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                placeholder={t("ui_responsible_name_placeholder")}
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Apellido Paterno */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  ">{t("ui_responsible_firstname_label")}</Label>
                            <Input
                                {...register("first_name")}
                                className={errors.first_name ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                placeholder={t("ui_responsible_firstname_placeholder")}
                                disabled={isSubmitting}
                            />
                            {errors.first_name && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.first_name.message}
                                </p>
                            )}
                        </div>

                        {/* Apellido Materno */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  ">{t("ui_responsible_lastname_label")}</Label>
                            <Input
                                {...register("last_name")}
                                className={errors.last_name ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                placeholder={t("ui_responsible_lastname_placeholder")}
                                disabled={isSubmitting}
                            />
                            {errors.last_name && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.last_name.message}
                                </p>
                            )}
                        </div>

                        {/* Área */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  flex items-center gap-1 ">
                                <MapPin className="h-3.5 w-3.5 text-zinc-400" /> {t("ui_responsible_area_label")}
                            </Label>
                            <Input
                                {...register("area")}
                                className={errors.area ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                placeholder={t("ui_responsible_area_placeholder")}
                                disabled={isSubmitting}
                            />
                            {errors.area && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.area.message}
                                </p>
                            )}
                        </div>

                        {/* Correo */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  flex items-center gap-1 ">
                                <Mail className="h-3.5 w-3.5 text-zinc-400" /> {t("ui_responsible_mail_label")}
                            </Label>
                            <Input
                                {...register("mail")}
                                className={errors.mail ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                placeholder={t("ui_responsible_mail_placeholder")}
                                disabled={isSubmitting}
                            />
                            {errors.mail && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.mail.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-4 border-t flex flex-row justify-end gap-2 mt-auto">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose} 
                            className="text-zinc-500 hover:text-zinc-700" 
                            disabled={isSubmitting}
                        >
                            {t("ui_btn_cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors"
                        >
                            {isSubmitting ? t("ui_responsible_saving") : t("ui_responsible_save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};