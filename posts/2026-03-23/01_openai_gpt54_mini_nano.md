---
title: "OpenAI Releases GPT-5.4 Mini and Nano — Fastest Small Models Yet, Built for Subagent Workflows"
category: "AI"
date: "2026-03-23"
readTime: "2 min read"
tags: ["OpenAI", "GPT-5.4", "LLM", "model release", "AI agents", "GitHub Copilot"]
---

OpenAI has officially released GPT-5.4 mini and GPT-5.4 nano, two new small-footprint models designed to bring many of the capabilities of the flagship GPT-5.4 to lower-cost, higher-speed deployments. The mini model runs more than twice as fast as its predecessor while approaching the performance of the full GPT-5.4 on key benchmarks including SWE-Bench Pro and OSWorld-Verified. The nano is the smallest and cheapest version yet — optimized for classification, data extraction, ranking, and simpler coding subtasks.

The release is explicitly designed around a new multi-model architecture pattern where a larger model such as GPT-5.4 handles planning, coordination, and final judgment while delegating narrow subtasks to GPT-5.4 mini subagents running in parallel. OpenAI describes this as the model composition approach for agentic workflows — allowing developers to balance intelligence and cost across a single pipeline rather than choosing one model for everything.

In the API, GPT-5.4 mini supports a 400,000-token context window and is priced at $0.75 per million input tokens and $4.50 per million output tokens. It also supports text, image, tool use, function calling, web search, file search, computer use, and skills — making it one of the most capable small models ever released with full multimodal tool support. GitHub Copilot has begun rolling out GPT-5.4 mini across its VS Code, JetBrains, Xcode, and Visual Studio integrations, where early tests report the fastest time-to-first-token of any Copilot model and strong performance on codebase exploration tasks.

In ChatGPT, the mini model is available to free and entry-tier users as the "Thinking" mode option, and will serve as a rate-limit fallback for paid users who exceed their GPT-5.4 Thinking quota — ensuring continuity of reasoning capabilities even during peak usage.
