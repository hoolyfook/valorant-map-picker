import React, { useState } from 'react';
import './TeamSetup.css';

interface TeamSetupProps {
  onStartGame: (team1Name: string, team2Name: string) => void;
}

const TeamSetup: React.FC<TeamSetupProps> = ({ onStartGame }) => {
  const [team1Name, setTeam1Name] = useState('Team Alpha');
  const [team2Name, setTeam2Name] = useState('Team Beta');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (team1Name.trim() && team2Name.trim()) {
      onStartGame(team1Name.trim(), team2Name.trim());
    }
  };

  return (
    <div className="team-setup">
      <div className="setup-container">
        <h1 className="setup-title">Valorant Map Ban/Pick</h1>
        <p className="setup-subtitle">Enter team names to begin the draft</p>
        
        <form onSubmit={handleSubmit} className="setup-form">
          <div className="input-group">
            <label htmlFor="team1">Team 1 Name:</label>
            <input
              type="text"
              id="team1"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              placeholder="Enter Team 1 name"
              maxLength={20}
              required
            />
          </div>
          
          <div className="vs-section">
            <div className="vs-text">VS</div>
          </div>
          
          <div className="input-group">
            <label htmlFor="team2">Team 2 Name:</label>
            <input
              type="text"
              id="team2"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              placeholder="Enter Team 2 name"
              maxLength={20}
              required
            />
          </div>
          
          <button type="submit" className="start-button">
            Start Draft
          </button>
        </form>
        
        <div className="draft-info">
          <h3>Draft Format:</h3>
          <ol>
            <li>Team 1 bans a map</li>
            <li>Team 2 bans a map</li>
            <li>Team 1 picks a map</li>
            <li>Team 2 picks a map</li>
            <li>Team 1 bans a map</li>
            <li>Team 2 bans a map</li>
            <li>Team 1 picks the final map</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;
