!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["t"]=t():n["t"]=t()}(self,(()=>(()=>{"use strict";var n={};function t(n,t){var r=n(t);return Array.isArray(r)&&(r=r.join("")),r}function r(n){for(var t=n.indexOf("{{"),r=0,e=t;e<n.length;e++)if("{"===n[e]&&"{"===n[e+1]?(r++,e++):"}"===n[e]&&"}"===n[e+1]&&(r--,e++),0===r)return{start:t,end:e};return{start:t,end:-1}}(n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"o",{value:!0})})(n);var e={},o=function(n,t){var r=n+JSON.stringify(Object.keys(t).join(""));if(!e[r]){var o="return (state) => {".concat(Object.keys(t).map((function(n){return"const ".concat(n,' = state["').concat(n,'"];')})).join("\n")," return ").concat(n,"}");e[r]=Function(o)()}return e[r]},u=function(n,r,e){for(var u=n,i="",a=0;a<r.length;a++){var c=r[a],f=c.start,v=c.end,l=c.value,d=u.slice(0,f),s=u.slice(v+1),h=t(o(l,e),e);i+="".concat(d).concat(h),u=s}return i+u},i=function(n){for(var t,e,o=[],u=String(n),i=!0;i;){var a=r(u),c=a.start,f=a.end;if(-1===f){i=!1;break}var v=u.slice(c+2,f-1),l=u.slice(f+1),d=(t=v,e=void 0,(e=document.createElement("div")).innerHTML=function(n){return n.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(t),(e.textContent||e.innerText||"").replace(/[\r\n]+/g,""));o.push({start:c,end:f,value:d}),u=l}return o},a=function(n){return Array.from(n.attributes).map((function(n){var t=i(n.value);return{name:n.name,value:n.value,u:t,i:!!t.length}}))},c=function(n){return n.split("-").reduce((function(n,t,r){return n+(r?t[0].toUpperCase()+t.slice(1):t)}),"")};function f(n){return"true"===n||"false"!==n&&("null"===n?null:"undefined"===n?void 0:""===n?"":isNaN(Number(n))?n:Number(n))}var v={};function l(n,t){var r=JSON.stringify(n)+JSON.stringify(t);if(!v[r]){for(var e=Object.assign({},t),o=0;o<n.length;o++)e[c(n[o].name)]=f(n[o].i?u(n[o].value,n[o].u,t):n[o].value);v[r]=e}return v[r]}function d(n,t,r,e){var o=e.find((function(t){return t.id===n}));if(!o)return l(t,r);var u=d(o.parentId,o.attributes,r,e);return Object.assign({},u,l(t,u))}function s(n){return(new DOMParser).parseFromString(n,"text/html").body.firstChild}function h(n,t){for(var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return!0},e=[],o=document.evaluate(t,n,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),u=o.iterateNext();u;)r(u)&&e.push(u),u=o.iterateNext();return e}function m(n,t,r){if(null===n)return t;var e=r.find((function(t){return t.id===n}));return m(e.parentId,e.attributes,r).concat(t)}var p=/<\/?[\w-]+/g,b=/[\w-]+(\s*=\s*("|')[^"']*("|'))/g,g=/[^\w\s()]/g,w=/\s+/g;function x(n,t,r,e,o){var a,c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],f=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,v=e.replace(/>\s*([\s\S]*?)\s*</g,">$1<"),l=i(v),d=u(v,l,o),h=s(d),x=v+" "+m(f,c,t.list).map((function(n){return n.value})).join(" "),y=i(x).map((function(n){return n.value})).join(" ").replace(p,"").replace(b,"$1").replace(g," ").replace(w," ");return t.add({id:n,parentId:f,element:h,v,lastTemplateEvaluation:d,l:y,attributes:c,u:l,shouldUpdate:!1}),null===(a=r.parentElement)||void 0===a||a.replaceChild(h,r),h}function y(n,t,r,e){function o(){return Reflect.construct(HTMLElement,[],o)}o.prototype=Object.create(HTMLElement.prototype),o.prototype.constructor=o,o.prototype.connectedCallback=function(n,t,r){return function(){var e=r.id(),o=function(n){var t=a(n),r=i(n.innerHTML);return t.push({name:"children",value:n.innerHTML,u:r,i:!!r.length}),t}(this),u=function(n,t){var r=s(n);if(r.nodeType!==Node.TEXT_NODE){N(r,t);for(var e=r.querySelectorAll("*"),o=0;o<e.length;o++)N(e[o],t)}var u=r.outerHTML;return u||(u=r.textContent),u}(n.innerHTML,e),c=this.dataset.parentId?Number(this.dataset.parentId):null,f=d(c,o,t,r.list);x(e,r,this,u,f,o,c).cogAnchorId=e}}(t,r,e),customElements.define(n,o)}function N(n,t){n.tagName.includes("-")&&n.setAttribute("data-parent-id",String(t))}var O=function(n,t,r){var e=t.getAttribute("data-on-".concat(n));if(!e)throw new Error("Missing data-handler attribute");var u=o(e,r);return function(t){try{u(r),t.preventDefault()}catch(t){throw new Error("".concat(t.message,": data-on-").concat(n,"=").concat(e))}}};function j(n,t,r){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var e=O(t,n,r);n.addEventListener(t,e),n["".concat(t,"Handler")]=e}))}function S(n,t){j(n,"click",t),j(n,"change",t)}function E(n,t){for(var r=[],e=0;e<n.attributes.length;e++){var o=n.attributes[e],u=t.getAttribute(o.name);u!==o.value&&r.push({name:o.name,newValue:f(u||"")})}return r}function M(n,t){if(t.name.startsWith("data-attribute-")){var r=t.name.substring(15);t.newValue?(n[r]=!0,n.setAttribute(r,t.newValue)):(n[r]=!1,n.removeAttribute(r))}}var A=function(n){return n.nodeType!==Node.TEXT_NODE&&-1!==n.tagName.indexOf("-")};function T(n,t){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var r=n["".concat(t,"Handler")];r&&n.removeEventListener(t,r)}))}function k(n,t){if(n.nodeType===Node.TEXT_NODE)return function(n,t){return n.textContent!==t.textContent?[{node:t,content:t.textContent}]:[]}(n,t);var r,e=E(n,t),o=e.length>0?[{node:t,attributes:e}]:[];return A(n)?o.concat((r=t,n.innerHTML!==r.innerHTML?[{node:r,content:r.innerHTML}]:[])):o.concat(function(n,t){for(var r=[],e=[],o=Math.max(n.childNodes.length,t.childNodes.length),u=[],i=0;i<o;i++){var a,c,f=n.childNodes[i],v=t.childNodes[i];if((null==f?void 0:f.nodeType)===Node.TEXT_NODE&&(null==v?void 0:v.nodeType)===Node.TEXT_NODE){if((null===(a=f.textContent)||void 0===a?void 0:a.trim())!==(null===(c=v.textContent)||void 0===c?void 0:c.trim()))return[{node:t,content:t.innerHTML}]}else f?v?u=u.concat(k(f,v)):r.push(f):e.push(v)}return r.length&&u.push({node:t,h:r}),e.length&&u.push({node:t,m:e}),u}(n,t))}function C(n,t,r){for(var e=[],o=n;o!==t;)e.unshift(Array.prototype.indexOf.call(o.parentNode.childNodes,o)),o=o.parentNode;for(var u=r,i=0;i<e.length;i++){var a=e[i];if(!u.childNodes[a])return null;u=u.childNodes[a]}return u}var F=function(n,t,r,e,o,u,i,c){A(t)?function(n,t,r,e,o){var u,i=[];if((null!==(u=null==e?void 0:e.slice())&&void 0!==u?u:[]).length&&(i=a(n)),void 0!==r&&i.push({name:"children",value:r,u:[],i:!1}),i.length){var c=o.index[t.cogAnchorId],f=function(n,t){for(var r=n.concat(t),e={},o=0;o<r.length;o++)e[r[o].name]=r[o];return Object.values(e)}(o.list[c].attributes,i);o.update(c,"attributes",f)}}(t,n,r,e,c):void 0!==r?function(n,t,r){var e;n.nodeType===Node.TEXT_NODE?n.textContent=t:(T(e=n,"click"),T(e,"change"),n.innerHTML=t,S(n,r))}(n,r,i):void 0!==e?function(n,t){for(var r=0;r<t.length;r++)M(n,t[r]),n.setAttribute(t[r].name,t[r].newValue)}(n,e):o.length?function(n,t){for(var r=document.createDocumentFragment(),e=0;e<t.length;e++)r.appendChild(t[e]);n.appendChild(r)}(n,o):u.length&&function(n,t){for(var r=0;r<t.length;r++)n.removeChild(t[r])}(n,u)},H=function(n){return new RegExp("\\b".concat(n,"\\b|[^\\w]").concat(n,"[^\\w]"),"gm")};function R(n,t,r,e,o,u){for(var i=0;i<n.length;i++){var a=C(n[i].node,r,e),c=J(n[i],t,e),f=c.p,v=c.N;F(a,n[i].node,n[i].content,n[i].attributes,f,v,o,u)}}function J(n,t,r){var e=[],o=[];if(void 0!==n.m&&(o=n.m),void 0!==n.h)for(var u=0;u<n.h.length;u++){var i=C(n.h[u],t,r);i&&e.push(i)}return{p:o,N:e}}function L(n,t){return!!t.shouldUpdate||function(n,t){return n.map(H).some((function(n){return n.test(t)}))}(n,t.l)}var U=function(){var n=null,t={O:0,list:[],index:{},get value(){return this.list},add:function(n){this.list.push(n),this.index[n.id]=this.list.length-1},update:function(n,t,r){"attributes"===t&&(this.list[n].shouldUpdate=!0),this.list[n][t]=r},j:function(){this.list=this.list.filter((function(n){var t=n.element;return document.body.contains(t)})),this.index=this.list.reduce((function(n,t,r){return n[t.id]=r,n}),{})},id:function(){return this.O++}},r=null,e={state:null,S:[],get value(){return this.state||(this.state={}),this.state},set:function(n,t){this.state||(this.state={}),this.state[n]=t,this.S.push(n)},M:function(){this.S=[]}};var o=0;function i(n,i){e.set(n,i),null!==r&&cancelAnimationFrame(r),r=requestAnimationFrame((function(n){n-o>16.666666666666668&&(o=n,function(n,t,r){for(var e=0;e<n.value.length;e++){var o=n.value[e],i=o.parentId,a=o.attributes,c=o.element,f=o.v,v=o.lastTemplateEvaluation,l=o.u;if(L(r,n.value[e])){n.update(e,"shouldUpdate",!1);var h=d(i,a,t,n.list),m=u(f,l,h),p=s(m),b=s(v),g=k(b,p);g.length>0&&(n.update(e,"lastTemplateEvaluation",m),R(g,b,p,c,h,n))}}}(t,e.value,e.S),t.j(),e.M())}))}return{render:function(n){!function(n,t,r){for(var e=h(n,"self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",(function(n){return!A(n)})),o=0;o<e.length;o++){var u=r.id(),i=e[o];i.innerHTML=i.innerHTML.trim();for(var a=x(u,r,i,i.outerHTML,t),c=E(i,a),f=0;f<c.length;f++)M(a,c[f])}}(n,e.value,t),function(n,t,r){for(var e=h(n,"template"),o=document.createDocumentFragment(),u=0;u<e.length;u++){var i=e[u].getAttribute("id");if(i){if(e[u].innerHTML=e[u].innerHTML.replace(/[\r\n]+\s*/g,""),1!==e[u].content.childNodes.length)throw new Error("Template ".concat(i," should have a single child"));y(i,e[u],t,r),o.appendChild(e[u])}}o.textContent=""}(n,e.value,t),S(n,e.value)},variable:function(t,r){return r instanceof Function?(console.log("function",t),e.set(t,(function(){for(var e=arguments.length,o=new Array(e),u=0;u<e;u++)o[u]=arguments[u];return console.log("called",t,o),n=t,r.apply(void 0,o)}))):e.set(t,r),{set value(n){i(t,n)},get value(){return console.log(n,"is getting value"),e.value[t]},set:function(n){i(t,n)}}}}}(),B=U.variable,D=U.render;document.addEventListener("DOMContentLoaded",(function(){D(document.getElementById("app"))}));var I=B("count",1);return window.increment=function(){I.value++},n})()));