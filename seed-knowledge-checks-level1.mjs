import { drizzle } from "drizzle-orm/mysql2";
import { knowledgeChecks } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const knowledgeCheckQuestions = [
  // Knowledge Check 1 - After Lesson 6 (Project Lifecycle Phases)
  {
    levelId: 1,
    afterLessonNumber: 6,
    question: "Which phase of the project lifecycle involves creating detailed plans, defining scope, and allocating resources?",
    options: JSON.stringify([
      "Initiation",
      "Planning",
      "Execution",
      "Closing"
    ]),
    correctAnswerIndex: 1,
    explanation: "The Planning phase is where detailed project plans are created, scope is defined, resources are allocated, and the project roadmap is established. This phase transforms the project vision from the Initiation phase into actionable plans."
  },
  {
    levelId: 1,
    afterLessonNumber: 6,
    question: "In the context of the triple constraint, if a stakeholder requests additional features without extending the timeline or budget, what is the MOST likely outcome?",
    options: JSON.stringify([
      "The project will be delivered successfully with all requested features",
      "Quality may be compromised as the team rushes to deliver more scope",
      "The project manager should immediately agree to maintain stakeholder satisfaction",
      "The timeline will automatically extend to accommodate the new features"
    ]),
    correctAnswerIndex: 1,
    explanation: "The triple constraint (scope, time, cost) means these factors are interconnected. Adding scope without adjusting time or cost typically forces the team to cut corners, resulting in compromised quality. A skilled PM would negotiate to adjust either timeline or budget, or reduce scope elsewhere."
  },

  // Knowledge Check 2 - After Lesson 12 (Your PM Toolkit & Next Steps)
  {
    levelId: 1,
    afterLessonNumber: 12,
    question: "A stakeholder with high power but low interest in your project should be managed using which strategy?",
    options: JSON.stringify([
      "Monitor (Minimal Effort)",
      "Keep Informed",
      "Keep Satisfied",
      "Manage Closely"
    ]),
    correctAnswerIndex: 2,
    explanation: "According to the stakeholder power/interest grid, stakeholders with high power but low interest should be 'Kept Satisfied'. They have the authority to impact your project significantly, so you need to ensure they're content without overwhelming them with details they don't care about."
  },
  {
    levelId: 1,
    afterLessonNumber: 12,
    question: "Which communication method is MOST appropriate for documenting a significant scope change that requires stakeholder approval?",
    options: JSON.stringify([
      "A quick verbal conversation in the hallway",
      "A formal written change request with impact analysis",
      "A brief mention in the weekly team standup",
      "An informal email to the project sponsor"
    ]),
    correctAnswerIndex: 1,
    explanation: "Significant scope changes require formal documentation through a written change request that includes impact analysis (cost, timeline, resources, risks). This creates an audit trail, ensures all stakeholders understand the implications, and provides a basis for approval decisions."
  }
];

async function seedKnowledgeChecks() {
  console.log("Seeding Level 1 knowledge check questions...\n");

  for (const question of knowledgeCheckQuestions) {
    await db.insert(knowledgeChecks).values(question);
    console.log(`✓ Inserted KC${question.afterLessonNumber === 6 ? "1" : "2"} Question: ${question.question.substring(0, 60)}...`);
  }

  console.log("\n✅ All Level 1 knowledge checks seeded successfully!");
  console.log("📝 Knowledge Check 1 appears after Lesson 6");
  console.log("📝 Knowledge Check 2 appears after Lesson 12");
  process.exit(0);
}

seedKnowledgeChecks().catch((error) => {
  console.error("Error seeding knowledge checks:", error);
  process.exit(1);
});
