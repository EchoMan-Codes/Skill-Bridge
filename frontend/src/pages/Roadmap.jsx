import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateRoadmap } from '../api/client';

export default function Roadmap() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('assessment');
    if (!raw) {
      navigate('/assessment');
      return;
    }
    const data = JSON.parse(raw);
    const { skillGap, careerGoal } = data;
    generateRoadmap({
      userSkills: skillGap.userSkills,
      careerGoal,
      missingSkills: skillGap.missingSkills,
    })
      .then((res) => setRoadmap(res))
      .catch((err) => setError(err.response?.data?.error || err.message || 'Failed to generate roadmap'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Generating your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/dashboard" className="text-brand-400 hover:underline">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const weeks = roadmap?.weeks || [];

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="absolute inset-0 bg-gradient-radial from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6">
            ← Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Your learning roadmap
          </h1>
          <p className="text-gray-400 mt-1">
            {roadmap?.generatedWithMock
              ? 'Demo roadmap (add OPENAI_API_KEY for AI-generated content)'
              : 'AI-generated plan tailored to your gap'}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-8">
            {weeks.map((w, i) => (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative flex gap-6"
              >
                <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {w.week}
                </div>
                <div className="flex-1 glass rounded-2xl p-6 pb-8">
                  <h2 className="text-lg font-semibold text-white mb-3">{w.title}</h2>
                  <ul className="space-y-2 mb-4">
                    {(w.topics || []).map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-brand-400 mt-0.5">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-brand-300/90 font-medium">
                    Practice: {w.practice}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm"
          >
            ← Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
