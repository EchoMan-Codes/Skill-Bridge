import JobRole from '../models/JobRole.js';

export async function computeSkillGap(userSkills, careerGoal) {
  const jobRole = await JobRole.findOne({ role: careerGoal });
  if (!jobRole) {
    throw new Error(`Unknown career role: ${careerGoal}`);
  }

  const userSet = new Set(userSkills.map((s) => normalizeSkill(s)));
  const required = jobRole.requiredSkills.map((s) => normalizeSkill(s));
  const requiredSet = new Set(required);

  const matched = required.filter((s) => userSet.has(s));
  const missing = required.filter((s) => !userSet.has(s));

  return {
    userSkills: [...userSet],
    requiredSkills: required,
    matchedSkills: matched,
    missingSkills: missing,
    matchPercentage: required.length ? Math.round((matched.length / required.length) * 100) : 0,
  };
}

function normalizeSkill(s) {
  return String(s).trim();
}
