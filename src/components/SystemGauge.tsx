import { cn } from '@/lib/utils';
import { SystemStatus } from '@/types/simulation';

/**
 * SYSTEM GAUGE COMPONENT
 * 
 * Indicatore circolare che mostra lo stato generale del sistema.
 * Visualizza CPU, memoria o altri valori percentuali con animazioni.
 */

interface SystemGaugeProps {
  value: number; // 0-100
  label: string;
  status: SystemStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function SystemGauge({ value, label, status, size = 'md' }: SystemGaugeProps) {
  const sizes = {
    sm: { container: 'w-20 h-20', stroke: 6, text: 'text-lg', label: 'text-[10px]' },
    md: { container: 'w-28 h-28', stroke: 8, text: 'text-2xl', label: 'text-xs' },
    lg: { container: 'w-36 h-36', stroke: 10, text: 'text-3xl', label: 'text-sm' }
  };
  
  const sizeConfig = sizes[size];
  
  const colors = {
    healthy: {
      stroke: 'stroke-success',
      text: 'text-success',
      glow: 'drop-shadow-[0_0_8px_hsl(160,84%,40%)]'
    },
    warning: {
      stroke: 'stroke-warning',
      text: 'text-warning',
      glow: 'drop-shadow-[0_0_8px_hsl(35,100%,50%)]'
    },
    critical: {
      stroke: 'stroke-destructive',
      text: 'text-destructive',
      glow: 'drop-shadow-[0_0_12px_hsl(0,85%,55%)]'
    }
  };
  
  const colorConfig = colors[status];
  
  // Calcola il circumference e offset per il progresso circolare
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className={cn('relative flex items-center justify-center', sizeConfig.container)}>
      {/* Background ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={sizeConfig.stroke}
          className="stroke-muted"
        />
        
        {/* Progress ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={sizeConfig.stroke}
          strokeLinecap="round"
          className={cn(
            colorConfig.stroke,
            colorConfig.glow,
            'transition-all duration-500'
          )}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="flex flex-col items-center justify-center z-10">
        <span className={cn(
          'font-bold font-mono tabular-nums transition-colors duration-300',
          sizeConfig.text,
          colorConfig.text
        )}>
          {value}%
        </span>
        <span className={cn(
          'text-muted-foreground uppercase tracking-wider',
          sizeConfig.label
        )}>
          {label}
        </span>
      </div>
    </div>
  );
}
