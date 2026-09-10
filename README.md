# 🌊 SUNKEN — Descent Log

> **A bioluminescent underwater dive-platformer built entirely with HTML, CSS and JavaScript.**

Dive into the abyss, recover the pearl, collect valuable salvage, survive underwater hazards, and make it back to the airlock.

**SUNKEN** is designed like a futuristic submersible dive computer, combining pixel-art visuals, underwater physics, sonar-inspired audio, and a deep-sea exploration atmosphere.

---

## 🎮 Play the Game

The game runs directly in a modern web browser.

### Local

1. Download or clone the repository.
2. Open `sunken.html` in your browser.
3. Press any key to start the dive.

No build system or installation is required.

---

## ✨ Features

* 🌊 Underwater platformer gameplay
* 🐠 **8 unique dives / levels**
* 🤿 Underwater swimming physics
* 🚀 Thruster system
* 🔱 Spear weapon
* 💨 Limited air supply
* ❤️ Multiple lives
* 💎 Collectible salvage
* 🦑 Drifter and eel enemies
* 🌋 Hydrothermal vents
* 🦔 Dangerous urchins
* 🌑 Crushing darkness zones
* 🚪 Pearl-gated airlocks
* 📊 Score and depth tracking
* 💾 Local browser save system
* 🎵 Procedural sonar-inspired audio
* 📱 Mobile touch controls
* ⌨️ Customizable keyboard controls
* ⚙️ Audio and visual settings
* 🕹️ Pause, restart and resume functionality

The game configuration includes 3 starting lives, 6 starting spears, an air tank system and score values for different collectibles and enemy strikes.

---

## 🗺️ The Eight Dives

| Dive | Name               |
| ---: | ------------------ |
|   01 | **Shallows**       |
|   02 | **The Kelp Line**  |
|   03 | **Urchin Flats**   |
|   04 | **Open Water**     |
|   05 | **Crossfire Reef** |
|   06 | **The Vent Field** |
|   07 | **The Trench**     |
|   08 | **The Wreck**      |

Each dive contains its own terrain, hazards, enemies and collectible placement.

The eight levels are defined directly in the game's JavaScript level data.

---

## 🎯 Objective

Your primary objective is:

**Recover the pearl → Reach the airlock → Descend to the next dive.**

The airlock remains sealed until you have collected the pearl.

Be careful — hazards and enemies can end your dive.

---

## 🕹️ Controls

### Keyboard

| Key     | Action                |
| ------- | --------------------- |
| `←`     | Swim left             |
| `→`     | Swim right            |
| `Space` | Kick upward / rise    |
| `Shift` | Use thruster          |
| `F`     | Fire spear            |
| `Esc`   | Hold position / pause |

The game also supports alternative bindings such as `A/D`, `W`, `X`, right Shift and `P`.

### 📱 Mobile

Touch controls are included:

* ◀ — Swim left
* ▶ — Swim right
* ✶ — Fire spear
* ▲ — Thruster
* ◎ — Kick upward

---

## 💎 Salvage & Scoring

Collecting salvage increases your score.

| Item         | Score |
| ------------ | ----: |
| Shard        |   200 |
| Bloom        |   500 |
| Relic        | 1,000 |
| Pearl        | 1,000 |
| Enemy Strike |   300 |
| Extra Life   |   500 |

---

## ⚠️ Hazards

The deeper you go, the more dangerous the ocean becomes.

### 🌑 Crushing Dark

Deadly dark-water zones that can end a dive.

### 🌋 Hydrothermal Vents

Dangerous underwater vents that must be avoided.

### 🦔 Urchins

Sharp underwater hazards placed throughout certain dives.

### 🪼 Drifters

Jellyfish-like enemies that patrol the environment.

### ⚡ Eels

Shooter enemies capable of firing projectiles.

The game internally defines rock and coral shelves as solid terrain, while crushing darkness, vents and urchins are deadly terrain.

---

## 🎨 Design

SUNKEN uses a **deep-sea instrument-console aesthetic**.

### Visual Style

* Near-black ocean backgrounds
* Teal instrument panels
* Bioluminescent cyan highlights
* Pixel-art sprites
* Circular depth/pressure gauge
* Dive-computer inspired HUD
* Minimal futuristic interface

The interface is intentionally designed around the appearance of a submersible dive computer rather than a traditional game menu.

---

## 🔊 Audio

The game generates its audio using the browser's **Web Audio API**.

It includes procedural sound effects for:

* Swimming / jumping
* Landing
* Spear firing
* Collecting items
* Collecting gems
* Enemy kills
* Thruster
* Death
* Airlock
* UI interactions
* Sonar effects

It also includes a procedurally scheduled ambient music system with low-frequency bass and bell-like tones.

---

## 💾 Save System

SUNKEN automatically stores game progress using browser `localStorage`.

Saved information includes:

* Unlocked dives
* Best score
* Checkpoint
* Audio settings
* Visual settings
* Control bindings

The save data uses the storage key:

```text
sunken.save
```

> **Note:** Clearing your browser's site data/local storage may remove your saved progress.

---

## ⚙️ Settings

The **Instruments** menu provides configurable options for:

* Master volume
* Sound effects volume
* Music volume
* Caustic lighting
* Pixel/integer rendering
* Keyboard bindings

Controls can also be reset to their defaults.

---

## 🧩 Technology

SUNKEN is intentionally lightweight.

### Built With

* **HTML5**
* **CSS3**
* **JavaScript**
* **HTML Canvas**
* **Web Audio API**
* **LocalStorage**
* **SVG**

### Dependencies

**None.**

The core game is contained inside a single HTML file and uses original procedural art, audio and gameplay physics.

---

## 📁 Project Structure

```text
SUNKEN/
│
├── sunken.html
└── README.md
```

Because the game is self-contained, there is no required `node_modules`, build folder or package manager configuration.

---

## 🚀 Run Locally

### Option 1 — Browser

Simply open:

```text
sunken.html
```

in Chrome, Firefox, Edge or another modern browser.

### Option 2 — Local Server

For a cleaner development setup:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 🌐 GitHub Pages

You can host SUNKEN directly using **GitHub Pages**.

1. Create a GitHub repository.
2. Upload `sunken.html`.
3. Rename it to:

```text
index.html
```

4. Push the project.
5. Enable **GitHub Pages** in repository settings.
6. Open the generated website URL.

Your game can then be played directly from the browser.

---

## 🏆 Gameplay Loop

```text
        START
          │
          ▼
    Choose / Resume Dive
          │
          ▼
      Enter the Ocean
          │
          ▼
   Explore & Collect
          │
     ┌────┴────┐
     │         │
  Hazards    Enemies
     │         │
     └────┬────┘
          ▼
      Find Pearl
          │
          ▼
      Reach Airlock
          │
     ┌────┴────┐
     │         │
   Success    Death
     │         │
     ▼         ▼
 Next Dive   Retry
     │
     ▼
  Dive 08
     │
     ▼
  SURFACE
```

---

## 📜 License

This repository contains the **SUNKEN** game project.

If you plan to distribute, modify or commercially release the project, add an appropriate license to the repository.

---

## 🌊 Project

**SUNKEN — Descent Log**

> *Go deeper. Find the pearl. Make it back alive.*

**Eight dives. One descent.**

🌊 **Dive carefully.**
