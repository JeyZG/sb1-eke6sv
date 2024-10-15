import User from '../models/User';
import jwt from 'jsonwebtoken';
import { AppError } from '../../lib/errorHandler';
import { sendVerificationEmail } from '../../lib/email';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;

    const phoneRegex = /^(\+57|57)?3\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new AppError('USER_002', 400);
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      throw new AppError('USER_002', 400);
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const user = new User({
      name,
      email,
      phone,
      password,
      userType,
      verificationCode,
    });

    await user.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Usuario registrado. Verifique su correo electrónico.' });
  } catch (error) {
    throw error;
  }
};

export const login = async (req, res) => {
  try {
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
    throw error;
  }
};

export const verify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email, verificationCode });
    if (!user) {
      throw new AppError('AUTH_002', 400);
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'Cuenta verificada exitosamente' });
  } catch (error) {
    throw error;
  }
};