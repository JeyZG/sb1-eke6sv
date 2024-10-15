import Service from '../models/Service';
import Contract from '../models/Contract';
import { generateContractPDF } from '../../lib/pdfGenerator';
import { uploadToS3 } from '../../lib/s3';

export const generateContract = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId).populate('client');
    if (!service) {
      throw new AppError('SERVICE_001', 404);
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
    const pdfUrl = await uploadToS3(pdfBuffer, `contracts/${serviceId}.pdf`);

    const contract = new Contract({
      service: serviceId,
      pdfUrl,
    });

    await contract.save();

    res.status(200).json({ message: 'Contrato generado exitosamente', contract });
  } catch (error) {
    throw error;
  }
};