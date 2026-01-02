# Revalidation测试指南

## ⚠️ 安全提醒

您刚才在这里分享了REVALIDATION_SECRET。为了安全起见，建议：

1. **测试完成后，立即在GitHub Secrets和Vercel环境变量中轮换这个secret**
2. **生成新的secret并更新配置**
3. **不要将secret提交到代码仓库**

## 测试方法

### 方法1: 使用提供的测试脚本（推荐）

```bash
cd nextjs-project
node scripts/test-revalidation-with-secret.js
```

或者指定不同的URL：
```bash
node scripts/test-revalidation-with-secret.js https://your-domain.com
```

### 方法2: 使用curl命令

```bash
curl -X POST https://www.momaiagent.com/api/revalidate \
  -H "Authorization: Bearer 7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8" \
  -H "Content-Type: application/json" \
  -d '{"path": "/insight"}'
```

### 方法3: 在浏览器中使用fetch（仅用于测试）

打开浏览器控制台，运行：

```javascript
fetch('https://www.momaiagent.com/api/revalidate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer 7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ path: '/insight' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## 预期的成功响应

```json
{
  "success": true,
  "message": "Revalidation successful",
  "revalidated": {
    "paths": ["/insight", "/sitemap.xml"],
    "tags": [],
    "timestamp": "2026-01-02T..."
  }
}
```

## 如果成功

✅ Revalidation API返回200状态码
✅ 访问 `/insight` 页面应该能看到37篇文章
✅ 页面会立即显示最新数据（不需要等待5分钟）

## 如果失败

可能的原因：
- ❌ HTTP 401: Secret不匹配或未配置
- ❌ HTTP 500: 服务器错误
- ❌ 网络错误: 网站无法访问

检查步骤：
1. 确认REVALIDATION_SECRET在Vercel环境变量中正确配置
2. 确认网站URL正确
3. 查看Vercel日志获取详细错误信息

## 轮换Secret步骤

1. 生成新的secret（可以使用随机字符串生成器）
2. 更新GitHub Secrets中的`REVALIDATION_SECRET`
3. 更新Vercel环境变量中的`REVALIDATION_SECRET`
4. 更新`.env.local`（如果本地需要）
5. 测试新的secret是否工作
