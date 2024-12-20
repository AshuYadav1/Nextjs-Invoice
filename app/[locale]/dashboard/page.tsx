'use client';

import React, { useState, useEffect } from 'react';
import { File, Filter, Search } from 'lucide-react';
import { listAll, ref, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage } from 'lib/Firebase/firebasestorage';

interface PdfDocument {
    id: string; // Use unique id
    name: string;
    number: string;
    date: string;
    user: string;
    url: string;
}

export default function PdfDashboard() {
    const [pdfList, setPdfList] = useState<PdfDocument[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPdfs = async () => {
            setLoading(true);
            setError(null);
            try {
                const pdfsRef = ref(storage, 'pdfs'); // Assuming your PDFs are in a "pdfs" folder
                const result = await listAll(pdfsRef);
                const pdfs = await Promise.all(
                    result.items.map(async (item, index) => {

                        const metadata = await getMetadata(item)
                        
                      const downloadUrl = await getDownloadURL(item);
                         return {
                            id:  `${index}`, // Use the item index as the id
                            name: metadata.name || 'Unknown Name', // Get filename from metadata or show a default name
                            number:  '2024-00' + index,  // You can generate number
                            date: metadata.timeCreated, // use created time for date
                            user: 'Admin user', // you can hard code or extract from metadata if required
                             url: downloadUrl,
                        } as PdfDocument;
                    })
                );
                setPdfList(pdfs);
            } catch (err) {
                console.error('Error fetching PDFs from Storage:', err);
                setError('Failed to load PDFs. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPdfs();
    }, []);

    // Filter logic
    const filteredPdfs = pdfList.filter(pdf =>
        (filter === '' || pdf.number.startsWith(filter)) &&
        (searchTerm === '' ||
            pdf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pdf.user.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleViewPdf = (url: string) => {
        setSelectedPdfUrl(url);
    };

    if (loading) {
        return <div className="text-center py-4">Loading PDFs...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">PDF Documents</h1>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Filter by Number"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search PDFs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Number</th>
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">User</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                             {filteredPdfs.length > 0 ? (
                                filteredPdfs.map((pdf) => (
                                    <tr key={pdf.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            <div className="flex items-center">
                                                <File className="mr-2 text-blue-500" size={20} />
                                                <span className="font-medium">{pdf.number}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-left">{pdf.name}</td>
                                        <td className="py-3 px-6 text-left">{pdf.date}</td>
                                        <td className="py-3 px-6 text-left">{pdf.user}</td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                                onClick={() => handleViewPdf(pdf.url)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        No PDFs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                    Total PDFs: {filteredPdfs.length} / {pdfList.length}
                </div>
            </div>

            {selectedPdfUrl && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-md w-4/5 h-4/5 relative">
                        <button onClick={() => setSelectedPdfUrl(null)} className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 px-2 rounded">X</button>
                        <iframe src={selectedPdfUrl} width="100%" height="100%" title="PDF Viewer" />
                    </div>
                </div>
             )}
        </div>
    );
}