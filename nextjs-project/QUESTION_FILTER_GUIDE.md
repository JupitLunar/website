# 问题过滤机制说明文档

## 📋 概述

为了确保 AI 助手只回答母婴相关的问题，我们实现了一个**两阶段验证机制**：

1. **阶段一：主题相关性验证** - 使用 LLM 判断问题是否与母婴护理相关
2. **阶段二：生成答案** - 只有通过验证的问题才会生成详细答案

## 🔍 工作流程

```
用户提问
    ↓
搜索知识库（articles + knowledge_chunks）
    ↓
找到内容？
    ↓ 是
返回知识库内容
    ↓ 否
【阶段一】LLM 主题验证
    ↓
是母婴相关？
    ↓ 否 → 礼貌拒绝
    ↓ 是
【阶段二】LLM 生成答案
    ↓
返回详细回答
```

## ✅ 允许的主题范围

系统会**接受**以下类型的问题：

- **孕期护理**: 产前检查、孕期健康、营养
- **新生儿护理**: 婴儿护理、新生儿照顾
- **喂养相关**: 母乳喂养、配方奶、辅食添加、营养
- **儿童发展**: 发育里程碑（0-3岁）
- **婴儿睡眠**: 睡眠训练、睡眠问题
- **婴儿安全**: 居家安全、防护措施
- **产后恢复**: 产后健康、心理健康
- **常见健康问题**: 发烧、皮疹、肠绞痛等
- **育儿技巧**: 0-3岁婴幼儿养育
- **婴儿用品**: 母婴产品和设备

## ❌ 拒绝的主题类型

系统会**拒绝**以下类型的问题：

- 技术类（编程、区块链、加密货币）
- 政治、时事、体育
- 与孕期/产后无关的成人健康问题
- 一般知识问答
- 娱乐、电影、音乐
- 学龄儿童或年龄较大的孩子（超出 0-3 岁范围）
- 其他与母婴护理无关的任何主题

## 🤖 实现细节

### 主题验证 Prompt

```typescript
You are a topic classifier for a maternal and infant care platform. 
Your job is to determine if a user's question is related to maternal and infant care.

RELEVANT TOPICS include:
- Pregnancy, prenatal care, maternal health
- Baby care, infant care, newborn care
- Feeding (breastfeeding, formula, solid foods, nutrition)
- Child development and milestones (0-3 years)
- Baby sleep, sleep training
- Infant safety, baby-proofing
- Postpartum recovery and maternal mental health
- Common baby health issues (fever, rashes, colic, etc.)
- Parenting tips for infants and toddlers
- Baby products and equipment

NOT RELEVANT topics include:
- Technology, programming, cryptocurrency
- Politics, current events, sports
- Adult health unrelated to pregnancy/postpartum
- General knowledge questions
- Entertainment, movies, music
- School-age children or older

Response format:
{
  "isRelevant": true or false,
  "confidence": "high" | "medium" | "low",
  "reason": "Brief explanation"
}
```

### 拒绝回答的响应格式

当问题被识别为不相关时，系统会返回：

```json
{
  "summary": "I'm specifically designed to help with maternal and infant care questions.",
  "keyPoints": [
    "I can answer questions about pregnancy, baby care, feeding, development, and parenting",
    "For other topics, please consult appropriate resources or specialists",
    "Feel free to ask me anything about maternal and infant health!"
  ],
  "details": {
    "sections": [{
      "title": "What I Can Help With",
      "content": "I specialize in maternal and infant care topics..."
    }]
  },
  "actionableAdvice": [
    "Ask me about baby feeding, sleep, development, or safety",
    "Consult your pediatrician for specific medical concerns",
    "Visit trusted sources for other topics outside maternal and infant care"
  ],
  "disclaimer": "I focus exclusively on maternal and infant care topics..."
}
```

## 🧪 测试

### 运行测试脚本

```bash
cd nextjs-project
node scripts/test-question-filter.js
```

测试脚本会验证：

1. ✅ **母婴相关问题** 被正确接受并回答
2. ❌ **无关问题** 被正确拒绝
3. 🤔 **边界情况** 的处理方式

### 测试示例

**应该被接受的问题：**
- "How often should I breastfeed my newborn?"
- "What are the developmental milestones for a 6-month-old?"
- "When can I start solid foods for my baby?"
- "宝宝几个月可以吃辅食？"

**应该被拒绝的问题：**
- "What is blockchain technology?"
- "How do I program in Python?"
- "Who won the NBA championship?"
- "What are the best vacation spots in Europe?"

## 📊 性能考虑

### API 调用成本

- **没有缓存命中时**: 2 次 LLM 调用
  - 第一次：主题验证（~150 tokens）
  - 第二次：生成答案（~1200 tokens）
- **成本优化**: 主题验证使用较低的 temperature (0.3) 和较少的 max_tokens (150)

### 响应时间

- 主题验证: ~0.5-1 秒
- 答案生成: ~2-3 秒
- **总计**: ~2.5-4 秒（对于需要 LLM 的查询）

## 🔧 配置

### 环境变量

确保在 `.env.local` 中配置了：

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 调整验证严格度

如果需要调整验证的严格程度，可以修改：

1. **`temperature`**: 降低 temperature 会让判断更严格
2. **主题列表**: 在 system prompt 中添加或删除允许的主题
3. **置信度阈值**: 目前只使用 `isRelevant`，可以增加 `confidence` 判断

## 📝 日志记录

系统会记录以下日志来帮助调试：

```
🔍 No relevant content found in knowledge base, using LLM to generate response...
🔍 Checking if question is related to maternal and infant care...
🔍 Topic validation result: {"isRelevant":false,"confidence":"high","reason":"..."}
❌ Question is not related to maternal and infant care
```

或者：

```
🔍 Topic validation result: {"isRelevant":true,"confidence":"high","reason":"..."}
✅ Question is relevant to maternal and infant care, proceeding with LLM response...
🤖 Calling OpenAI API to generate answer...
```

## ⚠️ 注意事项

1. **边界情况**: 一些问题可能处于灰色地带（如"学龄儿童的营养"），系统会根据上下文判断
2. **多语言支持**: 系统支持中文和英文问题
3. **误判处理**: 如果发现系统误判，可以通过调整 prompt 中的主题列表来改进
4. **知识库优先**: 如果知识库中有相关内容，会直接返回，不会进行主题验证

## 🎯 最佳实践

1. **定期测试**: 运行测试脚本确保过滤机制正常工作
2. **监控日志**: 关注被拒绝的问题，分析是否有误判
3. **更新主题列表**: 根据用户反馈更新允许/拒绝的主题范围
4. **性能优化**: 考虑缓存常见的无关问题类型

## 🔄 未来改进方向

1. **缓存验证结果**: 对相似问题缓存验证结果
2. **关键词预过滤**: 在调用 LLM 前进行简单的关键词检查
3. **用户反馈**: 允许用户报告误判，持续改进
4. **统计分析**: 收集被拒绝的问题类型，优化 prompt

---

**最后更新**: 2025-10-10
**维护者**: AI Assistant

