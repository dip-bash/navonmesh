---
title: "CISA Flags Five Actively Exploited Flaws in Apple, Craft CMS, and Laravel — Patch Deadline April 3"
category: "CYBERSECURITY"
date: "2026-03-23"
readTime: "2 min read"
tags: ["CISA", "Apple", "Craft CMS", "Laravel", "WebKit", "patch", "KEV", "cybersecurity"]
---

The US Cybersecurity and Infrastructure Security Agency has added five actively exploited vulnerabilities to its Known Exploited Vulnerabilities catalog, issuing a mandatory patch deadline of April 3, 2026 for all federal agencies. The flaws span Apple's WebKit and kernel components, Craft CMS, and Laravel Livewire — a combination that covers both enterprise web applications and consumer Apple devices, suggesting broad opportunistic exploitation rather than targeted attacks against a single sector.

The two Apple flaws include a WebKit memory corruption issue triggered by maliciously crafted web content, and a kernel memory corruption vulnerability that allows a malicious application to corrupt memory shared between processes. Both were patched in prior Apple security releases but remain unpatched across a significant portion of the installed device base. The WebKit flaw in particular is a known favorite for browser-based attack chains, as it can be triggered simply by visiting a compromised or malicious website.

The Craft CMS and Laravel Livewire vulnerabilities round out the five, extending the risk surface to web application frameworks widely used in enterprise content management and PHP-based application development. Exploitation of CMS vulnerabilities at scale is a persistent threat vector, often used as an initial access mechanism in ransomware campaigns or to establish persistent footholds for later lateral movement.

Federal agencies face the April 3 deadline under Binding Operational Directive 22-01. Private sector organizations are strongly encouraged to treat CISA KEV additions as urgent patching signals, as inclusion on the list is based on verified evidence of active exploitation in the wild rather than theoretical severity scores alone.
