!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["t"]=t():n["t"]=t()}(self,(()=>(()=>{"use strict";var n={};function t(n,t){var r=n(t);return Array.isArray(r)&&(r=r.join("")),r}function r(n){for(var t=n.indexOf("{{"),r=0,e=t;e<n.length;e++)if("{"===n[e]&&"{"===n[e+1]?(r++,e++):"}"===n[e]&&"}"===n[e+1]&&(r--,e++),0===r)return{start:t,end:e};return{start:t,end:-1}}(n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"u",{value:!0})})(n);var e={},u=function(n,t){var r=n+JSON.stringify(Object.keys(t).join(""));if(!e[r]){var u="return (state) => {".concat(Object.keys(t).map((function(n){return"const ".concat(n,' = state["').concat(n,'"];')})).join("\n")," return ").concat(n,"}");e[r]=Function(u)()}return e[r]},o=function(n,r,e){for(var o=n,i="",a=0;a<r.length;a++){var c=r[a],f=c.start,v=c.end,d=c.value,l=o.slice(0,f),s=o.slice(v+1),h=t(u(d,e),e);i+="".concat(l).concat(h),o=s}return i+o},i=function(n){for(var t,e,u=[],o=String(n),i=!0;i;){var a=r(o),c=a.start,f=a.end;if(-1===f){i=!1;break}var v=o.slice(c+2,f-1),d=o.slice(f+1),l=(t=v,e=void 0,(e=document.createElement("div")).innerHTML=function(n){return n.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(t),(e.textContent||e.innerText||"").replace(/[\r\n]+/g,""));u.push({start:c,end:f,value:l}),o=d}return u},a=function(n){return Array.from(n.attributes).map((function(n){var t=i(n.value);return{name:n.name,value:n.value,o:t,i:!!t.length}}))},c=function(n){return n.split("-").reduce((function(n,t,r){return n+(r?t[0].toUpperCase()+t.slice(1):t)}),"")};function f(n){return"true"===n||"false"!==n&&("null"===n?null:"undefined"===n?void 0:""===n?"":isNaN(Number(n))?n:Number(n))}var v={};function d(n,t){var r=JSON.stringify(n)+JSON.stringify(t);if(!v[r]){for(var e=Object.assign({},t),u=0;u<n.length;u++)e[c(n[u].name)]=f(n[u].i?o(n[u].value,n[u].o,t):n[u].value);v[r]=e}return v[r]}function l(n,t,r,e){var u=e.find((function(t){return t.id===n}));if(!u)return d(t,r);var o=l(u.parentId,u.attributes,r,e);return Object.assign({},o,d(t,o))}function s(n){return(new DOMParser).parseFromString(n,"text/html").body.firstChild}function h(n,t){for(var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return!0},e=[],u=document.evaluate(t,n,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),o=u.iterateNext();o;)r(o)&&e.push(o),o=u.iterateNext();return e}function m(n,t,r){if(null===n)return t;var e=r.find((function(t){return t.id===n}));return m(e.parentId,e.attributes,r).concat(t)}var p=/<\/?[\w-]+/g,b=/[\w-]+(\s*=\s*("|')[^"']*("|'))/g,g=/[^\w\s()]/g,w=/\s+/g;function N(n,t,r,e,u){var a,c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],f=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,v=e.replace(/>\s*([\s\S]*?)\s*</g,">$1<"),d=i(v),l=s(o(v,d,u)),h=v+" "+m(f,c,t.list).map((function(n){return n.value})).join(" "),N=i(h).map((function(n){return n.value})).join(" ").replace(p,"").replace(b,"$1").replace(g," ").replace(w," ");return t.add({id:n,parentId:f,element:l,v,lastTemplateEvaluation:l.cloneNode(!0),l:N,attributes:c,o:d,shouldUpdate:!1}),null===(a=r.parentElement)||void 0===a||a.replaceChild(l,r),l}function O(n,t,r,e){function u(){return Reflect.construct(HTMLElement,[],u)}u.prototype=Object.create(HTMLElement.prototype),u.prototype.constructor=u,u.prototype.connectedCallback=function(n,t,r){return function(){var e=r.id(),u=function(n){var t=a(n),r=i(n.innerHTML);return t.push({name:"children",value:n.innerHTML,o:r,i:!!r.length}),t}(this),o=function(n,t){var r=s(n);if(r.nodeType!==Node.TEXT_NODE){x(r,t);for(var e=r.querySelectorAll("*"),u=0;u<e.length;u++)x(e[u],t)}var o=r.outerHTML;return o||(o=r.textContent),o}(n.innerHTML,e),c=this.dataset.parentId?Number(this.dataset.parentId):null,f=l(c,u,t,r.list);N(e,r,this,o,f,u,c).cogAnchorId=e}}(t,r,e),customElements.define(n,u)}function x(n,t){n.tagName.includes("-")&&n.setAttribute("data-parent-id",String(t))}var y=function(n,t,r){var e=t.getAttribute("data-on-".concat(n));if(!e)throw new Error("Missing data-handler attribute");var o=u(e,r);return function(t){try{o(r),t.preventDefault()}catch(t){throw new Error("".concat(t.message,": data-on-").concat(n,"=").concat(e))}}};function j(n,t,r){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var e=y(t,n,r);n.addEventListener(t,e),n["".concat(t,"Handler")]=e}))}function M(n,t){j(n,"click",t),j(n,"change",t)}function S(n,t){for(var r=[],e=0;e<n.attributes.length;e++){var u=n.attributes[e],o=t.getAttribute(u.name);o!==u.value&&r.push({name:u.name,newValue:f(o||"")})}return r}function E(n,t){if(t.name.startsWith("data-attribute-")){var r=t.name.substring(15);t.newValue?(n[r]=!0,n.setAttribute(r,t.newValue)):(n[r]=!1,n.removeAttribute(r))}}var A=function(n){return n.nodeType!==Node.TEXT_NODE&&-1!==n.tagName.indexOf("-")};function k(n,t){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var r=n["".concat(t,"Handler")];r&&n.removeEventListener(t,r)}))}function C(n,t){if(n.nodeType===Node.TEXT_NODE)return function(n,t){return n.textContent!==t.textContent?[{node:t,content:t.textContent}]:[]}(n,t);var r,e=S(n,t),u=e.length>0?[{node:t,attributes:e}]:[];return A(n)?u.concat((r=t,n.innerHTML!==r.innerHTML?[{node:r,content:r.innerHTML}]:[])):u.concat(function(n,t){for(var r=[],e=[],u=Math.max(n.childNodes.length,t.childNodes.length),o=[],i=0;i<u;i++){var a,c,f=n.childNodes[i],v=t.childNodes[i];if((null==f?void 0:f.nodeType)===Node.TEXT_NODE&&(null==v?void 0:v.nodeType)===Node.TEXT_NODE){if((null===(a=f.textContent)||void 0===a?void 0:a.trim())!==(null===(c=v.textContent)||void 0===c?void 0:c.trim()))return[{node:t,content:t.innerHTML}]}else f?v?o=o.concat(C(f,v)):r.push(f):e.push(v)}return r.length&&o.push({node:t,h:r}),e.length&&o.push({node:t,m:e}),o}(n,t))}function T(n,t,r){for(var e=[],u=n;u!==t;)e.unshift(Array.prototype.indexOf.call(u.parentNode.childNodes,u)),u=u.parentNode;for(var o=r,i=0;i<e.length;i++){var a=e[i];if(!o.childNodes[a])return null;o=o.childNodes[a]}return o}var H=function(n,t,r,e,u,o,i,c){A(t)?function(n,t,r,e,u){var o,i=[];if((null!==(o=null==e?void 0:e.slice())&&void 0!==o?o:[]).length&&(i=a(n)),void 0!==r&&i.push({name:"children",value:r,o:[],i:!1}),i.length){var c=u.index[t.cogAnchorId],f=function(n,t){for(var r=n.concat(t),e={},u=0;u<r.length;u++)e[r[u].name]=r[u];return Object.values(e)}(u.list[c].attributes,i);u.update(c,"attributes",f)}}(t,n,r,e,c):void 0!==r?function(n,t,r){var e;n.nodeType===Node.TEXT_NODE?n.textContent=t:(k(e=n,"click"),k(e,"change"),n.innerHTML=t,M(n,r))}(n,r,i):void 0!==e?function(n,t){for(var r=0;r<t.length;r++)E(n,t[r]),n.setAttribute(t[r].name,t[r].newValue)}(n,e):u.length?function(n,t){for(var r=document.createDocumentFragment(),e=0;e<t.length;e++)r.appendChild(t[e]);n.appendChild(r)}(n,u):o.length&&function(n,t){for(var r=0;r<t.length;r++)n.removeChild(t[r])}(n,o)},R=function(n){return new RegExp("\\b".concat(n,"\\b|[^\\w]").concat(n,"[^\\w]"),"gm")};function B(n,t,r,e,u,o){for(var i=0;i<n.length;i++){var a=T(n[i].node,r,e),c=F(n[i],t,e),f=c.p,v=c.N;H(a,n[i].node,n[i].content,n[i].attributes,f,v,u,o)}}function F(n,t,r){var e=[],u=[];if(void 0!==n.m&&(u=n.m),void 0!==n.h)for(var o=0;o<n.h.length;o++){var i=T(n.h[o],t,r);i&&e.push(i)}return{p:u,N:e}}function J(n,t){return!!t.shouldUpdate||function(n,t){return n.map(R).some((function(n){return n.test(t)}))}(n,t.l)}var L=function(){var n={O:0,list:[],index:{},get value(){return this.list},add:function(n){this.list.push(n),this.index[n.id]=this.list.length-1},update:function(n,t,r){"attributes"===t&&(this.list[n].shouldUpdate=!0),this.list[n][t]=r},j:function(){this.list=this.list.filter((function(n){var t=n.element;return document.body.contains(t)})),this.index=this.list.reduce((function(n,t,r){return n[t.id]=r,n}),{})},id:function(){return this.O++}},t=null,r={state:null,M:[],get value(){return this.state||(this.state={}),this.state},set:function(n,t){this.state||(this.state={}),this.state[n]=t,this.M.push(n)},S:function(){this.M=[]}};var e=0;function u(u,i){r.set(u,i),null!==t&&cancelAnimationFrame(t),t=requestAnimationFrame((function(t){t-e>16.666666666666668&&(e=t,function(n,t,r){for(var e=0;e<n.value.length;e++){var u=n.value[e],i=u.parentId,a=u.attributes,c=u.element,f=u.v,v=u.lastTemplateEvaluation,d=u.o;if(J(r,n.value[e])){n.update(e,"shouldUpdate",!1);var h=l(i,a,t,n.list),m=s(o(f,d,h)),p=C(v,m);p.length>0&&(n.update(e,"lastTemplateEvaluation",m.cloneNode(!0)),B(p,v,m,c,h,n))}}}(n,r.value,r.M),n.j(),r.S())}))}return{render:function(t){!function(n,t,r){for(var e=h(n,"self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",(function(n){return!A(n)})),u=0;u<e.length;u++){var o=r.id(),i=e[u];i.innerHTML=i.innerHTML.trim();for(var a=N(o,r,i,i.outerHTML,t),c=S(i,a),f=0;f<c.length;f++)E(a,c[f])}}(t,r.value,n),function(n,t,r){for(var e=h(n,"template"),u=document.createDocumentFragment(),o=0;o<e.length;o++){var i=e[o].getAttribute("id");if(i){if(e[o].innerHTML=e[o].innerHTML.replace(/[\r\n]+\s*/g,""),1!==e[o].content.childNodes.length)throw new Error("Template ".concat(i," should have a single child"));O(i,e[o],t,r),u.appendChild(e[o])}}u.textContent=""}(t,r.value,n),M(t,r.value)},variable:function(n,t){return r.set(n,t),{set value(t){u(n,t)},get value(){return r.value[n]},set:function(t){u(n,t)}}}}}(),U=L.variable,D=L.render;document.addEventListener("DOMContentLoaded",(function(){D(document.getElementById("app"))}));var I=U("names",["Alice","Bob","Carol"]),P=U("count",0),K=U("checked",!0);return U("isOk",(function(n){return n%2==0})),window.toggleChecked=function(){K.value=!K.value},window.increment=function(){P.value++,I.value.push(function(){for(var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZ",r=0;r<5;r++)n+=t.charAt(Math.floor(26*Math.random()));return n}())},window.decrement=function(){P.value--},U("fps",0),n})()));