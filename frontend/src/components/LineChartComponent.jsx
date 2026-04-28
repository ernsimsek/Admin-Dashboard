import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3.5 py-2.5 text-sm">
      <p className="font-medium text-slate-700 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-medium text-slate-800">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function LineChartComponent({ data, lines = [], title, loading }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="h-4 bg-slate-100 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-56 bg-slate-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="card p-5">
      {title && <h3 className="text-sm font-semibold text-slate-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || '#4f62ff'}
              strokeWidth={2}
              dot={{ r: 3, fill: line.color || '#4f62ff' }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
