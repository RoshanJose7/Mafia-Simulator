import { useState, useEffect, useRef } from 'react';
import { ROLE_META, isMafia, checkWinCondition } from '../../utils/gameLogic.js';
import RestartButton from '../RestartButton.jsx';
import './DayPhase.css';

const DISCUSSION_SECONDS = 180;
const TIMER_RADIUS = 142;

export default function DayPhase({ players, round, announcement, onResolved, onRestart, onEndGame }) {
  const [stage, setStage] = useState('announcement');
  const [votes, setVotes] = useState({});
  const [eliminated, setEliminated] = useState(null);
  const [isTie, setIsTie] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DISCUSSION_SECONDS);
  const intervalRef = useRef(null);

  const alive = players.filter((p) => p.alive);

  useEffect(() => {
    if (timerActive && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) { clearInterval(intervalRef.current); setTimerActive(false); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive]);

  function startDiscussion() {
    setStage('discussion');
    setTimerActive(true);
    const v = {};
    alive.forEach((p) => { v[p.id] = 0; });
    setVotes(v);
  }

  function goToVote() {
    clearInterval(intervalRef.current);
    setTimerActive(false);
    setStage('voting');
  }

  function changeVote(id, delta) {
    setVotes((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  }

  function confirmVote() {
    const max = Math.max(0, ...Object.values(votes));
    const tops = alive.filter((p) => (votes[p.id] || 0) === max && max > 0);
    if (tops.length !== 1) {
      setIsTie(true);
      setEliminated(null);
    } else {
      setIsTie(false);
      setEliminated(tops[0]);
    }
    setStage('result');
  }

  function confirmResult() {
    let updatedPlayers = players;
    if (eliminated) {
      updatedPlayers = players.map((p) => p.id === eliminated.id ? { ...p, alive: false } : p);
    }
    const winner = checkWinCondition(updatedPlayers);
    onResolved({ players: updatedPlayers, winner: winner || null });
  }

  const max = Math.max(0, ...Object.values(votes));
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const C = 2 * Math.PI * TIMER_RADIUS;
  const frac = secondsLeft / DISCUSSION_SECONDS;
  const urgent = secondsLeft <= 30;

  const killed = announcement?.killed;

  return (
    <div className="day-screen">
      <div className="day-sun-glow" />
      <RestartButton onRestart={onRestart} onEndGame={onEndGame} />

      <div className="day-content">
        {/* ── ANNOUNCEMENT ── */}
        {stage === 'announcement' && (
          <div className="announce-screen">
            <div className="day-supertitle">The town wakes up</div>

            {killed ? (
              <>
                <div className="announce-icon death">💀</div>
                <h1>{killed.name} was found dead in the night</h1>
                <div className="organiser-pill">
                  <span className="organiser-badge">Organiser</span>
                  <span className="organiser-note">
                    {ROLE_META[killed.role].label} · {isMafia(killed.role) ? 'Mafia' : 'Town'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="announce-icon saved">🛡️</div>
                <h1>Nobody was harmed</h1>
                <p>The Doctor reached someone just in time. The town is whole.</p>
              </>
            )}

            <div className="announce-cta">
              <button className="day-btn" onClick={startDiscussion}>Begin Discussion →</button>
            </div>
          </div>
        )}

        {/* ── DISCUSSION ── */}
        {stage === 'discussion' && (
          <div className="discussion-screen">
            <div className="discussion-label">Discussion</div>

            <div className="timer-wrap">
              <svg className="timer-svg" viewBox="0 0 320 320">
                <circle cx="160" cy="160" r={TIMER_RADIUS} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="16" />
                <circle
                  cx="160" cy="160" r={TIMER_RADIUS} fill="none"
                  stroke={urgent ? '#ff4d4d' : '#f5a623'}
                  strokeWidth="16"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: C,
                    strokeDashoffset: C * (1 - frac),
                    transition: 'stroke-dashoffset 1s linear, stroke .3s',
                    filter: `drop-shadow(0 0 8px ${urgent ? 'rgba(255,60,60,.7)' : 'rgba(245,166,35,.55)'})`,
                  }}
                />
              </svg>
              <div className="timer-inner">
                <div className={`timer-value ${urgent ? 'urgent' : ''}`}>{fmt(secondsLeft)}</div>
                <div className="timer-remaining">remaining</div>
              </div>
            </div>

            <div className="alive-chips">
              {alive.map((p) => <div key={p.id} className="alive-chip">{p.name}</div>)}
            </div>

            <div className="discussion-actions">
              <button className="pause-btn" onClick={() => {
                if (timerActive) { clearInterval(intervalRef.current); setTimerActive(false); }
                else if (secondsLeft > 0) setTimerActive(true);
              }}>
                {timerActive ? '⏸  Pause' : '▶  Resume'}
              </button>
              <button className="day-btn" onClick={goToVote}>Go to Vote →</button>
            </div>
          </div>
        )}

        {/* ── VOTING ── */}
        {stage === 'voting' && (
          <div className="voting-screen">
            <div className="voting-header">
              <div className="voting-gavel">⚖️</div>
              <h1>Town Vote</h1>
              <div className="voting-hint">Tally each player's votes — the highest is eliminated.</div>
            </div>

            <div className="vote-list">
              {alive.map((p) => {
                const cnt = votes[p.id] || 0;
                const isMax = cnt === max && max > 0;
                const barW = cnt ? Math.max(8, (cnt / (max || 1)) * 100) : 0;
                return (
                  <div key={p.id} className={`vote-row ${isMax ? 'leading' : ''}`}>
                    <div className="vote-name-col">
                      <div className="vote-name">{p.name}</div>
                      <div className="vote-bar-track">
                        <div
                          className="vote-bar-fill"
                          style={{
                            width: `${barW}%`,
                            background: isMax
                              ? 'linear-gradient(90deg, #ff8a3d, #ff4d4d)'
                              : 'rgba(245,166,35,.55)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="vote-count">{cnt}</div>
                    <div className="vote-controls">
                      <button className="vote-ctrl minus" onClick={() => changeVote(p.id, -1)}>−</button>
                      <button className="vote-ctrl plus"  onClick={() => changeVote(p.id,  1)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="voting-cta">
              <button className="day-btn" onClick={confirmVote}>Confirm Vote</button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {stage === 'result' && (
          <div className="elim-screen">
            {!isTie && eliminated ? (
              <>
                <div className="elim-icon">⚖️</div>
                <h1>{eliminated.name} has been eliminated</h1>
                <div className="organiser-pill">
                  <span className="organiser-badge">Organiser</span>
                  <span className="organiser-note">
                    {ROLE_META[eliminated.role].label} · {isMafia(eliminated.role) ? 'A Mafia member!' : 'An innocent'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="elim-icon">🤝</div>
                <h1>No Elimination</h1>
                <p>The vote was tied — no one leaves town today.</p>
              </>
            )}
            <div className="announce-cta">
              <button className="day-btn" onClick={confirmResult}>Continue to Night →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
