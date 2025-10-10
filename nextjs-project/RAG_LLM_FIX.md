# RAG LLM 搜索修复文档

## 问题描述

之前当知识库没有找到相关内容时，LLM 没有被正确调用，而是返回了一个通用的 fallback 答案：

```
Quick Answer
Thank you for your question about maternal and infant care.
Key Points
- Consult with your pediatrician or healthcare provider for personalized advice
- Check our knowledge base sections on feeding, development, and safety
- Reach out to trusted sources like AAP, CDC, or WHO
```

## 根本原因

1. **缺少 OpenAI API Key 检查**：代码没有检查 `OPENAI_API_KEY` 是否配置
2. **错误处理不当**：当 LLM 调用失败时，错误被捕获但没有抛出，导致返回通用答案
3. **缺少日志记录**：无法诊断 LLM 是否真的被调用，以及失败的原因

## 修复内容

### 1. 改进的错误处理

在 `src/app/api/rag/route.ts` 中：

- ✅ 添加 OpenAI API Key 检查
- ✅ 如果 API Key 未配置，立即抛出明确的错误
- ✅ LLM 调用失败时，抛出错误而不是默默失败
- ✅ 删除了不应该被触发的最终 fallback

### 2. 详细的日志记录

添加了多个日志点来帮助调试：

```typescript
console.log('🔍 No relevant content found in knowledge base, using LLM to generate response...');
console.log('🤖 Calling OpenAI API with query:', query.substring(0, 100));
console.log('✅ Received LLM response:', responseText ? 'Success' : 'Empty response');
console.log('✅ Successfully generated LLM response');
```

### 3. 更新环境变量示例

在 `env.example` 中添加了 OpenAI API Key 配置：

```bash
# OpenAI Configuration (Required for RAG AI responses)
OPENAI_API_KEY=your_openai_api_key_here
```

## 工作流程

现在的逻辑流程是：

1. **搜索知识库**
   - 搜索 `articles` 表
   - 搜索 `knowledge_chunks` 表

2. **检查硬编码规则**（针对常见问题）
   - milestone/development
   - breastfeeding/nursing
   - solid food introduction

3. **使用找到的内容**
   - 如果找到文章，返回结构化响应
   - 如果找到知识块，返回结构化响应

4. **调用 LLM（如果没有找到内容）**
   - 检查 OPENAI_API_KEY 是否配置
   - 调用 OpenAI GPT-4o
   - 解析 JSON 响应
   - 添加 AI 生成标识

5. **错误处理**
   - 如果任何步骤失败，抛出详细错误
   - 外层 try-catch 返回 500 错误响应

## 配置步骤

### 1. 设置 OpenAI API Key

#### 本地开发

在 `.env.local` 文件中添加：

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

#### Vercel 部署

1. 进入 Vercel 项目设置
2. 选择 **Environment Variables**
3. 添加新变量：
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-xxxxxxxxxxxxx`
   - Environment: Production, Preview, Development

### 2. 获取 OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录或注册账户
3. 进入 **API Keys** 页面
4. 点击 **Create new secret key**
5. 复制 API key（只显示一次，请妥善保存）

### 3. 验证配置

重启开发服务器后，提问一个不在知识库中的问题，检查：

1. **日志输出**：应该看到 `🔍 No relevant content found...` 和 `🤖 Calling OpenAI API...`
2. **响应内容**：应该得到 LLM 生成的详细答案
3. **AI 标识**：响应底部应该有 "💡 This response was generated using AI..."

## 测试

### 测试场景 1：知识库中有内容

**问题**: "What are infant milestones?"

**预期**：返回硬编码的里程碑信息（因为匹配关键词）

### 测试场景 2：知识库中没有内容

**问题**: "How to prepare baby formula?"

**预期**：调用 LLM 生成详细答案，包含 AI 生成标识

### 测试场景 3：API Key 未配置

**问题**: 任意问题

**预期**：返回 500 错误，错误信息："LLM service is not configured..."

## 监控日志

查看服务器日志（控制台或 Vercel 日志），应该看到：

```
🔍 No relevant content found in knowledge base, using LLM to generate response...
🤖 Calling OpenAI API with query: How to prepare baby formula?
✅ Received LLM response: Success
✅ Successfully generated LLM response
```

如果看到错误：

```
❌ OPENAI_API_KEY is not configured!
❌ LLM fallback error: Error: ...
```

说明需要配置 API Key。

## 成本考虑

- 模型: GPT-4o
- 每次调用: ~1200 tokens max
- 成本: 约 $0.005 - $0.015 per request
- 建议: 设置使用限额，监控 API 使用情况

## 注意事项

1. **安全性**：
   - 不要将 API Key 提交到 Git
   - 使用环境变量管理敏感信息
   - 定期轮换 API Key

2. **性能**：
   - LLM 调用通常需要 2-5 秒
   - 考虑添加缓存机制
   - 监控响应时间

3. **成本控制**：
   - 优先使用知识库内容
   - 只在必要时调用 LLM
   - 设置 OpenAI 账户使用限额

## 后续优化建议

1. **添加缓存**: 缓存常见问题的 LLM 响应
2. **改进搜索**: 使用向量搜索替代文本搜索
3. **流式响应**: 实现流式输出以改善用户体验
4. **A/B 测试**: 测试不同的 prompt 策略
5. **监控仪表板**: 跟踪 LLM 使用率和成本

## 相关文件

- `src/app/api/rag/route.ts` - RAG API 路由
- `env.example` - 环境变量示例
- `.env.local` - 本地环境变量（不提交到 Git）

---

修复日期: 2025-10-10
修复者: AI Assistant

