const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Stats = require('../models/Stats');

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const seedUsers = [
  { name: 'Admin User',     email: 'admin@demo.com',   password: 'admin123',  role: 'admin',  status: 'active' },
  { name: 'Alice Johnson',  email: 'alice@demo.com',   password: 'pass1234',  role: 'user',   status: 'active' },
  { name: 'Bob Smith',      email: 'bob@demo.com',     password: 'pass1234',  role: 'user',   status: 'active' },
  { name: 'Carol White',    email: 'carol@demo.com',   password: 'pass1234',  role: 'user',   status: 'inactive' },
  { name: 'David Lee',      email: 'david@demo.com',   password: 'pass1234',  role: 'user',   status: 'active' },
  { name: 'Eva Martinez',   email: 'eva@demo.com',     password: 'pass1234',  role: 'user',   status: 'active' },
  { name: 'Frank Brown',    email: 'frank@demo.com',   password: 'pass1234',  role: 'user',   status: 'inactive' },
  { name: 'Grace Kim',      email: 'grace@demo.com',   password: 'pass1234',  role: 'user',   status: 'active' },
  { name: 'Henry Davis',    email: 'henry@demo.com',   password: 'pass1234',  role: 'user',   status: 'active' },
  { name: 'Iris Thompson',  email: 'iris@demo.com',    password: 'pass1234',  role: 'user',   status: 'active' },
  { name: 'Jack Wilson',    email: 'jack@demo.com',    password: 'pass1234',  role: 'user',   status: 'inactive' },
  { name: 'Kate Anderson',  email: 'kate@demo.com',    password: 'pass1234',  role: 'user',   status: 'active' },
];

const generateMonthlyStats = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const stats = [];

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i + 12) % 12;
    const year = currentMonth - 11 + i < 0 ? currentYear - 1 : currentYear;
    const baseUsers = 100 + i * 30 + Math.floor(Math.random() * 50);

    stats.push({
      month: `${MONTHS[monthIndex]} ${year}`,
      year,
      monthIndex,
      newUsers:    baseUsers,
      activeUsers: Math.floor(baseUsers * (0.6 + Math.random() * 0.3)),
      sales:       Math.floor(Math.random() * 200) + 100 + i * 15,
      revenue:     Math.floor(Math.random() * 15000) + 5000 + i * 1200,
    });
  }
  return stats;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Stats.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // `insertMany` skips `pre('save')`, so hash passwords manually for seeded users.
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await User.insertMany(hashedUsers);
    console.log(`👤 Seeded ${seedUsers.length} users`);
    console.log('   → Login: admin@demo.com / admin123');

    // Seed stats
    const statsData = generateMonthlyStats();
    await Stats.insertMany(statsData);
    console.log(`📊 Seeded ${statsData.length} months of stats`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
