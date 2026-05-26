/**
 * Seed script for Module E (MoP) and Module F (Change Management) advanced simulations.
 * Run: node scripts/seed-mop-cm.mjs
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

async function upsert(sim) {
  const [existing] = await conn.query(
    'SELECT id FROM simulations WHERE title = ?',
    [sim.title]
  );
  if (existing.length > 0) {
    console.log(`  ↩  Skipping (exists): ${sim.title}`);
    return;
  }
  await conn.query(
    `INSERT INTO simulations (levelId, title, description, type, difficulty, categoryTag, estimatedMinutes, accessType, content, orderIndex, isInterviewBank)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      null,
      sim.title,
      sim.description,
      sim.type,
      sim.difficulty,
      sim.categoryTag,
      sim.estimatedMinutes,
      'advanced',
      JSON.stringify(sim.content),
      sim.orderIndex,
      0,
    ]
  );
  console.log(`  ✓  Inserted: ${sim.title}`);
}

const simulations = [

  // ════════════════════════════════════════════════════════════
  // MODULE E — MoP
  // ════════════════════════════════════════════════════════════
  {
    orderIndex: 151, title: 'Two Projects, One Team — Who Wins?',
    description: 'A resource conflict between two high-priority projects lands on your desk.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'You are Head of PMO. Two project managers have escalated a resource conflict. Project A (CRM replacement, strategic priority 1) and Project B (regulatory compliance audit, statutory deadline in 8 weeks) both need the same two senior business analysts for the next 6 weeks. You cannot hire contractors in time. What do you do?',
      options: [
        { id: 'A', text: 'Allocate the BAs to Project A — it is the highest strategic priority', consequence: 'Deprioritising a statutory compliance deadline for a strategic project creates regulatory risk. The organisation could face fines or enforcement action.', score: 1 },
        { id: 'B', text: 'Allocate the BAs to Project B for 6 weeks to meet the statutory deadline, then move them to Project A. Formally re-plan Project A with the revised timeline.', consequence: 'Correct. Statutory obligations take precedence. Re-planning Project A is the right portfolio management response — not ignoring the constraint.', score: 4 },
        { id: 'C', text: 'Split the BAs 50/50 between both projects', consequence: 'Splitting resource 50/50 means neither project gets what it needs. Both will be delayed and the compliance risk remains.', score: 1 },
        { id: 'D', text: 'Escalate to the Portfolio Board and let them decide', consequence: 'Escalating without a recommendation is not the PMO role. Bring the analysis and options — then let the Board decide.', score: 2 },
      ],
      takeaway: 'Portfolio resource decisions must weigh strategic priority against statutory obligation. Regulatory deadlines are not negotiable — they must be factored into portfolio planning before conflicts arise.',
    },
  },
  {
    orderIndex: 152, title: 'The Project That Does Not Fit the Strategy',
    description: 'A well-written business case arrives for a project that does not align with any strategic objective.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 9,
    content: {
      scenario: 'You are Head of PMO. A well-respected Director has submitted a business case for a new project. The business case is well-written and the project would deliver real value to their department. However, it does not align with any of the organisation\'s 5 strategic objectives for the next 3 years. It would consume £180,000 and two senior PMs for 9 months.',
      options: [
        { id: 'A', text: 'Approve it — the Director is senior and the project has merit on its own terms', consequence: 'Approving non-strategic projects sets a precedent that undermines portfolio discipline. Every Director will submit projects on departmental merit rather than strategic alignment.', score: 1 },
        { id: 'B', text: 'Recommend rejection at the Portfolio Board on strategic alignment grounds, and suggest the Director resubmits in the next planning cycle if priorities change', consequence: 'Correct. Portfolio decisions must be grounded in strategic alignment, not project merit alone. This is the core MoP principle.', score: 4 },
        { id: 'C', text: 'Approve it but reduce the budget to minimise the strategic risk', consequence: 'Approving a non-strategic project at reduced budget still depletes resource from strategic priorities.', score: 1 },
        { id: 'D', text: 'Ask the Director to rewrite the business case to include a strategic alignment section', consequence: 'Asking for a rewrite to justify a predetermined answer corrupts the governance process.', score: 2 },
      ],
      takeaway: 'Portfolio governance exists to ensure organisational resources flow to strategic priorities. A well-written business case for a non-strategic project is still a non-strategic project.',
    },
  },
  {
    orderIndex: 153, title: 'Build a Portfolio Prioritisation Matrix',
    description: 'Prioritise 8 competing project proposals against a £1.2m budget.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are Head of PMO for a housing association with a portfolio of 8 proposed projects for the coming year. Total budget available: £1.2 million. Total requested: £2.8 million. You must recommend which projects to fund, defer, or reject.\n\nProjects submitted:\n1. New CRM system — £380,000 — 18 months\n2. Staff wellbeing programme — £45,000 — 6 months\n3. Social housing compliance audit — £120,000 — 3 months (regulatory requirement)\n4. New tenant portal — £290,000 — 12 months\n5. Office refurbishment — £210,000 — 4 months\n6. Data analytics capability — £175,000 — 9 months\n7. Leadership development programme — £85,000 — 12 months\n8. Void property reduction initiative — £95,000 — 6 months',
      fields: [
        { id: 'matrix', label: 'Portfolio Prioritisation Matrix', placeholder: 'Score each project on: Strategic alignment (1-5), Benefits score (1-5), Risk if not done (1-5), Resource availability (1-5). Total score and recommendation (Fund/Defer/Reject) for each.' },
        { id: 'summary', label: 'Portfolio Recommendation Summary (200 words)', placeholder: 'Explain your funding decisions, referencing strategic alignment, regulatory obligations, and total budget.' },
      ],
      scoringCriteria: 'Compliance project must be prioritised. Total funded budget must not exceed £1.2m. Recommendations must be consistent with scores. Rationale must reference strategic alignment.',
    },
  },
  {
    orderIndex: 154, title: 'The Portfolio Dashboard Red RAG',
    description: 'Three projects turn red on the portfolio dashboard simultaneously.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'You are reviewing the monthly portfolio dashboard. Three projects have turned red simultaneously: Project A (budget overrun — 15% over), Project B (schedule slippage — 6 weeks behind), Project C (benefits at risk — key sponsor has left). The Portfolio Board meets in 3 days. What is your immediate priority?',
      options: [
        { id: 'A', text: 'Request exception reports from all three PMs and present them to the Portfolio Board with your analysis and recommended interventions', consequence: 'Correct. Exception reports give the Portfolio Board the information they need to make governance decisions. Presenting with your analysis and recommendations is the right PMO response.', score: 4 },
        { id: 'B', text: 'Escalate all three to the CEO immediately', consequence: 'Escalating three simultaneous red projects to the CEO without first understanding the issues and preparing recommendations will create panic rather than resolution.', score: 1 },
        { id: 'C', text: 'Focus on Project C — losing a sponsor is the most serious risk', consequence: 'All three issues require attention. Focusing on one while ignoring the others is not a portfolio management response.', score: 2 },
        { id: 'D', text: 'Ask the three PMs to resolve their issues before the Portfolio Board meeting', consequence: 'Asking PMs to resolve portfolio-level issues in 3 days without PMO support or governance intervention is unrealistic.', score: 1 },
      ],
      takeaway: 'The PMO\'s role during portfolio red flags is to gather information, analyse the issues, and present the Portfolio Board with clear options and recommendations — not to panic or deflect.',
    },
  },
  {
    orderIndex: 155, title: 'Resource Capacity Crunch',
    description: 'The portfolio has more approved projects than the organisation can resource.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'The Portfolio Board has approved 14 projects for the year. Your resource capacity analysis shows you have capacity for 9. Three months in, PMs are reporting that staff are working on 3-4 projects simultaneously and quality is suffering. Two projects have already missed key milestones. What is the root cause and what do you recommend?',
      options: [
        { id: 'A', text: 'The root cause is poor project management. Ask the PMs to improve their planning.', consequence: 'The root cause is portfolio over-commitment, not individual project management. Blaming PMs for a portfolio governance failure will damage trust and not resolve the issue.', score: 1 },
        { id: 'B', text: 'The root cause is portfolio over-commitment. Return to the Portfolio Board with a resource capacity analysis and recommend deferring 5 projects to Q3.', consequence: 'Correct. Portfolio over-commitment is a governance issue that must be resolved at the Portfolio Board level. Presenting the evidence and recommending deferral is the right PMO response.', score: 4 },
        { id: 'C', text: 'Hire 10 contractors to cover the resource gap', consequence: 'Hiring contractors to cover a portfolio over-commitment treats the symptom, not the cause. It also adds significant cost that was not in the portfolio budget.', score: 2 },
        { id: 'D', text: 'Ask each project to reduce their resource requirements by 30%', consequence: 'Asking projects to reduce resource requirements without reducing scope will result in lower quality outputs and further milestone slippage.', score: 1 },
      ],
      takeaway: 'Portfolio over-commitment is one of the most common and damaging portfolio management failures. The PMO must maintain a live resource capacity model and escalate over-commitment before it affects delivery.',
    },
  },
  {
    orderIndex: 156, title: 'Tell Me How You Would Prioritise a Portfolio',
    description: 'A senior panel question on portfolio prioritisation methodology.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me how you would approach prioritising a portfolio of 12 competing projects when you have resource for only 8.',
      context: 'You are being interviewed for a Head of PMO role at a large NHS Trust. The panel includes the CFO and the Chief Operating Officer.',
      guidance: 'Structure your answer using STAR. Cover: your prioritisation criteria (strategic alignment, benefits, risk, resource), your governance process (who decides, how), how you handle political pressure from project sponsors, and how you communicate decisions to unsuccessful sponsors. Aim for 250-350 words.',
      scoringCriteria: 'Mentions strategic alignment as primary criterion. References a scoring/weighting model. Addresses governance and who makes the final decision. Acknowledges the political dimension. Gives a concrete example or scenario.',
    },
  },
  {
    orderIndex: 157, title: 'Write a Portfolio Investment Proposal',
    description: 'Build a business case for a new digital capability investment across 3 service areas.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 25,
    content: {
      projectBrief: 'You are Head of PMO for a large NHS Trust. You have identified an opportunity to invest £750,000 in a shared digital capability (data analytics platform) that would benefit 3 service areas: Community Services, Mental Health, and Corporate Services. You need to build a portfolio investment proposal for the Portfolio Board.',
      fields: [
        { id: 'strategic_case', label: 'Strategic Case', placeholder: 'How does this investment align with the Trust\'s strategic objectives? What problem does it solve?' },
        { id: 'benefits', label: 'Benefits (quantified where possible)', placeholder: 'What are the expected benefits for each of the 3 service areas? Include financial and non-financial benefits.' },
        { id: 'options', label: 'Options Appraisal', placeholder: 'What are the 3 options (including do nothing)? What are the pros and cons of each?' },
        { id: 'risks', label: 'Key Risks and Mitigations', placeholder: 'What are the top 3 risks and how will they be mitigated?' },
        { id: 'recommendation', label: 'Recommendation', placeholder: 'Which option do you recommend and why? What is the payback period?' },
      ],
      scoringCriteria: 'Strategic alignment must be explicit. Benefits must be measurable. Options appraisal must include do nothing. Risks must be specific. Recommendation must be justified.',
    },
  },
  {
    orderIndex: 158, title: 'Tell Me About Strategic Alignment in Project Selection',
    description: 'Explain how you ensure projects align with organisational strategy.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'How do you ensure that the projects selected for a portfolio are genuinely aligned with the organisation\'s strategic objectives?',
      context: 'You are being interviewed for a Portfolio Director role at a large housing association.',
      guidance: 'Cover: how you translate strategy into portfolio criteria, your business case assessment process, how you handle projects that have departmental value but no strategic alignment, and how you review alignment throughout the year as strategy evolves. Use a real or realistic example.',
      scoringCriteria: 'Describes a structured alignment assessment process. References strategy translation into criteria. Addresses the political challenge of non-strategic projects. Mentions ongoing review, not just annual selection.',
    },
  },
  {
    orderIndex: 159, title: 'The Portfolio That Grew Too Large',
    description: 'Scope creep at portfolio level — too many projects, too little governance.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'common_scenario', estimatedMinutes: 10,
    content: {
      scenario: 'You have just joined as Head of PMO. You discover the portfolio contains 47 active projects. There is no prioritisation framework. Many projects have no business case. 12 projects have been running for over 3 years with no end date. Senior leaders are frustrated that "nothing ever gets finished." What is your first action?',
      options: [
        { id: 'A', text: 'Immediately close the 12 long-running projects', consequence: 'Closing projects without understanding their status, dependencies, or stakeholder impact will create chaos and resistance.', score: 1 },
        { id: 'B', text: 'Conduct a portfolio review: categorise all 47 projects by strategic alignment, benefits status, and resource consumption. Present findings and recommendations to the Portfolio Board within 30 days.', consequence: 'Correct. A structured portfolio review gives the Portfolio Board the evidence base to make informed decisions about which projects to continue, defer, or close.', score: 4 },
        { id: 'C', text: 'Introduce a new project prioritisation framework and apply it to all future projects only', consequence: 'Applying a new framework only to future projects leaves the existing portfolio unmanaged. The 47 active projects will continue to consume resource without governance.', score: 2 },
        { id: 'D', text: 'Ask each project sponsor to confirm whether their project is still needed', consequence: 'Asking sponsors to self-assess is unlikely to result in honest answers. Sponsors rarely volunteer to close their own projects.', score: 1 },
      ],
      takeaway: 'Portfolio hygiene is a PMO responsibility. When a portfolio has grown without governance, the first step is a structured review — not immediate action — to give decision-makers the evidence they need.',
    },
  },
  {
    orderIndex: 160, title: 'The Council Digital Portfolio Review (Full Project)',
    description: 'Lead a full portfolio review for a local council with 22 active projects and a £4.2m budget.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 70,
    content: {
      stages: [
        {
          id: 1, title: 'Stage 1 — Portfolio Audit', description: 'Categorise and assess all 22 projects.',
          scenario: 'You are Head of PMO for a large metropolitan council. The CEO has asked you to conduct a full portfolio review. There are 22 active projects with a combined budget of £4.2m. You have 6 weeks to present findings to the Portfolio Board. Three senior directors are resistant to the review. How do you approach the first 2 weeks?',
          options: [
            { id: 'A', text: 'Send a data request to all 22 PMs and analyse the responses without engaging the directors', consequence: 'Conducting a portfolio review without engaging the resistant directors will increase their resistance and reduce the quality of data you receive.', score: 1 },
            { id: 'B', text: 'Meet individually with each resistant director before the review begins. Explain the purpose, listen to their concerns, and agree on the data you need from their projects.', consequence: 'Correct. Engaging resistant stakeholders early — listening before asking — is the right approach. It reduces resistance and improves data quality.', score: 4 },
            { id: 'C', text: 'Ask the CEO to instruct the directors to cooperate', consequence: 'Using the CEO to force cooperation will create compliance without commitment.', score: 2 },
            { id: 'D', text: 'Exclude the resistant directors\' projects from the review to avoid conflict', consequence: 'Excluding projects from a portfolio review defeats the purpose of the review.', score: 1 },
          ],
          takeaway: 'Portfolio reviews require stakeholder engagement, not just data collection. Resistant stakeholders must be engaged early and their concerns heard before asking for their cooperation.',
        },
        {
          id: 2, title: 'Stage 2 — Prioritisation', description: 'Apply the prioritisation framework and make recommendations.',
          scenario: 'Your portfolio audit reveals: 8 projects are strategically aligned and on track. 6 projects are strategically aligned but significantly over budget or behind schedule. 5 projects have no clear strategic alignment. 3 projects have been running for 4+ years with no measurable benefits. The Portfolio Board has asked for your recommendations. What do you present?',
          options: [
            { id: 'A', text: 'Recommend continuing all 22 projects but with tighter governance', consequence: 'Recommending continuation of all projects — including non-strategic and zombie projects — is not a portfolio management recommendation. It is avoidance.', score: 1 },
            { id: 'B', text: 'Present a tiered recommendation: continue the 8 on-track strategic projects; recovery plans for the 6 struggling strategic projects; closure proposals for the 5 non-strategic projects; immediate review of the 3 zombie projects with a 30-day decision deadline.', consequence: 'Correct. A tiered recommendation gives the Portfolio Board clear, evidence-based options for each category of project.', score: 4 },
            { id: 'C', text: 'Recommend closing all 8 non-strategic and zombie projects immediately', consequence: 'Recommending immediate closure of 8 projects without closure plans, stakeholder engagement, or transition arrangements will create significant disruption.', score: 2 },
            { id: 'D', text: 'Ask the Portfolio Board to make the decisions without your recommendation', consequence: 'The Portfolio Board expects the PMO to provide analysis and recommendations, not just present data.', score: 1 },
          ],
          takeaway: 'Portfolio recommendations must be evidence-based, tiered, and actionable. The PMO\'s role is to give the Portfolio Board clear options — not to make all the decisions or avoid making any.',
        },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // MODULE F — Change Management
  // ════════════════════════════════════════════════════════════
  {
    orderIndex: 161, title: 'The Change No One Was Told About',
    description: 'Go-live is in 3 weeks. 200 staff were never included in the communications plan.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 9,
    content: {
      scenario: 'You are PM on a new HR system implementation. Go-live is in 3 weeks. You have just discovered that approximately 200 people were never included in the communications plan — nobody told them the system is changing. They will be expected to use the new system on Day 1.',
      options: [
        { id: 'A', text: 'Proceed with go-live — they will pick it up when they have to use it', consequence: 'Uninformed users on Day 1 create help desk overload, workarounds, errors, and resistance. This is a predictable and avoidable failure.', score: 1 },
        { id: 'B', text: 'Delay go-live by 2 weeks to allow for targeted communications and a basic awareness session with the 200 affected staff', consequence: 'Correct. A short delay is significantly cheaper than a failed go-live. Awareness is the first step in ADKAR and it cannot be skipped.', score: 4 },
        { id: 'C', text: 'Send a single all-staff email this week and consider the communication done', consequence: 'A single email does not create Awareness in ADKAR terms — especially for staff with no context.', score: 2 },
        { id: 'D', text: 'Brief their line managers and ask them to cascade the information informally', consequence: 'Manager cascade is inconsistent and unreliable. 200 people will receive 200 different messages — some will get nothing.', score: 2 },
      ],
      takeaway: 'Awareness is the foundation of ADKAR. You cannot build Desire, Knowledge, or Ability on a foundation of ignorance. When 200 people do not know a change is coming, the change is not ready to go live.',
    },
  },
  {
    orderIndex: 162, title: 'Resistance on Day One',
    description: 'A vocal group of staff refuse to use the new system from the first day.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'common_scenario', estimatedMinutes: 10,
    content: {
      scenario: 'It is Day 1 of your new case management system go-live. A group of 15 experienced caseworkers are openly refusing to use the new system. Their team leader says: "This system was designed without asking us. It doesn\'t work the way we work. We\'re going back to the old system." The Head of Operations is watching. What do you do?',
      options: [
        { id: 'A', text: 'Instruct the team leader that use of the new system is mandatory and escalate to HR if they refuse', consequence: 'Forcing compliance without addressing the underlying concern will drive resistance underground. The caseworkers will find workarounds and the adoption data will be misleading.', score: 1 },
        { id: 'B', text: 'Acknowledge the concern, ask the team leader to identify the top 3 specific issues, and commit to a same-day meeting with the system team to assess what can be addressed immediately', consequence: 'Correct. Acknowledging resistance, listening to specific concerns, and committing to rapid response is the right change management approach.', score: 4 },
        { id: 'C', text: 'Allow the team to continue using the old system temporarily while you investigate', consequence: 'Allowing continued use of the old system removes the incentive to adopt the new one. This will make the transition significantly harder.', score: 2 },
        { id: 'D', text: 'Tell the Head of Operations that this is a normal part of change and it will resolve itself', consequence: 'Dismissing Day 1 resistance as normal without taking action will lose the confidence of the Head of Operations and allow the resistance to spread.', score: 1 },
      ],
      takeaway: 'Resistance is information. When experienced staff resist on Day 1, they are telling you something important about the change. The right response is to listen, identify the specific issues, and respond rapidly.',
    },
  },
  {
    orderIndex: 163, title: 'Build a Change Impact Assessment',
    description: 'Assess the people impact of a major operational change across 4 departments.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'common_scenario', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are Change Manager on a project to centralise customer services across 4 regional offices into a single national contact centre. Approximately 180 staff are affected. Some will transfer to the new centre, some will be redeployed, and some roles will be made redundant. The project goes live in 6 months.',
      fields: [
        { id: 'impact_summary', label: 'Change Impact Summary', placeholder: 'Describe the nature and scale of the change for each of the 4 departments. What is changing, for whom, and by when?' },
        { id: 'stakeholder_groups', label: 'Stakeholder Groups and Impact Level (at least 6)', placeholder: 'For each group: current state, future state, impact level (High/Medium/Low), and primary concern.' },
        { id: 'change_risks', label: 'Top 5 Change Risks', placeholder: 'For each risk: description, likelihood, impact, and mitigation.' },
        { id: 'support_plan', label: 'Support and Engagement Plan', placeholder: 'What support will you provide to affected staff? Include communications, consultation, redeployment support, and wellbeing measures.' },
      ],
      scoringCriteria: 'Must address redundancy risk explicitly. Must differentiate between stakeholder groups. Mitigation must be specific and actionable. Must acknowledge emotional as well as practical impacts.',
    },
  },
  {
    orderIndex: 164, title: 'The Sponsor Who Went Quiet',
    description: 'Your change sponsor has disengaged at the critical mobilisation phase.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 9,
    content: {
      scenario: 'You are Change Manager on a major restructuring programme. The CEO is the named sponsor. For the first 2 months she was visibly engaged. In Month 3, she has attended no events, not responded to your emails, and delegated all decisions to her EA. Staff are noticing. Rumours are circulating that the programme has been cancelled. What do you do?',
      options: [
        { id: 'A', text: 'Continue the programme without the CEO — you have enough momentum to carry it forward', consequence: 'Continuing a major restructuring programme without visible CEO sponsorship will accelerate the rumours and increase resistance. Sponsorship is not optional for high-impact change.', score: 1 },
        { id: 'B', text: 'Request an urgent 30-minute meeting with the CEO. Bring data: staff rumours, engagement drop, specific decisions that are blocked. Make the case for why her visible sponsorship is critical to the programme\'s success.', consequence: 'Correct. Bringing evidence and making a clear case for sponsorship re-engagement is the right approach. CEOs disengage when they are busy — a focused, evidence-based conversation can re-engage them.', score: 4 },
        { id: 'C', text: 'Identify an alternative sponsor — the COO or a senior director', consequence: 'Replacing the CEO as sponsor without her knowledge or agreement is a governance failure. It also signals to staff that the CEO has abandoned the programme.', score: 1 },
        { id: 'D', text: 'Send a programme update to all staff to counter the rumours', consequence: 'A staff communication without visible CEO endorsement will not counter the rumours. Staff will notice that the CEO is not signing the message.', score: 2 },
      ],
      takeaway: 'Sponsor engagement is not a nice-to-have — it is a programme-critical dependency. When a sponsor disengages, the Change Manager must act quickly, bring evidence, and make the case for re-engagement directly.',
    },
  },
  {
    orderIndex: 165, title: 'Applying ADKAR — Where Is the Barrier?',
    description: 'Diagnose which ADKAR element is blocking adoption for 5 different staff members.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 10,
    content: {
      scenario: 'You are Change Manager on a new case management system rollout. Six months post go-live, adoption is poor. You interview 5 staff members:\n\n1. "I wasn\'t told why we were changing system — nobody explained the business reason."\n2. "I understand why we need to change but I don\'t see what\'s in it for me personally."\n3. "I went to the training but it was a 3-hour classroom session — I don\'t remember any of it now."\n4. "I know how to use it but every time I try, my manager asks me to use the old system because it\'s faster."\n5. "I genuinely want to use the new system but I wasn\'t given enough training time to feel confident."\n\nWhich answer correctly maps each statement to its ADKAR barrier?',
      options: [
        { id: 'A', text: '1=Awareness, 2=Desire, 3=Knowledge, 4=Reinforcement, 5=Ability', consequence: 'Correct. Each response maps precisely to an ADKAR element. Understanding which barrier is present determines the intervention: more communication for Awareness, personal benefit messaging for Desire, better training for Knowledge/Ability, manager accountability for Reinforcement.', score: 4 },
        { id: 'B', text: '1=Desire, 2=Awareness, 3=Ability, 4=Knowledge, 5=Reinforcement', consequence: 'Incorrect. Statement 1 is about not knowing why the change is happening — that is Awareness, not Desire. Statement 2 is about personal motivation — that is Desire, not Awareness.', score: 1 },
        { id: 'C', text: '1=Awareness, 2=Knowledge, 3=Ability, 4=Desire, 5=Reinforcement', consequence: 'Partially correct. Statements 1 and 3 are right, but Statement 2 is Desire, Statement 4 is Reinforcement, and Statement 5 is Ability.', score: 2 },
        { id: 'D', text: 'All five are training problems — provide more training', consequence: 'Treating all ADKAR barriers as training problems is a common and costly mistake. Training only addresses Knowledge and Ability barriers.', score: 1 },
      ],
      takeaway: 'ADKAR is a diagnostic tool. Each barrier requires a different intervention. Treating all adoption problems as training problems is one of the most common change management failures.',
    },
  },
  {
    orderIndex: 166, title: 'Tell Me About Leading People Through Change',
    description: 'A classic behavioural interview question for PM and Change Manager roles.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you led people through a significant change. What was the change, what resistance did you face, and how did you handle it?',
      context: 'You are being interviewed for a Senior Project Manager role at an NHS Trust. The panel includes the HR Director and the Head of Transformation.',
      guidance: 'Use the STAR framework. Be specific about the change, the resistance, and your actions. Reference change management principles (ADKAR, Kotter, or the change curve) naturally — do not lecture. Show empathy for the people affected. Quantify the outcome if possible. Aim for 280-380 words.',
      scoringCriteria: 'Specific change described. Resistance acknowledged honestly. Actions taken are specific and empathetic. Change management framework referenced naturally. Outcome described with evidence.',
    },
  },
  {
    orderIndex: 167, title: 'Write a Change Communication Plan',
    description: 'Build a full communication plan for a hybrid working transition across 600 staff.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 22,
    content: {
      projectBrief: 'You are Change Manager for a project to introduce hybrid working across a 600-person financial services firm. Currently all staff work in the office 5 days a week. From Month 4, all staff will move to 3 days in office / 2 days remote. Some staff are enthusiastic; others are concerned about career visibility and team cohesion.',
      fields: [
        { id: 'change_summary', label: 'Change Summary', placeholder: 'What is changing, for whom, and by when? Include the business rationale.' },
        { id: 'stakeholder_groups', label: 'Stakeholder Groups (at least 5)', placeholder: 'Identify at least 5 distinct groups with different change impacts. For each: who they are, what changes for them, and their primary concern.' },
        { id: 'key_messages', label: 'Key Messages per Group', placeholder: 'What does each group need to hear — and believe? Differentiate by group.' },
        { id: 'communication_timeline', label: 'Communication Timeline (4 months)', placeholder: 'What gets communicated, to whom, and when across the 4 months? Follow ADKAR sequence.' },
        { id: 'two_way_plan', label: 'Two-Way Engagement Plan', placeholder: 'How will you listen and respond to concerns? Include at least 3 specific mechanisms.' },
        { id: 'resistance_mitigation', label: 'Resistance Mitigation (top 3)', placeholder: 'What are the top 3 resistance points and how will you address them? Address emotional as well as rational concerns.' },
      ],
      scoringCriteria: 'Differentiated messages per stakeholder group. Two-way elements (not just broadcast). Timeline follows ADKAR sequence. Resistance mitigation addresses emotional as well as rational concerns.',
    },
  },
  {
    orderIndex: 168, title: 'The Change Curve in Action',
    description: 'Identify where 4 staff members are on the change curve and choose the right response.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'confidence_builder', estimatedMinutes: 9,
    content: {
      scenario: 'You are 6 weeks into a major system change. You have 1-2-1 conversations with 4 staff members:\n\n- Alex: "I\'m furious. Nobody asked us. This system is worse than the old one and I\'m not using it."\n- Bea: "I\'m not sure about this. I keep making mistakes and it\'s taking me twice as long."\n- Carl: "I\'m starting to get the hang of it. The search function is actually much better."\n- Diane: "I\'m fully on board now. Can I help train the others?"\n\nWhich response correctly matches each person\'s change curve stage?',
      options: [
        { id: 'A', text: 'Alex: Listen and acknowledge anger, do not argue. Bea: Provide additional support and reassurance. Carl: Recognise progress and encourage. Diane: Give her a change champion role.', consequence: 'Correct. Each response matches the change curve stage: Alex is in Anger/Resistance, Bea is in Exploration/Uncertainty, Carl is in Acceptance, Diane is in Commitment. The right response at each stage is different.', score: 4 },
        { id: 'B', text: 'All four need more training', consequence: 'Training is only relevant for Bea (Exploration stage). Alex needs to be heard, Carl needs encouragement, and Diane needs a role — not training.', score: 1 },
        { id: 'C', text: 'Alex: Escalate to HR. Bea: More training. Carl: Nothing needed. Diane: Nothing needed.', consequence: 'Escalating Alex to HR will entrench his resistance. Diane is a valuable change champion resource being wasted.', score: 1 },
        { id: 'D', text: 'Alex: Give him more time. Bea: Tell her it will get easier. Carl: Warn him not to get complacent. Diane: Tell her to focus on her own work.', consequence: 'Passive responses at every stage will slow adoption. The change curve is a tool for active intervention, not passive observation.', score: 2 },
      ],
      takeaway: 'The change curve tells you where people are — your job is to respond appropriately at each stage. Anger needs acknowledgement, uncertainty needs support, progress needs recognition, and commitment needs a role.',
    },
  },
  {
    orderIndex: 169, title: 'Tell Me About a Time Change Was Resisted',
    description: 'Demonstrate your ability to handle resistance with empathy and effectiveness.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time when a change you were managing was significantly resisted. What caused the resistance, how did you respond, and what was the outcome?',
      context: 'You are being interviewed for a Change Manager role at a large local authority. The panel includes the Director of Transformation and a Head of Service.',
      guidance: 'Use STAR. Be honest about the resistance — do not minimise it. Show that you understood the root cause (not just the behaviour). Describe specific actions you took to address the resistance. Reflect on what you learned. Aim for 300-400 words.',
      scoringCriteria: 'Root cause of resistance identified (not just "people don\'t like change"). Specific empathetic actions described. Outcome includes both the change result and the relationship outcome. Reflection on learning.',
    },
  },
  {
    orderIndex: 170, title: 'The New Operating Model Programme (Full Project)',
    description: 'Lead the people-side of a major NHS operating model change across 4 clinical directorates.',
    type: 'full_project', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 70,
    content: {
      stages: [
        {
          id: 1, title: 'Stage 1 — Discovery', description: 'Change impact assessment, stakeholder mapping, change readiness.',
          scenario: 'You are Change Manager embedded in a programme to implement a new operating model across a 1,200-person NHS Community Trust. Your change readiness survey shows: 34% of staff are aware the change is happening. Of those, 60% say they do not understand why. Clinical staff resistance is highest in District Nursing (72% resistant) and Community Therapy (68% resistant). What does this data tell you and what do you do?',
          options: [
            { id: 'A', text: 'The data shows the programme is on track — 34% awareness at 4 weeks is normal', consequence: '34% awareness at 4 weeks with 60% not understanding the rationale is not normal — it indicates a significant communications gap that will compound as the programme progresses.', score: 1 },
            { id: 'B', text: 'The data shows a critical Awareness gap. Prioritise targeted communications for District Nursing and Community Therapy, focusing on the "why" before any further engagement on the "what" or "how".', consequence: 'Correct. The ADKAR model requires Awareness before Desire. With 60% not understanding the rationale, no amount of training or engagement will build the Desire needed for adoption.', score: 4 },
            { id: 'C', text: 'The data shows resistance is too high — recommend delaying the programme by 6 months', consequence: 'Recommending a 6-month delay based on early readiness data is premature. The right response is to address the Awareness gap, not delay the programme.', score: 2 },
            { id: 'D', text: 'Conduct more surveys to get a clearer picture before acting', consequence: 'More surveys will not resolve the Awareness gap. The data is clear enough to act on.', score: 1 },
          ],
          takeaway: 'Change readiness data is only valuable if you act on it. A 34% awareness rate with 60% not understanding the rationale is a programme-level risk that requires immediate action.',
        },
        {
          id: 2, title: 'Stage 2 — Mobilise', description: 'Sponsorship coalition, change agent network, communication strategy.',
          scenario: 'You are building your change agent network. You need 1 change champion per team (approximately 40 teams). You have asked team managers to nominate someone. 28 managers have nominated their most junior team member. 8 have nominated people who are known to be resistant to the change. 4 have not responded. What is the problem and how do you address it?',
          options: [
            { id: 'A', text: 'Accept the nominations — any change agent is better than none', consequence: 'Accepting nominations of junior staff and resistant individuals will create a change agent network that lacks credibility and may actively undermine the programme.', score: 1 },
            { id: 'B', text: 'Meet with each manager individually. Explain the change agent role — it requires credibility, peer respect, and genuine engagement with the change. Ask them to reconsider their nomination with these criteria in mind.', consequence: 'Correct. Change agents must be credible peers, not junior staff or resistant individuals. Taking time to explain the role criteria and asking managers to reconsider is the right approach.', score: 4 },
            { id: 'C', text: 'Select the change agents yourself from the staff lists', consequence: 'Selecting change agents without manager involvement will create resentment and undermine the network before it starts.', score: 2 },
            { id: 'D', text: 'Reduce the network to 20 change agents to make it more manageable', consequence: 'Reducing the network to 20 agents for 40 teams means half the teams have no change agent. Coverage is a key success factor.', score: 1 },
          ],
          takeaway: 'Change agent selection is one of the most important decisions in a change programme. The criteria — credibility, peer respect, genuine engagement — must be communicated clearly to managers before nominations are made.',
        },
        {
          id: 3, title: 'Stage 3 — Design and Deliver', description: 'Training programme, manager briefings, Q&A sessions.',
          scenario: 'You are 3 weeks before go-live. Training completion data shows: 78% of staff have completed the mandatory e-learning. 45% have attended the face-to-face practical session. 22% have not started any training. The 22% are concentrated in two directorates. The Programme Director wants to proceed with go-live as planned. What do you recommend?',
          options: [
            { id: 'A', text: 'Proceed with go-live — 78% e-learning completion is acceptable', consequence: 'E-learning completion alone is not sufficient for a complex operating model change. 45% face-to-face attendance and 22% with no training at all represents a significant readiness risk.', score: 1 },
            { id: 'B', text: 'Recommend a 2-week delay for the two directorates with low training completion. Use the time for intensive face-to-face sessions. Present the training data and the risk of proceeding to the Programme Board.', consequence: 'Correct. Presenting the training data to the Programme Board and recommending a targeted delay for the two low-completion directorates is the right governance response.', score: 4 },
            { id: 'C', text: 'Proceed with go-live but provide extra support to the two low-completion directorates on Day 1', consequence: 'Day 1 support cannot substitute for pre-go-live training. Staff who have not been trained will struggle from the first hour.', score: 2 },
            { id: 'D', text: 'Make training mandatory and issue warnings to staff who have not completed it', consequence: 'Issuing warnings 3 weeks before go-live will create anxiety without improving completion rates. The root cause must be understood and addressed.', score: 1 },
          ],
          takeaway: 'Training completion data is a go/no-go input. When significant groups have not completed training, the right response is to understand why, address the barrier, and present the data to the Programme Board.',
        },
        {
          id: 4, title: 'Stage 4 — Go-Live and Sustain', description: 'Hypercare, adoption measurement, reinforcement.',
          scenario: 'It is 4 weeks post go-live. Adoption data shows: 71% of staff are using the new operating model as intended. 18% are using a hybrid of old and new ways of working. 11% have reverted entirely to the old model. The 11% are concentrated in one directorate where the Clinical Director has been openly critical of the change. What do you do?',
          options: [
            { id: 'A', text: 'Escalate the Clinical Director to the CEO for undermining the programme', consequence: 'Escalating immediately without first engaging with the Clinical Director will create a conflict that damages the programme and the relationship.', score: 1 },
            { id: 'B', text: 'Meet with the Clinical Director. Listen to her specific concerns. Identify what is driving the reversion — is it a system issue, a training issue, or a leadership issue? Agree a joint action plan.', consequence: 'Correct. The Clinical Director\'s open criticism is information. Understanding the root cause of the reversion and agreeing a joint action plan is the right approach.', score: 4 },
            { id: 'C', text: 'Accept the 11% reversion as an acceptable outcome — 71% adoption is good enough', consequence: 'Accepting 11% reversion as permanent means the operating model will not achieve its full benefits. It also sets a precedent that non-compliance is acceptable.', score: 1 },
            { id: 'D', text: 'Provide additional training to the 11% who have reverted', consequence: 'If the root cause is the Clinical Director\'s leadership behaviour, additional training will not resolve the issue.', score: 2 },
          ],
          takeaway: 'Post go-live adoption gaps require diagnosis before intervention. When reversion is concentrated in one area with a resistant leader, the root cause is likely leadership behaviour — not training or system issues. Address the leader first.',
        },
      ],
    },
  },
];

async function main() {
  console.log('Seeding MoP and Change Management simulations...');
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
