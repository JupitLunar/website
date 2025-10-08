# 🚀 立即测试爬虫

一个命令就能从权威网站爬取数据并存入Supabase！

## 快速开始

### 1. 安装依赖（如果还没安装）

```bash
cd nextjs-project
npm install
```

这会安装：
- ✅ axios（HTTP请求）
- ✅ cheerio（HTML解析）
- ✅ @supabase/supabase-js（数据库）

### 2. 确保环境变量已配置

检查 `.env.local` 文件中有：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### 3. 运行测试

```bash
node scripts/test-scraper-full.js
```

## 🎯 这个脚本会做什么

1. **爬取CDC网站** - 婴儿营养指南
   - URL: https://www.cdc.gov/nutrition/infantandtoddlernutrition/

2. **爬取AAP网站** - 配方奶喂养指南  
   - URL: https://www.healthychildren.org

3. **自动去重** - 检查slug，不会重复插入

4. **存入Supabase**:
   - `kb_sources` 表 - 数据来源
   - `articles` 表 - 文章内容（status=draft）
   - `citations` 表 - 引用来源

## 📊 预期输出

```
╔════════════════════════════════════════╗
║   爬虫完整测试                         ║
╚════════════════════════════════════════╝

⏰ 开始时间: 2025-01-08 14:30:00

🔍 正在爬取 CDC 婴儿营养页面...
✅ 成功插入文章: Infant and Toddler Nutrition
   ID: uuid-here
   Slug: infant-and-toddler-nutrition
   内容长度: 2543 字符

🔍 正在爬取 AAP HealthyChildren 页面...
✅ 成功插入文章: Amount and Schedule of Baby Formula Feedings
   ID: uuid-here
   Slug: amount-and-schedule-of-baby-formula-feedings
   内容长度: 1876 字符

════════════════════════════════════════════════════════════
📊 测试结果摘要
════════════════════════════════════════════════════════════

总页面数: 2
成功: 2 ✅
跳过（已存在）: 0 ⏭️
失败: 0 ❌

新增文章:
  1. Infant and Toddler Nutrition
     Hub: feeding
     Slug: infant-and-toddler-nutrition
     ID: 550e8400-e29b-41d4-a716-446655440000
  2. Amount and Schedule of Baby Formula Feedings
     Hub: feeding
     Slug: amount-and-schedule-of-baby-formula-feedings
     ID: 550e8400-e29b-41d4-a716-446655440001

⏰ 结束时间: 2025-01-08 14:30:15

✅ 测试完成！

📋 下一步:
1. 运行 npm run scrape:review 审核内容
2. 在Supabase控制台查看 articles 表
3. 审核通过后将 status 改为 "published"
```

## 🔍 验证数据

### 方法1: Supabase控制台

1. 登录 https://app.supabase.com
2. 选择你的项目
3. 点击 "Table Editor"
4. 查看 `articles` 表

你应该能看到：
- status = 'draft'
- reviewed_by = 'Web Scraper Bot'
- 刚创建的2篇文章

### 方法2: 使用审核工具

```bash
npm run scrape:review
```

这会打开一个交互式界面，让你审核和发布文章。

### 方法3: SQL查询

在Supabase SQL Editor中运行：

```sql
-- 查看刚爬取的文章
SELECT 
  id, 
  title, 
  slug, 
  hub, 
  status, 
  created_at 
FROM articles 
WHERE reviewed_by = 'Web Scraper Bot'
ORDER BY created_at DESC;

-- 查看来源
SELECT * FROM kb_sources 
WHERE organization IN ('CDC', 'AAP');

-- 查看引用
SELECT 
  a.title as article_title,
  c.publisher,
  c.url
FROM citations c
JOIN articles a ON c.article_id = a.id
WHERE c.publisher IN ('CDC', 'AAP');
```

## 🔄 再次运行

如果再次运行脚本：

```bash
node scripts/test-scraper-full.js
```

输出会显示：

```
🔍 正在爬取 CDC 婴儿营养页面...
⏭️  内容已存在，跳过

🔍 正在爬取 AAP HealthyChildren 页面...
⏭️  内容已存在，跳过

总页面数: 2
成功: 0 ✅
跳过（已存在）: 2 ⏭️
失败: 0 ❌
```

✅ **确保不会重复插入！**

## 🎯 完整爬虫运行

如果测试成功，运行完整爬虫：

```bash
# 爬取所有配置的来源
npm run scrape

# 或通过API
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## 🐛 故障排除

### 问题: 找不到模块

```bash
Error: Cannot find module 'axios'
```

**解决:**
```bash
npm install
```

### 问题: 环境变量缺失

```bash
❌ 缺少环境变量
```

**解决:**
检查 `.env.local` 文件是否存在并包含正确的Supabase配置。

### 问题: 内容太短

```bash
⚠️  内容太短，可能爬取失败
```

**原因:** 
- 网站结构改变
- CSS选择器不正确
- 网络问题

**解决:**
检查 `scraper-config.js` 中的CSS选择器。

### 问题: 插入失败

```bash
❌ 插入文章失败: duplicate key value
```

**原因:** slug已存在但检查逻辑未生效

**解决:**
脚本会自动跳过重复的slug。如果仍有问题，手动删除重复记录。

## 📝 脚本特点

✅ **自动去重** - 通过slug检查，不会重复插入  
✅ **来源管理** - 自动创建或复用数据来源  
✅ **内容验证** - 检查内容长度和质量  
✅ **礼貌爬取** - 请求之间有延迟  
✅ **错误处理** - 详细的错误信息  
✅ **Draft状态** - 所有内容初始为draft，需要审核  

## 🚀 开始测试！

运行这个命令开始：

```bash
cd nextjs-project && node scripts/test-scraper-full.js
```

预计用时：10-30秒

---

**创建时间:** 2025-01-08  
**测试通过:** ✅

