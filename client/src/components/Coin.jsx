import { useState, useEffect } from 'react';
import './Coin.css';
const COIN_LABELS = {
  1: '1¢ Penny',
  5: '5¢ Nickel',
  10: '10¢ Dime',
  25: '25¢ Quarter'
};

function Coin({ onFlip, flipResult, isFlipping, flipSpeedMs, coinValue, currentStreak, disabled }) {
  const [showResult, setShowResult] = useState(null);
  const [moneyPopup, setMoneyPopup] = useState(null);
  useEffect(() => {
    if (flipResult && !isFlipping) {
      setShowResult(flipResult.result);
      if (flipResult.moneyEarned > 0) {
        setMoneyPopup(`+${flipResult.moneyEarned}¢`);
        const timer = setTimeout(() => setMoneyPopup(null), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [flipResult, isFlipping]);
  const flipDuration = `${(flipSpeedMs || 1000) / 1000}s`;
  const isTails = showResult === 'tails';
  const streakGlow = currentStreak >= 3;
  const denomination = COIN_LABELS[coinValue] || '1¢ Penny';
  return (
    <div className="coin-container">
      <div className={`coin-wrapper ${streakGlow ? 'streak-glow' : ''}`}>
        <div
          className={`coin-inner ${isFlipping ? 'flipping' : ''} ${isTails && !isFlipping ? 'show-tails' : ''}`}
          style={{
            '--flip-duration': flipDuration,
            '--final-rotation': isTails ? '180deg' : '0deg'
          }}
        >
          <div className="coin-face coin-heads">
            <span>H</span>
            <span className="coin-denomination">{denomination}</span>
          </div>
          <div className="coin-face coin-tails">
            <span>T</span>
            <span className="coin-denomination">{denomination}</span>
          </div>
        </div>
        {moneyPopup && <div className="money-popup">{moneyPopup}</div>}
      </div>
      <button
        className="flip-button"
        onClick={onFlip}
        disabled={disabled || isFlipping}
        id="flip-coin-button"
      >
        {isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>
    </div>
  );
}
export default Coin;
