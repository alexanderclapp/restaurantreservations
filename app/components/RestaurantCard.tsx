import { Restaurant } from '../data/restaurants'
import Image from 'next/image'

interface RestaurantCardProps {
  restaurant: Restaurant
  onBookTable: () => void
}

export default function RestaurantCard({ restaurant, onBookTable }: RestaurantCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-semibold text-black">
            {restaurant.name}
          </h2>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>{restaurant.cuisine}</span>
            <span className="text-gray-300">•</span>
            <span>{restaurant.neighborhood}</span>
          </div>

          <p className="text-sm text-gray-400">{restaurant.phone}</p>
        </div>

        {/* Book Button */}
        <button
          onClick={onBookTable}
          className="mt-4 w-full bg-black text-white py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-95"
        >
          Reserve Table
        </button>
      </div>
    </div>
  )
}