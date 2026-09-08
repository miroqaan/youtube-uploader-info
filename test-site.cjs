const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, 'docs');
const files = fs.readdirSync(root).sort();
assert.deepEqual(files, ['.nojekyll','index.html','privacy.html','style.css'].sort());
let checks = 1;
for (const name of ['index.html', 'privacy.html']) {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  for (const pattern of [/<!doctype html>/i, /<html lang="ko">/, /name="viewport"/, /name="description"/, /<title>.+<\/title>/, /id="main"/, /mailto:akagiuniverse@gmail.com/, /tts/, /YouTube/]) { assert.match(html, pattern, name); checks++; }
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1); checks++;
  assert.doesNotMatch(html, /<script|<iframe|<form|localStorage|sessionStorage|document\.cookie|GOCSPX-|AIza[\w-]{20}|-----BEGIN .*PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{20}/i); checks++;
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size); checks++;
  for (const [, href] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https:|mailto:)/.test(href)) { new URL(href); }
    else if (href.startsWith('#')) { assert(ids.includes(href.slice(1))); }
    else { assert(fs.existsSync(path.join(root, href === './' ? 'index.html' : href)), href); }
    checks++;
  }
}
const privacy = fs.readFileSync(path.join(root, 'privacy.html'), 'utf8');
for (const text of ['YouTube API Services', 'https://policies.google.com/privacy', 'https://www.youtube.com/t/terms', 'https://myaccount.google.com/connections', '자동 삭제 기능이 없습니다', 'GitHub', '로컬', 'Limited Use']) { assert(privacy.includes(text)); checks++; }
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
assert(css.includes('@media(max-width:700px)') && css.includes(':focus-visible')); checks++;
console.log(`${checks} static checks passed. Two pages; no scripts, forms, trackers, or credential patterns.`);
