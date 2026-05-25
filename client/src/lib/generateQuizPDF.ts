import { jsPDF } from "jspdf";

export interface QuizItem {
  q: string;
  opts: string[];
  ans: number;
  explanation?: string;
}

export interface QuizPDFOptions {
  qualificationName: string; // e.g. "APM PFQ" or "APM PMQ"
  moduleName: string;        // e.g. "Module 3: Risk Management"
  userName?: string;
  score: number;
  totalQuestions: number;
  passThreshold?: number;    // 0–1, default 0.55
  quiz: QuizItem[];
  selectedAnswers: Record<number, number>;
  attemptDate?: Date;
}

const PASS_COLOR: [number, number, number] = [16, 185, 129];   // emerald-500
const FAIL_COLOR: [number, number, number] = [239, 68, 68];    // red-500
const CORRECT_COLOR: [number, number, number] = [16, 185, 129];
const WRONG_COLOR: [number, number, number] = [239, 68, 68];
const NEUTRAL_COLOR: [number, number, number] = [100, 116, 139];
const DARK_BG: [number, number, number] = [15, 23, 42];
const CARD_BG: [number, number, number] = [22, 33, 55];
const TEXT_PRIMARY: [number, number, number] = [241, 245, 249];
const TEXT_SECONDARY: [number, number, number] = [148, 163, 184];
const ACCENT: [number, number, number] = [34, 211, 238]; // cyan-400

function wrapText(doc: jsPDF, text: string, x: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, 0);
  return lines.length * lineHeight;
}

export function generateQuizPDF(opts: QuizPDFOptions): void {
  const {
    qualificationName,
    moduleName,
    userName,
    score,
    totalQuestions,
    passThreshold = 0.55,
    quiz,
    selectedAnswers,
    attemptDate = new Date(),
  } = opts;

  const pct = Math.round((score / totalQuestions) * 100);
  const passed = score / totalQuestions >= passThreshold;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;

  let y = 0;

  // ── Helper: add new page if needed ──────────────────────────────────────────
  const checkPage = (needed: number) => {
    if (y + needed > pageH - 16) {
      doc.addPage();
      // Dark background on new page
      doc.setFillColor(...DARK_BG);
      doc.rect(0, 0, pageW, pageH, "F");
      y = margin;
    }
  };

  // ── Page 1 background ───────────────────────────────────────────────────────
  doc.setFillColor(...DARK_BG);
  doc.rect(0, 0, pageW, pageH, "F");

  // ── Header bar ──────────────────────────────────────────────────────────────
  doc.setFillColor(...CARD_BG);
  doc.rect(0, 0, pageW, 36, "F");

  // Accent left stripe
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, 4, 36, "F");

  y = 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(qualificationName, margin + 4, y + 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text(moduleName, margin + 4, y + 9);

  const dateStr = attemptDate.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  doc.text(`Completed: ${dateStr}`, margin + 4, y + 15);
  if (userName) {
    doc.text(`Candidate: ${userName}`, pageW - margin - 4, y + 15, { align: "right" });
  }

  y = 44;

  // ── Score card ──────────────────────────────────────────────────────────────
  const scoreCardH = 32;
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(margin, y, contentW, scoreCardH, 3, 3, "F");

  // Pass/Fail badge
  const badgeW = 28;
  const badgeColor = passed ? PASS_COLOR : FAIL_COLOR;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(margin + 6, y + 8, badgeW, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(passed ? "PASS" : "FAIL", margin + 6 + badgeW / 2, y + 17, { align: "center" });

  // Score numbers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...TEXT_PRIMARY);
  doc.text(`${pct}%`, margin + 44, y + 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text(`${score} / ${totalQuestions} correct`, margin + 44, y + 26);

  // Pass threshold note
  const thresholdPct = Math.round(passThreshold * 100);
  doc.text(`Pass mark: ${thresholdPct}%`, pageW - margin - 6, y + 19, { align: "right" });
  doc.text(
    passed ? "Well done — you passed!" : "Keep practising — review the questions below",
    pageW - margin - 6,
    y + 26,
    { align: "right" }
  );

  y += scoreCardH + 10;

  // ── Section heading ─────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text("QUESTION REVIEW", margin, y);
  y += 6;

  // ── Questions ───────────────────────────────────────────────────────────────
  quiz.forEach((q, qi) => {
    const userAns = selectedAnswers[qi];
    const isCorrect = userAns === q.ans;

    // Estimate card height
    const qLines = doc.splitTextToSize(`${qi + 1}. ${q.q}`, contentW - 12);
    const expLines = q.explanation
      ? doc.splitTextToSize(q.explanation, contentW - 16)
      : [];
    const cardH = 10 + qLines.length * 5 + q.opts.length * 7 + (expLines.length > 0 ? expLines.length * 4.5 + 8 : 0) + 6;

    checkPage(cardH + 4);

    // Card background
    const borderColor = isCorrect ? CORRECT_COLOR : WRONG_COLOR;
    doc.setFillColor(...CARD_BG);
    doc.roundedRect(margin, y, contentW, cardH, 2, 2, "F");
    // Left border stripe
    doc.setFillColor(...borderColor);
    doc.rect(margin, y, 3, cardH, "F");

    // Question number badge
    doc.setFillColor(...borderColor);
    doc.roundedRect(margin + 6, y + 4, 7, 5, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text(`Q${qi + 1}`, margin + 9.5, y + 7.5, { align: "center" });

    // Correct/Incorrect label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...borderColor);
    doc.text(isCorrect ? "✓ CORRECT" : "✗ INCORRECT", pageW - margin - 6, y + 7.5, { align: "right" });

    // Question text
    let innerY = y + 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_PRIMARY);
    const qText = `${qi + 1}. ${q.q}`;
    const qWrapped = doc.splitTextToSize(qText, contentW - 12);
    doc.text(qWrapped, margin + 6, innerY);
    innerY += qWrapped.length * 5 + 3;

    // Options
    q.opts.forEach((opt, oi) => {
      const isUserChoice = userAns === oi;
      const isAnswer = q.ans === oi;

      let optColor: [number, number, number] = TEXT_SECONDARY;
      let prefix = "";
      if (isAnswer) {
        optColor = CORRECT_COLOR;
        prefix = "✓ ";
      } else if (isUserChoice && !isAnswer) {
        optColor = WRONG_COLOR;
        prefix = "✗ ";
      }

      doc.setFont("helvetica", isAnswer || isUserChoice ? "bold" : "normal");
      doc.setFontSize(8);
      doc.setTextColor(...optColor);
      const letter = String.fromCharCode(65 + oi);
      const optText = `${prefix}${letter}. ${opt}`;
      const optLines = doc.splitTextToSize(optText, contentW - 16);
      doc.text(optLines, margin + 8, innerY);
      innerY += optLines.length * 6 + 1;
    });

    // Explanation
    if (q.explanation) {
      innerY += 3;
      doc.setFillColor(15, 23, 42);
      const expH = expLines.length * 4.5 + 6;
      doc.roundedRect(margin + 6, innerY - 2, contentW - 12, expH, 1, 1, "F");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(...NEUTRAL_COLOR);
      doc.text("Explanation:", margin + 10, innerY + 3);
      doc.setFont("helvetica", "normal");
      doc.text(expLines, margin + 10, innerY + 7.5);
    }

    y += cardH + 4;
  });

  // ── Footer on last page ──────────────────────────────────────────────────────
  const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...CARD_BG);
    doc.rect(0, pageH - 10, pageW, 10, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...TEXT_SECONDARY);
    doc.text("Spitfire PM — Project Management Simulator", margin, pageH - 3.5);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 3.5, { align: "right" });
  }

  // ── Save ─────────────────────────────────────────────────────────────────────
  const safeName = moduleName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`${safeName}_results_${dateStr.replace(/ /g, "_")}.pdf`);
}
