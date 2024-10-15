import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  pdfUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Contract || mongoose.model('Contract', ContractSchema);