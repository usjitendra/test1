const Message = require('../models/message.model');
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};
module.exports = { getMessages };
