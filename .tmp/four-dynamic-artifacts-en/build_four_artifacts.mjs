import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT_PPTX = process.env.OUT_PPTX;
const OUT_PNG = process.env.OUT_PNG;
const TMP = process.env.TMP_DIR;
if (!OUT_PPTX || !OUT_PNG || !TMP) throw new Error("OUT_PPTX, OUT_PNG and TMP_DIR are required.");

const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const slide = deck.slides.add();
slide.background.fill = "#F6FAFF";

const addText = (name, text, position, style = {}) => {
  const shape = slide.shapes.add({
    geometry: "textbox", name, position,
    fill: "none", line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = { fontFace: "Helvetica Neue", color: "#10233F", ...style };
  return shape;
};

const addRound = (name, position, fill, line = "#D5E5F5", radius = "rounded-xl") =>
  slide.shapes.add({
    geometry: "roundRect", name, position, fill,
    line: { style: "solid", fill: line, width: 1 }, borderRadius: radius,
  });

// Header
addText("eyebrow", "AGENTIC AGILE 3-4-3  |  GOVERNANCE INTERFACE", { left: 64, top: 42, width: 720, height: 22 }, { fontSize: 13, bold: true, color: "#1677B8" });
addText("title", "Four Dynamic Governance Artifacts", { left: 64, top: 70, width: 1050, height: 52 }, { fontSize: 38, bold: true });
addText("subtitle", "What each artifact contains, a representative task example, and the evidence it creates for the next control step.", { left: 64, top: 126, width: 1080, height: 30 }, { fontSize: 18, color: "#4D617B" });

// Chain line rendered before cards.
slide.shapes.add({ geometry: "line", name: "artifact-chain", position: { left: 182, top: 221, width: 916, height: 0 }, line: { style: "solid", fill: "#77B9EC", width: 3, beginArrowType: "none", endArrowType: "triangle" } });

const cards = [
  {
    x: 64, color: "#0E7AC7", tint: "#EDF7FF", code: "IG", title: "Intent Graph",
    contains: "• Objective & metric\n• Users & capabilities\n• Dependencies & decisions",
    example: "Reduce high-value reimbursement cycle time by 30% without increasing error rate.",
    output: "Traceable goal-to-task map",
  },
  {
    x: 352, color: "#226CE6", tint: "#EEF3FF", code: "IC", title: "Intent Contract",
    contains: "• Scope / non-goals\n• Acceptance criteria\n• Authority & risk boundary",
    example: "T-001: approve high-value reimbursement within the agreed risk envelope.",
    output: "Signed execution envelope",
  },
  {
    x: 640, color: "#0D9AA8", tint: "#ECFBFC", code: "CM", title: "Constraint Matrix",
    contains: "• Access / data policies\n• Must / must-not rules\n• Thresholds / rollback",
    example: "Amount > $5k needs human approval; never read production PII.",
    output: "Executable guardrails",
  },
  {
    x: 928, color: "#168657", tint: "#EEF9F3", code: "EB", title: "Evidence",
    contains: "• Tests / evaluation\n• Traces / citations\n• Decisions / exceptions",
    example: "EB-T-001: policy check, test report and approver decision.",
    output: "Auditable proof pack",
  },
];

for (const card of cards) {
  const x = card.x;
  addRound(`card-${card.code}`, { left: x, top: 180, width: 252, height: 402 }, "#FFFFFF", "#CDE1F2");
  addRound(`code-${card.code}`, { left: x + 20, top: 198, width: 48, height: 40 }, card.color, card.color, "rounded-lg");
  addText(`code-text-${card.code}`, card.code, { left: x + 20, top: 207, width: 48, height: 22 }, { fontSize: 17, bold: true, color: "#FFFFFF", alignment: "center" });
  addText(`title-${card.code}`, card.title, { left: x + 80, top: 202, width: 154, height: 32 }, { fontSize: 23, bold: true });
  addText(`contains-label-${card.code}`, "CONTAINS", { left: x + 20, top: 258, width: 110, height: 18 }, { fontSize: 12, bold: true, color: card.color });
  addText(`contains-${card.code}`, card.contains, { left: x + 20, top: 282, width: 212, height: 88 }, { fontSize: 16, color: "#243B57" });
  addRound(`example-box-${card.code}`, { left: x + 16, top: 386, width: 220, height: 100 }, card.tint, card.tint, "rounded-lg");
  addText(`example-label-${card.code}`, "TASK EXAMPLE", { left: x + 28, top: 398, width: 130, height: 16 }, { fontSize: 11, bold: true, color: card.color });
  addText(`example-${card.code}`, card.example, { left: x + 28, top: 421, width: 196, height: 52 }, { fontSize: 14, color: "#18324D" });
  addText(`output-label-${card.code}`, "OUTPUT", { left: x + 20, top: 510, width: 80, height: 16 }, { fontSize: 11, bold: true, color: card.color });
  addText(`output-${card.code}`, card.output, { left: x + 20, top: 532, width: 210, height: 24 }, { fontSize: 16, bold: true, color: "#10233F" });
}

// Bottom readout.
addRound("control-chain", { left: 64, top: 614, width: 1152, height: 62 }, "#EAF5FF", "#B7DCF7", "rounded-xl");
addText("control-chain-title", "CONTROL CHAIN", { left: 88, top: 631, width: 138, height: 20 }, { fontSize: 13, bold: true, color: "#1677B8" });
addText("control-chain-text", "Intent → authorised work → enforced boundaries → auditable facts → trusted next task.", { left: 230, top: 627, width: 930, height: 26 }, { fontSize: 18, bold: true, color: "#173C66" });

slide.speakerNotes.textFrame.setText(`
[Sources]
- Agentic Agile Book, Chapter 5: the four dynamic governance artifacts.
- Agentic Agile Book, Chapter 7: Intent Graph and Intent Contract.

[Presenter Notes]
- Use this figure to make the governance artifacts concrete. A task should not begin with only a prompt: it starts from a traceable intent, an agreed execution contract and executable constraints.
- Evidence is not a report written after delivery. It is the proof layer that connects results, decisions and exceptions back to the intent and feeds trusted learning into the next task.
`.trim());
slide.speakerNotes.setVisible(true);

await fs.mkdir(TMP, { recursive: true });
const png = await deck.export({ slide, format: "png", scale: 2 });
await fs.writeFile(OUT_PNG, new Uint8Array(await png.arrayBuffer()));
await fs.writeFile(`${TMP}/slide-01.layout.json`, await (await slide.export({ format: "layout" })).text());
const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(OUT_PPTX);
