import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import LineChartComponent from '../components/LineChartComponent';
import BarChartComponent from '../components/BarChartComponent';

const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
const fmtMoney = (n) => `$${(n / 1000).toFixed(1)}k`;

export default function Dashboard() {
  const [summary,   setSummary]   = useState(null);
  const [growth,    setGrowth]    = useState([]);
  const [sales,     setSales]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [sRes, gRes, saRes] = await Promise.all([
          api.get('/stats/dashboard'),
          api.get('/stats/user-growth'),
          api.get('/stats/sales'),
        ]);
        setSummary(sRes.data);
        setGrowth(gRes.data);
        setSales(saRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={loading ? '—' : fmt(summary?.totalUsers ?? 0)}
          change={summary?.growth}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          color="brand"
          loading={loading}
        />
        <StatCard
          title="Active Users"
          value={loading ? '—' : fmt(summary?.activeUsers ?? 0)}
          change={5.2}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          color="green"
          loading={loading}
        />
        <StatCard
          title="Total Sales"
          value={loading ? '—' : fmt(summary?.totalSales ?? 0)}
          change={12.8}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          color="amber"
          loading={loading}
        />
        <StatCard
          title="Revenue"
          value={loading ? '—' : fmtMoney(summary?.totalRevenue ?? 0)}
          change={summary?.growth}
          changeLabel="growth this month"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="violet"
          loading={loading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineChartComponent
          title="User Growth"
          data={growth}
          lines={[
            { dataKey: 'users',  name: 'New Users',    color: '#4f62ff' },
            { dataKey: 'active', name: 'Active Users',  color: '#34d399' },
          ]}
          loading={loading}
        />
        <BarChartComponent
          title="Monthly Sales"
          data={sales}
          bars={[
            { dataKey: 'sales',   name: 'Sales (units)', color: '#4f62ff' },
            { dataKey: 'revenue', name: 'Revenue ($)',    color: '#a78bfa' },
          ]}
          loading={loading}
        />
      </div>

      {/* Quick insights */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Avg. session length', value: '4m 32s', tag: '+12%' },
            { label: 'Conversion rate',      value: '3.6%',   tag: '+0.4%' },
            { label: 'Churn rate',           value: '2.1%',   tag: '-0.3%' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-3.5">
              <p className="text-xs text-slate-500">{item.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-semibold text-slate-900">{item.value}</span>
                <span className="text-xs text-green-600 font-medium">{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
