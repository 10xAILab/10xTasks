# Unsloth Studio (docs summary)

**URL:** https://unsloth.ai/docs/new/studio  

**What it is:** **Unsloth Studio (Beta)** — an open-source, **no-code web UI** to **train**, **run**, and **export** open models in one **local** interface (Mac, Windows, Linux).

## Capabilities (high level)

- Run **GGUF** and **safetensors** models locally; training claims **~2× faster** training with **~70% less VRAM** for 500+ models (per docs).
- Modes: **text**, **vision**, **TTS/audio**, **embedding** models.
- **Data Recipes:** graph-node workflows to turn PDF/CSV/JSON/DOCX/TXT into datasets (multi-file upload); powered in part by NVIDIA NeMo Data Designer concepts.
- **Chat:** tool calling with **self-healing**, **web search**, **code execution** (Bash + Python), **auto inference parameter** tuning; **Model Arena** to compare two models.
- **Export:** to GGUF, 16-bit safetensors, etc., for llama.cpp, vLLM, Ollama, LM Studio, etc.
- **Observability:** training metrics (loss, grad norms, GPU utilization); view progress from other devices.
- **Privacy:** runs **offline/locally**; minimal hardware info for compatibility; token-based auth with encrypted passwords / JWT flows (per FAQ).

## Install / run (from docs)

- **One-liner:** `curl -fsSL https://unsloth.ai/install.sh | sh` (macOS/Linux/WSL); Windows: `irm https://unsloth.ai/install.ps1 | iex`
- **Launch:** activate `unsloth_studio` venv then `unsloth studio -H 0.0.0.0 -p 8888` (Windows path uses `Scripts\unsloth.exe`).
- **Docker:** image `unsloth/unsloth` (GPU; macOS support noted as coming).
- **Colab notebook** available for T4 exploration; first compile can be slow.

## Platform notes

- **Training:** NVIDIA GPUs (RTX 30/40/50, Blackwell, DGX, etc.) + **Intel GPUs** mentioned; **multi-GPU** supported with more improvements coming.
- **CPU / macOS:** **Chat** + **Data Recipes**; **MLX training** on Apple Silicon described as coming soon.
- **AMD:** Chat works; full Studio training support “coming soon” (use Unsloth Core for AMD per docs).

## Licensing

- **Dual license:** core library **Apache-2.0**; **Studio UI** (optional component) **AGPL-3.0** (per FAQ).

## Beta caveats

- Expect rapid changes; **first install** may take minutes while **llama.cpp** builds; precompiled binaries planned.
