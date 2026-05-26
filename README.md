Here's the updated README:

---

# Weekly Planner

A personal productivity tool that surfaces exactly one right-sized task each weeknight, so your dedicated hour goes toward doing — not deciding.

**Built for** anyone with one focused hour on weekday evenings who wants to make consistent progress on a side project without burning mental energy at the end of a long day.

---

## What it does

You spend a few minutes on the weekend setting up your week — your goal, your steps, and three energy-matched task variants per step (low, medium, high). On weeknights, you check in, tap your energy level, and the tool shows you exactly one task. You decide when to move on.

---

## Technologies used

- HTML, CSS, vanilla JavaScript
- Anthropic Claude API (`claude-sonnet-4-20250514`) for generating energy-matched task variants
- Vercel for deployment (auto-deploys on every push)
- localStorage for persisting plan data across sessions

---

## Setup

1. Clone the repository
   ```
   git clone https://github.com/eleshavartak/she-vibes-project.git
   ```
2. Open `index.html` in your browser — no build step needed
3. To enable AI generation, add your Anthropic API key as an environment variable in Vercel:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
4. Deploy to Vercel and the serverless proxy handles all API calls securely

---

## What's next

- Move the Anthropic API call to a Vercel serverless function so the API key never touches the browser
- Replace the pre-filled demo content with a real weekend input flow
- Explore a mobile-optimised layout for one-thumb weeknight use

---