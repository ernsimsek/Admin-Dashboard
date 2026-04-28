export default function StatCard({ title, value, change, changeLabel, icon, color = 'brand', loading }) {
  const colorMap = {
    brand:  { bg: 'bg-brand-50',  icon: 'text-brand-600',  badge: 'bg-brand-100 text-brand-700' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  badge: 'bg-green-100 text-green-700' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
  };
  const c = colorMap[color] || colorMap.brand;

  const isPositive = change >= 0;

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
        <div className="h-8 bg-slate-100 rounded w-3/4 mb-3" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="mt-1.5 text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={c.icon}>{icon}</span>
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md
              ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
          <span className="text-xs text-slate-400">{changeLabel || 'vs last month'}</span>
        </div>
      )}
    </div>
  );
}
