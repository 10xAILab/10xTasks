#!/usr/bin/env bash
set -euo pipefail

INPUT="data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/cat/cat.webp"
CAT_DIR="data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/cat"
MOODS=("happy" "sad" "angry" "lol" "sleeping")

while [[ $# -gt 0 ]]; do
  case "$1" in
    --input)
      INPUT="$2"
      shift 2
      ;;
    --cat-dir)
      CAT_DIR="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

for mood in "${MOODS[@]}"; do
  output_dir="$CAT_DIR/moods/$mood"
  prompt="Create a \"$mood\" mood variation of this exact cat character, only changing the face mood/expression. Keep the same pose, proportions, line style, stroke thickness, and exact color palette. No new colors. Maintain a soft, cute, kid-friendly look. White background. Ensure it clearly matches the original character and same skin/fur color."

  node scripts/game-asset/generate-game-asset-openrouter.js \
    --mode variation \
    --input "$INPUT" \
    --output-dir "$output_dir" \
    --prompt "$prompt" \
    --metadata
done

bash scripts/game-asset/clean-animal-moods.sh \
  --animal cat \
  --moods-dir "$CAT_DIR/moods" \
  --output-dir "$CAT_DIR" \
  --padding 20 \
  --max-width 512 \
  --max-height 512
