# 第二十五章｜Knowledge Engineering：让上下文与知识成为组织资产

当 Agent 进入既有系统，最危险的不是“找不到文档”，而是找到了过期、越权或不适用的内容，却把它当成事实。Knowledge Engineering 解决的是知识如何被发现、裁剪、验证、授权和失效，而不是简单建设一个 RAG 或向量数据库。

## 25.1 知识、上下文和代码地图

一项任务至少需要三种视图：

| 视图 | 回答的问题 | 典型对象 |
| --- | --- | --- |
| Document Map | 为什么这样做，什么才算完成 | 需求、规则、AC、ADR、约束 |
| Code Map | 在哪里实现，改动影响什么 | 仓库、模块、符号、调用、测试 |
| Trace Link | 需求、代码和测试是否闭环 | Requirement ID、Symbol ID、Test ID |

Document Map 不应猜测代码，Code Map 也不应臆造业务意图。统一 ID 把二者连接起来：

```yaml
requirement_id: REQ-PAY-017
acceptance_criteria: [AC-PAY-017-01]
implemented_by: [payments.refund_service.create_refund]
verified_by: [tests/refund/test_refund_window.py]
```

## 25.2 五层知识结构

```text
L0 事实源：代码、规则、运行记录、正式制度
L1 结构索引：模块、符号、接口、依赖和链接
L2 语义知识：术语、决策、模式、事故和边界
L3 任务上下文：本次任务实际允许读取的切片
L4 验证记忆：经过证据支持、带范围和有效期的组织经验
```

索引可以重建，事实源必须保留；语义知识可以帮助检索，但不能越过签署和证据成为正式规则。高相似度不代表最新、适用或有权访问。

## 25.3 知识条目的最低身份

每条进入 Agent 上下文的知识至少要有：来源、Owner、适用范围、版本、创建时间、有效期、可信状态、引用关系和权限标签。状态至少区分 `candidate`、`verified`、`superseded`、`expired` 和 `disputed`。

```yaml
knowledge_id: RULE-PAY-017
source: governance/decisions/ADR-042.md
scope: payment/refund
version: 3
status: verified
owner: finance-platform
expires_at: 2027-01-01
verified_by: EB-T-137
```

没有来源和适用范围的“经验”，只能作为线索；没有证据和责任人的模型总结，不能晋升为组织事实。

## 25.4 从检索结果到 Context Slice

Agent 不应获得全部仓库、全部聊天记录和全部历史决策。OA 应根据任务契约裁剪：

1. 先读取 Goal、Non-goals、AC 和约束；
2. 根据影响图找到相关模块、接口和测试；
3. 只注入适用版本和授权范围内的知识；
4. 对冲突、过期和 UNKNOWN 显式标记；
5. 在任务证据中记录实际使用过的上下文来源。

上下文越大不代表理解越深。无关内容会稀释关键边界，过期内容会把历史假设伪装成当前规则，越权内容则可能造成数据泄露。

## 25.5 知识如何进入 SCOPE-V

- Specify 使用 Document Map 澄清术语、历史决策和非目标；
- Constrain 检查读取权限、版本范围和敏感信息；
- Orchestrate 为不同节点分配不同 Context Slice；
- Prove 用代码、测试和运行结果验证知识是否仍然适用；
- Evolve 将经过验证的变化标记为候选知识；
- Verify 决定哪些知识可以进入当前裁决依据；
- Telemetry 观察过期、冲突、错误召回和返工模式。

Knowledge Engineering 是 SCOPE-V 的基础设施，不是第五个动态工件，也不能绕过契约和 Verify 直接给 Agent 授权。

## 25.6 既有系统 Recon：先确认事实，再提出改变

对百万行既有系统，不需要先解释全部代码，也不能因为检索没有命中就断言“没有影响”。开始业务变更前，应先完成一次面向任务的 Recon，把已知事实与未知边界分开：

| Recon 产物 | 要回答的问题 |
| --- | --- |
| Baseline | 当前行为、版本、测试和运行信号是什么？ |
| Preserve | 哪些已观察行为在本次变更中不得破坏？ |
| Unknown | 哪些依赖、数据语义或例外尚未确认？ |
| Change Envelope | 本次允许修改哪些模块、接口、配置和数据？ |

影响图只根据已验证的代码、测试、配置和运行事实建立。对关键旧行为，先用 Characterization Test 固定观察结果；对尚未确认的依赖保留 UNKNOWN，并在契约中限制发布范围。Agent 可以据此提出改动和补充调查，不能把推测写成系统事实。

这就是局部治理岛：只为一项真实变化建立足够可靠的事实面。它的价值不在于画出一张“完整系统地图”，而在于下一项变化能够少依赖猜测，并且能说明哪些行为已知、哪些仍未知。

## 25.7 常见失败

- 把向量检索命中当作事实正确；
- 把全部聊天记录直接注入上下文；
- 只保存摘要，不保存来源和版本；
- 代码地图变化后仍使用旧索引；
- 把局部经验无条件推广到全组织；
- 没有权限标签，导致可检索等于可见；
- 知识进入图谱后没有失效、撤回和冲突处理。

## 25.8 本章小结

可信知识不是“存得更多”，而是来源清楚、范围明确、可按任务裁剪、经过证据验证并能够失效。Knowledge Engineering 让 Agent 知道该看什么、为什么相信、哪些内容不能使用。

**本章最小实践**：为一个既有系统任务建立 Document Map、Code Map、Trace Link 和 Context Slice，并为每条关键知识补齐来源、版本、Owner 和状态。
