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
