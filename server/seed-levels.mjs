import { drizzle } from "drizzle-orm/mysql2";
import { levels } from "../drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const levelData = [
  {
    id: 1,
    orderIndex: 1,
    title: "Introduction to Project Management",
    subtitle: "Build Your PM Foundation",
    description:
      "Start your project management journey by understanding what PMs actually do. Learn the core concepts, methodologies, and skills that form the foundation of successful project management. Through three realistic scenarios across healthcare, construction, and technology sectors, you'll make real decisions and see their consequences.",
    estimatedHours: 6,
    accessType: "free",
    requiredScore: 70,
  },
  {
    id: 2,
    orderIndex: 2,
    title: "Mastering Project Planning",
    subtitle: "From Concept to Kickoff",
    description:
      "Learn how to transform project ideas into actionable plans. Master the art of creating realistic timelines, defining scope, identifying risks, and preparing for project kickoff. This level focuses on the critical planning phase that determines project success.",
    estimatedHours: 6,
    accessType: "referral",
    requiredScore: 75,
  },
  {
    id: 3,
    orderIndex: 3,
    title: "Leading High-Performing Teams",
    subtitle: "Build, Motivate, and Guide Your Team",
    description:
      "Great project managers are great leaders. Learn how to build cohesive teams, communicate effectively with stakeholders, resolve conflicts, and motivate team members to deliver their best work. This level transforms you from a planner into a leader.",
    estimatedHours: 6,
    accessType: "paid",
    requiredScore: 75,
  },
  {
    id: 4,
    orderIndex: 4,
    title: "Financial Control & Resource Optimization",
    subtitle: "Deliver Projects On Budget",
    description:
      "Learn to manage project finances like a pro. Master budgeting, cost estimation, resource allocation, and financial reporting. Understand how to optimize resources, control costs, and demonstrate ROI to stakeholders.",
    estimatedHours: 6,
    accessType: "paid",
    requiredScore: 80,
  },
  {
    id: 5,
    orderIndex: 5,
    title: "Ensuring Project Success",
    subtitle: "Manage Risk, Deliver Quality",
    description:
      "Move beyond basic risk awareness to advanced risk management and quality assurance. Learn to anticipate problems, implement quality standards, and ensure project deliverables meet or exceed expectations.",
    estimatedHours: 6,
    accessType: "paid",
    requiredScore: 80,
  },
  {
    id: 6,
    orderIndex: 6,
    title: "Agile Project Management",
    subtitle: "Lead Agile Teams to Success",
    description:
      "Deep dive into Agile methodologies with focus on Scrum framework. Learn to facilitate sprints, manage backlogs, conduct ceremonies, and lead Agile transformations. This level prepares you for Scrum Master and Agile PM roles.",
    estimatedHours: 6,
    accessType: "paid",
    requiredScore: 80,
  },
  {
    id: 7,
    orderIndex: 7,
    title: "Becoming a Professional PM",
    subtitle: "Launch Your PM Career",
    description:
      "The final level prepares you for the PM job market. Learn advanced PM concepts, prepare for certification exams (PMP, CAPM), build your PM portfolio, and master salary negotiation. Complete with a comprehensive final exam and professional certificate.",
    estimatedHours: 6,
    accessType: "paid",
    requiredScore: 85,
  },
];

async function seedLevels() {
  try {
    console.log("🌱 Seeding levels table...");

    // Clear existing levels
    await db.delete(levels);
    console.log("✓ Cleared existing levels");

    // Insert new levels
    for (const level of levelData) {
      await db.insert(levels).values(level);
      console.log(`✓ Inserted Level ${level.orderIndex}: ${level.title}`);
    }

    console.log("\n✅ Successfully seeded 7 levels!");
    console.log("\nLevel Summary:");
    console.log("- Level 1: Free for all users");
    console.log("- Level 2: Requires 1 referral");
    console.log("- Levels 3-7: Require active £20/month subscription");
    console.log("\nTotal course duration: 42 hours (6 weeks at 1 hour/day)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding levels:", error);
    process.exit(1);
  }
}

seedLevels();
