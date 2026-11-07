import { cp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const raw=process.env.PAGES_BASE_PATH || '';
if (raw && !/^\/?[a-zA-Z0-9_.\/-]*$/.test(raw)) throw new Error('Invalid Pages base path');
const base='/' + raw.replace(/^\/+|\/+$/g,'') + (raw.replace(/\//g,'') ? '/' : '');
const prefix='nur-offline-'+createHash('sha256').update(base).digest('hex').slice(0,8)+'-';
const sourceFiles=['public/app.js','public/style.css','public/sw.js','index.html'];
const version=createHash('sha256');
for(const file of sourceFiles)version.update(await readFile(file));
const cacheName=prefix+version.digest('hex').slice(0,12);
function adapt(text){
 return text.replace(/(["'`])\/(?!\/)/g,(_,q)=>q+base)
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
await writeFile('dist/manifest.webmanifest',JSON.stringify(manifest));
await writeFile('dist/.nojekyll','');
console.log(`GitHub Pages build ready: dist/ (base: ${base}, cache: ${cacheName})`);
