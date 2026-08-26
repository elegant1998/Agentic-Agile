import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = process.env.FINAL_PPTX;
const TMP = process.env.TMP_DIR;

async function writeBlob(path, blob) {
  await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
}

const C = {
  ink: "#0B1220",
  navy: "#10243E",
  slate: "#425466",
  muted: "#6E7E92",
  rule: "#D8E0EA",
  panel: "#F4F7FA",
  blue: "#1677FF",
  cyan: "#11B9D6",
  paleBlue: "#EAF4FF",
  green: "#16835C",
  paleGreen: "#ECF8F3",
  orange: "#B96800",
  paleOrange: "#FFF4E8",
};

function addText(slide, name, text, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    typeface: "Helvetica Neue",
    fontSize: style.fontSize ?? 18,
    color: style.color ?? C.ink,
    bold: style.bold ?? false,
    alignment: style.alignment ?? "left",
    verticalAlignment: style.verticalAlignment ?? "top",
    autoFit: "shrinkText",
    insets: style.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function addBox(slide, name, position, fill, line = C.rule, radius = 10) {
  return slide.shapes.add({
    geometry: "roundRect",
    name,
    position,
    fill,
    line: { style: "solid", fill: line, width: 1 },
    borderRadius: radius,
  });
}

function addRail(slide, y, label, body, accent) {
  addBox(slide, `rail-${label}`, { left: 62, top: y, width: 1156, height: 38 }, "#FFFFFF", C.rule, 7);
  addBox(slide, `rail-chip-${label}`, { left: 62, top: y, width: 112, height: 38 }, accent, accent, 7);
  addText(slide, `rail-label-${label}`, label, { left: 74, top: y + 8, width: 90, height: 22 }, {
    fontSize: 16, bold: true, color: "#FFFFFF", alignment: "center",
  });
  addText(slide, `rail-body-${label}`, body, { left: 192, top: y + 7, width: 1000, height: 24 }, {
    fontSize: 16, color: C.slate,
  });
}

async function main() {
  if (!OUT || !TMP) throw new Error("FINAL_PPTX and TMP_DIR are required");
  const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  const slide = deck.slides.add();
  slide.background.fill = "#FFFFFF";

  // Header
  addText(slide, "title", "用一条产品研发价值流，兑现 AI 转型的端到端提效", { left: 62, top: 28, width: 1156, height: 42 }, {
    fontSize: 34, bold: true, color: C.ink,
  });
  addText(slide, "subtitle", "不是部署更多 Agent，而是让意图、受控执行、证据与学习在同一条价值流上闭环。", { left: 64, top: 76, width: 1040, height: 24 }, {
    fontSize: 18, color: C.slate,
  });
  addBox(slide, "thesis", { left: 62, top: 112, width: 1156, height: 34 }, C.navy, C.navy, 6);
  addText(slide, "thesis-text", "试点目标：以一条真实产品研发价值流为单位，建立可签署、可运行、可验证、可复用的 AI 原生交付能力。", { left: 82, top: 120, width: 1115, height: 20 }, {
    fontSize: 16, color: "#FFFFFF", bold: true,
  });

  // Flow arrows are created before their nodes so they remain behind every label.
  const arrowY = 230;
  [[338, 370], [616, 648], [894, 926]].forEach(([left, end], i) => {
    slide.shapes.add({
      geometry: "line",
      name: `flow-arrow-${i + 1}`,
      position: { left, top: arrowY, width: end - left, height: 0 },
      fill: "none",
      line: { style: "solid", fill: C.blue, width: 2 },
      head: { type: "arrow", width: "sm", length: "sm" },
    });
  });

  // Four-phase value-stream pilot.
  const phases = [
    { x: 62, accent: C.orange, pale: C.paleOrange, time: "0–2 周", title: "选对价值流", body: "业务结果 + 关键瓶颈\n基线、风险与范围" },
    { x: 340, accent: C.blue, pale: C.paleBlue, time: "3–5 周", title: "跑通受控闭环", body: "Intent Contract + SCOPE-V\nHarness、Prove、Evidence" },
    { x: 618, accent: C.cyan, pale: "#EAFBFD", time: "6–9 周", title: "让上下文与经验复利", body: "IWE 文档地图 + Code Map（双地图）\nEvidence → Basic / Agent Memory\n验证晋升 → 规则 / 测试 / Skill" },
    { x: 896, accent: C.green, pale: C.paleGreen, time: "10–12 周", title: "扩大可复制能力", body: "标准、技能与授权扩展\nTelemetry 支持扩大或收缩" },
  ];
  for (const p of phases) {
    addBox(slide, `phase-${p.title}`, { left: p.x, top: 164, width: 258, height: 132 }, p.pale, p.accent, 12);
    addText(slide, `phase-time-${p.title}`, p.time, { left: p.x + 18, top: 177, width: 74, height: 19 }, {
      fontSize: 15, bold: true, color: p.accent,
    });
    addText(slide, `phase-title-${p.title}`, p.title, { left: p.x + 18, top: 204, width: 220, height: 27 }, {
      fontSize: 22, bold: true, color: C.ink,
    });
    addText(slide, `phase-body-${p.title}`, p.body, { left: p.x + 18, top: 238, width: 220, height: 48 }, {
      fontSize: 14.5, color: C.slate,
    });
  }

  // Four-dimensional transformation rails
  addText(slide, "four-dim-title", "四维必须同时改变，但每一步只改造本轮闭环所需的最小部分", { left: 62, top: 312, width: 900, height: 24 }, {
    fontSize: 20, bold: true, color: C.ink,
  });
  addRail(slide, 344, "人员", "IO / OA / AS：人从重复执行转向意图定义、控制设计、异常裁决与责任签署。", C.orange);
  addRail(slide, 387, "组织", "围绕价值流形成最小责任单元；决策权前移，越界、冲突与不可逆行动有明确去处。", C.blue);
  addRail(slide, 430, "流程", "SCOPE-V：机器快内环持续执行、验证与修复；人类责任外环负责边界、例外、发布与扩大。", C.cyan);
  addRail(slide, 473, "工具", "Context + Orchestration + Harness + Evidence + Telemetry：把规则、状态、权限和事实嵌入日常工作。", C.green);

  // Bottom decision-and-proof area
  addBox(slide, "outcome-panel", { left: 62, top: 532, width: 544, height: 128 }, C.panel, C.rule, 10);
  addText(slide, "outcome-head", "将取得什么成果", { left: 84, top: 548, width: 190, height: 23 }, { fontSize: 19, bold: true, color: C.ink });
  addText(slide, "outcome-body", "端到端周期缩短  ·  首次通过率提升  ·  返工与等待下降\n人类判断集中到价值与风险节点  ·  可复用上下文、规则、测试与 Skill 持续累积", { left: 84, top: 579, width: 490, height: 57 }, {
    fontSize: 16, color: C.slate,
  });

  addBox(slide, "proof-panel", { left: 632, top: 532, width: 586, height: 128 }, "#F7FBFF", C.blue, 10);
  addText(slide, "proof-head", "如何度量并证明成果", { left: 654, top: 548, width: 260, height: 23 }, { fontSize: 19, bold: true, color: C.ink });
  addText(slide, "proof-body", "同类任务、同一风险边界：试点前基线 vs. 试点后趋势\n业务价值｜工程质量｜自治健康｜人机成本  ←  Intent Contract + Evidence Bundle + Telemetry", { left: 654, top: 579, width: 538, height: 57 }, {
    fontSize: 16, color: C.slate,
  });

  addText(slide, "footer", "Agentic Agile｜以真实价值流证明 AI 转型，而非用代码生成率宣布成功", { left: 62, top: 681, width: 1000, height: 17 }, {
    fontSize: 12, color: C.muted,
  });

  slide.speakerNotes.textFrame.setText(`
[Sources]
- Internal: Agentic Agile book, Chapters 2, 5, 16, 25, 26.
- This slide shows a recommended 12-week pilot sequence. It does not claim guaranteed numerical outcomes.

Presenter emphasis:
Start with one product value stream and a business result, not an enterprise platform. The double-map structure makes current facts available: IWE holds documented intent, rules and decisions; Code Map locates the actual implementation and tests. Basic Memory preserves task state and candidate learning, while promotion gates ensure only evidence-backed knowledge becomes reusable organizational assets. The scale decision must use comparable baselines plus task-level Evidence and cross-task Telemetry.
`.trim());
  slide.speakerNotes.setVisible(true);

  await fs.mkdir(TMP, { recursive: true });
  await writeBlob(`${TMP}/slide-01.png`, await deck.export({ slide, format: "png", scale: 2 }));
  await fs.writeFile(`${TMP}/slide-01.layout.json`, await (await slide.export({ format: "layout" })).text());
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(OUT);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
