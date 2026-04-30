---
created: 2026-04-26
tags:
  - project/lockedIn
  - legal
status: draft
related:
  - "[[lockedIn]]"
---

# lockedIn — Privacy Policy

**Effective Date:** [INSERT DATE]
**Last Updated:** [INSERT DATE]

This Privacy Policy explains how lockedIn ("we", "us", "the App") handles your information when you use the lockedIn iOS application.

> [!note] Template only — not legal advice. Have a lawyer review before publishing.

---

## 1. Information We Handle

### 1.1 Data Stored On Your Device Only
The following data **never leaves your device** and is not transmitted to us or any third party:

- **Selected blocked apps** — the list of apps you choose to gate. Apple's Family Controls framework returns this as opaque tokens; we cannot see app names, icons, or usage history.
- **Quiz history & scores** — past quiz attempts, pass/fail records, accuracy stats.
- **XP, level, streaks** — gamification progress.
- **App settings & preferences.**

This data is stored locally in `UserDefaults` and an App Group container (`group.lockedIn.shared`).

### 1.2 Data Sent to Third Parties
- **Study material text** — when you generate a quiz, the text content of the study material you select is sent to **Google's Gemini API** (Google LLC) so it can generate quiz questions. Google's handling of this data is governed by [Google's API Privacy Policy](https://policies.google.com/privacy). We do not store this content on any server we control.

### 1.3 Data We Do **Not** Collect
- We do **not** collect your name, email, phone number, location, contacts, or any personally identifying information.
- We do **not** track which apps you actually use or for how long.
- We do **not** use analytics SDKs, crash reporting that includes user content, or advertising identifiers.
- We do **not** sell, rent, or share data with advertisers.

---

## 2. Apple Family Controls & Screen Time

lockedIn uses Apple's **Family Controls** and **Screen Time** frameworks to apply blocking shields to apps you select.

- App selection is handled by Apple's `FamilyActivityPicker`, which returns **opaque tokens**. We never see the actual identity of the apps you block.
- Shielding, scheduling, and re-locking are performed entirely on-device by Apple's system extensions (`DeviceActivityMonitor`, `ManagedSettings`).
- Screen Time data is **not** read, stored, or transmitted by us.

---

## 3. Children's Privacy

lockedIn is designed for users **age 13 and older** (or the equivalent age of digital consent in your country). The app does not collect personal information from any user, regardless of age.

Family Controls authorization on a child's device requires a parent/guardian to approve via Screen Time settings, in accordance with Apple's parental control framework.

If you believe a child under 13 has provided personal information through the app, contact us and we will delete it (though as stated above, we do not collect personal information at all).

---

## 4. Permissions Requested

| Permission | Why |
|-----------|-----|
| **Family Controls** | Required to apply app shields and re-lock apps. |
| **Notifications** (optional) | Reminders when an unlock window is about to expire. |

You can revoke any permission at any time via iOS Settings.

---

## 5. Data Security

- Local data is stored within the iOS app sandbox and App Group container, protected by iOS-level encryption when your device is locked.
- Network calls to the Gemini API are made over HTTPS (TLS).
- We have no servers and therefore no central database to breach.

---

## 6. Your Rights

Because we do not collect personal data, there is no account to delete and no profile to access. You can:

- **Delete all local data** by uninstalling the app.
- **Stop sharing study material with Google** by not generating AI quizzes (a local fallback generator is available).

If you are in the EU/UK (GDPR), California (CCPA), or another jurisdiction with data rights, those rights still apply to any data we may handle. Contact us to exercise them.

---

## 7. Changes to This Policy

We may update this Privacy Policy. The "Last Updated" date at the top will change, and material changes will be communicated via the App Store update notes.

---

## 8. Contact

For privacy questions, contact:
**[INSERT NAME / COMPANY]**
**Email:** [INSERT EMAIL]
