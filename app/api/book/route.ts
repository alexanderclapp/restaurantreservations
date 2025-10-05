import { NextResponse } from 'next/server'
import { Twilio } from 'twilio'
import nodemailer from 'nodemailer'

interface BookingRequest {
  name: string
  contact: string
  restaurant: string
  restaurantPhone?: string
  date: string
  time: string
  partySize?: number
}

// Initialize Twilio client
const twilioClient = process.env.TWILIO_SID && process.env.TWILIO_AUTH
  ? new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH)
  : null

// Initialize Nodemailer transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

/**
 * Trigger Vapi.ai outbound call to restaurant
 */
async function triggerVapiCall(booking: BookingRequest): Promise<{ success: boolean; callId?: string; error?: string }> {
  const vapiApiKey = process.env.VAPI_API_KEY
  
  if (!vapiApiKey) {
    console.error('VAPI_API_KEY not configured')
    return { success: false, error: 'Vapi API key not configured' }
  }

  if (!booking.restaurantPhone) {
    return { success: false, error: 'Restaurant phone number not provided' }
  }

  try {
    // Construct the AI assistant instructions
    const partySizeText = booking.partySize ? ` for ${booking.partySize} people` : ''
    const assistantInstructions = `You are a polite and professional restaurant booking assistant calling on behalf of ${booking.name}.

Your task:
1. Call ${booking.restaurant} at ${booking.restaurantPhone}
2. Politely introduce yourself: "Hello, I'm calling on behalf of ${booking.name} to make a reservation."
3. Request a table${partySizeText} for ${booking.date} at ${booking.time}
4. Confirm any special requirements if asked
5. Get confirmation of the booking
6. Thank them and end the call politely

Be natural, friendly, and professional. If they cannot accommodate, ask about alternative times nearby. Keep the conversation brief and to the point.`

    // Make API call to Vapi to create an outbound call
    const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Phone number to call (restaurant)
        phoneNumber: booking.restaurantPhone,
        
        // Assistant configuration
        assistant: {
          model: {
            provider: 'openai',
            model: 'gpt-4o',
            temperature: 0.7,
          },
          voice: {
            provider: 'elevenlabs',
            voiceId: 'rachel', // Professional female voice
          },
          firstMessage: `Hello, I'm calling on behalf of ${booking.name} to make a dinner reservation.`,
          
          // System prompt for the AI
          systemPrompt: assistantInstructions,
          
          // End call conditions
          endCallFunctionEnabled: true,
          endCallPhrases: ['goodbye', 'thank you', 'have a great day'],
        },
        
        // Metadata for tracking
        metadata: {
          customerName: booking.name,
          customerContact: booking.contact,
          restaurant: booking.restaurant,
          date: booking.date,
          time: booking.time,
          partySize: booking.partySize || 2,
        },
      }),
    })

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json().catch(() => ({}))
      console.error('Vapi API error:', errorData)
      return { 
        success: false, 
        error: `Vapi API error: ${vapiResponse.status} - ${errorData.message || 'Unknown error'}` 
      }
    }

    const vapiData = await vapiResponse.json()
    console.log('Vapi call initiated:', vapiData)

    return {
      success: true,
      callId: vapiData.id || vapiData.callId,
    }
  } catch (error) {
    console.error('Error triggering Vapi call:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Send SMS confirmation to user
 */
async function sendSMSConfirmation(booking: BookingRequest): Promise<boolean> {
  if (!twilioClient || !process.env.TWILIO_PHONE) {
    console.log('Twilio not configured, skipping SMS')
    return false
  }

  // Check if contact is a phone number (simple validation)
  const phoneRegex = /[\d\s\+\-\(\)]+/
  if (!phoneRegex.test(booking.contact) || booking.contact.includes('@')) {
    console.log('Contact is not a phone number, skipping SMS')
    return false
  }

  try {
    const message = `Your reservation at ${booking.restaurant} has been requested for ${booking.date} at ${booking.time}. We've called the restaurant to confirm. You'll receive a confirmation shortly.`

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: booking.contact,
    })

    console.log('SMS sent successfully to', booking.contact)
    return true
  } catch (error) {
    console.error('Error sending SMS:', error)
    return false
  }
}

/**
 * Send email confirmation to user
 */
async function sendEmailConfirmation(booking: BookingRequest): Promise<boolean> {
  if (!process.env.SMTP_USER) {
    console.log('Email not configured, skipping')
    return false
  }

  // Check if contact is an email
  if (!booking.contact.includes('@')) {
    console.log('Contact is not an email, skipping')
    return false
  }

  try {
    const partySizeText = booking.partySize ? ` for ${booking.partySize} people` : ''
    
    await emailTransporter.sendMail({
      from: `"Madrid Restaurant Reservations" <${process.env.SMTP_USER}>`,
      to: booking.contact,
      subject: `Reservation Request - ${booking.restaurant}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111111;">Reservation Request Confirmed</h2>
          <p>Dear ${booking.name},</p>
          <p>We've received your reservation request and are calling <strong>${booking.restaurant}</strong> right now to confirm your booking.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111111;">Booking Details</h3>
            <p style="margin: 8px 0;"><strong>Restaurant:</strong> ${booking.restaurant}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${booking.date}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${booking.time}</p>
            ${booking.partySize ? `<p style="margin: 8px 0;"><strong>Party Size:</strong> ${booking.partySize} people</p>` : ''}
          </div>
          
          <p>You'll receive a confirmation email once the restaurant confirms your reservation.</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">Thank you for using Madrid Restaurant Reservations</p>
        </div>
      `,
    })

    console.log('Email sent successfully to', booking.contact)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * POST /api/book - Create a new restaurant reservation
 */
export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json()
    const { name, contact, restaurant, restaurantPhone, date, time, partySize } = body

    // Validate required fields
    if (!name || !contact || !restaurant || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: name, contact, restaurant, date, time' },
        { status: 400 }
      )
    }

    console.log('New reservation request:', { name, restaurant, date, time })

    // Step 1: Trigger Vapi call to restaurant
    const vapiResult = await triggerVapiCall({
      name,
      contact,
      restaurant,
      restaurantPhone,
      date,
      time,
      partySize,
    })

    if (!vapiResult.success) {
      console.error('Vapi call failed:', vapiResult.error)
      // Continue anyway to send confirmation to user
    }

    // Step 2: Send confirmation to user (SMS or Email based on contact format)
    const confirmationSent = {
      sms: false,
      email: false,
    }

    if (contact.includes('@')) {
      confirmationSent.email = await sendEmailConfirmation(body)
    } else {
      confirmationSent.sms = await sendSMSConfirmation(body)
    }

    // Generate confirmation number
    const confirmationNumber = `RES${Date.now().toString().slice(-8)}`

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Reservation request submitted successfully',
      booking: {
        confirmationNumber,
        name,
        contact,
        restaurant,
        date,
        time,
        partySize: partySize || 2,
      },
      vapiCall: {
        initiated: vapiResult.success,
        callId: vapiResult.callId,
        error: vapiResult.error,
      },
      notifications: confirmationSent,
    })
  } catch (error) {
    console.error('Error processing reservation:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process reservation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}