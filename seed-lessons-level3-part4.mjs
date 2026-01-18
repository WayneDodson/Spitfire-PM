import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level3Lessons = [
  {
    levelId: 3,
    lessonNumber: 10,
    title: "Agile Metrics & Reporting",
    content: `# Agile Metrics & Reporting

Metrics help teams understand their performance and identify improvements. But metrics can also be misused, creating perverse incentives. This lesson explores effective metrics for Agile teams and how to report progress to stakeholders.

## Purpose of Metrics

**Good metrics**:
- Provide insights for improvement
- Enable data-driven decisions
- Track progress toward goals
- Identify problems early

**Bad metrics**:
- Used to judge individuals
- Create perverse incentives
- Measure activity, not outcomes
- Generate busywork

**Key principle**: Metrics should help teams improve, not control them.

## Team-Level Metrics

### Velocity

**Definition**: Story points completed per sprint.

**Use**: Forecasting, capacity planning.

**Trend to watch**: Stability (not necessarily increase).

**Red flags**:
- Wildly varying velocity (inconsistent estimation or external interruptions)
- Steadily decreasing velocity (impediments or team issues)
- Artificially inflated velocity (gaming the system)

**Don't**: Compare velocity across teams (points are relative).

### Sprint Burndown

**Definition**: Work remaining over sprint.

**Visual**: Line chart, days on X-axis, story points on Y-axis.

**Ideal**: Smooth downward trend to zero.

**Patterns**:

**Flat line**: No progress (investigate blockers).

**Line going up**: Scope added mid-sprint (discuss with Product Owner).

**Steep drop at end**: Work completed last minute (risky, suggests poor planning).

**Smooth decline**: Healthy progress.

### Cumulative Flow Diagram (CFD)

**Definition**: Stacked area chart showing work in each state over time.

**Use**: Visualize flow, identify bottlenecks.

**Healthy CFD**:
- Steady, parallel bands
- Work flowing smoothly through stages

**Unhealthy CFD**:
- Widening band (bottleneck)
- Flat band (no work in that stage)
- Bulges (work piling up)

**Example**: If "Testing" band widens, testing is bottleneck. Add testing capacity or reduce WIP in earlier stages.

### Cycle Time

**Definition**: Time from starting work to completing it.

**Measure**: Days from "In Progress" to "Done".

**Use**: Measure efficiency, set expectations.

**Goal**: Reduce and stabilize cycle time.

**Track percentiles**:
- 50th percentile (median)
- 85th percentile (most items)
- 95th percentile (almost all items)

**Example**: Median cycle time is 3 days, 85th percentile is 5 days, 95th percentile is 8 days.

**Communicate**: "Most items complete in 5 days or less."

### Lead Time

**Definition**: Time from requesting work to completing it.

**Difference from cycle time**: Includes time in backlog before work starts.

**Use**: Set customer expectations.

**Example**: Customer requests feature on Jan 1, work starts Jan 15, completes Jan 20. Lead time = 20 days, cycle time = 5 days.

### Throughput

**Definition**: Number of items completed per time period.

**Example**: Team completes 15 items per week.

**Use**: Forecasting, capacity planning.

**Combine with cycle time**: Little's Law (Cycle Time = WIP / Throughput).

### Defect Rate

**Definition**: Number of bugs found in production per time period.

**Track**:
- Total defects
- Defects by severity
- Defects by root cause

**Goal**: Reduce defects through better practices.

**Don't**: Punish teams for finding bugs. Encourage transparency.

### Team Happiness

**Definition**: Team satisfaction and morale.

**Measure**: Regular surveys (1-5 scale).

**Questions**:
- How satisfied are you with team collaboration?
- How satisfied are you with work-life balance?
- How satisfied are you with tools and processes?
- How likely are you to recommend this team to a friend?

**Use**: Identify and address team issues before they become serious.

**Frequency**: Monthly or after each sprint.

## Product-Level Metrics

### Feature Usage

**Definition**: How many users use each feature.

**Measure**: Analytics, user tracking.

**Use**: Prioritize features, identify unused features.

**Example**: Feature A used by 80% of users, Feature B used by 5% of users. Invest more in A-like features, reconsider B-like features.

### Customer Satisfaction

**Definition**: How satisfied customers are with product.

**Measure**: NPS (Net Promoter Score), CSAT (Customer Satisfaction), surveys.

**Use**: Understand if we're building the right thing.

**Track over time**: Are we improving?

### Business Value Delivered

**Definition**: Revenue, cost savings, or other business outcomes from features.

**Example**: New checkout flow increased conversion by 15%, generating £100K additional revenue per month.

**Use**: Demonstrate ROI, prioritize high-value work.

### Time to Market

**Definition**: Time from idea to production.

**Measure**: Days from backlog entry to deployment.

**Goal**: Reduce time to market through better processes.

**Benefits**: Faster feedback, competitive advantage, reduced risk.

### Release Frequency

**Definition**: How often we deploy to production.

**Measure**: Deployments per week/month.

**Goal**: Increase frequency (indicates confidence and automation).

**Elite performers**: Multiple deployments per day.

### Change Failure Rate

**Definition**: Percentage of deployments causing production issues.

**Measure**: Failed deployments / total deployments.

**Goal**: Reduce through better testing and automation.

**Elite performers**: < 15% change failure rate.

### Mean Time to Recover (MTTR)

**Definition**: How quickly we fix production issues.

**Measure**: Time from incident detection to resolution.

**Goal**: Reduce through better monitoring, automation, and processes.

**Elite performers**: < 1 hour MTTR.

## Reporting to Stakeholders

### What Stakeholders Care About

**Progress**: Are we on track?

**Value**: What have we delivered?

**Risks**: What might go wrong?

**Next steps**: What's coming next?

**Stakeholders don't care about**:
- Velocity
- Story points
- Burndown charts
- Sprint details

**Translate metrics into business language**.

### Effective Status Reports

**Bad status report**:

"We completed 32 story points this sprint. Velocity is stable. Burndown chart shows good progress."

(Jargon, no business context)

**Good status report**:

"We delivered the new search feature, enabling customers to find products 50% faster. Next sprint we'll add filtering, completing the search experience. On track for Q2 launch."

(Business outcomes, clear next steps)

### Show, Don't Tell

**Demonstrate working software** rather than reporting status.

**Example**: Instead of "We're 80% done with the dashboard," show the working dashboard.

**Benefits**:
- Stakeholders see real progress
- Gather feedback early
- Build confidence

### Communicate Risks Early

**Don't hide problems**. Stakeholders appreciate transparency.

**Bad**: "Everything is fine." (Then miss deadline)

**Good**: "We discovered the payment gateway API changed, adding 2 weeks. We can either delay launch or defer advanced payment options to next release."

(Honest, provides options)

### Use Visuals

**Charts and graphs** communicate more effectively than tables of numbers.

**Examples**:
- Release burnup chart (progress toward release)
- Feature roadmap (timeline of upcoming features)
- Cumulative features delivered (value over time)

**Keep it simple**: One key message per visual.

## Metrics Anti-Patterns

### Vanity Metrics

**Definition**: Metrics that look good but don't drive decisions.

**Examples**:
- Total users (without engagement or retention)
- Lines of code written
- Number of features delivered (without usage or value)

**Solution**: Focus on actionable metrics tied to outcomes.

### Measuring Activity, Not Outcomes

**Bad**: "Team worked 400 hours this sprint."

(Activity, not outcome)

**Good**: "Team delivered features that reduced customer support tickets by 20%."

(Outcome)

### Using Metrics to Judge Individuals

**Problem**: Creates fear, gaming, and dysfunction.

**Example**: "Sarah's velocity is lower than John's. Sarah needs to improve."

(Ignores that story points are team-based and relative)

**Solution**: Use metrics for team improvement, not individual performance reviews.

### Too Many Metrics

**Problem**: Overwhelmed by data, no clear focus.

**Solution**: Focus on 3-5 key metrics aligned with goals.

### Ignoring Context

**Problem**: Metrics without context are meaningless.

**Example**: "Velocity dropped from 30 to 25."

(Without context, sounds bad)

**With context**: "Velocity dropped from 30 to 25 because two team members were on vacation."

(Now it makes sense)

### Not Acting on Metrics

**Problem**: Collecting metrics but not using them to improve.

**Solution**: Review metrics regularly, identify trends, take action.

## OKRs (Objectives and Key Results)

**Framework** for setting and tracking goals.

**Structure**:

**Objective**: Qualitative goal (what you want to achieve).

**Key Results**: Quantitative measures (how you'll know you achieved it).

**Example**:

**Objective**: Improve customer satisfaction

**Key Results**:
- Increase NPS from 30 to 50
- Reduce support tickets by 25%
- Achieve 4.5+ star rating on app stores

**Benefits**:
- Aligns team on goals
- Focuses on outcomes, not outputs
- Measurable progress

**Cadence**: Set OKRs quarterly, review monthly.

## Balanced Scorecard

**Framework** for measuring performance across multiple dimensions.

**Four Perspectives**:

**Financial**: Revenue, profit, cost savings.

**Customer**: Satisfaction, retention, acquisition.

**Internal Processes**: Efficiency, quality, cycle time.

**Learning & Growth**: Skills, innovation, employee satisfaction.

**Benefits**: Prevents over-focusing on one dimension at expense of others.

**Example**:

Financial: Increase revenue by 20%
Customer: Achieve NPS of 50+
Internal: Reduce cycle time to 3 days
Learning: Train team on new technology

## Evidence-Based Management

**Framework** by Scrum.org for measuring value and capability.

**Four Key Value Areas**:

**Current Value**: Value delivered to customers today.

**Unrealized Value**: Value that could be delivered but isn't yet.

**Ability to Innovate**: Capability to deliver new value in future.

**Time to Market**: How quickly we can deliver value.

**Metrics Examples**:

Current Value: Revenue, customer satisfaction, usage
Unrealized Value: Customer satisfaction gap, market share gap
Ability to Innovate: Technical debt ratio, time spent on innovation
Time to Market: Cycle time, deployment frequency

**Use**: Understand where to focus improvement efforts.

## Key Takeaways

- Metrics should help teams improve, not control them
- Team metrics: velocity, burndown, cumulative flow, cycle time, lead time, throughput, defect rate, team happiness
- Product metrics: feature usage, customer satisfaction, business value, time to market, release frequency, change failure rate, MTTR
- Report to stakeholders in business language, not technical jargon
- Show working software rather than reporting status
- Communicate risks early and honestly
- Use visuals to communicate effectively
- Avoid anti-patterns: vanity metrics, measuring activity not outcomes, judging individuals, too many metrics, ignoring context, not acting on data
- OKRs align team on objectives and measurable key results
- Balanced Scorecard measures performance across financial, customer, process, and learning dimensions
- Evidence-Based Management focuses on current value, unrealized value, ability to innovate, and time to market
- Focus on 3-5 key metrics aligned with goals
- Review metrics regularly and take action to improve

In the next lesson, we'll explore Agile contracts and procurement.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 11,
    title: "Agile Contracts & Procurement",
    content: `# Agile Contracts & Procurement

Traditional fixed-price, fixed-scope contracts conflict with Agile's embrace of change. This lesson explores contract structures that enable Agile while managing risk for both parties.

## The Contract Problem

Traditional contract:

"Vendor will deliver System X with features A, B, C, D, E by Date Y for Price Z."

**Problems with Agile**:

**Fixed scope conflicts with changing requirements**: Agile welcomes change, but contract locks in scope.

**Fixed price creates adversarial relationship**: Vendor wants to minimize work, customer wants to maximize value.

**Fixed deadline creates pressure to cut quality**: When deadline approaches and work remains, quality suffers.

**Detailed upfront requirements are impossible**: We don't know exactly what we need until we start building.

**Example**: Customer signs contract for e-commerce platform with 50 specified features. During development, customer learns Feature 10 is unnecessary but Feature 51 (not in contract) is critical. Contract prevents adapting.

## Agile Contract Principles

### Collaboration Over Negotiation

**Traditional**: Adversarial negotiation, each party protecting their interests.

**Agile**: Collaborative partnership, shared success.

**Practice**: Joint planning, shared risk and reward, frequent communication.

### Flexibility Over Rigidity

**Traditional**: Lock in scope, price, and schedule upfront.

**Agile**: Fix time and cost, flex scope based on value.

**Practice**: Prioritized backlog, regular reviews, adapt based on learning.

### Value Over Compliance

**Traditional**: Success = delivering what was specified in contract.

**Agile**: Success = delivering business value.

**Practice**: Measure outcomes, not outputs. Focus on ROI, not feature count.

### Trust Over Control

**Traditional**: Detailed contracts to control vendor behavior.

**Agile**: Trust-based relationships with transparency.

**Practice**: Open communication, shared metrics, collaborative problem-solving.

## Agile Contract Models

### Time and Materials (T&M)

**Structure**: Customer pays for time spent, typically hourly or daily rate.

**Flexibility**: High. Scope can change freely.

**Risk**: Customer bears risk of cost overruns.

**When to use**: High uncertainty, evolving requirements, trusted vendor.

**Protections for customer**:
- Cap on total cost
- Regular reviews and option to terminate
- Defined deliverables each sprint
- Transparency into team's work

**Example**: "Customer pays £1000/day for development team. Contract reviewed quarterly. Customer can terminate with 30 days notice."

### Fixed Price per Sprint

**Structure**: Customer pays fixed price per sprint, regardless of what's delivered.

**Flexibility**: Medium. Scope can change, but cost per sprint is fixed.

**Risk**: Shared. Vendor bears risk of underestimating effort, customer bears risk of low value delivery.

**When to use**: Moderate uncertainty, ongoing relationship.

**Protections**:
- Product Owner prioritizes each sprint
- Regular demos and reviews
- Option to terminate after each sprint

**Example**: "Customer pays £50K per 2-week sprint. After each sprint, customer decides whether to continue."

### Fixed Price per Feature

**Structure**: Customer pays fixed price for each delivered feature.

**Flexibility**: High. Customer chooses which features to fund.

**Risk**: Vendor bears risk of underestimating effort.

**When to use**: Well-defined features, vendor has experience with similar work.

**Protections**:
- Clear acceptance criteria for each feature
- Customer only pays for accepted features
- Regular demos

**Example**: "Customer pays £10K for user authentication, £15K for payment integration, £8K for email notifications."

### Money for Nothing, Change for Free

**Structure**: Fixed scope and price, but customer can cancel early and keep delivered features for partial payment. Customer can also swap features at no cost.

**Flexibility**: High. Customer can adapt based on learning.

**Risk**: Shared. Vendor gets paid for work done, customer can exit if value isn't there.

**When to use**: Fixed budget, uncertain value.

**Protections**:
- Prioritized backlog (most valuable features first)
- Regular demos and reviews
- Cancellation fee (e.g., 20% of remaining contract value)

**Example**: "Contract for £500K, 10 sprints. After 6 sprints (£300K spent), customer cancels. Customer pays £300K + £40K cancellation fee (20% of remaining £200K) = £340K total. Customer keeps all delivered features."

**"Change for Free"**: Customer can swap Feature X for Feature Y of similar size at no additional cost.

### Graduated Fixed Price

**Structure**: Fixed price per sprint, but price decreases over time as uncertainty reduces.

**Flexibility**: Medium. Recognizes that early sprints have more uncertainty.

**Risk**: Shared. Higher early prices compensate vendor for uncertainty.

**When to use**: High initial uncertainty that decreases over time.

**Example**: 
- Sprints 1-3: £60K per sprint (high uncertainty)
- Sprints 4-6: £50K per sprint (medium uncertainty)
- Sprints 7-10: £45K per sprint (low uncertainty)

### Shared Risk/Reward

**Structure**: Base price plus bonus for exceeding targets or penalty for missing targets.

**Flexibility**: Medium. Incentivizes value delivery.

**Risk**: Shared. Both parties benefit from success.

**When to use**: Clear success metrics, trusted relationship.

**Example**: "Base price £400K. Bonus of £50K if customer satisfaction exceeds 4.5/5. Penalty of £50K if satisfaction below 3.5/5."

**Caution**: Ensure metrics measure real value, not gaming.

## Procurement in Agile Organizations

### Traditional RFP (Request for Proposal)

**Process**:
1. Customer writes detailed requirements (100+ pages)
2. Vendors respond with proposals
3. Customer evaluates proposals
4. Customer selects vendor
5. Contract negotiation
6. Project starts

**Timeline**: 6-12 months from RFP to project start.

**Problems**:
- Requirements are outdated by the time project starts
- Vendors compete on price, not value
- No opportunity to assess vendor's actual capability
- Adversarial relationship from the start

### Agile Procurement

**Process**:
1. Customer writes high-level vision and goals
2. Vendors respond with approach and team
3. Customer evaluates vendors through working sessions
4. Customer selects vendor
5. Start with pilot sprint
6. Decide whether to continue

**Timeline**: 1-2 months from RFP to project start.

**Benefits**:
- Focus on outcomes, not detailed requirements
- Assess vendor through actual work, not proposals
- Build relationship early
- Fail fast if it's not working

### Evaluating Vendors

**Traditional criteria**:
- Lowest price
- Most features promised
- Longest list of qualifications

**Agile criteria**:
- Team capability (meet the actual team)
- Agile experience and maturity
- Cultural fit
- Communication and collaboration skills
- References from similar projects
- Approach to uncertainty and change

**Assessment methods**:
- Working sessions (solve a problem together)
- Review previous work
- Talk to references
- Pilot sprint

## Multi-Vendor Agile

**Challenge**: Multiple vendors working on same product.

**Problems**:
- Coordination overhead
- Finger-pointing when things go wrong
- Inconsistent practices
- Integration challenges

**Solutions**:

**Single Product Owner**: One person prioritizes all work.

**Integrated teams**: Vendors work together, not in silos.

**Shared Definition of Done**: Consistent quality standards.

**Regular integration**: Frequent merging and testing.

**Collaborative culture**: Focus on product success, not vendor success.

**Example**: Large government project with three vendors. Single Product Owner prioritizes backlog. Vendors form integrated teams (not Vendor A team, Vendor B team). Daily standups include all vendors. Shared code repository and CI/CD pipeline.

## Contracts for Internal Teams

**Internal teams need contracts too** (service level agreements).

**Example**: Internal IT team supporting business units.

**SLA might include**:
- Response time for requests
- Uptime guarantees
- Support hours
- Escalation process

**Agile approach**:
- Prioritized backlog of requests
- Regular reviews with business units
- Flexibility to adapt based on changing needs
- Transparency into team's work

## Governance in Agile Contracts

**Traditional governance**: Stage gates, detailed reviews, sign-offs.

**Agile governance**: Lightweight, frequent, outcome-focused.

**Practices**:

**Regular demos**: Every sprint, show working software.

**Metrics dashboard**: Real-time visibility into progress and quality.

**Retrospectives**: Continuous improvement.

**Steering committee**: Quarterly reviews of strategic direction.

**Decision rights**: Clear authority for Product Owner, team, and stakeholders.

**Example governance structure**:

**Product Owner**: Decides what to build (daily decisions).

**Team**: Decides how to build (daily decisions).

**Steering Committee**: Decides strategic direction, funding, major scope changes (quarterly decisions).

## Intellectual Property (IP)

**Who owns the code?**

**Options**:

**Customer owns IP**: Customer pays for development, owns all code.

**Vendor owns IP**: Vendor builds product, customer licenses it.

**Shared IP**: Both parties have rights.

**Open source**: Code is publicly available.

**Typical Agile approach**: Customer owns IP for custom development. Vendor retains IP for reusable components and frameworks.

**Example**: Vendor builds e-commerce platform for customer. Customer owns IP for custom features (product catalog, checkout flow). Vendor retains IP for framework and reusable components (authentication, payment integration).

## Handling Change Requests

**Traditional**: Change request process, impact analysis, approval, re-baseline.

**Agile**: Change is expected and welcomed.

**Process**:

1. **New requirement identified**: Add to backlog.

2. **Product Owner prioritizes**: Where does it fit relative to other work?

3. **Team estimates**: How much effort?

4. **Trade-off decision**: 
   - Add to scope (if time and budget allow)
   - Swap for lower-priority item (if fixed scope)
   - Defer to later release

**No formal change request process**—just continuous backlog management.

**Example**: Customer wants new feature mid-project. Product Owner adds to backlog, prioritizes as #3. Team estimates 8 points. Product Owner decides to swap with lower-priority feature of similar size. No contract amendment needed.

## Key Takeaways

- Traditional fixed-price, fixed-scope contracts conflict with Agile's embrace of change
- Agile contract principles: collaboration over negotiation, flexibility over rigidity, value over compliance, trust over control
- Contract models: Time & Materials (high flexibility), Fixed Price per Sprint (medium flexibility), Fixed Price per Feature, Money for Nothing/Change for Free, Graduated Fixed Price, Shared Risk/Reward
- Agile procurement focuses on outcomes and team capability, not detailed requirements and lowest price
- Evaluate vendors through working sessions and pilot sprints, not just proposals
- Multi-vendor Agile requires single Product Owner, integrated teams, shared standards, and collaborative culture
- Agile governance is lightweight, frequent, and outcome-focused (regular demos, metrics dashboards, retrospectives)
- Intellectual property typically: customer owns custom development, vendor retains reusable components
- Change is expected and welcomed—no formal change request process, just continuous backlog management
- Success = delivering business value, not compliance with original contract

In the final lesson of Level 3, we'll explore Agile transformation and organizational change.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 3,
    lessonNumber: 12,
    title: "Agile Transformation & Organizational Change",
    content: `# Agile Transformation & Organizational Change

Adopting Agile practices is relatively easy. Transforming an organization's culture and structure to truly embrace Agile is much harder. This lesson explores the challenges of Agile transformation and strategies for successful organizational change.

## Why Transformation is Hard

**Agile is not just practices**—it's a fundamental shift in mindset and culture.

**Changes required**:

**From command-and-control to empowerment**: Managers must trust teams to make decisions.

**From predictability to adaptability**: Organizations must embrace uncertainty and change.

**From individual performance to team performance**: Reward systems must shift.

**From projects to products**: Funding and governance models must change.

**From silos to cross-functional teams**: Organizational structure must change.

**From output to outcomes**: Success metrics must change.

**Example**: Company adopts Scrum (practices) but managers still make all decisions, teams are judged individually, and funding is project-based. Result: "Agile in name only."

## Stages of Agile Adoption

### Stage 1: Doing Agile

**Characteristics**:
- Teams use Agile practices (standups, sprints, retrospectives)
- Traditional management structure remains
- Focus on efficiency, not effectiveness
- Metrics: velocity, burndown charts

**Example**: Development team does Scrum, but business still creates detailed requirements upfront and measures success by on-time, on-budget delivery.

**Limitations**: Benefits are limited to team level. Organization hasn't changed.

### Stage 2: Being Agile

**Characteristics**:
- Agile mindset permeates organization
- Empowered, cross-functional teams
- Focus on customer value and outcomes
- Metrics: customer satisfaction, business value

**Example**: Teams have autonomy to decide how to work. Product Owners focus on outcomes, not outputs. Organization embraces experimentation and learning.

**This is the goal**: Agile as culture, not just practices.

### Stage 3: Agile at Scale

**Characteristics**:
- Multiple Agile teams coordinated effectively
- Agile principles applied beyond IT (HR, finance, marketing)
- Portfolio management aligned with Agile
- Continuous improvement at all levels

**Example**: Entire organization operates with Agile principles. Funding is product-based, not project-based. Strategy is adaptive, not fixed.

## Common Transformation Challenges

### Management Resistance

**Problem**: Managers fear loss of control and relevance.

**Traditional manager role**: Plan, direct, control.

**Agile manager role**: Coach, enable, remove impediments.

**Fear**: "If teams are self-organizing, what's my role?"

**Solution**: Redefine management role. Managers become servant leaders who:
- Set vision and goals
- Remove organizational impediments
- Develop people
- Foster collaboration
- Make strategic decisions

**Example**: Manager shifts from assigning tasks to coaching teams on problem-solving.

### HR and Reward Systems

**Problem**: HR systems designed for individual performance conflict with team-based Agile.

**Traditional**:
- Individual performance reviews
- Individual bonuses
- Promotion based on individual achievement

**Agile**:
- Team performance
- Team bonuses
- Promotion based on collaboration and leadership

**Solution**: Redesign HR systems to support Agile:
- Team-based performance reviews
- Peer feedback
- Reward collaboration, not just individual achievement

**Example**: Instead of "Employee of the Month," recognize "Team of the Month."

### Funding and Governance

**Problem**: Project-based funding conflicts with product-based Agile.

**Traditional**: Fund projects with defined start and end dates.

**Agile**: Fund products with ongoing teams.

**Traditional governance**: Stage gates, detailed reviews, sign-offs.

**Agile governance**: Lightweight, frequent, outcome-focused.

**Solution**: Shift to product-based funding:
- Fund teams, not projects
- Allocate budget to products/value streams
- Measure ROI and outcomes, not project completion

**Example**: Instead of funding "CRM Implementation Project" for 18 months, fund "CRM Product Team" ongoing and measure customer satisfaction and sales productivity.

### Organizational Structure

**Problem**: Functional silos conflict with cross-functional Agile teams.

**Traditional**: Separate departments (Development, Testing, UX, Operations).

**Agile**: Cross-functional teams with all necessary skills.

**Solution**: Reorganize around products or value streams:
- Cross-functional product teams
- Minimize dependencies between teams
- Co-locate teams when possible

**Example**: Instead of separate Frontend, Backend, and QA departments, create Product Teams with frontend developers, backend developers, and testers.

### Culture of Blame

**Problem**: Blame culture prevents transparency and learning.

**Traditional**: Mistakes are punished, people hide problems.

**Agile**: Mistakes are learning opportunities, transparency is valued.

**Solution**: Create psychological safety:
- Leaders model vulnerability
- Celebrate learning from failure
- Blameless post-mortems
- Reward transparency

**Example**: When production issue occurs, focus on "What can we learn?" not "Who caused this?"

## Transformation Strategies

### Start Small

**Don't transform entire organization at once**. Start with pilot team.

**Process**:
1. Select pilot team (motivated, visible, not too critical)
2. Train and coach team
3. Remove impediments
4. Demonstrate success
5. Expand to more teams

**Benefits**:
- Learn and adapt
- Build credibility
- Reduce risk

**Example**: Start with one product team. After 6 months of success, expand to three teams. After 12 months, expand to entire division.

### Executive Sponsorship

**Transformation requires executive support**.

**Without executive support**:
- Teams hit organizational impediments they can't remove
- Funding and structure don't change
- Transformation stalls

**With executive support**:
- Organizational impediments are removed
- Resources are allocated
- Culture change is driven from top

**Example**: CEO publicly commits to Agile transformation, attends sprint reviews, removes impediments escalated by teams.

### Training and Coaching

**Training**: Teach Agile principles and practices.

**Coaching**: Help teams apply Agile in their context.

**Both are necessary**:
- Training provides knowledge
- Coaching provides support

**Roles**:
- **Agile Coach**: Helps teams and organization adopt Agile
- **Scrum Master**: Facilitates Scrum for specific team

**Example**: Teams attend 2-day Scrum training. Agile coach works with teams for 6 months, attending ceremonies, providing feedback, removing impediments.

### Communities of Practice

**Groups** of people with shared interests who learn together.

**Examples**:
- Scrum Masters Community
- Product Owners Community
- Agile Coaches Community
- Testing Community

**Activities**:
- Share experiences
- Solve common problems
- Spread best practices
- Support each other

**Benefits**:
- Knowledge sharing
- Consistency
- Mutual support

**Example**: Scrum Masters from different teams meet monthly to discuss challenges and share solutions.

### Celebrate Success

**Recognize and celebrate wins**.

**Examples**:
- Team delivers first increment
- Team achieves stable velocity
- Customer satisfaction improves
- Deployment frequency increases

**Why important**:
- Builds momentum
- Reinforces desired behaviors
- Motivates teams

**Example**: CEO sends email recognizing team for delivering feature that increased customer satisfaction by 20%.

## Change Management

### Kotter's 8-Step Change Model

**1. Create Urgency**: Why must we change?

**Example**: "Our competitors are delivering features 3x faster. We must transform to remain competitive."

**2. Build Guiding Coalition**: Assemble leadership team to drive change.

**Example**: Form transformation team with executives, managers, and Agile coaches.

**3. Form Strategic Vision**: What does success look like?

**Example**: "Within 2 years, we'll deliver value to customers every 2 weeks with 90%+ satisfaction."

**4. Enlist Volunteer Army**: Build broad support.

**Example**: Train 50 Agile champions across organization to spread the message.

**5. Enable Action by Removing Barriers**: Remove impediments.

**Example**: Change funding model from projects to products. Reorganize into cross-functional teams.

**6. Generate Short-Term Wins**: Demonstrate progress.

**Example**: Pilot team delivers first increment in 2 weeks. Celebrate success.

**7. Sustain Acceleration**: Keep momentum.

**Example**: Expand to more teams. Deepen practices. Address new impediments.

**8. Institute Change**: Make it stick.

**Example**: Update HR policies, governance processes, and reward systems to support Agile.

### Dealing with Resistance

**Resistance is natural**. People fear change.

**Types of resistance**:

**Passive resistance**: "I'll wait and see if this is real."

**Active resistance**: "This will never work here."

**Sabotage**: Actively undermining transformation.

**Strategies**:

**Understand concerns**: Listen to objections. Often legitimate concerns underlie resistance.

**Involve resistors**: Give them a role in transformation. People support what they help create.

**Demonstrate value**: Show concrete benefits. Success converts skeptics.

**Be patient**: Change takes time. Don't expect overnight transformation.

**Address legitimate concerns**: If concerns are valid, address them.

**Example**: Manager resists because "Agile means no planning." Coach explains that Agile plans continuously, just differently. Invite manager to sprint planning to see how it works.

## Measuring Transformation Progress

### Maturity Models

**Framework** for assessing Agile maturity.

**Example levels**:

**Level 1: Initial**: Ad hoc, inconsistent practices.

**Level 2: Managed**: Teams use Agile practices consistently.

**Level 3: Defined**: Organization has defined Agile processes.

**Level 4: Quantitatively Managed**: Decisions based on metrics.

**Level 5: Optimizing**: Continuous improvement culture.

**Use**: Assess current state, identify gaps, track progress.

**Caution**: Don't obsess over levels. Focus on outcomes, not maturity scores.

### Transformation Metrics

**Team-level**:
- Velocity stability
- Cycle time
- Defect rate
- Team happiness

**Organizational-level**:
- Time to market
- Customer satisfaction
- Employee engagement
- Business value delivered

**Cultural indicators**:
- Psychological safety
- Collaboration
- Experimentation
- Transparency

**Track over time**: Are we improving?

## Sustaining Agile

**Transformation doesn't end**. Continuous improvement is ongoing.

**Practices**:

**Regular retrospectives**: At team, program, and organizational levels.

**Communities of practice**: Ongoing learning and sharing.

**Coaching**: Continued support as teams mature.

**Leadership commitment**: Ongoing executive support.

**Adapt practices**: Evolve Agile practices to fit changing context.

**Example**: After 2 years, organization has stable Agile practices. Continue quarterly organizational retrospectives to identify new improvements.

## Common Transformation Mistakes

### Copying Another Company

**Mistake**: "Spotify does it this way, so we will too."

**Problem**: What works for Spotify may not work for you. Different context, culture, challenges.

**Solution**: Learn from others, but adapt to your context.

### Mandating Agile

**Mistake**: "Everyone must do Scrum by next month."

**Problem**: Forced adoption without understanding creates resentment and "zombie Scrum."

**Solution**: Start with volunteers. Demonstrate value. Let success spread organically.

### Focusing Only on Teams

**Mistake**: Train teams in Agile, but don't change organizational structure, funding, or governance.

**Problem**: Teams hit organizational impediments they can't remove. Transformation stalls.

**Solution**: Transform the entire system—teams, management, structure, processes.

### Expecting Quick Results

**Mistake**: "We've been doing Agile for 3 months. Why aren't we seeing results?"

**Problem**: Cultural transformation takes years, not months.

**Solution**: Set realistic expectations. Celebrate small wins. Be patient.

### Abandoning Agile When It's Hard

**Mistake**: "Agile isn't working. Let's go back to the old way."

**Problem**: Transformation is hard. Giving up when it's difficult means never reaping benefits.

**Solution**: Persist through challenges. Get help from coaches. Address impediments.

## Key Takeaways

- Agile transformation is cultural change, not just adopting practices
- Stages: Doing Agile (practices), Being Agile (mindset), Agile at Scale (organization-wide)
- Common challenges: management resistance, HR systems, funding models, organizational structure, blame culture
- Transformation strategies: start small, executive sponsorship, training and coaching, communities of practice, celebrate success
- Kotter's 8 steps: create urgency, build coalition, form vision, enlist support, remove barriers, generate wins, sustain acceleration, institute change
- Resistance is natural—understand concerns, involve resistors, demonstrate value, be patient
- Measure transformation with maturity models and metrics (team, organizational, cultural)
- Sustain Agile through retrospectives, communities of practice, coaching, leadership commitment
- Avoid mistakes: copying others, mandating Agile, focusing only on teams, expecting quick results, abandoning when hard
- Transformation takes years—be patient, persistent, and committed

Congratulations! You've completed Level 3: Agile & Scrum. You now understand Agile principles, Scrum framework, user stories, sprint execution, scaling, Kanban, estimation, metrics, contracts, and transformation. In Level 4, we'll explore Stakeholder Management in depth.`,
    estimatedMinutes: 30,
  },
];

console.log('Seeding Level 3 lessons (10-12)...');

for (const lesson of level3Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('Level 3 lessons 10-12 seeded successfully!');
console.log('Level 3 complete!');

await connection.end();
