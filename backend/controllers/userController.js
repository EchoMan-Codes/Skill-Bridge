import User from '../models/User.js';
import { computeSkillGap } from '../services/skillGapService.js';

/** GET /api/user/recent — list recent assessments (for verifying DB storage) */
export async function getRecent(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ count: users.length, assessments: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch assessments' });
  }
}

export async function postAssessment(req, res) {
  try {
    const { name, skills = [], careerGoal } = req.body;
    if (!careerGoal) {
      return res.status(400).json({ error: 'careerGoal is required' });
    }

    const skillGap = await computeSkillGap(skills, careerGoal);

    const user = await User.create({
      name: name || 'User',
      skills,
      careerGoal,
    });

    res.status(201).json({
      userId: user._id,
      skillGap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Assessment failed' });
  }
}
