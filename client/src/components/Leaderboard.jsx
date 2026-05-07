import { useState, useEffect } from 'react';
import { getLeaderboard } from '../api/gameApi';
import './Leaderboard.css';
function Leaderboard({ refreshTrigger }) {
  const [entries, setEntries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      getLeaderboard()
        .then(setEntries)
        .catch(() => setEntries([]));
    }
  }, [isOpen, refreshTrigger]);
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };
  return (
    <div>
      <button
        className="leaderboard-toggle"
        onClick={() => setIsOpen(!isOpen)}
        id="toggle-leaderboard"
      >
        🏆 {isOpen ? 'Hide' : 'Show'} Leaderboard
      </button>
      {isOpen && (
        <div className="leaderboard animate-fade-in" id="leaderboard-panel">
          <div className="leaderboard-title">🏆 Top 10 — Fewest Flips</div>
          {entries.length === 0 ? (
            <div className="leaderboard-empty">
              No scores yet.
            </div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Flips</th>
                  <th>Money</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={entry._id}>
                    <td className="leaderboard-rank">{i + 1}</td>
                    <td className="leaderboard-name">{entry.playerName}</td>
                    <td>{entry.totalFlips}</td>
                    <td>{entry.totalMoneyEarned}¢</td>
                    <td>{formatTime(entry.timeTaken)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
export default Leaderboard;
