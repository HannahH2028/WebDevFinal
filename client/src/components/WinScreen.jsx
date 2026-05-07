import { useState, useEffect } from 'react';
import { submitToLeaderboard } from '../api/gameApi';
import './WinScreen.css';
function WinScreen({ game, onPlayAgain, onLeaderboardUpdate, startTime }) {
  const [name, setName] = useState(game?.playerName || 'Player');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confetti, setConfetti] = useState([]);
  useEffect(() => {
    const colors = ['#ffc107', '#ff8f00', '#4caf50', '#42a5f5', '#ab47bc', '#ef5350'];
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      rotation: Math.random() * 360,
    }));
    setConfetti(pieces);
  }, []);
  const timeTaken = startTime
    ? Math.round((Date.now() - startTime) / 1000)
    : 0;
  const handleSubmit = async () => {
    if (!name.trim() || submitted) return;
    setSubmitting(true);
    try {
      await submitToLeaderboard({
        playerName: name.trim(),
        totalFlips: game.totalFlips,
        totalMoneyEarned: game.money,
        timeTaken,
      });
      setSubmitted(true);
      if (onLeaderboardUpdate) onLeaderboardUpdate();
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
    setSubmitting(false);
  };
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };
  if (!game) return null;

  return (
    <>
      <div className="confetti-container">
        {confetti.map((p) => (
          <div
            key={p.id}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>
      <div className="win-overlay" id="win-screen">
        <div className="win-card">
          <div className="win-emoji">🎉🪙🏆</div>
          <h1 className="win-title">You Win!</h1>
          <p className="win-subtitle">
            10 heads in a row!
          </p>
          <div className="win-stats">
            <div className="win-stat">
              <div className="win-stat-label">Total Flips</div>
              <div className="win-stat-value">{game.totalFlips}</div>
            </div>
            <div className="win-stat">
              <div className="win-stat-label">Money Earned</div>
              <div className="win-stat-value">{game.money}¢</div>
            </div>
            <div className="win-stat">
              <div className="win-stat-label">Total Heads</div>
              <div className="win-stat-value">{game.totalHeads}</div>
            </div>
            <div className="win-stat">
              <div className="win-stat-label">Time</div>
              <div className="win-stat-value">{formatTime(timeTaken)}</div>
            </div>
          </div>
          {!submitted ? (
            <>
              <input
                className="win-name-input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                id="leaderboard-name-input"
              />
              <div className="win-actions">
                <button
                  className="win-btn win-btn-submit"
                  onClick={handleSubmit}
                  disabled={!name.trim() || submitting}
                  id="submit-score-button"
                >
                  {submitting ? 'Submitting...' : '🏆 Submit Score'}
                </button>
                <button
                  className="win-btn win-btn-reset"
                  onClick={onPlayAgain}
                  id="play-again-button"
                >
                  🔄 Play Again
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="win-submitted">✅ Score submitted!</p>
              <div className="win-actions" style={{ marginTop: '1rem' }}>
                <button
                  className="win-btn win-btn-reset"
                  onClick={onPlayAgain}
                  id="play-again-button"
                >
                  🔄 Play Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default WinScreen;
