import { useState } from 'react';
import { Database, Globe, Server, RefreshCw, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * STATE COMPARISON COMPONENT
 * 
 * Questo componente visualizza la differenza fondamentale tra
 * architetture STATEFUL e STATELESS.
 * 
 * CONCETTI CHIAVE:
 * 
 * STATEFUL (Con Stato Locale):
 * - Il server memorizza informazioni sulla sessione utente
 * - L'utente deve sempre tornare allo stesso server ("sticky session")
 * - Se il server cade, i dati della sessione sono persi
 * - Difficile scalare orizzontalmente (aggiungere server)
 * 
 * STATELESS (Senza Stato):
 * - Il server non mantiene stato tra le richieste
 * - Ogni richiesta contiene tutte le informazioni necessarie (es: JWT token)
 * - Qualsiasi server può gestire qualsiasi richiesta
 * - Facile aggiungere/rimuovere server in base al carico
 * - Lo stato viene memorizzato esternamente (Redis, DB, etc.)
 */

interface StateComparisonProps {
  currentUsers: number;
}

export function StateComparison({ currentUsers }: StateComparisonProps) {
  const [selectedTab, setSelectedTab] = useState<'stateful' | 'stateless'>('stateful');
  
  // Simula il comportamento dei due approcci sotto carico
  const loadFactor = currentUsers / 100;
  
  // STATEFUL: performance degradano rapidamente, server limitati
  const statefulMetrics = {
    servers: Math.min(3, Math.ceil(loadFactor / 3)), // Max 3 server (sticky sessions)
    overhead: Math.min(80, 20 + loadFactor * 15), // Overhead memoria cresce
    faultTolerance: Math.max(10, 70 - loadFactor * 10), // Resilienza cala
    responseTime: Math.round(50 + Math.pow(loadFactor, 1.8) * 30),
    canScale: loadFactor < 3
  };
  
  // STATELESS: scala linearmente, overhead costante
  const statelessMetrics = {
    servers: Math.ceil(loadFactor / 2), // Scala liberamente
    overhead: 15, // Overhead fisso e basso
    faultTolerance: 95, // Alta resilienza
    responseTime: Math.round(50 + loadFactor * 5), // Cresce linearmente
    canScale: true
  };
  
  const metrics = selectedTab === 'stateful' ? statefulMetrics : statelessMetrics;
  
  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Stato Locale vs Stateless</h3>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedTab === 'stateful' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTab('stateful')}
          className={cn(
            'flex-1 transition-all',
            selectedTab === 'stateful' && 'bg-warning text-warning-foreground hover:bg-warning/90'
          )}
        >
          <Server className="w-4 h-4 mr-2" />
          Stateful
        </Button>
        <Button
          variant={selectedTab === 'stateless' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTab('stateless')}
          className={cn(
            'flex-1 transition-all',
            selectedTab === 'stateless' && 'bg-success text-success-foreground hover:bg-success/90'
          )}
        >
          <Globe className="w-4 h-4 mr-2" />
          Stateless
        </Button>
      </div>
      
      {/* Spiegazione */}
      <div className={cn(
        'p-4 rounded-lg mb-5 text-sm border',
        selectedTab === 'stateful' 
          ? 'bg-warning/5 border-warning/20 text-warning' 
          : 'bg-success/5 border-success/20 text-success'
      )}>
        {selectedTab === 'stateful' ? (
          <p>
            <strong>Stato Locale:</strong> Ogni server memorizza i dati della sessione. 
            L'utente deve tornare sempre allo stesso server. Se il server cade, 
            la sessione è persa.
          </p>
        ) : (
          <p>
            <strong>Stateless:</strong> I server non mantengono stato. Le informazioni 
            viaggiano con ogni richiesta (es: JWT). Qualsiasi server può rispondere. 
            Facile da scalare.
          </p>
        )}
      </div>
      
      {/* Visualizzazione Server */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Server attivi</span>
          <span className="font-mono text-sm">{metrics.servers}</span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: Math.min(metrics.servers, 10) }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                selectedTab === 'stateful' 
                  ? 'bg-warning/20 border border-warning/30' 
                  : 'bg-success/20 border border-success/30',
                'animate-scale-in'
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Server className={cn(
                'w-5 h-5',
                selectedTab === 'stateful' ? 'text-warning' : 'text-success'
              )} />
            </div>
          ))}
          
          {selectedTab === 'stateful' && !metrics.canScale && (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-destructive/30 bg-destructive/10">
              <span className="text-destructive text-lg">✕</span>
            </div>
          )}
          
          {selectedTab === 'stateless' && metrics.servers > 10 && (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-success/30 bg-success/10 text-success text-xs font-mono">
              +{metrics.servers - 10}
            </div>
          )}
        </div>
      </div>
      
      {/* Metriche di confronto */}
      <div className="space-y-4">
        {/* Overhead memoria */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Overhead Memoria
            </span>
            <span className={cn(
              'font-mono text-sm',
              metrics.overhead > 50 ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {metrics.overhead}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-500 rounded-full',
                metrics.overhead > 50 ? 'bg-destructive' : 'bg-primary'
              )}
              style={{ width: `${metrics.overhead}%` }}
            />
          </div>
        </div>
        
        {/* Fault Tolerance */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Resilienza ai Guasti
            </span>
            <span className={cn(
              'font-mono text-sm',
              metrics.faultTolerance < 50 ? 'text-destructive' : 'text-success'
            )}>
              {metrics.faultTolerance}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full transition-all duration-500 rounded-full',
                metrics.faultTolerance < 50 ? 'bg-destructive' : 'bg-success'
              )}
              style={{ width: `${metrics.faultTolerance}%` }}
            />
          </div>
        </div>
        
        {/* Response Time */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Tempo di Risposta
            </span>
            <span className={cn(
              'font-mono text-sm',
              metrics.responseTime > 200 ? 'text-warning' : 'text-muted-foreground'
            )}>
              {metrics.responseTime}ms
            </span>
          </div>
        </div>
      </div>
      
      {/* Avvertimento per stateful */}
      {selectedTab === 'stateful' && !metrics.canScale && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          ⚠️ Limite raggiunto! Le sticky sessions impediscono di scalare oltre.
        </div>
      )}
    </div>
  );
}
