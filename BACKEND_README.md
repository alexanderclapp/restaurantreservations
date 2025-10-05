# Backend API Documentation

## Setup

### 1. Install Dependencies

```bash
npm install twilio
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key
VAPI_AGENT_ID=your_vapi_agent_id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM=+1234567890

# Base URL (for webhooks)
BASE_URL=http://localhost:3000
# In production: https://your-app.vercel.app
```

### 3. Get Your Vapi Agent ID

1. Go to https://dashboard.vapi.ai
2. Create or select an assistant
3. Copy the Assistant ID
4. Add to `.env.local` as `VAPI_AGENT_ID`

## API Routes

### POST /api/book

Creates a restaurant reservation by triggering a Vapi AI outbound call.

**Request:**
```json
{
  "restaurant": {
    "name": "Casa Mono",
    "phone": "+34915123001"
  },
  "date": "2025-10-20",
  "time": "20:00",
  "partySize": 4,
  "user": {
    "name": "John Doe",
    "contact": "+1234567890"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "callId": "call_abc123",
  "message": "Reservation call initiated",
  "booking": {
    "restaurant": "Casa Mono",
    "date": "2025-10-20",
    "time": "20:00",
    "partySize": 4
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant": {"name": "Casa Mono", "phone": "+34915123001"},
    "date": "2025-10-20",
    "time": "20:00",
    "partySize": 4,
    "user": {"name": "John Doe", "contact": "+1234567890"}
  }'
```

### POST /api/vapi-webhook

Receives webhook callbacks from Vapi for call lifecycle events.

**Automatically called by Vapi when:**
- Call starts
- Call ends
- Call status changes

**When call completes:**
- Sends SMS confirmation to user via Twilio
- Message: "✅ Your reservation at [restaurant] is confirmed for [date] at [time]. Thanks for using AI Reservations!"

**Test Webhook Locally:**
```bash
curl -X POST http://localhost:3000/api/vapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "call-end",
    "call": {
      "status": "completed",
      "assistantOverrides": {
        "variableValues": {
          "restaurant": "Casa Mono",
          "date": "2025-10-20",
          "time": "20:00",
          "partySize": 4,
          "userContact": "+1234567890"
        }
      }
    }
  }'
```

## File Structure

```
├── lib/
│   └── twilio.js           # Twilio SMS helper
├── pages/
│   └── api/
│       ├── book.js         # POST /api/book - Create reservation
│       └── vapi-webhook.js # POST /api/vapi-webhook - Vapi callbacks
└── .env.local              # Environment variables
```

## How It Works

1. **User books table** → Frontend calls `POST /api/book`
2. **API triggers Vapi call** → Vapi AI calls restaurant
3. **AI makes reservation** → Speaks with restaurant staff
4. **Call completes** → Vapi sends webhook to `/api/vapi-webhook`
5. **User gets SMS** → Twilio sends confirmation text

## Debugging

All routes include extensive console logging:

```bash
# Start dev server and watch logs
npm run dev

# In another terminal, test the API
curl -X POST http://localhost:3000/api/book ...
```

Look for logs like:
- `[/api/book] Received booking request:`
- `[/api/book] Calling Vapi API:`
- `[/api/book] ✅ Call initiated successfully`
- `[/api/vapi-webhook] Received webhook:`
- `[Twilio] Sending SMS:`
- `[Twilio] SMS sent successfully:`

## Production Deployment

1. Deploy to Vercel/Netlify/etc.
2. Set all environment variables in deployment settings
3. Update `BASE_URL` to your production URL
4. Configure Vapi webhook URL in dashboard (if not using serverUrl)

## Twilio Trial Account Notes

- Can only call/SMS verified phone numbers
- Verify numbers at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
- Messages will have "Sent from your Twilio trial account" prefix

## Vapi Configuration

Your Vapi assistant should have these variables configured:
- `restaurant` - Restaurant name
- `date` - Reservation date
- `time` - Reservation time  
- `partySize` - Number of guests
- `userName` - Customer name
- `userContact` - Customer phone/email

Assistant instructions example:
```
You are calling {restaurant} to make a reservation.
Request a table for {partySize} people on {date} at {time}.
The reservation is for {userName}.
Be polite and professional.
Confirm the booking and thank them.
```

## Support

For issues:
- Check console logs for detailed error messages
- Verify all environment variables are set
- Test Twilio credentials with their console
- Check Vapi dashboard for call logs
