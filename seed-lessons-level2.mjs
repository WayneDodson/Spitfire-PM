import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import 'dotenv/config';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const level2Lessons = [
  {
    levelId: 2,
    lessonNumber: 1,
    title: "Introduction to Waterfall Methodology",
    content: `# Introduction to Waterfall Methodology

Welcome to Level 2, where you'll master the Waterfall methodology—the traditional, sequential approach to project management that remains widely used in construction, manufacturing, and regulated industries.

## What is Waterfall?

Waterfall is a linear, phase-based project management methodology where each phase must be completed before the next begins. Think of it like a waterfall cascading down rocks—once water flows over an edge, it cannot flow back up.

The methodology was first formally described by Dr. Winston W. Royce in 1970, though he actually warned against using it without feedback loops. Despite this, it became the dominant approach for decades, particularly in software development and engineering projects.

## Core Principles

Waterfall operates on several fundamental assumptions:

**Sequential progression**: Each phase has a distinct beginning and end. You complete requirements before design, design before development, and so on. This creates clear milestones and decision points.

**Comprehensive documentation**: Every phase produces detailed documentation that serves as the foundation for the next phase. Requirements documents, design specifications, and test plans are all created before implementation begins.

**Minimal customer involvement after requirements**: Once requirements are approved, customer involvement is limited until final delivery. This assumes requirements can be fully understood upfront.

**Change is expensive**: Because each phase builds on the previous one, changes late in the project require reworking multiple phases. This creates strong incentives to get requirements right the first time.

**Predictability focus**: With detailed upfront planning, Waterfall aims to predict costs, timelines, and outcomes with high accuracy before significant work begins.

## When Waterfall Works Best

Waterfall excels in specific contexts:

**Well-understood requirements**: When you know exactly what needs to be built and requirements are unlikely to change. Example: Building a bridge to connect two points with known specifications.

**Regulatory compliance**: Industries like pharmaceuticals, aerospace, and medical devices require extensive documentation and approval processes that align naturally with Waterfall's phase-gate approach.

**Fixed-price contracts**: When you need to commit to a specific scope, timeline, and budget upfront, Waterfall's predictability is valuable.

**Hardware development**: Physical products with high tooling costs benefit from Waterfall's emphasis on getting designs right before manufacturing.

**Inexperienced teams**: The structured, prescriptive nature of Waterfall provides clear guidance for teams new to project management.

## When Waterfall Struggles

Waterfall faces challenges in certain scenarios:

**Uncertain requirements**: When stakeholders don't know exactly what they want, or when market conditions change rapidly, Waterfall's assumption of stable requirements breaks down.

**Long project durations**: The longer the project, the more likely requirements will change, making Waterfall's sequential approach problematic.

**Complex, innovative work**: When building something new or experimental, learning happens during development. Waterfall's late testing phase means discovering problems after significant investment.

**Fast-moving markets**: Industries where competitors can launch products quickly put Waterfall projects at risk of delivering outdated solutions.

## Waterfall vs. Agile: Key Differences

| Aspect | Waterfall | Agile |
|--------|-----------|-------|
| Approach | Sequential phases | Iterative sprints |
| Requirements | Fixed upfront | Evolving throughout |
| Customer involvement | Primarily at start and end | Continuous throughout |
| Testing | After development completes | Continuous throughout |
| Change management | Formal, expensive | Expected, embraced |
| Documentation | Comprehensive, detailed | Minimal, just enough |
| Delivery | Single final delivery | Incremental deliveries |
| Risk discovery | Late in project | Early and continuous |

Neither approach is inherently superior—the right choice depends on your project context, constraints, and stakeholder needs.

## The Waterfall Phases

Waterfall typically consists of five to seven phases, though terminology varies:

1. **Requirements**: Gather and document all project requirements
2. **Design**: Create detailed system and technical designs
3. **Implementation**: Build the solution according to designs
4. **Testing**: Verify the solution meets requirements
5. **Deployment**: Release the solution to users
6. **Maintenance**: Support and enhance the deployed solution

We'll explore each phase in detail throughout this level.

## Common Misconceptions

**Misconception**: Waterfall means no flexibility or changes.

**Reality**: Waterfall includes formal change control processes. Changes are possible but require impact analysis and approval.

**Misconception**: Waterfall is obsolete and should never be used.

**Reality**: Waterfall remains appropriate for many project types, particularly those with stable requirements and regulatory constraints.

**Misconception**: Waterfall requires no customer interaction after requirements.

**Reality**: Good Waterfall practice includes regular stakeholder reviews at phase gates, though less frequent than Agile.

## Your Journey Through Level 2

In this level, you'll learn:

- How to gather and document comprehensive requirements
- Techniques for creating detailed project designs
- Methods for estimating time and cost with accuracy
- Strategies for managing scope and preventing scope creep
- Approaches to testing and quality assurance
- Best practices for deployment and handover
- How to adapt Waterfall principles to modern contexts

By the end of this level, you'll understand when to use Waterfall, how to execute Waterfall projects successfully, and how to avoid common pitfalls.

## Key Takeaways

- Waterfall is a sequential, phase-based methodology where each phase must complete before the next begins
- It works best with stable requirements, regulatory constraints, and fixed-price contracts
- Waterfall emphasizes comprehensive documentation and upfront planning
- Changes are possible but expensive, creating incentives to get requirements right initially
- Understanding Waterfall is essential even if you primarily use Agile, as many organizations use hybrid approaches

In the next lesson, we'll dive deep into the Requirements phase—the foundation of every successful Waterfall project.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 2,
    lessonNumber: 2,
    title: "Requirements Gathering & Documentation",
    content: `# Requirements Gathering & Documentation

The Requirements phase is the foundation of every Waterfall project. Get this right, and the rest of the project flows smoothly. Get it wrong, and you'll face costly rework, scope disputes, and stakeholder dissatisfaction.

## Why Requirements Matter

Requirements define what you're building and why. They serve as:

**The contract between stakeholders and the project team**: Requirements document what stakeholders expect and what the team commits to deliver. When disputes arise, requirements are the reference point.

**The foundation for all subsequent phases**: Design decisions, development work, test cases, and acceptance criteria all flow from requirements. Ambiguous requirements cascade into problems throughout the project.

**The basis for project estimates**: You cannot accurately estimate time, cost, or resources without understanding what needs to be built. Requirements drive your project plan.

**The success criteria**: At project end, you'll evaluate success by asking "Did we deliver what the requirements specified?" Clear requirements enable clear success measurement.

## Types of Requirements

Effective requirements gathering captures multiple dimensions:

### Functional Requirements

Functional requirements describe what the system must do—the features, capabilities, and behaviors users need.

Example: "The system shall allow users to search for products by name, category, or price range."

Functional requirements answer questions like:
- What actions can users perform?
- What inputs does the system accept?
- What outputs does the system produce?
- What business rules must the system enforce?

### Non-Functional Requirements

Non-functional requirements describe how the system should perform—the quality attributes and constraints.

Common categories include:

**Performance**: Response times, throughput, capacity
- Example: "The system shall return search results within 2 seconds for 95% of queries."

**Security**: Authentication, authorization, data protection
- Example: "The system shall encrypt all patient data using AES-256 encryption."

**Usability**: Ease of use, accessibility, user experience
- Example: "The system shall be usable by individuals with no prior training."

**Reliability**: Uptime, fault tolerance, recovery
- Example: "The system shall maintain 99.9% uptime during business hours."

**Scalability**: Ability to handle growth
- Example: "The system shall support up to 10,000 concurrent users."

**Compliance**: Regulatory and legal requirements
- Example: "The system shall comply with GDPR data protection requirements."

### Business Requirements

Business requirements describe why the project exists—the business objectives and benefits.

Example: "Reduce customer service call volume by 30% by enabling self-service account management."

Business requirements provide context and help prioritize when trade-offs are necessary.

### Stakeholder Requirements

Stakeholder requirements capture what different stakeholder groups need from the solution.

Example: "Customer service representatives need access to customer order history within 3 clicks."

Different stakeholders often have conflicting needs, requiring negotiation and prioritization.

## Requirements Gathering Techniques

Multiple techniques help you discover requirements:

### Interviews

One-on-one conversations with stakeholders to understand their needs, pain points, and expectations.

**Best for**: Understanding individual perspectives, exploring sensitive topics, building relationships.

**Tips**:
- Prepare open-ended questions
- Listen more than you talk
- Probe deeper with "why" questions
- Document immediately after the interview

### Workshops

Facilitated group sessions bringing together multiple stakeholders to define requirements collaboratively.

**Best for**: Building consensus, resolving conflicts, generating creative solutions.

**Tips**:
- Set clear objectives for each workshop
- Use visual aids (whiteboards, sticky notes)
- Manage dominant personalities
- Document decisions and action items

### Observation

Watching users perform their current work to understand actual practices versus stated practices.

**Best for**: Discovering unstated requirements, understanding workflow context, identifying inefficiencies.

**Tips**:
- Minimize disruption to normal work
- Ask questions about what you observe
- Look for workarounds and pain points
- Document the environment and context

### Document Analysis

Reviewing existing documentation, processes, and systems to understand current state and requirements.

**Best for**: Understanding existing systems, identifying gaps, ensuring compliance.

**Tips**:
- Review multiple document types (policies, procedures, reports)
- Identify inconsistencies between documents
- Note outdated or missing information
- Validate findings with stakeholders

### Prototyping

Creating mockups or prototypes to help stakeholders visualize the solution and refine requirements.

**Best for**: Clarifying ambiguous requirements, validating understanding, managing expectations.

**Tips**:
- Make prototypes disposable (don't commit to building them)
- Focus on key workflows and interfaces
- Iterate based on feedback
- Document requirements that emerge from prototype reviews

### Questionnaires and Surveys

Structured questions distributed to many stakeholders to gather broad input efficiently.

**Best for**: Reaching distributed stakeholders, gathering quantitative data, validating assumptions.

**Tips**:
- Keep surveys concise
- Use a mix of question types
- Pilot test before wide distribution
- Follow up on unclear responses

## Writing Effective Requirements

Good requirements share common characteristics:

### Clear and Unambiguous

Bad: "The system should be fast."
Good: "The system shall load the dashboard within 3 seconds on a standard broadband connection."

Avoid subjective terms like "fast," "easy," "user-friendly," or "robust." Use specific, measurable criteria.

### Complete

Each requirement should contain all necessary information without requiring readers to reference other documents or make assumptions.

Include:
- What must be done
- Who will do it
- When it must happen
- What triggers it
- What the expected outcome is

### Consistent

Requirements should not contradict each other. If requirement A says data is archived after 90 days and requirement B says after 180 days, you have a consistency problem.

### Verifiable

You must be able to test whether the requirement has been met.

Bad: "The system should be reliable."
Good: "The system shall maintain 99.5% uptime measured monthly."

### Feasible

Requirements should be technically and economically achievable within project constraints.

Infeasible: "The system shall predict future stock prices with 100% accuracy."

### Necessary

Each requirement should support a business objective. Avoid "nice to have" features that don't deliver value.

Ask: "What happens if we don't implement this requirement?"

### Prioritized

Not all requirements are equally important. Use a prioritization scheme:

- **Must have**: Critical for project success
- **Should have**: Important but not critical
- **Could have**: Desirable if time and budget allow
- **Won't have**: Out of scope for this project

This is called the MoSCoW method.

## Requirements Documentation

Formal documentation captures requirements for reference throughout the project:

### Requirements Specification Document

A comprehensive document containing all requirements, typically organized by:

1. **Introduction**: Project overview, objectives, scope
2. **Functional Requirements**: Organized by feature or user role
3. **Non-Functional Requirements**: Organized by quality attribute
4. **Constraints**: Technical, regulatory, or business constraints
5. **Assumptions**: What you're assuming to be true
6. **Dependencies**: External factors the project relies on

### User Stories (Hybrid Approach)

Even in Waterfall, some teams use user stories for clarity:

Format: "As a [role], I want [capability] so that [benefit]."

Example: "As a customer, I want to track my order status so that I know when to expect delivery."

### Use Cases

Detailed descriptions of how users interact with the system to accomplish goals:

- **Actor**: Who is performing the action
- **Preconditions**: What must be true before the use case starts
- **Main Flow**: Step-by-step description of the interaction
- **Alternative Flows**: Variations and exceptions
- **Postconditions**: What is true after the use case completes

### Requirements Traceability Matrix

A table linking requirements to design elements, test cases, and delivered features:

| Req ID | Requirement | Design Ref | Test Case | Status |
|--------|-------------|------------|-----------|--------|
| REQ-001 | User login | DES-012 | TC-045 | Complete |
| REQ-002 | Password reset | DES-013 | TC-046 | In Progress |

This ensures no requirement is forgotten and enables impact analysis when changes are proposed.

## Requirements Validation

Before moving to the Design phase, validate requirements with stakeholders:

### Review Sessions

Walk through requirements with stakeholders to confirm understanding and gain approval.

**Tips**:
- Present requirements in stakeholder-friendly language
- Use examples and scenarios
- Address questions and concerns
- Document approval formally

### Prototypes and Mockups

Visual representations help stakeholders validate requirements before development.

### Acceptance Criteria

Define specific, testable criteria for each requirement that will be used to verify successful delivery.

Example:
- Requirement: "Users can reset their password"
- Acceptance Criteria:
  - User receives reset email within 2 minutes
  - Reset link expires after 24 hours
  - Password must meet complexity requirements
  - User can log in with new password immediately

## Common Requirements Pitfalls

### Gold Plating

Adding features beyond stated requirements because you think they'll be valuable. This increases cost, timeline, and complexity without stakeholder approval.

### Scope Creep

Requirements expanding gradually without formal change control. Each small addition seems reasonable, but collectively they derail the project.

### Ambiguous Language

Using vague terms that different people interpret differently. This leads to mismatched expectations and rework.

### Missing Non-Functional Requirements

Focusing only on features while neglecting performance, security, and usability requirements. This creates technical debt and user dissatisfaction.

### Stakeholder Disagreement

Different stakeholders wanting conflicting things. Without resolution, the team faces impossible requirements.

## Key Takeaways

- Requirements define what you're building and serve as the foundation for all subsequent work
- Gather functional, non-functional, business, and stakeholder requirements using multiple techniques
- Write requirements that are clear, complete, consistent, verifiable, feasible, necessary, and prioritized
- Document requirements formally in a requirements specification document
- Validate requirements with stakeholders before proceeding to design
- Avoid common pitfalls like scope creep, gold plating, and ambiguous language

In the next lesson, we'll explore how to create a Work Breakdown Structure (WBS) to organize and plan all the work required to deliver these requirements.`,
    estimatedMinutes: 30,
  },
  {
    levelId: 2,
    lessonNumber: 3,
    title: "Work Breakdown Structure (WBS)",
    content: `# Work Breakdown Structure (WBS)

The Work Breakdown Structure is one of the most powerful tools in a project manager's toolkit. It transforms a complex project into manageable pieces, enabling accurate estimation, clear assignments, and effective tracking.

## What is a WBS?

A Work Breakdown Structure is a hierarchical decomposition of the total scope of work to be carried out by the project team to accomplish the project objectives and create the required deliverables.

Think of it as a family tree for your project—starting with the complete project at the top and breaking it down into smaller and smaller pieces until you reach work packages that can be estimated, assigned, and tracked.

## Why WBS Matters

The WBS provides multiple critical benefits:

**Comprehensive scope definition**: By breaking down all work systematically, you ensure nothing is forgotten. If it's not in the WBS, it's not in the project.

**Accurate estimation**: It's difficult to estimate "build a website," but much easier to estimate "create homepage mockup" or "implement user login." The WBS enables bottom-up estimation.

**Clear work assignments**: Each work package can be assigned to a specific person or team, creating accountability and preventing confusion about who does what.

**Progress tracking**: The WBS structure enables you to track completion at multiple levels—individual tasks, work packages, and major deliverables.

**Communication tool**: The WBS provides a common language for discussing project scope with stakeholders, team members, and executives.

**Change impact analysis**: When changes are proposed, the WBS helps you identify all affected work packages and estimate the impact.

## WBS Principles

Effective WBS creation follows key principles:

### 100% Rule

The WBS must include 100% of the work defined by the project scope, including project management work. If work isn't in the WBS, it's not authorized.

Conversely, work that isn't required to meet project objectives shouldn't be in the WBS.

### Mutually Exclusive Elements

Each level of decomposition should be mutually exclusive—no overlap between elements at the same level. A task should appear in only one place in the WBS.

### Deliverable-Oriented

The WBS should be organized around deliverables (nouns) rather than activities (verbs). This keeps focus on what you're producing, not how you're producing it.

Good: "Requirements Document"
Bad: "Gather Requirements"

However, the lowest level (work packages) may include activities needed to create the deliverable.

### Appropriate Level of Detail

Decompose to a level where work packages can be:
- Estimated with reasonable accuracy (typically 8-80 hours of effort)
- Assigned to a single person or team
- Completed within a single reporting period
- Measured for progress

Don't over-decompose—creating thousands of tiny tasks creates management overhead without value.

## WBS Decomposition Approaches

Different projects benefit from different decomposition structures:

### Phase-Based Decomposition

Organize by project phases:


1.0 Website Redesign Project
  1.1 Requirements Phase
    1.1.1 Stakeholder Interviews
    1.1.2 Requirements Document
    1.1.3 Requirements Review
  1.2 Design Phase
    1.2.1 Information Architecture
    1.2.2 Visual Design
    1.2.3 Design Review
  1.3 Development Phase
  1.4 Testing Phase
  1.5 Deployment Phase


**Best for**: Projects with clear sequential phases, traditional Waterfall projects.

### Deliverable-Based Decomposition

Organize by major deliverables:


1.0 Website Redesign Project
  1.1 Homepage
    1.1.1 Homepage Design
    1.1.2 Homepage Development
    1.1.3 Homepage Testing
  1.2 Product Catalog
    1.2.1 Catalog Design
    1.2.2 Catalog Development
    1.2.3 Catalog Testing
  1.3 Shopping Cart
  1.4 Checkout Process


**Best for**: Projects with distinct deliverables that can be developed somewhat independently.

### Functional Area Decomposition

Organize by functional areas or subsystems:


1.0 Hospital Information System
  1.1 Patient Management
    1.1.1 Patient Registration
    1.1.2 Patient Records
    1.1.3 Appointment Scheduling
  1.2 Clinical Management
    1.2.1 Electronic Health Records
    1.2.2 Lab Results
    1.2.3 Prescription Management
  1.3 Billing and Insurance
  1.4 Reporting and Analytics


**Best for**: Large, complex systems with distinct functional areas.

### Geographic Decomposition

Organize by location:


1.0 Retail Store Rollout
  1.1 North Region
    1.1.1 New York Store
    1.1.2 Boston Store
    1.1.3 Philadelphia Store
  1.2 South Region
  1.3 West Region


**Best for**: Projects spanning multiple locations with similar work at each location.

## Creating a WBS: Step-by-Step

### Step 1: Identify Major Deliverables

Start by listing the major deliverables from your requirements. These become Level 2 of your WBS (Level 1 is the project itself).

Example for a mobile app project:
- iOS Application
- Android Application
- Backend API
- Admin Dashboard
- User Documentation

### Step 2: Decompose Each Deliverable

For each major deliverable, identify the components or sub-deliverables needed.

Example for "iOS Application":
- User Interface
- Business Logic
- Data Layer
- Testing
- App Store Submission

### Step 3: Continue Decomposing

Keep breaking down until you reach work packages—chunks of work that can be estimated, assigned, and tracked.

Example for "User Interface":
- Login Screen
- Home Screen
- Profile Screen
- Settings Screen
- Navigation Components

### Step 4: Add Project Management Work

Don't forget to include project management activities:


1.0 Project Management
  1.1 Project Planning
  1.2 Status Reporting
  1.3 Stakeholder Management
  1.4 Risk Management
  1.5 Change Control


### Step 5: Number the WBS

Assign hierarchical numbers to create a WBS dictionary:


1.0 Mobile App Project
  1.1 iOS Application
    1.1.1 User Interface
      1.1.1.1 Login Screen
      1.1.1.2 Home Screen
    1.1.2 Business Logic
  1.2 Android Application
  1.3 Backend API


This numbering enables precise reference: "We're behind schedule on 1.1.1.2."

## WBS Dictionary

The WBS itself shows structure but lacks detail. The WBS Dictionary provides detailed information about each element:

**WBS Element**: 1.1.1.2 Home Screen

**Description**: Design and implement the home screen for the iOS application, including navigation, featured content, and personalized recommendations.

**Deliverables**:
- Home screen mockup (approved by design team)
- Implemented home screen code
- Unit tests for home screen functionality

**Assigned To**: Sarah Chen (iOS Developer)

**Estimated Effort**: 24 hours

**Dependencies**: Requires 1.1.1.1 (Login Screen) and 1.3.2 (User API) to be complete

**Acceptance Criteria**:
- Matches approved design mockup
- Loads within 2 seconds
- Displays personalized content based on user preferences
- Passes all unit tests

## WBS and Other Project Documents

The WBS connects to other project management artifacts:

### WBS to Schedule

Each work package in the WBS becomes one or more activities in your project schedule. The WBS provides the what; the schedule adds the when.

### WBS to Budget

Costs are estimated for each work package, then rolled up to calculate total project cost. The WBS enables cost tracking at multiple levels.

### WBS to Risk Register

Risks can be associated with specific WBS elements, enabling targeted risk management.

### WBS to Responsibility Assignment Matrix

The WBS provides the work structure; the RAM shows who is responsible for each element.

## Common WBS Mistakes

### Too Much Detail

Creating thousands of tiny tasks that are impossible to maintain. Remember the 8-80 hour rule for work packages.

### Activity-Oriented Instead of Deliverable-Oriented

Organizing around "doing" instead of "producing." This makes it harder to measure progress and define completion.

### Inconsistent Decomposition

Using different decomposition approaches at the same level. For example, mixing phases and deliverables at Level 2.

### Missing Work

Forgetting project management activities, testing, documentation, or deployment work. Apply the 100% rule rigorously.

### Overlapping Elements

Having the same work appear in multiple places, leading to double-counting and confusion.

## WBS for Different Project Types

### Software Development

Typical structure:
- Requirements
- Architecture and Design
- Development (by feature or module)
- Testing
- Deployment
- Documentation

### Construction

Typical structure:
- Site Preparation
- Foundation
- Structural Work
- Mechanical Systems
- Electrical Systems
- Interior Finishing
- Landscaping

### Event Planning

Typical structure:
- Venue
- Catering
- Entertainment
- Marketing and Promotion
- Registration
- Logistics
- Post-Event Activities

## Tools for Creating WBS

### Mind Mapping Software

Tools like MindManager or XMind enable visual, hierarchical decomposition. Good for brainstorming and initial structure.

### Project Management Software

Tools like Microsoft Project, Smartsheet, or Monday.com include WBS features integrated with scheduling and resource management.

### Spreadsheets

Simple and flexible. Use indentation or numbering to show hierarchy.

### Sticky Notes

Low-tech but effective for collaborative WBS creation in workshops. Easy to rearrange as you refine structure.

## Key Takeaways

- The WBS hierarchically decomposes project scope into manageable work packages
- Follow the 100% rule: include all work, and only authorized work
- Organize around deliverables (nouns) rather than activities (verbs)
- Decompose to a level where work can be estimated, assigned, and tracked (8-80 hours)
- Choose decomposition approach based on project characteristics (phase, deliverable, functional, geographic)
- Create a WBS Dictionary to document details about each element
- The WBS connects to schedule, budget, risks, and responsibilities
- Avoid common mistakes: too much detail, activity orientation, missing work, overlapping elements

In the next lesson, we'll use the WBS as the foundation for creating a detailed project schedule using Gantt charts and critical path analysis.`,
    estimatedMinutes: 30,
  },
];

console.log('Seeding Level 2 lessons (1-3)...');

for (const lesson of level2Lessons) {
  await db.insert(schema.lessons).values(lesson);
  console.log(`✓ Lesson ${lesson.lessonNumber}: ${lesson.title}`);
}

console.log('Level 2 lessons 1-3 seeded successfully!');

await connection.end();
