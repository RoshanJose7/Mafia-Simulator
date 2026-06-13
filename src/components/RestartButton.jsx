import { useState } from 'react';
import './RestartButton.css';

export default function RestartButton({ onRestart, onEndGame }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="restart-anchor">
      {!confirming ? (
        <div className="restart-pills">
          {onEndGame && (
            <button className="end-game-pill" onClick={onEndGame}>⏹ End Game</button>
          )}
          <button className="restart-pill" onClick={() => setConfirming(true)}>↺ Restart</button>
        </div>
      ) : (
        <div className="restart-confirm-card">
          <div className="restart-confirm-title">Restart with same players?</div>
          <div className="restart-confirm-sub">Roles re-shuffle, names stay the same.</div>
          <div className="restart-confirm-btns">
            <button className="restart-yes" onClick={() => { setConfirming(false); onRestart(); }}>Yes</button>
            <button className="restart-no"  onClick={() => setConfirming(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
