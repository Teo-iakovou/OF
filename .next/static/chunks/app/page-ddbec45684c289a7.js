(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{5531:function(e,r,n){"use strict";n.d(r,{Z:function(){return createLucideIcon}});var d=n(2265);/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let toKebabCase=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),toCamelCase=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,n)=>n?n.toUpperCase():r.toLowerCase()),toPascalCase=e=>{let r=toCamelCase(e);return r.charAt(0).toUpperCase()+r.slice(1)},mergeClasses=(...e)=>e.filter((e,r,n)=>!!e&&""!==e.trim()&&n.indexOf(e)===r).join(" ").trim(),hasA11yProp=e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0};/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.515.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let m=(0,d.forwardRef)(({color:e="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:m,className:f="",children:h,iconNode:g,...x},b)=>(0,d.createElement)("svg",{ref:b,...c,width:r,height:r,stroke:e,strokeWidth:m?24*Number(n)/Number(r):n,className:mergeClasses("lucide",f),...!h&&!hasA11yProp(x)&&{"aria-hidden":"true"},...x},[...g.map(([e,r])=>(0,d.createElement)(e,r)),...Array.isArray(h)?h:[h]])),createLucideIcon=(e,r)=>{let n=(0,d.forwardRef)(({className:n,...c},f)=>(0,d.createElement)(m,{ref:f,iconNode:r,className:mergeClasses(`lucide-${toKebabCase(toPascalCase(e))}`,`lucide-${e}`,n),...c}));return n.displayName=toPascalCase(e),n}},2176:function(e,r,n){"use strict";n.d(r,{Z:function(){return c}});var d=n(5531);let c=(0,d.Z)("message-circle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]])},3240:function(e,r,n){Promise.resolve().then(n.bind(n,4816))},4816:function(e,r,n){"use strict";n.r(r),n.d(r,{default:function(){return Page}});var d=n(7437),c=n(9219),m=n(9360);function FeatureComparison(){return(0,d.jsx)(m.Z,{as:"section",id:"features",className:"py-20 bg-gray-900 text-white",children:(0,d.jsxs)("div",{className:"container mx-auto px-6",children:[(0,d.jsx)("h2",{className:"text-4xl font-bold text-center mb-12",children:"Feature Comparison"}),(0,d.jsx)("div",{className:"overflow-x-auto rounded-lg",children:(0,d.jsxs)("table",{className:"min-w-full bg-gray-800 border border-gray-700 text-center",children:[(0,d.jsx)("thead",{children:(0,d.jsxs)("tr",{className:"bg-gray-700 text-pink-400 text-lg",children:[(0,d.jsx)("th",{className:"p-4",children:"Feature"}),(0,d.jsx)("th",{className:"p-4",children:"Lite"}),(0,d.jsx)("th",{className:"p-4",children:"Pro"}),(0,d.jsx)("th",{className:"p-4",children:"Ultimate"})]})}),(0,d.jsxs)("tbody",{children:[(0,d.jsxs)("tr",{className:"border-t border-gray-700",children:[(0,d.jsx)("td",{className:"p-4",children:"AI Recommendations"}),(0,d.jsx)("td",{className:"p-4",children:"✔"}),(0,d.jsx)("td",{className:"p-4",children:"✔"}),(0,d.jsx)("td",{className:"p-4",children:"✔"})]}),(0,d.jsxs)("tr",{className:"border-t border-gray-700",children:[(0,d.jsx)("td",{className:"p-4",children:"Platform Suggestion"}),(0,d.jsx)("td",{className:"p-4",children:"✔"}),(0,d.jsx)("td",{className:"p-4",children:"✔"}),(0,d.jsx)("td",{className:"p-4",children:"✔"})]}),(0,d.jsxs)("tr",{className:"border-t border-gray-700",children:[(0,d.jsx)("td",{className:"p-4",children:"Upload Limit"}),(0,d.jsx)("td",{className:"p-4",children:"10"}),(0,d.jsx)("td",{className:"p-4",children:"50"}),(0,d.jsx)("td",{className:"p-4",children:"Unlimited"})]})]})]})})]})})}var f=n(2265),h=n(5531);let g=(0,h.Z)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);function ScrollToTop(){let[e,r]=(0,f.useState)(!1);return((0,f.useEffect)(()=>{let handleScroll=()=>r(window.scrollY>200);return window.addEventListener("scroll",handleScroll),()=>window.removeEventListener("scroll",handleScroll)},[]),e)?(0,d.jsx)("button",{onClick:()=>window.scrollTo({top:0,behavior:"smooth"}),className:"fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg border border-gray-600 transition","aria-label":"Scroll to top",children:(0,d.jsx)(g,{className:"w-5 h-5"})}):null}var x=n(6354),b=n(5925),y=n(2176);function FeedbackWidget(){let[e,r]=(0,f.useState)(!1),[n,c]=(0,f.useState)(""),m=(0,f.useRef)(null),handleSubmit=async()=>{try{await (0,x.fA)(n),b.Am.success("Thank you for your feedback!"),c(""),r(!1)}catch(e){console.error("Feedback error:",e),b.Am.error("Something went wrong. Please try again.")}};return(0,f.useEffect)(()=>{let handleClickOutside=e=>{m.current&&!m.current.contains(e.target)&&r(!1)};return e&&document.addEventListener("mousedown",handleClickOutside),()=>document.removeEventListener("mousedown",handleClickOutside)},[e]),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)("button",{onClick:()=>r(!0),className:"fixed bottom-6 left-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg border border-gray-600 flex items-center gap-2 z-50 transition",children:[(0,d.jsx)(y.Z,{className:"w-4 h-4"}),"Feedback"]}),e&&(0,d.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50",children:(0,d.jsxs)("div",{ref:m,className:"bg-[#181F28] text-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-700",children:[(0,d.jsx)("h2",{className:"text-xl font-bold mb-4",children:"We value your feedback"}),(0,d.jsx)("textarea",{className:"w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm",placeholder:"Your feedback...",rows:4,value:n,onChange:e=>c(e.target.value)}),(0,d.jsxs)("div",{className:"flex justify-end mt-4 space-x-3",children:[(0,d.jsx)("button",{onClick:()=>r(!1),className:"px-4 py-2 text-sm rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition",children:"Cancel"}),(0,d.jsx)("button",{onClick:handleSubmit,className:"bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-sm text-white rounded-md transition",children:"Send"})]})]})})]})}function Page(){return(0,d.jsx)(d.Fragment,{children:(0,d.jsxs)("div",{className:"bg-gray-900 text-white min-h-screen flex flex-col",children:[(0,d.jsxs)(m.Z,{as:"div",className:"text-center py-32 bg-gradient-to-r from-pink-500 to-purple-600",children:[(0,d.jsx)("h1",{className:"text-5xl font-extrabold text-white mb-4",children:"AI Content Helper"}),(0,d.jsx)("p",{className:"text-xl text-gray-200 mb-8",children:"Analyze your content and unlock valuable insights for your platform."}),(0,d.jsx)("button",{className:"bg-white text-black font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100",children:"Get Started"})]}),(0,d.jsx)("main",{className:"container mx-auto px-6 flex-1",children:(0,d.jsx)(m.Z,{as:"section",className:"py-16",children:(0,d.jsx)(c.Z,{})})}),(0,d.jsx)(m.Z,{as:"div",children:(0,d.jsx)(FeatureComparison,{})}),(0,d.jsx)(ScrollToTop,{}),(0,d.jsx)(FeedbackWidget,{})]})})}},5925:function(e,r,n){"use strict";let d,c;n.d(r,{x7:function(){return Fe},Am:function(){return dist_n}});var m,f=n(2265);let h={data:""},t=e=>{if("object"==typeof window){let r=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return r.nonce=window.__nonce__,r.parentNode||(e||document.head).appendChild(r),r.firstChild}return e||h},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,x=/\/\*[^]*?\*\/|  +/g,b=/\n+/g,o=(e,r)=>{let n="",d="",c="";for(let m in e){let f=e[m];"@"==m[0]?"i"==m[1]?n=m+" "+f+";":d+="f"==m[1]?o(f,m):m+"{"+o(f,"k"==m[1]?"":r)+"}":"object"==typeof f?d+=o(f,r?r.replace(/([^,])+/g,e=>m.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,r=>/&/.test(r)?r.replace(/&/g,e):e?e+" "+r:r)):m):null!=f&&(m=/^--/.test(m)?m:m.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=o.p?o.p(m,f):m+":"+f+";")}return n+(r&&c?r+"{"+c+"}":c)+d},y={},s=e=>{if("object"==typeof e){let r="";for(let n in e)r+=n+s(e[n]);return r}return e},i=(e,r,n,d,c)=>{var m;let f=s(e),h=y[f]||(y[f]=(e=>{let r=0,n=11;for(;r<e.length;)n=101*n+e.charCodeAt(r++)>>>0;return"go"+n})(f));if(!y[h]){let r=f!==e?e:(e=>{let r,n,d=[{}];for(;r=g.exec(e.replace(x,""));)r[4]?d.shift():r[3]?(n=r[3].replace(b," ").trim(),d.unshift(d[0][n]=d[0][n]||{})):d[0][r[1]]=r[2].replace(b," ").trim();return d[0]})(e);y[h]=o(c?{["@keyframes "+h]:r}:r,n?"":"."+h)}let v=n&&y.g?y.g:null;return n&&(y.g=y[h]),m=y[h],v?r.data=r.data.replace(v,m):-1===r.data.indexOf(m)&&(r.data=d?m+r.data:r.data+m),h},p=(e,r,n)=>e.reduce((e,d,c)=>{let m=r[c];if(m&&m.call){let e=m(n),r=e&&e.props&&e.props.className||/^go/.test(e)&&e;m=r?"."+r:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+d+(null==m?"":m)},"");function u(e){let r=this||{},n=e.call?e(r.p):e;return i(n.unshift?n.raw?p(n,[].slice.call(arguments,1),r.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(r.p):n),{}):n,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let v,j,N,k=u.bind({k:1});function w(e,r){let n=this||{};return function(){let d=arguments;function a(c,m){let f=Object.assign({},c),h=f.className||a.className;n.p=Object.assign({theme:j&&j()},f),n.o=/ *go\d+/.test(h),f.className=u.apply(n,d)+(h?" "+h:""),r&&(f.ref=m);let g=e;return e[0]&&(g=f.as||e,delete f.as),N&&g[0]&&N(f),v(g,f)}return r?r(a):a}}var Z=e=>"function"==typeof e,dist_h=(e,r)=>Z(e)?e(r):e,C=(d=0,()=>(++d).toString()),E=()=>{if(void 0===c&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");c=!e||e.matches}return c},A="default",H=(e,r)=>{let{toastLimit:n}=e.settings;switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,n)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===r.toast.id?{...e,...r.toast}:e)};case 2:let{toast:d}=r;return H(e,{type:e.toasts.find(e=>e.id===d.id)?1:0,toast:d});case 3:let{toastId:c}=r;return{...e,toasts:e.toasts.map(e=>e.id===c||void 0===c?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===r.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let m=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+m}))}}},O=[],L={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},F={},Y=(e,r=A)=>{F[r]=H(F[r]||L,e),O.forEach(([e,n])=>{e===r&&n(F[r])})},_=e=>Object.keys(F).forEach(r=>Y(e,r)),Q=e=>Object.keys(F).find(r=>F[r].toasts.some(r=>r.id===e)),S=(e=A)=>r=>{Y(r,e)},z={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},V=(e={},r=A)=>{let[n,d]=(0,f.useState)(F[r]||L),c=(0,f.useRef)(F[r]);(0,f.useEffect)(()=>(c.current!==F[r]&&d(F[r]),O.push([r,d]),()=>{let e=O.findIndex(([e])=>e===r);e>-1&&O.splice(e,1)}),[r]);let m=n.toasts.map(r=>{var n,d,c;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||(null==(n=e[r.type])?void 0:n.removeDelay)||(null==e?void 0:e.removeDelay),duration:r.duration||(null==(d=e[r.type])?void 0:d.duration)||(null==e?void 0:e.duration)||z[r.type],style:{...e.style,...null==(c=e[r.type])?void 0:c.style,...r.style}}});return{...n,toasts:m}},ie=(e,r="blank",n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...n,id:(null==n?void 0:n.id)||C()}),P=e=>(r,n)=>{let d=ie(r,e,n);return S(d.toasterId||Q(d.id))({type:2,toast:d}),d.id},dist_n=(e,r)=>P("blank")(e,r);dist_n.error=P("error"),dist_n.success=P("success"),dist_n.loading=P("loading"),dist_n.custom=P("custom"),dist_n.dismiss=(e,r)=>{let n={type:3,toastId:e};r?S(r)(n):_(n)},dist_n.dismissAll=e=>dist_n.dismiss(void 0,e),dist_n.remove=(e,r)=>{let n={type:4,toastId:e};r?S(r)(n):_(n)},dist_n.removeAll=e=>dist_n.remove(void 0,e),dist_n.promise=(e,r,n)=>{let d=dist_n.loading(r.loading,{...n,...null==n?void 0:n.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let c=r.success?dist_h(r.success,e):void 0;return c?dist_n.success(c,{id:d,...n,...null==n?void 0:n.success}):dist_n.dismiss(d),e}).catch(e=>{let c=r.error?dist_h(r.error,e):void 0;c?dist_n.error(c,{id:d,...n,...null==n?void 0:n.error}):dist_n.dismiss(d)}),e};var I=1e3,dist_w=(e,r="default")=>{let{toasts:n,pausedAt:d}=V(e,r),c=(0,f.useRef)(new Map).current,m=(0,f.useCallback)((e,r=I)=>{if(c.has(e))return;let n=setTimeout(()=>{c.delete(e),h({type:4,toastId:e})},r);c.set(e,n)},[]);(0,f.useEffect)(()=>{if(d)return;let e=Date.now(),c=n.map(n=>{if(n.duration===1/0)return;let d=(n.duration||0)+n.pauseDuration-(e-n.createdAt);if(d<0){n.visible&&dist_n.dismiss(n.id);return}return setTimeout(()=>dist_n.dismiss(n.id,r),d)});return()=>{c.forEach(e=>e&&clearTimeout(e))}},[n,d,r]);let h=(0,f.useCallback)(S(r),[r]),g=(0,f.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),x=(0,f.useCallback)((e,r)=>{h({type:1,toast:{id:e,height:r}})},[h]),b=(0,f.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),y=(0,f.useCallback)((e,r)=>{let{reverseOrder:d=!1,gutter:c=8,defaultPosition:m}=r||{},f=n.filter(r=>(r.position||m)===(e.position||m)&&r.height),h=f.findIndex(r=>r.id===e.id),g=f.filter((e,r)=>r<h&&e.visible).length;return f.filter(e=>e.visible).slice(...d?[g+1]:[0,g]).reduce((e,r)=>e+(r.height||0)+c,0)},[n]);return(0,f.useEffect)(()=>{n.forEach(e=>{if(e.dismissed)m(e.id,e.removeDelay);else{let r=c.get(e.id);r&&(clearTimeout(r),c.delete(e.id))}})},[n,m]),{toasts:n,handlers:{updateHeight:x,startPause:g,endPause:b,calculateOffset:y}}},D=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,T=k`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=k`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,U=k`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,W=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${U} 1s linear infinite;
`,B=k`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,K=k`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,q=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${K} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,G=w("div")`
  position: absolute;
`,J=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,X=k`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${X} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,$=({toast:e})=>{let{icon:r,type:n,iconTheme:d}=e;return void 0!==r?"string"==typeof r?f.createElement(ee,null,r):r:"blank"===n?null:f.createElement(J,null,f.createElement(W,{...d}),"loading"!==n&&f.createElement(G,null,"error"===n?f.createElement(R,{...d}):f.createElement(q,{...d})))},Re=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Ee=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,et=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,er=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ke=(e,r)=>{let n=e.includes("top")?1:-1,[d,c]=E()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[Re(n),Ee(n)];return{animation:r?`${k(d)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${k(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},es=f.memo(({toast:e,position:r,style:n,children:d})=>{let c=e.height?ke(e.position||r||"top-center",e.visible):{opacity:0},m=f.createElement($,{toast:e}),h=f.createElement(er,{...e.ariaProps},dist_h(e.message,e));return f.createElement(et,{className:e.className,style:{...c,...n,...e.style}},"function"==typeof d?d({icon:m,message:h}):f.createElement(f.Fragment,null,m,h))});m=f.createElement,o.p=void 0,v=m,j=void 0,N=void 0;var we=({id:e,className:r,style:n,onHeightUpdate:d,children:c})=>{let m=f.useCallback(r=>{if(r){let l=()=>{d(e,r.getBoundingClientRect().height)};l(),new MutationObserver(l).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,d]);return f.createElement("div",{ref:m,className:r,style:n},c)},Me=(e,r)=>{let n=e.includes("top"),d=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:E()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...d}},ea=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Fe=({reverseOrder:e,position:r="top-center",toastOptions:n,gutter:d,children:c,toasterId:m,containerStyle:h,containerClassName:g})=>{let{toasts:x,handlers:b}=dist_w(n,m);return f.createElement("div",{"data-rht-toaster":m||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...h},className:g,onMouseEnter:b.startPause,onMouseLeave:b.endPause},x.map(n=>{let m=n.position||r,h=Me(m,b.calculateOffset(n,{reverseOrder:e,gutter:d,defaultPosition:r}));return f.createElement(we,{id:n.id,key:n.id,onHeightUpdate:b.updateHeight,className:n.visible?ea:"",style:h},"custom"===n.type?dist_h(n.message,n):c?c(n):f.createElement(es,{toast:n,position:m}))}))}}},function(e){e.O(0,[922,426,971,472,744],function(){return e(e.s=3240)}),_N_E=e.O()}]);