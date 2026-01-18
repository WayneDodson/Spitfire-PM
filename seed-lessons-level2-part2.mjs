import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level2Lessons = [
  {
    levelId: 2,
    lessonNumber: 4,
    title: "Project Scheduling & Gantt Charts",
    content: `# Project Scheduling & Gantt Charts

With your WBS defining what needs to be done, the next step is determining when it will be done. Project scheduling transforms your work breakdown into a timeline, showing the sequence, duration, and dependencies of all project activities.

## Why Scheduling Matters

A detailed schedule provides multiple benefits:

**Realistic timeline expectations**: Stakeholders understand when deliverables will be available and when the project will complete.

**Resource coordination**: Team members know when they're needed and can plan their time accordingly.

**Dependency management**: You identify which activities must finish before others can start, preventing bottlenecks.

**Progress tracking**: The schedule provides a baseline for measuring whether you're ahead, on track, or behind.

**Risk identification**: Scheduling reveals tight deadlines, resource conflicts, and critical dependencies that pose risks.

## From WBS to Schedule

The WBS provides work packages; scheduling adds the time dimension:

**Step 1: Define Activities**: Break work packages into specific activities if needed. Some work packages may contain multiple activities.

**Step 2: Sequence Activities**: Determine the order in which activities must be performed based on logical dependencies.

**Step 3: Estimate Durations**: Determine how long each activity will take.

**Step 4: Assign Resources**: Identify who will perform each activity.

**Step 5: Develop Schedule**: Combine all inputs to create the project timeline.

## Activity Dependencies

Understanding dependencies is crucial for realistic scheduling:

### Finish-to-Start (FS)

The most common dependency: Activity B cannot start until Activity A finishes.

Example: You cannot begin development until design is complete.

### Start-to-Start (SS)

Activity B cannot start until Activity A starts (but they can overlap).

Example: Testing can start once development starts, even though development isn't finished.

### Finish-to-Finish (FF)

Activity B cannot finish until Activity A finishes.

Example: Documentation cannot be finalized until development is complete.

### Start-to-Finish (SF)

Rare: Activity B cannot finish until Activity A starts.

Example: The old system cannot be shut down until the new system starts running.

## Leads and Lags

Sometimes dependencies need modification:

**Lag**: Waiting time between activities.

Example: After pouring concrete, wait 7 days before building on it. This is a Finish-to-Start dependency with a 7-day lag.

**Lead**: Overlap time where the successor can start before the predecessor finishes.

Example: Start development 2 days before design completely finishes. This is a Finish-to-Start dependency with a -2 day lead (or Start-to-Start with proper planning).

## Duration Estimation Techniques

Accurate estimates are critical for realistic schedules:

### Expert Judgment

Consult with people who have done similar work before. Their experience provides valuable insights.

**Strengths**: Quick, leverages real experience
**Weaknesses**: Subject to bias, may not account for unique project factors

### Analogous Estimating

Use actual durations from similar past activities as the basis for estimates.

Example: The last website redesign took 3 months, so this one should take about 3 months.

**Strengths**: Quick, based on actual data
**Weaknesses**: Only as accurate as the similarity between projects

### Parametric Estimating

Use statistical relationships between variables to calculate estimates.

Example: If painting takes 2 hours per 100 square feet, and you have 1,000 square feet, painting will take 20 hours.

**Strengths**: More accurate than analogous, scalable
**Weaknesses**: Requires reliable historical data and valid parameters

### Three-Point Estimating

Provide three estimates for each activity:

- **Optimistic (O)**: Best-case scenario, everything goes perfectly
- **Most Likely (M)**: Realistic estimate based on normal conditions
- **Pessimistic (P)**: Worst-case scenario, everything goes wrong

Calculate expected duration using PERT formula:

Expected Duration = (O + 4M + P) / 6

Example:
- Optimistic: 5 days
- Most Likely: 8 days
- Pessimistic: 17 days
- Expected: (5 + 32 + 17) / 6 = 9 days

**Strengths**: Accounts for uncertainty, more realistic
**Weaknesses**: Requires more effort to estimate

### Bottom-Up Estimating

Estimate each detailed activity, then roll up to get total duration.

**Strengths**: Most accurate, accounts for all work
**Weaknesses**: Time-consuming, requires detailed WBS

## Gantt Charts

The Gantt chart is the most common tool for visualizing project schedules. Named after Henry Gantt who popularized it in the 1910s, it shows activities as horizontal bars along a timeline.

### Gantt Chart Components

**Activities**: Listed vertically on the left
**Timeline**: Shown horizontally across the top
**Bars**: Represent activity duration and timing
**Dependencies**: Shown as arrows connecting related activities
**Milestones**: Shown as diamonds or markers at key points
**Current Date**: Vertical line showing today
**Progress**: Shading within bars showing completion percentage

### Reading a Gantt Chart

You can quickly answer questions like:

- When does each activity start and finish?
- Which activities are happening simultaneously?
- Which activities are on the critical path?
- Are we ahead or behind schedule?
- What work is scheduled for next week?

### Creating Effective Gantt Charts

**Group related activities**: Use summary bars to show phases or deliverables.

**Show dependencies clearly**: Use arrows to illustrate relationships between activities.

**Highlight critical path**: Use color or bold formatting to emphasize activities that directly impact project completion.

**Include milestones**: Mark key decision points, deliverables, and phase gates.

**Update regularly**: Keep the Gantt chart current to maintain its value as a management tool.

## Critical Path Method (CPM)

The critical path is the longest sequence of dependent activities from project start to finish. It determines the minimum project duration.

### Why the Critical Path Matters

**Any delay on the critical path delays the entire project**: Activities on the critical path have zero float—no room for delay.

**Focus management attention**: Monitor critical path activities closely and allocate your best resources to them.

**Identify schedule compression opportunities**: To shorten the project, you must shorten critical path activities.

### Calculating the Critical Path

**Forward Pass**: Calculate the earliest start and finish times for each activity, working from project start to end.

**Backward Pass**: Calculate the latest start and finish times for each activity, working from project end to start.

**Float Calculation**: Float = Latest Start - Earliest Start (or Latest Finish - Earliest Finish)

**Identify Critical Path**: Activities with zero float are on the critical path.

### Example

Activity A: Duration 5 days
Activity B: Duration 3 days (depends on A)
Activity C: Duration 4 days (depends on A)
Activity D: Duration 2 days (depends on B and C)

Path 1: A → B → D = 5 + 3 + 2 = 10 days
Path 2: A → C → D = 5 + 4 + 2 = 11 days (Critical Path)

Activity C is critical. Any delay to C delays the project. Activity B has 1 day of float.

## Schedule Compression Techniques

When you need to shorten the schedule:

### Crashing

Add resources to critical path activities to reduce duration.

Example: Assign two developers instead of one to cut development time in half.

**Considerations**:
- Increases cost
- Not all activities can be crashed (adding more people doesn't always help)
- May reduce quality if rushed

### Fast Tracking

Perform activities in parallel that were originally planned in sequence.

Example: Start development before design is completely finished.

**Considerations**:
- Increases risk (may need rework if earlier activities change)
- Requires careful coordination
- Not all activities can be fast-tracked (you can't pour concrete before digging the foundation)

## Resource Leveling

Sometimes your schedule is resource-constrained—you don't have enough people or equipment to do everything the schedule requires.

Resource leveling adjusts the schedule to work within resource constraints:

- Delay non-critical activities to free up resources
- Extend activity durations to use fewer resources
- Reassign resources from non-critical to critical activities

**Trade-off**: Resource leveling often extends the project duration but creates a more realistic, achievable schedule.

## Milestones

Milestones are significant points or events in the project with zero duration. They mark:

- Completion of major deliverables
- Phase gates requiring approval to proceed
- Key decision points
- External dependencies (e.g., "Vendor delivers hardware")

Milestones provide clear targets and enable high-level progress tracking for executives who don't need activity-level detail.

## Schedule Baseline

Once stakeholders approve your schedule, it becomes the schedule baseline—the reference point for measuring performance.

Changes to the baseline require formal change control. This prevents scope creep and maintains schedule integrity.

You'll compare actual progress against the baseline to calculate schedule variance and determine if corrective action is needed.

## Common Scheduling Mistakes

**Student Syndrome**: Waiting until the deadline approaches before starting work. Build in checkpoints to prevent this.

**Parkinson's Law**: Work expands to fill available time. Don't pad estimates excessively.

**Ignoring Dependencies**: Assuming activities can happen in parallel when they actually depend on each other.

**Unrealistic Estimates**: Optimistic estimates that don't account for risks, resource constraints, or complexity.

**Forgetting Non-Work Time**: Not accounting for weekends, holidays, vacation, and other non-working time.

**Resource Over-Allocation**: Scheduling people for more hours than they have available.

## Tools for Scheduling

**Microsoft Project**: Industry standard, powerful features, steep learning curve.

**Smartsheet**: Spreadsheet-like interface, easier to learn, good collaboration features.

**Monday.com**: Visual, flexible, good for teams new to project management.

**Asana / Trello**: Simple, good for smaller projects and Agile teams.

**Excel / Google Sheets**: Basic but accessible, requires manual dependency management.

## Key Takeaways

- Project scheduling transforms the WBS into a timeline showing when work will be performed
- Understand four types of dependencies: Finish-to-Start, Start-to-Start, Finish-to-Finish, Start-to-Finish
- Use multiple estimation techniques: expert judgment, analogous, parametric, three-point, bottom-up
- Gantt charts visualize the schedule with bars showing activity timing and dependencies
- The critical path is the longest sequence of activities determining minimum project duration
- Compress schedules through crashing (add resources) or fast tracking (work in parallel)
- Resource leveling adjusts the schedule to work within resource constraints
- Establish a schedule baseline for measuring performance

In the next lesson, we'll explore how to estimate and manage project costs and budgets.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 2,
    lessonNumber: 5,
    title: "Cost Estimation & Budget Management",
    content: `# Cost Estimation & Budget Management

Every project operates within financial constraints. As a project manager, you must estimate costs accurately, secure funding, track spending, and keep the project within budget. Poor cost management is one of the most common reasons projects fail.

## Why Cost Management Matters

Effective cost management provides multiple benefits:

**Secures project approval**: Accurate cost estimates help stakeholders decide whether the project is worth the investment.

**Enables financial planning**: Organizations need to know when money will be spent so they can allocate funds appropriately.

**Prevents cost overruns**: Tracking costs against budget enables early detection of problems and corrective action.

**Supports decision-making**: Understanding cost implications helps you evaluate trade-offs and changes.

**Demonstrates accountability**: Delivering within budget builds trust and credibility with stakeholders.

## Types of Project Costs

Understanding different cost categories helps with estimation and tracking:

### Direct Costs

Costs directly attributable to the project:

- Labor (salaries, contractor fees)
- Materials and supplies
- Equipment purchases or rentals
- Travel expenses
- Software licenses
- Subcontractor fees

Direct costs are usually variable—they increase with project scope.

### Indirect Costs

Costs shared across multiple projects or the organization:

- Office space and utilities
- Administrative support
- IT infrastructure
- Management overhead
- Insurance
- General corporate expenses

Indirect costs are often allocated to projects as a percentage of direct costs.

### Fixed Costs

Costs that don't change regardless of project duration or scope:

- Equipment purchases
- Software licenses (one-time)
- Permits and fees
- Initial setup costs

### Variable Costs

Costs that change based on project duration, scope, or volume:

- Hourly labor
- Materials consumption
- Cloud computing usage
- Travel expenses

### Sunk Costs

Money already spent that cannot be recovered. Sunk costs should not influence future decisions.

Example: You've spent £50,000 on a project that's clearly failing. The £50,000 is sunk. The decision to continue or cancel should be based on future costs and benefits, not trying to justify past spending.

## Cost Estimation Techniques

Different techniques provide different levels of accuracy:

### Rough Order of Magnitude (ROM)

Very early estimate with -25% to +75% accuracy. Used for initial feasibility assessment.

Example: "This project will cost between £75,000 and £175,000."

Based on: High-level scope, analogous projects, expert judgment.

### Budget Estimate

Refined estimate with -10% to +25% accuracy. Used for budget approval and funding requests.

Example: "This project will cost between £90,000 and £125,000."

Based on: Defined scope, WBS, preliminary resource plan.

### Definitive Estimate

Detailed estimate with -5% to +10% accuracy. Used for project execution and control.

Example: "This project will cost between £95,000 and £110,000."

Based on: Detailed WBS, resource assignments, vendor quotes, historical data.

### Bottom-Up Estimating

Estimate cost for each work package, then roll up to get total project cost.

**Process**:
1. Identify all work packages in WBS
2. Estimate cost for each work package
3. Sum work package costs to get total

**Strengths**: Most accurate, accounts for all work
**Weaknesses**: Time-consuming, requires detailed WBS

Example:
- Work Package 1: £5,000
- Work Package 2: £8,000
- Work Package 3: £3,500
- Total: £16,500

### Analogous Estimating

Use actual costs from similar past projects as the basis for estimates.

Example: "The last mobile app development project cost £120,000, so this one should cost about £120,000."

**Strengths**: Quick, based on actual data
**Weaknesses**: Only as accurate as project similarity

### Parametric Estimating

Use statistical relationships and parameters to calculate costs.

Example: "Development costs £100 per function point, and this system has 500 function points, so development will cost £50,000."

Common parameters:
- Cost per square foot (construction)
- Cost per line of code (software)
- Cost per unit produced (manufacturing)
- Cost per hour of content (video production)

**Strengths**: More accurate than analogous, scalable
**Weaknesses**: Requires reliable historical data and valid parameters

### Three-Point Estimating

Provide three cost estimates:

- **Optimistic (O)**: Best-case cost
- **Most Likely (M)**: Realistic cost
- **Pessimistic (P)**: Worst-case cost

Calculate expected cost: (O + 4M + P) / 6

Example:
- Optimistic: £80,000
- Most Likely: £100,000
- Pessimistic: £140,000
- Expected: (80,000 + 400,000 + 140,000) / 6 = £103,333

## Cost Baseline and Budget

### Cost Baseline

The approved version of the time-phased project budget. It shows how much money should be spent over time.

The cost baseline is used to measure cost performance. Actual costs are compared to the baseline to calculate cost variance.

### Management Reserve

Funds held by management for unforeseen work within project scope. Not included in cost baseline.

Typically 5-10% of project budget. Requires management approval to use.

### Contingency Reserve

Funds included in cost baseline for identified risks. Project manager can use without seeking approval.

Calculated based on risk analysis. Higher-risk projects need larger contingency reserves.

### Total Project Budget

Total Project Budget = Cost Baseline + Management Reserve

Example:
- Cost Baseline: £100,000 (includes £5,000 contingency reserve)
- Management Reserve: £10,000
- Total Project Budget: £110,000

## Tracking and Controlling Costs

### Cost Performance Measurement

Track actual costs against the cost baseline:

**Planned Value (PV)**: Budgeted cost of work scheduled to be completed by a specific date.

**Actual Cost (AC)**: Actual cost of work completed by that date.

**Earned Value (EV)**: Budgeted cost of work actually completed by that date.

### Cost Variance (CV)

CV = EV - AC

- Positive CV: Under budget (good)
- Negative CV: Over budget (bad)
- Zero CV: On budget

Example:
- EV = £50,000 (completed 50% of £100,000 project)
- AC = £55,000 (actually spent)
- CV = £50,000 - £55,000 = -£5,000 (over budget by £5,000)

### Cost Performance Index (CPI)

CPI = EV / AC

- CPI > 1.0: Under budget (good)
- CPI < 1.0: Over budget (bad)
- CPI = 1.0: On budget

Example:
- EV = £50,000
- AC = £55,000
- CPI = £50,000 / £55,000 = 0.91

This means you're getting £0.91 of value for every £1.00 spent. Not good.

### Estimate at Completion (EAC)

Forecasting total project cost based on current performance:

**If current variances are typical**:
EAC = BAC / CPI

Where BAC (Budget at Completion) is the original total budget.

Example:
- BAC = £100,000
- CPI = 0.91
- EAC = £100,000 / 0.91 = £109,890

You're forecasting to finish £9,890 over budget.

**If current variances are atypical**:
EAC = AC + (BAC - EV)

This assumes future work will proceed as originally planned.

### Estimate to Complete (ETC)

How much more money is needed to finish:

ETC = EAC - AC

Example:
- EAC = £109,890
- AC = £55,000
- ETC = £54,890

You need £54,890 more to complete the project.

### Variance at Completion (VAC)

How much over or under budget you'll be at project end:

VAC = BAC - EAC

Example:
- BAC = £100,000
- EAC = £109,890
- VAC = -£9,890 (over budget)

## Cost Control Actions

When costs are trending over budget:

### Reduce Scope

Eliminate non-critical features or deliverables to reduce cost. Requires stakeholder approval.

### Optimize Resources

- Replace expensive resources with less expensive ones
- Reduce overtime
- Negotiate better rates with vendors
- Use internal resources instead of contractors

### Improve Efficiency

- Eliminate waste and rework
- Streamline processes
- Improve team productivity
- Leverage automation

### Use Contingency Reserve

Draw from contingency reserve to cover cost overruns. Monitor reserve depletion rate.

### Request Additional Funding

If overruns are justified (e.g., approved scope changes), request budget increase from sponsors.

## Cash Flow Management

It's not just about total cost—timing matters too.

**Cash flow** is the movement of money in and out of the project. Even profitable projects can fail if they run out of cash.

### Cash Flow Considerations

**Funding availability**: Ensure funds are available when needed. Large expenses may require advance planning.

**Payment terms**: Understand when you must pay vendors and when you'll receive funding.

**Working capital**: Maintain sufficient cash reserves to handle unexpected expenses or payment delays.

**Seasonal variations**: Some industries have seasonal cash flow patterns that affect project funding.

## Cost Management Plan

Document how costs will be estimated, budgeted, and controlled:

**Units of measure**: Currency, precision level (e.g., nearest £1,000)

**Level of accuracy**: ROM, budget, or definitive estimates

**Control thresholds**: When cost variances trigger corrective action (e.g., ±10%)

**Reporting formats**: How cost information will be presented to stakeholders

**Earned value rules**: How progress will be measured (e.g., 0/100 rule, 50/50 rule)

## Common Cost Management Mistakes

**Optimistic estimates**: Underestimating costs to get project approved, then facing overruns.

**Forgetting indirect costs**: Only estimating direct costs and being surprised by overhead allocations.

**No contingency reserve**: Assuming everything will go perfectly, then having no buffer for problems.

**Poor tracking**: Not monitoring actual costs regularly, discovering overruns too late.

**Ignoring sunk costs**: Continuing failing projects to justify past spending rather than cutting losses.

**Scope creep**: Allowing scope to expand without corresponding budget increases.

## Key Takeaways

- Understand different cost types: direct, indirect, fixed, variable, sunk
- Use appropriate estimation techniques based on project phase and required accuracy
- Establish a cost baseline for measuring performance
- Include contingency reserve for known risks and management reserve for unknowns
- Track costs using Earned Value Management: PV, AC, EV, CV, CPI
- Forecast final costs using EAC and take corrective action early
- Manage cash flow to ensure funds are available when needed
- Document cost management approach in a Cost Management Plan
- Avoid common mistakes: optimistic estimates, forgetting indirect costs, no contingency, poor tracking

In the next lesson, we'll explore quality management—ensuring your deliverables meet requirements and stakeholder expectations.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 2,
    lessonNumber: 6,
    title: "Quality Management in Waterfall",
    content: `# Quality Management in Waterfall

Quality is not an accident—it must be planned, built in, and verified. In Waterfall projects, where testing happens late and changes are expensive, getting quality right from the start is critical.

## What is Quality?

Quality means different things in different contexts:

**Conformance to requirements**: The product does what the requirements specify. This is the primary definition in Waterfall.

**Fitness for use**: The product serves its intended purpose effectively. A product can meet requirements but still be difficult or unpleasant to use.

**Customer satisfaction**: The product meets or exceeds customer expectations. This goes beyond requirements to include subjective factors.

**Freedom from defects**: The product works correctly without errors or failures.

As a PM, you must balance these perspectives. A product that meets requirements but frustrates users is not truly high quality.

## Quality vs. Grade

An important distinction:

**Quality**: The degree to which requirements are met. Low quality is always a problem.

**Grade**: The category or rank given to products with the same functional use but different technical characteristics. Low grade may be acceptable.

Example: Economy and first-class airline seats are different grades, but both should be high quality (safe, clean, functional).

You can deliver low-grade, high-quality products (basic but reliable). Never deliver low-quality products regardless of grade.

## Cost of Quality

Quality has costs, but so does poor quality:

### Prevention Costs

Money spent to prevent defects:
- Training
- Process documentation
- Quality planning
- Requirements reviews
- Design reviews

Prevention costs are investments that reduce later costs.

### Appraisal Costs

Money spent to assess quality:
- Testing
- Inspections
- Audits
- Quality reviews

Appraisal costs catch defects before delivery.

### Internal Failure Costs

Money spent on defects found before delivery:
- Rework
- Retesting
- Scrap
- Downtime

Internal failures are expensive but better than external failures.

### External Failure Costs

Money spent on defects found after delivery:
- Warranty work
- Customer support
- Returns and refunds
- Liability claims
- Lost customers and reputation damage

External failures are the most expensive and damaging.

### The Quality Investment Principle

Spending more on prevention and appraisal reduces failure costs. The optimal quality investment minimizes total cost of quality.

However, there's a point of diminishing returns. Pursuing 100% defect-free products may cost more than the value it provides.

## Quality Management Processes

Quality management involves three processes:

### Quality Planning

Define quality standards and how they'll be met.

**Activities**:
- Identify applicable quality standards (industry, regulatory, organizational)
- Define quality metrics and acceptance criteria
- Plan quality assurance and control activities
- Determine testing approach and resources
- Create quality management plan

**Outputs**:
- Quality management plan
- Quality metrics
- Quality checklists
- Test plans

### Quality Assurance (QA)

Ensure the project follows planned quality processes.

**Focus**: Process compliance—are we following our quality procedures?

**Activities**:
- Process audits
- Quality reviews
- Process improvement
- Best practice implementation

**Example**: Reviewing whether developers are following coding standards and conducting peer reviews as planned.

### Quality Control (QC)

Verify that deliverables meet quality standards.

**Focus**: Product compliance—does the deliverable meet requirements?

**Activities**:
- Testing
- Inspections
- Measurements
- Defect tracking

**Example**: Running test cases to verify software functions correctly.

## Quality Standards and Frameworks

### ISO 9001

International standard for quality management systems. Emphasizes customer focus, process approach, and continual improvement.

Many organizations require ISO 9001 certification from vendors.

### Six Sigma

Data-driven methodology for reducing defects and variation. Aims for 3.4 defects per million opportunities.

Uses DMAIC process:
- Define the problem
- Measure current performance
- Analyze root causes
- Improve the process
- Control to sustain improvements

### Total Quality Management (TQM)

Organization-wide approach emphasizing continuous improvement, customer focus, and employee involvement.

Key principles:
- Customer focus
- Continuous improvement
- Employee empowerment
- Process-centered approach
- Integrated system
- Strategic and systematic approach
- Fact-based decision making

### Capability Maturity Model Integration (CMMI)

Framework for process improvement, particularly in software development.

Five maturity levels:
1. Initial (ad hoc, chaotic)
2. Managed (project-level processes)
3. Defined (organization-level processes)
4. Quantitatively Managed (measured and controlled)
5. Optimizing (continuous improvement)

## Quality Tools and Techniques

### Cause and Effect Diagram (Fishbone/Ishikawa)

Visual tool for identifying potential causes of quality problems.

Categories typically include:
- People
- Processes
- Materials
- Equipment
- Environment
- Management

Example: Why are software defects increasing?
- People: Insufficient training, high turnover
- Processes: Inadequate code reviews, poor testing
- Tools: Outdated development environment
- Management: Unrealistic deadlines, scope creep

### Control Charts

Track process performance over time to identify trends and variations.

Shows:
- Upper control limit (UCL)
- Lower control limit (LCL)
- Mean
- Actual measurements

Points outside control limits or unusual patterns indicate problems requiring investigation.

### Pareto Chart

Bar chart showing frequency of defects by category, ordered from most to least common.

Based on Pareto Principle (80/20 rule): 80% of problems come from 20% of causes.

Use Pareto charts to prioritize quality improvement efforts—focus on the vital few causes rather than the trivial many.

### Flowcharts

Visual representation of process steps, decisions, and flows.

Helps identify:
- Unnecessary steps
- Bottlenecks
- Missing steps
- Quality checkpoints

### Checklists

Simple but effective tool ensuring nothing is forgotten.

Examples:
- Code review checklist
- Testing checklist
- Deployment checklist
- Design review checklist

Checklists reduce errors caused by memory lapses or distractions.

### Statistical Sampling

When inspecting everything is impractical, use statistical sampling to inspect a representative subset.

**Random sampling**: Every item has equal chance of selection.

**Stratified sampling**: Divide population into groups and sample from each group.

**Acceptance sampling**: Inspect a sample to decide whether to accept or reject the entire batch.

## Testing in Waterfall

Testing is a distinct phase in Waterfall, typically occurring after development completes.

### Testing Levels

**Unit Testing**: Test individual components in isolation. Usually performed by developers.

**Integration Testing**: Test how components work together. Verify interfaces and data flow.

**System Testing**: Test the complete system against requirements. Verify end-to-end functionality.

**Acceptance Testing**: Stakeholders verify the system meets business needs and is ready for deployment.

### Testing Types

**Functional Testing**: Verify the system does what it's supposed to do.

**Non-Functional Testing**:
- Performance testing (speed, scalability)
- Security testing (vulnerabilities, access control)
- Usability testing (ease of use, user experience)
- Compatibility testing (different browsers, devices, operating systems)
- Reliability testing (uptime, fault tolerance)

**Regression Testing**: Verify that changes haven't broken existing functionality.

### Test Planning

Create a test plan documenting:
- Test scope and objectives
- Test approach and strategy
- Test environment requirements
- Test schedule and resources
- Entry and exit criteria
- Defect management process

### Test Cases

Detailed specifications of:
- Test ID
- Test description
- Preconditions
- Test steps
- Expected results
- Actual results
- Pass/Fail status

Good test cases are:
- Specific and detailed
- Repeatable
- Independent (can run in any order)
- Traceable to requirements

### Defect Management

Track defects from discovery to resolution:

**Defect Report Contains**:
- Defect ID
- Description
- Steps to reproduce
- Severity (Critical, High, Medium, Low)
- Priority (when it should be fixed)
- Status (New, Assigned, Fixed, Verified, Closed)
- Assigned to
- Screenshots or logs

**Defect Lifecycle**:
1. New: Defect reported
2. Assigned: Assigned to developer
3. Fixed: Developer claims fix is complete
4. Verified: Tester confirms fix works
5. Closed: Defect resolution accepted

## Quality Metrics

Measure quality objectively:

**Defect Density**: Defects per unit of size (e.g., defects per 1,000 lines of code)

**Defect Removal Efficiency**: Percentage of defects found before delivery
- Formula: (Defects found before release / Total defects) × 100%

**Test Coverage**: Percentage of requirements or code covered by tests

**Mean Time Between Failures (MTBF)**: Average time system operates before failure

**Customer Satisfaction Score**: Survey results measuring user satisfaction

**Rework Percentage**: Percentage of work that must be redone due to quality issues

## Quality in Requirements and Design

Quality problems often originate in early phases:

### Requirements Quality

Ensure requirements are:
- Complete (nothing missing)
- Consistent (no contradictions)
- Unambiguous (clear meaning)
- Verifiable (testable)
- Feasible (achievable)

Conduct requirements reviews with stakeholders before proceeding to design.

### Design Quality

Ensure designs are:
- Modular (separate concerns)
- Maintainable (easy to modify)
- Scalable (can handle growth)
- Secure (protects data and access)
- Documented (understandable)

Conduct design reviews with technical experts before proceeding to development.

## Continuous Improvement

Quality management isn't just about meeting standards—it's about getting better over time:

**Lessons Learned**: Capture what went well and what didn't. Apply lessons to future projects.

**Process Improvement**: Identify inefficient or error-prone processes and improve them.

**Root Cause Analysis**: When problems occur, find and fix root causes rather than just symptoms.

**Benchmarking**: Compare your processes and results to industry best practices.

## Key Takeaways

- Quality means conformance to requirements, fitness for use, and customer satisfaction
- Invest in prevention and appraisal to reduce expensive failure costs
- Quality planning defines standards; QA ensures process compliance; QC verifies product compliance
- Use quality tools: fishbone diagrams, control charts, Pareto charts, flowcharts, checklists
- In Waterfall, testing is a distinct phase with multiple levels: unit, integration, system, acceptance
- Track quality metrics: defect density, removal efficiency, test coverage, MTBF
- Build quality into requirements and design—don't try to test quality in later
- Continuously improve processes based on lessons learned and root cause analysis

In the next lesson, we'll explore risk management—identifying and mitigating threats to project success.`,
    estimatedMinutes: 30,
  },
];

console.log('Seeding Level 2 lessons (4-6)...');

for (const lesson of level2Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('Level 2 lessons 4-6 seeded successfully!');

await connection.end();
