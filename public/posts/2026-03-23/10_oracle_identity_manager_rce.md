---
title: "Oracle Patches CVSS 9.8 RCE Flaw in Identity Manager — No Authentication Required"
category: "CYBERSECURITY"
date: "2026-03-23"
readTime: "2 min read"
tags: ["Oracle", "Identity Manager", "CVE-2026-21992", "RCE", "CVSS 9.8", "enterprise security"]
---

Oracle has released an emergency security update to address a critical remote code execution vulnerability in its Identity Manager and Web Services Manager products, carrying a CVSS score of 9.8 out of 10. The flaw, tracked as CVE-2026-21992, is remotely exploitable without any authentication — meaning an attacker with network access to an exposed Oracle Identity Manager instance can achieve code execution on the underlying system without requiring credentials, session tokens, or any prior foothold.

Oracle Identity Manager is a widely deployed enterprise identity governance platform used to manage user provisioning, access certifications, and role management across large organizations. Its central position in enterprise identity infrastructure makes it an especially high-value target: compromise of an IAM platform can grant attackers visibility into all managed accounts, the ability to provision new privileged accounts, and access to credentials and access logs across the enterprise.

The no-authentication exploitation path is particularly concerning because it removes the last line of defense that many organizations rely on — network perimeter controls and credential-based access — as the only mitigations before patching. Oracle has urged customers to apply the patch immediately and review network access controls to ensure Identity Manager administrative interfaces are not exposed to untrusted networks.

The vulnerability adds to a growing list of critical flaws in identity and access management infrastructure disclosed in early 2026, a trend that security researchers attribute to increased attacker focus on identity systems as a higher-leverage initial access vector compared to endpoint compromise.
