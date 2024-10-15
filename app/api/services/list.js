import { connectDB } from '../../../lib/db';
import Service from '../../../models/Service';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const services = await Service.find({ status: 'pending' }).populate('client', 'name');

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}