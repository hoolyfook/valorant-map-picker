import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import PickemPage from "@/pages/PickemPage"
import LeaderboardPage from "@/pages/LeaderboardPage"
import ProtectedLayout from "@/components/ProtectedLayout"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/pickem" element={<PickemPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
