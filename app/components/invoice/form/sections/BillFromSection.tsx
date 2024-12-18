"use client";

// RHF
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

// Components
import { FormInput, Subheading } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const BillFromSection = () => {
  const { setValue } = useFormContext();

  const { _t } = useTranslationContext();

  // Pre-filled data
  const prefilledData = {
    sender: {
      name: "Vital Force Technologies Pvt Ltd",
      address:
        "F st Floor Zoom Plaza Gorai Borivali (w) Below Maxus Cinema Mumbai ,Maharashtra India ",
      zipCode: "400092",
      city: "Mumbai",
      email: "accounts@vftechpvtltd.com",
      phone: "+91 8097760128",
      gst: "27AAJCV9431E1Z3",
      pan: "AAJCV9431E",
    },
  };

  useEffect(() => {
    // Set pre-filled values for regular inputs
    setValue("sender.name", prefilledData.sender.name);
    setValue("sender.address", prefilledData.sender.address);
    setValue("sender.zipCode", prefilledData.sender.zipCode);
    setValue("sender.city", prefilledData.sender.city);
    setValue("sender.email", prefilledData.sender.email);
    setValue("sender.phone", prefilledData.sender.phone);
    //Set pre filled values for GST and PAN
    setValue("sender.gst", prefilledData.sender.gst);
    setValue("sender.pan", prefilledData.sender.pan);
  }, [setValue]);

  return (
    <section className="flex flex-col gap-3">
      <Subheading>{_t("form.steps.fromAndTo.billFrom")}:</Subheading>

      <FormInput
        name="sender.name"
        label={_t("form.steps.fromAndTo.name")}
        placeholder="Your name"
      />
      <FormInput
        name="sender.address"
        label={_t("form.steps.fromAndTo.address")}
        placeholder="Your address"
      />
      <FormInput
        name="sender.zipCode"
        label={_t("form.steps.fromAndTo.zipCode")}
        placeholder="Your zip code"
      />
      <FormInput
        name="sender.city"
        label={_t("form.steps.fromAndTo.city")}
        placeholder="Your city"
      />
      <FormInput
        name="sender.email"
        label={_t("form.steps.fromAndTo.email")}
        placeholder="Your email"
      />
      <FormInput
        name="sender.phone"
        label={_t("form.steps.fromAndTo.phone")}
        placeholder="Your phone number"
      />
      <FormInput
        name="sender.gst"
        label="GST"
        placeholder="Your GST Number"
      />
      <FormInput
        name="sender.pan"
        label="PAN"
        placeholder="Your PAN Number"
      />
    </section>
  );
};

export default BillFromSection;