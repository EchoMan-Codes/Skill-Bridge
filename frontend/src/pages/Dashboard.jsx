import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('assessment');
    if (!raw) {
      navigate('/assessment');
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  if (!data) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const { skillGap, name, careerGoal } = data;
  const { userSkills, requiredSkills, matchedSkills, missingSkills, matchPercentage } = skillGap;

  const barData = [
    { name: 'Your skills', count: userSkills.length, fill: '#0ea5e9' },
    { name: 'Required', count: requiredSkills.length, fill: '#6366f1' },
    { name: 'Matched', count: matchedSkills.length, fill: '#22c55e' },
    { name: 'Missing', count: missingSkills.length, fill: '#f59e0b' },
  ];

  let pieData = [
    { name: 'Matched', value: matchedSkills.length, color: '#22c55e' },
    { name: 'Missing', value: missingSkills.length, color: '#f59e0b' },
  ].filter((d) => d.value > 0);
  if (pieData.length === 0) pieData = [{ name: 'All matched', value: 1, color: '#22c55e' }];

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="absolute inset-0 bg-gradient-radial from-brand-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/assessment" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6">
            ← Back to assessment
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Skill gap for <span className="text-brand-400">{careerGoal}</span>
          </h1>
          {name && <p className="text-gray-400 mt-1">Hi, {name}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid gap-6"
        >
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Match score</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-brand-500 flex items-center justify-center bg-dark-800/50">
                <span className="text-3xl font-bold text-brand-400">{matchPercentage}%</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                You have {matchedSkills.length} of {requiredSkills.length} required skills. Focus on the missing skills to get job-ready.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis type="category" dataKey="name" stroke="#64748b" width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Matched vs missing</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Your skills</h3>
              <div className="flex flex-wrap gap-2">
                {userSkills.length ? userSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-sm">
                    {s}
                  </span>
                )) : <span className="text-gray-500 text-sm">None selected</span>}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Required</h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-white/10 text-gray-300 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Missing</h3>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length ? missingSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-sm">
                    {s}
                  </span>
                )) : <span className="text-green-400 text-sm">None — you're aligned!</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 text-white font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition"
            >
              Generate my roadmap
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
