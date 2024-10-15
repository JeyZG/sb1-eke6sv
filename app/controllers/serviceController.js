import Service from '../models/Service';

export const createService = async (req, res) => {
  try {
    const { client, serviceType, route, passengers, ageGroup, offerAmount } = req.body;

    const service = new Service({
      client,
      serviceType,
      route,
      passengers,
      ageGroup,
      offerAmount,
    });

    await service.save();

    res.status(201).json({ message: 'Servicio creado exitosamente', service });
  } catch (error) {
    throw error;
  }
};

export const listServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'pending' }).populate('client', 'name');

    res.status(200).json(services);
  } catch (error) {
    throw error;
  }
};

export const acceptService = async (req, res) => {
  try {
    const { serviceId, driverId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      throw new AppError('SERVICE_001', 404);
    }

    if (service.status !== 'pending') {
      throw new AppError('SERVICE_003', 400);
    }

    service.driver = driverId;
    service.status = 'accepted';
    await service.save();

    res.status(200).json({ message: 'Servicio aceptado exitosamente', service });
  } catch (error) {
    throw error;
  }
};

export const completeService = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      throw new AppError('SERVICE_001', 404);
    }

    if (service.status !== 'accepted') {
      throw new AppError('SERVICE_004', 400);
    }

    service.status = 'completed';
    await service.save();

    res.status(200).json({ message: 'Servicio completado exitosamente', service });
  } catch (error) {
    throw error;
  }
};