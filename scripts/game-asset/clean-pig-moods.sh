#!/usr/bin/env bash
set -euo pipefail

bash scripts/game-asset/clean-animal-moods.sh \
  --animal pig \
  "$@"
