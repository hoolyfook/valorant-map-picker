import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function ProtectedLayout() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username")

  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true })
    }
  }, [username, navigate])

  const handleLogout = () => {
    localStorage.removeItem("username")
    navigate("/", { replace: true })
  }

  // Nếu chưa login, render null trước khi navigate
  if (!username) return null

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <header className="flex justify-between items-center p-4 bg-gray-900">
        <span className="font-bold">Valorant Pick'em</span>
        <div className="flex gap-4 items-center">
          <span>{username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  )
}
