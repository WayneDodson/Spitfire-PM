import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level4Lessons = [
  {
    levelId: 4,
    lessonNumber: 1,
    title: "Introduction to Stakeholder Management",
    content: `# Introduction to Stakeholder Management

Stakeholders can make or break a project. Understanding who they are, what they need, and how to engage them is critical to project success. This lesson introduces stakeholder management fundamentals.

## What is a Stakeholder?

**Definition**: Anyone who can affect or be affected by the project.

**Key point**: Stakeholders aren't just customers or sponsors. They include anyone with an interest in the project.

**Examples**:
- **Project sponsor**: Provides funding and executive support
- **Customers**: Will use the product
- **End users**: Will interact with the product daily
- **Project team**: Builds the product
- **Managers**: Oversee team members
- **Vendors**: Provide services or components
- **Regulators**: Enforce compliance requirements
- **Competitors**: May be affected by project success
- **Community**: May be impacted by project (e.g., construction project)

**Example project: New hospital information system**

Stakeholders include:
- Hospital administration (sponsor)
- Doctors and nurses (users)
- Patients (customers)
- IT staff (team)
- Medical records staff (affected by change)
- Insurance companies (integrate with system)
- Government health agencies (compliance)
- Software vendors (provide components)

## Why Stakeholder Management Matters

**Projects fail when stakeholders are ignored**:

**Example 1**: IT team builds perfect technical solution, but users find it too complex. Project fails because users weren't involved.

**Example 2**: Project delivers on time and budget, but key executive wasn't kept informed. Executive kills project because they don't see value.

**Example 3**: Project team focuses on features, ignores compliance requirements. Regulator blocks launch.

**Benefits of good stakeholder management**:
- **Support and buy-in**: Stakeholders champion the project
- **Better requirements**: Understanding stakeholder needs leads to better solutions
- **Reduced resistance**: Engaged stakeholders are less likely to resist change
- **Early problem detection**: Stakeholders alert you to issues before they become critical
- **Smoother approval processes**: Informed stakeholders approve faster
- **Project success**: Meeting stakeholder needs is the definition of success

## Stakeholder vs. Customer

**Customer**: Pays for or receives the product.

**Stakeholder**: Anyone affected by or able to affect the project.

**All customers are stakeholders, but not all stakeholders are customers**.

**Example: Corporate training program**

- **Customer**: HR department (pays for program)
- **Stakeholders**: HR, employees (attend training), managers (lose employees' time), trainers (deliver program), executives (expect ROI)

**Implication**: Don't focus only on customer. Other stakeholders can derail project.

## Types of Stakeholders

### Internal vs. External

**Internal stakeholders**: Within your organization.

Examples: Project team, management, other departments

**External stakeholders**: Outside your organization.

Examples: Customers, vendors, regulators, community

**Difference matters**: Internal stakeholders easier to access, external stakeholders may have different priorities.

### Primary vs. Secondary

**Primary stakeholders**: Directly affected by project.

Examples: Users, customers, project team

**Secondary stakeholders**: Indirectly affected or able to influence.

Examples: Vendors, regulators, community

**Difference matters**: Primary stakeholders need more engagement.

### Positive vs. Negative

**Positive stakeholders**: Support the project, want it to succeed.

**Negative stakeholders**: Oppose the project, want it to fail.

**Neutral stakeholders**: Don't care either way (yet).

**Difference matters**: Positive stakeholders are allies. Negative stakeholders need special attention to understand concerns and mitigate opposition.

## Stakeholder Identification

**First step**: Identify all stakeholders.

**Techniques**:

### Brainstorming

Gather project team and list everyone who might be affected or able to affect project.

**Prompt questions**:
- Who will use the product?
- Who pays for it?
- Who builds it?
- Who approves it?
- Who might oppose it?
- Who has expertise we need?
- Who will be affected by changes?
- Who can stop the project?

### Stakeholder Mapping

Create visual map of stakeholders.

**Categories**:
- Customers and users
- Project team
- Management and executives
- Vendors and partners
- Regulators and compliance
- Community and public

### Organizational Chart Review

Review org chart to identify departments and roles affected.

**Example**: New expense reporting system affects:
- Finance (owns process)
- All employees (submit expenses)
- Managers (approve expenses)
- IT (support system)
- Auditors (review compliance)

### Document Review

Review project charter, business case, and requirements to identify mentioned stakeholders.

### Interviews

Ask known stakeholders: "Who else should we talk to?"

**Snowball technique**: Each stakeholder identifies others.

## Stakeholder Register

**Document** listing all stakeholders and key information.

**Typical contents**:

| Name | Role | Organization | Interest | Influence | Attitude | Contact |
|------|------|--------------|----------|-----------|----------|---------|
| Sarah Johnson | CFO | Finance | High | High | Positive | sarah@company.com |
| John Smith | IT Manager | IT | Medium | Medium | Neutral | john@company.com |
| Mary Chen | Compliance Officer | Legal | High | High | Negative | mary@company.com |

**Information to capture**:

**Name and role**: Who they are and what they do.

**Organization/department**: Where they work.

**Interest**: How much they care about the project (high/medium/low).

**Influence**: How much power they have (high/medium/low).

**Attitude**: Support, oppose, or neutral.

**Requirements and expectations**: What they need from the project.

**Communication preferences**: How they want to be engaged (email, meetings, reports).

**Contact information**: How to reach them.

## Stakeholder Analysis

**Go beyond identification**—understand stakeholders deeply.

**Questions to answer**:

**What do they care about?**

Example: CFO cares about ROI and budget. Users care about ease of use.

**What are their goals?**

Example: Sales manager wants to close deals faster. IT wants to reduce support burden.

**What are their concerns?**

Example: Compliance officer worried about regulatory risk. Employees worried about job security.

**What's their history with similar projects?**

Example: If previous IT project failed, stakeholders may be skeptical.

**What's their communication style?**

Example: Executive wants high-level summaries. Technical lead wants detailed specifications.

**Who influences them?**

Example: Department head listens to their team. Understanding team concerns helps you address department head's concerns.

**What's their availability?**

Example: Executive has 15 minutes per month. Plan accordingly.

## Power/Interest Grid

**Tool** for prioritizing stakeholder engagement.

**Two dimensions**:
- **Power**: Ability to affect project (high/low)
- **Interest**: Level of concern about project (high/low)

**Four quadrants**:

### High Power, High Interest: Manage Closely

**These are your key stakeholders**. Engage frequently, keep informed, involve in decisions.

**Example**: Project sponsor, key customers, senior management.

**Strategy**: Regular meetings, detailed updates, involve in planning.

### High Power, Low Interest: Keep Satisfied

**These stakeholders can affect project but don't care much**. Keep them satisfied without overwhelming them.

**Example**: Senior executives not directly involved, regulatory agencies.

**Strategy**: Periodic high-level updates, ensure their concerns are addressed.

### Low Power, High Interest: Keep Informed

**These stakeholders care but can't directly affect project**. Keep them informed to maintain support.

**Example**: End users, support staff, interested departments.

**Strategy**: Regular communications, newsletters, demos.

### Low Power, Low Interest: Monitor

**These stakeholders have minimal impact and interest**. Monitor in case their position changes.

**Example**: Peripheral departments, distant vendors.

**Strategy**: Occasional updates, don't spend much time.

**Example: Hospital Information System**

**Manage Closely**: Hospital CEO (sponsor), Chief Medical Officer (key user), IT Director (implementation)

**Keep Satisfied**: Board of Directors, regulatory agencies

**Keep Informed**: Doctors, nurses, administrative staff

**Monitor**: Janitorial staff, parking services

## Stakeholder Engagement Levels

**Current engagement level**: How engaged are they now?

**Desired engagement level**: How engaged do you need them to be?

**Levels**:

**Unaware**: Don't know about project.

**Resistant**: Know about project, oppose it.

**Neutral**: Know about project, don't care.

**Supportive**: Know about project, support it.

**Leading**: Actively champion project.

**Example**:

| Stakeholder | Current | Desired | Gap |
|-------------|---------|---------|-----|
| CFO | Neutral | Supportive | Need to demonstrate ROI |
| IT Manager | Resistant | Supportive | Need to address concerns about workload |
| Users | Unaware | Supportive | Need to communicate benefits |

**Strategy**: Plan activities to move stakeholders from current to desired engagement.

## Stakeholder Expectations

**Understand what stakeholders expect**:

**Explicit expectations**: Stated requirements.

Example: "System must process 1000 transactions per second."

**Implicit expectations**: Unstated assumptions.

Example: "System will be easy to use" (even if not explicitly stated).

**Latent expectations**: Needs they don't know they have.

Example: "System should work on mobile" (they haven't thought about it, but will expect it when they see it).

**Managing expectations**:

**Clarify**: Ask questions to uncover implicit and latent expectations.

**Document**: Write down expectations to prevent misunderstandings.

**Align**: Ensure expectations are realistic and aligned with project scope.

**Communicate**: Keep stakeholders informed about what will and won't be delivered.

**Example**: Stakeholder expects project to be completed in 3 months. Project plan shows 6 months. If you don't address this expectation gap early, stakeholder will be disappointed.

## Stakeholder Influence

**Not all stakeholders have equal influence**.

**Sources of power**:

**Formal authority**: Position in organization (CEO, VP, Director).

**Control of resources**: Budget, people, equipment.

**Expertise**: Specialized knowledge or skills.

**Relationships**: Connections to other powerful stakeholders.

**Reputation**: Respect and credibility.

**Example**: Junior developer has low formal authority but high expertise in critical technology. Their influence on technical decisions is high.

**Implication**: Don't ignore low-level stakeholders if they have other sources of power.

## Stakeholder Relationships

**Stakeholders don't exist in isolation**—they have relationships with each other.

**Understanding relationships helps you**:

**Identify coalitions**: Groups of stakeholders with shared interests.

**Find champions**: Stakeholders who can influence others.

**Anticipate conflicts**: Stakeholders with opposing interests.

**Plan communication**: Use influential stakeholders to reach others.

**Example**: Department heads oppose project. But they all report to VP who supports project. Engage VP to influence department heads.

**Stakeholder network map**: Visual diagram showing relationships between stakeholders.

## Cultural Considerations

**Stakeholders from different cultures may have different**:

**Communication styles**: Direct vs. indirect, formal vs. informal.

**Decision-making processes**: Individual vs. consensus, fast vs. slow.

**Attitudes toward authority**: Hierarchical vs. egalitarian.

**Attitudes toward time**: Punctuality, deadlines, long-term vs. short-term focus.

**Example**: Western stakeholders may expect quick decisions and direct communication. Asian stakeholders may prefer consensus-building and indirect communication.

**Implication**: Adapt your engagement approach to stakeholder culture.

## Common Stakeholder Management Mistakes

### Ignoring Negative Stakeholders

**Mistake**: Focus only on supportive stakeholders, ignore or avoid opponents.

**Problem**: Negative stakeholders can derail project if their concerns aren't addressed.

**Solution**: Engage negative stakeholders early, understand their concerns, address legitimate issues.

### Treating All Stakeholders Equally

**Mistake**: Spend equal time with all stakeholders.

**Problem**: Wastes time on low-priority stakeholders, neglects high-priority ones.

**Solution**: Use Power/Interest Grid to prioritize engagement.

### Assuming Stakeholders Know What They Want

**Mistake**: Take stakeholder requests at face value.

**Problem**: Stakeholders often describe solutions, not problems. You might build the wrong thing.

**Solution**: Ask "why" to understand underlying needs.

### One-Way Communication

**Mistake**: Tell stakeholders what you're doing, don't listen to them.

**Problem**: Miss important feedback, stakeholders feel ignored.

**Solution**: Two-way communication. Ask questions, listen actively, incorporate feedback.

### Inconsistent Communication

**Mistake**: Communicate frequently at project start, then go silent.

**Problem**: Stakeholders assume project is in trouble or you're hiding problems.

**Solution**: Establish regular communication cadence and stick to it.

## Key Takeaways

- Stakeholders are anyone who can affect or be affected by the project
- Stakeholder management is critical to project success—ignored stakeholders derail projects
- Identify stakeholders through brainstorming, mapping, org chart review, document review, and interviews
- Stakeholder register documents all stakeholders and key information
- Analyze stakeholders to understand their interests, concerns, goals, and influence
- Power/Interest Grid prioritizes stakeholders: Manage Closely (high power, high interest), Keep Satisfied (high power, low interest), Keep Informed (low power, high interest), Monitor (low power, low interest)
- Stakeholder engagement levels: Unaware, Resistant, Neutral, Supportive, Leading
- Understand explicit, implicit, and latent expectations
- Stakeholder influence comes from formal authority, resources, expertise, relationships, and reputation
- Map stakeholder relationships to identify coalitions, champions, and conflicts
- Adapt engagement to stakeholder culture
- Avoid mistakes: ignoring negative stakeholders, treating all equally, assuming they know what they want, one-way communication, inconsistent communication

In the next lesson, we'll explore stakeholder communication strategies.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 4,
    lessonNumber: 2,
    title: "Stakeholder Communication Strategies",
    content: `# Stakeholder Communication Strategies

Effective communication is the foundation of stakeholder management. This lesson explores strategies for communicating with stakeholders in ways that build trust, manage expectations, and maintain engagement.

## Communication Planning

**Don't wing it**—plan your stakeholder communication.

**Communication plan answers**:
- Who needs to communicate with whom?
- What information needs to be shared?
- When and how often?
- Through what channels?
- In what format?
- Who is responsible?

**Example communication plan**:

| Stakeholder | Information | Frequency | Channel | Format | Owner |
|-------------|-------------|-----------|---------|--------|-------|
| Project Sponsor | Status, risks, decisions needed | Weekly | Meeting | Dashboard + discussion | PM |
| Steering Committee | Progress, major issues | Monthly | Meeting | Presentation | PM |
| Project Team | Tasks, blockers, updates | Daily | Standup | Verbal | Scrum Master |
| End Users | Features, training, go-live | Monthly | Email | Newsletter | PM |
| Vendors | Requirements, integration | As needed | Email/Meeting | Specifications | Tech Lead |

## Communication Channels

**Different channels suit different purposes**:

### Face-to-Face Meetings

**Best for**:
- Complex or sensitive topics
- Building relationships
- Negotiation and conflict resolution
- Brainstorming and collaboration

**Advantages**:
- Rich communication (body language, tone)
- Immediate feedback
- Builds trust

**Disadvantages**:
- Time-consuming
- Scheduling challenges
- No automatic record

**Example**: Discuss project risks with sponsor face-to-face, not via email.

### Video Conferencing

**Best for**:
- Remote teams
- When face-to-face isn't possible
- Demonstrations

**Advantages**:
- Visual communication
- More personal than phone
- Can share screens

**Disadvantages**:
- Technical issues
- Less engaging than face-to-face
- Fatigue with too many video calls

### Phone Calls

**Best for**:
- Quick discussions
- When visual isn't needed
- Following up on emails

**Advantages**:
- Fast
- Personal
- Can read tone

**Disadvantages**:
- No visual cues
- No record
- Can be interrupted

### Email

**Best for**:
- Formal communication
- Distributing information
- Creating record
- Non-urgent matters

**Advantages**:
- Asynchronous
- Creates record
- Can reach many people
- Time to craft message

**Disadvantages**:
- Easy to misinterpret
- Can be ignored
- Overused

**Email best practices**:
- Clear subject line
- Concise message
- Action items clearly stated
- Appropriate recipients (To vs. CC)
- Professional tone

### Instant Messaging (Slack, Teams)

**Best for**:
- Quick questions
- Team coordination
- Informal communication

**Advantages**:
- Fast
- Informal
- Good for team cohesion

**Disadvantages**:
- Distracting
- Important information can get lost
- Not suitable for formal communication

### Reports and Dashboards

**Best for**:
- Regular status updates
- Metrics and KPIs
- Executive communication

**Advantages**:
- Consistent format
- Easy to scan
- Can be automated

**Disadvantages**:
- One-way communication
- Can be ignored
- May lack context

### Presentations

**Best for**:
- Steering committee meetings
- Project kickoffs
- Milestone reviews

**Advantages**:
- Structured information delivery
- Visual aids
- Can reach many people

**Disadvantages**:
- Time-consuming to prepare
- Can be boring
- Limited interaction

### Collaboration Tools (Wikis, SharePoint)

**Best for**:
- Documentation
- Shared information
- Reference materials

**Advantages**:
- Always available
- Searchable
- Version control

**Disadvantages**:
- Requires active checking
- Can become outdated
- Information overload

## Tailoring Communication

**One size doesn't fit all**—tailor communication to stakeholder.

### By Role

**Executives**:
- High-level summaries
- Focus on business value and ROI
- Highlight risks and decisions needed
- Brief and visual

**Example**: One-page dashboard with traffic lights (green/yellow/red) for status.

**Technical stakeholders**:
- Detailed specifications
- Technical architecture
- Integration points
- Can handle complexity

**Example**: Detailed technical design document.

**End users**:
- How it affects them
- Benefits and changes
- Training and support
- Simple language, no jargon

**Example**: "The new system will let you submit expenses in 2 minutes instead of 10."

### By Communication Preference

**Some stakeholders prefer**:
- Detailed reports
- Face-to-face meetings
- Quick updates
- Visual dashboards

**Ask stakeholders**: "How do you prefer to receive updates?"

**Example**: Executive prefers 5-minute verbal update over coffee. Provide that instead of emailing 10-page report.

### By Engagement Level

**Highly engaged stakeholders**:
- Frequent, detailed communication
- Involve in decisions
- Seek their input

**Low engagement stakeholders**:
- Periodic high-level updates
- Don't overwhelm with detail
- Focus on what matters to them

## Communication Frequency

**Too little communication**: Stakeholders feel ignored, assume problems.

**Too much communication**: Stakeholders tune out, important information gets lost.

**Right amount**: Depends on stakeholder and project phase.

**Guidelines**:

**High power, high interest stakeholders**: Weekly or more

**High power, low interest stakeholders**: Monthly

**Low power, high interest stakeholders**: Bi-weekly or monthly

**Low power, low interest stakeholders**: Quarterly or as needed

**Adjust based on**:
- Project phase (more frequent during critical phases)
- Stakeholder feedback (if they ask for more/less, adjust)
- Issues and risks (increase frequency when problems arise)

## Message Framing

**How you say something matters as much as what you say**.

### Positive vs. Negative Framing

**Negative**: "We're 2 weeks behind schedule."

**Positive**: "We've completed 80% of planned work and expect to finish by [date]."

**Both are true**, but positive framing maintains confidence.

**When to use negative framing**: When you need to create urgency or highlight serious problems.

### Problem vs. Solution Framing

**Problem-focused**: "The API integration isn't working."

**Solution-focused**: "The API integration has an issue. We're implementing a workaround and will have it resolved by Friday."

**Solution framing** is more reassuring and action-oriented.

### Data-Driven Framing

**Vague**: "The project is going well."

**Data-driven**: "We've delivered 15 of 20 planned features, with 90% user acceptance."

**Data builds credibility** and prevents misunderstandings.

## Managing Difficult Conversations

**Sometimes you must deliver bad news** or address conflicts.

### Delivering Bad News

**Don't sugarcoat**, but don't catastrophize either.

**Structure**:
1. **State the problem clearly**: "We've discovered a critical bug that will delay launch by 2 weeks."

2. **Explain the cause**: "During final testing, we found the payment integration fails under high load."

3. **Present solutions**: "We can either delay launch to fix it properly, or launch with a workaround and fix it in the next release."

4. **Recommend action**: "I recommend delaying launch. Launching with payment issues would damage customer trust."

5. **Seek input**: "What do you think?"

**Don't**:
- Hide problems (they'll only get worse)
- Blame others
- Present problems without solutions
- Surprise stakeholders (give early warnings)

### Handling Objections

**Stakeholder objects to your approach**.

**Don't**:
- Get defensive
- Dismiss their concerns
- Argue

**Do**:
- Listen actively
- Acknowledge their concern
- Ask clarifying questions
- Explain your reasoning
- Find common ground

**Example**:

Stakeholder: "This approach is too risky."

You: "I understand your concern about risk. Can you tell me more about what specifically worries you?"

Stakeholder: "We've never done it this way before."

You: "That's a fair point. Let me explain why I think this approach reduces risk rather than increases it. [Explain]. Does that address your concern, or are there other risks I should consider?"

### Resolving Conflicts

**Stakeholders have conflicting requirements or priorities**.

**Approaches**:

**Compromise**: Both parties give up something.

Example: "We'll include Feature A now and Feature B in the next release."

**Collaborate**: Find solution that satisfies both parties.

Example: "What if we implement a simpler version of both features?"

**Escalate**: Bring in higher authority to decide.

Example: "Let's bring this to the steering committee to decide."

**Avoid**: Postpone decision (only if conflict isn't urgent).

Example: "Let's revisit this in 2 weeks when we have more information."

## Active Listening

**Communication isn't just talking**—it's listening.

**Active listening techniques**:

**Give full attention**: Put away phone, close laptop, make eye contact.

**Don't interrupt**: Let them finish before responding.

**Paraphrase**: "So what I'm hearing is..."

**Ask clarifying questions**: "Can you tell me more about...?"

**Acknowledge emotions**: "I can see this is frustrating for you."

**Summarize**: "Let me make sure I understand. You're concerned about X, Y, and Z. Is that right?"

**Example**:

Stakeholder: "This system is too complicated!"

Bad response: "No it's not. It's actually quite simple once you learn it."

Good response: "I hear that you're finding it complicated. Can you tell me more about what's confusing? That will help us improve it."

## Building Trust

**Trust is the foundation of stakeholder relationships**.

**How to build trust**:

**Be transparent**: Share both good and bad news.

**Follow through**: Do what you say you'll do.

**Admit mistakes**: Don't hide errors or blame others.

**Give credit**: Recognize stakeholder contributions.

**Be consistent**: Reliable communication and behavior.

**Show competence**: Demonstrate you know what you're doing.

**Show respect**: Value stakeholder time and input.

**Example of transparency**:

Bad: Hide problem until it becomes crisis.

Good: "We've identified a potential risk with the vendor. It might not be a problem, but I wanted you to be aware. Here's what we're doing to monitor and mitigate it."

## Communication During Project Phases

**Communication needs change throughout project**:

### Initiation

**Focus**: Building support, clarifying vision, setting expectations.

**Activities**:
- Project kickoff meeting
- Stakeholder interviews
- Vision and goals communication

**Frequency**: High (establishing relationships)

### Planning

**Focus**: Gathering input, reviewing plans, securing approval.

**Activities**:
- Requirements workshops
- Plan reviews
- Risk discussions

**Frequency**: High (need stakeholder input)

### Execution

**Focus**: Status updates, issue resolution, maintaining engagement.

**Activities**:
- Regular status reports
- Demos
- Issue escalation

**Frequency**: Moderate (regular cadence)

### Monitoring and Controlling

**Focus**: Reporting progress, managing changes, addressing risks.

**Activities**:
- Status meetings
- Change requests
- Risk reviews

**Frequency**: Moderate (consistent updates)

### Closing

**Focus**: Celebrating success, capturing lessons, transitioning to operations.

**Activities**:
- Final presentation
- Lessons learned session
- Handover meetings

**Frequency**: High (wrapping up)

## Communication Barriers

**Obstacles to effective communication**:

### Physical Barriers

**Distance**: Remote stakeholders harder to reach.

**Solution**: Use video conferencing, schedule regular calls.

**Time zones**: Hard to find meeting times.

**Solution**: Rotate meeting times, use asynchronous communication.

### Language and Cultural Barriers

**Different languages**: Misunderstandings.

**Solution**: Use simple language, provide translations, confirm understanding.

**Cultural differences**: Different communication styles.

**Solution**: Learn about stakeholder cultures, adapt your approach.

### Organizational Barriers

**Hierarchy**: Information doesn't flow up or down.

**Solution**: Establish clear communication channels.

**Silos**: Departments don't communicate.

**Solution**: Cross-functional meetings, shared tools.

### Psychological Barriers

**Assumptions**: "They already know this."

**Solution**: Don't assume, communicate explicitly.

**Emotions**: Anger, fear, frustration interfere with communication.

**Solution**: Acknowledge emotions, address concerns.

**Lack of trust**: Stakeholders don't believe you.

**Solution**: Build trust through transparency and consistency.

## Communication Tools and Templates

**Standardize communication for consistency**:

### Status Report Template

**Project**: [Name]
**Period**: [Dates]
**Status**: [Green/Yellow/Red]

**Accomplishments**:
- [What was completed]

**Upcoming**:
- [What's planned next]

**Issues and Risks**:
- [Problems and concerns]

**Decisions Needed**:
- [What you need from stakeholders]

### Stakeholder Update Email Template

**Subject**: [Project Name] Update - [Date]

Hi [Stakeholder],

Quick update on [Project Name]:

**Progress**: [Brief summary of what's been accomplished]

**Next Steps**: [What's coming next]

**How You Can Help**: [Any action needed from stakeholder]

Let me know if you have questions.

[Your Name]

### Meeting Agenda Template

**Project**: [Name]
**Date**: [Date]
**Attendees**: [Names]

**Agenda**:
1. [Topic 1] - [Time] - [Owner]
2. [Topic 2] - [Time] - [Owner]
3. [Topic 3] - [Time] - [Owner]

**Decisions Needed**:
- [List decisions]

**Preparation**:
- [What attendees should review beforehand]

## Key Takeaways

- Communication planning defines who, what, when, how, and who's responsible
- Choose communication channels based on purpose: face-to-face for complex topics, email for documentation, instant messaging for quick questions
- Tailor communication to stakeholder role, preferences, and engagement level
- Communication frequency depends on stakeholder power/interest and project phase
- Frame messages positively and solution-focused, use data to build credibility
- Manage difficult conversations: deliver bad news with solutions, handle objections with active listening, resolve conflicts through compromise or collaboration
- Active listening: give attention, don't interrupt, paraphrase, ask questions, acknowledge emotions
- Build trust through transparency, follow-through, admitting mistakes, giving credit, consistency
- Communication needs change through project phases: high during initiation and closing, moderate during execution
- Overcome barriers: physical (use technology), language/cultural (adapt approach), organizational (establish channels), psychological (build trust)
- Use templates for consistency: status reports, stakeholder updates, meeting agendas

In the next lesson, we'll explore stakeholder engagement techniques.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 4,
    lessonNumber: 3,
    title: "Stakeholder Engagement Techniques",
    content: `# Stakeholder Engagement Techniques

Identifying and communicating with stakeholders isn't enough—you must actively engage them. This lesson explores techniques for building relationships, maintaining involvement, and turning stakeholders into project champions.

## Levels of Engagement

**Stakeholders can be engaged at different levels**:

### Inform

**One-way communication**: You tell them what's happening.

**When appropriate**: Low-priority stakeholders who need awareness but not involvement.

**Techniques**: Newsletters, status reports, email updates.

**Example**: Inform peripheral departments about project via monthly email.

### Consult

**Two-way communication**: You seek their input but make decisions.

**When appropriate**: Stakeholders with valuable expertise or perspective.

**Techniques**: Surveys, interviews, focus groups, review sessions.

**Example**: Consult users about interface design through usability testing.

### Involve

**Collaborative**: Stakeholders participate in discussions and decisions.

**When appropriate**: Stakeholders whose buy-in is critical.

**Techniques**: Workshops, working groups, regular meetings.

**Example**: Involve department heads in prioritization decisions.

### Collaborate

**Partnership**: Stakeholders are active partners in project.

**When appropriate**: Key stakeholders with high power and interest.

**Techniques**: Joint planning, co-creation, embedded stakeholders.

**Example**: Product Owner from business works full-time with development team.

### Empower

**Delegation**: Stakeholders make decisions.

**When appropriate**: Stakeholders with authority and expertise.

**Techniques**: Delegated decision-making, empowered working groups.

**Example**: Empower technical lead to make architecture decisions.

**Match engagement level to stakeholder**:
- High power, high interest: Collaborate or Empower
- High power, low interest: Consult
- Low power, high interest: Involve or Consult
- Low power, low interest: Inform

## Building Relationships

**Stakeholder management is relationship management**.

### Get to Know Stakeholders Personally

**Don't just talk business**—build personal connection.

**Techniques**:
- Ask about their background and interests
- Remember personal details (family, hobbies)
- Casual conversations before/after meetings
- Occasional coffee or lunch

**Example**: Learn that stakeholder is passionate about sustainability. When presenting project, highlight environmental benefits.

**Caution**: Be genuine. People can tell if you're faking interest.

### Find Common Ground

**Identify shared interests or goals**.

**Example**: You and stakeholder both want to improve customer satisfaction. Frame project in those terms.

### Be Reliable

**Do what you say you'll do**.

**If you commit to sending a document by Friday, send it by Friday**. If you can't, communicate early.

**Reliability builds trust**. Trust is the foundation of relationships.

### Show Appreciation

**Thank stakeholders for their time and contributions**.

**Examples**:
- "Thanks for taking time to review this."
- "Your input on the design was really valuable."
- "I appreciate you escalating that issue."

**People like to feel valued**. Appreciation strengthens relationships.

### Be Responsive

**Reply to emails and calls promptly**.

**Even if you don't have an answer**: "I got your email. I'm looking into it and will get back to you by [date]."

**Responsiveness shows respect** for stakeholder's time and concerns.

## Stakeholder Workshops

**Collaborative sessions** to gather input, make decisions, or solve problems.

### Requirements Workshops

**Purpose**: Gather and refine requirements.

**Participants**: Product Owner, users, subject matter experts, development team.

**Activities**:
- Present current understanding of requirements
- Discuss and clarify
- Identify gaps
- Prioritize

**Example**: Workshop to define features for new CRM system. Users describe their workflow, team asks questions, group prioritizes features.

### Planning Workshops

**Purpose**: Collaborative planning.

**Participants**: Project team, key stakeholders.

**Activities**:
- Review project goals
- Identify major milestones
- Discuss risks and dependencies
- Create high-level plan

**Example**: Agile PI Planning event where multiple teams plan together.

### Design Workshops

**Purpose**: Co-create solutions.

**Participants**: Designers, users, stakeholders.

**Activities**:
- Sketch ideas
- Prototype
- Get feedback
- Iterate

**Example**: Design thinking workshop where users and designers create mockups together.

### Problem-Solving Workshops

**Purpose**: Address specific challenges.

**Participants**: Relevant stakeholders and experts.

**Activities**:
- Define problem
- Brainstorm solutions
- Evaluate options
- Decide on approach

**Example**: Workshop to resolve conflict between two departments about process design.

### Workshop Best Practices

**Prepare**:
- Clear objective
- Right participants
- Materials ready
- Agenda shared in advance

**Facilitate**:
- Keep on track
- Ensure everyone participates
- Manage conflicts
- Capture decisions and action items

**Follow up**:
- Distribute notes
- Assign action items
- Track progress

## Stakeholder Interviews

**One-on-one conversations** to understand stakeholder needs and concerns.

### When to Interview

- Project initiation (understand stakeholder landscape)
- Requirements gathering (understand needs)
- Problem investigation (understand issues)
- Conflict resolution (understand perspectives)

### Interview Structure

**Introduction** (5 minutes):
- Explain purpose
- Build rapport
- Set expectations

**Main questions** (40 minutes):
- Open-ended questions
- Follow-up probes
- Active listening

**Wrap-up** (5 minutes):
- Summarize key points
- Ask if anything missed
- Explain next steps
- Thank them

### Effective Interview Questions

**Open-ended**:
- "Tell me about your role and responsibilities."
- "What are your biggest challenges?"
- "How do you envision this project helping you?"

**Probing**:
- "Can you give me an example?"
- "Tell me more about that."
- "Why is that important to you?"

**Clarifying**:
- "When you say X, do you mean...?"
- "How does that work currently?"

**Avoid leading questions**:
- Bad: "You'd like the system to be faster, right?"
- Good: "How do you feel about the current system's performance?"

### Documenting Interviews

**Capture**:
- Key points and quotes
- Requirements and expectations
- Concerns and risks
- Relationships and influences

**Share**:
- Send summary to interviewee for validation
- Incorporate into stakeholder register
- Share relevant insights with team

## Stakeholder Surveys

**Gather input from many stakeholders efficiently**.

### When to Use Surveys

- Large number of stakeholders
- Need quantitative data
- Tracking satisfaction over time
- Gathering initial input before interviews

### Survey Best Practices

**Keep it short**: 10 questions or less. Long surveys have low completion rates.

**Mix question types**:
- Multiple choice (easy to answer, easy to analyze)
- Rating scales (measure satisfaction or agreement)
- Open-ended (gather qualitative insights)

**Clear questions**: Avoid jargon, ambiguity, double-barreled questions.

**Bad**: "How satisfied are you with the speed and reliability of the system?"
(Two questions in one)

**Good**: 
- "How satisfied are you with the system's speed?"
- "How satisfied are you with the system's reliability?"

**Pilot test**: Test survey with small group before sending widely.

**Analyze and act**: Don't just collect data—analyze it and take action.

### Example Survey Questions

**Satisfaction**:
- "How satisfied are you with project communication?" (1-5 scale)

**Priorities**:
- "Which features are most important to you?" (Rank 1-5)

**Concerns**:
- "What concerns do you have about the project?" (Open-ended)

**Engagement**:
- "How would you like to be involved in the project?" (Multiple choice)

## Stakeholder Demos

**Show working product** to gather feedback and maintain engagement.

### Demo Best Practices

**Show, don't tell**: Demonstrate actual working software, not slides.

**Tell a story**: Show how user accomplishes a goal, not just features.

**Use realistic data**: Not "test test test."

**Encourage interaction**: Let stakeholders try it.

**Focus on value**: Explain benefits, not just functionality.

**Gather feedback**: Ask questions, listen to reactions.

**Example**:

Bad demo: "This is the login screen. This is the dashboard. This is the settings page."

Good demo: "Let me show you how Sarah, a sales rep, will use this. She logs in and immediately sees her top opportunities. She clicks on one and sees all the information she needs without navigating multiple screens. This saves her 10 minutes per day."

### Handling Demo Feedback

**Positive feedback**: Thank them, note what they liked.

**Negative feedback**: Don't get defensive. Ask clarifying questions. Understand the concern.

**Feature requests**: Capture them, but don't commit on the spot. "That's interesting. Let me discuss with the team and get back to you."

**Bugs**: Acknowledge, capture details, commit to investigating.

## Managing Stakeholder Expectations

**Unmet expectations cause dissatisfaction**, even if you deliver something good.

### Set Realistic Expectations

**Don't overpromise** to make stakeholders happy in the short term.

**Bad**: "We'll deliver everything in 3 months."
(When you know it will take 6 months)

**Good**: "Based on our current understanding, we estimate 6 months. We'll deliver incrementally, so you'll see value earlier."

### Clarify Scope

**What's in scope**: What you will deliver.

**What's out of scope**: What you won't deliver.

**What's uncertain**: What might be included depending on time and resources.

**Example**: "In scope: User authentication, product catalog, shopping cart. Out of scope: Recommendations, reviews, loyalty program. Uncertain: Advanced search (if time permits)."

### Manage Changing Expectations

**Expectations change** as stakeholders learn more.

**Don't resist change**—embrace it. But manage the impact.

**Process**:
1. Acknowledge new expectation
2. Assess impact (time, cost, scope)
3. Present options (add to scope, swap with something else, defer to later release)
4. Stakeholder decides
5. Update plan and communicate

**Example**: Stakeholder wants new feature mid-project. "I understand that's important. Adding it will extend the timeline by 2 weeks. We can either delay launch, or defer Feature X to the next release. Which do you prefer?"

### Communicate Constraints

**Help stakeholders understand trade-offs**.

**Triple constraint**: Scope, time, cost. You can't change one without affecting the others.

**Example**: "We can add that feature, but it will either take longer or require more resources. Which would you prefer?"

**Visual**: Show how changes affect the plan.

## Turning Stakeholders into Champions

**Champions actively promote your project**.

### Identify Potential Champions

**Characteristics**:
- Influential
- Enthusiastic about project
- Good communicators
- Respected by peers

**Example**: Department head who sees how project will help their team.

### Cultivate Champions

**Involve them**: Give them meaningful role in project.

**Inform them**: Keep them updated so they can speak knowledgeably.

**Empower them**: Let them make decisions where appropriate.

**Recognize them**: Publicly acknowledge their contributions.

**Example**: Ask champion to present project benefits to steering committee. Prepare them with talking points and data.

### Leverage Champions

**Use champions to**:
- Influence other stakeholders
- Spread positive messages
- Defend project when challenged
- Provide feedback and ideas

**Example**: When department resists change, champion from their peer department explains benefits and addresses concerns.

## Dealing with Difficult Stakeholders

**Not all stakeholders are easy to work with**.

### The Micromanager

**Behavior**: Wants to control every detail.

**Strategy**: 
- Provide frequent updates to reduce anxiety
- Involve them in planning so they feel in control
- Set boundaries on decision-making authority
- Demonstrate competence to build trust

### The Critic

**Behavior**: Finds fault with everything.

**Strategy**:
- Listen to concerns without getting defensive
- Separate legitimate concerns from personality
- Ask for specific feedback, not just complaints
- Involve them in solutions

### The Ghost

**Behavior**: Unavailable, doesn't respond, misses meetings.

**Strategy**:
- Understand why (too busy, not interested, avoiding conflict)
- Make it easy to engage (short meetings, async communication)
- Escalate if their input is critical
- Document attempts to engage

### The Blocker

**Behavior**: Actively opposes project.

**Strategy**:
- Understand their concerns (often legitimate)
- Address concerns where possible
- Find common ground
- Involve them in solutions
- If necessary, escalate to their manager

### The Flip-Flopper

**Behavior**: Changes mind frequently.

**Strategy**:
- Document decisions
- Understand why they're changing (new information, pressure from others)
- Explain impact of changes
- Establish change control process

## Stakeholder Engagement During Crisis

**When project hits crisis**, stakeholder engagement becomes critical.

### Increase Communication Frequency

**Don't go silent**—communicate more, not less.

**Example**: Switch from weekly to daily updates during crisis.

### Be Transparent

**Don't hide problems**. Stakeholders will find out anyway.

**Explain**:
- What happened
- Why it happened
- What you're doing about it
- When you expect resolution

### Focus on Solutions

**Don't just present problems**—present solutions and options.

**Example**: "We've encountered a critical bug. We can either delay launch by 1 week to fix it properly, or launch with a workaround and fix it in the next release. I recommend delaying launch. What do you think?"

### Seek Input

**Involve stakeholders in problem-solving**.

**They may have ideas or resources** you haven't considered.

### Reassure

**Acknowledge concerns** and provide confidence that you're handling it.

**Example**: "I know this is frustrating. We've dealt with similar issues before and have a plan to resolve it. I'll keep you updated daily."

## Key Takeaways

- Engagement levels: Inform (one-way), Consult (seek input), Involve (participate), Collaborate (partnership), Empower (delegate)
- Match engagement level to stakeholder power and interest
- Build relationships: get to know stakeholders personally, find common ground, be reliable, show appreciation, be responsive
- Stakeholder workshops: requirements, planning, design, problem-solving—prepare, facilitate, follow up
- Stakeholder interviews: use open-ended questions, probe for details, document insights
- Stakeholder surveys: keep short, mix question types, analyze and act on results
- Stakeholder demos: show working product, tell stories, use realistic data, gather feedback
- Manage expectations: set realistic expectations, clarify scope, manage changes, communicate constraints
- Turn stakeholders into champions: identify influential enthusiasts, involve and inform them, leverage them to influence others
- Deal with difficult stakeholders: micromanagers (provide updates), critics (listen and address concerns), ghosts (make engagement easy), blockers (understand and address concerns), flip-floppers (document decisions)
- During crisis: increase communication, be transparent, focus on solutions, seek input, reassure

In the next lesson, we'll explore stakeholder influence and negotiation.`,
    estimatedMinutes: 30,
  },
];

console.log('Seeding Level 4 lessons (1-3)...');

for (const lesson of level4Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('Level 4 lessons 1-3 seeded successfully!');

await connection.end();
