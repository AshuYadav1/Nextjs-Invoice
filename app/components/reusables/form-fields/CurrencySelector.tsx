"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Types
import { NameType } from "@/types";

type CurrencySelectorProps = {
    name: NameType;
    label?: string;
    placeholder?: string; // Added placeholder prop
};

const CurrencySelector = ({ name, label, placeholder }: CurrencySelectorProps) => {
    const { control } = useFormContext();

    return (
        <div>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between gap-5 items-center text-sm">
                            <div>
                                <FormLabel>{label}:</FormLabel>
                            </div>
                            <div>
                                {/* Fixed INR Value */}
                                <FormControl>
                                    <div className="w-[13rem] bg-gray-100 px-4 py-2 rounded text-gray-500">
                                        {placeholder || "INR (Indian Rupee)"}
                                    </div>
                                </FormControl>
                                {/* Hidden input field to ensure "INR" is submitted */}
                                <input
                                    type="hidden"
                                    {...field}
                                    value="INR"
                                    onChange={field.onChange}
                                />
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                )}
            />
        </div>
    );
};

export default CurrencySelector;
