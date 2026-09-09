const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
for(const file of ['index.html','privacy.html']){
 const text=fs.readFileSync(path.join(__dirname,'docs/popo',file),'utf8');
 assert.match(text,/<html lang="ja">/);assert.match(text,/name="viewport"/);assert.match(text,/<main id="main"/);
 assert.match(text,/akagiuniverse@gmail\.com/);assert.ok(!/[\uac00-\ud7af]/.test(text));assert.ok(!/<script|<form|<iframe/i.test(text));
 for(const [,href] of text.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https:|mailto:|#)/.test(href))continue;
  assert.ok(fs.existsSync(path.join(__dirname,'docs/popo',href)),href);
 }
}
const policy=fs.readFileSync(path.join(__dirname,'docs/popo/privacy.html'),'utf8');
for(const term of ['GitHub','バックアップ','削除','お問い合わせ','カメラ','サーバー','子ども'])assert.ok(policy.includes(term),term);
console.log('Popo public support/privacy checks passed.');
