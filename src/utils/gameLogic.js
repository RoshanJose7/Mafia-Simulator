export const ROLES = {
  CIVILIAN: 'civilian',
  MAFIA: 'mafia',
  GODFATHER: 'godfather',
  DETECTIVE: 'detective',
  DOCTOR: 'doctor',
};

export const ROLE_META = {
  [ROLES.CIVILIAN]: {
    label: 'Civilian',
    icon: '🧑',
    faction: 'civilians',
    color: '#5b9bff',
    bg: 'rgba(91,155,255,0.12)',
    description: 'An ordinary townsperson with no special powers — only instinct and a vote. Root out the Mafia before they outnumber you.',
  },
  [ROLES.MAFIA]: {
    label: 'Mafia',
    icon: '🔪',
    faction: 'mafia',
    color: '#ff4d4d',
    bg: 'rgba(255,77,77,0.12)',
    description: 'Each night you and your family choose someone to eliminate. By day, lie low and deflect every suspicion.',
  },
  [ROLES.GODFATHER]: {
    label: 'Godfather',
    icon: '🎩',
    faction: 'mafia',
    color: '#d11b4a',
    bg: 'rgba(209,27,74,0.12)',
    description: 'You lead the Mafia. To the Detective you appear perfectly innocent. Bring the town to its knees.',
  },
  [ROLES.DETECTIVE]: {
    label: 'Detective',
    icon: '🔍',
    faction: 'civilians',
    color: '#f5b942',
    bg: 'rgba(245,185,66,0.12)',
    description: 'Each night, investigate one player to learn whether they are Mafia or innocent. Guide the town with what you uncover.',
  },
  [ROLES.DOCTOR]: {
    label: 'Doctor',
    icon: '🩺',
    faction: 'civilians',
    color: '#2ee6a6',
    bg: 'rgba(46,230,166,0.12)',
    description: 'Each night, choose one person to shield from the Mafia. You may even choose to save yourself.',
  },
};

export function assignRoles(playerNames, config) {
  const { includeDetective, includeDoctor, includeGodfather } = config;
  const count = playerNames.length;

  const roles = [];

  // Determine mafia count
  let mafiaCount = 1;
  if (count >= 7) mafiaCount = 2;
  if (count >= 11) mafiaCount = 3;
  if (count >= 15) mafiaCount = 4;

  // Add Godfather (replaces one Mafia slot)
  if (includeGodfather && mafiaCount >= 1) {
    roles.push(ROLES.GODFATHER);
    mafiaCount -= 1;
  }

  for (let i = 0; i < mafiaCount; i++) roles.push(ROLES.MAFIA);
  if (includeDetective) roles.push(ROLES.DETECTIVE);
  if (includeDoctor) roles.push(ROLES.DOCTOR);

  // Fill remaining with civilians
  while (roles.length < count) roles.push(ROLES.CIVILIAN);

  // Shuffle roles
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return playerNames.map((name, i) => ({
    id: i,
    name,
    role: roles[i],
    alive: true,
    protectedLastNight: false,
  }));
}

export function checkWinCondition(players) {
  const alive = players.filter((p) => p.alive);
  const mafiaAlive = alive.filter((p) => isMafia(p.role)).length;
  const civiliansAlive = alive.filter((p) => !isMafia(p.role)).length;

  if (mafiaAlive === 0) return 'civilians';
  if (mafiaAlive >= civiliansAlive) return 'mafia';
  return null;
}

export function isMafia(role) {
  return role === ROLES.MAFIA || role === ROLES.GODFATHER;
}

export function resolveNight({ players, mafiaTarget, doctorTarget }) {
  let killed = null;
  let saved = false;

  const updated = players.map((p) => {
    const wasProtected = p.id === doctorTarget;
    return { ...p, protectedLastNight: wasProtected };
  });

  if (mafiaTarget !== null) {
    const target = updated.find((p) => p.id === mafiaTarget);
    if (target && target.protectedLastNight) {
      saved = true;
    } else if (target) {
      killed = target;
      return {
        players: updated.map((p) =>
          p.id === mafiaTarget ? { ...p, alive: false } : p
        ),
        killed,
        saved,
      };
    }
  }

  return { players: updated, killed, saved };
}
