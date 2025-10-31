import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [discordId, setDiscordId] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Mật khẩu không trùng khớp")
      return
    }

    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, discordId }),
    })

    const data = await res.json()

    if (data.message) {
      alert("Đăng ký thành công! Hãy đăng nhập.")
      window.location.href = "/"
    } else {
      alert("Đăng ký thất bại!")
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: 'url(/background_giai.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Đăng ký tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium">Username</label>
              <Input
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium">Mật khẩu</label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Xác nhận</label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Discord ID</label>
              <Input
                placeholder="Ví dụ: yourname hoặc yourname#1234"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">Tạo tài khoản</Button>

            <p className="text-sm text-gray-500 text-center">
              Đã có tài khoản? <a href="/" className="text-purple-500">Đăng nhập</a>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
