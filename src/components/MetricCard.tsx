import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SystemStatus } from '@/types/simulation';

/**
 * METRIC CARD COMPONENT
 * 
 * Visualizza una singola metrica con animazioni e indicatori di stato.
 * Lo stato (healthy/warning/critical) determina colori e animazioni.
 */

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: ReactNode;
  status?: SystemStatus;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  status = 'healthy',
  trend,
  description,
  className
}: MetricCardProps) {
  // Determina le classi CSS basate sullo stato
  const statusStyles = {
    healthy: {
      indicator: 'bg-success pulse-healthy',
      glow: 'glow-primary',
      text: 'text-success',
      border: 'border-success/20'
    },
    warning: {
      indicator: 'bg-warning pulse-warning',
      glow: 'glow-warning',
      text: 'text-warning',
      border: 'border-warning/20'
    },
    critical: {
      indicator: 'bg-destructive pulse-danger',
      glow: 'glow-danger',
      text: 'text-destructive',
      border: 'border-destructive/20'
    }
  };
  
  const styles = statusStyles[status];
  
  return (
    <div 
      className={cn(
        'glass-card p-5 transition-all duration-500',
        status !== 'healthy' && styles.glow,
        styles.border,
        className
      )}
    >
      {/* Header con icona e indicatore stato */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'p-2 rounded-lg',
            status === 'healthy' ? 'bg-primary/10 text-primary' : 
            status === 'warning' ? 'bg-warning/10 text-warning' : 
            'bg-destructive/10 text-destructive'
          )}>
            {icon}
          </div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
        </div>
        
        {/* Indicatore di stato pulsante */}
        <div className={cn(
          'w-3 h-3 rounded-full',
          styles.indicator
        )} />
      </div>
      
      {/* Valore principale con animazione */}
      <div className="flex items-baseline gap-1">
        <span 
          key={String(value)} 
          className={cn(
            'text-3xl font-bold tabular-nums animate-number-increment',
            styles.text
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-lg text-muted-foreground">{unit}</span>
        )}
        
        {/* Indicatore trend */}
        {trend && (
          <span className={cn(
            'ml-2 text-sm',
            trend === 'up' ? 'text-destructive' : 
            trend === 'down' ? 'text-success' : 
            'text-muted-foreground'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      
      {/* Descrizione opzionale */}
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
