import { Link } from "wouter";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

function TimeAgo({ timestamp }: { timestamp: string }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const lastUpdate = new Date(timestamp);
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) {
        setTimeAgo("Akkurat nå");
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins} min siden`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        setTimeAgo(`${diffHours} t siden`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{timeAgo}</span>;
}

export default function Navigation() {
  const { data: lastUpdate } = useQuery({
    queryKey: ["/api/last-update"],
    refetchInterval: 60000, // Refetch every minute
  });

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-slate-800 rounded-sm flex items-center justify-center">
              <span className="text-white font-black text-lg leading-none">FM</span>
              <svg className="absolute bottom-1 left-1 right-1 h-4" viewBox="0 0 40 16" fill="none">
                <path d="M2 14 L8 12 L14 6 L20 9 L26 4 L32 7 L38 2" 
                      stroke="#3b82f6" 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      fill="none"/>
              </svg>
            </div>
            <div>
              <Link href="/" className="text-2xl font-black tracking-tight text-slate-800 uppercase" style={{fontFamily: 'Montserrat, system-ui, sans-serif'}}>
                FINANS<span className="text-slate-800">MAKRO</span><span className="text-blue-600 text-lg">.NO</span>
              </Link>
              <div className="text-sm text-gray-600 font-medium" style={{fontFamily: 'Montserrat, system-ui, sans-serif'}}>
                Norsk Markedsoversikt
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {lastUpdate?.lastUpdate ? (
              <TimeAgo timestamp={lastUpdate.lastUpdate} />
            ) : (
              <span>Oppdaterer...</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
