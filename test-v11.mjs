import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch();
try{
const p=await b.newPage({viewport:{width:1440,height:1100}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:5173/#explore');await p.waitForSelector('.explore-topics');assert.equal(await p.locator('.explore-topic').count(),6);assert.equal(await p.locator('.explore-steps li').count(),3);
await p.waitForTimeout(700);await p.screenshot({path:'v11-explore-desktop.png',fullPage:true});
for(let i=0;i<6;i++){await p.locator('.explore-topic').nth(i).click();assert.equal(await p.locator('#modal [data-surah]').count(),i===1?4:3);await p.click('#close-modal');}
await p.locator('.explore-topic').first().click();await p.locator('#modal [data-surah]').first().click();await p.waitForSelector('#verse-28');assert(p.url().includes('13/28'));
await p.goto('http://localhost:5173/#explore');await p.waitForSelector('.explore-questions');const summary=p.locator('.explore-questions summary').nth(1);await summary.focus();await p.keyboard.press('Enter');assert(await p.locator('.explore-questions details').nth(1).evaluate(e=>e.open));await p.keyboard.press('Enter');assert(!(await p.locator('.explore-questions details').nth(1).evaluate(e=>e.open)));
for(const width of [320,390,768,1024]){await p.setViewportSize({width,height:900});assert(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),`overflow at ${width}`);}
await p.setViewportSize({width:390,height:844});await p.locator('.explore-themes').scrollIntoViewIfNeeded();await p.screenshot({path:'v11-explore-mobile.png'});await p.evaluate(()=>document.body.classList.add('dark'));await p.screenshot({path:'v11-explore-dark-mobile.png'});
await p.locator('.explore-welcome [data-surah]').click();await p.waitForSelector('#verse-1');assert.equal(await p.locator('.verse').count(),7);assert.deepEqual(errors,[]);
console.log('PASS v11: six topic collections, contextual verse navigation, first-time reading, keyboard guide, 320/390/768/1024px layouts, no JavaScript errors.');
}finally{await b.close()}
