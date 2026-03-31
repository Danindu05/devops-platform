"use client"

import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/Navbar"


const vehicles = [
  {
    name: "Lamborghini Aventador",
    price: "$1,200",
    img: "https://vrbs-assets.s3.eu-north-1.amazonaws.com/tycan.png",
    specs: "V12 Engine • 740 HP",
    tags: ["RWD", "Automatic", "2 Seats"],
  },
  {
    name: "Ferrari F8 Tributo",
    price: "$950",
    img: "https://vrbs-assets.s3.eu-north-1.amazonaws.com/ferrari.png",
    specs: "V8 Turbo • 710 HP",
    tags: ["RWD", "F1-DCT", "2 Seats"],
  },
  {
    name: "Range Rover Autobiography",
    price: "$450",
    img: "https://vrbs-assets.s3.eu-north-1.amazonaws.com/lrover.png",
    specs: "AWD • Automatic • 5 Seats",
    tags: ["AWD", "Automatic", "5 Seats"],
  },
]


export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">

      <Navbar />

      
      {/* ================= HERO ================= */}
      <section className="relative w-full min-h-screen overflow-hidden">


        <Image
          src="https://vrbs-assets.s3.eu-north-1.amazonaws.com/hero.webp"
          alt="hero"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

       <div className="relative z-10 h-full pt-70 flex flex-col items-center justify-center text-center text-white px-6">


      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl">
  Discover the
  <br />
  <span className="text-blue-500">Power</span> of
  <br />
  Driving
</h1>
          <p className="mt-6 text-lg opacity-90 max-w-xl">
            Discover a curated collection of world-class luxury vehicles tailored
            for the discerning driver.
          </p>

          <button className="mt-8 bg-blue-900 hover:bg-blue-800 px-8 py-3 rounded-full font-semibold">
            Plan Your Journey
          </button>
        </div>
      </section>


      {/* ================= FEATURES BAR ================= */}
      <section className="border-y bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 text-center py-6 text-sm font-medium">
          <span>✓ Fully Insured</span>
          <span>✓ 24/7 Concierge</span>
          <span>✓ Doorstep Delivery</span>
          <span>✓ Top Rated 4.9/5</span>
          <span>✓ Secure Checkout</span>
        </div>
      </section>


      {/* ================= VEHICLES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Our Elite Fleet</h2>
            <p className="text-gray-500 text-sm">
              Browse our hand-picked selection of luxury brands
            </p>
          </div>
          <button className="text-blue-900 font-medium">View All →</button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {vehicles.map((v) => (
            <div
              key={v.name}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative h-48">
                <Image src={v.img} alt={v.name} fill className="object-cover" />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{v.name}</h3>
                  <span className="text-blue-900 font-bold">{v.price}</span>
                </div>

                <p className="text-sm text-gray-500 mt-2">{v.specs}</p>

                <div className="flex gap-3 text-xs text-gray-500 mt-3">
                  {v.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                <button className="mt-5 w-full bg-blue-900 text-white py-2 rounded-lg">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-blue-950 text-white py-20 text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="opacity-80 mt-2 mb-10">
          Experience seamless luxury from start to finish
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Step title="Select Your Vehicle" text="Browse our curated fleet" />
          <Step title="Instant Booking" text="Choose your dates in seconds" />
          <Step title="Doorstep Delivery" text="Delivered to your location" />
        </div>
      </section>



  {/* ================= CTA ================= */}
<section className="py-20 bg-gray-50 text-gray-900 text-center">
  <h2 className="text-3xl font-bold mb-6">
    Ready for Your Next Journey?
  </h2>

  <div className="flex justify-center gap-4">
    <button className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800">
      Explore the Fleet
    </button>

    <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100">
      Contact Concierge
    </button>
  </div>
</section>


    </main>
  )
}

function Step({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="w-12 h-12 rounded-full bg-white/20 mx-auto mb-4" />
      <h3 className="font-semibold">{title}</h3>
      <p className="opacity-70 text-sm mt-2">{text}</p>
    </div>
  )
}
