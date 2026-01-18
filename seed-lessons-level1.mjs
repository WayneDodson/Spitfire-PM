import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level1Lessons = [
  {
    levelId: 1,
    lessonNumber: 1,
    title: "What is Project Management?",
    estimatedMinutes: 30,
    content: `# What is Project Management?

Welcome to your journey into the world of project management! Whether you're looking to transition into a PM role, enhance your current skills, or simply understand what project managers actually do, you've come to the right place.

## Defining Project Management

Project management is the **application of knowledge, skills, tools, and techniques to project activities** to meet specific requirements and achieve desired outcomes. But what does that really mean in practice?

Think of a project manager as the conductor of an orchestra. Each musician (team member) has their own instrument and expertise, but without someone coordinating their efforts, ensuring they play in harmony, and keeping everyone on tempo, you'd have chaos instead of a symphony.

## Projects vs. Operations

A critical distinction every PM must understand is the difference between projects and ongoing operations:

**Projects** are temporary endeavors with:
- A defined beginning and end
- Specific objectives and deliverables
- Unique characteristics (even if similar to past projects)
- Allocated resources and budget
- Progressive elaboration (details become clearer over time)

**Operations** are ongoing activities that:
- Continue indefinitely
- Maintain the business
- Follow established processes
- Have no defined end date

**Example:** Building a new hospital wing is a **project**. Running the daily operations of that hospital wing once it opens is **operations**.

## Why Organizations Need Project Managers

Modern organizations face increasing complexity, tighter deadlines, and higher stakeholder expectations. Project managers provide:

| Value Delivered | How PMs Achieve This |
|----------------|---------------------|
| **Risk Mitigation** | Identify potential problems before they occur and create contingency plans |
| **Resource Optimization** | Ensure the right people work on the right tasks at the right time |
| **Stakeholder Alignment** | Keep everyone informed and manage expectations throughout the project |
| **Quality Assurance** | Maintain standards and ensure deliverables meet requirements |
| **Financial Control** | Monitor budgets and prevent cost overruns |
| **Timeline Management** | Keep projects on schedule and deliver on time |

## The Triple Constraint

Every project operates within the **triple constraint** (also called the project management triangle):

1. **Scope** - What needs to be delivered
2. **Time** - When it needs to be delivered
3. **Cost** - How much can be spent

These three factors are interconnected. Changing one affects the others. For example:
- Want to finish faster? You'll likely need more resources (increased cost) or reduced features (decreased scope)
- Need to cut costs? You'll probably need more time or fewer deliverables
- Want more features? Expect to spend more money or take longer

Understanding this fundamental relationship is crucial for every PM decision you'll make.

## What Success Looks Like

A successful project delivers:
- **On time** - Meets the agreed schedule
- **On budget** - Stays within financial constraints
- **On scope** - Delivers what was promised
- **With quality** - Meets or exceeds standards
- **With satisfied stakeholders** - All parties are happy with the outcome

Notice that success isn't just about completing tasks—it's about meeting expectations and delivering value.

## Your Role as a PM

As you progress through this course, you'll learn that project management is both an **art and a science**. The science involves methodologies, tools, and processes. The art involves leadership, communication, and judgment.

Great project managers don't just follow processes—they adapt them to their specific context, lead diverse teams through uncertainty, and make tough decisions with incomplete information.

## Key Takeaways

- Project management applies structured approaches to achieve specific objectives within constraints
- Projects are temporary and unique, while operations are ongoing and repetitive
- The triple constraint (scope, time, cost) governs all project decisions
- Success means delivering value that satisfies stakeholders, not just completing tasks
- PMs provide critical value through coordination, risk management, and strategic decision-making

In the next lesson, we'll explore the specific role of a project manager and what skills you'll need to develop to excel in this career.`
  },
  {
    levelId: 1,
    lessonNumber: 2,
    title: "The Role of a Project Manager",
    estimatedMinutes: 30,
    content: `# The Role of a Project Manager

Now that you understand what project management is, let's dive into what project managers actually do day-to-day and what makes them successful.

## Core Responsibilities

A project manager wears many hats throughout a project's lifecycle. Your core responsibilities include:

### 1. Planning and Defining Scope

Before any work begins, you must:
- Work with stakeholders to define project objectives
- Document requirements and deliverables
- Create detailed project plans
- Establish timelines and milestones
- Identify resources needed

**Real-world example:** For a website redesign project, you'd meet with marketing, IT, and executive stakeholders to understand their needs, document required features, and create a timeline showing when design, development, and testing phases will occur.

### 2. Managing Resources

You're responsible for:
- Assembling the right team
- Assigning tasks based on skills and availability
- Ensuring team members have what they need to succeed
- Resolving resource conflicts
- Managing workload distribution

**Key insight:** You often manage people who don't directly report to you. This requires influence and negotiation skills, not just authority.

### 3. Communicating with Stakeholders

Communication consumes 80-90% of a PM's time:
- Regular status updates to leadership
- Team meetings and one-on-ones
- Stakeholder presentations
- Risk and issue escalation
- Documentation and reporting

**Pro tip:** Different stakeholders need different information. Executives want high-level summaries and business impact. Team members need detailed task information. Tailor your communication accordingly.

### 4. Managing Risk and Issues

You must:
- Identify potential risks before they become problems
- Create mitigation strategies
- Monitor risk indicators
- Resolve issues quickly when they arise
- Escalate appropriately when needed

**Example:** If your lead developer mentions they're interviewing elsewhere, that's a risk. You'd document it, create a knowledge transfer plan, and possibly alert your manager—before they give notice.

### 5. Monitoring Progress and Performance

Track and measure:
- Task completion against schedule
- Budget spending vs. plan
- Quality metrics
- Team velocity and productivity
- Milestone achievement

**Tools you'll use:** Gantt charts, burndown charts, status dashboards, and earned value analysis (we'll cover these in later levels).

### 6. Managing Change

Projects rarely go exactly as planned:
- Evaluate change requests
- Assess impact on scope, time, and cost
- Get stakeholder approval
- Update plans and communicate changes
- Ensure team understands new direction

**Critical skill:** Knowing when to say "no" to scope creep while remaining flexible to legitimate changes.

## Essential PM Skills

Success requires both **hard skills** (technical knowledge) and **soft skills** (people skills):

### Hard Skills
- **Methodology knowledge** - Understanding Waterfall, Agile, Scrum, etc.
- **Scheduling** - Creating realistic timelines with dependencies
- **Budgeting** - Estimating costs and tracking spending
- **Risk management** - Identifying and mitigating threats
- **Tools proficiency** - Jira, Asana, MS Project, Excel, etc.

### Soft Skills
- **Leadership** - Inspiring and guiding teams without formal authority
- **Communication** - Clear, concise, and audience-appropriate messaging
- **Negotiation** - Finding win-win solutions to conflicts
- **Problem-solving** - Analytical thinking under pressure
- **Emotional intelligence** - Understanding team dynamics and motivations
- **Adaptability** - Pivoting when circumstances change

## A Day in the Life

What does a typical day look like? Here's a realistic example:

**9:00 AM** - Review overnight emails and Slack messages. A vendor has a question about requirements.

**9:30 AM** - Daily standup with development team. One developer is blocked waiting for design assets.

**10:00 AM** - Follow up with design team to prioritize the blocking issue.

**10:30 AM** - Update project status dashboard with yesterday's progress.

**11:00 AM** - Budget review meeting with finance. Discuss potential cost overrun in testing phase.

**12:00 PM** - Lunch (sometimes with stakeholders or team members)

**1:00 PM** - One-on-one with a struggling team member. They're overwhelmed with tasks.

**1:30 PM** - Reprioritize their workload and reassign some tasks.

**2:00 PM** - Stakeholder meeting presenting this week's progress and next week's plans.

**3:00 PM** - Risk review session. Document new risks and update mitigation plans.

**4:00 PM** - Respond to emails, update documentation, prepare tomorrow's agenda.

**5:00 PM** - Quick check-in with team lead about tomorrow's client demo.

Notice the variety: meetings, problem-solving, communication, planning, and firefighting all in one day.

## What Makes Great PMs Stand Out

The difference between good and great project managers:

| Good PMs | Great PMs |
|----------|-----------|
| Follow the plan | Adapt the plan to reality |
| Report problems | Solve problems proactively |
| Manage tasks | Lead people |
| Focus on process | Focus on outcomes |
| Wait for direction | Take initiative |
| Avoid conflict | Navigate conflict constructively |

## Career Progression

Typical PM career path:

1. **Project Coordinator / Associate PM** (0-2 years) - Support senior PMs, handle administrative tasks
2. **Project Manager** (2-5 years) - Lead small to medium projects independently
3. **Senior Project Manager** (5-8 years) - Lead complex projects, mentor junior PMs
4. **Program Manager** (8+ years) - Oversee multiple related projects
5. **Portfolio Manager / PMO Director** (10+ years) - Strategic oversight of all projects

**Salary ranges (UK):**
- Entry level: £25,000 - £35,000
- Mid-level: £40,000 - £60,000
- Senior: £60,000 - £85,000
- Director: £85,000 - £120,000+

## Key Takeaways

- PMs balance planning, execution, communication, and problem-solving daily
- You need both technical PM skills and strong interpersonal abilities
- Success comes from leading people, not just managing tasks
- The role requires adaptability—no two days are exactly alike
- Career growth potential is significant with the right skills and experience

In the next lesson, we'll explore the different project management methodologies you'll need to master, starting with an overview of the most common approaches.`
  },
  {
    levelId: 1,
    lessonNumber: 3,
    title: "Project Management Methodologies Overview",
    estimatedMinutes: 30,
    content: `# Project Management Methodologies Overview

One of the most important decisions you'll make as a PM is choosing the right methodology for your project. There's no one-size-fits-all approach—different projects require different frameworks.

## What is a Methodology?

A **project management methodology** is a set of principles, practices, and procedures that guide how you plan, execute, and control a project. Think of it as a playbook that provides structure and best practices.

Methodologies help you:
- Organize work systematically
- Communicate with stakeholders using common language
- Make consistent decisions
- Reduce risk through proven approaches
- Scale practices across teams and projects

## The Major Methodologies

Let's explore the most widely used approaches in modern project management.

### 1. Waterfall (Traditional)

**Philosophy:** Sequential, phase-by-phase progression where each stage must be completed before the next begins.

**Phases:**
1. Requirements gathering
2. Design
3. Implementation
4. Testing
5. Deployment
6. Maintenance

**Best for:**
- Projects with well-defined, stable requirements
- Regulated industries (healthcare, construction, aerospace)
- Hardware development
- Projects where changes are expensive

**Example:** Building a bridge. You can't start construction before completing engineering design, and you can't pour concrete before laying the foundation.

**Pros:**
- Clear structure and documentation
- Easy to understand and explain
- Defined deliverables at each phase
- Works well with fixed-price contracts

**Cons:**
- Inflexible to changes
- Testing happens late (expensive to fix issues)
- Customer doesn't see working product until near the end
- Risk of building the wrong thing

### 2. Agile

**Philosophy:** Iterative, incremental delivery with continuous feedback and adaptation.

**Core values** (from the Agile Manifesto):
- Individuals and interactions over processes and tools
- Working software over comprehensive documentation
- Customer collaboration over contract negotiation
- Responding to change over following a plan

**Best for:**
- Software development
- Projects with evolving requirements
- Innovation and new product development
- Customer-facing applications

**Example:** Developing a mobile app. Release a basic version quickly, gather user feedback, and continuously improve based on real usage data.

**Pros:**
- Flexible and adaptive
- Early and continuous delivery
- Regular customer feedback
- Higher team morale and engagement

**Cons:**
- Less predictable timelines and costs
- Requires experienced team members
- Can lack documentation
- Difficult for fixed-price contracts

### 3. Scrum (Agile Framework)

**Philosophy:** Work in short, time-boxed iterations (sprints) with defined roles and ceremonies.

**Key roles:**
- **Product Owner** - Defines what to build and prioritizes work
- **Scrum Master** - Facilitates process and removes obstacles
- **Development Team** - Builds the product

**Key ceremonies:**
- **Sprint Planning** - Decide what to build in the next sprint
- **Daily Standup** - 15-minute sync on progress and blockers
- **Sprint Review** - Demo completed work to stakeholders
- **Sprint Retrospective** - Team reflects on how to improve

**Sprint cycle:** Typically 2 weeks, but can be 1-4 weeks.

**Best for:**
- Software development teams
- Projects requiring rapid delivery
- Teams that can self-organize
- Products needing frequent releases

**Pros:**
- Clear roles and responsibilities
- Regular delivery of working features
- Built-in improvement mechanism (retrospectives)
- High transparency

**Cons:**
- Requires cultural buy-in
- Can be challenging for distributed teams
- Scope creep if not managed carefully
- Daily meetings can feel excessive

### 4. Kanban

**Philosophy:** Visualize work, limit work-in-progress, and optimize flow.

**Key principles:**
- Visualize workflow on a board
- Limit WIP (work in progress) to prevent overload
- Manage and optimize flow
- Make process policies explicit
- Continuously improve

**Best for:**
- Ongoing operations and support
- Teams with varying priorities
- Maintenance and bug fixing
- Marketing and creative work

**Example:** IT support team managing incoming tickets. Each ticket moves through columns: To Do → In Progress → Review → Done.

**Pros:**
- Simple to understand and implement
- Flexible—no fixed iterations
- Reduces multitasking
- Easy to spot bottlenecks

**Cons:**
- Less structure than Scrum
- No built-in planning mechanism
- Can lack urgency without deadlines
- Requires discipline to limit WIP

### 5. Hybrid Approaches

Many organizations blend methodologies to fit their needs:

**Wagile (Water-Scrum-Fall):**
- Waterfall planning and governance
- Agile execution
- Waterfall deployment and closeout

**Common in:** Large enterprises transitioning to Agile

**Scrumban:**
- Scrum's roles and ceremonies
- Kanban's visual board and WIP limits

**Common in:** Teams wanting Scrum structure with Kanban flexibility

## Choosing the Right Methodology

Consider these factors:

| Factor | Waterfall | Agile/Scrum | Kanban |
|--------|-----------|-------------|---------|
| **Requirements clarity** | Well-defined | Evolving | Continuous flow |
| **Project size** | Large, complex | Small to medium | Any size |
| **Timeline** | Fixed | Flexible | Ongoing |
| **Budget** | Fixed | Variable | Variable |
| **Stakeholder involvement** | Limited | High | Medium |
| **Team experience** | Any | Experienced | Any |
| **Change tolerance** | Low | High | High |
| **Regulatory requirements** | Strict | Flexible | Flexible |

## Real-World Application

**Scenario:** You're managing a hospital patient portal project.

**Analysis:**
- Regulatory compliance required (healthcare data) → suggests Waterfall
- User experience needs iteration → suggests Agile
- Integration with existing systems → suggests Waterfall
- Need to show progress to executives → suggests Scrum

**Solution:** Hybrid approach
- Use Waterfall for compliance and integration planning
- Use Scrum for UI/UX development with 2-week sprints
- Use Kanban for ongoing bug fixes and support

## Key Takeaways

- No methodology is inherently better—context determines the right choice
- Waterfall works for stable requirements and regulated environments
- Agile excels when requirements evolve and customer feedback is crucial
- Scrum provides structure for Agile teams through roles and ceremonies
- Kanban optimizes flow and works well for ongoing operations
- Hybrid approaches combine strengths of multiple methodologies
- Your job as PM is to choose and adapt the methodology to your project's needs

In the next two lessons, we'll dive deep into Waterfall and Agile/Scrum so you can apply them confidently in your projects.`
  },
  {
    levelId: 1,
    lessonNumber: 4,
    title: "Waterfall Methodology Deep Dive",
    estimatedMinutes: 30,
    content: `# Waterfall Methodology Deep Dive

Waterfall remains one of the most widely used methodologies, especially in construction, manufacturing, healthcare, and government projects. Let's explore how to execute Waterfall projects successfully.

## The Waterfall Model in Detail

Waterfall follows a linear, sequential approach where each phase must be completed before the next begins. Think of it like a waterfall cascading down—once water flows over a ledge, it doesn't flow back up.

### Phase 1: Requirements Gathering

**Objective:** Fully understand and document what needs to be built.

**Activities:**
- Stakeholder interviews
- Requirements workshops
- Document analysis
- User research
- Competitive analysis

**Deliverables:**
- Requirements specification document
- Use cases and user stories
- Acceptance criteria
- Scope statement

**Success criteria:** All stakeholders agree on and sign off on requirements.

**Time investment:** 10-15% of total project duration

**Common pitfalls:**
- Assuming you know what users want without asking
- Vague or ambiguous requirements
- Missing stakeholders in the process
- Not documenting assumptions

**Best practice:** Use the MoSCoW method to prioritize requirements:
- **Must have** - Non-negotiable, project fails without these
- **Should have** - Important but not critical
- **Could have** - Nice to have if time/budget allows
- **Won't have** - Out of scope for this project

### Phase 2: Design

**Objective:** Create detailed specifications for how the solution will be built.

**Activities:**
- System architecture design
- Database schema design
- User interface mockups
- Technical specifications
- Integration planning

**Deliverables:**
- System design document
- Architecture diagrams
- UI/UX wireframes and mockups
- Data models
- API specifications

**Success criteria:** Design satisfies all requirements and is technically feasible.

**Time investment:** 15-20% of total project duration

**Key principle:** Design should be detailed enough that developers can build without constant clarification.

**Example:** For a hospital patient portal:
- Architecture: Web application with mobile-responsive design
- Database: Patient records, appointments, prescriptions, billing
- UI: Dashboard, appointment booking, prescription refills, secure messaging
- Integration: Electronic health records (EHR) system, payment gateway, SMS notifications

### Phase 3: Implementation (Development)

**Objective:** Build the solution according to design specifications.

**Activities:**
- Writing code
- Database creation
- Component development
- Integration work
- Unit testing (by developers)

**Deliverables:**
- Working software/product
- Source code
- Technical documentation
- Deployment scripts

**Success criteria:** All features built according to specifications.

**Time investment:** 40-50% of total project duration

**PM responsibilities during implementation:**
- Track progress against schedule
- Remove blockers for the team
- Manage scope changes
- Communicate status to stakeholders
- Ensure quality standards are maintained

**Red flags to watch for:**
- Developers saying "it's 90% done" for weeks
- Increasing number of "small changes" to requirements
- Team working excessive overtime
- Communication breakdowns between team members

### Phase 4: Testing

**Objective:** Verify the solution works correctly and meets requirements.

**Testing types:**

| Test Type | Purpose | Who Performs |
|-----------|---------|--------------|
| **Unit Testing** | Individual components work | Developers |
| **Integration Testing** | Components work together | QA Team |
| **System Testing** | Entire system functions | QA Team |
| **User Acceptance Testing (UAT)** | Meets business needs | End users/stakeholders |
| **Performance Testing** | Handles expected load | QA/DevOps |
| **Security Testing** | Protects against threats | Security team |

**Deliverables:**
- Test plans and test cases
- Test results and bug reports
- UAT sign-off
- Performance benchmarks

**Success criteria:** All critical and high-priority bugs resolved, UAT passed.

**Time investment:** 15-20% of total project duration

**Common mistake:** Underestimating testing time. Budget at least 20% of development time for testing.

**Bug priority framework:**
- **Critical** - System crash, data loss, security breach → Fix immediately
- **High** - Major feature broken, workaround exists → Fix before launch
- **Medium** - Minor feature issue, doesn't block usage → Fix if time allows
- **Low** - Cosmetic issues, typos → Backlog for future release

### Phase 5: Deployment

**Objective:** Release the solution to production and transition to users.

**Activities:**
- Production environment setup
- Data migration
- User training
- Documentation finalization
- Go-live execution
- Hypercare support

**Deliverables:**
- Deployed production system
- User manuals and training materials
- Operations runbooks
- Transition plan to support team

**Success criteria:** System is live, users can access it, support team is ready.

**Time investment:** 5-10% of total project duration

**Deployment strategies:**
- **Big bang** - Switch everyone at once (risky but fast)
- **Phased rollout** - Deploy to groups gradually (safer but slower)
- **Parallel run** - Old and new systems run simultaneously (safest but expensive)

**Post-deployment checklist:**
- ✓ All users can log in
- ✓ Critical functions work in production
- ✓ Data migrated correctly
- ✓ Monitoring and alerts configured
- ✓ Support team trained
- ✓ Rollback plan ready if needed

### Phase 6: Maintenance

**Objective:** Keep the system running and address issues that arise.

**Activities:**
- Bug fixes
- Performance optimization
- Security patches
- Minor enhancements
- User support

**Deliverables:**
- Maintenance releases
- Updated documentation
- Support reports

**Transition:** Often handed off from project team to operations/support team.

## Managing a Waterfall Project

### Creating the Project Plan

**Key components:**
1. **Work Breakdown Structure (WBS)** - Decompose project into manageable tasks
2. **Gantt Chart** - Visualize timeline with dependencies
3. **Resource Plan** - Who does what and when
4. **Budget** - Detailed cost estimates
5. **Risk Register** - Identified risks and mitigation plans

**Critical path:** The sequence of tasks that determines the minimum project duration. Any delay on the critical path delays the entire project.

### Managing Change

Waterfall's biggest weakness is handling change. Use a formal **change control process:**

1. **Change request submitted** - Stakeholder documents requested change
2. **Impact analysis** - PM assesses effect on scope, time, cost, quality
3. **Change review board** - Key stakeholders review and approve/reject
4. **Implementation** - If approved, update plans and execute
5. **Communication** - Inform all affected parties

**When to say yes to changes:**
- Critical business need
- Regulatory requirement
- Significant risk mitigation
- Minimal impact on timeline/budget

**When to say no:**
- Nice-to-have features
- Stakeholder preference without business justification
- Would jeopardize project success
- Can be added in a future phase

## When Waterfall Works Best

**Ideal scenarios:**
- Building a new hospital wing
- Developing medical devices
- Government contracts with fixed requirements
- Manufacturing new products
- Infrastructure projects

**Why it works here:**
- Requirements are well understood upfront
- Changes are expensive or dangerous
- Regulatory compliance requires extensive documentation
- Physical constraints make iteration impractical

## Key Takeaways

- Waterfall is sequential—each phase must complete before the next begins
- Extensive upfront planning and documentation are essential
- Testing happens late, making bugs expensive to fix
- Change control is formal and restrictive
- Works best for projects with stable requirements and high change costs
- Still widely used in construction, healthcare, manufacturing, and government
- Success depends on thorough requirements gathering and realistic planning

In the next lesson, we'll explore Agile and Scrum, which take a radically different approach to project management.`
  },
  {
    levelId: 1,
    lessonNumber: 5,
    title: "Agile & Scrum Fundamentals",
    estimatedMinutes: 30,
    content: `# Agile & Scrum Fundamentals

While Waterfall plans everything upfront, Agile embraces change and delivers value incrementally. Let's explore how Agile—and specifically Scrum—revolutionized project management.

## The Agile Mindset

Agile isn't just a methodology; it's a philosophy about how to approach complex work in uncertain environments.

### The Agile Manifesto (2001)

Four core values:

1. **Individuals and interactions** over processes and tools
2. **Working software** over comprehensive documentation
3. **Customer collaboration** over contract negotiation
4. **Responding to change** over following a plan

**Important:** The items on the right still have value, but Agile prioritizes the items on the left.

### Twelve Agile Principles

Key principles every PM should internalize:

1. **Customer satisfaction through early and continuous delivery** - Don't wait months to show value
2. **Welcome changing requirements** - Even late in development
3. **Deliver working software frequently** - Weeks, not months
4. **Business people and developers must work together daily** - No silos
5. **Build projects around motivated individuals** - Trust and support your team
6. **Face-to-face conversation** - Most efficient communication method
7. **Working software is the primary measure of progress** - Not documentation or meetings
8. **Sustainable pace** - Teams should be able to maintain their pace indefinitely
9. **Technical excellence and good design** - Don't sacrifice quality for speed
10. **Simplicity** - Maximize the amount of work not done
11. **Self-organizing teams** - Best architectures and designs emerge from them
12. **Regular reflection and adjustment** - Continuous improvement

## Agile vs. Waterfall: Key Differences

| Aspect | Waterfall | Agile |
|--------|-----------|-------|
| **Approach** | Sequential phases | Iterative cycles |
| **Requirements** | Fixed upfront | Evolve over time |
| **Planning** | Comprehensive at start | Continuous throughout |
| **Delivery** | Single release at end | Frequent incremental releases |
| **Customer involvement** | Beginning and end | Throughout the project |
| **Change** | Discouraged and costly | Welcomed and expected |
| **Documentation** | Extensive | Just enough |
| **Team structure** | Specialized roles | Cross-functional |
| **Risk** | Discovered late | Discovered early |
| **Success measure** | Conformance to plan | Customer value delivered |

## Scrum Framework

Scrum is the most popular Agile framework, used by millions of teams worldwide. It provides structure while maintaining Agile's flexibility.

### The Scrum Team

**Product Owner (PO)**
- Represents stakeholders and customers
- Defines and prioritizes the product backlog
- Makes decisions about what to build
- Accepts or rejects completed work
- **Key skill:** Balancing stakeholder needs with technical constraints

**Scrum Master (SM)**
- Facilitates Scrum process
- Removes impediments blocking the team
- Coaches team on Agile practices
- Shields team from external interruptions
- **Key skill:** Servant leadership—helping others succeed

**Development Team**
- Cross-functional (designers, developers, testers)
- Self-organizing (decides how to do the work)
- Typically 5-9 people
- Collectively responsible for delivery
- **Key skill:** Collaboration and shared ownership

**Note:** In many organizations, the PM role aligns most closely with Product Owner, though some PMs also act as Scrum Masters.

### Scrum Artifacts

**1. Product Backlog**
- Prioritized list of everything that might be needed
- Owned and maintained by Product Owner
- Items at the top are more detailed than those at the bottom
- Continuously refined and reprioritized

**Example items:**
- User stories ("As a patient, I want to book appointments online so I can avoid phone calls")
- Bug fixes
- Technical debt
- Research spikes

**2. Sprint Backlog**
- Subset of product backlog selected for the current sprint
- Team commits to completing these items
- Includes tasks needed to deliver each item
- Updated daily by the team

**3. Increment**
- Sum of all completed product backlog items
- Must be in usable condition (potentially shippable)
- Meets the Definition of Done

**Definition of Done (DoD):** Shared understanding of what "complete" means. Example:
- ✓ Code written and reviewed
- ✓ Unit tests pass
- ✓ Integration tests pass
- ✓ Documentation updated
- ✓ Accepted by Product Owner

### Scrum Events (Ceremonies)

**1. Sprint**
- Time-boxed iteration (typically 2 weeks)
- Fixed length throughout the project
- Goal: Deliver a potentially shippable increment
- No changes that endanger the sprint goal

**2. Sprint Planning**
- **When:** First day of sprint
- **Duration:** 2-4 hours for 2-week sprint
- **Participants:** Entire Scrum team
- **Outcomes:**
  - Sprint goal defined
  - Product backlog items selected
  - Tasks identified
  - Team commits to sprint backlog

**Key questions:**
- What can we deliver this sprint?
- How will we do the work?

**3. Daily Standup (Daily Scrum)**
- **When:** Every day at same time
- **Duration:** 15 minutes (strictly time-boxed)
- **Participants:** Development team (others can observe)
- **Format:** Each team member answers:
  - What did I complete yesterday?
  - What will I work on today?
  - What blockers do I have?

**Purpose:** Synchronize activities and create a plan for the next 24 hours.

**Common mistakes:**
- Turning it into a status report to the Scrum Master
- Problem-solving (take offline)
- Going over 15 minutes

**4. Sprint Review**
- **When:** Last day of sprint
- **Duration:** 1-2 hours for 2-week sprint
- **Participants:** Scrum team + stakeholders
- **Activities:**
  - Demo completed work
  - Discuss what went well and what didn't
  - Review updated product backlog
  - Discuss next likely sprint

**Purpose:** Inspect the increment and adapt the product backlog.

**5. Sprint Retrospective**
- **When:** After sprint review, before next sprint planning
- **Duration:** 45-90 minutes
- **Participants:** Scrum team only
- **Format:** Discuss:
  - What went well?
  - What could be improved?
  - What will we commit to improving next sprint?

**Purpose:** Continuous improvement of process and teamwork.

**Popular formats:**
- Start/Stop/Continue
- Mad/Sad/Glad
- 4Ls (Liked/Learned/Lacked/Longed for)

## User Stories

Agile teams describe requirements as **user stories** rather than formal specifications.

**Format:**
"As a [type of user], I want [goal] so that [benefit]."

**Examples:**

**Good:**
"As a patient, I want to receive SMS appointment reminders so that I don't forget my appointments."

**Bad:**
"The system shall send SMS messages."

**Why the difference matters:** The good story explains WHO, WHAT, and WHY. It focuses on user value, not technical implementation.

### INVEST Criteria for Good User Stories

- **I**ndependent - Can be developed in any order
- **N**egotiable - Details can be discussed
- **V**aluable - Delivers value to users
- **E**stimable - Team can estimate effort
- **S**mall - Can be completed in one sprint
- **T**estable - Clear acceptance criteria

### Acceptance Criteria

Each user story needs clear acceptance criteria:

**Story:** "As a patient, I want to book appointments online."

**Acceptance criteria:**
- Given I'm logged in, when I select a doctor and date, then I see available time slots
- Given I select a time slot, when I confirm, then I receive a confirmation email
- Given I have an appointment, when I view my dashboard, then I see the appointment listed
- Given the appointment is within 24 hours, when I try to cancel, then I see a warning message

## Estimation in Agile

Agile teams estimate using **relative sizing** rather than hours.

**Story Points:** Abstract measure of effort, complexity, and uncertainty.

**Common scale:** Fibonacci sequence (1, 2, 3, 5, 8, 13, 21)
- 1 point: Trivial change
- 3 points: Simple feature
- 8 points: Complex feature
- 13+ points: Too big, needs to be broken down

**Planning Poker:** Team estimation technique
1. Product Owner describes story
2. Team discusses and asks questions
3. Each member privately selects an estimate
4. Everyone reveals simultaneously
5. Discuss differences and re-estimate until consensus

**Velocity:** Number of story points completed per sprint. Used to predict future capacity.

**Example:** Team completes 25 points per sprint on average. Product backlog has 200 points remaining. Estimated time: 8 sprints (16 weeks).

## When Agile/Scrum Works Best

**Ideal scenarios:**
- Software development
- Product development with evolving requirements
- Innovation projects
- Customer-facing applications
- Startups and new ventures

**Why it works:**
- Rapid feedback loops
- Early value delivery
- Flexibility to pivot
- High team engagement
- Reduced risk through incremental delivery

## Common Challenges

**1. Lack of stakeholder availability**
- **Solution:** Set expectations upfront, schedule recurring touchpoints

**2. Resistance to change**
- **Solution:** Start with pilot team, demonstrate success, expand gradually

**3. Distributed teams**
- **Solution:** Invest in collaboration tools, overlap working hours, occasional in-person meetings

**4. Scaling beyond one team**
- **Solution:** Use frameworks like SAFe, LeSS, or Scrum@Scale

## Key Takeaways

- Agile prioritizes individuals, working software, collaboration, and responding to change
- Scrum provides structure through defined roles, artifacts, and ceremonies
- Sprints are time-boxed iterations delivering potentially shippable increments
- User stories describe requirements from the user's perspective
- Estimation uses relative sizing (story points) rather than hours
- Daily standups, sprint reviews, and retrospectives keep teams aligned and improving
- Works best for projects with evolving requirements and need for rapid feedback

In the next lesson, we'll explore the project lifecycle and how different phases require different PM skills and focus.`
  }
];

// Insert lessons
for (const lesson of level1Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Inserted lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('\n✅ Level 1 lessons (1-5) seeded successfully!');

await connection.end();
