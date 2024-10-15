import { connectDB } from '../../../lib/db';
import ChatMessage from '../../../models/ChatMessage';
import { processAIResponse } from '../../../lib/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { userId, message } = req.body;

    // Procesar el mensaje con OpenAI
    const aiResponse = await processAIResponse(message);

    // Guardar el mensaje del usuario y la respuesta de la IA
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
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}