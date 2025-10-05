/**
 * User signup API route
 * Creates a new user account
 */

import bcrypt from 'bcryptjs';
const db = require('../../../lib/db');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, email, phone || null, passwordHash]
    );

    const user = result.rows[0];

    console.log('[Signup] ✅ User created:', user.email);

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('[Signup] Error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}
