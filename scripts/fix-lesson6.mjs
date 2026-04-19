/**
 * fix-lesson6.mjs
 * Manually splits lesson 6 (Project Lifecycle Phases) into Part A and Part B,
 * then fixes the lessonNumber sequence for Level 1 so it runs 1-24.
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const partAContent = `## Project Lifecycle Phases — Part A: The Foundation

Every project, no matter how big or small, follows a predictable journey. Understanding this journey is one of the most important things you can do as a Project Manager. It's not just theory — it's the map you'll use every single day.

### Why Phases Matter

Think of a project like building a house. You wouldn't start laying bricks before you had a blueprint. You wouldn't hand over the keys before the final inspection. Projects work the same way — each phase has a purpose, and skipping one creates problems downstream.

Phases give you structure. They tell you what to focus on right now, what comes next, and how to know when you're done.

### The Five Phases

The Project Management Institute (PMI) defines five standard phases. You'll encounter these in interviews, on the job, and in every PM framework you study.

**Phase 1: Initiation**

This is where a project is born. The key question here is: *Should we do this?*

During initiation, you're defining the problem, identifying stakeholders, and getting formal approval to proceed. The main output is the **Project Charter** — a document that authorises the project and gives you the authority to use resources.

Key activities include:
- Defining the business case
- Identifying key stakeholders
- Conducting a feasibility assessment
- Getting sign-off from the sponsor

**Phase 2: Planning**

Once the project is approved, you plan how to deliver it. This is the most time-intensive phase — and the one most beginners rush through.

The key question here is: *How are we going to do this?*

You're building the roadmap: scope, schedule, budget, risk register, communication plan, and resource plan. The output is the **Project Management Plan** — your single source of truth for how the project will be delivered.

Key activities include:
- Defining scope and requirements
- Creating a Work Breakdown Structure (WBS)
- Estimating time and cost
- Identifying and planning for risks
- Building the communication plan

**Phase 3: Execution**

This is where the work gets done. The team is delivering the project, and your job as PM shifts from planning to leading, communicating, and removing obstacles.

The key question here is: *Are we delivering what we planned?*

Key activities include:
- Managing the team
- Communicating with stakeholders
- Managing changes and issues
- Ensuring quality standards are met
- Keeping everyone aligned

---

**Key Takeaway:** The first three phases — Initiation, Planning, and Execution — form the backbone of every project, and understanding what each one demands of you is the foundation of confident project management.`;

const partBContent = `## Project Lifecycle Phases — Part B: Monitoring, Closure, and Adapting to Methodologies

You've seen how a project starts and gets delivered. Now let's look at how you keep it on track — and how you close it properly. These are the phases that separate good PMs from great ones.

### Phase 4: Monitoring and Controlling

This phase runs *in parallel* with execution — it doesn't wait for execution to finish. While your team is delivering, you're constantly checking: are we on time, on budget, and on scope?

The key question here is: *Are we still on track?*

**Key metrics to monitor:**

| Metric | What It Measures |
|--------|-----------------|
| Schedule Variance | Ahead or behind schedule |
| Cost Variance | Under or over budget |
| Scope Creep | Uncontrolled changes |
| Defect Rate | Quality issues |

A powerful technique called **Earned Value Management (EVM)** combines scope, schedule, and cost into a single picture. You'll be asked about this in interviews.

- **Planned Value (PV):** What you planned to accomplish by now
- **Earned Value (EV):** What you've actually accomplished
- **Actual Cost (AC):** What you've actually spent

If EV is lower than PV, you're behind schedule. If AC is higher than EV, you're over budget. Simple, but powerful.

### Phase 5: Closure

Closure is the most skipped phase — and the most valuable one to get right.

The key question here is: *Did we deliver what we promised, and what did we learn?*

Key activities include:
- Obtaining final stakeholder acceptance
- Handing over deliverables
- Closing contracts
- Archiving documentation
- Running a **lessons learned** session

The lessons learned session is gold. It captures what went well, what didn't, and what to do differently next time. PMs who skip this repeat the same mistakes on every project.

### Adapting Phases to Your Methodology

Different methodologies use these phases differently:

**Waterfall:** Phases are sequential. You complete one before starting the next.

**Agile:** Phases are compressed into each sprint. Planning, execution, monitoring, and a mini-closure happen every two weeks.

**Hybrid:** Waterfall for initiation and planning, Agile for execution, Waterfall for closure.

Knowing this matters in interviews. When a hiring manager asks "how do you manage a project?", your answer should reference phases *and* show you can adapt them.

---

**Key Takeaway:** Monitoring keeps your project honest, and closure keeps your organisation learning — together, they're what turn a delivered project into a professional achievement you can talk about with confidence.`;

// Update lesson 6 to Part A (lessonNumber will be fixed by the renumber step)
await conn.execute(
  `UPDATE lessons SET
    title = ?,
    content = ?,
    estimatedMinutes = 10,
    parentLessonId = 6,
    partNumber = 1,
    updatedAt = NOW()
   WHERE id = 6`,
  ['Project Lifecycle Phases — Part A: The Foundation', partAContent]
);
console.log('✓ Updated lesson 6 to Part A');

// Insert Part B
await conn.execute(
  `INSERT INTO lessons (levelId, lessonNumber, title, content, estimatedMinutes, parentLessonId, partNumber, createdAt, updatedAt)
   VALUES (1, 0, ?, ?, 10, 6, 2, NOW(), NOW())`,
  ['Project Lifecycle Phases — Part B: Monitoring, Closure, and Adapting to Methodologies', partBContent]
);
console.log('✓ Inserted lesson 6 Part B');

// Now fix lessonNumber sequence for Level 1 (should be 1-24)
const [level1Lessons] = await conn.execute(
  'SELECT id, partNumber, parentLessonId FROM lessons WHERE levelId = 1 ORDER BY parentLessonId, partNumber'
);

console.log(`Level 1 has ${level1Lessons.length} lessons`);

// Re-number: group by parentLessonId, sort by original lesson order
// First get the original lesson order (Part A rows have parentLessonId = their own id)
const partAs = level1Lessons.filter(l => l.partNumber === 1).sort((a, b) => a.parentLessonId - b.parentLessonId);

// But we need to sort by the ORIGINAL lesson number, not the parentLessonId value
// Get original lesson numbers from DB
const [origOrder] = await conn.execute(
  'SELECT id FROM lessons WHERE levelId = 1 AND partNumber = 1 ORDER BY id'
);

let num = 1;
for (const orig of origOrder) {
  // Update Part A
  await conn.execute('UPDATE lessons SET lessonNumber = ? WHERE id = ?', [num, orig.id]);
  // Update Part B (parentLessonId = orig.id, partNumber = 2)
  await conn.execute('UPDATE lessons SET lessonNumber = ? WHERE levelId = 1 AND parentLessonId = ? AND partNumber = 2', [num + 1, orig.id]);
  num += 2;
}

console.log(`✓ Renumbered Level 1 lessons 1-${num - 1}`);

// Verify
const [verify] = await conn.execute(
  'SELECT id, lessonNumber, title FROM lessons WHERE levelId = 1 ORDER BY lessonNumber'
);
console.log('\nLevel 1 final order:');
for (const l of verify) {
  console.log(`  ${l.lessonNumber}. [${l.id}] ${l.title}`);
}

await conn.end();
