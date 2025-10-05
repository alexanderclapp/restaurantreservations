'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Restaurant } from '../data/restaurants'

interface BookingModalProps {
  restaurant: Restaurant
  onClose: () => void
}

export default function BookingModal({ restaurant, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    date: '',
    time: '',
    partySize: 2,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurant: {
            name: restaurant.name,
            phone: restaurant.phone,
          },
          user: {
            name: formData.name,
            contact: formData.contact,
          },
          date: formData.date,
          time: formData.time,
          partySize: formData.partySize,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage({ 
          type: 'success', 
          text: 'Reservation request submitted! We\'re calling the restaurant now. Check your email/SMS for confirmation.' 
        })
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Failed to submit reservation' })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-8 py-8 relative">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors rounded-full p-2 hover:bg-gray-100"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
          
          <h2 className="text-3xl font-serif font-semibold text-black mb-2">
            Reserve a Table
          </h2>
          <p className="text-base text-gray-500">{restaurant.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="date" 
                className="block text-sm font-medium text-black mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-black bg-gray-50 focus:bg-white text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>

            <div>
              <label 
                htmlFor="time" 
                className="block text-sm font-medium text-black mb-2"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-black bg-gray-50 focus:bg-white text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>
          </div>

          {/* Party Size */}
          <div>
            <label 
              htmlFor="partySize" 
              className="block text-sm font-medium text-black mb-2"
            >
              Party Size
            </label>
            <select
              id="partySize"
              name="partySize"
              value={formData.partySize}
              onChange={handleChange}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-black bg-gray-50 focus:bg-white text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                <option key={size} value={size}>
                  {size} {size === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-black mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-black bg-gray-50 focus:bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>

          {/* Contact */}
          <div>
            <label 
              htmlFor="contact" 
              className="block text-sm font-medium text-black mb-2"
            >
              Email or Phone
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="john@example.com or +1 234 567 890"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-black bg-gray-50 focus:bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div 
              className={`p-4 rounded-lg text-sm font-medium text-center ${
                submitMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium text-base transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Confirm Reservation'}
          </button>

          <p className="text-xs text-center text-gray-400 leading-relaxed">
            We'll call the restaurant on your behalf and send you a confirmation
          </p>
        </form>
      </div>
    </div>
  )
}