"use strict";(self.webpackChunkmtd_mobile_ui=self.webpackChunkmtd_mobile_ui||[]).push([[9865],{9865:(W,h,E)=>{E.r(h),E.d(h,{startTapClick:()=>I});var u=E(544);const I=o=>{let e,p,i,s=10*-m,r=0;const U=o.getBoolean("animated",!0)&&o.getBoolean("rippleEffect",!0),f=new WeakMap,L=t=>{s=(0,u.u)(t),R(t)},A=()=>{i&&clearTimeout(i),i=void 0,e&&(S(!1),e=void 0)},D=t=>{e||w(k(t),t)},R=t=>{w(void 0,t)},w=(t,n)=>{if(t&&t===e)return;i&&clearTimeout(i),i=void 0;const{x:d,y:a}=(0,u.v)(n);if(e){if(f.has(e))throw new Error("internal error");e.classList.contains(l)||b(e,d,a),S(!0)}if(t){const _=f.get(t);_&&(clearTimeout(_),f.delete(t)),t.classList.remove(l);const g=()=>{b(t,d,a),i=void 0};v(t)?g():i=setTimeout(g,P)}e=t},b=(t,n,d)=>{if(r=Date.now(),t.classList.add(l),!U)return;const a=M(t);null!==a&&(C(),p=a.addRipple(n,d))},C=()=>{void 0!==p&&(p.then(t=>t()),p=void 0)},S=t=>{C();const n=e;if(!n)return;const d=T-Date.now()+r;if(t&&d>0&&!v(n)){const a=setTimeout(()=>{n.classList.remove(l),f.delete(n)},T);f.set(n,a)}else n.classList.remove(l)},c=document;c.addEventListener("ionGestureCaptured",A),c.addEventListener("touchstart",t=>{s=(0,u.u)(t),D(t)},!0),c.addEventListener("touchcancel",L,!0),c.addEventListener("touchend",L,!0),c.addEventListener("pointercancel",A,!0),c.addEventListener("mousedown",t=>{if(2===t.button)return;const n=(0,u.u)(t)-m;s<n&&D(t)},!0),c.addEventListener("mouseup",t=>{const n=(0,u.u)(t)-m;s<n&&R(t)},!0)},k=o=>{if(void 0===o.composedPath)return o.target.closest(".ion-activatable");{const s=o.composedPath();for(let r=0;r<s.length-2;r++){const e=s[r];if(!(e instanceof ShadowRoot)&&e.classList.contains("ion-activatable"))return e}}},v=o=>o.classList.contains("ion-activatable-instant"),M=o=>{if(o.shadowRoot){const s=o.shadowRoot.querySelector("ion-ripple-effect");if(s)return s}return o.querySelector("ion-ripple-effect")},l="ion-activated",P=100,T=150,m=2500}}]);