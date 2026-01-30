import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SystemStatus } from '@/types/simulation';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * METRIC CARD COMPONENT
 * 
 * Visualizza una singola metrica con animazioni e indicatori di stato.
 * Include tooltip esplicativi per principianti.
 */

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: ReactNode;
  status?: SystemStatus;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  tooltip?: string;
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
  tooltip,
  className
}: MetricCardProps) {
  const statusStyles = {
    healthy: {
      indicator: 'bg-success',
      glow: 'shadow-[0_0_30px_-5px_hsl(160,84%,40%,0.3)]',
      text: 'text-success',
      border: 'border-success/20',
      bg: 'bg-success/5'
    },
    warning: {
      indicator: 'bg-warning',
      glow: 'shadow-[0_0_30px_-5px_hsl(35,100%,50%,0.4)]',
      text: 'text-warning',
      border: 'border-warning/20',
      bg: 'bg-warning/5'
    },
    critical: {
      indicator: 'bg-destructive',
      glow: 'shadow-[0_0_30px_-5px_hsl(0,85%,55%,0.4)]',
      text: 'text-destructive',
      border: 'border-destructive/20',
      bg: 'bg-destructive/5'
    }
  };
  
  const styles = statusStyles[status];
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'glass-card p-5 transition-all duration-500',
        status !== 'healthy' && styles.glow,
        styles.border,
        styles.bg,
        className
      )}
    >
      {/* Header con icona e indicatore stato */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div 
            animate={status === 'critical' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: status === 'critical' ? Infinity : 0 }}
            className={cn(
              'p-2 rounded-lg transition-colors',
              status === 'healthy' ? 'bg-primary/10 text-primary' : 
              status === 'warning' ? 'bg-warning/10 text-warning' : 
              'bg-destructive/10 text-destructive'
            )}
          >
            {icon}
          </motion.div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
          
          {/* Tooltip per principianti */}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        {/* Indicatore di stato pulsante */}
        <motion.div 
          animate={
            status === 'critical' 
              ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
              : status === 'warning'
              ? { scale: [1, 1.2, 1] }
              : {}
          }
          transition={{ 
            duration: status === 'critical' ? 0.8 : 1.5, 
            repeat: Infinity 
          }}
          className={cn('w-3 h-3 rounded-full', styles.indicator)}
        />
      </div>
      
      {/* Valore principale con animazione */}
      <div className="flex items-baseline gap-1">
        <motion.span 
          key={String(value)} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={cn(
            'text-3xl font-bold tabular-nums',
            styles.text
          )}
        >
          {value}
        </motion.span>
        {unit && (
          <span className="text-lg text-muted-foreground">{unit}</span>
        )}
        
        {/* Indicatore trend animato */}
        {trend && (
          <motion.span 
            animate={trend === 'up' ? { y: [0, -3, 0] } : trend === 'down' ? { y: [0, 3, 0] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={cn(
              'ml-2 text-sm font-medium',
              trend === 'up' ? 'text-destructive' : 
              trend === 'down' ? 'text-success' : 
              'text-muted-foreground'
            )}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </motion.span>
        )}
      </div>
      
      {/* Descrizione opzionale */}
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
}
