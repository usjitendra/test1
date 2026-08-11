require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user.model');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

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

    const server = app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
