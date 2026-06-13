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

The app automatically assigns roles based on player count using the formula: `mafia = max(1, round(n / 4))`.

| Total Players | Mafia Count | Notes |
|---|---|---|
| 4–5 | 1 | |
| 6–7 | 2 | |
| 8–9 | 2 | |
| 10–11 | 3 | |
| 12+ | 3+ | Scales with player count |

Special roles (Detective, Doctor, Godfather) are toggled by the organiser before the game starts and are added on top of the Mafia/Civilian split.

---

## Win Conditions

- **Civilians win** when all Mafia members (including the Godfather) have been eliminated.
- **Mafia wins** when the number of living Mafia members equals or exceeds the number of living Civilians.

---

## Game Flow

### 1. Setup

1. The **Organiser** enters player names and selects which special roles to include.
2. The app assigns roles randomly and shuffles them.
3. Roles are revealed privately — the organiser hands the device to each player one at a time. No one else sees the screen during a reveal.
4. Mafia members (and the Godfather) are shown who their allies are on their role card.

### 2. Night Phase

All players "close their eyes." The organiser manages the night silently on the device, calling each group in order:

1. **Mafia** open their eyes and silently point at one player to eliminate. The organiser taps that player on the device to record the target, then confirms.
2. **Doctor** (if in game) opens their eyes and silently points at one player to protect. The organiser taps that player and confirms. The Doctor cannot protect the same player they protected the previous night.
3. **Detective** (if in game) opens their eyes and silently points at one player to investigate. The organiser taps that player, then taps "Reveal result to Detective" to show the result — only the Detective looks at the screen. The Godfather always appears as Civilian to the Detective. The organiser then confirms once the Detective has seen the result.

Resolution (automatic):
- If the Mafia's target was protected by the Doctor, **no one is eliminated** that night.
- Otherwise, the Mafia's target is **eliminated** and announced at the start of the next day.

### 3. Day Phase

1. All players open their eyes. The organiser announces who was eliminated during the night (or that nobody was harmed).
2. **Role identity is kept secret** — the eliminated player's role is not revealed to the other players. Only the organiser can see it (shown privately on the device). The full role reveal happens only at Game Over.
3. All surviving players openly **discuss and debate** who they believe the Mafia members are. The app runs a **3-minute discussion timer** (pause/resume available).
4. Players proceed to a **vote**. The organiser tallies votes by tapping +/− next to each player's name.
5. The player with the **most votes** is eliminated.
   - **Tie rule**: If two or more players share the highest vote count, no one is eliminated that day.
6. The eliminated player's role is again kept private (organiser-only). Win conditions are checked. If no one has won, the next Night Phase begins.

---

## Role Secrecy Rule

Eliminated players' roles are **intentionally hidden from other players** during the game. The organiser sees the role privately via an on-screen indicator, but nothing is announced aloud. This preserves tension and prevents players from using elimination results to deduce remaining roles. All roles are revealed to everyone on the Game Over screen.

---

## Additional Rules

- **Eliminated players** may not speak, vote, or communicate in any way during the game. They are out.
- **Players may lie** freely — Mafia members can claim to be Civilians, Detectives, or Doctors. Civilians may bluff or misdirect.
- **The Detective's findings are private** until the Detective chooses to share them aloud during the Day Phase. The Detective may lie about findings or keep them secret.
- **The Doctor cannot protect the same player on two consecutive nights** (prevents trivial immortality; the previously protected player is greyed out on the organiser's screen).
- **The Organiser never reveals information** beyond what the rules permit and does not announce roles of eliminated players.

---

## Glossary

| Term | Meaning |
|---|---|
| Organiser | The game host. Runs the app, manages night actions, announces results. Does not play as a role. |
| Eliminated | A player who has been removed from the game (by Mafia kill or day vote). |
| Night Phase | The phase where special roles act and the Mafia chooses a target. |
| Day Phase | The phase where all players debate and vote to eliminate a suspect. |
| Protected | A player shielded by the Doctor from being killed that night. |
| Investigated | A player whose allegiance (Mafia or Civilian) is revealed to the Detective. |
| No Vote | A day that ends with no elimination due to a tie. |
| Organiser Pill | The private on-screen indicator showing the organiser a player's role, not visible to other players. |
