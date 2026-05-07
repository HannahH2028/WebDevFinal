import { useState } from 'react';
import './UpgradeShop.css';

function UpgradeShop({ upgrades, game, onPurchase }) {
  const [purchasing, setPurchasing] = useState(null);

  if (!upgrades || !game) return null;

  const handlePurchase = async (key) => {
    setPurchasing(key);
    await onPurchase(key);
    setTimeout(() => setPurchasing(null), 300);
  };
  const getCost = (upgrade) => {
    const level = game.upgradeLevels?.[upgrade.key] || 0;
    if (level >= upgrade.maxLevel) return null;
    return Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  };
  return (
    <div className="upgrade-shop" id="upgrade-shop-panel">
      <div className="upgrade-shop-title">🛒 Upgrade Shop</div>
      <div className="upgrade-list">
        {upgrades.map((upgrade) => {
          const level = game.upgradeLevels?.[upgrade.key] || 0;
          const isMaxed = level >= upgrade.maxLevel;
          const cost = getCost(upgrade);
          const canAfford = cost !== null && game.money >= cost;
          return (
            <div
              key={upgrade.key}
              className={`upgrade-card ${isMaxed ? 'maxed' : ''}`}
            >
              <div className="upgrade-icon">{upgrade.icon}</div>
              <div className="upgrade-info">
                <div className="upgrade-name">{upgrade.name}</div>
                <div className="upgrade-desc">{upgrade.description}</div>
                <div className="upgrade-level-bar">
                  {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                    <div
                      key={i}
                      className={`upgrade-level-pip ${i < level ? 'filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                {isMaxed ? (
                  <button className="upgrade-buy-btn maxed-btn" disabled>
                    Maxed
                  </button>
                ) : (
                  <>
                    <button
                      className="upgrade-buy-btn"
                      disabled={!canAfford || purchasing === upgrade.key}
                      onClick={() => handlePurchase(upgrade.key)}
                      id={`buy-${upgrade.key}`}
                    >
                      {purchasing === upgrade.key ? '...' : 'BUY'}
                    </button>
                    <div className={`upgrade-cost ${canAfford ? 'affordable' : 'expensive'}`}>
                      {cost}¢
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default UpgradeShop;
