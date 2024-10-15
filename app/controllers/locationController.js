import User from '../models/User';
import Service from '../models/Service';

export const updateLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('USER_001', 404);
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    await user.save();

    res.status(200).json({ message: 'Ubicación actualizada exitosamente' });
  } catch (error) {
    throw error;
  }
};

export const trackLocation = async (req, res) => {
  try {
    const { serviceId } = req.query;

    const service = await Service.findById(serviceId);
    if (!service) {
      throw new AppError('SERVICE_001', 404);
    }

    const driver = await User.findOne({ _id: service.driver });
    if (!driver || !driver.location) {
      throw new AppError('LOCATION_001', 404);
    }

    res.status(200).json({
      latitude: driver.location.coordinates[1],
      longitude: driver.location.coordinates[0],
    });
  } catch (error) {
    throw error;
  }
};