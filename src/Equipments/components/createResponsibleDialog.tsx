
import { useForm, type FieldValues, type UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Hash, MapPin, Mail, AlertCircle } from "lucide-react";
import { handleBackendFormErrors} from "../utils/backendFormHandlers";

const responsibleSchema = z.object({
    num_employe: z
        .string()
        .trim()
        .min(2, "El número de empleado es requerido minímo 2 caracteres")
        .max(100,"Máximo 100 caracteres")
        .regex(/^[a-zA-Z0-9-]+$/, "Solo se permiten letras, números y guiones"),
    name: z
        .string()
        .trim()
        .min(2, "El nombre es requerido minímo 2 caracteres")
        .max(120, "Máximo 50 caracteres")
        .regex(/^[a-zA-Z]+$/, "Solo se permiten letras"),
    first_name: z
        .string()
        .trim()
        .min(2, "El apellido paterno es requerido minímo 2 caracteres")
        .max(120, "Máximo 50 caracteres")
        .regex(/^[a-zA-Z]+$/, "Solo se permiten letras"),
    last_name: z
        .string()
        .trim()
        .min(2, "El apellido materno es requerido minímo 2 caracteres")
        .max(120, "Máximo 50 caracteres")
        .regex(/^[a-zA-Z]+$/, "Solo se permiten letras"),
    area: z
        .string()
        .trim()
        .min(2, "El área es requerida minímo 2 caracteres")
        .max(150,"Máximo 150 caracteres"),
    mail: z
        .string()
        .trim()
        .min(2, "El correo es requerido")
        .email("Escribe una dirección de correo válida"),
});

type ResponsibleFormValues = z.infer<typeof responsibleSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ResponsibleFormValues, setError: UseFormSetError<FieldValues>) => Promise<void>;
    isSubmitting: boolean;
}

export const CreateResponsibleModal = ({
    isOpen,
    onClose,
    onSave,
    isSubmitting
}: Props) => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<ResponsibleFormValues>({
        resolver: zodResolver(responsibleSchema),
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
            await onSave(data, setError as UseFormSetError<FieldValues>);
            reset();
            onClose();
        } catch (error) {
            handleBackendFormErrors({
                error,
                defaultTitle: "Error al crear responsable"
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-400px max-h-[60vh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex gap-2 font-bold items-center">
                        <UserPlus className="h-5 w-5 text-blue-400" />
                        REGISTRAR NUEVO RESPONSABLE
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                    
                    <div className="flex-1 overflow-y-auto px-6 py-2 max-h-[60vh] sm:max-h-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">

                            {/* Número de Empleado */}
                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                    <Hash className="h-3 w-3 text-zinc-400" /> Nº Empleado
                                </Label>
                                <Input
                                    {...register("num_employe")}
                                    className={errors.num_employe ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                    placeholder="Ej. EMP-202601"
                                />
                                {errors.num_employe && (
                                    <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} className="shrink-0" /> {errors.num_employe.message}
                                    </p>
                                )}
                            </div>
                            {/* Nombre */}
                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-bold uppercase">Nombre(s)</Label>
                                <Input
                                    {...register("name")}
                                    className={errors.name ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                    placeholder="Ej. Juan Carlos"
                                />
                                {errors.name && (
                                    <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} className="shrink-0" /> {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Apellido Paterno */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase">Apellido Paterno</Label>
                                <Input
                                    {...register("first_name")}
                                    className={errors.first_name ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                    placeholder="Ej. Pérez"
                                />
                                {errors.first_name && (
                                    <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} className="shrink-0" /> {errors.first_name.message}
                                    </p>
                                )}
                            </div>

                            {/* Apellido Materno */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase">Apellido Materno</Label>
                                <Input
                                    {...register("last_name")}
                                    className={errors.last_name ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                    placeholder="Ej. Gómez"
                                />
                                {errors.last_name && (
                                    <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} className="shrink-0" /> {errors.last_name.message}
                                    </p>
                                )}
                            </div>

                            {/* Área */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-zinc-400" /> Área
                                </Label>
                                <Input
                                    {...register("area")}
                                    className={errors.area ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                    placeholder="Sistemas, RH, Finanzas..."
                                />
                                {errors.area && (
                                    <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} className="shrink-0" /> {errors.area.message}
                                    </p>
                                )}
                            </div>

                            {/* Correo */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-zinc-400" /> Correo Electrónico
                                </Label>
                                <Input
                                    {...register("mail")}
                                    className={errors.mail ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : ""}
                                    placeholder="ejemplo@empresa.com"
                                />
                                {errors.mail && (
                                    <p className="text-[10px] text-red-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} className="shrink-0" /> {errors.mail.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-4 border-t border-zinc-100 bg-zinc-50/50 gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400" disabled={isSubmitting}>
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Responsable"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
