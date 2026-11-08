import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const data=JSON.parse(await readFile('public/data/qurancode-tr.json'));
const browser=await chromium.launch();
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}}),p=await ctx.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 const go=async(id='')=>{await p.goto('http://localhost:5173/#sayisal'+(id?'/'+id:''));await p.waitForSelector(id?'.number-detail':'.number-book-page')};
 await go();assert.equal(await p.locator('[data-number-id]').count(),8);assert.equal(await p.locator('#number-results').textContent(),'44 kayıt');
 const ids=new Set();for(let i=0;i<6;i++){for(const id of await p.locator('[data-number-id]').evaluateAll(es=>es.map(e=>e.dataset.numberId)))ids.add(id);if(i<5)await p.click('#number-next')}
 assert.equal(ids.size,44);assert(await p.locator('#number-next').isDisabled());
 await p.fill('#number-search','1824');assert((await p.locator('#number-results').textContent())!=='0 kayıt');
 await p.fill('#number-search','<script>');assert.equal(await p.locator('#number-results').textContent(),'0 kayıt');
 await p.fill('#number-search','');await p.selectOption('#number-topic','hud');assert.equal(await p.locator('#number-results').textContent(),data.items.filter(x=>x.topic==='hud').length+' kayıt');
 // Visit every prepared record, execute every count specification and check every arithmetic badge.
 for(const item of data.items){await go(item.id);assert.equal(await p.locator('.number-detail h1').textContent(),item.title);assert.equal(await p.locator('.number-check').count(),item.steps.length);for(const text of await p.locator('.number-check').allTextContents())assert(text.includes('eşitlik doğru'));
  for(let i=0;i<item.counts.length;i++){await p.selectOption('#number-count-spec',String(i));const value=await p.locator('#number-count-output strong').last().textContent();assert(/^\d+$/.test(value));}
  if(item.table){assert.equal(await p.locator('tbody tr').count(),item.table.rows.length);assert.equal(await p.locator('tfoot td').first().textContent(),String(item.table.claimedTotal));}
 }
 const calc=data.items.find(x=>x.steps.some(s=>s.operands.length===2&&s.operator!=='add'));
 await go(calc.id);const index=calc.steps.findIndex(s=>s.operands.length===2&&s.operator!=='add');await p.click(`[data-number-equation="${index}"]`);await p.fill('[name=n0]','100');await p.fill('[name=n1]','30');await p.click('#number-calculator button');assert((await p.locator('#number-calculator-result').textContent()).includes('70'));await p.click('#close-modal');
 const counts=data.items.find(x=>x.counts.some(c=>c.kind==='words'&&c.surah!==1&&!c.start));await go(counts.id);await p.selectOption('#number-count-spec',String(counts.counts.findIndex(c=>c.kind==='words'&&c.surah!==1&&!c.start)));const before=Number(await p.locator('#number-count-output strong').last().textContent());await p.uncheck('#number-no-basmala');const after=Number(await p.locator('#number-count-output strong').last().textContent());assert.equal(after-before,4);
 await go('adem-1000');await p.locator('[data-number-ref]').first().click();await p.waitForSelector('.verse');assert.equal(await p.locator('.verse').count(),286);
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:950});for(const id of ['', 'adem-1000','hud-796']){await go(id);await p.waitForTimeout(650);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${width} ${id}`)}}
 await p.setViewportSize({width:390,height:950});await go('hud-796');await p.evaluate(()=>document.body.classList.add('dark'));await p.waitForTimeout(650);await p.screenshot({path:'v17-mobile-detail.png'});
 await p.setViewportSize({width:1440,height:1000});await go();await p.evaluate(()=>document.body.classList.remove('dark'));await p.selectOption('#number-topic','all');await p.waitForTimeout(650);await p.screenshot({path:'v17-number-library.png'});
 await p.click('#connection-status');await p.click('#prepare-offline');await p.waitForFunction(()=>document.getElementById('prepare-offline')?.textContent.includes('içerik hazır'),{},{timeout:60000});await p.click('#close-modal');await ctx.setOffline(true);await p.reload();await p.waitForSelector('.number-book-page');await p.locator('[data-number-id]').first().click();await p.waitForSelector('.number-detail');assert.deepEqual(errors,[]);
 console.log('PASS V17: 44 records, all operations/count specifications, pagination/search/filter, calculator, besmele toggle, native full-surah links, 320–1440px, offline reload; no browser errors.');
}finally{await browser.close()}
