import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { submitAssessment } from '../api/client';

const SKILLS = [
  'Python',
  'Java',
  'DSA',
  'SQL',
  'Web Development',
  'Machine Learning',
  'Communication',
  'Git',
  'REST APIs',
  'Excel',
  'Statistics',
  'Data Visualization',
  'JavaScript',
  'HTML/CSS',
  'React',
  'Deep Learning',
  'Problem Solving',
  'Node.js',
  'Linux',
  'Docker',
  'CI/CD',
  'AWS',
  'Azure',
  'GCP',
  'Kubernetes',
  'ETL',
  'Testing',
  'Automation',
  'Agile',
  'Product Strategy',
  'Scripting',
  'Responsive Design',
  'Networking',
  'Roadmapping',
  'User Research',
];

const ROLES = [
  'Software Developer',
  'Data Analyst',
  'ML Engineer',
  'Web Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Product Manager',
  'Data Engineer',
  'QA / Test Engineer',
];

export default function Assessment() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [careerGoal, setCareerGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (s) => {
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const handleSubmit = async () => {
    if (!careerGoal) {
      setError('Please select a career goal.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await submitAssessment({ name: name || 'User', skills, careerGoal });
      const payload = {
        skillGap: res.skillGap,
        name: name || 'User',
        careerGoal,
        userId: res.userId,
      };
      sessionStorage.setItem('assessment', JSON.stringify(payload));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Submission failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="absolute inset-0 bg-gradient-radial from-brand-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-8">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-300">
            Skill Assessment
          </h1>
          <p className="text-gray-400 mt-2">Select your current skills and career goal.</p>
        </motion.div>

        <div className="glass rounded-2xl p-6 md:p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Your name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">Your current skills (multi-select)</label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    skills.includes(s)
                      ? 'bg-brand-500 text-white border border-brand-400'
                      : 'glass border border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-3">Career goal (choose one)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setCareerGoal(r)}
                  className={`px-4 py-3 rounded-xl text-left font-medium transition ${
                    careerGoal === r
                      ? 'bg-brand-500/20 border-2 border-brand-500 text-brand-300'
                      : 'glass border border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-500 text-white font-semibold disabled:opacity-60 hover:shadow-lg hover:shadow-brand-500/25 transition"
          >
            {loading ? 'Analyzing...' : 'See my skill gap'}
          </button>
        </div>
      </div>
    </div>
  );
}
