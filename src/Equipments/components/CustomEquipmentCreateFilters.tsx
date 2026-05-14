import { memo, useEffect, useState } from "react";
import {  Laptop, Printer, Network, Box, type LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEquipmentTypesAction } from "../actions/get-equipmentType.action";


const ICON_MAP: Record<string, LucideIcon> = {
    computadora: Laptop,
    impresora: Printer,
    red: Network,
    default: Box
};

// Definimos qué props acepta el componente
interface Props {
    onSelect: (id: string, name: string) => void;
    defaultValue?: string;
}

export const CustomEquipmentCreateFilters = memo(({ onSelect, defaultValue }: Props) => {
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [selectedValue, setSelectedValue] = useState(defaultValue || "");

    useEffect(() => {
        getEquipmentTypesAction().then(setCategories);
    }, []);

    const handleChange = (nameValue: string) => {
        setSelectedValue(nameValue);
        // Buscamos el objeto completo para obtener el ID
        const category = categories.find(c => c.name.toLowerCase() === nameValue);
        if (category) {
            onSelect(category.id, category.name.toLowerCase());
        }
    };

    return (
        <Select value={selectedValue} onValueChange={handleChange}>
            <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Selecciona un tipo de equipo" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((cat) => {
                    const Icon = ICON_MAP[cat.name.toLowerCase()] || ICON_MAP.default;
                    return (
                        <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="capitalize">{cat.name}</span>
                            </div>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
});