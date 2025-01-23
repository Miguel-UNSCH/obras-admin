"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/buttons/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectProps } from "@radix-ui/react-select";

export interface GenericSelectProps extends SelectProps {
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string | null) => void;
  placeholder: string;
  value?: string;
}

export const Combobox = React.forwardRef<HTMLButtonElement, GenericSelectProps>(
  ({ options, placeholder, onChange, value }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="max-w-[var(--radix-popover-trigger-width)] justify-between min-w-[250px] bg-background border-radius overflow-hidden"
            onClick={() => setOpen(!open)}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0"
        >
          <Command>
            <CommandInput
              className="p-2 my-2 border-0 ring-1 ring-border border-border focus:ring-primary space-x-4"
              placeholder={`Búsqueda`}
              value={inputValue}
              onValueChange={(value) => setInputValue(value)}
            />
            <CommandList
              key={filteredOptions.map((option) => option.value).join(",")}
            >
              {filteredOptions.length === 0 ? (
                <CommandEmpty>No hay coincidencias.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onChange?.(option.value);
                        setOpen(false);
                        setInputValue("");
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = "Combobox";
