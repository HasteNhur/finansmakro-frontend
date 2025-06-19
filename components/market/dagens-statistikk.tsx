import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SectorData {
  name: string;
  change: number;
  icon: string;
}

interface DagensStatistikkProps {
  data: SectorData[];
}

export default function DagensStatistikk({ data }: DagensStatistikkProps) {
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-700 bg-green-50 border-green-100 shadow-green-100";
    if (change < 0) return "text-red-700 bg-red-50 border-red-100 shadow-red-100";
    return "text-gray-700 bg-gray-50 border-gray-100 shadow-gray-100";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const formatChange = (change: number) => {
    const formatted = Math.abs(change).toFixed(2);
    return change >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.map((sector, index) => (
          <div
            key={index}
            className={`relative p-5 rounded-xl border hover:shadow-lg transition-all duration-300 hover:scale-105 ${getChangeColor(sector.change)}`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-4xl mb-1 filter drop-shadow-sm">{sector.icon}</div>
              <div className="font-bold text-gray-900 text-xs uppercase tracking-wide">{sector.name}</div>
              <div className="flex items-center justify-center space-x-1.5">
                {getChangeIcon(sector.change)}
                <span className="font-extrabold text-sm">
                  {formatChange(sector.change)}
                </span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">Laster sektordata...</div>
        </div>
      )}
    </div>
  );
}