# Insights自动生成工作流程指南

## 📋 概述

系统每天自动生成母婴相关的Insights文章并更新到数据库。生成的文章会显示在 `/insight` 页面，与权威文章完全分离。

## 🎯 工作流程

```
每天UTC 3点自动运行
    ↓
查找数据库中不存在的topic（从50+主题列表中）
    ↓
选择最多3个缺失主题
    ↓
对每个主题：
  1. 检查是否已存在（去重）
  2. 使用OpenAI生成文章
  3. 验证内容质量
  4. 插入数据库（article_source: 'ai_generated', status: 'published'）
    ↓
文章自动出现在 /insight 页面
```

## 📄 页面结构

### Insights列表页
- **路径**: `/insight`
- **URL**: `https://www.momaiagent.com/insight`
- **功能**: 显示所有AI生成的Insights文章
- **文件**: `src/app/insight/page.tsx`
- **设计**: 优雅的premium-card卡片式布局

### Insight文章详情页
- **路径**: `/insight/[slug]`
- **URL**: `https://www.momaiagent.com/insight/[slug]`
- **功能**: 显示单篇Insight文章
- **文件**: `src/app/insight/[slug]/page.tsx`
- **设计**: 简洁优雅的阅读体验

### 重定向
- `/blog` → `/insight` (永久重定向)
- `/blog/[slug]` → `/insight/[slug]` (永久重定向)

## 🔍 文章分类

### 权威文章 (Authoritative)
- **来源**: 从权威机构爬取的文章（CDC, AAP, WHO等）
- **显示位置**: 
  - `/latest-articles` - 最新文章列表
  - `/hub/[hub-slug]` - 各内容中心
  - `/[slug]` - 文章详情页
- **标记**: `article_source = 'authoritative'`

### AI生成Insights (AI-Generated)
- **来源**: 通过OpenAI自动生成的文章
- **显示位置**:
  - `/insight` - Insights列表页
  - `/insight/[slug]` - Insight文章详情页
  - Header导航中的"Insights"链接
- **标记**: `article_source = 'ai_generated'`
- **设计**: 优雅的premium-card样式，与权威文章区分

## 🚀 使用方法

### GitHub Actions自动运行

系统会在每天UTC时间凌晨3点（北京时间上午11点）自动运行，生成最多3篇Insights文章。

### 手动触发

#### 在GitHub Actions中手动触发

1. 进入GitHub仓库的Actions页面
2. 选择"Auto Generate Articles" workflow
3. 点击"Run workflow"
4. 可选参数：
   - `topic`: 指定要生成的主题（如："Newborn Feeding"）
   - `hub`: 指定内容中心（feeding, sleep, mom-health, development, safety, recipes）

#### 本地运行

```bash
# 生成所有缺失主题的文章（最多3篇）
npm run generate:articles

# 生成指定主题的文章
npm run generate:articles:topic "Newborn Feeding Basics"

# 生成指定hub的所有缺失主题
npm run generate:articles:hub feeding
```

## 📊 生成的文章格式

生成的文章包含以下字段：

- `slug` - SEO友好的URL slug
- `type` - 文章类型（explainer, howto, recipe等）
- `hub` - 内容中心
- `title` - 文章标题（60-70字符）
- `one_liner` - 简短描述（50-200字符）
- `key_facts` - 3-8个关键事实
- `body_md` - Markdown格式的完整内容（2000-4000字）
- `age_range` - 适用年龄范围
- `meta_title` - SEO优化的标题
- `meta_description` - SEO描述（150-160字符）
- `keywords` - 关键词数组
- `status` - 状态（自动设置为'published'）
- `article_source` - 来源（自动设置为'ai_generated'）

## 🎨 页面特性

### Insights列表页特性
- ✅ 优雅的premium-card卡片式布局
- ✅ Hub标签颜色区分（emerald, indigo, rose, violet, amber, orange）
- ✅ 年龄范围显示
- ✅ 发布日期显示
- ✅ 关键要点预览
- ✅ 证据来源说明
- ✅ 链接到Topics页面

### Insight文章页特性
- ✅ 优雅的阅读体验
- ✅ 关键要点突出显示（Key takeaways）
- ✅ 证据上下文说明
- ✅ 使用注意事项
- ✅ 返回Insights列表链接
- ✅ 链接到Topics和Trust页面

## 🔧 环境变量配置

确保在GitHub Secrets中配置以下环境变量：

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase项目URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase服务角色密钥
- `OPENAI_API_KEY` - OpenAI API密钥

本地运行时，需要在`.env.local`文件中配置这些变量。

## 📝 主题列表

系统包含50+个母婴相关主题，分布在6个内容中心。主题列表在 `scripts/topics-list.js` 文件中。

要添加新主题，编辑该文件：

```javascript
{ 
  topic: 'Your New Topic', 
  hub: 'feeding', 
  type: 'explainer', 
  age_range: '0-12 months' 
}
```

## 🔍 去重机制

系统使用两层去重检查：

1. **Slug检查** - 通过生成的slug检查是否已存在
2. **标题相似度检查** - 检查是否有相似标题的文章

如果发现重复，文章会被跳过，不会插入数据库。

## ⚙️ 配置选项

### 每天生成数量

默认每天最多生成3篇文章，可以在`auto-generate-articles.js`中修改：

```javascript
const maxArticles = 3; // 修改这个数字
```

### OpenAI模型

默认使用`gpt-4o`模型，可以在脚本中修改：

```javascript
model: 'gpt-4o', // 可以改为 'gpt-4o-mini' 或其他模型
```

### 生成频率

GitHub Action默认每天运行一次，可以在`.github/workflows/auto-generate-articles.yml`中修改cron表达式：

```yaml
- cron: '0 3 * * *'  # 每天UTC 3点
```

## 📈 监控和日志

### GitHub Actions日志

每次运行后，日志会自动上传为artifact，保留30天。统计信息包括：
- 总文章数
- AI生成Insights数量
- 权威文章数量
- 最新5篇Insights

### 本地日志

本地运行时，日志会输出到控制台，也可以重定向到文件：

```bash
node scripts/auto-generate-articles.js > logs/generation-$(date +%Y-%m-%d).log 2>&1
```

## 🐛 故障排除

### 问题：OpenAI API错误

**解决方案**：
- 检查API密钥是否正确
- 检查API配额是否充足
- 检查网络连接

### 问题：数据库插入失败

**解决方案**：
- 检查Supabase连接
- 检查必需字段是否完整
- 查看错误日志了解具体原因
- 确保`article_source`字段已添加（运行数据库迁移）

### 问题：生成的文章质量不佳

**解决方案**：
- 调整OpenAI prompt（在`generateArticle`函数中）
- 使用更高级的模型（如gpt-4o）
- 增加temperature值以获得更多创意

### 问题：文章没有出现在Insights页面

**解决方案**：
- 检查`article_source`是否为`'ai_generated'`
- 检查`status`是否为`'published'`
- 检查页面查询条件是否正确
- 清除Next.js缓存并重新构建

## ✅ 最佳实践

1. **定期检查生成的文章** - 确保内容质量和准确性
2. **监控API使用** - 控制OpenAI API成本
3. **更新主题列表** - 根据用户需求添加新主题
4. **审查去重逻辑** - 确保不会生成重复内容
5. **设置通知** - 在GitHub Actions失败时收到通知
6. **验证页面显示** - 确保新文章正确显示在Insights页面

## 🔄 系统状态

- ✅ 数据库迁移：已完成（`article_source`字段已添加）
- ✅ Insights页面：已创建并设计完成
- ✅ Header导航：已添加"Insights"链接
- ✅ 生成脚本：已更新（自动标记为`ai_generated`）
- ✅ 查询过滤：已配置（权威文章页面排除AI生成的文章）
- ✅ 重定向：已配置（`/blog` → `/insight`）

## 📞 支持

如有问题，请查看：
- GitHub Actions日志
- 脚本错误输出
- 数据库中的`articles`表
- Insights页面：`/insight`

---

**最后更新**: 2025-01-XX
**版本**: 2.0 (Insights页面版本)
