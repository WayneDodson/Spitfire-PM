import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Fix level titles to match the original design
console.log('Fixing level titles...');
const levelUpdates = [
  { id: 1, title: 'Introduction to Project Management', description: 'Start your project management journey by understanding what PMs actually do. Learn the core concepts, methodologies, and skills that form the foundation of successful project management.' },
  { id: 2, title: 'Waterfall Methodology', description: 'Master the traditional Waterfall approach to project management. Learn sequential planning, requirements gathering, Work Breakdown Structures, Gantt charts, and formal documentation.' },
  { id: 3, title: 'Agile & Scrum', description: 'Embrace the Agile mindset and Scrum framework. Learn sprints, user stories, retrospectives, daily standups, and how to deliver value iteratively in fast-changing environments.' },
  { id: 4, title: 'Stakeholder Management', description: 'Master the art of identifying, engaging, and managing stakeholders. Learn communication strategies, expectation management, conflict resolution, and stakeholder mapping techniques.' },
  { id: 5, title: 'Risk & Budget Management', description: 'Develop expertise in identifying and mitigating project risks, planning budgets, controlling costs, and applying earned value management to keep projects on track financially.' },
  { id: 6, title: 'Leadership & Team Management', description: 'Build and lead high-performing project teams. Learn motivation techniques, delegation, performance management, handling difficult conversations, and creating a positive team culture.' },
  { id: 7, title: 'Advanced PM & Certification Prep', description: 'Integrate all project management concepts at an advanced level. Prepare for PMP, PRINCE2, and APM certifications with comprehensive exam-style questions and real-world case studies.' },
];

for (const level of levelUpdates) {
  await connection.query(
    'UPDATE levels SET title = ?, description = ? WHERE id = ?',
    [level.title, level.description, level.id]
  );
  console.log(`Updated Level ${level.id}: ${level.title}`);
}

// Add missing knowledge checks for Level 2 (Waterfall Methodology)
console.log('\nAdding knowledge checks for Level 2...');
const level2KCs = [
  {
    levelId: 2,
    afterLessonNumber: 6,
    question: 'In Waterfall methodology, what is the primary purpose of the Requirements Gathering phase?',
    options: JSON.stringify([
      'To begin writing code as quickly as possible',
      'To document all project requirements before design and development begin',
      'To identify team members and assign roles',
      'To create the project schedule and Gantt chart'
    ]),
    correctAnswerIndex: 1,
    explanation: 'The Requirements Gathering phase in Waterfall is critical because all requirements must be fully documented and agreed upon before any design or development work begins. This sequential approach means changes later are costly, so getting requirements right upfront is essential.',
    points: 10
  },
  {
    levelId: 2,
    afterLessonNumber: 6,
    question: 'What does a Work Breakdown Structure (WBS) primarily help a project manager achieve?',
    options: JSON.stringify([
      'Track daily team attendance and timesheets',
      'Decompose the project scope into manageable, deliverable-oriented components',
      'Communicate project status to senior stakeholders',
      'Calculate the project budget and cost estimates'
    ]),
    correctAnswerIndex: 1,
    explanation: 'A Work Breakdown Structure (WBS) is a hierarchical decomposition of the total scope of work. It breaks the project into smaller, manageable components (work packages), making it easier to assign responsibilities, estimate costs, and track progress. It is a foundational tool in Waterfall project planning.',
    points: 10
  },
  {
    levelId: 2,
    afterLessonNumber: 12,
    question: 'Which of the following best describes a key weakness of the Waterfall methodology?',
    options: JSON.stringify([
      'It produces too much documentation, making it hard to manage',
      'It is difficult to accommodate changes once a phase is complete',
      'It requires too many team meetings and ceremonies',
      'It does not include any testing phase'
    ]),
    correctAnswerIndex: 1,
    explanation: 'Waterfall\'s sequential nature means that once a phase is signed off and the next begins, going back to make changes is expensive and disruptive. This inflexibility is its primary weakness — if requirements change mid-project (as they often do in real life), Waterfall struggles to adapt without significant rework.',
    points: 10
  },
  {
    levelId: 2,
    afterLessonNumber: 12,
    question: 'In a Waterfall project, what is the purpose of a Change Control Board (CCB)?',
    options: JSON.stringify([
      'To approve new team members joining the project',
      'To review, assess, and approve or reject formal change requests to the project scope',
      'To conduct daily standup meetings and track progress',
      'To manage the project budget and approve expenditures'
    ]),
    correctAnswerIndex: 1,
    explanation: 'A Change Control Board (CCB) is a formal group responsible for reviewing and deciding on proposed changes to the project. In Waterfall, where scope is fixed upfront, any change must go through this formal process to assess impact on schedule, budget, and quality before being approved or rejected.',
    points: 10
  }
];

for (const kc of level2KCs) {
  await connection.query(
    'INSERT INTO knowledgeChecks (levelId, afterLessonNumber, question, options, correctAnswerIndex, explanation) VALUES (?, ?, ?, ?, ?, ?)',
    [kc.levelId, kc.afterLessonNumber, kc.question, kc.options, kc.correctAnswerIndex, kc.explanation]
  );
}
console.log('Added 4 knowledge checks for Level 2');

// Add missing knowledge checks for Level 3 (Agile & Scrum)
console.log('\nAdding knowledge checks for Level 3...');
const level3KCs = [
  {
    levelId: 3,
    afterLessonNumber: 6,
    question: 'In Scrum, what is the primary purpose of the Daily Standup (Daily Scrum)?',
    options: JSON.stringify([
      'To give a detailed status report to the Product Owner and stakeholders',
      'To inspect progress toward the Sprint Goal and identify impediments',
      'To plan the tasks for the entire project',
      'To review and accept completed user stories'
    ]),
    correctAnswerIndex: 1,
    explanation: 'The Daily Scrum is a 15-minute time-boxed event for the Development Team. Its purpose is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary. It is NOT a status report to management — it is a planning event for the team to coordinate their work and surface any blockers.',
    points: 10
  },
  {
    levelId: 3,
    afterLessonNumber: 6,
    question: 'What is a "Definition of Done" (DoD) in Agile/Scrum?',
    options: JSON.stringify([
      'A list of tasks assigned to each developer for the sprint',
      'A shared understanding of what it means for a user story or increment to be complete',
      'The final acceptance criteria signed off by the client at project end',
      'A document describing when the project will be finished'
    ]),
    correctAnswerIndex: 1,
    explanation: 'The Definition of Done is a shared, transparent checklist that defines when a piece of work is truly complete — typically including coding, testing, code review, documentation, and deployment criteria. It ensures the entire team has the same understanding of "done" and prevents technical debt from accumulating.',
    points: 10
  },
  {
    levelId: 3,
    afterLessonNumber: 12,
    question: 'Which Agile principle best explains why Agile teams prefer working software over comprehensive documentation?',
    options: JSON.stringify([
      'Documentation is too expensive to produce in modern software projects',
      'Working software provides real value to customers and enables faster feedback loops',
      'Agile teams do not need documentation because they communicate verbally',
      'Comprehensive documentation slows down the development team unnecessarily'
    ]),
    correctAnswerIndex: 1,
    explanation: 'The Agile Manifesto values "working software over comprehensive documentation" because functional software delivers tangible value to customers and enables real feedback. This does not mean documentation is abandoned — rather, the focus is on producing just enough documentation to support the work, while prioritising software that actually works.',
    points: 10
  },
  {
    levelId: 3,
    afterLessonNumber: 12,
    question: 'What is the role of the Product Owner in a Scrum team?',
    options: JSON.stringify([
      'To manage the development team\'s daily tasks and resolve technical issues',
      'To maximise the value of the product by managing and prioritising the Product Backlog',
      'To facilitate all Scrum ceremonies and remove impediments for the team',
      'To represent the development team in stakeholder meetings'
    ]),
    correctAnswerIndex: 1,
    explanation: 'The Product Owner is responsible for maximising the value delivered by the Scrum Team. They do this by managing the Product Backlog — creating, ordering, and communicating backlog items so the Development Team understands what to build and why. The Scrum Master facilitates ceremonies and removes impediments, while the Development Team does the actual work.',
    points: 10
  }
];

for (const kc of level3KCs) {
  await connection.query(
    'INSERT INTO knowledgeChecks (levelId, afterLessonNumber, question, options, correctAnswerIndex, explanation) VALUES (?, ?, ?, ?, ?, ?)',
    [kc.levelId, kc.afterLessonNumber, kc.question, kc.options, kc.correctAnswerIndex, kc.explanation]
  );
}
console.log('Added 4 knowledge checks for Level 3');

// Verify final counts
console.log('\n=== FINAL VERIFICATION ===');
for (let levelId = 1; levelId <= 7; levelId++) {
  const [kcResult] = await connection.query('SELECT COUNT(*) as count FROM knowledgeChecks WHERE levelId = ?', [levelId]);
  const [lvlResult] = await connection.query('SELECT title FROM levels WHERE id = ?', [levelId]);
  console.log(`Level ${levelId}: "${lvlResult[0].title}" | ${kcResult[0].count} knowledge checks`);
}

await connection.end();
console.log('\nAll fixes applied successfully!');
