
## Example pig lol mood script

node scripts/game-asset/generate-game-asset-openrouter.js \
  --mode variation \
  --input "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/pig/pig.webp" \
  --output-dir "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/pig/lol-mood" \
  --prompt "Create a \"laugh out loud (LOL)\" mood variation of this exact pig character by changing facial expression only. Expression requirements: wide open laughing mouth (big smile), joyful squinting or crescent eyes, clearly excited happy cheeks, and an unmistakable giggling/laughing vibe. This must read as active laughter, not just a mild smile. DO NOT change body pose, head position, limb positions, silhouette, camera framing, orientation, scale, or proportions. Keep the exact same original pose and full body geometry. Keep line style, stroke thickness, and exact color palette (#FFB8BC, #FD7874, #4C0331, #FFFFFF, #FFC0C4). No new colors. Maintain a soft, cute, kid-friendly look. White background. Ensure it clearly matches the original character and same skin color." \
  --metadata

## Example dinosaur clean script

node scripts/game-asset/clean-accessory.js \
  --input '/Users/chico/projects/10x/10xTasks/data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/dinosaur.webp' \
  --output-dir "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/accessories/cleaned" \
  --padding 20 \
  --max-width 512 \
  --max-height 512 \
  --metadata

## Example clean all pig moods script

bash scripts/game-asset/clean-pig-moods.sh \
  --moods-dir "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/pig/moods" \
  --output-dir "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/pig" \
  --padding 20 \
  --max-width 512 \
  --max-height 512

## Example generate + clean cat moods script

bash scripts/game-asset/generate-cat-moods.sh \
  --input "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/cat/cat.webp" \
  --cat-dir "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/cat"

## Example generic clean all animal moods script

bash scripts/game-asset/clean-animal-moods.sh \
  --animal "cat" \
  --moods-dir "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/cat/moods" \
  --output-dir "data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/cat" \
  --padding 20 \
  --max-width 512 \
  --max-height 512

## Example png -> webp conversion script

node --input-type=module -e "import sharp from 'sharp'; await sharp('data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/pig/pig-sad-clean.png').webp({quality:85,alphaQuality:100,effort:4}).toFile('data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/pig/pig-sad.webp');"

## Example candy land background script

npm run game-asset:openrouter -- \
  --mode background \
  --scene "candy land with lollipop trees and gumdrop hills" \
  --composition portrait \
  --subject-zone "center-bottom" \
  --empty-space-for-character \
  --background-detail low \
  --time-of-day "bright sunny day" \
  --lighting "soft pastel daylight" \
  --output-dir "data/teddy-bear-math-lovable/visuals/pets/bg/candy-land"