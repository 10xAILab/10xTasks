#!/usr/bin/env bash
set -euo pipefail

ANIMAL=""
MOODS_DIR=""
OUTPUT_DIR=""
PADDING=20
MAX_WIDTH=512
MAX_HEIGHT=512

while [[ $# -gt 0 ]]; do
  case "$1" in
    --animal)
      ANIMAL="$2"
      shift 2
      ;;
    --moods-dir)
      MOODS_DIR="$2"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --padding)
      PADDING="$2"
      shift 2
      ;;
    --max-width)
      MAX_WIDTH="$2"
      shift 2
      ;;
    --max-height)
      MAX_HEIGHT="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$ANIMAL" ]]; then
  echo "Missing required --animal <name>" >&2
  exit 1
fi

if [[ -z "$MOODS_DIR" ]]; then
  MOODS_DIR="data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/$ANIMAL/moods"
fi
if [[ -z "$OUTPUT_DIR" ]]; then
  OUTPUT_DIR="data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/$ANIMAL"
fi

mkdir -p "$OUTPUT_DIR"

for mood_path in "$MOODS_DIR"/*; do
  [[ -d "$mood_path" ]] || continue
  mood="$(basename "$mood_path")"

  mood_webps=()
  for candidate in "$mood_path"/*.webp; do
    if [[ "$candidate" == "$mood_path/*.webp" ]]; then
      continue
    fi
    mood_webps+=("$candidate")
  done

  if [[ ${#mood_webps[@]} -eq 0 ]]; then
    echo "Skipping '$mood': no .webp found"
    continue
  fi
  if [[ ${#mood_webps[@]} -gt 1 ]]; then
    echo "Expected one .webp in '$mood_path', found ${#mood_webps[@]}" >&2
    exit 1
  fi

  input_file="${mood_webps[0]}"
  base_name="$ANIMAL-$mood"

  node scripts/game-asset/clean-accessory.js \
    --input "$input_file" \
    --output-dir "$OUTPUT_DIR" \
    --name "$base_name" \
    --padding "$PADDING" \
    --max-width "$MAX_WIDTH" \
    --max-height "$MAX_HEIGHT" \
    --webp

  mv "$OUTPUT_DIR/${base_name}-clean.webp" "$OUTPUT_DIR/${base_name}.webp"
  echo "Created: $OUTPUT_DIR/${base_name}.webp"
done
