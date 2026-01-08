import Board from './components/Board.jsx';
import TopNav from './components/TopNav.jsx';
import BottomNav from './components/BottomNav.jsx';
import AnnouncementBanner from './components/AnnouncementBanner.jsx';
import './App.css';

function App() {
  return (
    <div className="app">
      <TopNav />
      <Board />
      <BottomNav />
      <AnnouncementBanner />
    </div>
  );
}

export default App;
