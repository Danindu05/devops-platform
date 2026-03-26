"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function RegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      const cred = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(cred.user, {
        displayName: fullName,
      })

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        fullName,
        email: cred.user.email,
        role: "user",
        createdAt: serverTimestamp(),
      })

      router.push("/")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        <input
          type="text"
          placeholder="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg"
        />

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-900 font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  )
}
