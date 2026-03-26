"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  updateProfile,
  updateEmail,
  updatePassword,
  signOut,
} from "firebase/auth"

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"
import { vehicles } from "@/lib/vehicles"

/* =========================
   Types
========================= */

type Booking = {
  id: string
  vehicleId: string
  startDate: Timestamp
  endDate: Timestamp
  total: number
}

/* =========================
   Page
========================= */

export default function ProfilePage() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  /* =====================================================
     FUNCTIONS (declared first to avoid TS red squiggles)
  ===================================================== */

  const loadProfile = async (uid: string) => {
    const snap = await getDoc(doc(db, "users", uid))
    const data = snap.data()

    setFullName(data?.fullName ?? "")
    setEmail(data?.email ?? "")
  }

  const loadBookings = async (uid: string) => {
    setLoading(true)

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", uid)
    )

    const snap = await getDocs(q)

    const list: Booking[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Booking, "id">),
    }))

    setBookings(list)
    setLoading(false)
  }

  /* =========================
     Load profile + bookings
  ========================= */

  useEffect(() => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      router.replace("/login")
      return
    }

    const init = async () => {
      await loadProfile(currentUser.uid)
      await loadBookings(currentUser.uid)
    }

    init()
  }, [router])

  /* =========================
     Save profile
  ========================= */

  const handleSaveProfile = async () => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) return

      setMsg("")

      await updateProfile(currentUser, {
        displayName: fullName,
      })

      await updateDoc(doc(db, "users", currentUser.uid), {
        fullName,
        email,
      })

      if (email !== currentUser.email) {
        await updateEmail(currentUser, email)
      }

      if (password) {
        await updatePassword(currentUser, password)
      }

      setPassword("")
      setMsg("Profile updated ✅")
    } catch {
      setMsg("Re-login required to update email/password")
    }
  }

  /* =========================
     Cancel booking
  ========================= */

  const cancelBooking = async (id: string) => {
    await deleteDoc(doc(db, "bookings", id))

    if (auth.currentUser) {
      await loadBookings(auth.currentUser.uid)
    }
  }

  /* =========================
     Logout (UPDATED)
  ========================= */

  const handleLogout = async () => {
    await signOut(auth)

    // replace instead of push → prevents back button returning
    router.replace("/")
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">
      <h1 className="text-3xl font-bold">My Account</h1>

      {/* ================= ACCOUNT SETTINGS ================= */}
      <div className="bg-white rounded-xl shadow p-8 space-y-4">
        <h2 className="text-xl font-semibold">Account Details</h2>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="border p-3 rounded w-full"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-3 rounded w-full"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (optional)"
          className="border p-3 rounded w-full"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSaveProfile}
            className="bg-blue-900 text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>

          <button
            onClick={handleLogout}
            className="border px-6 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>

      {/* ================= BOOKINGS ================= */}
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-semibold mb-6">Booking History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const vehicle = vehicles.find((v) => v.id === b.vehicleId)

              return (
                <div
                  key={b.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="text-sm">
                    <p className="font-semibold">
                      {vehicle?.name || b.vehicleId}
                    </p>

                    <p>
                      {b.startDate.toDate().toLocaleDateString()} →{" "}
                      {b.endDate.toDate().toLocaleDateString()}
                    </p>

                    <p className="text-blue-900 font-semibold">
                      ${b.total}
                    </p>
                  </div>

                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-red-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
