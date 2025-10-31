// src/pages/PickemPage.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect } from "react"

const initialTeams = ["KAZ", "SIP", "BOX", "PRX", "NAVI", "GEN", "LOUD", "TH"]

function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  )
}


function TeamCard({ name, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`w-32 text-center py-2 px-3 rounded-xl border cursor-pointer transition
        ${selected ? "bg-purple-600 border-purple-400" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}`}
    >
      {name || "TBD"}
    </div>
  )
}

function Match({ id, teamA, teamB, onPick }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (winner, loser) => {
    setSelected(winner)
    onPick(id, winner, loser)
  }

  return (
    <div className="relative flex flex-col items-center gap-4 mb-6">
      <TeamCard
        name={teamA}
        selected={selected === teamA}
        onSelect={() => handleSelect(teamA, teamB)}
      />
      <div className="absolute left-full top-1/2 w-6 h-[2px] bg-gray-500"></div>
      <TeamCard
        name={teamB}
        selected={selected === teamB}
        onSelect={() => handleSelect(teamB, teamA)}
      />
    </div>
  )
}

function Champion({ team }) {
  return (
    <div className="w-36 text-center py-3 px-4 rounded-xl border border-yellow-400 bg-yellow-600 text-black font-bold">
      {team || "TBD"}
    </div>
  )
}

export default function PickemPage() {
  const [champion, setChampion] = useState(null)

  const [upper, setUpper] = useState({
    U1: { A: initialTeams[0], B: initialTeams[1] },
    U2: { A: initialTeams[2], B: initialTeams[3] },
    U3: { A: initialTeams[4], B: initialTeams[5] },
    U4: { A: initialTeams[6], B: initialTeams[7] },
    U5: { A: null, B: null },
    U6: { A: null, B: null },
    U7: { A: null, B: null },
  })

  const [lower, setLower] = useState({
    L1: { A: null, B: null },
    L2: { A: null, B: null },
    L3: { A: null, B: null },
    L4: { A: null, B: null },
    L5: { A: null, B: null },
    L6: { A: null, B: null },
  })

  const [grandFinal, setGrandFinal] = useState({ A: null, B: null })

  const handlePick = (id, winner, loser) => {
    const U = { ...upper }
    const L = { ...lower }
    const GF = { ...grandFinal }

    if (id.startsWith("U")) {
      if (id === "U1") U.U5.A = winner, L.L1.A = loser
      if (id === "U2") U.U5.B = winner, L.L1.B = loser
      if (id === "U3") U.U6.A = winner, L.L2.A = loser
      if (id === "U4") U.U6.B = winner, L.L2.B = loser
      if (id === "U5") U.U7.A = winner, L.L3.B = loser
      if (id === "U6") U.U7.B = winner, L.L4.B = loser
      if (id === "U7") GF.A = winner, L.L6.B = loser
    }

    if (id.startsWith("L")) {
      if (id === "L1") L.L3.A = winner
      if (id === "L2") L.L4.A = winner
      if (id === "L3") L.L5.A = winner
      if (id === "L4") L.L5.B = winner
      if (id === "L5") L.L6.A = winner
      if (id === "L6") GF.B = winner
    }

    if (id === "GF") GF.winner = winner

    setUpper(U)
    setLower(L)
    setGrandFinal(GF)
  }

  useEffect(() => {
    if (grandFinal.winner) setChampion(grandFinal.winner)
    else setChampion(null)
  }, [grandFinal])

  const savePicks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/save_picks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ upper, lower, grandFinal, champion }),
      })

      const data = await res.json()
      if (res.ok) {
        alert("Đã lưu picks thành công!")
      } else {
        alert("Lưu thất bại: " + (data?.detail || data?.message || "Lỗi không xác định"))
      }
    } catch (err) {
      alert("Không thể kết nối máy chủ: " + err.message)
    }
  }

  return (
    <div 
      className="w-full min-h-screen text-white p-8 flex flex-col items-center overflow-x-auto"
      style={{
        backgroundImage: 'url(/background_giai.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >

      <div className="flex flex-row items-center justify-center gap-12">
        <div className="mb-12">
          <div className="flex flex-row items-center gap-12 justify-center">
            <div>
              <h3 className="text-sm text-gray-400 text-center mb-2">Round 1</h3>
              <Match id="U1" teamA={upper.U1.A} teamB={upper.U1.B} onPick={handlePick} />
              <Match id="U2" teamA={upper.U2.A} teamB={upper.U2.B} onPick={handlePick} />
              <Match id="U3" teamA={upper.U3.A} teamB={upper.U3.B} onPick={handlePick} />
              <Match id="U4" teamA={upper.U4.A} teamB={upper.U4.B} onPick={handlePick} />
            </div>
            <div className="flex flex-col justify-center gap-10">
              <h3 className="text-sm text-gray-400 text-center">Semifinals</h3>
              <Match id="U5" teamA={upper.U5.A} teamB={upper.U5.B} onPick={handlePick} />
              <Match id="U6" teamA={upper.U6.A} teamB={upper.U6.B} onPick={handlePick} />
            </div>
            <div className="flex flex-col justify-center gap-10">
              <h3 className="text-sm text-gray-400 text-center">Final</h3>
              <Match id="U7" teamA={upper.U7.A} teamB={upper.U7.B} onPick={handlePick} />
            </div>
          </div>

          <div className="flex flex-row gap-12 justify-center mt-12">
            <div>
              <h3 className="text-sm text-gray-400 text-center mb-2">Round 1</h3>
              <Match id="L1" teamA={lower.L1.A} teamB={lower.L1.B} onPick={handlePick} />
              <Match id="L2" teamA={lower.L2.A} teamB={lower.L2.B} onPick={handlePick} />
            </div>
            <div>
              <h3 className="text-sm text-gray-400 text-center mb-2">Round 2</h3>
              <Match id="L3" teamA={lower.L3.A} teamB={lower.L3.B} onPick={handlePick} />
              <Match id="L4" teamA={lower.L4.A} teamB={lower.L4.B} onPick={handlePick} />
            </div>
            <div>
              <h3 className="text-sm text-gray-400 text-center mb-2">Round 3</h3>
              <Match id="L5" teamA={lower.L5.A} teamB={lower.L5.B} onPick={handlePick} />
            </div>
            <div>
              <h3 className="text-sm text-gray-400 text-center mb-2">Lower Final</h3>
              <Match id="L6" teamA={lower.L6.A} teamB={lower.L6.B} onPick={handlePick} />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="font-semibold text-lg mb-2">Grand Final</h2>
          <Match id="GF" teamA={grandFinal.A} teamB={grandFinal.B} onPick={handlePick} />

          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2 text-center">Champion</h2>
            <Champion team={champion} />
          </div>

          <button
            className="mt-6 bg-green-600 px-4 py-3 rounded font-bold"
            onClick={savePicks}
          >
            Save My Picks
          </button>
        </div>
      </div>
    </div>
  )
}
