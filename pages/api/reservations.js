/**
 * Reservations API route
 * GET: Fetch user's reservations
 * POST: Create a new reservation
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
const db = require('../../lib/db');

export default async function handler(req, res) {
  // Get user session
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    // Fetch user's reservations
    try {
      const result = await db.query(
        `SELECT 
          id, restaurant_name, restaurant_phone, date, time, party_size, 
          status, vapi_call_id, notes, created_at 
        FROM reservations 
        WHERE user_id = $1 
        ORDER BY date DESC, time DESC`,
        [userId]
      );

      return res.status(200).json({ reservations: result.rows });
    } catch (error) {
      console.error('[Reservations GET] Error:', error);
      return res.status(500).json({ error: 'Failed to fetch reservations' });
    }
  } else if (req.method === 'POST') {
    // Create a new reservation
    const { restaurant, date, time, partySize, vapiCallId, notes } = req.body;

    if (!restaurant || !restaurant.name || !restaurant.phone || !date || !time || !partySize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const result = await db.query(
        `INSERT INTO reservations 
        (user_id, restaurant_name, restaurant_phone, date, time, party_size, vapi_call_id, notes, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') 
        RETURNING *`,
        [userId, restaurant.name, restaurant.phone, date, time, partySize, vapiCallId || null, notes || null]
      );

      console.log('[Reservations POST] ✅ Reservation created:', result.rows[0].id);

      return res.status(201).json({ success: true, reservation: result.rows[0] });
    } catch (error) {
      console.error('[Reservations POST] Error:', error);
      return res.status(500).json({ error: 'Failed to create reservation' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
