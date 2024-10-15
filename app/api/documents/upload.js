import { connectDB } from '../../../lib/db';
import User from '../../../models/User';
import { uploadToS3 } from '../../../lib/s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { userId } = req.query;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const files = await parseMultipartForm(req);
    const uploadedUrls = [];

    for (const file of files) {
      const url = await uploadToS3(file);
      uploadedUrls.push(url);
    }

    user.documents = [...user.documents, ...uploadedUrls];
    await user.save();

    res.status(200).json({ message: 'Documentos subidos exitosamente', urls: uploadedUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    const files = [];
    form.on('file', (field, file) => {
      files.push(file);
    });
    form.on('end', () => resolve(files));
    form.on('error', reject);
    form.parse(req);
  });
}