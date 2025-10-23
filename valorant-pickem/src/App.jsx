import { useState } from "react";

const initialTeams = ["SEN", "FNC", "G2", "PRX", "NAVI", "GEN", "LOUD", "TH"];

function TeamCard({ name, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`w-32 text-center py-2 px-3 rounded-xl border cursor-pointer transition
        ${selected ? "bg-purple-600 border-purple-400" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}`}
    >
      {name || "TBD"}
    </div>
  );
}

function Match({ id, teamA, teamB, onPick }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (winner, loser) => {
    setSelected(winner);
    onPick(id, winner, loser);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <TeamCard
        name={teamA}
        selected={selected === teamA}
        onSelect={() => handleSelect(teamA, teamB)}
      />
      <TeamCard
        name={teamB}
        selected={selected === teamB}
        onSelect={() => handleSelect(teamB, teamA)}
      />
    </div>
  );
}

export default function App() {
  const [upper, setUpper] = useState({
    U1: { A: initialTeams[0], B: initialTeams[1] },
    U2: { A: initialTeams[2], B: initialTeams[3] },
    U3: { A: initialTeams[4], B: initialTeams[5] },
    U4: { A: initialTeams[6], B: initialTeams[7] },
    U5: { A: null, B: null },
    U6: { A: null, B: null },
    U7: { A: null, B: null },
  });

  const [lower, setLower] = useState({
    L1: { A: null, B: null },
    L2: { A: null, B: null },
    L3: { A: null, B: null },
    L4: { A: null, B: null },
    L5: { A: null, B: null },
    L6: { A: null, B: null },
  });

  const [grandFinal, setGrandFinal] = useState({ A: null, B: null });

const handlePick = (matchId, winner, loser) => {
  const newUpper = { ...upper };
  const newLower = { ...lower };
  const newGF = { ...grandFinal };

  if (matchId.startsWith("U")) {
    newUpper[matchId].winner = winner;
    setUpper(newUpper);

    switch (matchId) {
      case "U1":
        newUpper.U5.A = winner;
        newLower.L1.A = loser;
        break;
      case "U2":
        newUpper.U5.B = winner;
        newLower.L1.B = loser;
        break;
      case "U3":
        newUpper.U6.A = winner;
        newLower.L2.A = loser;
        break;
      case "U4":
        newUpper.U6.B = winner;
        newLower.L2.B = loser;
        break;
      case "U5":
        newUpper.U7.A = winner;
        newLower.L3.B = loser; // Loser of U5 goes to L3.B
        break;
      case "U6":
        newUpper.U7.B = winner;
        newLower.L4.B = loser; // Loser of U6 goes to L4.B
        break;
      case "U7":
        newGF.A = winner;
        newLower.L6.B = loser; // Loser of UB Final → Lower Final
        break;
    }

    setUpper({ ...newUpper });
    setLower({ ...newLower });
    setGrandFinal({ ...newGF });
  }

  if (matchId.startsWith("L")) {
          newLower[matchId].winner = winner;
          setLower(newLower);

          switch (matchId) {
            case "L1":
              newLower.L3.A = winner; // Winner L1 → L3.A
              break;
            case "L2":
              newLower.L4.A = winner; // Winner L2 → L4.A
              break;
            case "L3":
              newLower.L5.A = winner; // Winner L3 → L5.A
              break;
            case "L4":
              newLower.L5.B = winner; // Winner L4 → L5.B
              break;
            case "L5":
              newLower.L6.A = winner; // Winner L5 → L6.A
              break;
            case "L6":
              newGF.B = winner; // Winner L6 → GF.B
              break;
          }

          setLower({ ...newLower });
          setGrandFinal({ ...newGF });
        }
      };



  return (
    <div className="flex flex-col md:flex-row justify-center gap-12">
      {/* UPPER BRACKET */}
      <div className="flex flex-col gap-6">
        <h2 className="font-semibold text-lg mb-2 text-center">Upper Bracket</h2>
        <div>
          <h3 className="text-sm font-medium text-gray-400 text-center">Round 1</h3>
          <Match id="U1" teamA={upper.U1.A} teamB={upper.U1.B} onPick={handlePick} />
          <Match id="U2" teamA={upper.U2.A} teamB={upper.U2.B} onPick={handlePick} />
          <Match id="U3" teamA={upper.U3.A} teamB={upper.U3.B} onPick={handlePick} />
          <Match id="U4" teamA={upper.U4.A} teamB={upper.U4.B} onPick={handlePick} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 text-center">Semifinals</h3>
          <Match id="U5" teamA={upper.U5.A} teamB={upper.U5.B} onPick={handlePick} />
          <Match id="U6" teamA={upper.U6.A} teamB={upper.U6.B} onPick={handlePick} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 text-center">Final</h3>
          <Match id="U7" teamA={upper.U7.A} teamB={upper.U7.B} onPick={handlePick} />
        </div>
      </div>

      {/* LOWER BRACKET */}
      <div className="flex flex-col gap-6">
        <h2 className="font-semibold text-lg mb-2 text-center">Lower Bracket</h2>

        <div>
          <h3 className="text-sm font-medium text-gray-400 text-center">Round 1</h3>
          <Match id="L1" teamA={lower.L1.A} teamB={lower.L1.B} onPick={handlePick} />
          <Match id="L2" teamA={lower.L2.A} teamB={lower.L2.B} onPick={handlePick} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 text-center">Round 2</h3>
          <Match id="L3" teamA={lower.L3.A} teamB={lower.L3.B} onPick={handlePick} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 text-center">Round 3</h3>
          <Match id="L4" teamA={lower.L4.A} teamB={lower.L4.B} onPick={handlePick} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 text-center">Final</h3>
          <Match id="L5" teamA={lower.L5.A} teamB={lower.L5.B} onPick={handlePick} />
        </div>
      </div>

      {/* GRAND FINAL */}
      <div className="flex flex-col gap-6">
        <h2 className="font-semibold text-lg mb-2 text-center">Grand Final</h2>
        <Match id="GF" teamA={grandFinal.A} teamB={grandFinal.B} onPick={handlePick} />
      </div>
    </div>

  );
}
