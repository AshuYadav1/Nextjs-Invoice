"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { BaseButton, SingleItem, Subheading } from "@/app/components";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { Plus } from "lucide-react";
import { InvoiceType } from "@/types";

const Items = () => {
    const { control, setValue } = useFormContext<InvoiceType>();
    const { _t } = useTranslationContext();

    const ITEMS_NAME = "details.items";
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: ITEMS_NAME,
    });

    React.useEffect(() => {
        // Clear any initial items on component mount
        setValue(ITEMS_NAME, []);
    }, [setValue]);

    // Pre-filled data for Solar Franchise package
    const preFilledData = {
        name: "Solar Franchise Master Vendor Partner",
        description: `HSN/SAC: 9983\n\nMarketing Material:\n• 500 Visiting Cards\n• 500 Brochure\n• 1 Banner\n• 1 Standee\n• 1 Partner Authorised Certificate\n\nSample Products:\n• 1 pcs 9w Solar Street Light [AIO Module]\n• 2 pcs Solar Home Lightening System\n• 500w off-grid Kit [DIY]\n• 1 Set Solar Table Fan\n\nTrainings:\n• Online Training\n• Physical Training [Optional]`,
        quantity: 1,
        unitPrice: 140000, // 1,40,000
        total: 140000     // 1,40,000
    };

    const addNewField = () => {
        append(preFilledData);
    };

    const removeField = (index: number) => {
        remove(index);
    };

    return (
        <section className="flex flex-col gap-2 w-full">
            <Subheading>{_t("form.steps.lineItems.heading")}:</Subheading>
            {fields.length > 0 && (
                <div className="flex flex-col gap-2">
                    {fields.map((field, index) => (
                        <SingleItem
                            key={field.id}
                            name={ITEMS_NAME}
                            index={index}
                            fields={fields}
                            field={field}
                            removeField={removeField} moveFieldUp={function (index: number): void {
                                throw new Error("Function not implemented.");
                            } } moveFieldDown={function (index: number): void {
                                throw new Error("Function not implemented.");
                            } }                        />
                    ))}
                </div>
            )}
            <BaseButton
                tooltipLabel="Add Solar Franchise package"
                onClick={addNewField}
            >
                <Plus />
                {_t("Load the List  ")}
            </BaseButton>
        </section>
    );
};

export default Items;