import { useForm, type FieldValues, type UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Cpu, Bookmark, AlertCircle } from "lucide-react";
import { handleBackendFormErrorsEq } from "../utils/backendFormHandlers";
import { sileo } from "sileo";
import { t } from "i18next";

// 1. Convertimos el esquema en una función dinámica
const getProcessorSchema = () => z.object({
    brand: z
        .string()
        .trim()
        .min(2, t("valid_processor_brand_min"))
        .max(50, t("valid_processor_brand_max")),
    model: z
        .string()
        .trim()
        .min(2, t("valid_processor_model_min"))
        .max(90, t("valid_processor_model_max")),
    description: z
        .string()
        .trim()
        .min(2, t("valid_processor_desc_min"))
        .max(150, t("valid_processor_desc_max")),
});

// Inferimos el tipo dinámicamente usando el retorno de la función
type ProcessorFormValues = z.infer<ReturnType<typeof getProcessorSchema>>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProcessorFormValues, setError: UseFormSetError<FieldValues>) => Promise<void | unknown>;
    isSubmitting: boolean;
}

export const CreateProcessorModal = ({ isOpen, onClose, onSave, isSubmitting }: Props) => {
    // 2. Ejecutamos la función dentro del resolver de React Hook Form
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<ProcessorFormValues>({
        resolver: zodResolver(getProcessorSchema()),
        defaultValues: { brand: "", model: "", description: "" }
    });

    const onSubmit = async (data: ProcessorFormValues, e?: React.BaseSyntheticEvent) => {
        if (e) e.stopPropagation();
        
        try {
            const result = await onSave(data, setError as UseFormSetError<FieldValues>);
            
            if (result) {
                reset();
                onClose();
            }
        } catch (error) {
            handleBackendFormErrorsEq(error, setError as UseFormSetError<FieldValues>, {
                onGlobalError: (globalMessage) => {
                    sileo.error({
                        title: t("ui_processor_error_title"),
                        description: globalMessage,
                        duration: 6000,
                    });
                }
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-500px">
                <DialogHeader>
                    <DialogTitle className="flex gap-2 font-bold items-center text-sm md:text-base ">
                        <Cpu className="h-5 w-5 text-blue-600" />
                        {t("ui_processor_modal_title")}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit(onSubmit)(e);
                }}>
                    <div className="space-y-4 py-4">
                        {/* Marca */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  flex items-center gap-1">
                                <Bookmark className="h-3 w-3 text-zinc-400" /> {t("ui_processor_brand_label")}
                            </Label>
                            <Input 
                                {...register("brand")} 
                                className={errors.brand ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""} 
                                placeholder={t("ui_processor_brand_placeholder")} 
                                disabled={isSubmitting}
                            />
                            {errors.brand && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.brand.message}
                                </p>
                            )}
                        </div>

                        {/* Modelo */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  flex items-center gap-1">
                                <Cpu className="h-3 w-3 text-zinc-400" /> {t("ui_processor_model_label")}
                            </Label>
                            <Input 
                                {...register("model")} 
                                className={errors.model ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""} 
                                placeholder={t("ui_processor_model_placeholder")} 
                                disabled={isSubmitting}
                            />
                            {errors.model && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.model.message}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold  flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 text-zinc-400" /> {t("ui_processor_desc_label")}
                            </Label>
                            <Input 
                                {...register("description")} 
                                className={errors.description ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""} 
                                placeholder={t("ui_processor_desc_placeholder")} 
                                disabled={isSubmitting}
                            />
                            {errors.description && (
                                <p className="text-[11px] text-red-500 font-semibold  flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-500 hover:text-zinc-700" disabled={isSubmitting}>
                            {t("ui_btn_cancel")}
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors"
                        >
                            {isSubmitting ? t("ui_processor_saving") : t("ui_processor_save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};