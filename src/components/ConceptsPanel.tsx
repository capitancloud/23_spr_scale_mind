import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  ChevronRight, 
  Database, 
  Globe, 
  Server, 
  Zap,
  Scale,
  GitBranch,
  HardDrive,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * CONCEPTS PANEL
 * 
 * Pannello laterale con glossario dei termini di scalabilità.
 * Ogni concetto ha una spiegazione semplice per principianti.
 */

const concepts = [
  {
    id: 'scalability',
    icon: Scale,
    term: 'Scalabilità',
    simple: 'La capacità di crescere senza problemi',
    detailed: 'Un sistema scalabile può gestire 10 o 10.000 utenti senza cambiare il codice. È come un ristorante che può aggiungere tavoli e camerieri quando serve.',
    example: 'Netflix scala da 1 milione a 200 milioni di utenti aggiungendo server.'
  },
  {
    id: 'horizontal',
    icon: GitBranch,
    term: 'Scalabilità Orizzontale',
    simple: 'Aggiungere più server',
    detailed: 'Invece di potenziare un server (verticale), aggiungi più server che lavorano insieme. È più economico e resiliente.',
    example: 'Passare da 1 server potente a 10 server normali che si dividono il lavoro.'
  },
  {
    id: 'vertical',
    icon: Server,
    term: 'Scalabilità Verticale',
    simple: 'Potenziare il server esistente',
    detailed: 'Aumentare CPU, RAM o disco del server attuale. Semplice ma ha un limite fisico e un singolo punto di fallimento.',
    example: 'Passare da 8GB a 64GB di RAM sullo stesso server.'
  },
  {
    id: 'stateless',
    icon: Globe,
    term: 'Stateless',
    simple: 'Il server non ricorda nulla',
    detailed: 'Ogni richiesta contiene tutto il necessario (es: token JWT). Qualsiasi server può rispondere. Perfetto per scalare orizzontalmente.',
    example: 'Il tuo token di login viaggia con ogni richiesta, non è salvato sul server.'
  },
  {
    id: 'stateful',
    icon: HardDrive,
    term: 'Stateful',
    simple: 'Il server ricorda chi sei',
    detailed: 'Lo stato della sessione è salvato sul server. Devi sempre tornare allo stesso server (sticky session). Difficile da scalare.',
    example: 'Il carrello salvato nella sessione sul server A non esiste sul server B.'
  },
  {
    id: 'latency',
    icon: Zap,
    term: 'Latenza',
    simple: 'Tempo di attesa',
    detailed: 'Il tempo tra quando fai click e quando vedi il risultato. Include: rete, elaborazione server, database query, rendering.',
    example: 'Click → 50ms rete → 100ms server → 30ms DB → 20ms render = 200ms totali'
  },
  {
    id: 'throughput',
    icon: Database,
    term: 'Throughput',
    simple: 'Quante richieste al secondo',
    detailed: 'Il numero di richieste che il sistema può processare in un secondo. Alto throughput = sistema efficiente.',
    example: 'Un server che gestisce 1000 req/s ha throughput maggiore di uno che ne gestisce 100.'
  }
];

interface ConceptsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConceptsPanel({ isOpen, onClose }: ConceptsPanelProps) {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-card border-l border-border/50 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Book className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Glossario</h2>
                  <p className="text-xs text-muted-foreground">Termini di scalabilità spiegati semplici</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Concepts list */}
            <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-80px)]">
              {concepts.map((concept, index) => {
                const Icon = concept.icon;
                const isExpanded = expandedConcept === concept.id;
                
                return (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => setExpandedConcept(isExpanded ? null : concept.id)}
                      className={cn(
                        'w-full text-left p-4 rounded-lg border transition-all',
                        isExpanded 
                          ? 'bg-primary/5 border-primary/30' 
                          : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'p-2 rounded-lg transition-colors',
                            isExpanded ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{concept.term}</h3>
                            <p className="text-xs text-muted-foreground">{concept.simple}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-border/50 space-y-3">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {concept.detailed}
                              </p>
                              <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-medium text-foreground">Esempio: </span>
                                  {concept.example}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
