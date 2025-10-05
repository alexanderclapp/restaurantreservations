import { Restaurant } from '../data/restaurants'
import Image from 'next/image'

interface RestaurantCardProps {
  restaurant: Restaurant
  onBookTable: () => void
}

export default function RestaurantCard({ restaurant, onBookTable }: RestaurantCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-xl">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="space-y-2 text-center">
        <div className="flex items-start justify-center">
          <h2 className="text-xl font-medium text-[#111111]">
            {restaurant.name}
          </h2>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-[#555555]">
          <span>{restaurant.cuisine}</span>
          <span>·</span>
          <span>{restaurant.neighborhood}</span>
        </div>

        <p className="text-sm text-[#777777]">{restaurant.phone}</p>

        {/* Book Button */}
        <button
          onClick={onBookTable}
          className="mt-4 w-full bg-[#111111] text-white py-3 px-6 rounded-lg font-medium text-sm transition-colors hover:bg-[#222222] active:bg-[#000000]"
        >
          Book Table
        </button>
      </div>
    </div>
  )
}