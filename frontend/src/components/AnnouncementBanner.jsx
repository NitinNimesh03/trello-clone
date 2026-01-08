import { useState } from 'react';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="announcement-banner">
      <div className="banner-content">
        <div className="banner-text">2026</div>
        <div className="banner-emoji">🐕</div>
      </div>
      <div className="banner-close" onClick={() => setIsVisible(false)}>
        ×
      </div>
    </div>
  );
}
