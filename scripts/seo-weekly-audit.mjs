import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = 'https://keikei-p.github.io/';
const IGNORE = new Set(['404.html', 'admin.html', 'service.html', 'google732b929005d71176.html']);
const files = fs.readdirSync(ROOT).filter(name => name.endsWith('.html') && !IGNORE.has(name)).sort();
const siteMap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const issueList = [];
const titles = new Map();
const incoming = new Map();

function extract(html, regex) { return (html.match(regex) || [])[1] || ''; }
function flag(level, file, message) { issueList.push({ level, file, message }); }
function localHref(from, href) {
  if (!href || href.startsWith('#') || /^(?:https?:|mailto:|tel:|sms:|javascript:|data:)/i.test(href)) return '';
  let clean = href.split(/[?#]/)[0];
  if (!clean) return '';
  if (clean.startsWith('/')) clean = clean.slice(1);
  const candidate = path.normalize(path.join(path.dirname(from), clean));
  if (!candidate || candidate.startsWith('..') || path.isAbsolute(candidate)) return '';
  return candidate.endsWith(path.sep) ? path.join(candidate, 'index.html') : candidate;
}
for (const file of files) {
  const html = fs.readFileSync(path.join(ROOT,file), 'utf8');
  const title = extract(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i).trim();
  const desc = extract(html, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const canonical = extract(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const noindex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const headings = (html.match(/<h1\b/gi) || []).length;

  if (!title) flag('error',file,'titleタグがありません');
  if (title) {
    if (titles.has(title)) flag('warning',file,'別ページとtitleが重複: ' + titles.get(title));
    titles.set(title,file);
  }
  if (!desc) flag('warning',file,'meta descriptionがありません');
  else if (desc.length < 45) flag('info',file,'meta descriptionが短め (' + desc.length + '文字)');
  if (headings !== 1) flag('warning',file,'h1が ' + headings + ' 個');
  if (!canonical) flag('warning',file,'canonicalがありません');
  else if (canonical !== SITE + (file === 'index.html' ? '' : file)) flag('warning',file,'canonicalが公開URLと一致しません');
  if (!noindex && !siteMap.includes('<loc>' + SITE + (file === 'index.html' ? '' : file) + '</loc>')) {
    flag('warning',file,'sitemap.xmlに載っていません');
  }
  for (const m of html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const target = localHref(file,m[1]);
    if (!target) continue;
    if (!fs.existsSync(path.join(ROOT,target))) flag('error',file,'リンク先が存在しません: ' + m[1]);
    if (target.endsWith('.html')) incoming.set(target,(incoming.get(target)||0)+1);
  }
}
const mainGuides = files.filter(file => /(guide|review|cost|mail-portability|sim-beginner|single-wifi|moving-wifi)/.test(file)
  && !file.startsWith('service-') && !['guides.html','guide.html'].includes(file));
for (const file of mainGuides) {
  if (!incoming.has(file)) flag('warning',file,'HTML内の内部リンクが見つかりません（JSによる導線は未評価）');
}
const counts = { error:0, warning:0, info:0 };
issueList.forEach(item=>{counts[item.level]++;});
const lines = [
 '# つうしんコンパス 週次SEO・導線監査','',
 '実行日時（UTC）：' + new Date().toISOString(),
 '対象HTML：' + files.length + 'ページ',
 'エラー：' + counts.error + '件 / 要確認：' + counts.warning + '件 / 参考：' + counts.info + '件','',
 '※ 検索順位や訪問者数を推測したレポートではありません。GA4・Search Consoleの実績取得は別途必要です。','',
 '## 検出項目（上限80件）',''
];
for (const item of issueList.slice(0,80)) lines.push('- [' + item.level + '] ' + item.file + '：' + item.message);
if (!issueList.length) lines.push('問題は検出されませんでした。');
if (issueList.length > 80) lines.push('…ほか ' + (issueList.length-80) + ' 件');
lines.push('', '## 今後の確認', '',
'- Search Console：検索表示・クリック・インデックス状況（所有者による接続が必要）',
'- GA4：訪問者数・診断への入口・アフィリエイトクリック（所有者による実データ確認が必要）',
'- コンテンツ：新規記事は公式出典と利用者の具体的な解決策を最優先');
const result = lines.join('\n') + '\n';
fs.mkdirSync('audit',{recursive:true});
fs.writeFileSync('audit/weekly-seo-report.md',result,'utf8');
if(process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,result);
console.log('SEO AUDIT', {files:files.length,...counts});
for(const item of issueList.filter(x=>x.level==='error').slice(0,20)) console.log('ERROR',item.file,item.message);
