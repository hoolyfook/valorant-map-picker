export default function LeaderboardPage() {
  const [board, setBoard] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:8000/leaderboard")
        if (res.ok) {
          const data = await res.json()
          setBoard(data)
          setError(null)
        } else {
          const errorData = await res.json()
          setError("Không thể tải leaderboard: " + (errorData?.detail || errorData?.message || "Lỗi không xác định"))
        }
      } catch (err) {
        setError("Không thể kết nối máy chủ: " + err.message)
      }
    }
    
    fetchLeaderboard()
  }, [])

  if (error) {
    return (
      <div 
        className="text-white p-8 min-h-screen"
        style={{
          backgroundImage: 'url(/background_giai.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h2 className="text-2xl mb-4 font-bold">Leaderboard</h2>
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div 
      className="text-white p-8 min-h-screen"
      style={{
        backgroundImage: 'url(/background_giai.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h2 className="text-2xl mb-4 font-bold">Leaderboard</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-purple-500">
            <th>User</th><th>Score</th>
          </tr>
        </thead>
        <tbody>
          {board.map((u,i) => (
            <tr key={u._id}>
              <td>{i+1}. {u.email}</td>
              <td>{u.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
