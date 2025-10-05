'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-semibold text-black hover:opacity-70 transition-opacity">
          Madrid Fine Dining
        </Link>

        <nav className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-10 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                My Reservations
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
