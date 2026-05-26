/**
 * Seed script for Advanced Modules A-D: Lean, Six Sigma, PRINCE2 Practitioner, MSP
 * 10 simulations per module = 40 total.
 * Run: node scripts/seed-lean-ss-p2-msp.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

async function upsert(sim) {
  const [existing] = await conn.query('SELECT id FROM simulations WHERE title = ?', [sim.title]);
  if (existing.length > 0) { console.log(`  ↩  Skipping (exists): ${sim.title}`); return; }
  await conn.query(
    `INSERT INTO simulations (levelId, title, description, type, difficulty, categoryTag, estimatedMinutes, accessType, content, orderIndex, isInterviewBank)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [null, sim.title, sim.description, sim.type, sim.difficulty, sim.categoryTag, sim.estimatedMinutes, 'advanced', JSON.stringify(sim.content), sim.orderIndex, 0]
  );
  console.log(`  ✓  Inserted: ${sim.title}`);
}

const simulations = [

  // ════════════════════════════════════════════════════════════
  // MODULE A — LEAN METHODOLOGY
  // ════════════════════════════════════════════════════════════
  {
    orderIndex: 101, title: 'The Process That Takes Too Long',
    description: 'You are PM at an NHS Trust. The referral-to-treatment pathway takes 47 days. Use Lean to understand why.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'You are a PM at an NHS Trust. The referral-to-treatment pathway for outpatient appointments takes an average of 47 days. The national target is 18 weeks but the Trust wants to hit 28 days. Your director has asked you to lead a Lean improvement project. Your first task is to understand why the process takes so long.',
      options: [
        { id: 'A', text: 'Analyse data from the last 12 months and build a report for the board before doing anything else', consequence: 'Data analysis is useful but without observing reality you will miss the real bottlenecks. Delayed start.', score: 2 },
        { id: 'B', text: 'Walk the process yourself (a "Gemba walk") — follow a referral from receipt to appointment and observe every step', consequence: 'The Gemba walk is the Lean starting point — observe the actual process, not the assumed process. Excellent choice.', score: 4 },
        { id: 'C', text: 'Send a survey to all staff involved in the pathway asking for their views on the bottlenecks', consequence: 'Staff surveys produce opinion, not fact. You will get 40 different views and no clear picture.', score: 2 },
        { id: 'D', text: 'Benchmark against another Trust that has hit 28 days and copy their approach', consequence: "Copying another Trust's solution without understanding your own process is a classic Lean mistake.", score: 1 },
      ],
      takeaway: 'The Gemba walk — going to where the work happens and observing reality — is the foundational Lean tool for understanding a process.',
    },
  },
  {
    orderIndex: 102, title: 'Mapping the Value Stream',
    description: 'Build a value stream map for an NHS outpatient referral process, identifying value-adding and non-value-adding steps.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'confidence_builder', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are leading a Lean improvement project for the outpatient referral process at an NHS Trust. The process runs from GP referral to first appointment. You need to create a value stream map to identify where time and resource is being wasted.\n\nProcess steps (in order): GP sends referral → Admin receives and logs referral → Referral triaged by clinical team → Appointment slot allocated → Appointment letter sent to patient → Patient attends appointment.\n\nCurrent average time: 47 days. Target: 28 days.',
      fields: [
        { id: 'current_state', label: 'Current State — Process Steps with Time', placeholder: 'List each step, who does it, and how long it takes (processing time and wait time separately).' },
        { id: 'value_analysis', label: 'Value-Adding vs Non-Value-Adding Steps', placeholder: 'For each step, classify as: Value-Adding, Non-Value-Adding but Necessary, or Pure Waste. Explain your reasoning.' },
        { id: 'wastes_identified', label: 'Wastes Identified (TIMWOODS)', placeholder: 'List at least 4 specific wastes using the TIMWOODS framework.' },
        { id: 'future_state', label: 'Future State — Redesigned Process', placeholder: 'Describe your redesigned process. How would you get from 47 days to 28 days?' },
        { id: 'quick_wins', label: 'Quick Wins (implementable within 4 weeks)', placeholder: 'Identify 2-3 changes that could be made immediately without significant investment.' },
      ],
      scoringCriteria: 'AI will check: correct use of TIMWOODS terminology, clear distinction between value-adding and non-value-adding steps, future state that realistically achieves the 28-day target, quick wins that are genuinely quick and specific.',
    },
  },
  {
    orderIndex: 103, title: 'The 5 Whys — Finding the Root Cause',
    description: 'A recurring defect in a council planning application process. Use 5 Whys to find the real cause.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'confidence_builder', estimatedMinutes: 8,
    content: {
      scenario: "You are PM on a Lean improvement project for a local council's planning application process. The team reports that 23% of applications are returned to applicants because they are incomplete. The planning manager says: \"Applicants just don't read the guidance.\" You decide to use the 5 Whys technique. After 5 iterations, you discover: the guidance document was last updated in 2019, references forms that no longer exist, and is written at a reading age of 16+. What does this tell you?",
      options: [
        { id: 'A', text: "The planning manager was right — applicants don't read the guidance", consequence: 'The 5 Whys process revealed that the guidance itself is the problem, not applicant behaviour. Accepting the surface-level explanation would have led to the wrong solution.', score: 1 },
        { id: 'B', text: 'The root cause is outdated, inaccessible guidance — not applicant behaviour. The fix is to update and simplify the guidance, not to blame applicants.', consequence: 'Correct. The 5 Whys revealed the root cause: the guidance is outdated and inaccessible. Fixing the guidance will reduce the 23% return rate far more effectively than any applicant-facing intervention.', score: 4 },
        { id: 'C', text: 'The root cause is unclear — more data is needed before any conclusions can be drawn', consequence: 'The 5 Whys has already identified a clear root cause. Calling for more data is avoidance.', score: 1 },
        { id: 'D', text: 'The root cause is the planning manager, who has allowed the guidance to become outdated', consequence: 'Blaming the planning manager is not a Lean response. The 5 Whys identifies process failures, not people failures.', score: 2 },
      ],
      takeaway: 'The 5 Whys technique reveals root causes that are invisible at the surface level. In this case, the apparent problem (applicant behaviour) was a symptom of a deeper process failure (outdated guidance).',
    },
  },
  {
    orderIndex: 104, title: 'Kaizen Event — Rapid Improvement',
    description: 'Lead a 3-day Kaizen event to reduce patient waiting time in an outpatient clinic.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: "You are facilitating a 3-day Kaizen event to reduce patient waiting time in an NHS outpatient clinic. Average wait from arrival to being seen: 47 minutes. Target: 20 minutes. On Day 1, the team has mapped the current state and identified 8 potential improvements. On Day 2, you need to decide which improvements to implement in the remaining time. The team is divided: some want to implement all 8; others want to pilot just 2. What do you recommend?",
      options: [
        { id: 'A', text: 'Implement all 8 improvements simultaneously — the Kaizen event is the time to be bold', consequence: 'Implementing 8 changes simultaneously makes it impossible to know which change caused which result. You will not be able to learn or sustain the improvements.', score: 1 },
        { id: 'B', text: 'Prioritise the 2-3 improvements with the highest impact on wait time and implement them on Day 2. Measure the result on Day 3. Document the remaining improvements for the next Kaizen cycle.', consequence: 'Correct. Kaizen events focus on rapid, measurable improvement. Implementing 2-3 high-impact changes and measuring the result is the right approach.', score: 4 },
        { id: 'C', text: 'Defer all implementation until after the Kaizen event — use the 3 days for planning only', consequence: 'A Kaizen event that produces only a plan has failed. The purpose is rapid implementation and measurement.', score: 1 },
        { id: 'D', text: 'Let the team vote on which improvements to implement', consequence: 'Team voting without impact analysis will not necessarily select the highest-value improvements.', score: 2 },
      ],
      takeaway: 'Kaizen events are about rapid, focused improvement — not comprehensive transformation. Implement the highest-impact changes, measure the result, and document the rest for the next cycle.',
    },
  },
  {
    orderIndex: 105, title: 'Tell Me About a Process You Improved',
    description: 'A Lean-focused interview question for PM and improvement roles.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you identified and improved an inefficient process. What was the process, how did you identify the waste, and what was the result?',
      context: 'You are being interviewed for a Project Manager role at an NHS Trust with a strong Lean improvement programme.',
      guidance: 'Use STAR. Reference Lean tools naturally (Gemba walk, value stream mapping, 5 Whys, TIMWOODS). Be specific about the waste you identified and the improvement you made. Quantify the result if possible. Aim for 250-350 words.',
      scoringCriteria: 'Specific process described. Lean tools referenced naturally. Waste identified clearly. Improvement action specific. Result quantified or described with evidence.',
    },
  },
  {
    orderIndex: 106, title: 'Standard Work — Sustaining the Improvement',
    description: 'Three months after a successful Lean improvement, the process has reverted to its old ways.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'Three months ago, your Lean project reduced the council tax processing time from 14 days to 6 days. You return for a follow-up review and find the average is back to 11 days. Staff are using different methods. The team leader says: "We tried to keep it going but people just went back to their old ways." What went wrong and what do you do?',
      options: [
        { id: 'A', text: 'The improvement was not sustained because the team was not committed enough', consequence: 'Blaming team commitment is not a Lean response. Reversion to old ways is almost always a process design failure, not a people failure.', score: 1 },
        { id: 'B', text: 'The improvement was not sustained because Standard Work was not established. Create documented Standard Work for the new process, train all staff, and build in a visual management system to make deviations visible.', consequence: 'Correct. Without Standard Work — documented, trained, and visually managed — improvements will revert. This is one of the most common Lean failures.', score: 4 },
        { id: 'C', text: 'Run another Kaizen event to re-implement the improvements', consequence: 'Running another Kaizen event without addressing the root cause of reversion will produce the same result in another 3 months.', score: 2 },
        { id: 'D', text: 'Accept that some reversion is normal and set a new target of 9 days', consequence: 'Accepting reversion without investigating the cause abandons the improvement and the investment made in the Kaizen event.', score: 1 },
      ],
      takeaway: 'Standard Work is the Lean mechanism for sustaining improvement. Without documented, trained, and visually managed Standard Work, improvements will revert as staff return to familiar habits.',
    },
  },
  {
    orderIndex: 107, title: 'Build a Lean A3 Report',
    description: 'Create a one-page A3 problem-solving report for a ward discharge process improvement.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 25,
    content: {
      projectBrief: 'You are leading a Lean improvement project on a hospital ward. The problem: patients are being discharged an average of 4 hours after the clinical decision to discharge has been made. The target is 1 hour. You need to create an A3 report to present to the ward manager and the improvement team.',
      fields: [
        { id: 'problem_statement', label: 'Problem Statement', placeholder: 'Describe the problem in specific, measurable terms. Include current state data.' },
        { id: 'current_state', label: 'Current State Analysis', placeholder: 'What does the current process look like? Where are the delays? Use data where possible.' },
        { id: 'root_cause', label: 'Root Cause Analysis (5 Whys or fishbone)', placeholder: 'What is the root cause of the 4-hour delay? Work through at least 3 levels of why.' },
        { id: 'target_state', label: 'Target State', placeholder: 'What does the improved process look like? How does it achieve the 1-hour target?' },
        { id: 'countermeasures', label: 'Countermeasures (at least 3)', placeholder: 'What specific changes will you make? Who is responsible? By when?' },
        { id: 'follow_up', label: 'Follow-Up Plan', placeholder: 'How will you measure success? How will you sustain the improvement?' },
      ],
      scoringCriteria: 'Problem statement must be measurable. Root cause must go beyond surface level. Countermeasures must be specific and assigned. Follow-up must include measurement.',
    },
  },
  {
    orderIndex: 108, title: 'Lean in a Resistant Culture',
    description: 'Clinicians are resistant to a Lean improvement project on their ward.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: "You are PM on a Lean improvement project on a busy surgical ward. The ward manager is supportive but the consultant surgeons are resistant. One consultant says: \"Lean is a manufacturing tool. It doesn't belong in clinical care. We're not making cars.\" Two others have refused to attend the value stream mapping session. How do you respond?",
      options: [
        { id: 'A', text: 'Proceed without the consultants — the ward manager\'s support is enough', consequence: "Proceeding without the consultants' engagement will produce improvements they don't own and won't sustain.", score: 1 },
        { id: 'B', text: "Request a 30-minute meeting with the lead consultant. Acknowledge the concern about Lean's manufacturing origins. Share 3 specific NHS examples where Lean has improved patient outcomes. Ask what his specific concerns are about the ward process.", consequence: 'Correct. Acknowledging the concern, providing relevant evidence, and listening to specific objections is the right approach to clinical resistance.', score: 4 },
        { id: 'C', text: 'Ask the Medical Director to instruct the consultants to participate', consequence: 'Using authority to force participation will create compliance without commitment. The consultants will undermine the project passively.', score: 1 },
        { id: 'D', text: "Rename the project to avoid the word 'Lean' — call it a 'patient flow improvement project'", consequence: "Renaming the project without addressing the underlying concerns is cosmetic. The consultants' resistance will continue.", score: 2 },
      ],
      takeaway: "Clinical resistance to Lean is common and understandable. The right response is to acknowledge the concern, provide relevant evidence from clinical settings, and listen to specific objections — not to force compliance or avoid the issue.",
    },
  },
  {
    orderIndex: 109, title: 'Tell Me About Lean Methodology',
    description: 'Explain Lean principles and how you have applied them in a PM context.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 15,
    content: {
      question: 'Can you explain the core principles of Lean methodology and give me an example of how you have applied them in a project management context?',
      context: 'You are being interviewed for a Senior PM role at a large public sector organisation with a Lean transformation programme.',
      guidance: 'Cover the 5 Lean principles (Value, Value Stream, Flow, Pull, Perfection). Reference at least 2 Lean tools (Gemba walk, value stream mapping, 5 Whys, Kaizen, Standard Work, TIMWOODS). Give a specific example. Aim for 280-380 words.',
      scoringCriteria: 'All 5 Lean principles mentioned. At least 2 tools referenced. Specific example given. Application to PM context clear.',
    },
  },
  {
    orderIndex: 110, title: 'The NHS Discharge Improvement Programme (Full Project)',
    description: 'Lead a full Lean improvement programme to reduce hospital discharge delays across 3 wards.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 60,
    content: {
      stages: [
        {
          id: 1, title: 'Stage 1 — Gemba and Current State', description: 'Observe the process and map the current state.',
          scenario: "You are leading a Lean improvement programme to reduce discharge delays across 3 wards at an NHS Trust. Average discharge time (from clinical decision to patient leaving): Ward A: 5.2 hours, Ward B: 3.8 hours, Ward C: 6.1 hours. Target: 2 hours across all wards. You have 3 months. Your first week: what do you do?",
          options: [
            { id: 'A', text: 'Analyse the last 6 months of discharge data and build a report', consequence: 'Data analysis without observation will miss the real causes of delay. Start with the Gemba walk.', score: 2 },
            { id: 'B', text: 'Conduct Gemba walks on all 3 wards during peak discharge time (10am-2pm). Observe and document every step from clinical decision to patient departure. Map the current state with the ward teams.', consequence: 'Correct. The Gemba walk is the Lean starting point. Observing reality during peak time on all 3 wards gives you the evidence base for the value stream map.', score: 4 },
            { id: 'C', text: 'Run a workshop with ward managers to agree the target state before observing the current state', consequence: 'Designing the target state before understanding the current state is a classic Lean mistake.', score: 1 },
            { id: 'D', text: 'Benchmark against a Trust that has achieved 2-hour discharge and copy their approach', consequence: "Copying another Trust's solution without understanding your own wards will produce solutions that don't fit.", score: 1 },
          ],
          takeaway: 'The Gemba walk is always the first step. You cannot improve a process you have not observed.',
        },
        {
          id: 2, title: 'Stage 2 — Root Cause and Countermeasures', description: 'Identify root causes and agree countermeasures with the ward teams.',
          scenario: "Your value stream maps reveal the top 3 causes of delay across all 3 wards: (1) Pharmacy takes 2-3 hours to prepare discharge medications. (2) Transport is booked too late — average 90-minute wait. (3) Discharge letters are written after the patient has left, causing re-admission risk. Which countermeasure do you prioritise first?",
          options: [
            { id: 'A', text: 'Prioritise the discharge letter issue — re-admission risk is a patient safety concern', consequence: 'Patient safety is important but the discharge letter issue does not directly cause the delay. Prioritise the highest-impact delay cause first.', score: 2 },
            { id: 'B', text: 'Prioritise pharmacy — at 2-3 hours it is the single largest contributor to the 5+ hour discharge time. Work with pharmacy to introduce a same-day discharge medication preparation process.', consequence: 'Correct. Pharmacy is the single largest delay cause. Addressing it first will have the greatest impact on the overall discharge time.', score: 4 },
            { id: 'C', text: 'Address all three simultaneously to maximise speed of improvement', consequence: 'Addressing all three simultaneously makes it impossible to measure the impact of each change and risks overwhelming the ward teams.', score: 1 },
            { id: 'D', text: 'Prioritise transport — it is the easiest to fix', consequence: 'Prioritising the easiest fix rather than the highest-impact fix is not a Lean approach.', score: 2 },
          ],
          takeaway: 'Prioritise countermeasures by impact, not ease. The highest-impact cause of delay should be addressed first.',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE B — SIX SIGMA
  // ════════════════════════════════════════════════════════════
  {
    orderIndex: 111, title: 'What Problem Are We Actually Solving?',
    description: 'Define the problem correctly before jumping to solutions — the Define phase of DMAIC.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'confidence_builder', estimatedMinutes: 8,
    content: {
      scenario: "You are leading a Six Sigma project at a financial services firm. The sponsor says: \"We need to reduce the number of customer complaints about our mortgage application process. Last year we had 847 complaints.\" Before starting the Measure phase, you need to define the problem precisely. Which problem statement is best?",
      options: [
        { id: 'A', text: '"Reduce customer complaints about mortgage applications."', consequence: 'Too vague. This does not specify what type of complaints, what the current baseline is, what the target is, or by when.', score: 1 },
        { id: 'B', text: '"The mortgage application process generates 847 complaints per year, primarily related to communication delays (62% of complaints). The target is to reduce communication-related complaints by 50% within 6 months."', consequence: 'Correct. This problem statement is specific, measurable, and time-bound. It identifies the primary complaint category and sets a clear target.', score: 4 },
        { id: 'C', text: '"Improve the mortgage application process to reduce customer dissatisfaction."', consequence: 'Too vague. "Customer dissatisfaction" is not measurable and does not specify the process or the target.', score: 1 },
        { id: 'D', text: '"Fix the communication problems in the mortgage application team."', consequence: 'This jumps to a solution (fix the team) before the problem has been properly defined or measured.', score: 2 },
      ],
      takeaway: 'A Six Sigma problem statement must be specific, measurable, and time-bound. It describes the gap between current and target performance — not the solution.',
    },
  },
  {
    orderIndex: 112, title: 'Measuring What Matters',
    description: 'Select the right metrics for a Six Sigma Measure phase in a healthcare setting.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 9,
    content: {
      scenario: "You are in the Measure phase of a DMAIC project to reduce medication errors on a hospital ward. The ward manager wants to measure: (1) number of medication errors per month, (2) staff satisfaction with the medication process, (3) time taken to administer medications, (4) number of near-misses reported. Which metrics should be your primary focus?",
      options: [
        { id: 'A', text: 'Staff satisfaction — if staff are happy with the process, errors will reduce', consequence: 'Staff satisfaction is a lagging indicator and a correlate, not a direct measure of medication errors. It should not be the primary metric.', score: 1 },
        { id: 'B', text: 'Medication errors per month AND near-misses reported — these directly measure the problem and its precursors', consequence: 'Correct. Medication errors per month measures the defect rate directly. Near-misses are leading indicators that predict future errors. Together they give a complete picture.', score: 4 },
        { id: 'C', text: 'Time taken to administer medications — speed is the root cause of errors', consequence: 'Time is a potential cause, not a measure of the problem. In the Measure phase, measure the problem first, then investigate causes.', score: 2 },
        { id: 'D', text: 'All four metrics equally — more data is always better', consequence: 'Measuring everything equally dilutes focus. The Measure phase requires selecting the Critical to Quality (CTQ) metrics that directly measure the problem.', score: 1 },
      ],
      takeaway: 'The Measure phase focuses on Critical to Quality (CTQ) metrics — those that directly measure the defect or problem. Leading indicators (near-misses) are valuable alongside the primary defect metric.',
    },
  },
  {
    orderIndex: 113, title: 'Analysing the Data — Finding the Vital Few',
    description: 'Use Pareto analysis to identify the vital few causes of a defect.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'confidence_builder', estimatedMinutes: 9,
    content: {
      scenario: "You are in the Analyse phase of a DMAIC project to reduce invoice processing errors at a council. Your data shows: Wrong supplier details: 34% of errors. Missing approval signature: 28% of errors. Wrong cost centre code: 22% of errors. Duplicate invoice: 9% of errors. Other: 7% of errors. You have limited resource for the Improve phase. What does the Pareto principle tell you to focus on?",
      options: [
        { id: 'A', text: 'Focus on all 5 causes equally — every error matters', consequence: 'Treating all causes equally ignores the Pareto principle. 80% of errors come from 20% of causes — focusing equally on all causes is inefficient.', score: 1 },
        { id: 'B', text: 'Focus on the top 3 causes (wrong supplier details, missing approval signature, wrong cost centre code) — they account for 84% of all errors', consequence: 'Correct. The Pareto principle (80/20 rule) tells you to focus on the vital few causes that account for the majority of defects. The top 3 causes account for 84% of errors.', score: 4 },
        { id: 'C', text: 'Focus on duplicate invoices — they are the easiest to fix', consequence: 'Fixing the easiest cause rather than the highest-impact causes is not a Six Sigma approach.', score: 2 },
        { id: 'D', text: 'Focus on the "Other" category — unknown causes are the most dangerous', consequence: 'The "Other" category accounts for only 7% of errors. Focusing on it ignores the 84% accounted for by the top 3 causes.', score: 1 },
      ],
      takeaway: 'The Pareto principle is central to Six Sigma analysis. Focus improvement effort on the vital few causes that account for the majority of defects — not on all causes equally.',
    },
  },
  {
    orderIndex: 114, title: 'Build a DMAIC Project Charter',
    description: 'Write a Six Sigma project charter for a customer service improvement project.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are leading a Six Sigma project to reduce the average call handling time in a local authority contact centre. Current average: 8.4 minutes. Industry benchmark: 5.2 minutes. The contact centre handles 12,000 calls per month. The sponsor is the Head of Customer Services.',
      fields: [
        { id: 'problem_statement', label: 'Problem Statement', placeholder: 'Specific, measurable description of the problem. Include current baseline and target.' },
        { id: 'business_case', label: 'Business Case', placeholder: 'Why does this matter? What is the cost/impact of the current performance?' },
        { id: 'scope', label: 'Project Scope', placeholder: 'What is in scope? What is explicitly out of scope?' },
        { id: 'goals', label: 'Goals and Metrics', placeholder: 'What are the measurable targets? How will success be defined?' },
        { id: 'team', label: 'Team and Roles', placeholder: 'Who is the sponsor, project lead, team members, and process owner?' },
        { id: 'timeline', label: 'DMAIC Timeline', placeholder: 'Estimated duration for each DMAIC phase.' },
      ],
      scoringCriteria: 'Problem statement must be measurable. Business case must quantify impact. Scope must have explicit boundaries. Goals must be SMART. Timeline must include all 5 DMAIC phases.',
    },
  },
  {
    orderIndex: 115, title: 'Control Phase — Sustaining the Gain',
    description: 'Design a control plan to sustain a Six Sigma improvement in a manufacturing-style public sector process.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: "Your Six Sigma project has successfully reduced invoice processing errors from 18% to 3.2%. The project is now in the Control phase. The sponsor wants to close the project and move on. You recommend a control plan. The sponsor says: \"We've fixed it — why do we need a control plan?\" How do you respond?",
      options: [
        { id: 'A', text: "Agree with the sponsor — the project has achieved its goal and can be closed", consequence: 'Closing a Six Sigma project without a control plan is one of the most common reasons improvements revert. The gain will not be sustained.', score: 1 },
        { id: 'B', text: "Explain that without a control plan, the process will revert to its old state within 3-6 months. The control plan defines who monitors what, at what frequency, and what action is taken when the process goes out of control. It is the mechanism that sustains the gain.", consequence: 'Correct. The Control phase is not optional — it is the mechanism that prevents reversion. A control plan with defined metrics, monitoring frequency, and response procedures is essential.', score: 4 },
        { id: 'C', text: 'Agree to close the project but schedule a 6-month review', consequence: 'A 6-month review without a control plan means the process will have reverted before the review takes place.', score: 2 },
        { id: 'D', text: 'Escalate to the sponsor\'s manager to insist on a control plan', consequence: "Escalating over the sponsor's head without first making the case directly will damage the relationship and is not necessary.", score: 1 },
      ],
      takeaway: 'The Control phase is not the end of the project — it is the beginning of sustained performance. A control plan with defined metrics, monitoring, and response procedures is essential to prevent reversion.',
    },
  },
  {
    orderIndex: 116, title: 'Tell Me About Six Sigma DMAIC',
    description: 'Explain the DMAIC framework and how you have applied it.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Can you walk me through the DMAIC framework and give me an example of how you have used it to improve a process?',
      context: 'You are being interviewed for a Process Improvement Manager role at a large NHS Trust.',
      guidance: 'Explain each DMAIC phase clearly. Give a specific example for at least 2 phases. Reference tools used (problem statement, CTQ metrics, Pareto analysis, fishbone diagram, control chart). Aim for 280-380 words.',
      scoringCriteria: 'All 5 DMAIC phases explained. At least 2 phases illustrated with a specific example. Tools referenced naturally. Application to a real or realistic context.',
    },
  },
  {
    orderIndex: 117, title: 'Fishbone Diagram — Cause and Effect',
    description: 'Use a fishbone (Ishikawa) diagram to identify causes of a high defect rate.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'confidence_builder', estimatedMinutes: 18,
    content: {
      projectBrief: 'You are in the Analyse phase of a DMAIC project to reduce the error rate in benefit payment processing at a local authority. Current error rate: 14%. Target: 3%. You need to conduct a fishbone (Ishikawa) diagram analysis to identify all potential causes of the errors.',
      fields: [
        { id: 'people', label: 'People (causes related to staff)', placeholder: 'What people-related factors could be causing the 14% error rate? Consider training, experience, workload, motivation.' },
        { id: 'process', label: 'Process (causes related to the process itself)', placeholder: 'What process-related factors could be causing errors? Consider steps, handoffs, decision points, documentation.' },
        { id: 'technology', label: 'Technology (causes related to systems)', placeholder: 'What technology-related factors could be causing errors? Consider system design, data validation, integration.' },
        { id: 'environment', label: 'Environment (causes related to context)', placeholder: 'What environmental factors could be causing errors? Consider workload peaks, interruptions, workspace.' },
        { id: 'top_causes', label: 'Top 3 Root Causes to Investigate', placeholder: 'Based on your fishbone analysis, which 3 causes are most likely to be driving the 14% error rate? Explain your reasoning.' },
      ],
      scoringCriteria: 'At least 3 specific causes per category. Top 3 root causes must be justified by the fishbone analysis. Causes must be specific, not generic.',
    },
  },
  {
    orderIndex: 118, title: 'Six Sigma vs Lean — When to Use Which',
    description: 'Choose the right improvement methodology for three different scenarios.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 10,
    content: {
      scenario: "You are Head of Improvement at an NHS Trust. Three improvement requests have landed on your desk:\n\n1. Ward A: Patient discharge takes too long — average 5 hours, target 2 hours. The process has many steps and lots of waiting time.\n2. Ward B: Medication error rate is 8% — far above the 1% target. The causes are unclear.\n3. Ward C: Staff are spending 40% of their time on administrative tasks that don't add value to patient care.\n\nWhich methodology is best suited to each scenario?",
      options: [
        { id: 'A', text: 'Lean for all three — Lean is always the right starting point', consequence: 'Lean is excellent for flow and waste, but Six Sigma is better suited to defect reduction where the causes are unclear and data analysis is needed.', score: 2 },
        { id: 'B', text: 'Lean for Wards A and C (flow and waste problems); Six Sigma DMAIC for Ward B (defect reduction with unclear causes)', consequence: 'Correct. Lean is best for flow improvement and waste elimination. Six Sigma DMAIC is best for defect reduction where the causes need to be identified through data analysis.', score: 4 },
        { id: 'C', text: 'Six Sigma for all three — data-driven approaches are always superior', consequence: 'Six Sigma is powerful for defect reduction but is overkill for flow and waste problems where the causes are visible through observation.', score: 2 },
        { id: 'D', text: 'Use the same methodology for all three to keep things simple', consequence: 'Using the same methodology regardless of the problem type will produce suboptimal results.', score: 1 },
      ],
      takeaway: 'Lean and Six Sigma are complementary, not competing. Lean is best for flow and waste problems. Six Sigma DMAIC is best for defect reduction where causes are unclear and data analysis is needed.',
    },
  },
  {
    orderIndex: 119, title: 'Tell Me About a Time You Used Data to Drive Improvement',
    description: 'Demonstrate data-driven decision making in a PM or improvement context.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you used data to identify a problem and drive an improvement. What data did you use, how did you analyse it, and what was the outcome?',
      context: 'You are being interviewed for a Senior PM role at a large financial services organisation with a Six Sigma improvement programme.',
      guidance: 'Use STAR. Be specific about the data you used and how you analysed it. Reference Six Sigma tools if applicable (Pareto, fishbone, control charts). Show that the data led to a specific insight that would not have been visible without it. Quantify the outcome. Aim for 300-400 words.',
      scoringCriteria: 'Specific data described. Analysis method explained. Data-driven insight identified. Outcome quantified or described with evidence. Reflection on what the data revealed that was not previously known.',
    },
  },
  {
    orderIndex: 120, title: 'The Contact Centre DMAIC Project (Full Project)',
    description: 'Lead a full DMAIC project to reduce average call handling time from 8.4 to 5.2 minutes.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 65,
    content: {
      stages: [
        {
          id: 1, title: 'Define', description: 'Define the problem, scope, and success criteria.',
          scenario: "You are leading a Six Sigma project to reduce average call handling time in a local authority contact centre from 8.4 minutes to 5.2 minutes. The sponsor is the Head of Customer Services. Before starting the Measure phase, you need to define the project precisely. Which problem statement is best?",
          options: [
            { id: 'A', text: '"Improve call handling efficiency in the contact centre."', consequence: 'Too vague. No baseline, no target, no timeframe.', score: 1 },
            { id: 'B', text: '"The contact centre average call handling time is 8.4 minutes against an industry benchmark of 5.2 minutes. This costs an estimated £180,000 per year in excess staff time. The target is to reduce average handling time to 5.5 minutes within 6 months."', consequence: 'Correct. Specific, measurable, time-bound, with a business case. This is a strong DMAIC problem statement.', score: 4 },
            { id: 'C', text: '"Call handlers are spending too long on calls because they are not trained well enough."', consequence: 'This jumps to a cause and solution before the problem has been measured.', score: 1 },
            { id: 'D', text: '"Reduce the number of complaints about call handling time."', consequence: 'Complaints are a lagging indicator. The primary metric should be call handling time itself.', score: 2 },
          ],
          takeaway: 'A DMAIC problem statement must be specific, measurable, and time-bound. It describes the gap — not the cause or solution.',
        },
        {
          id: 2, title: 'Measure', description: 'Baseline current performance and identify CTQ metrics.',
          scenario: "You are in the Measure phase. You have 4 weeks of call data. Analysis shows: 31% of calls are resolved on first contact. 69% require a callback or transfer. Average time on transferred calls: 12.3 minutes. Average time on first-contact-resolved calls: 4.1 minutes. What does this data tell you about where to focus the Improve phase?",
          options: [
            { id: 'A', text: 'Focus on reducing the time of all calls equally', consequence: 'Reducing all call times equally ignores the data showing that transferred calls are 3x longer than first-contact-resolved calls.', score: 1 },
            { id: 'B', text: 'Focus on increasing first contact resolution rate — if 69% of calls require a callback or transfer, reducing that rate will have the greatest impact on average handling time', consequence: 'Correct. The data shows that transferred calls are 3x longer. Increasing first contact resolution is the highest-impact lever for reducing average handling time.', score: 4 },
            { id: 'C', text: 'Focus on the 31% of calls that are resolved on first contact — they are already performing well', consequence: 'Focusing on the already-performing calls misses the 69% that are driving the high average handling time.', score: 1 },
            { id: 'D', text: 'The data is not sufficient — more measurement is needed before analysis', consequence: 'The data clearly shows where the problem lies. Calling for more measurement is avoidance.', score: 2 },
          ],
          takeaway: 'Measure phase data should direct the Analyse and Improve phases. When data shows that a specific subset of the process is driving the majority of the problem, focus improvement effort there.',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE C — PRINCE2 PRACTITIONER
  // ════════════════════════════════════════════════════════════
  {
    orderIndex: 121, title: 'Tailoring PRINCE2 — How Much Process Is Enough?',
    description: 'A small project team is drowning in PRINCE2 documentation. How do you tailor appropriately?',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: "You are PM on a 3-month internal systems upgrade project. Budget: £45,000. Team: 4 people. Your organisation uses PRINCE2. The project support officer has produced a full set of PRINCE2 management products: Project Initiation Document, Business Case, Risk Register, Issue Register, Quality Register, Communication Management Strategy, Risk Management Strategy, Quality Management Strategy, Configuration Management Strategy, and a full set of stage plans. The team is spending more time on documentation than on the project. What do you do?",
      options: [
        { id: 'A', text: 'Maintain all management products — PRINCE2 requires them', consequence: "PRINCE2 explicitly requires tailoring to the project's scale and complexity. Maintaining a full set of management products for a £45,000 3-month project is over-engineering.", score: 1 },
        { id: 'B', text: 'Tailor the management products to the project scale: combine the PID with the Business Case, use a single risk/issue log, replace strategy documents with brief sections in the PID, and use a simplified stage plan.', consequence: 'Correct. PRINCE2 requires tailoring. For a small, low-risk project, combining and simplifying management products is appropriate and expected.', score: 4 },
        { id: 'C', text: 'Abandon PRINCE2 entirely and use an informal approach', consequence: "Abandoning PRINCE2 entirely is not tailoring — it's non-compliance. The organisation's governance framework still applies.", score: 1 },
        { id: 'D', text: 'Ask the Project Board to approve a reduced set of management products', consequence: 'Seeking approval for tailoring is good governance, but the PM should propose the tailored approach, not ask the Project Board to decide what to remove.', score: 2 },
      ],
      takeaway: "PRINCE2's principle of tailoring to the project environment means that management products should be proportionate to the project's scale, complexity, and risk. Over-engineering small projects is a PRINCE2 failure, not a success.",
    },
  },
  {
    orderIndex: 122, title: 'The Project Board That Does Not Engage',
    description: 'Your Project Board has not met for 6 weeks and key decisions are blocked.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: "You are PM on a PRINCE2 project. The Project Board has not met for 6 weeks. Two key decisions are blocked: approval of the next stage plan and a decision on a significant change request. The project is approaching the end of Stage 2. The Senior Responsible Owner (SRO) is very busy and has cancelled 3 meetings. What do you do?",
      options: [
        { id: 'A', text: 'Proceed to Stage 3 without Project Board approval — the project cannot afford to wait', consequence: "Proceeding to the next stage without Project Board approval is a fundamental breach of PRINCE2's controlled stages principle. The PM has no authority to proceed.", score: 1 },
        { id: 'B', text: 'Raise an exception — the project cannot proceed without Project Board decisions. Request an emergency decision via email or a 30-minute call. If the SRO remains unavailable, escalate to the Programme Manager or sponsor.', consequence: "Correct. PRINCE2's exception process exists precisely for this situation. The PM must raise the issue formally and escalate if necessary — not proceed without authority.", score: 4 },
        { id: 'C', text: 'Make the decisions yourself and inform the Project Board retrospectively', consequence: "Making Project Board decisions as PM is a governance failure. The PM manages within the tolerances set by the Project Board — they do not replace it.", score: 1 },
        { id: 'D', text: 'Wait until the SRO is available — the project can absorb the delay', consequence: "Waiting indefinitely without escalating is passive project management. The PM's role is to proactively manage the situation.", score: 2 },
      ],
      takeaway: "PRINCE2's controlled stages principle means the PM cannot proceed to the next stage without Project Board approval. When the Project Board is unavailable, the PM must escalate — not proceed without authority.",
    },
  },
  {
    orderIndex: 123, title: 'Managing Product Delivery — Contractor Handoff',
    description: 'A contractor is delivering a work package and quality is not meeting the acceptance criteria.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: "You are PM on a PRINCE2 project. A contractor is delivering a key work package (a new data migration tool). The agreed acceptance criteria include: 99.5% data accuracy, full audit trail, and completion by Week 8. It is Week 7. The contractor has delivered a prototype. Testing shows 97.8% data accuracy and no audit trail. The contractor says they will fix it by Week 10. What do you do?",
      options: [
        { id: 'A', text: 'Accept the delivery — 97.8% accuracy is close enough and the audit trail can be added later', consequence: 'Accepting a delivery that does not meet the agreed acceptance criteria is a quality management failure. "Close enough" is not PRINCE2.', score: 1 },
        { id: 'B', text: 'Reject the delivery formally. Raise an issue in the Issue Register. Assess the impact on the stage plan and project tolerances. Escalate to the Project Board if the delay takes the project outside tolerance.', consequence: 'Correct. PRINCE2 requires formal rejection of products that do not meet acceptance criteria. The issue must be logged, the impact assessed, and the Project Board informed if tolerances are breached.', score: 4 },
        { id: 'C', text: 'Negotiate with the contractor to accept 98.5% accuracy as a revised acceptance criterion', consequence: 'Revising acceptance criteria without Project Board approval is a scope change that requires formal change control.', score: 2 },
        { id: 'D', text: 'Replace the contractor immediately', consequence: 'Replacing the contractor without first following the formal issue and change control process will create contractual and project risks.', score: 1 },
      ],
      takeaway: "PRINCE2's quality theme requires formal rejection of products that do not meet acceptance criteria. Issues must be logged, impacts assessed, and the Project Board informed if tolerances are breached.",
    },
  },
  {
    orderIndex: 124, title: 'Build a PRINCE2 Exception Report',
    description: 'Write a PRINCE2 exception report for a project that has gone outside its cost tolerance.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are PM on a PRINCE2 project to implement a new HR system. The approved Stage 3 budget is £180,000 with a tolerance of +/- £15,000. You have just discovered that the integration work will cost an additional £35,000 due to unexpected complexity in the legacy system. This takes the forecast cost to £215,000 — outside the +/- £15,000 tolerance. You must write an exception report for the Project Board.',
      fields: [
        { id: 'cause', label: 'Cause of Exception', placeholder: 'What caused the forecast to go outside tolerance? Be specific.' },
        { id: 'impact', label: 'Impact Assessment', placeholder: 'What is the impact on cost, time, scope, quality, risk, and benefits?' },
        { id: 'options', label: 'Options (at least 3)', placeholder: 'What are the options available to the Project Board? Include do nothing.' },
        { id: 'recommendation', label: 'PM Recommendation', placeholder: 'Which option do you recommend and why?' },
        { id: 'lessons', label: 'Lessons to be Learned', placeholder: 'What could have been done differently to prevent this exception?' },
      ],
      scoringCriteria: 'Cause must be specific. Impact must cover all 6 performance targets. At least 3 options including do nothing. Recommendation must be justified. Lessons must be actionable.',
    },
  },
  {
    orderIndex: 125, title: 'Tell Me How You Have Used PRINCE2',
    description: 'Demonstrate practical PRINCE2 application in a real project context.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a project where you applied PRINCE2. How did you tailor it to the project environment, and what specific PRINCE2 principles or processes made a difference?',
      context: 'You are being interviewed for a Senior PM role at a large public sector organisation that uses PRINCE2 as its standard methodology.',
      guidance: 'Use STAR. Reference specific PRINCE2 elements: principles (continued business justification, manage by exception, etc.), themes (business case, risk, quality, change), or processes (starting up, directing, controlling). Show that you tailored appropriately. Aim for 280-380 words.',
      scoringCriteria: 'Specific PRINCE2 elements referenced. Tailoring approach described. Practical application shown. Outcome described with evidence of PRINCE2 contributing to success.',
    },
  },
  {
    orderIndex: 126, title: 'Change Control — Scope Creep Under Pressure',
    description: 'A senior stakeholder is requesting a significant scope change mid-project.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: "You are PM on a PRINCE2 project to implement a new payroll system. You are in Stage 3 of 4. The Finance Director calls you and says: \"While we're doing this, can we also integrate the expenses system? It will save us doing a separate project next year.\" The integration would add approximately 6 weeks and £40,000 to the project. What do you do?",
      options: [
        { id: 'A', text: 'Agree to add the integration — the Finance Director is a key stakeholder and it makes business sense', consequence: "Agreeing to scope changes without following PRINCE2's change control process bypasses the Project Board and undermines the approved Business Case.", score: 1 },
        { id: 'B', text: 'Log the request as a change request in the Issue Register. Assess the impact on the project plan, budget, and tolerances. Present the change request to the Project Board for a decision.', consequence: "Correct. PRINCE2's change theme requires all scope changes to go through formal change control. The PM assesses the impact and presents it to the Project Board — not makes the decision unilaterally.", score: 4 },
        { id: 'C', text: 'Reject the request — the project scope is fixed', consequence: "Rejecting a change request without assessing it or presenting it to the Project Board is not PRINCE2. The PM's role is to assess and escalate, not to decide.", score: 2 },
        { id: 'D', text: 'Agree to add the integration but absorb the cost within existing contingency', consequence: 'Using contingency to absorb an unassessed scope change without Project Board approval is a governance failure.', score: 1 },
      ],
      takeaway: "PRINCE2's change theme requires all scope changes to go through formal change control. The PM assesses the impact and presents options to the Project Board — they do not make scope decisions unilaterally.",
    },
  },
  {
    orderIndex: 127, title: 'Risk Management — Escalating to the Project Board',
    description: 'A risk has materialised and is threatening the project business case.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: "You are PM on a PRINCE2 project. A key supplier has gone into administration. This was on the Risk Register as a medium-probability, high-impact risk with a contingency plan (alternative supplier identified). The contingency supplier has quoted 40% more than the original supplier. This takes the project 25% over budget — outside the Project Board's approved tolerance. What do you do?",
      options: [
        { id: 'A', text: 'Activate the contingency plan (switch to the alternative supplier) and absorb the cost within project contingency', consequence: "The additional cost takes the project 25% over budget — outside tolerance. Activating the contingency without Project Board approval when outside tolerance is a breach of PRINCE2's manage by exception principle.", score: 1 },
        { id: 'B', text: 'Raise an exception immediately. Present the situation to the Project Board with the options: activate the contingency supplier at 40% premium, re-scope the project to reduce cost, or close the project if the business case no longer holds.', consequence: "Correct. When a risk materialises and takes the project outside tolerance, PRINCE2 requires the PM to raise an exception and present the Project Board with options. The PM does not make the decision.", score: 4 },
        { id: 'C', text: 'Negotiate with the contingency supplier to reduce their quote before escalating', consequence: 'Negotiating is sensible, but the project is already outside tolerance. The Project Board must be informed immediately — not after negotiation.', score: 2 },
        { id: 'D', text: 'Close the project — the business case no longer holds', consequence: "Closing the project is a Project Board decision, not a PM decision. The PM must present the situation and options to the Project Board.", score: 1 },
      ],
      takeaway: "PRINCE2's manage by exception principle means the PM must escalate when the project goes outside tolerance — even when a contingency plan exists. The Project Board makes the decision; the PM presents the options.",
    },
  },
  {
    orderIndex: 128, title: 'Build a PRINCE2 Business Case',
    description: 'Write a PRINCE2 Business Case for a digital transformation project.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 25,
    content: {
      projectBrief: 'You are PM on a project to replace a 15-year-old case management system at a local authority. The current system costs £280,000 per year in maintenance. The new system will cost £750,000 to implement and £95,000 per year to maintain. Expected benefits: £180,000 per year in efficiency savings, £45,000 per year in reduced error costs, improved staff satisfaction, and better data quality for reporting.',
      fields: [
        { id: 'reasons', label: 'Reasons', placeholder: 'Why is this project needed? What problem does it solve?' },
        { id: 'options', label: 'Business Options', placeholder: 'What are the options? Include do nothing. Which is recommended?' },
        { id: 'benefits', label: 'Expected Benefits', placeholder: 'Quantify financial and non-financial benefits. Include timing.' },
        { id: 'risks', label: 'Expected Dis-benefits and Risks', placeholder: 'What could go wrong? What are the dis-benefits?' },
        { id: 'timescale', label: 'Timescale', placeholder: 'When will the project deliver? When will benefits be realised?' },
        { id: 'costs', label: 'Costs and Investment Appraisal', placeholder: 'Total cost of ownership. Payback period. NPV if applicable.' },
      ],
      scoringCriteria: 'Options must include do nothing. Benefits must be quantified. Investment appraisal must include payback period. Risks must be specific. Timescale must distinguish project delivery from benefit realisation.',
    },
  },
  {
    orderIndex: 129, title: 'Tell Me About Managing Risk on a Complex Project',
    description: 'Demonstrate risk management capability in a PRINCE2 context.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you identified and managed a significant risk on a project. How did you identify it, what was your response strategy, and what was the outcome?',
      context: 'You are being interviewed for a Programme Manager role at a large NHS Trust. The panel includes the Chief Operating Officer.',
      guidance: 'Use STAR. Reference PRINCE2 risk management concepts: probability/impact, risk appetite, response strategies (avoid, reduce, transfer, accept, exploit). Show that you identified the risk early and had a structured response. Aim for 280-380 words.',
      scoringCriteria: 'Risk identified early (not after it materialised). Response strategy described using PRINCE2 terminology. Outcome described with evidence. Reflection on what the risk management approach contributed.',
    },
  },
  {
    orderIndex: 130, title: 'The NHS Digital Transformation Programme (Full Project)',
    description: 'Lead a PRINCE2 programme to implement a new patient record system across 4 hospital sites.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 65,
    content: {
      stages: [
        {
          id: 1, title: 'Initiating the Project', description: 'Set up the project governance and produce the PID.',
          scenario: "You are PM on a PRINCE2 project to implement a new electronic patient record (EPR) system across 4 hospital sites. Budget: £2.4m. Duration: 18 months. The Project Board includes the CEO (SRO), CFO (Senior Supplier), and Chief Nursing Officer (Senior User). In the Initiating a Project process, which management product is most critical to get right first?",
          options: [
            { id: 'A', text: 'The Project Plan — you need to know the timeline before anything else', consequence: 'The Project Plan cannot be developed until the Business Case, scope, and approach have been agreed. Starting with the plan puts the cart before the horse.', score: 1 },
            { id: 'B', text: 'The Business Case — it defines why the project is justified and will be used to make every major decision throughout the project', consequence: "Correct. The Business Case is the foundation of PRINCE2. It defines the justification for the project and is used to assess every major decision, change, and exception throughout the project lifecycle.", score: 4 },
            { id: 'C', text: 'The Risk Register — an EPR implementation is high risk and risks must be identified first', consequence: 'Risk identification is important but cannot be done effectively until the scope and approach are defined in the Business Case.', score: 2 },
            { id: 'D', text: 'The Communication Management Strategy — stakeholder management is the most critical success factor', consequence: 'Stakeholder management is important but the Communication Management Strategy cannot be developed until the project scope and governance are defined.', score: 1 },
          ],
          takeaway: "PRINCE2's principle of continued business justification means the Business Case is the foundation of every project. It must be developed first and reviewed at every stage boundary.",
        },
        {
          id: 2, title: 'Stage Boundary — Go/No-Go Decision', description: 'Present the end-of-stage assessment to the Project Board.',
          scenario: "You are at the end of Stage 2 (design and procurement). The Project Board must decide whether to proceed to Stage 3 (implementation). Your end-of-stage report shows: the selected supplier has delivered the design on time and within budget. However, a new risk has emerged: the legacy system at Site 3 is more complex than anticipated and integration will cost an additional £180,000 and 3 months. This takes the overall project 12% over budget. What do you present to the Project Board?",
          options: [
            { id: 'A', text: 'Present the stage as successful and recommend proceeding — the risk can be managed in Stage 3', consequence: 'Presenting a stage as successful while concealing a significant cost and time overrun is a governance failure.', score: 1 },
            { id: 'B', text: 'Present the full picture: Stage 2 delivered as planned, but a new risk has emerged that takes the project 12% over budget. Present 3 options: proceed with additional funding, re-scope to exclude Site 3, or close the project. Recommend the option that best preserves the Business Case.', consequence: 'Correct. The Project Board must have the full picture to make an informed go/no-go decision. The PM presents options and a recommendation — not a sanitised view.', score: 4 },
            { id: 'C', text: 'Recommend closing the project — the Business Case no longer holds', consequence: "Recommending closure is one option, but the PM should present all options and let the Project Board decide. The Business Case may still hold with re-scoping.", score: 2 },
            { id: 'D', text: 'Proceed to Stage 3 without informing the Project Board of the new risk', consequence: 'Proceeding without informing the Project Board of a significant new risk is a fundamental governance failure.', score: 1 },
          ],
          takeaway: "PRINCE2's stage boundary process requires the PM to present the full picture to the Project Board — including new risks and their impact on the Business Case. The Project Board makes the go/no-go decision with full information.",
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE D — MSP (Managing Successful Programmes)
  // ════════════════════════════════════════════════════════════
  {
    orderIndex: 141, title: 'What Is a Programme? (And What Is Not)',
    description: 'Distinguish between a project, a programme, and a portfolio in a real-world scenario.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'confidence_builder', estimatedMinutes: 8,
    content: {
      scenario: "A large NHS Trust is planning the following: (A) Implement a new electronic patient record system — 18 months, £2.4m, one supplier, defined scope. (B) Transform the Trust's model of care from hospital-centred to community-centred — 5 years, multiple interdependent projects, significant cultural and operational change, benefits realised over time. (C) Manage 22 active projects across 4 directorates, prioritising resource and reporting to the Board. Which is a project, which is a programme, and which is a portfolio?",
      options: [
        { id: 'A', text: 'A = project, B = portfolio, C = programme', consequence: 'Incorrect. B is a programme (multiple interdependent projects delivering transformational change). C is a portfolio (managing multiple projects at organisational level).', score: 1 },
        { id: 'B', text: 'A = project, B = programme, C = portfolio', consequence: 'Correct. A is a defined-scope, single-supplier project. B is a transformational programme with multiple interdependent projects and benefits realised over time. C is a portfolio — managing multiple projects at organisational level.', score: 4 },
        { id: 'C', text: 'A = programme, B = project, C = portfolio', consequence: 'Incorrect. A is a project (defined scope, single supplier, fixed timeline). B is a programme (transformational, multiple interdependent projects).', score: 1 },
        { id: 'D', text: 'All three are programmes', consequence: 'Not all complex initiatives are programmes. A programme has specific characteristics: transformational intent, multiple interdependent projects, benefits realised over time.', score: 1 },
      ],
      takeaway: 'A project delivers a defined output. A programme delivers transformational change through multiple interdependent projects. A portfolio manages multiple projects/programmes at organisational level. Understanding the distinction determines the right governance approach.',
    },
  },
  {
    orderIndex: 142, title: 'The Vision Statement That No One Believes',
    description: 'The programme vision statement is too vague to drive real change.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: "You are Programme Manager for a digital transformation programme at a large housing association. The Programme Board has approved the following vision statement: 'To become a digitally enabled organisation that delivers excellent services to our customers.' Six months in, the 8 project managers in the programme are making conflicting decisions about technology choices, process design, and customer experience. Each is interpreting the vision differently. What is the problem and what do you do?",
      options: [
        { id: 'A', text: 'The problem is the project managers — they need clearer direction from their line managers', consequence: 'The root cause is the vision statement, not the project managers. A vague vision produces inconsistent decisions at project level.', score: 1 },
        { id: 'B', text: "The problem is the vision statement — it is too vague to drive consistent decisions. Facilitate a Programme Board workshop to produce a more specific Blueprint: what the organisation will look, feel, and operate like when the programme is complete. Use the Blueprint to align all 8 projects.", consequence: 'Correct. MSP uses the Blueprint — a description of the future state — to align all projects in a programme. A vague vision produces inconsistent decisions; a specific Blueprint produces alignment.', score: 4 },
        { id: 'C', text: 'The problem is the governance structure — the project managers need more regular reporting requirements', consequence: 'More reporting will not resolve the underlying alignment problem. The project managers need a clearer target state, not more reporting.', score: 2 },
        { id: 'D', text: 'The problem is that the programme is too large — split it into two separate programmes', consequence: 'Splitting the programme will not resolve the alignment problem if the vision remains vague.', score: 1 },
      ],
      takeaway: "MSP's Blueprint is the mechanism for translating a vision into a specific, actionable description of the future state. Without a Blueprint, project managers will interpret the vision differently and make inconsistent decisions.",
    },
  },
  {
    orderIndex: 143, title: 'Benefits Realisation — Who Is Responsible?',
    description: 'A programme has delivered all its projects but the benefits have not been realised.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: "A digital transformation programme has delivered all 6 of its projects on time and within budget. The new systems are live. However, 18 months after the last project closed, the expected £2.1m in efficiency savings have not been realised. The Programme Board is asking why. The Programme Manager says: 'The projects delivered what was asked. Benefits realisation is not a project responsibility.' Is the Programme Manager right?",
      options: [
        { id: 'A', text: "Yes — projects deliver outputs. Benefits realisation is a business-as-usual responsibility.", consequence: "Partially correct, but incomplete. In MSP, the Programme Manager is responsible for the Benefits Realisation Plan and for ensuring that benefits are tracked and realised — not just that projects deliver outputs.", score: 2 },
        { id: 'B', text: "No — in MSP, the Programme Manager is responsible for the Benefits Realisation Plan. The programme should not have closed until benefits realisation was tracked and handed over to Business Change Managers with clear accountability.", consequence: 'Correct. MSP explicitly assigns benefits realisation responsibility to the programme, not just to BAU. The Programme Manager should have established a Benefits Realisation Plan and appointed Business Change Managers to own benefit delivery.', score: 4 },
        { id: 'C', text: "Yes — the Programme Board is responsible for benefits, not the Programme Manager.", consequence: "The Programme Board provides oversight but the Programme Manager is responsible for the Benefits Realisation Plan. Blaming the Programme Board for a programme management failure is not correct.", score: 1 },
        { id: 'D', text: "The benefits will realise over time — 18 months is too early to judge.", consequence: "18 months post-programme is not too early. If benefits have not been tracked and there is no Benefits Realisation Plan, the programme has failed in its core purpose.", score: 1 },
      ],
      takeaway: "MSP's benefits management theme makes the Programme Manager responsible for the Benefits Realisation Plan. Projects deliver outputs; the programme delivers outcomes and benefits. These are not the same thing.",
    },
  },
  {
    orderIndex: 144, title: 'Build a Programme Blueprint',
    description: 'Create an MSP Blueprint for a community care transformation programme.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 25,
    content: {
      projectBrief: 'You are Programme Manager for a 3-year programme to transform community care services at an NHS Trust. The vision: shift from reactive, hospital-based care to proactive, community-based care. The programme includes 5 projects: new community hubs, digital care records, workforce development, GP integration, and patient self-management tools.',
      fields: [
        { id: 'current_state', label: 'Current State (As-Is)', placeholder: 'Describe how community care currently operates. What are the key characteristics, processes, and performance levels?' },
        { id: 'future_state', label: 'Future State (To-Be)', placeholder: 'Describe what community care will look, feel, and operate like when the programme is complete. Be specific about processes, technology, workforce, and patient experience.' },
        { id: 'capabilities', label: 'New Capabilities Required', placeholder: 'What new capabilities must the organisation develop to achieve the future state? (e.g., digital skills, new roles, new processes)' },
        { id: 'benefits', label: 'Benefits (quantified where possible)', placeholder: 'What benefits will the future state deliver? Include financial, clinical, and patient experience benefits.' },
        { id: 'transition', label: 'Transition Approach', placeholder: 'How will the organisation move from current to future state? What is the sequencing of the 5 projects?' },
      ],
      scoringCriteria: 'Current and future states must be specific and contrasting. Capabilities must be new (not existing). Benefits must be measurable. Transition must sequence the 5 projects logically.',
    },
  },
  {
    orderIndex: 145, title: 'Tell Me About Managing a Programme',
    description: 'Demonstrate programme management capability in an MSP context.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a programme you have managed or been part of. How did you ensure the programme delivered its intended benefits, not just its project outputs?',
      context: 'You are being interviewed for a Programme Director role at a large NHS Trust. The panel includes the Chief Executive and the Director of Strategy.',
      guidance: 'Use STAR. Distinguish clearly between project outputs and programme outcomes/benefits. Reference MSP concepts: Blueprint, Benefits Realisation Plan, Business Change Managers, tranches. Show that you understood the difference between delivering projects and delivering transformation. Aim for 300-400 words.',
      scoringCriteria: 'Clear distinction between outputs and outcomes. Benefits Realisation Plan or equivalent referenced. Business Change Manager role acknowledged. Specific example of benefits being tracked and realised.',
    },
  },
  {
    orderIndex: 146, title: 'Tranche Planning — Sequencing for Benefits',
    description: 'Sequence 5 programme projects into tranches to maximise early benefits realisation.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: "You are Programme Manager for a 3-year community care transformation programme. You have 5 projects: (1) Community Hubs — 18 months, enables all other projects. (2) Digital Care Records — 12 months, requires Community Hubs to be operational. (3) Workforce Development — 6 months, can run in parallel. (4) GP Integration — 9 months, requires Digital Care Records. (5) Patient Self-Management Tools — 6 months, requires Digital Care Records. How do you sequence these into tranches?",
      options: [
        { id: 'A', text: 'Run all 5 projects simultaneously to deliver benefits as quickly as possible', consequence: 'Running all 5 simultaneously ignores the dependencies. Projects 2, 4, and 5 cannot start until their predecessors are complete.', score: 1 },
        { id: 'B', text: 'Tranche 1: Community Hubs + Workforce Development (parallel). Tranche 2: Digital Care Records. Tranche 3: GP Integration + Patient Self-Management Tools (parallel). This sequences by dependency and maximises parallel working within each tranche.', consequence: 'Correct. This sequencing respects the dependencies, maximises parallel working within each tranche, and creates natural review points between tranches.', score: 4 },
        { id: 'C', text: 'Tranche 1: All 5 projects in sequence, one after another', consequence: 'Sequential delivery of all 5 projects takes 51 months (18+12+9+6+6) and misses opportunities for parallel working.', score: 1 },
        { id: 'D', text: 'Tranche 1: Workforce Development (quick win). Tranche 2: Everything else', consequence: 'Starting with Workforce Development as a quick win ignores the fact that Community Hubs is the enabler for all other projects.', score: 2 },
      ],
      takeaway: 'MSP tranche planning sequences projects by dependency and benefit realisation opportunity. Tranches create natural review points and enable the Programme Board to assess whether to proceed based on benefits realised.',
    },
  },
  {
    orderIndex: 147, title: 'Stakeholder Engagement at Programme Level',
    description: 'A key stakeholder group is actively opposing the programme.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'common_scenario', estimatedMinutes: 10,
    content: {
      scenario: "You are Programme Manager for a community care transformation programme. The GP federation (representing 45 GP practices) is actively opposing the programme. They have written to the Trust CEO saying the programme 'threatens GP independence and will increase their workload without additional resource.' Two GPs have gone to the local press. The Programme Board is alarmed. What do you do?",
      options: [
        { id: 'A', text: 'Issue a press statement defending the programme', consequence: 'A press statement without first engaging with the GPs will escalate the conflict and harden their opposition.', score: 1 },
        { id: 'B', text: 'Request an urgent meeting with the GP federation leadership. Listen to their specific concerns. Identify which concerns are based on misunderstanding (and can be addressed with information) and which are legitimate (and require the programme to adapt). Agree a joint engagement plan.', consequence: 'Correct. Stakeholder opposition at programme level requires direct engagement, active listening, and a willingness to adapt. The GP federation is a critical stakeholder — their concerns must be addressed, not managed away.', score: 4 },
        { id: 'C', text: 'Ask the CEO to meet with the GP federation and resolve the issue', consequence: 'Escalating to the CEO without first engaging directly will be seen as avoidance and will not resolve the underlying concerns.', score: 2 },
        { id: 'D', text: 'Proceed with the programme — the GPs will come around once they see the benefits', consequence: "Proceeding without engaging with active opposition will allow the opposition to grow. 'They'll come around' is not a stakeholder management strategy.", score: 1 },
      ],
      takeaway: 'Programme-level stakeholder opposition requires direct engagement and active listening. The right response is to understand the specific concerns, address misunderstandings, and adapt the programme where concerns are legitimate.',
    },
  },
  {
    orderIndex: 148, title: 'Build a Benefits Realisation Plan',
    description: 'Create an MSP Benefits Realisation Plan for a digital transformation programme.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are Programme Manager for a 3-year digital transformation programme at a local authority. The programme has 4 projects. Expected benefits: £1.2m annual efficiency savings, 30% reduction in customer complaints, 25% reduction in processing time, improved staff satisfaction. The programme will close in Month 36.',
      fields: [
        { id: 'benefit_profiles', label: 'Benefit Profiles (at least 4)', placeholder: 'For each benefit: description, measurement method, baseline, target, owner, and expected realisation date.' },
        { id: 'measurement_plan', label: 'Measurement and Tracking Plan', placeholder: 'How will each benefit be measured? At what frequency? Who is responsible for reporting?' },
        { id: 'business_change', label: 'Business Change Requirements', placeholder: 'What changes to processes, roles, or behaviours are required to realise each benefit? Who will make these changes?' },
        { id: 'handover', label: 'Handover to BAU', placeholder: 'How will benefits realisation be handed over to business-as-usual after the programme closes? Who owns each benefit post-programme?' },
      ],
      scoringCriteria: 'Each benefit must have a measurable baseline and target. Ownership must be assigned. Measurement frequency must be specified. Handover plan must name specific BAU owners.',
    },
  },
  {
    orderIndex: 149, title: 'Tell Me About Delivering Transformational Change',
    description: 'Demonstrate your ability to lead large-scale transformation.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you led or contributed to a transformational change programme. What made it transformational rather than just a large project, and what were the key challenges?',
      context: 'You are being interviewed for a Director of Transformation role at a large NHS Trust. The panel includes the CEO and the Chair of the Board.',
      guidance: 'Use STAR. Distinguish transformation from project delivery (scale, cultural change, benefits over time, multiple interdependencies). Reference MSP concepts naturally. Show that you understood the people dimension, not just the technical delivery. Aim for 300-400 words.',
      scoringCriteria: 'Clear distinction between transformation and project delivery. People/cultural dimension acknowledged. Benefits realisation referenced. Specific challenges described honestly. Outcome described with evidence.',
    },
  },
  {
    orderIndex: 150, title: 'The Housing Association Transformation Programme (Full Project)',
    description: 'Lead a full MSP programme to transform a housing association from reactive to proactive service delivery.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 70,
    content: {
      stages: [
        {
          id: 1, title: 'Stage 1 — Defining the Programme', description: 'Establish the Blueprint and Benefits Realisation Plan.',
          scenario: "You are Programme Manager for a 3-year transformation programme at a large housing association. The vision: move from reactive repairs and complaints management to proactive, data-driven service delivery. The Programme Board includes the CEO, CFO, and Director of Housing. In your first 8 weeks, what are your two most critical deliverables?",
          options: [
            { id: 'A', text: 'The Programme Plan and the Risk Register', consequence: 'The Programme Plan and Risk Register are important but cannot be developed until the Blueprint and Benefits Realisation Plan are in place. These are the foundation of MSP.', score: 2 },
            { id: 'B', text: 'The Blueprint (future state description) and the Benefits Realisation Plan — these define what the programme is trying to achieve and how success will be measured', consequence: 'Correct. The Blueprint and Benefits Realisation Plan are the two foundational MSP documents. Without them, the programme has no clear target state and no way to measure whether it is succeeding.', score: 4 },
            { id: 'C', text: 'The stakeholder map and the communications plan', consequence: 'Stakeholder management is important but cannot be planned effectively until the Blueprint defines what the programme is trying to achieve.', score: 1 },
            { id: 'D', text: 'The project mandates for all 5 projects in the programme', consequence: 'Project mandates cannot be developed until the Blueprint defines the future state that the projects must collectively deliver.', score: 1 },
          ],
          takeaway: "MSP's Blueprint and Benefits Realisation Plan are the foundation of every programme. They define the target state and how success will be measured — everything else flows from them.",
        },
        {
          id: 2, title: 'Stage 2 — Delivering the Tranches', description: 'Manage the first tranche and respond to emerging issues.',
          scenario: "You are 12 months into the programme. Tranche 1 (new data platform and workforce development) has been delivered. The data platform is live. However, only 40% of frontline staff are using it as intended. The Business Change Manager reports that managers are not reinforcing the new ways of working. The Tranche 2 projects (proactive maintenance scheduling and tenant self-service portal) are due to start in 6 weeks. Do you proceed?",
          options: [
            { id: 'A', text: 'Proceed to Tranche 2 as planned — the data platform is live and the programme is on schedule', consequence: 'Proceeding to Tranche 2 when only 40% adoption has been achieved in Tranche 1 will compound the adoption problem. Tranche 2 projects depend on Tranche 1 benefits being realised.', score: 1 },
            { id: 'B', text: 'Delay Tranche 2 by 8 weeks. Use the time to address the adoption gap: work with the Business Change Manager to implement manager accountability for adoption, provide targeted support to the 60% not using the platform, and re-assess adoption before proceeding.', consequence: 'Correct. MSP tranche boundaries are review points. Proceeding to Tranche 2 before Tranche 1 benefits are realised risks building on an unstable foundation.', score: 4 },
            { id: 'C', text: 'Close the programme — 40% adoption means the transformation has failed', consequence: '40% adoption at 12 months is a concern but not a programme failure. The right response is to address the adoption gap, not close the programme.', score: 1 },
            { id: 'D', text: 'Replace the Business Change Manager — they are responsible for the adoption failure', consequence: 'Replacing the Business Change Manager without first understanding the root cause of the adoption gap is reactive and may not resolve the issue.', score: 2 },
          ],
          takeaway: "MSP tranche boundaries are review points, not just milestones. The Programme Manager must assess whether Tranche 1 benefits are being realised before committing to Tranche 2. Benefits realisation is a go/no-go criterion.",
        },
      ],
    },
  },
];

async function main() {
  console.log('Seeding Lean, Six Sigma, PRINCE2 Practitioner, and MSP simulations...');
  let inserted = 0;
  for (const sim of simulations) {
    await upsert(sim);
    inserted++;
  }
  console.log(`Done. Processed ${inserted} simulations.`);
  await conn.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
