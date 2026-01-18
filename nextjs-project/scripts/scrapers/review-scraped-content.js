#!/usr/bin/env node

/**
 * 审核爬取的内容
 * 查看和管理draft状态的文章
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const readline = require('readline');

const dotenv = require('dotenv');
// Load env vars from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 创建命令行界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * 获取所有draft状态的文章
 */
async function getDraftArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, hub, created_at, reviewed_by, one_liner')
    .eq('status', 'draft')
    .eq('reviewed_by', 'Web Scraper Bot')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

/**
 * 获取文章详情
 */
async function getArticleDetails(id) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      citations(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * 发布文章
 */
async function publishArticle(id) {
  const { error } = await supabase
    .from('articles')
    .update({ 
      status: 'published',
      date_published: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
  console.log('✅ 文章已发布');
}

/**
 * 删除文章
 */
async function deleteArticle(id) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  console.log('🗑️  文章已删除');
}

/**
 * 更新文章
 */
async function updateArticle(id, updates) {
  const { error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
  console.log('✅ 文章已更新');
}

/**
 * 显示文章列表
 */
function displayArticleList(articles) {
  console.log('\n📋 待审核文章列表');
  console.log('='.repeat(80));
  
  articles.forEach((article, index) => {
    console.log(`\n${index + 1}. ${article.title}`);
    console.log(`   🔗 Slug: ${article.slug}`);
    console.log(`   🏠 Hub: ${article.hub}`);
    console.log(`   📅 创建时间: ${new Date(article.created_at).toLocaleString()}`);
    console.log(`   📝 摘要: ${article.one_liner.substring(0, 100)}...`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`总计: ${articles.length} 篇文章待审核\n`);
}

/**
 * 显示文章详情
 */
function displayArticleDetails(article) {
  console.log('\n' + '='.repeat(80));
  console.log('📄 文章详情');
  console.log('='.repeat(80));
  
  console.log(`\n标题: ${article.title}`);
  console.log(`Slug: ${article.slug}`);
  console.log(`类型: ${article.type}`);
  console.log(`Hub: ${article.hub}`);
  console.log(`语言: ${article.lang}`);
  console.log(`年龄范围: ${article.age_range || 'N/A'}`);
  console.log(`地区: ${article.region}`);
  
  console.log(`\n摘要:`);
  console.log(article.one_liner);
  
  console.log(`\n关键事实:`);
  article.key_facts.forEach((fact, i) => {
    console.log(`  ${i + 1}. ${fact}`);
  });
  
  console.log(`\n实体标签:`);
  console.log(article.entities.join(', '));
  
  if (article.keywords && article.keywords.length > 0) {
    console.log(`\n关键词:`);
    console.log(article.keywords.join(', '));
  }
  
  if (article.citations && article.citations.length > 0) {
    console.log(`\n引用来源:`);
    article.citations.forEach((citation, i) => {
      console.log(`  ${i + 1}. ${citation.title}`);
      console.log(`     出版方: ${citation.publisher}`);
      console.log(`     URL: ${citation.url}`);
    });
  }
  
  console.log(`\n内容预览 (前500字符):`);
  console.log(article.body_md.substring(0, 500) + '...');
  
  console.log(`\nSEO信息:`);
  console.log(`  Meta标题: ${article.meta_title}`);
  console.log(`  Meta描述: ${article.meta_description}`);
  
  console.log('\n' + '='.repeat(80));
}

/**
 * 审核单篇文章
 */
async function reviewArticle(article) {
  displayArticleDetails(article);
  
  while (true) {
    console.log('\n操作选项:');
    console.log('  1. 发布文章');
    console.log('  2. 删除文章');
    console.log('  3. 编辑标题');
    console.log('  4. 编辑摘要');
    console.log('  5. 修改Hub');
    console.log('  6. 查看完整内容');
    console.log('  7. 跳过');
    console.log('  0. 返回列表');
    
    const choice = await question('\n请选择操作 (0-7): ');
    
    switch (choice) {
      case '1':
        const confirmPublish = await question('确认发布? (y/n): ');
        if (confirmPublish.toLowerCase() === 'y') {
          await publishArticle(article.id);
          return 'published';
        }
        break;
      
      case '2':
        const confirmDelete = await question('确认删除? (y/n): ');
        if (confirmDelete.toLowerCase() === 'y') {
          await deleteArticle(article.id);
          return 'deleted';
        }
        break;
      
      case '3':
        const newTitle = await question('输入新标题: ');
        if (newTitle) {
          await updateArticle(article.id, { title: newTitle });
          article.title = newTitle;
        }
        break;
      
      case '4':
        const newOneLiner = await question('输入新摘要: ');
        if (newOneLiner && newOneLiner.length >= 50) {
          await updateArticle(article.id, { one_liner: newOneLiner });
          article.one_liner = newOneLiner;
        } else {
          console.log('❌ 摘要长度必须至少50字符');
        }
        break;
      
      case '5':
        console.log('可选Hub: feeding, sleep, mom-health, development, safety, recipes');
        const newHub = await question('输入新Hub: ');
        if (newHub) {
          await updateArticle(article.id, { hub: newHub });
          article.hub = newHub;
        }
        break;
      
      case '6':
        console.log('\n' + '='.repeat(80));
        console.log(article.body_md);
        console.log('='.repeat(80));
        break;
      
      case '7':
        return 'skipped';
      
      case '0':
        return 'back';
      
      default:
        console.log('❌ 无效选择');
    }
  }
}

/**
 * 批量操作
 */
async function batchOperations(articles) {
  console.log('\n批量操作:');
  console.log('  1. 发布所有文章');
  console.log('  2. 删除所有文章');
  console.log('  0. 返回');
  
  const choice = await question('\n请选择操作 (0-2): ');
  
  switch (choice) {
    case '1':
      const confirmPublishAll = await question(`确认发布所有 ${articles.length} 篇文章? (y/n): `);
      if (confirmPublishAll.toLowerCase() === 'y') {
        for (const article of articles) {
          await publishArticle(article.id);
          console.log(`✅ 已发布: ${article.title}`);
        }
        console.log(`\n🎉 已发布 ${articles.length} 篇文章`);
      }
      break;
    
    case '2':
      const confirmDeleteAll = await question(`确认删除所有 ${articles.length} 篇文章? (y/n): `);
      if (confirmDeleteAll.toLowerCase() === 'y') {
        for (const article of articles) {
          await deleteArticle(article.id);
          console.log(`🗑️  已删除: ${article.title}`);
        }
        console.log(`\n🗑️  已删除 ${articles.length} 篇文章`);
      }
      break;
  }
}

/**
 * 主菜单
 */
async function mainMenu() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   内容审核工具                         ║');
  console.log('╚════════════════════════════════════════╝');
  
  const articles = await getDraftArticles();
  
  if (articles.length === 0) {
    console.log('\n✅ 没有待审核的文章！');
    rl.close();
    return;
  }
  
  displayArticleList(articles);
  
  while (true) {
    console.log('\n主菜单:');
    console.log('  1-N. 选择文章序号进行审核');
    console.log('  B. 批量操作');
    console.log('  R. 刷新列表');
    console.log('  Q. 退出');
    
    const choice = await question('\n请选择操作: ');
    
    if (choice.toLowerCase() === 'q') {
      console.log('\n👋 再见！');
      rl.close();
      return;
    }
    
    if (choice.toLowerCase() === 'r') {
      console.log('\n🔄 刷新列表...');
      const updatedArticles = await getDraftArticles();
      displayArticleList(updatedArticles);
      continue;
    }
    
    if (choice.toLowerCase() === 'b') {
      await batchOperations(articles);
      const updatedArticles = await getDraftArticles();
      displayArticleList(updatedArticles);
      continue;
    }
    
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < articles.length) {
      const article = await getArticleDetails(articles[index].id);
      const result = await reviewArticle(article);
      
      if (result === 'back') {
        continue;
      }
      
      if (result === 'published' || result === 'deleted') {
        const updatedArticles = await getDraftArticles();
        displayArticleList(updatedArticles);
        
        if (updatedArticles.length === 0) {
          console.log('\n🎉 所有文章已审核完成！');
          rl.close();
          return;
        }
      }
    } else {
      console.log('❌ 无效的文章序号');
    }
  }
}

/**
 * 运行
 */
async function main() {
  try {
    await mainMenu();
  } catch (error) {
    console.error('❌ 错误:', error.message);
    rl.close();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getDraftArticles, reviewArticle };

