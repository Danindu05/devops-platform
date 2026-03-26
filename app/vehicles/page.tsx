import Image from "next/image"
import Link from "next/link"
import { vehicles, S3 } from "@/lib/vehicles"

export default function VehiclesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">

      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold">Our Fleet</h1>
        <p className="text-gray-500 mt-2">
          Select your dream machine and book instantly
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {vehicles.map((v) => (
          <Link
            key={v.id}
            href={`/vehicles/${v.id}`}
            className="group bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={`${S3}/${v.image}`}
                alt={v.name}
                fill
                className="object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="p-4 text-center">
              <h3 className="font-semibold">{v.name}</h3>
              <p className="text-blue-900 font-bold mt-1">
                ${v.price} / day
              </p>
            </div>
          </Link>
        ))}

      </div>
    </div>
  )
}
