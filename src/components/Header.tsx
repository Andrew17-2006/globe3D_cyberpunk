import { motion } from 'framer-motion';
import { Globe2, Info } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-30 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 border border-cyan-500/30 rounded-2xl bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Globe2 className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  GlobalPulse
                </h1>
                <p className="text-xs text-purple-300">Tech Intelligence Platform</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full border border-purple-400/50 transition-colors"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 hidden md:inline">
                Click a country to explore
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
