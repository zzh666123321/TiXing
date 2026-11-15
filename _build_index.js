/*
 * 构建 index.html：生成一个纯入口目录页。
 *
 * 两个模块各自是独立 HTML 文件，首页只放卡片链接，点击直接跳转。
 * 不内嵌、不切换、不并排 —— 内容与样式完全分开，互不干扰。
 *
 * 新增手册：在 DOCS 里加一项，重新跑本脚本即可。
 * 运行：C:/Users/zihan/.workbuddy/binaries/node/versions/22.22.2-3/node.exe _build_index.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const DOCS = [
  {
    no: '01',
    kind: '通用模块',
    title: '资料分析',
    sub: '公式与题型全解',
    accent: 'a',
    file: '资料分析公式速查手册.html',
    desc: '按问法找公式、按题型看解析。以「现期 = 基期 ×(1+r)」为根，覆盖增长、比重、平均数、倍数、年均、隔年、混合增长等全部考法。',
    tags: ['60+ 问法映射', '15 类题型', '12 组公式族', '速算工具箱', '十大陷阱']
  },
  {
    no: '02',
    kind: '天津市考专项',
    title: '天津市考',
    sub: '特色题型与二级辨析',
    accent: 'b',
    file: '天津市考特色题型与二级辨析全解.html',
    desc: '按 2026 最新考情整理天津卷特色：类比推理二级辨析 24 角度、图形推理立体空间、定义判断诗词选项、政治理论新模块与天津市情素材。',
    tags: ['2026 考情', '二级辨析 24 角度', '7 道真题解析', '图形/定义/逻辑', '天津市情']
  }
];

// 兜底：若资料分析手册被误改名成 index.html，从旧文件恢复独立源文件。
const aPath = path.join(ROOT, DOCS[0].file);
if (!fs.existsSync(aPath)) {
  const idxPath = path.join(ROOT, 'index.html');
  const raw = fs.existsSync(idxPath) ? fs.readFileSync(idxPath, 'utf8') : '';
  if (raw.indexOf('<title>行测 · 资料分析公式与题型全解</title>') < 0) {
    throw new Error('找不到 ' + DOCS[0].file + '，且 index.html 不是原始手册，无法自动恢复');
  }
  fs.writeFileSync(aPath, raw, 'utf8');
  console.log('已从 index.html 恢复 ' + DOCS[0].file);
}

DOCS.forEach(function (d) {
  if (!fs.existsSync(path.join(ROOT, d.file))) throw new Error('找不到源文件: ' + d.file);
});

const cards = DOCS.map(function (d) {
  const tags = d.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('');
  return [
    '    <a class="card ' + d.accent + '" href="' + encodeURIComponent(d.file) + '">',
    '      <div class="card-top"><span class="no">' + d.no + '</span><span class="kind">' + d.kind + '</span></div>',
    '      <h2>' + d.title + '</h2>',
    '      <div class="sub">' + d.sub + '</div>',
    '      <p>' + d.desc + '</p>',
    '      <div class="tags">' + tags + '</div>',
    '      <div class="go">打开手册 <span>&rarr;</span></div>',
    '    </a>'
  ].join('\n');
}).join('\n');

const out = [
'<!DOCTYPE html>',
'<html lang="zh-CN">',
'<head>',
'<meta charset="UTF-8">',
'<meta name="viewport" content="width=device-width, initial-scale=1">',
'<title>考公备考手册 · 目录</title>',
'<style>',
':root{--ink:#1c2330;--muted:#5c6675;--hint:#8a93a2;--line:#e3e7ee;--bg:#f5f8fc;--blue:#185fa5;--blue-s:#e6f1fb;--purple:#534ab7;--purple-s:#eeedfe}',
'*{box-sizing:border-box}',
'body{margin:0;background:var(--bg);color:var(--ink);font-family:"PingFang SC","Microsoft YaHei","Hiragino Sans GB",-apple-system,sans-serif;font-size:14px;line-height:1.75}',
'.page{max-width:1000px;margin:0 auto;padding:64px 28px 40px}',
'.eyebrow{font-size:12px;color:var(--hint);letter-spacing:2px;margin-bottom:10px}',
'h1{margin:0;font-size:30px;font-weight:600;letter-spacing:.5px}',
'.intro{margin:10px 0 0;color:var(--muted);font-size:14px}',
'.grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:40px}',
'.card{display:flex;flex-direction:column;text-decoration:none;color:inherit;background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px 26px 22px;min-height:340px;transition:border-color .15s,transform .15s}',
'.card:hover{border-color:#85b7eb;transform:translateY(-2px)}',
'.card.b:hover{border-color:#afa9ec}',
'.card-top{display:flex;align-items:center;gap:10px;margin-bottom:20px}',
'.no{font-family:Consolas,monospace;font-size:12px;font-weight:600;color:#fff;background:var(--blue);border-radius:6px;padding:3px 9px}',
'.card.b .no{background:var(--purple)}',
'.kind{font-size:12px;color:var(--hint)}',
'.card h2{margin:0;font-size:21px;font-weight:600}',
'.sub{font-size:13px;color:var(--blue);margin:2px 0 14px}',
'.card.b .sub{color:var(--purple)}',
'.card p{margin:0;color:var(--muted);font-size:13px;line-height:1.85;flex:1}',
'.tags{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 18px}',
'.tags span{font-size:11.5px;color:var(--muted);background:var(--blue-s);border-radius:5px;padding:2px 8px}',
'.card.b .tags span{background:var(--purple-s)}',
'.go{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--line);padding-top:14px;font-size:13.5px;font-weight:600;color:var(--blue)}',
'.card.b .go{color:var(--purple)}',
'.go span{font-size:17px}',
'footer{margin-top:40px;padding-top:18px;border-top:1px solid var(--line);text-align:center;color:var(--hint);font-size:12.5px}',
'@media(max-width:760px){.page{padding:36px 18px 28px}.grid{grid-template-columns:1fr;margin-top:28px}.card{min-height:0}h1{font-size:24px}}',
'</style>',
'</head>',
'<body>',
'<div class="page">',
'  <header>',
'    <div class="eyebrow">行测备考资料</div>',
'    <h1>考公备考手册</h1>',
'    <p class="intro">两个模块各自独立成册，点击卡片直接打开，互不干扰。</p>',
'  </header>',
'  <main class="grid">',
cards,
'  </main>',
'  <footer>两份手册均为独立单文件 · 可离线打开 · 各手册内自带「打印 / 存 PDF」按钮</footer>',
'</div>',
'</body>',
'</html>',
''
].join('\n');

fs.writeFileSync(path.join(ROOT, 'index.html'), out, 'utf8');

// 自测：确认是纯链接目录页，且每个目标文件都存在。
const forbidden = ['iframe', 'srcdoc', 'split', 'data-key', '<script'];
forbidden.forEach(function (w) {
  if (out.indexOf(w) >= 0) throw new Error('首页仍含已废弃的嵌套/切换代码: ' + w);
});
DOCS.forEach(function (d) {
  const href = encodeURIComponent(d.file);
  if (out.indexOf('href="' + href + '"') < 0) throw new Error('缺少卡片链接: ' + d.file);
});
console.log('index.html 已生成，' + out.length + ' 字符，' + DOCS.length + ' 个独立模块');
DOCS.forEach(function (d) { console.log('  - ' + d.no + ' ' + d.title + ' → ' + d.file); });
console.log('自测通过：纯链接目录页，无内嵌、无切换、无对照');
