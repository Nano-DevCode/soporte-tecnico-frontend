import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Hash, MapPin, Mail } from "lucide-react";

// Esquema de validación para los 6 campos
const responsibleSchema = z.object({
    num_employe: z.string().min(1, "Requerido"),
    name: z.string().min(1, "Requerido"),
    first_name: z.string().min(1, "Requerido"),
    last_name: z.string().min(1, "Requerido"),
    area: z.string().min(1, "Requerido"),
    mail: z.string().email("Correo inválido"),
});

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: z.infer<typeof responsibleSchema>) => Promise<void>;
    isSubmitting: boolean;
}

export const CreateResponsibleModal = ({ isOpen, onClose, onSave, isSubmitting }: Props) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(responsibleSchema)
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        try {
            // IMPORTANTE: onSave debe ser la mutación del hook que devuelve el nuevo item
            await onSave(data);
            reset();
            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-500px bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                        <UserPlus className="h-5 w-5" />
                        REGISTRAR NUEVO RESPONSABLE
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                    {/* Número de Empleado */}
                    <div className="col-span-2 space-y-2">
                        <Label className="text-xs font-bold uppercase"><Hash className="inline h-3 w-3 mr-1" /> Nº Empleado</Label>
                        <Input {...register("num_employe")} className="bg-zinc-900 border-zinc-800" placeholder="Ej. 2024001" />
                        {errors.num_employe && <p className="text-[10px] text-red-500 uppercase">{errors.num_employe.message as string}</p>}
                    </div>

                    {/* Nombre y Apellidos */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase">Nombre</Label>
                        <Input {...register("name")} className="bg-zinc-900 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase">A. Paterno</Label>
                        <Input {...register("first_name")} className="bg-zinc-900 border-zinc-800" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label className="text-xs font-bold uppercase">A. Materno</Label>
                        <Input {...register("last_name")} className="bg-zinc-900 border-zinc-800" />
                    </div>

                    {/* Área y Mail */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase"><MapPin className="inline h-3 w-3 mr-1" /> Área</Label>
                        <Input {...register("area")} className="bg-zinc-900 border-zinc-800" placeholder="Sistemas, RH..." />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase"><Mail className="inline h-3 w-3 mr-1" /> Correo</Label>
                        <Input {...register("mail")} className="bg-zinc-900 border-zinc-800" placeholder="usuario@correo.com" />
                    </div>
                </form>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="text-zinc-400">Cancelar</Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary text-white font-bold">
                        {isSubmitting ? "Guardando..." : "Guardar Responsable"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};