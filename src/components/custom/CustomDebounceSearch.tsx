// components/custom/CustomDebouncedSearch.tsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useTranslation } from "react-i18next";

interface Props {
    placeholder?: string;
    defaultValue?: string;
    onSearch: (searchTerm: string) => void;
    delay?: number;
}

export const CustomDebouncedSearch = ({
    placeholder,
    defaultValue = "",
    onSearch,
    delay = 600
}: Props) => {

    const [localValue, setLocalValue] = useState(defaultValue);
    const { t } = useTranslation();

    useEffect(() => {
        setLocalValue(defaultValue);
    }, [defaultValue]);

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
        <form onSubmit={handleSubmit} className="flex-1 w-full">
            <InputGroup>
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupInput
                    name="searchBar"
                    placeholder={placeholder || t('common.filters.search')}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                />
            </InputGroup>
            <button type="submit" className="sr-only">Buscar</button>
        </form>
    );
};