import React, { useState, useId } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface CustomComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>; 
}

export const CustomCombobox = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  emptyText = "No hay resultados",
  disabled = false,
  ref 
}: CustomComboboxProps) => {

  const [open, setOpen] = useState(false);

  const listId = useId();

  const selectedLabel = value 
    ? options.find((opt) => opt.value === value)?.label 
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open} 
          aria-controls={listId} 
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandList id={listId}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false); 
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      opt.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CustomCombobox.displayName = "CustomCombobox";