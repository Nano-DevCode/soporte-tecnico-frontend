// components/CreateProcessorModal.tsx
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

const processorSchema = z.object({
    brand: z
        .string()
        .trim()
        .min(2, "La marca es requerida mínimo 2 caracteres")
        .max(200, "Máximo 50 caracteres"),
    model: z
        .string()
        .trim()
        .min(2, "El modelo es requerido mínimo 2 caracteres")
        .max(200, "Máximo 90 caracteres"),
    description: z
        .string()
        .trim()
        .min(2, "La descripción es requerida mínimo 2 caracteres")
        .max(200, "Máximo 150 caracteres"),
});

type ProcessorFormValues = z.infer<typeof processorSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    // Tipamos onSave para esperar que devuelva opcionalmente el objeto procesador creado
    onSave: (data: ProcessorFormValues, setError: UseFormSetError<FieldValues>) => Promise<void> | Record<string, unknown>;
    isSubmitting: boolean;
}

export const CreateProcessorModal = ({ isOpen, onClose, onSave, isSubmitting }: Props) => {
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<ProcessorFormValues>({
        resolver: zodResolver(processorSchema),
        defaultValues: { brand: "", model: "", description: "" }
    });

    const onSubmit = async (data: ProcessorFormValues) => {
        try {
            // Pasamos los datos al contenedor padre para persistir en BD
            await onSave(data, setError as UseFormSetError<FieldValues>);
            reset();
            onClose();
        } catch (error) {
            // Mapea los errores del class-validator directamente a los inputs correspondientes del modal
            handleBackendFormErrorsEq(error, setError as UseFormSetError<FieldValues>, {
                onGlobalError: (globalMessage) => {
                    sileo.error({
                        title: "Error al crear procesador",
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
                    <DialogTitle className="flex gap-2 font-bold items-center text-primary uppercase text-sm tracking-tighter">
                        <Cpu className="h-5 w-5 text-blue-400" />
                        Registrar Nuevo Procesador
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 py-4">
                        
                        {/* Marca */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                <Bookmark className="h-3 w-3 text-zinc-400" /> Marca del procesador
                            </Label>
                            <Input 
                                {...register("brand")} 
                                className={errors.brand ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""} 
                                placeholder="Ej. Intel, AMD" 
                            />
                            {errors.brand && (
                                <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.brand.message}
                                </p>
                            )}
                        </div>

                        {/* Modelo */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                <Cpu className="h-3 w-3 text-zinc-400" /> Modelo
                            </Label>
                            <Input 
                                {...register("model")} 
                                className={errors.model ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""} 
                                placeholder="Ej. Core i7 12700K" 
                            />
                            {errors.model && (
                                <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.model.message}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 text-zinc-400" /> Descripción / Generación
                            </Label>
                            <Input 
                                {...register("description")} 
                                className={errors.description ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""} 
                                placeholder="Ej. 12va Generación" 
                            />
                            {errors.description && (
                                <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} className="shrink-0" /> {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400" disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Procesador"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};