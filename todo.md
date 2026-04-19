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
