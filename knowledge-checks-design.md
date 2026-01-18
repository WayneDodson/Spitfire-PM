# Knowledge Checks System Design

## Purpose

Mid-content knowledge checks serve multiple educational purposes:
1. **Active Learning**: Forces learners to engage with content rather than passively consume
2. **Attention Verification**: Ensures users are paying attention (like Coursera)
3. **Retention Improvement**: Testing improves long-term memory retention by 50%+
4. **Immediate Feedback**: Corrects misconceptions before they become ingrained
5. **Progress Pacing**: Natural break points prevent cognitive overload

## Implementation Strategy

### Timing & Frequency

**Per Level Structure:**
- **Introduction** (5-10 minutes of content)
- **Knowledge Check #1** (2 questions) ← First interruption
- **Main Content** (20-30 minutes)
- **Knowledge Check #2** (2 questions) ← Second interruption  
- **Advanced Content** (10-15 minutes)
- **Scenario Practice** (Interactive simulation)
- **Level Assessment** (5-7 questions) ← Final quiz

**Total per level**: 2 mid-content checks + 1 final assessment

### Question Format

**Mid-Content Checks (2 questions each):**
- Multiple choice (4 options)
- Directly related to content just covered
- Can't proceed until answered (but can retry immediately)
- No score impact - purely for learning
- Instant feedback with explanation

**Example from Level 1:**

*After covering "What is Project Management" section:*

**Question 1:**
"You just learned about the triple constraint in project management. Which three factors must be balanced?"

A) Time, Cost, Quality ✓ (Correct)
B) Time, Resources, Stakeholders
C) Budget, Schedule, Team
D) Scope, Risk, Communication

*Feedback if correct:* "Excellent! The triple constraint (time, cost, quality) is fundamental to PM. You'll use this concept throughout your career."

*Feedback if incorrect:* "Not quite. The triple constraint refers to Time, Cost, and Quality (sometimes called Scope). These three factors are interconnected - changing one affects the others. Let's review this concept."

**Question 2:**
"Based on the healthcare scenario you just completed, what was the main reason the project faced delays?"

A) Lack of budget
B) Equipment delivery delays ✓ (Correct)
C) Staff shortages
D) Regulatory issues

*Feedback if correct:* "Correct! Supply chain management is a critical PM skill. You identified the bottleneck perfectly."

*Feedback if incorrect:* "Review the scenario feedback. The equipment delays created a cascade effect on the timeline. This teaches us to identify critical path dependencies early."

### Database Schema

```typescript
export const knowledgeChecks = mysqlTable("knowledge_checks", {
  id: int("id").autoincrement().primaryKey(),
  levelId: int("levelId").notNull(), // 1-7
  checkpointNumber: int("checkpointNumber").notNull(), // 1 or 2
  position: varchar("position", { length: 50 }).notNull(), // "after_intro", "mid_content"
  question: text("question").notNull(),
  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),
  correctAnswer: mysqlEnum("correctAnswer", ["A", "B", "C", "D"]).notNull(),
  explanation: text("explanation").notNull(),
  feedbackCorrect: text("feedbackCorrect"),
  feedbackIncorrect: text("feedbackIncorrect"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userKnowledgeCheckAttempts = mysqlTable("user_knowledge_check_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  knowledgeCheckId: int("knowledgeCheckId").notNull(),
  selectedAnswer: mysqlEnum("selectedAnswer", ["A", "B", "C", "D"]).notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});
```

### UI/UX Flow

**1. Content Consumption**
User is reading/watching content → Progress bar shows position

**2. Knowledge Check Trigger**
- Content pauses/blocks
- Modal or full-screen overlay appears
- "Quick Knowledge Check" header
- "Let's make sure you've got this! Answer these 2 questions to continue."

**3. Question Display**
- Question text (clear, specific)
- 4 radio button options
- "Submit Answer" button (disabled until selection)
- Progress indicator: "Question 1 of 2"

**4. Immediate Feedback**
- ✓ or ✗ icon
- Explanation text
- "Next Question" button (or "Continue Learning" if last question)

**5. Completion**
- "Great job! You're ready to continue." (if both correct)
- "Keep going - you're making progress!" (if one wrong)
- Content automatically resumes

### Behavioral Rules

**Must Answer to Proceed:**
- Can't skip knowledge checks
- Can't proceed to next content without answering
- No time limit (learning, not testing)

**Retry Logic:**
- Wrong answers can be retried immediately
- No penalty for wrong answers
- Explanation shown regardless of correctness

**No Score Impact:**
- Knowledge checks don't affect level completion score
- Purely formative assessment (learning tool)
- Only final level assessment counts for certification

**Progress Tracking:**
- Track attempts for analytics
- Show user their improvement over time
- Use data to identify difficult concepts

### Sample Knowledge Checks for Each Level

#### Level 1: Introduction to Project Management

**Checkpoint 1 (After "PM Fundamentals" section)**

Q1: "What is the primary role of a project manager?"
- A) Write all the code/do all the work
- B) Coordinate resources and ensure project success ✓
- C) Make all technical decisions
- D) Handle only the budget

Q2: "Which methodology follows a sequential, phase-by-phase approach?"
- A) Agile
- B) Scrum
- C) Waterfall ✓
- D) Kanban

**Checkpoint 2 (After "Methodologies Overview" section)**

Q1: "In the construction scenario, what was the key benefit of identifying the historical feature early?"
- A) Saved money
- B) Prevented project delays and scope changes ✓
- C) Impressed the client
- D) Reduced team size

Q2: "Agile methodology is best suited for projects that:"
- A) Have fixed, unchanging requirements
- B) Require extensive documentation
- C) Need flexibility and iterative development ✓
- D) Must follow strict regulatory processes

#### Level 2: Mastering Project Planning

**Checkpoint 1**

Q1: "What is a Work Breakdown Structure (WBS)?"
- A) A list of team members
- B) A hierarchical decomposition of project deliverables ✓
- C) A budget spreadsheet
- D) A risk register

Q2: "Why is identifying the critical path important?"
- A) It shows the most expensive tasks
- B) It determines the minimum project duration ✓
- C) It lists all project risks
- D) It identifies stakeholders

**Checkpoint 2**

Q1: "In risk management, what does 'mitigation' mean?"
- A) Ignoring the risk
- B) Taking action to reduce risk likelihood or impact ✓
- C) Accepting the risk
- D) Transferring risk to insurance

Q2: "A project baseline includes:"
- A) Only the budget
- B) Scope, schedule, and cost ✓
- C) Team member names
- D) Stakeholder contact information

#### Level 3: Leading High-Performing Teams

**Checkpoint 1**

Q1: "What is the most effective way to resolve team conflict?"
- A) Ignore it and hope it goes away
- B) Address it directly with open communication ✓
- C) Remove team members
- D) Escalate to senior management immediately

Q2: "Stakeholder engagement is important because:"
- A) They sign timesheets
- B) They can influence project success or failure ✓
- C) It's required by law
- D) It looks good on reports

**Checkpoint 2**

Q1: "What is 'emotional intelligence' in leadership?"
- A) Being the smartest person
- B) Understanding and managing emotions (yours and others') ✓
- C) Never showing emotion
- D) Making all decisions alone

Q2: "Effective delegation means:"
- A) Doing everything yourself
- B) Assigning tasks with authority and support ✓
- C) Blaming others for failures
- D) Micromanaging every detail

#### Level 4: Financial Control & Resource Optimization

**Checkpoint 1**

Q1: "What is Earned Value Management (EVM)?"
- A) A method to calculate team bonuses
- B) A technique to measure project performance against baseline ✓
- C) A way to track expenses
- D) A stakeholder satisfaction metric

Q2: "If your project's Cost Performance Index (CPI) is 0.8, what does this mean?"
- A) Project is under budget
- B) Project is over budget ✓
- C) Project is on schedule
- D) Project has high quality

**Checkpoint 2**

Q1: "Resource leveling is used to:"
- A) Fire underperforming team members
- B) Balance resource allocation and avoid overallocation ✓
- C) Increase project budget
- D) Extend project timeline

Q2: "What is the purpose of a contingency reserve?"
- A) Extra money for team parties
- B) Buffer for identified risks ✓
- C) Profit margin
- D) Management bonus fund

#### Level 5: Ensuring Project Success

**Checkpoint 1**

Q1: "What is the difference between a risk and an issue?"
- A) There is no difference
- B) A risk is potential; an issue has already occurred ✓
- C) Risks are more serious than issues
- D) Issues can be ignored

Q2: "Quality assurance focuses on:"
- A) Finding defects after completion
- B) Preventing defects through process improvement ✓
- C) Blaming team members for mistakes
- D) Reducing project costs

**Checkpoint 2**

Q1: "A risk register should include:"
- A) Only high-priority risks
- B) All identified risks with probability, impact, and mitigation plans ✓
- C) Team member performance reviews
- D) Budget details

Q2: "What is 'scope creep'?"
- A) A team member who works slowly
- B) Uncontrolled expansion of project scope ✓
- C) A project management tool
- D) A type of risk

#### Level 6: Agile Project Management

**Checkpoint 1**

Q1: "What is a sprint in Scrum?"
- A) A fast runner on the team
- B) A time-boxed iteration (usually 1-4 weeks) ✓
- C) The final project phase
- D) A type of meeting

Q2: "Who is responsible for prioritizing the product backlog?"
- A) The development team
- B) The Scrum Master
- C) The Product Owner ✓
- D) The stakeholders

**Checkpoint 2**

Q1: "What is the purpose of a daily standup?"
- A) Exercise for the team
- B) Quick sync on progress, plans, and blockers ✓
- C) Detailed status reporting
- D) Performance reviews

Q2: "In Agile, 'velocity' refers to:"
- A) How fast team members work
- B) The amount of work completed in a sprint ✓
- C) Project deadline
- D) Budget burn rate

#### Level 7: Becoming a Professional PM

**Checkpoint 1**

Q1: "What is the PMP certification?"
- A) A university degree
- B) A globally recognized PM credential from PMI ✓
- C) A software tool
- D) A project management methodology

Q2: "When negotiating salary, you should:"
- A) Accept the first offer immediately
- B) Research market rates and know your value ✓
- C) Demand the highest possible salary
- D) Never discuss compensation

**Checkpoint 2**

Q1: "A strong PM portfolio should include:"
- A) Only successful projects
- B) Real examples with metrics and outcomes ✓
- C) Theoretical knowledge only
- D) Certifications only

Q2: "Continuous learning in PM is important because:"
- A) It's required by law
- B) Methodologies, tools, and best practices evolve ✓
- C) It looks good on LinkedIn
- D) Employers force you to

### Analytics & Insights

**Track for Each User:**
- Knowledge check completion rate
- Average attempts per question
- Most commonly missed questions
- Time spent on each check

**Use Data To:**
- Identify difficult concepts that need better explanation
- Improve question quality
- Personalize learning paths
- Predict level completion success

### Best Practices

**Question Design:**
- Clear, unambiguous wording
- Plausible distractors (wrong answers that seem reasonable)
- Directly tied to recently covered content
- Avoid trick questions
- One clearly correct answer

**Feedback Design:**
- Positive tone (even for wrong answers)
- Explain why the answer is correct/incorrect
- Reference specific content section
- Encourage continued learning

**Timing:**
- Not too early (let users absorb content first)
- Not too late (check understanding while fresh)
- Natural break points in content flow

### Implementation Priority

**Phase 1 (MVP):**
- Database schema
- 2 knowledge checks per level (14 questions total)
- Basic UI with modal overlay
- Immediate feedback

**Phase 2 (Enhanced):**
- Analytics dashboard
- Adaptive difficulty (harder questions for experienced users)
- Spaced repetition (re-test on weak areas)

**Phase 3 (Advanced):**
- AI-generated questions based on user performance
- Peer comparison ("85% of users got this right")
- Gamification (points for correct answers)

## Summary

Knowledge checks transform passive learning into active engagement. By interrupting content with relevant, low-stakes questions, we ensure users are paying attention, improve retention, and provide immediate feedback. This Coursera-style approach is proven to increase course completion rates by 30%+ and knowledge retention by 50%+.
