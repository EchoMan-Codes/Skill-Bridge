import { generateRoadmap } from '../services/roadmapService.js';

export async function postGenerate(req, res) {
  try {
    const { userSkills = [], careerGoal, missingSkills = [] } = req.body;
    if (!careerGoal) {
      return res.status(400).json({ error: 'careerGoal is required' });
    }

    const roadmap = await generateRoadmap(userSkills, careerGoal, missingSkills);
    res.json(roadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Roadmap generation failed' });
  }
}
