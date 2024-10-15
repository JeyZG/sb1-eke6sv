import { connectDB } from '../../../lib/db';
import Service from '../../../models/Service';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { serviceId } = req.query;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    const driver = await User.findOne({ _id: service.driver });
    if (!driver || !driver.location) {
      return res.status(404).json({ message: 'Ubicación del conductor no disponible' });
    }

    res.status(200).json({
      latitude: driver.location.coordinates[1],
      longitude: driver.location.coordinates[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}