# Lovable prompt: Teddy Bear Math

Copy the block below into Lovable to generate the app.

---

Build a mobile-first web app called **Teddy Bear Math**: a daily math game for kids focused on multiplication, in the style of Wordle + Elevate + King of Math.

**Core loop:** Each day the player has 3 challenges: (1) **East** — warm up multiplication, (2) **Fun** — playful exercise, (3) **Brainy** — harder challenge, if best then multi-step or riddle-like multiplication. Solving challenges earns **teddy bear coins** (gold star coins). Coins can be spent to unlock **digital pets** (cute pony, unicorn, kitten, dog, bunny, bear cub, dragon, panda) and other rewards. Goal: cute, warm, rewarding, 80% easy and 20% challenging so kids feel successful and come back daily.

**Screens:**  
- **Home:** Show today’s 3 challenge cards (Easy, Fun, Brainy), and coin balance; tap play to start.  
- **Challenge:** One multiplication puzzle (e.g. “5 x 6”, up to 12). Big, clear problem and input (number pad or multiple choice). On submit: if correct, show “Great job!”, add coins (same total as multiplication answer), and a small sparkle animation; if wrong, gentle message and option to try again.  
- **Results:** After each challenge, show stars/coins earned and a “Next” or “Back“ button. On first challenge completed (at least one card succesful), one pet is earned.
- **Shop:** List of pet accessories with coin prices; “Buy” spends coins and unlocks the item with a small sparkle.  
- **Pets:** View owned pets (soft colors, big eyes).

**Brand and UI:**
- **Vibe:** Cute, warm, playful, safe for kids, slightly magical. Not babyish, not neon or chaotic. Like Duolingo + Wordle + Animal Crossing.  
- **Colors:** Primary Sky Blue (#66C1E4), Honey Gold (#F4B400), Cream (#FFF3E0); Light Teddy Brown (#A36B3E) only for bear/logo. Secondary: Mint (#6ED4A7), Orange (#FFA726), Peach (#FFB085), Soft Yellow (#FFE082). Sparkle: Fire Yellow (#FFC107), Bright Gold (#FFD54F).  
- **Fonts:** Rounded, thick, kid-friendly (e.g. Nunito).  
- **UI:** Rounded buttons and cards, soft shadows, big tap targets. Gold coins have star inside it; hearts/lives in soft red. Background: soft cream-to-sky-blue gradient background with very subtle + − × ÷ symbols and rounded pastel shapes, keeping it clean, warm, and playful like Duolingo/Animal Crossing.
- **Sparkles:** Use small star/glow animations on correct answer, level complete, and when earning or spending coins — quick and satisfying, not fireworks or casino-style.  
- **Copy:** Encouraging tone — e.g. “Great job!”, “Nice thinking!”, “You earned a teddy coin!”, “Your pet is happy!”.

**Logo:** A cute 2D cartoon teddy bear with a small crown (teddy bear king), in Light Teddy Brown, holding a gold coin with a star inside it; should still read clearly at 48px (e.g. head + crown). Use it in the header and as the app identity.

**Tech:** Use local state or a simple store for: today’s 3 challenges, which are completed, coin balance, and owned pets/unlocks. Persist coins and unlocks (e.g. localStorage). Each day reset the 3 challenges (by calendar day). Prefer mobile-first layout and large touch targets.

Start with the home screen, one working challenge type (multiplication), coin earning, and a simple shop with at least one pet. Add sparkle effects and the logo. Keep the first version simple and polished rather than feature-heavy.
