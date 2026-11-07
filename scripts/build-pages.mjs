import { cp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const raw=process.env.PAGES_BASE_PATH || '';
if (raw && !/^\/?[a-zA-Z0-9_.\/-]*$/.test(raw)) throw new Error('Invalid Pages base path');
const base='/' + raw.replace(/^\/+|\/+$/g,'') + (raw.replace(/\//g,'') ? '/' : '');
const prefix='nur-offline-'+createHash('sha256').update(base).digest('hex').slice(0,8)+'-';
async function sourceTree(dir){
 const files=[];
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name);
  if(entry.isDirectory())files.push(...await sourceTree(file));
  else if(entry.isFile())files.push(file);
 }
 return files.sort();
}
const sourceFiles=[...await sourceTree('public'),'index.html','scripts/build-pages.mjs'];
const version=createHash('sha256');
for(const file of sourceFiles){version.update(file);version.update(await readFile(file));}
const cacheName=prefix+version.digest('hex').slice(0,12);
function adapt(text){
 return text.replace(/(["'`])\/(?=[A-Za-z])/g,(_,q)=>q+base)
  .replace(/scope:\s*(["'])\/\1/g,(_,q)=>`scope:${q}${base}${q}`)
  .replace(/url\(\/(?!\/)/g,'url('+base)
  .replace('${location.origin}/#','${location.origin}'+base+'#')
  .replace(/nur-offline-v[0-9]+/g,cacheName)
  .replace("key.startsWith('nur-offline-')",`key.startsWith('${prefix}')`);
}
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
for(const file of ['app.js','style.css','fonts.css','sw.js']){
 await writeFile(path.join('dist',file),adapt(await readFile(path.join('public',file),'utf8')));
}
const html=adapt(await readFile('index.html','utf8'));
await writeFile('dist/index.html',html);
await writeFile('dist/offline-shell.json',JSON.stringify({html}));
const manifest=JSON.parse(await readFile('public/manifest.webmanifest','utf8'));
for(const key of ['id','start_url','scope'])manifest[key]=base;
for(const icon of manifest.icons)icon.src=base+icon.src.replace(/^\//,'');
for(const shortcut of manifest.shortcuts||[])shortcut.url=base+shortcut.url.replace(/^\//,'');
await writeFile('dist/manifest.webmanifest',JSON.stringify(manifest));
await writeFile('dist/.nojekyll','');
console.log(`GitHub Pages build ready: dist/ (base: ${base}, cache: ${cacheName})`);
