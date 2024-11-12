// pages/index.js
import { PDFDocument } from 'pdf-lib';
import { useState } from 'react';

const Home = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const mergePDFs = async () => {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Load each PDF file
    const pdfDocs = await Promise.all(
      Array.from(files).map(async (file) => {
        const bytes = await file.arrayBuffer();
        return await PDFDocument.load(bytes);
      })
    );

    // Copy pages from each PDF into the merged document
    for (const pdfDoc of pdfDocs) {
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save the merged PDF
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a link to download the merged PDF
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>PDF Merger</h1>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={mergePDFs} disabled={files.length === 0}>
        Merge PDFs
      </button>
    </div>
  );
};

export default Home;