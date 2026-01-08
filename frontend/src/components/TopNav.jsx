export default function TopNav() {
  return (
    <div className="top-nav">
      <div className="board-header">
        <h1 className="board-header-title">My Trello board</h1>
        <div className="board-header-icons">
          <div className="board-header-icon">□</div>
          <div className="board-header-icon">□</div>
          <div className="board-header-icon">□</div>
        </div>
        <div className="board-header-icon" style={{ marginLeft: '8px' }}>▼</div>
      </div>
      <div className="top-nav-right">
        <div className="nav-icon" title="Notifications">🔔</div>
        <div className="nav-icon" title="Power-ups">🚀</div>
        <div className="nav-icon" title="Automations">⚡</div>
        <div className="nav-icon" title="Menu">☰</div>
        <div className="nav-icon" title="Favorite">⭐</div>
        <div className="nav-icon" title="Members">👥</div>
        <button className="share-button">Share</button>
        <div className="nav-icon" title="More">⋯</div>
        <div className="profile-picture">E</div>
      </div>
    </div>
  );
}
