import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Code, GitBranch, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

const getTrendLabel = (score: number) => {
  if (score >= 90) return 'Dominant';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Growing';
  return 'Emerging';
};

const CountrySidebar = () => {
  const { selectedCountry, setSelectedCountry } = useStore();

  return (
    <AnimatePresence>
      {selectedCountry && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={() => setSelectedCountry(null)}
          />

          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] z-50 overflow-y-auto"
          >
            <div className="min-h-full bg-gradient-to-br from-purple-900/30 via-black/40 to-cyan-900/30 backdrop-blur-xl border-l border-cyan-500/30 shadow-2xl shadow-cyan-500/20">

              <div className="p-6 md:p-8 space-y-6">

                <div className="flex justify-between items-start">
                  <div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                    >
                      {selectedCountry.name}
                    </motion.h2>

                    <p className="text-purple-300 mt-1 text-sm">
                      {selectedCountry.code}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCountry(null)}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50"
                  >
                    <X className="w-5 h-5 text-cyan-400" />
                  </motion.button>
                </div>

                <div className="glass-card p-5 border border-cyan-500/30 rounded-2xl bg-black/40">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-cyan-300">
                      Tech Trends
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.techTrends.map((trend, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full text-sm text-purple-200 border border-purple-400/30 hover:border-cyan-400/50"
                      >
                        {trend}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div
                  className="glass-card p-5 border border-purple-500/30 rounded-2xl bg-black/40"
                  title="Global popularity index derived from developer usage, hiring demand and ecosystem growth"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-purple-300">
                      Programming Languages
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 mb-4">
                    Based on global usage, hiring demand and ecosystem growth.
                  </p>

                  <div className="space-y-4">
                    {selectedCountry.programmingLanguages.map((lang, idx) => {
                      const label = getTrendLabel(lang.score);

                      return (
                        <motion.div
                          key={idx}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-gray-200">{lang.name}</span>

                            <div className="flex items-center gap-2">
                              <span className="text-cyan-400 font-mono">
                                {lang.score}
                              </span>

                              <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                                {label}
                              </span>
                            </div>
                          </div>

                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.score}%` }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="h-full rounded-full"
                              style={{
                                background:
                                  'linear-gradient(90deg, #a855f7, #22d3ee)',
                                boxShadow:
                                  '0 0 12px rgba(34, 211, 238, 0.7)',
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass-card p-5 border border-cyan-500/30 rounded-2xl bg-black/40">
                  <div className="flex items-center gap-2 mb-4">
                    <GitBranch className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-cyan-300">
                      GitHub Activity
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      label="Repositories"
                      value={`${(selectedCountry.githubActivity.repositories / 1_000_000).toFixed(1)}M`}
                    />
                    <StatCard
                      label="Developers"
                      value={`${(selectedCountry.githubActivity.developers / 1_000_000).toFixed(1)}M`}
                    />
                    <div className="col-span-2">
                      <StatCard
                        label="YoY Growth"
                        value={selectedCountry.githubActivity.growth}
                      />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-5 border border-cyan-500/30 rounded-2xl bg-black/40">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-cyan-300">
                      Key Insights
                    </h3>
                  </div>

                  <ul className="space-y-2">
                    {selectedCountry.insights.map((insight, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-2 text-sm text-gray-300"
                      >
                        <span className="text-cyan-400">▸</span>
                        {insight}
                      </motion.li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CountrySidebar;

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30">
    <p className="text-purple-300 text-xs mb-1">{label}</p>
    <p className="text-2xl font-bold text-cyan-400">{value}</p>
  </div>
);