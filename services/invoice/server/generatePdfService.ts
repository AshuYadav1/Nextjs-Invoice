import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import { getInvoiceTemplate } from "@/lib/helpers";
import { CHROMIUM_EXECUTABLE_PATH, ENV, TAILWIND_CDN } from "@/lib/variables";
import { InvoiceType } from "@/types";

// Database interface - (same as in your code)
interface InvoiceDatabaseEntry {
    id?: string;
    invoiceNumber: string;
    pdfContent: Buffer;
    filename: string;
    createdAt: Date;
    senderName: string;
    receiverName: string;
    totalAmount: number;
    currency: string;
}

class DatabaseService {
    // (Same as in your code)
    static async saveInvoicePdf(invoiceData: InvoiceDatabaseEntry) {
        console.log('Saving invoice PDF to database:', invoiceData);
        return {
            id: `invoice-${Date.now()}`,
            ...invoiceData
        };
    }
}

export async function generatePdfService(req: NextRequest) {
    let browser;
    let body: InvoiceType;

    try {
         body = await req.json();
         const ReactDOMServer = (await import("react-dom/server")).default;

         const templateId = body.details.pdfTemplate;
         const InvoiceTemplate = await getInvoiceTemplate(templateId);
         const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
             InvoiceTemplate(body)
         );


        // Launch browser
        if (ENV === "production") {
            const puppeteer = await import("puppeteer-core");
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(
                    CHROMIUM_EXECUTABLE_PATH
                ),
                headless: true,
                ignoreHTTPSErrors: true,
            });
        } else if (ENV === "development") {
            const puppeteer = await import("puppeteer");
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: "new",
            });
        }
        if (!browser) {
            throw new Error("Failed to launch browser");
        }
        const page = await browser.newPage();


         await page.setContent(await htmlTemplate, {
             waitUntil: "networkidle0",
         });

         await page.addStyleTag({
            url: TAILWIND_CDN,
        });

         // Generate the PDF
        const pdf = await page.pdf({
            format: "a4",
            printBackground: true,
        });


         // Prepare database entry
         const invoiceDatabaseEntry: InvoiceDatabaseEntry = {
            invoiceNumber: body.details.invoiceNumber,
            pdfContent: pdf,
            filename: `invoice-${body.details.invoiceNumber}.pdf`,
            createdAt: new Date(),
            senderName: body.sender.name,
            receiverName: body.receiver.name,
            totalAmount: body.details.items.reduce((sum, item) => sum + item.total, 0),
            currency: body.details.currency
        };

        // Save PDF to database
        await DatabaseService.saveInvoicePdf(invoiceDatabaseEntry);

        const pdfBlob = new Blob([pdf], { type: "application/pdf" });


        const response = new NextResponse(pdfBlob, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=${invoiceDatabaseEntry.filename}`,
            },
             status: 200,
        });
        return response;

    } catch (error) {
        console.error("Error generating PDF:", error);
        return new NextResponse(`Error generating PDF: ${error}`, {
            status: 500,
        });
    } finally {
        // Ensure browser and page close gracefully, even if an error occurred
        if (browser) {
            try{
               for (const page of await browser.pages()) {
                   await page.close();
               }
                 await browser.close();
           }
           catch (closeError){
                 console.error("error closing browser")
           }

        }
    }
}