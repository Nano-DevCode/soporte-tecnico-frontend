// components/CustomFilterSelect.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface Option {
    value: string;
    label: string;
}

interface Props {
    label: string;
    defaultValue: string;
    options?: Option[];
    isLoading?: boolean;
    onChange: (value: string) => void;
}

export const CustomFilterSelect = ({ label, defaultValue, options = [], isLoading, onChange }: Props) => {
    const { t } = useTranslation();

    return (
        <Select value={defaultValue} disabled={isLoading} onValueChange={onChange}>
            <SelectTrigger className="flex-1 w-full">
                <div className="line-clamp-1">
                    <span className="text-muted-foreground mr-2">{label}:</span>
                    <SelectValue />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t("common.filters.status.options.all")}</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};