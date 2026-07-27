# Prestige Auction Group — Classroom Demo

A polished, interactive single-page auction website built with plain HTML, CSS, and JavaScript. Designed for live classroom demos.

## Live Site

The site is automatically published to GitHub Pages on every push to `main`:
**https://auctionacademy.github.io/Example/**

---

## How to Open It Locally

**No installation needed.** There is no build step, no server required, and no dependencies to install.

### Option 1 — Double-click the file (simplest)

1. Download or clone this repository to your computer (click the green **Code** button on GitHub → **Download ZIP**, then extract it).
2. Open the folder.
3. Double-click **`index.html`**.
4. It will open directly in your default web browser (Chrome, Firefox, Edge, Safari — all work).

> **Note:** Some browsers block external images when opening a local file. If images appear broken, use Option 2 below.

---

### Option 2 — Use VS Code with Live Server (recommended for class demos)

If you have [Visual Studio Code](https://code.visualstudio.com/) installed:

1. Open the project folder in VS Code.
2. Install the **Live Server** extension (search for it in the Extensions panel).
3. Right-click **`index.html`** in the file explorer panel.
4. Click **"Open with Live Server"**.
5. Your browser will open automatically at `http://127.0.0.1:5500`.

This is the best option for a classroom because the page auto-reloads whenever you save a change.

---

### Option 3 — Use Python's built-in web server

If you have Python installed, open a terminal in the project folder and run:

```bash
python -m http.server 8080
```

Then open your browser and go to: **`http://localhost:8080`**

---

## What's Inside

| File | Purpose |
|---|---|
| `index.html` | All page sections and content |
| `styles.css` | Layout, colors, animations, and responsive design |
| `script.js` | Countdown timers, live bid demo, form handling, and navigation |

## Interactive Features to Demo in Class

| Feature | How to trigger |
|---|---|
| **Live Bid Demo** | Scroll to the dark "Live Bidding" section and click any `+$` button |
| **Countdown Timers** | Visible on each auction card — they tick in real time |
| **Registration Form** | Scroll to "Register to Bid", fill in Name + Email, click Submit |
| **Mobile Menu** | Resize the browser window to under 768 px wide |
| **Console trick** | Open DevTools → Console and type `placeBid(50000)` then press Enter |

## File Structure

```
/
├── index.html   ← Start here
├── styles.css   ← All styling
└── script.js    ← All interactivity
```
