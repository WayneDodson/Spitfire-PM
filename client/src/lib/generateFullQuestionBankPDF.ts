/**
 * generateFullQuestionBankPDF
 * Produces a comprehensive A4 PDF containing every question and answer from the
 * entire PM Simulate site: level confidence checks, level assessments, and all
 * PFQ/PMQ module quizzes.
 */
import jsPDF from "jspdf";

// ── Colour palette (dark theme) ────────────────────────────────────────────────
type RGB = [number, number, number];
const PAGE_BG: RGB = [8, 14, 26];
const HEADER_BG: RGB = [15, 23, 42];
const SECTION_BG: RGB = [18, 28, 50];
const CARD_BG: RGB = [22, 35, 62];
const CORRECT_BG: RGB = [6, 78, 59];
const CORRECT_TEXT: RGB = [52, 211, 153];
const ACCENT: RGB = [56, 189, 248];
const MUTED: RGB = [100, 116, 139];
const WHITE: RGB = [241, 245, 249];
const YELLOW: RGB = [251, 191, 36];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;

type LevelSection = {
  levelId: number;
  levelTitle: string;
  perLesson: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    lessonTitle: string | null;
    afterLessonNumber: number;
  }>;
  assessment: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    lessonTitle: string | null;
    afterLessonNumber: number;
  }>;
};

type QualSection = {
  qualId: string;
  qualTitle: string;
  modules: Array<{
    moduleId: string;
    moduleNumber: number;
    title: string;
    questions: Array<{ q: string; opts: string[]; ans: number }>;
  }>;
};

export interface FullQuestionBankInput {
  userName?: string;
  levelSections: LevelSection[];
  qualSections: QualSection[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function setFill(doc: jsPDF, c: RGB) { doc.setFillColor(...c); }
function setDraw(doc: jsPDF, c: RGB) { doc.setDrawColor(...c); }
function setTextColor(doc: jsPDF, c: RGB) { doc.setTextColor(...c); }

function wrapText(doc: jsPDF, text: string, maxW: number): string[] {
  return doc.splitTextToSize(text, maxW) as string[];
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - 12) {
    doc.addPage();
    // re-fill background
    setFill(doc, PAGE_BG);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
    return 14;
  }
  return y;
}

// ── Cover page ─────────────────────────────────────────────────────────────────
function drawCover(doc: jsPDF, userName?: string) {
  setFill(doc, PAGE_BG);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Top accent bar
  setFill(doc, ACCENT);
  doc.rect(0, 0, PAGE_W, 2, "F");

  // Title block
  const cx = PAGE_W / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setTextColor(doc, WHITE);
  doc.text("Full Question Bank", cx, 80, { align: "center" });

  doc.setFontSize(14);
  setTextColor(doc, ACCENT);
  doc.text("Spitfire PM — Complete Study Reference", cx, 94, { align: "center" });

  if (userName) {
    doc.setFontSize(11);
    setTextColor(doc, MUTED);
    doc.text(`Prepared for: ${userName}`, cx, 108, { align: "center" });
  }

  // Stats box
  const boxX = MARGIN + 10;
  const boxY = 125;
  const boxW = CONTENT_W - 20;
  setFill(doc, CARD_BG);
  doc.roundedRect(boxX, boxY, boxW, 40, 3, 3, "F");
  doc.setFontSize(10);
  setTextColor(doc, MUTED);
  doc.text("This document contains every question and correct answer from:", cx, boxY + 10, { align: "center" });
  setTextColor(doc, WHITE);
  doc.setFont("helvetica", "normal");
  doc.text("• 7 Course Levels (per-lesson confidence checks + level assessments)", cx, boxY + 20, { align: "center" });
  doc.text("• PFQ & PMQ Qualification Prep modules (all quiz questions)", cx, boxY + 30, { align: "center" });

  // Date
  const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  doc.setFontSize(9);
  setTextColor(doc, MUTED);
  doc.text(`Generated: ${now}`, cx, 185, { align: "center" });

  // Bottom bar
  setFill(doc, HEADER_BG);
  doc.rect(0, PAGE_H - 14, PAGE_W, 14, "F");
  doc.setFontSize(8);
  setTextColor(doc, MUTED);
  doc.text("Spitfire PM · www.spitfire-pm.com", cx, PAGE_H - 5, { align: "center" });
}

// ── Section header (full-width coloured bar) ───────────────────────────────────
function drawSectionHeader(doc: jsPDF, y: number, title: string, subtitle: string): number {
  y = ensureSpace(doc, y, 20);
  setFill(doc, SECTION_BG);
  doc.rect(MARGIN - 2, y, CONTENT_W + 4, 16, "F");
  setFill(doc, ACCENT);
  doc.rect(MARGIN - 2, y, 3, 16, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setTextColor(doc, WHITE);
  doc.text(title, MARGIN + 5, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextColor(doc, MUTED);
  doc.text(subtitle, MARGIN + 5, y + 13);
  return y + 20;
}

// ── Sub-section label (e.g. "Lesson 3 Confidence Check") ──────────────────────
function drawSubLabel(doc: jsPDF, y: number, label: string): number {
  y = ensureSpace(doc, y, 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setTextColor(doc, YELLOW);
  doc.text(label.toUpperCase(), MARGIN, y + 5);
  return y + 8;
}

// ── Single question card ───────────────────────────────────────────────────────
function drawQuestion(
  doc: jsPDF,
  y: number,
  qNum: number,
  question: string,
  options: string[],
  correctIdx: number,
  explanation: string
): number {
  const qLines = wrapText(doc, `${qNum}. ${question}`, CONTENT_W - 4);
  const optLines = options.map((o, i) => {
    const label = String.fromCharCode(65 + i); // A B C D
    return { label, text: o, correct: i === correctIdx };
  });
  const expLines = wrapText(doc, explanation, CONTENT_W - 10);

  // Calculate card height
  const lineH = 4.5;
  const qH = qLines.length * lineH + 3;
  const optsH = optLines.reduce((acc, o) => {
    const wrapped = wrapText(doc, `${o.label}. ${o.text}`, CONTENT_W - 16);
    return acc + wrapped.length * lineH + 2;
  }, 0);
  const expH = expLines.length * lineH + 6;
  const cardH = qH + optsH + expH + 8;

  y = ensureSpace(doc, y, cardH + 4);

  // Card background
  setFill(doc, CARD_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, cardH, 2, 2, "F");

  let cy = y + 4;

  // Question text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(doc, WHITE);
  doc.text(qLines, MARGIN + 3, cy + lineH - 1);
  cy += qH;

  // Options
  for (const opt of optLines) {
    const wrapped = wrapText(doc, `${opt.label}. ${opt.text}`, CONTENT_W - 16);
    const optH = wrapped.length * lineH + 2;

    if (opt.correct) {
      setFill(doc, CORRECT_BG);
      doc.roundedRect(MARGIN + 2, cy - 1, CONTENT_W - 4, optH + 1, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      setTextColor(doc, CORRECT_TEXT);
    } else {
      doc.setFont("helvetica", "normal");
      setTextColor(doc, MUTED);
    }
    doc.setFontSize(8.5);
    doc.text(wrapped, MARGIN + 6, cy + lineH - 1);
    cy += optH;
  }

  // Explanation
  cy += 3;
  setFill(doc, [12, 22, 40] as RGB);
  doc.roundedRect(MARGIN + 2, cy - 1, CONTENT_W - 4, expH, 1, 1, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  setTextColor(doc, [148, 163, 184] as RGB);
  doc.text("Explanation:", MARGIN + 5, cy + 4);
  doc.setFont("helvetica", "normal");
  doc.text(expLines, MARGIN + 5, cy + 4 + lineH);

  return y + cardH + 4;
}

// ── Page footer ────────────────────────────────────────────────────────────────
function addFooters(doc: jsPDF) {
  const total = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    setFill(doc, HEADER_BG);
    doc.rect(0, PAGE_H - 10, PAGE_W, 10, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setTextColor(doc, MUTED);
    doc.text("Spitfire PM · Full Question Bank", MARGIN, PAGE_H - 3.5);
    doc.text(`Page ${p} of ${total}`, PAGE_W - MARGIN, PAGE_H - 3.5, { align: "right" });
  }
}

// ── Main export ────────────────────────────────────────────────────────────────
export function generateFullQuestionBankPDF(input: FullQuestionBankInput): void {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // Cover
  drawCover(doc, input.userName);

  // ── PART 1: Level Questions ──────────────────────────────────────────────────
  for (const level of input.levelSections) {
    const totalQ = level.perLesson.length + level.assessment.length;
    if (totalQ === 0) continue;

    doc.addPage();
    setFill(doc, PAGE_BG);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");

    let y = MARGIN;
    y = drawSectionHeader(
      doc,
      y,
      level.levelTitle,
      `${level.perLesson.length} confidence checks  ·  ${level.assessment.length} assessment questions`
    );

    // Per-lesson confidence checks
    if (level.perLesson.length > 0) {
      y = drawSubLabel(doc, y, "Per-Lesson Confidence Checks");
      let qNum = 1;
      for (const q of level.perLesson) {
        const label = q.lessonTitle ? `Lesson ${q.afterLessonNumber}: ${q.lessonTitle}` : `Lesson ${q.afterLessonNumber}`;
        y = drawSubLabel(doc, y, label);
        y = drawQuestion(doc, y, qNum++, q.question, q.options, q.correctAnswerIndex, q.explanation);
      }
    }

    // Level assessment
    if (level.assessment.length > 0) {
      y = drawSubLabel(doc, y, `Level Assessment (${level.assessment.length} questions)`);
      let qNum = 1;
      for (const q of level.assessment) {
        y = drawQuestion(doc, y, qNum++, q.question, q.options, q.correctAnswerIndex, q.explanation);
      }
    }
  }

  // ── PART 2: APM Qualification Questions ─────────────────────────────────────
  for (const qual of input.qualSections) {
    for (const mod of qual.modules) {
      if (!mod.questions || mod.questions.length === 0) continue;

      doc.addPage();
      setFill(doc, PAGE_BG);
      doc.rect(0, 0, PAGE_W, PAGE_H, "F");

      let y = MARGIN;
      y = drawSectionHeader(
        doc,
        y,
        `${qual.qualTitle} — Module ${mod.moduleNumber}: ${mod.title}`,
        `${mod.questions.length} practice questions`
      );

      let qNum = 1;
      for (const q of mod.questions) {
        y = drawQuestion(doc, y, qNum++, q.q, q.opts, q.ans, "");
      }
    }
  }

  addFooters(doc);

  const safeName = input.userName ? `_${input.userName.replace(/\s+/g, "_")}` : "";
  doc.save(`Spitfire_PM_Full_Question_Bank${safeName}.pdf`);
}
