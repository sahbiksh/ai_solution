const PDFDocument = require('pdfkit');

const generateInquiriesPDF = (inquiries, res) => {
  const doc = new PDFDocument({ margin: 50 });
  const filename = `inquiries-report-${Date.now()}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  doc.fontSize(20).text('AI-Solutions Inquiry Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.fontSize(10).text(`Total Records: ${inquiries.length}`, { align: 'center' });
  doc.moveDown(2);

  inquiries.forEach((inquiry, index) => {
    if (index > 0) doc.moveDown();
    doc.fontSize(12).text(`Inquiry #${index + 1}`, { underline: true });
    doc.fontSize(10);
    doc.text(`Name: ${inquiry.fullName}`);
    doc.text(`Email: ${inquiry.email}`);
    doc.text(`Phone: ${inquiry.phone}`);
    doc.text(`Company: ${inquiry.companyName}`);
    doc.text(`Country: ${inquiry.country}`);
    doc.text(`Job Title: ${inquiry.jobTitle}`);
    doc.text(`Service: ${inquiry.serviceInterest || 'N/A'}`);
    doc.text(`Status: ${inquiry.status}`);
    doc.text(`Date: ${new Date(inquiry.createdAt).toLocaleDateString()}`);
    doc.text(`Details: ${inquiry.jobDetails.substring(0, 200)}${inquiry.jobDetails.length > 200 ? '...' : ''}`);

    if (doc.y > 700) doc.addPage();
  });

  doc.end();
};

const generateInquiriesCSV = (inquiries) => {
  const headers = [
    'ID',
    'Full Name',
    'Email',
    'Phone',
    'Company',
    'Country',
    'Job Title',
    'Service Interest',
    'Status',
    'Job Details',
    'Created At',
  ];

  const escapeCSV = (value) => {
    const str = String(value ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = inquiries.map((i) =>
    [
      i._id,
      i.fullName,
      i.email,
      i.phone,
      i.companyName,
      i.country,
      i.jobTitle,
      i.serviceInterest,
      i.status,
      i.jobDetails,
      new Date(i.createdAt).toISOString(),
    ]
      .map(escapeCSV)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

module.exports = { generateInquiriesPDF, generateInquiriesCSV };
