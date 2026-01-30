'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.ok) {
      router.push("/Home")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

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
          onClick={handleLogin}
          disabled={loading}
          className={`btn btn-primary w-full text-lg py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-6">
          No account?{" "}
          <Link href="/Register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
