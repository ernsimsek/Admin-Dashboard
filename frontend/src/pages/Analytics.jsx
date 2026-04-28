import { useEffect, useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';

const RANGES = [
  { label: 'Last 7 days',  value: '7' },
  { label: 'Last 30 days', value: '30' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3.5 py-2.5 text-sm">
      <p className="font-medium text-slate-700 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-medium text-slate-800">
            {entry.dataKey === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [range,   setRange]   = useState('30');
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/stats/analytics?range=${range}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [range]);

  // Summary stats from data
  const totals = data.reduce(
    (acc, d) => ({
      visits:      acc.visits + d.visits,
      conversions: acc.conversions + d.conversions,
      revenue:     acc.revenue + d.revenue,
    }),
    { visits: 0, conversions: 0, revenue: 0 }
  );
  const avgBounce = data.length
    ? (data.reduce((s, d) => s + d.bounceRate, 0) / data.length).toFixed(1)
    : 0;

  const Skeleton = () => (
    <div className="card p-5 animate-pulse">
      <div className="h-4 bg-slate-100 rounded w-1/4 mb-4" />
      <div className="h-52 bg-slate-50 rounded-xl" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Range picker */}
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              range === r.value
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="card p-4 text-sm text-red-500">{error}</div>
      )}

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Visits',    value: loading ? '—' : totals.visits.toLocaleString(),      color: 'text-brand-600' },
          { label: 'Conversions',     value: loading ? '—' : totals.conversions.toLocaleString(), color: 'text-green-600' },
          { label: 'Revenue',         value: loading ? '—' : `$${totals.revenue.toLocaleString()}`, color: 'text-violet-600' },
          { label: 'Avg Bounce Rate', value: loading ? '—' : `${avgBounce}%`,                     color: 'text-amber-600' },
        ].map((item) => (
          <div key={item.label} className="card p-4">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-2xl font-semibold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Area chart: Visits + Conversions */}
      {loading ? <Skeleton /> : (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Visits & Conversions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f62ff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f62ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="visits"      name="Visits"      stroke="#4f62ff" strokeWidth={2} fill="url(#gradVisits)" dot={false} />
              <Area type="monotone" dataKey="conversions" name="Conversions" stroke="#34d399" strokeWidth={2} fill="url(#gradConv)"   dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom row: Revenue bar + Bounce line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Daily Revenue</h3>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={range === '7' ? 24 : 8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#a78bfa" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Bounce Rate %</h3>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[20, 80]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="bounceRate" name="Bounce Rate" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
