(()=>{var t={895:(t,e,r)=>{const{DOC:a,TAGS:i}=r(125),n=r(953);((t,e=a,r=!1)=>{e.addEventListener(t,(t=>({target:e}={})=>{let r;e&&"form"!==(r=(e.tagName||"").toLowerCase())&&"input"!==r&&"textarea"!==r&&n({eventName:t,elmt:e,tags:[i.design,i.sales],type:"gesture"})})(t),r)})("click")},705:(t,e,r)=>{const{DOC:a,TAGS:i}=r(125),n=r(953),o=new Map,s=t=>{try{let e,r=o.get(t);if("boolean"==typeof r)return{form:t,started:r};for(r=t;(r=r.parentNode)&&"form"!==(e=(r.tagName||"").toLowerCase())&&"body"!==e;);return o.set(t,r),{form:r,started:o.get(r)}}catch{return{}}},c=t=>{let e=t.querySelectorAll('input:not([type^="submit"]), textarea')||[],r=0,a=[],i=0;for(let t,n=0,o=e.length;n!==o;++n)((t=e[n]).getAttribute("value")||t.value)&&++r||a.push(t.getAttribute("name")||t.getAttribute("id")||++i&&"unknown");const n={totalFields:e.length,filled:r};return a.length&&(n.emptyFields=a),i&&(n.fieldsWithNoIdentifier=i),n};a.addEventListener("input",(({target:t}={})=>{if(!t)return;const{form:e,started:r}=s(t);r||e&&(n({eventName:"form-start",elmt:e,type:"data",tags:[i.design,i.sales]}),o.set(e,!0))})),a.addEventListener("submit",(({target:t}={})=>{if(!t)return;const{form:e,started:r}=s(t);r&&e&&(n({eventName:"form-submit",elmt:e,type:"data",tags:[i.design,i.sales],extra:c(e)}),o.set(e,!1))}))},117:(t,e,r)=>{const{WIN:a,DOC:i,TAGS:n}=r(125),o=r(953),s=r(485),c=new Map,d=(t,e)=>Math.min(Math.max(Math.round(100*t/e),0),100),l=s((({target:t}={})=>{if(!t)return;let e=c.get(t);e||c.set(t,e=(t=>{let e,r,s,c,l=0,g=1/0,u=1/0,m=0,b=0,p=i.body;const f=()=>{try{let i,l=Math.max(t.scrollWidth-(t===p&&a.innerWidth||t.clientWidth)),f=Math.max(t.scrollHeight-(t===p&&a.innerHeight||t.clientHeight));g!==m&&((i||(i={})).horizontalScroll={range:[d(g,l),d(m,l)],start:d(e,l),end:d(s,l)}),u!==b&&((i||(i={})).verticalScroll={range:[d(u,f),d(b,f)],start:d(r,f),end:d(c,f)}),i&&o({eventName:"scroll",elmt:t,type:"gesture",tags:[n.design],extra:i})}catch{}g=u=1/0,m=b=0,e=r=void 0};return()=>{try{t===p&&(s=a.scrollX,c=a.scrollY)||(s=t.scrollLeft,c=t.scrollTop),void 0===e&&(e=s,r=c),g=Math.min(s,g),u=Math.min(c,u),m=Math.max(s,m),b=Math.max(c,b)}catch{}clearTimeout(l||0),l=setTimeout(f,500)}})(t)),e()}),50);i.addEventListener("scroll",l,!0)},851:t=>{t.exports=t=>"function"==typeof t&&!t.constructor.name.toLowerCase().includes("async")&&async function(...e){return t(...e)}||t},151:(t,e,r)=>{const{DOC:a}=r(125),i=/\s+;\s+|;\s+|\s+;|;/g,n=/\s+=\s+|\s+=|=\s+|=/,o=t=>t,s=t=>{const[e="",r=""]=(t||"").split(n);return e&&r&&[e,r]},c=(t,[e,r])=>{const a=(t||(t={}))[e];return a&&(Array.isArray(a)&&a.push(r)||(t[e]=[a,r]))||(t[e]=r),t};t.exports=(t,e=t&&(t.cookie||t)||a.cookie||"")=>{try{return(t=>{if(t)for(const e in t){let r=t[e];Array.isArray(r)&&(t[e]=r=Array.from(new Set(r)),1===r.length&&(t[e]=r[0]))}return t})(e.split(i).map(s).filter(o).reduce(c,null))}catch{return null}}},413:t=>{t.exports=(t,e=1e3)=>{let r,a,i=0,n=0,o=t;for(e=max((isNaN(e),e),0);e&&o&&!isNaN(r=o.offsetLeft)&&!isNaN(a=o.offsetTop);--e,o=(o||{}).offsetParent)i+=r-(o.scrollLeft||0),n+=a-(o.scrollTop||0);return{x:i,y:n,width:t.offsetWidth||0,height:t.offsetHeight||0}}},523:(t,e,r)=>{const{IDK:a}=r(125),i=r(413);t.exports=(t,e)=>{if(t instanceof Node&&"function"==typeof t.getAttribute){try{e=Object.assign(e||{},i(t))}catch{}try{let r,i=t.getAttribute("id")||t.id||t.getAttribute("name")||t.name||t.getAttribute("label")||t.label||t.getAttribute("alt")||t.alt||(r=t.getAttribute("for")||t.for)&&`label for ${r}`||t.getAttribute(a)||t[a],n=t.getAttribute("src")||t.src||t.getAttribute("href")||t.href||t.getAttribute("action")||t.action,o=(t.tagName||"").toLowerCase(),s=t.getAttribute("type")||t.type;e||(i||n||o||s)&&(e={}),i&&(e.identifier=i),n&&(e.source=n),o&&(e.tagName=o),s&&(e.type=s)}catch{}}return e}},409:(t,e,r)=>{const{WIN:a,DOC:i,DOC_EL:n,NAV:o,BRO:s,REN:c,WST:d,MOB:l,TS:g,LOC:u,TZO:m,SID:b,RES:p,UA:f,DEP:h,CA:A,C:y}=r(125),v=r(523),S=r(151);t.exports=t=>{let e={};try{e={platform:{browser:s,userAgent:f,renderingEngine:c,sessionStartWindowSizeType:d,sessionStartScreenResolution:p,currentScreenResolution:{width:a.innerWidth||n.clientWidth||i.body.clientWidth,height:a.innerHeight||n.clientHeight||i.body.clientHeight},mobileType:l,hasTouchScreen:g,language:o.language,cookieEnabled:A,deprecated:h},page:{location:u},timeAndGeolocation:{date:Date.now(),timeZoneOffset:m},ids:{session:b}}}catch{}try{i.title&&(e.page.title=i.title),i.referrer&&(e.page.referrer=i.referrer.toString())}catch{}try{const t=Intl.DateTimeFormat().resolvedOptions().timeZone;t&&(e.timeAndGeolocation.timeZone=t)}catch{}try{const r=v(t);r&&(e.element=r)}catch{}try{const t=S(`${y&&y+";"||""}${i.cookie}`);t&&Object.keys(t).length&&(e.cookies=t)}catch{}return e}},740:(t,e,r)=>{const{WIN:a}=r(125);t.exports=t=>{try{t=a.name||`${a.performance.navigation.type}`}catch{}return t||""}},125:t=>{const e={TAGS:Object.freeze({dev:"dev.",sales:"sales",design:"design",management:"mgmt",execs:"execs"})};try{const t=e.WIN=window,r=e.NAV=t.navigator||navigator,a=e.DOC=t.document||document,i=e.DOC_EL=t.documentElement||a.documentElement,n=e.UA=r.userAgent||"";e.DEP={app:{version:r.appVersion||"",codeName:r.appCodeName||"",name:r.appName||""},vendor:r.vendor||"",platform:r.platform||"",product:r.product||"",subproduct:r.productSub},e.CA=r.cookieEnabled,e.LOC=(t.location||location||{}).href;const o=e.STO=t.sessionStorage||sessionStorage,s=e.STO_PRE="aglx";e.STO_GE=`${s}-good-exit`,e.STO_TBC=`${s}-time-before-crash`,e.STO_WN=`${s}-window-name`;const c=e.SC=a.currentScript;e.A=c&&(c.getAttribute("userkey")||c.getAttribute("user-key")||c.getAttribute("data-user-key")||c.getAttribute("userid")||c.getAttribute("user-id")||c.getAttribute("data-user-id")||c.getAttribute("user")||c.getAttribute("data-user")||c.getAttribute("account")||c.getAttribute("data-account")||c.getAttribute("accountid")||c.getAttribute("account-id")||c.getAttribute("data-account-id"))||void 0,e.DC=c&&(c.hasAttribute("disable-cookie")||c.hasAttribute("disableCookie")||c.hasAttribute("data-disable-cookie")||c.hasAttribute("disable-cookies")||c.hasAttribute("disableCookies")||c.hasAttribute("data-disable-cookies")),e.DV=c&&(c.hasAttribute("debug")||c.hasAttribute("dev")||c.hasAttribute("development")||c.hasAttribute("data-debug")||c.hasAttribute("data-dev")||c.hasAttribute("data-development")),e.C=a.cookie,e.NS=c&&c.getAttribute("")||"angelytics",e.OA={},e.OA.ga=c&&new Set((c.getAttribute("ga")||c.getAttribute("data-ga")||c.getAttribute("gtm")||c.getAttribute("data-gtm")||c.getAttribute("google-analytics-id")||c.getAttribute("data-google-analytics-id")||c.getAttribute("google-analytics-ids")||c.getAttribute("data-google-analytics-ids")||c.getAttribute("google-tag-manager-id")||c.getAttribute("data-google-tag-manager-id")||c.getAttribute("google-tag-manager-ids")||c.getAttribute("data-google-tag-manager-ids")||c.getAttribute("tag-manager-id")||c.getAttribute("data-tag-manager-id")||c.getAttribute("tag-manager-ids")||c.getAttribute("data-tag-manager-ids")||"").trim().split(/\s+/g).filter((t=>t))),e.OA.fbq=c&&new Set((c.getAttribute("mp")||c.getAttribute("data-mp")||c.getAttribute("fbq")||c.getAttribute("data-fbq")||c.getAttribute("pixel")||c.getAttribute("data-pixel")||c.getAttribute("pixel-id")||c.getAttribute("data-pixel-id")||c.getAttribute("pixel-ids")||c.getAttribute("data-pixel-ids")||c.getAttribute("meta-pixel-id")||c.getAttribute("data-meta-pixel-id")||c.getAttribute("meta-pixel-ids")||c.getAttribute("data-meta-pixel-ids")||"").trim().split(/\s+/g).filter((t=>t))),e.CB=c&&(c.getAttribute("callback")||c.getAttribute("cb")||c.getAttribute("data-callback")||c.getAttribute("data-cb"))||null;const d=/Android|Opera Mini/.test(n)||t.Android||!1,l=/Windows Phone|IEMobile/.test(n),g=/webOS|BlackBerry/.test(n),u=/iP(hone|ad|od)/.test(n)&&t.webkit&&!(d||l||g),m=e.MOB=(u?"ios":d&&"android")||l&&"windows"||g&&"other"||"";let b;e.TS=!!(m||r.maxTouchPoints>0||r.msMaxTouchPoints>0||(b=(t.matchMedia||(()=>{}))("(pointer:coarse)")||{})&&"(pointer:coarse)"===b.media&&b.matches||t.orientation);const p=r.vendor||"",f=/Apple/.test(p)||/Mac/.test(n),h=f&&/Safari/.test(n),A=/Google/.test(p)||!f,y=/Chromium/.test(n)&&A,v=(/Chrome/.test(n)&&A||t.chrome&&(t.chrome.webstore||t.chrome.runtime))&&!y,S=/Seamonkey/.test(n),O=(/Firefox/.test(n)||"undefined"!=typeof InstallTrigger)&&!S,x=/OPR|Opera/.test(n),N=/MSIE|Trident.*rv\:11\./.test(n)||!!a.documentMode;e.BRO=(h?"safari":v&&"chrome")||y&&"chromium"||S&&"seamonkey"||O&&"firefox"||x&&"opera"||N&&"ie";const T=/Mobile|Tablet/.test(n)&&/Gecko|Firefox/.test(n)&&/Mozilla/.test(n)||O,w=!N&&!!t.StyleMedia||v&&/Edg/.test(n),C=(v||x)&&!!t.CSS,E=/KHTML/.test(n)&&/AppleWebKit/.test(n);e.REN=(w?"edge":C&&"blink")||T&&"gecko"||E&&"webkit";const k=t.innerWidth||i.clientWidth||a.body.clientWidth,D=t.innerHeight||i.clientHeight||a.body.clientHeight;e.WST=m&&((k<480?"phone":k>1152&&"large-tablet")||k&&"tablet")||"desktop",e.RES={width:k,height:D};const I=e.TZO=Math.round((new Date).getTimezoneOffset()/60),M=`${s}-session-id`;e.SID=o&&function(t=o.getItem(M)||""){if(t)return t;let e=performance&&performance.now()||Date.now(),r=(t,e=63&t)=>String.fromCharCode(e<10&&e+48||e<36&&e+55||e<62&&e+61||62===e&&45||95),a=10+(52*Math.random()<<0),i=6;for(t+=r(63&a);i--;)t+=r(a=e+1e17*Math.random()),t+=r(a>>=6),t+=r(a>>=6),t+=r(a>>=6),t+=r(a>>=6);return o.setItem(M,t+=r(25+I)),t}(),e.EP="https://api.angelytics.ai/event",e.DA=[],e.PRE_ID="angelytics-unique",e.IDK="__angelytics_unique_id__",e.LOADED=!0}catch{}t.exports=Object.freeze(e)},953:(t,e,r)=>{const a=r(386),i=r(409),n=r(851);(t.exports=({eventName:t,data:e,body:r=e,element:o,elmt:s=o,error:c,type:d,tags:l=[],id:g,userId:u=g,url:m,uri:b=m,extra:p,detail:f=p,details:h=f,sendFunc:A=a,resolve:y,reject:v}={})=>{const S=i(s);try{d&&(S.event||(S.event={}),S.event.type=d),c&&(S.event||(S.event={}),S.event.error=c),t&&(S.event||(S.event={}),S.event.name=t),h&&"object"==typeof h&&(S.event||(S.event={}),Object.assign(S.event.details||(S.event.details={}),h)),r&&(S.event||(S.event={}),S.event.body=r),("number"==typeof u||u)&&(S.ids.user="object"==typeof u&&JSON.stringify(u)||`${u}`),l&&(Array.isArray(l)||(l=[l]))&&l.length&&(S.event||(S.event={}),S.event.tags=l)}catch{}return"function"==typeof A&&(A===a||(A=n(A)))&&A(S,b).then((t=>{"function"==typeof y&&y(t)})).catch((t=>{"function"==typeof v&&v(t)})),S}).send=a},386:(t,e,r)=>{const{WIN:a,NAV:i,A:n,CB:o,EP:s,OA:c,DC:d,P:l,AL:g,DA:u,DV:m}=r(125),b=r(851);t.exports=o&&"function"==typeof a[o]&&b(((...t)=>a[o].apply(a,t)))||n&&(async(t,e=s)=>{n&&(t.ids.account=n);try{const e={};let r,a,i;for(r in c)(a=c[r])&&(a.length||a.size)&&(e[r]=Array.from(a),i=!0);i&&(t.ids.otherAnalyticsToFeed=e)}catch{}t.flags={mode:m?"dev":"prod",patch:l,allowAll:g,disableCookies:d,encrypted:!!_ek};try{let e={};u.length&&(e=t.ids.otherAnalyticsDetected=u.reduce(((t,[e,r])=>(t[e]&&t[e].add(r)||(t[e]=new Set([r])),t)),{}));for(const t in e)e[t]=Array.from(e[t])}catch{}try{t=JSON.stringify(t)}catch(t){return Promise.reject(new Error("data not stringifiable",{cause:t}))}try{const r=i.sendBeacon(e,t);return r&&Promise.resolve(r)||Promise.reject(new Error("analytics not queued",{cause:response}))}catch{try{const r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},keepalive:!0,credentials:"include",mode:"no-cors",body:t});return r.ok&&Promise.resolve(r)||Promise.reject(new Error("Not 2xx response",{cause:r}))}catch(t){return Promise.reject(new Error("Fetch did not work",{cause:t}))}}})},42:(t,e,r)=>{const a=r(953);t.exports=(t,e,r,i)=>{if(t&&"string"==typeof t)return a({eventName:t,body:e,type:"custom",userId:r,tags:i});throw Error("In sendCustomEvent: first argument must be a non-empty event identifier string")}},485:t=>{t.exports=(t,e=50,r=!1,a=!1)=>e>0&&((...i)=>{r?a=!0:(t(...i),r=!0,setTimeout((()=>{a&&t(...i),a=r=!1}),e))})||t}},e={};function r(a){var i=e[a];if(void 0!==i)return i.exports;var n=e[a]={exports:{}};return t[a](n,n.exports,r),n.exports}(()=>{const{WIN:t,NS:e,TAGS:a,SC:i,STO:n,STO_GE:o,STO_TBC:s,STO_WN:c,DOC:d,DC:l,IDK:g,P:u,LOADED:m}=r(125);if(!m)return;const b=r(386),p=r(409);let f=()=>{};if(b){const e=r(740),i=r(953);if(f=r(42),n){const r=t=>{i({eventName:"code",error:"object"==typeof t&&t&&{message:t.message,filename:t.filename,line:t.lineno,column:t.colno}||{message:t},type:"error",tags:[a.dev]})};t.addEventListener("error",r),t.addEventListener("beforeunload",(()=>{try{n.setItem(o,"true")}catch(t){r(t)}i({eventName:"end",elmt:d.body,type:"session",tags:[a.design,a.sales]})})),n.getItem(c)===e()&&"true"!==n.getItem(o)&&i({eventName:"crash",error:{message:"Unresponsive code/page",timeBeforeCrash:n.getItem(s)},type:"error",tags:[a.dev]});try{n.setItem(o,"pending"),setInterval((()=>n.setItem(s,Date.now())),1e3),n.setItem(c,e())}catch(t){r(t)}}const l=()=>{i({eventName:"start",elmt:d.body,type:"session",tags:[a.design,a.sales]}),t.removeEventListener("load",l)};t.addEventListener("DOMContentLoaded",l),r(895),r(117),r(705)}Object.defineProperty(t,e,{value:Object.freeze({getMetadata:p,sendCustomEvent:f,TAGS:a}),configurable:!1,writable:!1,enumerable:!1}),Object.defineProperty(t,"__has__angelitics__",{value:!0,configurable:!1,writable:!1,enumerable:!1}),i&&i.remove()})()})();