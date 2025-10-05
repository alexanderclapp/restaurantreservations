/**
 * POST /api/vapi-webhook
 * 
 * Receives webhook callbacks from Vapi for call lifecycle events
 * 
 * Required env vars:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_FROM
 * 
 * When a call is completed/confirmed, sends SMS confirmation to the user
 * 
 * Test with:
 * curl -X POST http://localhost:3000/api/vapi-webhook \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "type": "call-end",
 *     "call": {
 *       "status": "completed",
 *       "assistantOverrides": {
 *         "variableValues": {
 *           "restaurant": "Casa Mono",
 *           "date": "2025-10-20",
 *           "time": "20:00",
 *           "partySize": 4,
 *           "userContact": "+1234567890"
 *         }
 *       }
 *     }
 *   }'
 */

const { sendSms } = require('../../lib/twilio');

/**
 * Check if a string looks like a phone number
 * @param {string} contact
 * @returns {boolean}
 */
function isPhoneNumber(contact) {
  // Simple check: contains + or mostly digits, no @
  if (!contact) return false;
  if (contact.includes('@')) return false;
  
  // Remove common phone formatting
  const cleaned = contact.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's mostly digits or starts with +
  return /^\+?\d{7,}$/.test(cleaned);
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('[/api/vapi-webhook] Received webhook:', JSON.stringify(req.body, null, 2));

  try {
    const event = req.body;
    
    // Extract event type and call data
    const eventType = event.type || event.event;
    const callData = event.call || event;
    const status = callData.status || event.status;
    
    console.log('[/api/vapi-webhook] Event type:', eventType, '| Status:', status);

    // Check if call is completed/confirmed
    const isCompleted = status === 'completed' || 
                       status === 'ended' || 
                       eventType === 'call-end' ||
                       eventType === 'end-of-call-report';

    if (!isCompleted) {
      console.log('[/api/vapi-webhook] Call not completed yet, skipping SMS');
      return res.status(200).json({ received: true, action: 'none' });
    }

    // Extract variables
    const variables = callData.assistantOverrides?.variableValues || 
                     callData.variables || 
                     {};
    
    const {
      restaurant,
      date,
      time,
      partySize,
      userContact,
    } = variables;

    console.log('[/api/vapi-webhook] Extracted variables:', {
      restaurant,
      date,
      time,
      partySize,
      userContact,
    });

    // If we have user contact and it's a phone number, send SMS
    if (userContact && isPhoneNumber(userContact)) {
      console.log('[/api/vapi-webhook] Sending SMS confirmation to:', userContact);

      const smsBody = `✅ Your reservation at ${restaurant} is confirmed for ${date} at ${time}${partySize ? ` for ${partySize} people` : ''}. Thanks for using AI Reservations!`;

      try {
        await sendSms(userContact, smsBody);
        console.log('[/api/vapi-webhook] ✅ SMS sent successfully');
        
        return res.status(200).json({
          received: true,
          action: 'sms_sent',
          recipient: userContact,
        });
      } catch (smsError) {
        console.error('[/api/vapi-webhook] Failed to send SMS:', smsError.message);
        
        // Still return 200 to Vapi (don't retry)
        return res.status(200).json({
          received: true,
          action: 'sms_failed',
          error: smsError.message,
        });
      }
    } else if (userContact && userContact.includes('@')) {
      console.log('[/api/vapi-webhook] Contact is email, skipping SMS (TODO: implement email)');
      
      // TODO: Send email confirmation using nodemailer
      return res.status(200).json({
        received: true,
        action: 'email_todo',
        note: 'Email confirmation not yet implemented',
      });
    } else {
      console.log('[/api/vapi-webhook] No valid contact information');
      
      return res.status(200).json({
        received: true,
        action: 'no_contact',
      });
    }

  } catch (error) {
    console.error('[/api/vapi-webhook] Error processing webhook:', error.message);
    
    // Always return 200 to Vapi to prevent retries
    return res.status(200).json({
      received: true,
      error: error.message,
    });
  }
}
