import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Cpu, Bookmark } from "lucide-react";

const processorSchema = z.object({
    brand: z.string().min(1, "La marca es requerida"),
    model: z.string().min(1, "El modelo es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
});

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: z.infer<typeof processorSchema>) => Promise<void>;
    isSubmitting: boolean;
}

export const CreateProcessorModal = ({ isOpen, onClose, onSave, isSubmitting }: Props) => {
const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(processorSchema),
        defaultValues: { brand: "", model: "", description: "" }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        try {
            await onSave(data);
            reset();
            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-425px ">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary uppercase text-sm tracking-tighter">
                        <Cpu className="h-5 w-5" />
                        Registrar Nuevo Procesador
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-[12px] font-bold  text-black"><Bookmark className="inline h-3 w-3 mr-1" /> Marca del procesador</Label>
                        <Input {...register("brand")} className=" border-zinc-800" placeholder="Ej. Intel, AMD" />
                        {errors.brand && <p className="text-[10px] text-red-500">{errors.brand.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[12px] font-bold  text-black"><Cpu className="inline h-3 w-3 mr-1" /> Modelo</Label>
                        <Input {...register("model")} className=" border-zinc-800" placeholder="Ej. Core i7 12700K" />
                        {errors.model && <p className="text-[10px] text-red-500">{errors.model.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[12px] font-bold  text-black"> Descripción / Generación</Label>
                        <Input {...register("description")} className=" border-zinc-800" placeholder="Ej. 12va Generación" />
                        {errors.description && <p className="text-[10px] text-red-500">{errors.description.message as string}</p>}
                    </div>
                </form>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:bg-zinc-900">Cancelar</Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-blue-700 text-white font-bold">
                        {isSubmitting ? "Guardando..." : "Guardar Procesador"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};