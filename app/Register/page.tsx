"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    setError("")
    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      router.push("/Login")
    } else {
      setError(data.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Register</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`btn btn-primary w-full text-lg py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link href="/Login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
