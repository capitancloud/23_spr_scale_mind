import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { MetricDataPoint, SystemStatus } from '@/types/simulation';

/**
 * RESPONSE TIME CHART
 * 
 * Grafico in tempo reale che mostra l'andamento del tempo di risposta.
 * Cambia colore basandosi sullo stato del sistema.
 */

interface ResponseTimeChartProps {
  data: MetricDataPoint[];
  status: SystemStatus;
}

// Soglie per i tempi di risposta (in ms)
const THRESHOLDS = {
  good: 100,      // Sotto 100ms = ottimo
  warning: 300,   // 100-300ms = accettabile
  critical: 500   // Sopra 500ms = critico
};

export function ResponseTimeChart({ data, status }: ResponseTimeChartProps) {
  // Prepara i dati per il grafico
  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      index,
      value: point.value,
      time: new Date(point.timestamp).toLocaleTimeString('it-IT', { 
        minute: '2-digit', 
        second: '2-digit' 
      })
    }));
  }, [data]);
  
  // Colore basato sullo stato
  const colors = {
    healthy: {
      stroke: 'hsl(160, 84%, 40%)',
      fill: 'hsl(160, 84%, 40%)',
      gradient: ['hsl(160, 84%, 40%)', 'hsl(160, 84%, 20%)']
    },
    warning: {
      stroke: 'hsl(35, 100%, 50%)',
      fill: 'hsl(35, 100%, 50%)',
      gradient: ['hsl(35, 100%, 50%)', 'hsl(35, 100%, 25%)']
    },
    critical: {
      stroke: 'hsl(0, 85%, 55%)',
      fill: 'hsl(0, 85%, 55%)',
      gradient: ['hsl(0, 85%, 55%)', 'hsl(0, 85%, 30%)']
    }
  };
  
  const colorSet = colors[status];
  
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Tempo di Risposta</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            &lt; {THRESHOLDS.good}ms
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            &lt; {THRESHOLDS.warning}ms
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            &gt; {THRESHOLDS.critical}ms
          </span>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id={`gradient-${status}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorSet.gradient[0]} stopOpacity={0.4} />
                <stop offset="100%" stopColor={colorSet.gradient[1]} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
              domain={[0, 'auto']}
              width={40}
            />
            
            {/* Linee di riferimento per le soglie */}
            <ReferenceLine 
              y={THRESHOLDS.good} 
              stroke="hsl(160, 84%, 40%)" 
              strokeDasharray="3 3" 
              strokeOpacity={0.3}
            />
            <ReferenceLine 
              y={THRESHOLDS.warning} 
              stroke="hsl(35, 100%, 50%)" 
              strokeDasharray="3 3" 
              strokeOpacity={0.3}
            />
            <ReferenceLine 
              y={THRESHOLDS.critical} 
              stroke="hsl(0, 85%, 55%)" 
              strokeDasharray="3 3" 
              strokeOpacity={0.3}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 20%)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              formatter={(value: number) => [`${value}ms`, 'Response Time']}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={colorSet.stroke}
              strokeWidth={2}
              fill={`url(#gradient-${status})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
