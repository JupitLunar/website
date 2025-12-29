const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const layoutPath = path.join(projectRoot, 'src/app/layout.tsx');

if (!fs.existsSync(layoutPath)) {
  console.log('❌ 未找到 layout.tsx 文件');
  process.exit(1);
}

const layoutContent = fs.readFileSync(layoutPath, 'utf8');

const hasGATag = layoutContent.includes('G-QQTEKXVQN4') && 
                 layoutContent.includes('googletagmanager.com/gtag/js');

console.log('='.repeat(60));
console.log('Google Analytics Tag 检查报告');
console.log('='.repeat(60));

if (hasGATag) {
  console.log('\n✅ 根布局 (layout.tsx) 包含 Google Tag');
  console.log('✅ 所有页面都会自动包含 Google Analytics (G-QQTEKXVQN4)');
} else {
  console.log('\n❌ 根布局中未找到 Google Tag');
  process.exit(1);
}

// 检查是否有其他 layout 文件可能覆盖
const appDir = path.join(projectRoot, 'src/app');
const layouts = [];

function findLayouts(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findLayouts(filePath);
      } else if (file === 'layout.tsx') {
        layouts.push(filePath);
      }
    } catch (e) {
      // 忽略错误
    }
  });
}

findLayouts(appDir);

console.log(`\n找到 ${layouts.length} 个 layout 文件:`);
layouts.forEach(layout => {
  const relPath = path.relative(projectRoot, layout);
  const content = fs.readFileSync(layout, 'utf8');
  const hasGA = content.includes('G-QQTEKXVQN4') || content.includes('googletagmanager');
  const status = hasGA ? '✅' : '⚠️';
  const note = hasGA ? '(有GA)' : '(无GA，但会继承根布局)';
  console.log(`  ${status} ${relPath} ${note}`);
});

console.log('\n' + '='.repeat(60));
console.log('总结: 所有通过 Next.js App Router 的页面都会包含 Google Tag');
console.log('='.repeat(60));



