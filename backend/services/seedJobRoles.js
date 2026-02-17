import JobRole from '../models/JobRole.js';

const ROLES = [
  { role: 'Software Developer', requiredSkills: ['Python', 'Java', 'DSA', 'SQL', 'Git', 'REST APIs', 'Problem Solving', 'Communication'], description: 'Build and maintain applications across the stack.' },
  { role: 'Data Analyst', requiredSkills: ['Python', 'SQL', 'Excel', 'Statistics', 'Data Visualization', 'Communication', 'Machine Learning'], description: 'Turn data into insights and drive decisions.' },
  { role: 'ML Engineer', requiredSkills: ['Python', 'Machine Learning', 'DSA', 'SQL', 'Statistics', 'Deep Learning', 'Communication'], description: 'Design and deploy ML models at scale.' },
  { role: 'Web Developer', requiredSkills: ['Web Development', 'JavaScript', 'HTML/CSS', 'React', 'SQL', 'REST APIs', 'Git', 'Communication'], description: 'Create responsive, performant web experiences.' },
  { role: 'Full Stack Developer', requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs', 'Git', 'DSA', 'Communication'], description: 'Own frontend and backend of products.' },
  { role: 'Frontend Developer', requiredSkills: ['HTML/CSS', 'JavaScript', 'React', 'Responsive Design', 'Git', 'Communication'], description: 'Focus on UI/UX and client-side logic.' },
  { role: 'Backend Developer', requiredSkills: ['Python', 'Java', 'Node.js', 'SQL', 'REST APIs', 'Git', 'DSA', 'Communication'], description: 'APIs, databases, and server-side systems.' },
  { role: 'DevOps Engineer', requiredSkills: ['Linux', 'Docker', 'CI/CD', 'AWS', 'GCP', 'Git', 'Scripting', 'Communication'], description: 'Automate deployment and infrastructure.' },
  { role: 'Cloud Engineer', requiredSkills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Networking', 'Communication'], description: 'Design and run cloud-native systems.' },
  { role: 'Product Manager', requiredSkills: ['Product Strategy', 'User Research', 'Data Analysis', 'Communication', 'Roadmapping', 'Agile'], description: 'Define what to build and why.' },
  { role: 'Data Engineer', requiredSkills: ['Python', 'SQL', 'ETL', 'Data Warehousing', 'Spark', 'Git', 'Communication'], description: 'Build pipelines and data infrastructure.' },
  { role: 'QA / Test Engineer', requiredSkills: ['Testing', 'Automation', 'SQL', 'API Testing', 'Git', 'Communication'], description: 'Ensure quality and reliability of software.' },
];

export async function seedJobRoles() {
  for (const r of ROLES) {
    await JobRole.findOneAndUpdate(
      { role: r.role },
      { role: r.role, requiredSkills: r.requiredSkills, description: r.description },
      { upsert: true }
    );
  }
}
