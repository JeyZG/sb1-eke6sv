import { connectDB } from '../../../lib/db';
import User from '../../../models/User';
import { sendVerificationEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { name, email, phone, password, userType } = req.body;

    // Validar número de teléfono colombiano
    const phoneRegex = /^(\+57|57)?3\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Número de teléfono inválido' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
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

    // Enviar código de verificación por correo electrónico
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'Usuario registrado. Verifique su correo electrónico.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}