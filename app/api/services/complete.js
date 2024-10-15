import { connectDB } from '../../../lib/db';
import Service from '../../../models/Service';
import { AppError } from '../../../lib/errorHandler';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { serviceId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      throw new AppError('SERVICE_001', 404);
    }

    if (service.status !== 'accepted') {
      throw new AppError('SERVICE_004', 400);
    }

    service.status = 'completed';
    await service.save();

    res.status(200).json({ message: 'Servicio completado exitosamente', service });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({ error: { code: error.code, message: error.message } });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}