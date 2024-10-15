import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function processAIResponse(message) {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: `Usuario: ${message}\nAsistente:`,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error al procesar la respuesta de OpenAI:', error);
    throw error;
  }
}