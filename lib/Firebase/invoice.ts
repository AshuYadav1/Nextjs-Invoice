// utils/invoice.ts

import { getStorage, ref, listAll } from "firebase/storage";
import { app } from "lib/Firebase/firebase_config"; // Import the initialized app instance

const storage = getStorage(app);

async function generateInvoiceNumber(): Promise<string> {  // Changed return type to string
  try {
    // 1. Get Reference to PDF Folder
    const storageRef = ref(storage, 'pdfs'); // Replace 'pdf' with your folder name

    // 2. List All Files in the Folder
    const pdfFiles = await listAll(storageRef);

    // 3. Filter for PDF files and Count
    const pdfCount = pdfFiles.items.filter(item => item.name.endsWith('.pdf')).length;

    // 4. Generate Invoice Number
    const newInvoiceNumber = pdfCount + 1;
    const prefixedInvoiceNumber = `INV-${newInvoiceNumber}`; // Add the "INV-" prefix
    return prefixedInvoiceNumber;
  } catch (error) {
    console.error("Error fetching PDF count:", error);
    return "INV-1"; //return "INV-1" on error
  }
}

export default generateInvoiceNumber;