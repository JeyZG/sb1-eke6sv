import { connectDB } from '../../../lib/db';
import Service from '../../../models/Service';
import Payment from '../../../models/Payment';
import { processPayment } from '../../../lib/paymentGateway';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { serviceId, paymentMethod, paymentDetails } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    const paymentResult = await processPayment(service.offerAmount, paymentMethod, paymentDetails);

    if (paymentResult.success) {
      const payment = new Payment({
        service: serviceId,
        amount: service.offerAmount,
        paymentMethod,
        transactionId: paymentResult.transactionId,
      });

      await payment.save();

      service.status = 'accepted';
      await service.save();

      res.status(200).json({ message: 'Pago procesado exitosamente', payment });
    } else {
      res.status(400).json({ message: 'Error al procesar el pago', error: paymentResult.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}