import { useState, useRef } from 'react';
import { ROLES, ROLE_META, isMafia, resolveNight, checkWinCondition } from '../../utils/gameLogic.js';
import { hexAlpha, lum } from '../../utils/color.js';
import RestartButton from '../RestartButton.jsx';
import './NightPhase.css';

const STEP_COLORS = { mafia: '#ff4d4d', doctor: '#2ee6a6', detective: '#f5b942' };

const STEP_LABELS = {
  sleep: 'Everyone sleeps',
  mafia: 'Mafia awakens',
  doctor: 'Doctor awakens',
  detective: 'Detective awakens',
  wake: 'Everyone wakes',
};

const ACTION_TITLES = {
  mafia: 'Mafia, open your eyes',
  doctor: 'Doctor, open your eyes',
  detective: 'Detective, open your eyes',
};

const ROLE_LABELS = {
  mafia: 'The Mafia',
  doctor: 'The Doctor',
  detective: 'The Detective',
};

function buildSteps(players) {
  const alive = players.filter((p) => p.alive);
  const steps = ['sleep', 'mafia'];
  if (alive.find((p) => p.role === ROLES.DOCTOR))    steps.push('doctor');
  if (alive.find((p) => p.role === ROLES.DETECTIVE))  steps.push('detective');
  steps.push('wake');
  return steps;
}

function Stars({ boxShadow }) {
  return <div className="stars" style={{ boxShadow }} />;
}

function usePermanentStars() {
  const ref = useRef(null);
  if (!ref.current) {
    const sh = [];
    for (let i = 0; i < 150; i++) {
      const x = Math.floor(Math.random() * 1680);
      const y = Math.floor(Math.random() * 1000);
      const o = (Math.random() * 0.6 + 0.2).toFixed(2);
      sh.push(`${x}px ${y}px 0 0 rgba(255,255,255,${o})`);
    }
    ref.current = sh.join(',');
  }
  return ref.current;
}

export default function NightPhase({ players, round, onResolved, onRestart, onEndGame }) {
  const steps = buildSteps(players);
  const [stepIdx, setStepIdx] = useState(0);
  const [mafiaTarget, setMafiaTarget] = useState(null);
  const [doctorTarget, setDoctorTarget] = useState(null);
  const [detectiveTarget, setDetectiveTarget] = useState(null);
  const [detectiveRevealed, setDetectiveRevealed] = useState(false);
  const starShadow = usePermanentStars();

  const step = steps[stepIdx];
  const alive = players.filter((p) => p.alive);
  const mafia = alive.filter((p) => isMafia(p.role));
  const nonMafia = alive.filter((p) => !isMafia(p.role));

  function advance() {
    if (stepIdx < steps.length - 1) {
      setStepIdx((i) => i + 1);
      setDetectiveRevealed(false);
    } else {
      const { players: updated, killed, saved } = resolveNight({ players, mafiaTarget, doctorTarget });
      const winner = checkWinCondition(updated);
      onResolved({ players: updated, killed, saved, winner: winner || null });
    }
  }

  function selectTarget(pid) {
    if (step === 'mafia')      setMafiaTarget(pid);
    else if (step === 'doctor') setDoctorTarget(pid);
    else if (step === 'detective') { setDetectiveTarget(pid); setDetectiveRevealed(false); }
  }

  function bigBtn(color) {
    return {
      background: color,
      color: lum(color) > 0.62 ? '#0a0a0f' : '#fff',
      boxShadow: `0 14px 34px -12px ${hexAlpha(color,.9)}, inset 0 1px 0 rgba(255,255,255,.22)`,
    };
  }

  function gridBtnStyle(selected, disabled, color) {
    if (disabled) return {};
    if (selected) return {
      background: hexAlpha(color, .18),
      border: `1.5px solid ${color}`,
      boxShadow: `0 0 22px ${hexAlpha(color,.45)}`,
    };
    return {};
  }

  const c = step === 'mafia' || step === 'doctor' || step === 'detective'
    ? STEP_COLORS[step] : '#6c7bff';

  let detResult = null;
  if (detectiveRevealed && detectiveTarget !== null) {
    const tp = players.find((p) => p.id === detectiveTarget);
    detResult = tp.role === ROLES.MAFIA ? 'mafia' : 'civilian';
  }

  return (
    <div className="night-screen">
      <Stars boxShadow={starShadow} />
      <div className="night-moon-glow" />
      <RestartButton onRestart={onRestart} onEndGame={onEndGame} />

      {/* Mobile-only header */}
      <div className="night-header">
        <div className="night-round-label">Night {round}</div>
        <div className="night-dots">
          {steps.map((s, i) => {
            const state = i < stepIdx ? 'done' : i === stepIdx ? 'active' : 'todo';
            return <div key={s} className={`ndot ${state}`} />;
          })}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="night-sidebar">
        <div className="sidebar-night-label">Night {round}</div>
        <div className="sidebar-steps">
          {steps.map((s, i) => {
            const state = i < stepIdx ? 'done' : i === stepIdx ? 'active' : 'todo';
            return (
              <div key={s} className="sidebar-step-row">
                <div className={`sidebar-dot ${state}`} />
                <div className={`sidebar-step-text ${state}`}>{STEP_LABELS[s]}</div>
              </div>
            );
          })}
        </div>
        <div className="sidebar-divider" />
        <div className="sidebar-alive-label">Alive · {alive.length}</div>
        <div className="sidebar-alive-list">
          {alive.map((p) => (
            <div key={p.id} className="sidebar-alive-row">
              <span className="sidebar-alive-dot" />
              <span className="sidebar-alive-name">{p.name}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="night-content">
        {step === 'sleep' && (
          <div className="sleep-screen">
            <div className="floaty-emoji sleep-emoji">😴</div>
            <h1>Everyone,<br/>close your eyes</h1>
            <p>The whole town falls asleep. Heads down, eyes shut — the night begins.</p>
            <div className="night-cta">
              <button className="action-btn" style={bigBtn('#6c7bff')} onClick={advance}>
                Everyone is asleep →
              </button>
            </div>
          </div>
        )}

        {(step === 'mafia' || step === 'doctor' || step === 'detective') && (
          <div className="action-screen" key={step} style={{ animation: 'fadeup .35s ease' }}>
            <h2
              className="action-title"
              style={{ textShadow: `0 0 30px ${hexAlpha(c,.5)}` }}
            >
              {ACTION_TITLES[step]}
            </h2>

            <div className="role-panel" style={{ background: hexAlpha(c,.1), border: `1px solid ${hexAlpha(c,.4)}`, boxShadow: `0 0 32px ${hexAlpha(c,.18)}` }}>
              <div className="role-panel-label" style={{ color: c }}>
                {ROLE_LABELS[step]}
              </div>
              <div className="role-panel-members">
                {step === 'mafia' && mafia.map((p) => (
                  <div key={p.id} className="member-chip"><span>{p.name}</span></div>
                ))}
                {step === 'doctor' && alive.filter((p) => p.role === ROLES.DOCTOR).map((p) => (
                  <div key={p.id} className="member-chip"><span>{p.name}</span></div>
                ))}
                {step === 'detective' && alive.filter((p) => p.role === ROLES.DETECTIVE).map((p) => (
                  <div key={p.id} className="member-chip"><span>{p.name}</span></div>
                ))}
              </div>
            </div>

            <div className="action-instruction">
              {step === 'mafia'      && 'Tap the player the Mafia chose to eliminate, then confirm.'}
              {step === 'doctor'     && 'Tap the player the Doctor is protecting tonight.'}
              {step === 'detective'  && 'Tap the player the Detective wants to investigate.'}
            </div>

            <div className="player-grid">
              {(step === 'mafia' ? nonMafia
                : step === 'detective' ? alive.filter((p) => p.role !== ROLES.DETECTIVE)
                : alive
              ).map((p) => {
                const isDisabled = step === 'doctor' && p.protectedLastNight;
                const isSelected = step === 'mafia' ? mafiaTarget === p.id
                  : step === 'doctor' ? doctorTarget === p.id
                  : detectiveTarget === p.id;

                return (
                  <button
                    key={p.id}
                    className={`grid-btn ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled-btn' : ''}`}
                    style={gridBtnStyle(isSelected, isDisabled, c)}
                    onClick={isDisabled ? undefined : () => selectTarget(p.id)}
                    disabled={isDisabled}
                  >
                    {p.name}
                    {isDisabled && <span className="grid-btn-note">Protected last night</span>}
                  </button>
                );
              })}
            </div>

            {step === 'detective' && detectiveTarget !== null && !detectiveRevealed && (
              <button className="reveal-result-btn" onClick={() => setDetectiveRevealed(true)}>
                🔍 Reveal result to Detective
              </button>
            )}

            {step === 'detective' && detectiveRevealed && detResult && (
              <div className="det-result-wrap">
                <div
                  className="det-result"
                  style={detResult === 'mafia'
                    ? { color: '#ff5b5b', background: 'rgba(255,60,60,.12)', border: '1px solid rgba(255,60,60,.4)', boxShadow: '0 0 34px rgba(255,60,60,.25)' }
                    : { color: '#34e89e', background: 'rgba(40,220,150,.12)', border: '1px solid rgba(40,220,150,.4)', boxShadow: '0 0 34px rgba(40,220,150,.25)' }
                  }
                >
                  {detResult === 'mafia' ? 'MAFIA 🔴' : 'CIVILIAN 🟢'}
                </div>
              </div>
            )}

            <div className="action-spacer" />

            {step === 'mafia' && mafiaTarget !== null && (
              <button className="action-btn" style={bigBtn(c)} onClick={advance}>Confirm target →</button>
            )}
            {step === 'doctor' && doctorTarget !== null && (
              <button className="action-btn" style={bigBtn(c)} onClick={advance}>Confirm protection →</button>
            )}
            {step === 'detective' && detectiveRevealed && (
              <button className="action-btn" style={bigBtn(c)} onClick={advance}>Detective has seen it →</button>
            )}
          </div>
        )}

        {step === 'wake' && (
          <div className="wake-screen">
            <div className="floaty-emoji wake-emoji">🌅</div>
            <h1>Everyone wakes up</h1>
            <p>The sun is rising over the town. Open your eyes — let's see who made it through the night.</p>
            <div className="night-cta">
              <button className="action-btn" style={bigBtn('#f5a623')} onClick={advance}>
                Reveal what happened →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
