import { useState, useEffect, useCallback, useRef } from 'react';
import { SystemMetrics, SimulationConfig, Bottleneck, MetricDataPoint } from '@/types/simulation';

/**
 * HOOK DI SIMULAZIONE SCALABILITÀ
 * 
 * Questo hook simula il comportamento di un sistema sotto carico crescente.
 * IMPORTANTE: Tutto è simulato matematicamente, non c'è nessun carico reale.
 * 
 * La simulazione mostra come le metriche degradano quando il numero di utenti
 * supera la capacità del sistema, evidenziando i colli di bottiglia tipici.
 */

// Capacità base del sistema (utenti che può gestire senza problemi)
const BASE_CAPACITY = 100;

// Bottleneck predefiniti che appaiono a diversi livelli di carico
const BOTTLENECKS: Bottleneck[] = [
  {
    id: 'db-connections',
    name: 'Pool Connessioni DB',
    description: 'Il database ha un numero limitato di connessioni simultanee. Superato il limite, le richieste devono attendere.',
    severity: 'medium',
    triggersAt: 500,
    solution: 'Implementa connection pooling e considera read replicas per distribuire il carico.'
  },
  {
    id: 'memory-leak',
    name: 'Consumo Memoria',
    description: 'Lo stato locale accumula dati in memoria. Con molti utenti, la memoria si esaurisce.',
    severity: 'high',
    triggersAt: 1000,
    solution: 'Passa a un\'architettura stateless con sessioni esterne (Redis) o JWT.'
  },
  {
    id: 'single-thread',
    name: 'Single Thread Blocking',
    description: 'Operazioni sincrone bloccano il thread principale, rallentando tutte le richieste.',
    severity: 'high',
    triggersAt: 2000,
    solution: 'Usa code di messaggi (RabbitMQ, SQS) per operazioni lunghe e workers asincroni.'
  },
  {
    id: 'no-cache',
    name: 'Cache Assente',
    description: 'Ogni richiesta interroga il database. Con traffico alto, il DB diventa il collo di bottiglia.',
    severity: 'medium',
    triggersAt: 800,
    solution: 'Implementa caching multi-livello: CDN per assets, Redis per dati, browser cache.'
  },
  {
    id: 'monolith',
    name: 'Architettura Monolitica',
    description: 'Un singolo servizio gestisce tutto. Un picco in una funzione impatta tutto il sistema.',
    severity: 'low',
    triggersAt: 3000,
    solution: 'Considera microservizi per isolare i carichi e scalare indipendentemente.'
  }
];

/**
 * Calcola le metriche simulate basandosi sul numero di utenti.
 * Le formule simulano degradazione realistica delle performance.
 */
function calculateMetrics(users: number): SystemMetrics {
  // Fattore di carico: quanto siamo oltre la capacità base
  const loadFactor = users / BASE_CAPACITY;
  
  // Richieste per secondo: ogni utente fa ~2-5 richieste/sec
  const rps = users * (2 + Math.random() * 3);
  
  /**
   * TEMPO DI RISPOSTA
   * Formula: cresce esponenzialmente quando superiamo la capacità
   * Base: 50ms, aumenta drammaticamente sopra il 100% di carico
   */
  const baseResponseTime = 50;
  const responseTime = loadFactor <= 1 
    ? baseResponseTime + (loadFactor * 20) + (Math.random() * 10)
    : baseResponseTime + Math.pow(loadFactor, 2.5) * 50 + (Math.random() * 100);
  
  /**
   * TASSO DI ERRORE
   * Sotto capacità: ~0.1% (errori fisiologici)
   * Sopra capacità: cresce rapidamente fino al 50%+
   */
  const errorRate = loadFactor <= 1
    ? 0.1 + (Math.random() * 0.2)
    : Math.min(50, Math.pow(loadFactor - 1, 2) * 5 + (Math.random() * 5));
  
  /**
   * CPU & MEMORIA
   * Crescono linearmente fino al 70%, poi accelerano
   */
  const cpuUsage = Math.min(100, loadFactor * 30 + (loadFactor > 1 ? (loadFactor - 1) * 40 : 0) + (Math.random() * 5));
  const memoryUsage = Math.min(100, loadFactor * 25 + (loadFactor > 1 ? (loadFactor - 1) * 35 : 0) + (Math.random() * 3));
  
  /**
   * THROUGHPUT
   * Cresce con gli utenti fino alla capacità, poi si stabilizza e cala
   */
  const maxThroughput = BASE_CAPACITY * 5;
  const throughput = loadFactor <= 1
    ? rps * (1 - errorRate / 100)
    : maxThroughput * (1 - (errorRate / 100)) * (1 / Math.sqrt(loadFactor));
  
  return {
    activeUsers: users,
    requestsPerSecond: Math.round(rps),
    responseTime: Math.round(responseTime),
    errorRate: Number(errorRate.toFixed(2)),
    cpuUsage: Math.round(cpuUsage),
    memoryUsage: Math.round(memoryUsage),
    throughput: Math.round(throughput)
  };
}

export function useSimulation() {
  // Configurazione della simulazione
  const [config, setConfig] = useState<SimulationConfig>({
    userMultiplier: 1,
    tickRate: 1000,
    isPaused: false
  });
  
  // Metriche correnti
  const [metrics, setMetrics] = useState<SystemMetrics>(() => calculateMetrics(10));
  
  // Storico per i grafici (ultimi 60 punti)
  const [history, setHistory] = useState<MetricDataPoint[]>([]);
  
  // Bottleneck attivi
  const [activeBottlenecks, setActiveBottlenecks] = useState<Bottleneck[]>([]);
  
  // Ref per il timer
  const timerRef = useRef<number | null>(null);
  
  // Numero base di utenti (simulato)
  const baseUsers = 10;
  
  /**
   * Calcola il numero totale di utenti basato sul moltiplicatore.
   * Aggiunge anche una piccola variazione casuale per realismo.
   */
  const totalUsers = Math.round(baseUsers * config.userMultiplier * (0.95 + Math.random() * 0.1));
  
  /**
   * Aggiorna le metriche ad ogni tick della simulazione.
   */
  const tick = useCallback(() => {
    if (config.isPaused) return;
    
    const newMetrics = calculateMetrics(totalUsers);
    setMetrics(newMetrics);
    
    // Aggiorna lo storico (mantieni ultimi 60 punti)
    setHistory(prev => {
      const newPoint: MetricDataPoint = {
        timestamp: Date.now(),
        value: newMetrics.responseTime
      };
      const updated = [...prev, newPoint];
      return updated.slice(-60);
    });
    
    // Verifica quali bottleneck sono attivi
    const active = BOTTLENECKS.filter(b => totalUsers >= b.triggersAt);
    setActiveBottlenecks(active);
  }, [totalUsers, config.isPaused]);
  
  // Gestisce il loop della simulazione
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (!config.isPaused) {
      timerRef.current = window.setInterval(tick, config.tickRate);
      tick(); // Esegui subito
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [tick, config.tickRate, config.isPaused]);
  
  /**
   * Imposta il moltiplicatore utenti.
   * Valori tipici: 1, 10, 100, 1000
   */
  const setUserMultiplier = useCallback((multiplier: number) => {
    setConfig(prev => ({ ...prev, userMultiplier: multiplier }));
  }, []);
  
  /**
   * Pausa/Riprende la simulazione.
   */
  const togglePause = useCallback(() => {
    setConfig(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);
  
  /**
   * Reset completo della simulazione.
   */
  const reset = useCallback(() => {
    setConfig({
      userMultiplier: 1,
      tickRate: 1000,
      isPaused: false
    });
    setHistory([]);
    setActiveBottlenecks([]);
  }, []);
  
  return {
    metrics,
    config,
    history,
    activeBottlenecks,
    allBottlenecks: BOTTLENECKS,
    setUserMultiplier,
    togglePause,
    reset
  };
}
