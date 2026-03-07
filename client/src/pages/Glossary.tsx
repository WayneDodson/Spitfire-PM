import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, BookOpen } from "lucide-react";

const glossaryTerms = [
  // A
  { term: "Acceptance Criteria", definition: "The conditions that a deliverable must satisfy to be accepted by the client or stakeholder. Defined upfront and used to verify completion.", category: "Planning", level: 1 },
  { term: "Agile", definition: "An iterative approach to project management and software development that helps teams deliver value to their customers faster. Work is completed in short cycles called sprints or iterations.", category: "Methodology", level: 3 },
  { term: "Assumption", definition: "A factor considered to be true, real, or certain without proof or demonstration. Assumptions carry risk — if an assumption proves false, it may affect the project.", category: "Risk", level: 1 },
  { term: "Audit", definition: "A structured review of a project's processes, documentation, or deliverables to assess compliance with standards and identify areas for improvement.", category: "Quality", level: 5 },
  // B
  { term: "Backlog", definition: "In Agile, a prioritised list of features, requirements, and tasks to be completed. The Product Backlog contains all work; the Sprint Backlog contains work for the current sprint.", category: "Agile", level: 3 },
  { term: "Baseline", definition: "The approved version of a project plan (scope, schedule, cost) against which actual performance is measured. Changes to a baseline require formal change control.", category: "Planning", level: 2 },
  { term: "Budget at Completion (BAC)", definition: "The total planned budget for the project. Used in Earned Value Management calculations.", category: "Finance", level: 5 },
  { term: "Business Case", definition: "A document that justifies the investment in a project by outlining the benefits, costs, risks, and strategic alignment. Used to gain approval and funding.", category: "Initiation", level: 1 },
  // C
  { term: "Change Control", definition: "A formal process for managing changes to the project scope, schedule, or budget. Ensures all changes are reviewed, approved, and documented before implementation.", category: "Governance", level: 2 },
  { term: "Change Request", definition: "A formal proposal to modify any aspect of the project — scope, schedule, cost, quality, or processes. Must go through the change control process.", category: "Governance", level: 2 },
  { term: "Constraints", definition: "Limitations or restrictions that affect the project, such as fixed deadlines, limited budget, or specific technology requirements. The triple constraint refers to scope, time, and cost.", category: "Planning", level: 1 },
  { term: "Contingency Reserve", definition: "Budget or time set aside to address identified risks that may occur. Managed by the project manager and used when known risks materialise.", category: "Risk", level: 5 },
  { term: "Critical Path", definition: "The longest sequence of dependent tasks in a project that determines the minimum project duration. Any delay on the critical path delays the entire project.", category: "Scheduling", level: 2 },
  { term: "Critical Path Method (CPM)", definition: "A scheduling technique that identifies the critical path and calculates the earliest and latest start/finish times for each task, revealing schedule flexibility (float).", category: "Scheduling", level: 2 },
  // D
  { term: "Deliverable", definition: "A tangible or intangible output, result, or capability that must be produced to complete a project or phase. Can be internal (for the team) or external (for the client).", category: "Planning", level: 1 },
  { term: "Definition of Done (DoD)", definition: "In Agile/Scrum, a shared understanding of what it means for a user story or increment to be complete. Typically includes coding, testing, review, and documentation criteria.", category: "Agile", level: 3 },
  { term: "Dependency", definition: "A relationship between tasks where one task cannot start or finish until another task starts or finishes. Types include Finish-to-Start, Start-to-Start, Finish-to-Finish, and Start-to-Finish.", category: "Scheduling", level: 2 },
  // E
  { term: "Earned Value (EV)", definition: "The value of work actually completed, expressed in terms of the approved budget. EV = % Complete × Budget at Completion (BAC).", category: "Finance", level: 5 },
  { term: "Earned Value Management (EVM)", definition: "A project performance measurement technique that integrates scope, schedule, and cost to assess project health and forecast future performance.", category: "Finance", level: 5 },
  { term: "Epic", definition: "In Agile, a large body of work that can be broken down into smaller user stories. Epics represent significant features or capabilities.", category: "Agile", level: 3 },
  { term: "Escalation", definition: "The process of raising an issue, risk, or decision to a higher level of authority when it cannot be resolved at the current level.", category: "Governance", level: 4 },
  // F
  { term: "Float (Slack)", definition: "The amount of time a task can be delayed without delaying the project end date (total float) or the next task (free float). Tasks on the critical path have zero float.", category: "Scheduling", level: 2 },
  { term: "Functional Requirements", definition: "Specifications describing what a system or product must do — its features, functions, and behaviours. Distinct from non-functional requirements (performance, security, etc.).", category: "Planning", level: 2 },
  // G
  { term: "Gantt Chart", definition: "A horizontal bar chart that visualises a project schedule, showing tasks, their durations, start/end dates, and dependencies. Named after Henry Gantt.", category: "Scheduling", level: 2 },
  { term: "Gate Review", definition: "A checkpoint at the end of a project phase where the project is evaluated before proceeding to the next phase. Also called a phase gate or stage gate.", category: "Governance", level: 2 },
  { term: "Gold Plating", definition: "Adding features or enhancements beyond the agreed scope without client approval. Considered poor practice as it consumes resources and may not deliver value.", category: "Scope", level: 2 },
  // I
  { term: "Issue", definition: "A current problem or concern that is already affecting the project and requires immediate attention or resolution. Distinct from a risk (which is a potential future event).", category: "Risk", level: 1 },
  { term: "Issue Log", definition: "A document used to track and manage issues throughout the project lifecycle, recording the issue, owner, priority, and resolution status.", category: "Risk", level: 1 },
  // K
  { term: "Kanban", definition: "An Agile framework that visualises work on a board (To Do, In Progress, Done) and limits work in progress (WIP) to improve flow and reduce bottlenecks.", category: "Agile", level: 3 },
  { term: "KPI (Key Performance Indicator)", definition: "A measurable value that demonstrates how effectively a project or organisation is achieving key objectives. Examples include on-time delivery rate, budget variance, and customer satisfaction.", category: "Monitoring", level: 1 },
  // L
  { term: "Lessons Learned", definition: "Knowledge gained from the experience of completing a project, including what went well and what could be improved. Captured at project close and used to improve future projects.", category: "Closure", level: 1 },
  { term: "Lifecycle", definition: "The phases a project passes through from initiation to closure. Common phases include Initiation, Planning, Execution, Monitoring & Controlling, and Closure.", category: "Planning", level: 1 },
  // M
  { term: "Milestone", definition: "A significant point or event in the project schedule, typically marking the completion of a major deliverable or phase. Milestones have zero duration.", category: "Scheduling", level: 1 },
  { term: "MoSCoW Prioritisation", definition: "A prioritisation technique categorising requirements as Must Have, Should Have, Could Have, and Won't Have. Helps teams focus on what is truly essential.", category: "Planning", level: 3 },
  { term: "MVP (Minimum Viable Product)", definition: "In Agile, the simplest version of a product that delivers value to users and enables learning. Used to test assumptions before investing in full development.", category: "Agile", level: 3 },
  // P
  { term: "PERT (Programme Evaluation and Review Technique)", definition: "A scheduling technique that uses three time estimates (optimistic, most likely, pessimistic) to calculate expected task durations and account for uncertainty.", category: "Scheduling", level: 2 },
  { term: "PMO (Project Management Office)", definition: "A department or group that defines and maintains project management standards, provides governance, and supports project managers across an organisation.", category: "Governance", level: 4 },
  { term: "Product Backlog", definition: "In Scrum, a prioritised list of everything that might be needed in the product. Owned and managed by the Product Owner.", category: "Agile", level: 3 },
  { term: "Product Owner", definition: "In Scrum, the person responsible for maximising the value of the product by managing and prioritising the Product Backlog. Represents the voice of the customer.", category: "Agile", level: 3 },
  { term: "Programme", definition: "A group of related projects managed in a coordinated way to obtain benefits not available from managing them individually.", category: "Governance", level: 7 },
  { term: "Project Charter", definition: "A document that formally authorises a project, defines its objectives, scope, stakeholders, and gives the project manager authority to apply resources.", category: "Initiation", level: 1 },
  { term: "Project Sponsor", definition: "The senior executive who champions the project, provides funding, and has ultimate accountability for its success. The project manager's primary escalation point.", category: "Governance", level: 4 },
  // R
  { term: "RACI Matrix", definition: "A responsibility assignment matrix showing who is Responsible, Accountable, Consulted, and Informed for each task or deliverable. Clarifies roles and prevents confusion.", category: "Planning", level: 4 },
  { term: "Requirements Traceability Matrix (RTM)", definition: "A document that maps requirements to their source and tracks them through design, development, and testing to ensure all requirements are met.", category: "Planning", level: 2 },
  { term: "Risk", definition: "An uncertain event or condition that, if it occurs, has a positive or negative effect on project objectives. Risks are potential future events — unlike issues, which are current problems.", category: "Risk", level: 5 },
  { term: "Risk Appetite", definition: "The degree of uncertainty an organisation or stakeholder is willing to accept in pursuit of its objectives. Influences how aggressively risks are managed.", category: "Risk", level: 5 },
  { term: "Risk Register", definition: "A document used to identify, assess, and track risks throughout the project. Includes risk description, probability, impact, owner, and mitigation strategy.", category: "Risk", level: 5 },
  // S
  { term: "Schedule Variance (SV)", definition: "In EVM, the difference between Earned Value and Planned Value. SV = EV - PV. A negative SV means the project is behind schedule.", category: "Finance", level: 5 },
  { term: "Scope Creep", definition: "The uncontrolled expansion of project scope without corresponding adjustments to time, cost, or resources. One of the most common causes of project failure.", category: "Scope", level: 1 },
  { term: "Scrum", definition: "An Agile framework for developing and delivering complex products. Uses fixed-length sprints, defined roles (Product Owner, Scrum Master, Development Team), and regular ceremonies.", category: "Agile", level: 3 },
  { term: "Scrum Master", definition: "In Scrum, the servant-leader responsible for ensuring the Scrum framework is understood and enacted. Removes impediments and facilitates Scrum ceremonies.", category: "Agile", level: 3 },
  { term: "Sprint", definition: "In Scrum, a time-boxed iteration (typically 1-4 weeks) during which a potentially shippable product increment is created.", category: "Agile", level: 3 },
  { term: "Sprint Retrospective", definition: "A Scrum ceremony at the end of each sprint where the team reflects on their process and identifies improvements for the next sprint.", category: "Agile", level: 3 },
  { term: "Sprint Review", definition: "A Scrum ceremony at the end of each sprint where the team demonstrates completed work to stakeholders and gathers feedback.", category: "Agile", level: 3 },
  { term: "Stakeholder", definition: "Any individual, group, or organisation that may affect, be affected by, or perceive itself to be affected by a project decision, activity, or outcome.", category: "Stakeholders", level: 4 },
  { term: "Stakeholder Register", definition: "A document identifying all project stakeholders, their interests, influence, impact, and engagement strategy.", category: "Stakeholders", level: 4 },
  // T
  { term: "Triple Constraint", definition: "The three primary constraints of any project: Scope, Time, and Cost (also called the Iron Triangle). Changing one constraint typically affects the others.", category: "Planning", level: 1 },
  // U
  { term: "User Story", definition: "In Agile, a short, simple description of a feature from the perspective of the end user. Format: 'As a [user], I want [goal] so that [benefit].'", category: "Agile", level: 3 },
  // V
  { term: "Velocity", definition: "In Scrum, the amount of work a team completes in a sprint, measured in story points. Used to forecast future sprint capacity.", category: "Agile", level: 3 },
  // W
  { term: "Waterfall", definition: "A sequential project management methodology where each phase must be completed before the next begins. Phases typically include Requirements, Design, Development, Testing, and Deployment.", category: "Methodology", level: 2 },
  { term: "WBS (Work Breakdown Structure)", definition: "A hierarchical decomposition of the total scope of work into smaller, manageable components called work packages. The foundation of project planning.", category: "Planning", level: 2 },
  { term: "Work Package", definition: "The lowest level of the Work Breakdown Structure. A work package can be scheduled, cost-estimated, monitored, and controlled.", category: "Planning", level: 2 },
];

const categories = ["All", ...Array.from(new Set(glossaryTerms.map(t => t.category))).sort()];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Glossary() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLetter, setSelectedLetter] = useState("");

  const filtered = glossaryTerms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchesLetter = !selectedLetter || t.term.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesCategory && matchesLetter;
  });

  const groupedByLetter = filtered.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, typeof glossaryTerms>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">PM Glossary</h1>
          </div>
          <p className="text-muted-foreground">
            {glossaryTerms.length} essential project management terms — your quick reference guide throughout your learning journey.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search and filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search terms or definitions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Alphabet filter */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedLetter === "" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedLetter("")}
              className="text-xs w-8 h-8 p-0"
            >
              All
            </Button>
            {alphabet.map(letter => {
              const hasTerms = glossaryTerms.some(t => t.term.toUpperCase().startsWith(letter));
              return (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedLetter(selectedLetter === letter ? "" : letter)}
                  disabled={!hasTerms}
                  className="text-xs w-8 h-8 p-0"
                >
                  {letter}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filtered.length} of {glossaryTerms.length} terms
        </p>

        {/* Terms grouped by letter */}
        {Object.keys(groupedByLetter).sort().map(letter => (
          <div key={letter} className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 border-b border-border pb-2">{letter}</h2>
            <div className="space-y-4">
              {groupedByLetter[letter].map(term => (
                <Card key={term.term} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg font-semibold">{term.term}</CardTitle>
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">{term.category}</Badge>
                        <Badge variant="outline" className="text-xs">Level {term.level}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{term.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No terms found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
