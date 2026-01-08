export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <div className="bottom-nav-item">
        <div className="bottom-nav-icon">📧</div>
        <div className="bottom-nav-label">Inbox</div>
      </div>
      <div className="bottom-nav-item">
        <div className="bottom-nav-icon">📅</div>
        <div className="bottom-nav-label">Planner</div>
      </div>
      <div className="bottom-nav-item active">
        <div className="bottom-nav-icon">☰</div>
        <div className="bottom-nav-label">Board</div>
      </div>
      <div className="bottom-nav-item">
        <div className="bottom-nav-icon">☰</div>
        <div className="bottom-nav-label">Switch boards</div>
      </div>
    </div>
  );
}
