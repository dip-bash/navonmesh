---
title: "Supply Chain Attack Hits Aqua Security's Trivy Scanner — CI/CD Secrets Stolen Across 75 GitHub Tags"
category: "CYBERSECURITY"
date: "2026-03-23"
readTime: "2 min read"
tags: ["supply chain", "CI/CD", "GitHub Actions", "Trivy", "cybersecurity", "cloud credentials", "TeamPCP"]
---

A threat actor identified as TeamPCP — also tracked as DeadCatx3 — executed a sophisticated supply chain attack against Aqua Security's Trivy vulnerability scanner on March 19, 2026, injecting credential-stealing malware into 75 out of 76 version tags in the `aquasecurity/trivy-action` GitHub repository. The attack involved force-pushing malicious code across all affected tags, replacing legitimate Trivy action code with an infostealer payload designed to operate silently within CI/CD pipeline environments.

The malware operates by dumping memory from the `Runner.Worker` process — the core GitHub Actions runtime — to extract secrets including API keys, tokens, and environment variables. It then sweeps the filesystem for SSH private keys and cloud credentials for AWS, GCP, Azure, and Kubernetes clusters, before encrypting and exfiltrating the collected data to an attacker-controlled domain using a typosquatted URL designed to evade casual inspection. The attacker also abused the `aqua-bot` service account to steal GPG keys and credentials for Docker Hub, Twitter, and Slack.

Trivy is one of the most widely deployed open-source container and infrastructure scanning tools in the DevSecOps ecosystem, integrated into pipelines across thousands of organizations globally. Any repository using the affected tags during the window of compromise would have had its secrets exfiltrated without generating obvious pipeline errors, as the malicious code preserves normal Trivy scan output to avoid detection.

Aqua Security has since pushed clean code to all affected tags and released version 0.13.0 with the malicious code removed. Organizations running Trivy in CI/CD pipelines are advised to rotate all secrets stored in affected runner environments, audit GitHub Actions logs from March 19 onward, and review service account permissions to limit the blast radius of similar attacks in the future.
