import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * TRAFFIC FLOW ANIMATION
 * 
 * Visualizza il flusso delle richieste come particelle che viaggiano
 * da sinistra (utenti) a destra (server).
 * 
 * Quando il sistema è sotto stress, le particelle rallentano,
 * si accumulano, e alcune diventano rosse (errori).
 */

interface TrafficFlowProps {
  requestsPerSecond: number;
  errorRate: number;
  responseTime: number;
}

export function TrafficFlow({ requestsPerSecond, errorRate, responseTime }: TrafficFlowProps) {
  // Calcola parametri visuali basati sulle metriche
  const particleCount = Math.min(20, Math.max(5, Math.floor(requestsPerSecond / 50)));
  const speed = Math.max(1, 5 - (responseTime / 200)); // Più lento con response time alto
  const congestion = Math.min(1, responseTime / 500); // 0-1 livello congestione
  
  return (
    <div className="glass-card p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Flusso Richieste</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Richieste
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            Errori
          </span>
        </div>
      </div>
      
      {/* Descrizione per principianti */}
      <p className="text-xs text-muted-foreground mb-4">
        Ogni pallino è una richiesta utente. Osserva come rallentano e diventano rosse quando il sistema è sovraccarico.
      </p>
      
      {/* Container animazione */}
      <div className="relative h-24 bg-muted/20 rounded-lg border border-border/50 overflow-hidden">
        {/* Labels */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium z-10">
          👥 Utenti
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium z-10">
          🖥️ Server
        </div>
        
        {/* Linea centrale di flusso */}
        <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-border/50 -translate-y-1/2" />
        
        {/* Zona di congestione (si riempie quando il sistema è lento) */}
        <motion.div
          animate={{ 
            width: `${congestion * 60}%`,
            opacity: congestion * 0.5
          }}
          transition={{ duration: 0.5 }}
          className="absolute right-12 top-0 bottom-0 bg-gradient-to-l from-warning/20 to-transparent"
        />
        
        {/* Particelle animate */}
        {Array.from({ length: particleCount }).map((_, i) => {
          const isError = Math.random() < (errorRate / 100);
          const yOffset = (Math.random() - 0.5) * 40;
          const delay = i * (2 / particleCount);
          
          return (
            <motion.div
              key={i}
              initial={{ x: 48, opacity: 0 }}
              animate={{
                x: ['48px', 'calc(100% - 48px)'],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: speed,
                delay: delay,
                repeat: Infinity,
                ease: congestion > 0.5 ? "easeIn" : "linear"
              }}
              style={{ top: `calc(50% + ${yOffset}px)` }}
              className="absolute"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: isError 
                    ? ['0 0 5px hsl(0, 85%, 55%)', '0 0 15px hsl(0, 85%, 55%)', '0 0 5px hsl(0, 85%, 55%)']
                    : ['0 0 5px hsl(180, 100%, 50%)', '0 0 10px hsl(180, 100%, 50%)', '0 0 5px hsl(180, 100%, 50%)']
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className={cn(
                  'w-3 h-3 rounded-full',
                  isError ? 'bg-destructive' : 'bg-primary'
                )}
              />
            </motion.div>
          );
        })}
        
        {/* Indicatore congestione */}
        {congestion > 0.3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-14 px-2 py-1 rounded bg-warning/20 border border-warning/30 text-warning text-xs font-medium"
          >
            ⚠️ Congestione
          </motion.div>
        )}
      </div>
      
      {/* Legenda metriche */}
      <div className="flex justify-between mt-4 text-xs text-muted-foreground">
        <span>Velocità: {speed.toFixed(1)}x</span>
        <span>Congestione: {(congestion * 100).toFixed(0)}%</span>
        <span>Errori: {errorRate.toFixed(1)}%</span>
      </div>
    </div>
  );
}
