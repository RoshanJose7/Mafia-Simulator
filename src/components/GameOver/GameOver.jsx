import { ROLE_META, isMafia } from '../../utils/gameLogic.js';
import './GameOver.css';

function hexAlpha(hex, a) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

function lum(hex) {
  hex = hex.replace('#', '');
  return (0.299*parseInt(hex.slice(0,2),16) + 0.587*parseInt(hex.slice(2,4),16) + 0.114*parseInt(hex.slice(4,6),16)) / 255;
}

export default function GameOver({ players, onRestart, onRestartKeepPlayers }) {
  const mafiaAlive = players.filter((p) => p.alive && isMafia(p.role));
  const isWin = mafiaAlive.length === 0;
  const winColor = isWin ? '#2ee6a6' : '#ff4d4d';

  const mafiaPlayers = players.filter((p) => isMafia(p.role));
  const townPlayers  = players.filter((p) => !isMafia(p.role));

  const btnStyle = {
    background: winColor,
    color: lum(winColor) > 0.62 ? '#0a0a0f' : '#fff',
    boxShadow: `0 14px 34px -12px ${hexAlpha(winColor,.9)}, inset 0 1px 0 rgba(255,255,255,.22)`,
  };

  return (
    <div
      className="gameover-screen"
      style={{ background: `radial-gradient(120% 60% at 50% 12%, ${hexAlpha(winColor,.25)}, #07070d 56%, #050509 100%)` }}
    >
      <div className="gameover-content">
        <div className="win-icon" style={{ filter: `drop-shadow(0 0 30px ${hexAlpha(winColor,.7)})` }}>
          {isWin ? '🏆' : '🔪'}
        </div>

        <h1 className="win-title" style={{ textShadow: `0 0 30px ${hexAlpha(winColor,.6)}` }}>
          {isWin ? 'Civilians Win! 🎉' : 'Mafia Wins! 💀'}
        </h1>

        <p className="win-flavor">
          {isWin
            ? 'The town rooted out every last member of the Mafia. Order is restored — until the next moonless night.'
            : 'The Mafia now outnumber the townsfolk. The streets belong to them.'}
        </p>

        <div className="factions-grid">
          <div className="faction-section">
            <div className="faction-header">
              <span className="faction-label mafia">🔪 Mafia</span>
              <div className="faction-divider" />
            </div>
            <div className="reveal-rows">
              {mafiaPlayers.map((p) => <RevealRow key={p.id} player={p} />)}
            </div>
          </div>

          <div className="faction-section">
            <div className="faction-header">
              <span className="faction-label town">🧑 Townsfolk</span>
              <div className="faction-divider" />
            </div>
            <div className="reveal-rows">
              {townPlayers.map((p) => <RevealRow key={p.id} player={p} />)}
            </div>
          </div>
        </div>

        <div className="gameover-actions">
          <button className="play-again-btn" style={btnStyle} onClick={onRestartKeepPlayers}>
            Play Again (Same Players)
          </button>
          <button className="new-game-btn" onClick={onRestart}>New Game</button>
        </div>
      </div>
    </div>
  );
}

function RevealRow({ player }) {
  const meta = ROLE_META[player.role];
  return (
    <div
      className={`reveal-row ${player.alive ? '' : 'dead'}`}
      style={{ border: `1px solid ${hexAlpha(meta.color, .3)}` }}
    >
      <div className="reveal-icon">{meta.icon}</div>
      <div className="reveal-info">
        <div className="reveal-name">{player.name}</div>
        <div className="reveal-role">{meta.label}</div>
      </div>
      {!player.alive && <div className="reveal-skull">💀</div>}
    </div>
  );
}
