# Madrid Restaurant Reservations

A minimal, high-end restaurant booking platform with AI-powered phone reservations using Vapi.ai, Next.js, and TailwindCSS.

## Features

- 🍽️ **10 Madrid Restaurants** - Browse authentic Madrid dining experiences
- 🤖 **AI Phone Reservations** - Vapi.ai calls the restaurant on your behalf using GPT-4o
- 📱 **SMS Notifications** - Get confirmation via Twilio SMS
- 📧 **Email Confirmations** - Receive booking details via email
- 🎨 **Minimal Design** - Clean black-and-white aesthetic inspired by Airbnb
- 📱 **Fully Responsive** - Beautiful on mobile and desktop

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **AI Voice**: Vapi.ai with GPT-4o
- **SMS**: Twilio
- **Email**: Nodemailer
- **Language**: TypeScript

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Vapi.ai Configuration
VAPI_API_KEY=your_vapi_api_key_here

# Twilio Configuration (for SMS)
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH=your_twilio_auth_token
TWILIO_PHONE=+1234567890

# Email Configuration (SMTP - Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### User Flow

1. **Browse Restaurants** - User views 10 Madrid restaurants with photos and details
2. **Book a Table** - Click "Book Table" to open the booking modal
3. **Fill Form** - Enter name, contact (email/phone), date, time, and party size
4. **AI Calls Restaurant** - Vapi.ai triggers an outbound call with GPT-4o agent
5. **Receive Confirmation** - User gets SMS or email confirmation

### API Flow

When user submits a booking:

```
POST /api/book
├── Validate booking data
├── Trigger Vapi.ai outbound call
│   ├── GPT-4o makes the call
│   └── AI speaks with restaurant staff
├── Send SMS via Twilio (if phone number)
├── Send Email via Nodemailer (if email)
└── Return confirmation to user
```

## API Endpoint

### POST `/api/book`

**Request Body:**
```json
{
  "name": "John Doe",
  "contact": "john@example.com",
  "restaurant": "Casa Mono",
  "restaurantPhone": "+34 915 123 001",
  "date": "2025-10-15",
  "time": "20:00",
  "partySize": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reservation request submitted successfully",
  "booking": {
    "confirmationNumber": "RES12345678",
    "name": "John Doe",
    "contact": "john@example.com",
    "restaurant": "Casa Mono",
    "date": "2025-10-15",
    "time": "20:00",
    "partySize": 4
  },
  "vapiCall": {
    "initiated": true,
    "callId": "call_abc123"
  },
  "notifications": {
    "sms": false,
    "email": true
  }
}
```

## Configuration

### Vapi.ai Setup

1. Sign up at [vapi.ai](https://vapi.ai)
2. Get your API key from the dashboard
3. Add to `.env.local` as `VAPI_API_KEY`

### Twilio Setup (SMS)

1. Sign up at [twilio.com](https://twilio.com)
2. Get Account SID, Auth Token, and Phone Number
3. Add to `.env.local`

### Email Setup (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Add credentials to `.env.local`

## Customizing Restaurants

Edit `app/data/restaurants.ts` to add/modify restaurants:

```typescript
{
  id: '1',
  name: 'Restaurant Name',
  cuisine: 'Cuisine Type',
  neighborhood: 'Area',
  phone: '+34 XXX XXX XXX',
  image: 'https://images.unsplash.com/...',
}
```

## Project Structure

```
restaurantreservations/
├── app/
│   ├── api/
│   │   └── book/
│   │       └── route.ts          # Vapi + Twilio + Email integration
│   ├── components/
│   │   ├── RestaurantCard.tsx    # Restaurant display card
│   │   └── BookingModal.tsx      # Booking form modal
│   ├── data/
│   │   └── restaurants.ts        # Restaurant data
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── public/                       # Static assets
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example environment variables
├── tailwind.config.ts            # Tailwind configuration
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Deploy to Vercel (recommended):

```bash
vercel
```

Or any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

**Don't forget to set environment variables in your deployment platform!**

## License

MIT

## Support

For issues or questions, open an issue on GitHub or contact support.