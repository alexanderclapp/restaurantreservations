'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Link from 'next/link'

interface Reservation {
  id: number
  restaurant_name: string
  restaurant_phone: string
  date: string
  time: string
  party_size: number
  status: string
  vapi_call_id: string | null
  notes: string | null
  created_at: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchReservations()
    }
  }, [status, router])

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations')
      const data = await response.json()

      if (response.ok) {
        setReservations(data.reservations)
      } else {
        setError(data.error || 'Failed to fetch reservations')
      }
    } catch (err) {
      setError('An error occurred while fetching reservations')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      confirmed: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    }

    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
    }

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
          styles[status as keyof typeof styles] || styles.pending
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          <div className="container mx-auto px-6 py-16 max-w-5xl">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-16 max-w-5xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-semibold text-black mb-3">
              My Reservations
            </h1>
            <p className="text-gray-500">
              View and manage your restaurant bookings
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Reservations List */}
          {reservations.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No reservations yet
              </h3>
              <p className="text-gray-500 mb-8">
                Start booking your favorite restaurants
              </p>
              <Link
                href="/"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Browse Restaurants
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-serif font-semibold text-black mb-1">
                            {reservation.restaurant_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {reservation.restaurant_phone}
                          </p>
                        </div>
                        <div>{getStatusBadge(reservation.status)}</div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{formatDate(reservation.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{formatTime(reservation.time)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>
                            {reservation.party_size}{' '}
                            {reservation.party_size === 1 ? 'person' : 'people'}
                          </span>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            {reservation.notes}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-400">
                        Booked on {formatDate(reservation.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
