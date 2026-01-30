import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SystemStatus } from '@/types/simulation';

/**
 * SYSTEM GAUGE COMPONENT
 * 
 * Indicatore circolare animato che mostra lo stato generale del sistema.
 * Include animazioni fluide e effetti glow.
 */

interface SystemGaugeProps {
  value: number;
  label: string;
  status: SystemStatus;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export function SystemGauge({ value, label, status, size = 'md', tooltip }: SystemGaugeProps) {
  const sizes = {
    sm: { container: 'w-20 h-20', stroke: 6, text: 'text-lg', label: 'text-[10px]' },
    md: { container: 'w-28 h-28', stroke: 8, text: 'text-2xl', label: 'text-xs' },
    lg: { container: 'w-36 h-36', stroke: 10, text: 'text-3xl', label: 'text-sm' }
  };
  
  const sizeConfig = sizes[size];
  
  const colors = {
    healthy: {
      stroke: 'hsl(160, 84%, 40%)',
      text: 'text-success',
      glow: '0 0 20px hsl(160, 84%, 40%, 0.5)'
    },
    warning: {
      stroke: 'hsl(35, 100%, 50%)',
      text: 'text-warning',
      glow: '0 0 25px hsl(35, 100%, 50%, 0.5)'
    },
    critical: {
      stroke: 'hsl(0, 85%, 55%)',
      text: 'text-destructive',
      glow: '0 0 30px hsl(0, 85%, 55%, 0.6)'
    }
  };
  
  const colorConfig = colors[status];
  
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
        
        {/* Progress ring animato */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={sizeConfig.stroke}
          strokeLinecap="round"
          stroke={colorConfig.stroke}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: offset,
            filter: `drop-shadow(${colorConfig.glow})`
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      
      {/* Glow effect per stati critici */}
      {status === 'critical' && (
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-destructive/10 blur-md"
        />
      )}
      
      {/* Center content */}
      <div className="flex flex-col items-center justify-center z-10">
        <motion.span 
          key={value}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={cn(
            'font-bold font-mono tabular-nums',
            sizeConfig.text,
            colorConfig.text
          )}
        >
          {value}%
        </motion.span>
        <span className={cn(
          'text-muted-foreground uppercase tracking-wider',
          sizeConfig.label
        )}>
          {label}
        </span>
      </div>
      
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
}
