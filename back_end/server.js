require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user.model');
const Message = require('./src/models/message.model');
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_of_length_at_least_32_characters';
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Unauthorized'));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const dbUser = await User.findById(decoded.id).select('_id full_name email user_type').lean();
    if (!dbUser) return next(new Error('User not found'));
    socket.user = {
      id: dbUser._id.toString(),
      full_name: dbUser.full_name || dbUser.email || 'User',
      user_type: dbUser.user_type || 'employee',
      email: dbUser.email,
    };
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.user?.full_name} (${socket.user?.user_type})`);
  socket.on('send_message', async (text) => {
    if (!text || !text.trim()) return;
    try {
      const msg = await Message.create({
        sender: socket.user.id,
        senderName: socket.user.full_name,
        senderRole: socket.user.user_type,
        text: text.trim(),
      });
      io.emit('new_message', msg);
    } catch (err) {
      console.error('Socket message error:', err.message);
    }
  });
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.user?.full_name}`);
  });
});
const seedDefaultAdmin = async () => {
  try {
    const adminEmail = 'superadmin@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('12345', salt);
      await User.create({
        full_name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        user_type: 'super_admin',
        is_active: true,
        is_delete: false,
      });
      console.log(`Default Super Admin created: ${adminEmail}`);
    } else if (existingAdmin.user_type !== 'super_admin') {
      existingAdmin.user_type = 'super_admin';
      await existingAdmin.save();
      console.log(`Updated ${adminEmail} role to super_admin`);
    }
  } catch (error) {
    console.error('Failed to seed default admin:', error);
  }
};
const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultAdmin();
    server.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
      server.close(() => process.exit(1));
    });
    process.on('SIGTERM', () => {
      server.close(() => console.log('Process terminated'));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();
