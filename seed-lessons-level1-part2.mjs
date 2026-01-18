import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level1LessonsPart2 = [
  {
    levelId: 1,
    lessonNumber: 6,
    title: "Project Lifecycle Phases",
    estimatedMinutes: 30,
    content: `# Project Lifecycle Phases

Every project, regardless of methodology, moves through distinct phases from conception to closure. Understanding these phases helps you apply the right focus and skills at the right time.

## The Five Phase Model

Most projects follow this universal lifecycle:

### Phase 1: Initiation

**Purpose:** Determine if the project should proceed and define it at a high level.

**Key activities:**
- Identify business need or opportunity
- Conduct feasibility study
- Develop business case
- Identify key stakeholders
- Secure initial approval and funding

**Deliverables:**
- Project charter
- Stakeholder register
- High-level scope statement
- Initial risk assessment

**PM focus:** Building relationships, understanding the "why" behind the project, and securing executive sponsorship.

**Critical question:** "Should we do this project?"

**Example:** A hospital identifies that patient satisfaction scores are declining due to long wait times for appointments. Initial analysis shows an online booking system could reduce administrative burden and improve access. Business case shows ROI within 18 months. Project charter approved.

**Success factors:**
- Clear business justification
- Executive sponsor commitment
- Realistic expectations set
- Key stakeholders identified and engaged

### Phase 2: Planning

**Purpose:** Define how the project will be executed, monitored, and controlled.

**Key activities:**
- Define detailed scope
- Create work breakdown structure (WBS)
- Develop schedule with dependencies
- Estimate costs and create budget
- Identify and analyze risks
- Plan resources and procurement
- Establish communication plan
- Define quality standards

**Deliverables:**
- Project management plan
- Scope statement with WBS
- Schedule (Gantt chart)
- Budget and resource plan
- Risk register
- Communication plan
- Quality management plan

**PM focus:** Detailed planning, stakeholder alignment, and risk identification.

**Critical question:** "How will we do this project?"

**Time investment:** In Waterfall, this is extensive (20-30% of project). In Agile, planning is continuous and iterative.

**Common mistakes:**
- Planning in isolation without team input
- Creating overly detailed plans that become obsolete
- Underestimating time and cost
- Ignoring risks or being overly optimistic

**Best practice:** Involve your team in planning. They know the work better than you do, and involvement creates buy-in.

### Phase 3: Execution

**Purpose:** Complete the work defined in the project plan.

**Key activities:**
- Coordinate people and resources
- Execute planned activities
- Manage stakeholder expectations
- Conduct team meetings
- Distribute information
- Implement quality assurance
- Develop team capabilities

**Deliverables:**
- Project deliverables (the actual product/service)
- Status reports
- Change requests
- Updated project documents

**PM focus:** Leadership, communication, problem-solving, and keeping the team productive.

**Critical question:** "Are we building the right thing the right way?"

**Time investment:** 50-60% of project duration

**Your daily activities:**
- Remove blockers for team members
- Facilitate communication
- Make decisions quickly
- Manage scope changes
- Keep stakeholders informed
- Celebrate small wins

**Red flags:**
- Team members working in silos
- Stakeholders surprised by status updates
- Increasing number of defects
- Team morale declining
- Scope creeping without formal changes

### Phase 4: Monitoring and Controlling

**Purpose:** Track, review, and regulate progress and performance.

**Note:** This phase runs in parallel with Execution, not sequentially.

**Key activities:**
- Track progress against plan
- Measure performance (schedule, cost, quality)
- Identify variances
- Implement corrective actions
- Manage changes
- Monitor risks
- Report performance

**Deliverables:**
- Performance reports
- Forecasts
- Change requests
- Updated plans
- Risk updates

**PM focus:** Metrics, variance analysis, and course correction.

**Critical question:** "Are we on track? If not, what needs to change?"

**Key metrics to monitor:**

| Metric | What It Measures | Red Flag |
|--------|------------------|----------|
| **Schedule Variance (SV)** | Ahead or behind schedule | SV < 0 (behind) |
| **Cost Variance (CV)** | Under or over budget | CV < 0 (over budget) |
| **Scope Creep** | Uncontrolled changes | Increasing change requests |
| **Defect Rate** | Quality issues | Rising defects per sprint |
| **Team Velocity** | Team productivity (Agile) | Declining velocity |
| **Stakeholder Satisfaction** | Stakeholder happiness | Declining satisfaction scores |

**Earned Value Management (EVM):**
A powerful technique combining scope, schedule, and cost:

- **Planned Value (PV):** What you planned to accomplish by now
- **Earned Value (EV):** What you've actually accomplished
- **Actual Cost (AC):** What you've actually spent

**Example:**
- PV = £100,000 (planned to complete 50% of £200k project)
- EV = £80,000 (actually completed 40%)
- AC = £90,000 (actually spent)

**Analysis:**
- Schedule Variance = EV - PV = -£20,000 (behind schedule)
- Cost Variance = EV - AC = -£10,000 (over budget)
- **Conclusion:** Project is behind schedule and over budget

**Action:** Investigate root causes, implement corrective actions, update forecasts.

### Phase 5: Closure

**Purpose:** Formally complete the project and capture lessons learned.

**Key activities:**
- Obtain final acceptance
- Hand over deliverables
- Release resources
- Close contracts
- Archive documents
- Conduct lessons learned
- Celebrate success

**Deliverables:**
- Final project report
- Lessons learned document
- Closed contracts
- Archived project files
- Updated organizational process assets

**PM focus:** Ensuring nothing is forgotten, capturing knowledge, and recognizing contributions.

**Critical question:** "What did we learn, and how do we improve next time?"

**Closure checklist:**
- ✓ All deliverables accepted by stakeholders
- ✓ All contracts closed
- ✓ Final budget reconciliation complete
- ✓ Resources released and reassigned
- ✓ Documentation archived
- ✓ Lessons learned documented
- ✓ Team recognized and celebrated
- ✓ Post-implementation review scheduled

**Common mistake:** Skipping closure because everyone rushes to the next project. This loses valuable lessons and leaves loose ends.

**Lessons learned session format:**
1. What went well? (celebrate successes)
2. What didn't go well? (identify problems)
3. What should we do differently next time? (actionable improvements)
4. What surprised us? (unexpected learnings)

**Example lessons:**
- ✓ Daily standups kept team aligned (continue)
- ✗ Requirements changed frequently (need better upfront analysis)
- ✓ Automated testing caught bugs early (expand to other projects)
- ✗ Stakeholder communication was inconsistent (create communication plan template)

## Phase Transitions

**Key principle:** Each phase should have a formal gate or review before proceeding.

**Phase gates:**
- **Initiation → Planning:** Project charter approved
- **Planning → Execution:** Project plan approved, resources committed
- **Execution → Closure:** All deliverables accepted, stakeholders satisfied

**Why gates matter:** They prevent projects from proceeding with unresolved issues and ensure stakeholder alignment.

## Adapting Phases to Methodologies

**Waterfall:** Phases are distinct and sequential. Complete one before starting the next.

**Agile:** Phases are compressed into each sprint:
- Initiation: Sprint 0 or project kickoff
- Planning: Sprint planning (every sprint)
- Execution: Sprint work
- Monitoring: Daily standups, burndown charts
- Closure: Sprint review, retrospective

**Hybrid:** Waterfall for initiation and planning, Agile for execution, Waterfall for closure.

## Your PM Role Across Phases

| Phase | Primary PM Skills | Time Allocation |
|-------|------------------|----------------|
| **Initiation** | Stakeholder management, business analysis | 10% |
| **Planning** | Analytical thinking, estimation, risk management | 20% |
| **Execution** | Leadership, communication, problem-solving | 50% |
| **Monitoring** | Data analysis, decision-making, course correction | 15% |
| **Closure** | Documentation, knowledge management, recognition | 5% |

## Key Takeaways

- All projects move through five phases: Initiation, Planning, Execution, Monitoring/Controlling, and Closure
- Each phase has distinct objectives, activities, and deliverables
- Monitoring and controlling runs parallel to execution
- Phase gates ensure readiness before proceeding
- Different methodologies adapt these phases differently
- Skipping closure loses valuable lessons and leaves loose ends
- Your PM skills and focus shift as the project progresses through phases

In the next lesson, we'll explore stakeholder identification and management—one of the most critical PM skills.`
  },
  {
    levelId: 1,
    lessonNumber: 7,
    title: "Stakeholder Identification & Management",
    estimatedMinutes: 30,
    content: `# Stakeholder Identification & Management

Projects don't fail because of bad technology or poor processes—they fail because of people. Specifically, they fail when stakeholders aren't properly identified, engaged, and managed. Let's master this critical skill.

## Who Are Stakeholders?

**Definition:** Anyone who can affect or be affected by the project.

**Categories:**

### Internal Stakeholders
- **Project sponsor** - Provides funding and high-level direction
- **Project team** - Does the actual work
- **Functional managers** - Provide resources to your project
- **Other departments** - Affected by or dependent on your project
- **Executive leadership** - Strategic oversight

### External Stakeholders
- **Customers/end users** - Will use the deliverable
- **Vendors/suppliers** - Provide goods or services
- **Regulatory bodies** - Impose requirements and constraints
- **Partners** - Collaborate on delivery
- **Community** - Affected by project outcomes

**Important:** Don't assume you know all stakeholders. Actively identify them.

## Stakeholder Identification Process

### Step 1: Brainstorm Potential Stakeholders

Ask these questions:
- Who will use the project deliverable?
- Who will be affected by the project?
- Who has authority over resources you need?
- Who controls the budget?
- Who can block or derail the project?
- Who has expertise you need?
- Who will maintain the deliverable after launch?

**Technique:** Create a mind map starting with your project in the center, branching out to departments, roles, and individuals.

### Step 2: Document in Stakeholder Register

Create a comprehensive list with:
- Name and role
- Department/organization
- Contact information
- Interest in project
- Influence level
- Requirements and expectations
- Potential impact (positive or negative)

**Example entry:**

| Field | Details |
|-------|---------|
| **Name** | Dr. Sarah Chen |
| **Role** | Chief Medical Officer |
| **Department** | Clinical Operations |
| **Interest** | High - wants to improve patient experience |
| **Influence** | High - can approve or block project |
| **Requirements** | System must integrate with electronic health records |
| **Expectations** | Reduce appointment booking time by 50% |
| **Attitude** | Supportive but concerned about staff training |

### Step 3: Analyze Stakeholder Power and Interest

Use a **Power/Interest Grid** to prioritize engagement:

**Power/Interest Grid:**

- **High Power, High Interest:** MANAGE CLOSELY (engage deeply, involve in decisions)
- **High Power, Low Interest:** KEEP SATISFIED (inform of major milestones)
- **Low Power, High Interest:** KEEP INFORMED (regular communication, gather feedback)
- **Low Power, Low Interest:** MONITOR (general updates only)

**Manage Closely (High Power, High Interest):**
- Project sponsor
- Key executives
- Major customers
- **Strategy:** Engage deeply, involve in decisions, regular updates

**Keep Satisfied (High Power, Low Interest):**
- Senior leadership not directly involved
- Regulatory bodies
- **Strategy:** Keep informed of major milestones, don't overwhelm with details

**Keep Informed (Low Power, High Interest):**
- End users
- Team members
- Affected departments
- **Strategy:** Regular communication, gather feedback, manage expectations

**Monitor (Low Power, Low Interest):**
- Peripheral departments
- Indirect users
- **Strategy:** General updates, don't over-communicate

**Example - Hospital Patient Portal Project:**

**Manage Closely:**
- Chief Medical Officer (sponsor)
- IT Director (provides resources)
- Patient Experience Manager (key user)

**Keep Satisfied:**
- CEO (cares about results, not details)
- Legal/Compliance (must approve, but not day-to-day involved)

**Keep Informed:**
- Doctors and nurses (will use system)
- Patients (end users)
- Administrative staff (affected workflows)

**Monitor:**
- Facilities department (minimal impact)
- HR (aware but not involved)

## Stakeholder Engagement Strategies

### Understanding Stakeholder Attitudes

Stakeholders fall on a spectrum:

**Unaware** → **Resistant** → **Neutral** → **Supportive** → **Leading**

Your goal: Move everyone toward Supportive or Leading.

**Tactics by attitude:**

| Attitude | Characteristics | Engagement Approach |
|----------|----------------|---------------------|
| **Unaware** | Doesn't know about project | Inform about project and benefits |
| **Resistant** | Opposes project | Understand concerns, address root issues, involve in solutions |
| **Neutral** | Indifferent | Show relevance and value to them personally |
| **Supportive** | Favors project | Leverage as champions, ask for help influencing others |
| **Leading** | Actively promoting | Empower as advocates, involve in key decisions |

### Dealing with Resistant Stakeholders

**Common reasons for resistance:**
- Fear of change
- Perceived threat to their role/power
- Bad experience with past projects
- Lack of understanding
- Legitimate concerns about feasibility

**Strategies:**

**1. Listen First**
- Schedule one-on-one meeting
- Ask open-ended questions
- Understand their perspective
- Don't defend or argue

**Example questions:**
- "What concerns do you have about this project?"
- "How do you think this will affect your team?"
- "What would make this project successful from your perspective?"

**2. Find Common Ground**
- Identify shared goals
- Show how project aligns with their objectives
- Reframe project benefits in their terms

**Example:** "I understand you're concerned about staff training time. What if we phased the rollout so your team can learn gradually, and we provide on-site support during the transition?"

**3. Involve Them**
- Give them a role or responsibility
- Ask for their input on decisions
- Make them part of the solution

**Principle:** People support what they help create.

**4. Address Concerns Transparently**
- Don't dismiss or minimize their worries
- If concerns are valid, acknowledge and adjust plans
- If concerns are based on misunderstanding, educate

**5. Leverage Influence Networks**
- Identify who they trust and respect
- Ask supportive stakeholders to help influence them
- Use your sponsor's authority when needed

### Communication Planning

Different stakeholders need different information at different frequencies.

**Communication Matrix Example:**

| Stakeholder | Information Needed | Format | Frequency | Owner |
|-------------|-------------------|--------|-----------|-------|
| **Sponsor** | Progress, risks, decisions needed | Email summary + monthly meeting | Weekly email, monthly meeting | PM |
| **Steering Committee** | Status, major issues, budget | Dashboard + presentation | Monthly | PM |
| **Project Team** | Tasks, blockers, updates | Standup + Slack | Daily standup, ongoing Slack | PM/Scrum Master |
| **End Users** | Features, training, go-live date | Newsletter + training sessions | Bi-weekly | PM/Product Owner |
| **Executives** | Business impact, ROI, major risks | Executive summary | Quarterly | Sponsor |

**Golden rule:** Tailor your message to your audience.

**For executives:**
- High-level summary
- Business impact
- Major risks and decisions
- What you need from them

**For team members:**
- Detailed task information
- Technical context
- Blockers and dependencies
- Recognition of progress

**For end users:**
- How it affects them
- What's changing
- Training and support available
- When to expect changes

## Managing Stakeholder Expectations

**Expectation management** is preventing surprises and ensuring stakeholders have realistic views of what will be delivered.

### Setting Expectations Early

**During initiation:**
- Clearly define scope (what's included and excluded)
- Establish realistic timelines
- Communicate constraints and limitations
- Discuss trade-offs (scope vs. time vs. cost)

**Example - Bad:**
"We'll build a patient portal with all the features you want."

**Example - Good:**
"For the initial release, we'll focus on appointment booking and prescription refills. Advanced features like secure messaging and medical records access will come in phase 2, based on user feedback and budget availability."

### Managing Scope Creep

**Scope creep:** Uncontrolled expansion of project scope without adjustments to time, cost, and resources.

**How it happens:**
- Stakeholder: "While you're at it, can you also add...?"
- Team: "Sure, that's easy." (It never is.)

**How to prevent:**
1. **Document scope clearly** - Written, approved scope statement
2. **Establish change control process** - All changes go through formal review
3. **Say "yes, and"** - "Yes, we can add that, and it will require 2 additional weeks and £10,000. Should we proceed?"
4. **Offer alternatives** - "We can't add that to this release, but let's include it in the backlog for phase 2."

**Script for handling scope creep:**
"That's a great idea. Let me assess the impact on our timeline and budget, and I'll come back to you with options. We might need to remove something else or extend the deadline to accommodate this."

### Delivering Bad News

Projects rarely go perfectly. You'll need to deliver bad news sometimes.

**How to do it effectively:**

**1. Don't delay** - Bad news doesn't age well
**2. Be direct** - Don't bury the lead
**3. Provide context** - Explain what happened and why
**4. Offer solutions** - Present options for moving forward
**5. Take responsibility** - Don't blame others

**Example:**
"I need to update you on the project timeline. We've encountered integration issues with the EHR system that are more complex than anticipated. This will delay our go-live by 3 weeks. We've identified two options: 1) Proceed with the delay and ensure full integration, or 2) Launch on schedule with manual workarounds and integrate fully in a follow-up release. I recommend option 1 to avoid user frustration. What are your thoughts?"

## Stakeholder Success Stories

**Case 1: Turning a Critic into a Champion**

**Situation:** Department head publicly criticized project in leadership meeting.

**Action:**
- PM scheduled one-on-one meeting
- Listened to concerns without defending
- Discovered legitimate worry about staff workload
- Involved department head in solution design
- Adjusted rollout plan to address concerns

**Result:** Department head became vocal supporter and helped drive adoption.

**Lesson:** Resistance often masks legitimate concerns. Listen first.

**Case 2: Managing Competing Stakeholder Priorities**

**Situation:** Marketing wanted rich features, IT wanted simple architecture, Finance wanted low cost.

**Action:**
- PM facilitated joint workshop
- Used MoSCoW prioritization together
- Created phased roadmap satisfying all parties
- Established governance process for future decisions

**Result:** Aligned stakeholders, clear priorities, successful delivery.

**Lesson:** Bring conflicting stakeholders together to find shared solutions.

## Key Takeaways

- Stakeholders are anyone who can affect or be affected by your project
- Use Power/Interest Grid to prioritize engagement efforts
- Understand stakeholder attitudes and tailor your approach accordingly
- Resistant stakeholders often have legitimate concerns—listen and involve them
- Different stakeholders need different information at different frequencies
- Manage expectations early and continuously
- Prevent scope creep with clear documentation and change control
- Deliver bad news quickly, directly, and with solutions
- Great stakeholder management is the difference between project success and failure

In the next lesson, we'll explore project scope and requirements—the foundation of what you're actually building.`
  },
  {
    levelId: 1,
    lessonNumber: 8,
    title: "Project Scope & Requirements",
    estimatedMinutes: 30,
    content: `# Project Scope & Requirements

Scope defines the boundaries of your project—what's included, what's excluded, and what success looks like. Get this wrong, and everything else falls apart. Let's master scope definition and requirements gathering.

## What is Project Scope?

**Project scope:** The work that must be done to deliver a product, service, or result with specified features and functions.

**Two types of scope:**

### 1. Product Scope
- Features and functions of the deliverable
- What the product/service will do
- Measured against product requirements

**Example:** Patient portal must allow users to book appointments, view test results, and refill prescriptions.

### 2. Project Scope
- Work required to deliver the product
- Activities, tasks, and processes
- Measured against the project plan

**Example:** To deliver the patient portal, we must gather requirements, design UI, develop software, integrate with EHR, test, train users, and deploy.

**Critical distinction:** Product scope = WHAT you're building. Project scope = HOW you'll build it.

## The Scope Statement

A comprehensive scope statement includes:

### 1. Project Objectives
What the project will achieve.

**Example:**
"Implement an online patient portal to reduce administrative burden on staff, improve patient access to care, and increase patient satisfaction scores by 20% within 6 months of launch."

### 2. Deliverables
Tangible outputs the project will produce.

**Example:**
- Web-based patient portal application
- Mobile-responsive design
- Integration with existing EHR system
- User training materials
- Technical documentation
- Support runbook

### 3. Acceptance Criteria
How you'll know each deliverable is complete and acceptable.

**Example - Patient Portal:**
- ✓ Users can create accounts and log in securely
- ✓ Users can book available appointment slots
- ✓ Confirmation emails sent within 5 minutes
- ✓ System handles 100 concurrent users without performance degradation
- ✓ Complies with HIPAA security requirements
- ✓ 95% of users can complete booking without assistance

### 4. Exclusions
What's explicitly NOT included (prevents scope creep).

**Example:**
- Telemedicine video consultations (future phase)
- Integration with third-party pharmacy systems (future phase)
- Mobile native apps (web-responsive only for now)
- Patient-to-patient messaging
- Integration with wearable devices

**Why exclusions matter:** Prevents "I thought that was included" conversations later.

### 5. Constraints
Limitations you must work within.

**Example:**
- Must launch before end of fiscal year (6 months)
- Budget capped at £150,000
- Must use existing hosting infrastructure
- Cannot require patients to download apps
- Must work on Internet Explorer 11 (hospital policy)

### 6. Assumptions
Things you're assuming to be true (document so you can validate).

**Example:**
- EHR vendor will provide API access within 2 weeks
- 10,000 patients will register in first 3 months
- Existing staff can provide 20 hours/week for testing
- Current server capacity is sufficient
- Patients have basic computer literacy

**Risk:** If assumptions prove false, scope/timeline/budget may need adjustment.

## Requirements Gathering

Requirements are specific, measurable statements of what the deliverable must do.

### Types of Requirements

**1. Business Requirements**
High-level needs of the organization.

**Example:** "Reduce appointment no-shows by 15%"

**2. Stakeholder Requirements**
Needs of specific stakeholder groups.

**Example:** "Doctors need to see patient-entered symptoms before appointments"

**3. Functional Requirements**
What the system must do.

**Example:**
- System shall send email confirmation when appointment is booked
- System shall display available time slots in 15-minute increments
- System shall prevent double-booking of appointment slots

**4. Non-Functional Requirements**
How the system must perform.

**Example:**
- System shall load pages within 2 seconds
- System shall be available 99.9% of the time
- System shall support 500 concurrent users
- System shall comply with WCAG 2.1 accessibility standards

**5. Technical Requirements**
Technology constraints and specifications.

**Example:**
- Must integrate with Epic EHR via HL7 FHIR API
- Must use TLS 1.3 encryption
- Must run on AWS infrastructure
- Must support Chrome, Firefox, Safari, Edge browsers

### Requirements Gathering Techniques

**1. Interviews**
One-on-one conversations with stakeholders.

**Best for:** Understanding individual needs and concerns.

**Tips:**
- Prepare questions in advance
- Ask open-ended questions ("Tell me about..." not "Do you need...?")
- Listen more than you talk
- Document and confirm understanding

**Sample questions:**
- "Walk me through your current process for booking appointments."
- "What frustrates you most about the current system?"
- "What would make your job easier?"
- "What does success look like to you?"

**2. Workshops**
Facilitated group sessions with multiple stakeholders.

**Best for:** Building consensus and resolving conflicts.

**Tips:**
- Invite the right mix of people
- Set clear agenda and objectives
- Use visual aids (whiteboards, sticky notes)
- Capture decisions and action items
- Follow up with summary

**3. Observation**
Watch users perform current processes.

**Best for:** Understanding actual behavior (not just what people say they do).

**Tips:**
- Don't interrupt or influence
- Take notes on pain points and workarounds
- Ask clarifying questions after observation
- Look for inefficiencies and frustrations

**4. Surveys and Questionnaires**
Structured questions to gather input from many people.

**Best for:** Collecting quantitative data and reaching large groups.

**Tips:**
- Keep it short (10 minutes max)
- Mix question types (multiple choice, rating scales, open-ended)
- Test with a small group first
- Offer incentive for completion

**5. Document Analysis**
Review existing documentation, processes, and systems.

**Best for:** Understanding current state and constraints.

**Examples:**
- Current system documentation
- Process flowcharts
- Regulatory requirements
- Existing contracts
- Competitor analysis

**6. Prototyping**
Create mockups or working models to gather feedback.

**Best for:** Clarifying vague requirements and visualizing solutions.

**Tips:**
- Start with low-fidelity (sketches, wireframes)
- Iterate based on feedback
- Don't over-invest before validation
- Make it clear it's a prototype, not final

### Writing Good Requirements

**Characteristics of good requirements (SMART):**

- **S**pecific - Clear and unambiguous
- **M**easurable - Can verify if it's met
- **A**chievable - Technically feasible
- **R**elevant - Supports project objectives
- **T**estable - Can be validated

**Bad requirement:**
"The system should be fast."

**Why it's bad:** Vague, not measurable, not testable.

**Good requirement:**
"The system shall load the appointment booking page within 2 seconds for 95% of requests under normal load conditions."

**Why it's good:** Specific, measurable, testable.

**More examples:**

| Bad | Good |
|-----|------|
| "Easy to use" | "90% of users can book an appointment without assistance within 5 minutes" |
| "Secure" | "System shall enforce password complexity requirements: minimum 12 characters, including uppercase, lowercase, number, and special character" |
| "Looks professional" | "Design shall follow hospital brand guidelines (colors: #003366, #00A3E0; font: Open Sans)" |
| "Works well" | "System shall maintain 99.9% uptime during business hours (8am-6pm)" |

## Requirements Documentation

### Requirements Traceability Matrix (RTM)

Links requirements to deliverables and test cases.

**Example:**

| Req ID | Requirement | Source | Priority | Design Ref | Test Case | Status |
|--------|-------------|--------|----------|------------|-----------|--------|
| REQ-001 | User can book appointments | Patient survey | Must Have | UI-003 | TC-015 | Complete |
| REQ-002 | Email confirmation sent | Stakeholder workshop | Must Have | SYS-007 | TC-022 | In Progress |
| REQ-003 | SMS reminders 24h before | Patient survey | Should Have | SYS-008 | TC-023 | Not Started |

**Benefits:**
- Ensures all requirements are addressed
- Tracks requirement status
- Supports impact analysis for changes
- Facilitates testing

### User Stories (Agile)

In Agile projects, requirements are often captured as user stories.

**Format:**
"As a [user type], I want [goal] so that [benefit]."

**Example:**
"As a patient, I want to receive SMS appointment reminders so that I don't forget my appointments."

**Acceptance criteria:**
- Given I have an appointment scheduled, when it's 24 hours before the appointment, then I receive an SMS reminder
- Given I've opted out of SMS, when an appointment is scheduled, then I do not receive SMS reminders
- Given the SMS fails to send, when the system detects failure, then it logs an error and alerts support

## Scope Validation and Control

### Scope Validation
Process of gaining formal acceptance of deliverables.

**Steps:**
1. Complete deliverable according to requirements
2. Internal review and quality check
3. Present to stakeholders
4. Stakeholders review against acceptance criteria
5. Stakeholders formally accept or request changes
6. Document acceptance

**Tip:** Get acceptance in writing (email, sign-off form, etc.).

### Scope Control
Process of monitoring scope and managing changes.

**Scope creep:** Uncontrolled expansion of scope.

**How it happens:**
- "Just one more small feature..."
- "While you're at it, can you also...?"
- "I thought that was included..."

**Prevention strategies:**

**1. Clear documentation**
- Detailed scope statement
- Explicit exclusions
- Signed approval

**2. Change control process**
- All changes require formal request
- Impact analysis (time, cost, risk)
- Approval from sponsor/steering committee
- Update all project documents

**3. Regular scope reviews**
- Weekly team check: "Are we working on in-scope items?"
- Monthly stakeholder review: "Is the scope still aligned with objectives?"

**4. Educate stakeholders**
- Explain triple constraint
- Show impact of changes
- Offer alternatives (future phases, reduced scope elsewhere)

**Change request template example:**

- **Change Request #:** CR-015
- **Requested by:** Dr. Sarah Chen
- **Date:** 15 Jan 2026
- **Description:** Add ability for patients to upload photos of symptoms before appointments
- **Business Justification:** Would help doctors prepare for appointments and reduce diagnosis time
- **Impact Analysis:**
  - Time: +2 weeks (design, development, testing)
  - Cost: +£8,000 (development, storage infrastructure)
  - Risk: Medium (security/privacy concerns with medical images)
  - Dependencies: Requires additional HIPAA compliance review
- **Recommendation:** Defer to Phase 2. Current scope already tight, and this feature requires significant security work. Can be added after core functionality is stable.
- **Approval:** Approved - Defer to Phase 2

## Common Scope Pitfalls

**1. Gold plating**
Adding extra features not in requirements because you think they're cool.

**Problem:** Wastes time and budget on unvalidated features.

**Solution:** Stick to requirements. If you have a great idea, propose it as a change request.

**2. Scope creep**
Gradual, uncontrolled expansion of scope.

**Problem:** Project never finishes, budget overruns, team burnout.

**Solution:** Formal change control process.

**3. Vague requirements**
Ambiguous statements that mean different things to different people.

**Problem:** Build the wrong thing, rework, stakeholder dissatisfaction.

**Solution:** SMART requirements, prototypes, frequent validation.

**4. Missing stakeholders**
Not identifying all affected parties during requirements gathering.

**Problem:** Late-stage requirements emerge, causing rework.

**Solution:** Thorough stakeholder analysis, broad outreach.

## Key Takeaways

- Scope defines what's included AND what's excluded from your project
- Product scope = what you're building; Project scope = how you'll build it
- Requirements must be specific, measurable, achievable, relevant, and testable
- Use multiple techniques to gather requirements (interviews, workshops, observation)
- Document requirements clearly and maintain traceability
- Scope validation ensures deliverables meet acceptance criteria
- Scope control prevents scope creep through formal change management
- Clear scope documentation prevents misunderstandings and manages expectations

In the next lesson, we'll explore communication in project management—the skill that ties everything together.`
  }
];

// Insert lessons
for (const lesson of level1LessonsPart2) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Inserted lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('\n✅ Level 1 lessons (6-8) seeded successfully!');

await connection.end();
