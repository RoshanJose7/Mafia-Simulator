import { useState } from 'react';
import { assignRoles } from '../../utils/gameLogic.js';
import './Setup.css';

const MIN_PLAYERS = 4;

const TOGGLE_COLORS = {
  includeDetective: '#f5b942',
  includeDoctor:    '#2ee6a6',
  includeGodfather: '#d11b4a',
};

export default function Setup({ onStart }) {
  const [names, setNames] = useState(['', '', '', '']);
  const [config, setConfig] = useState({
    includeDetective: true,
    includeDoctor: true,
    includeGodfather: false,
  });
  const [error, setError] = useState('');

  function updateName(i, val) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? val : n)));
  }

  function addPlayer() {
    setNames((prev) => [...prev, '']);
  }

  function removePlayer(i) {
    if (names.length <= MIN_PLAYERS) return;
    setNames((prev) => prev.filter((_, idx) => idx !== i));
  }

  function toggleConfig(key) {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleStart() {
    const filled = names.map((n) => n.trim()).filter(Boolean);
    if (filled.length < MIN_PLAYERS) {
      setError(`You need at least ${MIN_PLAYERS} players.`);
      return;
    }
    setError('');
    const players = assignRoles(filled, config);
    onStart(players, config);
  }

  const filledCount = names.filter((n) => n.trim()).length;
  const canStart = filledCount >= MIN_PLAYERS;

  return (
    <div className="setup">
      <div className="setup-glow" />

      <div className="setup-content">
        {/* Left column: title + players */}
        <div className="setup-left">
          <div className="setup-supertitle">After Dark</div>
          <h1 className="setup-title">MAFIA</h1>
          <div className="setup-player-badge">
            <div className="badge-dot" />
            <span className="badge-text">{filledCount} players</span>
          </div>

          <div className="section-label players-label">Players</div>
          <div className="player-list">
            {names.map((name, i) => (
              <div className="player-row" key={i}>
                <span className="player-num">{i + 1}</span>
                <input
                  className="player-input"
                  value={name}
                  onChange={(e) => updateName(i, e.target.value)}
                  placeholder="Player name"
                  maxLength={24}
                />
                <button
                  className="remove-btn"
                  onClick={() => removePlayer(i)}
                  aria-label="Remove player"
                >
                  −
                </button>
              </div>
            ))}
            <button className="add-btn-dashed" onClick={addPlayer}>
              + Add player
            </button>
          </div>
          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* Right column: roles + CTA */}
        <div className="setup-right">
          <div className="section-label">Special roles</div>
          <div className="role-toggles">
            <RoleToggle
              icon="🔍"
              label="Detective"
              description="Investigates one player each night."
              active={config.includeDetective}
              color={TOGGLE_COLORS.includeDetective}
              onChange={() => toggleConfig('includeDetective')}
            />
            <RoleToggle
              icon="🩺"
              label="Doctor"
              description="Protects one player from the Mafia."
              active={config.includeDoctor}
              color={TOGGLE_COLORS.includeDoctor}
              onChange={() => toggleConfig('includeDoctor')}
            />
            <RoleToggle
              icon="🎩"
              label="Godfather"
              description="Mafia leader — reads as innocent."
              active={config.includeGodfather}
              color={TOGGLE_COLORS.includeGodfather}
              onChange={() => toggleConfig('includeGodfather')}
            />
          </div>

          <div className="setup-cta-inline">
            <button
              className={`start-btn ${canStart ? 'ready' : 'disabled'}`}
              onClick={handleStart}
              disabled={!canStart}
            >
              Assign Roles &amp; Start Game
            </button>
            <div className="setup-hint">
              {canStart
                ? `${filledCount} players ready · roles assigned at random`
                : `Add at least ${MIN_PLAYERS - filledCount} more player${MIN_PLAYERS - filledCount === 1 ? '' : 's'} to begin`}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only fixed CTA */}
      <div className="setup-cta-fixed">
        <button
          className={`start-btn ${canStart ? 'ready' : 'disabled'}`}
          onClick={handleStart}
          disabled={!canStart}
        >
          Assign Roles &amp; Start Game
        </button>
      </div>
    </div>
  );
}

function RoleToggle({ icon, label, description, active, color, onChange }) {
  const trackStyle = {
    background: active ? color : 'rgba(255,255,255,.12)',
    boxShadow: active ? `0 0 16px ${color}70` : 'none',
  };
  const knobStyle = { left: active ? '25px' : '3px' };

  return (
    <div className="role-toggle" onClick={onChange}>
      <div className="role-toggle-icon">{icon}</div>
      <div className="role-toggle-text">
        <span className="role-toggle-label">{label}</span>
        <span className="role-toggle-desc">{description}</span>
      </div>
      <button className="toggle-track" style={trackStyle} onClick={(e) => e.stopPropagation()}>
        <div className="toggle-knob" style={knobStyle} />
      </button>
    </div>
  );
}
