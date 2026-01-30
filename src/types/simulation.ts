/**
 * SCALEMIND TYPES
 * 
 * Questi tipi definiscono la struttura dei dati per la simulazione di scalabilità.
 * Tutto è simulato - non ci sono carichi reali sul sistema.
 */

// Metriche del sistema simulate
export interface SystemMetrics {
  // Numero di utenti connessi (simulato)
  activeUsers: number;
  
  // Richieste al secondo (simulate)
  requestsPerSecond: number;
  
  // Tempo di risposta medio in ms (calcolato in base al carico)
  responseTime: number;
  
  // Percentuale di errori (aumenta con il carico)
  errorRate: number;
  
  // Utilizzo CPU simulato (0-100)
  cpuUsage: number;
  
  // Utilizzo memoria simulato (0-100)
  memoryUsage: number;
  
  // Throughput: richieste processate con successo
  throughput: number;
}

// Stato del sistema basato sulle metriche
export type SystemStatus = 'healthy' | 'warning' | 'critical';

// Punto dati per i grafici storici
export interface MetricDataPoint {
  timestamp: number;
  value: number;
}

// Configurazione della simulazione
export interface SimulationConfig {
  // Moltiplicatore utenti (1x, 10x, 100x, 1000x)
  userMultiplier: number;
  
  // Velocità della simulazione (ms tra aggiornamenti)
  tickRate: number;
  
  // Se la simulazione è in pausa
  isPaused: boolean;
}

/**
 * STATO LOCALE vs STATELESS
 * 
 * Uno dei concetti chiave della scalabilità è la differenza tra
 * applicazioni con stato (stateful) e senza stato (stateless).
 * 
 * STATO LOCALE (Stateful):
 * - I dati della sessione utente sono memorizzati sul server
 * - Ogni utente deve tornare sempre allo stesso server
 * - Problema: se il server cade, i dati sono persi
 * - Problema: difficile aggiungere nuovi server (sticky sessions)
 * 
 * STATELESS:
 * - Il server non memorizza dati tra le richieste
 * - Ogni richiesta contiene tutte le informazioni necessarie
 * - Qualsiasi server può gestire qualsiasi richiesta
 * - Facile aggiungere/rimuovere server (scalabilità orizzontale)
 */
export interface StateComparison {
  type: 'stateful' | 'stateless';
  
  // Simulazione: quanti server possono gestire il carico
  serverCapacity: number;
  
  // Simulazione: overhead per gestire lo stato
  overhead: number;
  
  // Simulazione: resilienza ai guasti (0-100)
  faultTolerance: number;
}

// Bottleneck identificato nella simulazione
export interface Bottleneck {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  
  // A quale livello di carico appare
  triggersAt: number;
  
  // Suggerimento per risolverlo
  solution: string;
}
