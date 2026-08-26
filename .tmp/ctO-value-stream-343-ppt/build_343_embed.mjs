import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const starterPptx = process.env.STARTER_PPTX;
const outputPptx = process.env.OUTPUT_PPTX;

if (!starterPptx || !outputPptx) {
  throw new Error("STARTER_PPTX and OUTPUT_PPTX are required.");
}

const deck = await PresentationFile.importPptx(await FileBlob.load(starterPptx));
const slide = deck.slides.getItem(0);

const rewrite = (name, text) => {
  const shape = slide.shapes.items.find((item) => item.name === name);
  if (!shape) throw new Error(`Missing editable shape: ${name}`);
  shape.text = text;
};

rewrite("title", "把 3-4-3 嵌入 SDLC：三大自治沿价值流递进");
rewrite("subtitle", "从客户需求提出到对外发布，3 个角色、4 大工件、3 大自治机制与 SCOPE-V 同步嵌入。");

rewrite("phase-time-选对价值流", "意图注入");
rewrite("phase-body-选对价值流", "IO + Owner：目标 / 护栏\nSCOPE-V：Specify\nIntent Graph + IWE");

rewrite("phase-time-跑通受控闭环", "意图注入");
rewrite("phase-body-跑通受控闭环", "IO：Contract / AC；OA：约束\nSCOPE-V：Constrain / Orchestrate\nConstraint + Work Graph");

rewrite("phase-time-让上下文与经验复利", "对抗自净");
rewrite("phase-body-让上下文与经验复利", "AS：实现 / SIT；OA：Harness\nSCOPE-V：Prove ↔ Evolve\nCode Map + Evidence");

rewrite("phase-time-扩大可复制能力", "HITL 裁决");
rewrite("phase-body-扩大可复制能力", "AS：集成 / 回归；IO / OA：Verify\nSCOPE-V：Verify → Telemetry\nEvidence + Memory");

rewrite("four-dim-title", "3-4-3 的四维嵌入：角色、工件与自治都沿同一条价值流运行");
rewrite("rail-body-流程", "SCOPE-V 的阶段落点：Specify → Constrain / Orchestrate → Prove ↔ Evolve → Verify → Telemetry；每一步都有启动条件、停止条件与 Evidence。");
rewrite("rail-label-工具", "工件·工具");
rewrite("rail-body-工具", "四大工件：意图图谱 → 意图契约 → 约束矩阵 → Evidence；IWE×Code Map、Harness、Memory、Telemetry 贯穿任务。");

slide.speakerNotes.textFrame.setText(`
[Sources]
- Agentic Agile Book, Chapter 5: 3-4-3, four dynamic governance artifacts, and SCOPE-V.
- Agentic Agile Book, Chapter 25: IWE, Document Map and Code Map for trusted task context.
- Agentic Agile Book, Chapter 26: Basic Memory and evidence-gated learning promotion.

[Presenter Notes]
- Read the slide from top to bottom: the SDLC value stream is the common operational surface; the four cards show where the three autonomy mechanisms appear.
- The four rails make 3-4-3 concrete: people and organization own decisions; SCOPE-V governs the operating flow; the four artifacts and supporting tools carry facts, constraints and learning.
- Success is not code volume. Use comparable work, the same risk boundary, and Contract/Evidence/Telemetry to prove shorter end-to-end lead time without quality or control regression.
`);
slide.speakerNotes.setVisible(true);

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(outputPptx);
