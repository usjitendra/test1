const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./src/models/user.model');
const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI environment variable is missing!");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    const adminEmail = "superadmin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("12345", salt);
      await User.create({
        full_name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        user_type: "super_admin",
        is_active: true,
        is_delete: false,
      });
      console.log("Seeded Default Super Admin:", adminEmail);
    } else {
      if (existingAdmin.user_type !== "super_admin") {
        existingAdmin.user_type = "super_admin";
        await existingAdmin.save();
        console.log("Updated user role to super_admin:", adminEmail);
      } else {
        console.log("Default Super Admin already exists:", adminEmail);
      }
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};
seed();
