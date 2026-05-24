# Spitfire PM — APM Academy

Internal APM certification training platform built for staff development. Covers the full **PFQ → PMQ** learning pathway with degree-level study content and GCSE-level assessments.

## Qualifications Covered

| Qualification | Level | Modules |
|---|---|---|
| PFQ — Project Fundamentals Qualification | Foundation | 4 |
| PMQ — Project Management Qualification | Practitioner | 4 |

## Setup

1. Clone the repo
2. Copy `config.example.js` to `config.js`
3. Add your credentials to `config.js` (this file is gitignored and must never be committed)
4. Load `config.js` before `apm-academy.jsx` in your HTML entry point

## Credential Security

`config.js` is listed in `.gitignore` and will never be pushed to this repository. Only the example template (`config.example.js`) with placeholder values is committed. Credentials are known only to the IT Director.

## Status

Currently in UAT — single test user. Production release will introduce a database, proper authentication, and multi-user support.

---
*Managed by IT Director. Internal use only.*
