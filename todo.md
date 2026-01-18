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
