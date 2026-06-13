import { useState } from 'react';
import { ROLE_META, isMafia } from '../../utils/gameLogic.js';
import RestartButton from '../RestartButton.jsx';
import './RoleReveal.css';

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

export default function RoleReveal({ players, onDone, onRestart, onEndGame }) {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const player = players[current];
  const meta = ROLE_META[player.role];
  const color = meta.color;
  const isLast = current === players.length - 1;

  const mafiaAllies = isMafia(player.role)
    ? players.filter((p) => isMafia(p.role) && p.id !== player.id)
    : [];

  function handleReveal() { setRevealed(true); }

  function handleNext() {
    if (isLast) { onDone(); }
    else { setCurrent((c) => c + 1); setRevealed(false); }
  }

  const btnStyle = {
    background: color,
    color: lum(color) > 0.62 ? '#0a0a0f' : '#fff',
    boxShadow: `0 14px 34px -12px ${hexAlpha(color, .9)}, inset 0 1px 0 rgba(255,255,255,.22)`,
  };

  return (
    <div className="reveal-screen">
      <RestartButton onRestart={onRestart} onEndGame={onEndGame} />

      {!revealed ? (
        <div className="pre-reveal">
          <div className="pre-supertitle">Role Reveal</div>
          <div className="pre-label">Hand the device to</div>
          <h1 className="pre-name">{player.name}</h1>
          <p className="pre-hint">Make sure no one else can see the screen, then reveal their secret role.</p>

          <div className="reveal-dots">
            {players.map((_, i) => {
              const state = i < current ? 'done' : i === current ? 'active' : 'todo';
              return <div key={i} className={`rdot ${state}`} />;
            })}
          </div>
          <div className="reveal-counter">Player {current + 1} of {players.length}</div>

          <div className="pre-reveal-cta">
            <button className="primary-btn" style={btnStyle} onClick={handleReveal}>
              Reveal {player.name}'s Role →
            </button>
          </div>
        </div>
      ) : (
        <div
          className="role-card-screen"
          style={{ background: `radial-gradient(110% 70% at 50% 40%, ${hexAlpha(color,.28)}, #08070d 62%, #05050a 100%)` }}
        >
          <div
            className="role-card-body"
            style={{
              background: `linear-gradient(180deg, ${hexAlpha(color,.13)}, rgba(9,9,17,.88))`,
              border: `1px solid ${hexAlpha(color,.42)}`,
              boxShadow: `0 50px 130px -34px ${hexAlpha(color,.6)}, inset 0 1px 0 rgba(255,255,255,.08)`,
            }}
          >
            <div
              className="role-icon-wrap"
              style={{
                background: hexAlpha(color, .14),
                border: `2px solid ${hexAlpha(color, .5)}`,
                boxShadow: `0 0 60px ${hexAlpha(color,.5)}, inset 0 0 36px ${hexAlpha(color,.2)}`,
              }}
            >
              {meta.icon}
            </div>

            <div className="role-you-are">You are the</div>
            <h1 className="role-name-big" style={{ textShadow: `0 0 36px ${hexAlpha(color,.6)}` }}>
              {meta.label}
            </h1>
            <p className="role-desc-text">{meta.description}</p>

            {mafiaAllies.length > 0 && (
              <div
                className="allies-panel"
                style={{ background: hexAlpha(color,.1), border: `1px solid ${hexAlpha(color,.35)}` }}
              >
                <div className="allies-panel-label">Your family</div>
                {mafiaAllies.map((a) => (
                  <div key={a.id} className="ally-row">
                    <span className="ally-name">{a.name}</span>
                    <span className="ally-role">{ROLE_META[a.role].label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="primary-btn" style={btnStyle} onClick={handleNext}>
            {isLast ? 'Done — Begin Night →' : 'Done — Next Player →'}
          </button>
        </div>
      )}
    </div>
  );
}
