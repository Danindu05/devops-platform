export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        <div>
          <h3 className="text-lg font-bold mb-4">🚘 Ryder Rental</h3>
          <p className="text-sm text-white/70">
            Premium vehicle rentals for drivers who demand performance and luxury.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms</li>
          </ul>
        </div>

        <div>
          <button className="bg-white text-blue-950 px-5 py-2 rounded-lg font-medium text-sm">
            Explore Vehicles
          </button>
        </div>

      </div>

      <div className="border-t border-white/10 text-center py-6 text-xs text-white/60">
        © {new Date().getFullYear()} Ryder Rental. All rights reserved.
      </div>
    </footer>
  )
}
