"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      await signInWithEmailAndPassword(auth, email, password)

      router.push("/")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed"

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg"
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-900 font-medium">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}
