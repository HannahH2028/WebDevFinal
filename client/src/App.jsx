import { useState, useEffect, useCallback } from 'react';
import {
  createGame,
  getGame,
  flipCoin as flipCoinApi,
  purchaseUpgrade as purchaseUpgradeApi,
  deleteGame,
  getUpgrades,
} from './api/gameApi';
import Coin from './components/Coin';
import FlipHistory from './components/FlipHistory';
import UpgradeShop from './components/UpgradeShop';
import GameStats from './components/GameStats';
import Leaderboard from './components/Leaderboard';
import WinScreen from './components/WinScreen';
import './App.css';
function App() {
  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [upgrades, setUpgrades] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState('Player');
  const [startTime, setStartTime] = useState(null);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);

  useEffect(() => {
    getUpgrades()
      .then(setUpgrades)
      .catch((err) => console.error('Failed to load upgrades:', err));
  }, []);
  useEffect(() => {
    const savedId = localStorage.getItem('unfair-flips-gameId');
    const savedStart = localStorage.getItem('unfair-flips-startTime');
    if (savedId) {
      setLoading(true);
      getGame(savedId)
        .then((g) => {
          setGame(g);
          setGameId(savedId);
          setStarted(true);
          setStartTime(savedStart ? parseInt(savedStart) : Date.now());
        })
        .catch(() => {
          localStorage.removeItem('unfair-flips-gameId');
          localStorage.removeItem('unfair-flips-startTime');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const showError = useCallback((msg) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  }, []);
  const handleStart = async () => {
    setLoading(true);
    try {
      const newGame = await createGame(playerName);
      setGame(newGame);
      setGameId(newGame._id);
      setStarted(true);
      setFlipResult(null);
      const now = Date.now();
      setStartTime(now);
      localStorage.setItem('unfair-flips-gameId', newGame._id);
      localStorage.setItem('unfair-flips-startTime', now.toString());
    } catch (err) {
      showError('Failed to start game');
    }
    setLoading(false);
  };
  const handleFlip = async () => {
    if (isFlipping || !gameId) return;
    setIsFlipping(true);
    setFlipResult(null);
    try {
      const flipDuration = game?.flipSpeedMs || 1000;
      const data = await flipCoinApi(gameId);
      setTimeout(() => {
        setFlipResult(data.flipResult);
        setGame(data.game);
        setIsFlipping(false);
      }, flipDuration);
    } catch (err) {
      showError(err.response?.data?.message || 'Flip failed');
      setIsFlipping(false);
    }
  };
  const handleUpgrade = async (upgradeKey) => {
    if (!gameId) return;
    try {
      const data = await purchaseUpgradeApi(gameId, upgradeKey);
      setGame(data.game);
    } catch (err) {
      showError(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handlePlayAgain = async () => {
    if (gameId) {
      try {
        await deleteGame(gameId);
      } catch {
      }
    }
    localStorage.removeItem('unfair-flips-gameId');
    localStorage.removeItem('unfair-flips-startTime');
    setGame(null);
    setGameId(null);
    setFlipResult(null);
    setStarted(false);
    setStartTime(null);
    setPlayerName('Player');
  };
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Unfair Flips</h1>
        <p className="app-subtitle">
          Land <span>10 heads in a row</span> to win — if you can.
        </p>
      </header>

      {!started && (
        <div className="start-screen">
          <div className="start-coin-icon">🪙</div>
          <h2 className="start-title">Ready to Flip?</h2>
          <p className="start-desc">
            Try to land 10 heads in a row. Earn money from each heads,
            buy upgrades to improve your odds, and see if luck is on your side.
          </p>
          <p className="start-odds">
            Starting odds: <span>only 20% chance of heads</span>
          </p>
          <input
            className="start-name-input"
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={30}
            id="player-name-input"
          />
          <button
            className="start-btn"
            onClick={handleStart}
            id="start-game-button"
          >
            Start Game
          </button>
        </div>
      )}


      {started && game && (
        <main className="app-main">
          <aside className="app-sidebar-left">
            <UpgradeShop
              upgrades={upgrades}
              game={game}
              onPurchase={handleUpgrade}
            />
          </aside>
          <section className="app-center">
            <Coin
              onFlip={handleFlip}
              flipResult={flipResult}
              isFlipping={isFlipping}
              flipSpeedMs={game.flipSpeedMs}
              coinValue={game.coinValue}
              currentStreak={game.currentStreak}
              disabled={game.hasWon}
            />
            <div className="app-stats">
              <GameStats game={game} />
            </div>
          </section>

          <aside className="app-sidebar-right">
            <FlipHistory flipHistory={game.flipHistory} />
            <Leaderboard refreshTrigger={leaderboardRefresh} />
          </aside>
        </main>
      )}
      {game?.hasWon && (
        <WinScreen
          game={game}
          startTime={startTime}
          onPlayAgain={handlePlayAgain}
          onLeaderboardUpdate={() => setLeaderboardRefresh((n) => n + 1)}
        />
      )}
      {error && <div className="error-toast">{error}</div>}
    </div>
  );
}
export default App;
