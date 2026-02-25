import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Code, GitBranch, Rocket, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSelectedCountry(null)}
          />

          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] z-50 overflow-y-auto"
          >
            <div className="min-h-full bg-gradient-to-br from-purple-900/30 via-black/40 to-cyan-900/30 backdrop-blur-xl border-l border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                    >
                      {selectedCountry.name}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="text-purple-300 mt-1 text-sm"
                    >
                      {selectedCountry.code}
                    </motion.p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCountry(null)}
                    className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/40 transition-colors border border-purple-500/50"
                  >
                    <X className="w-5 h-5 text-cyan-400" />
                  </motion.button>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="glass-card p-5 border border-cyan-500/30 rounded-2xl bg-black/40">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-cyan-300">Tech Trends</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountry.techTrends.map((trend, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                          className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full text-sm text-purple-200 border border-purple-400/30 hover:border-cyan-400/50 transition-all"
                        >
                          {trend}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5 border border-purple-500/30 rounded-2xl bg-black/40">
                    <div className="flex items-center gap-2 mb-4">
                      <Code className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-purple-300">Programming Languages</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedCountry.programmingLanguages.map((lang, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                          className="space-y-1"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{lang.name}</span>
                            <span className="text-cyan-400 font-mono">{lang.popularity}%</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.popularity}%` }}
                              transition={{ delay: 0.5 + idx * 0.05, duration: 0.6 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                              style={{
                                boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5 border border-cyan-500/30 rounded-2xl bg-black/40">
                    <div className="flex items-center gap-2 mb-4">
                      <GitBranch className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-cyan-300">GitHub Activity</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30">
                        <p className="text-purple-300 text-xs mb-1">Repositories</p>
                        <p className="text-2xl font-bold text-cyan-400">
                          {(selectedCountry.githubActivity.repositories / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30">
                        <p className="text-purple-300 text-xs mb-1">Developers</p>
                        <p className="text-2xl font-bold text-cyan-400">
                          {(selectedCountry.githubActivity.developers / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="col-span-2 bg-cyan-900/20 p-4 rounded-xl border border-cyan-500/30">
                        <p className="text-cyan-300 text-xs mb-1">YoY Growth</p>
                        <p className="text-2xl font-bold text-purple-400">
                          {selectedCountry.githubActivity.growth}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-5 border border-purple-500/30 rounded-2xl bg-black/40">
                    <div className="flex items-center gap-2 mb-4">
                      <Rocket className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-purple-300">Startup Ecosystem</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded-lg">
                        <span className="text-gray-300 text-sm">Unicorns</span>
                        <span className="text-cyan-400 font-bold text-lg">
                          {selectedCountry.startupEcosystem.unicorns}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-900/20 rounded-lg">
                        <span className="text-gray-300 text-sm">Total Funding</span>
                        <span className="text-cyan-400 font-bold text-lg">
                          {selectedCountry.startupEcosystem.funding}
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-purple-300 text-sm mb-2">Hot Sectors</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCountry.startupEcosystem.hotSectors.map((sector, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-xs text-cyan-200 border border-cyan-400/30"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-5 border border-cyan-500/30 rounded-2xl bg-black/40">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-cyan-300">Key Insights</h3>
                    </div>
                    <ul className="space-y-2">
                      {selectedCountry.insights.map((insight, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 + idx * 0.05 }}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <span className="text-cyan-400 mt-1">▸</span>
                          <span>{insight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CountrySidebar;
