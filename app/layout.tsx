import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Madrid Fine Dining',
  description: 'Book a table at Madrid\'s finest restaurants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}