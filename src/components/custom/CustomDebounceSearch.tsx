// components/custom/CustomDebouncedSearch.tsx
import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Props {
    placeholder?: string;
    defaultValue?: string;
    onSearch: (searchTerm: string) => void;
    delay?: number;
    className?: string | undefined;
    totalData?: number
    isLoadingData?: boolean
}

export const CustomDebouncedSearch = ({
    placeholder,
    defaultValue = "",
    onSearch,
    delay = 600,
    className,
    totalData,
    isLoadingData,
}: Props) => {

    const [localValue, setLocalValue] = useState(defaultValue);
    const { t } = useTranslation();
    const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);

    if (defaultValue !== prevDefaultValue) {
        setPrevDefaultValue(defaultValue);
        setLocalValue(defaultValue);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== defaultValue) {
                onSearch(localValue);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [localValue, defaultValue, delay, onSearch]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(localValue);
    };

    return (
        <form onSubmit={handleSubmit}
            className={cn(
                "flex-1 min-w-50",
                className
            )}>
            <InputGroup>
                <InputGroupInput
                    name="searchBar"
                    placeholder={placeholder || t('common.filters.search')}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                {(totalData != null || totalData != undefined) &&
                    <InputGroupAddon align={"inline-end"}>
                        {isLoadingData
                            ? <Loader2 className="animate-spin" />
                            : t('common.list.totalData', { totalData })}
                    </InputGroupAddon>
                }
            </InputGroup>
            <button type="submit" className="sr-only">Buscar</button>
        </form>
    );
};