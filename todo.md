# Project TODO

## Framework Implementation

### Database Schema
- [x] Add levels table (1-7 with metadata)
- [x] Add user_progress table (track completion per level)
- [x] Add referrals table (track who referred whom)
- [x] Add subscriptions table (Stripe subscription tracking)
### Referral System
- [x] Generate unique referral codes for users
- [x] Create referral tracking endpoint
- [ ] Implement Level 2 unlock logic (1 referral required)
- [ ] Add referral count display in dashboard

### Level Progression
- [x] Create level access control logic
- [x] Implement level unlock conditions
- [x] Add progress tracking per level
- [x] Create level completion logic

### Stripe Integration
- [ ] Create £20/month subscription product
- [ ] Implement subscription checkout flow
- [ ] Add webhook handler for subscription events
- [ ] Implement access control for paid levels (3-7)

### User Dashboard
- [ ] Create dashboard page
- [ ] Show current level and progress
- [ ] Display referral link and count
- [ ] Show subscription status
- [ ] Add level navigation

### Testing
- [ ] Test free Level 1 access
- [ ] Test referral system and Level 2 unlock
- [ ] Test subscription payment and Level 3-7 access
- [ ] Test level progression flow

## Content Creation
- [x] Design 7 levels with titles, descriptions, and learning outcomes
- [x] Create database seed script for levels
- [x] Populate levels table with content

## Motivation & Gamification System
- [ ] Design achievement/badge system with psychological principles
- [ ] Add achievements table to database
- [ ] Implement progress visualization and milestones
- [ ] Create adaptive difficulty modes for experienced users
- [ ] Add celebration moments and positive reinforcement
- [ ] Implement streak tracking and consistency rewards
- [ ] Add community stats and social proof elements

## Motivational Quotes & Messages
- [x] Add inspirational quote to homepage
- [x] Create level-specific start quotes
- [x] Design level completion celebration messages
- [x] Add progress reflection prompts
- [ ] Implement quotes in database and UI

## Knowledge Checks (Mid-Content Quizzes)
- [x] Design knowledge check system (2 questions mid-content)
- [ ] Add knowledge_checks table to database
- [ ] Create sample knowledge checks for each level
- [ ] Implement quiz interruption UI
- [ ] Add progress tracking for knowledge checks

## User Dashboard
- [x] Create Dashboard page component
- [x] Add progress overview section
- [x] Implement referral link with copy button
- [x] Build level navigation with lock/unlock UI
- [x] Add subscription status display
- [x] Create dashboard route in App.tsx

## Dashboard Improvements
- [x] Fix progress bar to show current level progress instead of overall completion

## Level 1 Content Development
- [x] Design lesson structure and database schema for lessons
- [x] Create 12 lesson content pages with educational content
- [x] Build lesson navigation (previous/next, progress tracking)
- [x] Implement knowledge checks system (database + UI)
- [x] Populate knowledge checks with 4 questions for Level 1
- [x] Integrate 3 existing scenarios as post-lesson practice activities
- [x] Test complete Level 1 learning flow

## Levels 2-7 Content Development
- [x] Create Level 2: Waterfall Methodology (12 lessons + 4 knowledge check questions)
- [x] Create Level 3: Agile & Scrum (12 lessons + 4 knowledge check questions)
- [x] Create Level 4: Stakeholder Management (12 lessons + 4 knowledge check questions)
- [x] Create Level 5: Risk & Budget Management (12 lessons + 4 knowledge check questions)
- [x] Create Level 6: Leadership & Team Management (12 lessons + 4 knowledge check questions)
- [x] Create Level 7: Advanced PM & Certification Prep (12 lessons + 28 final exam questions)
- [x] Test all levels end-to-end

## Gamification & Psychological Engagement
- [x] Design achievement/badge system with psychological principles
- [x] Add achievements and user_achievements tables to database
- [x] Implement XP/points system with calculations
- [x] Create streak tracking (daily login rewards)
- [x] Build progress visualization (completion rings, skill trees)
- [x] Add unlock animations and celebration moments
- [ ] Implement leaderboard system
- [ ] Add social proof elements (show completion stats)
- [ ] Create personalized encouragement messages
- [ ] Test gamification features

## Security Enhancements
- [ ] Implement rate limiting on API endpoints
- [ ] Add comprehensive input validation and sanitization
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy headers
- [ ] Implement XSS protection measures
- [ ] Add security headers (HSTS, X-Frame-Options, etc.)
- [ ] Implement secure session management
- [ ] Add SQL injection prevention checks
- [ ] Test security measures

## Quality Assurance
- [ ] Write comprehensive vitest tests for all features
- [ ] Implement error handling and user-friendly error messages
- [ ] Add performance optimization
- [ ] Ensure accessibility compliance (WCAG)
- [ ] Test mobile responsiveness
- [ ] Add loading states and skeletons
- [ ] Implement proper error boundaries
- [ ] Test all user flows end-to-end

## Display Name Feature
- [x] Add displayName field to user schema
- [x] Create onboarding flow to collect preferred name after first login
- [ ] Add profile settings page to update display name
- [x] Update all UI components to show display name instead of email
- [ ] Test display name feature

## Security Audit & Content Quality
- [x] Audit server for security vulnerabilities (rate limiting, CSRF, headers)
- [x] Review PM content accuracy against modern standards (PMI, APM, PRINCE2)
- [x] Implement security headers (Helmet.js - CSP, HSTS, X-Frame-Options)
- [x] Add rate limiting to API endpoints (express-rate-limit)
- [x] Add input validation and sanitisation (Zod refinements)
- [x] Fix level titles in database
- [x] Add missing knowledge checks for Levels 2 and 3
- [x] Improve PM content with practical tools and templates
- [x] Add PM glossary page (60+ terms)
- [x] Add PM frameworks reference page (6 frameworks with pros/cons/certifications)
- [x] Add Learning Resources section to Dashboard
- [ ] Run comprehensive tests

## Authentication System Replacement
- [ ] Store Google OAuth credentials as secrets
- [ ] Install auth dependencies (passport, bcrypt, google-auth-library)
- [ ] Update database schema for email/password auth
- [ ] Build email/password registration endpoint
- [ ] Build email/password login endpoint
- [ ] Build Google OAuth callback endpoint
- [ ] Build login page UI (email/password + Google button)
- [ ] Build registration page UI
- [ ] Update useAuth hook to use new auth system
- [ ] Remove Manus OAuth dependency
- [ ] Test complete auth flow

## Auth System Migration (Completed)
- [x] Install auth dependencies (bcryptjs, google-auth-library, jose)
- [x] Update database schema for email/password auth (passwordHash, googleId, authProvider, avatarUrl)
- [x] Build email/password registration endpoint (/api/auth/register)
- [x] Build email/password login endpoint (/api/auth/login)
- [x] Build Google OAuth callback endpoint (/api/auth/google)
- [x] Update SDK context to support both Manus OAuth and custom JWT sessions
- [x] Build login/register page UI with email/password + Google Sign-In button
- [x] Add VITE_GOOGLE_CLIENT_ID environment variable
- [x] Add Google Identity Services script to index.html
- [x] Update Onboarding page to redirect to login/register
- [x] Handle referral code from URL during registration

## Stripe Subscription (Completed)
- [x] Install Stripe SDK (stripe, @stripe/stripe-js)
- [x] Create £20/month subscription product and price in Stripe
- [x] Set STRIPE_PRICE_ID environment variable
- [x] Create Stripe router with checkout, portal, and status endpoints
- [x] Register Stripe webhook route before body parser
- [x] Handle webhook events (checkout.session.completed, subscription.updated, subscription.deleted)
- [x] Build Subscription page UI (/subscribe) with free vs premium comparison
- [x] Add /subscribe route to App.tsx
- [x] Update Dashboard to link to /subscribe page
- [x] Add subscription success toast on Dashboard after Stripe redirect

## Referral System (Completed)
- [x] Referral code generation on user creation
- [x] Track referrals when users register with ?ref=CODE URL
- [x] Display referral link in Dashboard
- [x] Level 2 unlock logic based on referral count >= 1
- [x] Referral banner on Login page when ?ref=CODE is present

## Security Hardening (Pre-Jenny Testing)
- [x] Patch drizzle-orm to >=0.45.2 (SQL injection CVE)
- [x] Patch fast-xml-parser via AWS SDK update (critical CVE)
- [x] Strip passwordHash/googleId/openId from auth.me response
- [x] Reduce body parser limit to 100KB for auth endpoints
- [x] Remove 'unsafe-eval' from CSP
- [x] Add Permissions-Policy header
- [x] Change cookie sameSite from "none" to "lax"
- [x] Add Zod schema validation to authRouter endpoints
- [x] Tighten auth rate limiter (10 req/15min, skip on success)
- [x] Add hpp middleware to prevent HTTP parameter pollution
- [x] Add X-Request-ID for traceability
- [x] Ensure no sensitive data in error responses

## New Features (Requested Post-Security Audit)
- [ ] Email verification: send verification email on registration
- [ ] Email verification: /verify-email page with token validation
- [ ] Email verification: gate paid content behind verified email
- [ ] Password reset: forgot password page with email input
- [ ] Password reset: secure token generation and email send
- [ ] Password reset: /reset-password page with new password form
- [ ] Password reset: token expiry (1 hour) and single-use enforcement
- [ ] Profile settings page: update display name
- [ ] Profile settings page: show subscription status and manage link
- [ ] Profile settings page: show account info (email, auth provider, member since)
- [ ] Profile settings page: change password (for email users)
- [ ] Add /profile route to App.tsx navigation

## Username Login Support
- [x] Add username column to users table (unique, nullable, max 32 chars)
- [x] Update login to accept username OR email
- [x] Update registration to optionally set a username
- [x] Create admin account (username: Admin, role: admin)

## Platform Repositioning (Career Transition Focus)
- [x] Redesign homepage: new hero "Completed the courses? Now prove you're ready."
- [x] Homepage: B2C + B2B sections (individual + business)
- [x] Homepage: social proof / trust signals (UK-focused)
- [x] Homepage: outcome-focused messaging (confidence, promotion, salary, job offer)
- [x] Homepage: premium, authoritative visual design
- [x] Homepage: clear CTA conversion flow
- [x] Dashboard: confidence score widget
- [x] Dashboard: PM readiness score / interview readiness tracker
- [x] Dashboard: streak + momentum tracking UI
- [x] Dashboard: motivational copy and psychological reinforcement messages
- [x] Onboarding: capture career transition background (previous industry, goal)
- [x] Onboarding: personalised readiness goal setting

## Commitment-Based Pricing Model
- [x] Add trialStartedAt, trialEndsAt, founderAccessEarned, founderAccessEarnedAt to users table
- [x] Add dailyEngagement table to track per-day login/lesson/simulation activity
- [x] Create engagementScore calculation (daily logins + lessons + simulations during trial)
- [x] Create isFounderEligible logic (5+ of 7 days active, 3+ lessons, 1+ simulation)
- [x] Create Stripe prices: Founder £19/month, Standard £39/month, Annual £197/year
- [x] Update access control: full free access during 7-day trial
- [x] Update access control: post-trial gate with Founder vs Standard pricing
- [x] Build Day X of 7 trial progress banner component
- [x] Build Founder Access unlock celebration screen
- [x] Redesign /subscribe page with 3-tier pricing (Founder, Standard, Annual)
- [x] Add commitment psychology copy throughout (earned access language)
- [x] Add motivational reinforcement messages to Dashboard and lesson pages
- [x] Update onboarding to set trialStartedAt on first login
- [x] Write vitest tests for trial eligibility and engagement scoring

## Emotionally Intelligent Cancellation Flow
- [x] Add cancellationReasons table (userId, reason, customReason, readinessScore, progressSnapshot, createdAt)
- [x] Add mentorRequests table (userId, helpTopics, mainQuestion, currentSituation, desiredOutcome, status, createdAt)
- [x] Add reEngagementOptIns table (userId, optIn, checkInDate, cancellationReasonId, createdAt)
- [x] Add tRPC procedures: submitCancellationReason, requestMentorCall, submitReEngagementOptIn
- [x] Admin notification on mentor request (notifyOwner with full context)
- [x] Build 4-step cancellation modal: Step 1 reason, Step 2 mentor offer, Step 3 question form, Step 4 farewell
- [x] Step 1: 9-option reason selector with "Other" free text
- [x] Step 2: Free PM Career Clarity Call offer (supportive, not sales)
- [x] Step 3: Mentor question form (topics + main question + current situation + desired outcome)
- [x] Step 4: Warm farewell with optional 3-month check-in opt-in (Yes / No thanks)
- [x] Store readiness score + progress snapshot + career goal at cancellation time
- [x] Replace current "Cancel Subscription" button with new flow entry point
- [x] Build admin cancellation intelligence view (/admin/cancellations)
- [x] Write vitest tests for cancellation flow procedures

## Mindset Conditioning System
- [x] Build Mindset Hub page (/mindset) — Social Feed Awareness, Habit Reinforcement, Identity Shift modules
- [x] Build 20-minute focus reset overlay — 60-second guided break with movement prompts
- [x] Build 10-second return countdown in final phase of reset break
- [x] Build 60-minute hydration reminder — premium toast with identity-reinforcement messaging
- [x] Add FocusResetProvider to app layout (tracks active time, triggers overlays)
- [x] Add Mindset Hub link to Dashboard navigation
- [x] Add mindset card to Dashboard (daily habit check-in)
- [x] Allow user to skip/snooze break (limited skips per session)
- [x] Allow user to dismiss hydration reminder with "Done" or "Snooze 10 min"

## Password Reset Flow
- [x] Add /api/auth/forgot-password endpoint (generate token, send email)
- [x] Add /api/auth/reset-password endpoint (validate token, update password)
- [x] Build /forgot-password page
- [x] Build /reset-password page
- [x] Add "Forgot password?" link to Login page

## Email & Branding Configuration
- [x] Update FROM_EMAIL to "Spitfire PM <support@spitfireitsolutions.com>"
- [x] Update APP_URL to https://www.spitfire-pm.com
- [x] Add reply-to header (support@spitfireitsolutions.com) to all outbound emails
- [x] Add contact email to website footer
- [x] Add contact email to homepage B2B / contact section

## Password Policy & Seed Accounts
- [x] Strengthen password validation: require uppercase + number + special character
- [x] Update validation in registration, password reset, and profile change password endpoints
- [x] Update password-reset.test.ts to cover special character requirement
- [x] Create test user: username=user, password=Edenbridge1! (hashed)
- [x] Update admin password to 1jV1v15ta03! (hashed)

## Lesson Redesign — Mastery-Based Learning

### Phase 1: Schema
- [x] Add parentLessonId (nullable) to lessons table — tracks which original lesson each micro-lesson came from
- [x] Add partNumber (1 or 2) to lessons table — Part A / Part B of split
- [x] Add isLevelAssessment boolean to knowledgeChecks — distinguishes end-of-level 5-question assessment from per-lesson confidence checks
- [x] Add reflectionResponse enum to userLessonProgress — (yes/almost/need_more_practice)
- [x] Add confidenceCheckPassed boolean to userLessonProgress — mastery gate
- [x] Run pnpm db:push

### Phase 2: AI-Generate Split Lessons
- [x] Split all 84 existing lessons into 168 micro-lessons (Part A + Part B, 8-12 min each)
- [x] Update estimatedMinutes to 8-12 for all lessons
- [x] Renumber lessonNumber 1-24 per level

### Phase 3: AI-Generate Confidence Check Questions
- [x] Generate 1 confidence check question per lesson (168 total)
- [x] Use supportive reinforcement messaging (not exam language)

### Phase 4: AI-Generate End-of-Level Assessments
- [x] Generate 5 assessment questions per level (35 total)
- [x] Mark as isLevelAssessment = true
- [x] Industry-standard, interview-relevant questions

### Phase 5: Backend Mastery Lock
- [x] Enforce: lesson viewed + confidence check passed = next lesson unlocked
- [x] Restrict trial to first 6 lessons of Level 1 only (was all 12)
- [x] Add reflection response saving endpoint

### Phase 6: Frontend Lesson Flow UI
- [x] Lesson content → Confidence Check → Reinforcement → Reflection → Unlock next
- [x] Mastery lock visual state (locked/unlocked/completed)
- [x] Supportive wrong-answer messaging
- [x] Positive correct-answer reinforcement

### Phase 7: End-of-Level Assessment UI
- [x] 5-question assessment at end of each level
- [x] Must pass to complete level
- [x] Visual: Lesson Complete → Confidence Check Passed → Next Lesson Unlocked

### Phase 8: Reset Break Upgrade
- [x] Stronger identity-based mentor messaging
- [x] Emotional check-in (Focused/Overwhelmed/Tired/Confident/Frustrated/Motivated)

### Phase 9: Tests & Checkpoint
- [x] Run all tests (81 passing)
- [x] Verify mastery lock flow end-to-end
- [x] Save checkpoint

## 7-Day Trial Logic
- [x] Backend: confirm/update TRIAL_LESSON_LIMIT = 6 (first 6 of 24 = 25% of Level 1)
- [x] Backend: block all levels 2-7 for trial/unsubscribed users
- [x] Backend: getTrialStatus procedure — trialActive, daysRemaining, trialExpired, lessonsUsed
- [x] Backend: canAccessLesson returns trial_limit reason with days remaining info
- [x] Frontend: trial countdown banner on Dashboard (X days remaining)
- [x] Frontend: locked lesson cards (lessons 7-24 in Level 1) show lock + upgrade CTA
- [x] Frontend: locked level cards (Levels 2-7) show lock + upgrade CTA for trial users
- [x] Frontend: upgrade prompt when user hits trial limit mid-lesson-flow
- [x] Frontend: trial expired full upgrade wall (post 7 days, no subscription)

## Profile Page
- [x] Backend: getProfile procedure (account info, auth provider, member since)
- [x] Backend: changePassword procedure (verify current password, hash new, enforce policy)
- [x] Backend: getSubscriptionStatus procedure (plan, status, renewal date, manage billing link)
- [x] Frontend: Profile page (/profile) — account info card, subscription card, change password card
- [x] Frontend: Add /profile route to App.tsx
- [x] Frontend: Add Profile link/icon to Dashboard header (user name + User icon button)

## Lesson Content Rendering Fix
- [x] Audit Lesson.tsx to see how lesson content is rendered (raw text vs markdown)
- [x] Add @source directive for streamdown to index.css (was missing — caused raw markdown display)
- [x] Add @plugin "@tailwindcss/typography" to index.css (was missing — prose classes had no effect)
- [x] Fix @source path to correct relative path (../../node_modules)
- [x] Update prose wrapper in Lesson.tsx with consistent heading/text sizing for dark theme
- [x] Verify fix: 81 tests passing, 0 TypeScript errors

## Lesson Typography Uniformity Fix
- [x] Diagnose: 122 of 168 lessons use H1 headings, 46 use H2/H3 only — causing size inconsistency
- [x] Add .lesson-prose CSS class to index.css — locks H1/H2 to 1.2rem, H3/H4 to 1.05rem, body to 1rem with !important overrides
- [x] Update prose wrapper in Lesson.tsx to include lesson-prose class alongside prose-slate
- [x] Remove conflicting per-heading prose-h1/h2/h3 modifier classes (now handled by lesson-prose)
- [x] 81 tests passing, 0 TypeScript errors

## Lesson Content \\n Fix
- [x] Verify literal \\n sequences are stored in DB instead of real newlines
- [x] Write and run script to replace all literal \\n with real newlines across all 168 lessons
- [x] Verify lesson content renders correctly after fix (hex 0A0A confirmed real newlines)
- [x] Run tests and save checkpoint

## APM Qualification Prep Integration
- [ ] Update `user` account: password = Abuyog79, role = admin
- [ ] Add qualifications table (PFQ, PMQ)
- [ ] Add apm_modules table (8 modules with content, terms, quiz questions)
- [ ] Add apm_module_progress table (userId, moduleId, quizScore, passed, completedAt)
- [ ] Run pnpm db:push
- [ ] Seed PFQ (4 modules) and PMQ (4 modules) content from apm-academy.jsx
- [ ] Build tRPC procedures: getQualifications, getModulesByQual, getModule, saveModuleProgress
- [ ] Add "Qualification Prep" section to Dashboard
- [ ] Build /qualification-prep page (PFQ / PMQ cards)
- [ ] Build /qualification-prep/:qualId page (module list with progress)
- [ ] Build /qualification-prep/:qualId/:moduleId page (study content + quiz)
- [ ] Wire quiz pass/fail with 55% threshold and retry support
- [ ] Add routes to App.tsx
- [ ] Run tests and save checkpoint

## APM Qualification Prep Integration (May 2026)
- [x] Update user account password to Abuyog79 and role to admin
- [x] Add apmQualifications, apmModules, apmModuleProgress tables to Drizzle schema
- [x] Push schema to database
- [x] Seed 2 qualifications (PFQ, PMQ) and 8 modules from apm-academy.jsx
- [x] Build apmRouter with getQualifications, getModulesByQualification, getModule, saveProgress procedures
- [x] Register apmRouter in main appRouter
- [x] Add Qualification Prep section to Dashboard.tsx (PFQ/PMQ cards)
- [x] Build QualificationPrep landing page (/qualification-prep)
- [x] Build QualificationModules page (/qualification-prep/:qualId)
- [x] Build ApmModule page with study/terms/quiz tabs (/qualification-prep/:qualId/:moduleId)
- [x] Register all 3 new routes in App.tsx
- [x] All 81 tests passing
- [x] Fix Level 1 → Level 2 transition bug: userProgress not updated when lessons completed, causing dashboard to show Level 1 as "Start Level" and redirect back to lesson 1
- [x] Add Level Complete celebration screen in Lesson.tsx with "Start Level N" CTA
- [x] Backfill userProgress for Jenny (userId 240002) who completed Level 1 without a progress entry
