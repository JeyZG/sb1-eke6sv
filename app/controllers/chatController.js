import ChatMessage from '../models/ChatMessage';
import { processAIResponse } from '../../lib/openai';

export const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const aiResponse = await processAIResponse(message);

    const userMessage = new ChatMessage({
      user: userId,
      message,
      sender: 'user',
    });
    await userMessage.save();

    const aiMessage = new ChatMessage({
      user: userId,
      message: aiResponse,
      sender: 'ai',
    });
    await aiMessage.save();

    res.status(200).json({ message: 'Mensaje procesado', response: aiResponse });
  } catch (error) {
    throw error;
  }
};

export const requestSupport = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const supportMessage = new ChatMessage({
      user: userId,
      message,
      sender: 'user',
      supportRequest: true,
    });
    await supportMessage.save();

    // Aquí se implementaría la lógica para notificar al equipo de soporte

    res.status(200).json({ message: 'Solicitud de soporte enviada exitosamente' });
  } catch (error) {
    throw error;
  }
};