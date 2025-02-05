import chromium from "@sparticuz/chromium";
import { ENV, TAILWIND_CDN } from "@/lib/variables";
import { NextRequest, NextResponse } from "next/server";
import { InvoiceType } from "@/types"; // Import InvoiceType

// Create a database interface that matches your existing types
interface InvoiceDatabaseEntry {
    id?: string;
    invoiceNumber: string;
    pdfContent: Buffer;
    filename: string;
    createdAt: Date;
    
    // Extract relevant details from the invoice
    senderName: string;
    receiverName: string;
    totalAmount: number;
    currency: string;
}

// Mock database service (replace with your actual database logic)
class DatabaseService {
    static async saveInvoicePdf(invoiceData: InvoiceDatabaseEntry) {
        // Placeholder for actual database save logic
        // This could be Prisma, MongoDB, PostgreSQL, etc.
        console.log('Saving invoice PDF to database:', invoiceData);
        
        // Simulate database save - return a mock ID
        return {
            id: `invoice-${Date.now()}`,
            ...invoiceData
        };
    }
}

// Function to launch browser correctly in prod and dev
async function launchBrowser() {
    let browser;

    if (ENV === "production") {
        const puppeteer = await import("puppeteer-core");
        
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: true,
                ignoreHTTPSErrors: true,
            });
    } else {
        const puppeteer = await import("puppeteer");
    
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: "new",
            });
    }

    if (!browser) {
        throw new Error("Failed to launch browser");
    }

    return browser;
}

export async function generatePdfService(htmlTemplate: string, body: InvoiceType) { //  added InvoiceType here
    let browser;

    try {

        
        // Browser launch logic remains the same
        browser = await launchBrowser();

        if (!browser) {
            throw new Error("Failed to launch browser");
        }

        const page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(htmlTemplate, {
            waitUntil: "networkidle0",
        });

        // Add Tailwind CSS
        await page.addStyleTag({
            url: TAILWIND_CDN,
        });

        // Generate the PDF
        const pdf: Buffer = await page.pdf({
            format: "a4",
            printBackground: true,
        });

        // Close browser pages and browser
        for (const page of await browser.pages()) {
            await page.close();
        }
        await browser.close();

        // Prepare database entry
        const invoiceDatabaseEntry: InvoiceDatabaseEntry = {
            invoiceNumber: body.details.invoiceNumber,
            pdfContent: pdf,
            filename: `invoice-${body.details.invoiceNumber}.pdf`,
            createdAt: new Date(),
            senderName: body.sender.name,
            receiverName: body.receiver.name,
            totalAmount: body.details.items.reduce((sum, item: InvoiceType['details']['items'][number]) => sum + item.total, 0 as number),
            currency: body.details.currency
        };
    
        // Save PDF to database
        const savedInvoice = await DatabaseService.saveInvoicePdf(invoiceDatabaseEntry);

        // Create a Blob from the PDF data
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
        console.error(error);

        // Return an error response
        return new NextResponse(`Error generating PDF: \n${error}`, {
            status: 500,
        });
    } finally {
        if (browser) {
             await browser.close();
        }
    }
}