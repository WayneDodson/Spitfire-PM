import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, CheckCircle2, AlertCircle, Clock, Users, TrendingUp } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

const frameworks = [
  {
    name: "Waterfall",
    tagline: "Sequential, plan-driven project management",
    level: 2,
    color: "blue",
    icon: "📋",
    overview: "Waterfall is a linear, sequential approach where each phase must be completed before the next begins. It is best suited for projects with well-defined, stable requirements and low uncertainty.",
    phases: ["Requirements", "System Design", "Implementation", "Integration & Testing", "Deployment", "Maintenance"],
    bestFor: ["Construction and engineering projects", "Government and defence contracts", "Projects with fixed regulatory requirements", "Simple projects with clear scope"],
    notFor: ["Projects with evolving requirements", "Innovative or exploratory work", "Fast-changing technology environments"],
    keyTools: ["Gantt Charts", "Work Breakdown Structure (WBS)", "Requirements Traceability Matrix", "Change Control Board", "PERT Charts"],
    keyRoles: ["Project Manager", "Business Analyst", "Technical Lead", "Quality Assurance Manager", "Project Sponsor"],
    certifications: ["PMP (Project Management Professional)", "PRINCE2 Foundation/Practitioner", "APM PMQ"],
    prosAndCons: {
      pros: ["Clear structure and milestones", "Comprehensive documentation", "Easy to understand and manage", "Well-suited for fixed-price contracts"],
      cons: ["Inflexible to change", "Late discovery of issues", "Customer sees product only at end", "High risk for complex projects"]
    }
  },
  {
    name: "Agile",
    tagline: "Iterative, value-driven delivery",
    level: 3,
    color: "green",
    icon: "🔄",
    overview: "Agile is an iterative approach that delivers value in small, frequent increments. Teams adapt to changing requirements and continuously improve through regular feedback loops. Agile is a mindset, not a single methodology.",
    phases: ["Vision & Roadmap", "Release Planning", "Sprint Planning", "Sprint Execution", "Sprint Review", "Sprint Retrospective"],
    bestFor: ["Software development", "Product development with uncertain requirements", "Innovation and R&D projects", "Customer-facing digital products"],
    notFor: ["Projects requiring detailed upfront contracts", "Safety-critical systems requiring extensive documentation", "Projects with fixed scope, time, and budget"],
    keyTools: ["Product Backlog", "Sprint Backlog", "Burndown Charts", "Velocity Tracking", "Kanban Boards", "User Stories"],
    keyRoles: ["Product Owner", "Scrum Master", "Development Team", "Agile Coach", "Stakeholders"],
    certifications: ["PMI-ACP (Agile Certified Practitioner)", "Certified Scrum Master (CSM)", "SAFe Agilist", "ICAgile ICP"],
    prosAndCons: {
      pros: ["Highly flexible and adaptive", "Continuous delivery of value", "Early and frequent feedback", "Improved team collaboration"],
      cons: ["Difficult to predict final cost/timeline", "Requires active stakeholder involvement", "Can lack documentation", "Scope can expand without discipline"]
    }
  },
  {
    name: "Scrum",
    tagline: "Agile framework with defined roles and ceremonies",
    level: 3,
    color: "purple",
    icon: "🏉",
    overview: "Scrum is the most widely used Agile framework. It organises work into fixed-length sprints (1-4 weeks), with defined roles, ceremonies, and artefacts that create transparency, inspection, and adaptation.",
    phases: ["Product Backlog Refinement", "Sprint Planning", "Daily Scrum", "Sprint Execution", "Sprint Review", "Sprint Retrospective"],
    bestFor: ["Software and product development", "Teams of 3-9 people", "Projects with evolving requirements", "Organisations adopting Agile"],
    notFor: ["Very large teams without scaling frameworks", "Projects requiring strict sequential phases", "Teams unable to commit to regular ceremonies"],
    keyTools: ["Product Backlog", "Sprint Backlog", "Definition of Done", "Burndown Chart", "Scrum Board", "Velocity"],
    keyRoles: ["Product Owner", "Scrum Master", "Development Team (3-9 people)"],
    certifications: ["Certified Scrum Master (CSM)", "Professional Scrum Master (PSM)", "Certified Scrum Product Owner (CSPO)"],
    prosAndCons: {
      pros: ["Clear accountability and transparency", "Regular delivery of working software", "Built-in continuous improvement", "Empowered, self-organising teams"],
      cons: ["Requires experienced Scrum Master", "Daily standups can feel burdensome", "Difficult to scale without frameworks like SAFe", "Scope changes between sprints can disrupt flow"]
    }
  },
  {
    name: "PRINCE2",
    tagline: "Process-based, governance-focused methodology",
    level: 7,
    color: "orange",
    icon: "👑",
    overview: "PRINCE2 (Projects IN Controlled Environments) is a structured project management methodology widely used in the UK, Europe, and Australia. It focuses on business justification, defined organisation structure, and product-based planning.",
    phases: ["Starting Up a Project", "Initiating a Project", "Directing a Project", "Controlling a Stage", "Managing Product Delivery", "Managing Stage Boundaries", "Closing a Project"],
    bestFor: ["Government and public sector projects", "Large, complex projects requiring governance", "Organisations needing standardised processes", "Projects in highly regulated industries"],
    notFor: ["Small, informal projects", "Agile/iterative environments (without PRINCE2 Agile)", "Startups and fast-moving organisations"],
    keyTools: ["Business Case", "Project Initiation Document (PID)", "Risk Register", "Issue Register", "Quality Register", "Highlight Reports"],
    keyRoles: ["Executive (Project Sponsor)", "Senior User", "Senior Supplier", "Project Manager", "Team Manager", "Project Assurance", "Change Authority"],
    certifications: ["PRINCE2 Foundation", "PRINCE2 Practitioner", "PRINCE2 Agile Foundation/Practitioner"],
    prosAndCons: {
      pros: ["Strong governance and control", "Scalable to project size", "Clear roles and responsibilities", "Widely recognised globally"],
      cons: ["Can be bureaucratic for small projects", "Heavy documentation requirements", "Requires significant training", "Less flexible than Agile approaches"]
    }
  },
  {
    name: "Kanban",
    tagline: "Visual workflow management and continuous flow",
    level: 3,
    color: "yellow",
    icon: "📌",
    overview: "Kanban is a visual workflow management method that helps teams visualise work, limit work in progress (WIP), and maximise efficiency. Unlike Scrum, Kanban has no fixed iterations — work flows continuously.",
    phases: ["Visualise Workflow", "Limit WIP", "Manage Flow", "Make Policies Explicit", "Implement Feedback Loops", "Improve Collaboratively"],
    bestFor: ["Ongoing operations and support teams", "Teams with unpredictable incoming work", "Maintenance and bug-fixing teams", "Teams transitioning from ad-hoc to structured work"],
    notFor: ["Projects with clear start and end dates", "Teams needing sprint-based planning", "Complex product development requiring detailed backlog management"],
    keyTools: ["Kanban Board", "WIP Limits", "Cumulative Flow Diagram", "Lead Time", "Cycle Time", "Throughput"],
    keyRoles: ["Service Delivery Manager", "Flow Manager", "Team Members"],
    certifications: ["Kanban Management Professional (KMP)", "Team Kanban Practitioner (TKP)", "Certified Kanban Practitioner"],
    prosAndCons: {
      pros: ["Highly visual and transparent", "Reduces multitasking and bottlenecks", "Easy to implement incrementally", "No mandatory ceremonies"],
      cons: ["No timeboxing can lead to lack of urgency", "Difficult to predict delivery dates", "Less structure than Scrum", "WIP limits require discipline to maintain"]
    }
  },
  {
    name: "Lean",
    tagline: "Eliminate waste, maximise value",
    level: 6,
    color: "red",
    icon: "⚡",
    overview: "Lean project management is derived from Toyota's manufacturing principles. It focuses on delivering maximum value to customers while minimising waste. The five Lean principles guide continuous improvement.",
    phases: ["Define Value", "Map Value Stream", "Create Flow", "Establish Pull", "Pursue Perfection"],
    bestFor: ["Manufacturing and operations", "Process improvement initiatives", "Organisations seeking efficiency gains", "Teams wanting to reduce waste and overhead"],
    notFor: ["Creative or innovative projects", "Projects where exploration is the goal", "Environments with high uncertainty"],
    keyTools: ["Value Stream Mapping", "5S", "Kaizen", "Root Cause Analysis", "Poka-Yoke", "Gemba Walks"],
    keyRoles: ["Lean Champion", "Process Owner", "Team Members", "Continuous Improvement Manager"],
    certifications: ["Lean Six Sigma (Yellow/Green/Black Belt)", "Certified Lean Practitioner", "PMI-ACP (includes Lean principles)"],
    prosAndCons: {
      pros: ["Reduces waste and inefficiency", "Improves quality and customer value", "Encourages continuous improvement culture", "Applicable across industries"],
      cons: ["Requires cultural change", "Can be difficult to implement in non-manufacturing environments", "Risk of over-optimisation", "Requires sustained leadership commitment"]
    }
  }
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 border-blue-200",
  green: "bg-green-500/10 text-green-600 border-green-200",
  purple: "bg-purple-500/10 text-purple-600 border-purple-200",
  orange: "bg-orange-500/10 text-orange-600 border-orange-200",
  yellow: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  red: "bg-red-500/10 text-red-600 border-red-200",
};

export default function Frameworks() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader activePath="/frameworks" />
      {/* Page title */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">PM Frameworks Reference</h1>
          </div>
          <p className="text-muted-foreground">
            A comprehensive comparison of the major project management frameworks. Use this as your reference guide when choosing the right approach for any project.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* Quick comparison table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold">Framework</th>
                    <th className="text-left py-3 pr-4 font-semibold">Approach</th>
                    <th className="text-left py-3 pr-4 font-semibold">Best For</th>
                    <th className="text-left py-3 pr-4 font-semibold">Flexibility</th>
                    <th className="text-left py-3 font-semibold">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {frameworks.map(f => (
                    <tr key={f.name} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 pr-4 font-medium">{f.icon} {f.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{f.tagline.split(",")[0]}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{f.bestFor[0]}</td>
                      <td className="py-3 pr-4">
                        {["Agile", "Scrum", "Kanban"].includes(f.name) ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-200 border text-xs">High</Badge>
                        ) : f.name === "PRINCE2" ? (
                          <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 border text-xs">Medium</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-600 border-red-200 border text-xs">Low</Badge>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-xs">Level {f.level}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Individual framework cards */}
        {frameworks.map(framework => (
          <Card key={framework.name} className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl">{framework.icon}</span>
                    <div>
                      <CardTitle className="text-2xl">{framework.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{framework.tagline}</p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">Covered in Level {framework.level}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overview */}
              <p className="text-sm leading-relaxed text-foreground">{framework.overview}</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phases */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Key Phases / Steps
                  </h4>
                  <ol className="space-y-1">
                    {framework.phases.map((phase, i) => (
                      <li key={phase} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium flex-shrink-0">{i + 1}</span>
                        {phase}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Roles */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Key Roles
                  </h4>
                  <ul className="space-y-1">
                    {framework.keyRoles.map(role => (
                      <li key={role} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Pros */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {framework.prosAndCons.pros.map(pro => (
                      <li key={pro} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    Limitations
                  </h4>
                  <ul className="space-y-1">
                    {framework.prosAndCons.cons.map(con => (
                      <li key={con} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-0.5 flex-shrink-0">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best For / Not For */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Best Used For</h4>
                  <ul className="space-y-1">
                    {framework.bestFor.map(item => (
                      <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Not Ideal For</h4>
                  <ul className="space-y-1">
                    {framework.notFor.map(item => (
                      <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Relevant Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {framework.certifications.map(cert => (
                    <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>
                  ))}
                </div>
              </div>

              {/* Key Tools */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">Key Tools & Artefacts</h4>
                <div className="flex flex-wrap gap-2">
                  {framework.keyTools.map(tool => (
                    <Badge key={tool} variant="outline" className="text-xs">{tool}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
