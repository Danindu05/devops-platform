"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { onAuthStateChanged, User, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
    })

    return () => unsub()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="font-bold text-lg">
          Rydex Rentals
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/vehicles">Vehicles</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="flex gap-3">

          {user ? (
            <>
              <Link
                href="/profile"
                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="border px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm"
            >
              Log In
            </Link>
          )}

        </div>

      </div>
    </nav>
  )
}






