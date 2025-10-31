import { useState } from "react"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("username", username)
        window.location.href = "/pickem"
      } else {
        alert(data?.detail || "Sai tài khoản hoặc mật khẩu!")
      }
    } catch (e) {
      alert("Không thể kết nối máy chủ: " + e.message)
    }
  }

  return (
    <div 
      className="h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: 'url(/background_giai.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-gray-900 p-8 rounded-lg w-80 space-y-4">
        <h2 className="text-center font-bold text-xl">Login</h2>

        <input
          className="w-full p-2 rounded text-black"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 rounded text-black"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-purple-600 py-2 rounded"
          onClick={handleLogin}>
          Login
        </button>

        <p className="text-sm text-gray-400 text-center">
          Chưa có tài khoản? <a href="/register" className="text-purple-400">Đăng ký</a>
        </p>
      </div>
    </div>
  )
}
