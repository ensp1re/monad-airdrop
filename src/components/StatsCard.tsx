interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d44] rounded-lg p-4 sm:p-6 hover:border-[#7c3aed] transition-colors">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="text-gray-400 text-xs sm:text-sm">{title}</div>
        {icon && <div className="text-[#7c3aed]">{icon}</div>}
      </div>
      <div className="text-2xl sm:text-3xl text-white mb-1">{value}</div>
      {subtitle && <div className="text-gray-500 text-xs sm:text-sm break-all">{subtitle}</div>}
    </div>
  );
}
