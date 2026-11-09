import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./seo-weekly-audit.mjs', import.meta.url));

function runFixture({ brokenLink = false, missingDescription = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tc-seo-audit-'));
  try {
    const description = missingDescription ? '' : '<meta name="description" content="A sufficiently detailed test description for this site and its readers.">';
    const link = brokenLink ? '<a href="missing.html">Broken local link</a>' : '<a href="index.html">Home</a>';
    fs.writeFileSync(path.join(dir, 'index.html'),
      '<!doctype html><html><head><title>Test homepage</title>' + description +
      '<link rel="canonical" href="https://keikei-p.github.io/"></head><body><h1>Home</h1>' + link + '</body></html>');
    fs.writeFileSync(path.join(dir, 'sitemap.xml'),
      '<urlset><url><loc>https://keikei-p.github.io/</loc></url></urlset>');
    const result = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf8' });
    const reportPath = path.join(dir, 'audit', 'weekly-seo-report.md');
    assert.equal(fs.existsSync(reportPath), true, 'report must be written even when errors occur');
    return { status: result.status, stdout: result.stdout, stderr: result.stderr,
      report: fs.readFileSync(reportPath, 'utf8') };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('valid site: exit success and save report', () => {
  const result = runFixture();
  assert.equal(result.status, 0);
  assert.match(result.report, /エラー：0件/);
});

test('missing internal link: exit failure but preserve report', () => {
  const result = runFixture({ brokenLink: true });
  assert.equal(result.status, 1);
  assert.match(result.report, /リンク先が存在しません: missing\.html/);
  assert.match(result.stderr, /SEO AUDIT FAILED/);
});

test('nonfatal metadata warning: report issue but do not fail', () => {
  const result = runFixture({ missingDescription: true });
  assert.equal(result.status, 0);
  assert.match(result.report, /meta descriptionがありません/);
});
