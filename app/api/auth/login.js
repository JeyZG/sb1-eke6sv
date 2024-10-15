import { connectDB } from '../../../lib/db';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import { AppError } from '../../../lib/errorHandler';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('AUTH_001', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('AUTH_001', 401);
    }

    if (!user.isVerified) {
      throw new AppError('AUTH_003', 403);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({ error: { code: error.code, message: error.message } });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}