"use client"

export const dynamic = "force-dynamic"


import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    onAuthStateChanged,
    signOut,
} from "firebase/auth"
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    addDoc,
    getDoc,
    Timestamp,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"
import { vehicles as staticVehicles } from "@/lib/vehicles"

/* =========================
   TYPES
========================= */

type Booking = {
    id: string
    vehicleId: string
    fullName: string
    email: string
    startDate: Timestamp
    endDate: Timestamp
    total: number
}

/* =========================
   COMPONENT
========================= */

export default function AdminPage() {
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    const [bookings, setBookings] = useState<Booking[]>([])
    const [revenue, setRevenue] = useState<number>(0)

    const [vehicleName, setVehicleName] = useState("")
    const [vehiclePrice, setVehiclePrice] = useState("")
    const [vehicleImage, setVehicleImage] = useState("")

    /* ================= AUTH CHECK ================= */

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/login")
                return
            }

            const snap = await getDoc(doc(db, "users", user.uid))
            const role = snap.data()?.role

            if (role !== "admin") {
                router.push("/")
            } else {
                setAuthorized(true)
                await loadBookings()
            }

            setLoading(false)
        })

        return () => unsub()
    }, [])

    /* ================= LOAD BOOKINGS ================= */

    const loadBookings = async () => {
        const snap = await getDocs(collection(db, "bookings"))

        const list: Booking[] = snap.docs.map((d) => {
            const data = d.data()

            return {
                id: d.id,
                vehicleId: data.vehicleId,
                fullName: data.fullName,
                email: data.email,
                startDate: data.startDate,
                endDate: data.endDate,
                total: data.total ?? 0,
            }
        })

        setBookings(list)

        const totalRevenue = list.reduce(
            (sum: number, b: Booking) => sum + b.total,
            0
        )

        setRevenue(totalRevenue)
    }

    /* ================= CANCEL BOOKING ================= */

    const cancelBooking = async (id: string) => {
        await deleteDoc(doc(db, "bookings", id))
        await loadBookings()
    }

    /* ================= ADD VEHICLE ================= */

    const addVehicle = async () => {
        if (!vehicleName || !vehiclePrice || !vehicleImage) return

        await addDoc(collection(db, "vehicles"), {
            name: vehicleName,
            price: Number(vehiclePrice),
            image: vehicleImage,
            createdAt: new Date(),
        })

        setVehicleName("")
        setVehiclePrice("")
        setVehicleImage("")
        alert("Vehicle added")
    }

    /* ================= UI ================= */

    if (loading) return <div className="p-20 text-center">Loading...</div>
    if (!authorized) return null

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Revenue */}
            <div className="bg-white shadow rounded-xl p-8 grid md:grid-cols-3 gap-6 text-center">
                <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">${revenue}</p>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">Active Vehicles</p>
                    <p className="text-2xl font-bold">
                        {staticVehicles.length}
                    </p>
                </div>
            </div>

            {/* Add Vehicle */}
            <div className="bg-white shadow rounded-xl p-8 space-y-4">
                <h2 className="text-xl font-semibold">Add Vehicle</h2>

                <input
                    placeholder="Vehicle name"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    className="border p-3 rounded w-full"
                />

                <input
                    placeholder="Price per day"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(e.target.value)}
                    className="border p-3 rounded w-full"
                />

                <input
                    placeholder="Image filename (e.g ferrari.png)"
                    value={vehicleImage}
                    onChange={(e) => setVehicleImage(e.target.value)}
                    className="border p-3 rounded w-full"
                />

                <button
                    onClick={addVehicle}
                    className="bg-blue-900 text-white px-6 py-2 rounded"
                >
                    Add Vehicle
                </button>
            </div>

            {/* Bookings */}
            <div className="bg-white shadow rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-6">All Bookings</h2>

                {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings yet</p>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <div
                                key={b.id}
                                className="border rounded-lg p-4 flex justify-between items-center"
                            >
                                <div className="text-sm">
                                    <p className="font-semibold">{b.vehicleId}</p>
                                    <p>{b.fullName} ({b.email})</p>
                                    <p>
                                        {b.startDate.toDate().toLocaleDateString()} →{" "}
                                        {b.endDate.toDate().toLocaleDateString()}
                                    </p>
                                    <p className="font-bold">${b.total}</p>
                                </div>

                                <button
                                    onClick={() => cancelBooking(b.id)}
                                    className="text-red-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => signOut(auth)}
                className="border px-6 py-2 rounded"
            >
                Logout
            </button>
        </div>
    )
}