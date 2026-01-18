import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('Seeding knowledge checks for Levels 4-7...');

const knowledgeChecks = [
  // Level 4: Stakeholder Management
  {
    levelId: 4,
    afterLessonNumber: 6,
    question: 'Which stakeholder management strategy involves keeping stakeholders satisfied with minimal effort because they have high power but low interest?',
    options: JSON.stringify(['Manage Closely', 'Keep Satisfied', 'Keep Informed', 'Monitor']),
    correctAnswerIndex: 1,
    explanation: 'The "Keep Satisfied" strategy is used for stakeholders with high power but low interest. They need to be kept happy to prevent them from becoming obstacles, but they don\'t require constant detailed communication. This is part of the Power/Interest Grid framework.',
  },
  {
    levelId: 4,
    afterLessonNumber: 6,
    question: 'What is the primary purpose of a stakeholder engagement assessment matrix?',
    options: JSON.stringify([
      'To track stakeholder contact information',
      'To compare current and desired engagement levels',
      'To calculate stakeholder influence scores',
      'To schedule stakeholder meetings'
    ]),
    correctAnswerIndex: 1,
    explanation: 'The stakeholder engagement assessment matrix compares where stakeholders are currently (Unaware, Resistant, Neutral, Supportive, Leading) with where you need them to be. This gap analysis helps you plan targeted engagement strategies to move stakeholders to desired engagement levels.',
  },
  {
    levelId: 4,
    afterLessonNumber: 12,
    question: 'When managing a difficult stakeholder who constantly changes requirements, what is the BEST first step?',
    options: JSON.stringify([
      'Escalate to their manager immediately',
      'Implement strict change control process',
      'Understand the root cause of their behavior through active listening',
      'Exclude them from project communications'
    ]),
    correctAnswerIndex: 2,
    explanation: 'Before implementing solutions, understand WHY the stakeholder is behaving this way. They may have legitimate concerns, unclear expectations, or external pressures. Active listening and empathy help you address root causes rather than symptoms. After understanding, you can implement appropriate solutions like change control.',
  },
  {
    levelId: 4,
    afterLessonNumber: 12,
    question: 'Which communication method is MOST appropriate for delivering bad news about a major project delay to executive stakeholders?',
    options: JSON.stringify([
      'Email with detailed explanation',
      'In-person meeting or video call',
      'Project status report',
      'Instant message or Slack'
    ]),
    correctAnswerIndex: 1,
    explanation: 'Bad news, especially major issues like significant delays, should be delivered in person (or via video call if remote) to executive stakeholders. This allows for immediate questions, shows respect, enables you to gauge reactions, and demonstrates accountability. Follow up with written documentation, but initial delivery should be face-to-face.',
  },

  // Level 5: Risk & Budget Management
  {
    levelId: 5,
    afterLessonNumber: 6,
    question: 'What is the Expected Monetary Value (EMV) of a risk with 30% probability of occurring and an impact of £50,000?',
    options: JSON.stringify(['£15,000', '£30,000', '£50,000', '£150,000']),
    correctAnswerIndex: 0,
    explanation: 'EMV = Probability × Impact = 0.30 × £50,000 = £15,000. This calculation helps quantify risk exposure and prioritize risk responses. The EMV represents the average impact if this risk scenario were to play out many times.',
  },
  {
    levelId: 5,
    afterLessonNumber: 6,
    question: 'Which risk response strategy involves shifting the negative impact of a risk to a third party?',
    options: JSON.stringify(['Avoid', 'Mitigate', 'Transfer', 'Accept']),
    correctAnswerIndex: 2,
    explanation: 'Transfer moves the risk to a third party, such as through insurance, warranties, fixed-price contracts, or outsourcing. The risk still exists, but the financial impact is borne by another party. This is different from avoidance (eliminating the risk entirely) or mitigation (reducing probability or impact).',
  },
  {
    levelId: 5,
    afterLessonNumber: 12,
    question: 'A project has a Budget at Completion (BAC) of £200,000 and a Cost Performance Index (CPI) of 0.80. What is the Estimate at Completion (EAC)?',
    options: JSON.stringify(['£160,000', '£200,000', '£250,000', '£280,000']),
    correctAnswerIndex: 2,
    explanation: 'EAC = BAC / CPI = £200,000 / 0.80 = £250,000. A CPI of 0.80 means you\'re getting £0.80 of value for every £1 spent, so the project will cost more than budgeted. This forecast assumes current performance trends continue.',
  },
  {
    levelId: 5,
    afterLessonNumber: 12,
    question: 'What is the purpose of management reserve in a project budget?',
    options: JSON.stringify([
      'To cover known risks that have been identified',
      'To cover unknown risks (unknown unknowns)',
      'To fund scope changes requested by stakeholders',
      'To pay for team bonuses and rewards'
    ]),
    correctAnswerIndex: 1,
    explanation: 'Management reserve covers unknown risks (unknown unknowns) that were not identified during risk planning. This is different from contingency reserve, which covers known risks. Management reserve typically requires senior management approval to access, while contingency reserve is controlled by the project manager.',
  },

  // Level 6: Leadership & Team Management
  {
    levelId: 6,
    afterLessonNumber: 6,
    question: 'According to Tuckman\'s model, in which stage do teams experience conflict as members assert their opinions and compete for position?',
    options: JSON.stringify(['Forming', 'Storming', 'Norming', 'Performing']),
    correctAnswerIndex: 1,
    explanation: 'Storming is the conflict stage where team members challenge each other, compete for influence, and question the leader. This is a natural and necessary stage. The PM\'s role is to facilitate healthy conflict resolution and help the team move to Norming (establishing agreed ways of working) and eventually Performing (high productivity).',
  },
  {
    levelId: 6,
    afterLessonNumber: 6,
    question: 'Which leadership style is MOST effective when team members are highly skilled and motivated but the task is complex and ambiguous?',
    options: JSON.stringify([
      'Directing (high directive, low supportive)',
      'Coaching (high directive, high supportive)',
      'Supporting (low directive, high supportive)',
      'Delegating (low directive, low supportive)'
    ]),
    correctAnswerIndex: 2,
    explanation: 'Supporting style (low directive, high supportive) is best for skilled, motivated team members facing complex tasks. They don\'t need detailed instructions (they have the skills) but benefit from support, encouragement, and collaborative problem-solving given the task complexity. This is from Situational Leadership theory.',
  },
  {
    levelId: 6,
    afterLessonNumber: 12,
    question: 'When delegating a critical task, what is the MOST important element to ensure successful delegation?',
    options: JSON.stringify([
      'Provide detailed step-by-step instructions',
      'Check in every hour to monitor progress',
      'Clearly define desired outcomes and authority level',
      'Assign the task to the most senior team member'
    ]),
    correctAnswerIndex: 2,
    explanation: 'Effective delegation requires clarity on desired outcomes (what success looks like) and authority level (what decisions they can make independently). Micromanaging (hourly check-ins) undermines delegation. Detailed instructions may be appropriate for inexperienced team members but aren\'t always necessary. The right person depends on skills and development needs, not just seniority.',
  },
  {
    levelId: 6,
    afterLessonNumber: 12,
    question: 'A team member consistently delivers high-quality work but has become disengaged and withdrawn. What is the BEST approach?',
    options: JSON.stringify([
      'Ignore it since their work quality is still good',
      'Publicly praise them in team meeting to boost morale',
      'Have a private one-on-one conversation to understand what changed',
      'Assign them more challenging work to re-engage them'
    ]),
    correctAnswerIndex: 2,
    explanation: 'Disengagement is an early warning sign that shouldn\'t be ignored, even if work quality hasn\'t declined yet. A private conversation shows you care, respects their privacy, and helps you understand root causes (personal issues, team dynamics, career concerns, burnout). Only after understanding can you take appropriate action, which might include challenging work, but could also require other support.',
  },

  // Level 7: Advanced PM & Certification Prep
  {
    levelId: 7,
    afterLessonNumber: 6,
    question: 'In Earned Value Management, a project has SPI = 0.85 and CPI = 1.10. What does this indicate?',
    options: JSON.stringify([
      'Project is ahead of schedule and under budget',
      'Project is behind schedule but under budget',
      'Project is ahead of schedule but over budget',
      'Project is behind schedule and over budget'
    ]),
    correctAnswerIndex: 1,
    explanation: 'SPI (Schedule Performance Index) = 0.85 means the project is completing work at 85% of the planned rate (behind schedule). CPI (Cost Performance Index) = 1.10 means the project is getting £1.10 of value for every £1 spent (under budget). This combination is common when teams work carefully to stay under budget but sacrifice speed.',
  },
  {
    levelId: 7,
    afterLessonNumber: 6,
    question: 'Which scaling framework is MOST appropriate for a large enterprise with 100+ teams requiring strong governance and compliance?',
    options: JSON.stringify([
      'LeSS (Large-Scale Scrum)',
      'Spotify Model',
      'SAFe (Scaled Agile Framework)',
      'Scrum of Scrums'
    ]),
    correctAnswerIndex: 2,
    explanation: 'SAFe is designed for large enterprises and includes built-in governance, compliance, and portfolio management structures. LeSS works better for 2-8 teams with a product focus. Spotify Model emphasizes autonomy over governance. Scrum of Scrums is a coordination technique, not a complete scaling framework.',
  },
  {
    levelId: 7,
    afterLessonNumber: 12,
    question: 'According to PMI Code of Ethics, what should you do if a stakeholder offers you a valuable gift in exchange for favorable treatment in vendor selection?',
    options: JSON.stringify([
      'Accept the gift but recuse yourself from vendor selection',
      'Accept the gift and disclose it to your manager',
      'Politely decline the gift and report the incident',
      'Accept the gift only if it is under £100 in value'
    ]),
    correctAnswerIndex: 2,
    explanation: 'Accepting any gift in exchange for favorable treatment is a conflict of interest and potential bribery, regardless of value. You must decline and report the incident to appropriate authorities. This upholds the PMI Code of Ethics values of fairness, honesty, and responsibility.',
  },
  {
    levelId: 7,
    afterLessonNumber: 12,
    question: 'What is the PRIMARY difference between a program and a portfolio?',
    options: JSON.stringify([
      'Programs are larger than portfolios',
      'Programs focus on related projects delivering benefits; portfolios focus on strategic alignment',
      'Programs are temporary; portfolios are permanent',
      'Programs use Agile; portfolios use Waterfall'
    ]),
    correctAnswerIndex: 1,
    explanation: 'Programs are groups of related projects managed together to achieve benefits that wouldn\'t be available if managed separately. Portfolios are collections of programs, projects, and operations aligned with strategic objectives. The key distinction is that programs focus on benefit realization while portfolios focus on strategic alignment and optimization.',
  },
];

// Insert knowledge checks
for (const check of knowledgeChecks) {
  await db.insert(schema.knowledgeChecks).values(check);
  console.log(`✓ Level ${check.levelId}, after Lesson ${check.afterLessonNumber}: ${check.question.substring(0, 60)}...`);
}

console.log(`✅ All knowledge checks seeded! Total: ${knowledgeChecks.length} questions across Levels 4-7`);

await connection.end();
