# Teddy Bear Math — Vibe code plan

**Source:** ChatGPT conversation in `data/teddy-bear-math-lovable/Teddy Bear Math - Game (2026-03-14).md`

---

## 1. Game summary

- **Name:** Teddy Bear Math  
- **Audience:** Children (math learning, multiplication focus)  
- **Genre:** Daily, bite-sized math game — Wordle / Elevate / King of Math style  
- **Core loop:** Play 3 daily challenges (multiplication) → earn teddy bear coins → spend coins on digital pets and unlocks → return next day  
- **Difficulty mix:** ~80% easy, 20% challenging. Three challenge types per day: **Warm-Up** (easy), **Fun Twist** (playful puzzle/pattern), **Brainy Challenge** (harder, multi-step or riddle-like).  
- **Rewards:** Teddy bear coins (gold, bear-shaped); digital pets (pony, kitten, dog, bunny, dragon rare, panda rare) — chibi, soft colors, big eyes. Unlocks: themes, outfits, puzzle types.  
- **Brand:** Cute, warm, playful, rewarding, safe for kids, slightly magical. Not babyish, not neon or chaotic. Think Duolingo + Wordle + Animal Crossing + kids toy brand.

---

## 2. Brand & UI (for implementation)

- **Primary colors:** Sky Blue `#66C1E4`, Honey Gold `#F4B400`, Cream `#FFF3E0`, Light Teddy Brown `#A36B3E` (bear/logo only).  
- **Secondary:** Mint `#6ED4A7`, Orange `#FFA726`, Peach `#FFB085`, Soft Yellow `#FFE082`.  
- **Sparkle/accents:** Fire Yellow `#FFC107`, Bright Gold `#FFD54F`.  
- **Fonts:** Rounded, thick, kid-friendly — e.g. Nunito, Fredoka, Baloo, Poppins Rounded, Quicksand.  
- **UI:** Rounded buttons and cards, soft shadows, big tap targets. Coins = gold teddy shape; hearts/lives = soft red.  
- **Sparkles:** On correct answer, finish level, earn coin, buy pet, unlock. Small stars/glow, quick satisfying animation — no fireworks/casino style.  
- **Background:** Cream, soft gradient, optional clouds/stars.  
- **Copy tone:** Encouraging — e.g. “Great job!”, “Nice thinking!”, “You earned a teddy coin!”, “Your pet is happy!”.

---

## 3. Screens & flows

| Screen / flow | Purpose |
|---------------|--------|
| **Home / Today** | Show 3 daily challenges (Warm-Up, Fun Twist, Brainy Challenge); coin balance; current pet; short CTA to play. |
| **Challenge** | One multiplication puzzle (target number, factors, or pattern). Input or choices; submit; feedback (correct → coin + sparkle; wrong → gentle message, maybe hearts/lives). |
| **Results / Level complete** | Summary (stars, coins earned), sparkle, “Great job!”; button to next challenge or back to home. |
| **Coins / Shop** | List of things to buy: pets, themes, outfits. Spend teddy coins; unlock with confirmation and sparkle. |
| **Pets** | View owned pets; optional “care” or “happy” state; link to shop to get more. |
| **Settings / Profile** | Optional: name, avatar, sound on/off, daily reminder. |

**Data flow (high level):**

- **Daily state:** Which day’s challenges are active; which of the 3 are done; today’s puzzle configs (e.g. target number, difficulty).  
- **Player state:** Coins balance; owned pets and unlocks; progress (e.g. streak, levels completed).  
- **Puzzles:** Multiplication-focused (e.g. “get to 24 using ×”, “which factors?”, “fill the blank”). One set per day; can be generated from rules or fixed daily seed.

---

## 4. Components (high level)

- **Layout:** App shell with soft gradient background; header (logo, coins, hearts); main content area; optional bottom nav (Home, Shop, Pets).  
- **Challenge card:** Shows challenge type (Warm-Up / Fun Twist / Brainy), title, “Play” button.  
- **Puzzle UI:** Problem statement, input (e.g. number pad or multiple choice), Submit, feedback area (message + optional sparkle).  
- **Coin display:** Teddy-shaped coin icon + count.  
- **Pet card:** Small chibi pet image, name, “Happy” or similar.  
- **Shop item:** Icon, name, price in coins, “Buy” button.  
- **Sparkle / reward effect:** Reusable small animation (stars/glow) on success events.  
- **Logo:** Teddy bear king (crown, 2D cartoon), works at 48px; use Light Teddy Brown for bear.

---

## 5. Tech / platform notes (Lovable)

- **Stack:** Use Lovable’s default (e.g. React/Next or similar); keep state simple (e.g. React state or a small store) for: today’s challenges, completed flags, coins, owned pets.  
- **Persistence:** Local storage or simple backend for: coins, pets, unlocks, last played date (to know “today” and reset daily challenges).  
- **Daily reset:** If “today” is a new calendar day, reset the 3 challenges and optionally grant a small bonus (e.g. 1 coin) for coming back.  
- **Responsive:** Mobile-first; large touch targets; avoid tiny text.  
- **Assets:** Logo (teddy king, 48px+); coin image (teddy-shaped); simple pet icons or placeholders; optional sparkle/star SVG or CSS.

---

## 6. Implementation order (suggested)

1. **Shell + branding:** Background, logo, fonts, color tokens, header (coins + hearts).  
2. **Home:** List of 3 daily challenge cards; wire “Play” to a single challenge screen.  
3. **One challenge type:** Implement one multiplication puzzle type (e.g. “reach this product” or “pick the factors”); correct/incorrect feedback and coin reward.  
4. **Daily logic:** Define today’s 3 puzzles (e.g. by date seed); mark completed; show results and return to home.  
5. **Coins + shop:** Coins state; simple shop list; “Buy” deducts coins and unlocks item (e.g. pet).  
6. **Pets screen:** Show owned pets; link to shop.  
7. **Sparkles and polish:** Add sparkle on correct answer, level complete, purchase; tune copy and animations.  
8. **Optional:** Streak, settings, sound.

---

## 7. Out of scope for v1

- Backend/auth (can stay local-only).  
- Multiple difficulty tiers or adaptive difficulty (can be fixed 80/20 mix per day).  
- Complex pet care minigames (pets can be static “owned” state).  
- Real payments or ads.

---

*Use this plan together with `lovable-prompt.md` when generating the app in Lovable.*
