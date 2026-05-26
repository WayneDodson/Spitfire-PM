/**
 * Seed script for Advanced Modules simulations.
 * Modules: Lean (A), Six Sigma (B), PRINCE2 Practitioner (C), MSP (D), MoP (E), Change Management (F)
 * 10 simulations per module = 60 total.
 * levelId = null for advanced modules (they are unlocked after all 7 core levels complete).
 * accessType = 'advanced' to gate behind full-curriculum completion.
 * Run: node scripts/seed-advanced-modules.mjs
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

async function upsert(sim) {
  const [existing] = await conn.query(
    'SELECT id FROM simulations WHERE title = ? AND (levelId IS NULL OR levelId = ?)',
    [sim.title, sim.levelId ?? 0]
  );
  if (existing.length > 0) {
    console.log(`  ↩  Skipping (exists): ${sim.title}`);
    return;
  }
  await conn.query(
    `INSERT INTO simulations (levelId, title, description, type, difficulty, categoryTag, estimatedMinutes, accessType, content, orderIndex, isInterviewBank)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sim.levelId ?? null,
      sim.title,
      sim.description,
      sim.type,
      sim.difficulty,
      sim.categoryTag,
      sim.estimatedMinutes,
      sim.accessType,
      JSON.stringify(sim.content),
      sim.orderIndex,
      0,
    ]
  );
  console.log(`  ✓  Inserted: ${sim.title}`);
}

const simulations = [

  // ════════════════════════════════════════════════════════════
  // MODULE A — LEAN METHODOLOGY
  // ════════════════════════════════════════════════════════════
  {
    levelId: null, orderIndex: 101, accessType: 'advanced', module: 'lean',
    title: 'The Process That Takes Too Long',
    description: 'You are PM at an NHS Trust. The referral-to-treatment pathway takes 47 days. Your director wants to hit 28 days using Lean. Your first task is to understand why it takes so long.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'You are a PM at an NHS Trust. The referral-to-treatment pathway for outpatient appointments takes an average of 47 days. The national target is 18 weeks but the Trust wants to hit 28 days. Your director has asked you to lead a Lean improvement project. Your first task is to understand why the process takes so long.',
      options: [
        { id: 'A', text: 'Analyse data from the last 12 months and build a report for the board before doing anything else', consequence: 'Data analysis is useful but without observing reality you will miss the real bottlenecks. Delayed start.', score: 2 },
        { id: 'B', text: 'Walk the process yourself (a "Gemba walk") — follow a referral from receipt to appointment and observe every step', consequence: 'The Gemba walk is the Lean starting point — observe the actual process, not the assumed process. Excellent choice.', score: 4 },
        { id: 'C', text: 'Send a survey to all staff involved in the pathway asking for their views on the bottlenecks', consequence: 'Staff surveys produce opinion, not fact. You will get 40 different views and no clear picture.', score: 2 },
        { id: 'D', text: 'Benchmark against another Trust that has hit 28 days and copy their approach', consequence: 'Copying another Trust\'s solution without understanding your own process is a classic Lean mistake.', score: 1 },
      ],
      takeaway: 'The Gemba walk — going to where the work happens and observing reality — is the foundational Lean tool for understanding a process.',
    },
  },
  {
    levelId: null, orderIndex: 102, accessType: 'advanced', module: 'lean',
    title: 'Mapping the Value Stream',
    description: 'Build a value stream map for an NHS outpatient referral process, identifying value-adding and non-value-adding steps.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'confidence_builder', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are leading a Lean improvement project for the outpatient referral process at an NHS Trust. The process runs from GP referral to first appointment. You need to create a value stream map to identify where time and resource is being wasted.\n\nProcess steps (in order): GP sends referral → Admin receives and logs referral → Referral triaged by clinical team → Appointment slot allocated → Appointment letter sent to patient → Patient attends appointment.\n\nCurrent average time: 47 days. Target: 28 days.',
      fields: [
        { id: 'current_state', label: 'Current State — Process Steps with Time', placeholder: 'List each step, who does it, and how long it takes (processing time and wait time separately). Example: "Step 1: Admin logs referral — processing time 10 mins, wait time 2 days before triage."' },
        { id: 'value_analysis', label: 'Value-Adding vs Non-Value-Adding Steps', placeholder: 'For each step, classify as: Value-Adding (patient would pay for it), Non-Value-Adding but Necessary (required by regulation), or Pure Waste (can be eliminated). Explain your reasoning.' },
        { id: 'wastes_identified', label: 'Wastes Identified (TIMWOODS)', placeholder: 'List at least 4 specific wastes you can see in this process. Use the TIMWOODS framework: Transport, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects, Skills underutilised.' },
        { id: 'future_state', label: 'Future State — Redesigned Process', placeholder: 'Describe your redesigned process. Which steps can be eliminated, combined, or automated? What would the new timeline look like? How would you get from 47 days to 28 days?' },
        { id: 'quick_wins', label: 'Quick Wins (implementable within 4 weeks)', placeholder: 'Identify 2-3 changes that could be made immediately without significant investment or system changes.' },
      ],
      scoringCriteria: 'AI will check: correct use of TIMWOODS terminology, clear distinction between value-adding and non-value-adding steps, future state that realistically achieves the 28-day target, quick wins that are genuinely quick and specific.',
    },
  },
  {
    levelId: null, orderIndex: 103, accessType: 'advanced', module: 'lean',
    title: 'The Kaizen Event That Divided the Team',
    description: 'You ran a 3-day Kaizen event. The team agreed 8 changes. Now two senior managers who weren\'t involved are blocking implementation.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You have run a 3-day Kaizen event with a cross-functional team to improve the purchase order process. The team agreed on 8 changes. Back in the workplace, two senior managers — who were not in the Kaizen event — are blocking the changes, saying they were not consulted.',
      options: [
        { id: 'A', text: 'Override the managers and implement the changes — the team agreed them through a proper process', consequence: 'Forcing change on resistors creates sabotage. Changes will not stick. The Kaizen improvements will be reversed within weeks.', score: 1 },
        { id: 'B', text: 'Go back to the Kaizen team and ask them to compromise on the 8 changes', consequence: 'Compromising good solutions because resistors were not involved is a governance failure — it rewards poor stakeholder management.', score: 2 },
        { id: 'C', text: 'Meet the two managers individually, understand their concerns, share the process data, and bring them into the implementation as co-owners', consequence: 'Lean changes only stick when people feel ownership. Engaging resistors as co-owners is the right approach. This is how you sustain improvement.', score: 4 },
        { id: 'D', text: 'Escalate to the director to instruct the managers to comply', consequence: 'Escalating before attempting direct resolution is premature and damages relationships. The managers will comply on paper but undermine in practice.', score: 2 },
      ],
      takeaway: 'Lean improvements only sustain when the people doing the work own them. Resistance is a signal that stakeholder engagement was missed — not a reason to force through change.',
    },
  },
  {
    levelId: null, orderIndex: 104, accessType: 'advanced', module: 'lean',
    title: 'Spot the 8 Wastes',
    description: 'Review a customer service process at a telecoms company and identify which of the 8 Lean wastes (TIMWOODS) each observation represents.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'exam_prep', estimatedMinutes: 12,
    content: {
      scenario: 'You are reviewing a customer service process at a telecoms company. Below are 8 observations from your process review. For each one, identify which of the 8 Lean wastes (TIMWOODS: Transport, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects, Skills underutilised) it represents.\n\n1. Customer service agents spend 20 minutes each morning logging into 4 different systems before they can start work.\n2. Completed application forms sit in an inbox for 3 days before anyone processes them.\n3. Managers produce a 12-page weekly report that nobody reads.\n4. Customer data is entered into the CRM, then re-entered manually into the billing system.\n5. 20% of application forms are returned because they are incomplete.\n6. Experienced agents are assigned to answering basic FAQ calls that a chatbot could handle.\n7. Agents walk to a shared printer at the other end of the office 15 times per day.\n8. The warehouse holds 6 months\' worth of printed forms that have been superseded by a digital process.\n\nWhich observation best illustrates the "Waiting" waste?',
      options: [
        { id: 'A', text: 'Observation 1 — agents logging into 4 systems each morning', consequence: 'This is Motion waste — unnecessary movement/activity before value-adding work can begin.', score: 1 },
        { id: 'B', text: 'Observation 2 — forms sitting in an inbox for 3 days', consequence: 'Correct. This is classic Waiting waste — work is ready but nothing is happening to it. Every day in the inbox is pure waste from the customer\'s perspective.', score: 4 },
        { id: 'C', text: 'Observation 5 — 20% of forms returned as incomplete', consequence: 'This is Defects waste — work that has to be redone because it was not right first time.', score: 1 },
        { id: 'D', text: 'Observation 8 — 6 months of obsolete printed forms in the warehouse', consequence: 'This is Inventory waste — holding more stock than is needed, in this case stock that is entirely useless.', score: 1 },
      ],
      takeaway: 'TIMWOODS: Transport (moving things), Inventory (excess stock), Motion (unnecessary movement), Waiting (idle time), Overproduction (more than needed), Over-processing (more work than required), Defects (rework), Skills underutilised (wasted human potential).',
    },
  },
  {
    levelId: null, orderIndex: 105, accessType: 'advanced', module: 'lean',
    title: 'Tell Me About a Process You Improved',
    description: 'Interview simulation — answer the classic Lean interview question using the STAR framework.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Tell me about a time you identified and improved an inefficient process. What was the process, what did you do, and what was the result?',
      context: 'This question tests your ability to apply Lean or continuous improvement thinking in a real situation. Interviewers want to see that you can identify waste, take action, and measure the outcome — not just describe a problem.',
      guidance: 'Use the STAR framework: Situation (what was the process and why was it a problem?), Task (what were you asked or decided to do?), Action (what specific steps did you take — use Lean language where relevant: Gemba walk, waste identification, process mapping, Kaizen), Result (what measurably improved?).\n\nAim for 300-400 words. Be specific about numbers — time saved, errors reduced, cost avoided.',
      starGuide: {
        situation: 'Describe the process and the specific problem — use data if you have it.',
        task: 'What was your role and what were you trying to achieve?',
        action: 'Walk through exactly what you did. Lean answers should mention: observing the process directly, identifying specific wastes, involving the team, testing changes.',
        result: 'Quantify the improvement. If you cannot use exact numbers, use percentages or relative improvements.',
      },
      wordCountTarget: 350,
    },
  },
  {
    levelId: null, orderIndex: 106, accessType: 'advanced', module: 'lean',
    title: 'Running a 5S Workshop',
    description: 'You are running a 5S workshop in a busy NHS admin office. Halfway through, staff start pushing back saying this is just tidying up and a waste of their time.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'common_scenario', estimatedMinutes: 8,
    content: {
      scenario: 'You are running a 5S workshop in a busy NHS admin office. The 5 steps are Sort, Set in Order, Shine, Standardise, Sustain. Halfway through the Sort phase, three members of staff start pushing back: "This is just tidying up — we\'re too busy for this. It won\'t make any difference."',
      options: [
        { id: 'A', text: 'Acknowledge their concern and show them the data — time lost per day searching for things, errors caused by disorganisation — then continue', consequence: 'Connecting the 5S activity to real problems they experience every day is the right approach. Resistance drops significantly when people see the "why".', score: 4 },
        { id: 'B', text: 'Tell them 5S is a proven methodology and they need to trust the process', consequence: 'Dismissing concerns with appeals to authority creates resentment. They will comply during the workshop and revert immediately after.', score: 1 },
        { id: 'C', text: 'Stop the workshop and reschedule when people are more receptive', consequence: 'Abandoning the workshop signals that resistance works. The rescheduled session will face the same pushback.', score: 2 },
        { id: 'D', text: 'Ask the resistors to lead the next phase — give them ownership of the "Set in Order" step', consequence: 'Giving resistors ownership is a good instinct, but without first addressing their concern about value, they will not engage genuinely.', score: 3 },
      ],
      takeaway: 'Resistance to Lean tools is almost always about not understanding the "why." Show people the data that connects the tool to a problem they already feel.',
    },
  },
  {
    levelId: null, orderIndex: 107, accessType: 'advanced', module: 'lean',
    title: 'The Resistance to Lean',
    description: 'Six months into a Lean transformation, the initial enthusiasm has faded. Attendance at improvement events is dropping and managers are reverting to old ways of working.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You are leading a Lean transformation programme at a large local council. Six months in, the initial enthusiasm has faded. Attendance at improvement events is dropping. Two department managers have quietly reverted to their old processes. The Chief Executive is asking you for an update.',
      options: [
        { id: 'A', text: 'Report the setbacks honestly to the CE and recommend a pause to reassess the approach', consequence: 'Honesty with the sponsor is correct, but recommending a pause signals defeat. Lean transformations always face a "valley of despair" at 6 months — the response is to accelerate engagement, not pause.', score: 2 },
        { id: 'B', text: 'Focus on the departments that are still engaged and build visible wins there — use their success to re-engage the resistors', consequence: 'Creating visible success stories and using peer influence is the most effective way to re-energise a stalling transformation. This is the right call.', score: 4 },
        { id: 'C', text: 'Ask the CE to mandate attendance at improvement events and enforce consequences for non-compliance', consequence: 'Mandating Lean creates compliance without commitment. People attend but do not engage. Improvements made under duress do not sustain.', score: 1 },
        { id: 'D', text: 'Bring in an external Lean consultant to run the next phase — fresh energy might help', consequence: 'External consultants can add value but cannot substitute for internal ownership. If the transformation depends on an external, it will collapse when they leave.', score: 2 },
      ],
      takeaway: 'Lean transformations stall at 6 months almost universally. The answer is to create visible wins, celebrate them loudly, and use peer influence — not mandate or external dependency.',
    },
  },
  {
    levelId: null, orderIndex: 108, accessType: 'advanced', module: 'lean',
    title: 'Write a Lean Improvement Plan',
    description: 'Build a complete Lean improvement plan for a local council\'s planning application process — from problem statement to implementation timeline.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are leading a Lean improvement project for a local council\'s planning application process. Currently applications take an average of 35 days to process. The council wants to reduce this to 14 days within 6 months.\n\nStaff involved: 3 planning officers, 1 admin coordinator, 1 team manager.\nBudget: £8,000 (mainly staff time for improvement activities).\nKey constraint: The council cannot change the statutory consultation period (21 days minimum).',
      fields: [
        { id: 'problem_statement', label: 'Problem Statement', placeholder: 'Write a specific, data-driven problem statement. Include: current state (35 days average), target state (14 days), impact of the problem (customer complaints, staff frustration, regulatory risk).' },
        { id: 'value_stream', label: 'Value Stream Summary', placeholder: 'List the main process steps from application receipt to decision. For each step, estimate the processing time and the wait time.' },
        { id: 'wastes_identified', label: 'Wastes Identified (TIMWOODS)', placeholder: 'List at least 4 specific wastes with evidence. Example: "Waiting — applications sit in the planning officer inbox for 3 days before being picked up. Evidence: log data shows average 3.2 day wait at this step."' },
        { id: 'root_cause', label: 'Root Cause Analysis (5 Whys)', placeholder: 'Choose the biggest waste and apply 5 Whys to get to the root cause. Format: Why 1 → Why 2 → Why 3 → Why 4 → Why 5 → Root cause.' },
        { id: 'improvements', label: 'Proposed Improvements', placeholder: 'List at least 5 specific, actionable improvements. For each: what will change, who is responsible, what is the expected impact on processing time.' },
        { id: 'success_measures', label: 'Success Measures', placeholder: 'How will you know the improvement is working? List at least 3 measurable KPIs with baseline and target values.' },
        { id: 'implementation_timeline', label: 'Implementation Timeline', placeholder: 'Create a simple timeline: Month 1, Month 2, etc. Who does what and by when? Include a review point at Month 3.' },
      ],
      scoringCriteria: 'AI checks: specific wastes named correctly using TIMWOODS, 5 Whys completed to root cause (not symptom), improvements that are specific and actionable, measurable success criteria with baselines, timeline that is realistic given the 6-month target.',
    },
  },
  {
    levelId: null, orderIndex: 109, accessType: 'advanced', module: 'lean',
    title: 'Tell Me How You Would Reduce Waste in a Process',
    description: 'Interview simulation — answer the hypothetical Lean question using a structured, framework-driven approach.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'If you were asked to reduce waste in a process you had never seen before, how would you approach it?',
      context: 'This is a hypothetical question testing your Lean methodology knowledge. The interviewer wants to see a structured, logical approach — not just "I would observe the process." They want to hear Lean language used correctly.',
      guidance: 'Structure your answer around the Lean improvement cycle:\n1. Observe (Gemba walk — go and see the actual process)\n2. Map (create a current state value stream map)\n3. Identify (classify steps as value-adding, necessary non-value-adding, or pure waste using TIMWOODS)\n4. Analyse (root cause analysis — 5 Whys for the biggest waste)\n5. Improve (run a Kaizen event with the people who do the work)\n6. Sustain (standard work, visual management, regular review)\n\nAim for 300-350 words. Use specific Lean terminology throughout.',
      starGuide: {
        situation: 'Acknowledge this is a new process — your approach starts with observation, not assumption.',
        task: 'Your goal is to identify and eliminate waste to improve flow and value delivery.',
        action: 'Walk through the 6 steps above with enough detail to show you know what each one involves.',
        result: 'Describe what a successful outcome looks like — reduced lead time, fewer errors, better use of staff time.',
      },
      wordCountTarget: 320,
    },
  },
  {
    levelId: null, orderIndex: 110, accessType: 'advanced', module: 'lean',
    title: 'The NHS Outpatients Lean Project (Full Project)',
    description: 'A 6-month Lean transformation of the outpatients booking process at an NHS Trust. 4,500 appointments per month. DNA rate: 18%. Target: below 8%.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 65,
    content: {
      projectSetup: {
        title: 'NHS Outpatients Lean Transformation',
        context: 'You are PM for a 6-month Lean transformation of the outpatients booking process at a medium NHS Trust. 4,500 appointments per month. Current DNA (Did Not Attend) rate: 18%. Target: below 8%. Budget: £35,000 (largely staff time). Sponsor: Deputy Chief Operating Officer.',
        stakeholders: ['Deputy COO (Sponsor)', 'Outpatients Manager', 'Clinical Leads (x3)', 'Admin Team (12 staff)', 'IT Department', 'Patient Experience Team'],
        constraints: ['Cannot change clinical protocols without clinical sign-off', 'IT system changes require 6-week lead time', 'Staff cannot be redeployed during peak clinic periods'],
      },
      stages: [
        {
          id: 1, title: 'Stage 1 — Discovery',
          description: 'Gemba walk, process mapping, waste identification.',
          scenario: 'You have completed your Gemba walk. You observed the booking process for 3 days. Key findings: appointment letters are sent by post only (7-10 day delivery), patients are not reminded closer to the appointment date, 35% of DNAs are from patients who say they "forgot", the booking team manually cross-references 3 different spreadsheets to allocate slots. What is your priority action?',
          options: [
            { id: 'A', text: 'Immediately implement SMS reminders — the data clearly shows this will reduce DNAs', consequence: 'Acting before completing the full discovery phase risks missing other causes. SMS reminders are likely part of the solution but jumping to implementation now is premature.', score: 2 },
            { id: 'B', text: 'Complete the value stream map with the booking team before drawing any conclusions', consequence: 'Correct — the Gemba walk gives you observations, not the full picture. The value stream map with the team will surface causes you have not yet seen.', score: 4 },
            { id: 'C', text: 'Present your findings to the Deputy COO and ask for a decision on next steps', consequence: 'Escalating to the sponsor before completing discovery hands over PM responsibility prematurely. The sponsor expects you to bring a recommendation, not raw observations.', score: 2 },
            { id: 'D', text: 'Survey patients who have DNA\'d to understand their reasons', consequence: 'Patient insight is valuable but should complement, not replace, the process analysis. Starting with a survey delays the structured Lean approach.', score: 2 },
          ],
          takeaway: 'Discovery is not complete until the value stream map is built with the people who do the work. Observations from a Gemba walk are inputs, not conclusions.',
        },
        {
          id: 2, title: 'Stage 2 — Analysis',
          description: 'Root cause analysis, stakeholder engagement, prioritisation.',
          scenario: 'Your value stream map is complete. You have identified 6 wastes. Root cause analysis shows the biggest driver of DNAs is the combination of: long gap between booking and appointment (average 23 days), postal-only communication, and no reminder system. The IT team has told you that adding SMS capability to the existing system will take 8 weeks and cost £12,000. A third-party SMS service could be set up in 2 weeks for £3,500/year. What do you recommend?',
          options: [
            { id: 'A', text: 'Wait for the internal IT solution — it integrates better with existing systems', consequence: 'An 8-week delay to implement the highest-impact improvement is hard to justify when a 2-week alternative exists. The integration benefit does not outweigh the delay.', score: 2 },
            { id: 'B', text: 'Use the third-party SMS service immediately as a quick win, and plan the internal integration for a later phase', consequence: 'Correct. Quick wins build momentum and demonstrate value. The third-party service delivers the improvement now while the longer-term integration is planned properly.', score: 4 },
            { id: 'C', text: 'Recommend both solutions run in parallel to cover all bases', consequence: 'Running two SMS systems simultaneously creates confusion, duplication, and additional cost. Pick one approach.', score: 1 },
            { id: 'D', text: 'Deprioritise the SMS solution and focus on other wastes first', consequence: 'The data shows SMS reminders address the biggest single driver of DNAs. Deprioritising the highest-impact improvement is a poor resource allocation decision.', score: 1 },
          ],
          takeaway: 'In Lean, quick wins matter. A good solution available now is usually better than a perfect solution available in 8 weeks — especially when the quick win builds stakeholder confidence.',
        },
        {
          id: 3, title: 'Stage 3 — Design (Kaizen Event)',
          description: 'Kaizen event, solution design, pilot planning.',
          scenario: 'You are running a 2-day Kaizen event with the booking team. On Day 1, the team has identified 12 potential improvements. On Day 2, you need to prioritise them. The team is divided: some want to focus on the SMS reminder system (high impact, quick to implement), others want to redesign the entire booking workflow (high impact, 4 months to implement). How do you facilitate the prioritisation?',
          options: [
            { id: 'A', text: 'Use an impact/effort matrix — plot all 12 improvements and implement the high-impact, low-effort ones first', consequence: 'The impact/effort matrix is the standard Lean prioritisation tool. It gives the team an objective framework and builds consensus. This is the right approach.', score: 4 },
            { id: 'B', text: 'Take a vote — the majority view should decide the priority', consequence: 'Voting without a framework produces a popularity contest, not a prioritisation. The loudest voices win, not the best ideas.', score: 1 },
            { id: 'C', text: 'Ask the Deputy COO to decide the priority — they know the strategic context', consequence: 'Escalating prioritisation to the sponsor bypasses the Kaizen team\'s ownership. The team will implement decisions they had no part in making with less commitment.', score: 2 },
            { id: 'D', text: 'Implement all 12 improvements simultaneously — the team has the energy now', consequence: 'Implementing 12 changes at once makes it impossible to know which change caused which improvement. It also overwhelms the team and increases the risk of failure.', score: 1 },
          ],
          takeaway: 'The impact/effort matrix is the standard Lean prioritisation tool. Quick wins (high impact, low effort) should always be implemented first — they build momentum and prove the approach works.',
        },
        {
          id: 4, title: 'Stage 4 — Implementation (Pilot)',
          description: 'Pilot in one specialty, staff training, resistance management.',
          scenario: 'The pilot is running in the Orthopaedics clinic. After 4 weeks, DNA rates have dropped from 18% to 11% — a significant improvement but short of the 8% target. The booking team is reporting that some patients are ignoring the SMS reminders. The clinical lead for Orthopaedics is now asking whether the pilot should be extended before rolling out to other specialties. What do you recommend?',
          options: [
            { id: 'A', text: 'Roll out to all specialties now — 11% is a significant improvement and momentum matters', consequence: 'Rolling out before understanding why 11% is not 8% risks scaling a partially-effective solution. You need to understand the remaining gap before expanding.', score: 2 },
            { id: 'B', text: 'Extend the pilot by 4 weeks, investigate why some patients are ignoring SMS, and test a modified approach before rolling out', consequence: 'Correct. The pilot has demonstrated the approach works but has not yet hit the target. Understanding the remaining gap before scaling is sound Lean practice.', score: 4 },
            { id: 'C', text: 'Accept 11% as the new baseline — 8% may not be achievable', consequence: 'Accepting a result that is 3 percentage points short of the target without investigation is premature. The pilot data suggests further improvement is possible.', score: 1 },
            { id: 'D', text: 'Add a phone call reminder on top of the SMS — cover all bases', consequence: 'Adding a phone call without first understanding why SMS is not working for some patients may not address the root cause. It also adds significant staff time cost.', score: 2 },
          ],
          takeaway: 'Pilots should be extended when the approach is working but has not yet hit the target — not abandoned, and not scaled prematurely. The gap between 11% and 8% is data to be understood.',
        },
        {
          id: 5, title: 'Stage 5 — Sustain',
          description: 'Standard work documentation, handover to operational team, benefits measurement.',
          scenario: 'The full rollout is complete. DNA rates are at 7.2% — below the 8% target. You are preparing to hand the process over to the Outpatients Manager. The Deputy COO wants to close the project. The Outpatients Manager is asking for a "Lean champion" to be appointed to maintain the improvements. You have 2 weeks left in the project. What is your priority?',
          options: [
            { id: 'A', text: 'Document the standard work for all new processes and train the Lean champion before handover', consequence: 'Standard work documentation and champion training are the two most critical sustainability mechanisms. This is the right priority.', score: 4 },
            { id: 'B', text: 'Write the project closure report and present benefits to the Deputy COO — the operational team can manage the rest', consequence: 'Closing the project without ensuring sustainability mechanisms are in place is the most common reason Lean improvements revert. The closure report can wait.', score: 1 },
            { id: 'C', text: 'Run a final Kaizen event to identify the next round of improvements before you leave', consequence: 'Starting a new improvement cycle before the current changes are embedded and handed over is premature. Sustainability first, then improvement.', score: 2 },
            { id: 'D', text: 'Ask the Deputy COO to extend the project by 2 months to ensure sustainability', consequence: 'A well-planned handover should not require a 2-month extension. If sustainability requires 2 more months of PM involvement, the handover planning has been left too late.', score: 2 },
          ],
          takeaway: 'Lean improvements only sustain when standard work is documented and the people doing the work are trained to maintain it. The Lean champion role is critical — appoint and train them before you leave.',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE B — SIX SIGMA
  // ════════════════════════════════════════════════════════════
  {
    levelId: null, orderIndex: 201, accessType: 'advanced', module: 'six_sigma',
    title: 'Defining the Problem Correctly',
    description: 'Your project sponsor gives you a vague problem statement. You need to turn it into a proper Six Sigma problem statement before the project can proceed.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 9,
    content: {
      scenario: 'You are leading a Six Sigma project to reduce customer complaints at a telecoms company. In the Define phase, your project sponsor tells you the problem is: "Our customer service is terrible and staff don\'t care." You need to turn this into a proper problem statement before proceeding.',
      options: [
        { id: 'A', text: 'Accept the sponsor\'s statement — it is clear enough to work with', consequence: 'Vague problem statements produce vague solutions. The project will lose focus immediately and the team will have no shared understanding of what success looks like.', score: 1 },
        { id: 'B', text: 'Rewrite the problem statement using data: "Customer complaints have increased by 34% over 6 months, from 120 to 161 per month, resulting in £42,000 in compensation costs and a 12% increase in call handling time"', consequence: 'A data-driven, specific problem statement is the foundation of DMAIC. This gives the team a clear target and a measurable baseline. Exactly right.', score: 4 },
        { id: 'C', text: 'Ask the team what they think the problem is and combine their views into a statement', consequence: 'Team opinions are useful context but not a substitute for a data-based problem statement. You will get 8 different problem statements and no consensus.', score: 2 },
        { id: 'D', text: 'Start the Measure phase anyway — the problem will become clearer once you have the data', consequence: 'Skipping a proper Define phase is a classic Six Sigma failure — you measure the wrong things and the project drifts.', score: 1 },
      ],
      takeaway: 'A Six Sigma problem statement must be specific, data-driven, and measurable. It describes the gap between current state and desired state — not a cause, not a solution, and not an opinion.',
    },
  },
  {
    levelId: null, orderIndex: 202, accessType: 'advanced', module: 'six_sigma',
    title: 'The Measure Phase Goes Wrong',
    description: 'Your data collection plan is running but the data quality is poor. Measurements are inconsistent between different team members.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You are in the Measure phase of a Six Sigma project to reduce processing errors in a mortgage application team. You have been collecting data for 3 weeks. You notice that error rates recorded by different team members vary significantly — some record 4% errors, others record 12% for the same process. The data is inconsistent.',
      options: [
        { id: 'A', text: 'Average the measurements and use the combined figure as your baseline', consequence: 'Averaging inconsistent measurements produces a meaningless baseline. The inconsistency itself is the problem — it means your measurement system is unreliable.', score: 1 },
        { id: 'B', text: 'Conduct a Measurement System Analysis (MSA) to understand why measurements are inconsistent before using any data', consequence: 'Correct. MSA is the Six Sigma tool for validating that your measurement system is reliable. If you cannot trust the measurements, you cannot trust the analysis. This is the right call.', score: 4 },
        { id: 'C', text: 'Use only the data from the most experienced team member — their measurements are most likely to be accurate', consequence: 'Cherry-picking data from one source introduces bias. The inconsistency between team members is itself a finding that needs to be understood.', score: 1 },
        { id: 'D', text: 'Move to the Analyse phase — the inconsistency will resolve itself once you have more data', consequence: 'More data from an unreliable measurement system is just more unreliable data. The Analyse phase conclusions will be built on a flawed foundation.', score: 1 },
      ],
      takeaway: 'Measurement System Analysis (MSA) validates that your data collection process is reliable before you use the data to draw conclusions. Garbage in, garbage out — Six Sigma projects fail when measurement systems are not validated.',
    },
  },
  {
    levelId: null, orderIndex: 203, accessType: 'advanced', module: 'six_sigma',
    title: 'Build a DMAIC Project Charter',
    description: 'Complete a Six Sigma project charter for a mortgage processing error reduction project before the Sponsor sign-off meeting.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are leading a Six Sigma project at a mortgage processing company. Processing errors are occurring in 8.3% of applications, causing rework, customer complaints, and regulatory risk. You need to complete the project charter before the Sponsor sign-off meeting.\n\nKey data: 2,400 applications processed per month. Each error costs an average of £38 to fix. Current error rate: 8.3% (199 errors/month). Industry benchmark: 1.5% (36 errors/month). Annual cost of errors at current rate: approximately £90,000.',
      fields: [
        { id: 'problem_statement', label: 'Problem Statement (data-driven, specific)', placeholder: 'Write a SMART problem statement. Include: what is happening, how often, what it costs, and what the target is. Do NOT include causes or solutions.' },
        { id: 'goal_statement', label: 'Goal Statement (measurable target with timeframe)', placeholder: 'Write a specific, measurable goal. Example format: "Reduce [metric] from [baseline] to [target] by [date]." Include the financial benefit if achieved.' },
        { id: 'scope', label: 'Project Scope (what\'s in, what\'s out)', placeholder: 'Define the boundaries of the project. What processes are included? What is explicitly excluded? What is the start and end point of the process you are improving?' },
        { id: 'business_case', label: 'Business Case (why this matters)', placeholder: 'Explain the financial and strategic case for this project. Include: annual cost of current errors, regulatory risk, customer impact, and what achieving the goal would save.' },
        { id: 'ctq', label: 'CTQ — Critical to Quality (what does the customer need?)', placeholder: 'Define what "quality" means from the customer\'s perspective. CTQ must be customer-defined, not internally defined. What does the customer expect from this process?' },
        { id: 'team', label: 'Team Members and Roles', placeholder: 'List the project team. Must include: Champion (senior sponsor), Black Belt or Green Belt (project lead), Process Owner, and at least 2 team members from the process. Explain each role.' },
        { id: 'timeline', label: 'DMAIC Timeline (key milestones)', placeholder: 'Create a timeline for each DMAIC phase. Define, Measure, Analyse, Improve, Control. Include key milestones and gate review dates.' },
        { id: 'risks', label: 'Risks', placeholder: 'List at least 3 project risks with likelihood, impact, and mitigation for each.' },
      ],
      scoringCriteria: 'AI checks: problem and goal statements meet SMART criteria, CTQ is customer-defined not internally defined, scope has both inclusions and exclusions, team includes a Process Owner, timeline covers all 5 DMAIC phases.',
    },
  },
  {
    levelId: null, orderIndex: 204, accessType: 'advanced', module: 'six_sigma',
    title: 'Root Cause Analysis — Fishbone Diagram',
    description: 'Build a fishbone (Ishikawa) diagram to identify the root causes of high error rates in a financial services application process.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 18,
    content: {
      projectBrief: 'You are in the Analyse phase of a Six Sigma project. The problem: 8.3% of mortgage applications contain errors that require rework. You need to build a fishbone (Ishikawa) diagram to identify potential root causes before selecting which to investigate with data.\n\nThe 6 standard fishbone categories are: People, Process, Technology, Environment, Materials, Measurement.',
      fields: [
        { id: 'people_causes', label: 'People — Potential Causes', placeholder: 'List potential causes related to the people doing the work. Consider: training, experience, workload, motivation, communication, supervision.' },
        { id: 'process_causes', label: 'Process — Potential Causes', placeholder: 'List potential causes related to how the work is done. Consider: process steps, handoffs, decision points, rework loops, approval stages.' },
        { id: 'technology_causes', label: 'Technology — Potential Causes', placeholder: 'List potential causes related to systems and tools. Consider: system usability, data entry requirements, system integration, error detection capabilities.' },
        { id: 'environment_causes', label: 'Environment — Potential Causes', placeholder: 'List potential causes related to the working environment. Consider: interruptions, workspace, time pressure, peak volume periods.' },
        { id: 'materials_causes', label: 'Materials — Potential Causes', placeholder: 'List potential causes related to inputs and information. Consider: quality of information received from customers, completeness of application forms, clarity of instructions.' },
        { id: 'measurement_causes', label: 'Measurement — Potential Causes', placeholder: 'List potential causes related to how errors are detected and measured. Consider: when errors are caught (early vs late), how errors are defined, consistency of error classification.' },
        { id: 'top_causes', label: 'Top 3 Root Cause Hypotheses', placeholder: 'Based on your fishbone analysis, identify your top 3 hypotheses for the root cause. For each: state the hypothesis, explain your reasoning, and describe what data you would collect to test it.' },
      ],
      scoringCriteria: 'AI checks: at least 3 causes per category, causes are specific (not generic), top 3 hypotheses are testable with data, reasoning connects causes to the observed error rate.',
    },
  },
  {
    levelId: null, orderIndex: 205, accessType: 'advanced', module: 'six_sigma',
    title: 'The Control Plan Nobody Followed',
    description: 'A Six Sigma project you completed 4 months ago has regressed. Error rates have crept back up. The control plan was thorough but nobody is following it.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 9,
    content: {
      scenario: 'You completed a successful Six Sigma project 4 months ago. Error rates dropped from 8.3% to 1.2%. You have just been asked to review the process and discovered the error rate has crept back up to 5.7%. The control plan you put in place was thorough — but nobody is following it.',
      options: [
        { id: 'A', text: 'Immediately launch a new DMAIC project to fix it', consequence: 'Jumping to a new DMAIC cycle without understanding why the first fix failed will repeat the same mistake. The problem is sustainability, not the solution itself.', score: 2 },
        { id: 'B', text: 'Investigate why the control plan broke down before doing anything else — speak to the process owner and front-line staff', consequence: 'Control plan failure is almost always a people/process issue, not a technical one. Understanding root cause first is correct. You cannot fix a sustainability problem without knowing why it failed.', score: 4 },
        { id: 'C', text: 'Report the failure to the sponsor and recommend the project be officially closed as unsuccessful', consequence: 'Premature failure declaration — the improvement was real and significant. The sustainability mechanism failed, not the solution. This is a different problem.', score: 1 },
        { id: 'D', text: 'Implement the control plan again with stricter enforcement measures', consequence: 'Stricter enforcement without understanding why it broke down will not solve anything — and will create resentment. The root cause of non-compliance needs to be understood first.', score: 2 },
      ],
      takeaway: 'Control plan failure is a sustainability problem, not a solution problem. The root cause is almost always one of: the process owner changed, the control plan was too complex to follow, monitoring was not embedded in daily work, or there was no consequence for non-compliance.',
    },
  },
  {
    levelId: null, orderIndex: 206, accessType: 'advanced', module: 'six_sigma',
    title: 'Tell Me About a Time You Used Data to Solve a Problem',
    description: 'Interview simulation — answer the data-driven problem solving question using the STAR framework with Six Sigma language.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you used data to identify and solve a problem. What was the problem, what data did you use, and what did you find?',
      context: 'This question tests your analytical thinking and your ability to let data drive decisions rather than assumptions. Interviewers want to see that you can collect, interpret, and act on data — not just describe a problem and jump to a solution.',
      guidance: 'Use the STAR framework. In the Action section, be specific about: what data you collected, how you collected it, what the data showed, and how it changed your understanding of the problem. If you used any Six Sigma or analytical tools (control charts, Pareto analysis, 5 Whys, fishbone diagram), name them.\n\nAim for 350-400 words. The data and the insight it produced should be the centrepiece of your answer.',
      starGuide: {
        situation: 'Describe the problem and why it mattered. Include a number if possible.',
        task: 'What were you trying to find out or solve?',
        action: 'Walk through your data collection and analysis. Be specific about tools and what the data revealed.',
        result: 'What changed as a result? Quantify the improvement.',
      },
      wordCountTarget: 375,
    },
  },
  {
    levelId: null, orderIndex: 207, accessType: 'advanced', module: 'six_sigma',
    title: 'Interpreting a Control Chart',
    description: 'A control chart for a call centre process shows several data points outside the control limits. Identify what this means and what action to take.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 10,
    content: {
      scenario: 'You are reviewing a control chart for average call handling time at a call centre. The process has been running stably for 6 months with an average of 4.2 minutes and control limits of 3.1 to 5.3 minutes. In the last 3 weeks, you notice: Week 1 — 3 consecutive points above 5.0 minutes. Week 2 — 1 point at 6.1 minutes (outside the upper control limit). Week 3 — 7 consecutive points all above the average of 4.2 minutes. What does this pattern indicate?',
      options: [
        { id: 'A', text: 'Normal process variation — control charts always show some fluctuation and this is within acceptable range', consequence: 'Incorrect. A point outside the control limits (6.1 minutes in Week 2) and 7 consecutive points above the average are both statistical signals that the process has changed. This is not normal variation.', score: 1 },
        { id: 'B', text: 'Special cause variation — the process has changed and the root cause needs to be investigated before taking action', consequence: 'Correct. Multiple signals (point outside control limits, run of 7 above average) indicate special cause variation — something has changed in the process. The correct response is to investigate the root cause, not adjust the process limits.', score: 4 },
        { id: 'C', text: 'The control limits need to be recalculated — the process has naturally evolved to a new baseline', consequence: 'Recalculating control limits without investigating the cause of the shift would embed the deterioration as the new normal. Investigate first.', score: 1 },
        { id: 'D', text: 'Common cause variation — increase the sample size to get a clearer picture', consequence: 'Increasing sample size is a measurement decision, not a response to a process signal. The signals are already clear — the process has changed.', score: 2 },
      ],
      takeaway: 'Control chart rules: a point outside control limits = special cause. 7+ consecutive points on one side of the average = special cause. Special cause variation requires investigation and root cause analysis — not adjustment of the control limits.',
    },
  },
  {
    levelId: null, orderIndex: 208, accessType: 'advanced', module: 'six_sigma',
    title: 'Tell Me How You Would Approach a Quality Problem',
    description: 'Interview simulation — answer the hypothetical quality improvement question using DMAIC as your framework.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'If you were asked to lead a project to reduce defects or errors in a process, how would you approach it?',
      context: 'This is a methodology question. The interviewer wants to see that you have a structured, repeatable approach to quality improvement — not just "I would look at the process and fix what\'s wrong."',
      guidance: 'Structure your answer around DMAIC:\n\nDefine — what is the problem? (data-driven problem statement, project charter, scope, CTQ)\nMeasure — how bad is it? (baseline data, measurement system validation, process capability)\nAnalyse — why is it happening? (root cause analysis, fishbone, 5 Whys, data analysis)\nImprove — what will fix it? (solution generation, pilot, implementation)\nControl — how do we keep it fixed? (control plan, standard work, monitoring)\n\nAim for 300-350 words. Use DMAIC terminology throughout.',
      starGuide: {
        situation: 'Acknowledge you would start by defining the problem properly — not jumping to solutions.',
        task: 'Your goal is to find and eliminate the root cause, not just treat the symptom.',
        action: 'Walk through each DMAIC phase with enough detail to show you understand what each involves.',
        result: 'Describe what a successful outcome looks like — measurable reduction in defects, sustained over time.',
      },
      wordCountTarget: 320,
    },
  },
  {
    levelId: null, orderIndex: 209, accessType: 'advanced', module: 'six_sigma',
    title: 'Write an Improve Phase Summary',
    description: 'Document the Improve phase of a Six Sigma project — solution selection, pilot results, and implementation plan.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are in the Improve phase of a Six Sigma project at a financial services company. Root cause analysis identified 3 root causes of the 8.3% application error rate:\n1. Inconsistent training — new staff receive 2 days of training, experienced staff received 5 days when they joined\n2. No real-time error detection — errors are only caught at the final quality check, 3 days after the error was made\n3. The application form has 4 fields that are ambiguous and regularly misinterpreted\n\nYour pilot ran for 6 weeks with 2 of the 3 solutions implemented. Results: error rate dropped from 8.3% to 2.1%.',
      fields: [
        { id: 'solutions_evaluated', label: 'Solutions Evaluated', placeholder: 'List the solutions you considered for each root cause. For each root cause, describe at least 2 options you evaluated and explain why you chose the one you did.' },
        { id: 'pilot_design', label: 'Pilot Design', placeholder: 'Describe how you designed the pilot. Which solutions were tested? Over what time period? With which team or process area? What were you measuring?' },
        { id: 'pilot_results', label: 'Pilot Results', placeholder: 'Summarise the pilot results. Error rate before and after. Which solutions had the most impact? Were there any unexpected findings?' },
        { id: 'full_implementation_plan', label: 'Full Implementation Plan', placeholder: 'Describe how you will roll out the improvements to the full process. Who does what, by when? What training is needed? What communication is required?' },
        { id: 'risk_mitigation', label: 'Implementation Risks and Mitigation', placeholder: 'List at least 3 risks in the implementation phase and how you will mitigate them.' },
        { id: 'expected_benefits', label: 'Expected Benefits at Full Scale', placeholder: 'Calculate the expected annual financial benefit if the 2.1% error rate is sustained at full scale. Show your working.' },
      ],
      scoringCriteria: 'AI checks: solutions clearly linked to specific root causes, pilot design is controlled (not just "we tried it"), results are quantified, implementation plan includes training and communication, financial benefit calculation is correct.',
    },
  },
  {
    levelId: null, orderIndex: 210, accessType: 'advanced', module: 'six_sigma',
    title: 'The Financial Services Defect Reduction Project (Full Project)',
    description: 'Lead a DMAIC project at a financial services company. Processing errors in new account opening are running at 6.8%. Industry benchmark: 1.5%.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 70,
    content: {
      projectSetup: {
        title: 'Financial Services Account Opening — Defect Reduction',
        context: 'You are Six Sigma Green Belt leading a DMAIC project at a financial services company. Processing errors in new account opening are running at 6.8% — well above the industry benchmark of 1.5%. Each error costs an average of £38 to fix. 2,400 accounts are opened per month. Sponsor: Head of Operations.',
        stakeholders: ['Head of Operations (Sponsor)', 'Account Opening Team Manager', 'Quality Assurance Team', 'IT Systems Team', 'Compliance Officer', 'Customer Service Team'],
        constraints: ['Regulatory compliance requirements cannot be reduced', 'No additional headcount available', 'IT system changes require 8-week lead time'],
      },
      stages: [
        {
          id: 1, title: 'Stage 1 — Define',
          description: 'Problem statement, project charter, SIPOC, Voice of Customer.',
          scenario: 'You are in the Define phase. You have gathered initial data. The Head of Operations wants to start with the solution: "Just add more quality checks." Your project charter is not yet signed off. What do you do?',
          options: [
            { id: 'A', text: 'Add the extra quality checks as requested — the sponsor knows the business', consequence: 'Implementing a solution before completing Define bypasses the DMAIC process. You have no data yet to know if extra quality checks will address the root cause.', score: 1 },
            { id: 'B', text: 'Complete the project charter and SIPOC first, then present the data to the sponsor before agreeing on any solutions', consequence: 'Correct. The Define phase must be completed before moving to solutions. The charter and SIPOC will give the sponsor a clearer picture of the problem and may change their view on the solution.', score: 4 },
            { id: 'C', text: 'Add the quality checks and run the DMAIC project in parallel', consequence: 'Running a solution in parallel with the DMAIC project contaminates your baseline data. You will not know whether any improvement is due to the extra checks or the DMAIC changes.', score: 1 },
            { id: 'D', text: 'Escalate to the sponsor\'s manager — the sponsor is undermining the Six Sigma process', consequence: 'Escalating over the sponsor\'s head at the Define stage is premature and will damage the relationship. Educate the sponsor on the DMAIC process first.', score: 1 },
          ],
          takeaway: 'Sponsors often want to jump to solutions. Your job as the Six Sigma practitioner is to hold the DMAIC process — politely but firmly. The Define phase exists to ensure you solve the right problem.',
        },
        {
          id: 2, title: 'Stage 2 — Measure',
          description: 'Data collection plan, process mapping, baseline capability, MSA.',
          scenario: 'Your data collection is complete. You have 6 weeks of error data. The baseline error rate is 6.8%. However, you discover that different team members classify errors differently — some count a missing signature as an error, others do not. What is your next step?',
          options: [
            { id: 'A', text: 'Use the data as collected — the overall 6.8% is still a valid baseline even if individual classifications vary', consequence: 'If the error definition is inconsistent, the 6.8% baseline is unreliable. You cannot improve what you cannot measure consistently.', score: 1 },
            { id: 'B', text: 'Conduct a Measurement System Analysis and establish a clear, agreed error definition before proceeding', consequence: 'Correct. MSA validates your measurement system. An agreed error definition is essential before the baseline can be trusted. This is the right call.', score: 4 },
            { id: 'C', text: 'Use only the data from the most consistent team member as your baseline', consequence: 'Cherry-picking data introduces bias and does not solve the underlying measurement inconsistency.', score: 1 },
            { id: 'D', text: 'Move to Analyse — the inconsistency in classification is itself a root cause to investigate', consequence: 'Measurement inconsistency is a measurement system problem, not a process problem. It must be resolved before analysis, not treated as a root cause.', score: 2 },
          ],
          takeaway: 'A reliable measurement system is the foundation of Six Sigma. If you cannot define and measure a defect consistently, you cannot improve it.',
        },
        {
          id: 3, title: 'Stage 3 — Analyse',
          description: 'Root cause analysis, fishbone diagram, 5 Whys, data analysis.',
          scenario: 'Your analysis is complete. You have identified 5 potential root causes. Your data shows that 73% of errors occur in the first 2 steps of the process (data entry and document verification) and that error rates are 3x higher for new staff (joined in the last 6 months) than for experienced staff. What does this tell you?',
          options: [
            { id: 'A', text: 'The problem is a training issue — focus all improvement efforts on new staff training', consequence: 'Training is likely a significant factor, but concluding it is the only root cause from this data alone is premature. The process steps themselves may also have issues.', score: 2 },
            { id: 'B', text: 'The data points to two likely root causes: inadequate onboarding training AND process design issues in steps 1 and 2. Both need to be investigated further.', consequence: 'Correct. The data suggests two distinct root cause areas. Good Six Sigma practice is to investigate both before selecting solutions.', score: 4 },
            { id: 'C', text: 'Replace all new staff with experienced staff — the data shows experience is the key variable', consequence: 'This is not a viable solution and misreads the data. The question is why new staff make more errors — that is the root cause to investigate.', score: 1 },
            { id: 'D', text: 'The first 2 process steps need to be automated — manual processes are inherently error-prone', consequence: 'Automation is a possible solution but jumping to it before understanding the root cause is a classic Six Sigma mistake. Automating a broken process just makes errors faster.', score: 2 },
          ],
          takeaway: 'Data rarely points to a single root cause. Good analysis identifies multiple contributing factors and investigates each before selecting solutions.',
        },
        {
          id: 4, title: 'Stage 4 — Improve',
          description: 'Solution generation, pilot, implementation.',
          scenario: 'Your pilot has run for 8 weeks. You implemented: a revised onboarding programme (3 weeks instead of 2 days), error prompts built into the data entry system, and a revised document checklist. Error rates dropped from 6.8% to 1.9%. The Head of Operations wants to roll out immediately. Your Quality Assurance team wants to run the pilot for another 4 weeks to validate the results. What do you recommend?',
          options: [
            { id: 'A', text: 'Roll out immediately — 8 weeks is sufficient evidence and the business benefit is clear', consequence: '8 weeks is a reasonable pilot period and 1.9% is well below the 1.5% benchmark target. The business case for rollout is strong. However, confirm the QA team\'s specific concern before deciding.', score: 3 },
            { id: 'B', text: 'Ask the QA team what specific risk they are concerned about — if they have a valid concern, extend the pilot; if not, proceed with rollout', consequence: 'Correct. The QA team may have a specific, valid concern (seasonal variation, a particular error type not yet tested) or they may be being overly cautious. Understanding their concern is the right first step.', score: 4 },
            { id: 'C', text: 'Extend the pilot by 4 weeks as requested — the QA team\'s caution is appropriate', consequence: 'Automatically deferring to the most cautious voice without understanding the specific concern is not good project management. The business is losing £38 per error for every week of delay.', score: 2 },
            { id: 'D', text: 'Escalate to the Head of Operations to override the QA team', consequence: 'Escalating over the QA team without first understanding their concern damages relationships and may miss a legitimate risk.', score: 1 },
          ],
          takeaway: 'Pilot extension decisions should be based on specific, identified risks — not general caution. Quantify the cost of delay against the risk of rolling out prematurely.',
        },
        {
          id: 5, title: 'Stage 5 — Control',
          description: 'Control plan, hand-off to process owner, benefits realisation.',
          scenario: 'The rollout is complete. Error rates are at 1.4% — below the 1.5% benchmark. You are preparing the Control phase. The Account Opening Team Manager (the process owner) says: "We\'ll keep an eye on it." You need to put a formal control plan in place. What must the control plan include?',
          options: [
            { id: 'A', text: 'A monthly error rate report sent to the Head of Operations', consequence: 'Monthly reporting is too infrequent to catch deterioration early. By the time a monthly report shows a problem, the process may have regressed significantly.', score: 2 },
            { id: 'B', text: 'A control chart updated weekly, clear response rules for when the process goes out of control, a named process owner, and a 6-month review date', consequence: 'Correct. A robust control plan includes: a monitoring mechanism (control chart), response rules (what to do when a signal appears), ownership (named person), and a scheduled review. This is the complete answer.', score: 4 },
            { id: 'C', text: 'The revised training materials and process documentation — if the process is documented, it will be followed', consequence: 'Documentation is necessary but not sufficient. Without monitoring, you will not know if the process is being followed or if it is drifting.', score: 2 },
            { id: 'D', text: 'A handover meeting with the process owner and then close the project', consequence: 'Closing the project without a formal control plan in place is the most common reason Six Sigma improvements revert. The control plan is not optional.', score: 1 },
          ],
          takeaway: 'A control plan must include: what to measure, how often, who is responsible, what the control limits are, and what action to take when a signal appears. "We\'ll keep an eye on it" is not a control plan.',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE C — PRINCE2 PRACTITIONER
  // ════════════════════════════════════════════════════════════
  {
    levelId: null, orderIndex: 301, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'Tailoring PRINCE2 for a Small Project',
    description: 'You\'ve been asked to run a small 8-week internal project. The organisation mandates PRINCE2. How do you tailor the framework appropriately?',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 10,
    content: {
      scenario: 'You have been asked to run a small internal project — redesigning the staff induction process. Duration: 8 weeks. Team: 2 people. Budget: £4,000. The organisation mandates PRINCE2. How do you approach the project?',
      options: [
        { id: 'A', text: 'Apply full PRINCE2 — all 7 processes, all management products — the organisation mandates it', consequence: 'Applying full PRINCE2 to an 8-week, 2-person project creates more documentation overhead than the project itself. PRINCE2 explicitly requires the framework to be tailored to the context.', score: 1 },
        { id: 'B', text: 'Tailor by combining the Project Board and Project Manager roles (your sponsor acts as informal board), use lightweight versions of key documents, and hold informal progress updates rather than formal stage gates', consequence: 'Correct tailoring — PRINCE2 explicitly requires the framework to be tailored to the context. A small project needs a light-touch approach that preserves governance without creating bureaucracy.', score: 4 },
        { id: 'C', text: 'Do not use PRINCE2 at all for something this small — it is overkill', consequence: 'Abandoning the framework entirely removes the governance that protects the project. Even a small project benefits from a clear business case, defined roles, and controlled change.', score: 2 },
        { id: 'D', text: 'Ask the PMO to tell you exactly what to do and follow their guidance', consequence: 'Deferring to the PMO is not wrong, but it shows no independent judgement — and the PMO answer will be "tailor it appropriately." You need to be able to make that judgement yourself.', score: 2 },
      ],
      takeaway: 'PRINCE2 Principle 7: Tailor to suit the project environment. The framework must be adapted to the size, complexity, and risk of the project. Applying full PRINCE2 to a small project is as wrong as not using it at all.',
    },
  },
  {
    levelId: null, orderIndex: 302, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'The Exception Report',
    description: 'During Stage 3, your cost estimate increases by £22,000 — pushing the project £18,000 above the stage cost tolerance. What do you do?',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 9,
    content: {
      scenario: 'You are PM on a PRINCE2 project. During Stage 3, your cost estimate increases by £22,000 — pushing the project £18,000 above the stage cost tolerance of +£10,000. Your Project Manager tolerance for the overall project has not been breached. You need to decide what to do.',
      options: [
        { id: 'A', text: 'Absorb the cost increase and do not report it — you are still within overall project tolerance', consequence: 'Stage tolerance is breached regardless of overall project position. Not reporting is a PRINCE2 governance failure. The Project Board has the right to know when a stage is in exception.', score: 1 },
        { id: 'B', text: 'Raise an Exception Report to the Project Board immediately, since the stage tolerance has been breached', consequence: 'Correct — stage tolerance breach triggers Exception Report to the Project Board. This is the PRINCE2 process. The Project Board then decides whether to request an Exception Plan.', score: 4 },
        { id: 'C', text: 'Raise an Issue Report and manage it through the change control process', consequence: 'An Issue Report is for general issues — a tolerance breach specifically triggers the exception process. The mechanism is different and more urgent.', score: 2 },
        { id: 'D', text: 'Request additional budget from the sponsor informally before raising anything formally', consequence: 'Informal budget discussions before formal reporting bypass the governance structure and undermine the Project Board\'s authority. The Exception Report must come first.', score: 1 },
      ],
      takeaway: 'PRINCE2 exception management: when a stage tolerance is forecast to be breached, the PM raises an Exception Report to the Project Board. The Board then decides whether to request an Exception Plan or close the project. This is non-negotiable governance.',
    },
  },
  {
    levelId: null, orderIndex: 303, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'Build a Product Description',
    description: 'Write a PRINCE2 Product Description for the key deliverable of a finance system implementation project.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 18,
    content: {
      projectBrief: 'You are PM on a PRINCE2 project to implement a new finance system for a medium-sized charity. The key deliverable is the "Configured Finance System" — the system as set up and ready for use by the finance team.\n\nProject context: 45 finance team users. Current system is 12 years old. New system must integrate with the existing payroll system and produce monthly management accounts in the required format.',
      fields: [
        { id: 'identifier', label: 'Product Identifier and Title', placeholder: 'Give the product a unique identifier (e.g., FIN-001) and a clear title.' },
        { id: 'purpose', label: 'Purpose', placeholder: 'Why does this product need to exist? What problem does it solve? What will it enable the organisation to do that it cannot do now?' },
        { id: 'composition', label: 'Composition (what the product consists of)', placeholder: 'List the components that make up this product. For a configured finance system, this might include: chart of accounts, user accounts and permissions, system integrations, report templates, etc.' },
        { id: 'derivation', label: 'Derivation (what it is based on)', placeholder: 'What inputs are needed to create this product? What existing documents, systems, or information will be used?' },
        { id: 'format', label: 'Format and Presentation', placeholder: 'How will the product be presented or delivered? What does "done" look like?' },
        { id: 'quality_criteria', label: 'Quality Criteria', placeholder: 'How will you know the product meets the required standard? List specific, measurable quality criteria. Example: "All 45 users can log in and access their role-appropriate functions."' },
        { id: 'quality_method', label: 'Quality Method', placeholder: 'How will quality be checked? Who will check it? What tests or reviews will be conducted?' },
        { id: 'quality_responsibilities', label: 'Quality Responsibilities', placeholder: 'Who is responsible for producing this product? Who is responsible for reviewing it? Who signs it off?' },
      ],
      scoringCriteria: 'AI checks: quality criteria are measurable (not vague), composition is specific to a finance system (not generic), quality method includes user acceptance testing, responsibilities identify both producer and reviewer.',
    },
  },
  {
    levelId: null, orderIndex: 304, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'The Project Board Who Won\'t Engage',
    description: 'Your Project Board members are not attending meetings, not reading highlight reports, and not making decisions. The project is stalling.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You are PM on a 9-month PRINCE2 project. You are 3 months in. The Project Board has missed 2 of 3 scheduled meetings. The Executive has not read the last 2 Highlight Reports. A key decision on supplier selection has been outstanding for 6 weeks. The project is stalling.',
      options: [
        { id: 'A', text: 'Make the supplier decision yourself and inform the Board — the project cannot wait', consequence: 'Making a decision that is outside your delegated authority is a PRINCE2 governance breach. The supplier selection is a Board-level decision. Making it unilaterally exposes you and the project.', score: 1 },
        { id: 'B', text: 'Request an urgent one-to-one meeting with the Executive, present the impact of the delayed decision in business terms, and agree a new decision-making process', consequence: 'Correct. The Executive is the most important Board member. A direct, business-focused conversation about the cost of delay is the right approach. Agree a simpler decision-making process that works for their schedule.', score: 4 },
        { id: 'C', text: 'Escalate to the Programme Manager or sponsor\'s manager — the Board is failing in its governance responsibilities', consequence: 'Escalating over the Executive\'s head before attempting direct resolution will damage the relationship and may not resolve the underlying issue (too busy, not enough information, unclear on their role).', score: 2 },
        { id: 'D', text: 'Reduce the frequency of Highlight Reports and Board meetings — they are clearly too burdensome', consequence: 'Reducing governance in response to disengagement removes the oversight that protects the project. The problem is engagement, not frequency.', score: 1 },
      ],
      takeaway: 'Project Board disengagement is a common PRINCE2 failure mode. The solution is almost always: simplify the information they receive, make the business impact of their decisions visible, and agree a decision-making process that fits their availability.',
    },
  },
  {
    levelId: null, orderIndex: 305, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'Managing Stage Boundaries',
    description: 'You are approaching the end of Stage 2. The Stage 3 plan is not ready. The Executive wants to proceed anyway.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 9,
    content: {
      scenario: 'You are PM on a PRINCE2 project. You are approaching the end of Stage 2. The Stage 3 plan is not ready — a key supplier has not confirmed their resource availability and you cannot finalise the plan without this information. The Executive wants to proceed to Stage 3 anyway to avoid losing momentum.',
      options: [
        { id: 'A', text: 'Proceed to Stage 3 as requested — the Executive has authority to make this decision', consequence: 'The Executive does have authority to authorise Stage 3, but you should not proceed without a plan. Proceeding without a Stage Plan removes the control mechanism that PRINCE2 is built on.', score: 2 },
        { id: 'B', text: 'Raise an issue with the Project Board, present the risk of proceeding without a complete Stage Plan, and propose a short extension to Stage 2 to allow the supplier to confirm', consequence: 'Correct. Raising the issue formally, presenting the risk, and proposing a solution (short extension) is the right PRINCE2 response. The Board can then make an informed decision.', score: 4 },
        { id: 'C', text: 'Create a Stage 3 plan with assumptions in place of the missing supplier information and flag the assumptions clearly', consequence: 'A plan built on unconfirmed assumptions is a risk, but it is better than no plan. This is an acceptable approach if the assumptions are clearly documented and the Board is aware. It is not the ideal answer but is defensible.', score: 3 },
        { id: 'D', text: 'Contact the supplier directly and give them 48 hours to confirm or you will proceed without them', consequence: 'Ultimatums to suppliers are a relationship risk and may not resolve the underlying issue. The problem should be escalated through the appropriate commercial channel, not managed with threats.', score: 1 },
      ],
      takeaway: 'Stage boundaries are PRINCE2 control points. Proceeding to a new stage without an authorised Stage Plan removes the management control that the framework is designed to provide. The correct response is to raise the issue formally and propose a solution.',
    },
  },
  {
    levelId: null, orderIndex: 306, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'Tell Me How You Apply PRINCE2 in Practice',
    description: 'Interview simulation — answer the PRINCE2 application question with a real example.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a project where you applied PRINCE2. How did you use the framework and what difference did it make?',
      context: 'This question tests whether you can apply PRINCE2 in practice, not just recite the theory. Interviewers want to see that you understand when and how to tailor the framework, not just that you know what the 7 principles are.',
      guidance: 'Use the STAR framework. In the Action section, be specific about which PRINCE2 elements you used: business case management, stage planning, exception management, change control, risk management, or quality management. Explain how you tailored the framework to the project context. Avoid listing PRINCE2 elements without connecting them to real decisions you made.\n\nAim for 350-400 words.',
      starGuide: {
        situation: 'Describe the project — size, complexity, organisation type.',
        task: 'What were you trying to achieve and what governance challenges did you face?',
        action: 'Walk through specific PRINCE2 tools or processes you used and the decisions they supported.',
        result: 'What was the outcome? Did the governance add value? What would have gone differently without it?',
      },
      wordCountTarget: 375,
    },
  },
  {
    levelId: null, orderIndex: 307, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'Write an Exception Plan',
    description: 'A key supplier has gone into administration during Stage 3. The Stage Plan cannot be delivered as written. Build the Exception Plan.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are PM on a PRINCE2 project to implement a new finance system. The project is in Stage 3 of 5. A key supplier — responsible for system configuration and data migration — has gone into administration. The Stage Plan cannot be delivered as written. The Project Board has asked you to prepare an Exception Plan.\n\nProject context: 6-month project, £180,000 budget. Stage 3 was planned to last 8 weeks at a cost of £42,000. You are 3 weeks into Stage 3. The supplier has completed 40% of the configuration work.',
      fields: [
        { id: 'cause', label: 'Cause of the Exception', placeholder: 'Describe what happened and why it has caused the stage plan to be undeliverable. Be specific about the impact on the current stage.' },
        { id: 'impact', label: 'Impact Assessment', placeholder: 'Assess the impact on all 6 PRINCE2 tolerances: Time, Cost, Quality, Scope, Risk, Benefits. For each, describe the current position and the forecast if no action is taken.' },
        { id: 'options', label: 'Options Considered (at least 3, including abandonment)', placeholder: 'List at least 3 options for how to proceed. Option 1 must include project abandonment. For each option: describe the approach, the cost, the time impact, and the risks.' },
        { id: 'recommendation', label: 'Recommended Option with Justification', placeholder: 'State your recommended option and explain why it is the best choice. Reference the impact assessment and the options analysis. Be specific about the trade-offs.' },
        { id: 'revised_stage_plan', label: 'Revised Stage Plan Summary', placeholder: 'Summarise the revised Stage 3 plan under your recommended option. Include: key milestones, revised cost estimate, revised timeline, and key assumptions.' },
        { id: 'risk_register', label: 'Updated Risk Register Entry', placeholder: 'Write a new risk register entry for the current situation. Include: risk description, probability, impact, risk owner, and response actions.' },
        { id: 'lessons', label: 'Lessons to Capture', placeholder: 'What lessons should be captured from this exception? What could have been done differently in supplier selection, contracting, or risk management to prevent or mitigate this situation?' },
      ],
      scoringCriteria: 'AI checks: all options include abandonment, impact covers all 6 tolerances, recommended option is clearly justified with evidence, revised plan is realistic given the constraints, risk register entry is complete.',
    },
  },
  {
    levelId: null, orderIndex: 308, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'The Abandoned Business Case',
    description: 'Halfway through the project, the original business case no longer stacks up. The benefits have been significantly reduced. What do you do?',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You are PM on a PRINCE2 project to implement a new CRM system. The original business case projected £240,000 in annual efficiency savings. You are 4 months into a 9-month project. A new analysis has shown that the savings will be £85,000 — 35% of the original projection. The project has spent £95,000 of the £160,000 budget. The sponsor wants to continue.',
      options: [
        { id: 'A', text: 'Continue as planned — the sponsor has made the decision and you should respect it', consequence: 'The sponsor\'s preference is not sufficient justification to continue a project whose business case has fundamentally changed. PRINCE2 requires the business case to be viable throughout the project lifecycle.', score: 1 },
        { id: 'B', text: 'Update the Business Case with the revised figures, present it to the Project Board, and let the Board decide whether to continue, re-scope, or close the project', consequence: 'Correct. PRINCE2 Principle 2 requires the business case to be maintained and remain viable throughout the project. The Board must make an informed decision based on the updated figures.', score: 4 },
        { id: 'C', text: 'Re-scope the project to reduce the remaining cost and see if the revised business case can be made to work', consequence: 'Re-scoping is a possible option, but it should be presented to the Project Board as one of several options — not decided unilaterally by the PM.', score: 2 },
        { id: 'D', text: 'Recommend immediate project closure — a project that will only deliver 35% of its projected benefits is not worth completing', consequence: 'Closure may be the right answer, but it is the Board\'s decision, not the PM\'s. Present the updated business case and let the Board decide.', score: 2 },
      ],
      takeaway: 'PRINCE2 Principle 2: Continued business justification. The business case must remain viable throughout the project. When it no longer does, the PM\'s job is to present the updated position to the Project Board and let them decide — not to continue regardless or close unilaterally.',
    },
  },
  {
    levelId: null, orderIndex: 309, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'PRINCE2 Practitioner Exam Question Practice',
    description: 'Work through a series of scenario-based PRINCE2 Practitioner exam-style questions.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 20,
    content: {
      question: 'You are preparing for the PRINCE2 Practitioner exam. The exam presents a project scenario and asks you to apply PRINCE2 principles, themes, and processes to real situations. Answer the following question as you would in the exam:\n\nA project is in Stage 2. The Project Manager has identified that the project will exceed the time tolerance for Stage 2 by 3 weeks. The Project Manager has not yet informed the Project Board. Which PRINCE2 process should the Project Manager follow, and what document should be produced?',
      context: 'PRINCE2 Practitioner exam questions test your ability to apply the framework to scenarios — not just recall definitions. The key is to identify the correct process, the correct management product, and the correct escalation path.',
      guidance: 'Structure your answer as follows:\n1. Identify the situation (what PRINCE2 event has occurred)\n2. Name the correct process (which of the 7 PRINCE2 processes applies)\n3. Name the correct management product (what document must be produced)\n4. Describe the escalation path (who receives the document and what happens next)\n5. Explain what should NOT happen (common mistakes in this scenario)\n\nAim for 250-300 words. Use precise PRINCE2 terminology.',
      starGuide: {
        situation: 'Identify the PRINCE2 event: tolerance is forecast to be breached.',
        task: 'Apply the correct PRINCE2 process and produce the correct management product.',
        action: 'Name the process, the document, and the escalation path with precision.',
        result: 'Explain what the Project Board does next and what options they have.',
      },
      wordCountTarget: 275,
    },
  },
  {
    levelId: null, orderIndex: 310, accessType: 'advanced', module: 'prince2_practitioner',
    title: 'The Government IT Programme (Full Project)',
    description: 'You are PM on a government IT programme. 9-month project, £2.1 million budget. Mandatory PRINCE2. Multiple stakeholder groups with conflicting priorities.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 70,
    content: {
      projectSetup: {
        title: 'Government Digital Services Platform',
        context: 'You are PM on a government project to replace a 15-year-old citizen-facing digital services platform. Duration: 9 months. Budget: £2.1 million. Mandatory PRINCE2. The platform serves 180,000 citizens per month. Stakeholders include: Cabinet Office (sponsor), 4 government departments (users), IT supplier, Citizens Advice (external stakeholder), and the existing IT team who will be made redundant when the new platform goes live.',
        stakeholders: ['Cabinet Office Director (Executive)', 'Head of Digital (Senior User)', 'IT Supplier Director (Senior Supplier)', '4 Department Heads', 'Citizens Advice Representative', 'Existing IT Team (12 staff, at risk of redundancy)'],
        constraints: ['Go-live cannot be delayed beyond Month 9 — tied to ministerial announcement', 'Existing platform cannot be taken offline during transition', 'All data must remain on UK servers (data sovereignty requirement)'],
      },
      stages: [
        {
          id: 1, title: 'Stage 1 — Initiation',
          description: 'Project Initiation Document, Business Case, risk register, stakeholder engagement plan.',
          scenario: 'You are preparing the Project Initiation Document. The Cabinet Office Director (Executive) tells you the business case is "obvious" and does not need to be written up formally. The supplier is ready to start work immediately. What do you do?',
          options: [
            { id: 'A', text: 'Start Stage 2 immediately — the Executive has authorised it and the supplier is ready', consequence: 'Starting work without a completed PID removes the governance foundation of the project. There is no agreed scope, no risk register, no tolerances. This is a governance failure.', score: 1 },
            { id: 'B', text: 'Explain to the Executive that a documented Business Case is a PRINCE2 requirement and a governance protection for them — it defines what success looks like and protects the project from scope creep', consequence: 'Correct. The Business Case is not bureaucracy — it is the document that defines why the project exists and what it must deliver. Without it, there is no agreed definition of success and no basis for decision-making.', score: 4 },
            { id: 'C', text: 'Write a brief one-page Business Case summary and proceed — something is better than nothing', consequence: 'A one-page summary is better than nothing, but it must still cover the key elements: reasons, options, expected benefits, risks, costs, and timeline. If it does, this is an acceptable tailored approach.', score: 3 },
            { id: 'D', text: 'Ask the supplier to write the Business Case — they know the technical solution best', consequence: 'The supplier writing the Business Case is a conflict of interest. The Business Case must be written by the project team and owned by the Executive.', score: 1 },
          ],
          takeaway: 'The Business Case is the most important PRINCE2 document. It defines why the project exists, what it must deliver, and what success looks like. Without it, there is no basis for any project decision.',
        },
        {
          id: 2, title: 'Stage 2 — Design and Procurement',
          description: 'Requirements, supplier management, risk management.',
          scenario: 'The supplier has submitted their technical design. The IT team from the 4 departments have reviewed it and have 47 change requests — many of which are "nice to have" additions that were not in the original requirements. The supplier says implementing all 47 changes will add £380,000 and 6 weeks to the project. What do you do?',
          options: [
            { id: 'A', text: 'Reject all 47 change requests — the project must deliver to the original specification', consequence: 'Blanket rejection of all change requests without assessment is poor change control. Some of the 47 may be genuine requirements that were missed. Each must be assessed on its merits.', score: 2 },
            { id: 'B', text: 'Implement all 47 changes — the departments are the users and their requirements must be met', consequence: 'Implementing all changes without assessing impact adds £380,000 and 6 weeks to the project. This is scope creep and a governance failure.', score: 1 },
            { id: 'C', text: 'Apply the change control process: assess each of the 47 requests against the original requirements, classify as must-have, should-have, or nice-to-have, and present a prioritised recommendation to the Project Board', consequence: 'Correct. Change control requires each request to be assessed, classified, and presented to the appropriate decision-maker. The Board decides which changes to approve based on the impact assessment.', score: 4 },
            { id: 'D', text: 'Negotiate with the supplier to implement the 47 changes at no additional cost — they should have anticipated these requirements', consequence: 'Negotiating to absorb changes at no cost is unrealistic if the changes are genuinely additional to the agreed specification. This will damage the supplier relationship.', score: 1 },
          ],
          takeaway: 'Change control is one of the most important PRINCE2 themes. Every change request must be assessed for impact on time, cost, quality, scope, risk, and benefits before a decision is made.',
        },
        {
          id: 3, title: 'Stage 3 — Build and Test',
          description: 'Quality management, issue management, team management.',
          scenario: 'User acceptance testing has revealed 23 defects. 8 are critical (the platform cannot go live with these), 11 are significant (would cause problems but not prevent go-live), and 4 are minor. The supplier says fixing all 23 will take 6 weeks. Go-live is in 5 weeks. What do you recommend to the Project Board?',
          options: [
            { id: 'A', text: 'Delay go-live by 6 weeks to fix all 23 defects — quality cannot be compromised', consequence: 'Delaying go-live by 6 weeks will breach the ministerial announcement deadline. This is a significant constraint that must be factored into the recommendation.', score: 2 },
            { id: 'B', text: 'Go live on schedule — 180,000 citizens depend on the service and the 8 critical defects can be fixed in a post-go-live patch', consequence: 'Going live with 8 critical defects is a significant quality and reputational risk. "Critical" means the platform cannot function correctly — this is not acceptable.', score: 1 },
            { id: 'C', text: 'Present the Project Board with a risk-based recommendation: fix all 8 critical defects before go-live (3 weeks), go live on schedule, and fix the remaining 15 in a post-go-live patch within 4 weeks', consequence: 'Correct. A risk-based approach that fixes critical defects before go-live and manages the remaining defects through a controlled post-go-live patch is the right balance between quality and the ministerial deadline.', score: 4 },
            { id: 'D', text: 'Ask the supplier to work nights and weekends to fix all 23 defects in 5 weeks', consequence: 'Asking the supplier to work overtime may be part of the solution, but it is not a governance decision — it is an operational one. The Project Board needs to make the strategic decision first.', score: 2 },
          ],
          takeaway: 'Quality management in PRINCE2 requires a risk-based approach. Critical defects that prevent the product from functioning must be fixed before go-live. Significant and minor defects can be managed through a controlled post-go-live process.',
        },
        {
          id: 4, title: 'Stage 4 — Transition',
          description: 'Transition planning, stakeholder management, redundancy management.',
          scenario: 'The existing IT team (12 staff who will be made redundant when the new platform goes live) have been cooperating with the project. Two weeks before go-live, you discover they have been withholding critical system documentation that is needed for the handover. When confronted, they say they were not told they would lose their jobs until last week. What do you do?',
          options: [
            { id: 'A', text: 'Escalate to HR and the Cabinet Office Director — this is a disciplinary matter', consequence: 'Escalating to HR before understanding the situation may be premature. The team\'s behaviour is understandable given the late communication about redundancy. A disciplinary approach will make the situation worse.', score: 1 },
            { id: 'B', text: 'Meet with the IT team, acknowledge the failure to communicate the redundancy situation properly, understand what documentation is missing, and negotiate a handover agreement — potentially including a retention bonus for cooperation', consequence: 'Correct. The root cause is a communication failure by the organisation, not malicious behaviour by the IT team. Acknowledging this, understanding the gap, and negotiating a solution is the right approach.', score: 4 },
            { id: 'C', text: 'Proceed without the documentation — the supplier should be able to reconstruct what is needed', consequence: 'Proceeding without critical system documentation creates a significant operational risk. The documentation gap must be addressed before go-live.', score: 1 },
            { id: 'D', text: 'Delay go-live until the documentation issue is resolved', consequence: 'Delay may be necessary if the documentation cannot be obtained quickly, but it should be a last resort given the ministerial deadline. Attempt negotiation first.', score: 2 },
          ],
          takeaway: 'People issues are often the biggest risk in technology projects. The IT team\'s behaviour was a predictable consequence of poor communication about redundancy. Stakeholder management must include people who are negatively affected by the project, not just those who benefit.',
        },
        {
          id: 5, title: 'Stage 5 — Closure',
          description: 'End Project Report, lessons learned, benefits handover.',
          scenario: 'The platform has gone live. The ministerial announcement has been made. The Cabinet Office Director wants to close the project immediately. You have not yet completed the End Project Report, the lessons learned log, or the benefits handover to the operational team. What do you do?',
          options: [
            { id: 'A', text: 'Close the project as requested — the Executive has authority to close the project', consequence: 'The Executive does have authority to close the project, but closing without completing the closure activities means lessons are lost, benefits are not tracked, and the operational team has no handover documentation.', score: 2 },
            { id: 'B', text: 'Explain to the Executive that the closure activities are a governance requirement and will take 2 weeks — the lessons and benefits handover are critical for the organisation\'s future projects', consequence: 'Correct. Closure activities are not optional. The End Project Report, lessons learned, and benefits handover are PRINCE2 requirements that protect the organisation\'s investment. Two weeks is a reasonable ask.', score: 4 },
            { id: 'C', text: 'Complete the closure activities yourself without involving the team — it will be quicker', consequence: 'Closure activities completed without team input will miss important lessons and produce a superficial End Project Report. The team\'s perspective is essential.', score: 2 },
            { id: 'D', text: 'Skip the End Project Report and lessons learned — just complete the benefits handover', consequence: 'Skipping the End Project Report and lessons learned means the organisation cannot learn from this project. Given the complexity and the issues encountered, the lessons are particularly valuable.', score: 2 },
          ],
          takeaway: 'PRINCE2 Closing a Project process: the End Project Report, lessons learned, and benefits handover are not optional. They are the mechanism by which the organisation learns from the project and ensures the investment delivers its intended value.',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE D — MSP
  // ════════════════════════════════════════════════════════════
  {
    levelId: null, orderIndex: 401, accessType: 'advanced', module: 'msp',
    title: 'The Programme That Lost Its Vision',
    description: 'You are Programme Manager 18 months into a 3-year transformation. The Programme Board cannot articulate what the programme is achieving overall.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You are Programme Manager on a large transformation programme — 6 related projects over 3 years. You are 18 months in. The Programme Board has just reviewed the original Vision Statement and Blueprint. Three of the six projects are delivering outputs but the Board is struggling to articulate what the programme is actually achieving overall. Nobody can clearly explain the "to be" state anymore.',
      options: [
        { id: 'A', text: 'This is normal — programmes evolve and the original vision always gets diluted over time', consequence: 'Accepting vision drift normalises a loss of strategic direction. The programme will deliver outputs that do not add up to transformation. The whole point of MSP is to maintain strategic coherence.', score: 1 },
        { id: 'B', text: 'Call a programme pause, reconvene the Programme Board, and revalidate the Vision Statement against the current reality before proceeding', consequence: 'MSP specifically requires the vision and blueprint to be actively maintained. A revalidation workshop is exactly right. The pause is justified — proceeding without a shared vision will waste the remaining investment.', score: 4 },
        { id: 'C', text: 'Ask each Project Manager to write their own vision statement for their workstream', consequence: 'Individual project visions fragment the programme. MSP is about one shared vision that all projects contribute to. Multiple visions will pull the programme in different directions.', score: 1 },
        { id: 'D', text: 'Commission an independent review and wait for the findings before doing anything', consequence: 'An independent review is appropriate for governance failures, not a proactive programme management tool. By the time the review reports, more investment will have been made without strategic direction.', score: 2 },
      ],
      takeaway: 'MSP Vision Statement and Blueprint must be actively maintained throughout the programme. When the Board cannot articulate the "to be" state, the programme has lost its strategic anchor. A revalidation workshop is not a sign of failure — it is good programme governance.',
    },
  },
  {
    levelId: null, orderIndex: 402, accessType: 'advanced', module: 'msp',
    title: 'Benefits Are Not Being Realised',
    description: 'The programme has delivered all its outputs. 12 months later, the expected benefits have not materialised. What went wrong and what do you do?',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'Your programme delivered all its planned outputs on time and within budget. 12 months after programme closure, the annual benefits review shows that only 30% of the projected £3.2 million annual savings have been realised. The operational teams say they are still using the old processes alongside the new ones. What went wrong and what do you do now?',
      options: [
        { id: 'A', text: 'The programme was successful — it delivered all its outputs. Benefits realisation is an operational responsibility, not a programme responsibility.', consequence: 'This is the most common MSP failure mode. Delivering outputs is not the same as realising benefits. The programme should have had a Benefits Realisation Plan and a transition to operations strategy.', score: 1 },
        { id: 'B', text: 'Investigate why old processes are still being used alongside new ones, identify the specific barriers to adoption, and work with operational managers to address them', consequence: 'Correct. The root cause is almost certainly a change management failure — the outputs were delivered but the people change was not managed. Investigating and addressing the adoption barriers is the right response.', score: 4 },
        { id: 'C', text: 'Reopen the programme to implement the missing change management activities', consequence: 'Reopening a closed programme is unusual and expensive. The better approach is to work with the operational teams directly to address the adoption barriers — this does not require a formal programme.', score: 2 },
        { id: 'D', text: 'Revise the benefits projections downward to reflect the actual realisation rate', consequence: 'Revising projections downward without addressing the root cause accepts the failure. The benefits are still achievable — the adoption barriers need to be removed.', score: 1 },
      ],
      takeaway: 'MSP Benefits Realisation Management: delivering outputs is not the same as realising benefits. Benefits are realised when people change their behaviour and use the new capabilities. Change management and transition to operations are as important as delivery.',
    },
  },
  {
    levelId: null, orderIndex: 403, accessType: 'advanced', module: 'msp',
    title: 'Write a Benefits Realisation Plan',
    description: 'Build a Benefits Realisation Plan for a workforce transformation programme at a large local council.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are Programme Manager for a workforce transformation programme at a large local council. The programme includes 4 projects: new HR system, flexible working policy, leadership development programme, and office consolidation.\n\nExpected benefits: £2.1 million per year savings by Year 3. 15% improvement in staff retention. 20% reduction in sickness absence. Improved staff engagement scores (baseline: 58%, target: 72%).',
      fields: [
        { id: 'outcome_statement', label: 'Programme Outcome Statement', placeholder: 'Write a clear statement of what the programme will achieve — not what it will deliver. Focus on the change in organisational capability and the business outcomes.' },
        { id: 'benefits_map', label: 'Benefits Map', placeholder: 'Show how each of the 4 projects contributes to each of the 4 benefits. Create a simple table: projects as columns, benefits as rows. Explain the connection for each cell.' },
        { id: 'benefit_profiles', label: 'Benefit Profiles (for 3 key benefits)', placeholder: 'For each of 3 key benefits, complete a profile: Benefit name, Description, Measure (how it will be quantified), Baseline (current value), Target (expected value), Realisation date, Benefit owner (named individual, not the Programme Manager).' },
        { id: 'pre_transition', label: 'Pre-Transition Benefits', placeholder: 'Which benefits can be measured before the programme ends? List them with expected realisation dates and measurement methods.' },
        { id: 'post_transition', label: 'Post-Transition Benefits', placeholder: 'Which benefits will only be measurable after the programme has closed and operations have stabilised? List them with expected realisation dates.' },
        { id: 'dis_benefits', label: 'Dis-Benefits', placeholder: 'What negative effects might occur as a result of the programme? List at least 3 dis-benefits (e.g., disruption during transition, resistance from staff, short-term productivity dip) and how they will be managed.' },
        { id: 'reporting', label: 'Benefits Reporting Schedule', placeholder: 'Define when and how benefits will be measured and reported. Include: measurement frequency, reporting format, who receives the reports, and the review process.' },
      ],
      scoringCriteria: 'AI checks: benefits are measurable with specific metrics, benefit owners are named individuals (not the Programme Manager), dis-benefits are acknowledged and managed, baseline data is specified, post-transition benefits have realistic realisation dates.',
    },
  },
  {
    levelId: null, orderIndex: 404, accessType: 'advanced', module: 'msp',
    title: 'Managing Interdependencies Between Projects',
    description: 'Two projects in your programme have a critical dependency. One is running 3 weeks late. The other cannot start until the first is complete.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'You are Programme Manager on a transformation programme with 5 projects. Project B cannot start its testing phase until Project A delivers a completed data migration. Project A is now running 3 weeks late due to a supplier issue. Project B has a fixed go-live date that cannot move. What do you do?',
      options: [
        { id: 'A', text: 'Tell Project B to wait — the dependency is clear and there is nothing that can be done', consequence: 'Accepting the delay without exploring options is passive programme management. The Programme Manager\'s role is to actively manage interdependencies, not just observe them.', score: 1 },
        { id: 'B', text: 'Explore whether Project B can start testing with a partial data migration, identify what the minimum viable input from Project A is, and work with both PMs to find a solution', consequence: 'Correct. The Programme Manager\'s role is to actively manage interdependencies. Exploring whether the dependency can be partially satisfied is the right first step.', score: 4 },
        { id: 'C', text: 'Move resources from Project A to Project B to protect the go-live date', consequence: 'Moving resources from the late project to the dependent project will make Project A even later and may not solve the testing problem if the data migration is genuinely incomplete.', score: 1 },
        { id: 'D', text: 'Escalate to the Programme Board and ask them to decide', consequence: 'Escalating to the Board before exploring solutions with the Project Managers is premature. The Board should be informed, but the Programme Manager should come with options, not just a problem.', score: 2 },
      ],
      takeaway: 'Managing interdependencies is one of the most important MSP responsibilities. The Programme Manager must actively explore whether dependencies can be partially satisfied, sequenced differently, or mitigated — not just accept the impact.',
    },
  },
  {
    levelId: null, orderIndex: 405, accessType: 'advanced', module: 'msp',
    title: 'The Tranche That Should Be Stopped',
    description: 'At the end of Tranche 2, the business case has changed significantly. The remaining tranches will cost more and deliver less. Should you continue?',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You are Programme Manager. At the end of Tranche 2 (of 4), a strategic review has changed the organisation\'s priorities. The remaining 2 tranches will cost £1.8 million and deliver benefits that are now valued at £900,000 — less than the cost. The original business case projected £3.2 million in benefits from the full programme. The organisation has already spent £2.1 million on Tranches 1 and 2.',
      options: [
        { id: 'A', text: 'Continue — the organisation has already invested £2.1 million and stopping now would waste that investment', consequence: 'This is the sunk cost fallacy. The £2.1 million already spent cannot be recovered regardless of what happens next. The decision should be based on whether the remaining investment (£1.8m) will deliver sufficient value (£900k) — which it will not.', score: 1 },
        { id: 'B', text: 'Present the updated business case to the Programme Board with a recommendation to close the programme at the end of Tranche 2, capturing the benefits already delivered', consequence: 'Correct. MSP requires the business case to be reviewed at each tranche boundary. When the remaining investment no longer delivers sufficient value, the Programme Board must make an informed decision — and the right recommendation is to close.', score: 4 },
        { id: 'C', text: 'Reduce the scope of Tranches 3 and 4 to bring costs below the revised benefit value', consequence: 'Re-scoping is worth exploring, but only if it can make the remaining investment viable. Present this as one option to the Programme Board alongside the closure option.', score: 3 },
        { id: 'D', text: 'Continue with Tranche 3 only and reassess at the next tranche boundary', consequence: 'Continuing with Tranche 3 without a clear business case for doing so is poor programme governance. The tranche boundary is the right point to make the stop/continue decision.', score: 2 },
      ],
      takeaway: 'MSP tranche boundaries are decision points. The Programme Board must review the business case at each boundary and make an active decision to continue, re-scope, or close. Continuing because of sunk costs is the most expensive mistake in programme management.',
    },
  },
  {
    levelId: null, orderIndex: 406, accessType: 'advanced', module: 'msp',
    title: 'Tell Me About Managing a Programme vs a Project',
    description: 'Interview simulation — explain the difference between project and programme management with a real example.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'What is the difference between managing a project and managing a programme? Can you give me an example of when you have worked at programme level?',
      context: 'This question tests whether you understand the strategic level of programme management — not just that you can manage multiple projects simultaneously. Interviewers want to see that you understand benefits realisation, strategic alignment, and the governance differences between projects and programmes.',
      guidance: 'Key distinctions to cover:\n- Projects deliver outputs; programmes deliver outcomes and benefits\n- Projects have a defined end; programmes manage ongoing change\n- Programme Managers manage interdependencies between projects, not just individual project delivery\n- Programme governance (Programme Board, Business Change Manager, Benefits Realisation) is different from project governance\n- MSP Blueprint and Vision Statement are programme-level tools with no direct project equivalent\n\nAim for 350-400 words. Use a real or realistic example to illustrate the distinction.',
      starGuide: {
        situation: 'Describe a programme context — multiple related projects, strategic objective, transformation goal.',
        task: 'What were you responsible for at programme level?',
        action: 'Describe specific programme management activities: benefits tracking, interdependency management, tranche planning, stakeholder engagement strategy.',
        result: 'What was the strategic outcome? What benefits were realised?',
      },
      wordCountTarget: 375,
    },
  },
  {
    levelId: null, orderIndex: 407, accessType: 'advanced', module: 'msp',
    title: 'Build a Programme Blueprint Summary',
    description: 'Create a Programme Blueprint summary for an NHS digital transformation programme.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 25,
    content: {
      projectBrief: 'You are Programme Manager for an NHS digital transformation programme. The programme will transform how the Trust manages patient records, appointments, and clinical communications over 3 years. Current state: paper-based records, manual appointment booking, no digital communication with patients. Target state: fully digital patient record, online appointment booking, digital patient communications, real-time clinical data sharing between departments.',
      fields: [
        { id: 'vision_statement', label: 'Vision Statement', placeholder: 'Write a compelling, clear Vision Statement for the programme. It should describe the "to be" state in terms that non-technical stakeholders can understand and be inspired by. Maximum 150 words.' },
        { id: 'current_state', label: 'Current State (As-Is)', placeholder: 'Describe the current state across 4 dimensions: People (roles, skills, culture), Processes (how work is currently done), Technology (current systems), and Information (how data is currently managed).' },
        { id: 'future_state', label: 'Future State (To-Be)', placeholder: 'Describe the target state across the same 4 dimensions: People, Processes, Technology, and Information. Be specific about what will be different.' },
        { id: 'transition', label: 'Transition Approach', placeholder: 'How will the organisation move from current state to future state? Describe the tranches (phases) of the programme and what each tranche will deliver in terms of capability change.' },
        { id: 'benefits', label: 'Benefits (linked to future state)', placeholder: 'List at least 5 benefits that will be realised when the future state is achieved. For each: name, description, measure, and expected realisation date.' },
        { id: 'risks', label: 'Key Programme Risks', placeholder: 'List at least 4 programme-level risks (not project-level risks). Programme risks are those that threaten the overall strategic objective, not just individual project delivery.' },
      ],
      scoringCriteria: 'AI checks: vision statement is inspiring and non-technical, current and future state cover all 4 dimensions, benefits are linked to specific future state elements, programme risks are strategic (not operational), transition approach describes capability change not just project delivery.',
    },
  },
  {
    levelId: null, orderIndex: 408, accessType: 'advanced', module: 'msp',
    title: 'Tell Me About Delivering Transformational Change',
    description: 'Interview simulation — answer the transformational change question with a programme-level perspective.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you delivered or contributed to a significant organisational change. What was the change, what was your role, and what did you learn about leading transformation?',
      context: 'This question tests your ability to think and operate at a strategic level. Interviewers want to see that you understand the human and organisational dimensions of change — not just the project delivery mechanics.',
      guidance: 'Use the STAR framework. Focus on: the scale and complexity of the change, the stakeholder landscape (who was affected, who was resistant, who was the sponsor), the change management approach you used, and what you learned about what makes transformation succeed or fail.\n\nAim for 400-450 words. The reflection on what you learned is as important as the story itself.',
      starGuide: {
        situation: 'Describe the transformation — scale, context, why it was needed.',
        task: 'What was your specific role? What were you responsible for?',
        action: 'Walk through the key decisions and actions. Focus on the people and governance dimensions, not just the delivery.',
        result: 'What was achieved? What did you learn about leading transformation that you would apply differently next time?',
      },
      wordCountTarget: 425,
    },
  },
  {
    levelId: null, orderIndex: 409, accessType: 'advanced', module: 'msp',
    title: 'The Stakeholder Who Owns the Benefits',
    description: 'The Business Change Manager responsible for benefits realisation has left the organisation. Nobody has been appointed to replace them. Benefits are at risk.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'You are Programme Manager. The Business Change Manager (BCM) — the person responsible for benefits realisation in the operational business — has resigned and left the organisation. No replacement has been appointed. The programme is 6 months from completion. The BCM was the named owner of 4 of the 6 programme benefits. What do you do?',
      options: [
        { id: 'A', text: 'Take on the BCM responsibilities yourself — you know the programme best', consequence: 'The Programme Manager taking on BCM responsibilities creates a conflict of interest and removes the separation between programme delivery and benefits ownership. The BCM must be someone in the operational business.', score: 1 },
        { id: 'B', text: 'Escalate to the Programme Board immediately — the BCM role is a governance requirement and the Board must appoint a replacement', consequence: 'Correct. The BCM is a critical MSP role. The Programme Board must appoint a replacement from the operational business. This is an urgent governance issue that cannot wait.', score: 4 },
        { id: 'C', text: 'Reassign the benefits to the Programme Board members — they have the authority to own them', consequence: 'Programme Board members are governance roles, not operational roles. Benefits must be owned by people in the operational business who will be responsible for realising them after the programme closes.', score: 2 },
        { id: 'D', text: 'Continue without a BCM — the benefits are well-documented and the programme team can track them', consequence: 'Benefits tracking without an operational owner means nobody is accountable for realising them after programme closure. The BCM role is not optional in MSP.', score: 1 },
      ],
      takeaway: 'The Business Change Manager is one of the most important MSP roles. They represent the operational business and are responsible for benefits realisation — both during the programme and after it closes. Without a BCM, benefits are at serious risk.',
    },
  },
  {
    levelId: null, orderIndex: 410, accessType: 'advanced', module: 'msp',
    title: 'The NHS Digital Transformation Programme (Full Project)',
    description: 'Programme Manager for an 18-month NHS digital transformation. 4 clinical directorates, 1,200 staff, new operating model.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 75,
    content: {
      projectSetup: {
        title: 'NHS Community Trust — Digital Transformation Programme',
        context: 'You are Programme Manager for an 18-month digital transformation programme at an NHS Community Trust. The programme will implement a new patient record system, redesign clinical workflows, and introduce digital patient communications across 4 clinical directorates. 1,200 staff affected. Sponsor: Chief Executive. Business Change Manager: Director of Nursing.',
        stakeholders: ['Chief Executive (Programme Sponsor)', 'Director of Nursing (Business Change Manager)', '4 Clinical Directors', 'IT Director', 'HR Director', 'Patient Experience Lead', 'Trade Union Representatives', 'NHS England (regulatory oversight)'],
        constraints: ['Clinical services cannot be disrupted', 'NHS data governance requirements are non-negotiable', 'Go-live must be phased — cannot change all 4 directorates simultaneously'],
      },
      stages: [
        {
          id: 1, title: 'Tranche 1 — Foundation',
          description: 'Programme setup, Blueprint, stakeholder engagement strategy.',
          scenario: 'You are setting up the programme. The Chief Executive wants to announce the programme publicly to build momentum. The Trade Union representatives have requested a meeting before any announcement is made. The IT Director says the technical infrastructure is not ready and will not be for 3 months. What is your priority?',
          options: [
            { id: 'A', text: 'Support the CE\'s announcement — momentum is important and the details can follow', consequence: 'A public announcement before the Trade Unions have been engaged and before the technical infrastructure is ready will create resistance and unrealistic expectations. This is a stakeholder management failure.', score: 1 },
            { id: 'B', text: 'Meet with the Trade Union representatives first, understand their concerns, and agree a communication approach before any public announcement', consequence: 'Correct. Trade Union engagement before announcement is essential in an NHS context. Their concerns about job roles and working practices must be understood and addressed before the programme goes public.', score: 4 },
            { id: 'C', text: 'Delay the programme start by 3 months until the IT infrastructure is ready', consequence: 'A 3-month delay at programme start may be necessary, but it should be presented to the CE as a risk and a recommendation — not decided unilaterally by the Programme Manager.', score: 2 },
            { id: 'D', text: 'Proceed with the announcement and manage the Trade Union concerns reactively', consequence: 'Reactive stakeholder management in an NHS programme is a high-risk approach. Trade Unions have significant influence and can delay or derail the programme if they feel excluded.', score: 1 },
          ],
          takeaway: 'In NHS programmes, Trade Union engagement is not optional. They represent the staff who will be most affected by the change. Engaging them early — before public announcements — is essential for building the trust needed for successful transformation.',
        },
        {
          id: 2, title: 'Tranche 2 — Design and Pilot',
          description: 'Clinical workflow redesign, pilot in one directorate.',
          scenario: 'The pilot in the Community Nursing directorate has been running for 8 weeks. Clinical staff are reporting that the new system is slower than the paper-based process for complex cases. The IT supplier says this is a training issue. The Director of Nursing says it is a system design issue. Who is right, and what do you do?',
          options: [
            { id: 'A', text: 'Trust the IT supplier — they know the system best', consequence: 'Accepting the supplier\'s explanation without investigation is poor programme management. The supplier has a commercial interest in attributing problems to training rather than system design.', score: 1 },
            { id: 'B', text: 'Conduct a structured review: observe clinical staff using the system for complex cases, time the process, and compare to the paper-based baseline — then decide', consequence: 'Correct. The only way to resolve the disagreement is with data. Observing the actual process and timing it will reveal whether the issue is training or design.', score: 4 },
            { id: 'C', text: 'Trust the Director of Nursing — she knows her clinical staff best', consequence: 'The Director of Nursing\'s view is important, but it is also an opinion. The programme needs data to make the right decision.', score: 2 },
            { id: 'D', text: 'Extend the pilot by 4 weeks and see if the issue resolves with more practice', consequence: 'Extending the pilot without understanding the root cause may just extend the problem. The issue needs to be diagnosed before deciding whether more time will help.', score: 2 },
          ],
          takeaway: 'When stakeholders disagree about the cause of a problem, the answer is always data. Observe the actual process, measure it, and let the evidence decide — not the loudest voice.',
        },
        {
          id: 3, title: 'Tranche 3 — Rollout',
          description: 'Full rollout across all 4 directorates.',
          scenario: 'You are rolling out to the second directorate (District Nursing). Three weeks in, the Clinical Director for District Nursing tells you that 40% of her nursing staff are refusing to use the new system and are reverting to paper. She says the training was inadequate and the system does not reflect how district nurses actually work. What do you do?',
          options: [
            { id: 'A', text: 'Pause the rollout to the remaining 2 directorates and investigate the District Nursing issues before proceeding', consequence: 'Correct. Proceeding with the rollout when 40% of the second directorate is non-compliant would scale the problem. Pausing to investigate and resolve is the right programme management decision.', score: 4 },
            { id: 'B', text: 'Continue the rollout as planned — the District Nursing issues are a local problem and should not hold up the programme', consequence: 'Continuing the rollout with a 40% non-compliance rate in the second directorate will embed the problem across the programme. The remaining directorates will face the same issues.', score: 1 },
            { id: 'C', text: 'Replace the District Nursing Clinical Director — she is blocking the programme', consequence: 'The Clinical Director is raising a legitimate concern about system fit. Replacing her would be a governance failure and would create significant resistance across the programme.', score: 1 },
            { id: 'D', text: 'Ask the IT supplier to provide additional training for District Nursing staff', consequence: 'Additional training may be part of the solution, but if the system genuinely does not reflect how district nurses work, training alone will not resolve the issue.', score: 2 },
          ],
          takeaway: 'Rollout decisions in transformation programmes must be based on adoption data, not just delivery schedules. A 40% non-compliance rate is a programme-level risk that must be addressed before scaling.',
        },
        {
          id: 4, title: 'Tranche 4 — Sustain and Benefits',
          description: 'Benefits realisation, handover to operations.',
          scenario: 'The programme has completed rollout. You are 3 months into the sustain phase. Benefits measurement shows: patient record access time has improved by 45% (target: 30% — exceeded). Digital patient communications adoption is at 62% (target: 80% — below target). Staff satisfaction with the new system is 58% (target: 70% — below target). The CE wants to declare the programme a success and close it. What do you recommend?',
          options: [
            { id: 'A', text: 'Agree with the CE — the record access improvement exceeds the target and this is the most important benefit', consequence: 'Declaring success when 2 of 3 key benefits are below target is premature. The CE\'s desire to close the programme should not override the benefits evidence.', score: 1 },
            { id: 'B', text: 'Present the full benefits picture to the Programme Board: one benefit exceeded, two below target. Recommend a 3-month extension to address the adoption and satisfaction gaps before formal closure.', consequence: 'Correct. The Programme Board must make an informed decision based on the full benefits picture. A 3-month extension to address specific gaps is a proportionate response.', score: 4 },
            { id: 'C', text: 'Close the programme and hand the benefits tracking to the operational team', consequence: 'Handing over benefits tracking when 2 of 3 targets are unmet risks the gaps becoming permanent. The programme should address the gaps before closure.', score: 2 },
            { id: 'D', text: 'Revise the digital communications and staff satisfaction targets downward to reflect what was achieved', consequence: 'Revising targets downward to match actual performance is a governance failure. It hides the gap and prevents the organisation from understanding what needs to be done to realise the full benefit.', score: 1 },
          ],
          takeaway: 'Benefits realisation is the ultimate measure of programme success — not delivery of outputs. When benefits are below target, the programme should not close until the gaps are addressed or a clear plan is in place for the operational team to address them.',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE E — MoP
  // ════════════════════════════════════════════════════════════
  {
    levelId: null, order
: 51, difficulty: 'advanced', type: 'full_project', tags: ['MSP', 'High Impact'],
    content: JSON.stringify({
      stages: [
        { id: 1, title: 'Tranche 1 — Define', description: 'Vision, blueprint, stakeholder mapping.', scenario: 'You are Programme Manager for an NHS Community Trust digital transformation programme. The CE has asked you to present the programme vision and blueprint to the Board. Three Board members challenge you: one says the vision is too vague, one says the benefits are not measurable, and one says the programme is too ambitious. How do you respond?', options: [ { id: 'A', text: 'Defend the current vision — it was signed off by the SRO', consequence: 'Defending a challenged vision without engaging with the substance of the concerns will lose Board confidence.', score: 1 }, { id: 'B', text: 'Acknowledge the challenges, commit to refining the vision statement and adding measurable benefit profiles, and return to the Board in 2 weeks with a revised blueprint', consequence: 'Correct. Engaging constructively with Board challenge and committing to specific improvements is the right programme governance response.', score: 4 }, { id: 'C', text: 'Ask the CE to intervene and direct the Board to approve the blueprint', consequence: 'Bypassing Board scrutiny undermines governance and will create problems later when the programme needs Board support.', score: 1 }, { id: 'D', text: 'Reduce the programme scope to address the "too ambitious" concern', consequence: 'Reducing scope in response to one Board member\'s concern without a full impact assessment is reactive and may undermine the programme\'s ability to deliver the required benefits.', score: 2 } ], takeaway: 'Programme blueprints must be robust enough to withstand Board scrutiny. Engaging constructively with challenge and committing to specific improvements is the right response.' },
        { id: 2, title: 'Tranche 2 — Mobilise', description: 'SRO alignment, change agent network.', scenario: 'You are 3 months into the programme. The SRO (Chief Operating Officer) has attended only 1 of 4 Programme Board meetings and has delegated most decisions to her deputy. The deputy is supportive but lacks the authority to make key decisions. Two project managers are reporting that decisions are being delayed. What do you do?', options: [ { id: 'A', text: 'Continue working with the deputy — she is supportive and that is enough', consequence: 'Working around an absent SRO creates a governance vacuum. Decisions that require SRO authority will continue to be delayed.', score: 1 }, { id: 'B', text: 'Escalate to the CE: the SRO\'s absence is creating decision delays that are putting the programme at risk', consequence: 'Correct. SRO engagement is a programme-level risk. Escalating to the CE is the right governance response when the SRO is not fulfilling their role.', score: 4 }, { id: 'C', text: 'Make the decisions yourself and inform the SRO retrospectively', consequence: 'Making decisions outside your authority creates accountability gaps and may commit the programme to a direction the SRO has not approved.', score: 1 }, { id: 'D', text: 'Ask the deputy to formally assume the SRO role', consequence: 'The deputy may not have the authority or seniority for the SRO role. This is a governance decision that must be made by the CE, not the Programme Manager.', score: 2 } ], takeaway: 'SRO engagement is not optional in MSP. When the SRO is absent, the Programme Manager must escalate — not work around the gap.' },
        { id: 3, title: 'Tranche 3 — Deliver', description: 'Managing tranche delivery and non-compliance.', scenario: 'You are rolling out to the second directorate (District Nursing). Three weeks in, the Clinical Director for District Nursing tells you that 40% of her nursing staff are refusing to use the new system and are reverting to paper. She says the training was inadequate and the system does not reflect how district nurses actually work. What do you do?', options: [ { id: 'A', text: 'Pause the rollout to the remaining 2 directorates and investigate the District Nursing issues before proceeding', consequence: 'Correct. Proceeding with the rollout when 40% of the second directorate is non-compliant would scale the problem. Pausing to investigate and resolve is the right programme management decision.', score: 4 }, { id: 'B', text: 'Continue the rollout as planned — the District Nursing issues are a local problem and should not hold up the programme', consequence: 'Continuing the rollout with a 40% non-compliance rate in the second directorate will embed the problem across the programme.', score: 1 }, { id: 'C', text: 'Replace the District Nursing Clinical Director — she is blocking the programme', consequence: 'The Clinical Director is raising a legitimate concern about system fit. Replacing her would be a governance failure.', score: 1 }, { id: 'D', text: 'Ask the IT supplier to provide additional training for District Nursing staff', consequence: 'Additional training may be part of the solution, but if the system genuinely does not reflect how district nurses work, training alone will not resolve the issue.', score: 2 } ], takeaway: 'Rollout decisions in transformation programmes must be based on adoption data, not just delivery schedules.' },
        { id: 4, title: 'Tranche 4 — Sustain and Benefits', description: 'Benefits realisation, handover to operations.', scenario: 'The programme has completed rollout. Benefits measurement shows: patient record access time improved by 45% (target: 30% — exceeded). Digital communications adoption at 62% (target: 80% — below). Staff satisfaction 58% (target: 70% — below). The CE wants to declare the programme a success and close it. What do you recommend?', options: [ { id: 'A', text: 'Agree with the CE — the record access improvement exceeds the target and this is the most important benefit', consequence: 'Declaring success when 2 of 3 key benefits are below target is premature.', score: 1 }, { id: 'B', text: 'Present the full benefits picture to the Programme Board and recommend a 3-month extension to address the adoption and satisfaction gaps before formal closure', consequence: 'Correct. The Programme Board must make an informed decision based on the full benefits picture.', score: 4 }, { id: 'C', text: 'Close the programme and hand the benefits tracking to the operational team', consequence: 'Handing over benefits tracking when 2 of 3 targets are unmet risks the gaps becoming permanent.', score: 2 }, { id: 'D', text: 'Revise the digital communications and staff satisfaction targets downward to reflect what was achieved', consequence: 'Revising targets downward to match actual performance is a governance failure.', score: 1 } ], takeaway: 'Benefits realisation is the ultimate measure of programme success. When benefits are below target, the programme should not close until the gaps are addressed.' },
      ],
    }),
  },

  // ════════════════════════════════════════════════════════════
  // MODULE E — MoP
  // ════════════════════════════════════════════════════════════
  {
    levelId: null, order: 52, difficulty: 'advanced', type: 'decision', tags: ['MoP', 'High Impact'],
    title: 'Two Projects, One Team — Who Wins?',
    description: 'A resource conflict between two high-priority projects lands on your desk.',
    content: JSON.stringify({
      scenario: 'You are Head of PMO. Two project managers have escalated a resource conflict to you. Project A (CRM replacement, strategic priority 1) and Project B (regulatory compliance audit, statutory deadline in 8 weeks) both need the same two senior business analysts for the next 6 weeks. You cannot hire contractors in time. What do you do?',
      options: [
        { id: 'A', text: 'Allocate the BAs to Project A — it is the highest strategic priority', consequence: 'Deprioritising a statutory compliance deadline for a strategic project creates regulatory risk. The organisation could face fines or enforcement action.', score: 1 },
        { id: 'B', text: 'Allocate the BAs to Project B for 6 weeks to meet the statutory deadline, then move them to Project A. Formally re-plan Project A with the revised timeline.', consequence: 'Correct. Statutory obligations take precedence. Re-planning Project A is the right portfolio management response — not ignoring the constraint.', score: 4 },
        { id: 'C', text: 'Split the BAs 50/50 between both projects', consequence: 'Splitting resource 50/50 means neither project gets what it needs. Both will be delayed and the compliance risk remains.', score: 1 },
        { id: 'D', text: 'Escalate to the Portfolio Board and let them decide', consequence: 'Escalating a clear statutory vs strategic conflict to the Portfolio Board is appropriate — but only after you have prepared a recommendation with options and impacts.', score: 2 },
      ],
      takeaway: 'Portfolio resource decisions must weigh strategic priority against statutory obligation. Regulatory deadlines are not negotiable — they must be factored into portfolio planning before conflicts arise.',
    }),
  },
  {
    levelId: null, order: 53, difficulty: 'advanced', type: 'decision', tags: ['MoP', 'High Impact'],
    title: 'The Project That Does Not Fit the Strategy',
    description: 'A well-written business case arrives for a project that does not align with any strategic objective.',
    content: JSON.stringify({
      scenario: 'You are Head of PMO. A well-respected Director has submitted a business case for a new project. The business case is well-written and the project would deliver real value to their department. However, it does not align with any of the organisation\'s 5 strategic objectives for the next 3 years. It would consume £180,000 and two senior PMs for 9 months.',
      options: [
        { id: 'A', text: 'Approve it — the Director is senior and the project has merit on its own terms', consequence: 'Approving non-strategic projects sets a precedent that undermines portfolio discipline. Every Director will submit projects on departmental merit rather than strategic alignment.', score: 1 },
        { id: 'B', text: 'Recommend rejection at the Portfolio Board on strategic alignment grounds, and suggest the Director resubmits in the next planning cycle if priorities change', consequence: 'Correct. Portfolio decisions must be grounded in strategic alignment, not project merit alone. This is the core MoP principle.', score: 4 },
        { id: 'C', text: 'Approve it but reduce the budget to minimise the strategic risk', consequence: 'Approving a non-strategic project at reduced budget still depletes resource from strategic priorities.', score: 1 },
        { id: 'D', text: 'Ask the Director to rewrite the business case to include a strategic alignment section', consequence: 'Asking for a rewrite to justify a predetermined answer corrupts the governance process.', score: 2 },
      ],
      takeaway: 'Portfolio governance exists to ensure organisational resources flow to strategic priorities. A well-written business case for a non-strategic project is still a non-strategic project.',
    }),
  },
  {
    levelId: null, order: 54, difficulty: 'advanced', type: 'build', tags: ['MoP', 'Exam Prep'],
    title: 'Build a Portfolio Prioritisation Matrix',
    description: 'Prioritise 8 competing project proposals against a £1.2m budget.',
    content: JSON.stringify({
      brief: 'You are Head of PMO for a housing association with a portfolio of 8 proposed projects for the coming year. Total budget available: £1.2 million. Total requested: £2.8 million. You must recommend which projects to fund, defer, or reject.\n\nProjects submitted:\n1. New CRM system — £380,000 — 18 months\n2. Staff wellbeing programme — £45,000 — 6 months\n3. Social housing compliance audit — £120,000 — 3 months (regulatory requirement)\n4. New tenant portal — £290,000 — 12 months\n5. Office refurbishment — £210,000 — 4 months\n6. Data analytics capability — £175,000 — 9 months\n7. Leadership development programme — £85,000 — 12 months\n8. Void property reduction initiative — £95,000 — 6 months',
      fields: [
        { id: 'matrix', label: 'Portfolio Prioritisation Matrix', type: 'textarea', placeholder: 'Score each project on: Strategic alignment (1-5), Benefits score (1-5), Risk if not done (1-5), Resource availability (1-5). Total score and recommendation (Fund/Defer/Reject) for each.', minWords: 100 },
        { id: 'summary', label: 'Portfolio Recommendation Summary (200 words)', type: 'textarea', placeholder: 'Explain your funding decisions, referencing strategic alignment, regulatory obligations, and total budget.', minWords: 150 },
      ],
      aiCriteria: 'Compliance project must be prioritised. Total funded budget must not exceed £1.2m. Recommendations must be consistent with scores. Rationale must reference strategic alignment.',
    }),
  },
  {
    levelId: null, order: 55, difficulty: 'advanced', type: 'decision', tags: ['MoP', 'Common Scenario'],
    title: 'The Portfolio Dashboard Red RAG',
    description: 'Three projects turn red on the portfolio dashboard simultaneously.',
    content: JSON.stringify({
      scenario: 'You are reviewing the monthly portfolio dashboard. Three projects have turned red simultaneously: Project A (budget overrun — 15% over), Project B (schedule slippage — 6 weeks behind), Project C (benefits at risk — key sponsor has left). The Portfolio Board meets in 3 days. What is your immediate priority?',
      options: [
        { id: 'A', text: 'Request exception reports from all three PMs and present them to the Portfolio Board with your analysis and recommended interventions', consequence: 'Correct. Exception reports give the Portfolio Board the information they need to make governance decisions. Presenting with your analysis and recommendations is the right PMO response.', score: 4 },
        { id: 'B', text: 'Escalate all three to the CEO immediately', consequence: 'Escalating three simultaneous red projects to the CEO without first understanding the issues and preparing recommendations will create panic rather than resolution.', score: 1 },
        { id: 'C', text: 'Focus on Project C — losing a sponsor is the most serious risk', consequence: 'All three issues require attention. Focusing on one while ignoring the others is not a portfolio management response.', score: 2 },
        { id: 'D', text: 'Ask the three PMs to resolve their issues before the Portfolio Board meeting', consequence: 'Asking PMs to resolve portfolio-level issues in 3 days without PMO support or governance intervention is unrealistic.', score: 1 },
      ],
      takeaway: 'The PMO\'s role during portfolio red flags is to gather information, analyse the issues, and present the Portfolio Board with clear options and recommendations — not to panic or deflect.',
    }),
  },
  {
    levelId: null, order: 56, difficulty: 'advanced', type: 'interview', tags: ['MoP', 'Interview Favourite'],
    title: 'Tell Me How You Would Prioritise a Portfolio',
    description: 'A senior panel question on portfolio prioritisation methodology.',
    content: JSON.stringify({
      question: 'Tell me how you would approach prioritising a portfolio of 12 competing projects when you have resource for only 8.',
      context: 'You are being interviewed for a Head of PMO role at a large NHS Trust. The panel includes the CFO and the Chief Operating Officer.',
      guidance: 'Structure your answer using STAR. Cover: your prioritisation criteria (strategic alignment, benefits, risk, resource), your governance process (who decides, how), how you handle political pressure from project sponsors, and how you communicate decisions to unsuccessful sponsors. Aim for 250-350 words.',
      scoringCriteria: 'Mentions strategic alignment as primary criterion. References a scoring/weighting model. Addresses governance and who makes the final decision. Acknowledges the political dimension. Gives a concrete example or scenario.',
    }),
  },
  {
    levelId: null, order: 57, difficulty: 'advanced', type: 'decision', tags: ['MoP', 'High Impact'],
    title: 'Resource Capacity Crunch',
    description: 'The portfolio has more approved projects than the organisation can resource.',
    content: JSON.stringify({
      scenario: 'The Portfolio Board has approved 14 projects for the year. Your resource capacity analysis shows you have capacity for 9. Three months in, PMs are reporting that staff are working on 3-4 projects simultaneously and quality is suffering. Two projects have already missed key milestones. What is the root cause and what do you recommend?',
      options: [
        { id: 'A', text: 'The root cause is poor project management. Ask the PMs to improve their planning.', consequence: 'The root cause is portfolio over-commitment, not individual project management. Blaming PMs for a portfolio governance failure will damage trust and not resolve the issue.', score: 1 },
        { id: 'B', text: 'The root cause is portfolio over-commitment. Return to the Portfolio Board with a resource capacity analysis and recommend deferring 5 projects to Q3.', consequence: 'Correct. Portfolio over-commitment is a governance issue that must be resolved at the Portfolio Board level. Presenting the evidence and recommending deferral is the right PMO response.', score: 4 },
        { id: 'C', text: 'Hire 10 contractors to cover the resource gap', consequence: 'Hiring contractors to cover a portfolio over-commitment treats the symptom, not the cause. It also adds significant cost that was not in the portfolio budget.', score: 2 },
        { id: 'D', text: 'Ask each project to reduce their resource requirements by 30%', consequence: 'Asking projects to reduce resource requirements without reducing scope will result in lower quality outputs and further milestone slippage.', score: 1 },
      ],
      takeaway: 'Portfolio over-commitment is one of the most common and damaging portfolio management failures. The PMO must maintain a live resource capacity model and escalate over-commitment before it affects delivery.',
    }),
  },
  {
    levelId: null, order: 58, difficulty: 'advanced', type: 'interview', tags: ['MoP', 'Interview Favourite'],
    title: 'Tell Me About Strategic Alignment in Project Selection',
    description: 'Explain how you ensure projects align with organisational strategy.',
    content: JSON.stringify({
      question: 'How do you ensure that the projects selected for a portfolio are genuinely aligned with the organisation\'s strategic objectives?',
      context: 'You are being interviewed for a Portfolio Director role at a large housing association.',
      guidance: 'Cover: how you translate strategy into portfolio criteria, your business case assessment process, how you handle projects that have departmental value but no strategic alignment, and how you review alignment throughout the year as strategy evolves. Use a real or realistic example.',
      scoringCriteria: 'Describes a structured alignment assessment process. References strategy translation into criteria. Addresses the political challenge of non-strategic projects. Mentions ongoing review, not just annual selection.',
    }),
  },
  {
    levelId: null, order: 59, difficulty: 'advanced', type: 'decision', tags: ['MoP', 'Common Scenario'],
    title: 'The Portfolio That Grew Too Large',
    description: 'Scope creep at portfolio level — too many projects, too little governance.',
    content: JSON.stringify({
      scenario: 'You have just joined as Head of PMO. You discover the portfolio contains 47 active projects. There is no prioritisation framework. Many projects have no business case. 12 projects have been running for over 3 years with no end date. Senior leaders are frustrated that "nothing ever gets finished." What is your first action?',
      options: [
        { id: 'A', text: 'Immediately close the 12 long-running projects', consequence: 'Closing projects without understanding their status, dependencies, or stakeholder impact will create chaos and resistance.', score: 1 },
        { id: 'B', text: 'Conduct a portfolio review: categorise all 47 projects by strategic alignment, benefits status, and resource consumption. Present findings and recommendations to the Portfolio Board within 30 days.', consequence: 'Correct. A structured portfolio review gives the Portfolio Board the evidence base to make informed decisions about which projects to continue, defer, or close.', score: 4 },
        { id: 'C', text: 'Introduce a new project prioritisation framework and apply it to all future projects only', consequence: 'Applying a new framework only to future projects leaves the existing portfolio unmanaged. The 47 active projects will continue to consume resource without governance.', score: 2 },
        { id: 'D', text: 'Ask each project sponsor to confirm whether their project is still needed', consequence: 'Asking sponsors to self-assess is unlikely to result in honest answers. Sponsors rarely volunteer to close their own projects.', score: 1 },
      ],
      takeaway: 'Portfolio hygiene is a PMO responsibility. When a portfolio has grown without governance, the first step is a structured review — not immediate action — to give decision-makers the evidence they need.',
    }),
  },
  {
    levelId: null, order: 60, difficulty: 'advanced', type: 'full_project', tags: ['MoP', 'High Impact'],
    title: 'The Council Digital Portfolio Review (Full Project)',
    description: 'Lead a full portfolio review for a local council with 22 active projects and a £4.2m budget.',
    content: JSON.stringify({
      stages: [
        { id: 1, title: 'Stage 1 — Portfolio Audit', description: 'Categorise and assess all 22 projects.', scenario: 'You are Head of PMO for a large metropolitan council. The CEO has asked you to conduct a full portfolio review. There are 22 active projects with a combined budget of £4.2m. You have 6 weeks to present findings to the Portfolio Board. Three senior directors are resistant to the review — they believe it is an attempt to cut their projects. How do you approach the first 2 weeks?', options: [ { id: 'A', text: 'Send a data request to all 22 PMs and analyse the responses without engaging the directors', consequence: 'Conducting a portfolio review without engaging the resistant directors will increase their resistance and reduce the quality of data you receive.', score: 1 }, { id: 'B', text: 'Meet individually with each resistant director before the review begins. Explain the purpose, listen to their concerns, and agree on the data you need from their projects.', consequence: 'Correct. Engaging resistant stakeholders early — listening before asking — is the right approach. It reduces resistance and improves data quality.', score: 4 }, { id: 'C', text: 'Ask the CEO to instruct the directors to cooperate', consequence: 'Using the CEO to force cooperation will create compliance without commitment. The directors will provide minimum data and remain resistant.', score: 2 }, { id: 'D', text: 'Exclude the resistant directors\' projects from the review to avoid conflict', consequence: 'Excluding projects from a portfolio review defeats the purpose of the review.', score: 1 } ], takeaway: 'Portfolio reviews require stakeholder engagement, not just data collection. Resistant stakeholders must be engaged early and their concerns heard before asking for their cooperation.' },
        { id: 2, title: 'Stage 2 — Prioritisation', description: 'Apply the prioritisation framework and make recommendations.', scenario: 'Your portfolio audit reveals: 8 projects are strategically aligned and on track. 6 projects are strategically aligned but significantly over budget or behind schedule. 5 projects have no clear strategic alignment. 3 projects have been running for 4+ years with no end date and no measurable benefits. The Portfolio Board has asked for your recommendations. What do you present?', options: [ { id: 'A', text: 'Recommend continuing all 22 projects but with tighter governance', consequence: 'Recommending continuation of all projects — including non-strategic and zombie projects — is not a portfolio management recommendation. It is avoidance.', score: 1 }, { id: 'B', text: 'Present a tiered recommendation: continue the 8 on-track strategic projects; recovery plans for the 6 struggling strategic projects; closure proposals for the 5 non-strategic projects; immediate review of the 3 zombie projects with a 30-day decision deadline.', consequence: 'Correct. A tiered recommendation gives the Portfolio Board clear, evidence-based options for each category of project.', score: 4 }, { id: 'C', text: 'Recommend closing all 8 non-strategic and zombie projects immediately', consequence: 'Recommending immediate closure of 8 projects without closure plans, stakeholder engagement, or transition arrangements will create significant disruption.', score: 2 }, { id: 'D', text: 'Ask the Portfolio Board to make the decisions without your recommendation', consequence: 'The Portfolio Board expects the PMO to provide analysis and recommendations, not just present data.', score: 1 } ], takeaway: 'Portfolio recommendations must be evidence-based, tiered, and actionable. The PMO\'s role is to give the Portfolio Board clear options — not to make all the decisions or avoid making any.' },
      ],
    }),
  },

  // ════════════════════════════════════════════════════════════
  // MODULE F — Change Management
  // ════════════════════════════════════════════════════════════
  {
    levelId: null, order: 61, difficulty: 'advanced', type: 'decision', tags: ['Change Management', 'High Impact'],
    title: 'The Change No One Was Told About',
    description: 'Go-live is in 3 weeks. 200 staff were never included in the communications plan.',
    content: JSON.stringify({
      scenario: 'You are PM on a new HR system implementation. Go-live is in 3 weeks. You have just discovered that approximately 200 people were never included in the communications plan — nobody told them the system is changing. They will be expected to use the new system on Day 1.',
      options: [
        { id: 'A', text: 'Proceed with go-live — they will pick it up when they have to use it', consequence: 'Uninformed users on Day 1 create help desk overload, workarounds, errors, and resistance. This is a predictable and avoidable failure.', score: 1 },
        { id: 'B', text: 'Delay go-live by 2 weeks to allow for targeted communications and a basic awareness session with the 200 affected staff', consequence: 'Correct. A short delay is significantly cheaper than a failed go-live. This is the right call — Awareness is the first step in ADKAR and it cannot be skipped.', score: 4 },
        { id: 'C', text: 'Send a single all-staff email this week and consider the communication done', consequence: 'A single email does not create Awareness in ADKAR terms — especially for staff with no context. They need to understand why the change is happening, not just that it is.', score: 2 },
        { id: 'D', text: 'Brief their line managers and ask them to cascade the information informally', consequence: 'Manager cascade is inconsistent and unreliable. 200 people will receive 200 different messages — some will get nothing.', score: 2 },
      ],
      takeaway: 'Awareness is the foundation of ADKAR. You cannot build Desire, Knowledge, or Ability on a foundation of ignorance. When 200 people do not know a change is coming, the change is not ready to go live.',
    }),
  },
  {
    levelId: null, order: 62, difficulty: 'advanced', type: 'decision', tags: ['Change Management', 'Common Scenario'],
    title: 'Resistance on Day One',
    description: 'A vocal group of staff refuse to use the new system from the first day.',
    content: JSON.stringify({
      scenario: 'It is Day 1 of your new case management system go-live. A group of 15 experienced caseworkers are openly refusing to use the new system. Their team leader says: "This system was designed without asking us. It doesn\'t work the way we work. We\'re going back to the old system." The Head of Operations is watching. What do you do?',
      options: [
        { id: 'A', text: 'Instruct the team leader that use of the new system is mandatory and escalate to HR if they refuse', consequence: 'Forcing compliance without addressing the underlying concern will drive resistance underground. The caseworkers will find workarounds and the adoption data will be misleading.', score: 1 },
        { id: 'B', text: 'Acknowledge the concern, ask the team leader to identify the top 3 specific issues, and commit to a same-day meeting with the system team to assess what can be addressed immediately', consequence: 'Correct. Acknowledging resistance, listening to specific concerns, and committing to rapid response is the right change management approach. It demonstrates respect and creates a path to resolution.', score: 4 },
        { id: 'C', text: 'Allow the team to continue using the old system temporarily while you investigate', consequence: 'Allowing continued use of the old system removes the incentive to adopt the new one. This will make the transition significantly harder.', score: 2 },
        { id: 'D', text: 'Tell the Head of Operations that this is a normal part of change and it will resolve itself', consequence: 'Dismissing Day 1 resistance as normal without taking action will lose the confidence of the Head of Operations and allow the resistance to spread.', score: 1 },
      ],
      takeaway: 'Resistance is information. When experienced staff resist on Day 1, they are telling you something important about the change. The right response is to listen, identify the specific issues, and respond rapidly — not to force compliance or dismiss the concern.',
    }),
  },
  {
    levelId: null, order: 63, difficulty: 'advanced', type: 'build', tags: ['Change Management', 'Common Scenario'],
    title: 'Build a Change Impact Assessment',
    description: 'Assess the people impact of a major operational change across 4 departments.',
    content: JSON.stringify({
      brief: 'You are Change Manager on a project to centralise customer services across 4 regional offices into a single national contact centre. Approximately 180 staff are affected. Some will transfer to the new centre, some will be redeployed, and some roles will be made redundant. The project goes live in 6 months.',
      fields: [
        { id: 'impact_summary', label: 'Change Impact Summary', type: 'textarea', placeholder: 'Describe the nature and scale of the change for each of the 4 departments. What is changing, for whom, and by when?', minWords: 100 },
        { id: 'stakeholder_groups', label: 'Stakeholder Groups and Impact Level', type: 'textarea', placeholder: 'Identify at least 6 distinct stakeholder groups. For each: current state, future state, impact level (High/Medium/Low), and primary concern.', minWords: 120 },
        { id: 'change_risks', label: 'Top 5 Change Risks', type: 'textarea', placeholder: 'Identify the 5 highest people-related risks. For each: risk description, likelihood, impact, and mitigation.', minWords: 100 },
        { id: 'support_plan', label: 'Support and Engagement Plan', type: 'textarea', placeholder: 'What support will you provide to affected staff? Include communications, consultation, redeployment support, and wellbeing measures.', minWords: 120 },
      ],
      aiCriteria: 'Must address redundancy risk explicitly. Must differentiate between stakeholder groups. Mitigation must be specific and actionable. Must acknowledge emotional as well as practical impacts.',
    }),
  },
  {
    levelId: null, order: 64, difficulty: 'advanced', type: 'decision', tags: ['Change Management', 'High Impact'],
    title: 'The Sponsor Who Went Quiet',
    description: 'Your change sponsor has disengaged at the critical mobilisation phase.',
    content: JSON.stringify({
      scenario: 'You are Change Manager on a major restructuring programme. The CEO is the named sponsor. For the first 2 months she was visibly engaged — attending town halls, recording a video message, responding to staff questions. In Month 3, she has attended no events, not responded to your emails, and delegated all decisions to her EA. Staff are noticing. Rumours are circulating that the programme has been cancelled. What do you do?',
      options: [
        { id: 'A', text: 'Continue the programme without the CEO — you have enough momentum to carry it forward', consequence: 'Continuing a major restructuring programme without visible CEO sponsorship will accelerate the rumours and increase resistance. Sponsorship is not optional for high-impact change.', score: 1 },
        { id: 'B', text: 'Request an urgent 30-minute meeting with the CEO. Bring data: staff rumours, engagement drop, specific decisions that are blocked. Make the case for why her visible sponsorship is critical to the programme\'s success.', consequence: 'Correct. Bringing evidence and making a clear case for sponsorship re-engagement is the right approach. CEOs disengage when they are busy — a focused, evidence-based conversation can re-engage them.', score: 4 },
        { id: 'C', text: 'Identify an alternative sponsor — the COO or a senior director', consequence: 'Replacing the CEO as sponsor without her knowledge or agreement is a governance failure. It also sends a signal to staff that the CEO has abandoned the programme.', score: 1 },
        { id: 'D', text: 'Send a programme update to all staff to counter the rumours', consequence: 'A staff communication without visible CEO endorsement will not counter the rumours. Staff will notice that the CEO is not signing the message.', score: 2 },
      ],
      takeaway: 'Sponsor engagement is not a nice-to-have — it is a programme-critical dependency. When a sponsor disengages, the Change Manager must act quickly, bring evidence, and make the case for re-engagement directly.',
    }),
  },
  {
    levelId: null, order: 65, difficulty: 'advanced', type: 'decision', tags: ['Change Management', 'Exam Prep'],
    title: 'Applying ADKAR — Where Is the Barrier?',
    description: 'Diagnose which ADKAR element is blocking adoption for 5 different staff members.',
    content: JSON.stringify({
      scenario: 'You are Change Manager on a new case management system rollout. Six months post go-live, adoption is poor. You interview 5 staff members. For each response, identify the ADKAR barrier:\n\n1. "I wasn\'t told why we were changing system — nobody explained the business reason."\n2. "I understand why we need to change but honestly, I don\'t see what\'s in it for me personally."\n3. "I went to the training but it was a 3-hour classroom session — I don\'t remember any of it now."\n4. "I know how to use it but every time I try, my manager asks me to use the old system because it\'s faster for the team."\n5. "I genuinely want to use the new system but I wasn\'t given enough training time to feel confident."',
      options: [
        { id: 'A', text: '1=Awareness, 2=Desire, 3=Knowledge, 4=Reinforcement, 5=Ability', consequence: 'Correct. Each response maps precisely to an ADKAR element. Understanding which barrier is present determines the intervention: more communication for Awareness, personal benefit messaging for Desire, better training for Knowledge/Ability, manager accountability for Reinforcement.', score: 4 },
        { id: 'B', text: '1=Desire, 2=Awareness, 3=Ability, 4=Knowledge, 5=Reinforcement', consequence: 'Incorrect. Statement 1 is about not knowing why the change is happening — that is an Awareness barrier, not Desire. Statement 2 is about personal motivation — that is Desire, not Awareness.', score: 1 },
        { id: 'C', text: '1=Awareness, 2=Knowledge, 3=Ability, 4=Desire, 5=Reinforcement', consequence: 'Partially correct. Statement 1 (Awareness) and 3 (Ability) are right, but Statement 2 is Desire (personal motivation), Statement 4 is Reinforcement (manager behaviour), and Statement 5 is Ability (confidence/skill).', score: 2 },
        { id: 'D', text: 'All five are training problems — provide more training', consequence: 'Treating all ADKAR barriers as training problems is a common and costly mistake. Training only addresses Knowledge and Ability barriers. Awareness, Desire, and Reinforcement require different interventions.', score: 1 },
      ],
      takeaway: 'ADKAR is a diagnostic tool. Each barrier requires a different intervention. Treating all adoption problems as training problems is one of the most common change management failures.',
    }),
  },
  {
    levelId: null, order: 66, difficulty: 'advanced', type: 'interview', tags: ['Change Management', 'Interview Favourite'],
    title: 'Tell Me About Leading People Through Change',
    description: 'A classic behavioural interview question for PM and Change Manager roles.',
    content: JSON.stringify({
      question: 'Tell me about a time you led people through a significant change. What was the change, what resistance did you face, and how did you handle it?',
      context: 'You are being interviewed for a Senior Project Manager role at an NHS Trust. The panel includes the HR Director and the Head of Transformation.',
      guidance: 'Use the STAR framework. Be specific about the change, the resistance, and your actions. Reference change management principles (ADKAR, Kotter, or the change curve) naturally — do not lecture. Show empathy for the people affected. Quantify the outcome if possible. Aim for 280-380 words.',
      scoringCriteria: 'Specific change described. Resistance acknowledged honestly. Actions taken are specific and empathetic. Change management framework referenced naturally. Outcome described with evidence.',
    }),
  },
  {
    levelId: null, order: 67, difficulty: 'advanced', type: 'build', tags: ['Change Management', 'Exam Prep'],
    title: 'Write a Change Communication Plan',
    description: 'Build a full communication plan for a hybrid working transition across 600 staff.',
    content: JSON.stringify({
      brief: 'You are Change Manager for a project to introduce hybrid working across a 600-person financial services firm. Currently all staff work in the office 5 days a week. From Month 4, all staff will move to 3 days in office / 2 days remote. Some staff are enthusiastic; others are concerned about career visibility and team cohesion.',
      fields: [
        { id: 'change_summary', label: 'Change Summary', type: 'textarea', placeholder: 'What is changing, for whom, and by when? Include the business rationale.', minWords: 80 },
        { id: 'stakeholder_groups', label: 'Stakeholder Groups (at least 5)', type: 'textarea', placeholder: 'Identify at least 5 distinct groups with different change impacts. For each: who they are, what changes for them, and their primary concern.', minWords: 100 },
        { id: 'key_messages', label: 'Key Messages per Group', type: 'textarea', placeholder: 'What does each group need to hear — and believe? Differentiate by group.', minWords: 100 },
        { id: 'communication_timeline', label: 'Communication Timeline (4 months)', type: 'textarea', placeholder: 'What gets communicated, to whom, and when across the 4 months? Follow ADKAR sequence.', minWords: 100 },
        { id: 'two_way_plan', label: 'Two-Way Engagement Plan', type: 'textarea', placeholder: 'How will you listen and respond to concerns? Include at least 3 specific mechanisms.', minWords: 80 },
        { id: 'resistance_mitigation', label: 'Resistance Mitigation (top 3)', type: 'textarea', placeholder: 'What are the top 3 resistance points and how will you address them? Address emotional as well as rational concerns.', minWords: 100 },
      ],
      aiCriteria: 'Differentiated messages per stakeholder group. Two-way elements (not just broadcast). Timeline follows ADKAR sequence. Resistance mitigation addresses emotional as well as rational concerns.',
    }),
  },
  {
    levelId: null, order: 68, difficulty: 'advanced', type: 'decision', tags: ['Change Management', 'Confidence Builder'],
    title: 'The Change Curve in Action',
    description: 'Identify where 4 staff members are on the change curve and choose the right response.',
    content: JSON.stringify({
      scenario: 'You are 6 weeks into a major system change. You have 1-2-1 conversations with 4 staff members:\n\n- Alex: "I\'m furious. Nobody asked us. This system is worse than the old one and I\'m not using it."\n- Bea: "I\'m not sure about this. I keep making mistakes and it\'s taking me twice as long."\n- Carl: "I\'m starting to get the hang of it. The search function is actually much better."\n- Diane: "I\'m fully on board now. Can I help train the others?"\n\nWhich response is correct for each person?',
      options: [
        { id: 'A', text: 'Alex: Listen and acknowledge anger, do not argue. Bea: Provide additional support and reassurance. Carl: Recognise progress and encourage. Diane: Give her a change champion role.', consequence: 'Correct. Each response matches the change curve stage: Alex is in Anger/Resistance, Bea is in Exploration/Uncertainty, Carl is in Acceptance, Diane is in Commitment. The right response at each stage is different.', score: 4 },
        { id: 'B', text: 'All four need more training', consequence: 'Training is only relevant for Bea (Exploration stage). Alex needs to be heard, Carl needs encouragement, and Diane needs a role — not training.', score: 1 },
        { id: 'C', text: 'Alex: Escalate to HR. Bea: More training. Carl: Nothing needed. Diane: Nothing needed.', consequence: 'Escalating Alex to HR will entrench his resistance. Diane is a valuable change champion resource being wasted.', score: 1 },
        { id: 'D', text: 'Alex: Give him more time. Bea: Tell her it will get easier. Carl: Warn him not to get complacent. Diane: Tell her to focus on her own work.', consequence: 'Passive responses at every stage will slow adoption. The change curve is a tool for active intervention, not passive observation.', score: 2 },
      ],
      takeaway: 'The change curve tells you where people are — your job is to respond appropriately at each stage. Anger needs acknowledgement, uncertainty needs support, progress needs recognition, and commitment needs a role.',
    }),
  },
  {
    levelId: null, order: 69, difficulty: 'advanced', type: 'interview', tags: ['Change Management', 'Interview Favourite'],
    title: 'Tell Me About a Time Change Was Resisted',
    description: 'Demonstrate your ability to handle resistance with empathy and effectiveness.',
    content: JSON.stringify({
      question: 'Tell me about a time when a change you were managing was significantly resisted. What caused the resistance, how did you respond, and what was the outcome?',
      context: 'You are being interviewed for a Change Manager role at a large local authority. The panel includes the Director of Transformation and a Head of Service.',
      guidance: 'Use STAR. Be honest about the resistance — do not minimise it. Show that you understood the root cause (not just the behaviour). Describe specific actions you took to address the resistance. Reflect on what you learned. Aim for 300-400 words.',
      scoringCriteria: 'Root cause of resistance identified (not just "people don\'t like change"). Specific empathetic actions described. Outcome includes both the change result and the relationship outcome. Reflection on learning.',
    }),
  },
  {
    levelId: null, order: 70, difficulty: 'advanced', type: 'full_project', tags: ['Change Management', 'High Impact'],
    title: 'The New Operating Model Programme (Full Project)',
    description: 'Lead the people-side of a major NHS operating model change across 4 clinical directorates.',
    content: JSON.stringify({
      stages: [
        { id: 1, title: 'Stage 1 — Discovery', description: 'Change impact assessment, stakeholder mapping, change readiness.', scenario: 'You are Change Manager embedded in a programme to implement a new operating model across a 1,200-person NHS Community Trust. You are 4 weeks into the Discovery stage. Your change readiness survey shows: 34% of staff are aware the change is happening. Of those, 60% say they do not understand why. Clinical staff resistance is highest in District Nursing (72% resistant) and Community Therapy (68% resistant). What does this data tell you and what do you do?', options: [ { id: 'A', text: 'The data shows the programme is on track — 34% awareness at 4 weeks is normal', consequence: '34% awareness at 4 weeks with 60% not understanding the rationale is not normal — it indicates a significant communications gap that will compound as the programme progresses.', score: 1 }, { id: 'B', text: 'The data shows a critical Awareness gap. Prioritise targeted communications for District Nursing and Community Therapy, focusing on the "why" before any further engagement on the "what" or "how".', consequence: 'Correct. The ADKAR model requires Awareness before Desire. With 60% not understanding the rationale, no amount of training or engagement will build the Desire needed for adoption.', score: 4 }, { id: 'C', text: 'The data shows resistance is too high — recommend delaying the programme by 6 months', consequence: 'Recommending a 6-month delay based on early readiness data is premature. The right response is to address the Awareness gap, not delay the programme.', score: 2 }, { id: 'D', text: 'Conduct more surveys to get a clearer picture before acting', consequence: 'More surveys will not resolve the Awareness gap. The data is clear enough to act on.', score: 1 } ], takeaway: 'Change readiness data is only valuable if you act on it. A 34% awareness rate with 60% not understanding the rationale is a programme-level risk that requires immediate action — targeted communications focused on the "why".' },
        { id: 2, title: 'Stage 2 — Mobilise', description: 'Sponsorship coalition, change agent network, communication strategy.', scenario: 'You are building your change agent network. You need 1 change champion per team (approximately 40 teams). You have asked team managers to nominate someone. 28 managers have nominated their most junior team member. 8 have nominated people who are known to be resistant to the change. 4 have not responded. What is the problem and how do you address it?', options: [ { id: 'A', text: 'Accept the nominations — any change agent is better than none', consequence: 'Accepting nominations of junior staff and resistant individuals will create a change agent network that lacks credibility and may actively undermine the programme.', score: 1 }, { id: 'B', text: 'Meet with each manager individually. Explain the change agent role — it requires credibility, peer respect, and genuine engagement with the change. Ask them to reconsider their nomination with these criteria in mind.', consequence: 'Correct. Change agents must be credible peers, not junior staff or resistant individuals. Taking time to explain the role criteria and asking managers to reconsider is the right approach.', score: 4 }, { id: 'C', text: 'Select the change agents yourself from the staff lists', consequence: 'Selecting change agents without manager involvement will create resentment and undermine the network before it starts.', score: 2 }, { id: 'D', text: 'Reduce the network to 20 change agents to make it more manageable', consequence: 'Reducing the network to 20 agents for 40 teams means half the teams have no change agent. Coverage is a key success factor.', score: 1 } ], takeaway: 'Change agent selection is one of the most important decisions in a change programme. The criteria — credibility, peer respect, genuine engagement — must be communicated clearly to managers before nominations are made.' },
        { id: 3, title: 'Stage 3 — Design and Deliver', description: 'Training programme, manager briefings, Q&A sessions.', scenario: 'You are 3 weeks before go-live. Your training completion data shows: 78% of staff have completed the mandatory e-learning. 45% have attended the face-to-face practical session. 22% have not started any training. The 22% are concentrated in two directorates. The Programme Director wants to proceed with go-live as planned. What do you recommend?', options: [ { id: 'A', text: 'Proceed with go-live — 78% e-learning completion is acceptable', consequence: 'E-learning completion alone is not sufficient for a complex operating model change. 45% face-to-face attendance and 22% with no training at all represents a significant readiness risk.', score: 1 }, { id: 'B', text: 'Recommend a 2-week delay for the two directorates with low training completion. Use the time for intensive face-to-face sessions. Present the training data and the risk of proceeding to the Programme Board.', consequence: 'Correct. Presenting the training data to the Programme Board and recommending a targeted delay for the two low-completion directorates is the right governance response.', score: 4 }, { id: 'C', text: 'Proceed with go-live but provide extra support to the two low-completion directorates on Day 1', consequence: 'Day 1 support cannot substitute for pre-go-live training. Staff who have not been trained will struggle from the first hour and create support demand that overwhelms the available resource.', score: 2 }, { id: 'D', text: 'Make training mandatory and issue warnings to staff who have not completed it', consequence: 'Issuing warnings 3 weeks before go-live will create anxiety without improving completion rates. The root cause — why these two directorates have low completion — must be understood and addressed.', score: 1 } ], takeaway: 'Training completion data is a go/no-go input. When significant groups have not completed training, the right response is to understand why, address the barrier, and present the data to the Programme Board — not to proceed and hope for the best.' },
        { id: 4, title: 'Stage 4 — Go-Live and Sustain', description: 'Hypercare, adoption measurement, reinforcement.', scenario: 'It is 4 weeks post go-live. Adoption data shows: 71% of staff are using the new operating model as intended. 18% are using a hybrid of old and new ways of working. 11% have reverted entirely to the old model. The 11% are concentrated in one directorate where the Clinical Director has been openly critical of the change. What do you do?', options: [ { id: 'A', text: 'Escalate the Clinical Director to the CEO for undermining the programme', consequence: 'Escalating immediately without first engaging with the Clinical Director will create a conflict that damages the programme and the relationship.', score: 1 }, { id: 'B', text: 'Meet with the Clinical Director. Listen to her specific concerns. Identify what is driving the reversion — is it a system issue, a training issue, or a leadership issue? Agree a joint action plan.', consequence: 'Correct. The Clinical Director\'s open criticism is information. Understanding the root cause of the reversion and agreeing a joint action plan is the right approach — it respects her clinical leadership while addressing the adoption gap.', score: 4 }, { id: 'C', text: 'Accept the 11% reversion as an acceptable outcome — 71% adoption is good enough', consequence: 'Accepting 11% reversion as permanent means the operating model will not achieve its full benefits. It also sets a precedent that non-compliance is acceptable.', score: 1 }, { id: 'D', text: 'Provide additional training to the 11% who have reverted', consequence: 'If the root cause is the Clinical Director\'s leadership behaviour (asking staff to revert), additional training will not resolve the issue.', score: 2 } ], takeaway: 'Post go-live adoption gaps require diagnosis before intervention. When reversion is concentrated in one area with a resistant leader, the root cause is likely leadership behaviour — not training or system issues. Address the leader first.' },
      ],
    }),
  },
];

async function main() {
  const db = await getDb();
  console.log('Seeding Advanced Module simulations (MoP + Change Management)...');
  let inserted = 0;
  for (const sim of advancedSimulations) {
    const existing = await db.query.simulations.findFirst({ where: (s, { eq }) => eq(s.order, sim.order) });
    if (existing) { console.log(`  Skipping order ${sim.order} (already exists)`); continue; }
    await db.insert(simulations).values({ title: sim.title, description: sim.description, type: sim.type, difficulty: sim.difficulty, levelId: sim.levelId, order: sim.order, tags: JSON.stringify(sim.tags), content: sim.content, isActive: 1 });
    inserted++;
    console.log(`  Inserted: ${sim.title}`);
  }
  console.log(`Done. Inserted ${inserted} simulations.`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
