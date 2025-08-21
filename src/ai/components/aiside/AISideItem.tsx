type ItemProps = { icon: React.ReactNode; label: string; collapsed: boolean; onClick?: () => void };

export default function SidebarItem({ icon, label, collapsed, onClick }: ItemProps) {
  return (
    <button
      className={[
        'group w-full flex items-center gap-3 rounded px-3 py-2.5 hover:bg-gray-50 pl-5',
        collapsed ? 'justify-center px-0' : '',
      ].join(' ')}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
    >
      {icon}
      <span
        className={[
          'whitespace-nowrap transition-opacity',
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  );
}
