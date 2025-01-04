import { NextRequest } from "next/server";
import { generatePdfService } from "@/services/invoice/server/generatePdfService";
import { getInvoiceTemplate } from "@/lib/helpers";
import { InvoiceType } from "@/types";
import ReactDOMServer from "react-dom/server";

export async function POST(req: NextRequest) {
    let body: InvoiceType = await req.json();
    const templateId = body.details.pdfTemplate;
    const InvoiceTemplate = await getInvoiceTemplate(templateId);

    const htmlTemplate = ReactDOMServer.renderToStaticMarkup(
        InvoiceTemplate(body)
    );

    const result = await generatePdfService(htmlTemplate, body);
    return result;
}