import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceType: { type: String, enum: ['escolar', 'universitario', 'empleados'], required: true },
  route: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  passengers: { type: Number, required: true },
  ageGroup: { type: String },
  offerAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);