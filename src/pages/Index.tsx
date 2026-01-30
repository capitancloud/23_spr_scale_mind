import { Activity, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { ResponseTimeChart } from '@/components/ResponseTimeChart';
import { UserSlider } from '@/components/UserSlider';
import { BottleneckList } from '@/components/BottleneckList';
import { StateComparison } from '@/components/StateComparison';
import { SystemGauge } from '@/components/SystemGauge';
import { SystemStatus } from '@/types/simulation';

/**
 * SCALEMIND - PAGINA PRINCIPALE
 * 
 * Questa app insegna i concetti di scalabilità attraverso simulazione visuale.
 * Non ci sono carichi reali: tutto è calcolato matematicamente per mostrare
 * come un sistema si comporta sotto stress crescente.
 * 
 * OBIETTIVI DIDATTICI:
 * 1. Capire come le metriche degradano con il carico
 * 2. Identificare i colli di bottiglia comuni
 * 3. Comprendere la differenza tra stato locale e stateless
 * 4. Sviluppare una mentalità "design for scale"
 */

function Index() {
  const {
    metrics,
    config,
    history,
    activeBottlenecks,
    allBottlenecks,
    setUserMultiplier,
    togglePause,
    reset
  } = useSimulation();
  
  /**
   * Determina lo stato del sistema basato sulle metriche.
   * Questo influenza colori e animazioni in tutta l'interfaccia.
   */
  const getSystemStatus = (): SystemStatus => {
    if (metrics.errorRate > 10 || metrics.responseTime > 500 || metrics.cpuUsage > 90) {
      return 'critical';
    }
    if (metrics.errorRate > 2 || metrics.responseTime > 200 || metrics.cpuUsage > 70) {
      return 'warning';
    }
    return 'healthy';
  };
  
  const systemStatus = getSystemStatus();
  
  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Glow effect di sfondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-1000"
          style={{
            background: systemStatus === 'critical' 
              ? 'radial-gradient(circle, hsl(0, 85%, 55%), transparent)'
              : systemStatus === 'warning'
              ? 'radial-gradient(circle, hsl(35, 100%, 50%), transparent)'
              : 'radial-gradient(circle, hsl(180, 100%, 50%), transparent)'
          }}
        />
      </div>
      
      <Header 
        isPaused={config.isPaused} 
        onTogglePause={togglePause} 
        onReset={reset} 
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Intro Banner */}
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Benvenuto in <span className="gradient-text">ScaleMind</span>
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Simula l'aumento di utenti e osserva come un sistema risponde sotto stress. 
                Impara a riconoscere i colli di bottiglia prima che diventino problemi reali.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-3 h-3 rounded-full ${
                systemStatus === 'healthy' ? 'bg-success pulse-healthy' :
                systemStatus === 'warning' ? 'bg-warning pulse-warning' :
                'bg-destructive pulse-danger'
              }`} />
              <span>Stato: {
                systemStatus === 'healthy' ? 'Sano' :
                systemStatus === 'warning' ? 'Attenzione' :
                'Critico'
              }</span>
            </div>
          </div>
        </div>
        
        {/* Grid principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonna sinistra - Controlli e Stato */}
          <div className="space-y-6">
            {/* Slider utenti */}
            <div className="animate-slide-in-right" style={{ animationDelay: '100ms' }}>
              <UserSlider
                multiplier={config.userMultiplier}
                onMultiplierChange={setUserMultiplier}
              />
            </div>
            
            {/* Gauges CPU e Memoria */}
            <div className="glass-card p-5 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
              <h3 className="font-semibold text-foreground mb-4">Risorse Sistema</h3>
              <div className="flex justify-around">
                <SystemGauge
                  value={metrics.cpuUsage}
                  label="CPU"
                  status={metrics.cpuUsage > 90 ? 'critical' : metrics.cpuUsage > 70 ? 'warning' : 'healthy'}
                />
                <SystemGauge
                  value={metrics.memoryUsage}
                  label="RAM"
                  status={metrics.memoryUsage > 90 ? 'critical' : metrics.memoryUsage > 70 ? 'warning' : 'healthy'}
                />
              </div>
            </div>
            
            {/* Comparazione Stato */}
            <div className="animate-slide-in-right" style={{ animationDelay: '300ms' }}>
              <StateComparison currentUsers={metrics.activeUsers} />
            </div>
          </div>
          
          {/* Colonna centrale - Metriche principali */}
          <div className="space-y-6">
            {/* Metriche cards */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Utenti"
                value={metrics.activeUsers.toLocaleString('it-IT')}
                icon={<Activity className="w-4 h-4" />}
                status={systemStatus}
                description="Utenti attivi simulati"
              />
              
              <MetricCard
                title="Richieste/s"
                value={metrics.requestsPerSecond.toLocaleString('it-IT')}
                icon={<TrendingUp className="w-4 h-4" />}
                status={systemStatus}
                description="Richieste al secondo"
              />
              
              <MetricCard
                title="Latenza"
                value={metrics.responseTime}
                unit="ms"
                icon={<Clock className="w-4 h-4" />}
                status={metrics.responseTime > 500 ? 'critical' : metrics.responseTime > 200 ? 'warning' : 'healthy'}
                trend={metrics.responseTime > 200 ? 'up' : 'stable'}
                description="Tempo di risposta medio"
              />
              
              <MetricCard
                title="Errori"
                value={metrics.errorRate}
                unit="%"
                icon={<AlertCircle className="w-4 h-4" />}
                status={metrics.errorRate > 10 ? 'critical' : metrics.errorRate > 2 ? 'warning' : 'healthy'}
                trend={metrics.errorRate > 5 ? 'up' : 'stable'}
                description="Tasso di errore"
              />
            </div>
            
            {/* Grafico tempo di risposta */}
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <ResponseTimeChart data={history} status={systemStatus} />
            </div>
            
            {/* Throughput */}
            <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Throughput Effettivo</h3>
                <span className="text-2xl font-bold tabular-nums text-primary">
                  {metrics.throughput.toLocaleString('it-IT')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Richieste elaborate con successo al secondo. Nota come il throughput 
                si stabilizza e poi degrada quando il sistema è sovraccarico.
              </p>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (metrics.throughput / 500) * 100)}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Colonna destra - Bottleneck */}
          <div className="animate-slide-in-right" style={{ animationDelay: '600ms' }}>
            <BottleneckList
              activeBottlenecks={activeBottlenecks}
              allBottlenecks={allBottlenecks}
              currentUsers={metrics.activeUsers}
            />
          </div>
        </div>
        
        {/* Footer educativo */}
        <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '700ms' }}>
          <p>
            💡 <strong>Ricorda:</strong> Questa è una simulazione. In un sistema reale, 
            i comportamenti sarebbero più complessi e dipenderebbero dall'architettura specifica.
          </p>
          <p className="mt-2">
            L'obiettivo è sviluppare intuizione sui pattern di scalabilità, non memorizzare numeri esatti.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Index;
