import { Brain, Pause, Play, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * HEADER COMPONENT
 * 
 * Header dell'app con logo, controlli simulazione e info.
 */

interface HeaderProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
}

export function Header({ isPaused, onTogglePause, onReset }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent blur-lg opacity-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Scale</span>Mind
              </h1>
              <p className="text-xs text-muted-foreground">
                Impara a pensare scalabile
              </p>
            </div>
          </div>
          
          {/* Controlli */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onTogglePause}
                  className={cn(
                    'transition-colors',
                    isPaused && 'border-warning text-warning hover:text-warning'
                  )}
                >
                  {isPaused ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPaused ? 'Riprendi simulazione' : 'Pausa simulazione'}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset simulazione</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-semibold mb-1">Come usare ScaleMind</p>
                <p className="text-xs">
                  Usa lo slider per aumentare gli utenti simulati e osserva come 
                  il sistema risponde. I colli di bottiglia appariranno a diversi 
                  livelli di carico.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
}
