import { connectDB } from '../../../lib/db';
import ChatMessage from '../../../models/ChatMessage';
import { AppError } from '../../../lib/errorHandler';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { userId, message } = req.body;

    const supportMessage = new ChatMessage({
      user: userId,
      message,
      sender: 'user',
      supportRequest: true,
    });
    await supportMessage.save();

    // Aquí se implementaría la lógica para notificar al equipo de soporte
    // Por ejemplo, enviar un correo electrónico o una notificación push

    res.status(200).json({ message: 'Solicitud de soporte enviada exitosamente' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({ error: { code: error.code, message: error.message } });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}