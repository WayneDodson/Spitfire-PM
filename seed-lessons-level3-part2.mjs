import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level3Lessons = [
  {
    levelId: 3,
    lessonNumber: 3,
    title: "User Stories & Backlog Management",
    content: `# User Stories & Backlog Management

User stories are the primary way Agile teams capture requirements. Unlike traditional requirements documents, user stories are lightweight, conversational, and focused on user value. Effective backlog management ensures the team always works on the highest-value items.

## What is a User Story?

A user story is a short, simple description of a feature told from the perspective of the person who desires the capability.

**Standard Format**:

"As a [type of user], I want [goal] so that [reason/benefit]."

**Examples**:

"As a customer, I want to save items to a wishlist so that I can purchase them later."

"As an administrator, I want to export user data to CSV so that I can analyze it in Excel."

"As a mobile user, I want the site to load quickly so that I don't waste my data plan."

## The Three Cs

Ron Jeffries described user stories using three Cs:

### Card

The written story on a card (or digital equivalent). This is a placeholder for a conversation, not a complete specification.

**Keep it brief**: 1-2 sentences maximum.

**Example Card**:

"As a shopper, I want to filter products by price range so that I can find items within my budget."

### Conversation

Discussion between team and Product Owner to understand details.

**Questions to explore**:
- What exactly does "filter by price range" mean?
- Should it be a slider, dropdown, or text input?
- What happens if no products match the filter?
- Should filters persist when navigating away?
- What about products on sale—show original or sale price?

The conversation happens during backlog refinement and sprint planning.

### Confirmation

Acceptance criteria that confirm the story is complete.

**Example Acceptance Criteria**:
- User can set minimum and maximum price
- Product list updates immediately when filter changes
- Products outside price range are hidden
- Filter persists during session
- "No results" message appears if no products match
- Sale price is used for filtering

## INVEST Criteria

Good user stories are INVEST:

### Independent

Stories should be independent of each other when possible.

**Why**: Enables flexible prioritization and parallel development.

**Bad Example**: 
- Story A: "Create user database table"
- Story B: "Create user registration form" (depends on Story A)

**Better Example**:
- Story A: "Enable user registration with email and password"

(Implementation details like database tables are handled within the story)

### Negotiable

Stories are not contracts. Details are negotiable during conversation.

**Why**: Allows team to find the best solution.

**Example**: Story says "filter by price range." Team might propose a slider, but during conversation, discover a dropdown with preset ranges works better for users.

### Valuable

Each story must deliver value to users or business.

**Why**: Ensures we're building useful features, not just technical tasks.

**Bad Example**: "Refactor database schema"

(Technical task, no user value)

**Better Example**: "Improve product search speed to under 1 second"

(User-facing benefit, refactoring is implementation detail)

### Estimable

Team must be able to estimate the story.

**Why**: Enables planning and prioritization.

**If not estimable**:
- Story is too vague (needs more conversation)
- Story is too large (needs to be split)
- Team lacks knowledge (needs a spike)

### Small

Stories should be completable within one sprint.

**Why**: Enables frequent delivery and feedback.

**Rule of thumb**: Story should take 1-3 days for one person, or fit within sprint with other stories.

**If too large**: Split into smaller stories.

### Testable

Must be able to verify the story is complete.

**Why**: Prevents ambiguity about "done."

**How**: Acceptance criteria define tests.

**Example**:
- Given I'm on the products page
- When I set price range to £10-£50
- Then I see only products priced £10-£50
- And I see a count of matching products

## Writing Effective User Stories

### Focus on the "Why"

The "so that" clause is crucial—it explains the value.

**Weak**: "As a user, I want to change my password."

(Missing the "why")

**Strong**: "As a user, I want to change my password so that I can maintain account security if I suspect it's been compromised."

(Now we understand the motivation and can design accordingly)

### Use Personas

Instead of generic "user," use specific personas.

**Generic**: "As a user, I want to see product reviews."

**Specific**: "As a budget-conscious shopper, I want to see product reviews so that I can make informed purchase decisions."

(Different personas have different needs and priorities)

### Keep Stories User-Focused

Stories should describe user goals, not technical implementation.

**Bad**: "As a developer, I want to implement OAuth authentication."

(Technical task, not user story)

**Good**: "As a user, I want to log in with my Google account so that I don't have to create another password."

(User-focused, OAuth is implementation detail)

### Include Acceptance Criteria

Always include acceptance criteria—they define "done."

**Format Options**:

**Checklist**:
- [ ] User can enter min and max price
- [ ] Products update immediately
- [ ] Filter persists during session

**Scenario (Given-When-Then)**:

Given I'm viewing products
When I set price range to £10-£50
Then I see only products in that range

**Both formats work—choose what your team prefers.**

## Splitting User Stories

Large stories (epics) must be split into smaller stories:

### Split by Workflow Steps

**Epic**: "As a user, I want to purchase products."

**Split**:
- "As a user, I want to add products to cart."
- "As a user, I want to enter shipping information."
- "As a user, I want to enter payment information."
- "As a user, I want to review order before submitting."
- "As a user, I want to receive order confirmation."

### Split by Business Rules

**Epic**: "As a user, I want to apply discount codes."

**Split**:
- "As a user, I want to apply percentage discount codes."
- "As a user, I want to apply fixed-amount discount codes."
- "As a user, I want to apply free shipping discount codes."

### Split by Data Variations

**Epic**: "As a user, I want to search products."

**Split**:
- "As a user, I want to search products by name."
- "As a user, I want to search products by category."
- "As a user, I want to search products by brand."

### Split by CRUD Operations

**Epic**: "As an admin, I want to manage users."

**Split**:
- "As an admin, I want to view user list."
- "As an admin, I want to create new users."
- "As an admin, I want to edit user details."
- "As an admin, I want to deactivate users."

### Split by Simple/Complex

**Epic**: "As a user, I want to share products on social media."

**Split**:
- "As a user, I want to share products via link."
- "As a user, I want to share products on Facebook."
- "As a user, I want to share products on Twitter."
- "As a user, I want to share products on Instagram."

Start with simple version, add complexity later.

### Split by Happy Path / Variations

**Epic**: "As a user, I want to log in."

**Split**:
- "As a user, I want to log in with valid credentials." (happy path)
- "As a user, I want to see error message for invalid credentials."
- "As a user, I want to reset forgotten password."
- "As a user, I want to stay logged in across sessions."

## Product Backlog Management

The Product Owner manages the product backlog:

### Backlog Ordering

Order items by value, not just priority labels.

**Factors to Consider**:

**Business Value**: How much value does this deliver?

**Cost of Delay**: What's the cost of not doing this now?

**Risk Reduction**: Does this reduce technical or business risk?

**Dependencies**: Does this enable other valuable work?

**Learning**: Do we need this to learn something important?

**Example Ordering Logic**:

1. Critical bug fixes (high cost of delay)
2. Features enabling upcoming marketing campaign (time-sensitive)
3. High-value features with low effort (quick wins)
4. Technical debt that's blocking progress (risk reduction)
5. Nice-to-have features (lower value)

### Backlog Refinement

Continuous process of improving backlog items:

**Activities**:
- Add detail to upcoming items
- Split large items
- Add acceptance criteria
- Estimate items
- Remove obsolete items
- Reorder based on new information

**Effort**: ~10% of team capacity

**Frequency**: Ongoing, or dedicated refinement sessions (1-2 hours per week)

**Participants**: Product Owner, Development Team, Scrum Master

**Goal**: Ensure top items are "ready" for sprint planning.

### Definition of Ready

Criteria for backlog items to be ready for sprint:

**Example Definition of Ready**:
- User story format with clear "so that" clause
- Acceptance criteria defined
- Estimated by team
- Dependencies identified and resolved
- Small enough to complete in one sprint
- Understood by team

**Purpose**: Prevents pulling poorly-defined work into sprint.

## Epics and Themes

### Epics

Large user stories that span multiple sprints.

**Example Epic**: "As a user, I want to manage my account."

**Broken into stories**:
- Update profile information
- Change password
- Manage email preferences
- View order history
- Update payment methods

**Epics live in backlog** and are broken into stories during refinement.

### Themes

Group of related stories.

**Example Theme**: "Mobile Experience"

**Related stories**:
- Responsive design for product pages
- Touch-friendly navigation
- Faster image loading on mobile
- Simplified checkout for mobile

**Themes help with**:
- Strategic planning
- Release planning
- Communicating roadmap

## Technical Stories

Sometimes teams need technical work that doesn't fit user story format:

**Technical Debt**: "Refactor authentication module to improve maintainability"

**Infrastructure**: "Set up continuous integration pipeline"

**Research**: "Spike: Evaluate payment gateway options"

**How to handle**:

**Option 1**: Frame as user story if possible.

"As a developer, I want automated tests to run on every commit so that we catch bugs early."

**Option 2**: Include as task within user story.

User story includes "refactor authentication" as a task.

**Option 3**: Allocate capacity for technical work.

Reserve 20% of sprint capacity for technical debt and infrastructure.

**Option 4**: Make business case.

"Refactoring authentication will reduce bug fix time by 30%, freeing capacity for features."

## Backlog Grooming Anti-Patterns

### The Never-Ending Backlog

Backlog grows endlessly, never pruned.

**Problem**: Overwhelming, hard to prioritize, contains obsolete items.

**Solution**: Regularly review and remove low-value items. If it hasn't been prioritized in 6 months, delete it.

### The Detailed Backlog

Every item is detailed, even low-priority ones.

**Problem**: Wasted effort detailing items that may never be built.

**Solution**: Detail only top items. Keep future items as placeholders.

### The Technical Backlog

Backlog full of technical tasks, not user stories.

**Problem**: Loses sight of user value.

**Solution**: Frame work in terms of user value. Technical work should enable user value.

### The Frozen Backlog

Backlog never changes because "we already prioritized it."

**Problem**: Can't adapt to new information.

**Solution**: Embrace change. Reorder backlog as you learn.

## Backlog Visualization

Make the backlog visible:

### Story Map

Visual arrangement of stories showing user journey:

**Example: E-commerce Story Map**

| Browse | Select | Purchase | Post-Purchase |
|--------|--------|----------|---------------|
| Search products | Add to cart | Enter shipping | Track order |
| Filter by category | View cart | Enter payment | View history |
| View product details | Save for later | Apply discount | Leave review |

**Benefits**: Shows big picture, identifies gaps, prioritizes by user journey.

### Backlog Roadmap

Timeline showing when themes/epics will be addressed:

**Q1**: Mobile experience improvements
**Q2**: Personalization features
**Q3**: International expansion
**Q4**: Performance optimization

**Benefits**: Communicates direction, manages expectations, guides prioritization.

## Key Takeaways

- User stories follow format: "As a [user], I want [goal] so that [benefit]"
- Good stories are INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable
- Stories consist of Card (written), Conversation (discussion), Confirmation (acceptance criteria)
- Split large stories by workflow, business rules, data, CRUD, complexity, or happy path vs. variations
- Product Owner orders backlog by value, considering business value, cost of delay, risk, dependencies, and learning
- Backlog refinement is continuous, consuming ~10% of capacity
- Definition of Ready ensures stories are prepared before sprint planning
- Epics are large stories spanning multiple sprints; themes group related stories
- Avoid anti-patterns: never-ending backlog, over-detailed backlog, technical backlog, frozen backlog
- Visualize backlog with story maps and roadmaps

In the next lesson, we'll explore sprint execution and daily practices.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 4,
    title: "Sprint Execution & Daily Practices",
    content: `# Sprint Execution & Daily Practices

Sprint planning sets direction, but sprint execution delivers value. Effective daily practices—standups, collaboration, focus—determine whether the sprint succeeds. This lesson explores how high-performing Agile teams work day-to-day.

## Sprint Execution Mindset

### Commit to the Sprint Goal

The sprint goal is the North Star. When priorities conflict or obstacles arise, the sprint goal guides decisions.

**Example Sprint Goal**: "Enable users to search and filter products"

**During Sprint**: A stakeholder requests a new feature unrelated to search. Team refers to sprint goal and defers the request to next sprint.

**Key Point**: Sprint goal provides focus and enables saying "not now" to distractions.

### Swarm on Blockers

When someone is blocked, the team swarms to help.

**Traditional approach**: "That's not my job. I'll work on my tasks."

**Agile approach**: "Let's solve this together so we can achieve our sprint goal."

**Example**: Developer is stuck on a complex bug. Instead of struggling alone for days, team members pair up to solve it in hours.

### Deliver Value Early

Don't wait until the last day to integrate work. Deliver complete, tested features as early as possible.

**Benefits**:
- Earlier feedback
- Reduced integration risk
- Buffer for unexpected problems
- Confidence boost for team

**Practice**: Aim to have first story done by mid-sprint.

### Maintain Sustainable Pace

Sprints are marathons, not sprints (despite the name). Burning out leads to poor quality and attrition.

**Sustainable pace means**:
- No regular overtime
- Reasonable work hours
- Time for learning and improvement
- Healthy work-life balance

**If team regularly works overtime**: Sprint commitments are too aggressive. Reduce velocity.

## Daily Scrum Best Practices

### Keep It Short

15 minutes, no exceptions.

**Techniques**:
- Stand up (sitting encourages longer meetings)
- Use timer
- Park detailed discussions for after
- Scrum Master gently redirects if conversation drifts

### Focus on the Sprint Goal

Each update should relate to sprint goal progress.

**Good**: "Yesterday I completed the search API. Today I'm starting the filter UI. No blockers."

**Bad**: "Yesterday I attended three meetings, answered emails, and fixed a typo. Today I'll probably do some coding."

### Make Impediments Visible

If you're blocked, say so. Don't suffer in silence.

**Impediments Examples**:
- Waiting for external team
- Technical problem beyond your expertise
- Unclear requirements
- Missing access or tools
- Conflicting priorities

**Scrum Master's Role**: Track impediments and work to remove them outside the standup.

### Update the Board

Move cards as you discuss them. The board should reflect current reality.

**Board States**:
- To Do
- In Progress
- In Review
- Done

**WIP Limits**: Limit how many items can be "In Progress" simultaneously. Prevents starting too much and finishing too little.

### Walk the Board, Not the People

Alternative format: Discuss each work item rather than each person.

**Benefits**:
- Focuses on work, not individuals
- Highlights bottlenecks
- Encourages swarming
- Reduces status-report feel

**How**: Start with items closest to "Done" and work backward.

## Collaboration Practices

### Pair Programming

Two developers work together at one workstation.

**Roles**:
- **Driver**: Types code
- **Navigator**: Reviews, suggests, thinks ahead

**Switch roles frequently** (every 15-30 minutes).

**Benefits**:
- Knowledge sharing
- Fewer defects
- Better design
- Reduced silos

**When to pair**:
- Complex or risky work
- Onboarding new team members
- Learning new technology
- Solving difficult bugs

**When not to pair**:
- Simple, well-understood tasks
- Exploratory research
- When team needs to split to cover more ground

### Mob Programming

Entire team works together on same task.

**Setup**: One computer projected on screen, one person typing (driver), everyone else navigating.

**Rotate driver** every 10-15 minutes.

**Benefits**:
- Entire team understands code
- Immediate feedback
- No code review needed
- Great for complex problems

**When to mob**:
- Critical features
- Complex architecture decisions
- Team learning sessions
- Resolving disagreements

### Code Reviews

Team members review each other's code before merging.

**What to review**:
- Does it meet requirements?
- Is it understandable?
- Are there obvious bugs?
- Does it follow team standards?
- Are there security issues?
- Is it tested?

**Review Guidelines**:
- Be kind and constructive
- Explain "why," not just "what"
- Praise good work
- Ask questions rather than demand changes
- Review promptly (within 24 hours)

**Tools**: GitHub Pull Requests, GitLab Merge Requests, Bitbucket, etc.

### Collective Code Ownership

Anyone can modify any code.

**Traditional approach**: "That's Sarah's code. Only she can change it."

**Agile approach**: "We all own the codebase. Anyone can improve any part."

**Benefits**:
- No bottlenecks
- Knowledge spreads
- Better code quality
- Reduced bus factor

**Enabling practices**:
- Coding standards
- Automated tests
- Code reviews
- Pair programming

## Managing Work in Progress

### Limit WIP

Don't start new work until current work is done.

**Why**: Starting too much means finishing too little. Context switching wastes time.

**Example WIP Limits**:
- Max 2 items "In Progress" per person
- Max 5 items "In Progress" for team of 5

**When WIP limit is reached**: Help someone finish their work rather than starting new work.

### Finish Before Starting

Prioritize finishing over starting.

**Traditional**: "I'm blocked on Task A, so I'll start Task B."

**Agile**: "I'm blocked on Task A. Who can help me unblock it?"

**Benefits**:
- More items reach "Done"
- Faster feedback
- Reduced waste

### Swarm on Bottlenecks

When work piles up at one stage, team swarms to clear it.

**Example**: Testing is bottleneck. Developers help with testing rather than starting new development.

**Identify bottlenecks**: Look at board. Where is work piling up?

## Definition of Done

Shared understanding of what "complete" means:

### Story-Level Done

Criteria for individual stories:

**Example**:
- Code complete
- Unit tests written and passing
- Integration tests passing
- Code reviewed and approved
- Accepted by Product Owner
- Deployed to staging
- Documentation updated
- No known defects

### Sprint-Level Done

Criteria for sprint:

**Example**:
- All committed stories meet story-level Done
- Sprint goal achieved
- Increment is potentially releasable
- No critical bugs
- Performance meets targets

### Release-Level Done

Criteria for release:

**Example**:
- All features tested end-to-end
- User documentation complete
- Training materials ready
- Deployment plan tested
- Rollback plan ready
- Stakeholder sign-off obtained

## Technical Practices

### Test-Driven Development (TDD)

Write tests before writing code.

**Process**:
1. Write a failing test
2. Write minimal code to pass test
3. Refactor to improve code
4. Repeat

**Benefits**:
- Better test coverage
- Better design
- Confidence to refactor
- Living documentation

### Continuous Integration (CI)

Integrate code frequently (multiple times per day).

**Practice**:
- Commit code to shared repository frequently
- Automated build runs on every commit
- Automated tests run on every build
- Team fixes broken builds immediately

**Benefits**:
- Catch integration problems early
- Reduce integration risk
- Maintain always-releasable code

**Tools**: Jenkins, GitLab CI, GitHub Actions, CircleCI, Travis CI

### Continuous Deployment (CD)

Automatically deploy code that passes tests to production.

**Practice**:
- Every commit that passes tests goes to production
- No manual deployment steps
- Rollback is automated and fast

**Benefits**:
- Fastest possible feedback
- Reduced deployment risk
- Increased deployment frequency

**Requirements**:
- Excellent test coverage
- Automated deployment pipeline
- Monitoring and alerting
- Fast rollback capability

### Refactoring

Improving code structure without changing behavior.

**When to refactor**:
- Code is hard to understand
- Code is duplicated
- Code is complex
- Code is hard to test
- Before adding new features

**Refactoring safely**:
- Have good test coverage
- Make small changes
- Run tests after each change
- Commit frequently

**"Boy Scout Rule"**: Leave code better than you found it.

## Handling Interruptions

### Protect the Team

Scrum Master shields team from interruptions.

**Common interruptions**:
- Urgent requests from stakeholders
- Production support issues
- Meetings
- Administrative tasks

**Strategies**:
- Designated support person (rotate daily)
- Office hours for stakeholder questions
- Batch administrative tasks
- Decline non-essential meetings during sprint

### Emergency Changes

Sometimes urgent issues arise mid-sprint.

**Process**:
1. Assess urgency (is it really urgent?)
2. Estimate impact on sprint goal
3. Product Owner decides whether to accept
4. If accepted, remove equivalent work from sprint
5. Update sprint backlog

**Key point**: Don't just add work. Remove equal amount to maintain sustainable pace.

## Sprint Burndown

Visual representation of work remaining:

**X-axis**: Days in sprint
**Y-axis**: Work remaining (story points or hours)

**Ideal line**: Straight line from total work to zero.

**Actual line**: Shows actual progress.

**Interpreting Burndown**:

**Flat line**: No progress. Investigate blockers.

**Line going up**: Scope added. Discuss with Product Owner.

**Line above ideal**: Behind schedule. May not complete commitment.

**Line below ideal**: Ahead of schedule. Consider pulling in more work.

## Common Sprint Execution Problems

### Scope Creep

Work is added mid-sprint without removing anything.

**Solution**: Protect sprint scope. New work goes in backlog for next sprint.

### Gold Plating

Team adds features not requested.

**Solution**: Stick to acceptance criteria. If you want to add something, discuss with Product Owner first.

### Late Integration

Team waits until end of sprint to integrate work.

**Solution**: Integrate continuously. Use feature flags if needed.

### No Progress Visibility

Team doesn't update board, stakeholders don't know status.

**Solution**: Update board daily. Maintain transparency.

### Unfinished Stories

Sprint ends with many stories "almost done."

**Solution**: Finish stories before starting new ones. Reduce WIP.

### Technical Debt Accumulation

Team cuts corners to meet sprint commitment.

**Solution**: Maintain quality standards. Reduce velocity if needed. Allocate time for technical debt.

## Key Takeaways

- Sprint execution focuses on delivering value, not just completing tasks
- Commit to sprint goal and use it to guide decisions
- Swarm on blockers rather than working in silos
- Daily Scrum synchronizes team and identifies impediments (15 minutes, focused on sprint goal)
- Limit work in progress to finish more and start less
- Collaboration practices: pair programming, mob programming, code reviews, collective ownership
- Definition of Done ensures shared understanding of quality
- Technical practices: TDD, continuous integration, continuous deployment, refactoring
- Protect team from interruptions; handle emergencies by removing equivalent work
- Sprint burndown visualizes progress and identifies problems early
- Maintain sustainable pace—no regular overtime
- Finish stories before starting new ones

In the next lesson, we'll explore sprint review and stakeholder engagement.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 5,
    title: "Sprint Review & Stakeholder Engagement",
    content: `# Sprint Review & Stakeholder Engagement

The Sprint Review is where the team demonstrates completed work and gathers feedback. It's not a formal presentation—it's a collaborative working session that inspects the increment and adapts the product backlog. Effective sprint reviews keep stakeholders engaged and ensure the product evolves in the right direction.

## Purpose of Sprint Review

The Sprint Review serves multiple purposes:

**Inspect the Increment**: Stakeholders see what was built and verify it meets expectations.

**Gather Feedback**: Stakeholders provide input that shapes future work.

**Adapt Product Backlog**: Based on feedback and learning, the Product Owner adjusts priorities.

**Build Trust**: Regular demos show progress and build stakeholder confidence.

**Celebrate Success**: Team showcases their work and receives recognition.

**Collaborate on Next Steps**: Team and stakeholders discuss what to do next.

## Sprint Review Structure

**Time-box**: 4 hours for 4-week sprint (proportionally less for shorter sprints). Typically 2 hours for 2-week sprint.

**Attendees**: Scrum Team + stakeholders (customers, users, sponsors, other teams)

**Agenda**:

### 1. Welcome and Context (5-10 minutes)

Product Owner sets the stage:
- Sprint goal
- What was planned
- What was completed
- What wasn't completed (and why)

**Example**:

"Our sprint goal was to enable product search and filtering. We completed 8 of 10 stories. The two incomplete stories—advanced filtering and search suggestions—were more complex than estimated. We'll finish them next sprint."

### 2. Demonstrate Completed Work (60-90 minutes)

Development Team demonstrates working software.

**Best Practices**:

**Show, Don't Tell**: Demonstrate actual working software, not slides or mockups.

**Use Real Data**: Use realistic data, not "test test test."

**Tell Stories**: Show how users will accomplish goals, not just features.

**Encourage Interaction**: Let stakeholders try the software.

**Focus on Value**: Explain the benefit, not just the feature.

**Example Demo Flow**:

"Let me show you how a customer will search for products. I'll search for 'laptop'... see how results appear instantly? Now I'll filter by price range... notice the product count updates. This solves the problem customers had finding products in their budget."

### 3. Gather Feedback (20-30 minutes)

Stakeholders provide feedback:

**Questions to Ask**:
- Does this meet your needs?
- What would you change?
- What's missing?
- What should we prioritize next?
- What concerns do you have?

**Capture Feedback**: Document feedback for backlog refinement.

### 4. Review Product Backlog (15-20 minutes)

Product Owner discusses:
- Current backlog status
- Progress toward release goal
- Likely timeline for upcoming features
- Changes to priorities based on feedback

### 5. Discuss Next Steps (10-15 minutes)

Collaborate on direction:
- What should we focus on next sprint?
- Are priorities changing?
- Are there new opportunities or risks?
- What questions need answering?

## Effective Demonstrations

### Prepare in Advance

**Don't wing it**: Plan the demo flow.

**Test Everything**: Ensure demo environment works.

**Have Backup**: If live demo fails, have screenshots or video.

**Assign Roles**: Who demonstrates what? Who answers questions?

### Tell a Story

**Bad Demo**: "This is the search box. This is the filter. This is the results."

**Good Demo**: "Sarah is shopping for a laptop. She searches for 'laptop' and sees 200 results—overwhelming. She filters by price range £500-£800 and sees 45 results. Much better. She filters further by brand and finds exactly what she needs."

**Story makes it real** and helps stakeholders envision usage.

### Focus on User Value

**Bad**: "We implemented a RESTful API with pagination and caching."

**Good**: "Search results now load in under 1 second, even with thousands of products. Users no longer see the loading spinner."

**Stakeholders care about outcomes**, not implementation details.

### Encourage Hands-On

Let stakeholders use the software:

"Here's a test account. Try searching for something you'd actually buy."

**Hands-on experience** reveals usability issues and generates better feedback.

### Handle Incomplete Work Honestly

**Don't hide problems**: If something isn't done, say so.

**Explain why**: "We discovered the payment gateway API changed, requiring rework."

**Show what is done**: Focus on completed work, not excuses.

## Gathering Effective Feedback

### Ask Open-Ended Questions

**Bad**: "Do you like it?" (Yes/no question)

**Good**: "What would make this more useful for you?" (Open-ended)

**Bad**: "Is this what you wanted?" (Yes/no)

**Good**: "How does this compare to what you envisioned?" (Open-ended)

### Probe for Specifics

**Vague feedback**: "It's not quite right."

**Probe**: "What specifically would you change?"

**Vague feedback**: "It's too slow."

**Probe**: "How fast should it be? What's acceptable?"

### Separate Feedback from Solutions

Stakeholders often suggest solutions rather than describing problems.

**Stakeholder**: "Add a button here."

**Probe**: "What are you trying to accomplish?"

**Stakeholder**: "Users need to quickly access their order history."

**Now you understand the problem** and can design the best solution.

### Prioritize Feedback

Not all feedback is equally important.

**Critical**: Blocks usage or causes major problems.

**Important**: Significantly improves experience.

**Nice-to-have**: Minor improvements.

**Product Owner prioritizes** feedback when updating backlog.

## Stakeholder Engagement Strategies

### Invite the Right People

**Who to invite**:
- Product sponsor
- End users
- Customer representatives
- Business stakeholders
- Other teams with dependencies
- Anyone who can provide valuable feedback

**Who not to invite**:
- People with no interest or stake
- People who will derail with unrelated topics

### Make It Interactive

**Bad**: Passive presentation where team talks and stakeholders watch.

**Good**: Interactive session where stakeholders try software and discuss.

**Techniques**:
- Hands-on demos
- Q&A throughout (not just at end)
- Whiteboard discussions
- Voting on priorities

### Manage Difficult Stakeholders

**The Dominator**: One person monopolizes discussion.

**Strategy**: "Thanks for that input. Let's hear from others too."

**The Detailer**: Gets lost in minutiae.

**Strategy**: "That's a great detail to discuss offline. Let's stay focused on the big picture."

**The Scope Creeper**: Constantly requests new features.

**Strategy**: "Great idea. Let's add it to the backlog and prioritize it."

**The Critic**: Focuses only on problems.

**Strategy**: "I hear your concerns. What's working well? What should we keep?"

### Build Excitement

**Celebrate wins**: "This feature will save users 10 minutes per day!"

**Show impact**: "We've delivered 15 features in the last 6 sprints."

**Recognize contributions**: "Thanks to Sarah's feedback, we improved the design."

**Enthusiasm is contagious**. If the team is excited, stakeholders will be too.

## Common Sprint Review Mistakes

### Death by PowerPoint

**Mistake**: Presenting slides instead of demonstrating software.

**Fix**: Show working software. Slides are for context only.

### No Stakeholders

**Mistake**: Only Scrum Team attends.

**Fix**: Actively invite stakeholders. Make it worth their time.

### Unprepared Demo

**Mistake**: Demo fails due to technical issues.

**Fix**: Test demo environment in advance. Have backup plan.

### Defensive Posture

**Mistake**: Team gets defensive when stakeholders provide feedback.

**Fix**: Welcome feedback. It's a gift that improves the product.

### No Follow-Up

**Mistake**: Feedback is gathered but never acted upon.

**Fix**: Document feedback. Product Owner updates backlog. Communicate changes.

### Status Report

**Mistake**: Sprint Review becomes status report with metrics and charts.

**Fix**: Focus on demonstrating working software and gathering feedback.

### Scope Negotiation

**Mistake**: Sprint Review becomes negotiation about why work wasn't completed.

**Fix**: Acknowledge incomplete work briefly, focus on what was completed.

## Metrics to Share

While Sprint Review focuses on demonstrating software, some metrics provide context:

### Velocity

"We completed 32 story points this sprint, consistent with our 30-point average."

**Why share**: Shows predictable delivery.

### Burndown

"We completed all committed work by day 9 of the 10-day sprint."

**Why share**: Shows team is finishing work early, not scrambling at the end.

### Cumulative Features

"We've delivered 45 features over 8 sprints."

**Why share**: Shows cumulative value delivered.

### User Adoption

"500 users tried the new search feature in the first week."

**Why share**: Demonstrates real-world impact.

**Keep metrics brief**—focus on software, not numbers.

## Adapting the Product Backlog

Based on Sprint Review feedback, Product Owner adapts the backlog:

### Add New Items

Feedback reveals new needs or opportunities.

**Example**: "Stakeholders requested bulk export feature. Added to backlog."

### Reprioritize

Feedback changes priorities.

**Example**: "Mobile experience is more important than we thought. Moving mobile stories up."

### Remove Items

Feedback reveals items are no longer needed.

**Example**: "Stakeholders confirmed they don't need admin dashboard. Removed from backlog."

### Split Items

Feedback reveals items are too large or complex.

**Example**: "Payment integration is more complex than expected. Split into multiple stories."

### Clarify Items

Feedback adds detail to vague items.

**Example**: "Stakeholders clarified what 'advanced search' means. Updated acceptance criteria."

## Release Planning

Sprint Review is opportunity to discuss release plans:

### Release Goals

"Our goal is to launch the customer portal by end of Q2."

### Progress Toward Release

"We've completed 60% of planned features. On track for Q2 launch."

### Risks to Release

"Payment gateway integration is a risk. We're investigating alternatives."

### Scope Adjustments

"To hit Q2 deadline, we may defer advanced reporting to Q3."

**Transparency builds trust**. Stakeholders appreciate knowing where things stand.

## Virtual Sprint Reviews

Remote teams need adapted practices:

### Technical Setup

- Reliable video conferencing
- Screen sharing
- Collaborative tools (Miro, Mural)
- Shared demo environment

### Engagement Techniques

- Use polls and reactions
- Breakout rooms for small group discussions
- Chat for questions
- Record session for those who can't attend

### Challenges

- Harder to read body language
- Technical issues disrupt flow
- Participants multitask
- Time zones complicate scheduling

### Solutions

- Encourage cameras on
- Have backup presenter if technical issues
- Make it interactive to maintain attention
- Record and share asynchronously if needed

## Key Takeaways

- Sprint Review inspects increment and adapts product backlog based on feedback
- Time-boxed to 2-4 hours depending on sprint length
- Attendees: Scrum Team + stakeholders
- Demonstrate working software, not slides
- Tell stories that show user value, not just features
- Encourage stakeholder interaction and hands-on exploration
- Gather feedback with open-ended questions and probe for specifics
- Adapt product backlog based on feedback: add, reprioritize, remove, split, clarify items
- Make Sprint Review interactive and engaging, not a passive presentation
- Handle incomplete work honestly without making excuses
- Share metrics briefly to provide context, but focus on software
- Use Sprint Review to discuss release progress and risks
- Virtual reviews require adapted practices: reliable tech, engagement techniques, recordings

In the next lesson, we'll explore sprint retrospectives and continuous improvement.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 6,
    title: "Sprint Retrospectives & Continuous Improvement",
    content: `# Sprint Retrospectives & Continuous Improvement

The Sprint Retrospective is where teams inspect their process and create a plan for improvements. It's the heartbeat of continuous improvement—without retrospectives, teams repeat the same mistakes. Effective retrospectives turn insights into action.

## Purpose of Retrospective

The retrospective serves critical purposes:

**Inspect the Process**: Examine how the team worked together.

**Identify Improvements**: Find opportunities to work better.

**Create Action Plans**: Commit to specific improvements.

**Build Team Cohesion**: Strengthen relationships and trust.

**Celebrate Successes**: Recognize what's working well.

**Learn from Failures**: Turn mistakes into lessons.

## Retrospective Structure

**Time-box**: 3 hours for 4-week sprint (proportionally less for shorter sprints). Typically 1.5 hours for 2-week sprint.

**Attendees**: Scrum Team (Product Owner, Scrum Master, Development Team)

**Timing**: After Sprint Review, before next Sprint Planning

**Facilitator**: Usually Scrum Master, but can rotate

**Agenda**:

### 1. Set the Stage (5-10 minutes)

Create safe, open environment.

**Activities**:
- Remind team of retrospective purpose
- Establish ground rules
- Check-in exercise

**Example Check-In**:

"On a scale of 1-5, how do you feel about this sprint?"

Everyone shares their number and briefly why.

### 2. Gather Data (15-20 minutes)

Collect information about the sprint.

**Techniques**:
- Timeline of events
- Metrics review (velocity, burndown, defects)
- Mood board
- Satisfaction surveys

**Example Timeline**:

Team creates timeline of sprint on whiteboard, marking significant events:
- Day 1: Sprint planning went well
- Day 3: Production issue interrupted work
- Day 5: Great collaboration on complex feature
- Day 8: Deployment problems
- Day 10: Successful sprint review

### 3. Generate Insights (20-30 minutes)

Analyze data to identify patterns and root causes.

**Techniques**:
- What went well / What didn't go well
- Start / Stop / Continue
- Fishbone diagram for problems
- 5 Whys root cause analysis

**Example: 5 Whys**

Problem: "We didn't finish Story X."

Why? "It was more complex than estimated."
Why? "We didn't understand the requirements fully."
Why? "We didn't have enough conversation with Product Owner."
Why? "Product Owner was unavailable during sprint."
Why? "Product Owner has too many other responsibilities."

Root cause: Product Owner capacity issue.

### 4. Decide What to Do (20-30 minutes)

Select improvements and create action plan.

**Criteria for selecting improvements**:
- High impact
- Within team's control
- Achievable in next sprint
- Specific and measurable

**Create action plan**:
- What will we do?
- Who is responsible?
- When will it be done?
- How will we know it's successful?

**Example Action Items**:

1. **Improve Product Owner availability**
   - Owner: Scrum Master
   - Action: Discuss with PO's manager to allocate more time
   - By: Before next sprint
   - Success: PO available for daily questions

2. **Reduce deployment problems**
   - Owner: Development Team
   - Action: Create deployment checklist
   - By: Day 3 of next sprint
   - Success: Zero deployment issues next sprint

### 5. Close Retrospective (5-10 minutes)

Wrap up and commit to action.

**Activities**:
- Summarize action items
- Assign owners
- Appreciate team members
- Closing exercise

**Example Closing**:

"Each person shares one thing they appreciate about a teammate."

## Retrospective Techniques

### Start, Stop, Continue

**Simple and effective**:

**Start**: What should we start doing?
**Stop**: What should we stop doing?
**Continue**: What should we continue doing?

**Example**:

Start: Pairing on complex features
Stop: Checking email during standup
Continue: Celebrating small wins

### Glad, Sad, Mad

**Emotional check-in**:

**Glad**: What made us happy?
**Sad**: What disappointed us?
**Mad**: What frustrated us?

**Example**:

Glad: We delivered all committed stories
Sad: Production issue interrupted our flow
Mad: Last-minute requirement changes

### Sailboat

**Visual metaphor**:

Draw a sailboat. Team identifies:
- **Wind** (what's propelling us forward)
- **Anchor** (what's holding us back)
- **Rocks** (risks ahead)
- **Island** (our goal)

**Example**:

Wind: Good collaboration, clear requirements
Anchor: Slow test environment, too many meetings
Rocks: Upcoming holidays, key person on vacation
Island: Successful product launch

### 4 Ls

**Learning-focused**:

**Liked**: What did we like?
**Learned**: What did we learn?
**Lacked**: What did we lack?
**Longed For**: What do we wish we had?

**Example**:

Liked: Pair programming sessions
Learned: New testing framework
Lacked: Clear acceptance criteria
Longed For: Faster feedback from stakeholders

### Fishbone Diagram

**Root cause analysis**:

Draw fishbone diagram for a specific problem. Identify causes in categories:
- People
- Process
- Tools
- Environment

**Example Problem**: "Too many bugs in production"

People: Insufficient testing skills
Process: No code review
Tools: Inadequate test coverage
Environment: Pressure to deliver fast

### Dot Voting

**Prioritize improvements**:

1. Team generates list of potential improvements
2. Each person gets 3-5 votes (dots)
3. Vote on most important improvements
4. Focus on top 2-3 items

**Example**:

- Improve test automation (8 votes)
- Reduce meeting time (5 votes)
- Better documentation (3 votes)
- New development tools (2 votes)

Focus on test automation and meeting time.

## Creating Effective Action Items

### Make Them Specific

**Bad**: "Communicate better"

(Too vague—what does "better" mean?)

**Good**: "Hold 15-minute backlog refinement session every Tuesday and Thursday"

(Specific, actionable, measurable)

### Make Them Achievable

**Bad**: "Eliminate all bugs"

(Unrealistic)

**Good**: "Reduce production bugs by 50% through better code review"

(Achievable, measurable)

### Assign Ownership

**Bad**: "The team will improve testing"

(No one is accountable)

**Good**: "Sarah will research test automation tools and present options at next retrospective"

(Clear owner, clear deliverable)

### Set Deadlines

**Bad**: "Eventually implement continuous integration"

(No urgency)

**Good**: "Set up CI pipeline by end of next sprint"

(Clear deadline)

### Limit Quantity

**Bad**: 10 action items

(Too many, nothing gets done)

**Good**: 2-3 action items

(Focused, achievable)

## Retrospective Anti-Patterns

### The Blame Game

**Problem**: Team blames individuals for problems.

**Example**: "John's code caused the production issue."

**Solution**: Focus on process, not people. "Our code review process didn't catch the issue. How can we improve it?"

### The Repeat Offender

**Problem**: Same issues every retrospective, no action taken.

**Example**: "We always say we'll improve documentation, but we never do."

**Solution**: Limit action items, assign clear ownership, follow up on previous actions.

### The Positivity Police

**Problem**: Team avoids discussing problems to keep things positive.

**Example**: "Everything was great! No problems!"

**Solution**: Create psychological safety. Problems are opportunities to improve, not failures.

### The Complaining Session

**Problem**: Team complains but doesn't identify solutions.

**Example**: "Management doesn't support us. Nothing we can do."

**Solution**: Focus on what's within team's control. Escalate what isn't, but don't dwell on it.

### The Silent Treatment

**Problem**: Some team members don't participate.

**Example**: Two people dominate discussion, others stay quiet.

**Solution**: Use techniques that ensure everyone contributes (e.g., silent writing, round-robin sharing).

### The Skip

**Problem**: Team skips retrospective because they're "too busy."

**Example**: "We have too much work. Let's skip retro this sprint."

**Solution**: Retrospective is not optional. It's how teams improve. Skipping it leads to more problems, not fewer.

## Psychological Safety

Retrospectives only work if team members feel safe to speak honestly.

### Building Psychological Safety

**Establish ground rules**:
- What's said in retro stays in retro
- Focus on learning, not blaming
- Everyone's input is valued
- Disagree respectfully

**Model vulnerability**:
- Scrum Master and Product Owner share their own mistakes
- Leaders admit when they don't know something
- Celebrate learning from failure

**Respond positively to feedback**:
- Thank people for raising issues
- Don't get defensive
- Follow up on concerns

**Address violations**:
- If someone blames or attacks, intervene
- Remind team of ground rules
- Have private conversation if needed

### Signs of Low Psychological Safety

- Team members stay quiet
- Only positive feedback is shared
- People blame external factors, never themselves
- Retrospectives feel tense or uncomfortable
- No one admits mistakes

**If you see these signs**, focus on building safety before expecting honest feedback.

## Following Up on Action Items

### Track Action Items

**Use a visible system**:
- Retrospective board
- Shared document
- Project management tool

**Review at next retrospective**:
- What actions did we commit to?
- What did we accomplish?
- What's still in progress?
- What should we stop trying?

### Celebrate Improvements

**When action items succeed**, celebrate!

**Example**: "Last sprint we committed to reducing meeting time. We cut weekly meetings from 8 hours to 5 hours. Great job!"

**Recognition reinforces improvement**.

### Adjust Course

**If action items aren't working**, adjust.

**Example**: "We committed to pair programming on all features, but it's slowing us down. Let's pair only on complex or risky work."

**Don't stubbornly stick to failing improvements**.

## Continuous Improvement Culture

Retrospectives are just one aspect of continuous improvement:

### Kaizen

Japanese concept of continuous improvement through small, incremental changes.

**Principle**: Many small improvements compound into significant change.

**Practice**: Constantly look for small ways to improve, not just at retrospectives.

### Inspect and Adapt

**Agile principle**: Regularly inspect your work and process, then adapt based on what you learn.

**Practice**: Don't wait for retrospective. If something isn't working, discuss and adjust immediately.

### Learning Organization

**Concept**: Organizations that facilitate learning and continuously transform themselves.

**Practice**: Share learnings across teams. Create communities of practice. Document and spread best practices.

### Experimentation Mindset

**Concept**: Try new approaches, measure results, keep what works.

**Practice**: Frame improvements as experiments. "Let's try pair programming for two sprints and see if quality improves."

## Metrics for Improvement

Track metrics to measure improvement:

### Team Satisfaction

**Measure**: Regular surveys (e.g., "How satisfied are you with team collaboration? 1-5")

**Track over time**: Are we improving?

### Velocity Stability

**Measure**: Velocity variance sprint-to-sprint

**Goal**: Stable, predictable velocity (not necessarily increasing)

### Cycle Time

**Measure**: Time from starting work to completing it

**Goal**: Reduce cycle time through process improvements

### Defect Rate

**Measure**: Bugs found in production

**Goal**: Reduce defects through better practices

### Deployment Frequency

**Measure**: How often we deploy to production

**Goal**: Increase frequency (indicates confidence and automation)

### Time to Recover

**Measure**: How quickly we fix production issues

**Goal**: Reduce recovery time through better monitoring and processes

## Key Takeaways

- Sprint Retrospective inspects process and creates improvement plan
- Time-boxed to 1.5-3 hours depending on sprint length
- Attendees: Scrum Team only (safe space for honest discussion)
- Structure: Set stage, gather data, generate insights, decide actions, close
- Techniques: Start/Stop/Continue, Glad/Sad/Mad, Sailboat, 4 Ls, Fishbone, Dot Voting
- Effective action items are specific, achievable, owned, time-bound, and limited (2-3 max)
- Avoid anti-patterns: blame game, repeat offenders, toxic positivity, complaining without solutions, silent treatment, skipping
- Psychological safety is essential—team must feel safe to speak honestly
- Follow up on action items at next retrospective—celebrate successes, adjust failures
- Continuous improvement is a culture, not just a meeting—inspect and adapt constantly
- Track metrics to measure improvement over time
- Focus on process, not people—problems are opportunities to improve

Congratulations! You've completed the first half of Level 3. In the next lesson, we'll explore scaling Agile beyond a single team.`,
    estimatedMinutes: 30,
  },
];

console.log('Seeding Level 3 lessons (3-6)...');

for (const lesson of level3Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('Level 3 lessons 3-6 seeded successfully!');

await connection.end();
