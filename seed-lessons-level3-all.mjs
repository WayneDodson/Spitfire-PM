import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level3Lessons = [
  {
    levelId: 3,
    lessonNumber: 1,
    title: "Introduction to Agile",
    content: `# Introduction to Agile

Agile represents a fundamental shift in how projects are managed. Rather than planning everything upfront and executing according to plan, Agile embraces change, delivers value incrementally, and adapts based on feedback. Understanding Agile principles is essential for modern project management.

## The Agile Manifesto

In 2001, seventeen software developers met in Utah and created the Agile Manifesto. While focused on software development, its principles apply broadly to project management.

### The Four Values

**Individuals and interactions over processes and tools**

People and communication matter more than rigid processes. A motivated team with good communication will outperform a dysfunctional team with perfect tools.

This doesn't mean processes and tools don't matter—they do. But when forced to choose, prioritize people.

**Working software over comprehensive documentation**

Delivering functional products matters more than perfect documentation. Documentation has value, but a working product has more.

This doesn't mean skip documentation—it means don't let documentation delay delivery of value.

**Customer collaboration over contract negotiation**

Working with customers as partners matters more than negotiating contract terms. Contracts are necessary, but collaboration delivers better outcomes.

This doesn't mean contracts don't matter—it means don't hide behind contracts when customer needs change.

**Responding to change over following a plan**

Adapting to change matters more than sticking to the original plan. Plans are valuable for providing direction, but reality often differs from plans.

This doesn't mean don't plan—it means don't treat plans as unchangeable commitments.

### The Twelve Principles

The Agile Manifesto includes twelve principles that guide Agile practice:

**1. Customer satisfaction through early and continuous delivery**

Deliver valuable software frequently, from weeks to months, with preference for shorter timescales.

**2. Welcome changing requirements**

Agile processes harness change for the customer's competitive advantage, even late in development.

**3. Deliver working software frequently**

Deliver working software frequently, with preference for shorter timescales (weeks rather than months).

**4. Business people and developers work together**

Business people and developers must work together daily throughout the project.

**5. Build projects around motivated individuals**

Give them the environment and support they need, and trust them to get the job done.

**6. Face-to-face conversation**

The most efficient and effective method of conveying information is face-to-face conversation.

**7. Working software is the primary measure of progress**

Not documentation, not plans, not effort—working software.

**8. Sustainable development**

Agile processes promote sustainable development. Sponsors, developers, and users should maintain a constant pace indefinitely.

**9. Continuous attention to technical excellence**

Continuous attention to technical excellence and good design enhances agility.

**10. Simplicity is essential**

Simplicity—the art of maximizing the amount of work not done—is essential.

**11. Self-organizing teams**

The best architectures, requirements, and designs emerge from self-organizing teams.

**12. Regular reflection and adjustment**

At regular intervals, the team reflects on how to become more effective, then tunes and adjusts accordingly.

## Why Agile?

Agile emerged in response to problems with traditional approaches:

### Problems Agile Addresses

**Requirements uncertainty**: Customers often don't know exactly what they want until they see it. Waterfall requires complete requirements upfront.

**Long feedback cycles**: Waterfall delivers everything at the end. If something is wrong, you discover it late when changes are expensive.

**Inability to adapt**: Waterfall treats changes as problems. But in fast-moving markets, change is inevitable and necessary.

**Late risk discovery**: Waterfall defers integration and testing until late. Problems discovered late are expensive to fix.

**Low customer engagement**: Waterfall involves customers mainly at the beginning and end. Limited involvement leads to solutions that miss the mark.

### Benefits of Agile

**Faster time to value**: Deliver working features in weeks, not months or years.

**Reduced risk**: Frequent delivery and feedback catch problems early when they're cheaper to fix.

**Greater flexibility**: Adapt to changing requirements and market conditions.

**Higher quality**: Continuous testing and integration prevent defects from accumulating.

**Improved stakeholder satisfaction**: Regular demos and involvement keep stakeholders engaged and ensure the solution meets their needs.

**Better team morale**: Empowered, self-organizing teams are more motivated and productive.

## Agile vs. Waterfall

Understanding the differences helps you choose the right approach:

| Aspect | Waterfall | Agile |
|--------|-----------|-------|
| **Requirements** | Fixed upfront | Evolve over time |
| **Planning** | Comprehensive upfront | Iterative, just-in-time |
| **Delivery** | Single delivery at end | Frequent incremental delivery |
| **Change** | Resisted, expensive | Welcomed, expected |
| **Customer involvement** | Beginning and end | Continuous throughout |
| **Team structure** | Specialized roles | Cross-functional, self-organizing |
| **Documentation** | Comprehensive | Lightweight, sufficient |
| **Progress measurement** | Adherence to plan | Working features delivered |
| **Risk approach** | Identify and mitigate upfront | Discover and adapt continuously |

**Neither is universally better**—each suits different contexts.

### When to Use Waterfall

- Requirements are clear, stable, and well-understood
- Technology is proven and well-understood
- Changes are expensive or difficult
- Regulatory requirements demand extensive documentation
- Fixed-price contracts with defined scope
- Team lacks Agile experience and training isn't feasible

**Examples**: Construction projects, manufacturing, regulated industries (pharmaceuticals, aerospace).

### When to Use Agile

- Requirements are uncertain or likely to change
- Technology is new or complex
- Fast time to market is critical
- Customer feedback is essential
- Innovation and experimentation are valued
- Team is co-located or has good collaboration tools

**Examples**: Software development, product development, digital transformation, startups.

## Agile Mindset

Agile is more than practices—it's a mindset:

### Embrace Change

Traditional: "We agreed on requirements. Stop changing them."

Agile: "Requirements changed because we learned something new. Let's adapt."

**Mindset Shift**: Change is not a problem to prevent but information to leverage.

### Focus on Value

Traditional: "We completed 80% of the tasks."

Agile: "We delivered features that enable users to accomplish X, Y, and Z."

**Mindset Shift**: Progress is measured by value delivered, not tasks completed.

### Empower Teams

Traditional: "Here's what to do and how to do it."

Agile: "Here's the goal. Figure out the best way to achieve it."

**Mindset Shift**: Teams closest to the work make the best decisions.

### Fail Fast, Learn Fast

Traditional: "Failure is unacceptable. Get it right the first time."

Agile: "Fail fast, learn, and improve. Perfection is impossible; continuous improvement is essential."

**Mindset Shift**: Failure is a learning opportunity, not a character flaw.

### Collaborate, Don't Negotiate

Traditional: "The contract says you'll deliver X by date Y."

Agile: "Let's work together to deliver maximum value within constraints."

**Mindset Shift**: Customers and teams are partners, not adversaries.

## Common Agile Frameworks

Agile is an umbrella term for multiple frameworks:

### Scrum

Most popular Agile framework. Uses fixed-length sprints (typically 2 weeks), defined roles (Product Owner, Scrum Master, Development Team), and ceremonies (Sprint Planning, Daily Standup, Sprint Review, Retrospective).

**Best for**: Teams new to Agile, product development, software projects.

### Kanban

Visualizes work on a board, limits work in progress, and focuses on flow. No fixed iterations—work flows continuously.

**Best for**: Support teams, operations, continuous delivery environments.

### Extreme Programming (XP)

Engineering-focused framework emphasizing technical practices: pair programming, test-driven development, continuous integration, refactoring.

**Best for**: Software development teams focused on technical excellence.

### Lean

Focuses on eliminating waste, optimizing flow, and delivering value. Originated in manufacturing (Toyota Production System).

**Best for**: Process improvement, operational efficiency, manufacturing.

### SAFe (Scaled Agile Framework)

Framework for scaling Agile to large organizations with multiple teams.

**Best for**: Large enterprises, complex products requiring coordination across many teams.

## Agile Roles

Agile redefines traditional project roles:

### Product Owner

Represents the customer and business. Defines what to build, prioritizes work, and accepts completed work.

**Responsibilities**:
- Define and prioritize product backlog
- Communicate vision and goals
- Accept or reject completed work
- Make trade-off decisions
- Engage with stakeholders

**Traditional equivalent**: Business Analyst + Project Sponsor (combined)

### Scrum Master

Facilitates the Agile process. Removes impediments, coaches the team, and protects the team from distractions.

**Responsibilities**:
- Facilitate ceremonies
- Remove impediments
- Coach team on Agile practices
- Shield team from interruptions
- Foster continuous improvement

**Traditional equivalent**: Project Manager (but different focus—servant leader, not command-and-control)

### Development Team

Cross-functional group that builds the product. Self-organizing and collectively responsible for delivery.

**Responsibilities**:
- Estimate work
- Commit to sprint goals
- Build and test features
- Collaborate and self-organize
- Continuously improve

**Traditional equivalent**: Development team (but cross-functional and self-organizing, not specialized and managed)

## Agile Artifacts

Key artifacts in Agile:

### Product Backlog

Prioritized list of everything that might be needed in the product. Owned by Product Owner.

**Contains**:
- User stories
- Features
- Bug fixes
- Technical debt items
- Research spikes

**Characteristics**:
- Prioritized by value
- Continuously refined
- Never complete (always evolving)

### Sprint Backlog

Subset of product backlog items selected for the current sprint, plus a plan for delivering them.

**Contains**:
- Sprint goal
- Selected user stories
- Tasks to complete stories
- Progress tracking

### Increment

The sum of all product backlog items completed during a sprint, plus all previous increments. Must be potentially shippable.

**Characteristics**:
- Working software
- Tested and integrated
- Meets Definition of Done
- Potentially releasable

## Definition of Done

Shared understanding of what "complete" means:

**Example Definition of Done**:
- Code written and peer-reviewed
- Unit tests written and passing
- Integration tests passing
- Documentation updated
- Accepted by Product Owner
- Deployed to staging environment
- No known defects

**Purpose**:
- Ensures quality
- Prevents misunderstandings
- Enables consistent delivery
- Supports continuous integration

## Agile Metrics

Measure progress and performance:

### Velocity

Amount of work completed per sprint, measured in story points.

**Use**: Forecasting how much work can be completed in future sprints.

**Example**: Team completes 30 story points per sprint on average. Product backlog has 180 story points remaining. Estimated 6 sprints to complete.

### Burndown Chart

Shows work remaining over time. Ideally trends downward toward zero.

**Use**: Visualizing progress toward sprint or release goal.

### Cumulative Flow Diagram

Shows work in different states over time (To Do, In Progress, Done).

**Use**: Identifying bottlenecks and flow problems.

### Cycle Time

Time from when work starts to when it's completed.

**Use**: Measuring efficiency and identifying delays.

### Lead Time

Time from when work is requested to when it's completed.

**Use**: Setting customer expectations and improving responsiveness.

## Common Misconceptions About Agile

**"Agile means no planning"**

False. Agile plans continuously. The difference is that Agile plans are adaptive, not fixed.

**"Agile means no documentation"**

False. Agile values working software over comprehensive documentation, but documentation is still important. Create sufficient documentation, not excessive documentation.

**"Agile means no deadlines"**

False. Agile has deadlines (sprint ends, release dates). The difference is that scope is flexible while time and quality are fixed.

**"Agile is only for software"**

False. While Agile originated in software, its principles apply to many domains: marketing, HR, operations, product development.

**"Agile is easier than Waterfall"**

False. Agile requires discipline, collaboration, and continuous attention. It's different, not easier.

**"Agile means developers do whatever they want"**

False. Agile empowers teams within constraints. Product Owner sets priorities, Definition of Done sets quality standards, and the team commits to sprint goals.

## Key Takeaways

- Agile values individuals and interactions, working software, customer collaboration, and responding to change
- Agile addresses problems with traditional approaches: requirements uncertainty, long feedback cycles, inability to adapt
- Agile delivers value incrementally, welcomes change, and emphasizes customer collaboration
- Agile is a mindset, not just practices: embrace change, focus on value, empower teams, fail fast and learn
- Common Agile frameworks include Scrum, Kanban, XP, Lean, and SAFe
- Key Agile roles: Product Owner (what to build), Scrum Master (how to work), Development Team (build it)
- Key Agile artifacts: Product Backlog (all work), Sprint Backlog (current sprint work), Increment (working software)
- Definition of Done ensures shared understanding of "complete"
- Agile metrics include velocity, burndown charts, cycle time, and lead time
- Agile requires planning, documentation, and discipline—it's different from Waterfall, not easier

In the next lesson, we'll dive deep into Scrum, the most popular Agile framework.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 2,
    title: "Scrum Framework Deep Dive",
    content: `# Scrum Framework Deep Dive

Scrum is the most widely adopted Agile framework. It provides structure while maintaining flexibility, making it accessible to teams new to Agile. Understanding Scrum's roles, events, and artifacts is essential for effective Agile project management.

## What is Scrum?

Scrum is a lightweight framework for developing and sustaining complex products. It consists of:

- **Scrum Teams** and their roles
- **Events** (ceremonies) that provide structure
- **Artifacts** that provide transparency
- **Rules** that bind these together

**Key Characteristics**:
- Iterative and incremental
- Fixed-length sprints (typically 2 weeks)
- Cross-functional, self-organizing teams
- Empirical process control (inspect and adapt)
- Time-boxed events

## Scrum Theory

Scrum is founded on empirical process control:

### Three Pillars

**Transparency**: Significant aspects of the process must be visible to those responsible for the outcome.

**Example**: Product backlog is visible to all. Sprint progress is visible on a board. Definition of Done is explicit.

**Inspection**: Scrum users must frequently inspect artifacts and progress toward goals.

**Example**: Daily standup inspects progress. Sprint review inspects the increment. Retrospective inspects the process.

**Adaptation**: If inspection reveals unacceptable deviation, adjust the process or materials.

**Example**: If velocity drops, investigate and adapt. If quality issues arise, improve practices. If priorities change, reorder backlog.

### Five Values

**Commitment**: Team members commit to achieving team goals.

**Courage**: Team members have courage to do the right thing and work on tough problems.

**Focus**: Everyone focuses on the sprint work and team goals.

**Openness**: Team and stakeholders are open about work and challenges.

**Respect**: Team members respect each other as capable, independent people.

## Scrum Roles

Scrum defines three roles:

### Product Owner

**Single person** responsible for maximizing product value.

**Responsibilities**:

**Manage Product Backlog**:
- Clearly express backlog items
- Order items to best achieve goals
- Ensure backlog is visible, transparent, and clear
- Ensure team understands items to needed level

**Define Vision**: Communicate product vision and goals to team and stakeholders.

**Prioritize Work**: Decide what's most important based on business value, risk, dependencies, and learning.

**Accept Work**: Review completed work and accept or reject based on Definition of Done.

**Engage Stakeholders**: Gather feedback, manage expectations, communicate progress.

**Make Trade-offs**: Balance scope, schedule, and quality based on business priorities.

**Characteristics of Effective Product Owners**:
- Available and engaged
- Decisive
- Understands the business and users
- Empowered to make decisions
- Collaborative but clear on priorities
- Focused on value, not just features

**Common Product Owner Challenges**:

**Product Owner by committee**: Multiple people trying to act as Product Owner leads to conflicting priorities.

**Solution**: One person is Product Owner. Others can influence, but PO makes final decisions.

**Unavailable Product Owner**: PO is too busy with other responsibilities.

**Solution**: Product Owner must dedicate sufficient time. If not feasible, delegate Product Owner role to someone who can.

**Technical Product Owner**: PO focuses on technical solutions rather than business problems.

**Solution**: PO should define what and why, let team define how.

### Scrum Master

**Servant leader** who helps everyone understand and apply Scrum.

**Responsibilities**:

**Serve the Product Owner**:
- Help find techniques for effective backlog management
- Facilitate stakeholder collaboration
- Coach on Agile product management

**Serve the Development Team**:
- Coach on self-organization and cross-functionality
- Remove impediments
- Facilitate Scrum events
- Coach on Agile engineering practices

**Serve the Organization**:
- Lead and coach Agile adoption
- Plan Scrum implementations
- Help employees and stakeholders understand Scrum
- Work with other Scrum Masters to increase effectiveness

**Characteristics of Effective Scrum Masters**:
- Servant leader, not command-and-control manager
- Patient and persistent
- Skilled facilitator
- Protects team from distractions
- Challenges status quo
- Promotes continuous improvement

**Common Scrum Master Mistakes**:

**Scrum Master as Project Manager**: Trying to control the team rather than serving them.

**Solution**: Shift from "telling" to "asking." Empower team to make decisions.

**Scrum Master as Team Member**: Spending most time on development work rather than Scrum Master duties.

**Solution**: Scrum Master is a full-time role for most teams. If combining roles, ensure Scrum Master duties don't suffer.

**Scrum Master as Secretary**: Just scheduling meetings and taking notes.

**Solution**: Scrum Master is a leader and coach, not an administrator.

### Development Team

**Cross-functional group** of professionals who deliver potentially releasable increments.

**Characteristics**:

**Self-organizing**: Team decides how to accomplish work, not directed by others.

**Cross-functional**: Team has all skills needed to create an increment.

**No titles**: Everyone is a "Developer" regardless of specific skills.

**No sub-teams**: No separate testing team, architecture team, etc.

**Collective accountability**: Team as a whole is accountable, not individuals.

**Size**: 3-9 people. Smaller than 3 lacks interaction. Larger than 9 requires too much coordination.

**Responsibilities**:

**Deliver Increment**: Create potentially releasable increment each sprint.

**Estimate Work**: Provide estimates for backlog items.

**Commit to Sprint Goal**: Decide what can be accomplished in sprint.

**Self-organize**: Determine how to accomplish work.

**Maintain Quality**: Adhere to Definition of Done.

**Collaborate**: Work together, help each other, share knowledge.

**Characteristics of Effective Development Teams**:
- Truly cross-functional (not just co-located specialists)
- Collaborative, not competitive
- Committed to team goals
- Willing to help each other
- Focused on delivering value
- Continuously improving

**Common Development Team Challenges**:

**Not truly cross-functional**: Team lacks necessary skills and depends on external people.

**Solution**: Train team members in multiple skills. Hire for missing skills. Temporarily include specialists while building internal capability.

**Not self-organizing**: Team waits for Scrum Master or Product Owner to tell them what to do.

**Solution**: Scrum Master coaches team on self-organization. Resist urge to provide answers; ask questions instead.

**Individual rather than team focus**: Team members work in silos, don't help each other.

**Solution**: Emphasize team goals over individual tasks. Pair programming. Swarm on blockers.

## Scrum Events

Scrum uses time-boxed events to create regularity and minimize other meetings:

### Sprint

**Container** for all other events. Fixed-length period (typically 2 weeks) during which a potentially releasable increment is created.

**Characteristics**:
- Fixed duration (1-4 weeks, typically 2)
- Starts immediately after previous sprint ends
- No gaps between sprints
- Sprint goal doesn't change during sprint
- Quality doesn't decrease
- Scope can be clarified and renegotiated with Product Owner

**During Sprint**:
- No changes that endanger sprint goal
- Quality goals don't decrease
- Scope may be clarified and renegotiated between PO and team

**Canceling Sprints**:

Sprints can be cancelled if sprint goal becomes obsolete. Only Product Owner can cancel.

**Rare**: Cancellation wastes effort and demoralizes team. Only cancel if continuing makes no sense.

### Sprint Planning

**Plan the work** for the upcoming sprint.

**Time-box**: 8 hours for 4-week sprint (proportionally less for shorter sprints). Typically 4 hours for 2-week sprint.

**Attendees**: Entire Scrum Team (PO, SM, Dev Team)

**Agenda**:

**Part 1: What can be done?**
- Product Owner presents highest priority backlog items
- Team discusses and asks questions
- Team forecasts what can be completed
- Team crafts sprint goal

**Part 2: How will it be done?**
- Team decomposes backlog items into tasks
- Team creates plan for delivering increment
- Team identifies dependencies and risks

**Outputs**:
- Sprint goal (objective for the sprint)
- Sprint backlog (selected items + plan)
- Team commitment to sprint goal

**Sprint Goal**:

Short statement of what the sprint will achieve.

**Examples**:
- "Enable users to search and filter products"
- "Improve page load performance"
- "Complete user registration and login"

**Purpose**: Provides focus and flexibility. If priorities change, team can adjust work while still achieving sprint goal.

### Daily Scrum (Standup)

**Synchronize activities** and create plan for next 24 hours.

**Time-box**: 15 minutes

**Frequency**: Every day at same time and place

**Attendees**: Development Team (required). PO and SM may attend but don't participate unless team asks.

**Format**:

Each team member answers:
1. What did I do yesterday that helped the team meet the sprint goal?
2. What will I do today to help the team meet the sprint goal?
3. Do I see any impediments that prevent me or the team from meeting the sprint goal?

**Alternative format**: Walk the board—discuss each item in progress rather than each person.

**Purpose**:
- Inspect progress toward sprint goal
- Inspect progress toward completing sprint backlog
- Optimize team collaboration and performance
- Identify impediments

**Common Daily Scrum Mistakes**:

**Status report to Scrum Master**: Team members report to SM rather than coordinating with each other.

**Solution**: SM steps back. Team members face each other, not SM.

**Too long**: Meeting exceeds 15 minutes, becomes boring.

**Solution**: Strictly enforce time-box. Take detailed discussions offline.

**Problem-solving**: Team tries to solve problems during standup.

**Solution**: Identify problems during standup, solve them after.

**No follow-up**: Impediments are mentioned but never addressed.

**Solution**: Scrum Master tracks impediments and works to remove them.

### Sprint Review

**Inspect the increment** and adapt product backlog.

**Time-box**: 4 hours for 4-week sprint (proportionally less for shorter sprints). Typically 2 hours for 2-week sprint.

**Attendees**: Scrum Team + stakeholders

**Agenda**:
1. Product Owner explains what was and wasn't completed
2. Development Team demonstrates completed work
3. Development Team answers questions
4. Product Owner discusses product backlog status
5. Group collaborates on what to do next
6. Review of timeline, budget, and capabilities for next release

**Outputs**:
- Feedback on increment
- Updated product backlog
- Probable product backlog items for next sprint

**Purpose**:
- Gather feedback
- Foster collaboration
- Inspect progress toward release goal
- Adapt product backlog based on learning

**Sprint Review is NOT**:
- A formal sign-off meeting
- A presentation with slides
- A one-way demo

**Sprint Review IS**:
- A working session
- A conversation with stakeholders
- An opportunity to inspect and adapt

### Sprint Retrospective

**Inspect how the last sprint went** and create plan for improvements.

**Time-box**: 3 hours for 4-week sprint (proportionally less for shorter sprints). Typically 1.5 hours for 2-week sprint.

**Attendees**: Scrum Team (PO, SM, Dev Team)

**Timing**: After Sprint Review, before next Sprint Planning

**Agenda**:
1. What went well?
2. What didn't go well?
3. What should we improve?
4. Create action plan for improvements

**Outputs**:
- Identified improvements
- Action plan for implementing improvements
- Updated Definition of Done (if needed)

**Purpose**:
- Continuous improvement
- Team bonding
- Process adaptation

**Retrospective Techniques**:

**Start, Stop, Continue**: What should we start doing, stop doing, continue doing?

**Glad, Sad, Mad**: What made us glad, sad, or mad?

**4 Ls**: What did we Like, Learn, Lack, Long for?

**Sailboat**: What's propelling us forward (wind)? What's holding us back (anchor)?

**Timeline**: Create timeline of sprint, mark high and low points, discuss.

**Common Retrospective Mistakes**:

**No action items**: Team discusses but doesn't commit to improvements.

**Solution**: End with specific, actionable commitments. Assign owners and due dates.

**Same issues every sprint**: Team identifies problems but doesn't fix them.

**Solution**: Limit to 1-3 improvements per sprint. Follow up on previous action items.

**Blame and finger-pointing**: Retrospective becomes uncomfortable and unproductive.

**Solution**: Establish ground rules. Focus on process, not people. Scrum Master facilitates professionally.

**Product Owner dominates**: PO turns retrospective into backlog grooming.

**Solution**: Retrospective is about process, not product. Keep focus on how team works.

## Scrum Artifacts

Scrum artifacts provide transparency and opportunities for inspection and adaptation:

### Product Backlog

**Ordered list** of everything that might be needed in the product.

**Characteristics**:
- Single source of requirements
- Never complete (always evolving)
- Ordered by value, risk, and dependencies
- Owned by Product Owner
- Visible to all

**Backlog Items**:

Typically written as **user stories**:

Format: "As a [role], I want [feature] so that [benefit]."

Example: "As a customer, I want to save items to a wishlist so that I can purchase them later."

**Acceptance Criteria**: Conditions that must be met for story to be considered done.

Example:
- User can add items to wishlist
- User can view wishlist
- User can remove items from wishlist
- Wishlist persists across sessions

**Backlog Refinement**:

Ongoing process of adding detail, estimates, and order to backlog items.

**Activities**:
- Break large items into smaller ones
- Add acceptance criteria
- Estimate items
- Reorder based on new information

**Effort**: Typically 10% of team capacity

**Frequency**: Continuously, or dedicated refinement sessions

**Ready Items**:

Items are "ready" for sprint when they:
- Are clear and understood by team
- Are small enough to complete in one sprint
- Have acceptance criteria
- Are estimated
- Have no external dependencies

### Sprint Backlog

**Subset of product backlog items** selected for sprint, plus plan for delivering them.

**Contains**:
- Sprint goal
- Selected product backlog items
- Tasks to complete those items
- Plan for delivering increment

**Characteristics**:
- Owned by Development Team
- Modified only by Development Team
- Visible to all
- Updated daily

**Task Board**:

Visual representation of sprint backlog:

| To Do | In Progress | Done |
|-------|-------------|------|
| Task 1 | Task 3 | Task 5 |
| Task 2 | Task 4 | Task 6 |

**Purpose**: Makes work visible, shows progress, identifies bottlenecks.

### Increment

**Sum of all product backlog items** completed during sprint, plus all previous increments.

**Characteristics**:
- Working software
- Meets Definition of Done
- Potentially releasable
- Inspected at Sprint Review

**Definition of Done**:

Shared understanding of what "complete" means.

**Example**:
- Code complete and reviewed
- Unit tests written and passing
- Integration tests passing
- Documentation updated
- Accepted by Product Owner
- Deployed to staging
- No known defects

**Purpose**: Ensures quality, prevents misunderstandings, enables continuous delivery.

## Scrum in Practice

### Sprint Cadence

Typical 2-week sprint:

**Week 1**:
- Monday morning: Sprint Planning (4 hours)
- Monday-Friday: Development work
- Daily: Daily Scrum (15 minutes)

**Week 2**:
- Monday-Thursday: Development work
- Daily: Daily Scrum (15 minutes)
- Friday morning: Sprint Review (2 hours)
- Friday afternoon: Sprint Retrospective (1.5 hours)

**Next Sprint**:
- Monday morning: Sprint Planning for next sprint

### Estimation in Scrum

**Story Points**: Relative measure of effort, complexity, and uncertainty.

**Fibonacci Sequence**: 1, 2, 3, 5, 8, 13, 21...

**Why Fibonacci?**: Larger numbers have more uncertainty. Fibonacci reflects this.

**Planning Poker**:
1. Product Owner presents story
2. Team discusses and asks questions
3. Each team member privately selects estimate
4. All reveal simultaneously
5. Discuss differences (especially high and low)
6. Re-estimate until consensus

**Velocity**: Amount of work (story points) completed per sprint.

**Use**: Forecasting future capacity.

**Example**: Team completes 30 points per sprint. Product backlog has 180 points. Estimate 6 sprints to complete.

## Key Takeaways

- Scrum is founded on transparency, inspection, and adaptation
- Three roles: Product Owner (what to build), Scrum Master (facilitate process), Development Team (build it)
- Five events: Sprint (container), Sprint Planning (plan work), Daily Scrum (synchronize), Sprint Review (inspect increment), Sprint Retrospective (improve process)
- Three artifacts: Product Backlog (all work), Sprint Backlog (sprint work), Increment (working software)
- Sprints are fixed-length (typically 2 weeks) and produce potentially releasable increment
- Product Owner prioritizes backlog based on value
- Development Team is cross-functional and self-organizing
- Scrum Master is servant leader who facilitates and removes impediments
- Definition of Done ensures shared understanding of quality
- Velocity measures team capacity and enables forecasting
- Continuous improvement through retrospectives

In the next lesson, we'll explore user stories and backlog management in detail.`,
    estimatedMinutes: 30,
  },
];

console.log('Seeding Level 3 lessons (1-2)...');

for (const lesson of level3Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('Level 3 lessons 1-2 seeded successfully!');

await connection.end();
