/**
 * Maps each lesson (by ID) to the 1-2 most relevant simulation IDs.
 * Simulations are matched by topic so users can practise immediately after learning.
 *
 * Lesson IDs follow the pattern:
 *   Level 1 → 1–12
 *   Level 2 → 120001–120012
 *   Level 3 → 130001–130012
 *   Level 4 → 140001–140012
 *   Level 5 → 150001–150012
 *   Level 6 → 160001–160012
 *   Level 7 → 170001–170012
 *
 * Simulation IDs are the auto-incremented DB IDs assigned during seeding.
 * We store them by title so the mapping survives re-seeds.
 */

export interface LessonSimulationHint {
  /** Simulation title — used to look up the DB row */
  title: string;
  /** Short prompt shown to the user e.g. "Try this scenario" */
  prompt: string;
}

/**
 * Returns up to 2 simulation hints for a given lesson ID.
 * Falls back to level-wide suggestions if no exact match exists.
 */
export function getSimulationHintsForLesson(lessonId: number): LessonSimulationHint[] {
  const exact = LESSON_SIM_MAP[lessonId];
  if (exact && exact.length > 0) return exact;

  // Level-wide fallback: return the first simulation for the level
  const levelId = getLevelFromLessonId(lessonId);
  return LEVEL_FALLBACK_MAP[levelId] ?? [];
}

function getLevelFromLessonId(lessonId: number): number {
  if (lessonId >= 170001) return 7;
  if (lessonId >= 160001) return 6;
  if (lessonId >= 150001) return 5;
  if (lessonId >= 140001) return 4;
  if (lessonId >= 130001) return 3;
  if (lessonId >= 120001) return 2;
  return 1;
}

// ─── Level-wide fallbacks ─────────────────────────────────────────────────────

const LEVEL_FALLBACK_MAP: Record<number, LessonSimulationHint[]> = {
  1: [
    { title: "The Scope That Wouldn't Stop Growing", prompt: "Practice: handle scope creep in a real scenario" },
    { title: "Your First Kick-Off Meeting", prompt: "Practice: run your first kick-off meeting" },
  ],
  2: [
    { title: "The Requirements That Changed Overnight", prompt: "Practice: manage a change request in waterfall" },
    { title: "Building a Waterfall Project Plan", prompt: "Practice: build a full waterfall plan" },
  ],
  3: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: rescue a failing sprint" },
    { title: "Write a Sprint Retrospective", prompt: "Practice: write a retrospective report" },
  ],
  4: [
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: re-engage a disengaged stakeholder" },
    { title: "Build a Stakeholder Register", prompt: "Practice: map your stakeholders" },
  ],
  5: [
    { title: "The Risk That Nobody Wanted to Raise", prompt: "Practice: handle a risk nobody flagged" },
    { title: "Build a Risk Register", prompt: "Practice: build a full risk register" },
  ],
  6: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: address a performance issue" },
    { title: "The Conflict in the Team", prompt: "Practice: resolve a team conflict" },
  ],
  7: [
    { title: "The Audit That Found Gaps", prompt: "Practice: respond to a governance audit" },
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: answer a senior PM interview question" },
  ],
};

// ─── Exact lesson-to-simulation mappings ─────────────────────────────────────
// Format: lessonId → up to 2 simulation hints

const LESSON_SIM_MAP: Record<number, LessonSimulationHint[]> = {

  // ── LEVEL 1 — Introduction to PM ──────────────────────────────────────────

  // Lesson 1: What is Project Management?
  1: [
    { title: "Your First Kick-Off Meeting", prompt: "Now practice: run your first kick-off meeting" },
  ],
  // Lesson 2: The PM Role & Responsibilities
  2: [
    { title: "Your First Kick-Off Meeting", prompt: "Practice: set the right tone as PM from day one" },
    { title: "Tell Me About a Time You Managed Priorities", prompt: "Practice: answer a PM interview question" },
  ],
  // Lesson 3: Project Lifecycle Overview
  3: [
    { title: "The Digital Transformation Project", prompt: "Practice: navigate a full project lifecycle end-to-end" },
  ],
  // Lesson 4: Stakeholders & Communication
  4: [
    { title: "Your First Kick-Off Meeting", prompt: "Practice: manage stakeholders from the very first meeting" },
  ],
  // Lesson 5: Scope & Requirements
  5: [
    { title: "The Scope That Wouldn't Stop Growing", prompt: "Practice: handle scope creep in a live scenario" },
    { title: "Write Your First Project Brief", prompt: "Practice: define scope in a real project brief" },
  ],
  // Lesson 6: Planning & Scheduling
  6: [
    { title: "Write Your First Project Brief", prompt: "Practice: write a project brief with timeline and scope" },
    { title: "The Digital Transformation Project", prompt: "Practice: plan a full project from initiation to closure" },
  ],
  // Lesson 7: Risk Management Basics
  7: [
    { title: "The Digital Transformation Project", prompt: "Practice: identify and manage risks in a live project" },
  ],
  // Lesson 8: Budget & Cost Management
  8: [
    { title: "The Digital Transformation Project", prompt: "Practice: manage budget decisions across a full project" },
  ],
  // Lesson 9: Quality Management
  9: [
    { title: "Write Your First Project Brief", prompt: "Practice: define quality criteria in a project brief" },
  ],
  // Lesson 10: Change Management
  10: [
    { title: "The Scope That Wouldn't Stop Growing", prompt: "Practice: apply change control in a real scenario" },
  ],
  // Lesson 11: Project Closure & Lessons Learned
  11: [
    { title: "The Digital Transformation Project", prompt: "Practice: close a project professionally — all 5 stages" },
  ],
  // Lesson 12: PM Tools & Frameworks Overview
  12: [
    { title: "Tell Me About a Time You Managed Priorities", prompt: "Practice: demonstrate PM knowledge in an interview" },
    { title: "Write Your First Project Brief", prompt: "Practice: apply PM tools in a real document" },
  ],

  // ── LEVEL 2 — Waterfall Methodology ───────────────────────────────────────

  // Lesson 1: What is Waterfall?
  120001: [
    { title: "The Requirements That Changed Overnight", prompt: "Practice: handle a change request in a waterfall project" },
  ],
  // Lesson 2: Waterfall Phases in Detail
  120002: [
    { title: "Building a Waterfall Project Plan", prompt: "Practice: build a complete waterfall project plan" },
  ],
  // Lesson 3: Requirements Gathering & Sign-Off
  120003: [
    { title: "The Requirements That Changed Overnight", prompt: "Practice: manage signed-off requirements being challenged" },
    { title: "Building a Waterfall Project Plan", prompt: "Practice: include a requirements phase in your plan" },
  ],
  // Lesson 4: Creating a Work Breakdown Structure
  120004: [
    { title: "Building a Waterfall Project Plan", prompt: "Practice: structure your WBS in a full project plan" },
  ],
  // Lesson 5: Gantt Charts & Scheduling
  120005: [
    { title: "Building a Waterfall Project Plan", prompt: "Practice: schedule all phases in a waterfall plan" },
    { title: "The Infrastructure Upgrade Project", prompt: "Practice: manage a scheduled waterfall project end-to-end" },
  ],
  // Lesson 6: Dependencies & Critical Path
  120006: [
    { title: "The Infrastructure Upgrade Project", prompt: "Practice: navigate dependencies in a complex project" },
  ],
  // Lesson 7: Change Control in Waterfall
  120007: [
    { title: "The Requirements That Changed Overnight", prompt: "Practice: raise a formal Change Request" },
    { title: "The Go-Live Decision", prompt: "Practice: make a go/no-go decision at the quality gate" },
  ],
  // Lesson 8: Testing & Quality Gates
  120008: [
    { title: "The Go-Live Decision", prompt: "Practice: decide whether to go live with known bugs" },
  ],
  // Lesson 9: Go-Live Planning
  120009: [
    { title: "The Go-Live Decision", prompt: "Practice: manage the go-live gate under stakeholder pressure" },
    { title: "The Infrastructure Upgrade Project", prompt: "Practice: navigate go-live in a 5-stage project" },
  ],
  // Lesson 10: Waterfall Strengths & Weaknesses
  120010: [
    { title: "Tell Me How You Plan a Project", prompt: "Practice: explain waterfall planning in an interview" },
  ],
  // Lesson 11: When to Use Waterfall
  120011: [
    { title: "Tell Me How You Plan a Project", prompt: "Practice: justify your methodology choice in an interview" },
  ],
  // Lesson 12: Waterfall in the Real World
  120012: [
    { title: "The Infrastructure Upgrade Project", prompt: "Practice: run a real-world waterfall project end-to-end" },
    { title: "Tell Me How You Plan a Project", prompt: "Practice: answer a waterfall interview question" },
  ],

  // ── LEVEL 3 — Agile & Scrum ───────────────────────────────────────────────

  // Lesson 1: What is Agile?
  130001: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: rescue a failing sprint" },
  ],
  // Lesson 2: Agile Values & Principles
  130002: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: apply agile values under pressure" },
  ],
  // Lesson 3: Scrum Framework Overview
  130003: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: manage a sprint that's going off-track" },
    { title: "Write a Sprint Retrospective", prompt: "Practice: write a retrospective for a completed sprint" },
  ],
  // Lesson 4: Roles in Scrum
  130004: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: navigate role conflicts in a Scrum team" },
  ],
  // Lesson 5: Sprint Planning
  130005: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: identify what went wrong in sprint planning" },
    { title: "Write a Sprint Retrospective", prompt: "Practice: reflect on a sprint and plan improvements" },
  ],
  // Lesson 6: Daily Standups & Sprint Reviews
  130006: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: use standups to catch issues early" },
  ],
  // Lesson 7: Retrospectives
  130007: [
    { title: "Write a Sprint Retrospective", prompt: "Practice: write a structured retrospective report" },
  ],
  // Lesson 8: Product Backlog Management
  130008: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: manage backlog issues mid-sprint" },
  ],
  // Lesson 9: Agile Estimation
  130009: [
    { title: "Write a Sprint Retrospective", prompt: "Practice: reflect on estimation accuracy in a retrospective" },
  ],
  // Lesson 10: Scaling Agile
  130010: [
    { title: "Tell Me About a Time You Managed Priorities", prompt: "Practice: demonstrate agile prioritisation in an interview" },
  ],
  // Lesson 11: Agile vs Waterfall
  130011: [
    { title: "Tell Me How You Plan a Project", prompt: "Practice: compare methodologies in an interview answer" },
  ],
  // Lesson 12: Agile in Practice
  130012: [
    { title: "The Sprint That Went Wrong", prompt: "Practice: apply agile in a real-world scenario" },
    { title: "Write a Sprint Retrospective", prompt: "Practice: close a sprint with a professional retrospective" },
  ],

  // ── LEVEL 4 — Stakeholder Management ─────────────────────────────────────

  // Lesson 1: Who Are Stakeholders?
  140001: [
    { title: "Build a Stakeholder Register", prompt: "Practice: identify and map your stakeholders" },
  ],
  // Lesson 2: Stakeholder Analysis
  140002: [
    { title: "Build a Stakeholder Register", prompt: "Practice: complete a full stakeholder register with influence/interest" },
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: identify why a stakeholder disengaged" },
  ],
  // Lesson 3: Communication Planning
  140003: [
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: re-engage a stakeholder who stopped responding" },
  ],
  // Lesson 4: Managing Difficult Stakeholders
  140004: [
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: handle a difficult, disengaged stakeholder" },
    { title: "Tell Me About a Difficult Stakeholder", prompt: "Practice: answer a stakeholder interview question" },
  ],
  // Lesson 5: Stakeholder Engagement Strategies
  140005: [
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: apply engagement strategies in a real scenario" },
  ],
  // Lesson 6: Reporting & Status Updates
  140006: [
    { title: "Build a Stakeholder Register", prompt: "Practice: include reporting cadence in your stakeholder plan" },
  ],
  // Lesson 7: Escalation & Conflict Resolution
  140007: [
    { title: "Tell Me About a Difficult Stakeholder", prompt: "Practice: describe how you handled a conflict in an interview" },
  ],
  // Lesson 8: Influencing Without Authority
  140008: [
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: influence a stakeholder without formal authority" },
    { title: "Tell Me About a Difficult Stakeholder", prompt: "Practice: demonstrate influencing skills in an interview" },
  ],
  // Lesson 9: Stakeholder Mapping Tools
  140009: [
    { title: "Build a Stakeholder Register", prompt: "Practice: apply stakeholder mapping in a real register" },
  ],
  // Lesson 10: Virtual & Remote Stakeholders
  140010: [
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: re-engage a remote stakeholder" },
  ],
  // Lesson 11: Senior Stakeholder Management
  140011: [
    { title: "Tell Me About a Difficult Stakeholder", prompt: "Practice: describe managing a senior stakeholder in an interview" },
  ],
  // Lesson 12: Stakeholder Management in Practice
  140012: [
    { title: "Build a Stakeholder Register", prompt: "Practice: build a complete stakeholder register" },
    { title: "The Stakeholder Who Went Quiet", prompt: "Practice: apply stakeholder management in a live scenario" },
  ],

  // ── LEVEL 5 — Risk & Budget Management ───────────────────────────────────

  // Lesson 1: Introduction to Risk Management
  150001: [
    { title: "The Risk That Nobody Wanted to Raise", prompt: "Practice: surface a risk nobody flagged" },
  ],
  // Lesson 2: Risk Identification Techniques
  150002: [
    { title: "Build a Risk Register", prompt: "Practice: identify and log risks in a real register" },
    { title: "The Risk That Nobody Wanted to Raise", prompt: "Practice: identify a hidden risk before it materialises" },
  ],
  // Lesson 3: Risk Assessment & Prioritisation
  150003: [
    { title: "Build a Risk Register", prompt: "Practice: score and prioritise risks in a full register" },
  ],
  // Lesson 4: Risk Response Strategies
  150004: [
    { title: "The Risk That Nobody Wanted to Raise", prompt: "Practice: choose the right risk response strategy" },
    { title: "Build a Risk Register", prompt: "Practice: add response strategies to your risk register" },
  ],
  // Lesson 5: Risk Monitoring & Reporting
  150005: [
    { title: "The Risk That Nobody Wanted to Raise", prompt: "Practice: monitor and escalate a risk at the right time" },
  ],
  // Lesson 6: Introduction to Budget Management
  150006: [
    { title: "The Budget That Blew Out", prompt: "Practice: manage a budget that's running over" },
  ],
  // Lesson 7: Cost Estimation
  150007: [
    { title: "The Budget That Blew Out", prompt: "Practice: respond to a cost overrun scenario" },
    { title: "Build a Project Budget", prompt: "Practice: estimate costs in a real project budget" },
  ],
  // Lesson 8: Budget Tracking & Forecasting
  150008: [
    { title: "Build a Project Budget", prompt: "Practice: build a full project budget with forecasting" },
    { title: "The Budget That Blew Out", prompt: "Practice: track and recover a budget overrun" },
  ],
  // Lesson 9: Earned Value Management
  150009: [
    { title: "Build a Project Budget", prompt: "Practice: apply EVM concepts in a real budget document" },
  ],
  // Lesson 10: Contingency & Reserves
  150010: [
    { title: "The Budget That Blew Out", prompt: "Practice: use contingency reserves when a budget blows out" },
  ],
  // Lesson 11: Financial Reporting to Stakeholders
  150011: [
    { title: "Tell Me How You Manage Risk", prompt: "Practice: explain risk and budget management in an interview" },
  ],
  // Lesson 12: Risk & Budget in Practice
  150012: [
    { title: "Build a Risk Register", prompt: "Practice: build a complete risk register" },
    { title: "Build a Project Budget", prompt: "Practice: build a complete project budget" },
  ],

  // ── LEVEL 6 — Leadership & Team Management ────────────────────────────────

  // Lesson 1: The PM as Leader
  160001: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: lead a difficult performance conversation" },
  ],
  // Lesson 2: Motivation & Team Dynamics
  160002: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: re-motivate an underperforming team member" },
    { title: "The Conflict in the Team", prompt: "Practice: address a conflict affecting team dynamics" },
  ],
  // Lesson 3: Conflict Resolution
  160003: [
    { title: "The Conflict in the Team", prompt: "Practice: resolve a conflict between two team members" },
    { title: "Tell Me About a Time You Resolved a Conflict", prompt: "Practice: answer a conflict interview question" },
  ],
  // Lesson 4: Giving & Receiving Feedback
  160004: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: give constructive feedback in a real scenario" },
  ],
  // Lesson 5: Delegation & Empowerment
  160005: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: delegate effectively to a struggling team member" },
  ],
  // Lesson 6: Managing Remote Teams
  160006: [
    { title: "The Conflict in the Team", prompt: "Practice: resolve a conflict in a distributed team" },
  ],
  // Lesson 7: Psychological Safety
  160007: [
    { title: "The Conflict in the Team", prompt: "Practice: create psychological safety after a team conflict" },
    { title: "Tell Me About a Time You Resolved a Conflict", prompt: "Practice: describe building psychological safety in an interview" },
  ],
  // Lesson 8: Performance Management
  160008: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: manage a performance issue professionally" },
    { title: "Tell Me About a Time You Resolved a Conflict", prompt: "Practice: answer a performance management interview question" },
  ],
  // Lesson 9: Building High-Performing Teams
  160009: [
    { title: "The Conflict in the Team", prompt: "Practice: rebuild a team after a conflict" },
  ],
  // Lesson 10: Influencing Upward
  160010: [
    { title: "Tell Me About a Time You Resolved a Conflict", prompt: "Practice: demonstrate upward influence in an interview" },
  ],
  // Lesson 11: Leadership Styles
  160011: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: adapt your leadership style to a real situation" },
  ],
  // Lesson 12: Leadership in Practice
  160012: [
    { title: "The Team Member Who Stopped Delivering", prompt: "Practice: apply leadership skills in a real scenario" },
    { title: "The Conflict in the Team", prompt: "Practice: lead through a team conflict end-to-end" },
  ],

  // ── LEVEL 7 — Advanced PM & Certification Prep ───────────────────────────

  // Lesson 1: Advanced PM Concepts
  170001: [
    { title: "The Audit That Found Gaps", prompt: "Practice: respond to a governance audit" },
  ],
  // Lesson 2: Programme & Portfolio Management
  170002: [
    { title: "The Audit That Found Gaps", prompt: "Practice: address governance gaps in a complex programme" },
  ],
  // Lesson 3: Governance & Assurance
  170003: [
    { title: "The Audit That Found Gaps", prompt: "Practice: handle a governance audit finding" },
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: explain governance in a senior interview" },
  ],
  // Lesson 4: Benefits Realisation
  170004: [
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: articulate benefits realisation in an interview" },
  ],
  // Lesson 5: Organisational Change Management
  170005: [
    { title: "The Audit That Found Gaps", prompt: "Practice: navigate change management in a governance context" },
  ],
  // Lesson 6: APM PMQ Exam Preparation
  170006: [
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: answer a senior PM methodology question" },
  ],
  // Lesson 7: PRINCE2 Principles
  170007: [
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: explain PRINCE2 principles in an interview" },
  ],
  // Lesson 8: Agile PM at Scale
  170008: [
    { title: "The Audit That Found Gaps", prompt: "Practice: apply scaled agile governance" },
  ],
  // Lesson 9: Procurement & Contracts
  170009: [
    { title: "The Audit That Found Gaps", prompt: "Practice: handle a procurement audit finding" },
  ],
  // Lesson 10: Sustainability in PM
  170010: [
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: incorporate sustainability into your PM answer" },
  ],
  // Lesson 11: Career Development & CPD
  170011: [
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: articulate your PM career journey in an interview" },
  ],
  // Lesson 12: Final Exam Preparation
  170012: [
    { title: "Tell Me About Your PM Methodology", prompt: "Practice: answer a comprehensive senior PM interview question" },
    { title: "The Audit That Found Gaps", prompt: "Practice: demonstrate advanced PM thinking in a scenario" },
  ],
};
