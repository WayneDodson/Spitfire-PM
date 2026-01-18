import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const lessons = [
  {
    levelId: 5,
    lessonNumber: 1,
    title: 'Introduction to Risk Management',
    estimatedMinutes: 30,
    content: `# Introduction to Risk Management

## What is Project Risk?

A risk is an uncertain event or condition that, if it occurs, has a positive or negative effect on project objectives. Every project faces risks—the question is whether you'll manage them proactively or react to them as they occur.

## Why Risk Management Matters

Projects that ignore risk management often face unexpected problems, cost overruns, schedule delays, and quality issues. Effective risk management helps you anticipate problems before they occur and prepare appropriate responses.

### Benefits of Risk Management

**Fewer Surprises**: Identifying risks early means fewer unexpected crises during execution.

**Better Decisions**: Understanding risks helps you make informed trade-offs between scope, schedule, cost, and quality.

**Stakeholder Confidence**: Demonstrating that you've thought through potential problems builds trust with stakeholders.

**Improved Outcomes**: Projects with active risk management are more likely to meet their objectives.

## Types of Risks

### Negative Risks (Threats)
Events that could harm the project if they occur. Examples include key team members leaving, technology failures, or regulatory changes.

### Positive Risks (Opportunities)
Events that could benefit the project if they occur. Examples include early delivery by vendors, cost savings from new technology, or additional resources becoming available.

### Known Risks
Risks you've identified and can plan for, such as potential weather delays for outdoor construction.

### Unknown Risks
Risks you haven't anticipated. While you can't plan for specific unknown risks, you can build contingency reserves to handle them.

## The Risk Management Process

### 1. Plan Risk Management
Define how you'll approach risk management for the project, including roles, methods, and tools.

### 2. Identify Risks
Systematically identify potential risks that could affect the project.

### 3. Analyze Risks
Assess the likelihood and impact of each identified risk to prioritize them.

### 4. Plan Risk Responses
Develop strategies to address high-priority risks.

### 5. Implement Risk Responses
Execute the planned risk response strategies.

### 6. Monitor Risks
Track identified risks, identify new risks, and evaluate risk response effectiveness throughout the project.

## Risk Attitudes

Different stakeholders have different attitudes toward risk, which affects how they perceive and respond to project risks.

**Risk-Averse**: Prefer to avoid risks, even if it means missing opportunities. Often willing to pay more for certainty.

**Risk-Neutral**: Make decisions based on expected value without emotional bias toward or against risk.

**Risk-Seeking**: Willing to accept higher risks for potentially higher rewards.

Understanding stakeholder risk attitudes helps you communicate about risks effectively and make decisions that align with organizational culture.

## Common Project Risks

### Technical Risks
- New or unproven technology
- Complex integrations
- Performance requirements
- Technical skill gaps

### Schedule Risks
- Optimistic estimates
- Resource unavailability
- Dependencies on other projects
- Scope creep

### Cost Risks
- Inaccurate estimates
- Currency fluctuations
- Vendor price increases
- Scope changes

### Resource Risks
- Key person dependencies
- Skill shortages
- Competing priorities
- Team turnover

### External Risks
- Regulatory changes
- Market conditions
- Natural disasters
- Political instability

## Risk vs. Issue

It's important to distinguish between risks and issues.

**Risk**: Something that might happen in the future. You can plan for it proactively.

**Issue**: Something that is happening now. You must deal with it reactively.

When a risk occurs, it becomes an issue. Effective risk management aims to prevent risks from becoming issues, or to minimize their impact when they do.

## Key Takeaways

- Risk is inherent in every project—the question is whether you manage it proactively
- Risks can be threats (negative) or opportunities (positive)
- The risk management process includes planning, identification, analysis, response planning, implementation, and monitoring
- Understanding stakeholder risk attitudes helps you communicate effectively about risks
- Distinguishing between risks (future) and issues (present) is crucial for effective management
`
  },
  {
    levelId: 5,
    lessonNumber: 2,
    title: 'Risk Identification Techniques',
    estimatedMinutes: 30,
    content: `# Risk Identification Techniques

## The Goal of Risk Identification

The goal is to identify as many project risks as possible early in the project. The earlier you identify risks, the more options you have for managing them.

## Brainstorming

Gather your team and stakeholders to generate a comprehensive list of potential risks. The key is quantity over quality at this stage—you'll analyze and prioritize later.

**Best Practices**:
- Create a safe environment where all ideas are welcome
- Encourage wild ideas—they often lead to important insights
- Build on others' ideas
- Defer judgment until later
- Capture everything

## Risk Checklists

Use lists of common project risks as prompts to ensure you don't miss obvious risks. Many organizations maintain risk checklists based on past projects.

**Categories to Consider**:
- Technical risks
- Schedule risks
- Cost risks
- Resource risks
- External risks
- Organizational risks
- Project management risks

## Expert Interviews

Consult with people who have experience with similar projects, technologies, or domains. Their insights can help you identify risks you might not have considered.

**Questions to Ask**:
- What risks did you face on similar projects?
- What surprised you?
- What would you do differently?
- What should we watch out for?

## SWOT Analysis

Analyze your project's Strengths, Weaknesses, Opportunities, and Threats.

**Strengths**: Internal positive factors (experienced team, proven technology)
**Weaknesses**: Internal negative factors (tight timeline, limited budget)
**Opportunities**: External positive factors (market demand, supportive stakeholders)
**Threats**: External negative factors (competition, regulatory changes)

## Assumption Analysis

Every project is based on assumptions. Examining these assumptions can reveal hidden risks.

**Example Assumptions**:
- "Key resources will be available when needed"
- "Requirements won't change significantly"
- "The vendor will deliver on time"
- "Users will adopt the new system quickly"

For each assumption, ask: "What if this assumption is wrong?"

## Root Cause Analysis

Look beyond surface-level risks to identify underlying causes. This helps you address fundamental issues rather than just symptoms.

**Example**:
- Surface risk: "Team members might leave"
- Root cause: "Low morale due to unrealistic deadlines"
- Better risk statement: "Unrealistic deadlines may cause low morale and team turnover"

## Documentation Review

Review project documents to identify risks:
- Project charter
- Requirements documents
- Contracts
- Previous project lessons learned
- Industry reports
- Regulatory requirements

## Delphi Technique

A structured approach where experts provide risk assessments anonymously, then review and refine their assessments based on group feedback. This reduces bias and groupthink.

**Process**:
1. Facilitator sends risk identification questions to experts
2. Experts respond anonymously
3. Facilitator summarizes responses and sends back to experts
4. Experts review summary and provide refined responses
5. Repeat until consensus emerges

## Prompt Lists

Use structured questions to prompt risk thinking:
- What could go wrong?
- What could go better than expected?
- What are we assuming?
- What don't we know?
- What has gone wrong on similar projects?
- What external factors could affect us?
- What are our dependencies?

## Risk Breakdown Structure (RBS)

Organize potential risks by category to ensure comprehensive coverage.

**Example RBS**:
- Technical
  - Requirements
  - Technology
  - Complexity
  - Performance
- External
  - Regulatory
  - Market
  - Weather
  - Political
- Organizational
  - Resources
  - Funding
  - Priorities
  - Dependencies
- Project Management
  - Estimation
  - Planning
  - Communication
  - Control

## Documenting Identified Risks

For each identified risk, document:
- **Risk Description**: Clear statement of the risk
- **Category**: Type of risk (technical, schedule, cost, etc.)
- **Potential Causes**: What could trigger this risk
- **Potential Impacts**: What would happen if the risk occurs
- **Owner**: Who is responsible for monitoring and managing this risk

**Example Risk Statement**:
"If [cause], then [risk event] may occur, which would lead to [impact]."

"If the key database architect leaves the project, then the database design may be delayed, which would lead to a 2-month schedule slip."

## Common Pitfalls in Risk Identification

**Groupthink**: Everyone agreeing to avoid conflict. Solution: Use anonymous techniques like Delphi.

**Optimism Bias**: Underestimating the likelihood of negative events. Solution: Use historical data and expert input.

**Scope Blindness**: Only considering risks within your immediate control. Solution: Use a comprehensive RBS.

**One-Time Activity**: Treating risk identification as a single event. Solution: Identify risks continuously throughout the project.

## Key Takeaways

- Use multiple techniques to identify risks comprehensively
- Involve diverse perspectives—team members, stakeholders, experts
- Document risks clearly with causes, events, and impacts
- Risk identification is continuous, not a one-time activity
- Create a safe environment where people feel comfortable raising concerns
- Look beyond obvious risks to identify underlying causes
`
  },
  {
    levelId: 5,
    lessonNumber: 3,
    title: 'Qualitative Risk Analysis',
    estimatedMinutes: 30,
    content: `# Qualitative Risk Analysis

## Purpose of Qualitative Analysis

After identifying risks, you need to prioritize them. You can't actively manage every risk—you need to focus on the ones that matter most. Qualitative analysis helps you quickly assess and prioritize risks based on their probability and impact.

## Probability Assessment

Probability is the likelihood that a risk will occur. You can express it as a percentage, a numeric score, or descriptive terms.

**Descriptive Scale**:
- Very Low: 0-10% chance
- Low: 10-30% chance
- Medium: 30-50% chance
- High: 50-70% chance
- Very High: 70-100% chance

**Numeric Scale**: 1-5, where 1 is very unlikely and 5 is very likely

## Impact Assessment

Impact is the effect on project objectives if the risk occurs. Consider impact on multiple dimensions:
- **Schedule**: How much delay would this cause?
- **Cost**: How much would this increase the budget?
- **Scope**: How would this affect deliverables?
- **Quality**: How would this affect the quality of outcomes?

**Impact Scale**:
- Very Low: Minimal impact, easily absorbed
- Low: Minor impact, manageable with existing reserves
- Medium: Moderate impact, requires management attention
- High: Significant impact, threatens project success
- Very High: Severe impact, could cause project failure

## Probability-Impact Matrix

This tool helps you visualize and prioritize risks based on their probability and impact.

| Impact / Probability | Very Low | Low | Medium | High | Very High |
|---------------------|----------|-----|--------|------|-----------|
| **Very High** | Medium | High | High | Critical | Critical |
| **High** | Low | Medium | High | High | Critical |
| **Medium** | Low | Low | Medium | High | High |
| **Low** | Very Low | Low | Low | Medium | Medium |
| **Very Low** | Very Low | Very Low | Low | Low | Medium |

**Priority Levels**:
- **Critical**: Immediate attention required, develop detailed response plans
- **High**: Active management needed, regular monitoring
- **Medium**: Monitor and have contingency plans ready
- **Low**: Monitor periodically, minimal active management
- **Very Low**: Accept and document, minimal monitoring

## Risk Score Calculation

You can calculate a risk score by multiplying probability and impact:

**Risk Score = Probability × Impact**

Example: A risk with High probability (4) and High impact (4) has a score of 16, making it a critical risk.

## Assessing Risk Urgency

Some risks need immediate attention regardless of their probability or impact because they're imminent.

**Urgency Factors**:
- **Timing**: How soon might this risk occur?
- **Warning Signs**: How much notice will we have?
- **Response Time**: How long will it take to implement our response?

A risk that could occur next week requires more immediate attention than one that might occur in six months, even if they have similar probability and impact.

## Risk Data Quality Assessment

Not all risk assessments are equally reliable. Consider the quality of the data you're using:

**High Quality Data**:
- Based on historical data from similar projects
- Validated by multiple experts
- Specific and detailed
- Recent and relevant

**Low Quality Data**:
- Based on guesses or assumptions
- From a single source
- Vague or general
- Outdated or irrelevant

Document the quality of your risk data so stakeholders understand the confidence level of your assessments.

## Risk Categorization

Group risks by category to identify patterns and systemic issues:

**By Source**:
- Internal vs. External
- Technical vs. Non-technical
- Controllable vs. Uncontrollable

**By Project Phase**:
- Planning risks
- Execution risks
- Closing risks

**By Work Breakdown Structure**:
- Risks associated with specific deliverables or work packages

Categorization helps you:
- Identify root causes
- Assign appropriate risk owners
- Develop coordinated response strategies
- Spot areas where the project is particularly vulnerable

## Risk Probability and Impact Definitions

Create clear definitions for your organization so everyone assesses risks consistently.

**Example Schedule Impact Definitions**:
- Very Low: Less than 1 week delay
- Low: 1-2 weeks delay
- Medium: 2-4 weeks delay
- High: 1-2 months delay
- Very High: More than 2 months delay

**Example Cost Impact Definitions**:
- Very Low: Less than 1% budget increase
- Low: 1-5% budget increase
- Medium: 5-10% budget increase
- High: 10-20% budget increase
- Very High: More than 20% budget increase

## Updating Risk Assessments

Risk assessments aren't static. As the project progresses:
- New information becomes available
- Circumstances change
- Risks evolve or new risks emerge
- Previously low-priority risks may become critical

Regularly reassess your risks, especially:
- At major project milestones
- When significant changes occur
- When new risks are identified
- When risk triggers are observed

## Communicating Risk Priorities

Use visual tools to communicate risk priorities to stakeholders:

**Risk Heat Map**: Visual representation of the probability-impact matrix with risks plotted

**Top 10 Risks List**: Simple list of highest-priority risks for executive visibility

**Risk Dashboard**: Real-time view of risk status with trend indicators

## Limitations of Qualitative Analysis

Qualitative analysis is fast and easy, but has limitations:
- Subjective assessments can vary between evaluators
- Doesn't provide precise cost or schedule impacts
- Can be influenced by cognitive biases
- May not capture complex risk interactions

For critical projects or high-priority risks, follow up with quantitative analysis for more precise assessments.

## Key Takeaways

- Qualitative analysis helps you quickly prioritize risks for management attention
- Assess both probability (likelihood) and impact (consequence) for each risk
- Use a probability-impact matrix to visualize and prioritize risks
- Consider urgency in addition to probability and impact
- Document the quality of your risk data
- Create clear, consistent definitions for probability and impact levels
- Regularly update risk assessments as the project progresses
- Use visual tools to communicate risk priorities effectively
`
  },
  {
    levelId: 5,
    lessonNumber: 4,
    title: 'Quantitative Risk Analysis',
    estimatedMinutes: 30,
    content: `# Quantitative Risk Analysis

## When to Use Quantitative Analysis

Quantitative risk analysis provides numerical estimates of risk impacts, typically on cost and schedule. Use it when:
- The project is large, complex, or high-stakes
- Stakeholders need precise estimates
- You're making major investment decisions
- Qualitative analysis shows multiple high-priority risks
- Regulatory requirements demand it

## Expected Monetary Value (EMV)

EMV calculates the average outcome when the future includes scenarios that may or may not happen.

**Formula**: EMV = Probability × Impact

**Example**:
- Risk: Equipment failure could delay project by 2 months
- Probability: 30%
- Impact: $100,000 in additional costs
- EMV = 0.30 × $100,000 = $30,000

You should budget $30,000 in contingency reserves for this risk.

## Decision Tree Analysis

Decision trees help you choose between alternative courses of action by calculating the EMV of each option.

**Example Decision**:
Should we buy backup equipment ($20,000) or risk equipment failure?

**Option 1: Buy Backup**
- Cost: $20,000 (certain)
- EMV: -$20,000

**Option 2: Don't Buy Backup**
- 70% chance: No failure, cost = $0
- 30% chance: Failure, cost = $100,000
- EMV = (0.70 × $0) + (0.30 × $100,000) = $30,000

**Decision**: Buy the backup equipment. It costs $20,000 vs. an expected cost of $30,000 without it.

## Three-Point Estimating

Instead of a single estimate, use three estimates to account for uncertainty:

**Optimistic (O)**: Best-case scenario
**Most Likely (M)**: Most realistic estimate
**Pessimistic (P)**: Worst-case scenario

**Triangular Distribution**: (O + M + P) / 3
**Beta Distribution (PERT)**: (O + 4M + P) / 6

**Example Task Estimate**:
- Optimistic: 5 days
- Most Likely: 8 days
- Pessimistic: 14 days
- PERT Estimate: (5 + 32 + 14) / 6 = 8.5 days
- Standard Deviation: (14 - 5) / 6 = 1.5 days

## Monte Carlo Simulation

Monte Carlo simulation runs thousands of iterations of your project schedule or budget, each time randomly selecting values within the ranges you've defined for uncertain variables.

**Process**:
1. Identify uncertain variables (task durations, costs, etc.)
2. Define probability distributions for each variable
3. Run thousands of simulations
4. Analyze the results to understand the range of possible outcomes

**Output**:
- Probability of meeting schedule targets
- Probability of staying within budget
- Recommended contingency reserves
- Most critical risks (those with greatest impact on outcomes)

**Example Results**:
- 50% confidence of completing by June 1
- 80% confidence of completing by June 15
- 95% confidence of completing by July 1

## Sensitivity Analysis

Sensitivity analysis identifies which risks have the most potential impact on project objectives. It shows how changes in one variable affect the project outcome while holding other variables constant.

**Tornado Diagram**: Visual representation showing which variables have the greatest impact on outcomes. Variables are ranked by impact, creating a tornado shape.

**Example**:
Testing which factors most affect project cost:
1. Labor rates: ±$50,000
2. Material costs: ±$30,000
3. Equipment rental: ±$15,000
4. Permit delays: ±$10,000

Focus your risk management efforts on labor rates and material costs, as they have the greatest potential impact.

## Contingency Reserve Calculation

Quantitative analysis helps you determine appropriate contingency reserves.

**Methods**:
1. **Sum of EMVs**: Add up the EMV of all risks
2. **Monte Carlo**: Use the difference between 50th and target percentile
3. **Percentage**: Apply a percentage based on project risk level

**Example**:
- Monte Carlo shows 50% confidence at $500,000
- You want 80% confidence
- 80th percentile is $575,000
- Contingency reserve: $75,000

## Cost Risk Analysis

Quantitative cost analysis helps answer questions like:
- What's the probability of staying within budget?
- How much contingency reserve do we need?
- What's driving cost uncertainty?
- Which risks should we focus on?

**Approach**:
1. Estimate cost ranges for each work package
2. Identify cost risks and their impacts
3. Run Monte Carlo simulation
4. Determine required contingency reserves

## Schedule Risk Analysis

Quantitative schedule analysis helps answer:
- What's the probability of finishing on time?
- What's a realistic completion date?
- Which activities are most critical?
- Where should we focus acceleration efforts?

**Approach**:
1. Create a detailed schedule with dependencies
2. Estimate duration ranges for each activity
3. Identify schedule risks
4. Run Monte Carlo simulation
5. Identify critical path and near-critical paths

## Interpreting Quantitative Results

**Confidence Levels**:
- 50%: Equally likely to finish early or late
- 80%: Reasonable confidence with some buffer
- 95%: High confidence, but may be too conservative

**Risk Exposure**:
The total amount at risk, calculated as the sum of all risk EMVs.

**Criticality Index**:
The percentage of simulation runs in which an activity appears on the critical path. High criticality means the activity frequently drives the project completion date.

## Limitations of Quantitative Analysis

**Data Requirements**: Requires good historical data and expert estimates

**Complexity**: More time-consuming and requires specialized tools

**False Precision**: Numbers can create an illusion of accuracy when underlying estimates are uncertain

**Interpretation**: Results can be misunderstood without proper explanation

**Cost**: May not be justified for small or simple projects

## Combining Qualitative and Quantitative Analysis

Use qualitative analysis first to identify and prioritize risks, then apply quantitative analysis to high-priority risks that warrant detailed analysis.

**Qualitative**: Fast, broad coverage, identifies priorities
**Quantitative**: Detailed, precise, supports major decisions

## Key Takeaways

- Quantitative analysis provides numerical estimates of risk impacts
- Expected Monetary Value (EMV) helps you calculate the average cost of risks
- Decision trees help you choose between alternatives
- Three-point estimating accounts for uncertainty in estimates
- Monte Carlo simulation shows the range of possible outcomes
- Sensitivity analysis identifies which risks matter most
- Use quantitative analysis to determine appropriate contingency reserves
- Combine qualitative and quantitative approaches for comprehensive risk management
`
  },
  {
    levelId: 5,
    lessonNumber: 5,
    title: 'Risk Response Strategies',
    estimatedMinutes: 30,
    content: `# Risk Response Strategies

## Planning Risk Responses

Once you've identified and analyzed risks, you need to decide what to do about them. Your response should be appropriate to the risk's priority, cost-effective, realistic, agreed upon by stakeholders, and assigned to a responsible owner.

## Strategies for Negative Risks (Threats)

### Avoid
Eliminate the risk by changing the project plan to remove the threat entirely.

**When to Use**: For high-impact risks that can be eliminated without compromising project objectives.

**Examples**:
- Use proven technology instead of cutting-edge but risky technology
- Hire experienced contractors instead of training inexperienced staff
- Remove risky features from scope
- Change vendors to avoid dependency on an unreliable supplier

**Limitations**: Not all risks can be avoided, and avoidance may require significant trade-offs.

### Mitigate
Reduce the probability or impact of the risk to an acceptable level.

**When to Use**: For risks you can't avoid but can reduce.

**Reduce Probability**:
- Add quality reviews to catch defects early
- Provide training to improve team skills
- Use prototypes to validate approaches
- Implement redundant systems

**Reduce Impact**:
- Build in extra time or budget buffers
- Create backup plans
- Use modular designs that isolate failures
- Implement early warning systems

**Example**: To mitigate the risk of key person dependency, cross-train team members so multiple people can perform critical tasks.

### Transfer
Shift the impact of the risk to a third party.

**When to Use**: When another party is better positioned to manage the risk.

**Methods**:
- **Insurance**: Transfer financial impact to an insurance company
- **Contracts**: Use fixed-price contracts to transfer cost risk to vendors
- **Warranties**: Transfer performance risk through warranty agreements
- **Outsourcing**: Transfer technical risk to specialized providers

**Example**: Purchase performance bonds to transfer the risk of contractor non-performance.

**Note**: Transferring risk usually involves a cost (insurance premiums, higher contract prices) and doesn't eliminate the risk—it just shifts who bears the impact.

### Accept
Acknowledge the risk and decide not to take proactive action.

**When to Use**: 
- For low-priority risks where the cost of response exceeds the potential impact
- When no other strategy is feasible
- For risks with very low probability or impact

**Active Acceptance**: Establish contingency reserves (time or money) to use if the risk occurs.

**Passive Acceptance**: Simply acknowledge the risk and deal with it if it happens.

**Example**: Accept the risk of minor weather delays on an indoor project, knowing they're unlikely and would have minimal impact.

## Strategies for Positive Risks (Opportunities)

### Exploit
Ensure the opportunity definitely happens.

**When to Use**: For high-value opportunities you don't want to miss.

**Examples**:
- Assign your best resources to capitalize on the opportunity
- Fast-track the schedule to deliver early
- Add features that leverage the opportunity

**Example**: If a competitor exits the market, exploit the opportunity by accelerating your product launch.

### Enhance
Increase the probability or positive impact of the opportunity.

**When to Use**: For valuable opportunities where you can improve the odds or benefits.

**Increase Probability**:
- Add resources to increase chances of early completion
- Partner with organizations that can help
- Provide incentives for early delivery

**Increase Impact**:
- Expand scope to capture more value
- Add marketing to maximize benefit
- Prepare to scale quickly

**Example**: Offer vendor incentives for early delivery to increase the probability of finishing ahead of schedule.

### Share
Allocate ownership of the opportunity to a third party best able to capture it.

**When to Use**: When another party is better positioned to realize the opportunity.

**Methods**:
- Joint ventures
- Partnerships
- Teaming agreements
- Revenue-sharing arrangements

**Example**: Partner with a company that has better market access to share the opportunity of entering a new market.

### Accept
Recognize the opportunity but don't actively pursue it.

**When to Use**: For low-value opportunities or when the cost of pursuit exceeds the potential benefit.

**Example**: Accept that you might finish early if everything goes perfectly, but don't count on it in your planning.

## Contingent Response Strategies

Sometimes the best response is to prepare a plan that you'll implement only if certain conditions occur.

**Trigger**: The event or condition that activates the contingent response.

**Response Plan**: What you'll do when the trigger occurs.

**Example**:
- **Risk**: Key developer might leave the project
- **Trigger**: Developer gives notice or shows signs of disengagement
- **Contingent Response**: Immediately hire a contractor with similar skills and begin knowledge transfer

## Fallback Plans

A fallback plan is your backup if your primary risk response doesn't work.

**Example**:
- **Primary Response**: Mitigate schedule risk by adding resources
- **Fallback Plan**: If that doesn't work, reduce scope to meet the deadline

## Residual and Secondary Risks

**Residual Risk**: The risk that remains after implementing your response strategy.

**Secondary Risk**: A new risk created by your risk response.

**Example**:
- **Original Risk**: In-house development might fail
- **Response**: Transfer risk by outsourcing development
- **Secondary Risk**: Vendor might not deliver on time
- **Residual Risk**: Even with outsourcing, some technical risk remains

Always consider and plan for secondary risks when implementing risk responses.

## Risk Response Plan Documentation

For each risk response, document:
- **Risk Description**: What's the risk?
- **Risk Owner**: Who's responsible for monitoring and managing this risk?
- **Response Strategy**: Avoid, mitigate, transfer, accept, exploit, enhance, share?
- **Specific Actions**: What exactly will you do?
- **Resources Required**: What will it cost in time, money, or resources?
- **Timeline**: When will you implement the response?
- **Triggers**: What conditions will activate contingent responses?
- **Fallback Plans**: What's your backup if the primary response doesn't work?

## Cost-Benefit Analysis of Risk Responses

Not every risk response is worth implementing. Compare the cost of the response to the expected benefit.

**Example**:
- **Risk**: Equipment failure (30% probability, $100,000 impact)
- **EMV**: $30,000
- **Response Option**: Buy backup equipment for $20,000
- **Decision**: Implement the response—it costs $20,000 to avoid $30,000 in expected costs

## Implementing Risk Responses

Risk responses aren't just plans on paper—they must be implemented and integrated into the project.

**Integration Points**:
- Update the project schedule with risk response activities
- Include risk response costs in the budget
- Assign risk response tasks to team members
- Add risk reviews to project meetings
- Update the risk register as responses are implemented

## Key Takeaways

- Choose risk response strategies appropriate to each risk's priority and nature
- For threats: avoid, mitigate, transfer, or accept
- For opportunities: exploit, enhance, share, or accept
- Use contingent responses for risks that may or may not occur
- Always consider secondary risks created by your responses
- Document risk responses clearly with owners, actions, and timelines
- Conduct cost-benefit analysis to ensure responses are worthwhile
- Integrate risk responses into project plans, schedules, and budgets
`
  },
  {
    levelId: 5,
    lessonNumber: 6,
    title: 'Risk Monitoring and Control',
    estimatedMinutes: 30,
    content: `# Risk Monitoring and Control

## Why Monitor Risks?

Risk management isn't a one-time activity. Risks evolve, new risks emerge, and planned responses may not work as expected. Continuous monitoring ensures you stay ahead of risks throughout the project lifecycle.

## What to Monitor

### Identified Risks
Track the status of known risks:
- Has the probability or impact changed?
- Have triggers occurred?
- Are response plans working?
- Can we close any risks?

### Risk Triggers
Watch for warning signs that a risk is about to occur:
- Early indicators
- Threshold breaches
- Environmental changes
- Stakeholder concerns

### Residual Risks
Monitor risks that remain after implementing responses to ensure they stay within acceptable levels.

### Secondary Risks
Track new risks created by risk responses to ensure they don't become bigger problems than the original risks.

### Overall Project Risk Exposure
Monitor the aggregate risk level across the project to understand whether risk is increasing or decreasing over time.

## Risk Reviews

Conduct regular risk reviews to assess risk status and identify new risks.

### Frequency
- **Weekly**: For high-risk projects or during critical phases
- **Bi-weekly**: For most projects
- **Monthly**: For low-risk or stable projects
- **Ad-hoc**: When significant changes occur

### Agenda
1. Review status of top risks
2. Assess effectiveness of risk responses
3. Identify new risks
4. Update risk assessments
5. Adjust response plans as needed
6. Update risk register

### Participants
- Project manager (facilitator)
- Risk owners
- Key team members
- Subject matter experts
- Stakeholders (as appropriate)

## Risk Audits

Periodic audits evaluate the effectiveness of your risk management process.

**Questions to Ask**:
- Are we identifying risks effectively?
- Are our risk assessments accurate?
- Are risk responses working?
- Are risk owners actively managing their risks?
- Is the risk register up to date?
- What can we improve?

## Tracking Risk Metrics

Use metrics to monitor risk management effectiveness:

**Risk Velocity**: How quickly risks are moving from identification to occurrence. High velocity means less time to respond.

**Risk Burn-Down**: Number of open risks over time. Should generally decrease as the project progresses.

**Risk Response Effectiveness**: Percentage of risks where responses achieved desired results.

**New Risk Rate**: Number of new risks identified per week/month. A sudden increase may indicate project instability.

**Risk Closure Rate**: Number of risks closed per week/month. Should increase as project progresses.

## Risk Register Updates

Keep your risk register current as the single source of truth for project risks.

**Update When**:
- New risks are identified
- Risk assessments change
- Responses are implemented
- Risks occur (become issues)
- Risks are no longer relevant (close them)

**Risk Status Categories**:
- **Active**: Risk is current and being managed
- **Occurred**: Risk has happened (now an issue)
- **Closed**: Risk is no longer relevant
- **Deferred**: Risk postponed to a later phase or project

## Earned Value and Risk

Earned Value Management (EVM) can provide early warning of risks materializing:

**Schedule Performance Index (SPI) < 1.0**: You're behind schedule—schedule risks may be occurring.

**Cost Performance Index (CPI) < 1.0**: You're over budget—cost risks may be occurring.

**Variance Trends**: Consistent negative trends suggest systemic risks.

## Risk Reassessment

Regularly reassess risks because:
- New information becomes available
- Project circumstances change
- External environment evolves
- Assumptions prove incorrect

**Triggers for Reassessment**:
- Major project milestones
- Significant scope changes
- Key resource changes
- External events (market shifts, regulatory changes)
- When risks occur
- When risk responses are implemented

## Workarounds

When an unplanned risk occurs (a risk that wasn't identified or accepted), you need a workaround—an unplanned response to deal with the situation.

**Process**:
1. Assess the situation quickly
2. Identify options
3. Choose the best option given constraints
4. Implement the workaround
5. Document what happened and lessons learned

## Risk Response Plan Execution

Monitor the implementation of planned risk responses:
- Are actions being completed on schedule?
- Are resources allocated as planned?
- Are responses having the desired effect?
- Do responses need adjustment?

## Communicating Risk Status

Keep stakeholders informed about project risks through:

**Risk Dashboard**: Visual summary of top risks, trends, and status.

**Risk Reports**: Regular written updates on risk status.

**Risk Briefings**: Presentations to stakeholders on critical risks.

**Escalation**: Immediate communication when critical risks emerge or occur.

**Tailor Communication**:
- **Executives**: High-level summary, top 5 risks, trends
- **Sponsors**: Detailed status of critical risks
- **Team**: All active risks, response plans, assignments
- **Stakeholders**: Risks that affect them specifically

## Risk Escalation

Know when to escalate risks to higher management:

**Escalate When**:
- Risk exceeds your authority to manage
- Risk threatens project viability
- Risk requires resources you can't access
- Risk involves organizational policy or strategy
- Stakeholder conflicts prevent resolution

**How to Escalate**:
1. Document the risk clearly
2. Explain why escalation is needed
3. Provide options and recommendations
4. Specify what decision or support you need
5. Follow up to ensure action

## Closing Risks

Close risks when they're no longer relevant:
- Risk has occurred (now an issue)
- Risk can no longer occur (window passed)
- Risk has been fully mitigated
- Project circumstances changed, eliminating the risk

**Document**:
- Why the risk is being closed
- What the outcome was
- Lessons learned

## Lessons Learned

Capture lessons learned about risk management throughout the project:
- Which risks occurred?
- Which didn't occur despite concerns?
- How effective were responses?
- What risks did we miss?
- What would we do differently?

Share these lessons to improve risk management on future projects.

## Risk Management Plan Updates

Update your risk management plan when:
- The approach isn't working
- Project circumstances change significantly
- Stakeholders request changes
- You discover better methods

## Key Takeaways

- Risk monitoring is continuous throughout the project lifecycle
- Conduct regular risk reviews to assess status and identify new risks
- Track risk metrics to measure management effectiveness
- Keep the risk register current as your single source of truth
- Reassess risks when circumstances change
- Communicate risk status appropriately to different stakeholders
- Know when and how to escalate risks
- Close risks that are no longer relevant
- Capture and share lessons learned to improve future risk management
- Be prepared with workarounds for unplanned risks
`
  },
  {
    levelId: 5,
    lessonNumber: 7,
    title: 'Introduction to Budget Management',
    estimatedMinutes: 30,
    content: `# Introduction to Budget Management

## Why Budget Management Matters

Budget management is one of the most visible aspects of project management. Stakeholders care deeply about whether you're spending money wisely and staying within budget. Cost overruns can damage your reputation, reduce project benefits, and even cause project cancellation.

## Project Costs vs. Product Costs

**Project Costs**: Money spent to complete the project (labor, materials, equipment, services).

**Product Costs**: Ongoing costs to operate and maintain what the project delivers.

As a project manager, you're primarily responsible for project costs, but you should also consider product costs when making decisions, as they affect the overall business case.

## Types of Project Costs

### Direct Costs
Costs directly attributable to the project:
- Team salaries
- Materials and supplies
- Equipment purchases or rentals
- Contractor fees
- Travel expenses

### Indirect Costs
Overhead costs shared across multiple projects:
- Facilities and utilities
- Administrative support
- Corporate IT infrastructure
- General management

### Fixed Costs
Costs that don't change with the amount of work:
- Equipment purchase
- Software licenses
- Facility rental

### Variable Costs
Costs that change based on the amount of work:
- Hourly labor
- Materials consumed
- Usage-based services

### Sunk Costs
Money already spent that can't be recovered. These should not influence future decisions (though they often do psychologically).

### Opportunity Costs
The value of the next best alternative you give up when making a choice. If you assign your best developer to Project A, the opportunity cost is what they could have delivered on Project B.

## Cost Estimation Approaches

### Analogous Estimating
Use actual costs from similar past projects as the basis for estimating current project costs.

**Advantages**: Fast, requires minimal detail
**Disadvantages**: Less accurate, requires comparable historical data

**Example**: The last website redesign cost $100,000, so we estimate this one at $100,000-$120,000.

### Parametric Estimating
Use statistical relationships between historical data and other variables to calculate estimates.

**Advantages**: More accurate than analogous, can be applied to portions of projects
**Disadvantages**: Requires reliable historical data and parameters

**Example**: Historical data shows website development costs $150 per page. For a 200-page site: 200 × $150 = $30,000.

### Bottom-Up Estimating
Estimate the cost of individual work packages or activities, then sum them up.

**Advantages**: Most accurate, provides detailed breakdown
**Disadvantages**: Time-consuming, requires detailed work breakdown

**Example**: Estimate each task individually:
- Design: $10,000
- Development: $25,000
- Testing: $8,000
- Deployment: $3,000
- Total: $46,000

### Three-Point Estimating
Use optimistic, most likely, and pessimistic estimates to account for uncertainty.

**Formula (PERT)**: (Optimistic + 4 × Most Likely + Pessimistic) / 6

**Example**:
- Optimistic: $40,000
- Most Likely: $50,000
- Pessimistic: $75,000
- Estimate: ($40,000 + $200,000 + $75,000) / 6 = $52,500

## Cost Baseline

The cost baseline is the approved time-phased budget used to measure and monitor cost performance. It includes:
- All authorized budgets
- Excludes management reserves
- Shows when money will be spent over time

The cost baseline becomes the reference point for measuring cost performance throughout the project.

## Budget Components

**Project Budget** = Cost Baseline + Management Reserve

**Cost Baseline** = Sum of all work package estimates + Contingency Reserve

**Contingency Reserve**: Budget for identified risks (known unknowns). Controlled by the project manager.

**Management Reserve**: Budget for unidentified risks (unknown unknowns). Controlled by management, not part of the cost baseline.

## Funding Limit Reconciliation

Sometimes your spending needs exceed available funding in a given time period. You may need to:
- Adjust the schedule to smooth spending
- Seek additional funding
- Reduce scope
- Phase the project differently

## Cost Aggregation

Costs are aggregated from bottom to top:
1. Activity costs
2. Work package costs
3. Control account costs
4. Project total cost

This hierarchical structure allows you to track and control costs at different levels of detail.

## Cost of Quality

Include quality-related costs in your budget:

**Prevention Costs**: Training, process improvement, quality planning

**Appraisal Costs**: Testing, inspections, audits

**Failure Costs**: Rework, warranty work, lost business

Investing in prevention and appraisal typically reduces overall costs by preventing expensive failures.

## Life Cycle Costing

Consider costs across the entire product life cycle, not just the project:
- Development costs (your project)
- Operating costs
- Maintenance costs
- Disposal costs

Sometimes spending more on the project reduces total life cycle costs. For example, higher-quality materials may cost more initially but reduce maintenance costs.

## Key Takeaways

- Budget management is critical to project success and your reputation
- Understand different types of costs: direct/indirect, fixed/variable
- Use appropriate estimation techniques based on available information
- The cost baseline is your approved budget for measuring performance
- Include contingency reserves for identified risks
- Management reserves cover unidentified risks
- Consider cost of quality and life cycle costs in your planning
- Aggregate costs hierarchically for effective control
`
  },
  {
    levelId: 5,
    lessonNumber: 8,
    title: 'Cost Estimating Techniques',
    estimatedMinutes: 30,
    content: `# Cost Estimating Techniques

## The Importance of Accurate Estimates

Accurate cost estimates are essential for:
- Securing project approval and funding
- Making informed decisions about scope and approach
- Setting realistic stakeholder expectations
- Measuring project performance
- Building credibility as a project manager

## Estimation Accuracy Over Time

Cost estimate accuracy improves as you learn more about the project:

**Rough Order of Magnitude (ROM)**: -25% to +75% (early in project)
**Budget Estimate**: -10% to +25% (during planning)
**Definitive Estimate**: -5% to +10% (detailed planning complete)

Communicate the accuracy level of your estimates so stakeholders understand the uncertainty.

## Analogous Estimating (Top-Down)

Use historical data from similar projects to estimate costs.

**When to Use**:
- Early in the project when details are limited
- For quick, high-level estimates
- When you have reliable historical data

**Process**:
1. Identify similar past projects
2. Adjust for differences (size, complexity, technology)
3. Apply adjustment factors
4. Document assumptions

**Example**:
Last year's mobile app cost $200,000. This app is similar but 20% larger and uses newer technology (+10% cost).
Estimate: $200,000 × 1.20 × 1.10 = $264,000

**Advantages**:
- Fast and inexpensive
- Useful for early decision-making
- Doesn't require detailed specifications

**Disadvantages**:
- Less accurate
- Requires comparable historical data
- May miss unique aspects of current project

## Parametric Estimating

Use statistical relationships between variables to calculate costs.

**When to Use**:
- When you have reliable historical data and parameters
- For projects with repeatable elements
- When you need better accuracy than analogous estimating

**Common Parameters**:
- Cost per square foot (construction)
- Cost per line of code (software)
- Cost per user (system implementation)
- Cost per unit produced

**Example**:
Historical data: Website development costs $150 per page
Current project: 250 pages
Estimate: 250 × $150 = $37,500

**Advantages**:
- More accurate than analogous estimating
- Can be applied to portions of projects
- Scalable to different project sizes

**Disadvantages**:
- Requires reliable historical data
- Parameters must be truly comparable
- May not account for complexity differences

## Bottom-Up Estimating

Estimate costs for individual work packages or activities, then aggregate upward.

**When to Use**:
- When you need high accuracy
- When detailed work breakdown is available
- For definitive estimates

**Process**:
1. Break project into detailed work packages
2. Estimate each work package individually
3. Consider all cost elements (labor, materials, equipment, etc.)
4. Sum estimates to get total project cost
5. Add contingency reserves

**Example**:
- Requirements gathering: 80 hours × $100/hr = $8,000
- Design: 120 hours × $120/hr = $14,400
- Development: 400 hours × $100/hr = $40,000
- Testing: 100 hours × $80/hr = $8,000
- Deployment: 40 hours × $100/hr = $4,000
- Project management: 100 hours × $125/hr = $12,500
- Total: $86,900

**Advantages**:
- Most accurate method
- Provides detailed cost breakdown
- Easier to identify cost drivers
- Better for cost control

**Disadvantages**:
- Time-consuming
- Requires detailed project definition
- Can be expensive to produce

## Three-Point Estimating

Account for uncertainty by using three estimates for each work package.

**Estimates**:
- **Optimistic (O)**: Best-case scenario
- **Most Likely (M)**: Most realistic estimate
- **Pessimistic (P)**: Worst-case scenario

**Formulas**:
- **Triangular**: (O + M + P) / 3
- **Beta (PERT)**: (O + 4M + P) / 6

**Example**:
Task: Database design
- Optimistic: $5,000
- Most Likely: $8,000
- Pessimistic: $15,000
- PERT Estimate: ($5,000 + $32,000 + $15,000) / 6 = $8,667

**Standard Deviation**: (P - O) / 6 = ($15,000 - $5,000) / 6 = $1,667

This tells you the estimate is $8,667 ± $1,667 with about 68% confidence.

## Reserve Analysis

Determine appropriate contingency reserves for cost uncertainty and identified risks.

**Contingency Reserve**:
- For identified risks (known unknowns)
- Part of the cost baseline
- Controlled by project manager

**Methods**:
1. **Percentage**: Apply a percentage based on project risk (5-20%)
2. **Sum of Risk EMVs**: Add expected monetary value of all risks
3. **Statistical**: Use standard deviation from three-point estimates
4. **Monte Carlo**: Simulate to determine required reserves

**Example**:
Project estimate: $500,000
Risk assessment: Medium risk project
Contingency reserve: 10% = $50,000
Cost baseline: $550,000

## Vendor Bid Analysis

Use bids from vendors to estimate costs for outsourced work.

**Process**:
1. Prepare detailed requirements
2. Request proposals from multiple vendors
3. Evaluate bids for completeness and realism
4. Use bids to inform your estimates

**Considerations**:
- Are bids comparable (same scope)?
- Are low bids realistic or risky?
- What's included/excluded?
- What are payment terms?

## Expert Judgment

Consult with people who have relevant experience to improve estimate accuracy.

**When to Use**:
- Throughout the estimation process
- To validate estimates
- For specialized or technical areas
- When historical data is limited

**Best Practices**:
- Use multiple experts to reduce bias
- Document expert assumptions
- Consider experts' track record
- Combine expert judgment with other methods

## Cost Estimation Tools and Software

**Spreadsheets**: Flexible, widely available, good for most projects

**Estimating Software**: Specialized tools with built-in databases and formulas

**Project Management Software**: Integrated cost estimating with scheduling

**Parametric Tools**: Industry-specific tools with extensive historical data

## Common Estimation Mistakes

**Optimism Bias**: Underestimating costs because you want the project to be approved.
**Solution**: Use historical data, expert review, and three-point estimates.

**Scope Creep**: Estimates don't account for likely scope growth.
**Solution**: Include contingency reserves and use change control.

**Overlooked Costs**: Forgetting indirect costs, training, or transition costs.
**Solution**: Use a comprehensive cost checklist.

**Pressure to Lowball**: Stakeholders pressure you to reduce estimates.
**Solution**: Document assumptions and risks, explain the consequences of underfunding.

**Anchoring**: Being influenced by an initial number (budget target) rather than estimating independently.
**Solution**: Estimate bottom-up before seeing budget constraints.

## Improving Estimation Accuracy

**Use Multiple Methods**: Combine approaches for better accuracy.

**Document Assumptions**: Record what you're assuming so you can adjust if assumptions change.

**Learn from History**: Track actual costs vs. estimates and understand variances.

**Involve the Team**: People doing the work often have the best insights.

**Review and Refine**: Revisit estimates as you learn more about the project.

**Account for Uncertainty**: Use ranges and confidence levels, not single-point estimates.

## Key Takeaways

- Estimation accuracy improves as you learn more about the project
- Use analogous estimating for quick, early estimates
- Use parametric estimating when you have reliable parameters
- Use bottom-up estimating for highest accuracy
- Three-point estimating accounts for uncertainty
- Include contingency reserves for identified risks
- Combine multiple estimation methods for better accuracy
- Document assumptions and communicate accuracy levels
- Learn from past estimates to improve future accuracy
`
  },
  {
    levelId: 5,
    lessonNumber: 9,
    title: 'Budget Development and Approval',
    estimatedMinutes: 30,
    content: `# Budget Development and Approval

## From Estimates to Budget

Cost estimates are inputs to the budget, but the budget is more than just a sum of estimates. It's a formal, approved financial plan that allocates resources over time and establishes the baseline for cost control.

## Budget Components

### Activity Costs
Costs for individual project activities based on:
- Labor hours × rates
- Material quantities × unit costs
- Equipment rental or purchase
- Subcontractor fees
- Other direct costs

### Work Package Budgets
Aggregate activity costs into work packages for easier management and control.

### Control Account Budgets
Group related work packages into control accounts—the level at which you'll formally track and manage costs.

### Contingency Reserve
Budget for identified risks. This is part of the cost baseline and under your control as project manager.

### Management Reserve
Budget for unidentified risks (unknown unknowns). Not part of the cost baseline. Requires management approval to use.

### Project Budget
Cost Baseline + Management Reserve = Total Project Budget

## Time-Phased Budget

A budget isn't just a total number—it shows when money will be spent over the project timeline.

**Why Time-Phasing Matters**:
- Ensures funding is available when needed
- Enables cash flow management
- Allows for earned value analysis
- Helps identify funding gaps
- Supports progress measurement

**Example Time-Phased Budget**:

| Month | Planned Spending | Cumulative |
|-------|-----------------|------------|
| Jan | $50,000 | $50,000 |
| Feb | $75,000 | $125,000 |
| Mar | $100,000 | $225,000 |
| Apr | $100,000 | $325,000 |
| May | $75,000 | $400,000 |
| Jun | $50,000 | $450,000 |

## Cost Aggregation

Costs flow from bottom to top in your project structure:

1. **Activity Level**: Individual task costs
2. **Work Package Level**: Sum of activity costs
3. **Control Account Level**: Sum of work package costs
4. **Project Level**: Sum of all control account costs

This hierarchy allows you to manage costs at the appropriate level of detail.

## Funding Limit Reconciliation

Your spending needs must align with available funding.

**Potential Issues**:
- Funding not available when needed
- Spending rate exceeds funding rate
- Budget caps in specific time periods

**Solutions**:
- Adjust schedule to smooth spending
- Phase the project differently
- Secure additional funding
- Reduce scope
- Use resource leveling

**Example**:
Your plan requires $200,000 in March, but only $150,000 is available. Options:
1. Shift some March work to April
2. Secure additional March funding
3. Reduce March scope
4. Use faster but more expensive resources in April to catch up

## Budget Documentation

Document your budget thoroughly:

**Budget Narrative**: Explanation of how the budget was developed, key assumptions, and major cost drivers.

**Cost Breakdown Structure**: Hierarchical breakdown of costs aligned with your WBS.

**Basis of Estimates**: Documentation of how each cost was estimated, including assumptions and sources.

**Budget Assumptions**: List of assumptions underlying the budget (labor rates, material costs, productivity rates, etc.).

**Cost Management Plan**: How you'll manage and control costs throughout the project.

## Budget Approval Process

### Prepare Budget Package
- Detailed budget breakdown
- Supporting documentation
- Assumptions and risks
- Funding requirements over time
- Business case alignment

### Present to Stakeholders
- Executive summary
- Key cost drivers
- Comparison to similar projects
- Risk analysis
- Return on investment

### Address Questions and Concerns
- Be prepared to justify costs
- Explain trade-offs
- Show sensitivity analysis
- Demonstrate due diligence

### Obtain Formal Approval
- Signed budget authorization
- Funding commitment
- Approval of cost baseline
- Authority to spend

### Establish Cost Baseline
Once approved, the budget becomes your cost baseline for measuring performance.

## Budget Constraints

You may face constraints that affect your budget:

**Fixed Budget**: You must deliver the project within a predetermined budget.
**Implication**: Scope and schedule must flex to fit the budget.

**Fixed Scope**: You must deliver specific deliverables.
**Implication**: Budget must be sufficient to deliver the scope.

**Fixed Timeline**: You must finish by a specific date.
**Implication**: Budget may need to increase to meet the deadline.

**Resource Constraints**: Limited availability of specific resources.
**Implication**: May need more expensive alternatives or longer timeline.

## Budget Negotiation

You may need to negotiate your budget with stakeholders.

**If Budget is Cut**:
- Show the impact on scope, schedule, or quality
- Propose alternatives (phasing, reduced scope, longer timeline)
- Identify risks of underfunding
- Get stakeholder agreement on trade-offs

**If Budget is Challenged**:
- Provide detailed justification
- Show comparison to similar projects
- Explain cost drivers
- Demonstrate due diligence in estimating

**If Budget is Increased**:
- Explain why additional funding is needed
- Show what additional value will be delivered
- Demonstrate that you've minimized costs
- Provide options at different funding levels

## Budget Buffers and Reserves

### Contingency Reserve
- For identified risks
- Sized based on risk analysis
- Part of cost baseline
- You control its use

### Management Reserve
- For unidentified risks
- Typically 5-10% of cost baseline
- Not part of cost baseline
- Management controls its use

### Buffer Sizing Methods
1. **Percentage**: Apply standard percentage (e.g., 10%)
2. **Risk-Based**: Sum of risk EMVs
3. **Statistical**: Based on estimate uncertainty
4. **Historical**: Based on past project variances

## Budget Change Control

Once approved, the budget baseline should only change through formal change control:

**Valid Reasons for Baseline Changes**:
- Approved scope changes
- Major assumption changes
- External factors (regulatory, market)
- Significant risk events

**Invalid Reasons**:
- Cost overruns due to poor management
- Desire to hide variances
- Convenience

## Budget Communication

Different stakeholders need different budget information:

**Executives**: Total budget, major cost categories, ROI

**Sponsors**: Detailed budget breakdown, funding requirements, variances

**Team**: Work package budgets, spending authority, cost tracking

**Finance**: Cash flow requirements, payment schedules, accounting codes

## Key Takeaways

- The budget is a formal, approved financial plan, not just a sum of estimates
- Time-phase your budget to show when money will be spent
- Aggregate costs hierarchically for effective management
- Reconcile your spending plan with funding availability
- Document your budget thoroughly with assumptions and justification
- Obtain formal approval before establishing the cost baseline
- Include appropriate contingency and management reserves
- Use formal change control for budget baseline changes
- Communicate budget information appropriately to different stakeholders
- Be prepared to negotiate and justify your budget
`
  },
  {
    levelId: 5,
    lessonNumber: 10,
    title: 'Cost Control and Earned Value Management',
    estimatedMinutes: 30,
    content: `# Cost Control and Earned Value Management

## What is Cost Control?

Cost control is the process of monitoring cost performance, investigating variances, and taking corrective action to keep the project within the approved budget. It's not about preventing spending—it's about ensuring you get value for money spent.

## Cost Performance Measurement

You can't control what you don't measure. Track these key metrics:

**Actual Cost (AC)**: Money actually spent to date.

**Planned Value (PV)**: Budgeted cost of work scheduled to be completed by a specific date.

**Earned Value (EV)**: Budgeted cost of work actually completed by a specific date.

These three values form the foundation of Earned Value Management (EVM).

## Earned Value Management (EVM)

EVM integrates scope, schedule, and cost to provide objective performance measurement.

### Basic EVM Metrics

**Cost Variance (CV)**: EV - AC
- Positive CV: Under budget
- Negative CV: Over budget

**Schedule Variance (SV)**: EV - PV
- Positive SV: Ahead of schedule
- Negative SV: Behind schedule

**Cost Performance Index (CPI)**: EV / AC
- CPI > 1.0: Getting more value than cost
- CPI < 1.0: Costing more than value delivered
- CPI = 1.0: On budget

**Schedule Performance Index (SPI)**: EV / PV
- SPI > 1.0: Ahead of schedule
- SPI < 1.0: Behind schedule
- SPI = 1.0: On schedule

### EVM Example

**Project Status at Month 3**:
- Planned Value (PV): $100,000
- Earned Value (EV): $80,000
- Actual Cost (AC): $90,000

**Analysis**:
- CV = $80,000 - $90,000 = -$10,000 (over budget)
- SV = $80,000 - $100,000 = -$20,000 (behind schedule)
- CPI = $80,000 / $90,000 = 0.89 (getting $0.89 value per dollar spent)
- SPI = $80,000 / $100,000 = 0.80 (progressing at 80% of planned rate)

**Interpretation**: The project is both over budget and behind schedule.

## Forecasting with EVM

EVM allows you to forecast final project costs and completion dates.

### Estimate at Completion (EAC)

**EAC = BAC / CPI** (assumes current performance continues)
- BAC = Budget at Completion (original total budget)

**Example**:
- BAC = $500,000
- CPI = 0.89
- EAC = $500,000 / 0.89 = $561,798

**Interpretation**: If current cost performance continues, the project will cost $561,798, which is $61,798 over budget.

### Estimate to Complete (ETC)

**ETC = EAC - AC** (remaining cost to finish)

**Example**:
- EAC = $561,798
- AC = $90,000
- ETC = $561,798 - $90,000 = $471,798

### Variance at Completion (VAC)

**VAC = BAC - EAC** (expected final variance)

**Example**:
- BAC = $500,000
- EAC = $561,798
- VAC = $500,000 - $561,798 = -$61,798

**Interpretation**: Expect to finish $61,798 over budget.

### To-Complete Performance Index (TCPI)

**TCPI = (BAC - EV) / (BAC - AC)** (efficiency needed to finish on budget)

**Example**:
- BAC = $500,000
- EV = $80,000
- AC = $90,000
- TCPI = ($500,000 - $80,000) / ($500,000 - $90,000) = $420,000 / $410,000 = 1.02

**Interpretation**: You need a CPI of 1.02 for the remaining work to finish on budget. Since your current CPI is 0.89, this is challenging but potentially achievable.

## Trend Analysis

Don't just look at current numbers—analyze trends over time.

**Improving Trends**:
- CPI increasing toward 1.0
- SPI increasing toward 1.0
- Variances decreasing

**Worsening Trends**:
- CPI decreasing away from 1.0
- SPI decreasing away from 1.0
- Variances increasing

**Stable Trends**:
- Consistent CPI and SPI
- Predictable variances

Trends are often more important than single data points.

## Cost Control Actions

When you identify cost variances, take action:

### For Cost Overruns

**Investigate Root Causes**:
- Poor estimates?
- Scope creep?
- Inefficiency?
- External factors?

**Corrective Actions**:
- Improve productivity
- Reduce scope
- Use less expensive resources
- Eliminate waste
- Renegotiate contracts
- Fast-track or crash remaining work

### For Cost Underruns

Yes, spending less than planned can also be a problem:
- Are you behind schedule?
- Is quality suffering?
- Are you missing scope?
- Are estimates too conservative?

## Change Control and Cost Management

All approved changes affect your budget. Ensure:
- Changes are properly estimated
- Budget baseline is updated
- Stakeholders approve cost impacts
- Revised budget is communicated

## Cost Reporting

Provide regular cost reports to stakeholders:

**Executive Summary**:
- Current cost status (on/over/under budget)
- Forecast at completion
- Major variances and causes
- Corrective actions

**Detailed Report**:
- EVM metrics (PV, EV, AC, CPI, SPI)
- Variances by work package or control account
- Trend charts
- Forecast analysis
- Risk impacts

**Frequency**:
- Weekly or bi-weekly for most projects
- Monthly for stable projects
- More frequently during critical phases

## Cost Control Tools

**Earned Value Management Software**: Automates EVM calculations and reporting.

**Project Management Software**: Integrates cost tracking with scheduling.

**Spreadsheets**: Flexible for smaller projects or custom analysis.

**Financial Systems**: Integration with organizational accounting systems.

**Dashboards**: Visual, real-time cost performance displays.

## Common Cost Control Mistakes

**Waiting Too Long**: By the time you notice a problem, it may be too late to fix.
**Solution**: Monitor frequently and act on early warning signs.

**Ignoring Schedule Performance**: Cost and schedule are interconnected.
**Solution**: Use integrated EVM analysis.

**Focusing Only on Total Cost**: Problems in specific areas can be hidden in overall numbers.
**Solution**: Analyze at work package or control account level.

**Not Taking Action**: Identifying problems isn't enough—you must act.
**Solution**: Develop and implement corrective action plans.

**Poor Data Quality**: Garbage in, garbage out.
**Solution**: Ensure accurate, timely cost and progress data.

## Key Takeaways

- Cost control monitors performance and takes corrective action
- Earned Value Management integrates scope, schedule, and cost
- Key EVM metrics: PV, EV, AC, CV, SV, CPI, SPI
- Use EVM to forecast final costs and identify problems early
- Analyze trends over time, not just current numbers
- Take corrective action when variances exceed thresholds
- Report cost performance regularly to stakeholders
- Ensure accurate, timely data for effective cost control
- Integrate cost control with schedule management and change control
`
  },
  {
    levelId: 5,
    lessonNumber: 11,
    title: 'Cash Flow and Financial Management',
    estimatedMinutes: 30,
    content: `# Cash Flow and Financial Management

## Why Cash Flow Matters

Even if your project is on budget overall, poor cash flow management can cause serious problems. You need money available when you need to pay for resources, and your organization needs to manage its overall cash position.

## Cash Flow Basics

**Cash Inflow**: Money coming into the project (funding, payments received)

**Cash Outflow**: Money going out of the project (payments to vendors, salaries, expenses)

**Net Cash Flow**: Inflow minus outflow for a period

**Cumulative Cash Flow**: Running total of net cash flow over time

## Cash Flow Timing

The timing of cash flows matters as much as the amounts.

**Example**:
You need to pay a vendor $50,000 in March, but funding doesn't arrive until April. Even though you have enough money overall, you have a cash flow problem in March.

## Funding Requirements

Determine when you'll need funding throughout the project:

1. Create time-phased budget
2. Identify payment schedules (when bills are due)
3. Account for payment terms (net 30, net 60, etc.)
4. Consider funding availability and timing
5. Identify cash flow gaps

## Payment Terms

Understanding payment terms affects cash flow:

**Net 30**: Payment due 30 days after invoice
**Net 60**: Payment due 60 days after invoice
**2/10 Net 30**: 2% discount if paid within 10 days, otherwise due in 30 days
**Progress Payments**: Payments tied to milestones or deliverables
**Retainage**: Portion of payment withheld until project completion

## Managing Cash Flow Gaps

When cash outflows exceed inflows:

**Adjust Schedule**: Delay work that requires payment until funding is available.

**Negotiate Payment Terms**: Extend payment terms with vendors to align with funding.

**Secure Bridge Funding**: Obtain short-term financing to cover gaps.

**Accelerate Funding**: Work with finance to receive funding earlier.

**Use Internal Funding**: Borrow from organizational reserves temporarily.

## Project Financing

How projects are funded affects cash flow management:

**Internal Funding**: Money from organizational budgets. Typically more flexible.

**External Funding**: Money from outside sources (loans, investors, grants). May have restrictions and reporting requirements.

**Phased Funding**: Money released in stages based on milestones. Requires demonstrating progress to receive next installment.

**Cost Reimbursement**: Expenses reimbursed after incurred. Creates cash flow challenges—you spend first, get reimbursed later.

**Fixed Price**: Payment for deliverables regardless of cost. Better cash flow predictability.

## Working Capital Management

Working capital is the money available for day-to-day operations.

**Components**:
- Cash on hand
- Accounts receivable (money owed to you)
- Accounts payable (money you owe)
- Inventory (materials purchased but not yet used)

**Goal**: Maintain sufficient working capital to meet obligations without tying up excessive funds.

## Cash Flow Forecasting

Project future cash flows to identify potential problems:

1. **Forecast Cash Outflows**: When will you need to pay for resources?
2. **Forecast Cash Inflows**: When will funding be available?
3. **Calculate Net Cash Flow**: Inflows minus outflows by period
4. **Identify Gaps**: Periods where outflows exceed inflows
5. **Plan Solutions**: How will you address gaps?

**Example Cash Flow Forecast**:

| Month | Inflows | Outflows | Net | Cumulative |
|-------|---------|----------|-----|------------|
| Jan | $100,000 | $50,000 | $50,000 | $50,000 |
| Feb | $0 | $75,000 | -$75,000 | -$25,000 |
| Mar | $150,000 | $100,000 | $50,000 | $25,000 |

February shows a cash flow problem—you need $75,000 but have no inflows.

## Financial Metrics for Projects

### Return on Investment (ROI)

**ROI = (Benefit - Cost) / Cost × 100%**

**Example**:
- Project Cost: $500,000
- Expected Benefit: $750,000
- ROI = ($750,000 - $500,000) / $500,000 = 50%

### Payback Period

Time required to recover the project investment.

**Example**:
- Project Cost: $500,000
- Annual Benefit: $125,000
- Payback Period = $500,000 / $125,000 = 4 years

### Net Present Value (NPV)

Present value of future cash flows minus initial investment. Accounts for time value of money.

**Positive NPV**: Project creates value
**Negative NPV**: Project destroys value

### Internal Rate of Return (IRR)

The discount rate at which NPV equals zero. Higher IRR is better.

## Time Value of Money

Money today is worth more than the same amount in the future because:
- You can invest it and earn returns
- Inflation reduces purchasing power
- There's risk the future payment won't materialize

**Present Value (PV)**: Today's value of future money
**Future Value (FV)**: Future value of today's money

**Formula**: PV = FV / (1 + r)^n
- r = discount rate
- n = number of periods

**Example**:
$100,000 received in 3 years, with 10% discount rate:
PV = $100,000 / (1.10)^3 = $75,131

## Cost-Benefit Analysis

Compare project costs to benefits to determine if the project is worthwhile.

**Tangible Benefits**:
- Increased revenue
- Reduced costs
- Improved productivity

**Intangible Benefits**:
- Improved customer satisfaction
- Enhanced brand reputation
- Better employee morale

**Example**:
- Total Project Cost: $500,000
- Annual Cost Savings: $150,000
- Payback Period: 3.3 years
- 5-Year NPV: $200,000
- **Decision**: Proceed—positive NPV and acceptable payback period

## Budget vs. Actual Reconciliation

Regularly reconcile budgeted costs with actual spending:

1. **Compare**: Actual spending vs. budget by category
2. **Investigate**: Significant variances
3. **Explain**: Reasons for variances
4. **Forecast**: Impact on final project cost
5. **Act**: Corrective actions if needed

## Financial Reporting

Provide financial reports to stakeholders:

**For Finance Department**:
- Detailed spending by account code
- Cash flow requirements
- Invoice status
- Budget vs. actual reconciliation

**For Project Sponsors**:
- High-level cost status
- Forecast at completion
- Major variances
- Financial risks

**For Executives**:
- ROI and business value
- Overall cost status
- Financial health indicators

## Working with Finance

Build a good relationship with your finance department:

**Understand Their Needs**:
- Accurate forecasts
- Timely reporting
- Proper documentation
- Compliance with policies

**Communicate Proactively**:
- Alert them to changes
- Explain variances
- Provide context
- Ask for guidance

**Follow Processes**:
- Use correct account codes
- Submit reports on time
- Maintain proper documentation
- Follow approval workflows

## Key Takeaways

- Cash flow management ensures money is available when needed
- Timing of cash flows matters as much as amounts
- Understand payment terms and their impact on cash flow
- Forecast cash flows to identify and address gaps proactively
- Consider time value of money in financial decisions
- Use financial metrics (ROI, NPV, IRR) to evaluate project value
- Reconcile budget vs. actual regularly
- Tailor financial reporting to different stakeholders
- Build strong relationships with your finance department
- Understand how your project is funded and any restrictions
`
  },
  {
    levelId: 5,
    lessonNumber: 12,
    title: 'Risk and Budget Management Mastery',
    estimatedMinutes: 30,
    content: `# Risk and Budget Management Mastery

## Integrating Risk and Budget Management

Risk and budget management are deeply interconnected. Risks affect costs, and budget constraints affect which risks you can address. Mastering both requires understanding how they interact.

## The Risk-Budget Relationship

**Risks Drive Costs**:
- Risk responses require budget
- Risk events increase costs
- Contingency reserves buffer against risks

**Budget Constraints Affect Risk**:
- Limited budget may prevent optimal risk responses
- Tight budgets increase schedule pressure (a risk)
- Budget cuts may force acceptance of more risks

## Strategic Risk-Budget Decisions

### Risk Response Investment Decisions

Not every risk response is worth the cost. Use cost-benefit analysis:

**Example**:
- **Risk**: Server failure (20% probability, $100,000 impact)
- **EMV**: $20,000
- **Response Option**: Redundant server ($15,000)
- **Decision**: Invest in redundancy—costs $15,000 to avoid $20,000 expected loss

### Risk Tolerance and Budget

Organizations with different risk tolerances allocate budgets differently:

**Risk-Averse Organization**:
- Larger contingency reserves
- More investment in risk mitigation
- Preference for fixed-price contracts

**Risk-Neutral Organization**:
- Moderate contingency reserves
- Balanced risk responses
- Mix of contract types

**Risk-Seeking Organization**:
- Smaller contingency reserves
- Acceptance of more risks
- Preference for cost-reimbursable contracts

## Contingency Reserve Management

### Sizing Contingency Reserves

Use multiple methods for validation:

1. **Risk-Based**: Sum of risk EMVs
2. **Statistical**: Based on estimate uncertainty
3. **Historical**: Past project reserve usage
4. **Percentage**: Standard percentage for project risk level

**Example**:
- Risk-Based: $75,000 (sum of EMVs)
- Statistical: $65,000 (Monte Carlo 80th percentile)
- Historical: $70,000 (similar projects used 14%)
- **Recommendation**: $70,000 (validated by multiple methods)

### Using Contingency Reserves

**Good Reasons to Use Reserves**:
- Identified risks occur
- Risk responses are implemented
- Approved scope changes
- Legitimate cost increases

**Bad Reasons**:
- Poor cost management
- Hiding overruns
- Scope creep without approval
- Padding individual estimates

### Tracking Reserve Usage

Monitor contingency reserve usage over time:

**Burn Rate**: How quickly reserves are being consumed

**Remaining Reserve**: Reserves left vs. risks remaining

**Trend Analysis**: Is usage accelerating or slowing?

**Example**:
- Original Reserve: $70,000
- Used to Date: $25,000
- Remaining: $45,000
- Project 60% complete
- **Analysis**: On track—used 36% of reserves at 60% completion

## Budget Optimization Strategies

### Value Engineering

Systematically analyze project functions to reduce costs without sacrificing quality:

1. **Identify Functions**: What does each component do?
2. **Evaluate Alternatives**: Are there cheaper ways to achieve the same function?
3. **Assess Trade-offs**: What are the pros and cons of alternatives?
4. **Implement Best Options**: Choose alternatives that reduce cost while maintaining value

**Example**:
- **Original**: Custom-developed reporting system ($50,000)
- **Alternative**: Configure existing BI tool ($15,000)
- **Decision**: Use BI tool—saves $35,000 with acceptable functionality

### Cost-Schedule Trade-offs

Sometimes spending more money can save time, or taking more time can save money.

**Crashing**: Add resources to shorten schedule
- **When**: Schedule is critical, budget is available
- **Cost**: Premium for expedited work

**Fast-Tracking**: Overlap activities that were sequential
- **When**: Schedule is critical, risks are acceptable
- **Cost**: Increased coordination, potential rework

**Resource Leveling**: Extend schedule to reduce resource peaks
- **When**: Resources are constrained, schedule has flexibility
- **Benefit**: Lower costs, smoother resource usage

### Scope-Cost Trade-offs

**Reduce Scope**: Deliver less for lower cost
- Remove nice-to-have features
- Phase delivery
- Simplify requirements

**Increase Scope**: Deliver more for higher cost
- Add features
- Improve quality
- Expand coverage

**Gold Plating**: Delivering more than required without approval
- **Problem**: Wastes budget, delays schedule
- **Solution**: Stick to approved scope

## Advanced Cost Control Techniques

### Variance Thresholds

Set thresholds for when action is required:

**Example Thresholds**:
- **Green**: CPI between 0.95 and 1.05 (within 5%)
- **Yellow**: CPI between 0.90 and 0.95 or 1.05 and 1.10 (5-10%)
- **Red**: CPI below 0.90 or above 1.10 (more than 10%)

**Actions**:
- **Green**: Continue monitoring
- **Yellow**: Investigate and develop corrective action plan
- **Red**: Implement corrective actions immediately, escalate to stakeholders

### Earned Schedule

An extension of EVM that provides more accurate schedule forecasts:

**Traditional SPI Problem**: SPI approaches 1.0 at project end even if behind schedule

**Earned Schedule Solution**: Measures schedule performance in time units rather than cost units

**When to Use**: For more accurate schedule forecasting, especially on longer projects

### Estimate to Complete (ETC) Variations

Different ETC formulas for different situations:

**ETC = (BAC - EV) / CPI**: Assumes current performance continues

**ETC = BAC - EV**: Assumes remaining work will be completed as originally planned

**ETC = New Estimate**: Use when current performance isn't indicative of future performance

Choose the formula that best reflects your project situation.

## Risk-Adjusted Budgeting

Incorporate risk analysis into budget development:

1. **Develop Base Estimate**: Cost without considering risks
2. **Identify Risks**: What could affect costs?
3. **Quantify Risk Impacts**: EMV for each risk
4. **Calculate Contingency**: Sum of EMVs or Monte Carlo
5. **Set Budget**: Base estimate + contingency + management reserve

This creates a risk-adjusted budget that's more realistic than a deterministic estimate.

## Lessons Learned

Capture lessons learned about risk and budget management:

**Risk Management Lessons**:
- Which risks occurred?
- Which didn't occur despite concerns?
- How effective were risk responses?
- What risks did we miss?
- How accurate were risk assessments?

**Budget Management Lessons**:
- How accurate were estimates?
- What caused variances?
- What cost control techniques worked?
- What would we do differently?
- What can we improve?

## Best Practices for Risk and Budget Mastery

**Integrate Early**: Consider risks and budget together from the start

**Be Realistic**: Optimistic estimates and risk assessments lead to problems

**Monitor Continuously**: Don't wait for monthly reports—track daily or weekly

**Communicate Proactively**: Alert stakeholders to issues early

**Take Action**: Identifying problems isn't enough—implement solutions

**Learn and Improve**: Use each project to refine your approach

**Build Relationships**: Work closely with finance, procurement, and risk management functions

**Use Data**: Base decisions on facts, not opinions

**Stay Flexible**: Be ready to adjust as circumstances change

**Focus on Value**: It's not about spending less—it's about getting the most value for money spent

## Key Takeaways

- Risk and budget management are deeply interconnected and must be managed together
- Use cost-benefit analysis to make smart risk response investment decisions
- Size and manage contingency reserves appropriately
- Apply budget optimization strategies like value engineering and trade-off analysis
- Set variance thresholds and take action when exceeded
- Incorporate risk analysis into budget development for more realistic budgets
- Capture and apply lessons learned to continuously improve
- Focus on delivering value, not just minimizing costs
- Monitor continuously and communicate proactively
- Build strong relationships with finance and other support functions

## Congratulations!

You've completed Level 5: Risk & Budget Management. You now have the skills to:
- Identify, analyze, and respond to project risks
- Develop accurate cost estimates and budgets
- Control costs using Earned Value Management
- Manage cash flow and financial aspects of projects
- Integrate risk and budget management for optimal outcomes
- Make strategic decisions about risk responses and budget allocation

These skills are essential for delivering projects on time and within budget!
`
  },
];

console.log('Seeding Level 5 lessons (all 12)...');

for (const lesson of lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log(`\n✅ Level 5 complete! All 12 lessons seeded successfully!`);

await connection.end();
