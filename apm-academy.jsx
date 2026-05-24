import { useState } from "react";

const T = {
  bg: "#0B1628", surface: "#0F1E36", card: "#13243F",
  border: "rgba(255,255,255,0.07)", text: "#DDE4EF", muted: "#6A8AAE",
  pfq: "#4A9FE2", pmq: "#D4A843", success: "#3DAB78", danger: "#D9534F",
  light: "rgba(255,255,255,0.04)",
};

const CREDS = (typeof window !== "undefined" && window.APP_CONFIG) || { username: "", password: "" };

const QUAL = {
  pfq: {
    id: "pfq", title: "Project Fundamentals Qualification", abbr: "PFQ",
    level: "Foundation Level", color: T.pfq,
    desc: "A broad introduction to project management concepts across the full project lifecycle. The ideal starting point for learners new to project management.",
    modules: [
      {
        id: "pfq-1", num: 1, title: "Foundations of Project Management", dur: "45 min",
        intro: "Project management is the application of knowledge, skills, tools, and techniques to project activities to meet requirements. Understanding what constitutes a project—and how it differs from operational work—is foundational to effective practice.",
        sections: [
          { heading: "Defining a Project",
            body: "A project is a temporary endeavour undertaken to create a unique product, service, or result. This definition, drawn from the APM Body of Knowledge (7th ed.), highlights three critical characteristics distinguishing a project from routine operations. First, temporality: every project has a defined beginning and end. Second, uniqueness: no two projects are identical—they differ in context, team, risk, and constraints. Third, purposefulness: a project exists to produce a specific defined outcome.\n\nContrast this with operations—continuous, repetitive activities sustaining core functions such as payroll or customer support. While operations optimise for efficiency and consistency, projects are the mechanism through which organisations move from a current state to a desired future state. This distinction has profound implications for how projects are resourced, governed, and measured." },
          { heading: "The Project Lifecycle",
            body: "The project lifecycle provides a structured sequence of phases from inception to closure. The APM framework identifies four principal phases: Concept, Definition, Implementation, and Handover & Closeout. During Concept, viability and strategic alignment are assessed and a business case developed. Definition translates the approved concept into a detailed project management plan. Implementation is where planned work is executed and deliverables produced. Handover & Closeout ensures outputs transition to operational ownership, lessons are captured, and the project formally closes.\n\nUnderstanding the lifecycle is critical because each phase carries distinct management priorities and governance requirements. The probability of project success is most influenced by decisions made in early phases—where the cost of change is lowest. This principle is well-evidenced in project failure literature and underpins the 'front-loading' approach advocated in complex infrastructure and technology projects." },
          { heading: "Projects in Organisational Context",
            body: "Projects operate within a broader organisational, environmental, and strategic context. Internal factors include culture, governance frameworks, and available resources. External factors encompass regulatory requirements, market conditions, and stakeholder expectations—collectively termed the project environment.\n\nOrganisations typically manage multiple projects simultaneously, giving rise to programmes (groups of related projects managed together for coordinated benefit not achievable individually) and portfolios (collections managed and prioritised to meet strategic objectives). Understanding where a project sits within this hierarchy enables project managers to align objectives with organisational strategy and navigate governance landscapes effectively." },
        ],
        terms: [
          { t: "Project", d: "A unique, temporary endeavour undertaken to achieve defined objectives within agreed constraints." },
          { t: "Project Lifecycle", d: "The sequential phases a project passes through: Concept, Definition, Implementation, Handover." },
          { t: "Programme", d: "A group of related projects managed together for coordinated benefit beyond individual projects." },
          { t: "Portfolio", d: "A collection of projects/programmes selected and managed to meet strategic objectives." },
          { t: "Business Case", d: "Document justifying project investment by articulating expected benefits, costs, risks, and strategic fit." },
        ],
        quiz: [
          { q: "Which characteristic best distinguishes a project from operational work?", opts: ["It requires a budget", "It is temporary and produces a unique output", "It is managed by a project manager", "It involves a team of people"], ans: 1 },
          { q: "What are the four phases of the APM project lifecycle, in correct sequence?", opts: ["Plan, Build, Test, Launch", "Concept, Definition, Implementation, Handover & Closeout", "Initiation, Planning, Execution, Closure", "Brief, Design, Build, Review"], ans: 1 },
          { q: "The PRIMARY purpose of a Business Case is to:", opts: ["Assign roles to the project team", "Track daily project progress", "Justify the investment in a project", "Document lessons learned at project end"], ans: 2 },
          { q: "Which lifecycle phase produces the detailed Project Management Plan?", opts: ["Concept", "Definition", "Implementation", "Handover"], ans: 1 },
          { q: "Related projects managed together for coordinated benefits are called a:", opts: ["Portfolio", "Programme", "Strategic initiative", "Project board"], ans: 1 },
        ],
      },
      {
        id: "pfq-2", num: 2, title: "Governance, Stakeholders & Communication", dur: "50 min",
        intro: "Effective project governance provides the framework within which projects are directed, managed, and controlled. Combined with systematic stakeholder engagement and deliberate communication planning, governance structures are among the most significant determinants of project success or failure.",
        sections: [
          { heading: "Project Governance",
            body: "Project governance encompasses the framework of authority, accountability, and decision-making that ensures a project is directed effectively. Key questions include: Who makes decisions? Who is accountable for outcomes? How is performance monitored? The primary roles are the Project Sponsor—a senior executive championing the project, securing resources, and ultimately accountable for the business case—and the Project Manager, responsible for day-to-day management within agreed constraints.\n\nGovernance also operates at programme and portfolio levels, where steering committees and project boards provide oversight across multiple initiatives. The principle of governance by exception is widely applied: project managers manage within agreed tolerances and escalate only when thresholds are breached. This ensures senior stakeholders retain oversight over significant deviations without being overwhelmed by operational detail." },
          { heading: "Stakeholder Identification and Engagement",
            body: "A stakeholder is any individual, group, or organisation that may affect, be affected by, or perceive itself affected by a project. The spectrum is broad—from internal parties (sponsors, team members, affected departments) to external ones (clients, regulators, suppliers, the public). Effective management begins with systematic identification and analysis.\n\nStakeholder analysis typically maps stakeholders according to power and interest. The power/interest matrix enables prioritisation: high power/high interest stakeholders require close management, while low power/low interest stakeholders need only be monitored. Engagement aims not merely to manage opposition but to leverage expertise, build support, and align expectations. It must be iterative—stakeholder positions can shift significantly throughout the lifecycle as project circumstances evolve." },
          { heading: "Communication Management",
            body: "Communication is the vehicle through which governance is exercised and stakeholder relationships are maintained. A Communication Management Plan defines who needs what information, in what format, at what frequency, and through which channels. Without deliberate planning, critical information fails to reach decision-makers, rumours fill information vacuums, and stakeholder trust erodes.\n\nProject communication operates at multiple levels: formal reporting (status reports, highlight reports, exception reports) provides structured accountability, while informal communication maintains team cohesion. Medium matters—written communication creates an audit trail, while face-to-face is more effective for complex or sensitive messages. Project managers must navigate barriers including cultural differences, technical jargon, and organisational hierarchy." },
        ],
        terms: [
          { t: "Project Sponsor", d: "Senior executive accountable for the business case and ultimate project outcomes." },
          { t: "Stakeholder", d: "Any party that affects, is affected by, or perceives itself affected by the project." },
          { t: "Power/Interest Matrix", d: "Tool categorising stakeholders by their influence level and degree of interest in the project." },
          { t: "Communication Management Plan", d: "Document defining information needs, channels, frequency, and format for all stakeholders." },
          { t: "Governance by Exception", d: "Approach where PMs manage within agreed tolerances and escalate only upon threshold breach." },
        ],
        quiz: [
          { q: "Who is typically accountable for the Business Case and project outcomes at executive level?", opts: ["The Project Manager", "The Project Sponsor", "The Steering Committee Secretary", "The End User"], ans: 1 },
          { q: "In a power/interest matrix, stakeholders with HIGH power and HIGH interest should be:", opts: ["Monitored only", "Kept informed", "Kept satisfied", "Managed closely"], ans: 3 },
          { q: "What does a Communication Management Plan primarily define?", opts: ["The project budget and expenditure", "Who needs what information, when, and how", "The risk register and mitigation steps", "The project scope and deliverables"], ans: 1 },
          { q: "'Governance by exception' means:", opts: ["Managing all project details personally", "Escalating every decision to the board", "Managing within agreed tolerances and escalating only when thresholds are breached", "Ignoring minor issues and focusing on major ones"], ans: 2 },
          { q: "Which of the following is an external stakeholder?", opts: ["A member of the project team", "The project manager", "A government regulator overseeing the project", "The project sponsor"], ans: 2 },
        ],
      },
      {
        id: "pfq-3", num: 3, title: "Scope, Schedule & Risk", dur: "55 min",
        intro: "The triple constraint—scope, time, and cost—forms the fundamental framework within which all projects are managed. Risk management adds a fourth dimension, addressing uncertainty that threatens deviations from these constraints. Mastery of these disciplines is central to effective project management practice.",
        sections: [
          { heading: "Scope Management",
            body: "Scope defines what is—and crucially, what is not—included in a project. Clear scope definition enables realistic schedules, budgets, and resource plans. The Work Breakdown Structure (WBS) is the primary tool for decomposing scope into manageable, deliverable-oriented components: a hierarchical representation of the total work required, with each lower level representing a more detailed breakdown of the level above.\n\nScope creep—the informal, uncontrolled expansion of project scope—is among the most common causes of project overruns. A formal change control process is therefore inseparable from scope management. Any proposed change to agreed scope must be assessed for its impact on schedule, cost, quality, and risk before approval or rejection. The scope baseline, once established, can only be legitimately changed through formal change control, ensuring any expansion is a conscious, authorised decision." },
          { heading: "Schedule Planning and Control",
            body: "Schedule management translates defined scope into a time-based plan. Activities are identified, sequenced, estimated, and resourced to produce a project schedule. The Gantt chart is the most widely recognised scheduling tool—a bar chart representing activities against a timeline, showing start and end dates, duration, and dependencies.\n\nMore analytically sophisticated is the Critical Path Method (CPM), a network-based technique identifying the longest sequence of dependent activities—the critical path—which determines the project's earliest possible completion date. Activities on the critical path have zero float, meaning any delay will delay the whole project. Activities off the critical path have float, providing scheduling flexibility. Understanding the critical path enables prioritised monitoring and targeted resource allocation where they have the greatest impact." },
          { heading: "Risk Management",
            body: "Risk is an uncertain event or condition that, if it occurs, has a positive or negative effect on project objectives. Risk management involves systematic identification, assessment, and treatment of risks to maximise positive outcomes and minimise negative ones.\n\nThe process encompasses: Identification (using brainstorming, expert interviews, and assumption analysis); Assessment (evaluating each risk by probability and impact via a probability/impact matrix); Response Planning (for threats: avoid, transfer, mitigate, or accept; for opportunities: exploit, enhance, share, or accept); and Monitoring and Control (tracking risks, identifying new ones, and evaluating response effectiveness throughout the lifecycle). All risks are documented in a Risk Register, which becomes a live management tool updated regularly." },
        ],
        terms: [
          { t: "Work Breakdown Structure (WBS)", d: "Hierarchical decomposition of total project scope into deliverable-oriented work packages." },
          { t: "Scope Creep", d: "Uncontrolled expansion of project scope without corresponding adjustment to time, cost, or resources." },
          { t: "Critical Path", d: "The longest sequence of dependent activities; determines the minimum possible project duration." },
          { t: "Float (Slack)", d: "The amount of time an activity can be delayed without affecting the overall project end date." },
          { t: "Risk Register", d: "Document recording identified risks, their probability/impact assessment, and planned responses." },
        ],
        quiz: [
          { q: "What tool decomposes project scope into smaller, manageable deliverables?", opts: ["Gantt chart", "Risk register", "Work Breakdown Structure (WBS)", "Communication plan"], ans: 2 },
          { q: "'Scope creep' refers to:", opts: ["Gradual reduction in project scope", "Formal expansion of scope via change control", "Uncontrolled addition of work without adjusting time or budget", "A technique for measuring project performance"], ans: 2 },
          { q: "The Critical Path in a project schedule represents:", opts: ["The most expensive series of tasks", "The longest sequence of dependent activities determining project duration", "Tasks assigned to the most senior team members", "Activities that can be delayed without any impact"], ans: 1 },
          { q: "Which risk response strategy passes the financial impact of a risk to a third party (e.g. insurance)?", opts: ["Avoid", "Mitigate", "Accept", "Transfer"], ans: 3 },
          { q: "An activity with ZERO float means:", opts: ["The activity is not yet planned", "The activity can be delayed freely", "The activity is on the critical path and cannot be delayed without impacting the end date", "The activity is already complete"], ans: 2 },
        ],
      },
      {
        id: "pfq-4", num: 4, title: "Resources, Quality & Procurement", dur: "50 min",
        intro: "Successful project delivery depends on effective management of human and physical resources, assurance of quality across all outputs, and professional management of external procurement relationships. These disciplines are interconnected—resource constraints affect quality, quality standards influence procurement requirements, and all three are subject to change control.",
        sections: [
          { heading: "Resource Management",
            body: "Project resources encompass human capital, physical materials, equipment, facilities, and financial resources. Resource management involves planning what is needed, acquiring it, developing and managing it throughout the project, and releasing it upon completion. Planning begins with the WBS—each work package is assessed for resource type and quantity, enabling development of a resource plan aligned with the project schedule.\n\nA resource histogram visualises the quantity of a specific resource required over time, identifying periods of over-allocation and under-utilisation. Resource levelling adjusts activity dates to resolve over-allocation conflicts, though this may extend the overall schedule. Effective resource management also encompasses people management—team development, motivation, conflict resolution, and performance management—recognising that human resources are the most complex and valuable project asset." },
          { heading: "Quality Management",
            body: "Quality in project management refers to the degree to which inherent characteristics fulfil requirements. The APM distinguishes between: quality planning (defining standards and how they will be achieved); quality assurance (systematic activities providing confidence that requirements are met—process-oriented); and quality control (monitoring specific results to determine compliance with standards—output-oriented).\n\nThe concept of 'fit for purpose' is central: a deliverable is of acceptable quality if it meets its defined requirements and is suitable for its intended use, regardless of whether it could theoretically be produced to a higher standard. Gold-plating—adding features or specification beyond those required—is as much a quality failure as underperformance: it wastes resources and may introduce unwanted complexity or maintenance burden." },
          { heading: "Procurement & Change Control",
            body: "Procurement involves obtaining goods, services, or works from external providers. Effective procurement encompasses make-or-buy analysis, contract strategy, supplier selection, contract management, and closeout. Contract types range from fixed-price (supplier bears most cost risk) through cost-reimbursable (client bears more risk) to target-cost contracts sharing risk between parties.\n\nChange control is the formal mechanism through which proposed changes to any approved baseline—scope, schedule, budget, or quality—are reviewed, impact-assessed, and accepted or rejected. Every change, however minor it appears, should be processed through change control to maintain baseline integrity and decision-making accountability. The Change Control Board (or equivalent governance body) authorises changes within defined thresholds, with larger changes escalated to the project board." },
        ],
        terms: [
          { t: "Resource Levelling", d: "Adjusting activity dates to resolve resource over-allocations, potentially extending the schedule." },
          { t: "Quality Assurance", d: "Process-level activities providing confidence that quality requirements are being met." },
          { t: "Quality Control", d: "Monitoring of specific project results to determine compliance with quality standards." },
          { t: "Fixed-Price Contract", d: "Contract where the supplier agrees a set price and bears the financial risk of cost overruns." },
          { t: "Change Control", d: "Formal process for reviewing, assessing impact, and authorising or rejecting changes to baselines." },
        ],
        quiz: [
          { q: "A resource histogram shows:", opts: ["Stakeholder power and interest levels", "The quantity of a resource required over time", "The project schedule as a bar chart", "Quality defects found during testing"], ans: 1 },
          { q: "Which activity is an example of quality ASSURANCE (not quality control)?", opts: ["Inspecting a software build for defects after it is built", "Reviewing code against standards at sprint end", "Auditing the development process to ensure coding standards are being followed throughout", "Testing the final product before customer delivery"], ans: 2 },
          { q: "'Fit for purpose' in the context of project quality means:", opts: ["The deliverable is of the highest possible standard", "The deliverable meets its defined requirements and is suitable for its intended use", "The deliverable was produced faster than planned", "The deliverable has been formally approved by the sponsor"], ans: 1 },
          { q: "In a fixed-price contract, who bears most of the financial risk?", opts: ["The client organisation", "The supplier", "Both parties equally", "The project manager"], ans: 1 },
          { q: "The purpose of a Change Control Board is to:", opts: ["Plan the project schedule and assign resources", "Manage day-to-day team activities and task allocation", "Review and authorise changes to project baselines", "Recruit and onboard project team members"], ans: 2 },
        ],
      },
    ],
  },
  pmq: {
    id: "pmq", title: "Project Management Qualification", abbr: "PMQ",
    level: "Practitioner Level", color: T.pmq,
    desc: "An in-depth practitioner qualification providing comprehensive knowledge of project management principles, methods, and techniques. Builds substantially on PFQ. Formerly the APMP.",
    modules: [
      {
        id: "pmq-1", num: 1, title: "Advanced Governance & Business Case", dur: "60 min",
        intro: "At practitioner level, project governance is understood not merely as a set of roles and rules but as a dynamic system of accountability, assurance, and strategic alignment. The business case is the central governance document—living throughout the lifecycle—through which investment decisions are made and benefits realised.",
        sections: [
          { heading: "Governance Frameworks & Assurance",
            body: "The APM defines governance of project management as the portfolio-, programme-, and project-related activities of the sponsoring organisation. Governance frameworks—such as PRINCE2, ISO 21502, or the UK Government's GovS 002—provide structured approaches at scale. At programme and portfolio level, governance involves establishing a project management office (PMO), defining decision rights across the hierarchy, setting performance thresholds and escalation paths, and maintaining strategic alignment through portfolio review cycles.\n\nProject assurance—independent of project management—provides stakeholders with confidence that the project is on track. Assurance functions (internal audit, gateway reviews, peer reviews) examine whether the project is being managed competently, whether the business case remains viable, and whether risks are being appropriately managed. The UK Government's Five Case Model and APM's Conditions for Project Success both provide evidence-based frameworks for assurance, identifying the factors most strongly correlated with successful outcomes." },
          { heading: "Business Case Development",
            body: "The business case is the primary decision-making document for a project. At PMQ level, learners must understand not just its contents but the analytical rigour underpinning them. A robust business case includes: an options appraisal (considering at minimum a 'do nothing' baseline, a minimal solution, and a preferred option); a financial appraisal using discounted cash flow methods—Net Present Value (NPV), Internal Rate of Return (IRR), and Payback Period; a sensitivity analysis; and a non-financial benefits assessment.\n\nNPV is particularly important: it calculates the present value of future cash flows, discounted at the organisation's cost of capital. A positive NPV indicates financial value creation; a negative NPV suggests financial value destruction. However, projects may still be justified on strategic, regulatory, or social grounds even with a negative NPV—requiring explicit, evidence-based justification in the business case. This is a common scenario in public sector projects where social value is paramount." },
          { heading: "Benefits Realisation Management",
            body: "Benefits realisation management (BRM) ensures that the benefits articulated in the business case are actually delivered post-project. Benefits—measurable improvements resulting from project outputs being used—are often not realised until after project closure, requiring post-project ownership by the business rather than the project team.\n\nThe Benefits Realisation Plan maps each benefit to a measurable outcome, identifies a benefit owner, defines the measurement approach and baseline, and establishes realisation milestones. A critical distinction is between outputs (what the project produces), outcomes (changes in behaviour or capability from using outputs), and benefits (measurable improvements arising from outcomes). Ward and Daniel's Benefits Dependency Networks provide a visual framework mapping the causal chain from IT-enabled change through organisational change to ultimate benefits—a sophisticated tool for complex transformation programmes." },
        ],
        terms: [
          { t: "Project Management Office (PMO)", d: "Organisational body standardising project governance and facilitating resource sharing across projects." },
          { t: "Net Present Value (NPV)", d: "Present value of future cash flows discounted at the cost of capital; positive NPV = financial value creation." },
          { t: "Benefits Realisation Plan", d: "Document mapping benefits to owners, measurable outcomes, baselines, and realisation milestones." },
          { t: "Gateway Review", d: "Independent assurance review conducted at key decision points in the project lifecycle." },
          { t: "Benefits Dependency Network", d: "Ward & Daniel's framework mapping the causal chain from enabling change to benefit realisation." },
        ],
        quiz: [
          { q: "The PRIMARY purpose of project assurance is to:", opts: ["Manage day-to-day project activities on behalf of the PM", "Provide independent confidence that the project will deliver its objectives", "Produce the project schedule and resource plan", "Manage supplier relationships and procurement"], ans: 1 },
          { q: "A positive Net Present Value (NPV) indicates:", opts: ["The project will definitely be delivered on time", "The project has no financial risk whatsoever", "The project is expected to create financial value", "The project budget is sufficient to cover all costs"], ans: 2 },
          { q: "Who is typically responsible for realising project benefits AFTER the project closes?", opts: ["The project manager", "The business or operational owner", "The project team members", "The procurement manager"], ans: 1 },
          { q: "A Benefits Realisation Plan primarily defines:", opts: ["The project schedule and key milestones", "The procurement strategy and contract types", "How benefits will be measured, who owns them, and when they will be realised", "The communication and stakeholder reporting strategy"], ans: 2 },
          { q: "A key function of a Project Management Office (PMO) is to:", opts: ["Directly deliver individual project outputs", "Standardise governance and facilitate resource sharing across projects", "Write the business case for each individual project", "Conduct stakeholder interviews on behalf of project managers"], ans: 1 },
        ],
      },
      {
        id: "pmq-2", num: 2, title: "Advanced Planning, Performance & Control", dur: "65 min",
        intro: "Practitioner-level schedule management moves beyond Gantt charts to sophisticated analytical techniques providing deeper insight into project performance and trajectory. Earned Value Management in particular provides an integrated measurement framework combining scope, schedule, and cost into a single coherent performance picture.",
        sections: [
          { heading: "Critical Path Analysis & Probabilistic Scheduling",
            body: "Network diagrams (Activity-on-Node / Precedence Diagrams) represent the logical sequence of project activities and their dependencies. Beyond identifying the critical path, network analysis enables calculation of float for non-critical activities and supports scenario modelling—'what-if' analysis assessing the schedule impact of potential delays or accelerations.\n\nMonte Carlo simulation extends deterministic critical path analysis by introducing probabilistic duration estimates. Rather than assuming single-point durations, Monte Carlo models each activity duration as a probability distribution (using optimistic, most likely, and pessimistic estimates via a triangular or PERT distribution) and runs thousands of simulated project completions. The output is a probability distribution for the project end date—providing decision-support information far richer than a deterministic schedule, such as the probability of completing by the contracted date or the date at which 80% confidence of completion exists." },
          { heading: "Earned Value Management",
            body: "Earned Value Management (EVM) is an integrated performance measurement methodology relating planned work, work accomplished, and the cost of that work in a single coherent framework. The three core metrics are: Planned Value (PV)—the budgeted cost of work scheduled to date; Earned Value (EV)—the budgeted cost of work actually performed; and Actual Cost (AC)—the actual cost incurred for work performed.\n\nFrom these, two performance indices are derived: the Schedule Performance Index (SPI = EV/PV; >1 indicates ahead of schedule) and the Cost Performance Index (CPI = EV/AC; >1 indicates under budget). EVM also enables forecasting: the Estimate at Completion (EAC = BAC/CPI, where BAC is Budget at Completion) projects total final cost assuming current cost efficiency continues. EVM is mandated on major UK and US government contracts and provides early warning of performance problems before they become unrecoverable." },
          { heading: "Programme, Portfolio & Strategic Context",
            body: "A programme is managed as an integrated entity to deliver benefits beyond those achievable by its constituent projects in isolation. Programme management involves managing interdependencies between projects, realising emergent benefits from their interaction, and navigating the organisational change required to embed new capabilities. The programme manager operates at the strategic-delivery interface.\n\nPortfolio management involves selecting, prioritising, and balancing investments across programmes and projects to optimise strategic value within resource constraints. Portfolio governance requires a dynamic view of the investment landscape—adding new initiatives as opportunities emerge, accelerating or deferring based on strategic priority shifts, and terminating investments no longer justified. The concept of strategic alignment ensures every portfolio investment traces directly to organisational strategy, preventing the accumulation of 'zombie projects'—initiatives persisting without current strategic justification." },
        ],
        terms: [
          { t: "Earned Value (EV)", d: "The budgeted cost of work actually performed—measures value delivered to date." },
          { t: "Cost Performance Index (CPI)", d: "EV ÷ AC; >1 = under budget, <1 = over budget." },
          { t: "Schedule Performance Index (SPI)", d: "EV ÷ PV; >1 = ahead of schedule, <1 = behind schedule." },
          { t: "Monte Carlo Simulation", d: "Probabilistic technique running thousands of scenarios to model schedule and cost risk distributions." },
          { t: "Estimate at Completion (EAC)", d: "Projected total final cost based on current performance: Budget at Completion ÷ CPI." },
        ],
        quiz: [
          { q: "A project has an EV of £80,000 and an AC of £100,000. The Cost Performance Index (CPI) is:", opts: ["0.8 — the project is over budget", "1.25 — the project is under budget", "1.0 — the project is exactly on budget", "0.6 — the project is severely over budget"], ans: 0 },
          { q: "What does Monte Carlo simulation add to standard Critical Path Analysis?", opts: ["A visual bar chart of all project activities", "Probabilistic scenario modelling generating a distribution of possible outcomes", "A colour-coded risk register for the project", "Automated stakeholder progress reporting"], ans: 1 },
          { q: "The key distinction between a programme and a portfolio is:", opts: ["A programme always has more projects than a portfolio", "A programme groups related projects for coordinated benefit; a portfolio prioritises investments strategically", "A portfolio is managed by a PM; a programme is managed by a sponsor", "There is no meaningful operational distinction between the two"], ans: 1 },
          { q: "A Schedule Performance Index (SPI) of 0.85 indicates:", opts: ["The project is 15% over budget", "The project is delivering 85% of planned value — it is behind schedule", "The project is 15% ahead of schedule", "85% of the project scope has been completed"], ans: 1 },
          { q: "The formula EAC = BAC / CPI assumes:", opts: ["The project will recover to its original planned performance", "Current cost efficiency continues for the remainder of the project", "All remaining work will be completed exactly at budget", "The project schedule has not experienced any slippage"], ans: 1 },
        ],
      },
      {
        id: "pmq-3", num: 3, title: "Advanced Risk, Quality & Procurement", dur: "60 min",
        intro: "At practitioner level, risk management moves from qualitative assessment to quantitative analysis. Quality management is understood within Total Quality Management and continuous improvement frameworks. Procurement strategy becomes a sophisticated discipline involving contract structuring, supplier relationship management, and commercial risk allocation.",
        sections: [
          { heading: "Quantitative Risk Analysis",
            body: "While qualitative risk analysis (probability/impact matrices) suffices for many projects, complex or high-value projects benefit from quantitative techniques assigning numerical values to risk exposure. Expected Monetary Value (EMV) calculates the statistical average outcome of a risk scenario: EMV = Probability × Impact (£). Decision tree analysis uses EMV to compare alternative courses of action under uncertainty, selecting the option with the highest expected value.\n\nQuantitative schedule risk analysis—typically using Monte Carlo simulation—aggregates the probabilistic impact of all identified risks to produce a probability distribution for the project completion date. Similarly, quantitative cost risk analysis produces a distribution for total project cost, enabling contingency reserves to be set at statistically justified levels (e.g., the 80th percentile of the cost distribution) rather than arbitrary percentage uplifts. This approach treats contingency as a mathematically derived output of risk analysis, not a management judgement." },
          { heading: "Total Quality Management & Continuous Improvement",
            body: "Total Quality Management (TQM) is a management philosophy—originating in the work of Deming, Juran, and Crosby—emphasising organisation-wide commitment to quality, customer focus, and continuous improvement. In a project context, TQM principles translate to: customer requirements drive quality standards; quality is built in, not inspected in; every team member is responsible for quality; and process improvement is continuous.\n\nThe Plan-Do-Check-Act (PDCA) cycle provides Deming's framework for continuous improvement: Plan (define the improvement and expected outcome), Do (implement on a small scale), Check (measure results against expectations), Act (standardise if successful, or iterate). ISO 9001 provides the internationally recognised quality management system framework, requiring documented processes, internal audits, management reviews, and a demonstrable commitment to continual improvement—increasingly expected of project suppliers in major procurement programmes." },
          { heading: "Procurement Strategy & Contract Management",
            body: "Procurement strategy decisions are among the most consequential on a project, determining the commercial framework for delivery. Key strategic decisions include: sourcing model (single-source, competitive tender, framework agreements); contract structure (the degree to which cost risk is allocated to the supplier versus retained by the client); and relationship model (transactional versus collaborative partnership).\n\nRelational contracting—including alliance contracting and collaborative frameworks—represents a significant evolution beyond transactional procurement. By aligning incentives through pain/gain share mechanisms and shared project objectives, relational contracts aim to reduce adversarial behaviour, encourage early problem-solving, and improve outcomes on complex or uncertain projects. Contract management post-award involves performance monitoring against defined KPIs, change management within the contract, supplier relationship management, and—ultimately—contract closure and formal evaluation of supplier performance." },
        ],
        terms: [
          { t: "Expected Monetary Value (EMV)", d: "Probability × Impact (£); the statistical average financial outcome of a risk scenario." },
          { t: "PDCA Cycle", d: "Plan-Do-Check-Act; Deming's iterative framework for continuous quality improvement." },
          { t: "ISO 9001", d: "International standard for quality management systems, requiring documented processes and continual improvement." },
          { t: "Pain/Gain Share", d: "Contract mechanism sharing cost overruns and savings proportionally between client and supplier." },
          { t: "Quantitative Risk Analysis", d: "Numerical techniques (EMV, Monte Carlo) assigning financial values to aggregate risk exposure." },
        ],
        quiz: [
          { q: "A risk has a 30% probability of occurring with an impact of £50,000. The Expected Monetary Value (EMV) is:", opts: ["£50,000", "£15,000", "£35,000", "£30,000"], ans: 1 },
          { q: "The 'Check' step in the PDCA cycle involves:", opts: ["Planning the quality improvement initiative", "Implementing the change on a small scale first", "Measuring results against what was expected", "Standardising the successful improvement across the organisation"], ans: 2 },
          { q: "The primary advantage of a pain/gain share contract mechanism is:", opts: ["It eliminates all financial risk from the project", "It transfers all financial risk entirely to the supplier", "It aligns client and supplier incentives to improve collaborative outcomes", "It significantly reduces procurement administration overhead"], ans: 2 },
          { q: "ISO 9001 is an international standard for:", opts: ["Project schedule management", "Quality management systems", "Environmental management systems", "Information security management"], ans: 1 },
          { q: "Which technique evaluates the best decision path when comparing options under financial uncertainty?", opts: ["SWOT analysis", "Monte Carlo simulation", "Decision tree analysis", "Force field analysis"], ans: 2 },
        ],
      },
      {
        id: "pmq-4", num: 4, title: "Leadership, Change & Stakeholder Strategy", dur: "60 min",
        intro: "The human dimensions of project management—leadership, team development, organisational change, and strategic stakeholder engagement—are increasingly recognised as the primary differentiators between project success and failure. Technical competence is necessary but not sufficient; practitioner mastery requires sophisticated interpersonal and organisational skills.",
        sections: [
          { heading: "Leadership Theory & Practice",
            body: "Leadership involves influencing and motivating a team and wider stakeholders to achieve project objectives. Multiple theories have direct project application. Situational Leadership (Hersey and Blanchard) proposes that effective leaders adapt their style to individual development level: directive approaches suit novices, while delegating styles suit highly competent, motivated individuals. Transformational leadership—inspiring a shared vision, intellectually challenging the team, and fostering individual development—is associated with high-performing project teams and complex change initiatives.\n\nMotivation theories also inform effective project leadership. Herzberg's Two-Factor Theory distinguishes hygiene factors (which, if absent, cause dissatisfaction: adequate pay, safe conditions) from motivators (which actively drive performance: recognition, achievement, responsibility, growth). Tuckman's model—Forming, Storming, Norming, Performing, Adjourning—describes the stages teams pass through and the leadership behaviours most effective at each, enabling project managers to adapt their approach as the team matures through the lifecycle." },
          { heading: "Organisational Change Management",
            body: "Projects are the primary vehicle through which organisations implement change. Change management is the structured approach to transitioning individuals, teams, and organisations from a current state to a desired future state. Kotter's 8-Step Model provides a widely applied framework: establishing urgency, building a guiding coalition, creating a vision, communicating the vision, empowering action, generating short-term wins, consolidating gains, and anchoring change in culture.\n\nLewin's Force Field Analysis is a diagnostic tool for change dynamics: driving forces (pressures for change) and restraining forces (resistance) are identified, quantified, and mapped. Effective strategy involves either strengthening driving forces or, more powerfully, reducing restraining forces—as resistance consumes energy that could be directed at delivery. Resistance to change is a normal human response typically reflecting concern about competence, job security, or scepticism about benefits. Addressing root causes through communication, involvement, and support is consistently more effective than attempting to override resistance through authority." },
          { heading: "Advanced Stakeholder Engagement Strategy",
            body: "Practitioner-level stakeholder management moves beyond identification and mapping to sophisticated engagement strategy. The Stakeholder Engagement Assessment Matrix tracks not only current engagement levels but desired future levels, enabling systematic planning of interventions. Engagement levels are characterised as Unaware, Resistant, Neutral, Supportive, and Leading—with strategy focused on moving key stakeholders towards Supportive or Leading.\n\nInfluence and political intelligence are core practitioner competencies. Understanding informal power structures, managing conflicts of interest, negotiating competing stakeholder agendas, and building coalitions of support are sophisticated skills developing through experience and structured reflection. Communication must also be culturally intelligent—recognising that styles, power distance, and decision-making norms vary significantly across cultures. Hofstede's cultural dimensions framework is particularly relevant for internationalised projects and programmes requiring explicit attention to cross-cultural communication dynamics." },
        ],
        terms: [
          { t: "Situational Leadership", d: "Hersey & Blanchard's model: effective leaders adapt style to individual development level." },
          { t: "Tuckman's Model", d: "Forming → Storming → Norming → Performing → Adjourning: stages of team development." },
          { t: "Kotter's 8-Step Model", d: "Framework for leading large-scale organisational change from urgency-setting to cultural embedding." },
          { t: "Force Field Analysis", d: "Lewin's diagnostic tool mapping driving and restraining forces in a change situation." },
          { t: "Stakeholder Engagement Matrix", d: "Tool tracking current vs desired stakeholder engagement levels to plan targeted interventions." },
        ],
        quiz: [
          { q: "According to Hersey & Blanchard's Situational Leadership, the BEST style for a highly competent and self-motivated team member is:", opts: ["Directing — telling them exactly what to do and how", "Coaching — providing detailed guidance and close support", "Supporting — encouraging and active listening", "Delegating — giving them full autonomy and responsibility"], ans: 3 },
          { q: "In Tuckman's team development model, during which stage do team members challenge each other as norms are not yet established?", opts: ["Forming", "Storming", "Norming", "Performing"], ans: 1 },
          { q: "According to Lewin's Force Field Analysis, which is generally the MORE effective change strategy?", opts: ["Strengthening the driving forces for change", "Reducing the restraining forces against change", "Ignoring resistance and pushing ahead regardless", "Delaying the change until full consensus is reached"], ans: 1 },
          { q: "In Herzberg's Two-Factor Theory, which of the following is a MOTIVATOR (not a hygiene factor)?", opts: ["Adequate salary", "Safe working conditions", "Clear company policy and processes", "Recognition and achievement"], ans: 3 },
          { q: "The Stakeholder Engagement Assessment Matrix is used to:", opts: ["Map stakeholder power against their interest level", "Track current and desired stakeholder engagement levels to plan interventions", "Plan the project's communication channels and reporting frequency", "Assess and score supplier performance against defined KPIs"], ans: 1 },
        ],
      },
    ],
  },
};

// ── helpers ─────────────────────────────────────────────────────────────────
const ss = (obj) => obj;
const pct = (score, total) => Math.round((score / total) * 100);
const grade = (s, t) => {
  const p = pct(s, t);
  if (p >= 100) return { label: "Distinction", color: "#3DAB78" };
  if (p >= 80) return { label: "Merit", color: "#4A9FE2" };
  if (p >= 55) return { label: "Pass", color: "#D4A843" };
  return { label: "Refer", color: "#D9534F" };
};

function ProgressBar({ value, color, height = 6 }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Header({ title, subtitle, onBack, onLogout, color }) {
  return (
    <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 28px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 14px", color: T.muted, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              ← Back
            </button>
          )}
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: T.text, fontWeight: 400 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{subtitle}</div>}
          </div>
        </div>
        {onLogout && (
          <button onClick={onLogout} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 14px", color: T.muted, fontSize: 13, cursor: "pointer" }}>
            Sign Out
          </button>
        )}
        {color && !onLogout && (
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
        )}
      </div>
    </div>
  );
}

// ── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ u: "", p: "" });
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handle = () => {
    if (form.u === CREDS.username && form.p === CREDS.password) {
      setErr(""); onLogin();
    } else {
      setErr("Incorrect credentials. Please try again.");
    }
  };

  const inp = { width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 15, fontFamily: "system-ui, sans-serif", outline: "none" };
  const lbl = { display: "block", fontSize: 11, color: T.muted, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 8, fontFamily: "system-ui, sans-serif" };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", fontFamily: "system-ui, sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 60px", display: window.innerWidth < 700 ? "none" : "flex" }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.pfq} 0%, ${T.pmq} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700 }}>A</span>
            </div>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: T.text }}>APM Academy</div>
              <div style={{ fontSize: 12, color: T.muted }}>Professional Development Portal</div>
            </div>
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: T.text, fontWeight: 400, lineHeight: 1.3, marginBottom: 20 }}>Your pathway to APM certification.</h2>
          <p style={{ color: T.muted, lineHeight: 1.7, fontSize: 15, marginBottom: 40 }}>Study degree-level project management content and test your knowledge with accessible, structured assessments — from PFQ all the way through to PMQ.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ label: "PFQ", desc: "Project Fundamentals Qualification", color: T.pfq }, { label: "PMQ", desc: "Project Management Qualification", color: T.pmq }].map(q => (
              <div key={q.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: q.color + "22", display: "flex", alignItems: "center", justifyContent: "center", color: q.color, fontSize: 12, fontWeight: 700 }}>{q.label}</div>
                <div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{q.label}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{q.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right panel */}
      <div style={{ width: "100%", maxWidth: 460, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, margin: "0 auto" }}>
        <div style={{ width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${T.pfq} 0%, ${T.pmq} 100%)`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700 }}>A</span>
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, color: T.text, fontWeight: 400, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ fontSize: 13, color: T.muted }}>Sign in to your learning portal</p>
          </div>

          <div style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, padding: 32 }}>
            <div style={{ marginBottom: 18 }}>
              <label style={lbl}>Username</label>
              <input value={form.u} onChange={e => setForm(f => ({ ...f, u: e.target.value }))} onKeyDown={e => e.key === "Enter" && handle()} style={inp} placeholder="Enter your username" autoComplete="username" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={lbl}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} value={form.p} onChange={e => setForm(f => ({ ...f, p: e.target.value }))} onKeyDown={e => e.key === "Enter" && handle()} style={{ ...inp, paddingRight: 44 }} placeholder="Enter your password" autoComplete="current-password" />
                <button onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 12, padding: 4 }}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {err && <div style={{ color: T.danger, fontSize: 13, marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: T.danger + "18", border: `1px solid ${T.danger}33` }}>{err}</div>}
            <button onClick={handle} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: T.pfq, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui, sans-serif", transition: "opacity 0.15s" }}>
              Sign In
            </button>
          </div>
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: T.muted }}>Test environment · Credentials provided by IT Director</p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ progress, onSelect, onLogout }) {
  const cards = [QUAL.pfq, QUAL.pmq];

  const modsDone = (qid) => Object.keys(progress[qid]).length;
  const modsTotal = (qid) => QUAL[qid].modules.length;
  const pctDone = (qid) => Math.round((modsDone(qid) / modsTotal(qid)) * 100);

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title="APM Academy" subtitle="Your learning dashboard" onLogout={onLogout} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 28px" }}>
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, color: T.text, fontWeight: 400, marginBottom: 8 }}>Your Learning Pathway</h2>
          <p style={{ color: T.muted, fontSize: 14 }}>Complete PFQ to build foundational knowledge, then progress to the advanced PMQ qualification.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20, marginBottom: 40 }}>
          {cards.map((q, i) => {
            const done = modsDone(q.id);
            const total = modsTotal(q.id);
            const p = pctDone(q.id);
            return (
              <div key={q.id} onClick={() => onSelect(q)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 28, cursor: "pointer", transition: "border-color 0.2s, transform 0.15s", borderLeft: `3px solid ${q.color}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "inline-block", background: q.color + "22", color: q.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, marginBottom: 10, letterSpacing: "0.5px" }}>{q.abbr} · {q.level}</div>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: T.text, fontWeight: 400, lineHeight: 1.3 }}>{q.title}</h3>
                  </div>
                  {i === 1 && <div style={{ background: T.pmq + "22", color: T.pmq, fontSize: 11, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>Advanced</div>}
                </div>
                <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{q.desc}</p>
                <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted }}>
                  <span>{done}/{total} modules{done > 0 ? " completed" : " started"}</span>
                  <span style={{ color: q.color }}>{p}%</span>
                </div>
                <ProgressBar value={p} color={q.color} />
                <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: T.muted }}>{total} modules · {q.modules.reduce((s, m) => s + parseInt(m.dur), 0)} min total</div>
                  <span style={{ color: q.color, fontSize: 13, fontWeight: 500 }}>Open →</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 4 }}>Overall progress</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: T.text }}>
                {modsDone("pfq") + modsDone("pmq")} of {modsTotal("pfq") + modsTotal("pmq")} modules complete
              </div>
            </div>
            <div style={{ fontSize: 28, fontFamily: "Georgia, serif", color: T.pfq }}>
              {Math.round(((modsDone("pfq") + modsDone("pmq")) / (modsTotal("pfq") + modsTotal("pmq"))) * 100)}%
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <ProgressBar value={Math.round(((modsDone("pfq") + modsDone("pmq")) / (modsTotal("pfq") + modsTotal("pmq"))) * 100)} color={T.pfq} height={8} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Qual overview ─────────────────────────────────────────────────────────────
function QualView({ qual, progress, onModule, onBack }) {
  const qprog = progress[qual.id];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title={qual.title} subtitle={qual.level} onBack={onBack} color={qual.color} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 28px" }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 32, borderLeft: `3px solid ${qual.color}` }}>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7 }}>{qual.desc}</p>
        </div>

        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: T.text, fontWeight: 400, marginBottom: 20 }}>Modules</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {qual.modules.map((mod) => {
            const sc = qprog[mod.id];
            const done = sc !== undefined;
            const g = done ? grade(sc, mod.quiz.length) : null;

            return (
              <div key={mod.id} onClick={() => onModule(mod)} style={{ background: T.card, border: `1px solid ${done ? qual.color + "44" : T.border}`, borderRadius: 12, padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 20, transition: "border-color 0.2s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = qual.color; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = done ? qual.color + "44" : T.border; e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: done ? qual.color + "22" : T.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${done ? qual.color + "44" : T.border}` }}>
                  {done ? <span style={{ color: qual.color, fontSize: 18 }}>✓</span> : <span style={{ color: T.muted, fontFamily: "Georgia, serif", fontSize: 16 }}>{mod.num}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 16, color: T.text }}>{mod.title}</span>
                    {done && g && (
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: g.color + "22", color: g.color, fontWeight: 600 }}>{g.label} · {sc}/{mod.quiz.length}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{mod.dur} · {mod.quiz.length} quiz questions · {mod.sections.length} study sections</div>
                </div>
                <span style={{ color: qual.color, fontSize: 18, flexShrink: 0 }}>›</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Study ─────────────────────────────────────────────────────────────────────
function StudyView({ mod, qual, onQuiz, onBack }) {
  const [open, setOpen] = useState(new Set([0]));
  const toggle = (i) => setOpen(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title={mod.title} subtitle={`${qual.abbr} · Module ${mod.num} · ${mod.dur} study`} onBack={onBack} color={qual.color} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 28px" }}>

        {/* Intro */}
        <div style={{ background: qual.color + "11", border: `1px solid ${qual.color}33`, borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
          <p style={{ color: T.text, fontSize: 15, lineHeight: 1.75, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{mod.intro}</p>
        </div>

        {/* Sections */}
        <div style={{ marginBottom: 36 }}>
          {mod.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 16, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => toggle(i)} style={{ width: "100%", padding: "18px 24px", background: "none", border: "none", color: T.text, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 400 }}>{sec.heading}</span>
                <span style={{ color: qual.color, fontSize: 18, transform: open.has(i) ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
              </button>
              {open.has(i) && (
                <div style={{ padding: "0 24px 22px", borderTop: `1px solid ${T.border}` }}>
                  <div style={{ paddingTop: 18 }}>
                    {sec.body.split("\n\n").map((para, pi) => (
                      <p key={pi} style={{ color: T.text, fontSize: 15, lineHeight: 1.8, marginBottom: pi < sec.body.split("\n\n").length - 1 ? 16 : 0, fontFamily: "Georgia, serif" }}>{para}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Terms */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: T.text, fontWeight: 400, marginBottom: 16 }}>Key Terms</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {mod.terms.map((term, i) => (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: qual.color, marginBottom: 6 }}>{term.t}</div>
                <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{term.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: T.card, border: `1px solid ${qual.color}44`, borderRadius: 14, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17, color: T.text, marginBottom: 4 }}>Ready to test your knowledge?</div>
            <div style={{ fontSize: 13, color: T.muted }}>{mod.quiz.length} multiple choice questions · GCSE-level assessment</div>
          </div>
          <button onClick={onQuiz} style={{ padding: "12px 28px", borderRadius: 9, border: "none", background: qual.color, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 20, fontFamily: "system-ui, sans-serif" }}>
            Take Quiz →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function QuizView({ mod, qual, onComplete, onBack }) {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const total = mod.quiz.length;
  const q = mod.quiz[cur];
  const allAnswered = Object.keys(answers).length === total;

  const select = (ai) => setAnswers(prev => ({ ...prev, [cur]: ai }));
  const submit = () => onComplete(mod.quiz.filter((q, i) => answers[i] === q.ans).length);

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title={`${mod.title} — Quiz`} subtitle={`Question ${cur + 1} of ${total}`} onBack={onBack} color={qual.color} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px" }}>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginBottom: 8 }}>
            <span>{Object.keys(answers).length}/{total} answered</span>
            <span style={{ color: qual.color }}>{Math.round((Object.keys(answers).length / total) * 100)}%</span>
          </div>
          <ProgressBar value={Math.round((Object.keys(answers).length / total) * 100)} color={qual.color} height={5} />
        </div>

        {/* Question dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {mod.quiz.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${i === cur ? qual.color : answers[i] !== undefined ? qual.color + "55" : T.border}`, background: i === cur ? qual.color : answers[i] !== undefined ? qual.color + "22" : T.surface, color: i === cur ? "#fff" : answers[i] !== undefined ? qual.color : T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "28px 30px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: qual.color, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 14, fontFamily: "system-ui, sans-serif" }}>Question {cur + 1}</div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 18, color: T.text, lineHeight: 1.5, marginBottom: 28, fontWeight: 400 }}>{q.q}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, ai) => {
              const selected = answers[cur] === ai;
              return (
                <button key={ai} onClick={() => select(ai)} style={{ padding: "14px 18px", borderRadius: 10, border: `1px solid ${selected ? qual.color : T.border}`, background: selected ? qual.color + "18" : T.surface, color: selected ? qual.color : T.text, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s", fontFamily: "system-ui, sans-serif", fontSize: 14, lineHeight: 1.4 }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = qual.color + "55"; }}
                  onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = T.border; }}>
                  <span style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${selected ? qual.color : T.border}`, background: selected ? qual.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: selected ? "#fff" : T.muted, flexShrink: 0 }}>
                    {["A","B","C","D"][ai]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <button onClick={() => setCur(c => Math.max(0, c - 1))} disabled={cur === 0} style={{ padding: "11px 22px", borderRadius: 8, border: `1px solid ${T.border}`, background: "none", color: cur === 0 ? T.muted + "55" : T.muted, cursor: cur === 0 ? "default" : "pointer", fontSize: 14, fontFamily: "system-ui, sans-serif" }}>
            ← Previous
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            {cur < total - 1 && (
              <button onClick={() => setCur(c => c + 1)} style={{ padding: "11px 22px", borderRadius: 8, border: `1px solid ${qual.color}44`, background: "none", color: qual.color, cursor: "pointer", fontSize: 14, fontFamily: "system-ui, sans-serif" }}>
                Next →
              </button>
            )}
            {allAnswered && (
              <button onClick={submit} style={{ padding: "11px 28px", borderRadius: 8, border: "none", background: qual.color, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>
                Submit Quiz ✓
              </button>
            )}
          </div>
        </div>
        {!allAnswered && <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 16 }}>Answer all {total} questions to submit</p>}
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────────
function ResultView({ mod, qual, score, onBack, onRetry }) {
  const total = mod.quiz.length;
  const p = pct(score, total);
  const g = grade(score, total);
  const passed = score >= Math.ceil(total * 0.55);

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>
      <Header title="Quiz Results" subtitle={mod.title} onBack={onBack} color={qual.color} />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 28px" }}>

        {/* Score circle */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 140, height: 140, borderRadius: "50%", border: `4px solid ${g.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", background: g.color + "11" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 40, color: g.color, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 13, color: T.muted }}>out of {total}</div>
          </div>
          <div style={{ fontSize: 22, fontFamily: "Georgia, serif", color: g.color, marginBottom: 8 }}>{g.label}</div>
          <div style={{ fontSize: 14, color: T.muted }}>{p}% · {passed ? "Above pass mark (55%)" : "Below pass mark (55%)"}</div>
        </div>

        {/* Feedback card */}
        <div style={{ background: T.card, border: `1px solid ${g.color}44`, borderRadius: 14, padding: "22px 26px", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, color: T.text, fontWeight: 400, marginBottom: 12 }}>
            {passed ? "Well done!" : "Keep studying"}
          </h3>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7 }}>
            {score === total
              ? "Perfect score! You have demonstrated excellent understanding of this topic. Move on to the next module when you're ready."
              : score >= Math.ceil(total * 0.8)
              ? "A strong result — you clearly understand the material well. Review any areas of uncertainty before progressing."
              : passed
              ? "You've met the pass standard. Consider reviewing the study material for any questions you weren't confident about before moving on."
              : "You haven't quite reached the 55% pass mark yet. Take time to re-read the study sections, focusing on the key terms, then attempt the quiz again."}
          </p>
        </div>

        {/* Score breakdown */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 22px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: T.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 }}>Score Breakdown</div>
          <ProgressBar value={p} color={g.color} height={10} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13 }}>
            <span style={{ color: T.muted }}>0%</span>
            <span style={{ color: T.muted }}>Pass: 55%</span>
            <span style={{ color: T.muted }}>100%</span>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[{ label: "Correct", val: score, color: T.success }, { label: "Incorrect", val: total - score, color: T.danger }, { label: "Pass mark", val: `${Math.ceil(total * 0.55)}/${total}`, color: T.muted }].map(stat => (
              <div key={stat.label} style={{ flex: 1, minWidth: 90, background: T.surface, borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "Georgia, serif" }}>{stat.val}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onBack} style={{ flex: 1, padding: "12px", borderRadius: 9, border: `1px solid ${T.border}`, background: "none", color: T.text, cursor: "pointer", fontSize: 14, fontFamily: "system-ui, sans-serif" }}>
            ← Back to Modules
          </button>
          <button onClick={onRetry} style={{ flex: 1, padding: "12px", borderRadius: 9, border: `1px solid ${qual.color}55`, background: qual.color + "11", color: qual.color, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>
            Retry Quiz ↺
          </button>
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("login");
  const [qual, setQual] = useState(null);
  const [mod, setMod] = useState(null);
  const [progress, setProgress] = useState({ pfq: {}, pmq: {} });
  const [lastScore, setLastScore] = useState(0);

  const handleQuizComplete = (score) => {
    setLastScore(score);
    setProgress(p => ({ ...p, [qual.id]: { ...p[qual.id], [mod.id]: score } }));
    setView("result");
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } button { transition: opacity 0.15s, transform 0.1s; } button:active { transform: scale(0.97); } input { outline: none; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0B1628; } ::-webkit-scrollbar-thumb { background: #2A4A7F; border-radius: 3px; }`}</style>
      {view === "login" && <LoginScreen onLogin={() => setView("dashboard")} />}
      {view === "dashboard" && <Dashboard progress={progress} onSelect={(q) => { setQual(q); setView("qual"); }} onLogout={() => { setView("login"); }} />}
      {view === "qual" && qual && <QualView qual={qual} progress={progress} onModule={(m) => { setMod(m); setView("study"); }} onBack={() => setView("dashboard")} />}
      {view === "study" && mod && <StudyView mod={mod} qual={qual} onQuiz={() => setView("quiz")} onBack={() => setView("qual")} />}
      {view === "quiz" && mod && <QuizView mod={mod} qual={qual} onComplete={handleQuizComplete} onBack={() => setView("study")} />}
      {view === "result" && mod && <ResultView mod={mod} qual={qual} score={lastScore} onBack={() => setView("qual")} onRetry={() => setView("quiz")} />}
    </div>
  );
}
