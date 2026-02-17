import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function Hero3DFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 blur-3xl animate-float" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/20 blur-[80px] animate-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-brand-500/20 blur-[60px] animate-float" style={{ animationDelay: '-4s' }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-transparent to-dark-900" />
    </div>
  );
}

function AuthModal({ mode, onClose, onSwitch, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register({ name, email, password });
        onSuccess?.();
        onClose();
        navigate('/assessment');
      } else {
        await login({ email, password });
        onClose();
        navigate('/assessment');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      const isNetwork = !err.response && (err.message === 'Network Error' || err.code === 'ERR_NETWORK');
      const is404 = err.response?.status === 404;
      setError(
        isNetwork || is404
          ? 'Backend not reachable. Open a terminal: cd backend && npm run dev (need MongoDB running)'
          : (msg || (isRegister ? 'Registration failed' : 'Login failed'))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl w-full max-w-md p-8 shadow-2xl relative"
      >
        <h2 className="text-xl font-bold text-white mb-6">
          {isRegister ? 'Create account' : 'Welcome back'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white focus:border-brand-500 outline-none"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white focus:border-brand-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white focus:border-brand-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 text-white font-semibold disabled:opacity-60"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={onSwitch} className="text-brand-400 hover:underline">
            {isRegister ? 'Log in' : 'Register'}
          </button>
        </p>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Landing() {
  const [authMode, setAuthMode] = useState(null);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.15),transparent)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-xl font-semibold tracking-tight">
          Skill<span className="text-brand-400">Bridge</span>
        </motion.span>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-gray-400 text-sm hidden sm:inline">{user.name}</span>
              <Link to="/assessment" className="px-4 py-2 rounded-lg bg-brand-500/20 text-brand-300 font-medium hover:bg-brand-500/30 transition">
                Go to App
              </Link>
              <button onClick={logout} className="px-4 py-2 rounded-lg glass text-sm text-gray-400 hover:text-white transition">
                Log out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setAuthMode('login')} className="px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-white/10 transition">
                Sign In
              </button>
              <button onClick={() => setAuthMode('register')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-brand-500/25 transition">
                Register
              </button>
            </>
          )}
        </motion.div>
      </header>

      <section className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center px-6 text-center pt-12">
        <Hero3DFallback />
        <div className="relative z-10 space-y-8">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-brand-300">Know Your Gap.</span>
            <br />
            <span className="text-brand-400">Build Your Path.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            The platform that bridges the gap between your current skills and industry demand. Get a personalized AI roadmap and a career assistant—built for students and judged by experts.
          </motion.p>
          {!user && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-500 text-sm">
              Register first, then log in to start your assessment.
            </motion.p>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {user ? (
              <Link to="/assessment" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition hover:scale-[1.02]">
                Start Skill Assessment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            ) : (
              <button onClick={() => setAuthMode('register')} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 text-white font-semibold text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition hover:scale-[1.02]">
                Get started — Register free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl font-bold text-white text-center mb-12">
            Why judges and students choose SkillBridge
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Assess', desc: 'Select your current skills and target role. Clear, fast, no guesswork.', icon: '📊' },
              { title: 'Analyze', desc: 'See the exact gap between you and job-ready skills with charts and metrics.', icon: '🎯' },
              { title: 'Roadmap + AI', desc: 'Personalized learning plan and an AI assistant for career questions.', icon: '🗺️' },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 hover:bg-white/10 transition">
                <span className="text-3xl mb-3 block">{card.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xl font-bold text-white mb-6">
            12+ career roles • Skill gap analysis • AI roadmap • In-app career chatbot
          </motion.h2>
          <p className="text-gray-500 text-sm">
            Software Developer • Data Analyst • ML Engineer • Web Developer • Full Stack • Frontend • Backend • DevOps • Cloud • Product Manager • Data Engineer • QA
          </p>
        </div>
      </section>

      <footer className="relative z-10 py-8 text-center text-gray-500 text-sm">
        SkillBridge — Skill Gap Analysis & Personalized Career Roadmap
      </footer>

      <AnimatePresence>
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSwitch={() => setAuthMode((m) => (m === 'register' ? 'login' : 'register'))}
            onSuccess={() => setAuthMode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
