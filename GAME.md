# Mafia — Game Rules (Source of Truth)

## Overview

Mafia is a social deduction game where players are secretly divided into two factions: **Civilians** and **Mafia**. The game alternates between a **Night Phase** and a **Day Phase**. During the night, the Mafia secretly eliminates a Civilian. During the day, all surviving players debate and vote to eliminate a suspected Mafia member. The game ends when one faction meets its win condition.

---

## Roles

### Core Roles

| Role | Faction | Description |
|---|---|---|
| Civilian | Civilians | No special ability. Must use deduction and debate to find the Mafia. |
| Mafia | Mafia | Knows all other Mafia members. Votes each night to eliminate one player. |

### Optional Special Roles

| Role | Faction | Description |
|---|---|---|
| Detective | Civilians | Each night, may investigate one player and learn if they are Mafia or Civilian. |
| Doctor | Civilians | Each night, may protect one player from being eliminated (including themselves). Cannot protect the same player two nights in a row. |
| Godfather | Mafia | Acts as the Mafia leader. Appears as Civilian when investigated by the Detective. Counts as Mafia for win condition purposes. |

---

## Players and Role Distribution

Recommended player counts and role distributions:

| Total Players | Mafia | Civilians | Special Roles |
|---|---|---|---|
| 5–6 | 1 | Remaining | None |
| 7–8 | 2 | Remaining | 1 Detective |
| 9–10 | 2 | Remaining | 1 Detective, 1 Doctor |
| 11–12 | 3 | Remaining | 1 Detective, 1 Doctor |
| 13+ | 3–4 | Remaining | 1 Detective, 1 Doctor, 1 Godfather |

General rule: Mafia should be roughly 1/4 to 1/3 of the total players.

---

## Win Conditions

- **Civilians win** when all Mafia members (including the Godfather) have been eliminated.
- **Mafia wins** when the number of living Mafia members equals or exceeds the number of living Civilians.

---

## Game Flow

### 1. Setup

1. A **Moderator** (human or system) assigns roles secretly to each player.
2. Players are informed only of their own role.
3. If there is a Mafia faction with multiple members, they are told who their Mafia allies are.

### 2. Night Phase

All players "go to sleep" (close their eyes / are inactive). The Moderator wakes each role group in the following order:

1. **Mafia** wake up, silently agree on one player to eliminate, then go back to sleep.
2. **Doctor** (if in game) wakes up, chooses one player to protect, then goes back to sleep.
3. **Detective** (if in game) wakes up, chooses one player to investigate. The Moderator silently signals whether that player is Mafia or Civilian (Godfather appears as Civilian), then the Detective goes back to sleep.

Resolution:
- If the Mafia's target was protected by the Doctor, **no one is eliminated** that night.
- Otherwise, the Mafia's target is **eliminated** and revealed at the start of the next day.

### 3. Day Phase

1. All players "wake up." The Moderator announces who was eliminated during the night (or that nobody was eliminated if protected).
2. The eliminated player's role is revealed publicly.
3. All surviving players openly **discuss and debate** who they believe the Mafia members are. There is no time limit defined by the rules, but a recommended discussion period is 3–5 minutes.
4. Players proceed to a **vote**. Each surviving player votes for one player they want to eliminate. Votes are cast simultaneously (or in order, depending on format).
5. The player with the **most votes** is eliminated. Their role is revealed publicly.
   - **Tie rule**: In the event of a tie, no one is eliminated that day (a "no vote" result).
6. Check win conditions after the elimination. If no one has won, proceed to the next Night Phase.

---

## Additional Rules

- **Eliminated players** may not speak, vote, or communicate in any way during the game. They are out.
- **Players may lie** freely — Mafia members can claim to be Civilians, Detectives, or Doctors. Civilians may bluff or misdirect.
- **The Detective's findings are private** until the Detective chooses to share them aloud during the Day Phase. The Detective may lie about findings or keep them secret.
- **The Doctor cannot be self-protected on two consecutive nights** (prevents trivial immortality).
- **The Moderator never lies** and answers only what the rules permit. The Moderator does not reveal roles unless a player is eliminated.

---

## Glossary

| Term | Meaning |
|---|---|
| Moderator | The game host. Runs the night phase, announces results, and enforces rules. |
| Eliminated | A player who has been removed from the game (by Mafia kill or day vote). |
| Night Phase | The phase where special roles act and the Mafia chooses a target. |
| Day Phase | The phase where all players debate and vote to eliminate a suspect. |
| Protected | A player shielded by the Doctor from being killed that night. |
| Investigated | A player whose allegiance (Mafia or Civilian) is revealed to the Detective. |
| No Vote | A day that ends with no elimination (due to a tie). |
