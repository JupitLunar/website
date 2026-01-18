# 自动生成文章指南

## 📋 概述

这个系统每天自动生成母婴相关的权威文章并更新到数据库。工作流程包括：

1. **查找缺失主题** - 检查数据库中不存在的topic
2. **生成文章** - 使用OpenAI生成权威、专业的母婴健康文章
3. **去重检查** - 确保没有重复的内容（通过slug和title）
4. **入库** - 将文章插入到`articles`表

## 🚀 使用方法

### GitHub Actions自动运行

系统会在每天UTC时间凌晨3点（北京时间上午11点）自动运行，生成最多3篇文章。

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

或者直接运行脚本：

```bash
cd nextjs-project
node scripts/auto-generate-articles.js

# 指定主题
node scripts/auto-generate-articles.js --topic "Sleep Training"

# 指定hub
node scripts/auto-generate-articles.js --hub feeding
```

## 🔧 环境变量配置

确保在GitHub Secrets中配置以下环境变量：

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase项目URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase服务角色密钥
- `OPENAI_API_KEY` - OpenAI API密钥

本地运行时，需要在`.env.local`文件中配置这些变量。

## 📝 主题列表

系统包含50+个母婴相关主题，分布在6个内容中心：

### Feeding & Nutrition (10个主题)
- Newborn Feeding Basics
- Breastfeeding Positions and Techniques
- Formula Feeding Guide
- Introducing Solid Foods
- Baby-Led Weaning vs Purees
- Allergen Introduction Schedule
- Iron-Rich Foods for Babies
- Vitamin D Supplementation
- Baby Feeding Schedule by Age
- Dealing with Picky Eaters

### Sleep (7个主题)
- Newborn Sleep Patterns
- Safe Sleep Guidelines
- Sleep Training Methods
- Establishing Bedtime Routine
- Dealing with Night Wakings
- Nap Schedule by Age
- Co-Sleeping Safety

### Development (8个主题)
- Newborn Development Milestones
- 3-6 Month Baby Milestones
- 6-9 Month Baby Milestones
- 9-12 Month Baby Milestones
- Tummy Time Benefits
- Encouraging Baby to Crawl
- Baby Speech Development
- Fine Motor Skills Development

### Safety (6个主题)
- Baby-Proofing Your Home
- Choking Prevention
- Car Seat Safety
- Baby First Aid Basics
- Preventing SIDS
- Baby Bath Safety

### Mom Health (6个主题)
- Postpartum Recovery Timeline
- Postpartum Depression Signs
- Breastfeeding Challenges
- Postpartum Exercise Guide
- Managing New Mom Stress
- Postpartum Nutrition

### Recipes (4个主题)
- First Foods for Baby
- Iron-Rich Baby Purees
- Finger Foods for 9-12 Months
- Healthy Baby Snacks

## 🔍 去重机制

系统使用两层去重检查：

1. **Slug检查** - 通过生成的slug检查是否已存在
2. **标题相似度检查** - 检查是否有相似标题的文章

如果发现重复，文章会被跳过，不会插入数据库。

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

每次运行后，日志会自动上传为artifact，保留30天。

### 本地日志

本地运行时，日志会输出到控制台，也可以重定向到文件：

```bash
node scripts/auto-generate-articles.js > logs/generation-$(date +%Y-%m-%d).log 2>&1
```

### 数据库统计

每次运行后，workflow会显示：
- 总文章数
- 最新5篇文章的标题和hub

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

### 问题：生成的文章质量不佳

**解决方案**：
- 调整OpenAI prompt（在`generateArticle`函数中）
- 使用更高级的模型（如gpt-4o）
- 增加temperature值以获得更多创意

### 问题：重复文章被插入

**解决方案**：
- 检查去重逻辑是否正常工作
- 查看日志确认跳过原因
- 手动检查数据库中的slug

## 📚 相关文档

- [文章插入指南](./HOW_TO_INSERT_ARTICLES.md)
- [内容策略指南](./CONTENT_STRATEGY_GUIDE.md)
- [数据库结构](./supabase/schema.sql)

## 🔄 更新主题列表

要添加新主题，编辑`scripts/topics-list.js`文件：

```javascript
{ 
  topic: 'Your New Topic', 
  hub: 'feeding', 
  type: 'explainer', 
  age_range: '0-12 months' 
}
```

## ✅ 最佳实践

1. **定期检查生成的文章** - 确保内容质量和准确性
2. **监控API使用** - 控制OpenAI API成本
3. **更新主题列表** - 根据用户需求添加新主题
4. **审查去重逻辑** - 确保不会生成重复内容
5. **设置通知** - 在GitHub Actions失败时收到通知

## 📞 支持

如有问题，请查看：
- GitHub Actions日志
- 脚本错误输出
- 数据库中的`articles`表

---

**最后更新**: 2025-01-XX
**版本**: 1.0
