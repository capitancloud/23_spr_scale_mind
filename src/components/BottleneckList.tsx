import { AlertTriangle, CheckCircle, ChevronDown, Lightbulb } from 'lucide-react';
import { Bottleneck } from '@/types/simulation';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * BOTTLENECK LIST COMPONENT
 * 
 * Mostra i colli di bottiglia che si attivano a diversi livelli di carico.
 * Ogni bottleneck include una spiegazione e una soluzione suggerita.
 * 
 * Questo componente è educativo: insegna a riconoscere e prevenire
 * i problemi di scalabilità più comuni.
 */

interface BottleneckListProps {
  activeBottlenecks: Bottleneck[];
  allBottlenecks: Bottleneck[];
  currentUsers: number;
}

export function BottleneckList({ 
  activeBottlenecks, 
  allBottlenecks, 
  currentUsers 
}: BottleneckListProps) {
  const severityColors = {
    low: 'text-muted-foreground border-muted',
    medium: 'text-warning border-warning/30',
    high: 'text-destructive border-destructive/30'
  };
  
  const severityBg = {
    low: 'bg-muted/10',
    medium: 'bg-warning/10',
    high: 'bg-destructive/10'
  };
  
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">Colli di Bottiglia</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {activeBottlenecks.length} / {allBottlenecks.length} attivi
        </span>
      </div>
      
      {activeBottlenecks.length === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-success/5 border border-success/20">
          <CheckCircle className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-medium text-success">Sistema stabile</p>
            <p className="text-xs text-muted-foreground">
              Aumenta il carico per vedere i colli di bottiglia
            </p>
          </div>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {allBottlenecks.map((bottleneck) => {
            const isActive = activeBottlenecks.some(b => b.id === bottleneck.id);
            const colors = severityColors[bottleneck.severity];
            const bgColor = severityBg[bottleneck.severity];
            
            return (
              <AccordionItem 
                key={bottleneck.id} 
                value={bottleneck.id}
                className={cn(
                  'border rounded-lg overflow-hidden transition-all duration-300',
                  isActive ? colors : 'border-muted/50 opacity-50'
                )}
              >
                <AccordionTrigger 
                  className={cn(
                    'px-4 py-3 hover:no-underline',
                    isActive && bgColor
                  )}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      isActive ? (
                        bottleneck.severity === 'high' ? 'bg-destructive pulse-danger' :
                        bottleneck.severity === 'medium' ? 'bg-warning pulse-warning' :
                        'bg-muted-foreground'
                      ) : 'bg-muted'
                    )} />
                    <div>
                      <span className={cn(
                        'font-medium text-sm',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {bottleneck.name}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground font-mono">
                        @ {bottleneck.triggersAt.toLocaleString()} utenti
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    {bottleneck.description}
                  </p>
                  
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        Soluzione
                      </span>
                      <p className="text-sm text-foreground mt-1">
                        {bottleneck.solution}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
      
      {/* Progress verso il prossimo bottleneck */}
      {activeBottlenecks.length < allBottlenecks.length && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Prossimo bottleneck a{' '}
            <span className="font-mono text-warning">
              {allBottlenecks
                .filter(b => !activeBottlenecks.some(ab => ab.id === b.id))
                .sort((a, b) => a.triggersAt - b.triggersAt)[0]?.triggersAt.toLocaleString()}{' '}
              utenti
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
