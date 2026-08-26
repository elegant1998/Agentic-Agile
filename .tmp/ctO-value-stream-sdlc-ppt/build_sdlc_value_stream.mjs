import { FileBlob, PresentationFile } from "@oai/artifact-tool";

const starterPptx = process.env.STARTER_PPTX;
const OUT = process.env.FINAL_PPTX;
if (!starterPptx || !OUT) throw new Error("STARTER_PPTX and FINAL_PPTX are required");

const deck = await PresentationFile.importPptx(await FileBlob.load(starterPptx));

const replacements = [
  ["title", "用一条产品研发价值流，兑现 AI 转型的端到端提效", "把 3-4-3 嵌入 SDLC：用一条价值流完成 AI 转型"],
  ["subtitle", "不是部署更多 Agent，而是让意图、受控执行、证据与学习在同一条价值流上闭环。", "客户需求提出到对外发布，每一阶段都有责任、边界、Agent 行动、证据与可量化的改善。"],
  ["thesis-text", "试点目标：以一条真实产品研发价值流为单位，建立可签署、可运行、可验证、可复用的 AI 原生交付能力。", "价值流：客户需求 → 需求澄清 → 需求定义 → 架构设计 → 编码 → SIT → 集成测试 → 对外发布"],
  ["phase-time-选对价值流", "0–2 周", "需求形成"],
  ["phase-title-选对价值流", "选对价值流", "客户需求 → 澄清"],
  ["phase-body-选对价值流", "业务结果 + 关键瓶颈\n基线、风险与范围", "IO：价值、护栏、假设\nAgent：资料、访谈、反例"],
  ["phase-time-跑通受控闭环", "3–5 周", "需求定型"],
  ["phase-title-跑通受控闭环", "跑通受控闭环", "定义 → 架构"],
  ["phase-body-跑通受控闭环", "Intent Contract + SCOPE-V\nHarness、Prove、Evidence", "IO：签署 Contract / AC\nOA：约束、上下文、Work Graph"],
  ["phase-time-让上下文与经验复利", "6–9 周", "工程闭环"],
  ["phase-title-让上下文与经验复利", "让上下文与经验复利", "编码 → SIT"],
  ["phase-body-让上下文与经验复利", "IWE 文档地图 + Code Map（双地图）\nEvidence → Basic / Agent Memory\n验证晋升 → 规则 / 测试 / Skill", "AS：受控实现与测试\nOA：Harness、Prove / Evolve"],
  ["phase-time-扩大可复制能力", "10–12 周", "交付裁决"],
  ["phase-title-扩大可复制能力", "扩大可复制能力", "集成 → 发布"],
  ["phase-body-扩大可复制能力", "标准、技能与授权扩展\nTelemetry 支持扩大或收缩", "AS：集成、回归与补证\nIO / OA：Verify、发布、回退"],
  ["four-dim-title", "四维必须同时改变，但每一步只改造本轮闭环所需的最小部分", "3-4-3 不是阶段外的附加治理，而是嵌入每一个 SDLC 阶段的运行方式"],
  ["rail-body-人员", "IO / OA / AS：人从重复执行转向意图定义、控制设计、异常裁决与责任签署。", "IO 主导需求、定义与发布裁决；OA 贯穿控制与编排；AS 承担编码、测试、集成的受约束执行。"],
  ["rail-body-组织", "围绕价值流形成最小责任单元；决策权前移，越界、冲突与不可逆行动有明确去处。", "业务 Owner、产品、架构、研发、测试与运维围绕同一 Contract 协作；例外在正确节点裁决。"],
  ["rail-body-流程", "SCOPE-V：机器快内环持续执行、验证与修复；人类责任外环负责边界、例外、发布与扩大。", "Specify / Constrain / Orchestrate → Prove / Evolve → Verify：每一步都有启动条件、停止条件与 Evidence。"],
  ["rail-body-工具", "Context + Orchestration + Harness + Evidence + Telemetry：把规则、状态、权限和事实嵌入日常工作。", "Intent Graph / Contract / Constraint / Evidence + IWE×Code Map + Basic Memory：让事实随任务更新，不散落在聊天中。"],
  ["outcome-head", "将取得什么成果", "阶段动作与改善指标"],
  ["outcome-body", "端到端周期缩短  ·  首次通过率提升  ·  返工与等待下降\n人类判断集中到价值与风险节点  ·  可复用上下文、规则、测试与 Skill 持续累积", "需求：C&A% / 澄清返工 ｜ 工程：编码→SIT Lead Time / 首次通过\n交付：集成→发布 Lead Time / 逃逸缺陷 ｜ 运行：回退、HITL、Token + 人工成本"],
  ["proof-head", "如何度量并证明成果", "证明：不是局部效率，而是端到端有效交付"],
  ["proof-body", "同类任务、同一风险边界：试点前基线 vs. 试点后趋势\n业务价值｜工程质量｜自治健康｜人机成本  ←  Intent Contract + Evidence Bundle + Telemetry", "主指标：端到端 Lead Time ｜ 配套：C&A%、首次通过、返工、逃逸缺陷\n同类任务、同一风险边界：基线 vs. 趋势 + Contract / Evidence / Telemetry"],
  ["footer", "Agentic Agile｜以真实价值流证明 AI 转型，而非用代码生成率宣布成功", "Agentic Agile｜让每一个 SDLC 阶段更快、更准、更可控，并能证明结果"],
];

const slide = deck.slides.getItem(0);
for (const [name, before, after] of replacements) {
  const element = slide.shapes.items.find((item) => item.name === name);
  if (!element) throw new Error(`Missing named source element: ${name}`);
  element.text = after;
}

slide.speakerNotes.textFrame.setText(`
[Sources]
- Internal: Agentic Agile book, Chapters 2, 5, 9–17, 16, 25 and 26.
- Lead Time is the agreed end-to-end interval from customer request entering the value-stream boundary to external release.
- C&A% retains the enterprise's existing measurement definition and must be read with quality, risk and cost counter-metrics.

Presenter emphasis:
Read the four phase groups from left to right as eight SDLC stages. At every stage, IO defines or accepts value and risk; OA designs the control conditions; AS executes only within the active envelope. IWE Document Map and Code Map make source facts retrievable, while Basic/Agent Memory preserves task state and candidate learning. Only evidence-backed learning is promoted into reusable rules, tests or Skills. The management question is not whether coding accelerates, but whether the request-to-release Lead Time improves without degrading C&A%, quality, risk, or total cost.
`.trim());
slide.speakerNotes.setVisible(true);

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(OUT);
