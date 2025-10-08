# 爬虫系统方案对比 🔄

## 概览

你现在有两套数据采集系统：

| 特性 | Node.js Web Scraper | Python ingest.py |
|------|---------------------|------------------|
| **语言** | JavaScript/Node.js | Python |
| **数据源类型** | 网页HTML爬取 | API数据采集 |
| **主要来源** | CDC网站、AAP网站等 | PubMed API、WHO API等 |
| **触发方式** | HTTP API + Cron | 命令行 + Cron |
| **部署方式** | Vercel/云端 | 服务器/本地 |
| **数据类型** | 文章内容、指南 | 论文元数据、统计指标 |
| **内容格式** | 完整文章（Markdown） | 结构化数据（JSON） |

---

## 🎯 推荐方案：整合使用

### 方案A：双系统并行（推荐）⭐

**适用场景：**
- 需要多种类型的数据
- 团队有Python和Node.js能力
- 想要最大化数据覆盖

**架构：**

```
┌─────────────────────────────────────────────────────────┐
│                    数据采集层                            │
├──────────────────────────┬──────────────────────────────┤
│  Node.js Web Scraper     │  Python ingest.py            │
│  - 网页内容              │  - API数据                   │
│  - CDC/AAP网站           │  - PubMed/WHO                │
│  - 完整文章              │  - 论文/统计                 │
│  - HTTP API触发          │  - 命令行运行                │
└──────────────────────────┴──────────────────────────────┘
                           ▼
            ┌──────────────────────────────┐
            │      Supabase 数据库         │
            ├──────────────────────────────┤
            │  • articles (网页内容)        │
            │  • kb_sources (所有来源)      │
            │  • kb_docs (API数据)          │
            │  • kb_indicators (统计指标)   │
            └──────────────────────────────┘
```

**Cron 配置：**
```yaml
# .github/workflows/scraper-cron.yml
on:
  schedule:
    # 网页爬虫 - 每天运行
    - cron: '0 2 * * *'

# .github/workflows/api-ingest-cron.yml
on:
  schedule:
    # API采集 - 每周运行（数据更新频率低）
    - cron: '0 3 * * 0'
```

---

### 方案B：Node.js为主，Python辅助

**做法：**
1. 保留 Node.js Web Scraper 作为主系统
2. 将 Python 脚本包装成 Node.js 可调用的服务
3. 通过 API 统一管理

**实现：**

创建 Node.js 包装器：

```javascript
// scripts/python-ingest-wrapper.js
const { spawn } = require('child_process');

async function runPythonIngest(sources = 'pubmed,who', limit = 200) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', [
      '../mombaby_ingest/ingest.py',
      '--sources', sources,
      '--limit', limit.toString()
    ]);
    
    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
      console.log(data.toString());
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Python script failed with code ${code}`));
      }
    });
  });
}

module.exports = { runPythonIngest };
```

添加 API 路由：

```typescript
// src/app/api/scraper/ingest-python/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 验证 API Key...
  
  const { runPythonIngest } = require('@/scripts/python-ingest-wrapper');
  
  const { sources, limit } = await request.json();
  
  try {
    const result = await runPythonIngest(sources, limit);
    return NextResponse.json({ success: true, output: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

### 方案C：统一为Node.js

**做法：**
将 Python 的 API 数据源用 Node.js 重写

**优点：**
- 单一技术栈
- 更易部署
- 统一管理

**缺点：**
- 需要重写现有 Python 代码
- Python 的数据处理库更强大

---

## 🛠️ 具体实施建议

### 推荐：方案A（双系统并行）

#### 步骤1：调整数据库表结构

在 Supabase 中添加 Python 脚本需要的表（如果还没有）：

```sql
-- 检查 kb_docs 表是否存在
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'kb_docs'
);

-- 如果不存在，创建它
-- 参考你的 schema.sql
```

#### 步骤2：设置两个独立的 Cron Job

**GitHub Actions 配置：**

文件1: `.github/workflows/scraper-web-cron.yml`（已有）
```yaml
name: Web Scraper Cron
on:
  schedule:
    - cron: '0 2 * * *'  # 每天爬取网页
```

文件2: `.github/workflows/scraper-api-cron.yml`（新建）
```yaml
name: API Data Ingest Cron
on:
  schedule:
    - cron: '0 3 * * 0'  # 每周日爬取API数据

jobs:
  ingest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          cd mombaby_ingest
          pip install -r requirements.txt
      
      - name: Run ingest
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
        run: |
          cd mombaby_ingest
          python ingest.py --sources pubmed,who,openfda,medlineplus --limit 200
```

#### 步骤3：整合监控

创建统一的统计脚本：

```javascript
// scripts/unified-stats.js
// 统计 Node.js 爬取的文章 + Python 采集的数据
```

---

## 📋 快速决策表

| 你的需求 | 推荐方案 |
|---------|---------|
| 我需要完整的文章内容 | **方案A** - 两者都用 |
| 我只需要研究数据 | 只用 Python |
| 我想要最简单的部署 | 只用 Node.js |
| 我有Python和Node.js团队 | **方案A** - 两者都用 |
| 我只有Node.js团队 | **方案C** - 统一为Node.js |

---

## 💡 我的建议

基于你的项目（母婴健康网站），我建议：

### ✅ 使用方案A（双系统并行）

**原因：**

1. **互补性强**
   - Node.js: 爬取教育性文章（给家长看）
   - Python: 采集科研数据（提供权威支持）

2. **数据丰富**
   - 文章内容 (Node.js) → 用户阅读
   - 研究数据 (Python) → 数据支持、引用

3. **各有优势**
   - Node.js: 与Next.js集成好，部署简单
   - Python: 医疗数据处理更成熟

4. **运行频率不同**
   - 网页内容：每天更新
   - API数据：每周更新即可

---

## 🚀 立即行动计划

### 第1步：保持现有系统
```bash
# Node.js Web Scraper 已经配置好了
# 继续使用它爬取网页内容
```

### 第2步：将 Python 脚本移到项目中
```bash
cd /Users/cathleenlin/Desktop/code/momaiagentweb/website
cp -r /Users/cathleenlin/Downloads/mombaby_ingest ./python-ingest
```

### 第3步：配置环境变量
```bash
# 在 python-ingest/.env 中添加
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

### 第4步：设置 Cron
```bash
# 添加 GitHub Actions workflow
# 或在服务器上设置 cron
```

### 第5步：测试
```bash
# 测试 Node.js 爬虫
npm run scrape:test

# 测试 Python 采集
cd python-ingest
python ingest.py --sources pubmed --limit 10
```

---

## 📊 预期结果

成功后，你将有：

- **网页内容**（每天）
  - CDC 育儿指南
  - AAP 睡眠建议
  - 健康指南文章
  
- **研究数据**（每周）
  - PubMed 相关论文
  - WHO 健康指标
  - FDA 药品信息

---

**结论：** 两个系统各有优势，建议并行使用！🎉

