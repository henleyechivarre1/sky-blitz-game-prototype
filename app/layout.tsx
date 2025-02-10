import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sky Blitz',
  description: 'Space shooter game',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
