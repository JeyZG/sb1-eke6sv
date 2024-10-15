import User from '../models/User';
import { uploadToS3 } from '../../lib/s3';

export const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('USER_001', 404);
    }

    const files = req.files;
    const uploadedUrls = [];

    for (const file of files) {
      const url = await uploadToS3(file.buffer, `documents/${userId}/${file.originalname}`);
      uploadedUrls.push(url);
    }

    user.documents = [...user.documents, ...uploadedUrls];
    await user.save();

    res.status(200).json({ message: 'Documentos subidos exitosamente', urls: uploadedUrls });
  } catch (error) {
    throw error;
  }
};