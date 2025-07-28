import React from 'react';
import { getRecentlyPickedMapIds, getMapPickFrequency, getRecommendedMaps } from '../data/recentlyPickedMaps';
import { ValorantMap } from '../data/maps';
import './RecentlyPickedInfo.css';

interface RecentlyPickedInfoProps {
  allMaps: ValorantMap[];
}

const RecentlyPickedInfo: React.FC<RecentlyPickedInfoProps> = ({ allMaps }) => {
  const recentlyPickedIds = getRecentlyPickedMapIds();
  const frequency = getMapPickFrequency();
  const recommendedMapIds = getRecommendedMaps(allMaps.map(m => m.id));

  if (recentlyPickedIds.length === 0) {
    return null;
  }

  const recentlyPickedMaps = allMaps.filter(map => recentlyPickedIds.includes(map.id));
  const recommendedMaps = allMaps.filter(map => recommendedMapIds.slice(0, 7).includes(map.id));

  return (
    <div className="recently-picked-info">
      <div className="info-section">
        <h4>🕒 Recently Picked Maps ({recentlyPickedIds.length})</h4>
        <div className="map-chips">
          {recentlyPickedMaps.map(map => (
            <span key={map.id} className="map-chip recently-picked">
              {map.name} <span className="frequency">({frequency[map.id] || 0}x)</span>
            </span>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>⭐ Recommended for Variety</h4>
        <div className="map-chips">
          {recommendedMaps.slice(0, 7).map(map => (
            <span key={map.id} className="map-chip recommended">
              {map.name} <span className="frequency">({frequency[map.id] || 0}x)</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyPickedInfo;
