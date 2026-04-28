import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard',  subtitle: 'Welcome back! Here\'s what\'s happening.' },
  '/users':     { title: 'Users',      subtitle: 'Manage your team and user accounts.' },
  '/analytics': { title: 'Analytics',  subtitle: 'Track performance and key metrics.' },
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: 'AdminOS', subtitle: '' };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h1 className="text-lg font-semibold text-slate-900 leading-none">{page.title}</h1>
            {page.subtitle && (
              <p className="text-sm text-slate-400 mt-0.5">{page.subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: notifications + date */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>

          <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
