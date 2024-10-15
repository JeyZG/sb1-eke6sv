import PDFDocument from 'pdfkit';

export async function generateContractPDF(contractData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Contrato de Servicio de Transporte', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date(contractData.date).toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Cliente: ${contractData.clientName}`);
    doc.text(`Tipo de Servicio: ${contractData.serviceType}`);
    doc.text(`Ruta: ${contractData.route.start} - ${contractData.route.end}`);
    doc.text(`Número de Pasajeros: ${contractData.passengers}`);
    doc.text(`Monto Acordado: $${contractData.offerAmount}`);
    doc.moveDown();
    doc.text('Términos y Condiciones:', { underline: true });
    doc.text('1. El conductor se compromete a proporcionar el servicio de transporte según lo acordado.');
    doc.text('2. El cliente se compromete a pagar el monto acordado por el servicio.');
    doc.text('3. Ambas partes acuerdan cumplir con las normas de tránsito y seguridad vigentes.');
    doc.moveDown(2);
    doc.text('Firmas:', { underline: true });
    doc.moveDown();
    doc.text('_________________________                    _________________________');
    doc.text('           Cliente                                         Conductor');

    doc.end();
  });
}