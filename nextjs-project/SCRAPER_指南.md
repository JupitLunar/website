# 全球母婴内容爬虫 - 完整指南

> **最后更新**: 2024-10-10  
> **版本**: 2.0 优化版

---

## 📚 目录

1. [快速开始](#快速开始)
2. [系统架构](#系统架构)
3. [配置说明](#配置说明)
4. [使用方法](#使用方法)
5. [数据来源](#数据来源)
6. [工作原理](#工作原理)
7. [常见问题](#常见问题)
8. [维护指南](#维护指南)

---

## 🚀 快速开始

### 第一次使用

```bash
# 1. 进入项目目录
cd /Users/cathleenlin/Desktop/code/momaiagentweb/website/nextjs-project

# 2. 确保环境变量配置正确
# 检查 .env.local 文件中有：
# NEXT_PUBLIC_SUPABASE_URL=xxx
# SUPABASE_SERVICE_ROLE_KEY=xxx

# 3. 运行快速测试（推荐）
node scripts/test-scraper-quick.js

# 4. 如果测试成功，运行完整抓取
node scripts/global-auto-scraper.js
```

### 常用命令

```bash
# 快速测试（抓取少量文章）
node scripts/test-scraper-quick.js

# 完整运行（最多500篇）
node scripts/global-auto-scraper.js

# 调试模式（查看详细信息）
DEBUG=true node scripts/test-scraper-quick.js

# 查看统计数据
node scripts/scraper-stats.js

# 审核已抓取内容
node scripts/review-scraped-content.js
```

---

## 🏗️ 系统架构

### 核心文件结构

```
nextjs-project/
├── scripts/
│   ├── global-auto-scraper.js      # 主程序 - 全球爬虫
│   ├── test-scraper-quick.js       # 快速测试版
│   ├── scraper-utils.js            # 共享工具模块 ⭐新增
│   ├── global-sources-config.js    # 全球18个来源配置
│   ├── scraper-config.js           # 基础配置
│   ├── scraper-stats.js            # 统计分析工具
│   └── review-scraped-content.js   # 内容审核工具
├── data/
│   └── scraped/                    # 抓取的原始数据
└── SCRAPER_指南.md                  # 本文档
```

### 数据流程

```
1. 发现文章
   ↓
2. 过滤已存在
   ↓
3. 抓取内容
   ↓
4. 提取&验证质量
   ↓
5. 保存到数据库
   ↓
6. 生成统计报告
```

---

## ⚙️ 配置说明

### 主要配置项

**文件**: `scripts/global-auto-scraper.js`

```javascript
const CONFIG = {
  delayBetweenRequests: 1500,  // 请求延迟（毫秒）
  delayBetweenArticles: 2500,  // 文章间延迟（毫秒）
  maxArticlesPerRun: 500,      // 每次最多抓取数量
  minContentLength: 300,       // 最少字符数
  maxContentLength: 50000,     // 最多字符数
  minParagraphs: 3,            // 最少段落数
  debugMode: false,            // 调试模式
  targetRegions: []            // 指定地区（空=全部）
};
```

### 地区映射

由于数据库只支持 `'US'`, `'CA'`, `'Global'` 三个地区值，系统自动映射：

| 来源地区 | 数据库地区 |
|---------|-----------|
| US      | US        |
| CA      | CA        |
| UK      | Global    |
| AU      | Global    |
| EU      | Global    |
| 其他    | Global    |

### 环境变量

**文件**: `.env.local`

```env
# Supabase 配置（必需）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 调试模式（可选）
DEBUG=true
```

---

## 📖 使用方法

### 方法一：快速测试

**适用场景**: 第一次使用、测试配置、验证功能

```bash
# 基础测试
node scripts/test-scraper-quick.js

# 调试模式
DEBUG=true node scripts/test-scraper-quick.js
```

**特点**:
- ✅ 快速运行（1-2分钟）
- ✅ 抓取少量文章
- ✅ 适合测试

### 方法二：完整运行

**适用场景**: 定期更新、批量抓取

```bash
node scripts/global-auto-scraper.js
```

**特点**:
- ✅ 最多抓取500篇
- ✅ 全面覆盖18个来源
- ✅ 自动去重
- ⏱️ 运行时间：30-60分钟

### 方法三：指定地区

**场景**: 只需要特定地区的内容

```javascript
// 编辑 global-auto-scraper.js
const CONFIG = {
  // ... 其他配置
  targetRegions: ['US', 'CA']  // 只抓取美国和加拿大
};
```

### 方法四：定时任务

**场景**: 每周自动更新

```bash
# 添加到 crontab
# 每周日凌晨运行
0 0 * * 0 cd /path/to/nextjs-project && node scripts/global-auto-scraper.js >> /tmp/scraper.log 2>&1
```

---

## 🌍 数据来源

### 全球18个权威网站

#### 美国 (6个)
1. **American Academy of Pediatrics (AAP)** - 等级A
   - 网址: healthychildren.org
   - 内容: 喂养、睡眠、母乳喂养、护理

2. **KidsHealth (Nemours)** - 等级A
   - 网址: kidshealth.org
   - 内容: 新生儿护理、父母指南

3. **Mayo Clinic** - 等级A
   - 网址: mayoclinic.org
   - 内容: 婴幼儿健康

4. **CDC** - 等级A
   - 网址: cdc.gov
   - 内容: 婴幼儿营养

5. **Cleveland Clinic** - 等级A
   - 网址: clevelandclinic.org
   - 内容: 婴儿健康

6. **Stanford Children's Health** - 等级A
   - 网址: stanfordchildrens.org
   - 内容: 儿童健康

#### 英国 (2个)
7. **NHS** - 等级A
8. **NHS Start4Life** - 等级A

#### 加拿大 (2个)
9. **Health Canada** - 等级A
10. **Canadian Paediatric Society** - 等级A

#### 澳大利亚 (2个)
11. **Raising Children Network** - 等级A
12. **Pregnancy Birth & Baby** - 等级A

#### 其他 (6个)
13. **Plunket** (新西兰) - 等级A
14. **HealthHub** (新加坡) - 等级A
15. **WHO Europe** - 等级A
16. **WHO Global** - 等级A
17. **UNICEF** - 等级A
18. **La Leche League International** - 等级A

### 内容类型

- 母乳喂养指南
- 配方奶喂养
- 固体食物引入
- 婴儿睡眠安全
- 发育里程碑
- 健康与安全
- 日常护理

---

## 🔧 工作原理

### 1. 文章发现阶段

```
遍历每个来源的分类页面
  ↓
提取所有文章链接
  ↓
应用过滤规则（排除导航、广告等）
  ↓
生成待抓取列表
```

**排除模式**:
- 默认页面 (`default.aspx`)
- 查找医生页面
- 播客、视频
- 网站地图
- 搜索结果

### 2. 去重检查

**双重检查机制**:

```javascript
// 检查 1: URL 是否已存在
SELECT id FROM articles WHERE license LIKE '%{url}%'

// 检查 2: 标题/Slug 是否重复
SELECT id FROM articles WHERE slug = '{generated_slug}'
```

### 3. 内容提取（智能算法）

#### 标题提取
尝试多种选择器，按优先级：
1. `<h1>`
2. `.title h1`
3. `.article-title`
4. `meta[property="og:title"]`
5. `<title>`

#### 内容提取
多层策略：

**策略1**: 查找主要内容容器
```javascript
const contentSelectors = [
  'article',
  '.article-content',
  '.post-content',
  'main',
  '#content'
];
```

**策略2**: 提取文本元素
- 段落 `<p>`
- 列表项 `<li>`
- 表格单元格 `<td>`
- 引用块 `<blockquote>`

**过滤规则**:
- ✅ 段落长度：30-2000字符
- ✅ 链接密度：< 30%
- ✅ 去重复段落

### 4. 质量验证

**验证标准**:

| 项目 | 最小值 | 最大值 |
|------|--------|--------|
| 标题长度 | 6字符 | - |
| 内容长度 | 300字符 | 50,000字符 |
| 段落数 | 3段 | - |

**失败原因统计**:
- 缺少标题
- 内容太短
- 内容太长
- 段落太少

### 5. 数据保存

**保存到数据库**:

```sql
-- 文章表
INSERT INTO articles (
  slug, type, hub, lang, title, 
  one_liner, body_md, region, 
  keywords, status
) VALUES (...)

-- 引用表
INSERT INTO citations (
  article_id, title, url, 
  publisher, date
) VALUES (...)
```

### 6. 错误处理

**重试机制**:
- HTTP 请求失败：重试3次
- 每次重试延迟递增（1s, 2s, 3s）
- 404错误不重试

**日志记录**:
- ✅ 成功保存
- ⏭️ 跳过（已存在）
- ❌ 失败（含原因）

---

## ❓ 常见问题

### Q1: 为什么成功率只有7-10%？

**A**: 这是正常的，主要原因：

1. **60-70% 已存在** - 去重机制工作正常
2. **20-30% 非文章页** - 目录页、导航页
3. **10% 内容质量不足** - 太短、缺标题、格式问题

**改进方法**:
```javascript
// 降低标准
minContentLength: 200,  // 从300降到200
minParagraphs: 2,       // 从3降到2
```

### Q2: 如何查看失败原因？

**A**: 启用调试模式

```bash
DEBUG=true node scripts/test-scraper-quick.js
```

输出示例：
```
📌 内容质量不足:
   - 内容太短: 245 < 300 字符
   - 段落太少: 2 < 3 段
```

### Q3: 抓取速度太慢？

**A**: 调整延迟设置

```javascript
const CONFIG = {
  delayBetweenRequests: 1000,  // 从1500降到1000
  delayBetweenArticles: 1500,  // 从2500降到1500
};
```

⚠️ **警告**: 太快可能被网站封禁！

### Q4: 如何只抓取新内容？

**A**: 系统已自动去重，无需额外配置。每次运行会：
1. 检查URL是否存在
2. 检查标题是否重复
3. 只抓取新文章

### Q5: 数据保存在哪里？

**A**: 两个位置

1. **数据库** (Supabase):
   - `articles` 表 - 文章内容
   - `citations` 表 - 来源引用

2. **本地文件** (备份):
   - `data/scraped/*.json` - 原始HTML和元数据

### Q6: 如何修改数据库 region 限制？

**A**: 修改数据库 schema

```sql
-- 当前限制
CHECK (region IN ('US', 'CA', 'Global'))

-- 修改为支持更多地区
ALTER TABLE articles 
DROP CONSTRAINT articles_region_check;

ALTER TABLE articles 
ADD CONSTRAINT articles_region_check 
CHECK (region IN ('US', 'CA', 'UK', 'AU', 'EU', 'Global'));
```

### Q7: 如何清理旧数据？

**A**: 使用 SQL 删除

```sql
-- 删除某个来源的所有文章
DELETE FROM articles 
WHERE license LIKE '%healthychildren.org%';

-- 删除草稿状态的文章
DELETE FROM articles 
WHERE status = 'draft';

-- 删除超过1年的文章
DELETE FROM articles 
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## 🛠️ 维护指南

### 日常维护

#### 每周任务
```bash
# 1. 运行爬虫更新内容
node scripts/global-auto-scraper.js

# 2. 查看统计数据
node scripts/scraper-stats.js

# 3. 审核新内容质量
node scripts/review-scraped-content.js
```

#### 每月任务
```bash
# 1. 清理临时文件
rm -rf data/scraped/*.json

# 2. 检查数据库大小
# 在 Supabase Dashboard 查看

# 3. 更新来源配置（如有新增）
# 编辑 scripts/global-sources-config.js
```

### 添加新来源

**步骤**:

1. 编辑 `scripts/global-sources-config.js`

```javascript
GLOBAL_SOURCES.US.NEW_SOURCE = {
  name: '新来源名称',
  organization: '组织名',
  baseUrl: 'https://example.com',
  region: 'US',
  grade: 'A',
  language: 'en',
  categories: [
    '/path/to/category/'
  ],
  linkPattern: /\/article\/[^\/]+\.html$/
};
```

2. 测试新来源

```bash
# 修改 targetRegions 只测试新来源
DEBUG=true node scripts/test-scraper-quick.js
```

3. 验证数据质量

```bash
# 查看抓取的文章
node scripts/review-scraped-content.js
```

### 性能优化

#### 提升抓取速度
```javascript
// 减少延迟（小心被封禁）
delayBetweenRequests: 1000,

// 增加并发（需改代码）
// 暂不支持，建议分批运行
```

#### 提升成功率
```javascript
// 放宽内容要求
minContentLength: 200,
minParagraphs: 2,

// 扩展内容选择器
// 编辑 scraper-utils.js
```

#### 减少数据库压力
```javascript
// 分批运行
maxArticlesPerRun: 100,  // 从500降到100

// 指定地区
targetRegions: ['US'],   // 一次只抓一个地区
```

### 故障排查

#### 问题1: 无法连接数据库
```bash
# 检查环境变量
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# 测试连接
node scripts/test-connection.js
```

#### 问题2: 请求被拒绝
```
解决方法:
1. 增加延迟时间
2. 更换 User-Agent
3. 使用代理（如需要）
```

#### 问题3: 内存不足
```bash
# 增加 Node.js 内存限制
node --max-old-space-size=4096 scripts/global-auto-scraper.js
```

#### 问题4: 抓取的内容乱码
```javascript
// 检查编码设置
// 在 scraper-utils.js 中添加
const response = await axios.get(url, {
  responseType: 'arraybuffer',
  transformResponse: [data => {
    return iconv.decode(data, 'utf-8');
  }]
});
```

### 日志管理

#### 保存运行日志
```bash
# 输出到文件
node scripts/global-auto-scraper.js > logs/scraper-$(date +%Y%m%d).log 2>&1

# 同时显示和保存
node scripts/global-auto-scraper.js 2>&1 | tee logs/scraper-$(date +%Y%m%d).log
```

#### 分析日志
```bash
# 统计成功数
grep "已保存" scraper.log | wc -l

# 统计失败数
grep "失败" scraper.log | wc -l

# 查看失败原因
grep "内容质量不足" scraper.log
```

---

## 📊 统计数据

### 当前状态（截至2024-10-10）

| 指标 | 数值 |
|------|------|
| 支持来源 | 18个 |
| 发现文章 | ~400篇/次 |
| 成功抓取 | ~16篇/次 |
| 平均成功率 | 7-10% |
| 平均运行时间 | 5-10分钟（测试）/ 30-60分钟（完整） |
| 数据库文章总数 | 查看数据库 |

### 性能指标

| 操作 | 平均耗时 |
|------|---------|
| 发现文章 | 30-60秒 |
| 去重检查 | 10-20秒 |
| 抓取单篇文章 | 2-3秒 |
| 保存到数据库 | 0.5-1秒 |

---

## 🔄 版本历史

### v2.0 (2024-10-10)
- ✅ 创建共享工具模块 `scraper-utils.js`
- ✅ 优化内容提取算法（智能标题、多层内容识别）
- ✅ 增强去重逻辑（URL + 标题双重检查）
- ✅ 修复 region 映射问题（UK/AU/EU → Global）
- ✅ 提升最大抓取量（100 → 500篇）
- ✅ 删除4个旧版本脚本
- ✅ 删除15个旧文档
- ✅ 统一文档（本指南）

### v1.x (2024-10-07)
- 基础爬虫功能
- 支持美国来源
- 简单内容提取

---

## 📞 联系支持

如有问题，请：
1. 查看本文档的[常见问题](#常见问题)部分
2. 启用调试模式查看详细信息
3. 查看日志文件分析错误

---

## 📄 许可证

本工具仅用于从公开可访问的权威健康网站收集教育性内容。
请遵守各网站的使用条款和 robots.txt 规则。

---

**文档结束** - 最后更新：2024-10-10

