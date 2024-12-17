// pages/api/pdfs.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma';  // Adjusted to remove the .ts extension


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const pdfDocuments = await prisma.pdfDocument.findMany({
        orderBy: {
          uploadedAt: 'desc'
        }
      });
      res.status(200).json(pdfDocuments);
    } catch (error) {
      console.error('Request error', error);
      res.status(500).json({ error: 'Error fetching PDF documents' });
    }
  } else if (req.method === 'POST') {
    try {
      const newPdfDocument = await prisma.pdfDocument.create({
        data: {
          name: req.body.name,
          number: req.body.number,
          date: req.body.date,
          user: req.body.user
        }
      });
      res.status(201).json(newPdfDocument);
    } catch (error) {
      console.error('Request error', error);
      res.status(500).json({ error: 'Error creating PDF document' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
