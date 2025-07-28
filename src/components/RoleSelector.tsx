import React from 'react';
import { UserRole, generateRoleURL } from '../types/roles';
import { useRole } from '../hooks/useRole';
import './RoleSelector.css';

const RoleSelector: React.FC = () => {
  const { currentRole, roleConfig } = useRole();

  const roleLabels: Record<UserRole, string> = {
    admin: '👑 Admin',
    observer: '👁️ Observer',
    teamA: '🔴 Team A',
    teamB: '🔵 Team B'
  };

  const copyRoleURL = (role: UserRole) => {
    const url = generateRoleURL(role);
    navigator.clipboard.writeText(url).then(() => {
      alert(`${roleLabels[role]} URL copied to clipboard!`);
    });
  };

  return (
    <div className="role-selector">
      <div className="role-info">
        <h4>Current Role: {roleLabels[currentRole]}</h4>
        <p className="role-description">
          {roleConfig.description}
        </p>
      </div>
      
      <div className="role-actions">
        <div className="url-sharing">
          <h5>Share URLs:</h5>
          <div className="url-buttons">
            <button
              className="url-copy-button"
              onClick={() => copyRoleURL('admin')}
              title="Copy Admin URL"
            >
              📋 👑 Admin
            </button>
            <button
              className="url-copy-button"
              onClick={() => copyRoleURL('observer')}
              title="Copy Observer URL"
            >
              📋 👁️ Observer
            </button>
            <button
              className="url-copy-button"
              onClick={() => copyRoleURL('teamA')}
              title="Copy Team A URL"
            >
              📋 🔴 Team A
            </button>
            <button
              className="url-copy-button"
              onClick={() => copyRoleURL('teamB')}
              title="Copy Team B URL"
            >
              📋 🔵 Team B
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
