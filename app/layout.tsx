import type { Metadata } from "next"
import "./globals.css"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Ryder Rental",
  description: "Luxury vehicle rental booking platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">

        <Navbar />

        <main className="pt-16 min-h-screen overflow-x-hidden flex flex-col">

          <div className="flex-1">
            {children}
          </div>

          <Footer />

        </main>

      </body>
    </html>
  )
}
