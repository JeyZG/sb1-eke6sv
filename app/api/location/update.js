import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export default asyncfunction handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { userId, latitude, longitude } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    await user.save();

    res.status(200).json({ message: 'Ubicación actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}