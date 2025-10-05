/**
 * POST /api/book
 * 
 * Creates a restaurant reservation by triggering a Vapi AI call
 * 
 * Required env vars:
 * - VAPI_API_KEY: Your Vapi API key
 * - VAPI_AGENT_ID: Your Vapi agent ID
 * - BASE_URL: Your app's base URL (e.g., https://my-app.vercel.app)
 * 
 * Request body:
 * {
 *   "restaurant": { "name": string, "phone": string },
 *   "date": "YYYY-MM-DD",
 *   "time": "HH:mm",
 *   "partySize": number,  // optional, default 2
 *   "user": { "name": string, "contact": string }
 * }
 * 
 * Test with:
 * curl -X POST http://localhost:3000/api/book \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "restaurant": {"name": "Casa Mono", "phone": "+34915123001"},
 *     "date": "2025-10-20",
 *     "time": "20:00",
 *     "partySize": 4,
 *     "user": {"name": "John Doe", "contact": "+1234567890"}
 *   }'
 */

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
const db = require('../../lib/db');

// Helper function to format date for Vapi
function formatDateForVapi(dateString, timeString) {
  const date = new Date(`${dateString}T${timeString}`);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${dayName} ${day} ${month} · ${hours}:${minutes}`;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('[/api/book] Received booking request:', JSON.stringify(req.body, null, 2));

  const { restaurant, date, time, partySize, user } = req.body;
  
  // Get user session (if logged in)
  const session = await getServerSession(req, res, authOptions);
  
  console.log('[/api/book] Session:', session ? `User: ${session.user?.email} (ID: ${session.user?.id})` : 'No session (guest)');

  // Validate required fields
  if (!restaurant?.name || !restaurant?.phone) {
    console.error('[/api/book] Missing restaurant details');
    return res.status(400).json({ error: 'Missing restaurant name or phone' });
  }

  if (!date || !time) {
    console.error('[/api/book] Missing date or time');
    return res.status(400).json({ error: 'Missing date or time' });
  }

  if (!user?.contact) {
    console.error('[/api/book] Missing user contact');
    return res.status(400).json({ error: 'Missing user contact information' });
  }

  // Check required env vars
  const vapiApiKey = process.env.VAPI_API_KEY;
  const vapiAgentId = process.env.VAPI_AGENT_ID;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  if (!vapiApiKey) {
    console.error('[/api/book] VAPI_API_KEY not configured');
    return res.status(500).json({ error: 'Vapi API key not configured' });
  }

  if (!vapiAgentId) {
    console.error('[/api/book] VAPI_AGENT_ID not configured');
    return res.status(500).json({ error: 'Vapi agent ID not configured' });
  }

  // Format date and time for Vapi (e.g., "Tue 7 Oct · 19:30")
  const formattedDateTime = formatDateForVapi(date, time);
  
  // Construct Vapi call request
  const vapiPayload = {
    assistantId: vapiAgentId,
    phoneNumberId: '68303dc4-ca9d-4acd-bbee-067348a8a02a', // Twilio number configured in Vapi
    customer: {
      number: restaurant.phone,
    },
    assistantOverrides: {
      variableValues: {
        restaurant: restaurant.name,
        dateTime: formattedDateTime,
        partySize: partySize || 2,
        userName: user.name || '',
        userContact: user.contact,
      },
    },
  };

  console.log('[/api/book] Calling Vapi API:', JSON.stringify(vapiPayload, null, 2));

  try {
    // Call Vapi API
    const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vapiPayload),
    });

    const vapiData = await vapiResponse.json();

    console.log('[/api/book] Vapi response status:', vapiResponse.status);
    console.log('[/api/book] Vapi response data:', JSON.stringify(vapiData, null, 2));

    if (!vapiResponse.ok) {
      console.error('[/api/book] Vapi API error:', vapiData);
      return res.status(vapiResponse.status).json({
        error: 'Failed to initiate call',
        details: vapiData.message || vapiData.error || 'Unknown error',
      });
    }

    // Success - return call ID
    const callId = vapiData.id || vapiData.callId;
    
    console.log('[/api/book] ✅ Call initiated successfully, ID:', callId);

    // If user is logged in, save reservation to database
    if (session?.user?.id) {
      try {
        await db.query(
          `INSERT INTO reservations 
          (user_id, restaurant_name, restaurant_phone, date, time, party_size, vapi_call_id, status) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
          [session.user.id, restaurant.name, restaurant.phone, date, time, partySize || 2, callId]
        );
        console.log('[/api/book] ✅ Reservation saved to database for user:', session.user.email);
      } catch (dbError) {
        console.error('[/api/book] Failed to save reservation to database:', dbError);
        // Continue anyway - the call was made successfully
      }
    }

    return res.status(200).json({
      success: true,
      callId,
      message: 'Reservation call initiated',
      booking: {
        restaurant: restaurant.name,
        date,
        time,
        partySize: partySize || 2,
      },
    });

  } catch (error) {
    console.error('[/api/book] Error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
