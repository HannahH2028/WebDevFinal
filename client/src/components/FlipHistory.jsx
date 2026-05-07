import { useEffect, useRef } from 'react';
import './FlipHistory.css';

function FlipHistory({ flipHistory }) {
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [flipHistory]);
  return (
    <div className="flip-history" id="flip-history-panel">
      <div className="flip-history-title">Flip History</div>
      <div className="flip-history-list" ref={listRef}>
        {(!flipHistory || flipHistory.length === 0) ? (
          <div className="flip-history-empty">
            No flips yet, try it out!
          </div>
        ) : (
          flipHistory.map((flip, index) => (
            <div
              key={index}
              className={`flip-entry ${flip.result}`}
            >
              <span className="flip-entry-number">#{index + 1}</span>
              <span className="flip-entry-result">
                <span className="dot" />
                {flip.result === 'heads' ? 'Heads' : 'Tails'}
              </span>
              <span className="flip-entry-money">
                {flip.moneyEarned > 0 ? `+${flip.moneyEarned}¢` : '—'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default FlipHistory;
