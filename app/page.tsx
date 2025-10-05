'use client'

import { useState } from 'react'
import RestaurantCard from './components/RestaurantCard'
import BookingModal from './components/BookingModal'
import { restaurants, Restaurant } from './data/restaurants'

export default function Home() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBookTable = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRestaurant(null)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111] mb-3">
            Madrid Fine Dining
          </h1>
          <p className="text-lg text-[#555555] font-light">
            Reserve a table at the city's most sought-after restaurants
          </p>
        </div>
      </header>

      {/* Restaurant Grid */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onBookTable={() => handleBookTable(restaurant)}
            />
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedRestaurant && (
        <BookingModal
          restaurant={selectedRestaurant}
          onClose={handleCloseModal}
        />
      )}
    </main>
  )
}