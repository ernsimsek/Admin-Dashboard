const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stats = require('../models/Stats');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route  GET /api/stats/dashboard
// @desc   Dashboard summary cards
// @access Private
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers   = await User.countDocuments();
    const activeUsers  = await User.countDocuments({ status: 'active' });

    // Aggregate last 2 months user count for growth %
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthUsers = await User.countDocuments({ createdAt: { $gte: thisMonthStart } });
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
    });

    const growth = lastMonthUsers > 0
      ? (((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
      : 100;

    // Pull total sales from Stats collection
    const salesAgg = await Stats.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$sales' }, totalRevenue: { $sum: '$revenue' } } },
    ]);

    const totalSales   = salesAgg[0]?.totalSales   || 0;
    const totalRevenue = salesAgg[0]?.totalRevenue || 0;

    res.json({ totalUsers, activeUsers, totalSales, totalRevenue, growth: Number(growth) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/stats/user-growth
// @desc   Monthly new user counts for line chart
// @access Private
router.get('/user-growth', async (req, res) => {
  try {
    const data = await Stats.find().sort({ year: 1, monthIndex: 1 }).limit(12);
    const result = data.map((s) => ({
      month: s.month,
      users: s.newUsers,
      active: s.activeUsers,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/stats/sales
// @desc   Monthly sales for bar chart
// @access Private
router.get('/sales', async (req, res) => {
  try {
    const data = await Stats.find().sort({ year: 1, monthIndex: 1 }).limit(12);
    const result = data.map((s) => ({
      month: s.month,
      sales: s.sales,
      revenue: s.revenue,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/stats/analytics
// @desc   Analytics data with date range filtering
// @access Private
router.get('/analytics', async (req, res) => {
  try {
    const { range = '30' } = req.query; // '7' or '30'
    const days = Number(range);

    // Generate daily data points
    const dataPoints = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dataPoints.push({
        date: label,
        visits:      Math.floor(Math.random() * 500) + 200,
        conversions: Math.floor(Math.random() * 80)  + 20,
        revenue:     Math.floor(Math.random() * 3000) + 500,
        bounceRate:  Math.floor(Math.random() * 30)  + 30,
      });
    }

    res.json(dataPoints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
