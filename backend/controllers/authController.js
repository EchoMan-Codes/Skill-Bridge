import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthUser from '../models/AuthUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge-demo-secret-change-in-production';
const SALT_ROUNDS = 10;

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const existing = await AuthUser.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered. Please log in.' });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await AuthUser.create({
      name: (name || '').trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await AuthUser.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
}
