import { connectDB } from '../../../lib/db';
import Service from '../../../models/Service';
import Contract from '../../../models/Contract';
import { generateContractPDF } from '../../../lib/pdfGenerator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { serviceId } = req.body;

    const service = await Service.findById(serviceId).populate('client');
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    const contractData = {
      serviceId: service._id,
      clientName: service.client.name,
      serviceType: service.serviceType,
      route: service.route,
      passengers: service.passengers,
      offerAmount: service.offerAmount,
      date: new Date().toISOString(),
    };

    const pdfBuffer = await generateContractPDF(contractData);

    const contract = new Contract({
      service: serviceId,
      pdfUrl: 'URL_TO_S3_BUCKET', // Aquí se subiría el PDF a S3 y se guardaría la URL
    });

    await contract.save();

    res.status(200).json({ message: 'Contrato generado exitosamente', contract });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}