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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-16 md:py-20 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-black mb-4 tracking-tight">
            Madrid Fine Dining
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Reserve a table at the city's most sought-after restaurants.
          </p>
        </div>
      </header>

      {/* Restaurant Grid */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RestaurantCard
                restaurant={restaurant}
                onBookTable={() => handleBookTable(restaurant)}
              />
            </div>
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