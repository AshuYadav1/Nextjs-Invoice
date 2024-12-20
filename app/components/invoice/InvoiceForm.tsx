"use client";

import { useMemo, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// React Wizard
import { Wizard } from "react-use-wizard";

// Components
import {
    WizardStep,
    BillFromSection,
    BillToSection,
    InvoiceDetails,
    Items,
    InvoiceSummary,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";
import generateInvoiceNumber from "lib/Firebase/invoice"; // Import the invoice number generator

const InvoiceForm = () => {
    const { _t } = useTranslationContext();
    const { control, setValue } = useFormContext(); // Get setValue
    const [loading, setLoading] = useState(true);


    // Get invoice number variable
    const invoiceNumber = useWatch({
        name: "details.invoiceNumber",
        control,
    });

    const invoiceNumberLabel = useMemo(() => {
        if (invoiceNumber) {
            return `#${invoiceNumber}`;
        } else {
            return _t("form.newInvBadge");
        }
    }, [invoiceNumber, _t]);

    useEffect(() => {
      const fetchAndSetInvoiceNumber = async () => {
        try{
          const newInvoiceNumber = await generateInvoiceNumber();
          setValue("details.invoiceNumber", newInvoiceNumber);
          
        }catch (error){
          console.error("Failed to fetch and set invoice number:", error);
        }finally{
          setLoading(false);
        }
      };
      
    fetchAndSetInvoiceNumber();
    }, [setValue]);

    if (loading) {
        return <div>Loading Invoice form</div>; // Display a loading state
    }
    

    return (
        <div className={`xl:w-[55%]`}>
            <Card>
                <CardHeader>
                    <div className="flex gap-3">
                        <CardTitle className="flex items-center gap-3">
                            <span className="uppercase">
                                {_t("form.title")}
                            </span>
                        </CardTitle>
                        <Badge variant="secondary" className="w-fit">
                            <p style={{ fontSize: "14px" }}>
                                {invoiceNumberLabel}
                            </p>
                        </Badge>
                    </div>
                    <CardDescription>{_t("form.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <Wizard>
                            <WizardStep>
                                <div className="flex flex-wrap gap-x-20 gap-y-10">
                                    <BillFromSection />
                                    <BillToSection />
                                </div>
                            </WizardStep>
                            <WizardStep>
                                <div className="flex flex-wrap gap-y-10">
                                    <InvoiceDetails />
                                </div>
                            </WizardStep>
                            <WizardStep>
                                <Items />
                            </WizardStep>
                            <WizardStep>
                                <InvoiceSummary />
                            </WizardStep>
                        </Wizard>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;