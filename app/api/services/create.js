import { connectDB } from '../../../lib/db';
import Service from '../../../models/Service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { client, serviceType, route, passengers, ageGroup, offerAmount } = req.body;

    const service = new Service({
      client,
      serviceType,
      route,
      passengers,
      ageGroup,
      offerAmount,
    });

    await service.save();

    res.status(201).json({ message: 'Servicio creado exitosamente', service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}