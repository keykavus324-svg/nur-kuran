import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const b=await chromium.launch();
try{
const p=await b.newPage();const wav=Buffer.alloc(44+16000*20);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);await p.route('https://cdn.islamic.network/**',r=>r.fulfill({contentType:'audio/wav',body:wav}));const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const width of [320,390,430,768,844]){
 await p.setViewportSize({width,height:width===844?390:844});
 for(const route of ['home','quran','ayet/1/1','listen','studio','plan','atlas','explore','saved']){
  await p.goto('http://localhost:5173/#'+route);await p.waitForFunction(()=>{const t=document.getElementById('content')?.textContent;return t&&!t.includes('hazırlanıyor')&&!t.includes('yüklenemedi')});
  assert(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),`${width}: ${route} overflow`);
 }
}
await p.setViewportSize({width:390,height:844});await p.goto('http://localhost:5173/#ayet/1/1');await p.waitForSelector('.verse');
assert.equal(await p.locator('.verse-translation').first().evaluate(e=>getComputedStyle(e).fontSize),'16px');
assert.equal(await p.locator('#jump-ayah').evaluate(e=>getComputedStyle(e).fontSize),'16px');
for(const box of await p.locator('.verse-actions .icon-button').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,cw:parseFloat(getComputedStyle(e).width),ch:parseFloat(getComputedStyle(e).height)}))))assert(box.cw>=44&&box.ch>=44&&box.w+0.001>=44&&box.h+0.001>=44); // Chromium transform float precision: 44px can measure 43.9998779px.
await p.locator('#reader-settings').click();await p.waitForSelector('.dialog');const dialog=await p.locator('.dialog').boundingBox();assert(dialog.x>=0&&dialog.x+dialog.width<=390&&dialog.y>=0&&dialog.y+dialog.height<=845);assert.equal(await p.evaluate(()=>getComputedStyle(document.body).overflow),'hidden');await p.click('#close-modal');
await p.click('#focus-toggle');assert(await p.locator('.mobile-navigation').isHidden());await p.click('#focus-toggle');assert(await p.locator('.mobile-navigation').isVisible());
await p.emulateMedia({reducedMotion:'reduce'});await p.fill('#jump-ayah','7');await p.click('#jump-form button');assert(p.url().endsWith('/1/7'));
await p.goto('http://localhost:5173/#ayet/1/1');await p.waitForSelector('.verse');await p.waitForTimeout(500);await p.screenshot({path:'v12-mobile-reading.png'});await p.locator('.verse').first().scrollIntoViewIfNeeded();await p.screenshot({path:'v12-mobile-verse.png'});
await p.evaluate(()=>document.body.classList.add('dark'));await p.screenshot({path:'v12-mobile-dark.png'});
await p.setViewportSize({width:320,height:640});await p.goto('http://localhost:5173/#listen');await p.waitForSelector('#listen-form');await p.locator('#listen-form [type="submit"]').click();await p.waitForFunction(()=>!document.getElementById('audio').paused);const player=await p.locator('#player').boundingBox(),nav=await p.locator('.mobile-navigation').boundingBox();assert(player.x>=0&&player.x+player.width<=320);assert(player.y+player.height<=nav.y);assert(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));await p.click('#player-options');assert(await p.locator('#audio-reciter-choice').isVisible());await p.click('#close-modal');await p.click('#close-audio');assert.deepEqual(errors,[]);console.log('PASS v12: nine screens at 320/390/430/768px and landscape, 44px verse buttons, 16px meal and input, mobile settings sheet, focus mode, reduced-motion verse jump, no runtime errors.');
}finally{await b.close()}
