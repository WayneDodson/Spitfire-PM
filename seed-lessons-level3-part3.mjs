import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level3Lessons = [
  {
    levelId: 3,
    lessonNumber: 7,
    title: "Scaling Agile: Multiple Teams",
    content: `# Scaling Agile: Multiple Teams

Single-team Scrum works well for small products. But as products grow, organizations need multiple teams. Scaling Agile introduces new challenges: coordination, dependencies, integration, and alignment. This lesson explores frameworks and practices for scaling Agile effectively.

## Why Scaling is Hard

Single-team Agile is straightforward. Multi-team Agile is complex:

**Communication overhead**: More teams mean more coordination.

**Dependencies**: Teams depend on each other's work.

**Integration**: Multiple teams' code must work together.

**Alignment**: Teams must work toward common goals.

**Consistency**: Teams need shared practices and standards.

**Example**: Building an e-commerce platform might require:
- Frontend team
- Backend API team
- Mobile app team
- Payment team
- Search team
- Analytics team

**Challenge**: How do these teams coordinate without constant meetings?

## Scaling Frameworks

Several frameworks address scaling:

### SAFe (Scaled Agile Framework)

**Most comprehensive** scaling framework.

**Structure**:
- **Team Level**: Scrum teams
- **Program Level**: Agile Release Train (ART) with 5-12 teams
- **Large Solution Level**: Multiple ARTs
- **Portfolio Level**: Strategic themes and funding

**Key Practices**:
- Program Increment (PI) Planning every 8-12 weeks
- Synchronized sprints across teams
- System Demo every 2 weeks
- Inspect & Adapt workshop after each PI

**Best for**: Large enterprises, regulated industries, complex products.

**Criticisms**: Heavy, prescriptive, lots of roles and ceremonies.

### LeSS (Large-Scale Scrum)

**Minimalist** approach to scaling.

**Principles**:
- One Product Owner for all teams
- One Product Backlog for all teams
- One Definition of Done for all teams
- One potentially shippable product increment

**Structure**:
- **LeSS**: 2-8 teams
- **LeSS Huge**: 8+ teams with Area Product Owners

**Key Practices**:
- Overall Retrospective with all teams
- Overall Sprint Planning
- Coordination through communities of practice

**Best for**: Organizations wanting minimal process overhead.

**Criticisms**: Requires significant organizational change, challenging for traditional companies.

### Scrum@Scale

**Modular** approach developed by Scrum co-creator Jeff Sutherland.

**Structure**:
- **Scrum of Scrums**: Coordinates team-level work
- **Executive Action Team**: Coordinates organization-level work
- **Executive MetaScrum**: Coordinates product ownership

**Key Practices**:
- Scale-free architecture (same pattern at all levels)
- Minimum viable bureaucracy
- Decentralized decision-making

**Best for**: Organizations wanting flexibility in how they scale.

### Spotify Model

**Not a framework**, but a case study of how Spotify organized.

**Structure**:
- **Squads**: Small cross-functional teams (like Scrum teams)
- **Tribes**: Collection of squads working on related areas
- **Chapters**: People with similar skills across squads (e.g., all testers)
- **Guilds**: Communities of interest across tribes

**Key Practices**:
- Autonomous squads
- Loose coordination through chapters and guilds
- Emphasis on culture over process

**Best for**: Organizations with strong engineering culture.

**Warning**: Spotify itself has evolved beyond this model. Don't copy it blindly.

## Coordination Practices

### Scrum of Scrums

**Meeting** where representatives from each team coordinate.

**Attendees**: One representative per team (often Scrum Master)

**Frequency**: 2-3 times per week

**Format**: Each team answers:
1. What did our team do that affects other teams?
2. What will our team do that affects other teams?
3. What impediments does our team have that other teams can help with?
4. What are we about to do that might create impediments for other teams?

**Purpose**: Identify and resolve cross-team dependencies and impediments.

### Communities of Practice

**Groups** of people with shared interests or skills.

**Examples**:
- Testing Community
- Frontend Developers Community
- UX Designers Community
- Agile Coaches Community

**Activities**:
- Share best practices
- Solve common problems
- Create standards
- Learn together

**Benefits**:
- Knowledge sharing
- Consistency across teams
- Professional development
- Cross-team relationships

### Integration Teams

**Dedicated team** responsible for integrating work from multiple teams.

**Responsibilities**:
- Merge code from feature teams
- Resolve integration conflicts
- Maintain build and deployment pipelines
- Ensure system-level quality

**When needed**: Complex products with many dependencies.

**Caution**: Can become bottleneck. Better to enable feature teams to integrate their own work.

### System Demo

**Regular demonstration** of integrated increment from all teams.

**Frequency**: Every sprint or every 2 weeks

**Attendees**: All teams + stakeholders

**Purpose**:
- Show integrated progress
- Identify integration issues
- Gather feedback on whole system

**Example**: E-commerce platform demo shows:
- Frontend team's new product page
- Backend team's improved search API
- Mobile team's updated checkout flow
- Payment team's new payment methods

All working together in integrated system.

## Managing Dependencies

Dependencies between teams slow delivery:

### Types of Dependencies

**Sequential**: Team B can't start until Team A finishes.

**Reciprocal**: Teams A and B need each other's work.

**Shared Resource**: Teams compete for same resource (e.g., database team).

### Minimizing Dependencies

**Organize teams around features, not components**:

Bad: Frontend team, Backend team, Database team
(Every feature requires all three teams)

Good: Checkout team, Search team, Recommendations team
(Each team can deliver features independently)

**Create clear interfaces**:

Teams agree on APIs and contracts upfront, then work independently.

**Decouple architecture**:

Microservices, modular design, and loose coupling reduce dependencies.

**Share code through libraries**:

Common functionality in shared libraries rather than duplicated code.

### Managing Unavoidable Dependencies

**Dependency board**: Visualize dependencies between teams.

**Dependency planning**: Identify dependencies during planning and coordinate timing.

**Frequent integration**: Integrate often to catch problems early.

**Feature flags**: Deploy incomplete features behind flags, enable when ready.

## Synchronized vs. Asynchronous Sprints

### Synchronized Sprints

**All teams** start and end sprints on same dates.

**Benefits**:
- Easier coordination
- Shared planning and review
- Aligned releases

**Challenges**:
- Less flexibility
- Teams may have different natural rhythms

**Best for**: Teams with many dependencies.

### Asynchronous Sprints

**Teams** start and end sprints on different dates.

**Benefits**:
- Flexibility
- Teams optimize their own rhythm

**Challenges**:
- Harder coordination
- Difficult to plan integrated releases

**Best for**: Independent teams with few dependencies.

## Shared Practices and Standards

### Definition of Done

**System-level Definition of Done** applies to all teams:

Example:
- Code reviewed
- Tests passing
- Integrated with main branch
- Deployed to staging
- Meets performance standards
- Meets security standards
- Documentation updated

**Purpose**: Ensures consistent quality across teams.

### Coding Standards

**Shared standards** for code style, architecture, testing.

**Examples**:
- Code formatting rules
- Naming conventions
- Testing requirements
- Security practices

**Benefits**:
- Code is consistent and readable
- Easier to move between teams
- Reduces integration problems

### Technical Practices

**Shared practices** like continuous integration, test-driven development, pair programming.

**Benefits**:
- Consistent quality
- Knowledge sharing
- Reduced technical debt

## Program Increment (PI) Planning

**Large-scale planning event** in SAFe.

**Frequency**: Every 8-12 weeks

**Duration**: 2 days

**Attendees**: All teams + stakeholders

**Agenda**:

**Day 1**:
- Business context and vision
- Team breakouts: Plan sprints for next PI
- Draft plans and identify dependencies

**Day 2**:
- Teams finalize plans
- Management review and problem-solving
- Teams commit to PI objectives
- Retrospective on planning event

**Outputs**:
- PI objectives for each team
- Program board showing dependencies
- Identified risks and impediments

**Benefits**:
- Alignment across teams
- Visibility of dependencies
- Shared understanding of goals

**Challenges**:
- Expensive (all teams for 2 days)
- Can feel like waterfall planning
- Requires significant preparation

## Architectural Runway

**Technical foundation** that supports upcoming features.

**Examples**:
- Scalable infrastructure
- Reusable components
- APIs and interfaces
- Technical standards

**Why needed**: Feature teams can't deliver if architecture isn't ready.

**How to build**:
- Dedicated architecture team
- Allocate capacity in feature teams
- Refactor as you go

**Balance**: Enough runway to support features, not so much you're building things you don't need.

## Metrics for Scaled Agile

### Program-Level Velocity

**Sum of all team velocities**.

**Use**: Forecasting program-level delivery.

**Caution**: Teams may have different story point scales. Normalize or use different metric.

### Predictability

**Percentage of committed objectives delivered**.

**Example**: Teams commit to 50 objectives for PI, deliver 45. Predictability = 90%.

**Goal**: Improve predictability over time.

### Cycle Time

**Time from starting work to delivering it**.

**Measure at program level**: How long from idea to production?

**Goal**: Reduce cycle time through better coordination.

### Team Health

**Regular surveys** of team satisfaction, collaboration, autonomy.

**Goal**: Maintain healthy teams as you scale.

### Integration Frequency

**How often teams integrate their work**.

**Goal**: Increase frequency (daily or more).

## Common Scaling Challenges

### Too Many Meetings

**Problem**: Coordination requires constant meetings.

**Solution**: Limit synchronous meetings. Use asynchronous communication (Slack, wikis). Empower teams to make decisions.

### Slow Decision-Making

**Problem**: Decisions require multiple teams and managers.

**Solution**: Push decisions down. Teams decide how to implement. Product Owners decide what to build. Escalate only when necessary.

### Inconsistent Practices

**Problem**: Each team works differently, making collaboration difficult.

**Solution**: Establish shared standards. Use communities of practice to spread best practices.

### Integration Hell

**Problem**: Integrating work from multiple teams is painful.

**Solution**: Integrate frequently (daily). Automate integration and testing. Improve architecture to reduce coupling.

### Loss of Agility

**Problem**: Scaling introduces bureaucracy that slows teams down.

**Solution**: Keep process minimal. Question every meeting and artifact. Empower teams.

## Key Takeaways

- Scaling Agile introduces challenges: coordination, dependencies, integration, alignment
- Scaling frameworks: SAFe (comprehensive), LeSS (minimalist), Scrum@Scale (modular), Spotify Model (case study)
- Coordination practices: Scrum of Scrums, Communities of Practice, Integration Teams, System Demo
- Minimize dependencies by organizing teams around features, creating clear interfaces, decoupling architecture
- Synchronized sprints easier for coordination; asynchronous sprints offer more flexibility
- Shared practices and standards ensure consistency: Definition of Done, coding standards, technical practices
- Program Increment Planning aligns multiple teams on goals and dependencies
- Architectural Runway provides technical foundation for features
- Metrics: program velocity, predictability, cycle time, team health, integration frequency
- Common challenges: too many meetings, slow decisions, inconsistent practices, integration problems, loss of agility
- Keep scaling process minimal—more process doesn't mean better coordination

In the next lesson, we'll explore Kanban as an alternative to Scrum.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 8,
    title: "Kanban: Flow-Based Agile",
    content: `# Kanban: Flow-Based Agile

While Scrum uses fixed-length sprints, Kanban focuses on continuous flow. Work moves through stages as capacity allows, without artificial time boundaries. Kanban is ideal for support teams, operations, and environments where priorities change frequently.

## What is Kanban?

Kanban is a method for managing knowledge work with emphasis on just-in-time delivery and not overloading team members.

**Origins**: Toyota Production System in the 1940s. Adapted for knowledge work by David Anderson in the 2000s.

**Core Idea**: Visualize work, limit work in progress, and optimize flow.

## Kanban vs. Scrum

| Aspect | Scrum | Kanban |
|--------|-------|--------|
| **Iterations** | Fixed-length sprints | Continuous flow |
| **Roles** | Product Owner, Scrum Master, Dev Team | No prescribed roles |
| **Ceremonies** | Sprint Planning, Daily Standup, Review, Retro | Optional meetings |
| **Commitment** | Sprint commitment | No commitment |
| **Changes** | Mid-sprint changes discouraged | Changes allowed anytime |
| **Metrics** | Velocity | Cycle time, throughput |
| **Board** | Reset each sprint | Continuous |
| **WIP Limits** | Implicit (sprint capacity) | Explicit (column limits) |

**Neither is better**—they suit different contexts.

### When to Use Kanban

- Support and maintenance work
- Operations teams
- Priorities change frequently
- Work items vary greatly in size
- Team wants more flexibility than Scrum provides
- Continuous delivery environment

### When to Use Scrum

- Product development
- Team is new to Agile
- Need structure and discipline
- Stakeholders want regular demos
- Work can be planned in advance

### Scrumban

**Hybrid** approach combining Scrum and Kanban.

**Example**: Use Scrum's sprints and ceremonies, but Kanban's board and WIP limits.

**Benefits**: Structure of Scrum with flexibility of Kanban.

## Kanban Principles

David Anderson defined six core practices:

### 1. Visualize the Workflow

Make work visible on a board.

**Example Board**:

| Backlog | To Do | In Progress | Code Review | Testing | Done |
|---------|-------|-------------|-------------|---------|------|
| Item 1 | Item 3 | Item 5 | Item 7 | Item 9 | Item 11 |
| Item 2 | Item 4 | Item 6 | Item 8 | Item 10 | Item 12 |

**Purpose**: Everyone sees what's happening, where work is stuck, and what's next.

### 2. Limit Work in Progress (WIP)

Set explicit limits on how much work can be in each stage.

**Example**:

| To Do | In Progress (Limit: 3) | Code Review (Limit: 2) | Testing (Limit: 2) | Done |
|-------|------------------------|------------------------|--------------------|------|
| Item 1 | Item 3 | Item 5 | Item 7 | Item 9 |
| Item 2 | Item 4 | Item 6 | | Item 10 |
| | | | | Item 11 |

**Purpose**: Prevents overload, forces completion, reveals bottlenecks.

**Rule**: If column is at limit, can't pull new work until something moves forward.

### 3. Manage Flow

Optimize the movement of work through the system.

**Monitor**:
- Where is work getting stuck?
- What's causing delays?
- Are WIP limits appropriate?

**Adjust**:
- Change WIP limits
- Add capacity to bottlenecks
- Remove waste from process

**Goal**: Smooth, predictable flow.

### 4. Make Process Policies Explicit

Define and communicate how work moves through the system.

**Examples**:
- Definition of Ready for each column
- Definition of Done for each column
- Who can pull work
- How to handle blocked items
- Priority rules

**Purpose**: Shared understanding prevents confusion and conflict.

### 5. Implement Feedback Loops

Regular reviews and retrospectives.

**Examples**:
- Daily standup
- Weekly review of metrics
- Monthly retrospective
- Quarterly strategic review

**Purpose**: Continuous improvement through inspection and adaptation.

### 6. Improve Collaboratively, Evolve Experimentally

Make incremental changes based on data and feedback.

**Approach**:
- Identify problem
- Hypothesize solution
- Experiment
- Measure results
- Keep what works, discard what doesn't

**Example**: "Cycle time is too long. Let's reduce WIP limit from 5 to 3 and see if that helps."

## Designing a Kanban Board

### Identify Workflow Stages

Map your actual process:

**Example: Software Development**

1. Backlog
2. Ready for Development
3. In Development
4. Code Review
5. Testing
6. Ready for Deployment
7. Done

**Example: Support Team**

1. New Tickets
2. Triage
3. In Progress
4. Waiting for Customer
5. Resolved

### Set WIP Limits

Start with team size or slightly less.

**Example**: Team of 5 might set:
- In Development: 3
- Code Review: 2
- Testing: 2

**Rationale**: Forces focus, prevents overload.

**Adjust based on data**: If work piles up in Testing, increase Testing limit or add testing capacity.

### Define Policies

**Example Policies**:

**Ready for Development**:
- Requirements clear
- Acceptance criteria defined
- Dependencies resolved

**Definition of Done for Development**:
- Code complete
- Unit tests written
- Self-reviewed

**Definition of Done for Testing**:
- All tests passing
- No critical bugs
- Accepted by Product Owner

### Add Swim Lanes

**Horizontal rows** for different types of work.

**Example**:

| | Backlog | In Progress | Testing | Done |
|---|---------|-------------|---------|------|
| **Urgent** | | Bug fix | | |
| **Standard** | Feature A | Feature B | Feature C | Feature D |
| **Low Priority** | Enhancement | | | |

**Purpose**: Prioritize different work types, ensure urgent work gets attention.

## Kanban Metrics

### Cycle Time

**Time from starting work to completing it**.

**Example**: Item enters "In Progress" on Monday, reaches "Done" on Friday. Cycle time = 5 days.

**Use**: Measure efficiency, set expectations, identify delays.

**Goal**: Reduce and stabilize cycle time.

### Lead Time

**Time from requesting work to completing it**.

**Example**: Customer requests feature on Jan 1, feature is delivered on Jan 30. Lead time = 30 days.

**Difference from cycle time**: Lead time includes time in backlog before work starts.

**Use**: Set customer expectations, measure responsiveness.

### Throughput

**Number of items completed per time period**.

**Example**: Team completes 20 items in a week. Throughput = 20 items/week.

**Use**: Forecasting, capacity planning.

### Work in Progress (WIP)

**Number of items currently being worked on**.

**Little's Law**: Cycle Time = WIP / Throughput

**Example**: WIP = 10 items, Throughput = 5 items/week
Cycle Time = 10 / 5 = 2 weeks

**Use**: If cycle time is too long, reduce WIP.

### Cumulative Flow Diagram (CFD)

**Stacked area chart** showing work in each stage over time.

**X-axis**: Time
**Y-axis**: Number of items
**Areas**: Each stage (Done, Testing, In Progress, etc.)

**Interpretation**:

**Steady bands**: Healthy flow

**Widening band**: Work piling up (bottleneck)

**Flat band**: No work in that stage

**Example**: If "Testing" band widens, testing is a bottleneck. Add testing capacity or reduce WIP in earlier stages.

### Blocked Items

**Number of items blocked** and how long they've been blocked.

**Track**:
- What's blocked?
- Why is it blocked?
- How long has it been blocked?

**Use**: Identify and remove impediments.

## Kanban Meetings

Kanban doesn't prescribe meetings, but these are common:

### Daily Standup

**Walk the board** from right to left (Done to Backlog).

**Focus**:
- What's close to Done?
- What's blocked?
- Where can we help?

**Purpose**: Coordinate, identify impediments, maintain flow.

### Replenishment Meeting

**Add new work** to the board.

**Frequency**: Weekly or as needed

**Attendees**: Product Owner + team

**Activities**:
- Review backlog
- Prioritize items
- Pull items into "Ready" column

**Purpose**: Ensure team always has work, but not too much.

### Kanban Review

**Review metrics** and flow.

**Frequency**: Weekly or bi-weekly

**Activities**:
- Review cycle time, throughput, WIP
- Identify bottlenecks
- Discuss improvements

**Purpose**: Data-driven improvement.

### Retrospective

**Reflect on process** and identify improvements.

**Frequency**: Monthly or quarterly

**Activities**:
- What's working well?
- What's not working?
- What should we experiment with?

**Purpose**: Continuous improvement.

## Classes of Service

**Different types of work** with different policies.

**Common Classes**:

### Expedite

**Highest priority**, drop everything else.

**Example**: Production outage

**Policy**: WIP limit of 1, bypass all other work

### Fixed Date

**Must be done by specific date**.

**Example**: Regulatory deadline, marketing campaign

**Policy**: Start early enough to meet deadline

### Standard

**Normal priority** work.

**Example**: Features, enhancements

**Policy**: Pull in priority order

### Intangible

**Low priority**, work on when nothing else available.

**Example**: Technical debt, nice-to-have features

**Policy**: Pull only when capacity available

**Visualize with swim lanes** or colors.

## Handling Blocked Items

When work is blocked:

### Mark It Visibly

Use red card, blocker icon, or move to "Blocked" column.

**Purpose**: Make impediments visible.

### Track Blockers

**Document**:
- What's blocked?
- Why?
- Who can unblock it?
- How long has it been blocked?

### Swarm on Blockers

**Team works together** to remove impediments.

**Don't just start new work**—unblocking is higher priority.

### Escalate When Needed

If team can't unblock, escalate to management.

**Example**: Blocked waiting for another team. Manager coordinates with other team's manager.

## Kanban for Different Contexts

### Software Development

**Stages**: Backlog, Ready, Development, Code Review, Testing, Deployment, Done

**WIP Limits**: Based on team size and capacity

**Metrics**: Cycle time, throughput, defect rate

### Support Team

**Stages**: New Tickets, Triage, In Progress, Waiting for Customer, Resolved

**WIP Limits**: Based on team capacity

**Classes of Service**: Urgent, High, Normal, Low

**Metrics**: Response time, resolution time, customer satisfaction

### Marketing Team

**Stages**: Ideas, Planning, In Progress, Review, Published

**WIP Limits**: Based on campaign complexity

**Metrics**: Time to market, campaign performance

### Operations Team

**Stages**: Requests, Approved, In Progress, Testing, Deployed

**WIP Limits**: Based on team capacity and risk tolerance

**Metrics**: Deployment frequency, change failure rate, time to restore

## Continuous Improvement with Kanban

### Start Where You Are

Don't redesign your entire process. Map your current process and start there.

**Example**: If your current process is chaotic, just visualizing it on a board is a huge improvement.

### Agree to Pursue Incremental Change

Make small, evolutionary changes rather than revolutionary transformations.

**Example**: Don't change WIP limits, board structure, and policies all at once. Change one thing, measure, adjust.

### Respect Current Roles and Responsibilities

Kanban doesn't require new roles or restructuring.

**Example**: Keep your current job titles and reporting structure. Focus on improving flow.

### Encourage Acts of Leadership at All Levels

Anyone can suggest improvements.

**Example**: Developer notices testing is a bottleneck and proposes adding automated tests. That's leadership.

## Key Takeaways

- Kanban focuses on continuous flow, not fixed iterations
- Core practices: visualize workflow, limit WIP, manage flow, make policies explicit, implement feedback loops, improve collaboratively
- Kanban board shows work stages and WIP limits for each stage
- WIP limits prevent overload and force completion
- Key metrics: cycle time (time to complete), lead time (time from request to completion), throughput (items per period)
- Cumulative Flow Diagram visualizes flow and identifies bottlenecks
- Classes of service (Expedite, Fixed Date, Standard, Intangible) handle different work types
- Kanban suits support teams, operations, and environments with changing priorities
- Scrumban combines Scrum structure with Kanban flexibility
- Start where you are, make incremental changes, respect current roles
- Anyone can lead improvement—encourage acts of leadership at all levels

In the next lesson, we'll explore Agile estimation and planning techniques.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 9,
    title: "Agile Estimation & Planning",
    content: `# Agile Estimation & Planning

Agile estimation is different from traditional estimation. Instead of detailed upfront estimates, Agile uses relative sizing and empirical data. Instead of fixed plans, Agile uses adaptive planning. This lesson explores techniques for estimating and planning in Agile environments.

## Why Traditional Estimation Fails

Traditional project management estimates tasks in hours or days:

**Problems**:

**False precision**: "This will take 37.5 hours" implies certainty that doesn't exist.

**Ignores uncertainty**: Complex work has inherent uncertainty. Precise estimates hide this.

**Encourages padding**: Developers add buffer to avoid looking bad. Estimates become inflated.

**Discourages collaboration**: "That's your estimate, you own it."

**Focuses on effort, not value**: Spending 100 hours doesn't mean delivering 100 hours of value.

**Example**: Developer estimates feature will take 40 hours. Actual time: 65 hours. Developer looks bad, even though estimate was reasonable given uncertainty.

## Relative Estimation

Agile uses **relative sizing**: comparing items to each other rather than estimating absolute time.

**Analogy**: You might not know how tall a building is in feet, but you can easily say "Building A is twice as tall as Building B."

**Story Points**: Abstract unit of measure for relative size.

**Common scales**:
- Fibonacci: 1, 2, 3, 5, 8, 13, 21...
- T-shirt sizes: XS, S, M, L, XL, XXL
- Powers of 2: 1, 2, 4, 8, 16, 32

**Why Fibonacci?**: Larger numbers have more uncertainty. Fibonacci reflects this—difference between 1 and 2 is small, difference between 13 and 21 is large.

## What Story Points Represent

Story points consider multiple factors:

**Complexity**: How hard is it?

**Effort**: How much work is involved?

**Uncertainty**: How much do we know?

**Example Comparisons**:

**1 point**: Simple bug fix, well-understood, 2 hours of work

**3 points**: Straightforward feature, clear requirements, 1 day of work

**5 points**: Moderate feature, some unknowns, 2-3 days of work

**8 points**: Complex feature, significant unknowns, 3-5 days of work

**13 points**: Very complex, many unknowns, should probably be split

**Key insight**: Points are relative to your team. One team's 5 points might be another team's 8 points. That's fine—points are for planning, not comparison.

## Planning Poker

**Collaborative estimation technique**.

**Process**:

1. **Product Owner presents story**: Explains what's needed and why.

2. **Team discusses**: Asks clarifying questions.

3. **Each person privately selects estimate**: Using Planning Poker cards (1, 2, 3, 5, 8, 13, 21, ?, ∞).

4. **Everyone reveals simultaneously**: Prevents anchoring (being influenced by others' estimates).

5. **Discuss differences**: Especially highest and lowest estimates.

6. **Re-estimate**: Repeat until consensus.

**Example**:

Product Owner: "As a user, I want to reset my password via email."

Team discusses: "Do we need to check password strength? How long should reset link be valid? What if user doesn't receive email?"

Team estimates: 2, 3, 3, 5, 8

Discussion: Person who estimated 2 says "I thought we already have email functionality." Person who estimated 8 says "We need to implement password strength checking and link expiration."

Team realizes more work than some thought, less than others thought.

Re-estimate: 5, 5, 5, 5, 5

Consensus: 5 points.

**Special Cards**:

**?**: "I don't understand the story"

**∞**: "This is way too big, we need to split it"

**☕**: "I need a break"

## Reference Stories

**Baseline stories** for comparison.

**Process**:

1. **Select reference stories**: Choose 3-5 completed stories of different sizes.

2. **Assign points**: 2 points, 5 points, 8 points, etc.

3. **Use for comparison**: "Is this story more like the 5-point reference or the 8-point reference?"

**Example Reference Stories**:

**2 points**: "Add validation to email field" (simple, well-understood)

**5 points**: "Implement password reset via email" (moderate complexity)

**8 points**: "Add two-factor authentication" (complex, some unknowns)

**Benefits**:
- Consistency over time
- Easier onboarding for new team members
- Reduces estimation drift

## Velocity

**Amount of work completed per sprint**, measured in story points.

**Example**:

Sprint 1: 25 points completed
Sprint 2: 28 points completed
Sprint 3: 30 points completed
Sprint 4: 27 points completed

**Average velocity**: 27.5 points per sprint

**Use velocity for forecasting**:

Product backlog has 165 points remaining.
Velocity is 27.5 points per sprint.
Estimated sprints to complete: 165 / 27.5 = 6 sprints.

## Velocity Patterns

### Increasing Velocity

**Possible reasons**:
- Team is improving (good)
- Team is inflating estimates (bad)
- Team is cutting quality (bad)

**Investigate**: Why is velocity increasing? Is it sustainable?

### Decreasing Velocity

**Possible reasons**:
- Team is being more realistic with estimates (good)
- Team has impediments (bad)
- Team is losing members (bad)

**Investigate**: Why is velocity decreasing? How can we help?

### Unstable Velocity

**Velocity varies wildly sprint to sprint**.

**Possible reasons**:
- Inconsistent story sizing
- External interruptions
- Team composition changes
- Unrealistic commitments

**Goal**: Stabilize velocity for predictable planning.

### Stable Velocity

**Velocity is consistent sprint to sprint**.

**This is the goal**: Predictable delivery enables reliable forecasting.

**Note**: Stable doesn't mean increasing. A team with stable velocity of 25 points is more valuable than a team with unstable velocity averaging 30 points.

## Release Planning

**Plan when features will be delivered**.

**Process**:

1. **Define release goal**: What do we want to achieve?

2. **Identify features**: What features are needed?

3. **Estimate features**: Use story points.

4. **Calculate capacity**: Velocity × number of sprints.

5. **Prioritize**: What's most important?

6. **Forecast**: When will we finish?

**Example**:

**Release Goal**: Launch customer portal

**Features**: Login, Dashboard, Profile, Orders, Support

**Total estimate**: 180 story points

**Velocity**: 30 points per sprint

**Forecast**: 180 / 30 = 6 sprints (12 weeks)

**Confidence**: High for first 3 sprints, medium for next 2, low for last 1.

## Cone of Uncertainty

**Uncertainty decreases over time**.

**At project start**: Estimates can be off by 4x (25% to 400% of actual).

**At detailed design**: Estimates can be off by 2x (50% to 200% of actual).

**At construction**: Estimates can be off by 1.5x (67% to 150% of actual).

**Near completion**: Estimates are accurate.

**Implication**: Don't expect precise estimates early. Refine estimates as you learn.

**Agile approach**: Estimate roughly, deliver incrementally, refine as you go.

## T-Shirt Sizing

**Alternative to story points** for high-level estimation.

**Sizes**: XS, S, M, L, XL, XXL

**Use**: Early planning, roadmaps, epics.

**Example**:

**XS**: Simple enhancement (1-2 days)
**S**: Small feature (3-5 days)
**M**: Medium feature (1-2 weeks)
**L**: Large feature (2-4 weeks)
**XL**: Very large feature (1-2 months)
**XXL**: Epic (2+ months, should be broken down)

**Benefits**:
- Fast
- Less precision anxiety
- Good for early planning

**Transition**: As features get closer to implementation, break down and estimate in story points.

## Affinity Estimation

**Fast technique** for estimating many items.

**Process**:

1. **Place reference stories** on table (e.g., 2-point, 5-point, 8-point).

2. **Team silently sorts** remaining stories relative to references.

3. **Discuss outliers**: Stories placed very differently by different people.

4. **Finalize estimates**.

**Benefits**:
- Very fast (can estimate 50+ stories in an hour)
- Collaborative
- Visual

**Use**: Backlog refinement sessions with many items.

## No Estimates

**Controversial approach**: Don't estimate at all.

**Rationale**:
- Estimation is waste (doesn't deliver value)
- Estimates are often wrong
- Focus on flow, not estimates

**Practice**:
- Break all stories to similar size (1-2 days)
- Count stories, not points
- Measure throughput (stories per week)
- Forecast based on throughput

**Example**: Team completes 10 stories per week. Backlog has 50 stories. Forecast: 5 weeks.

**When it works**:
- Team is mature
- Stories are consistently sized
- Focus is on flow, not deadlines

**When it doesn't work**:
- Stories vary greatly in size
- Need detailed forecasts
- Stakeholders demand estimates

## Estimation Anti-Patterns

### Estimating in Hours

**Problem**: False precision, ignores uncertainty.

**Solution**: Use story points or t-shirt sizes.

### Comparing Teams by Velocity

**Problem**: Story points are relative to each team.

**Example**: Team A's velocity is 40, Team B's velocity is 30. Doesn't mean Team A is faster—their points might be smaller.

**Solution**: Never compare velocities across teams.

### Using Velocity as Performance Metric

**Problem**: Encourages gaming the system (inflating estimates).

**Solution**: Velocity is for planning, not performance evaluation.

### Estimating Without Conversation

**Problem**: Estimates without understanding lead to bad estimates.

**Solution**: Always discuss stories before estimating.

### Treating Estimates as Commitments

**Problem**: Estimates are forecasts, not promises.

**Solution**: Communicate estimates with confidence levels. "We estimate 6 sprints, give or take 2."

### Ignoring Velocity Trends

**Problem**: Using outdated velocity for planning.

**Solution**: Regularly review velocity and adjust forecasts.

## Forecasting with Confidence

**Provide range, not single number**.

**Example**:

**Best case**: 4 sprints (if everything goes well)
**Most likely**: 6 sprints (based on average velocity)
**Worst case**: 8 sprints (if we hit problems)

**Confidence levels**:

**High confidence (90%)**: First 2 sprints
**Medium confidence (70%)**: Next 2 sprints
**Low confidence (50%)**: Last 2 sprints

**Communicate uncertainty**: "We're confident we'll deliver the core features in 4 sprints. The advanced features might take 2 more sprints, depending on complexity."

## Capacity Planning

**Account for team availability**.

**Factors**:
- Holidays and vacations
- Training and conferences
- Support and maintenance work
- Meetings and administrative tasks

**Example**:

Team velocity: 30 points per sprint
Sprint 1: Full team available → 30 points capacity
Sprint 2: One person on vacation → 24 points capacity
Sprint 3: Team training for 2 days → 18 points capacity

**Adjust commitments** based on capacity.

## Key Takeaways

- Traditional estimation (hours/days) provides false precision and ignores uncertainty
- Agile uses relative estimation (story points) to compare items rather than estimate absolute time
- Story points consider complexity, effort, and uncertainty
- Planning Poker is collaborative estimation technique using Fibonacci sequence
- Reference stories provide baseline for consistent estimation
- Velocity (points completed per sprint) enables forecasting
- Stable velocity is more valuable than high velocity
- Release planning uses velocity to forecast when features will be delivered
- Cone of Uncertainty: estimates become more accurate over time
- T-shirt sizing (XS, S, M, L, XL) useful for high-level planning
- Affinity estimation fast technique for estimating many items
- No Estimates approach focuses on flow and throughput rather than estimation
- Avoid anti-patterns: estimating in hours, comparing teams by velocity, using velocity as performance metric
- Provide forecasts with confidence levels and ranges, not single numbers
- Adjust capacity for holidays, training, and other commitments

In the next lesson, we'll explore Agile metrics and reporting.`,
    estimatedMinutes: 30,
  },
];

console.log('Seeding Level 3 lessons (7-9)...');

for (const lesson of level3Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('Level 3 lessons 7-9 seeded successfully!');

await connection.end();
