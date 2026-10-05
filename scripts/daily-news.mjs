import fs from 'node:fs';

const ROOT = process.cwd();
const INDEX = `${ROOT}/index.html`;
const DAILY = `${ROOT}/daily-news.html`;
const MAX_ITEMS = 5;
const LOOKBACK_HOURS = 168;
const now = new Date();

const SOURCES = [
  { name: 'NTTドコモ', type: 'rss', url: 'https://www.docomo.ne.jp/info/rss/whatsnew.rdf' },
  { name: 'au / KDDI', type: 'html', url: 'https://www.au.com/information/notice_mobile/service.2/' },
  { name: 'ソフトバンク', type: 'html', url: 'https://www.softbank.jp/corp/news/press/sbkk/' },
  { name: '楽天モバイル', type: 'html', url: 'https://network.mobile.rakuten.co.jp/information/' }
];

const RELEVANT = /(料金|プラン|割引|通信|回線|エリア|ローミング|サービス|障害|復旧|受付|SIM|eSIM|Wi-?Fi|光回線|5G|4G|契約|解約|端末|iPhone|Android|キャンペーン|メンテナンス)/i;
const EXCLUDE = /(人事|組織変更|決算|株主|配当|ESG|サステナビリティ|採用|社債|IR)/i;

function decode(value='') {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ')
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));
}
function strip(value='') { return decode(value.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim(); }
function esc(value='') { return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function toDate(raw='') {
  const m = raw.match(/(20\d{2})[年\/-](\d{1,2})[月\/-](\d{1,2})日?/);
  if (m) return new Date(`${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}T00:00:00+09:00`);
  const d = new Date(raw); return Number.isNaN(d.getTime()) ? null : d;
}
function recent(d) { return d && (now-d) >= -86400000 && (now-d) <= LOOKBACK_HOURS*3600000; }
function absolute(base, href='') { try { return new URL(decode(href), base).href; } catch { return ''; } }
function cleanTitle(t='') { return strip(t).replace(/\s*[|｜]\s*(NTTドコモ|KDDI|ソフトバンク|楽天モバイル).*$/i,'').trim(); }
function pointFor(title) {
  if (/(料金|値上|値下|月額|割引)/.test(title)) return '適用開始日、対象プラン、既存ユーザーへの影響を公式ページで確認。';
  if (/(障害|復旧|メンテナンス)/.test(title)) return '対象地域・時間帯・復旧状況を確認。急ぎの場合は公式の障害情報を優先。';
  if (/(エリア|ローミング|5G|4G|通信)/.test(title)) return '自宅・職場・通勤経路など、実際の生活圏への影響を確認。';
  if (/(SIM|eSIM|端末|iPhone|Android|発売)/i.test(title)) return '対応端末、SIM方式、発売・受付開始日、利用条件を確認。';
  if (/(キャンペーン|特典|ポイント)/.test(title)) return '期間、対象者、併用条件、終了条件を公式ページで確認。';
  if (/(受付|終了|変更|改定)/.test(title)) return '誰が対象か、いつから変わるか、手続きが必要かを確認。';
  return '発表日と対象者、利用者側で必要な対応があるかを公式ページで確認。';
}

async function get(url) {
  const r = await fetch(url,{headers:{'user-agent':'TsuushinCompassDaily/1.0 (+https://keikei-p.github.io/)','accept-language':'ja,en;q=0.8'}});
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return await r.text();
}
function parseRss(src, xml) {
  const out=[];
  for (const m of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const item=m[1];
    const title=cleanTitle((item.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'');
    const link=strip((item.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i)||[])[1]||'');
    const rawDate=((item.match(/<dc:date\b[^>]*>([\s\S]*?)<\/dc:date>/i)||[])[1]||(item.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i)||[])[1]||'');
    const date=toDate(strip(rawDate));
    if (title && link && recent(date) && RELEVANT.test(title) && !EXCLUDE.test(title)) out.push({source:src.name,title,url:link,date});
  }
  return out;
}
function parseHtml(src, html) {
  const out=[];
  const anchor=/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m=anchor.exec(html))) {
    const title=cleanTitle(m[2]);
    if (title.length < 8 || title.length > 160 || !RELEVANT.test(title) || EXCLUDE.test(title)) continue;
    const before=strip(html.slice(Math.max(0,m.index-450),m.index));
    const dateMatches=[...before.matchAll(/20\d{2}年\d{1,2}月\d{1,2}日/g)];
    const rawDate=dateMatches.at(-1)?.[0] || '';
    const date=toDate(rawDate);
    if (!recent(date)) continue;
    const url=absolute(src.url,m[1]);
    if (!url || !/^https:\/\//.test(url)) continue;
    out.push({source:src.name,title,url,date});
  }
  return out;
}
function unique(items) {
  const seen=new Set();
  return items.filter(x=>{ const key=x.url.replace(/[?#].*$/,''); if(seen.has(key)) return false; seen.add(key); return true; });
}
function jpDate(d) { return new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d).replaceAll('/','.'); }
function isoJst(d) {
  const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
  const o=Object.fromEntries(p.map(x=>[x.type,x.value])); return `${o.year}-${o.month}-${o.day}`;
}
function dailyHtml(items, failures) {
  const date=isoJst(now), label=jpDate(now);
  const cards=items.length ? items.map(x=>`<article class="content-card"><p class="content-meta">${esc(jpDate(x.date))}｜${esc(x.source)} 公式</p><h2>${esc(x.title)}</h2><p>${esc(pointFor(x.title))}</p><p><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">公式発表を確認する →</a></p></article>`).join('\n') : `<section class="content-card"><h2>本日の重要更新は見つかりませんでした</h2><p>主要通信会社の公式情報を確認しましたが、直近で利用者への影響が大きい更新は検出していません。新情報がない日は、料金・エリア・契約条件を無理に推測して記事化しません。</p><p><a href="guides.html">通信費の見直しガイドを見る →</a></p></section>`;
  const note=failures.length ? `<p class="content-note">一部の公式情報源は取得できませんでした。取得できた公式情報だけを掲載しています。</p>` : '';
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="canonical" href="https://keikei-p.github.io/daily-news.html"><link rel="icon" href="favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#1598bd"><title>今日の通信ニュース・公式更新 | つうしんコンパス</title><meta name="description" content="ドコモ、KDDI、ソフトバンク、楽天モバイルなどの公式情報を毎日確認し、通信利用者が確認したい変更だけを整理します。"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="content.css"></head><body><header class="site-header"><div class="container"><a class="brand" href="index.html"><span class="brand-name">つうしんコンパス</span></a><nav class="site-nav"><a href="smartphone.html">スマホ診断</a><a href="sim.html">SIM比較</a><a href="wifi.html">Wi-Fi診断</a><a href="guides.html">ガイド</a></nav></div></header><main class="content-page seo-article"><div class="container content-container"><nav class="seo-breadcrumb" aria-label="パンくずリスト"><a href="index.html">トップ</a><span>›</span><span>今日の通信ニュース</span></nav><section class="content-hero"><p class="seo-kicker">DAILY COMPASS｜${label}</p><h1>今日の通信ニュース・公式更新</h1><p>主要通信会社の公式発表を毎朝確認し、料金・通信・契約・障害など、利用者に関係しやすい更新だけを整理します。公式発表を要約転載するのではなく、「何を確認すべきか」を案内します。</p><p class="content-meta">最終確認：${label}（日本時間）</p><p class="content-byline">編集方針：<a href="update-policy.html">公式情報を優先し、確認できない内容は推測しません</a></p>${note}</section>${cards}<section class="content-card"><h2>このページの読み方</h2><p>掲載タイトルは各社の公式発表へのリンクです。料金、キャンペーン、提供エリア、契約条件は変更されるため、申込みや手続きの前に必ずリンク先の最新情報を確認してください。</p><p>自動チェックは情報の見落としを減らす補助として使い、取得できない情報を推測で補完しません。重要な変更は別途、つうしんコンパス独自の記事で背景・対象者・注意点を整理します。</p></section><section class="seo-cta"><h2>通信費を見直したい方へ</h2><p>料金だけでなく、データ量・通話・サポート・利用場所まで整理して候補を比較できます。</p><a class="btn btn-primary" href="smartphone.html">スマホ料金を診断する</a></section></div></main><footer class="site-footer"><div class="container"><div><p class="footer-name">つうしんコンパス</p><p class="footer-note">公式情報を優先して通信サービスを整理します。</p></div><nav><a href="operator.html">運営者情報</a><a href="update-policy.html">更新方針</a><a href="privacy.html">プライバシー</a></nav></div></footer><script src="script.js"></script></body></html>`;
}
function updateIndex(items) {
  let html=fs.readFileSync(INDEX,'utf8');
  const label=jpDate(now);
  const title=items[0]?.title || '今日の公式通信情報を確認しました';
  const summary=items.length ? `${items.length}件の公式更新から、利用者が確認したいポイントを整理しています。` : '主要通信会社の公式情報を確認。重要な更新がない日は無理に記事を量産しません。';
  const section=`<section class="home-daily-news" id="daily-news" aria-labelledby="daily-news-title"><div class="container"><a class="home-daily-card" href="daily-news.html"><div><span class="home-daily-kicker">DAILY COMPASS｜${label}</span><h2 id="daily-news-title">${esc(title)}</h2><p>${esc(summary)}</p></div><span class="home-daily-link">今日の通信情報を見る →</span></a><p class="home-daily-archive"><a href="news-2026-10-05.html">独自解説記事も読む →</a></p></div></section>`;
  const re=/<section class="home-daily-news"[\s\S]*?<\/section>/i;
  if (!re.test(html)) throw new Error('home daily section not found');
  html=html.replace(re,section);
  fs.writeFileSync(INDEX,html,'utf8');
}

const items=[]; const failures=[];
for (const src of SOURCES) {
  try { const text=await get(src.url); items.push(...(src.type==='rss'?parseRss(src,text):parseHtml(src,text))); }
  catch(e){ failures.push(`${src.name}: ${e.message}`); console.warn('source failed',src.name,e.message); }
}
const picked=unique(items).sort((a,b)=>b.date-a.date).slice(0,MAX_ITEMS);
fs.writeFileSync(DAILY,dailyHtml(picked,failures),'utf8');
updateIndex(picked);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`## 通信コンパス 毎日更新\n\n- 掲載: ${picked.length}件\n- 取得失敗: ${failures.length}件\n- 日付: ${jpDate(now)}\n`);
console.log({published:picked.length, failures});
