# Portal 在线阅读发布设计

## 目标

把本仓库公开维护的 `book/` 章节树，一键复制并转换为 Portal 的本地静态阅读制品。访客无需登录即可浏览全文；Portal 运行时不从 GitHub、原书稿仓库或其他网络地址获取正文。

## 非目标

- 第一版不接入登录、购买、课程报名、学习进度、证书或学习证据。
- 第一版不在数据库中保存书籍正文。
- 第一版不实现全文搜索、评论、标注和跨设备阅读进度。
- 不改变 Portal 现有课程中心、课程学习和后台功能。

## 权威源与发布边界

权威源位于本仓库：

```text
book/
├── README.md
├── 00-书名.md
├── 01-*/README.md
├── 01-*/章节.md
└── assets/pic/*
```

私有发布脚本放在本仓库 `tools/`，目标 Portal 目录通过显式参数传入。脚本只允许写入 Portal 的书籍发布目录，不修改 Portal 的课程正文、数据库、用户数据和既有未提交文件。

默认发布目标：

```text
<portal>/public/books/agentic-agile/
├── manifest.json
├── chapters/
│   ├── 00-book.md
│   ├── 01-part/README.md
│   └── ...
└── assets/pic/*
```

发布目录是可删除、可重建的生成目录；Portal 前端只读取该目录，不把它当作人工维护源。

## 发布协议

`manifest.json` 是 Portal 的入口清单，至少包含：

```json
{
  "bookId": "agentic-agile",
  "title": "Agentic Agile智能体敏捷：从碳基协作到硅基自治",
  "version": "v3.1",
  "updatedAt": "2026-08-20",
  "chapters": [
    {
      "id": "00-book",
      "title": "书名",
      "path": "chapters/00-book.md",
      "order": 0
    }
  ]
}
```

章节 Markdown 中的图片路径统一转换为 Portal 静态根可访问的绝对路径，例如 `/books/agentic-agile/assets/pic/dunbar.jpeg`。脚本必须验证所有图片存在，避免发布后出现空白图像。

## Portal 阅读体验

新增公开路由：

```text
/reading
/reading/agentic-agile/:chapterId
```

导航在“课程中心”之后增加“在线阅读”。

`/reading` 展示书籍封面、简介、版本信息和章节目录；章节页提供：

- 章节标题与正文；
- 桌面端目录和移动端可展开目录；
- 上一章、下一章和返回目录；
- 复用现有 `MarkdownContent` 渲染 Markdown、GFM 表格、图片、代码块和 Mermaid；
- 不调用认证 API、不写数据库、不显示课程任务或学习进度控件。

第一版只有一本书，但 manifest 和路由保留 `bookId`，以后可以增加其他公开书籍而不重做阅读器。

## 一键发布流程

推荐命令：

```bash
python3 tools/publish_to_portal.py \
  --portal /Users/wanglijie/HappyLife/18-AI/Agentic-Agile/agentic-agile-portal
```

脚本执行顺序：

1. 读取 `book/`，按现有阅读顺序收集章节。
2. 校验章节唯一性、顺序和正文文件存在。
3. 校验并重写图片引用。
4. 在临时目录生成完整发布树和 manifest。
5. 校验临时制品内所有 manifest 路径和图片路径。
6. 原子替换 Portal 的 `public/books/agentic-agile/`。
7. 输出章节数、图片数、版本和目标目录。

Portal 侧不需要网络、不需要额外数据库迁移；构建时 Vite 会把 `public/books/` 原样复制到静态制品。

## 错误与安全边界

- 未指定 `--portal` 时终止，不猜测目标路径。
- 目标不是 Portal 根目录或目标目录越界时终止。
- 任一章节、图片或 manifest 引用缺失时终止，保留旧发布目录。
- 发布采用临时目录加原子 rename，避免半套内容被 Portal 读取。
- 不删除 Portal 目标目录之外的文件。
- 脚本不执行 Git push、部署、数据库写入或网络请求。

## 验收标准

### 发布脚本

- 从书稿仓库一条命令完成发布。
- Portal 目标目录包含 manifest、全部章节和全部图片。
- 重复执行得到相同目录结构和相同章节顺序。
- 删除或改名源章节后重新发布，旧目标章节不会残留。
- 图片缺失、章节重复、目标路径非法时 fail closed，旧制品不受破坏。

### Portal

- 未登录访客可以从导航进入“在线阅读”。
- 目录页可以打开第一章和任意章节。
- 章节正文中的标题、段落、列表、GFM 表格、图片、代码块和 Mermaid 正常显示。
- 上一章、下一章和移动端目录可用。
- 刷新深层章节 URL 不返回 404。
- 课程中心和现有登录课程流程回归通过。

### 验证

- 发布脚本单元测试覆盖 manifest、路径、图片、清理和失败保护。
- Portal TypeScript 构建通过。
- 现有测试通过。
- 至少完成桌面端和移动端浏览验收各一轮。

## 变更围栏

本次实现预计只涉及：

- 书稿仓库：`tools/publish_to_portal.py`、本设计文档；
- Portal：阅读路由、阅读页面/组件、公开书籍静态数据加载、导航、对应测试；
- Portal 生成目录：`public/books/agentic-agile/`。

不触碰 Portal 当前已有的课程内容迁移、数据库、后台、认证、支付和学习运行时变更。
