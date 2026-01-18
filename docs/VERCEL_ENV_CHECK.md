# Vercel环境变量检查清单

## ✅ 当前状态确认

从截图看到：
- ✅ `REVALIDATION_SECRET` 已配置
- ✅ 值看起来正确（匹配提供的值）
- ✅ 配置在 "All Environments"

## ⚠️ 重要提醒

即使环境变量看起来正确，如果刚刚更新，需要：

1. **等待Vercel重新部署**
   - 环境变量更新后，Vercel通常需要1-2分钟重新部署
   - 可以在Deployments页面查看最新部署状态

2. **确认部署已完成**
   - 前往 Deployments 标签页
   - 查看最新部署是否显示 "Ready"
   - 确保环境变量更新后的部署已成功

3. **再次测试Revalidation API**

等待部署完成后，再次运行：

```bash
curl -X POST https://www.momaiagent.com/api/revalidate \
  -H "Authorization: Bearer 7kR3mP9vL2nQ6xW8zT5jH4yB1aF0gU3cE6dS9iO7pK2qY5wX8" \
  -H "Content-Type: application/json" \
  -d '{"path": "/insight"}'
```

## 如果仍然失败

如果部署完成后仍然返回401，请：

1. **双击REVALIDATION_SECRET的值**，确认完整值是否完全匹配
   - 检查是否有额外的空格
   - 检查是否有换行符
   - 确认值完全一致

2. **检查是否有多个REVALIDATION_SECRET**
   - 搜索所有环境变量
   - 确认没有重复定义

3. **尝试手动触发重新部署**
   - 在Deployments页面
   - 点击最新部署的"..."菜单
   - 选择"Redeploy"

4. **查看Vercel日志**
   - 前往项目的Logs标签页
   - 查看/api/revalidate端点的错误日志
   - 检查是否有更多错误信息
