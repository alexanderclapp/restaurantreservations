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
          name: formData.name,
          contact: formData.contact,
          restaurant: restaurant.name,
          restaurantPhone: restaurant.phone,
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#555555] hover:text-[#111111] transition-colors"
          >
            <svg 
              className="w-6 h-6" 
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
          
          <h2 className="text-2xl font-medium text-[#111111] mb-1">
            Book a Table
          </h2>
          <p className="text-sm text-[#555555]">{restaurant.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="date" 
                className="block text-sm font-medium text-[#111111] mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#111111] text-sm focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"
              />
            </div>

            <div>
              <label 
                htmlFor="time" 
                className="block text-sm font-medium text-[#111111] mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#111111] text-sm focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"
              />
            </div>
          </div>

          {/* Party Size */}
          <div>
            <label 
              htmlFor="partySize" 
              className="block text-sm font-medium text-[#111111] mb-2"
            >
              Party Size
            </label>
            <select
              id="partySize"
              name="partySize"
              value={formData.partySize}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#111111] text-sm focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"
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
              className="block text-sm font-medium text-[#111111] mb-2"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#111111] text-sm placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"
            />
          </div>

          {/* Contact */}
          <div>
            <label 
              htmlFor="contact" 
              className="block text-sm font-medium text-[#111111] mb-2"
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
              placeholder="john@example.com or +34 612 345 678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#111111] text-sm placeholder:text-[#999999] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"
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
            className="w-full bg-[#111111] text-white py-3.5 px-6 rounded-lg font-medium text-sm transition-colors hover:bg-[#222222] active:bg-[#000000] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Reservation'}
          </button>

          <p className="text-xs text-center text-[#777777]">
            We'll call the restaurant on your behalf and send you a confirmation
          </p>
        </form>
      </div>
    </div>
  )
}