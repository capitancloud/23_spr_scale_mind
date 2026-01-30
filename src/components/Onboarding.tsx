import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Server, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Lightbulb,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ONBOARDING COMPONENT
 * 
 * Introduce i concetti base della scalabilità per chi parte da zero.
 * Usa analogie del mondo reale per rendere tutto comprensibile.
 */

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: BookOpen,
    title: "Cos'è la Scalabilità?",
    content: "Immagina un ristorante. Con 10 clienti, tutto fila liscio. Ma cosa succede con 1000 clienti? La cucina non regge, i camerieri sono in tilt, i clienti aspettano ore. La scalabilità è la capacità di un sistema di gestire la crescita senza crollare.",
    highlight: "Un'app scalabile funziona bene con 10 utenti come con 10.000.",
    color: "primary"
  },
  {
    icon: Users,
    title: "Utenti e Richieste",
    content: "Ogni utente che usa la tua app fa 'richieste' al server: aprire una pagina, caricare un'immagine, salvare dati. Più utenti = più richieste = più lavoro per il server.",
    highlight: "100 utenti × 5 azioni/minuto = 500 richieste al minuto!",
    color: "accent"
  },
  {
    icon: Clock,
    title: "Tempo di Risposta",
    content: "È il tempo che passa tra quando clicchi un pulsante e quando vedi il risultato. Sotto carico, il server deve gestire tante richieste insieme e diventa più lento.",
    highlight: "Sotto 200ms = veloce ⚡ | Sopra 1 secondo = utenti frustrati 😤",
    color: "success"
  },
  {
    icon: AlertTriangle,
    title: "Colli di Bottiglia",
    content: "Come un'autostrada a 4 corsie che diventa 1 corsia: tutto si blocca. Nel software, può essere il database, la memoria, o il codice stesso. Identificarli è il primo passo per risolverli.",
    highlight: "Il collo di bottiglia più lento determina la velocità di tutto il sistema.",
    color: "warning"
  },
  {
    icon: Server,
    title: "Stateful vs Stateless",
    content: "Stateful: il server 'ricorda' chi sei (come un cameriere che ti riconosce). Stateless: ogni richiesta è indipendente (come prendere un numero al banco). Stateless scala meglio perché qualsiasi server può rispondere.",
    highlight: "Per scalare: preferisci sempre architetture stateless!",
    color: "secondary"
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;
  
  const handleNext = () => {
    if (isLastSlide) {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };
  
  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };
  
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/30',
    accent: 'from-accent/20 to-accent/5 border-accent/30',
    success: 'from-success/20 to-success/5 border-success/30',
    warning: 'from-warning/20 to-warning/5 border-warning/30',
    secondary: 'from-secondary/20 to-secondary/5 border-secondary/30'
  };
  
  const iconColorClasses = {
    primary: 'text-primary bg-primary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    secondary: 'text-secondary bg-secondary/10'
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
        >
          {/* Background animated gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl"
            />
          </div>
          
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`relative max-w-lg w-full glass-card p-8 border bg-gradient-to-b ${colorClasses[slide.color as keyof typeof colorClasses]}`}
          >
            {/* Skip button */}
            <button 
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${iconColorClasses[slide.color as keyof typeof iconColorClasses]}`}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
            
            {/* Content */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-4"
            >
              {slide.title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground leading-relaxed mb-4"
            >
              {slide.content}
            </motion.p>
            
            {/* Highlight box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/50 mb-6"
            >
              <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{slide.highlight}</p>
            </motion.div>
            
            {/* Progress dots */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: index === currentSlide ? 1.2 : 1,
                      backgroundColor: index === currentSlide 
                        ? 'hsl(var(--primary))' 
                        : index < currentSlide 
                        ? 'hsl(var(--muted-foreground))' 
                        : 'hsl(var(--muted))'
                    }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>
              
              <Button onClick={handleNext} className="gap-2">
                {isLastSlide ? 'Inizia!' : 'Avanti'}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
