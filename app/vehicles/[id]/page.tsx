"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"
import { vehicles, S3 } from "@/lib/vehicles"
import { differenceInDays } from "date-fns"

export default function VehicleDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const vehicle = vehicles.find((v) => v.id === id)

  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  if (!vehicle) return <div className="p-20">Vehicle not found</div>

  const days =
    start && end ? differenceInDays(end, start) + 1 : 0

  const total = days * vehicle.price

  const handleBooking = async () => {
    if (!auth.currentUser) {
      setMsg("Login required")
      return
    }

    if (!start || !end) {
      setMsg("Select dates")
      return
    }

    try {
      setLoading(true)
      setMsg("")

      const q = query(
        collection(db, "bookings"),
        where("vehicleId", "==", id)
      )

      const snap = await getDocs(q)

      const conflict = snap.docs.some((docSnap) => {
        const b = docSnap.data()
        const s: Date = b.startDate.toDate()
        const e: Date = b.endDate.toDate()

        return start <= e && end >= s
      })

      if (conflict) {
        setMsg("Dates unavailable")
        return
      }

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))
      const profile = userDoc.data()

      await addDoc(collection(db, "bookings"), {
        vehicleId: id,
        userId: auth.currentUser.uid,
        fullName: profile?.fullName ?? "",
        email: profile?.email ?? "",
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        days,
        total,
        createdAt: Timestamp.now(),
      })

      setMsg("Booking successful 🎉")
    } catch (error) {
      console.error(error)
      setMsg("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12">

        {/* Image */}
        <div className="relative h-[450px] rounded-xl overflow-hidden shadow">
          <Image
            src={`${S3}/${vehicle.image}`}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Booking Panel */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{vehicle.name}</h1>
          <p className="text-blue-900 text-xl font-semibold mb-8">
            ${vehicle.price} / day
          </p>

          <div className="space-y-4">

            <DatePicker
              selected={start}
              onChange={(d: Date | null) => setStart(d)}
              placeholderText="Start date"
              className="border p-3 rounded w-full"
            />

            <DatePicker
              selected={end}
              onChange={(d: Date | null) => setEnd(d)}
              minDate={start ?? undefined}
              placeholderText="End date"
              className="border p-3 rounded w-full"
            />

            {days > 0 && (
              <div className="bg-gray-50 p-4 rounded text-sm">
                <p>Days: {days}</p>
                <p className="font-semibold">Total: ${total}</p>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
            >
              {loading ? "Processing..." : "Book Now"}
            </button>

            {msg && (
              <p className="text-center text-sm mt-2">{msg}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}