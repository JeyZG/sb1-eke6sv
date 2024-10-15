import Service from '../models/Service';
import Payment from '../models/Payment';
import { processPayment } from '../../lib/paymentGateway';

export const processPaymentController = async (req, res) => {
  try {
    const { serviceId, paymentMethod, paymentDetails } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      throw new AppError('SERVICE_001', 404);
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
      throw new AppError('PAYMENT_001', 400);
    }
  } catch (error) {
    throw error;
  }
};