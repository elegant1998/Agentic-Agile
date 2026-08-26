import fs from "node:fs/promises";
import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const iconDirectory = "/Users/wanglijie/HappyLife/18-AI/Agentic-Agile/Agentic-Agile-Book/.tmp/ctO-value-stream-343-icons-ppt/icons";
const iconBytes = Object.fromEntries(
  await Promise.all(
    ["owner", "architect", "agent", "graph", "contract", "constraint", "evidence"].map(async (name) => [name, await fs.readFile(`${iconDirectory}/${name}.png`)]),
  ),
);

const addIcon = (slide, alt, icon, left, top, width = 28, height = 28) => {
  slide.images.add({
    blob: iconBytes[icon],
    contentType: "image/png",
    alt,
    fit: "contain",
    position: { left, top, width, height },
  });
};

const find = (slide, name) => {
  const shape = slide.shapes.items.find((item) => item.name === name);
  if (!shape) throw new Error(`Missing editable shape: ${name}`);
  return shape;
};

const replace = (slide, name, before, after) => find(slide, name).text.replace(before, after);
const rewrite = (slide, name, text) => { find(slide, name).text = text; };

const addReadingAnchors = (slide) => {
  // The three people icons sit in the otherwise unused tail of the people rail.
  addIcon(slide, "Intent Owner role", "owner", 1082, 349, 26, 26);
  addIcon(slide, "Orchestration Architect role", "architect", 1119, 349, 26, 26);
  addIcon(slide, "Autonomous Software Agent role", "agent", 1156, 349, 26, 26);

  // The four governance artifacts appear where each becomes most visible in the value stream.
  addIcon(slide, "Intent Graph artifact", "graph", 279, 172, 26, 26);
  addIcon(slide, "Intent Contract artifact", "contract", 557, 172, 26, 26);
  addIcon(slide, "Constraint Matrix artifact", "constraint", 835, 172, 26, 26);
  addIcon(slide, "Evidence artifact", "evidence", 1113, 172, 26, 26);
};

const notes = `
[Sources]
- Agentic Agile book, Chapter 5: 3-4-3, four dynamic governance artifacts, and SCOPE-V.
- Agentic Agile book, Chapter 25: IWE, Document Map and Code Map.
- Agentic Agile book, Chapter 26: Basic Memory and evidence-gated learning promotion.
- Visual asset: original line-icon strip generated for this presentation; it represents generic roles and governance artifacts, not real individuals or products.

[Presenter Notes]
- Read top-to-bottom: the value stream is the operating surface, cards show where the three autonomy mechanisms occur, and rails show the people, organization, process and tools that make them governable.
- The three avatar icons denote IO, OA and AS. The four artifact icons denote Intent Graph, Intent Contract, Constraint Matrix and Evidence.
- Judge improvement with comparable work and the same risk boundary: shorter end-to-end lead time must be accompanied by evidence, quality and governance controls.
`.trim();

async function buildChinese() {
  const deck = await PresentationFile.importPptx(await FileBlob.load(process.env.CN_STARTER));
  const slide = deck.slides.getItem(0);
  // Preserve the user-authored inline 3-4-3 color hierarchy while correcting the only typo.
  replace(slide, "phase-body-跑通受控闭环", "Constract", "Contract");
  replace(slide, "rail-body-工具", "、Telemetry 贯穿任务。", "、Telemetry");
  addReadingAnchors(slide);
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(process.env.CN_OUTPUT);
}

async function buildEnglish() {
  const deck = await PresentationFile.importPptx(await FileBlob.load(process.env.EN_STARTER));
  const slide = deck.slides.getItem(0);

  rewrite(slide, "title", "3-4-3 in the SDLC: Autonomy Along the Value Stream");
  rewrite(slide, "subtitle", "From customer request to release, three roles, four artifacts, three autonomy mechanisms and SCOPE-V operate together.");
  rewrite(slide, "thesis-text", "Value stream: Customer request → Clarification → Definition → Architecture → Code → SIT → Integration test → Release");

  rewrite(slide, "phase-time-选对价值流", "Intent Injection");
  rewrite(slide, "phase-title-选对价值流", "Request → Clarify");
  rewrite(slide, "phase-body-选对价值流", "IO + Owner: goal / guardrails\nSCOPE-V: Specify\nIntent Graph + IWE");

  rewrite(slide, "phase-time-跑通受控闭环", "Intent Injection");
  rewrite(slide, "phase-title-跑通受控闭环", "Define → Architect");
  rewrite(slide, "phase-body-跑通受控闭环", "IO: Contract / AC; OA: constraints\nSCOPE-V: Constrain / Orchestrate\nContract + Constraint + Work Graph");

  rewrite(slide, "phase-time-让上下文与经验复利", "Self-check");
  rewrite(slide, "phase-title-让上下文与经验复利", "Code → SIT");
  rewrite(slide, "phase-body-让上下文与经验复利", "AS: build / SIT; OA: Harness\nSCOPE-V: Prove ↔ Evolve\nCode Map + Evidence");

  rewrite(slide, "phase-time-扩大可复制能力", "HITL Gate");
  rewrite(slide, "phase-title-扩大可复制能力", "Integrate → Ship");
  rewrite(slide, "phase-body-扩大可复制能力", "AS: integrate / regress; IO/OA: Verify\nSCOPE-V: Verify → Telemetry\nEvidence + Memory");

  rewrite(slide, "four-dim-title", "3-4-3 in Four Dimensions: roles, artifacts and autonomy run on one value stream");
  rewrite(slide, "rail-label-人员", "People");
  rewrite(slide, "rail-body-人员", "IO owns intent / release; OA controls / orchestrates; AS executes code, tests and integration within boundary.");
  rewrite(slide, "rail-label-组织", "Organization");
  rewrite(slide, "rail-body-组织", "Business owner, product, architecture, engineering, test and operations collaborate on one Contract; exceptions use explicit gates.");
  rewrite(slide, "rail-label-流程", "Process");
  rewrite(slide, "rail-body-流程", "SCOPE-V: Specify → Constrain / Orchestrate → Prove ↔ Evolve → Verify → Telemetry; every step has entry, stop and evidence conditions.");
  rewrite(slide, "rail-label-工具", "Artifacts");
  rewrite(slide, "rail-body-工具", "4 artifacts: Intent Graph → Contract → Constraint Matrix → Evidence; IWE×Code Map, Harness, Memory and Telemetry.");

  rewrite(slide, "outcome-head", "Action Metrics");
  rewrite(slide, "outcome-body", "Demand: C&A% / rework | Build: Code→SIT LT / first-pass\nDelivery: Integration→Release LT / escape defects | Run: rollback, HITL, cost");
  rewrite(slide, "proof-head", "Proof: End-to-End Delivery");
  rewrite(slide, "proof-body", "Primary: end-to-end Lead Time | Supporting: C&A%, first-pass, rework, escape defects\nComparable work, same risk: baseline vs. trend + Contract / Evidence / Telemetry");
  rewrite(slide, "footer", "Agentic Agile | Faster, more accurate, more controllable SDLC—results you can prove");

  addReadingAnchors(slide);
  slide.speakerNotes.textFrame.setText(notes);
  slide.speakerNotes.setVisible(true);
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(process.env.EN_OUTPUT);
}

await buildChinese();
await buildEnglish();
