"use strict";(self.webpackChunkmtd_mobile_ui=self.webpackChunkmtd_mobile_ui||[]).push([[2076],{6579:(b,p,a)=>{a.d(p,{c:()=>c});var _=a(4363),o=a(4081),l=a(405);const c=(e,s)=>{let t,n;const f=(i,E,u)=>{if(typeof document>"u")return;const m=document.elementFromPoint(i,E);m&&s(m)?m!==t&&(r(),d(m,u)):r()},d=(i,E)=>{t=i,n||(n=t);const u=t;(0,_.w)(()=>u.classList.add("ion-activated")),E()},r=(i=!1)=>{if(!t)return;const E=t;(0,_.w)(()=>E.classList.remove("ion-activated")),i&&n!==t&&t.click(),t=void 0};return(0,l.createGesture)({el:e,gestureName:"buttonActiveDrag",threshold:0,onStart:i=>f(i.currentX,i.currentY,o.a),onMove:i=>f(i.currentX,i.currentY,o.b),onEnd:()=>{r(!0),(0,o.h)(),n=void 0}})}},8438:(b,p,a)=>{a.d(p,{g:()=>o});var _=a(8476);const o=()=>{if(void 0!==_.w)return _.w.Capacitor}},5572:(b,p,a)=>{a.d(p,{c:()=>_,i:()=>o});const _=(l,c,e)=>"function"==typeof e?e(l,c):"string"==typeof e?l[e]===c[e]:Array.isArray(c)?c.includes(l):l===c,o=(l,c,e)=>void 0!==l&&(Array.isArray(l)?l.some(s=>_(s,c,e)):_(l,c,e))},3351:(b,p,a)=>{a.d(p,{g:()=>_});const _=(s,t,n,f,d)=>l(s[1],t[1],n[1],f[1],d).map(r=>o(s[0],t[0],n[0],f[0],r)),o=(s,t,n,f,d)=>d*(3*t*Math.pow(d-1,2)+d*(-3*n*d+3*n+f*d))-s*Math.pow(d-1,3),l=(s,t,n,f,d)=>e((f-=d)-3*(n-=d)+3*(t-=d)-(s-=d),3*n-6*t+3*s,3*t-3*s,s).filter(i=>i>=0&&i<=1),e=(s,t,n,f)=>{if(0===s)return((s,t,n)=>{const f=t*t-4*s*n;return f<0?[]:[(-t+Math.sqrt(f))/(2*s),(-t-Math.sqrt(f))/(2*s)]})(t,n,f);const d=(3*(n/=s)-(t/=s)*t)/3,r=(2*t*t*t-9*t*n+27*(f/=s))/27;if(0===d)return[Math.pow(-r,1/3)];if(0===r)return[Math.sqrt(-d),-Math.sqrt(-d)];const i=Math.pow(r/2,2)+Math.pow(d/3,3);if(0===i)return[Math.pow(r/2,.5)-t/3];if(i>0)return[Math.pow(-r/2+Math.sqrt(i),1/3)-Math.pow(r/2+Math.sqrt(i),1/3)-t/3];const E=Math.sqrt(Math.pow(-d/3,3)),u=Math.acos(-r/(2*Math.sqrt(Math.pow(-d/3,3)))),m=2*Math.pow(E,1/3);return[m*Math.cos(u/3)-t/3,m*Math.cos((u+2*Math.PI)/3)-t/3,m*Math.cos((u+4*Math.PI)/3)-t/3]}},5083:(b,p,a)=>{a.d(p,{i:()=>_});const _=o=>o&&""!==o.dir?"rtl"===o.dir.toLowerCase():"rtl"===document?.dir.toLowerCase()},3126:(b,p,a)=>{a.r(p),a.d(p,{startFocusVisible:()=>c});const _="ion-focused",l=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp","Home","End"],c=e=>{let s=[],t=!0;const n=e?e.shadowRoot:document,f=e||document.body,d=y=>{s.forEach(g=>g.classList.remove(_)),y.forEach(g=>g.classList.add(_)),s=y},r=()=>{t=!1,d([])},i=y=>{t=l.includes(y.key),t||d([])},E=y=>{if(t&&void 0!==y.composedPath){const g=y.composedPath().filter(v=>!!v.classList&&v.classList.contains("ion-focusable"));d(g)}},u=()=>{n.activeElement===f&&d([])};return n.addEventListener("keydown",i),n.addEventListener("focusin",E),n.addEventListener("focusout",u),n.addEventListener("touchstart",r,{passive:!0}),n.addEventListener("mousedown",r),{destroy:()=>{n.removeEventListener("keydown",i),n.removeEventListener("focusin",E),n.removeEventListener("focusout",u),n.removeEventListener("touchstart",r),n.removeEventListener("mousedown",r)},setFocus:d}}},8281:(b,p,a)=>{a.d(p,{c:()=>o});var _=a(5638);const o=s=>{const t=s;let n;return{hasLegacyControl:()=>{if(void 0===n){const d=void 0!==t.label||l(t),r=t.hasAttribute("aria-label")||t.hasAttribute("aria-labelledby")&&null===t.shadowRoot,i=(0,_.h)(t);n=!0===t.legacy||!d&&!r&&null!==i}return n}}},l=s=>!!(c.includes(s.tagName)&&null!==s.querySelector('[slot="label"]')||e.includes(s.tagName)&&""!==s.textContent),c=["ION-INPUT","ION-TEXTAREA","ION-SELECT","ION-RANGE"],e=["ION-TOGGLE","ION-CHECKBOX","ION-RADIO"]},4081:(b,p,a)=>{a.d(p,{I:()=>o,a:()=>t,b:()=>n,c:()=>s,d:()=>d,h:()=>f});var _=a(8438),o=function(r){return r.Heavy="HEAVY",r.Medium="MEDIUM",r.Light="LIGHT",r}(o||{});const c={getEngine(){const r=window.TapticEngine;if(r)return r;const i=(0,_.g)();return i?.isPluginAvailable("Haptics")?i.Plugins.Haptics:void 0},available(){if(!this.getEngine())return!1;const i=(0,_.g)();return"web"!==i?.getPlatform()||typeof navigator<"u"&&void 0!==navigator.vibrate},isCordova:()=>void 0!==window.TapticEngine,isCapacitor:()=>void 0!==(0,_.g)(),impact(r){const i=this.getEngine();if(!i)return;const E=this.isCapacitor()?r.style:r.style.toLowerCase();i.impact({style:E})},notification(r){const i=this.getEngine();if(!i)return;const E=this.isCapacitor()?r.type:r.type.toLowerCase();i.notification({type:E})},selection(){const r=this.isCapacitor()?o.Light:"light";this.impact({style:r})},selectionStart(){const r=this.getEngine();r&&(this.isCapacitor()?r.selectionStart():r.gestureSelectionStart())},selectionChanged(){const r=this.getEngine();r&&(this.isCapacitor()?r.selectionChanged():r.gestureSelectionChanged())},selectionEnd(){const r=this.getEngine();r&&(this.isCapacitor()?r.selectionEnd():r.gestureSelectionEnd())}},e=()=>c.available(),s=()=>{e()&&c.selection()},t=()=>{e()&&c.selectionStart()},n=()=>{e()&&c.selectionChanged()},f=()=>{e()&&c.selectionEnd()},d=r=>{e()&&c.impact(r)}},2885:(b,p,a)=>{a.d(p,{I:()=>s,a:()=>d,b:()=>e,c:()=>E,d:()=>m,f:()=>r,g:()=>f,i:()=>n,p:()=>u,r:()=>y,s:()=>i});var _=a(467),o=a(5638),l=a(4929);const e="ion-content",s=".ion-content-scroll-host",t=`${e}, ${s}`,n=g=>"ION-CONTENT"===g.tagName,f=function(){var g=(0,_.A)(function*(v){return n(v)?(yield new Promise(w=>(0,o.c)(v,w)),v.getScrollElement()):v});return function(w){return g.apply(this,arguments)}}(),d=g=>g.querySelector(s)||g.querySelector(t),r=g=>g.closest(t),i=(g,v)=>n(g)?g.scrollToTop(v):Promise.resolve(g.scrollTo({top:0,left:0,behavior:v>0?"smooth":"auto"})),E=(g,v,w,M)=>n(g)?g.scrollByPoint(v,w,M):Promise.resolve(g.scrollBy({top:w,left:v,behavior:M>0?"smooth":"auto"})),u=g=>(0,l.b)(g,e),m=g=>{if(n(g)){const w=g.scrollY;return g.scrollY=!1,w}return g.style.setProperty("overflow","hidden"),!0},y=(g,v)=>{n(g)?g.scrollY=v:g.style.removeProperty("overflow")}},6726:(b,p,a)=>{a.d(p,{a:()=>_,b:()=>E,c:()=>t,d:()=>u,e:()=>C,f:()=>s,g:()=>m,h:()=>l,i:()=>o,j:()=>M,k:()=>O,l:()=>n,m:()=>r,n:()=>y,o:()=>d,p:()=>e,q:()=>c,r:()=>w,s:()=>h,t:()=>i,u:()=>g,v:()=>v,w:()=>f});const _="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-miterlimit='10' stroke-width='48' d='M244 400L100 256l144-144M120 256h292' class='ionicon-fill-none'/></svg>",o="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 268l144 144 144-144M256 392V100' class='ionicon-fill-none'/></svg>",l="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M368 64L144 256l224 192V64z'/></svg>",c="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 144l192 224 192-224H64z'/></svg>",e="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M448 368L256 144 64 368h384z'/></svg>",s="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M416 128L192 384l-96-96' class='ionicon-fill-none ionicon-stroke-width'/></svg>",t="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M328 112L184 256l144 144' class='ionicon-fill-none'/></svg>",n="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 184l144 144 144-144' class='ionicon-fill-none'/></svg>",f="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M136 208l120-104 120 104M136 304l120 104 120-104' stroke-width='48' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none'/></svg>",d="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",r="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",i="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z'/></svg>",E="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 11-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 01-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0122.62-22.62L256 233.37l52.69-52.68a16 16 0 0122.62 22.62L278.63 256z'/></svg>",u="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z'/></svg>",m="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='192' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none ionicon-stroke-width'/></svg>",y="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='48'/><circle cx='416' cy='256' r='48'/><circle cx='96' cy='256' r='48'/></svg>",g="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-miterlimit='10' d='M80 160h352M80 256h352M80 352h352' class='ionicon-fill-none ionicon-stroke-width'/></svg>",v="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 384h384v-42.67H64zm0-106.67h384v-42.66H64zM64 128v42.67h384V128z'/></svg>",w="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M400 256H112' class='ionicon-fill-none ionicon-stroke-width'/></svg>",M="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M96 256h320M96 176h320M96 336h320' class='ionicon-fill-none ionicon-stroke-width'/></svg>",O="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-linejoin='round' stroke-width='44' d='M118 304h276M118 208h276' class='ionicon-fill-none'/></svg>",h="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' stroke-miterlimit='10' class='ionicon-fill-none ionicon-stroke-width'/><path stroke-linecap='round' stroke-miterlimit='10' d='M338.29 338.29L448 448' class='ionicon-fill-none ionicon-stroke-width'/></svg>",C="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z'/></svg>"},275:(b,p,a)=>{a.d(p,{c:()=>c,g:()=>e});var _=a(8476),o=a(5638),l=a(4929);const c=(t,n,f)=>{let d,r;if(void 0!==_.w&&"MutationObserver"in _.w){const m=Array.isArray(n)?n:[n];d=new MutationObserver(y=>{for(const g of y)for(const v of g.addedNodes)if(v.nodeType===Node.ELEMENT_NODE&&m.includes(v.slot))return f(),void(0,o.r)(()=>i(v))}),d.observe(t,{childList:!0})}const i=m=>{var y;r&&(r.disconnect(),r=void 0),r=new MutationObserver(g=>{f();for(const v of g)for(const w of v.removedNodes)w.nodeType===Node.ELEMENT_NODE&&w.slot===n&&u()}),r.observe(null!==(y=m.parentElement)&&void 0!==y?y:m,{subtree:!0,childList:!0})},u=()=>{r&&(r.disconnect(),r=void 0)};return{destroy:()=>{d&&(d.disconnect(),d=void 0),u()}}},e=(t,n,f)=>{const d=null==t?0:t.toString().length,r=s(d,n);if(void 0===f)return r;try{return f(d,n)}catch(i){return(0,l.a)("Exception in provided `counterFormatter`.",i),r}},s=(t,n)=>`${t} / ${n}`},1622:(b,p,a)=>{a.r(p),a.d(p,{KEYBOARD_DID_CLOSE:()=>e,KEYBOARD_DID_OPEN:()=>c,copyVisualViewport:()=>O,keyboardDidClose:()=>g,keyboardDidOpen:()=>m,keyboardDidResize:()=>y,resetKeyboardAssist:()=>d,setKeyboardClose:()=>u,setKeyboardOpen:()=>E,startKeyboardAssist:()=>r,trackViewportChanges:()=>M});var _=a(4379);a(8438),a(8476);const c="ionKeyboardDidShow",e="ionKeyboardDidHide";let t={},n={},f=!1;const d=()=>{t={},n={},f=!1},r=h=>{if(_.K.getEngine())i(h);else{if(!h.visualViewport)return;n=O(h.visualViewport),h.visualViewport.onresize=()=>{M(h),m()||y(h)?E(h):g(h)&&u(h)}}},i=h=>{h.addEventListener("keyboardDidShow",C=>E(h,C)),h.addEventListener("keyboardDidHide",()=>u(h))},E=(h,C)=>{v(h,C),f=!0},u=h=>{w(h),f=!1},m=()=>!f&&t.width===n.width&&(t.height-n.height)*n.scale>150,y=h=>f&&!g(h),g=h=>f&&n.height===h.innerHeight,v=(h,C)=>{const D=new CustomEvent(c,{detail:{keyboardHeight:C?C.keyboardHeight:h.innerHeight-n.height}});h.dispatchEvent(D)},w=h=>{const C=new CustomEvent(e);h.dispatchEvent(C)},M=h=>{t=Object.assign({},n),n=O(h.visualViewport)},O=h=>({width:Math.round(h.width),height:Math.round(h.height),offsetTop:h.offsetTop,offsetLeft:h.offsetLeft,pageTop:h.pageTop,pageLeft:h.pageLeft,scale:h.scale})},4379:(b,p,a)=>{a.d(p,{K:()=>c,a:()=>l});var _=a(8438),o=function(e){return e.Unimplemented="UNIMPLEMENTED",e.Unavailable="UNAVAILABLE",e}(o||{}),l=function(e){return e.Body="body",e.Ionic="ionic",e.Native="native",e.None="none",e}(l||{});const c={getEngine(){const e=(0,_.g)();if(e?.isPluginAvailable("Keyboard"))return e.Plugins.Keyboard},getResizeMode(){const e=this.getEngine();return e?.getResizeMode?e.getResizeMode().catch(s=>{if(s.code!==o.Unimplemented)throw s}):Promise.resolve(void 0)}}},4731:(b,p,a)=>{a.d(p,{c:()=>s});var _=a(467),o=a(8476),l=a(4379);const c=t=>void 0===o.d||t===l.a.None||void 0===t?null:o.d.querySelector("ion-app")??o.d.body,e=t=>{const n=c(t);return null===n?0:n.clientHeight},s=function(){var t=(0,_.A)(function*(n){let f,d,r,i;const E=function(){var v=(0,_.A)(function*(){const w=yield l.K.getResizeMode(),M=void 0===w?void 0:w.mode;f=()=>{void 0===i&&(i=e(M)),r=!0,u(r,M)},d=()=>{r=!1,u(r,M)},null==o.w||o.w.addEventListener("keyboardWillShow",f),null==o.w||o.w.addEventListener("keyboardWillHide",d)});return function(){return v.apply(this,arguments)}}(),u=(v,w)=>{n&&n(v,m(w))},m=v=>{if(0===i||i===e(v))return;const w=c(v);return null!==w?new Promise(M=>{const h=new ResizeObserver(()=>{w.clientHeight===i&&(h.disconnect(),M())});h.observe(w)}):void 0};return yield E(),{init:E,destroy:()=>{null==o.w||o.w.removeEventListener("keyboardWillShow",f),null==o.w||o.w.removeEventListener("keyboardWillHide",d),f=d=void 0},isKeyboardVisible:()=>r}});return function(f){return t.apply(this,arguments)}}()},7838:(b,p,a)=>{a.d(p,{c:()=>o});var _=a(467);const o=()=>{let l;return{lock:function(){var e=(0,_.A)(function*(){const s=l;let t;return l=new Promise(n=>t=n),void 0!==s&&(yield s),t});return function(){return e.apply(this,arguments)}}()}}},2172:(b,p,a)=>{a.d(p,{c:()=>l});var _=a(8476),o=a(5638);const l=(c,e,s)=>{let t;const n=()=>!(void 0===e()||void 0!==c.label||null===s()),d=()=>{const i=e();if(void 0===i)return;if(!n())return void i.style.removeProperty("width");const E=s().scrollWidth;if(0===E&&null===i.offsetParent&&void 0!==_.w&&"IntersectionObserver"in _.w){if(void 0!==t)return;const u=t=new IntersectionObserver(m=>{1===m[0].intersectionRatio&&(d(),u.disconnect(),t=void 0)},{threshold:.01,root:c});u.observe(i)}else i.style.setProperty("width",.75*E+"px")};return{calculateNotchWidth:()=>{n()&&(0,o.r)(()=>{d()})},destroy:()=>{t&&(t.disconnect(),t=void 0)}}}},7895:(b,p,a)=>{a.d(p,{S:()=>o});const o={bubbles:{dur:1e3,circles:9,fn:(l,c,e)=>{const s=l*c/e-l+"ms",t=2*Math.PI*c/e;return{r:5,style:{top:32*Math.sin(t)+"%",left:32*Math.cos(t)+"%","animation-delay":s}}}},circles:{dur:1e3,circles:8,fn:(l,c,e)=>{const s=c/e,t=l*s-l+"ms",n=2*Math.PI*s;return{r:5,style:{top:32*Math.sin(n)+"%",left:32*Math.cos(n)+"%","animation-delay":t}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:()=>({r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}})},crescent:{dur:750,circles:1,fn:()=>({r:26,style:{}})},dots:{dur:750,circles:3,fn:(l,c)=>({r:6,style:{left:32-32*c+"%","animation-delay":-110*c+"ms"}})},lines:{dur:1e3,lines:8,fn:(l,c,e)=>({y1:14,y2:26,style:{transform:`rotate(${360/e*c+(c<e/2?180:-180)}deg)`,"animation-delay":l*c/e-l+"ms"}})},"lines-small":{dur:1e3,lines:8,fn:(l,c,e)=>({y1:12,y2:20,style:{transform:`rotate(${360/e*c+(c<e/2?180:-180)}deg)`,"animation-delay":l*c/e-l+"ms"}})},"lines-sharp":{dur:1e3,lines:12,fn:(l,c,e)=>({y1:17,y2:29,style:{transform:`rotate(${30*c+(c<6?180:-180)}deg)`,"animation-delay":l*c/e-l+"ms"}})},"lines-sharp-small":{dur:1e3,lines:12,fn:(l,c,e)=>({y1:12,y2:20,style:{transform:`rotate(${30*c+(c<6?180:-180)}deg)`,"animation-delay":l*c/e-l+"ms"}})}}},6492:(b,p,a)=>{a.r(p),a.d(p,{createSwipeBackGesture:()=>e});var _=a(5638),o=a(5083),l=a(405);a(8221);const e=(s,t,n,f,d)=>{const r=s.ownerDocument.defaultView;let i=(0,o.i)(s);const u=w=>i?-w.deltaX:w.deltaX;return(0,l.createGesture)({el:s,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:w=>(i=(0,o.i)(s),(w=>{const{startX:O}=w;return i?O>=r.innerWidth-50:O<=50})(w)&&t()),onStart:n,onMove:w=>{const O=u(w)/r.innerWidth;f(O)},onEnd:w=>{const M=u(w),O=r.innerWidth,h=M/O,C=(w=>i?-w.velocityX:w.velocityX)(w),D=C>=0&&(C>.2||M>O/2),k=(D?1-h:h)*O;let I=0;if(k>5){const x=k/Math.abs(C);I=Math.min(x,540)}d(D,h<=0?.01:(0,_.l)(0,h,.9999),I)}})}},2935:(b,p,a)=>{a.d(p,{w:()=>_});const _=(c,e,s)=>{if(typeof MutationObserver>"u")return;const t=new MutationObserver(n=>{s(o(n,e))});return t.observe(c,{childList:!0,subtree:!0}),t},o=(c,e)=>{let s;return c.forEach(t=>{for(let n=0;n<t.addedNodes.length;n++)s=l(t.addedNodes[n],e)||s}),s},l=(c,e)=>{if(1!==c.nodeType)return;const s=c;return(s.tagName===e.toUpperCase()?[s]:Array.from(s.querySelectorAll(e))).find(n=>n.value===s.value)}},7530:(b,p,a)=>{a.d(p,{e:()=>r});var _=a(5329),o=a(4438),l=a(177),c=a(8974),e=a(4247);function s(i,E){if(1&i&&o.nrm(0,"ion-checkbox",10),2&i){const u=o.XpG().$implicit,m=o.XpG().ngIf;o.Y8G("checked",m[u].checked)}}function t(i,E){if(1&i){const u=o.RV6();o.j41(0,"ion-item",4),o.bIt("click",function(){const y=o.eBV(u).$implicit,g=o.XpG().ngIf,v=o.XpG(2);return o.Njj(v.showModal(g[y]))}),o.DNE(1,s,1,1,"ion-checkbox",5),o.j41(2,"ion-label")(3,"div",6)(4,"span",7),o.EFF(5),o.k0s()(),o.j41(6,"div",8)(7,"span",9),o.EFF(8),o.k0s()()()()}if(2&i){const u=E.$implicit,m=o.XpG().ngIf,y=o.XpG(2);o.R7$(),o.Y8G("ngIf",y.edit),o.R7$(4),o.JRh(m[u].word),o.R7$(3),o.JRh(m[u].definition)}}function n(i,E){if(1&i&&(o.j41(0,"div"),o.DNE(1,t,9,3,"ion-item",3),o.k0s()),2&i){const u=o.XpG(2);o.R7$(),o.Y8G("ngForOf",u.entryIDS)}}function f(i,E){if(1&i&&(o.j41(0,"ion-list"),o.DNE(1,n,2,1,"div",1),o.nI1(2,"async"),o.k0s()),2&i){const u=o.XpG();o.R7$(),o.Y8G("ngIf",o.bMT(2,1,u.$entriesHash))}}function d(i,E){if(1&i){const u=o.RV6();o.j41(0,"ion-header")(1,"ion-toolbar")(2,"ion-title"),o.EFF(3,"Modal"),o.k0s(),o.j41(4,"ion-buttons",11)(5,"ion-button",12),o.bIt("click",function(){o.eBV(u);const y=o.XpG();return o.Njj(y.isModalOpen=!1)}),o.EFF(6,"Close"),o.k0s()()()(),o.j41(7,"ion-content",13),o.nrm(8,"mtd-entry",14),o.k0s()}if(2&i){const u=o.XpG();o.R7$(8),o.Y8G("entry",u.modalEntry)}}let r=(()=>{class i{constructor(u){this.dataService=u,this.edit=!1,this.entryIDS=[],this.isModalOpen=!1,this.$entriesHash=this.dataService.$entriesHash}ngOnInit(){this.getEntryIDS()}getEntryIDS(){const u=[];this.entries.forEach(m=>{m.entryID&&u.push(m.entryID)}),this.entryIDS=u}showModal(u){this.modalEntry=u,this.isModalOpen=!0}setOpen(u){this.isModalOpen=u}didDismiss(){this.isModalOpen=!1}ngOnChanges(){this.getEntryIDS(),void 0!==this.parentEdit&&(this.edit=this.parentEdit)}trackByFn(u,m){return console.log(m),console.log(u),m.entryID}static#o=this.\u0275fac=function(m){return new(m||i)(o.rXU(_.u))};static#t=this.\u0275cmp=o.VBU({type:i,selectors:[["mtd-entry-list"]],inputs:{parentEdit:"parentEdit",entries:"entries"},features:[o.OA$],decls:4,vars:2,consts:[[1,"browseElements"],[4,"ngIf"],[3,"didDismiss","isOpen"],["class","matchContainer","text-wrap","",3,"click",4,"ngFor","ngForOf"],["text-wrap","",1,"matchContainer",3,"click"],["color","danger",3,"checked",4,"ngIf"],[1,"langMatched","matchLeftContainer"],[1,"langMatched","response","browseL1"],[1,"matchRightContainer"],[1,"response","matchRightDiv"],["color","danger",3,"checked"],["slot","end"],[3,"click"],[1,"ion-padding"],[3,"entry"]],template:function(m,y){1&m&&(o.j41(0,"div",0),o.DNE(1,f,3,3,"ion-list",1),o.j41(2,"ion-modal",2),o.bIt("didDismiss",function(){return y.didDismiss()}),o.DNE(3,d,9,1,"ng-template"),o.k0s()()),2&m&&(o.R7$(),o.Y8G("ngIf",y.entries.length>0),o.R7$(),o.Y8G("isOpen",y.isModalOpen))},dependencies:[l.Sq,l.bT,c.Jm,c.QW,c.eY,c.W9,c.eU,c.uz,c.he,c.nf,c.BC,c.ai,c.Sb,c.hB,e.a,l.Jj],styles:[":root{--ion-color-primary: #3880ff;--ion-color-primary-rgb: 56, 128, 255;--ion-color-primary-contrast: #ffffff;--ion-color-primary-contrast-rgb: 255, 255, 255;--ion-color-primary-shade: #3171e0;--ion-color-primary-tint: #4c8dff;--ion-color-secondary: #3dc2ff;--ion-color-secondary-rgb: 61, 194, 255;--ion-color-secondary-contrast: #ffffff;--ion-color-secondary-contrast-rgb: 255, 255, 255;--ion-color-secondary-shade: #36abe0;--ion-color-secondary-tint: #50c8ff;--ion-color-tertiary: #5260ff;--ion-color-tertiary-rgb: 82, 96, 255;--ion-color-tertiary-contrast: #ffffff;--ion-color-tertiary-contrast-rgb: 255, 255, 255;--ion-color-tertiary-shade: #4854e0;--ion-color-tertiary-tint: #6370ff;--ion-color-success: #2dd36f;--ion-color-success-rgb: 45, 211, 111;--ion-color-success-contrast: #ffffff;--ion-color-success-contrast-rgb: 255, 255, 255;--ion-color-success-shade: #28ba62;--ion-color-success-tint: #42d77d;--ion-color-warning: #ffc409;--ion-color-warning-rgb: 255, 196, 9;--ion-color-warning-contrast: #000000;--ion-color-warning-contrast-rgb: 0, 0, 0;--ion-color-warning-shade: #e0ac08;--ion-color-warning-tint: #ffca22;--ion-color-danger: #eb445a;--ion-color-danger-rgb: 235, 68, 90;--ion-color-danger-contrast: #ffffff;--ion-color-danger-contrast-rgb: 255, 255, 255;--ion-color-danger-shade: #cf3c4f;--ion-color-danger-tint: #ed576b;--ion-color-dark: #222428;--ion-color-dark-rgb: 34, 36, 40;--ion-color-dark-contrast: #ffffff;--ion-color-dark-contrast-rgb: 255, 255, 255;--ion-color-dark-shade: #1e2023;--ion-color-dark-tint: #383a3e;--ion-color-medium: #92949c;--ion-color-medium-rgb: 146, 148, 156;--ion-color-medium-contrast: #ffffff;--ion-color-medium-contrast-rgb: 255, 255, 255;--ion-color-medium-shade: #808289;--ion-color-medium-tint: #9d9fa6;--ion-color-light: #f4f5f8;--ion-color-light-rgb: 244, 245, 248;--ion-color-light-contrast: #000000;--ion-color-light-contrast-rgb: 0, 0, 0;--ion-color-light-shade: #d7d8da;--ion-color-light-tint: #f5f6f9}@media (prefers-color-scheme: dark){body{--ion-color-primary: #428cff;--ion-color-primary-rgb: 66, 140, 255;--ion-color-primary-contrast: #ffffff;--ion-color-primary-contrast-rgb: 255, 255, 255;--ion-color-primary-shade: #3a7be0;--ion-color-primary-tint: #5598ff;--ion-color-secondary: #50c8ff;--ion-color-secondary-rgb: 80, 200, 255;--ion-color-secondary-contrast: #ffffff;--ion-color-secondary-contrast-rgb: 255, 255, 255;--ion-color-secondary-shade: #46b0e0;--ion-color-secondary-tint: #62ceff;--ion-color-tertiary: #6a64ff;--ion-color-tertiary-rgb: 106, 100, 255;--ion-color-tertiary-contrast: #ffffff;--ion-color-tertiary-contrast-rgb: 255, 255, 255;--ion-color-tertiary-shade: #5d58e0;--ion-color-tertiary-tint: #7974ff;--ion-color-success: #2fdf75;--ion-color-success-rgb: 47, 223, 117;--ion-color-success-contrast: #000000;--ion-color-success-contrast-rgb: 0, 0, 0;--ion-color-success-shade: #29c467;--ion-color-success-tint: #44e283;--ion-color-warning: #ffd534;--ion-color-warning-rgb: 255, 213, 52;--ion-color-warning-contrast: #000000;--ion-color-warning-contrast-rgb: 0, 0, 0;--ion-color-warning-shade: #e0bb2e;--ion-color-warning-tint: #ffd948;--ion-color-danger: #ff4961;--ion-color-danger-rgb: 255, 73, 97;--ion-color-danger-contrast: #ffffff;--ion-color-danger-contrast-rgb: 255, 255, 255;--ion-color-danger-shade: #e04055;--ion-color-danger-tint: #ff5b71;--ion-color-dark: #f4f5f8;--ion-color-dark-rgb: 244, 245, 248;--ion-color-dark-contrast: #000000;--ion-color-dark-contrast-rgb: 0, 0, 0;--ion-color-dark-shade: #d7d8da;--ion-color-dark-tint: #f5f6f9;--ion-color-medium: #989aa2;--ion-color-medium-rgb: 152, 154, 162;--ion-color-medium-contrast: #000000;--ion-color-medium-contrast-rgb: 0, 0, 0;--ion-color-medium-shade: #86888f;--ion-color-medium-tint: #a2a4ab;--ion-color-light: #222428;--ion-color-light-rgb: 34, 36, 40;--ion-color-light-contrast: #ffffff;--ion-color-light-contrast-rgb: 255, 255, 255;--ion-color-light-shade: #1e2023;--ion-color-light-tint: #383a3e}.ios body{--ion-background-color: #000000;--ion-background-color-rgb: 0, 0, 0;--ion-text-color: #ffffff;--ion-text-color-rgb: 255, 255, 255;--ion-color-step-50: #0d0d0d;--ion-color-step-100: #1a1a1a;--ion-color-step-150: #262626;--ion-color-step-200: #333333;--ion-color-step-250: #404040;--ion-color-step-300: #4d4d4d;--ion-color-step-350: #595959;--ion-color-step-400: #666666;--ion-color-step-450: #737373;--ion-color-step-500: #808080;--ion-color-step-550: #8c8c8c;--ion-color-step-600: #999999;--ion-color-step-650: #a6a6a6;--ion-color-step-700: #b3b3b3;--ion-color-step-750: #bfbfbf;--ion-color-step-800: #cccccc;--ion-color-step-850: #d9d9d9;--ion-color-step-900: #e6e6e6;--ion-color-step-950: #f2f2f2;--ion-item-background: #000000;--ion-card-background: #1c1c1d}.ios ion-modal{--ion-background-color: var(--ion-color-step-100);--ion-toolbar-background: var(--ion-color-step-150);--ion-toolbar-border-color: var(--ion-color-step-250)}.md body{--ion-background-color: #121212;--ion-background-color-rgb: 18, 18, 18;--ion-text-color: #ffffff;--ion-text-color-rgb: 255, 255, 255;--ion-border-color: #222222;--ion-color-step-50: #1e1e1e;--ion-color-step-100: #2a2a2a;--ion-color-step-150: #363636;--ion-color-step-200: #414141;--ion-color-step-250: #4d4d4d;--ion-color-step-300: #595959;--ion-color-step-350: #656565;--ion-color-step-400: #717171;--ion-color-step-450: #7d7d7d;--ion-color-step-500: #898989;--ion-color-step-550: #949494;--ion-color-step-600: #a0a0a0;--ion-color-step-650: #acacac;--ion-color-step-700: #b8b8b8;--ion-color-step-750: #c4c4c4;--ion-color-step-800: #d0d0d0;--ion-color-step-850: #dbdbdb;--ion-color-step-900: #e7e7e7;--ion-color-step-950: #f3f3f3;--ion-item-background: #1e1e1e;--ion-toolbar-background: #1f1f1f;--ion-tab-bar-background: #1f1f1f;--ion-card-background: #1e1e1e}}.browseElements{margin:auto;height:auto;width:auto;text-align:center;background-color:var(--ion-color-medium)}.browseElements{margin:auto;height:auto;width:auto;text-align:center!important;background-color:var(--ion-color-medium)}.matchContainer{margin:1em 0;text-align:center}.matchLeftDiv{margin-right:.2em;text-align:left}.matchLeftContainer,.matchRightContainer{display:initial}.matchRightDiv{margin-left:.2em}.matchResponse{margin:2.5em 0 .75em;text-decoration:underline}.browseL1{color:var(--ion-color-secondary)}.matchLeftDiv .langMatched,.matchRightDiv .langMatched{color:var(--ion-color-secondary);font-weight:900}\n"],encapsulation:2})}return i})()}}]);