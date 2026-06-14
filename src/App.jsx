import { useState } from 'react';
import Setup from './components/Setup/Setup.jsx';
import RoleReveal from './components/RoleReveal/RoleReveal.jsx';
import NightPhase from './components/NightPhase/NightPhase.jsx';
import DayPhase from './components/DayPhase/DayPhase.jsx';
import GameOver from './components/GameOver/GameOver.jsx';
import { assignRoles } from './utils/gameLogic.js';

export default function App() {
  const [phase, setPhase] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [config, setConfig] = useState({
    includeDetective: true,
    includeDoctor: true,
    includeGodfather: false,
  });
  const [round, setRound] = useState(1);
  const [announcement, setAnnouncement] = useState(null);

  function startRoleReveal(assignedPlayers, gameConfig) {
    setPlayers(assignedPlayers);
    if (gameConfig) setConfig(gameConfig);
    setPhase('role-reveal');
  }

  function startNight() {
    setPhase('night');
  }

  function handleNightResolved({ players: updatedPlayers, killed, saved, winner }) {
    setPlayers(updatedPlayers);
    setAnnouncement({ killed, saved });
    setPhase(winner ? 'gameover' : 'day');
  }

  function handleDayElimination({ players: updatedPlayers, winner }) {
    setPlayers(updatedPlayers);
    if (winner) {
      setPhase('gameover');
    } else {
      setRound((r) => r + 1);
      setAnnouncement(null);
      setPhase('night');
    }
  }

  function handleWin(winner) {
    setPhase('gameover');
  }

  function endGame() {
    setPhase('gameover');
  }

  function restartGame() {
    setPhase('setup');
    setPlayers([]);
    setRound(1);
    setAnnouncement(null);
  }

  function restartKeepPlayers() {
    const names = players.map((p) => p.name);
    const reassigned = assignRoles(names, config);
    setPlayers(reassigned);
    setRound(1);
    setAnnouncement(null);
    setPhase('role-reveal');
  }

  return (
    <>
      {phase === 'setup' && <Setup onStart={startRoleReveal} />}
      {phase === 'role-reveal' && (
        <RoleReveal players={players} onDone={startNight} onRestart={restartKeepPlayers} onEndGame={endGame} />
      )}
      {phase === 'night' && (
        <NightPhase
          players={players}
          round={round}
          onResolved={handleNightResolved}
          onWin={handleWin}
          onRestart={restartKeepPlayers}
          onEndGame={endGame}
        />
      )}
      {phase === 'day' && (
        <DayPhase
          players={players}
          round={round}
          announcement={announcement}
          onResolved={handleDayElimination}
          onWin={handleWin}
          onRestart={restartKeepPlayers}
          onEndGame={endGame}
        />
      )}
      {phase === 'gameover' && (
        <GameOver players={players} onRestart={restartGame} onRestartKeepPlayers={restartKeepPlayers} />
      )}
    </>
  );
}
