/**
 * Seed coaching services into the database.
 * Run once: node scripts/seed-coaching-services.mjs
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const services = [
  {
    slug: "free_assessment",
    name: "Free PM Career Assessment",
    type: "free",
    pricePence: 0,
    durationMinutes: 20,
    shortDescription:
      "A free 20-minute introductory call to discuss your PM career goals and whether coaching is right for you.",
    features: JSON.stringify([
      "20-minute 1-to-1 video call with Wayne",
      "Honest assessment of your current position",
      "Clarity on the right next steps for your career",
      "No sales pressure — genuine guidance only",
    ]),
    stripePriceId: null,
    isActive: 1,
    orderIndex: 0,
  },
  {
    slug: "focused_session",
    name: "Focused Coaching Session",
    type: "paid",
    pricePence: 9900, // £99
    durationMinutes: 60,
    shortDescription:
      "A 60-minute deep-dive session targeting a specific challenge — CV review, interview prep, or methodology coaching.",
    features: JSON.stringify([
      "60-minute 1-to-1 video session",
      "CV and LinkedIn profile review",
      "Mock PM interview with expert feedback",
      "Tailored action plan sent after the session",
      "30-day email follow-up support",
    ]),
    stripePriceId: null,
    isActive: 1,
    orderIndex: 1,
  },
  {
    slug: "career_accelerator",
    name: "Career Accelerator Programme",
    type: "paid",
    pricePence: 29900, // £299
    durationMinutes: 240,
    shortDescription:
      "Four 60-minute sessions over 4 weeks to accelerate your transition into a PM role with a structured plan.",
    features: JSON.stringify([
      "4 × 60-minute 1-to-1 video sessions",
      "Full CV and LinkedIn overhaul",
      "Interview preparation and mock sessions",
      "Methodology deep-dives (Agile, PRINCE2, Waterfall)",
      "Personalised 90-day career roadmap",
      "Ongoing email support throughout the programme",
    ]),
    stripePriceId: null,
    isActive: 1,
    orderIndex: 2,
  },
  {
    slug: "transition_programme",
    name: "Full Transition Programme",
    type: "application",
    pricePence: 79900, // £799
    durationMinutes: 600,
    shortDescription:
      "A comprehensive 3-month programme for professionals making a full career transition into project management.",
    features: JSON.stringify([
      "10 × 60-minute 1-to-1 video sessions",
      "Complete CV, LinkedIn and portfolio build",
      "End-to-end interview coaching",
      "Certification guidance (PRINCE2, APM, Agile)",
      "Real-world scenario training and case studies",
      "Job application strategy and recruiter outreach",
      "3-month ongoing support and accountability",
      "Priority email response within 24 hours",
    ]),
    stripePriceId: null,
    isActive: 1,
    orderIndex: 3,
  },
];

// Check if already seeded
const [existing] = await conn.execute("SELECT COUNT(*) as cnt FROM coachingServices");
if (existing[0].cnt > 0) {
  console.log(`Already seeded (${existing[0].cnt} services found). Skipping.`);
  await conn.end();
  process.exit(0);
}

for (const svc of services) {
  await conn.execute(
    `INSERT INTO coachingServices (slug, name, type, pricePence, durationMinutes, shortDescription, features, stripePriceId, isActive, orderIndex)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      svc.slug, svc.name, svc.type, svc.pricePence, svc.durationMinutes,
      svc.shortDescription, svc.features, svc.stripePriceId, svc.isActive, svc.orderIndex,
    ]
  );
  console.log(`✓ Seeded: ${svc.name}`);
}

await conn.end();
console.log("\nDone! Coaching services seeded successfully.");
