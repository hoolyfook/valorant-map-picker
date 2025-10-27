export default function LeaderboardPage() {
  const [board, setBoard] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/leaderboard")
      .then(res => res.json())
      .then(setBoard)
  }, [])

  return (
    <div className="text-white p-8">
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
