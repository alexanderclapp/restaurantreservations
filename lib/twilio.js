/**
 * Twilio SMS Helper
 * 
 * Required env vars:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_FROM (your Twilio phone number)
 */

const twilio = require('twilio');

let twilioClient = null;

/**
 * Get or create Twilio client
 */
function getTwilioClient() {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }
    
    twilioClient = twilio(accountSid, authToken);
  }
  
  return twilioClient;
}

/**
 * Send SMS via Twilio
 * @param {string} to - Recipient phone number (E.164 format recommended)
 * @param {string} body - Message text
 * @returns {Promise<object>} Twilio message response
 */
async function sendSms(to, body) {
  const client = getTwilioClient();
  const from = process.env.TWILIO_FROM;
  
  if (!from) {
    throw new Error('TWILIO_FROM not configured');
  }
  
  console.log('[Twilio] Sending SMS:', { to, from, body });
  
  try {
    const message = await client.messages.create({
      body,
      from,
      to,
    });
    
    console.log('[Twilio] SMS sent successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('[Twilio] Failed to send SMS:', error.message);
    throw error;
  }
}

module.exports = { sendSms };
