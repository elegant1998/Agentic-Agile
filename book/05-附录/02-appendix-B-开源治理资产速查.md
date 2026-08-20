# 附录 B｜开源治理资产速查

Agentic Agile 3-4-3 开源仓库提供模板、脚本、参考文档、统一 CLI、遥测仪表板和示例。资产会持续演进，本附录只说明稳定的能力分类，不把某个版本的文件数量写成长期承诺；实际文件、参数和兼容性以当前仓库为准。

### 核心模板

| 资产 | 用途 |
|---|---|
| Template_Intent_Graph.md | 全局意图与知识导航 |
| Template_Intent_Contract.md / yaml | 单任务契约 |
| Template_Constraint_Matrix.md | 人类可读约束 |
| Template_Constraints.yaml | 可执行约束 |
| Template_Evidence_Bundle.md / yaml | 证据包 |
| Template_Verification_Plan.yaml | 风险驱动的验证计划 |
| Template_Work_Graph.yaml | DAG 工作图 |
| Template_Tools_Manifest.yaml | 工具和权限 |
| Template_Protocol.yaml | 跨模块治理协议 |
| Template_Loop_Memory.yaml | 跨周期状态与教训 |
| Template_Change_Envelope.yaml | 本次变更允许触及的边界 |
| Template_Release_Manifest.yaml | 发布制品、证据和回滚事实绑定 |
| Template_AI_Coding_Guide.md | AI 编码红线与规范 |

### 统一 CLI

```bash
PYTHON_BIN="$(bash scripts/ensure_py_env.sh)"
"$PYTHON_BIN" scripts/cli.py list
"$PYTHON_BIN" scripts/cli.py recon --project-dir .
"$PYTHON_BIN" scripts/cli.py change verify --task T-001 --project-dir .
"$PYTHON_BIN" scripts/cli.py evidence finalize --task T-001 --project-dir .
"$PYTHON_BIN" scripts/cli.py release --help
```

以上是 macOS/Linux 示例；Windows 可直接运行 `_bootstrap.py --print-python` 并使用它返回的解释器路径。第一次自举后应稳定复用项目专用 Python，不要假定所有机器都把解释器暴露为同一个命令名。CLI 是跨 AI 工具的稳定入口，不依赖某个 IDE、聊天产品或智能体平台。具体子命令和参数以 `scripts/cli.py --help` 及仓库当前版本为准。

---
