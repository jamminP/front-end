const ACCENT = '#1B3043';

type ItemProps = {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  active?: boolean;
};

export default function SidebarItem({ icon, label, collapsed, onClick, active }: ItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      className={[
        'group relative w-full flex items-center rounded-xl transition-colors',
        collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
        active ? 'bg-slate-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      ].join(' ')}
      style={{ ['--accent' as any]: ACCENT }}
    >
      <span className="text-slate-600 group-hover:text-[var(--accent)]">{icon}</span>
      <span
        className={[
          'whitespace-nowrap transition-all',
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
        ].join(' ')}
      >
        {label}
      </span>

      {active && !collapsed && (
        <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      )}
    </button>
  );
}
