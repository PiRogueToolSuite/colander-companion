!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((e="undefined"!=typeof globalThis?globalThis:e||self).extension={})}(this,(function(e){"use strict";let r,t;const a=["lib/web-stream.js","lib/chrome-browser-polyfill.js","lib/single-file.js"],n=["lib/chrome-browser-polyfill.js","lib/single-file-frames.js"];async function s(e,s){let o;if(await async function(e){const s=e.extensionScriptFiles||[];r||t||([r,t]=await Promise.all([i(a.concat(s)),i(n)]))}(s),!s.removeFrames)try{await browser.tabs.executeScript(e,{code:t,allFrames:!0,matchAboutBlank:!0,runAt:"document_start"})}catch(e){}try{await browser.tabs.executeScript(e,{code:r,allFrames:!1,runAt:"document_idle"}),o=!0}catch(e){}return o&&s.frameId&&await browser.tabs.executeScript(e,{code:"document.documentElement.dataset.requestedFrameId = true",frameId:s.frameId,matchAboutBlank:!0,runAt:"document_start"}),o}async function i(e){const r=e.map((async e=>{if("function"==typeof e)return"("+e.toString()+")();";{const r=await fetch(browser.runtime.getURL("../../../"+e));return(new TextDecoder).decode(await r.arrayBuffer())}}));let t="";for(const e of r)t+=await e;return t}const o="single-file-response-fetch",c="Host fetch error (SingleFile)",f=Boolean(window.wrappedJSObject),d=window.fetch.bind(window);let u,l=0,h=new Map;async function w(e,r={},t=!0){try{const a={cache:r.cache||"force-cache",headers:r.headers,referrerPolicy:r.referrerPolicy||"strict-origin-when-cross-origin"};let n;try{n=r.referrer&&!f||!t?await d(e,a):await async function(e,r){if(void 0===u&&(u=!1,document.addEventListener("single-file-response-fetch-supported",(()=>u=!0),!1),document.dispatchEvent(new CustomEvent("single-file-request-fetch-supported"))),u)return new Promise(((t,a)=>{document.dispatchEvent(new CustomEvent("single-file-request-fetch",{detail:JSON.stringify({url:e,options:r})})),document.addEventListener(o,(function r(n){n.detail?n.detail.url==e&&(document.removeEventListener(o,r,!1),n.detail.response?t({status:n.detail.status,headers:new Map(n.detail.headers),arrayBuffer:async()=>n.detail.response}):a(n.detail.error)):a()}),!1)}));throw new Error(c)}(e,a),401!=n.status&&403!=n.status&&404!=n.status||"no-referrer"==a.referrerPolicy||r.referrer||(n=await w(e,{...a,referrerPolicy:"no-referrer"},t))}catch(s){if(s&&s.message==c)n=await w(e,{...a},!1);else{if("no-referrer"==a.referrerPolicy||r.referrer)throw s;n=await w(e,{...a,referrerPolicy:"no-referrer"},t)}}return n}catch(t){l++;const a=new Promise(((e,r)=>h.set(l,{resolve:e,reject:r})));return await m({method:"singlefile.fetch",url:e,requestId:l,referrer:r.referrer,headers:r.headers}),a}}async function y(e,r){const t=await m({method:"singlefile.fetchFrame",url:e,frameId:r.frameId,referrer:r.referrer,headers:r.headers});return{status:t.status,headers:new Map(t.headers),arrayBuffer:async()=>new Uint8Array(t.array).buffer}}async function m(e){const r=await browser.runtime.sendMessage(e);if(!r||r.error)throw new Error(r&&r.error&&r.error.toString());return r}browser.runtime.onMessage.addListener((e=>"singlefile.fetchFrame"==e.method&&window.frameId&&window.frameId==e.frameId?async function(e){try{const r=await d(e.url,{cache:"force-cache",headers:e.headers,referrerPolicy:"strict-origin-when-cross-origin"});return{status:r.status,headers:[...r.headers],array:Array.from(new Uint8Array(await r.arrayBuffer()))}}catch(e){return{error:e&&(e.message||e.toString())}}}(e):"singlefile.fetchResponse"==e.method?async function(e){const r=h.get(e.requestId);r&&(e.error?(r.reject(new Error(e.error)),h.delete(e.requestId)):(e.truncated&&(r.array?r.array=r.array.concat(e.array):(r.array=e.array,h.set(e.requestId,r)),e.finished&&(e.array=r.array)),e.truncated&&!e.finished||(r.resolve({status:e.status,headers:{get:r=>e.headers&&e.headers[r]},arrayBuffer:async()=>new Uint8Array(e.array).buffer}),h.delete(e.requestId))));return{}}(e):void 0)),e.getPageData=function(e,r={fetch:w,frameFetch:y},t,a){return globalThis.singlefile.getPageData(e,r,t,a)},e.injectScript=function(e,r){return s(e,r)}}));
