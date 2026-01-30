import { Slider } from '@/components/ui/slider';
import { Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * USER SLIDER COMPONENT
 * 
 * Permette di controllare il moltiplicatore di utenti nella simulazione.
 * Mostra visivamente l'impatto del numero di utenti sul sistema.
 */

interface UserSliderProps {
  multiplier: number;
  onMultiplierChange: (value: number) => void;
  baseUsers?: number;
}

// Passi disponibili per il moltiplicatore
const MULTIPLIER_STEPS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

export function UserSlider({ 
  multiplier, 
  onMultiplierChange, 
  baseUsers = 10 
}: UserSliderProps) {
  const totalUsers = baseUsers * multiplier;
  
  // Trova l'indice corrente nello slider
  const currentIndex = MULTIPLIER_STEPS.indexOf(multiplier);
  const sliderValue = currentIndex >= 0 ? currentIndex : 0;
  
  // Determina il livello di stress per la visualizzazione
  const stressLevel = multiplier >= 500 ? 'critical' : multiplier >= 100 ? 'warning' : 'normal';
  
  const handleSliderChange = (values: number[]) => {
    const index = Math.round(values[0]);
    onMultiplierChange(MULTIPLIER_STEPS[index] || 1);
  };
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2.5 rounded-xl transition-colors duration-300',
            stressLevel === 'normal' ? 'bg-primary/10' :
            stressLevel === 'warning' ? 'bg-warning/10' :
            'bg-destructive/10'
          )}>
            <Users className={cn(
              'w-5 h-5 transition-colors duration-300',
              stressLevel === 'normal' ? 'text-primary' :
              stressLevel === 'warning' ? 'text-warning' :
              'text-destructive'
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Simulatore Carico</h3>
            <p className="text-sm text-muted-foreground">Aumenta gli utenti per vedere l'impatto</p>
          </div>
        </div>
        
        {/* Badge moltiplicatore */}
        <div className={cn(
          'px-3 py-1.5 rounded-full text-sm font-mono font-medium transition-all duration-300',
          stressLevel === 'normal' ? 'bg-primary/20 text-primary' :
          stressLevel === 'warning' ? 'bg-warning/20 text-warning' :
          'bg-destructive/20 text-destructive animate-pulse'
        )}>
          {multiplier}x
        </div>
      </div>
      
      {/* Display utenti totali */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Zap className={cn(
            'w-5 h-5 transition-colors',
            stressLevel === 'critical' && 'text-destructive animate-pulse'
          )} />
          <span 
            className={cn(
              'text-4xl font-bold tabular-nums transition-colors duration-300',
              stressLevel === 'normal' ? 'text-primary' :
              stressLevel === 'warning' ? 'text-warning' :
              'text-destructive'
            )}
          >
            {totalUsers.toLocaleString('it-IT')}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">utenti simulati</span>
      </div>
      
      {/* Slider */}
      <div className="px-2">
        <Slider
          value={[sliderValue]}
          max={MULTIPLIER_STEPS.length - 1}
          step={1}
          onValueChange={handleSliderChange}
          className={cn(
            '[&_[role=slider]]:h-5 [&_[role=slider]]:w-5',
            '[&_[role=slider]]:transition-all [&_[role=slider]]:duration-300',
            stressLevel === 'normal' ? '[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary' :
            stressLevel === 'warning' ? '[&_[role=slider]]:bg-warning [&_[role=slider]]:border-warning' :
            '[&_[role=slider]]:bg-destructive [&_[role=slider]]:border-destructive [&_[role=slider]]:animate-pulse'
          )}
        />
        
        {/* Labels sotto lo slider */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {MULTIPLIER_STEPS.filter((_, i) => i % 2 === 0).map((step) => (
            <span key={step} className="font-mono">{step}x</span>
          ))}
        </div>
      </div>
      
      {/* Avviso carico alto */}
      {stressLevel === 'critical' && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive animate-fade-in">
          ⚠️ Carico critico! Il sistema sta mostrando segni di cedimento.
        </div>
      )}
    </div>
  );
}
