import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const lessons = [
  {
    levelId: 4,
    lessonNumber: 4,
    title: 'Managing Difficult Stakeholders',
    estimatedMinutes: 30,
    content: `# Managing Difficult Stakeholders

## Introduction

Not all stakeholders are easy to work with. Some may be resistant to change, overly demanding, or simply difficult to please. As a project manager, you need strategies to handle these challenging relationships while keeping your project on track.

## Types of Difficult Stakeholders

### The Resistant Stakeholder
- **Characteristics**: Opposes changes, clings to old ways
- **Impact**: Can slow down or block project progress
- **Approach**: Understand their concerns, involve them early, show benefits

### The Demanding Stakeholder
- **Characteristics**: Unrealistic expectations, constant requests
- **Impact**: Scope creep, team burnout
- **Approach**: Set clear boundaries, manage expectations, document agreements

### The Absent Stakeholder
- **Characteristics**: Hard to reach, misses meetings, delayed responses
- **Impact**: Decision delays, project stalls
- **Approach**: Escalate appropriately, find alternative contacts, document attempts

### The Micromanager
- **Characteristics**: Wants control over every detail
- **Impact**: Team frustration, slowed progress
- **Approach**: Provide regular updates, involve in key decisions only, build trust

## Strategies for Managing Difficult Stakeholders

### 1. Stay Professional
- Never take it personally
- Maintain composure under pressure
- Focus on project goals, not personalities

### 2. Listen Actively
- Understand their underlying concerns
- Acknowledge their perspective
- Show empathy even when you disagree

### 3. Set Clear Boundaries
- Define what's in scope and what's not
- Establish communication protocols
- Document all agreements

### 4. Find Common Ground
- Identify shared goals
- Focus on mutual benefits
- Build on areas of agreement

### 5. Escalate When Necessary
- Know when to involve senior management
- Document the issue clearly
- Propose solutions, not just problems

## Conflict Resolution Techniques

### The Interest-Based Approach
1. **Separate people from the problem**
2. **Focus on interests, not positions**
3. **Generate options for mutual gain**
4. **Use objective criteria for decisions**

### The Collaborative Approach
- Bring stakeholders together
- Facilitate open discussion
- Work toward win-win solutions
- Build long-term relationships

## Real-World Example

**Scenario**: A senior executive constantly changes requirements and expects immediate implementation.

**Solution**:
1. Schedule a one-on-one meeting
2. Acknowledge their vision and expertise
3. Explain the impact of frequent changes
4. Propose a change control process
5. Agree on a review cycle (e.g., bi-weekly)
6. Document the agreement

## Key Takeaways

- Difficult stakeholders are a normal part of project management
- Understanding their motivations is key to finding solutions
- Professional communication and clear boundaries are essential
- Sometimes escalation is necessary and appropriate
- Focus on the project's success, not winning arguments
`
  },
  {
    levelId: 4,
    lessonNumber: 5,
    title: 'Stakeholder Influence and Power',
    estimatedMinutes: 30,
    content: `# Stakeholder Influence and Power

## Understanding Stakeholder Power

Not all stakeholders have equal influence over your project. Understanding who holds power and how to work with them is crucial for project success.

## Types of Power

### Formal Power
- **Position Power**: Authority from organizational role
- **Resource Power**: Control over budget, people, or equipment
- **Decision Power**: Ability to approve or reject project elements

### Informal Power
- **Expert Power**: Influence from specialized knowledge
- **Referent Power**: Influence from relationships and respect
- **Information Power**: Control over critical project information

## Power/Interest Grid

This tool helps you understand how to engage different stakeholders based on their power and interest levels.

| Power/Interest | Low Interest | High Interest |
|----------------|--------------|---------------|
| **High Power** | Keep Satisfied | Manage Closely |
| **Low Power** | Monitor | Keep Informed |

### Manage Closely (High Power, High Interest)
- These are your key stakeholders
- Engage them frequently
- Involve in major decisions
- Build strong relationships

### Keep Satisfied (High Power, Low Interest)
- Keep them informed of major developments
- Don't overload with details
- Ensure their needs are met
- Seek their input on key decisions

### Keep Informed (Low Power, High Interest)
- Provide regular updates
- Answer their questions
- Value their input
- They can become advocates

### Monitor (Low Power, Low Interest)
- Minimal engagement required
- General communications sufficient
- Watch for changes in their position

## Building Influence

Even without formal authority, you can build influence as a project manager:

### 1. Demonstrate Competence
- Deliver on commitments
- Show expertise in your domain
- Make informed decisions

### 2. Build Relationships
- Invest time in getting to know stakeholders
- Find common interests
- Be reliable and trustworthy

### 3. Communicate Effectively
- Tailor messages to your audience
- Be clear and concise
- Listen more than you speak

### 4. Create Value
- Solve problems proactively
- Make others' jobs easier
- Deliver results consistently

### 5. Build Coalitions
- Find allies who support your project
- Create win-win situations
- Leverage networks

## Navigating Organizational Politics

### Understanding the Landscape
- Identify key decision-makers
- Understand informal power structures
- Recognize competing priorities

### Playing the Game Ethically
- Build genuine relationships
- Be transparent in your dealings
- Focus on project success, not personal gain
- Navigate politics without compromising integrity

## Managing Power Dynamics

### When You Have Less Power
- Build alliances with powerful stakeholders
- Use data and logic to support your case
- Find sponsors who can advocate for you
- Be persistent but respectful

### When You Have More Power
- Use power responsibly
- Listen to those with less power
- Avoid intimidation tactics
- Build trust through fair treatment

## Case Study: The Influential Stakeholder

**Situation**: A project manager needs approval from a powerful executive who rarely engages with projects.

**Strategy**:
1. Research the executive's priorities and concerns
2. Frame the project in terms of their goals
3. Prepare a concise, compelling case
4. Request a brief meeting through their assistant
5. Present data-driven benefits
6. Ask for specific support
7. Follow up with a summary email

**Result**: Executive becomes a project champion, opening doors and removing obstacles.

## Key Takeaways

- Power comes in many forms, both formal and informal
- Understanding power dynamics helps you navigate complex stakeholder landscapes
- You can build influence even without formal authority
- Ethical behavior and genuine relationships are the foundation of lasting influence
- Tailor your engagement strategy based on each stakeholder's power and interest
`
  },
  {
    levelId: 4,
    lessonNumber: 6,
    title: 'Stakeholder Meetings and Presentations',
    estimatedMinutes: 30,
    content: `# Stakeholder Meetings and Presentations

## The Importance of Effective Meetings

Meetings are where stakeholder engagement happens. Well-run meetings build trust, drive decisions, and move projects forward. Poorly run meetings waste time and damage credibility.

## Types of Stakeholder Meetings

### Kickoff Meetings
- **Purpose**: Launch the project, align stakeholders
- **Attendees**: All key stakeholders
- **Duration**: 1-2 hours
- **Key Elements**: Project overview, roles, expectations, next steps

### Status Update Meetings
- **Purpose**: Share progress, address issues
- **Attendees**: Core team and key stakeholders
- **Duration**: 30-60 minutes
- **Frequency**: Weekly or bi-weekly

### Decision-Making Meetings
- **Purpose**: Make critical project decisions
- **Attendees**: Decision-makers and subject matter experts
- **Duration**: 1-2 hours
- **Key Elements**: Options analysis, recommendations, decision documentation

### Review Meetings
- **Purpose**: Review deliverables, gather feedback
- **Attendees**: Relevant stakeholders and team members
- **Duration**: 1-2 hours
- **Key Elements**: Deliverable presentation, feedback collection, next steps

## Planning Effective Meetings

### Before the Meeting

1. **Define the Purpose**
   - What do you want to accomplish?
   - What decisions need to be made?
   - What information needs to be shared?

2. **Create an Agenda**
   - List topics in priority order
   - Assign time limits to each topic
   - Identify who will lead each discussion
   - Send agenda in advance

3. **Invite the Right People**
   - Only invite those who need to be there
   - Clarify roles (decision-maker, contributor, observer)
   - Consider time zones for distributed teams

4. **Prepare Materials**
   - Create clear, concise presentations
   - Share materials in advance when possible
   - Test technology for virtual meetings

### During the Meeting

1. **Start Strong**
   - Begin on time
   - Review the agenda and objectives
   - Set ground rules (e.g., one person speaks at a time)

2. **Facilitate Effectively**
   - Keep discussions on track
   - Encourage participation from all attendees
   - Manage dominant personalities
   - Park off-topic items for later

3. **Drive to Decisions**
   - Summarize options clearly
   - Identify decision-makers
   - Document decisions and rationale
   - Assign action items with owners and deadlines

4. **Manage Time**
   - Keep an eye on the clock
   - Move through agenda items efficiently
   - End on time (or early!)

### After the Meeting

1. **Send Meeting Notes**
   - Summarize key discussions
   - Document decisions made
   - List action items with owners and due dates
   - Share within 24 hours

2. **Follow Up**
   - Track action item completion
   - Address any outstanding questions
   - Schedule next meeting if needed

## Presentation Best Practices

### Know Your Audience
- What do they care about?
- What's their level of technical knowledge?
- What concerns might they have?
- What decisions do they need to make?

### Structure Your Presentation

**The Executive Summary Approach**:
1. **Start with the bottom line** (recommendation or key message)
2. **Provide supporting evidence**
3. **Address potential concerns**
4. **End with clear next steps**

### Design Effective Slides

**Do**:
- Use clear, large fonts
- Include visuals (charts, diagrams, images)
- Limit text (6 lines per slide maximum)
- Use consistent formatting
- Number your slides

**Don't**:
- Cram too much information on one slide
- Use tiny fonts
- Read slides word-for-word
- Use distracting animations
- Overuse bullet points

### Delivery Tips

1. **Practice**
   - Rehearse your presentation
   - Time yourself
   - Anticipate questions

2. **Engage Your Audience**
   - Make eye contact
   - Use conversational language
   - Tell stories and use examples
   - Pause for questions

3. **Handle Questions Confidently**
   - Listen carefully to the question
   - Repeat or rephrase if needed
   - Answer concisely
   - Admit when you don't know something
   - Offer to follow up

## Virtual Meeting Considerations

### Technology
- Test your setup in advance
- Have a backup plan
- Mute when not speaking
- Use video when possible

### Engagement
- More difficult to read the room virtually
- Use polls and chat features
- Call on people by name
- Take more frequent breaks

## Handling Difficult Situations

### The Meeting Hijacker
- **Issue**: Someone dominates the discussion
- **Solution**: "Thank you for that input. Let's hear from others."

### The Silent Participant
- **Issue**: Key stakeholder isn't contributing
- **Solution**: "Sarah, I'd love to hear your perspective on this."

### The Off-Topic Discussion
- **Issue**: Conversation drifts from the agenda
- **Solution**: "That's important. Let's add it to the parking lot and come back to it."

### The Unprepared Attendee
- **Issue**: Someone hasn't reviewed materials
- **Solution**: Provide a quick summary, then move forward

## Key Takeaways

- Effective meetings are essential for stakeholder engagement
- Preparation is the key to meeting success
- Know your audience and tailor your message
- Keep presentations clear, concise, and visual
- Follow up promptly with notes and action items
- Virtual meetings require extra attention to engagement
`
  },
  {
    levelId: 4,
    lessonNumber: 7,
    title: 'Building Trust with Stakeholders',
    estimatedMinutes: 30,
    content: `# Building Trust with Stakeholders

## Why Trust Matters

Trust is the foundation of effective stakeholder relationships. When stakeholders trust you, they:
- Give you the benefit of the doubt
- Support your decisions
- Provide resources more readily
- Forgive mistakes
- Become project advocates

Without trust, even small issues can become major obstacles.

## The Trust Equation

Trust can be broken down into four components:

**Trust = (Credibility + Reliability + Intimacy) / Self-Orientation**

### Credibility
- Do stakeholders believe you know what you're talking about?
- Demonstrated through expertise, experience, and competence

### Reliability
- Do you do what you say you'll do?
- Demonstrated through consistent follow-through

### Intimacy
- Do stakeholders feel safe sharing concerns with you?
- Demonstrated through confidentiality and empathy

### Self-Orientation
- Do stakeholders believe you have their best interests in mind?
- Lower self-orientation increases trust

## Building Credibility

### Demonstrate Competence
- Know your subject matter
- Stay current with industry trends
- Speak confidently about your domain
- Admit when you don't know something

### Show Your Track Record
- Share relevant past successes
- Provide references if appropriate
- Highlight lessons learned from previous projects

### Be Prepared
- Come to meetings ready
- Have data to support your positions
- Anticipate questions and concerns

## Building Reliability

### Do What You Say
- Make commitments carefully
- Follow through consistently
- If you can't deliver, communicate early

### Be Consistent
- Maintain steady communication
- Apply standards fairly
- Show up reliably

### Meet Deadlines
- Deliver on time
- If delays are unavoidable, warn stakeholders early
- Explain what happened and how you'll prevent it

## Building Intimacy

### Listen Actively
- Give stakeholders your full attention
- Ask clarifying questions
- Reflect back what you hear

### Show Empathy
- Acknowledge stakeholders' concerns
- Validate their feelings
- Put yourself in their shoes

### Be Vulnerable
- Admit mistakes
- Ask for help when needed
- Share appropriate personal information

### Maintain Confidentiality
- Keep sensitive information private
- Don't gossip
- Be discreet about stakeholder concerns

## Reducing Self-Orientation

### Focus on Their Needs
- Ask about their goals and concerns
- Frame project benefits in their terms
- Look for win-win solutions

### Be Genuinely Curious
- Ask questions to understand, not to respond
- Show interest in their perspective
- Learn about their world

### Give Credit Generously
- Acknowledge others' contributions
- Share success with the team
- Avoid taking sole credit

### Be Transparent
- Share information openly
- Explain your reasoning
- Admit when you have competing interests

## Recovering from Trust Breaches

Even the best project managers make mistakes. When trust is damaged:

### 1. Acknowledge the Problem
- Don't make excuses
- Take responsibility
- Be specific about what went wrong

### 2. Apologize Sincerely
- Express genuine regret
- Avoid "but" statements
- Focus on the impact, not your intentions

### 3. Explain What Happened
- Provide context without making excuses
- Be honest about contributing factors
- Take ownership of your part

### 4. Make It Right
- Propose a solution
- Ask what would help
- Follow through on commitments

### 5. Prevent Recurrence
- Explain what you'll do differently
- Implement new processes if needed
- Demonstrate changed behavior

## Trust-Building Behaviors

### Daily Actions That Build Trust
- Return calls and emails promptly
- Be on time for meetings
- Follow through on small commitments
- Share credit for successes
- Admit mistakes quickly
- Keep stakeholders informed
- Ask for input before making decisions
- Treat everyone with respect

### Trust-Destroying Behaviors to Avoid
- Making promises you can't keep
- Hiding bad news
- Taking credit for others' work
- Gossiping about stakeholders
- Being consistently late
- Ignoring stakeholder concerns
- Making decisions without consultation
- Playing favorites

## Building Trust Across Cultures

### Be Aware of Differences
- Trust-building varies by culture
- Some cultures trust based on relationships
- Others trust based on competence
- Research cultural norms for your stakeholders

### Show Respect
- Learn basic customs and etiquette
- Be patient with language barriers
- Avoid assumptions based on stereotypes

## The Long Game

Trust takes time to build and seconds to destroy. Think of trust as a bank account:

- **Deposits**: Keeping promises, showing competence, demonstrating care
- **Withdrawals**: Missed deadlines, poor communication, self-serving behavior

Make more deposits than withdrawals, and you'll have trust to draw on when you need it.

## Key Takeaways

- Trust is built through credibility, reliability, intimacy, and low self-orientation
- Small, consistent actions build trust over time
- Recovering from trust breaches requires acknowledgment, apology, and changed behavior
- Cultural awareness is important in building trust across diverse stakeholder groups
- Trust is your most valuable asset as a project manager
`
  },
  {
    levelId: 4,
    lessonNumber: 8,
    title: 'Managing Stakeholder Expectations',
    estimatedMinutes: 30,
    content: `# Managing Stakeholder Expectations

## The Expectation Gap

The difference between what stakeholders expect and what they receive is where project dissatisfaction lives. Even successful projects can be perceived as failures if expectations aren't managed properly.

## Setting Expectations Early

### The Kickoff Meeting
This is your opportunity to align everyone on:
- **Project scope**: What's included and what's not
- **Timeline**: When deliverables will be ready
- **Quality standards**: What "done" looks like
- **Communication**: How and when updates will be provided
- **Decision-making**: Who decides what and when

### Document Everything
- Create a project charter
- Get sign-off on scope
- Document assumptions
- Clarify constraints
- Define success criteria

## Common Expectation Mismatches

### Timeline Expectations
**Stakeholder thinks**: "This should be done in a month."
**Reality**: It will take three months.

**Solution**: 
- Break down the work to show complexity
- Explain dependencies
- Provide a realistic timeline with milestones
- Show the trade-offs (faster = more resources or reduced scope)

### Scope Expectations
**Stakeholder thinks**: "This includes everything I might need."
**Reality**: The scope is limited to specific deliverables.

**Solution**:
- Define scope clearly with examples
- Explicitly list what's out of scope
- Explain the change control process
- Provide estimates for additional requests

### Quality Expectations
**Stakeholder thinks**: "This will be perfect and polished."
**Reality**: It will meet requirements but may have limitations.

**Solution**:
- Define quality standards upfront
- Show examples of what to expect
- Explain trade-offs between quality, time, and cost
- Set realistic expectations for the first version

### Communication Expectations
**Stakeholder thinks**: "I'll be involved in every decision."
**Reality**: You'll be consulted on major decisions only.

**Solution**:
- Define communication frequency and channels
- Clarify decision-making authority
- Set expectations for response times
- Explain escalation procedures

## The Art of Saying No

Sometimes you need to say no to stakeholder requests. Here's how to do it constructively:

### 1. Acknowledge the Request
"I understand why this feature would be valuable."

### 2. Explain the Impact
"Adding this would delay the launch by two months and require three additional developers."

### 3. Offer Alternatives
"We could include a simplified version in the initial release, or add it to phase two."

### 4. Let Them Decide
"Given these trade-offs, what would you prefer?"

## Managing Changing Expectations

### When Stakeholders Want More
- Refer back to the original scope
- Explain the change control process
- Provide impact analysis (time, cost, resources)
- Get formal approval for changes

### When You Need to Adjust Expectations
- Communicate early
- Be honest about the situation
- Provide options and recommendations
- Focus on solutions, not excuses

## The Expectation Conversation Framework

Use this framework for difficult expectation conversations:

### 1. State the Facts
"The testing phase has uncovered more issues than anticipated."

### 2. Explain the Impact
"This means we'll need an additional two weeks before launch."

### 3. Provide Context
"This is actually common for projects of this complexity, and it's better to address issues now than after launch."

### 4. Offer Solutions
"We can either delay the launch by two weeks, or launch with known limitations and fix them in the next release."

### 5. Seek Input
"What would work best for your needs?"

## Proactive Expectation Management

### Regular Updates
- Don't wait for stakeholders to ask
- Share progress consistently
- Highlight both successes and challenges
- Use a standard format for updates

### Early Warning System
- Flag potential issues as soon as you see them
- Don't wait until problems become crises
- Provide options, not just problems
- Give stakeholders time to adjust

### Celebrate Wins
- Acknowledge milestones
- Share successes
- Thank stakeholders for their support
- Build positive momentum

## Managing Unrealistic Expectations

### The Optimistic Stakeholder
- Use data to ground discussions
- Show historical project timelines
- Break down work to reveal complexity
- Involve them in planning

### The Demanding Stakeholder
- Set clear boundaries
- Document all agreements
- Use the change control process
- Escalate if necessary

### The Uninformed Stakeholder
- Educate about project management processes
- Explain constraints and trade-offs
- Provide context for decisions
- Be patient and clear

## Expectation Management Tools

### RACI Matrix
Clarifies who is:
- **Responsible**: Does the work
- **Accountable**: Ultimately answerable
- **Consulted**: Provides input
- **Informed**: Kept updated

### Status Reports
- Consistent format
- Clear progress indicators (red/yellow/green)
- Highlights and lowlights
- Upcoming milestones
- Issues and risks

### Project Dashboard
- Visual representation of progress
- Key metrics at a glance
- Trend information
- Easy to understand

## The Power of Underpromising and Overdelivering

### Underpromise
- Build in buffer time
- Set conservative estimates
- Account for unknowns
- Prepare for setbacks

### Overdeliver
- Deliver early when possible
- Exceed quality expectations
- Provide unexpected value
- Surprise stakeholders positively

**Note**: This doesn't mean being dishonest. It means being realistic and conservative in your commitments.

## Key Takeaways

- Set clear expectations early and document them
- Common mismatches occur around timeline, scope, quality, and communication
- Learn to say no constructively when necessary
- Manage changing expectations proactively
- Use regular updates and early warnings to keep stakeholders aligned
- Underpromise and overdeliver when possible
- The expectation gap is where project dissatisfaction lives—manage it actively
`
  },
  {
    levelId: 4,
    lessonNumber: 9,
    title: 'Stakeholder Engagement Throughout the Project Lifecycle',
    estimatedMinutes: 30,
    content: `# Stakeholder Engagement Throughout the Project Lifecycle

## Engagement Varies by Phase

Stakeholder engagement isn't one-size-fits-all. Different project phases require different levels and types of engagement.

## Initiation Phase

### Primary Goals
- Identify all stakeholders
- Understand their interests and concerns
- Secure buy-in and support
- Establish communication channels

### Key Activities

**Stakeholder Identification**
- Cast a wide net initially
- Consider both obvious and hidden stakeholders
- Think about who will be impacted
- Identify potential opponents and champions

**Initial Engagement**
- One-on-one meetings with key stakeholders
- Understand their goals and concerns
- Explain the project vision
- Ask for their support

**Kickoff Meeting**
- Bring stakeholders together
- Present the project charter
- Clarify roles and responsibilities
- Set expectations for engagement

### Engagement Level
**High** - This is when you build the foundation for all future engagement.

## Planning Phase

### Primary Goals
- Gather detailed requirements
- Validate plans and assumptions
- Secure approvals
- Build consensus

### Key Activities

**Requirements Gathering**
- Workshops with stakeholders
- Interviews with subject matter experts
- Surveys for broader input
- Document and validate requirements

**Plan Review**
- Share draft plans for feedback
- Conduct review sessions
- Address concerns and questions
- Obtain formal approvals

**Resource Commitment**
- Secure commitments for resources
- Clarify availability and allocation
- Confirm budget approvals
- Finalize team assignments

### Engagement Level
**High** - Stakeholder input shapes the entire project.

## Execution Phase

### Primary Goals
- Keep stakeholders informed
- Manage expectations
- Address issues promptly
- Maintain support

### Key Activities

**Regular Updates**
- Status meetings (weekly or bi-weekly)
- Written status reports
- Dashboard updates
- Informal check-ins

**Issue Management**
- Communicate problems early
- Provide options and recommendations
- Seek input on major decisions
- Keep stakeholders informed of resolutions

**Change Management**
- Process change requests
- Assess impact
- Obtain approvals
- Communicate changes

**Milestone Celebrations**
- Recognize achievements
- Thank stakeholders for support
- Build momentum
- Maintain enthusiasm

### Engagement Level
**Medium** - Regular but less intensive than planning.

## Monitoring and Controlling Phase

### Primary Goals
- Report on progress
- Address variances
- Manage scope creep
- Keep project on track

### Key Activities

**Performance Reporting**
- Share metrics and KPIs
- Explain variances
- Provide trend analysis
- Highlight risks

**Stakeholder Feedback**
- Regular check-ins
- Pulse surveys
- Feedback sessions
- Adjust engagement as needed

**Risk Communication**
- Alert stakeholders to risks
- Discuss mitigation strategies
- Seek input on major risks
- Keep them informed of risk status

### Engagement Level
**Medium** - Consistent monitoring and communication.

## Closing Phase

### Primary Goals
- Obtain acceptance
- Gather lessons learned
- Celebrate success
- Transition to operations

### Key Activities

**Deliverable Acceptance**
- Formal review sessions
- Sign-off meetings
- Documentation handover
- Training and knowledge transfer

**Lessons Learned**
- Retrospective meetings
- Stakeholder feedback surveys
- Document what worked and what didn't
- Share insights for future projects

**Celebration**
- Recognition event
- Thank stakeholders
- Celebrate the team
- Mark the achievement

**Transition**
- Handover to operations
- Ongoing support planning
- Stakeholder relationship maintenance
- Close out communications

### Engagement Level
**High** - Critical for closure and future relationships.

## Adapting Engagement Strategies

### High-Interest, High-Power Stakeholders
- **Initiation**: Extensive one-on-one time
- **Planning**: Deep involvement in decisions
- **Execution**: Regular updates and consultations
- **Closing**: Formal acceptance and recognition

### High-Power, Low-Interest Stakeholders
- **Initiation**: Brief but impactful engagement
- **Planning**: Review and approval of key decisions
- **Execution**: Exception-based updates
- **Closing**: Formal sign-off

### Low-Power, High-Interest Stakeholders
- **Initiation**: Include in kickoff
- **Planning**: Gather their input
- **Execution**: Regular detailed updates
- **Closing**: Thank for their contributions

### Low-Power, Low-Interest Stakeholders
- **Initiation**: General awareness
- **Planning**: Minimal involvement
- **Execution**: Periodic updates
- **Closing**: General communication

## Common Engagement Pitfalls

### Over-Engagement
- **Problem**: Too many meetings, too much information
- **Impact**: Stakeholder fatigue, decreased responsiveness
- **Solution**: Tailor engagement to stakeholder needs

### Under-Engagement
- **Problem**: Insufficient communication, surprises
- **Impact**: Loss of support, resistance to project
- **Solution**: Increase touchpoints, proactive updates

### Inconsistent Engagement
- **Problem**: Irregular communication, unpredictable involvement
- **Impact**: Confusion, loss of trust
- **Solution**: Establish and maintain regular cadence

### One-Size-Fits-All Approach
- **Problem**: Same engagement for all stakeholders
- **Impact**: Inefficiency, stakeholder dissatisfaction
- **Solution**: Segment stakeholders and tailor approach

## Maintaining Engagement Over Time

### Combat Stakeholder Fatigue
- Keep meetings focused and efficient
- Vary communication methods
- Make updates interesting and relevant
- Celebrate progress

### Re-Engage Disengaged Stakeholders
- Reach out personally
- Understand why they've disengaged
- Address their concerns
- Find new ways to involve them

### Manage New Stakeholders
- Bring them up to speed quickly
- Provide project history and context
- Integrate them into existing processes
- Update stakeholder register

## Engagement Metrics

Track these to ensure effective engagement:

- **Meeting attendance rates**
- **Response times to communications**
- **Stakeholder satisfaction scores**
- **Number of escalations**
- **Change request frequency**
- **Issue resolution time**

## Tools for Ongoing Engagement

### Communication Plan
- Who needs what information
- How often
- Through what channels
- In what format

### Stakeholder Register
- Keep it updated
- Track engagement history
- Note preferences and concerns
- Monitor power and interest shifts

### Engagement Calendar
- Schedule regular touchpoints
- Plan for key milestones
- Coordinate meetings
- Avoid over-scheduling

## Key Takeaways

- Stakeholder engagement needs vary by project phase
- Initiation and closing require high engagement
- Execution requires consistent but less intensive engagement
- Tailor your approach to each stakeholder's power and interest
- Avoid over-engagement, under-engagement, and inconsistency
- Track engagement metrics to ensure effectiveness
- Maintain engagement over time through variety and relevance
`
  },
  {
    levelId: 4,
    lessonNumber: 10,
    title: 'Stakeholder Communication Channels',
    estimatedMinutes: 30,
    content: `# Stakeholder Communication Channels

## Choosing the Right Channel

The medium is part of the message. Choosing the right communication channel can make the difference between effective engagement and wasted effort.

## Communication Channel Options

### Face-to-Face Meetings

**Best For**:
- Building relationships
- Discussing sensitive topics
- Complex discussions requiring collaboration
- Kickoff meetings
- Conflict resolution

**Advantages**:
- Richest form of communication
- Immediate feedback
- Non-verbal cues visible
- Builds trust quickly

**Disadvantages**:
- Time-consuming
- Scheduling challenges
- Not always possible (remote teams)
- Can be intimidating for some

**Best Practices**:
- Schedule in advance
- Have a clear agenda
- Minimize distractions
- Follow up in writing

### Video Conferencing

**Best For**:
- Remote team meetings
- Status updates
- Presentations
- Workshops and brainstorming

**Advantages**:
- Visual connection
- Convenient for distributed teams
- Can share screens
- Recordable

**Disadvantages**:
- Technical issues
- "Zoom fatigue"
- Harder to read body language
- Time zone challenges

**Best Practices**:
- Test technology beforehand
- Use video (not just audio)
- Mute when not speaking
- Engage participants actively

### Phone Calls

**Best For**:
- Quick updates
- Urgent matters
- Personal check-ins
- When visual isn't necessary

**Advantages**:
- Immediate
- Personal
- No technical setup
- Can multitask (sometimes)

**Disadvantages**:
- No visual cues
- Can be interruptive
- No written record
- Easy to misunderstand

**Best Practices**:
- Ask if it's a good time
- Be concise
- Follow up with email summary
- Take notes

### Email

**Best For**:
- Formal communications
- Detailed information
- Documentation
- Non-urgent matters

**Advantages**:
- Written record
- Can be thoughtful and precise
- Convenient for recipients
- Can include attachments

**Disadvantages**:
- Can be misinterpreted
- Easy to ignore
- Can create information overload
- No immediate feedback

**Best Practices**:
- Clear subject lines
- Keep it concise
- Use bullet points
- Specify action items and deadlines

### Instant Messaging (Slack, Teams, etc.)

**Best For**:
- Quick questions
- Informal updates
- Team collaboration
- Real-time coordination

**Advantages**:
- Fast
- Informal and friendly
- Easy to share files
- Searchable history

**Disadvantages**:
- Can be distracting
- Expectation of immediate response
- Not suitable for complex topics
- Can create information silos

**Best Practices**:
- Use channels appropriately
- Don't expect immediate responses
- Escalate to other channels when needed
- Keep it professional

### Project Management Tools

**Best For**:
- Task tracking
- Progress updates
- Document sharing
- Collaborative work

**Advantages**:
- Centralized information
- Real-time updates
- Transparency
- Audit trail

**Disadvantages**:
- Requires training
- Can be overwhelming
- Not all stakeholders may use it
- Tool-dependent

**Best Practices**:
- Keep it updated
- Use consistent naming conventions
- Provide training
- Don't overload with features

### Status Reports

**Best For**:
- Regular progress updates
- Executive summaries
- Formal documentation
- Consistent communication

**Advantages**:
- Structured format
- Easy to scan
- Historical record
- Can be templated

**Disadvantages**:
- Can become routine/ignored
- Time-consuming to create
- One-way communication
- May lack detail

**Best Practices**:
- Use consistent format
- Include visuals
- Highlight key points
- Keep it concise

### Presentations

**Best For**:
- Project reviews
- Milestone updates
- Decision-making meetings
- Large group updates

**Advantages**:
- Visual and engaging
- Can convey complex information
- Good for storytelling
- Memorable

**Disadvantages**:
- Time-consuming to prepare
- Can be one-directional
- Technical issues possible
- May oversimplify

**Best Practices**:
- Know your audience
- Use visuals effectively
- Practice beforehand
- Allow time for questions

### Dashboards

**Best For**:
- Real-time status
- Metrics and KPIs
- Executive visibility
- Trend analysis

**Advantages**:
- Always current
- Visual and intuitive
- Self-service for stakeholders
- Reduces meeting time

**Disadvantages**:
- Requires setup and maintenance
- Can be misinterpreted without context
- Technical barriers
- May not show full picture

**Best Practices**:
- Keep it simple
- Use clear labels
- Update regularly
- Provide context

## Matching Channels to Stakeholders

### Executives
- **Preferred**: Brief emails, dashboards, executive summaries
- **Frequency**: Exception-based or monthly
- **Format**: High-level, visual, action-oriented

### Sponsors
- **Preferred**: Face-to-face meetings, presentations, formal reports
- **Frequency**: Regular (bi-weekly or monthly)
- **Format**: Strategic, decision-focused

### Team Members
- **Preferred**: IM, project tools, team meetings
- **Frequency**: Daily or as needed
- **Format**: Detailed, collaborative, informal

### End Users
- **Preferred**: Email, training sessions, user guides
- **Frequency**: Key milestones
- **Format**: Practical, user-focused, clear

## Communication Channel Matrix

| Stakeholder Type | Primary Channel | Secondary Channel | Frequency |
|-----------------|----------------|-------------------|-----------|
| Executive Sponsor | Face-to-face | Email summary | Monthly |
| Project Sponsor | Video meeting | Status report | Bi-weekly |
| Steering Committee | Presentation | Dashboard | Monthly |
| Project Team | IM / Project tool | Team meeting | Daily |
| Subject Matter Experts | Email | Phone | As needed |
| End Users | Email | Training | Milestone-based |

## Multi-Channel Strategy

Don't rely on a single channel. Use multiple channels for important messages:

### Example: Major Milestone Announcement

1. **Email**: Detailed announcement with context
2. **Team Meeting**: Discussion and Q&A
3. **IM**: Quick reminder and celebration
4. **Dashboard**: Visual progress update
5. **Status Report**: Formal documentation

## Channel Selection Criteria

Consider these factors when choosing a channel:

### Urgency
- **Urgent**: Phone, IM, face-to-face
- **Not urgent**: Email, status report

### Complexity
- **Complex**: Face-to-face, video meeting, presentation
- **Simple**: Email, IM

### Sensitivity
- **Sensitive**: Face-to-face, phone
- **Not sensitive**: Email, IM

### Audience Size
- **Large**: Email, presentation, dashboard
- **Small**: Face-to-face, video meeting

### Formality
- **Formal**: Email, presentation, status report
- **Informal**: IM, phone

### Documentation Needs
- **High**: Email, status report, project tool
- **Low**: Phone, IM, face-to-face

## Communication Overload

### Signs of Overload
- Stakeholders stop responding
- Meeting attendance drops
- Emails go unread
- Complaints about "too many meetings"

### Solutions
- Consolidate communications
- Use more efficient channels
- Reduce frequency
- Make communications more valuable

## Key Takeaways

- Different channels serve different purposes
- Match the channel to the message and audience
- Use multiple channels for important messages
- Consider urgency, complexity, and formality when choosing channels
- Avoid communication overload by being strategic
- Document important communications regardless of channel
- Adapt your channel mix based on stakeholder feedback
`
  },
  {
    levelId: 4,
    lessonNumber: 11,
    title: 'Stakeholder Feedback and Continuous Improvement',
    estimatedMinutes: 30,
    content: `# Stakeholder Feedback and Continuous Improvement

## The Value of Stakeholder Feedback

Your stakeholders are your customers. Their feedback is essential for:
- Improving project outcomes
- Building better relationships
- Identifying issues early
- Demonstrating that you value their input
- Continuous improvement

## Types of Feedback

### Formal Feedback

**Surveys**
- Structured questions
- Quantitative and qualitative data
- Can be anonymous
- Easy to analyze

**Review Meetings**
- Scheduled feedback sessions
- Structured agenda
- Documented outcomes
- Action items identified

**Performance Reviews**
- Formal assessment of project performance
- Typically at milestones or project end
- Includes metrics and KPIs
- Documented for future reference

### Informal Feedback

**Casual Conversations**
- Hallway chats
- Coffee meetings
- Quick check-ins
- Often more honest

**Body Language and Tone**
- Non-verbal cues in meetings
- Email tone
- Response times
- Engagement levels

**Indirect Signals**
- Meeting attendance
- Response rates
- Escalations
- Resistance to decisions

## Gathering Feedback Effectively

### Timing Matters

**Throughout the Project**
- Don't wait until the end
- Regular pulse checks
- After major milestones
- When issues arise

**End of Project**
- Formal lessons learned
- Comprehensive review
- Future improvement focus

### Ask the Right Questions

**Good Questions**:
- "What's working well that we should continue?"
- "What could we improve?"
- "What surprised you (positively or negatively)?"
- "How can I better support you?"
- "What would you do differently?"

**Poor Questions**:
- "Everything's going great, right?" (leading)
- "Are you happy?" (too vague)
- "What's wrong?" (negative framing)

### Create a Safe Environment

**For Honest Feedback**:
- Emphasize that you want to improve
- Don't get defensive
- Thank people for critical feedback
- Act on feedback received
- Consider anonymous options for sensitive topics

### Multiple Methods

Use various approaches to gather comprehensive feedback:

1. **One-on-one conversations** - Personal and detailed
2. **Surveys** - Broad and quantifiable
3. **Group discussions** - Collaborative and generative
4. **Observation** - Unspoken feedback
5. **Metrics** - Objective data

## Stakeholder Satisfaction Surveys

### Key Areas to Assess

**Communication**
- Frequency and timeliness
- Clarity and relevance
- Responsiveness
- Channel effectiveness

**Project Management**
- Planning and organization
- Issue resolution
- Change management
- Risk management

**Relationship**
- Trust and respect
- Accessibility
- Understanding of needs
- Collaboration

**Outcomes**
- Meeting objectives
- Quality of deliverables
- Value delivered
- Expectations management

### Sample Survey Questions

**Rating Scale (1-5)**:
- "How satisfied are you with the frequency of project updates?"
- "How well does the project team understand your needs?"
- "How effectively are issues and risks being managed?"
- "How likely are you to recommend this project team to others?"

**Open-Ended**:
- "What is the project team doing well?"
- "What could be improved?"
- "What concerns do you have about the project?"

## Processing Feedback

### Analyze Patterns

Look for:
- **Recurring themes** - Multiple stakeholders mentioning the same issue
- **Outliers** - Unique perspectives that might reveal blind spots
- **Trends** - Changes over time
- **Contradictions** - Conflicting feedback that needs reconciliation

### Prioritize Actions

Not all feedback requires immediate action. Prioritize based on:
- **Impact**: How much will addressing this improve the project?
- **Feasibility**: Can we realistically address this?
- **Urgency**: How quickly does this need to be addressed?
- **Frequency**: How many stakeholders mentioned this?

### Create an Action Plan

For each piece of feedback you'll address:
1. **What** will you do?
2. **Why** is this important?
3. **Who** is responsible?
4. **When** will it be done?
5. **How** will you measure success?

## Closing the Feedback Loop

### Communicate What You Heard

"Thank you for your feedback. Here's what we heard:
- Many of you want more frequent updates
- Some feel the technical details are too complex
- Several mentioned the meetings are too long"

### Share Your Action Plan

"Based on your feedback, here's what we're going to do:
- Increase status updates from monthly to bi-weekly
- Create two versions of updates: executive summary and technical details
- Limit meetings to 45 minutes with strict agendas"

### Follow Through

- Implement the changes you committed to
- Track progress
- Update stakeholders on improvements
- Ask for feedback on the changes

### Explain What You Can't Address

"We heard your request for daily updates, but given the project's complexity and team size, that's not feasible. Instead, we'll provide bi-weekly updates and make ourselves available for questions anytime."

## Handling Negative Feedback

### Don't Take It Personally

- Feedback is about the project, not you
- Negative feedback is a gift—it helps you improve
- Defensiveness shuts down communication

### Respond Constructively

**Instead of**: "That's not true. We've been very responsive."
**Try**: "I hear that you feel we haven't been responsive enough. Can you give me a specific example so I can understand better?"

### Dig Deeper

- Ask clarifying questions
- Understand the root cause
- Explore the impact
- Seek suggestions for improvement

## Continuous Improvement Cycle

### 1. Gather Feedback
- Regular pulse checks
- Formal surveys
- Informal conversations
- Observation

### 2. Analyze
- Identify patterns
- Prioritize issues
- Understand root causes

### 3. Plan
- Develop action plans
- Assign responsibilities
- Set timelines

### 4. Implement
- Make changes
- Communicate updates
- Train if needed

### 5. Measure
- Track improvements
- Gather new feedback
- Assess impact

### 6. Repeat
- Continuous cycle
- Always improving
- Never "done"

## Building a Feedback Culture

### Lead by Example

- Ask for feedback regularly
- Act on feedback visibly
- Thank people for feedback
- Share what you've learned

### Make It Easy

- Provide multiple channels
- Remove barriers
- Respond promptly
- Show appreciation

### Celebrate Improvements

- Highlight changes made based on feedback
- Thank stakeholders for their input
- Share success stories
- Recognize team members who act on feedback

## Feedback Metrics

Track these to ensure you're gathering and using feedback effectively:

- **Response rate** to surveys
- **Time to act** on feedback
- **Stakeholder satisfaction** trends
- **Number of improvements** implemented
- **Repeat feedback** (same issues recurring?)

## Common Feedback Pitfalls

### Asking But Not Acting
- **Problem**: Gathering feedback but not using it
- **Impact**: Stakeholders stop providing feedback, trust erodes
- **Solution**: Only ask if you're willing to act

### Defensive Responses
- **Problem**: Getting defensive when receiving criticism
- **Impact**: Stakeholders stop being honest
- **Solution**: Practice receiving feedback gracefully

### Feedback Overload
- **Problem**: Too many surveys, too many questions
- **Impact**: Survey fatigue, declining response rates
- **Solution**: Be selective and strategic

### Ignoring Informal Feedback
- **Problem**: Only valuing formal feedback
- **Impact**: Missing important signals
- **Solution**: Pay attention to all feedback channels

## Key Takeaways

- Stakeholder feedback is essential for project success
- Use multiple methods to gather comprehensive feedback
- Create a safe environment for honest input
- Analyze feedback for patterns and prioritize actions
- Close the loop by communicating what you heard and what you'll do
- Handle negative feedback constructively
- Build a continuous improvement cycle
- Make feedback a regular part of your project culture
- Act on feedback to build trust and improve outcomes
`
  },
  {
    levelId: 4,
    lessonNumber: 12,
    title: 'Stakeholder Management Mastery',
    estimatedMinutes: 30,
    content: `# Stakeholder Management Mastery

## Bringing It All Together

You've learned the individual components of stakeholder management. Now let's integrate them into a comprehensive approach that will make you a master stakeholder manager.

## The Stakeholder Management Framework

### 1. Identify
- Cast a wide net
- Consider all potential stakeholders
- Look beyond the obvious
- Think about indirect impacts

### 2. Analyze
- Assess power and interest
- Understand motivations
- Identify concerns and expectations
- Map relationships

### 3. Plan
- Develop engagement strategies
- Choose communication channels
- Set engagement frequency
- Assign responsibilities

### 4. Engage
- Build relationships
- Communicate effectively
- Manage expectations
- Handle conflicts

### 5. Monitor
- Track engagement effectiveness
- Gather feedback
- Watch for changes
- Adjust strategies

### 6. Improve
- Learn from experience
- Implement improvements
- Share lessons learned
- Continuously refine

## Advanced Stakeholder Strategies

### Building Coalitions

Don't manage stakeholders in isolation. Build alliances:

**Identify Natural Allies**
- Who shares your goals?
- Who benefits from project success?
- Who has complementary interests?

**Create Win-Win Situations**
- Find mutual benefits
- Share credit and success
- Support others' initiatives
- Build reciprocal relationships

**Leverage Networks**
- Understand informal power structures
- Use your allies' connections
- Build bridges between stakeholders
- Create a web of support

### Managing Stakeholder Politics

**Navigate Carefully**
- Understand the political landscape
- Be aware of competing agendas
- Stay neutral in organizational conflicts
- Focus on project success

**Build Political Capital**
- Deliver on commitments
- Build trust widely
- Be seen as fair and objective
- Accumulate goodwill

**Use Politics Ethically**
- Never manipulate or deceive
- Be transparent in your dealings
- Build genuine relationships
- Maintain your integrity

### Influencing Without Authority

As a project manager, you often need to influence people you don't control:

**Expert Power**
- Demonstrate competence
- Share knowledge generously
- Be the go-to person
- Build credibility

**Referent Power**
- Build strong relationships
- Be likeable and trustworthy
- Show genuine interest in others
- Create positive associations

**Information Power**
- Control key information flows
- Be the communication hub
- Share information strategically
- Make yourself indispensable

## Stakeholder Management Across Project Types

### Agile Projects

**Key Differences**:
- Product owner as primary stakeholder representative
- More frequent stakeholder interaction
- Iterative feedback loops
- Flexible scope

**Strategies**:
- Involve stakeholders in sprint reviews
- Use product backlog for prioritization
- Embrace changing requirements
- Focus on delivering value incrementally

### Waterfall Projects

**Key Differences**:
- More formal stakeholder engagement
- Defined approval gates
- Less frequent interaction
- Fixed scope

**Strategies**:
- Thorough upfront requirements gathering
- Formal sign-offs at each phase
- Structured change control
- Regular status reporting

### Large, Complex Projects

**Key Differences**:
- Many stakeholders with diverse interests
- Complex power dynamics
- Multiple levels of engagement
- Higher stakes

**Strategies**:
- Segment stakeholders into groups
- Use a tiered engagement approach
- Delegate stakeholder management
- Create a stakeholder management team

### Small, Fast-Paced Projects

**Key Differences**:
- Fewer stakeholders
- Informal processes
- Rapid decision-making
- Close collaboration

**Strategies**:
- Keep it simple
- Communicate frequently and informally
- Make decisions quickly
- Build strong personal relationships

## Stakeholder Management Tools and Templates

### Stakeholder Register
- Name and role
- Contact information
- Power and interest assessment
- Engagement strategy
- Communication preferences
- Notes and history

### Communication Plan
- Stakeholder or group
- Information needs
- Communication method
- Frequency
- Responsible party
- Status

### Engagement Assessment Matrix

| Stakeholder | Current Engagement | Desired Engagement | Strategy |
|-------------|-------------------|-------------------|----------|
| CFO | Unaware | Supportive | One-on-one meeting to explain benefits |
| IT Director | Resistant | Neutral | Address concerns, involve in planning |
| End Users | Neutral | Engaged | User workshops, regular updates |

### Influence Diagram
Visual map showing:
- Stakeholder relationships
- Influence paths
- Key decision-makers
- Information flows

## Measuring Stakeholder Management Success

### Quantitative Metrics
- Stakeholder satisfaction scores
- Meeting attendance rates
- Response times to communications
- Number of escalations
- Change request frequency
- Issue resolution time

### Qualitative Indicators
- Stakeholder testimonials
- Level of engagement in meetings
- Willingness to provide resources
- Advocacy for the project
- Quality of feedback
- Relationship strength

## Common Stakeholder Management Mistakes

### Mistake 1: Identifying Stakeholders Too Narrowly
- **Impact**: Missing key stakeholders, surprises late in project
- **Solution**: Cast a wide net, revisit regularly

### Mistake 2: One-Size-Fits-All Engagement
- **Impact**: Inefficient use of time, stakeholder dissatisfaction
- **Solution**: Tailor engagement to each stakeholder

### Mistake 3: Neglecting Low-Power Stakeholders
- **Impact**: Missing valuable input, creating opponents
- **Solution**: Engage appropriately, don't ignore

### Mistake 4: Over-Relying on Formal Communication
- **Impact**: Missing informal feedback, weak relationships
- **Solution**: Balance formal and informal engagement

### Mistake 5: Avoiding Difficult Stakeholders
- **Impact**: Problems fester, relationships deteriorate
- **Solution**: Address issues head-on, professionally

### Mistake 6: Not Adapting to Changes
- **Impact**: Engagement strategies become ineffective
- **Solution**: Monitor and adjust regularly

## Your Stakeholder Management Toolkit

### Essential Skills
✓ Active listening
✓ Empathy
✓ Clear communication
✓ Conflict resolution
✓ Negotiation
✓ Political awareness
✓ Relationship building
✓ Adaptability

### Key Practices
✓ Regular stakeholder analysis
✓ Proactive communication
✓ Expectation management
✓ Feedback gathering
✓ Relationship maintenance
✓ Continuous improvement

### Critical Mindsets
✓ Stakeholders are partners, not obstacles
✓ Relationships matter more than transactions
✓ Trust is your most valuable asset
✓ Communication is never "done"
✓ Every interaction is an opportunity

## The Path to Mastery

### Beginner
- Identifies obvious stakeholders
- Communicates when required
- Reacts to stakeholder issues
- Follows templates and processes

### Intermediate
- Identifies all relevant stakeholders
- Communicates proactively
- Anticipates stakeholder needs
- Tailors engagement strategies

### Advanced
- Identifies hidden stakeholders and relationships
- Builds strategic alliances
- Influences organizational dynamics
- Creates innovative engagement approaches

### Master
- Shapes stakeholder landscape
- Builds lasting relationships
- Navigates complex politics effortlessly
- Mentors others in stakeholder management

## Final Thoughts

Stakeholder management is both an art and a science. The frameworks and tools provide structure, but success ultimately comes from:

- **Genuine care** for your stakeholders
- **Consistent effort** in building relationships
- **Continuous learning** from every interaction
- **Adaptability** to changing circumstances
- **Integrity** in all your dealings

Remember: Projects are temporary, but relationships last. Invest in your stakeholders, and they'll invest in you.

## Key Takeaways

- Stakeholder management integrates identification, analysis, planning, engagement, monitoring, and improvement
- Build coalitions and leverage networks for greater influence
- Navigate politics ethically while building political capital
- Adapt your approach to different project types and contexts
- Measure success through both quantitative metrics and qualitative indicators
- Avoid common mistakes by being proactive, adaptive, and inclusive
- Master stakeholder management through continuous practice and learning
- The foundation of all stakeholder management is genuine relationships built on trust

## Congratulations!

You've completed Level 4: Stakeholder Management. You now have the skills to:
- Identify and analyze all project stakeholders
- Develop and execute engagement strategies
- Communicate effectively across channels
- Build trust and manage expectations
- Handle difficult stakeholders and conflicts
- Navigate organizational politics
- Continuously improve stakeholder relationships

These skills will serve you throughout your project management career!
`
  },
];

console.log('Seeding Level 4 lessons (4-12)...');

for (const lesson of lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log(`\n✅ Level 4 lessons 4-12 seeded successfully!`);

await connection.end();
