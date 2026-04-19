# Learnings — Unsloth Studio

1. **Local-first stack:** If your goal is **owning weights and data** and avoiding cloud lock-in, Studio is explicitly **local/offline** with minimal telemetry—a different default than many hosted fine-tuning UIs.

2. **One UI for infer + train + export:** The workflow (load model → prepare data → train → compare in Arena → export to GGUF/safetensors) matches how practitioners actually iterate; worth evaluating vs separate tools (Ollama + notebook + separate export scripts).

3. **Data Recipes reduce “dataset engineering” friction:** Uploading raw docs and generating structured training data addresses a common bottleneck; still **validate** label quality and leakage for your use case.

4. **Tooling + code execution in chat:** Self-healing tool calls and Bash/Python execution push the product toward **agentic** local use—not just static prompting—useful for eval harnesses and quick experiments.

5. **Hardware reality:** **Training** is still **NVIDIA-centric** in Studio; Apple/AMD are **partial or roadmap**—plan hardware before committing to Studio for training (inference may be fine on CPU for smaller GGUFs).

6. **License compliance:** If you ship a product bundling Studio UI, **AGPL-3.0** on the UI component may matter; **Apache-2.0** core is friendlier for library use—read the dual-license FAQ before redistribution.

7. **Beta expectations:** Install time, binary prebuilds, and API completeness (e.g. OpenAI-compatible APIs “coming” per FAQ) mean it’s best for **early adopters** willing to ride churn.
