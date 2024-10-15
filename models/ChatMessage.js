import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ['user', 'ai', 'support'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);