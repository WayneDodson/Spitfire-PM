/**
 * seed-apm-content.mjs
 * Seeds APM PFQ and PMQ qualifications and their 8 modules into the database.
 * Content sourced from apm-academy.jsx (Claude-generated, May 2026).
 */

import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const conn = await createConnection(process.env.DATABASE_URL);

// ── Qualifications ────────────────────────────────────────────────────────────
const qualifications = [
  {
    id: 'pfq',
    title: 'PFQ — Project Fundamentals Qualification',
    subtitle: 'APM Foundation Level',
    level: 'Foundation',
    description: 'The PFQ is the entry-level APM qualification, designed to give you a broad understanding of project management principles, terminology, and techniques. It is ideal for anyone new to project management or working in a project environment.',
    estimatedHours: 12,
    orderIndex: 1,
  },
  {
    id: 'pmq',
    title: 'PMQ — Project Management Qualification',
    subtitle: 'APM Practitioner Level',
    level: 'Practitioner',
    description: 'The PMQ is the practitioner-level APM qualification, requiring a deeper understanding of project management concepts and their application. It is suited for those with some project management experience who want to demonstrate professional competence.',
    estimatedHours: 20,
    orderIndex: 2,
  },
];

// ── PFQ Modules ───────────────────────────────────────────────────────────────
const pfqModules = [
  {
    id: 'pfq-1',
    qualificationId: 'pfq',
    moduleNumber: 1,
    title: 'Introduction to Project Management',
    duration: '45 min',
    intro: 'This module introduces the fundamental concepts of project management: what a project is, why organisations use project management, and the core disciplines involved. You will learn the language of project management and understand how it differs from business-as-usual operations.',
    sections: [
      {
        heading: 'What is a Project?',
        body: 'A project is a unique, temporary endeavour undertaken to achieve a defined objective. Unlike ongoing operational work, projects have a defined start and end point, a specific scope, and produce a distinct output, outcome, or benefit. The APM Body of Knowledge defines a project as "a unique, transient endeavour undertaken to achieve planned objectives, which could be defined in terms of outputs, outcomes or benefits."\n\nProjects differ from business-as-usual (BAU) in several key ways: they are temporary rather than ongoing; they produce something new or changed; they involve uncertainty and risk; and they require dedicated resources and management attention. Examples range from constructing a building and implementing a new IT system to launching a product or reorganising a department.',
      },
      {
        heading: 'Why Project Management?',
        body: 'Project management provides the structured approach needed to deliver projects successfully. Without it, projects frequently overrun their budgets, miss deadlines, fail to deliver the intended benefits, or are abandoned altogether. Research consistently shows that organisations with mature project management practices deliver significantly more value from their investments.\n\nThe purpose of project management is to give organisations the capability to plan, execute, and control work that falls outside normal operations. It provides a common language, a set of proven techniques, and a framework for decision-making under uncertainty.',
      },
      {
        heading: 'The Project Management Context',
        body: 'Projects exist within a broader organisational context. A programme is a group of related projects managed in a coordinated way to obtain benefits not available from managing them individually. A portfolio is a collection of projects and programmes managed together to achieve strategic objectives.\n\nThe project sponsor is the senior responsible owner of the project, accountable for its success at the organisational level. The project manager is responsible for day-to-day management and delivery. Together with the project team, they form the core delivery structure. Stakeholders — anyone affected by or with an interest in the project — must be identified and managed throughout.',
      },
      {
        heading: 'Core Project Management Disciplines',
        body: 'The APM Body of Knowledge identifies several core disciplines: Scope Management (defining and controlling what is and is not included); Schedule Management (planning and controlling the timeline); Cost Management (estimating, budgeting, and controlling costs); Risk Management (identifying and managing uncertainty); Quality Management (ensuring outputs meet requirements); Resource Management (planning and managing people and materials); and Communications Management (ensuring the right information reaches the right people at the right time).\n\nThese disciplines are not sequential — they operate concurrently throughout the project lifecycle and are interdependent. A change in scope, for example, will typically affect schedule, cost, and risk simultaneously.',
      },
    ],
    terms: [
      { t: 'Project', d: 'A unique, temporary endeavour with a defined start and end, undertaken to achieve specific objectives.' },
      { t: 'Programme', d: 'A group of related projects managed in a coordinated way to realise benefits not achievable individually.' },
      { t: 'Portfolio', d: 'A collection of projects and programmes managed together to achieve strategic objectives.' },
      { t: 'Project Sponsor', d: 'The senior responsible owner of the project, accountable for its business case and overall success.' },
      { t: 'Stakeholder', d: 'Any individual or group with an interest in, or affected by, the project and its outcomes.' },
    ],
    quiz: [
      { q: 'Which of the following BEST describes a project?', opts: ['An ongoing operational activity with no defined end date', 'A unique, temporary endeavour with a defined objective', 'A collection of programmes managed for strategic benefit', 'A routine process repeated on a regular cycle'], ans: 1 },
      { q: 'What is the PRIMARY purpose of project management?', opts: ['To eliminate all risk from a project', 'To ensure projects are delivered on time regardless of cost', 'To provide a structured approach for delivering change successfully', 'To replace business-as-usual operations'], ans: 2 },
      { q: 'A programme is BEST described as:', opts: ['A single large project with many tasks', 'A group of related projects managed to realise collective benefits', 'A portfolio of unrelated projects', 'The project manager\'s work plan'], ans: 1 },
      { q: 'Who is ultimately accountable for the success of a project at the organisational level?', opts: ['The project manager', 'The project team', 'The project sponsor', 'The steering committee'], ans: 2 },
      { q: 'Which of the following is NOT a core project management discipline?', opts: ['Risk management', 'Scope management', 'Marketing management', 'Quality management'], ans: 2 },
    ],
  },
  {
    id: 'pfq-2',
    qualificationId: 'pfq',
    moduleNumber: 2,
    title: 'Scope, Schedule and Cost Management',
    duration: '50 min',
    intro: 'The three primary constraints of any project — scope, schedule, and cost — form the classic "triple constraint" or "iron triangle." This module explores how each is defined, planned, and controlled, and how changes to one inevitably affect the others.',
    sections: [
      {
        heading: 'Scope Management',
        body: 'Scope defines the boundaries of the project — what work will be done and what will not. A clear scope statement prevents misunderstandings and provides the baseline against which changes are assessed. The Work Breakdown Structure (WBS) is the primary tool for decomposing scope: it breaks the total project deliverable into progressively smaller components, ultimately reaching work packages that can be estimated, assigned, and tracked.\n\nScope creep — the uncontrolled expansion of project scope — is among the most common causes of project overruns. A formal change control process is therefore inseparable from scope management. Any proposed change to agreed scope must be assessed for its impact on schedule, cost, quality, and risk before approval or rejection. The scope baseline, once established, can only be legitimately changed through formal change control.',
      },
      {
        heading: 'Schedule Planning and Control',
        body: 'Schedule management translates defined scope into a time-based plan. Activities are identified, sequenced, estimated, and resourced to produce a project schedule. The Gantt chart is the most widely recognised scheduling tool — a bar chart representing activities against a timeline, showing start and end dates, duration, and dependencies.\n\nMore analytically sophisticated is the Critical Path Method (CPM), a network-based technique identifying the longest sequence of dependent activities — the critical path — which determines the project\'s earliest possible completion date. Activities on the critical path have zero float, meaning any delay will delay the whole project. Activities off the critical path have float, providing scheduling flexibility. Understanding the critical path enables prioritised monitoring and targeted resource allocation.',
      },
      {
        heading: 'Risk Management',
        body: 'Risk is an uncertain event or condition that, if it occurs, has a positive or negative effect on project objectives. Risk management involves systematic identification, assessment, and treatment of risks to maximise positive outcomes and minimise negative ones.\n\nThe process encompasses: Identification (using brainstorming, expert interviews, and assumption analysis); Assessment (evaluating each risk by probability and impact via a probability/impact matrix); Response Planning (for threats: avoid, transfer, mitigate, or accept; for opportunities: exploit, enhance, share, or accept); and Monitoring and Control (tracking risks, identifying new ones, and evaluating response effectiveness throughout the lifecycle). All risks are documented in a Risk Register, which becomes a live management tool updated regularly.',
      },
      {
        heading: 'Cost Management',
        body: 'Cost management encompasses estimating, budgeting, and controlling project costs. Estimating techniques range from analogous estimating (using historical data from similar projects) to parametric estimating (using statistical relationships between variables) and bottom-up estimating (aggregating estimates for individual work packages).\n\nEarned Value Management (EVM) is a powerful integrated performance measurement technique that combines scope, schedule, and cost data to provide objective measures of project performance. Key EVM metrics include: Planned Value (PV) — the budgeted cost of work scheduled; Earned Value (EV) — the budgeted cost of work actually performed; and Actual Cost (AC) — the actual cost incurred. From these, Schedule Variance (SV = EV − PV) and Cost Variance (CV = EV − AC) reveal whether the project is ahead or behind schedule and under or over budget.',
      },
    ],
    terms: [
      { t: 'Work Breakdown Structure (WBS)', d: 'Hierarchical decomposition of total project scope into deliverable-oriented work packages.' },
      { t: 'Scope Creep', d: 'Uncontrolled expansion of project scope without corresponding adjustment to time, cost, or resources.' },
      { t: 'Critical Path', d: 'The longest sequence of dependent activities; determines the minimum possible project duration.' },
      { t: 'Float (Slack)', d: 'The amount of time an activity can be delayed without affecting the overall project end date.' },
      { t: 'Earned Value Management (EVM)', d: 'Integrated technique measuring project performance by comparing planned, earned, and actual values.' },
    ],
    quiz: [
      { q: 'What tool decomposes project scope into smaller, manageable deliverables?', opts: ['Gantt chart', 'Risk register', 'Work Breakdown Structure (WBS)', 'Communication plan'], ans: 2 },
      { q: '\'Scope creep\' refers to:', opts: ['Gradual reduction in project scope', 'Formal expansion of scope via change control', 'Uncontrolled addition of work without adjusting time or budget', 'A technique for measuring project performance'], ans: 2 },
      { q: 'The Critical Path in a project schedule represents:', opts: ['The most expensive series of tasks', 'The longest sequence of dependent activities determining project duration', 'Tasks assigned to the most senior team members', 'Activities that can be delayed without any impact'], ans: 1 },
      { q: 'In Earned Value Management, Cost Variance (CV) is calculated as:', opts: ['Planned Value minus Actual Cost', 'Earned Value minus Actual Cost', 'Actual Cost minus Planned Value', 'Earned Value minus Planned Value'], ans: 1 },
      { q: 'An activity with ZERO float means:', opts: ['The activity is not yet planned', 'The activity can be delayed freely', 'The activity is on the critical path and cannot be delayed without impacting the end date', 'The activity is already complete'], ans: 2 },
    ],
  },
  {
    id: 'pfq-3',
    qualificationId: 'pfq',
    moduleNumber: 3,
    title: 'Stakeholder Engagement and Communication',
    duration: '40 min',
    intro: 'Projects succeed or fail through people. This module covers how to identify, analyse, and engage stakeholders effectively, and how to plan communications that keep the right people informed at the right time.',
    sections: [
      {
        heading: 'Stakeholder Identification and Analysis',
        body: 'A stakeholder is any individual, group, or organisation that may affect, be affected by, or perceive itself to be affected by the project. Effective stakeholder management begins with thorough identification — casting the net wide to include internal stakeholders (sponsor, project team, functional managers, senior leadership) and external stakeholders (customers, suppliers, regulators, community groups, media).\n\nOnce identified, stakeholders are analysed to understand their level of interest in the project and their power to influence it. The Power/Interest grid is a widely used tool: stakeholders with high power and high interest require close management; those with high power but low interest need to be kept satisfied; high interest but low power stakeholders should be kept informed; and low power, low interest stakeholders require minimal effort. This analysis informs the engagement strategy for each stakeholder group.',
      },
      {
        heading: 'Stakeholder Engagement',
        body: 'Engagement goes beyond communication — it involves actively involving stakeholders in appropriate decisions, managing their expectations, and building the relationships needed for project success. The engagement continuum ranges from informing (one-way communication) through consulting (seeking input) to collaborating (joint decision-making) and empowering (delegating authority).\n\nResistance to change is a natural human response and must be anticipated and managed. Understanding the reasons for resistance — fear of the unknown, perceived loss of status or control, lack of trust — enables targeted engagement strategies. Early and genuine involvement of key stakeholders typically reduces resistance and builds the commitment needed for successful implementation.',
      },
      {
        heading: 'Communications Planning',
        body: 'A Communications Management Plan documents who needs what information, when they need it, in what format, and through which channel. It ensures that communication is intentional rather than ad hoc, and that the right messages reach the right audiences at the right time.\n\nKey considerations include: audience analysis (what does each stakeholder need to know, and what do they already know?); message design (clear, concise, and appropriate to the audience); channel selection (email, meetings, reports, dashboards — each has different strengths); frequency and timing; and feedback mechanisms to confirm understanding and gather input. Regular status reports, steering committee updates, and team meetings are common communication vehicles in project environments.',
      },
    ],
    terms: [
      { t: 'Stakeholder', d: 'Any individual or group with an interest in, or affected by, the project and its outcomes.' },
      { t: 'Power/Interest Grid', d: 'A tool for categorising stakeholders by their power to influence the project and their level of interest in it.' },
      { t: 'Communications Management Plan', d: 'Document specifying who receives what information, when, in what format, and through which channel.' },
      { t: 'Engagement Continuum', d: 'The spectrum of stakeholder involvement from informing through to empowering.' },
      { t: 'Change Resistance', d: 'Natural human opposition to change, driven by fear, uncertainty, or perceived loss.' },
    ],
    quiz: [
      { q: 'On a Power/Interest grid, a stakeholder with HIGH power and LOW interest should be:', opts: ['Closely managed with frequent detailed updates', 'Kept satisfied with regular high-level communication', 'Kept informed with detailed progress reports', 'Monitored with minimal effort'], ans: 1 },
      { q: 'Which of the following BEST describes stakeholder engagement?', opts: ['Sending regular email updates to all stakeholders', 'Actively involving stakeholders in decisions and managing their expectations', 'Holding a kick-off meeting at the start of the project', 'Producing a stakeholder register'], ans: 1 },
      { q: 'A Communications Management Plan primarily defines:', opts: ['The project budget for communications activities', 'Who needs what information, when, and through which channel', 'The project manager\'s communication style', 'How conflicts between stakeholders will be resolved'], ans: 1 },
      { q: 'Resistance to change is BEST managed by:', opts: ['Ignoring it and proceeding with the project plan', 'Removing resistant stakeholders from the project', 'Understanding the reasons for resistance and engaging stakeholders early', 'Escalating all resistance to the project sponsor immediately'], ans: 2 },
      { q: 'Which stakeholder engagement approach involves joint decision-making with stakeholders?', opts: ['Informing', 'Consulting', 'Collaborating', 'Monitoring'], ans: 2 },
    ],
  },
  {
    id: 'pfq-4',
    qualificationId: 'pfq',
    moduleNumber: 4,
    title: 'Resources, Quality and Procurement',
    duration: '50 min',
    intro: 'Successful project delivery depends on effective management of human and physical resources, assurance of quality across all outputs, and professional management of external procurement relationships.',
    sections: [
      {
        heading: 'Resource Management',
        body: 'Resources encompass the people, equipment, materials, and facilities needed to deliver the project. Resource management involves identifying what is needed, planning when and how much, acquiring it, and managing its use throughout the project.\n\nResource levelling addresses the challenge of resource over-allocation — where the plan demands more of a resource than is available at a given time. Techniques include delaying non-critical activities (using available float), splitting activities, or negotiating additional resource. A resource histogram visually represents resource demand over time, making over-allocation immediately visible. Effective resource management requires close collaboration with functional managers who control the availability of specialist staff.',
      },
      {
        heading: 'Quality Management',
        body: 'Quality management ensures that project outputs meet defined requirements and are fit for purpose. It encompasses quality planning (defining quality standards and how they will be achieved), quality assurance (systematic review of processes to ensure they are capable of producing quality outputs), and quality control (inspection and testing of outputs against defined acceptance criteria).\n\nThe cost of quality has two components: the cost of conformance (prevention and appraisal activities — doing things right) and the cost of non-conformance (internal and external failure — fixing things that went wrong). Investing in prevention and appraisal typically reduces total quality costs by avoiding expensive rework and failure. A quality management plan documents the quality standards applicable to the project and the activities planned to achieve them.',
      },
      {
        heading: 'Procurement Management',
        body: 'Procurement involves acquiring goods and services from external suppliers. The procurement lifecycle includes: make-or-buy analysis (deciding whether to produce in-house or procure externally); procurement planning (defining what to procure, when, and how); supplier selection (tendering, evaluation, and contract award); contract management (monitoring supplier performance and managing the contract relationship); and contract closure (formal completion and evaluation).\n\nContract types vary in how risk is allocated between client and supplier. Fixed-price contracts transfer cost risk to the supplier; cost-reimbursable contracts retain cost risk with the client; and time-and-materials contracts sit between the two. The choice of contract type should reflect the level of scope certainty — fixed-price is appropriate when scope is well-defined; cost-reimbursable suits uncertain or evolving scope.',
      },
    ],
    terms: [
      { t: 'Resource Levelling', d: 'Technique for resolving resource over-allocation by adjusting activity timing or splitting tasks.' },
      { t: 'Resource Histogram', d: 'Bar chart showing resource demand over time, making over-allocation visible.' },
      { t: 'Quality Assurance', d: 'Systematic review of project processes to ensure they are capable of producing quality outputs.' },
      { t: 'Quality Control', d: 'Inspection and testing of project outputs against defined acceptance criteria.' },
      { t: 'Fixed-Price Contract', d: 'Contract type where the supplier bears the cost risk; appropriate when scope is well-defined.' },
    ],
    quiz: [
      { q: 'Resource levelling is used to:', opts: ['Increase the number of resources on a project', 'Resolve resource over-allocation by adjusting activity timing', 'Reduce the project budget', 'Assign resources to critical path activities only'], ans: 1 },
      { q: 'Quality assurance differs from quality control in that it focuses on:', opts: ['Inspecting finished outputs for defects', 'Testing software before release', 'Reviewing processes to ensure they are capable of producing quality outputs', 'Documenting quality standards'], ans: 2 },
      { q: 'The \'cost of non-conformance\' refers to:', opts: ['The cost of prevention and appraisal activities', 'The cost of fixing defects and failures after they occur', 'The total quality management budget', 'The cost of external audits'], ans: 1 },
      { q: 'A fixed-price contract is MOST appropriate when:', opts: ['The project scope is uncertain and likely to change', 'The client wants to retain all cost risk', 'The project scope is well-defined and stable', 'The supplier has limited experience'], ans: 2 },
      { q: 'Which procurement activity involves deciding whether to produce in-house or buy externally?', opts: ['Contract closure', 'Supplier selection', 'Make-or-buy analysis', 'Contract management'], ans: 2 },
    ],
  },
];

// ── PMQ Modules ───────────────────────────────────────────────────────────────
const pmqModules = [
  {
    id: 'pmq-1',
    qualificationId: 'pmq',
    moduleNumber: 1,
    title: 'Project Governance and Lifecycle',
    duration: '55 min',
    intro: 'At practitioner level, governance moves from concept to practice. This module examines how organisations structure decision-making authority on projects, the role of the business case throughout the lifecycle, and how different lifecycle models suit different project contexts.',
    sections: [
      {
        heading: 'Project Governance',
        body: 'Governance defines the framework of authority, accountability, and decision-making that enables a project to be directed and controlled effectively. Good governance ensures that the right decisions are made by the right people at the right time, with appropriate oversight and challenge.\n\nThe project board (or steering committee) is the primary governance body, typically comprising the project sponsor, senior user representative(s), and senior supplier representative(s). It is responsible for: approving the business case; authorising stage boundaries; resolving escalated issues; and ensuring the project remains aligned with organisational strategy. The project manager reports to the board and is accountable for day-to-day delivery within the authority delegated by the board.',
      },
      {
        heading: 'The Business Case',
        body: 'The business case is the document that justifies the investment in the project by demonstrating that the expected benefits outweigh the costs and risks. It is not a one-time document — it is a living artefact reviewed and updated at each stage gate to confirm the project remains viable and worthwhile.\n\nA robust business case addresses: the strategic context and problem/opportunity being addressed; the options considered and why the chosen option is preferred; the expected benefits (quantified where possible); the costs (capital and ongoing); the risks; the timescales; and the investment appraisal (NPV, IRR, or payback period). The sponsor owns the business case; the project manager is responsible for providing the data to keep it current.',
      },
      {
        heading: 'Project Lifecycle Models',
        body: 'The project lifecycle defines the phases through which a project passes from initiation to closure. Different lifecycle models suit different project contexts.\n\nLinear (waterfall) lifecycles progress sequentially through defined phases (initiation, planning, execution, monitoring and control, closure). They are appropriate where requirements are stable and well-understood, and where the cost of change is high. Iterative and incremental lifecycles (Agile, Scrum, DSDM) deliver value in repeated cycles, incorporating feedback and adapting to change. They are suited to projects with evolving requirements, particularly in software development. Hybrid lifecycles combine elements of both — for example, using waterfall for infrastructure and Agile for software components within the same programme.',
      },
      {
        heading: 'Stage Gates and Tollgates',
        body: 'Stage gates (also called tollgates or decision gates) are formal review points at the end of each project phase. At a stage gate, the project board reviews the current state of the project — progress against plan, updated business case, revised risk profile — and makes a conscious decision to: proceed to the next stage; pause for further investigation; redirect the project; or close it.\n\nStage gates are a critical governance mechanism. They prevent organisations from continuing to invest in projects that are no longer viable, and they provide a structured opportunity to incorporate learning and adjust direction. The gate review should be genuinely challenging — not a rubber-stamp exercise — with the project board prepared to make difficult decisions when the evidence warrants it.',
      },
    ],
    terms: [
      { t: 'Project Board', d: 'The governance body responsible for directing the project, comprising sponsor, senior user, and senior supplier.' },
      { t: 'Business Case', d: 'Document justifying the project investment by demonstrating benefits outweigh costs and risks.' },
      { t: 'Stage Gate', d: 'Formal review point at the end of a project phase where the board decides whether to proceed, redirect, or close.' },
      { t: 'Linear Lifecycle', d: 'Sequential project lifecycle (waterfall) suited to stable, well-defined requirements.' },
      { t: 'Iterative Lifecycle', d: 'Lifecycle delivering value in repeated cycles, adapting to change — suited to evolving requirements (e.g. Agile).' },
    ],
    quiz: [
      { q: 'The PRIMARY purpose of a project board is to:', opts: ['Manage day-to-day project activities', 'Direct and oversee the project at the governance level', 'Produce the project schedule', 'Manage the project budget'], ans: 1 },
      { q: 'The business case should be reviewed:', opts: ['Only at project initiation', 'At the end of the project', 'At each stage gate throughout the lifecycle', 'Annually by the finance department'], ans: 2 },
      { q: 'A stage gate review results in a decision to \'redirect\' the project. This means:', opts: ['The project is closed immediately', 'The project continues unchanged', 'The project\'s objectives, approach, or scope are changed before proceeding', 'The project is paused pending further funding'], ans: 2 },
      { q: 'Which lifecycle model is MOST appropriate for a project with stable, well-defined requirements?', opts: ['Agile/Scrum', 'Iterative', 'Linear (waterfall)', 'Hybrid'], ans: 2 },
      { q: 'Who OWNS the business case?', opts: ['The project manager', 'The project sponsor', 'The project board', 'The finance director'], ans: 1 },
    ],
  },
  {
    id: 'pmq-2',
    qualificationId: 'pmq',
    moduleNumber: 2,
    title: 'Planning, Monitoring and Control',
    duration: '60 min',
    intro: 'Planning is the foundation of project control. This module examines advanced planning techniques, the use of baselines for performance measurement, and the mechanisms for maintaining control when reality diverges from plan.',
    sections: [
      {
        heading: 'Integrated Planning',
        body: 'Effective project planning integrates all planning dimensions — scope, schedule, cost, resource, risk, quality, and communications — into a coherent, internally consistent plan. The project management plan (or project initiation document) is the master planning document that brings these together and provides the approved baseline against which performance is measured.\n\nPlanning is iterative: the level of detail increases as the project progresses and uncertainty reduces. Rolling wave planning acknowledges this by planning near-term work in detail while leaving future work at a higher level of abstraction. This is particularly valuable on longer projects where detailed planning of distant activities would be premature and likely to require revision.',
      },
      {
        heading: 'Baselines and Change Control',
        body: 'A baseline is the approved version of a plan against which actual performance is measured. The three primary baselines are the scope baseline (approved WBS and scope statement), the schedule baseline (approved project schedule), and the cost baseline (approved time-phased budget). Together, these form the performance measurement baseline.\n\nChange control is the formal process for managing changes to baselines. All proposed changes are documented in a change request, assessed for their impact on scope, schedule, cost, quality, and risk, and then either approved, rejected, or deferred by the appropriate authority (project manager for minor changes, project board for significant ones). Approved changes update the relevant baseline. Rigorous change control prevents scope creep and maintains the integrity of the performance measurement baseline.',
      },
      {
        heading: 'Earned Value Management in Practice',
        body: 'Earned Value Management (EVM) provides objective, integrated performance data by measuring the value of work actually completed against the plan. The key metrics are: Planned Value (PV) — the budgeted cost of work scheduled to date; Earned Value (EV) — the budgeted cost of work actually completed to date; and Actual Cost (AC) — the actual cost incurred to date.\n\nDerived metrics include: Schedule Variance (SV = EV − PV, negative = behind schedule); Cost Variance (CV = EV − AC, negative = over budget); Schedule Performance Index (SPI = EV/PV, <1 = behind); and Cost Performance Index (CPI = EV/AC, <1 = over budget). Forecast metrics — Estimate at Completion (EAC) and Estimate to Complete (ETC) — project the final cost based on current performance trends. EVM is most powerful when used consistently throughout the project, enabling early identification of performance problems and realistic forecasting.',
      },
      {
        heading: 'Issue and Exception Management',
        body: 'Issues are problems that have already occurred and require management action — they are certainties, unlike risks which are uncertainties. An issue log records all open issues, their impact, the owner responsible for resolution, and the target resolution date.\n\nException management is the process by which the project manager escalates situations that exceed delegated tolerances to the project board. Tolerances define the acceptable range of variation in time, cost, scope, quality, risk, and benefit within which the project manager can operate without escalation. When a forecast indicates that a tolerance will be breached, the project manager raises an exception report, and the board decides how to respond. This mechanism ensures that governance authority is exercised at the right level — routine decisions stay with the project manager; significant deviations go to the board.',
      },
    ],
    terms: [
      { t: 'Performance Measurement Baseline', d: 'The integrated scope, schedule, and cost baseline against which project performance is measured.' },
      { t: 'Change Request', d: 'Formal document proposing a change to a project baseline, requiring assessment and authorisation.' },
      { t: 'Earned Value (EV)', d: 'The budgeted cost of work actually completed; the core metric of Earned Value Management.' },
      { t: 'Cost Performance Index (CPI)', d: 'EV divided by AC; a CPI below 1.0 indicates the project is over budget.' },
      { t: 'Tolerance', d: 'The acceptable range of variation in time, cost, scope, quality, risk, or benefit within which the project manager can act without escalation.' },
    ],
    quiz: [
      { q: 'Rolling wave planning is BEST described as:', opts: ['Planning the entire project in detail at the outset', 'Planning near-term work in detail while leaving future work at a higher level', 'Replanning the project after each stage gate', 'A technique for compressing the project schedule'], ans: 1 },
      { q: 'A Cost Performance Index (CPI) of 0.85 indicates:', opts: ['The project is 15% ahead of schedule', 'The project is spending £0.85 for every £1.00 of planned value', 'The project is over budget — only £0.85 of value is being delivered per £1.00 spent', 'The project will complete 15% under budget'], ans: 2 },
      { q: 'When a project manager forecasts that a cost tolerance will be breached, they should:', opts: ['Immediately stop all project work', 'Raise an exception report to the project board', 'Adjust the baseline to match the new forecast', 'Request additional budget without informing the board'], ans: 1 },
      { q: 'The performance measurement baseline comprises:', opts: ['The project schedule only', 'The scope, schedule, and cost baselines combined', 'The risk register and issue log', 'The project management plan in its entirety'], ans: 1 },
      { q: 'Schedule Variance (SV) is calculated as:', opts: ['Planned Value minus Actual Cost', 'Actual Cost minus Earned Value', 'Earned Value minus Planned Value', 'Planned Value minus Earned Value'], ans: 2 },
    ],
  },
  {
    id: 'pmq-3',
    qualificationId: 'pmq',
    moduleNumber: 3,
    title: 'Advanced Risk, Quality and Procurement',
    duration: '60 min',
    intro: 'At practitioner level, risk management moves from qualitative assessment to quantitative analysis. Quality management is understood within Total Quality Management and continuous improvement frameworks. Procurement strategy becomes a sophisticated discipline involving contract structuring, supplier relationship management, and commercial risk allocation.',
    sections: [
      {
        heading: 'Quantitative Risk Analysis',
        body: 'While qualitative risk analysis (probability/impact matrices) suffices for many projects, complex or high-value projects benefit from quantitative techniques assigning numerical values to risk exposure. Expected Monetary Value (EMV) calculates the statistical average outcome of a risk scenario: EMV = Probability × Impact (£). Decision tree analysis uses EMV to compare alternative courses of action under uncertainty, selecting the option with the highest expected value.\n\nQuantitative schedule risk analysis — typically using Monte Carlo simulation — aggregates the probabilistic impact of all identified risks to produce a probability distribution for the project completion date. Similarly, quantitative cost risk analysis produces a distribution for total project cost, enabling contingency reserves to be set at statistically justified levels (e.g., the 80th percentile of the cost distribution) rather than arbitrary percentage uplifts.',
      },
      {
        heading: 'Total Quality Management and Continuous Improvement',
        body: 'Total Quality Management (TQM) is a management philosophy emphasising organisation-wide commitment to quality, customer focus, and continuous improvement. In a project context, TQM principles translate to: customer requirements drive quality standards; quality is built in, not inspected in; every team member is responsible for quality; and process improvement is continuous.\n\nThe Plan-Do-Check-Act (PDCA) cycle provides the framework for continuous improvement: Plan (define the improvement and expected outcome), Do (implement on a small scale), Check (measure results against expectations), Act (standardise if successful, or iterate). ISO 9001 provides the internationally recognised quality management system framework, requiring documented processes, internal audits, management reviews, and a demonstrable commitment to continual improvement.',
      },
      {
        heading: 'Procurement Strategy and Contract Management',
        body: 'Procurement strategy decisions are among the most consequential on a project, determining the commercial framework for delivery. Key strategic decisions include: sourcing model (single-source, competitive tender, framework agreements); contract structure (the degree to which cost risk is allocated to the supplier versus retained by the client); and relationship model (transactional versus collaborative partnership).\n\nRelational contracting — including alliance contracting and collaborative frameworks — represents a significant evolution beyond transactional procurement. By aligning incentives through pain/gain share mechanisms and shared project objectives, relational contracts aim to reduce adversarial behaviour, encourage early problem-solving, and improve outcomes on complex or uncertain projects. Contract management post-award involves performance monitoring against defined KPIs, change management within the contract, supplier relationship management, and contract closure.',
      },
    ],
    terms: [
      { t: 'Expected Monetary Value (EMV)', d: 'Probability × Impact (£); the statistical average financial outcome of a risk scenario.' },
      { t: 'PDCA Cycle', d: 'Plan-Do-Check-Act; iterative framework for continuous quality improvement.' },
      { t: 'ISO 9001', d: 'International standard for quality management systems, requiring documented processes and continual improvement.' },
      { t: 'Pain/Gain Share', d: 'Contract mechanism sharing cost overruns and savings proportionally between client and supplier.' },
      { t: 'Monte Carlo Simulation', d: 'Quantitative risk technique producing a probability distribution for project cost or schedule outcomes.' },
    ],
    quiz: [
      { q: 'A risk has a 30% probability of occurring with an impact of £50,000. The Expected Monetary Value (EMV) is:', opts: ['£50,000', '£15,000', '£35,000', '£30,000'], ans: 1 },
      { q: 'Monte Carlo simulation is used in project management to:', opts: ['Generate random project schedules', 'Produce a probability distribution for project cost or schedule outcomes', 'Select the best supplier from a tender list', 'Calculate Earned Value metrics'], ans: 1 },
      { q: 'The PDCA cycle stands for:', opts: ['Plan, Deploy, Control, Assess', 'Plan, Do, Check, Act', 'Prepare, Deliver, Check, Approve', 'Plan, Document, Communicate, Authorise'], ans: 1 },
      { q: 'A pain/gain share contract mechanism is designed to:', opts: ['Transfer all cost risk to the supplier', 'Retain all cost risk with the client', 'Align client and supplier incentives by sharing cost overruns and savings', 'Fix the contract price regardless of actual costs'], ans: 2 },
      { q: 'Setting contingency reserves at the 80th percentile of a Monte Carlo cost distribution means:', opts: ['80% of the contingency will be spent', 'There is an 80% probability that the project will complete within the budgeted cost plus contingency', 'The contingency covers 80% of identified risks', 'The project has an 80% chance of completing on time'], ans: 1 },
    ],
  },
  {
    id: 'pmq-4',
    qualificationId: 'pmq',
    moduleNumber: 4,
    title: 'Leadership, Teams and Organisational Change',
    duration: '55 min',
    intro: 'Projects are delivered by people. This module examines the leadership competencies required of project managers, the dynamics of high-performing teams, and the change management disciplines needed to ensure that project outputs are successfully adopted by the organisation.',
    sections: [
      {
        heading: 'Project Leadership',
        body: 'Leadership in a project context differs from management. Management focuses on planning, organising, and controlling — ensuring the project is delivered to plan. Leadership focuses on inspiring, motivating, and influencing — ensuring the people involved are engaged, capable, and committed. Effective project managers do both.\n\nSituational leadership theory (Hersey and Blanchard) proposes that the most effective leadership style depends on the follower\'s development level — their competence and commitment for a specific task. Four styles are identified: Directing (high task, low relationship — for low competence, high commitment); Coaching (high task, high relationship — for some competence, low commitment); Supporting (low task, high relationship — for high competence, variable commitment); and Delegating (low task, low relationship — for high competence, high commitment). The skilled project manager adapts their style to the individual and the situation.',
      },
      {
        heading: 'Team Development',
        body: 'Tuckman\'s model of team development identifies five stages: Forming (team members are polite and uncertain, looking to the leader for direction); Storming (conflict emerges as team members assert themselves and challenge each other); Norming (the team establishes working norms and begins to collaborate effectively); Performing (the team operates as a high-performing unit with minimal management intervention); and Adjourning (the team disbands at project completion).\n\nThe project manager\'s role evolves through these stages: directive in Forming, facilitative in Storming, enabling in Norming, and delegating in Performing. Conflict in the Storming phase, while uncomfortable, is a necessary part of team development and should be managed constructively rather than suppressed. A team that never storms may never reach the Performing stage.',
      },
      {
        heading: 'Organisational Change Management',
        body: 'Projects deliver outputs; change management ensures those outputs are adopted and the intended benefits are realised. Without effective change management, even technically successful projects fail to deliver value — the new system is not used, the new process is not followed, the new structure does not function as intended.\n\nKotter\'s 8-Step Change Model provides a structured approach: Create urgency; Build a guiding coalition; Form a strategic vision; Enlist a volunteer army; Enable action by removing barriers; Generate short-term wins; Sustain acceleration; and Institute change. Prosci\'s ADKAR model focuses on individual change: Awareness (of the need for change), Desire (to support it), Knowledge (of how to change), Ability (to implement), and Reinforcement (to sustain). Both models emphasise that change is a human process requiring sustained leadership attention, not a one-time event.',
      },
      {
        heading: 'Benefits Realisation',
        body: 'Benefits are the measurable improvements resulting from project outputs. Benefits realisation management ensures that the intended benefits are defined, tracked, and ultimately delivered — often extending beyond project closure into the operational phase.\n\nThe benefits realisation plan identifies each benefit, its owner, the baseline measure, the target, the measurement method, and the expected realisation date. The project manager is responsible for ensuring the plan is in place; the benefit owner (typically a business manager) is responsible for realising the benefit in operations. A post-project review (or benefits review) conducted 6–12 months after project closure assesses whether the expected benefits have been realised and captures lessons for future projects.',
      },
    ],
    terms: [
      { t: 'Situational Leadership', d: 'Leadership theory proposing that the most effective style depends on the follower\'s competence and commitment.' },
      { t: 'Tuckman\'s Model', d: 'Five-stage team development model: Forming, Storming, Norming, Performing, Adjourning.' },
      { t: 'ADKAR Model', d: 'Individual change model: Awareness, Desire, Knowledge, Ability, Reinforcement.' },
      { t: 'Benefits Realisation Plan', d: 'Document identifying each benefit, its owner, baseline, target, measurement method, and realisation date.' },
      { t: 'Post-Project Review', d: 'Review conducted after project closure to assess whether expected benefits have been realised and capture lessons learned.' },
    ],
    quiz: [
      { q: 'According to situational leadership theory, a \'Coaching\' style (high task, high relationship) is MOST appropriate for a team member who has:', opts: ['High competence and high commitment', 'Low competence and high commitment', 'Some competence and low commitment', 'High competence and variable commitment'], ans: 2 },
      { q: 'In Tuckman\'s model, the \'Storming\' stage is characterised by:', opts: ['High performance and minimal management intervention', 'Polite, uncertain behaviour with reliance on the leader', 'Conflict as team members assert themselves and challenge each other', 'The team disbanding at project completion'], ans: 2 },
      { q: 'The ADKAR model focuses on:', opts: ['Organisational change at the strategic level', 'Individual change — the steps each person must go through to adopt change', 'Project governance and decision-making', 'Risk identification and assessment'], ans: 1 },
      { q: 'Who is typically responsible for REALISING benefits after project closure?', opts: ['The project manager', 'The project sponsor', 'A business manager (benefit owner)', 'The project board'], ans: 2 },
      { q: 'A post-project review is PRIMARILY conducted to:', opts: ['Assess the project manager\'s performance', 'Determine whether the project was delivered on time and budget', 'Assess whether expected benefits have been realised and capture lessons learned', 'Close the project formally and release resources'], ans: 2 },
    ],
  },
];

// ── Insert ────────────────────────────────────────────────────────────────────

// Clear existing data
await conn.execute('DELETE FROM apmModuleProgress');
await conn.execute('DELETE FROM apmModules');
await conn.execute('DELETE FROM apmQualifications');

// Insert qualifications
for (const q of qualifications) {
  await conn.execute(
    'INSERT INTO apmQualifications (id, title, subtitle, level, description, estimatedHours, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [q.id, q.title, q.subtitle, q.level, q.description, q.estimatedHours, q.orderIndex]
  );
  console.log(`Inserted qualification: ${q.id}`);
}

// Insert modules
const allModules = [...pfqModules, ...pmqModules];
for (const m of allModules) {
  await conn.execute(
    'INSERT INTO apmModules (id, qualificationId, moduleNumber, title, duration, intro, sections, terms, quiz) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      m.id,
      m.qualificationId,
      m.moduleNumber,
      m.title,
      m.duration,
      m.intro,
      JSON.stringify(m.sections),
      JSON.stringify(m.terms),
      JSON.stringify(m.quiz),
    ]
  );
  console.log(`Inserted module: ${m.id} — ${m.title}`);
}

await conn.end();
console.log('\nDone. Seeded 2 qualifications and 8 modules.');
