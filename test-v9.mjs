import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch();
try{
const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:5173/#explore');await p.waitForSelector('.atlas-preview-card');assert.equal(await p.locator('.atlas-preview-card').count(),3);await p.click('#open-atlas');await p.waitForSelector('.atlas-tile');await p.click('#atlas-page-next');assert.equal(await p.evaluate(()=>document.activeElement.id),'atlas-page-next');await p.click('#atlas-favorite');assert.equal(await p.evaluate(()=>document.activeElement.id),'atlas-favorite');await p.goto('http://localhost:5173/#atlas/1');await p.waitForSelector('.atlas-tile');
assert.equal(await p.locator('.atlas-tile').count(),12);
const seen=[];for(let n=0;n<10;n++){await p.selectOption('#atlas-page-select',String(n));seen.push(...await p.locator('[data-atlas-node]').evaluateAll(es=>es.map(e=>+e.dataset.atlasNode)));}
assert.deepEqual(seen,Array.from({length:114},(_,i)=>i+1));assert(await p.locator('#atlas-page-next').isDisabled());
await p.locator('[data-atlas-node="109"]').focus();await p.keyboard.press('Home');assert.equal(await p.locator('[data-atlas-node]:focus').getAttribute('data-atlas-node'),'1');
await p.keyboard.press('End');assert.equal(await p.locator('[data-atlas-node]:focus').getAttribute('data-atlas-node'),'114');
await p.selectOption('#atlas-page-select','0');await p.locator('[data-atlas-node="12"]').focus();await p.keyboard.press('ArrowRight');assert.equal(await p.locator('[data-atlas-node]:focus').getAttribute('data-atlas-node'),'13');
await p.fill('#atlas-search','olmayan bir sure');assert.equal(await p.locator('.atlas-tile').count(),0);assert(await p.locator('.atlas-cards-empty').isVisible());await p.click('#atlas-reset');
await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>document.querySelectorAll('.atlas-tile').length===6);assert.equal(await p.locator('.atlas-tile').count(),6);assert.equal(await p.locator('#atlas-page-select option').count(),19);
await p.selectOption('#atlas-page-select','18');assert.equal(await p.locator('.atlas-tile').count(),6);assert.equal(await p.locator('[data-atlas-node]').last().getAttribute('data-atlas-node'),'114');
assert(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));
await p.goto('http://localhost:5173/#atlas/55');await p.waitForSelector('#atlas-selected-name');assert((await p.locator('#atlas-selected-name').textContent()).includes('Rahmân'));assert(await p.locator('[data-atlas-node="55"]').isVisible());
await p.evaluate(()=>document.body.classList.add('dark'));await p.screenshot({path:'v9-atlas-dark-mobile.png',fullPage:true});assert(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));assert.deepEqual(errors,[]);
console.log('PASS v9: all 114 cards reachable, desktop/mobile groups, cross-group keyboard navigation, empty state, responsive resize, mobile direct link and no horizontal overflow.');
}finally{await b.close()}
