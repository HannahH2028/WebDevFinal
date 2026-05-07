import './GameStats.css';
const COIN_NAMES = { 1: 'Penny', 5: 'Nickel', 10: 'Dime', 25: 'Quarter' };
function GameStats({ game }) {
  if (!game) return null;
  const streakOnFire = game.currentStreak >= 3;
  const streakExcitement = '!'.repeat(Math.min(game.currentStreak, 10));
  return (
    <div className="game-stats" id="game-stats-panel">
      <div className={`stat-card ${game.money > 0 ? 'highlight' : ''}`}>
        <div className="stat-icon">💰</div>
        <div className="stat-label">Money</div>
        <div className="stat-value money">{game.money}¢</div>
      </div>
      <div className={`stat-card ${streakOnFire ? 'highlight' : ''}`}>
        <div className="stat-icon">{streakOnFire ? '🔥' : '📊'}</div>
        <div className="stat-label">Streak</div>
        <div className={`stat-value streak ${streakOnFire ? 'on-fire' : ''}`}>
          {game.currentStreak}/10{streakExcitement}
        </div>
        <div className="stat-subtext">Best: {game.bestStreak}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🎯</div>
        <div className="stat-label">Heads Chance</div>
        <div className="stat-value chance">
          {Math.round(game.headsChance * 100)}%
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🪙</div>
        <div className="stat-label">Coin Value</div>
        <div className="stat-value">{game.coinValue}¢</div>
        <div className="stat-subtext">{COIN_NAMES[game.coinValue] || 'Penny'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🔄</div>
        <div className="stat-label">Total Flips</div>
        <div className="stat-value">{game.totalFlips}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-label">Total Heads</div>
        <div className="stat-value">{game.totalHeads}</div>
        <div className="stat-subtext">
          {game.totalFlips > 0
            ? `${Math.round((game.totalHeads / game.totalFlips) * 100)}% hit rate`
            : '—'}
        </div>
      </div>
    </div>
  );
}

export default GameStats;
