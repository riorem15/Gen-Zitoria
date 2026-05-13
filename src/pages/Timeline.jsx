import { historyPhases } from '../data/historyContent';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Timeline() {
  const timelineEvents = historyPhases.flatMap(phase => phase.chapters);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4">
      <div className="text-center mb-12 mt-8">
        <h2 className="text-3xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
          <Clock className="text-primary w-8 h-8 md:w-12 md:h-12 animate-pulse" />
          <span className="text-gen">Mesin</span> Waktu
        </h2>
        <p className="text-on-surface opacity-80 text-lg max-w-2xl mx-auto">
          Eksplorasi jejak sejarah bangsa dari ujung ke ujung. Telusuri rentetan peristiwanya.
        </p>
      </div>

      <div className="relative wrap overflow-hidden p-2 md:p-10 h-full">
        {/* Center vertical line */}
        <div className="absolute border-opacity-20 border-primary h-full border-l-4 left-6 md:left-1/2 -ml-2 rounded-full"></div>

        {timelineEvents.map((event, index) => {
          const isLeft = index % 2 === 0;
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={event.id} 
              className={`mb-12 flex justify-between items-center w-full ${isLeft ? 'flex-row-reverse md:flex-row-reverse' : 'md:flex-row'} flex-row`}
            >
              <div className="order-1 hidden md:block md:w-5/12"></div>
              
              <div className="z-20 flex items-center order-1 bg-gradient-to-br from-primary to-secondary shadow-xl w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-background shrink-0 -ml-1.5 md:ml-0">
                <h1 className="mx-auto font-black text-sm md:text-lg text-white">{index + 1}</h1>
              </div>
              
              <div className="order-1 glass-panel rounded-2xl shadow-xl w-[calc(100%-4rem)] md:w-5/12 px-6 py-6 border-l-4 border-l-primary relative group hover:-translate-y-2 transition-transform">
                <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-8xl pointer-events-none group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <h3 className="mb-3 font-bold text-xl md:text-2xl text-on-surface">{event.title}</h3>
                <p className="text-sm leading-relaxed opacity-70">
                  {event.summary}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
