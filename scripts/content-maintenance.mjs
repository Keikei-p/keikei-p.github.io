import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STATE_FILE = path.join(ROOT, '.github', 'content-maintenance-state.json');
const REPORT_FILE = path.join(ROOT, '.github', 'content-maintenance-report.md');
const INTERVAL_MS = 72 * 60 * 60 * 1000;
const FORCE = process.env.FORCE_MAINTENANCE === '1';

const EXCLUDED = new Set(['404.html','admin.html','google732b929005d71176.html']);
const ARTICLE_FILES = new Set([
  'communication-cost.html','flets-collabo.html','guide.html','hikari-switch.html',
  'home-router-vs-hikari.html','mobile-cost-high.html','mobile-review.html','moving-wifi.html',
  'sim-beginner.html','sim-switch-guide.html','single-wifi.html','wifi-review.html'
]);

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function htmlFiles() {
  return fs.readdirSync(ROOT).filter((name) => name.endsWith('.html') && !EXCLUDED.has(name)).sort();
}

function stripTags(value) {
  return String(value || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function mainHtml(html) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return match ? match[1] : '';
}

function ensureBlankTargetRel(html) {
  let fixes = 0;
  const next = html.replace(/<a\b([^>]*\btarget\s*=\s*["']_blank["'][^>]*)>/gi, (full, attrs) => {
    const rel = attrs.match(/\brel\s*=\s*(["'])(.*?)\1/i);
    if (rel) {
      const tokens = rel[2].split(/\s+/).filter(Boolean);
      let changed = false;
      for (const token of ['noopener','noreferrer']) {
        if (!tokens.includes(token)) { tokens.push(token); changed = true; }
      }
      if (!changed) return full;
      fixes += 1;
      return '<a' + attrs.replace(rel[0], 'rel=' + rel[1] + tokens.join(' ') + rel[1]) + '>';
    }
    fixes += 1;
    return '<a' + attrs + ' rel="noopener noreferrer">';
  });
  return { html: next, fixes };
}

function optimizeMainImages(html) {
  let fixes = 0;
  const next = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/gi, (main) => {
    let seen = 0;
    return main.replace(/<img\b[^>]*>/gi, (tag) => {
      seen += 1;
      if (seen === 1) return tag;
      if (/\bdata-no-lazy\b/i.test(tag)) return tag;
      if (/\bwidth\s*=\s*["']?1["']?/i.test(tag) && /\bheight\s*=\s*["']?1["']?/i.test(tag)) return tag;
      let out = tag;
      if (!/\bloading\s*=/i.test(out)) { out = out.replace(/<img\b/i, '<img loading="lazy"'); fixes += 1; }
      if (!/\bdecoding\s*=/i.test(out)) { out = out.replace(/<img\b/i, '<img decoding="async"'); fixes += 1; }
      return out;
    });
  });
  return { html: next, fixes };
}

function splitLongPlainParagraphs(html, file) {
  if (!ARTICLE_FILES.has(file)) return { html, fixes: 0 };
  let fixes = 0;
  const next = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/gi, (main) => {
    return main.replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, (full, attrs = '', inner) => {
      if (/<[^>]+>/.test(inner)) return full;
      const text = stripTags(inner);
      if (text.length < 320 || !text.includes('。')) return full;
      const sentences = text.match(/[^。]+。|[^。]+$/g) || [text];
      const chunks = [];
      let current = '';
      for (const sentence of sentences) {
        if (current && (current + sentence).length > 180) { chunks.push(current); current = sentence; }
        else { current += sentence; }
      }
      if (current) chunks.push(current);
      if (chunks.length < 2) return full;
      fixes += chunks.length - 1;
      return chunks.map((chunk) => '<p' + attrs + '>' + chunk.trim() + '</p>').join('\n');
    });
  });
  return { html: next, fixes };
}

function extractInternalLinks(html) {
  const links = [];
  const re = /\bhref\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = re.exec(html))) links.push(match[1]);
  return links;
}

function checkInternalLink(file, href) {
  const raw = String(href || '').trim();
  if (!raw || raw.startsWith('#')) return null;
  if (/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(raw)) return null;
  let target = raw.split('#')[0].split('?')[0];
  if (!target) return null;
  if (target.startsWith('/')) target = target.slice(1);
  if (!target) target = 'index.html';
  const base = path.dirname(path.join(ROOT, file));
  let resolved = path.resolve(base, target);
  if (target.endsWith('/')) resolved = path.join(resolved, 'index.html');
  if (!resolved.startsWith(ROOT)) return 'リポジトリ外を参照: ' + raw;
  if (!fs.existsSync(resolved)) return '内部リンク切れ: ' + raw;
  return null;
}

function parseDate(value) {
  const d = new Date(value + 'T00:00:00Z');
  return Number.isNaN(d.getTime()) ? null : d;
}

function auditFile(file, html, now) {
  const warnings = [];
  const main = mainHtml(html);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) warnings.push('h1が' + h1Count + '個あります（推奨は1個）');
  if (!/<meta\b[^>]*name\s*=\s*["']viewport["'][^>]*>/i.test(html)) warnings.push('viewport metaがありません');
  const desc = html.match(/<meta\b[^>]*name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta\b[^>]*content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["'][^>]*>/i);
  if (!desc) warnings.push('meta descriptionがありません');
  else {
    const len = stripTags(desc[1]).length;
    if (len < 45) warnings.push('meta descriptionが短めです（' + len + '文字）');
    if (len > 180) warnings.push('meta descriptionが長めです（' + len + '文字）');
  }
  const imgs = main.match(/<img\b[^>]*>/gi) || [];
  imgs.forEach((tag, index) => { if (!/\balt\s*=/i.test(tag)) warnings.push('本文画像' + (index + 1) + 'にaltがありません'); });
  const paras = main.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  const tooLong = paras.map(stripTags).filter((text) => text.length >= 240);
  if (tooLong.length) warnings.push('長い段落が' + tooLong.length + '個あります（240文字以上）');
  for (const href of extractInternalLinks(html)) {
    const issue = checkInternalLink(file, href);
    if (issue && !warnings.includes(issue)) warnings.push(issue);
  }
  const staleRe = /(?:確認済み|情報確認日|確認日)[^0-9]{0,16}(\d{4}-\d{2}-\d{2})/gi;
  let match;
  while ((match = staleRe.exec(html))) {
    const date = parseDate(match[1]);
    if (!date) continue;
    const ageDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (ageDays > 60) warnings.push('情報確認日が' + ageDays + '日前です: ' + match[1]);
  }
  return warnings;
}

function appendSummary(text) {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n', 'utf8');
}

fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
const now = new Date();
const state = readJson(STATE_FILE, {});
const last = state.last_run_utc ? new Date(state.last_run_utc) : null;
const due = FORCE || !last || Number.isNaN(last.getTime()) || (now.getTime() - last.getTime() >= INTERVAL_MS);

if (!due) {
  const next = new Date(last.getTime() + INTERVAL_MS);
  const message = '自動メンテナンスはまだ実行時刻ではありません。次回目安: ' + next.toISOString();
  console.log(message);
  appendSummary('## 通信コンパス 自動メンテナンス\n\n' + message);
  process.exit(0);
}

const files = htmlFiles();
let changedFiles = 0;
let safeFixes = 0;
const warningsByFile = {};

for (const file of files) {
  const full = path.join(ROOT, file);
  const original = fs.readFileSync(full, 'utf8');
  let html = original;
  const rel = ensureBlankTargetRel(html); html = rel.html; safeFixes += rel.fixes;
  const images = optimizeMainImages(html); html = images.html; safeFixes += images.fixes;
  const paragraphs = splitLongPlainParagraphs(html, file); html = paragraphs.html; safeFixes += paragraphs.fixes;
  if (html !== original) { fs.writeFileSync(full, html, 'utf8'); changedFiles += 1; }
  const warnings = auditFile(file, html, now);
  if (warnings.length) warningsByFile[file] = warnings;
}

const warningCount = Object.values(warningsByFile).reduce((sum, items) => sum + items.length, 0);
const lines = [
  '# 通信コンパス 自動メンテナンスレポート','',
  '- 実行日時(UTC): ' + now.toISOString(),
  '- 対象HTML: ' + files.length + 'ファイル',
  '- 安全な自動修正: ' + safeFixes + '件',
  '- 変更ファイル: ' + changedFiles + '件',
  '- 要確認項目: ' + warningCount + '件','',
  '## 自動修正する内容','',
  '- target="_blank" のリンクに noopener / noreferrer を補完',
  '- 本文画像（先頭画像と1x1計測画像を除く）に lazy loading / async decoding を補完',
  '- 記事ページの極端に長いプレーンテキスト段落を、文言を変えず段落分割','',
  '## 自動では書き換えない内容','',
  '- 料金、キャンペーン、提供エリア、速度、契約条件などの事実情報',
  '- 公式確認が必要な古い情報',
  '- alt文言や見出しなど、意味判断が必要な文章',''
];
if (warningCount) {
  lines.push('## 要確認','');
  for (const file of Object.keys(warningsByFile).sort()) {
    lines.push('### ' + file,'');
    for (const warning of warningsByFile[file]) lines.push('- ' + warning);
    lines.push('');
  }
} else {
  lines.push('## 要確認','','現在、追加確認が必要な項目は検出されませんでした。','');
}

fs.writeFileSync(REPORT_FILE, lines.join('\n'), 'utf8');
fs.writeFileSync(STATE_FILE, JSON.stringify({
  last_run_utc: now.toISOString(), interval_hours: 72, scanned_files: files.length,
  safe_fixes: safeFixes, changed_files: changedFiles, warnings: warningCount
}, null, 2) + '\n', 'utf8');

console.log('Content maintenance completed:', { files: files.length, safeFixes, changedFiles, warningCount });
appendSummary(lines.join('\n'));
