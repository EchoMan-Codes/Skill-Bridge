import JobRole from '../models/JobRole.js';

/** GET /api/job-roles — list all job roles and required skills (verifies seed data) */
export async function getAll(req, res) {
  try {
    const roles = await JobRole.find().lean();
    res.json({ count: roles.length, jobRoles: roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch job roles' });
  }
}
