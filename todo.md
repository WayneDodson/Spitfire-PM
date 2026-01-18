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
