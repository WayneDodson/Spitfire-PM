import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('Seeding Level 7 lessons (all 12)...');

const level7Lessons = [
  {
    levelId: 7,
    lessonNumber: 1,
    title: 'Integration of PM Methodologies',
    content: `# Integration of PM Methodologies

## Welcome to Level 7

Congratulations on reaching the final level! Level 7 synthesizes everything you've learned across Levels 1-6, preparing you for real-world PM challenges and professional certification.

## Choosing the Right Methodology

Project managers must select methodologies based on project characteristics:

### When to Use Waterfall

**Best for:**
- Fixed scope and requirements
- Regulatory or compliance-heavy projects
- Construction, manufacturing, hardware development
- Projects with clear deliverables and minimal expected changes

**Example:** Building a hospital wing requires detailed upfront planning, regulatory approvals, and sequential phases.

### When to Use Agile

**Best for:**
- Evolving requirements
- Software development and digital products
- Projects requiring frequent stakeholder feedback
- Innovation and experimentation

**Example:** Developing a mobile app where user feedback shapes features iteratively.

### Hybrid Approaches

Many modern projects blend methodologies:

| Hybrid Model | Description | Use Case |
|---|---|---|
| **Water-Scrum-Fall** | Waterfall planning, Agile execution, Waterfall deployment | Large enterprises with governance requirements |
| **Agile-Stage-Gate** | Agile sprints within stage-gate phases | Product development with funding gates |
| **Scrumban** | Scrum framework + Kanban flow | Support teams with mixed work types |

## Tailoring Methodologies

Adapt frameworks to your context:

**Considerations:**
- Organizational culture and maturity
- Team size and distribution
- Stakeholder preferences
- Industry regulations
- Project complexity and risk

**Practical Example:**

A financial services company launching a new digital banking feature might use:
- Waterfall for compliance and security reviews
- Agile for UI/UX development
- Kanban for ongoing maintenance

## Key Takeaways

- No single methodology fits all projects
- Understand the strengths and limitations of each approach
- Tailor frameworks to organizational and project needs
- Focus on delivering value, not following processes rigidly
- Continuous improvement applies to your methodology choice
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 2,
    title: 'Advanced Risk Management',
    content: `# Advanced Risk Management

## Beyond Basic Risk Identification

Level 7 risk management goes deeper than simple risk registers, incorporating quantitative analysis and strategic risk responses.

## Quantitative Risk Analysis

### Monte Carlo Simulation

Use statistical modeling to predict project outcomes:

**Steps:**
1. Identify key variables (duration, cost, resource availability)
2. Define probability distributions for each variable
3. Run thousands of simulations
4. Analyze results to determine confidence levels

**Example Output:**
- 70% confidence project completes in 8-10 months
- 90% confidence project costs £450K-£550K

### Expected Monetary Value (EMV)

Calculate risk impact using probability and cost:

**Formula:** EMV = Probability × Impact

| Risk | Probability | Impact | EMV |
|---|---|---|---|
| Vendor delay | 30% | £50,000 | £15,000 |
| Scope creep | 50% | £30,000 | £15,000 |
| Key resource leaves | 15% | £80,000 | £12,000 |

**Total Risk Exposure:** £42,000

## Advanced Risk Response Strategies

### Risk Transfer

**Insurance:** Purchase policies for major risks
**Contracts:** Use fixed-price contracts to transfer cost risk
**Outsourcing:** Transfer technical risk to specialists

### Risk Acceptance

When mitigation costs exceed impact, accept the risk:

**Active Acceptance:** Allocate contingency reserves
**Passive Acceptance:** Acknowledge risk but take no action

### Risk Exploitation (Opportunities)

Turn positive risks into advantages:

**Example:** Early vendor delivery allows earlier product launch, capturing market share.

## Risk Governance

Establish clear risk ownership and escalation:

**Risk Owner:** Accountable for monitoring and response
**Risk Action Owner:** Executes mitigation activities
**Escalation Triggers:** Define when risks escalate to senior leadership

## Emerging Risks

Stay ahead of modern project risks:

- **Cybersecurity threats:** Data breaches, ransomware
- **Supply chain disruptions:** Global dependencies
- **Regulatory changes:** Compliance requirements
- **Talent shortages:** Specialized skills unavailable

## Key Takeaways

- Quantitative analysis provides confidence levels for decisions
- Match risk response strategy to risk characteristics
- Establish clear ownership and governance
- Monitor emerging risks continuously
- Balance risk management effort with project value
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 3,
    title: 'Portfolio and Program Management',
    content: `# Portfolio and Program Management

## From Projects to Programs to Portfolios

Understanding the hierarchy helps you see the bigger picture.

## Definitions

### Project
Temporary endeavor with a defined beginning and end, creating a unique product or service.

**Example:** Implementing a new CRM system

### Program
Group of related projects managed together to achieve strategic benefits.

**Example:** Digital transformation program including CRM, website redesign, and mobile app projects

### Portfolio
Collection of programs and projects aligned with organizational strategy.

**Example:** All IT initiatives across the organization

## Program Management

### Benefits Realization

Programs focus on delivering business benefits, not just project outputs:

**Project Output:** CRM system deployed
**Program Benefit:** 20% increase in customer retention

### Program Governance

Establish oversight structure:

| Role | Responsibility |
|---|---|
| **Program Sponsor** | Provides funding and strategic direction |
| **Program Manager** | Coordinates projects and delivers benefits |
| **Program Board** | Reviews progress and makes decisions |
| **Project Managers** | Deliver individual project outputs |

### Managing Dependencies

Programs manage complex interdependencies:

**Example:** Mobile app project depends on API project completion; both depend on infrastructure project.

## Portfolio Management

### Strategic Alignment

Ensure projects support organizational goals:

**Portfolio Prioritization Criteria:**
- Strategic fit (does it support our vision?)
- Financial return (ROI, NPV, payback period)
- Risk level (technical, market, execution)
- Resource availability (do we have capacity?)

### Portfolio Balancing

Optimize the mix of projects:

**Balance Dimensions:**
- Risk vs. reward
- Short-term vs. long-term value
- Innovation vs. operations
- Internal vs. customer-facing

### Resource Optimization

Allocate scarce resources across competing projects:

**Techniques:**
- Capacity planning
- Resource leveling
- Skills matrix mapping
- Prioritization frameworks

## Practical Example

**Scenario:** Tech company with 15 active projects, limited developers

**Portfolio Actions:**
1. Pause 3 low-priority projects
2. Accelerate 2 strategic initiatives
3. Consolidate 4 similar projects into one program
4. Allocate freed resources to high-value work

**Result:** Improved delivery speed, better strategic alignment, reduced context switching

## Key Takeaways

- Programs deliver benefits; projects deliver outputs
- Portfolio management aligns work with strategy
- Manage dependencies across related projects
- Balance portfolio for optimal value
- Resource optimization is critical at portfolio level
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 4,
    title: 'Organizational Change Management',
    content: `# Organizational Change Management

## Why Projects Fail: The People Factor

Technical success doesn't guarantee project success. Change management addresses the human side of projects.

## Change Management Fundamentals

### Resistance to Change

**Common Sources:**
- Fear of the unknown
- Loss of control or status
- Increased workload
- Past negative experiences
- Lack of trust in leadership

**Example:** New ERP system threatens finance team's expertise and job security.

### Change Curve (Kübler-Ross)

People move through predictable stages:

1. **Denial:** "This won't affect me"
2. **Resistance:** "I don't want this"
3. **Exploration:** "Maybe this could work"
4. **Commitment:** "I'm on board"

**PM Role:** Help stakeholders progress through stages faster.

## Change Management Models

### ADKAR Model

Five building blocks for successful change:

| Element | Focus | PM Action |
|---|---|---|
| **Awareness** | Why change is needed | Communicate business case |
| **Desire** | Personal motivation | Address WIIFM (What's In It For Me) |
| **Knowledge** | How to change | Provide training |
| **Ability** | Skills to implement | Coaching and support |
| **Reinforcement** | Sustaining change | Recognition and rewards |

### Kotter's 8-Step Process

1. Create urgency
2. Build guiding coalition
3. Form strategic vision
4. Enlist volunteer army
5. Enable action by removing barriers
6. Generate short-term wins
7. Sustain acceleration
8. Institute change

## Stakeholder Engagement for Change

### Change Champions

Identify and empower advocates:

**Characteristics:**
- Respected by peers
- Enthusiastic about change
- Good communicators
- Willing to invest time

**Role:** Influence colleagues, provide feedback, model desired behaviors

### Communication Strategy

Tailor messages to stakeholder needs:

| Stakeholder Group | Key Message | Channel |
|---|---|---|
| **Executives** | Strategic value, ROI | Executive briefings |
| **Managers** | Impact on teams, support needed | Workshops |
| **End Users** | Benefits, training availability | Email, videos, FAQs |

## Managing Resistance

### Techniques

**Listen actively:** Understand concerns without defensiveness
**Involve resisters:** Give them a role in shaping the solution
**Address root causes:** Don't dismiss concerns as "resistance to change"
**Provide choices:** Allow customization within boundaries
**Celebrate early adopters:** Make visible examples of success

### When Resistance Persists

**Escalation Path:**
1. One-on-one coaching
2. Manager involvement
3. Formal performance management
4. Role reassignment (last resort)

## Measuring Change Adoption

Track adoption metrics:

- **Usage rates:** Are people using the new system/process?
- **Proficiency:** Are they using it correctly?
- **Satisfaction:** Do they see value?
- **Business outcomes:** Are we achieving benefits?

## Key Takeaways

- Change management is not optional for project success
- Understand and address emotional responses to change
- Use proven models (ADKAR, Kotter) as frameworks
- Engage champions and communicate relentlessly
- Measure adoption, not just deployment
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 5,
    title: 'Agile at Scale',
    content: `# Agile at Scale

## Scaling Agile Beyond Small Teams

Agile works well for small teams, but large organizations need frameworks to coordinate multiple teams.

## Challenges of Scaling Agile

**Common Issues:**
- Coordinating 10+ teams
- Maintaining architectural coherence
- Aligning with organizational governance
- Managing dependencies across teams
- Balancing autonomy with alignment

## Scaling Frameworks

### SAFe (Scaled Agile Framework)

Most widely adopted enterprise framework.

**Levels:**
- **Team Level:** Scrum/Kanban teams
- **Program Level:** Agile Release Trains (ARTs) coordinate 5-12 teams
- **Portfolio Level:** Strategic themes and funding

**Key Ceremonies:**
- **PI Planning:** Quarterly planning event for entire ART
- **Scrum of Scrums:** Daily coordination across teams
- **System Demo:** Integrated solution demo every 2 weeks

**When to Use:** Large enterprises with 50+ teams, need for governance

### LeSS (Large-Scale Scrum)

Minimalist approach extending Scrum principles.

**Core Principles:**
- One Product Owner for entire product
- One Product Backlog
- One Definition of Done
- Sprint Planning together, then team-specific refinement

**When to Use:** 2-8 teams, product-focused organizations

### Spotify Model

Flexible, tribe-based structure.

**Structure:**
- **Squads:** Cross-functional teams (like Scrum teams)
- **Tribes:** Collection of squads working on related areas
- **Chapters:** People with similar skills across squads
- **Guilds:** Communities of interest across tribes

**When to Use:** Innovative cultures, need for autonomy

## Practical Implementation

### Starting Small

Don't scale prematurely:

1. Master Agile with 1-2 teams first
2. Add teams gradually
3. Introduce coordination mechanisms as needed
4. Avoid "big bang" transformations

### Dependency Management

**Techniques:**
- **Architectural Decoupling:** Reduce technical dependencies
- **Team Topologies:** Organize teams to minimize handoffs
- **Integration Cadence:** Regular integration points
- **Dependency Boards:** Visualize and manage dependencies

### Maintaining Agility

**Avoid Common Pitfalls:**
- Don't add unnecessary bureaucracy
- Keep ceremonies time-boxed
- Empower teams to make decisions
- Focus on outcomes, not process compliance

## Case Study: Large Bank Agile Transformation

**Challenge:** 200+ teams, waterfall culture, 18-month release cycles

**Approach:**
1. Pilot with 3 teams (6 months)
2. Expand to 20 teams using SAFe (12 months)
3. Scale to 100+ teams (24 months)

**Results:**
- Release cycle reduced to 2 weeks
- Customer satisfaction increased 40%
- Employee engagement improved
- Time-to-market for features reduced by 70%

**Lessons Learned:**
- Executive sponsorship critical
- Invest heavily in training
- Change management as important as process
- Continuous improvement mindset required

## Key Takeaways

- Scaling Agile requires frameworks (SAFe, LeSS, Spotify)
- Start small and scale gradually
- Manage dependencies through architecture and coordination
- Maintain agility while adding structure
- Culture change is harder than process change
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 6,
    title: 'Earned Value Management (EVM)',
    content: `# Earned Value Management (EVM)

## Integrating Scope, Schedule, and Cost

EVM provides objective project performance measurement by comparing planned work, completed work, and actual costs.

## Core EVM Concepts

### The Three Key Metrics

| Metric | Abbreviation | Definition |
|---|---|---|
| **Planned Value** | PV | Budgeted cost of work scheduled |
| **Earned Value** | EV | Budgeted cost of work performed |
| **Actual Cost** | AC | Actual cost of work performed |

### Variance Analysis

**Schedule Variance (SV):** EV - PV
- Positive SV = ahead of schedule
- Negative SV = behind schedule

**Cost Variance (CV):** EV - AC
- Positive CV = under budget
- Negative CV = over budget

### Performance Indices

**Schedule Performance Index (SPI):** EV / PV
- SPI > 1.0 = ahead of schedule
- SPI < 1.0 = behind schedule

**Cost Performance Index (CPI):** EV / AC
- CPI > 1.0 = under budget
- CPI < 1.0 = over budget

## Practical Example

**Project:** Website redesign, £100,000 budget, 10 weeks

**Week 5 Status:**
- **PV:** £50,000 (50% of work should be done)
- **EV:** £40,000 (40% of work actually done)
- **AC:** £55,000 (actual spending)

**Analysis:**
- **SV:** £40K - £50K = -£10K (behind schedule)
- **CV:** £40K - £55K = -£15K (over budget)
- **SPI:** £40K / £50K = 0.80 (completing work at 80% planned rate)
- **CPI:** £40K / £55K = 0.73 (spending £1.37 for every £1 of value)

**Interpretation:** Project is behind schedule and over budget. If trends continue, expect significant overruns.

## Forecasting with EVM

### Estimate at Completion (EAC)

Predict final project cost:

**Formula (assuming current performance continues):**
EAC = BAC / CPI

**Example:**
- Budget at Completion (BAC): £100,000
- CPI: 0.73
- EAC: £100,000 / 0.73 = £137,000

**Forecast:** Project will cost £37,000 more than budgeted.

### Estimate to Complete (ETC)

How much more will we spend?

**Formula:** ETC = EAC - AC

**Example:** ETC = £137,000 - £55,000 = £82,000

### Variance at Completion (VAC)

Final budget variance:

**Formula:** VAC = BAC - EAC

**Example:** VAC = £100,000 - £137,000 = -£37,000 (over budget)

## Using EVM for Decision-Making

### Red Flags

**Immediate attention needed when:**
- CPI < 0.90 (spending £1.11 for every £1 of value)
- SPI < 0.90 (completing work at 90% of planned rate)
- Negative trends over 2-3 reporting periods

### Corrective Actions

**For cost overruns (low CPI):**
- Reduce scope
- Negotiate lower rates
- Improve efficiency
- Add resources (if schedule-driven)

**For schedule delays (low SPI):**
- Add resources
- Fast-track activities
- Crash critical path
- Reduce scope

## EVM Limitations

**Challenges:**
- Requires detailed work breakdown and tracking
- Doesn't measure quality or customer satisfaction
- Can be manipulated ("sandbagging" estimates)
- Overhead for small projects

**When to Use EVM:**
- Large, complex projects (£500K+)
- Fixed-price contracts
- Government or regulated projects
- Projects with significant cost/schedule risk

## Key Takeaways

- EVM integrates scope, schedule, and cost into single metrics
- Use SPI and CPI to assess performance objectively
- Forecast final costs using EAC
- Take corrective action when indices fall below 0.90
- EVM is powerful but requires discipline and overhead
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 7,
    title: 'Contract Management and Procurement',
    content: `# Contract Management and Procurement

## Managing External Vendors and Suppliers

Most projects involve external parties. Effective contract management protects your interests and ensures successful delivery.

## Contract Types

### Fixed-Price Contracts

**Definition:** Vendor delivers defined scope for fixed price.

**Advantages:**
- Predictable cost
- Risk transferred to vendor
- Simple administration

**Disadvantages:**
- Scope changes expensive
- Vendor may cut corners
- Requires detailed requirements upfront

**When to Use:** Well-defined scope, low uncertainty

**Example:** Building construction, standard software implementation

### Time and Materials (T&M)

**Definition:** Pay for actual hours worked plus materials.

**Advantages:**
- Flexible scope
- Easy to start quickly
- Good for uncertain requirements

**Disadvantages:**
- Unpredictable cost
- Risk stays with buyer
- Requires close monitoring

**When to Use:** Evolving requirements, exploratory work

**Example:** Software development, consulting

### Cost-Plus Contracts

**Definition:** Reimburse vendor's costs plus fixed fee or percentage.

**Types:**
- **Cost-Plus-Fixed-Fee (CPFF):** Costs + fixed fee
- **Cost-Plus-Incentive-Fee (CPIF):** Costs + fee based on performance
- **Cost-Plus-Award-Fee (CPAF):** Costs + subjective award fee

**When to Use:** High uncertainty, research projects

## Procurement Process

### 1. Make-or-Buy Analysis

**Decision Factors:**
| Factor | Make (Internal) | Buy (External) |
|---|---|---|
| **Cost** | Lower if have capacity | Lower if specialized |
| **Control** | High | Lower |
| **Expertise** | Must have in-house | Access specialist skills |
| **Risk** | Internal risk | Contractual protection |

### 2. Vendor Selection

**Request for Proposal (RFP) Process:**

1. **Define requirements:** Clear scope, deliverables, timeline
2. **Issue RFP:** Send to qualified vendors
3. **Evaluate proposals:** Score against criteria
4. **Negotiate:** Refine terms with top candidates
5. **Award contract:** Select winning vendor

**Evaluation Criteria:**
- Technical capability (40%)
- Cost (30%)
- Experience and references (20%)
- Cultural fit (10%)

### 3. Contract Negotiation

**Key Terms to Negotiate:**

**Scope and Deliverables:** Be specific, include acceptance criteria
**Payment Terms:** Milestones, holdbacks, incentives
**Intellectual Property:** Who owns work product?
**Warranties:** Performance guarantees
**Liability:** Caps, indemnification
**Termination:** Conditions, notice period, transition

**Example Milestone Payment Schedule:**

| Milestone | Deliverable | Payment |
|---|---|---|
| Contract signing | - | 20% |
| Design approval | Detailed design document | 20% |
| Development complete | Working software | 30% |
| UAT passed | Tested, accepted solution | 20% |
| Go-live + 30 days | Stable production | 10% |

### 4. Contract Administration

**Ongoing Management:**
- Monitor performance against SLAs
- Manage change requests
- Track invoices and payments
- Conduct regular reviews
- Document issues and resolutions

**Change Control:**

All scope changes require:
1. Written change request
2. Impact analysis (cost, schedule, risk)
3. Approval by authorized parties
4. Contract amendment

## Vendor Relationship Management

### Performance Monitoring

**Service Level Agreements (SLAs):**

| Metric | Target | Penalty |
|---|---|---|
| System availability | 99.5% uptime | 5% fee reduction per 0.1% below |
| Response time | < 2 seconds | 2% fee reduction |
| Support response | < 4 hours | £500 per incident |

### Building Partnerships

**Best Practices:**
- Regular communication (weekly calls, monthly reviews)
- Collaborative problem-solving
- Fair treatment on changes
- Recognition of good performance
- Long-term relationship mindset

## Dispute Resolution

**Escalation Path:**
1. **Project Manager discussion:** Resolve at working level
2. **Steering committee:** Escalate to sponsors
3. **Mediation:** Neutral third party facilitates
4. **Arbitration:** Binding decision by arbitrator
5. **Litigation:** Court (last resort, expensive)

## Key Takeaways

- Choose contract type based on scope certainty and risk tolerance
- Conduct thorough vendor selection using RFP process
- Negotiate key terms carefully, especially scope and payment
- Manage contracts actively with SLAs and change control
- Build partnerships, not adversarial relationships
- Have clear dispute resolution process
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 8,
    title: 'Quality Management and Continuous Improvement',
    content: `# Quality Management and Continuous Improvement

## Building Quality In, Not Inspecting It In

Modern quality management focuses on prevention, not detection. Continuous improvement ensures sustained excellence.

## Quality Management Principles

### Quality vs. Grade

**Quality:** Degree to which deliverables meet requirements
**Grade:** Category of features/functionality

**Example:**
- High quality, low grade: Budget airline (meets safety requirements, basic service)
- Low quality, high grade: Luxury car with frequent breakdowns

**PM Focus:** Deliver required quality, appropriate grade

### Cost of Quality

| Category | Definition | Examples |
|---|---|---|
| **Prevention Costs** | Avoiding defects | Training, process design, quality planning |
| **Appraisal Costs** | Finding defects | Testing, inspections, audits |
| **Internal Failure** | Defects before delivery | Rework, scrap, retesting |
| **External Failure** | Defects after delivery | Warranty claims, returns, reputation damage |

**Key Insight:** Investing in prevention and appraisal reduces expensive failure costs.

## Quality Planning

### Define Quality Standards

**Acceptance Criteria Example (Software):**
- All features function per specifications
- No critical or high-priority bugs
- Response time < 2 seconds for 95% of requests
- Passes security scan with no high-risk vulnerabilities
- User acceptance testing completed with 90% satisfaction

### Quality Metrics

**Defect Density:** Defects per unit of work
- Software: Bugs per 1,000 lines of code
- Manufacturing: Defects per 1,000 units

**First-Pass Yield:** Percentage completed correctly first time
- Target: > 95%

**Customer Satisfaction Score (CSAT):** Post-delivery survey
- Target: > 4.0 / 5.0

## Quality Assurance (QA)

**Process-Focused Activities:**

**Audits:** Review compliance with processes
**Process Improvement:** Refine workflows to prevent defects
**Training:** Build team capability
**Standards:** Establish best practices

**Example:** Code review process catches 60% of bugs before testing.

## Quality Control (QC)

**Product-Focused Activities:**

**Inspections:** Examine deliverables
**Testing:** Verify functionality
**Peer Reviews:** Colleague feedback
**Walkthroughs:** Step-by-step validation

**Testing Types:**

| Type | Purpose | When |
|---|---|---|
| **Unit Testing** | Individual components work | During development |
| **Integration Testing** | Components work together | After unit testing |
| **System Testing** | Complete system functions | Before UAT |
| **User Acceptance Testing** | Meets business needs | Before go-live |
| **Regression Testing** | Changes don't break existing features | After changes |

## Continuous Improvement

### Kaizen Philosophy

**Core Principles:**
- Small, incremental changes
- Everyone participates
- Focus on process, not people
- Data-driven decisions
- Continuous, never-ending improvement

### PDCA Cycle (Deming Cycle)

1. **Plan:** Identify improvement opportunity, plan change
2. **Do:** Implement change on small scale
3. **Check:** Measure results, compare to baseline
4. **Act:** If successful, standardize; if not, try different approach

**Example:**

**Problem:** Sprint retrospectives feel unproductive

**Plan:** Try new retrospective format (Start-Stop-Continue)
**Do:** Use new format for 2 sprints
**Check:** Team satisfaction increased from 3.2 to 4.5
**Act:** Adopt new format permanently, share with other teams

### Retrospectives

**Effective Retrospective Structure:**

1. **Set the stage:** Create safe environment
2. **Gather data:** What happened? (facts, not opinions)
3. **Generate insights:** Why did it happen?
4. **Decide what to do:** 1-3 actionable improvements
5. **Close:** Appreciate team, commit to actions

**Key Rules:**
- Blameless culture
- Focus on process, not people
- Actionable outcomes
- Follow through on commitments

## Six Sigma and Lean

### Six Sigma

**Goal:** Reduce variation, achieve 3.4 defects per million opportunities

**DMAIC Process:**
1. **Define:** Problem and goals
2. **Measure:** Current performance
3. **Analyze:** Root causes
4. **Improve:** Implement solutions
5. **Control:** Sustain improvements

**When to Use:** High-volume, repetitive processes with measurable defects

### Lean

**Goal:** Eliminate waste, maximize value

**Seven Wastes:**
1. **Overproduction:** Making more than needed
2. **Waiting:** Idle time
3. **Transportation:** Unnecessary movement of materials
4. **Over-processing:** More work than required
5. **Inventory:** Excess stock
6. **Motion:** Unnecessary movement of people
7. **Defects:** Rework and corrections

**Example:** Reduce handoffs between teams (waste = transportation + waiting)

## Key Takeaways

- Quality is conformance to requirements, not perfection
- Invest in prevention to reduce failure costs
- Use QA (process) and QC (product) together
- Continuous improvement through PDCA and retrospectives
- Six Sigma and Lean provide structured improvement methods
- Create culture where everyone owns quality
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 9,
    title: 'Project Governance and PMO',
    content: `# Project Governance and PMO

## Establishing Oversight and Organizational Capability

Governance provides structure for decision-making and accountability. PMOs build organizational project management maturity.

## Project Governance

### Governance Framework

**Purpose:** Ensure projects align with strategy, manage risk, and deliver value.

**Key Elements:**
- Decision-making authority
- Roles and responsibilities
- Policies and procedures
- Performance monitoring
- Escalation paths

### Governance Structure

| Role | Responsibility | Frequency |
|---|---|---|
| **Project Sponsor** | Funding, strategic direction, issue resolution | Monthly reviews |
| **Steering Committee** | Oversight, major decisions, resource allocation | Monthly meetings |
| **Project Manager** | Day-to-day execution, reporting | Weekly status |
| **Project Team** | Deliverable creation | Daily standups |

### Stage Gates

**Definition:** Decision points where project continuation is evaluated.

**Typical Gates:**

1. **Initiation Gate:** Business case approval
2. **Planning Gate:** Detailed plan approval
3. **Execution Gates:** Phase completion reviews
4. **Closure Gate:** Final acceptance

**Gate Criteria:**
- Deliverables completed per plan
- Budget and schedule on track
- Risks acceptable
- Business case still valid

**Possible Decisions:**
- Proceed to next stage
- Proceed with conditions
- Pause for corrective action
- Cancel project

## Project Management Office (PMO)

### PMO Types

**Supportive PMO**
- **Role:** Provide templates, training, best practices
- **Authority:** Low
- **When to Use:** Decentralized organizations, early PM maturity

**Controlling PMO**
- **Role:** Enforce compliance with standards
- **Authority:** Medium
- **When to Use:** Need for consistency, moderate maturity

**Directive PMO**
- **Role:** Directly manage projects
- **Authority:** High
- **When to Use:** Centralized organizations, high maturity

### PMO Functions

**Portfolio Management:**
- Prioritize projects
- Optimize resource allocation
- Balance portfolio risk and return

**Standards and Methodology:**
- Define PM processes
- Create templates and tools
- Establish quality gates

**Resource Management:**
- Maintain PM competency
- Allocate PMs to projects
- Career development for PMs

**Reporting and Analytics:**
- Consolidated portfolio reporting
- Performance dashboards
- Lessons learned repository

**Training and Mentoring:**
- PM training programs
- Coaching and mentoring
- Community of practice

## Establishing a PMO

### Maturity Assessment

**Level 1 - Ad Hoc:** No standard processes, inconsistent results
**Level 2 - Repeatable:** Basic processes, some consistency
**Level 3 - Defined:** Documented standards, organization-wide
**Level 4 - Managed:** Quantitative metrics, data-driven decisions
**Level 5 - Optimizing:** Continuous improvement, industry-leading

**Assessment Questions:**
- Do we have standard PM methodology?
- Are project success rates measured?
- Do we learn from past projects?
- Are resources allocated strategically?

### Implementation Roadmap

**Phase 1 (Months 1-3): Foundation**
- Secure executive sponsorship
- Define PMO charter and scope
- Hire PMO leader
- Assess current state

**Phase 2 (Months 4-6): Quick Wins**
- Implement project portfolio dashboard
- Create standard templates
- Establish monthly portfolio review
- Pilot with 3-5 projects

**Phase 3 (Months 7-12): Expansion**
- Roll out methodology organization-wide
- Implement resource management
- Launch PM training program
- Build lessons learned database

**Phase 4 (Year 2+): Optimization**
- Advanced analytics and forecasting
- Continuous improvement
- Strategic advisory role
- Industry benchmarking

## Measuring PMO Value

### PMO Metrics

| Metric | Target | Measurement |
|---|---|---|
| **Project Success Rate** | > 80% | % on time, on budget, meeting objectives |
| **Resource Utilization** | 75-85% | Billable hours / total hours |
| **Portfolio Value** | Increasing | NPV of active portfolio |
| **PM Capability** | > 70% certified | % PMs with PMP/PRINCE2 |
| **Stakeholder Satisfaction** | > 4.0 / 5.0 | Annual survey |

### Demonstrating ROI

**Cost Savings:**
- Reduced project failures
- Better resource utilization
- Fewer rework and defects

**Value Creation:**
- Faster time-to-market
- Higher quality deliverables
- Strategic alignment

**Example:**

**PMO Investment:** £500K annually (3 FTEs, tools, training)

**Benefits:**
- 10% improvement in project success rate saves £2M in failed projects
- 5% better resource utilization = £1M in capacity
- Faster delivery creates £3M in market advantage

**ROI:** (£6M - £500K) / £500K = 1,100%

## Common PMO Challenges

**Resistance to "Bureaucracy":**
- Focus on value, not compliance
- Keep processes lightweight
- Demonstrate quick wins

**Lack of Executive Support:**
- Align PMO goals with business strategy
- Report in business terms, not PM jargon
- Celebrate successes visibly

**Resource Constraints:**
- Start small, scale gradually
- Leverage technology and automation
- Build coalition of PM practitioners

## Key Takeaways

- Governance provides structure for decisions and accountability
- PMO type (supportive, controlling, directive) depends on organizational needs
- PMO builds organizational PM capability and maturity
- Measure PMO value through project success, resource utilization, and portfolio value
- Start small, demonstrate value, scale gradually
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 10,
    title: 'Business Analysis and Requirements Management',
    content: `# Business Analysis and Requirements Management

## Bridging Business Needs and Technical Solutions

Effective requirements management is the foundation of project success. Poor requirements cause 70% of project failures.

## Requirements Elicitation

### Techniques

**Interviews:**
- **One-on-one:** Deep dive with key stakeholders
- **Group:** Gather diverse perspectives
- **Best Practice:** Prepare questions, listen actively, document immediately

**Workshops:**
- **Purpose:** Collaborative requirements definition
- **Techniques:** Brainstorming, affinity mapping, prioritization
- **Example:** Full-day workshop with 10-15 stakeholders to define product vision

**Observation:**
- **Shadowing:** Watch users perform tasks
- **Ethnographic Study:** Immerse in user environment
- **Value:** Uncover unstated needs and workarounds

**Prototyping:**
- **Mockups:** Visual representation of solution
- **Proof of Concept:** Working model of key features
- **Benefit:** Clarify requirements through tangible examples

**Document Analysis:**
- Review existing processes, systems, reports
- Identify gaps and improvement opportunities

### Requirements Types

| Type | Definition | Example |
|---|---|---|
| **Business Requirements** | High-level organizational needs | Increase customer retention by 15% |
| **Stakeholder Requirements** | Needs of specific stakeholder groups | Sales team needs mobile access to customer data |
| **Functional Requirements** | What the solution must do | System shall send email notification when order ships |
| **Non-Functional Requirements** | How the solution performs | System shall respond within 2 seconds for 95% of requests |
| **Transition Requirements** | Temporary capabilities for implementation | Data migration tool for legacy system |

## Requirements Documentation

### User Stories (Agile)

**Format:** As a [role], I want [capability], so that [benefit]

**Example:**
> As a sales manager, I want to view team performance dashboards, so that I can identify coaching opportunities.

**Acceptance Criteria:**
- Dashboard displays sales by rep for current month
- Filters available for date range and product line
- Drill-down to individual deal details
- Loads in < 3 seconds

### Use Cases

**Structure:**
- **Actor:** Who interacts with system
- **Preconditions:** State before use case
- **Main Flow:** Step-by-step normal path
- **Alternative Flows:** Variations and exceptions
- **Postconditions:** State after use case

**Example: Process Customer Return**

1. Customer service rep scans return authorization
2. System displays order details
3. Rep verifies items match authorization
4. System processes refund to original payment method
5. System updates inventory

**Alternative Flow:** If item damaged, route to quality inspection

### Requirements Specification Document

**Traditional Waterfall Approach:**

**Contents:**
1. Introduction and scope
2. Business requirements
3. Functional requirements (detailed)
4. Non-functional requirements
5. Constraints and assumptions
6. Acceptance criteria

**Best Practice:** Use templates, involve stakeholders in reviews

## Requirements Analysis

### Prioritization Techniques

**MoSCoW Method:**
- **Must Have:** Critical, project fails without
- **Should Have:** Important, but workarounds exist
- **Could Have:** Nice to have, low impact if excluded
- **Won't Have:** Out of scope for this release

**Kano Model:**
- **Basic Needs:** Expected, dissatisfaction if absent
- **Performance Needs:** More is better (linear satisfaction)
- **Excitement Needs:** Unexpected, delight customers

**Example:**

**E-commerce Website:**
- **Must Have:** Product catalog, shopping cart, checkout
- **Should Have:** Product reviews, wish list
- **Could Have:** Virtual try-on, gift wrapping
- **Won't Have:** Subscription service (future release)

### Requirements Validation

**Techniques:**
- **Reviews:** Stakeholder walk-through
- **Prototyping:** Build to validate understanding
- **Test Cases:** Define tests from requirements
- **Acceptance Criteria:** Clear pass/fail conditions

**Validation Checklist:**
- Complete (all requirements captured)
- Consistent (no contradictions)
- Unambiguous (single interpretation)
- Testable (can verify)
- Feasible (technically and financially possible)

## Requirements Management

### Change Control

**Process:**
1. Submit change request
2. Analyze impact (scope, cost, schedule, risk)
3. Prioritize against other changes
4. Approve/reject with rationale
5. Update requirements baseline
6. Communicate to stakeholders

**Change Request Example:**

**Request:** Add multi-currency support
**Impact:**
- Scope: +40 hours development
- Cost: +£8,000
- Schedule: +2 weeks
- Risk: Integration complexity with payment gateway

**Decision:** Defer to Phase 2 (not critical for initial launch)

### Requirements Traceability

**Purpose:** Link requirements to deliverables and tests

**Traceability Matrix:**

| Requirement ID | Description | Design Element | Test Case | Status |
|---|---|---|---|---|
| REQ-001 | User login | Login module | TC-001, TC-002 | Complete |
| REQ-002 | Password reset | Auth service | TC-003 | In progress |

**Benefits:**
- Ensure all requirements addressed
- Assess impact of changes
- Verify testing coverage

## Common Requirements Pitfalls

**Gold Plating:** Adding features not requested
- **Solution:** Strict change control, focus on business value

**Scope Creep:** Uncontrolled expansion of requirements
- **Solution:** Baseline requirements, formal change process

**Ambiguity:** Vague or unclear requirements
- **Solution:** Use examples, prototypes, acceptance criteria

**Stakeholder Conflict:** Competing requirements
- **Solution:** Prioritization workshops, executive decision-making

## Key Takeaways

- Use multiple elicitation techniques (interviews, workshops, observation)
- Document requirements appropriately for methodology (user stories vs. specifications)
- Prioritize ruthlessly using MoSCoW or Kano
- Validate requirements for completeness, consistency, and feasibility
- Manage changes through formal change control process
- Maintain traceability from requirements to deliverables
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 11,
    title: 'Professional Responsibility and Ethics',
    content: `# Professional Responsibility and Ethics

## Upholding Standards in Project Management

Project managers face ethical dilemmas regularly. Professional responsibility means making decisions that uphold integrity, even under pressure.

## Core Ethical Principles

### PMI Code of Ethics

**Four Values:**

1. **Responsibility:** Take ownership of decisions and actions
2. **Respect:** Treat others with dignity and fairness
3. **Fairness:** Make impartial decisions, avoid conflicts of interest
4. **Honesty:** Truthful in communications and conduct

### Ethical Decision-Making Framework

**When facing ethical dilemma:**

1. **Identify the issue:** What is the ethical concern?
2. **Gather facts:** Understand situation fully
3. **Consider stakeholders:** Who is affected?
4. **Evaluate options:** What are possible actions?
5. **Apply ethical principles:** Which option aligns with values?
6. **Decide and act:** Choose course of action
7. **Reflect:** Learn from experience

## Common Ethical Dilemmas

### Scenario 1: Pressure to Misrepresent Status

**Situation:** Executive pressures you to report project as "green" when it's actually "red" to avoid scrutiny.

**Ethical Concern:** Honesty vs. organizational pressure

**Appropriate Response:**
- Present facts objectively with supporting data
- Explain risks of misrepresentation
- Offer solutions to address issues
- Escalate if pressure continues
- Document conversations

**Wrong Response:** Comply with pressure, hide problems

### Scenario 2: Conflict of Interest

**Situation:** Your spouse's company bids on project contract. They offer best price.

**Ethical Concern:** Fairness, avoiding appearance of impropriety

**Appropriate Response:**
- Disclose relationship immediately
- Recuse yourself from vendor selection
- Have independent party evaluate bids
- Document disclosure and decision

**Wrong Response:** Award contract without disclosure

### Scenario 3: Confidential Information

**Situation:** Competitor offers you job and asks about current company's product roadmap.

**Ethical Concern:** Responsibility to current employer

**Appropriate Response:**
- Decline to share confidential information
- Clarify what is public vs. proprietary
- Maintain confidentiality even after leaving

**Wrong Response:** Share information to gain advantage in job offer

### Scenario 4: Team Member Misconduct

**Situation:** You discover team member padding timesheet hours.

**Ethical Concern:** Honesty, responsibility to organization

**Appropriate Response:**
- Gather facts without accusations
- Confront individual privately
- Follow organizational policies
- Report to appropriate authorities
- Document actions taken

**Wrong Response:** Ignore issue to avoid conflict

### Scenario 5: Scope Pressure

**Situation:** Stakeholder demands feature without budget or schedule adjustment, threatens to complain to your manager.

**Ethical Concern:** Fairness, professional responsibility

**Appropriate Response:**
- Explain impact of adding scope without resources
- Present options (reduce other features, extend timeline, add budget)
- Document request and response
- Escalate if stakeholder bypasses process

**Wrong Response:** Commit to impossible delivery to appease stakeholder

## Professional Responsibility

### Continuing Education

**Requirements:**
- Maintain certifications (PMP: 60 PDUs every 3 years)
- Stay current with industry trends
- Participate in professional communities
- Share knowledge with others

**Activities:**
- Attend conferences and workshops
- Read PM publications
- Take online courses
- Mentor junior PMs

### Giving Back to Profession

**Ways to Contribute:**
- Volunteer for professional organizations
- Mentor aspiring PMs
- Speak at conferences
- Write articles or blog posts
- Participate in standards development

### Cultural Sensitivity

**Global Project Considerations:**
- Understand cultural differences in communication styles
- Respect local customs and holidays
- Adapt management approach to cultural context
- Avoid imposing your culture on others

**Example:**

**Western Culture:** Direct feedback, individual accountability
**Eastern Culture:** Indirect feedback, group harmony

**Adaptation:** In Japan, provide feedback privately, frame as team improvement opportunity

## Organizational Responsibility

### Sustainability and Social Responsibility

**Consider project impact on:**
- Environment (carbon footprint, waste)
- Community (local employment, disruption)
- Society (ethical sourcing, labor practices)

**Example:**

**Construction Project:**
- Use sustainable materials
- Minimize noise during school hours
- Hire local contractors
- Implement waste recycling program

### Compliance and Legal Requirements

**PM Responsibilities:**
- Understand applicable laws and regulations
- Ensure project compliance
- Report violations
- Protect intellectual property
- Maintain data privacy and security

**Example:** GDPR compliance for EU customer data

## Handling Ethical Violations

### Reporting Misconduct

**When to Report:**
- Fraud or financial misconduct
- Safety violations
- Discrimination or harassment
- Legal violations
- Significant ethical breaches

**How to Report:**
1. Follow organizational reporting procedures
2. Document facts objectively
3. Report to appropriate authority (manager, ethics hotline, HR)
4. Protect confidentiality where possible
5. Do not retaliate against whistleblowers

### Protecting Yourself

**Best Practices:**
- Document decisions and rationale
- Seek guidance when uncertain
- Build reputation for integrity
- Know your organization's policies
- Understand legal protections for whistleblowers

## Key Takeaways

- Uphold responsibility, respect, fairness, and honesty
- Use ethical decision-making framework for dilemmas
- Disclose conflicts of interest proactively
- Report misconduct through appropriate channels
- Maintain professional competence through continuing education
- Consider broader impact of projects on society and environment
- Build reputation for integrity—it's your most valuable asset
`,
    estimatedMinutes: 30,
  },
  {
    levelId: 7,
    lessonNumber: 12,
    title: 'Certification Preparation and Career Development',
    content: `# Certification Preparation and Career Development

## Advancing Your PM Career

Congratulations on completing Level 7! This final lesson prepares you for professional certification and long-term career success.

## Professional Certifications

### PMP (Project Management Professional)

**Issuing Body:** Project Management Institute (PMI)

**Requirements:**
- 4-year degree + 3 years PM experience (4,500 hours leading projects)
- OR High school diploma + 5 years PM experience (7,500 hours)
- 35 hours PM education (this course qualifies!)

**Exam:**
- 180 questions, 230 minutes
- Domains: People (42%), Process (50%), Business Environment (8%)
- Agile, predictive, and hybrid approaches
- Passing score: ~61% (varies by exam form)

**Preparation:**
- Study PMBOK Guide (7th edition)
- Take practice exams
- Join study group
- Focus on application, not memorization

**Maintenance:**
- 60 PDUs every 3 years
- Annual membership fee

### PRINCE2 (Projects IN Controlled Environments)

**Issuing Body:** AXELOS

**Levels:**
- **Foundation:** Understanding of methodology
- **Practitioner:** Application of methodology

**Focus:**
- Process-driven approach
- Seven principles, themes, and processes
- Popular in UK, Europe, Australia

**Exam:**
- Foundation: 60 questions, 60 minutes, 55% to pass
- Practitioner: 68 questions, 150 minutes, 55% to pass

### Agile Certifications

**CSM (Certified ScrumMaster):**
- 2-day training course
- Exam: 50 questions, 60 minutes, 74% to pass
- Focus: Scrum framework, servant leadership

**PMI-ACP (Agile Certified Practitioner):**
- 2,000 hours agile project experience
- 21 hours agile training
- Exam: 120 questions, 180 minutes
- Covers multiple agile methodologies

**SAFe Certifications:**
- SAFe Agilist (leading agile transformation)
- SAFe Scrum Master
- SAFe Product Owner/Product Manager

### Specialized Certifications

**PgMP (Program Management Professional):** Multi-project programs
**PfMP (Portfolio Management Professional):** Strategic portfolio management
**PMI-RMP (Risk Management Professional):** Advanced risk management
**PMI-SP (Scheduling Professional):** Schedule management

## Exam Preparation Strategy

### Study Plan (3 Months)

**Month 1: Foundation**
- Read PMBOK Guide or PRINCE2 manual
- Watch video courses
- Join study group
- Create study notes

**Month 2: Practice**
- Take practice exams (aim for 75%+)
- Review weak areas
- Flashcards for terminology
- Teach concepts to others

**Month 3: Final Prep**
- Full-length practice exams under timed conditions
- Review incorrect answers
- Rest well before exam
- Arrive early, stay calm

### Exam Day Tips

**Before Exam:**
- Good night's sleep
- Healthy breakfast
- Arrive 30 minutes early
- Brain dump formulas on scratch paper

**During Exam:**
- Read questions carefully
- Eliminate obviously wrong answers
- Flag difficult questions, return later
- Manage time (1.25 minutes per question)
- Trust your preparation

**Mindset:**
- Stay calm, breathe
- Don't overthink
- Choose "best" answer, not "perfect" answer
- Remember: You've prepared for this

## Career Development

### PM Career Path

**Entry Level:**
- Project Coordinator
- Assistant Project Manager
- Junior Project Manager

**Mid-Level:**
- Project Manager
- Senior Project Manager
- Agile Coach / Scrum Master

**Senior Level:**
- Program Manager
- Portfolio Manager
- PMO Director

**Executive Level:**
- VP of Project Management
- Chief Project Officer
- VP of Operations

### Building Your PM Brand

**Professional Profile:**
- LinkedIn profile highlighting PM achievements
- Quantify results (e.g., "Delivered 15 projects totaling £5M")
- Showcase certifications and skills
- Request recommendations from stakeholders

**Networking:**
- Join PMI or local PM chapter
- Attend industry conferences
- Participate in online communities
- Connect with other PMs

**Thought Leadership:**
- Write blog posts or articles
- Speak at meetups or conferences
- Share lessons learned
- Mentor junior PMs

### Essential PM Skills

**Technical Skills:**
- PM methodologies (Waterfall, Agile, hybrid)
- Tools (MS Project, Jira, Asana, Smartsheet)
- Data analysis and reporting
- Risk and financial management

**Leadership Skills:**
- Communication and stakeholder management
- Conflict resolution and negotiation
- Team building and motivation
- Change management

**Business Skills:**
- Strategic thinking
- Business case development
- Vendor management
- Industry knowledge

### Continuous Learning

**Stay Current:**
- Read PM blogs and publications
- Follow PM thought leaders on social media
- Take courses on emerging topics (AI in PM, remote team management)
- Experiment with new tools and techniques

**Emerging Trends:**
- **AI and Automation:** Tools for scheduling, risk analysis, reporting
- **Remote and Hybrid Work:** Managing distributed teams
- **Agile at Scale:** SAFe, LeSS, Spotify model
- **Sustainability:** Green project management
- **Data-Driven PM:** Analytics and predictive modeling

## Your Next Steps

### Immediate Actions (This Week)

1. **Decide on certification:** PMP, PRINCE2, or Agile?
2. **Create study plan:** Block time in calendar
3. **Join study group:** PMI chapter or online community
4. **Update LinkedIn:** Add skills and achievements
5. **Request recommendations:** From recent project stakeholders

### Short-Term Goals (Next 3 Months)

1. **Complete certification exam**
2. **Apply learning to current project**
3. **Mentor a junior team member**
4. **Attend one PM event (conference, meetup)**
5. **Read two PM books or take one advanced course**

### Long-Term Goals (Next Year)

1. **Lead larger or more complex project**
2. **Develop specialized expertise** (agile, risk, program management)
3. **Build professional network** (50+ PM connections)
4. **Give back** (volunteer, speak, write)
5. **Plan next career move** (promotion, new role, industry change)

## Final Thoughts

You've completed an intensive journey through project management—from fundamentals to advanced topics. You now have the knowledge to:

- Lead projects using Waterfall, Agile, or hybrid approaches
- Manage stakeholders, risks, budgets, and quality
- Build and motivate high-performing teams
- Navigate organizational politics and change
- Continuously improve processes and outcomes

**Remember:**
- Project management is both science and art
- Every project is a learning opportunity
- Your integrity is your most valuable asset
- Great PMs make everyone around them better
- The best is yet to come in your PM career

**Congratulations on completing Project Pro: The PM Simulator!**

Now go forth and deliver exceptional projects. The world needs skilled, ethical, passionate project managers like you.

## Resources

**Professional Organizations:**
- Project Management Institute (PMI): www.pmi.org
- AXELOS (PRINCE2): www.axelos.com
- Scrum Alliance: www.scrumalliance.org

**Recommended Reading:**
- *PMBOK Guide* (7th Edition) - PMI
- *The Lean Startup* - Eric Ries
- *Scrum: The Art of Doing Twice the Work in Half the Time* - Jeff Sutherland
- *Crucial Conversations* - Kerry Patterson
- *The Phoenix Project* - Gene Kim

**Online Communities:**
- r/projectmanagement (Reddit)
- PM Network (LinkedIn)
- ProjectManagement.com forums

Good luck on your certification exam and your PM career! 🚀
`,
    estimatedMinutes: 30,
  },
];

// Insert lessons
for (const lesson of level7Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('✅ Level 7 complete! All 12 lessons seeded successfully!');

await connection.end();
