/**
 * Seed script: inserts all 44 simulations + 10 interview bank questions.
 * Run: node scripts/seed-simulations.mjs
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

// ─── helpers ────────────────────────────────────────────────────────────────

async function upsert(sim) {
  // Check if simulation with this title + levelId already exists
  const [existing] = await conn.query(
    'SELECT id FROM simulations WHERE title = ? AND levelId = ?',
    [sim.title, sim.levelId]
  );
  if (existing.length > 0) {
    console.log(`  ↩  Skipping (exists): ${sim.title}`);
    return;
  }
  await conn.query(
    `INSERT INTO simulations (levelId, title, description, type, difficulty, categoryTag, estimatedMinutes, accessType, content, orderIndex, isInterviewBank)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sim.levelId,
      sim.title,
      sim.description,
      sim.type,
      sim.difficulty,
      sim.categoryTag,
      sim.estimatedMinutes,
      sim.accessType,
      JSON.stringify(sim.content),
      sim.orderIndex,
      sim.isInterviewBank ? 1 : 0,
    ]
  );
  console.log(`  ✓  Inserted: ${sim.title}`);
}

// ─── simulation data ─────────────────────────────────────────────────────────

const simulations = [

  // ── LEVEL 1 — Introduction to PM (Free) ─────────────────────────────────

  {
    levelId: 1, orderIndex: 1, accessType: 'free', isInterviewBank: false,
    title: 'The Scope That Wouldn\'t Stop Growing',
    description: 'You\'ve been appointed PM on a small internal process improvement project. Three weeks in, your sponsor wants to add more features with no change to budget or deadline.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'common_scenario', estimatedMinutes: 8,
    content: {
      scenario: 'You\'ve just been appointed as PM on a small internal process improvement project. Three weeks in, your sponsor emails to say they\'d like to "add a few more things" to the project. The budget and deadline haven\'t changed.',
      options: [
        { id: 'A', text: 'Reply immediately agreeing to include the changes to keep the sponsor happy', consequence: 'You\'ve agreed to scope creep without assessing impact. The project runs late and over budget.', score: 2 },
        { id: 'B', text: 'Request a meeting to discuss the impact on timeline and budget before agreeing to anything', consequence: 'You\'ve raised a Change Request conversation — exactly the right PM response.', score: 4 },
        { id: 'C', text: 'Add the changes quietly and work harder to catch up', consequence: 'Scope creep ignored. You burn out, miss the deadline, and damage your credibility.', score: 1 },
        { id: 'D', text: 'Escalate to your line manager that the sponsor is being unreasonable', consequence: 'Premature escalation. The sponsor feels undermined and trust breaks down.', score: 2 },
      ],
      takeaway: 'Always assess the impact of any change before agreeing to it — this is the foundation of change control.',
    },
  },

  {
    levelId: 1, orderIndex: 2, accessType: 'free', isInterviewBank: false,
    title: 'Your First Kick-Off Meeting',
    description: 'You\'re running your first ever project kick-off meeting tomorrow. Your team includes two people who don\'t know each other and one senior stakeholder who dominates discussions.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'confidence_builder', estimatedMinutes: 6,
    content: {
      scenario: 'You\'re running your first ever project kick-off meeting tomorrow. Your team of 5 includes two people who don\'t know each other and one senior stakeholder who is known to dominate discussions.',
      options: [
        { id: 'A', text: 'Send a detailed agenda in advance and open with agreed ground rules', consequence: 'Well-prepared, sets the right tone. Team leaves aligned and clear on roles.', score: 4 },
        { id: 'B', text: 'Wing it — you\'ll see how it goes and adapt', consequence: 'Meeting overruns, no clear outputs, team leaves confused.', score: 1 },
        { id: 'C', text: 'Ask the senior stakeholder to chair the meeting to keep them engaged', consequence: 'Stakeholder dominates, junior team members disengage.', score: 2 },
        { id: 'D', text: 'Keep the meeting very short (15 mins) to avoid any conflict', consequence: 'No shared understanding established. Problems emerge in Week 1.', score: 2 },
      ],
      takeaway: 'A well-structured kick-off with a clear agenda and ground rules sets the tone for the entire project.',
    },
  },

  {
    levelId: 1, orderIndex: 3, accessType: 'free', isInterviewBank: false,
    title: 'Tell Me About a Time You Managed Priorities',
    description: 'A classic behavioural interview question testing your ability to structure a STAR answer about competing priorities.',
    type: 'interview_sim', difficulty: 'beginner', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Tell me about a time when you had to manage competing priorities. How did you decide what to focus on and what was the outcome?',
      context: 'You are interviewing for a Junior PM role at a mid-size UK tech company.',
      coachingFocus: 'STAR structure, specificity of actions, measurable result, PM vocabulary (stakeholders, dependencies, risk)',
      minWords: 80,
      maxWords: 400,
    },
  },

  {
    levelId: 1, orderIndex: 4, accessType: 'free', isInterviewBank: false,
    title: 'Write Your First Project Brief',
    description: 'Complete a project brief for an HR system migration. Tests your ability to define scope, stakeholders, risks and success criteria.',
    type: 'build_sim', difficulty: 'beginner', categoryTag: 'confidence_builder', estimatedMinutes: 15,
    content: {
      projectBrief: 'You\'ve been asked to run a project to migrate your company\'s internal HR system to a new cloud-based platform. 200 staff will be affected. Timeline: 6 months. Budget: £50,000.',
      documentType: 'Project Brief',
      fields: [
        { id: 'projectName', label: 'Project name', type: 'text', placeholder: 'e.g. HR System Migration 2026' },
        { id: 'objective', label: 'Project objective (1–2 sentences)', type: 'textarea', placeholder: 'What will this project achieve and why?' },
        { id: 'deliverables', label: 'Key deliverables (list 3–5)', type: 'textarea', placeholder: 'What will be produced or delivered?' },
        { id: 'inScope', label: 'In scope (list 3 items)', type: 'textarea', placeholder: 'What is included in this project?' },
        { id: 'outOfScope', label: 'Out of scope (list 2 items)', type: 'textarea', placeholder: 'What is explicitly excluded?' },
        { id: 'stakeholders', label: 'Key stakeholders (name and role)', type: 'textarea', placeholder: 'Who has an interest in this project?' },
        { id: 'risks', label: 'High-level risks (list 2)', type: 'textarea', placeholder: 'What could go wrong?' },
        { id: 'successCriteria', label: 'Success criteria', type: 'textarea', placeholder: 'How will you know the project succeeded?' },
      ],
      rubricFields: 'Project name, clear objective, 3-5 deliverables, in-scope items, out-of-scope items, named stakeholders with roles, at least 2 risks, measurable success criteria',
    },
  },

  {
    levelId: 1, orderIndex: 5, accessType: 'free', isInterviewBank: false,
    title: 'The Digital Transformation Project',
    description: 'Take on the role of PM for a 6-month NHS Trust digital transformation. Navigate initiation through closure across 5 stages.',
    type: 'full_project', difficulty: 'beginner', categoryTag: 'high_impact', estimatedMinutes: 50,
    content: {
      setup: 'You are PM for a 6-month digital transformation project at a mid-size NHS Trust. Budget: £80,000. 3 team members. Executive sponsor: Chief Operating Officer.',
      stages: [
        {
          id: 1, title: 'Stage 1 — Initiation', description: 'Define the project scope and identify key stakeholders.',
          decisions: [
            {
              question: 'Your sponsor wants to start work immediately without a formal project charter. What do you do?',
              options: [
                { text: 'Start work immediately to show responsiveness', consequence: 'No clear scope leads to confusion and rework in Week 2.', modifier: { health: -10, trust: 0 } },
                { text: 'Spend one week creating a project charter before starting', consequence: 'Clear scope and sign-off. Team starts aligned.', modifier: { health: 10, trust: 5 } },
                { text: 'Create a one-page scope summary and get verbal agreement', consequence: 'Pragmatic and fast. Some ambiguity remains but manageable.', modifier: { health: 5, trust: 5 } },
              ],
            },
          ],
        },
        {
          id: 2, title: 'Stage 2 — Planning', description: 'Build the project plan, assign resources, and identify risks.',
          decisions: [
            {
              question: 'You identify a key risk: the legacy system vendor may not cooperate with data migration. How do you handle this?',
              options: [
                { text: 'Log it in the risk register and monitor it', consequence: 'Risk is visible but no mitigation in place. It materialises in Stage 3.', modifier: { health: 0, trust: 0 } },
                { text: 'Log it, assign a mitigation owner, and schedule a vendor meeting this week', consequence: 'Proactive risk management. Vendor engaged early.', modifier: { health: 10, trust: 5 } },
                { text: 'Ignore it — the vendor will cooperate when the time comes', consequence: 'Risk ignored. Causes significant delay in Stage 3.', modifier: { health: -15, trust: -5 } },
              ],
            },
          ],
        },
        {
          id: 3, title: 'Stage 3 — Execution (Week 3)', description: 'A key supplier misses a milestone.',
          decisions: [
            {
              question: 'Your data migration supplier has missed their Week 3 milestone. They say they\'ll be 2 weeks late. What do you do?',
              options: [
                { text: 'Escalate immediately to the project board', consequence: 'Premature escalation. Board asks why you didn\'t handle it first.', modifier: { health: 0, trust: -10 } },
                { text: 'Issue a formal notice to the supplier, update the plan, and inform your sponsor', consequence: 'Professional and transparent. Sponsor appreciates the early warning.', modifier: { health: 5, trust: 10 } },
                { text: 'Give the supplier another week before raising it', consequence: 'Delay compounds. You\'re now 3 weeks behind and stakeholders are surprised.', modifier: { health: -10, trust: -10 } },
              ],
            },
          ],
        },
        {
          id: 4, title: 'Stage 4 — Execution (Week 10)', description: 'A team member goes on sick leave.',
          decisions: [
            {
              question: 'Your lead developer has gone on sick leave with no return date. They were the only person who understood the integration layer. What do you do?',
              options: [
                { text: 'Wait for them to return before proceeding', consequence: 'Project stalls. Sponsor loses confidence.', modifier: { health: -15, trust: -10 } },
                { text: 'Bring in a contractor and arrange a knowledge transfer session with the developer if possible', consequence: 'Continuity maintained. Cost increases slightly but project stays on track.', modifier: { health: 5, trust: 5 } },
                { text: 'Ask another team member to figure it out', consequence: 'Team member struggles. Quality suffers and morale drops.', modifier: { health: -5, trust: -5 } },
              ],
            },
          ],
        },
        {
          id: 5, title: 'Stage 5 — Closure', description: 'Deliver the project and run lessons learned.',
          decisions: [
            {
              question: 'The project is complete. Your sponsor wants to skip the lessons learned session to save time. What do you do?',
              options: [
                { text: 'Skip it — the project is done', consequence: 'Lessons lost. Same mistakes will be made on the next project.', modifier: { health: 0, trust: -5 } },
                { text: 'Run a 1-hour focused lessons learned session and circulate a summary', consequence: 'Professional closure. Organisation learns and your reputation grows.', modifier: { health: 10, trust: 10 } },
                { text: 'Send a lessons learned survey by email instead', consequence: 'Low response rate but some learning captured.', modifier: { health: 5, trust: 0 } },
              ],
            },
          ],
        },
      ],
    },
  },

  // ── LEVEL 2 — Waterfall Methodology (Pro) ────────────────────────────────

  {
    levelId: 2, orderIndex: 1, accessType: 'pro', isInterviewBank: false,
    title: 'The Requirements That Changed Overnight',
    description: 'Three weeks into a waterfall project, a stakeholder sends a 2-page email requesting significant changes after requirements were signed off.',
    type: 'decision_sim', difficulty: 'beginner', categoryTag: 'high_impact', estimatedMinutes: 8,
    content: {
      scenario: 'You\'re three weeks into a waterfall project. Requirements were signed off. The business stakeholder has now sent a 2-page email asking for significant changes. Your development team says the changes would need 3 extra weeks.',
      options: [
        { id: 'A', text: 'Tell the stakeholder the requirements are locked — they signed them off', consequence: 'Stakeholder is unhappy, relationship damaged, business value reduced.', score: 2 },
        { id: 'B', text: 'Raise a formal Change Request, assess impact on timeline, cost, and scope, then present options', consequence: 'Textbook change control. Professional, transparent, maintains trust.', score: 4 },
        { id: 'C', text: 'Ask your team to work overtime to absorb the changes without telling the stakeholder about the delay', consequence: 'Team morale drops, quality suffers, hidden delay eventually surfaces.', score: 1 },
        { id: 'D', text: 'Escalate immediately to the project board and ask them to decide', consequence: 'Unnecessary escalation at this stage. Board will ask why you didn\'t handle it first.', score: 2 },
      ],
      takeaway: 'In waterfall, change control is your best friend — it protects you, the stakeholder, and the project.',
    },
  },

  {
    levelId: 2, orderIndex: 2, accessType: 'pro', isInterviewBank: false,
    title: 'Building a Waterfall Project Plan',
    description: 'Complete a high-level waterfall project plan for a new customer portal, including phases, activities, durations, owners and dependencies.',
    type: 'build_sim', difficulty: 'beginner', categoryTag: 'confidence_builder', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are PM for a new customer portal for a retail business. Project duration: 4 months. Team: developer, UX designer, QA tester, business analyst.',
      documentType: 'Waterfall Project Plan',
      fields: [
        { id: 'initiation', label: 'Initiation phase — key activities, duration, owner, dependencies', type: 'textarea', placeholder: 'e.g. Define scope, appoint team, create charter. 2 weeks. PM. None.' },
        { id: 'requirements', label: 'Requirements phase — key activities, duration, owner, dependencies', type: 'textarea', placeholder: 'e.g. Gather requirements, create BRD. 3 weeks. BA. Initiation complete.' },
        { id: 'design', label: 'Design phase — key activities, duration, owner, dependencies', type: 'textarea', placeholder: 'e.g. Wireframes, UX design, sign-off. 3 weeks. UX Designer. Requirements signed off.' },
        { id: 'build', label: 'Build phase — key activities, duration, owner, dependencies', type: 'textarea', placeholder: 'e.g. Development sprints, code review. 5 weeks. Developer. Design approved.' },
        { id: 'testing', label: 'Testing phase — key activities, duration, owner, dependencies', type: 'textarea', placeholder: 'e.g. UAT, bug fixes, regression testing. 2 weeks. QA Tester. Build complete.' },
        { id: 'golive', label: 'Go-Live phase — key activities, duration, owner, dependencies', type: 'textarea', placeholder: 'e.g. Deployment, training, go-live sign-off. 1 week. PM. Testing passed.' },
        { id: 'closure', label: 'Closure phase — key activities, duration, owner, dependencies', type: 'textarea', placeholder: 'e.g. Lessons learned, handover docs, sign-off. 1 week. PM. Go-live complete.' },
      ],
      rubricFields: 'All 7 phases present, logical sequencing, realistic durations totalling ~4 months, appropriate owners assigned, dependencies identified between phases',
    },
  },

  {
    levelId: 2, orderIndex: 3, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me How You Plan a Project',
    description: 'A core interview question for any PM role — demonstrate your structured approach to project planning.',
    type: 'interview_sim', difficulty: 'beginner', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Walk me through how you would plan a project from scratch. What steps would you take and why?',
      context: 'You are interviewing for a Junior PM role at a UK financial services company.',
      coachingFocus: 'Structured approach, stakeholder identification, risk thinking, realistic planning, PM vocabulary',
      minWords: 80,
      maxWords: 400,
    },
  },

  {
    levelId: 2, orderIndex: 4, accessType: 'pro', isInterviewBank: false,
    title: 'The Go-Live Decision',
    description: 'Testing is complete but two minor bugs remain. The business is pushing hard to go live on schedule. What do you do?',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'Your waterfall project is at the go-live gate. Testing is complete but two minor bugs remain — neither is critical but both affect user experience. The business sponsor is pushing hard to go live on schedule. Your QA lead recommends a 3-day delay to fix them.',
      options: [
        { id: 'A', text: 'Go live as planned — the bugs are minor and can be fixed post-launch', consequence: 'Users notice the bugs immediately. Trust in the system is damaged from day one.', score: 2 },
        { id: 'B', text: 'Delay 3 days to fix the bugs, communicate the reason clearly to the sponsor', consequence: 'Professional decision. Sponsor is frustrated but respects the transparency.', score: 4 },
        { id: 'C', text: 'Go live but don\'t tell users about the bugs', consequence: 'Users discover them anyway. You\'ve damaged your credibility by not being upfront.', score: 1 },
        { id: 'D', text: 'Ask the sponsor to make the decision', consequence: 'Appropriate to involve the sponsor, but you should present a clear recommendation first.', score: 3 },
      ],
      takeaway: 'A go-live decision should be made on quality, not just schedule. Present the facts and a recommendation to your sponsor.',
    },
  },

  {
    levelId: 2, orderIndex: 5, accessType: 'pro', isInterviewBank: false,
    title: 'The Infrastructure Upgrade Project',
    description: 'Lead a 5-stage infrastructure upgrade for a 300-person company. Navigate planning, vendor issues, and closure.',
    type: 'full_project', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 55,
    content: {
      setup: 'You are PM for a server infrastructure upgrade for a 300-person professional services firm. Budget: £120,000. Timeline: 5 months. Team: IT Manager, 2 engineers, external vendor.',
      stages: [
        {
          id: 1, title: 'Stage 1 — Requirements & Scope',
          decisions: [
            {
              question: 'The IT Manager wants to include a full network redesign in scope. This wasn\'t in the original brief. What do you do?',
              options: [
                { text: 'Include it — the IT Manager knows best', consequence: 'Scope expands significantly. Budget and timeline blow out.', modifier: { health: -15, trust: 0 } },
                { text: 'Raise a Change Request, assess impact, and present to the sponsor for decision', consequence: 'Correct process. Sponsor decides to keep original scope.', modifier: { health: 10, trust: 5 } },
                { text: 'Refuse outright — it wasn\'t in the brief', consequence: 'IT Manager feels dismissed. Relationship strained.', modifier: { health: 0, trust: -10 } },
              ],
            },
          ],
        },
        {
          id: 2, title: 'Stage 2 — Vendor Selection',
          decisions: [
            {
              question: 'You have two vendor quotes. Vendor A is £15k cheaper but has mixed reviews. Vendor B is more expensive but has excellent references. What do you recommend?',
              options: [
                { text: 'Recommend Vendor A — saving £15k is significant', consequence: 'Vendor A underperforms. Rework costs more than the saving.', modifier: { health: -10, trust: -5 } },
                { text: 'Recommend Vendor B with a clear rationale based on risk and references', consequence: 'Sponsor agrees. Vendor B delivers on time and to spec.', modifier: { health: 10, trust: 10 } },
                { text: 'Present both options with pros and cons and let the sponsor decide', consequence: 'Good approach. Sponsor chooses Vendor B. You\'ve managed the decision well.', modifier: { health: 5, trust: 5 } },
              ],
            },
          ],
        },
        {
          id: 3, title: 'Stage 3 — Installation',
          decisions: [
            {
              question: 'During installation, the vendor discovers the server room doesn\'t meet the required power specifications. Upgrading will cost £8,000 extra. What do you do?',
              options: [
                { text: 'Approve the extra spend immediately to keep things moving', consequence: 'You\'ve approved spend without authority. Finance flags it.', modifier: { health: 0, trust: -10 } },
                { text: 'Pause work, raise a change request, get sponsor approval, then proceed', consequence: 'Correct process. Small delay but fully authorised.', modifier: { health: 5, trust: 10 } },
                { text: 'Ask the vendor to absorb the cost', consequence: 'Vendor refuses. Relationship becomes adversarial.', modifier: { health: -5, trust: -5 } },
              ],
            },
          ],
        },
        {
          id: 4, title: 'Stage 4 — Testing & Migration',
          decisions: [
            {
              question: 'The migration is scheduled for a Saturday night. On Friday, a key engineer calls in sick. What do you do?',
              options: [
                { text: 'Proceed with the remaining team — they can manage', consequence: 'The migration takes twice as long. Critical error occurs at 3am with no one to fix it.', modifier: { health: -15, trust: -10 } },
                { text: 'Postpone the migration by one week and reschedule', consequence: 'Business is frustrated but understands. Migration goes smoothly the following week.', modifier: { health: 5, trust: 5 } },
                { text: 'Call the sick engineer and ask them to work anyway', consequence: 'Engineer works while unwell. Mistakes are made. HR raises a concern.', modifier: { health: -10, trust: -15 } },
              ],
            },
          ],
        },
        {
          id: 5, title: 'Stage 5 — Handover & Closure',
          decisions: [
            {
              question: 'The project is complete. The IT Manager says the documentation "can wait." What do you do?',
              options: [
                { text: 'Agree — the project is done, documentation is low priority', consequence: 'Six months later, no one knows how the system works. Costly support issues follow.', modifier: { health: -10, trust: 0 } },
                { text: 'Insist on completing all handover documentation before formal closure', consequence: 'Professional closure. System is well-documented and supportable.', modifier: { health: 10, trust: 5 } },
                { text: 'Create a summary document yourself and close the project', consequence: 'Pragmatic. Not ideal but better than nothing.', modifier: { health: 5, trust: 0 } },
              ],
            },
          ],
        },
      ],
    },
  },

  // ── LEVEL 3 — Agile & Scrum (Pro) ────────────────────────────────────────

  {
    levelId: 3, orderIndex: 1, accessType: 'pro', isInterviewBank: false,
    title: 'The Sprint That Went Off the Rails',
    description: 'On Day 8 of a 2-week sprint, the team tells you they won\'t finish 4 of the 7 sprint items. The Product Owner expects a full demo on Day 14.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'You\'re Scrum Master on a 2-week sprint. On Day 8, the development team tells you they won\'t finish 4 of the 7 sprint items. The Product Owner is expecting a full demo on Day 14.',
      options: [
        { id: 'A', text: 'Promise the Product Owner everything will be done — motivate the team to push harder', consequence: 'Team overpromises and underdelivers. Trust erodes.', score: 2 },
        { id: 'B', text: 'Immediately inform the Product Owner, re-prioritise with them, and rescope the sprint demo', consequence: 'Transparent, collaborative, maintains sprint integrity.', score: 4 },
        { id: 'C', text: 'Remove the incomplete items from the sprint board so the burndown chart looks better', consequence: 'Manipulating data is a serious professional failure.', score: 1 },
        { id: 'D', text: 'Cancel the sprint and start again', consequence: 'Sprint cancellation is a last resort — not appropriate here.', score: 2 },
      ],
      takeaway: 'Transparency with the Product Owner is always better than false promises. Re-prioritise together.',
    },
  },

  {
    levelId: 3, orderIndex: 2, accessType: 'pro', isInterviewBank: false,
    title: 'Running a Sprint Retrospective',
    description: 'Your last three retrospectives have produced no real change. The team is going through the motions. How do you fix it?',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 8,
    content: {
      scenario: 'You\'re Scrum Master and your last three sprint retrospectives have produced no real change. The team is going through the motions — they list the same issues every time but nothing improves. The next retro is tomorrow.',
      options: [
        { id: 'A', text: 'Run the same format but push harder for action items', consequence: 'Same format, same results. Team disengages further.', score: 1 },
        { id: 'B', text: 'Try a different retrospective format (e.g. Start/Stop/Continue or 4Ls) and focus on one actionable improvement', consequence: 'Fresh format re-engages the team. One real change is agreed and owned.', score: 4 },
        { id: 'C', text: 'Cancel the retro — it\'s not working anyway', consequence: 'Team loses a key feedback loop. Issues compound.', score: 1 },
        { id: 'D', text: 'Ask the team to write their feedback anonymously before the meeting', consequence: 'Good addition but not enough on its own. Combine with a new format.', score: 3 },
      ],
      takeaway: 'Retrospectives only work if they produce real change. Vary the format and commit to one improvement per sprint.',
    },
  },

  {
    levelId: 3, orderIndex: 3, accessType: 'pro', isInterviewBank: false,
    title: 'Write a User Story',
    description: 'Complete a user story with acceptance criteria and story points for an e-commerce wishlist feature.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'confidence_builder', estimatedMinutes: 12,
    content: {
      projectBrief: 'You\'re working on an e-commerce platform. The business needs users to be able to save items to a wishlist.',
      documentType: 'User Story',
      fields: [
        { id: 'userStory', label: 'User story (As a [role], I want to [action], so that [benefit])', type: 'textarea', placeholder: 'As a [role], I want to [action], so that [benefit]' },
        { id: 'acceptanceCriteria', label: 'Acceptance criteria (3–5 Given/When/Then statements)', type: 'textarea', placeholder: 'Given [context], When [action], Then [outcome]' },
        { id: 'definitionOfDone', label: 'Definition of Done (3 items)', type: 'textarea', placeholder: 'e.g. Code reviewed, unit tests passing, deployed to staging' },
        { id: 'storyPoints', label: 'Story points estimate (1, 2, 3, 5, 8, or 13) with justification', type: 'textarea', placeholder: 'e.g. 5 points — requires backend API, frontend component, and database changes' },
      ],
      rubricFields: 'Valid user story format with role/action/benefit, 3-5 Given/When/Then acceptance criteria, 3 definition of done items, Fibonacci story points with justification',
    },
  },

  {
    levelId: 3, orderIndex: 4, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me About Working in an Agile Team',
    description: 'Demonstrate your understanding of Agile ceremonies, roles, and mindset in an interview context.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Tell me about your experience working in an Agile team. What ceremonies did you use, what was your role, and what did you learn?',
      context: 'You are interviewing for a Scrum Master or Agile PM role at a UK digital agency.',
      coachingFocus: 'Specific ceremonies mentioned, role clarity, continuous improvement mindset, team dynamics',
      minWords: 80,
      maxWords: 400,
    },
  },

  {
    levelId: 3, orderIndex: 5, accessType: 'pro', isInterviewBank: false,
    title: 'The Product Launch Sprint',
    description: 'Lead a 5-stage Agile product launch. Navigate backlog prioritisation, sprint failures, and stakeholder pressure.',
    type: 'full_project', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 55,
    content: {
      setup: 'You are Scrum Master/PM for a mobile app product launch at a UK fintech startup. 3-month timeline. Team: 2 developers, 1 designer, 1 QA. Product Owner: Head of Product.',
      stages: [
        {
          id: 1, title: 'Stage 1 — Sprint 1 Planning',
          decisions: [
            {
              question: 'The Product Owner has added 40 story points to a 30-point sprint. What do you do?',
              options: [
                { text: 'Accept it — the team will figure it out', consequence: 'Team is overloaded. Sprint fails. Morale drops.', modifier: { health: -10, trust: -5 } },
                { text: 'Facilitate a discussion to reduce scope to 30 points and defer the rest to the backlog', consequence: 'Sustainable pace maintained. Sprint succeeds.', modifier: { health: 10, trust: 5 } },
                { text: 'Ask the team to work overtime to fit it in', consequence: 'Team burns out. Quality suffers.', modifier: { health: -5, trust: -10 } },
              ],
            },
          ],
        },
        {
          id: 2, title: 'Stage 2 — Sprint 2 (Mid-Sprint)',
          decisions: [
            {
              question: 'A developer raises a technical debt issue that will slow down future sprints if not addressed now. The Product Owner wants to ignore it. What do you do?',
              options: [
                { text: 'Side with the Product Owner — delivery is the priority', consequence: 'Technical debt compounds. Sprint 4 velocity drops by 40%.', modifier: { health: -10, trust: 0 } },
                { text: 'Facilitate a conversation between the developer and Product Owner, quantify the risk', consequence: 'Team agrees to allocate 20% of Sprint 3 to tech debt. Good outcome.', modifier: { health: 10, trust: 5 } },
                { text: 'Create a separate tech debt backlog and schedule it for later', consequence: 'Compromise. Risk deferred but at least visible.', modifier: { health: 5, trust: 0 } },
              ],
            },
          ],
        },
        {
          id: 3, title: 'Stage 3 — Sprint Review',
          decisions: [
            {
              question: 'The sprint review demo crashes in front of stakeholders. The feature isn\'t ready. What do you do?',
              options: [
                { text: 'Apologise and end the meeting early', consequence: 'Stakeholders leave without understanding progress. Confidence drops.', modifier: { health: -5, trust: -10 } },
                { text: 'Acknowledge the issue, demo what is working, explain what happened and the fix plan', consequence: 'Transparent and professional. Stakeholders appreciate the honesty.', modifier: { health: 5, trust: 10 } },
                { text: 'Blame the developer in the meeting', consequence: 'Catastrophic for team trust and psychological safety.', modifier: { health: -15, trust: -20 } },
              ],
            },
          ],
        },
        {
          id: 4, title: 'Stage 4 — Sprint 4 (Final Push)',
          decisions: [
            {
              question: 'You\'re 2 weeks from launch. The QA tester has found 12 bugs — 3 are critical. The Product Owner wants to launch anyway. What do you do?',
              options: [
                { text: 'Launch as planned — users can report bugs', consequence: 'Critical bugs cause user data issues. App is pulled from the store.', modifier: { health: -20, trust: -15 } },
                { text: 'Fix the 3 critical bugs (2 days), defer the rest to post-launch patch', consequence: 'Pragmatic and responsible. Launch delayed by 2 days but safe.', modifier: { health: 10, trust: 10 } },
                { text: 'Fix all 12 bugs — quality is non-negotiable', consequence: 'Launch delayed by 2 weeks. Stakeholders frustrated but product is solid.', modifier: { health: 5, trust: 0 } },
              ],
            },
          ],
        },
        {
          id: 5, title: 'Stage 5 — Launch & Retrospective',
          decisions: [
            {
              question: 'The app launches successfully. The CEO wants to skip the retrospective and start the next product immediately. What do you do?',
              options: [
                { text: 'Agree — momentum is important', consequence: 'Same process issues repeat in the next product cycle.', modifier: { health: 0, trust: -5 } },
                { text: 'Run a 90-minute retrospective and capture 3 process improvements for the next cycle', consequence: 'Team grows. Next cycle is 20% more efficient.', modifier: { health: 10, trust: 5 } },
                { text: 'Send a retrospective survey instead', consequence: 'Low engagement but some learning captured.', modifier: { health: 5, trust: 0 } },
              ],
            },
          ],
        },
      ],
    },
  },

  // ── LEVEL 4 — Stakeholder Management (Pro) ───────────────────────────────

  {
    levelId: 4, orderIndex: 1, accessType: 'pro', isInterviewBank: false,
    title: 'The Stakeholder Who Went Quiet',
    description: 'A key stakeholder has stopped responding to emails and missed two steering group meetings. The project needs their sign-off to proceed.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 9,
    content: {
      scenario: 'A key stakeholder — the Finance Director — has stopped responding to your emails and missed two consecutive steering group meetings. The project needs their sign-off on the budget to proceed to the next phase.',
      options: [
        { id: 'A', text: 'Send another email and wait', consequence: 'Another week passes. Project is now delayed by 3 weeks.', score: 1 },
        { id: 'B', text: 'Call them directly, acknowledge they\'re busy, and ask for a 15-minute slot this week', consequence: 'Direct and respectful. They agree to a call and sign off within 2 days.', score: 4 },
        { id: 'C', text: 'Escalate to your sponsor and ask them to chase the Finance Director', consequence: 'Appropriate to inform your sponsor, but try direct contact first.', score: 3 },
        { id: 'D', text: 'Proceed without their sign-off — the project can\'t wait', consequence: 'Finance Director is furious. Budget approval is revoked.', score: 1 },
      ],
      takeaway: 'When a stakeholder goes quiet, a direct, respectful call is almost always more effective than another email.',
    },
  },

  {
    levelId: 4, orderIndex: 2, accessType: 'pro', isInterviewBank: false,
    title: 'The Angry Executive',
    description: 'A Director who wasn\'t consulted about your project sends a furious email — CC\'ing your CEO — after discovering it will affect their department.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 8,
    content: {
      scenario: 'You receive an email from a Director (not your sponsor) who is furious. They weren\'t consulted about the project and have just found out it will directly affect their department. They\'ve CC\'d your CEO.',
      options: [
        { id: 'A', text: 'Reply to all defending yourself and explaining they should have been in the RACI', consequence: 'Public argument with a Director damages your reputation and escalates the issue.', score: 1 },
        { id: 'B', text: 'Call them immediately, listen, apologise for the oversight, and arrange a briefing', consequence: 'Direct, empathetic, professional. Defuses the situation and builds a new ally.', score: 4 },
        { id: 'C', text: 'Forward to your sponsor and ask them to deal with it', consequence: 'Appropriate to inform sponsor, but you can\'t abdicate — follow up yourself.', score: 2 },
        { id: 'D', text: 'Ignore it for now and wait to see if your sponsor picks it up', consequence: 'Silence reads as incompetence. CEO now aware.', score: 1 },
      ],
      takeaway: 'When an executive is angry, call them — don\'t email. Listen first, then solve.',
    },
  },

  {
    levelId: 4, orderIndex: 3, accessType: 'pro', isInterviewBank: false,
    title: 'Build a Stakeholder Register',
    description: 'Complete a stakeholder register for a payroll system implementation, including interest, influence, attitude, and engagement strategy.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 18,
    content: {
      projectBrief: 'You are PM on a new payroll system implementation for a 500-person manufacturing company. Stakeholders include: HR Director, Finance Manager, 3 Payroll Administrators, IT Manager, CEO (project sponsor), 500 employees (end users), external payroll software vendor.',
      documentType: 'Stakeholder Register',
      fields: [
        { id: 'hrDirector', label: 'HR Director — Interest (H/M/L), Influence (H/M/L), Current attitude, Engagement strategy', type: 'textarea', placeholder: 'e.g. Interest: H, Influence: H, Attitude: Supportive, Strategy: Weekly 1-to-1 updates' },
        { id: 'financeManager', label: 'Finance Manager — Interest, Influence, Attitude, Engagement strategy', type: 'textarea', placeholder: '' },
        { id: 'payrollAdmins', label: 'Payroll Administrators (x3) — Interest, Influence, Attitude, Engagement strategy', type: 'textarea', placeholder: '' },
        { id: 'itManager', label: 'IT Manager — Interest, Influence, Attitude, Engagement strategy', type: 'textarea', placeholder: '' },
        { id: 'ceo', label: 'CEO (Sponsor) — Interest, Influence, Attitude, Engagement strategy', type: 'textarea', placeholder: '' },
        { id: 'employees', label: 'Employees (500 end users) — Interest, Influence, Attitude, Engagement strategy', type: 'textarea', placeholder: '' },
        { id: 'vendor', label: 'External Vendor — Interest, Influence, Attitude, Engagement strategy', type: 'textarea', placeholder: '' },
      ],
      rubricFields: 'All 7 stakeholders identified, realistic interest/influence ratings (not all the same), varied attitudes, engagement strategies tailored to each stakeholder\'s level of influence',
    },
  },

  {
    levelId: 4, orderIndex: 4, accessType: 'pro', isInterviewBank: false,
    title: 'Write a Stakeholder Communication Plan',
    description: 'Create a communication plan for a major IT rollout, defining what to communicate, to whom, when, and how.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are PM for a major IT system rollout across 3 hospital sites. 800 staff will be affected. The project runs for 6 months. Key stakeholders: CEO, Clinical Directors (x4), IT Manager, 800 clinical staff, external IT vendor.',
      documentType: 'Stakeholder Communication Plan',
      fields: [
        { id: 'executiveSponsor', label: 'CEO — What to communicate, frequency, channel, owner', type: 'textarea', placeholder: 'e.g. Project status, risks, budget. Monthly. Executive briefing. PM.' },
        { id: 'clinicalDirectors', label: 'Clinical Directors — What, frequency, channel, owner', type: 'textarea', placeholder: '' },
        { id: 'itManager', label: 'IT Manager — What, frequency, channel, owner', type: 'textarea', placeholder: '' },
        { id: 'clinicalStaff', label: 'Clinical Staff (800) — What, frequency, channel, owner', type: 'textarea', placeholder: '' },
        { id: 'vendor', label: 'IT Vendor — What, frequency, channel, owner', type: 'textarea', placeholder: '' },
        { id: 'escalationProcess', label: 'Escalation process — how will issues be escalated and to whom?', type: 'textarea', placeholder: '' },
      ],
      rubricFields: 'All stakeholders covered, appropriate frequency for each group, varied channels (not just email), named owners, escalation process defined',
    },
  },

  {
    levelId: 4, orderIndex: 5, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me About Managing a Difficult Stakeholder',
    description: 'A classic interview question — demonstrate empathy, professionalism, and outcome focus.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you had to manage a difficult stakeholder. What made them difficult, what did you do, and what was the outcome?',
      context: 'You are interviewing for a PM role at a UK NHS Trust.',
      coachingFocus: 'Empathy, specific actions taken, outcome achieved, relationship maintained',
      minWords: 80,
      maxWords: 400,
    },
  },

  {
    levelId: 4, orderIndex: 6, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me About Influencing Without Authority',
    description: 'Demonstrate your ability to get things done when you have no direct line management authority.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Describe a situation where you had to influence people who didn\'t report to you. How did you get them on board?',
      context: 'You are interviewing for a Senior PM role at a UK consulting firm.',
      coachingFocus: 'Specific influence tactics, relationship building, outcome achieved, PM without authority',
      minWords: 80,
      maxWords: 400,
    },
  },

  // ── LEVEL 5 — Risk & Budget Management (Pro) ─────────────────────────────

  {
    levelId: 5, orderIndex: 1, accessType: 'pro', isInterviewBank: false,
    title: 'The Risk That Materialised',
    description: 'A risk you identified and logged has just materialised. Your contingency plan is insufficient. What do you do?',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'A risk you identified in your risk register — "key supplier may go into administration" — has just materialised. The supplier has entered administration and cannot fulfil their contract. Your contingency was to "find an alternative supplier" but you haven\'t identified one. The project is 3 months from completion.',
      options: [
        { id: 'A', text: 'Immediately inform your sponsor and present 3 options: find a new supplier, bring the work in-house, or descope', consequence: 'Transparent and solution-focused. Sponsor appreciates the options.', score: 4 },
        { id: 'B', text: 'Spend a week finding a new supplier before telling anyone', consequence: 'A week of silence. Sponsor finds out from someone else and loses trust.', score: 1 },
        { id: 'C', text: 'Raise a formal issue in the risk register and wait for the next steering group', consequence: 'Too slow. Project stalls for 3 weeks waiting for the next meeting.', score: 2 },
        { id: 'D', text: 'Ask your team to absorb the supplier\'s work', consequence: 'Team is already at capacity. Quality drops and morale collapses.', score: 1 },
      ],
      takeaway: 'When a risk materialises, communicate immediately and come with options — never just problems.',
    },
  },

  {
    levelId: 5, orderIndex: 2, accessType: 'pro', isInterviewBank: false,
    title: 'Budget Overrun at Week 6',
    description: 'You\'re 6 weeks into a 6-month project and already 18% over budget due to higher contractor rates. Your sponsor doesn\'t know yet.',
    type: 'decision_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'You\'re 6 weeks into a 6-month project. You\'ve just reviewed the finances and realised you\'re already 18% over budget due to higher-than-expected contractor rates. Your sponsor doesn\'t know yet.',
      options: [
        { id: 'A', text: 'Say nothing and try to recover the overspend by cutting quality elsewhere', consequence: 'Hidden financial risk. Discovered later. Serious damage to your credibility.', score: 1 },
        { id: 'B', text: 'Immediately flag the variance to your sponsor, explain the cause, and present 3 options for resolution', consequence: 'Transparent reporting, solution-focused. Exactly what a good PM does.', score: 4 },
        { id: 'C', text: 'Request an emergency budget increase without explaining why it happened', consequence: 'Sponsor won\'t approve without understanding cause — and will lose confidence in you.', score: 2 },
        { id: 'D', text: 'Pause the project until you\'ve worked out what to do', consequence: 'Pausing a project without cause creates more problems than it solves.', score: 1 },
      ],
      takeaway: 'Financial transparency is non-negotiable. Flag variances early, explain the cause, and come with solutions.',
    },
  },

  {
    levelId: 5, orderIndex: 3, accessType: 'pro', isInterviewBank: false,
    title: 'Build a Risk Register',
    description: 'Complete a risk register for a software migration project, identifying at least 6 risks with probability, impact, mitigation, and contingency.',
    type: 'build_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 20,
    content: {
      projectBrief: 'You are PM for a 4-month software migration project. The project involves moving 10,000 customer records from a legacy system to a new CRM. Team of 4. Budget: £45,000.',
      documentType: 'Risk Register',
      fields: [
        { id: 'risk1', label: 'Risk 1 — Description, Probability (H/M/L), Impact (H/M/L), Mitigation, Contingency, Owner', type: 'textarea', placeholder: 'e.g. Data loss during migration | H | H | Daily backups, test migration first | Restore from backup | IT Manager' },
        { id: 'risk2', label: 'Risk 2', type: 'textarea', placeholder: '' },
        { id: 'risk3', label: 'Risk 3', type: 'textarea', placeholder: '' },
        { id: 'risk4', label: 'Risk 4', type: 'textarea', placeholder: '' },
        { id: 'risk5', label: 'Risk 5', type: 'textarea', placeholder: '' },
        { id: 'risk6', label: 'Risk 6', type: 'textarea', placeholder: '' },
      ],
      rubricFields: 'At least 6 risks covering different categories (technical, resource, stakeholder, compliance), realistic probability/impact ratings, mitigations that are specific actions (not just "monitor"), contingencies that differ from mitigations, named owners for each risk',
    },
  },

  {
    levelId: 5, orderIndex: 4, accessType: 'pro', isInterviewBank: false,
    title: 'Write a Budget Forecast',
    description: 'Create a budget forecast for a construction fit-out project, tracking actuals vs planned and projecting end-of-project spend.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 18,
    content: {
      projectBrief: 'You are PM for a £200,000 office fit-out project. At Week 8 of 20, you\'ve spent £95,000 against a planned £80,000. You need to forecast the final cost and explain the variance.',
      documentType: 'Budget Forecast',
      fields: [
        { id: 'plannedBudget', label: 'Total planned budget', type: 'text', placeholder: 'e.g. £200,000' },
        { id: 'spentToDate', label: 'Actual spend to date (Week 8)', type: 'text', placeholder: 'e.g. £95,000' },
        { id: 'varianceExplanation', label: 'Variance explanation — why are you £15,000 over at Week 8?', type: 'textarea', placeholder: 'Explain the causes of the variance' },
        { id: 'remainingBudget', label: 'Remaining budget available', type: 'text', placeholder: 'e.g. £105,000' },
        { id: 'forecastFinalCost', label: 'Forecast final cost and justification', type: 'textarea', placeholder: 'Based on current burn rate, the project will cost...' },
        { id: 'recoveryActions', label: 'Recovery actions — how will you bring the project back within budget?', type: 'textarea', placeholder: 'List 2-3 specific actions to reduce spend' },
      ],
      rubricFields: 'Correct remaining budget calculation, realistic forecast based on current burn rate, clear variance explanation, specific recovery actions (not vague)',
    },
  },

  {
    levelId: 5, orderIndex: 5, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me About Managing a Project Risk',
    description: 'Demonstrate your risk management thinking with a specific STAR example.',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Tell me about a time you identified and managed a significant project risk. What was the risk, what did you do, and what happened?',
      context: 'You are interviewing for a PM role at a UK infrastructure company.',
      coachingFocus: 'Risk identification process, specific mitigation actions, outcome, learning',
      minWords: 80,
      maxWords: 400,
    },
  },

  {
    levelId: 5, orderIndex: 6, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me About a Time Your Project Went Over Budget',
    description: 'A high-stakes interview question — demonstrate financial accountability and recovery thinking.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time a project you managed went over budget. What happened, what did you do, and what did you learn?',
      context: 'You are interviewing for a Senior PM role at a UK construction or professional services firm.',
      coachingFocus: 'Accountability, root cause analysis, recovery actions, learning applied to future projects',
      minWords: 80,
      maxWords: 400,
    },
  },

  // ── LEVEL 6 — Leadership & Team Management (Pro) ─────────────────────────

  {
    levelId: 6, orderIndex: 1, accessType: 'pro', isInterviewBank: false,
    title: 'The Underperforming Team Member',
    description: 'A developer has missed two sprint commitments in a row. The team are noticing. They say they\'re fine but their output tells a different story.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 10,
    content: {
      scenario: 'One of your developers has missed two sprint commitments in a row. The rest of the team are starting to notice and complain privately. The developer in question says they\'re fine but their output tells a different story.',
      options: [
        { id: 'A', text: 'Raise it publicly in the next team standup to make the issue visible', consequence: 'Public callout destroys psychological safety. Team trust collapses.', score: 1 },
        { id: 'B', text: 'Have a private 1-to-1 conversation, listen first, then set clear expectations with a documented follow-up', consequence: 'Private, empathetic, clear. Exactly the right management approach.', score: 4 },
        { id: 'C', text: 'Go straight to HR and raise a performance concern', consequence: 'Too early — this escalates before giving the individual a fair chance.', score: 2 },
        { id: 'D', text: 'Redistribute their work to the rest of the team without saying anything', consequence: 'Team resentment builds. Root cause unaddressed.', score: 2 },
      ],
      takeaway: 'Always address performance issues privately first. Listen before you judge — there\'s often something going on.',
    },
  },

  {
    levelId: 6, orderIndex: 2, accessType: 'pro', isInterviewBank: false,
    title: 'Team Conflict Mid-Project',
    description: 'Two senior team members have had a public argument in a team meeting. The tension is affecting the whole team\'s productivity.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'common_scenario', estimatedMinutes: 9,
    content: {
      scenario: 'Two senior team members had a public argument in yesterday\'s team meeting about the technical approach. Both are now refusing to collaborate. The tension is affecting the whole team\'s productivity and the project is at a critical stage.',
      options: [
        { id: 'A', text: 'Ignore it and hope it resolves itself', consequence: 'Conflict festers. Two more team members take sides. Project quality drops.', score: 1 },
        { id: 'B', text: 'Meet with each person separately, then bring them together to agree a way forward', consequence: 'Structured conflict resolution. Both feel heard. Collaboration resumes.', score: 4 },
        { id: 'C', text: 'Tell both of them to "be professional" in a group email', consequence: 'Dismissive. Neither feels heard. Tension continues.', score: 1 },
        { id: 'D', text: 'Remove one of them from the project', consequence: 'Drastic and premature. You lose a senior resource and the team loses confidence in you.', score: 2 },
      ],
      takeaway: 'Conflict needs to be addressed directly. Separate conversations first, then a joint resolution meeting.',
    },
  },

  {
    levelId: 6, orderIndex: 3, accessType: 'pro', isInterviewBank: false,
    title: 'The Burned-Out Developer',
    description: 'Your lead developer has been working 60-hour weeks for 6 weeks. They\'re making mistakes and seem exhausted. The project still has 8 weeks to go.',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 8,
    content: {
      scenario: 'Your lead developer has been working 60-hour weeks for 6 weeks. They\'re making mistakes they wouldn\'t normally make and seem exhausted. The project still has 8 weeks to go and they\'re the only person who knows the codebase.',
      options: [
        { id: 'A', text: 'Push them to keep going — the project needs them', consequence: 'Developer goes on sick leave in Week 9. Project stalls completely.', score: 1 },
        { id: 'B', text: 'Have a private conversation, reduce their workload, and arrange knowledge transfer to another team member', consequence: 'Developer recovers. Knowledge is shared. Project completes successfully.', score: 4 },
        { id: 'C', text: 'Tell them to take a week off — the project can wait', consequence: 'Good intention but no plan. Project stalls and knowledge is still siloed.', score: 2 },
        { id: 'D', text: 'Bring in a contractor to take over their work', consequence: 'Expensive and disruptive. Developer feels replaced and leaves.', score: 2 },
      ],
      takeaway: 'Burnout is a project risk. Address it early with empathy and a practical plan — not just sympathy.',
    },
  },

  {
    levelId: 6, orderIndex: 4, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me How You Motivate a Team',
    description: 'Demonstrate your leadership philosophy with a specific example of how you\'ve motivated a team under pressure.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Tell me about a time you had to motivate a team that was struggling. What did you do and what was the result?',
      context: 'You are interviewing for a Programme Manager role at a UK public sector organisation.',
      coachingFocus: 'Specific motivation techniques, individual vs team approach, outcome achieved, leadership style',
      minWords: 80,
      maxWords: 400,
    },
  },

  {
    levelId: 6, orderIndex: 5, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me About Dealing With Conflict',
    description: 'A high-frequency interview question — demonstrate structured conflict resolution with a real example.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'Describe a situation where you had to deal with conflict within your team or with a stakeholder. How did you handle it and what was the outcome?',
      context: 'You are interviewing for a PM or team lead role at a UK tech company.',
      coachingFocus: 'Conflict resolution approach, empathy, specific actions, outcome, learning',
      minWords: 80,
      maxWords: 400,
    },
  },

  {
    levelId: 6, orderIndex: 6, accessType: 'pro', isInterviewBank: false,
    title: 'Write a Team Performance Note',
    description: 'Document a performance conversation with a team member who has missed two deadlines, following HR best practice.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 15,
    content: {
      projectBrief: 'You are PM and line manager for a project team. A team member (Business Analyst) has missed two agreed deadlines in the past 3 weeks. You\'ve had an informal conversation but the issue continues. You need to document a formal performance note.',
      documentType: 'Team Performance Note',
      fields: [
        { id: 'summary', label: 'Summary of performance concern (2-3 sentences)', type: 'textarea', placeholder: 'Describe the specific behaviour and its impact on the project' },
        { id: 'incidents', label: 'Specific incidents (dates, what was expected, what happened)', type: 'textarea', placeholder: 'e.g. 12 May: Requirements document due, submitted 4 days late without prior notice' },
        { id: 'impact', label: 'Impact on the project and team', type: 'textarea', placeholder: 'How has this affected the project?' },
        { id: 'previousDiscussion', label: 'Summary of previous informal conversation', type: 'textarea', placeholder: 'When was it, what was agreed?' },
        { id: 'expectations', label: 'Clear expectations going forward (SMART)', type: 'textarea', placeholder: 'Specific, measurable expectations for the next 4 weeks' },
        { id: 'supportOffered', label: 'Support offered to the team member', type: 'textarea', placeholder: 'What help or resources are you providing?' },
        { id: 'reviewDate', label: 'Review date and next steps', type: 'textarea', placeholder: 'When will you review progress?' },
      ],
      rubricFields: 'Specific incidents with dates, impact clearly stated, previous discussion referenced, SMART expectations set, support offered (not just criticism), review date included',
    },
  },

  // ── LEVEL 7 — Advanced PM & Certification Prep (Pro) ─────────────────────

  {
    levelId: 7, orderIndex: 1, accessType: 'pro', isInterviewBank: false,
    title: 'The Project That Should Be Stopped',
    description: 'Your project is 60% complete but the business case has fundamentally changed. Continuing will waste £200,000. What do you recommend?',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 12,
    content: {
      scenario: 'Your project is 60% complete and has spent £300,000 of a £500,000 budget. The business landscape has changed significantly — the original business case no longer holds. Completing the project will cost another £200,000 but deliver only 30% of the original benefit. The project sponsor wants to push on because "we\'ve come too far to stop."',
      options: [
        { id: 'A', text: 'Agree with the sponsor — sunk cost logic applies', consequence: 'Project completes but delivers minimal value. £200,000 wasted.', score: 1 },
        { id: 'B', text: 'Prepare a formal benefits realisation review, present the revised business case, and recommend stopping or descoping', consequence: 'Courageous and professional. Board agrees to stop. £200,000 saved.', score: 4 },
        { id: 'C', text: 'Quietly reduce scope to save money without telling the sponsor', consequence: 'Sponsor discovers the descope. Trust destroyed.', score: 1 },
        { id: 'D', text: 'Ask the project board to make the decision without your recommendation', consequence: 'You\'ve abdicated your PM responsibility. Board expects your view.', score: 2 },
      ],
      takeaway: 'Sunk cost fallacy is one of the biggest traps in project management. A good PM recommends stopping when the business case no longer holds.',
    },
  },

  {
    levelId: 7, orderIndex: 2, accessType: 'pro', isInterviewBank: false,
    title: 'The Benefits Realisation Review',
    description: 'Six months after your project closed, the benefits haven\'t materialised. The business is asking why. What do you do?',
    type: 'decision_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 10,
    content: {
      scenario: 'Six months after your project closed, the business is reporting that the expected benefits — £500,000 annual savings — haven\'t materialised. The CFO is asking for an explanation. You\'re no longer the PM but you were responsible for the benefits realisation plan.',
      options: [
        { id: 'A', text: 'Blame the operational team for not implementing the changes properly', consequence: 'Defensive and unprofessional. Damages relationships and your reputation.', score: 1 },
        { id: 'B', text: 'Request a benefits realisation review, identify root causes, and present a recovery plan', consequence: 'Professional and accountable. CFO appreciates the structured approach.', score: 4 },
        { id: 'C', text: 'Point out that benefits realisation wasn\'t in your project scope', consequence: 'Technically possible but politically damaging. You look like you\'re avoiding accountability.', score: 2 },
        { id: 'D', text: 'Say nothing and wait for the issue to go away', consequence: 'CFO escalates. You\'re called into a formal review.', score: 1 },
      ],
      takeaway: 'Benefits realisation is the PM\'s responsibility even after project closure. Own it, investigate it, fix it.',
    },
  },

  {
    levelId: 7, orderIndex: 3, accessType: 'pro', isInterviewBank: false,
    title: 'Write a Business Case',
    description: 'Complete a summary business case for a board proposal to open a second office in Manchester, including ROI calculation.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 25,
    content: {
      projectBrief: 'Your organisation wants to open a second office in Manchester. You\'ve been asked to write a summary business case to present to the board. Investment required: £200,000. Expected annual benefit: £120,000. Project duration: 9 months.',
      documentType: 'Business Case',
      fields: [
        { id: 'executiveSummary', label: 'Executive summary (100 words max)', type: 'textarea', placeholder: 'Summarise the proposal, investment, and recommendation in 100 words' },
        { id: 'problemStatement', label: 'Problem / opportunity statement', type: 'textarea', placeholder: 'Why is this investment needed now?' },
        { id: 'optionsConsidered', label: 'Options considered (list 3, including "do nothing")', type: 'textarea', placeholder: 'Option 1: Do nothing. Option 2: ... Option 3: ...' },
        { id: 'recommendedOption', label: 'Recommended option and rationale', type: 'textarea', placeholder: 'Which option do you recommend and why?' },
        { id: 'costBreakdown', label: 'Costs breakdown (capital, running, one-off)', type: 'textarea', placeholder: 'e.g. Capital: £150,000. Running: £30,000/yr. One-off: £20,000.' },
        { id: 'benefits', label: 'Benefits (financial and non-financial)', type: 'textarea', placeholder: 'Financial: £120,000/yr. Non-financial: ...' },
        { id: 'roiCalculation', label: 'ROI calculation', type: 'textarea', placeholder: 'e.g. Payback period = £200,000 / £120,000 = 1.67 years' },
        { id: 'keyRisks', label: 'Key risks', type: 'textarea', placeholder: 'List 3 key risks with mitigations' },
        { id: 'recommendation', label: 'Recommendation', type: 'textarea', placeholder: 'Clear recommendation to the board' },
      ],
      rubricFields: 'All sections present, logical argument, ROI correctly calculated (payback ~1.67 years), non-financial benefits included, at least 3 risks acknowledged, clear recommendation',
    },
  },

  {
    levelId: 7, orderIndex: 4, accessType: 'pro', isInterviewBank: false,
    title: 'Write a Lessons Learned Report',
    description: 'Document lessons learned from a completed NHS IT project, covering what went well, what didn\'t, and recommendations for future projects.',
    type: 'build_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 20,
    content: {
      projectBrief: 'You have just completed a 9-month NHS patient records digitisation project. Budget: £350,000 (final spend: £380,000). Timeline: 9 months (actual: 11 months). The project delivered all key objectives but ran over budget and time.',
      documentType: 'Lessons Learned Report',
      fields: [
        { id: 'projectSummary', label: 'Project summary (what was delivered, final budget, final timeline)', type: 'textarea', placeholder: '' },
        { id: 'wentWell', label: 'What went well (list 3–5 with explanation)', type: 'textarea', placeholder: 'e.g. Stakeholder engagement was strong throughout...' },
        { id: 'wentPoorly', label: 'What didn\'t go well (list 3–5 with root cause)', type: 'textarea', placeholder: 'e.g. Budget overrun — root cause was underestimated contractor rates...' },
        { id: 'recommendations', label: 'Recommendations for future projects (list 3–5 actionable recommendations)', type: 'textarea', placeholder: 'e.g. Always include a 15% contingency for contractor costs...' },
        { id: 'processImprovements', label: 'Process improvements to implement immediately', type: 'textarea', placeholder: 'What should change in how we run projects from now on?' },
        { id: 'acknowledgements', label: 'Team acknowledgements', type: 'textarea', placeholder: 'Recognise key contributions' },
      ],
      rubricFields: 'Balanced (both positive and negative), root causes identified (not just symptoms), actionable recommendations (not vague), process improvements specified, professional tone',
    },
  },

  {
    levelId: 7, orderIndex: 5, accessType: 'pro', isInterviewBank: false,
    title: 'APM PMQ Exam Technique — Question 1',
    description: 'Practice APM PMQ-style exam writing with a governance and stakeholder question. Scored against APM marking criteria.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 15,
    content: {
      question: 'Explain the purpose of project governance and describe two ways a project manager can ensure effective governance throughout a project lifecycle. (APM PMQ style — 10 marks)',
      context: 'This is an APM PMQ exam-style question. Write as you would in an exam: structured, concise, and using correct PM terminology. Aim for 200-250 words.',
      coachingFocus: 'APM terminology, structured response, two distinct governance mechanisms, lifecycle awareness',
      minWords: 150,
      maxWords: 300,
    },
  },

  {
    levelId: 7, orderIndex: 6, accessType: 'pro', isInterviewBank: false,
    title: 'APM PMQ Exam Technique — Question 2',
    description: 'Practice APM PMQ-style exam writing with a risk management question. Scored against APM marking criteria.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'exam_prep', estimatedMinutes: 15,
    content: {
      question: 'Describe the risk management process and explain the difference between a risk response of "mitigate" and "transfer." Give one example of each. (APM PMQ style — 10 marks)',
      context: 'This is an APM PMQ exam-style question. Write as you would in an exam: structured, concise, and using correct PM terminology. Aim for 200-250 words.',
      coachingFocus: 'APM risk management process, clear distinction between mitigation and transfer, concrete examples',
      minWords: 150,
      maxWords: 300,
    },
  },

  {
    levelId: 7, orderIndex: 7, accessType: 'pro', isInterviewBank: false,
    title: 'Tell Me About Your Approach to Project Governance',
    description: 'Demonstrate advanced governance thinking in an interview for a senior PM or programme manager role.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'interview_favourite', estimatedMinutes: 15,
    content: {
      question: 'How do you approach project governance? What mechanisms do you use to ensure accountability, transparency, and decision-making at the right level?',
      context: 'You are interviewing for a Programme Manager or Head of PMO role at a UK public sector or large enterprise organisation.',
      coachingFocus: 'Governance structures, escalation frameworks, reporting cadence, decision rights, accountability',
      minWords: 100,
      maxWords: 400,
    },
  },

  // ── INTERVIEW BANK (standalone, any level) ───────────────────────────────

  {
    levelId: 1, orderIndex: 100, accessType: 'free', isInterviewBank: true,
    title: 'IQ-01: Delivering Under Pressure',
    description: 'Tell me about a time you delivered a project under pressure.',
    type: 'interview_sim', difficulty: 'beginner', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Tell me about a time you delivered a project or piece of work under significant pressure. What was the situation, what did you do, and what was the outcome?',
      context: 'You are interviewing for a Junior PM role.',
      coachingFocus: 'Resilience, specific actions under pressure, outcome achieved, learning',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 1, orderIndex: 101, accessType: 'free', isInterviewBank: true,
    title: 'IQ-02: Prioritising When Everything Is Urgent',
    description: 'How do you prioritise when everything is urgent?',
    type: 'interview_sim', difficulty: 'beginner', categoryTag: 'interview_favourite', estimatedMinutes: 10,
    content: {
      question: 'How do you prioritise when everything feels urgent? Walk me through your approach.',
      context: 'You are interviewing for a PM or project coordinator role.',
      coachingFocus: 'Prioritisation frameworks (MoSCoW, Eisenhower), stakeholder communication, decision rationale',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 3, orderIndex: 102, accessType: 'pro', isInterviewBank: true,
    title: 'IQ-03: Stakeholder Who Keeps Changing Their Mind',
    description: 'How do you handle a stakeholder who keeps changing their requirements?',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'Describe how you would handle a stakeholder who keeps changing their mind about what they want from the project.',
      context: 'You are interviewing for a PM role at a UK digital agency.',
      coachingFocus: 'Change control, stakeholder management, assertiveness, outcome focus',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 3, orderIndex: 103, accessType: 'pro', isInterviewBank: true,
    title: 'IQ-04: A Project That Failed',
    description: 'Tell me about a project that failed. What did you learn?',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'high_impact', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a project or piece of work that didn\'t go as planned. What happened, what was your role, and what did you learn from it?',
      context: 'You are interviewing for a PM role. This question tests self-awareness and honesty.',
      coachingFocus: 'Accountability, root cause analysis, learning applied, growth mindset',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 4, orderIndex: 104, accessType: 'pro', isInterviewBank: true,
    title: 'IQ-05: Managing a Team Without Authority',
    description: 'How do you manage a team you have no authority over?',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'interview_favourite', estimatedMinutes: 12,
    content: {
      question: 'How do you manage and motivate a team when you have no direct line management authority over them?',
      context: 'You are interviewing for a PM role in a matrix organisation.',
      coachingFocus: 'Influence tactics, relationship building, clarity of purpose, accountability without authority',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 4, orderIndex: 105, accessType: 'pro', isInterviewBank: true,
    title: 'IQ-06: Taking Over an Existing Project',
    description: 'What\'s the first thing you do when you take over an existing project?',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'common_scenario', estimatedMinutes: 12,
    content: {
      question: 'What is the first thing you do when you take over an existing project that is already in progress?',
      context: 'You are interviewing for a PM role. This tests your assimilation and initiation thinking.',
      coachingFocus: 'Structured assimilation, stakeholder mapping, risk assessment, communication, not assuming',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 1, orderIndex: 106, accessType: 'free', isInterviewBank: true,
    title: 'IQ-07: Explaining PM to a Non-PM',
    description: 'How would you explain project management to someone who\'s never heard of it?',
    type: 'interview_sim', difficulty: 'beginner', categoryTag: 'confidence_builder', estimatedMinutes: 8,
    content: {
      question: 'How would you explain what a project manager does to someone who has never worked with one before?',
      context: 'You are in a networking event or informal interview. This tests communication and clarity of thinking.',
      coachingFocus: 'Clear language, relatable analogy, covering scope/time/cost/people without jargon',
      minWords: 60, maxWords: 300,
    },
  },

  {
    levelId: 7, orderIndex: 107, accessType: 'pro', isInterviewBank: true,
    title: 'IQ-08: Pushing Back on a Sponsor',
    description: 'Tell me about a time you had to push back on a sponsor\'s request.',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 15,
    content: {
      question: 'Tell me about a time you had to push back on a request from a sponsor or senior stakeholder. How did you handle it and what happened?',
      context: 'You are interviewing for a Senior PM role. This tests assertiveness and governance thinking.',
      coachingFocus: 'Assertiveness, evidence-based argument, relationship maintained, outcome achieved',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 7, orderIndex: 108, accessType: 'pro', isInterviewBank: true,
    title: 'IQ-09: What Good Looks Like in Lessons Learned',
    description: 'What does a genuinely useful lessons learned session look like?',
    type: 'interview_sim', difficulty: 'intermediate', categoryTag: 'exam_prep', estimatedMinutes: 10,
    content: {
      question: 'What does good look like in a lessons learned session? How do you make sure it actually leads to improvement?',
      context: 'You are interviewing for a PM or PMO role.',
      coachingFocus: 'Facilitation, psychological safety, actionable outputs, follow-through, continuous improvement',
      minWords: 80, maxWords: 400,
    },
  },

  {
    levelId: 5, orderIndex: 109, accessType: 'pro', isInterviewBank: true,
    title: 'IQ-10: Knowing When a Project Is Truly at Risk',
    description: 'How do you know when a project is genuinely at risk — not just experiencing normal turbulence?',
    type: 'interview_sim', difficulty: 'advanced', categoryTag: 'high_impact', estimatedMinutes: 12,
    content: {
      question: 'How do you know when a project is truly at risk, as opposed to just going through normal challenges? What early warning signs do you look for?',
      context: 'You are interviewing for a Senior PM or Programme Manager role.',
      coachingFocus: 'Early warning indicators, monitoring techniques, escalation judgement, experience-based pattern recognition',
      minWords: 80, maxWords: 400,
    },
  },
];

// ─── insert ──────────────────────────────────────────────────────────────────

console.log(`\nSeeding ${simulations.length} simulations...\n`);

for (const sim of simulations) {
  await upsert(sim);
}

console.log('\n✅ Simulation seeding complete.\n');
await conn.end();
