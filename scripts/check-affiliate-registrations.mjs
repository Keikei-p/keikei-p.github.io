import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = process.cwd();
const load = (file) => fs.readFileSync(file, 'utf8');
const context = { window: {} };
vm.runInNewContext(load('data/affiliates.js'), context, { filename: 'data/affiliates.js' });
vm.runInNewContext(load('data/services.js'), context, { filename: 'data/services.js' });

const ads = Array.from(context.window.TC_AFFILIATE_MASTER.ads);
const catalog = context.window.TC_SERVICE_CATALOG;
const services = [...catalog.smartphone, ...catalog.wifi];
const expected = [
  { service: 'nuro-mobile', key: '0100kfj900ozoe', alt: '【キャッシュバック特典】NURO Mobile', size: [468, 60] },
  { service: 'mineo', key: '0100ii8b00ozoe', alt: 'mineo（マイネオ）', size: [320, 50] },
  { service: 'daredemo-smartphone', key: '0100pk3d00ozoe', alt: '誰でもスマホ', size: [300, 250] }
];

for (const { service, key, alt, size } of expected) {
  const ad = ads.find(x => x.service_id === service && x.keep_on_remote === true && x.is_active === true);
  assert.ok(ad, service + ': enabled static affiliate not found');
  assert.equal(ad.asp_name, 'アクセストレード');
  assert.equal(ad.affiliate_url, '', 'image ads must stay in code mode');
  const expectedCode = `<a href="https://h.accesstrade.net/sp/cc?rk=${key}" rel="nofollow" referrerpolicy="no-referrer-when-downgrade"><img src="https://h.accesstrade.net/sp/rr?rk=${key}" alt="${alt}" border="0" width="${size[0]}" height="${size[1]}"></a>`;
  assert.equal(ad.affiliate_code, expectedCode, service + ': original AccessTrade HTML changed');
  assert.ok(services.some(x => x.id === service), service + ': missing service catalog entry');
  const detail = `service-${service}.html`;
  assert.ok(fs.existsSync(detail), detail + ': detail page missing');
}

const adminHtml = load('admin.html');
const adminJs = load('admin.js');
const publicJs = load('affiliate-firestore.js');
assert.match(adminHtml, /<script src="data\/affiliates\.js"><\/script>/);
assert.match(adminHtml, /id="import-static-ads"/);
assert.match(adminJs, /async function importPresetAds\(\)/);
assert.match(adminJs, /is_suppressed: true/);
assert.match(publicJs, /!remoteIds\.has\(ad\.id\)/);
const sitemap = load('sitemap.xml');
assert.ok(sitemap.includes('service-daredemo-smartphone.html'));
console.log('PASS: 3 exact AccessTrade banners, details, admin sync, safe suppression and sitemap');
