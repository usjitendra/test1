const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ['super_admin', 'admin', 'employee'], required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('messages', messageSchema);
