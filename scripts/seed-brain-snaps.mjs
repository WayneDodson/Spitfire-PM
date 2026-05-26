/**
 * Seed script: Brain Snap question bank
 * Run: node scripts/seed-brain-snaps.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const questions = [
  {
    question: "How many pages is the official Scrum Guide?",
    options: JSON.stringify([
      { id: "A", text: "13 pages" },
      { id: "B", text: "57 pages" },
      { id: "C", text: "126 pages" },
      { id: "D", text: "250 pages" },
    ]),
    correctOptionId: "A",
    explanation:
      "The Scrum Guide is intentionally short because Scrum is a lightweight framework. The challenge is not reading hundreds of pages — it is understanding the framework and applying it properly in real projects.",
    topicTag: "scrum",
  },
  {
    question: "In a Waterfall project, what is the single biggest risk of fixing requirements at the start?",
    options: JSON.stringify([
      { id: "A", text: "It makes the project too cheap" },
      { id: "B", text: "Stakeholders may change their minds mid-project, making the original requirements obsolete" },
      { id: "C", text: "It removes the need for a project manager" },
      { id: "D", text: "It speeds up delivery too much" },
    ]),
    correctOptionId: "B",
    explanation:
      "Waterfall's biggest vulnerability is that requirements are locked early. In reality, stakeholders often discover what they truly need only after seeing something built. This is exactly why Agile emerged — to embrace change rather than resist it.",
    topicTag: "waterfall",
  },
  {
    question: "A stakeholder keeps asking for 'just one small change' that wasn't in the original scope. What PM concept describes this?",
    options: JSON.stringify([
      { id: "A", text: "Risk escalation" },
      { id: "B", text: "Scope creep" },
      { id: "C", text: "Change control" },
      { id: "D", text: "Stakeholder mapping" },
    ]),
    correctOptionId: "B",
    explanation:
      "Scope creep is the gradual expansion of a project's scope without proper approval or adjustment to time, cost, or resources. Each 'small' change seems harmless in isolation, but collectively they can derail a project. A good PM logs every request through a formal change control process.",
    topicTag: "scope",
  },
  {
    question: "What does the 'iron triangle' of project management refer to?",
    options: JSON.stringify([
      { id: "A", text: "Scope, Quality, and Risk" },
      { id: "B", text: "Time, Cost, and Scope" },
      { id: "C", text: "People, Process, and Technology" },
      { id: "D", text: "Planning, Execution, and Closure" },
    ]),
    correctOptionId: "B",
    explanation:
      "The iron triangle (also called the triple constraint) states that Time, Cost, and Scope are interdependent. Change one and the others are affected. For example, if a client wants faster delivery (less time), they either need to pay more (cost) or accept less (scope). Understanding this is fundamental to every PM conversation.",
    topicTag: "fundamentals",
  },
  {
    question: "In Agile, what is the primary purpose of a Sprint Retrospective?",
    options: JSON.stringify([
      { id: "A", text: "To demo the product to stakeholders" },
      { id: "B", text: "To plan the next sprint's tasks" },
      { id: "C", text: "To inspect how the team worked and identify improvements" },
      { id: "D", text: "To update the project risk register" },
    ]),
    correctOptionId: "C",
    explanation:
      "The Sprint Retrospective is about continuous improvement of the team's process, not the product. The team asks: What went well? What didn't? What will we change? This is one of Agile's most powerful habits — regular, honest reflection that compounds over time.",
    topicTag: "agile",
  },
  {
    question: "A project manager notices team morale is dropping. Which document should they consult first?",
    options: JSON.stringify([
      { id: "A", text: "The project budget" },
      { id: "B", text: "The risk register" },
      { id: "C", text: "The stakeholder register" },
      { id: "D", text: "The RACI matrix" },
    ]),
    correctOptionId: "B",
    explanation:
      "Low morale is often a symptom of an unmanaged risk materialising — unclear roles, unrealistic deadlines, or unresolved conflict. The risk register should already contain 'team burnout' or 'resource overload' as potential risks. If it doesn't, that itself is a finding. Good PMs treat people issues as project risks.",
    topicTag: "risk",
  },
  {
    question: "What does MoSCoW stand for in prioritisation?",
    options: JSON.stringify([
      { id: "A", text: "Mandatory, Optional, Scheduled, Cancelled, Waiting" },
      { id: "B", text: "Must have, Should have, Could have, Won't have" },
      { id: "C", text: "Maximum, Optimal, Standard, Critical, Wishlist" },
      { id: "D", text: "Main, Objective, Secondary, Core, Wishlist" },
    ]),
    correctOptionId: "B",
    explanation:
      "MoSCoW is a prioritisation technique used in Agile and requirements management. Must have = non-negotiable. Should have = important but not critical. Could have = nice to have. Won't have = explicitly out of scope for now. It forces honest conversations about what truly matters.",
    topicTag: "agile",
  },
  {
    question: "You are managing a project and a key team member resigns. What should you do first?",
    options: JSON.stringify([
      { id: "A", text: "Immediately tell the client" },
      { id: "B", text: "Assess the impact on the project plan and escalate to the sponsor" },
      { id: "C", text: "Redistribute all their tasks to the remaining team" },
      { id: "D", text: "Pause the project until a replacement is hired" },
    ]),
    correctOptionId: "B",
    explanation:
      "A PM's first response to any unexpected event is to assess impact — on scope, time, cost, and quality. Only once you understand the impact can you make an informed decision about what to communicate and to whom. Escalating to the sponsor before you have an impact assessment is premature; redistributing tasks without assessing impact is reckless.",
    topicTag: "risk",
  },
  {
    question: "What is the difference between a project and business-as-usual (BAU)?",
    options: JSON.stringify([
      { id: "A", text: "Projects are cheaper than BAU" },
      { id: "B", text: "Projects are temporary and unique; BAU is ongoing and repetitive" },
      { id: "C", text: "BAU requires a project manager; projects do not" },
      { id: "D", text: "There is no meaningful difference" },
    ]),
    correctOptionId: "B",
    explanation:
      "A project has a defined start, end, and unique objective. BAU is the ongoing, repetitive work that keeps an organisation running. A PM's job is to deliver the project and hand over to BAU. Confusing the two is one of the most common reasons projects never formally close.",
    topicTag: "fundamentals",
  },
  {
    question: "In PRINCE2, who is ultimately accountable for the project's success?",
    options: JSON.stringify([
      { id: "A", text: "The Project Manager" },
      { id: "B", text: "The Project Board" },
      { id: "C", text: "The Senior User" },
      { id: "D", text: "The Executive" },
    ]),
    correctOptionId: "D",
    explanation:
      "In PRINCE2, the Executive is the single point of accountability for the project. They represent the business interest and are responsible for ensuring the project delivers value. The Project Manager manages day-to-day delivery, but accountability sits with the Executive. This distinction matters in interviews — many candidates confuse accountability with responsibility.",
    topicTag: "prince2",
  },
  {
    question: "A client says 'we need this done by Friday no matter what.' What is the PM's most professional response?",
    options: JSON.stringify([
      { id: "A", text: "Agree immediately to keep the client happy" },
      { id: "B", text: "Refuse — deadlines set by clients are not valid" },
      { id: "C", text: "Assess what is feasible by Friday, present options with trade-offs, and agree a realistic plan" },
      { id: "D", text: "Ask the team to work overtime without telling the client about the risk" },
    ]),
    correctOptionId: "C",
    explanation:
      "A professional PM never blindly agrees to an unrealistic deadline, nor do they simply refuse. The right approach is to assess what is actually achievable, present honest options (e.g. reduced scope, additional resource, phased delivery), and agree a plan with the client. This builds trust far more than false promises.",
    topicTag: "stakeholders",
  },
  {
    question: "What is a 'lessons learned' document and when should it be created?",
    options: JSON.stringify([
      { id: "A", text: "A training manual — created at project start" },
      { id: "B", text: "A record of what went well and what didn't — created at project closure" },
      { id: "C", text: "A risk register update — created during execution" },
      { id: "D", text: "A stakeholder report — created monthly" },
    ]),
    correctOptionId: "B",
    explanation:
      "Lessons learned (or 'lessons log' in PRINCE2) captures what worked, what didn't, and what the organisation should do differently next time. It is formally completed at project closure but should be updated throughout. Many organisations skip this step — which is why they repeat the same mistakes on every project.",
    topicTag: "fundamentals",
  },
  {
    question: "What does 'RAG status' mean in project reporting?",
    options: JSON.stringify([
      { id: "A", text: "Risk, Assumption, Gap" },
      { id: "B", text: "Red, Amber, Green — a traffic light indicator of project health" },
      { id: "C", text: "Resource Allocation Guide" },
      { id: "D", text: "Requirements, Approvals, Governance" },
    ]),
    correctOptionId: "B",
    explanation:
      "RAG status is a simple traffic light system: Green = on track, Amber = at risk but manageable, Red = off track and needs immediate attention. It is used in highlight reports and dashboards to give stakeholders an instant read on project health. The key skill is being honest — many PMs keep things Amber or Green too long to avoid difficult conversations.",
    topicTag: "reporting",
  },
  {
    question: "Why is a project charter important?",
    options: JSON.stringify([
      { id: "A", text: "It replaces the need for a project plan" },
      { id: "B", text: "It formally authorises the project and gives the PM authority to use resources" },
      { id: "C", text: "It is only required for large projects over £1 million" },
      { id: "D", text: "It is a legal contract with the client" },
    ]),
    correctOptionId: "B",
    explanation:
      "The project charter (or project initiation document in PRINCE2) formally authorises the project to exist and gives the PM the authority to apply resources. Without it, a PM has no mandate. It also aligns stakeholders on objectives, scope, and constraints before work begins — preventing the most common source of project conflict.",
    topicTag: "fundamentals",
  },
  {
    question: "In Agile, what is a 'Definition of Done'?",
    options: JSON.stringify([
      { id: "A", text: "The date the project ends" },
      { id: "B", text: "A shared agreement on what criteria must be met for a piece of work to be considered complete" },
      { id: "C", text: "The final sign-off from the client" },
      { id: "D", text: "The sprint backlog being empty" },
    ]),
    correctOptionId: "B",
    explanation:
      "The Definition of Done (DoD) is a shared, explicit agreement within the team about what 'complete' means. Without it, one person's 'done' is another's 'barely started.' A strong DoD typically includes: code reviewed, tested, documented, and deployed to staging. It prevents the hidden accumulation of technical debt and rework.",
    topicTag: "agile",
  },
  {
    question: "What is the purpose of a RACI matrix?",
    options: JSON.stringify([
      { id: "A", text: "To track project costs" },
      { id: "B", text: "To clarify who is Responsible, Accountable, Consulted, and Informed for each task" },
      { id: "C", text: "To prioritise the project backlog" },
      { id: "D", text: "To document project risks" },
    ]),
    correctOptionId: "B",
    explanation:
      "A RACI matrix eliminates ambiguity about roles. Responsible = does the work. Accountable = owns the outcome (only one per task). Consulted = provides input. Informed = kept in the loop. The most common mistake is having multiple 'Accountable' owners — which means nobody is truly accountable.",
    topicTag: "stakeholders",
  },
  {
    question: "A project is 50% through its timeline but has only spent 30% of its budget. What does this most likely indicate?",
    options: JSON.stringify([
      { id: "A", text: "The project is ahead of schedule and under budget — great news" },
      { id: "B", text: "The project may be behind schedule — work is not progressing as planned" },
      { id: "C", text: "The budget was set incorrectly" },
      { id: "D", text: "The team is being underpaid" },
    ]),
    correctOptionId: "B",
    explanation:
      "This is a classic Earned Value Management (EVM) trap. Spending less than planned sounds positive, but it often means work is not being completed on schedule. A PM should check the Schedule Performance Index (SPI) — if it is below 1.0, the project is behind. Low spend + low progress = a project in trouble, not a project saving money.",
    topicTag: "fundamentals",
  },
  {
    question: "What is the key difference between a risk and an issue?",
    options: JSON.stringify([
      { id: "A", text: "Risks are bigger than issues" },
      { id: "B", text: "A risk is something that might happen; an issue is something that has already happened" },
      { id: "C", text: "Issues are recorded in the risk register; risks are not" },
      { id: "D", text: "There is no difference — the terms are interchangeable" },
    ]),
    correctOptionId: "B",
    explanation:
      "A risk is a potential future event (positive or negative) that has not yet occurred. An issue is a problem that has already materialised and requires immediate action. Managing risks proactively means fewer issues. When PMs confuse the two, they end up firefighting instead of managing.",
    topicTag: "risk",
  },
  {
    question: "Why do most projects fail, according to the Standish Group's CHAOS Report?",
    options: JSON.stringify([
      { id: "A", text: "Poor technology choices" },
      { id: "B", text: "Lack of user involvement and unclear requirements" },
      { id: "C", text: "Insufficient budget" },
      { id: "D", text: "Incompetent project managers" },
    ]),
    correctOptionId: "B",
    explanation:
      "The CHAOS Report consistently identifies lack of user involvement and unclear/changing requirements as the top causes of project failure — not technology or budget. This is why stakeholder engagement and requirements management are core PM skills. The best technical solution built to the wrong requirements is still a failed project.",
    topicTag: "fundamentals",
  },
  {
    question: "What is 'gold plating' in project management and why is it a problem?",
    options: JSON.stringify([
      { id: "A", text: "Spending too much on project materials" },
      { id: "B", text: "Adding extra features or quality beyond what was agreed, without client approval" },
      { id: "C", text: "Reporting project status in a misleading way" },
      { id: "D", text: "Hiring too many senior consultants" },
    ]),
    correctOptionId: "B",
    explanation:
      "Gold plating is when the team adds features or enhancements that were never requested, believing they are doing the client a favour. It consumes time and budget, introduces untested scope, and can actually frustrate clients who now have to manage something they didn't ask for. A PM's job is to deliver what was agreed — no more, no less.",
    topicTag: "scope",
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log("Connected. Seeding Brain Snap questions...");

  // Clear existing
  await conn.execute("DELETE FROM brainSnapQuestions");

  for (const q of questions) {
    await conn.execute(
      "INSERT INTO brainSnapQuestions (question, options, correctOptionId, explanation, topicTag, isActive) VALUES (?, ?, ?, ?, ?, 1)",
      [q.question, q.options, q.correctOptionId, q.explanation, q.topicTag ?? null]
    );
  }

  console.log(`✅ Seeded ${questions.length} Brain Snap questions.`);
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
