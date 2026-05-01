<json prompt from data/teddy-bear-math-lovable/miniprompts/teddy-bear-math-special-reward-scenes.json>.

BACKGROUND: solid plain white only (no gradients, no vignette, no texture).

HARD CONSTRAINTS:
- Character-only overlay asset: no scenery, no ground plane, no sky, no distant landscape, no interior rooms.
- No shadows outside the character outline.

STRICT POSE LOCK:
- Use the original limb anatomy (<anatomy short description, e.g. 2 front paws, 2 hind legs>).
<If one limb is holding the prop use the following section, otherwise do not include it>
  - The RIGHT FRONT LIMB is the ONLY limb interacting with the <prop>.
  - The RIGHT FRONT LIMB is raised and bent naturally to hold the <prop>.
  - The LEFT FRONT LIMB remains on the ground, visible.
<If both limbs are holding the prop then use the following, otherwise do not include it>
  - BOTH FRONT LIMBS are the ONLY limbs interacting with the <prop>.
  - The RIGHT FRONT LIMB is raised and bent naturally to hold the <prop>.
- Both hind limbs remain unchanged and visible.

FORBIDDEN:
- No additional limbs or duplicate limbs.
- No hidden second limb behind the <prop>.
- No floating or detached limb.