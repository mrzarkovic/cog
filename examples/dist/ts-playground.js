!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["t"]=t():n["t"]=t()}(self,(()=>(()=>{"use strict";var n={};function t(n,t){var e=n(t);return Array.isArray(e)&&(e=e.join("")),e}(n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"i",{value:!0})})(n);var e={},r=function(n,t){var r=n+JSON.stringify(Object.keys(t).join(""));if(!e[r]){var i="return (state) => {".concat(Object.keys(t).map((function(n){return"const ".concat(n,' = state["').concat(n,'"].value;')})).join("\n")," return ").concat(n,"}");e[r]=Function(i)()}return e[r]},i=/<\/?[\w-]+/g,o=/[\w-]+(\s*=\s*("|')[^"']*("|'))/g,u=/[^\w\s]/g,a=/\s+/g,f=function(n,e,i){for(var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],u=n,a="",f=0;f<e.length;f++){var c=e[f],s=c.start,v=c.end,l=c.value,d=u.slice(0,s),h=u.slice(v+1),m=e[f].o,p=e[f].u.filter((function(n){return o.includes(n)}));(p.length||null===m)&&(m=t(r(l,i),i),e[f].o=m),a+="".concat(d).concat(m),u=h}return a+u},c=function(n,t){for(var e=[],r=String(n),f=!0,c=function(){var n=function(n){for(var t=n.indexOf("{{"),e=0,r=t;r<n.length;r++)if("{"===n[r]&&"{"===n[r+1]?(e++,r++):"}"===n[r]&&"}"===n[r+1]&&(e--,r++),0===e)return{start:t,end:r};return{start:t,end:-1}}(r),c=n.start,s=n.end;if(-1===s)return f=!1,1;var v,l,d,h=r.slice(c+2,s-1),m=r.slice(s+1),p=(v=h,(l=document.createElement("div")).innerHTML=function(n){return n.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(v),(l.textContent||l.innerText||"").replace(/[\r\n]+/g,"").trim()),w={},b=new Set;(d=p,d.replace(i,"").replace(o,"$1").replace(u," ").trim().replace(a,"@")).split("@").filter((function(n){return!w[n]&&(w[n]=!0)})).filter((function(n){return t[n]})).forEach((function(n){t[n].u.length?t[n].u.forEach((function(n){return b.add(n)})):b.add(n)})),e.push({start:c,end:s,value:p,u:Array.from(b),o:null}),r=m};f&&!c(););return e},s=function(n){return n.split("-").reduce((function(n,t,e){return n+(e?t[0].toUpperCase()+t.slice(1):t)}),"")};function v(n){return"true"===n||"false"!==n&&("null"===n?null:"undefined"===n?void 0:""===n?"":isNaN(Number(n))?n:Number(n))}function l(n,t){for(var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],r=Object.assign({},t),i=0;i<n.length;i++){var o=s(n[i].name),u=n[i].value,a=[];n[i].v&&(a=Array.from(new Set(n[i].l.map((function(n){return n.u})).flat())),u=f(n[i].value,n[i].l,t,e)),r[o]={value:v(u),h:[],m:[],u:a}}return r}function d(n,t,e,r){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:[],o=r.find((function(t){return t.id===n}));if(!o)return l(t,e,i);var u=d(o.parentId,o.attributes,e,r,i);return Object.assign({},u,l(t,u,i))}var h=function(n,t,e){var i=t.getAttribute("data-on-".concat(n));if(!i)throw new Error("Missing data-handler attribute");var o=r(i,e);return function(t){try{o(e),t.preventDefault()}catch(t){throw new Error("".concat(t.message,": data-on-").concat(n,"=").concat(i))}}};function m(n,t,e){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var r=h(t,n,e);n.addEventListener(t,r),n["".concat(t,"Handler")]=r}))}function p(n,t){m(n,"click",t),m(n,"change",t)}function w(n){return(new DOMParser).parseFromString(n,"text/html").body.firstChild}var b=function(n){return n.nodeType!==Node.TEXT_NODE&&-1!==n.tagName.indexOf("-")};function g(n,t){for(var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return!0},r=[],i=document.evaluate(t,n,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),o=i.iterateNext();o;)e(o)&&r.push(o),o=i.iterateNext();return r}var y=function(n){return g(n,"self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",(function(n){return!b(n)}))};function N(n,t,e,r,i){var o,u=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,v=arguments.length>7&&void 0!==arguments[7]?arguments[7]:null,l=r.replace(/>\s*([\s\S]*?)\s*</g,">$1<"),d=c(l,i),h=w(f(l,d,i,[]));return function(n,t,e,r){t.map((function(t){t.u.forEach((function(t){-1===e[t].h.indexOf(n)&&e[t].h.push(n);var i=r.find((function(n){return s(n.name)===t}));i&&(i.h||(i.h=[]),-1===i.h.indexOf(n)&&i.h.push(n))}))}))}(n,d,i,u),t.add(t.p(n,a,u,v,d,l,h,h.cloneNode(!0))),null===(o=e.parentElement)||void 0===o||o.replaceChild(h,e),h}function S(n,t,e,r){function i(){return Reflect.construct(HTMLElement,[],i)}i.prototype=Object.create(HTMLElement.prototype),i.prototype.constructor=i,i.prototype.connectedCallback=function(n,t,e){return function(){var r,i=this.tagName.toLowerCase(),o=e.id(),u=this.dataset.parentId?Number(this.dataset.parentId):null,a=d(u,[],t.value,e.list),f=function(n,t){var e=w(n);if(e.nodeType!==Node.TEXT_NODE){x(e,t);for(var r=e.querySelectorAll("*"),i=0;i<r.length;i++)x(r[i],t)}var o=e.outerHTML;return o||(o=e.textContent),o}(n.innerHTML,o),s=function(n,t){var e=function(n,t){return Array.from(n.attributes).map((function(n){var e=c(n.value,t);return{name:n.name,value:n.value,l:e,v:!!e.length,h:[]}}))}(n,t),r=c(n.innerHTML,t);return e.push({name:"children",value:n.innerHTML,l:r,v:!!r.length,h:[]}),e}(this,a),v=document.createElement("div");v.innerHTML=f,e.add(e.p(o,u,s,i));for(var l=y(v),h=0;h<l.length;h++)A(l[h],u,i,s,a,e,t);var m=v.firstChild;m.cogAnchorId=o,null===(r=this.parentElement)||void 0===r||r.replaceChild(m,this)}}(t,e,r),customElements.define(n,i)}function x(n,t){n.tagName.includes("-")&&n.setAttribute("data-parent-id",String(t))}function A(n,t,e,r,i,o,u){var a=o.id(),f=n.outerHTML;u.N(e,a);var c={};u.S&&u.S[e]&&(c=u.S[e].customElements[a]);var s=l(r,Object.assign({},i,c)),v=N(a,o,n,f,s,r,t,e);v.nodeType!==Node.TEXT_NODE&&p(v.parentElement,s),v.cogAnchorId=a}function E(n,t){for(var e=[],r=0;r<n.attributes.length;r++){var i=n.attributes[r],o=t.getAttribute(i.name);o!==i.value&&e.push({name:i.name,newValue:v(o||"")})}return e}function O(n,t){if(t.name.startsWith("data-attribute-")){var e=t.name.substring(15);t.newValue?(n[e]=!0,n.setAttribute(e,t.newValue)):(n[e]=!1,n.removeAttribute(e))}}function j(n,t){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var e=n["".concat(t,"Handler")];e&&n.removeEventListener(t,e)}))}function M(n,t){if(n.nodeType===Node.TEXT_NODE)return function(n,t){return n.textContent!==t.textContent?[{node:t,content:t.textContent}]:[]}(n,t);var e,r=E(n,t),i=r.length>0?[{node:t,attributes:r}]:[];return b(n)?i.concat((e=t,n.innerHTML!==e.innerHTML?[{node:e,content:e.innerHTML}]:[])):i.concat(function(n,t){for(var e=[],r=[],i=Math.max(n.childNodes.length,t.childNodes.length),o=[],u=0;u<i;u++){var a,f,c=n.childNodes[u],s=t.childNodes[u];if((null==c?void 0:c.nodeType)===Node.TEXT_NODE&&(null==s?void 0:s.nodeType)===Node.TEXT_NODE){if((null===(a=c.textContent)||void 0===a?void 0:a.trim())!==(null===(f=s.textContent)||void 0===f?void 0:f.trim()))return[{node:t,content:t.innerHTML}]}else c?s?o=o.concat(M(c,s)):e.push(c):r.push(s)}return e.length&&o.push({node:t,A:e}),r.length&&o.push({node:t,O:r}),o}(n,t))}function T(n,t,e){for(var r=[],i=n;i!==t;)r.unshift(Array.prototype.indexOf.call(i.parentNode.childNodes,i)),i=i.parentNode;for(var o=e,u=0;u<r.length;u++){var a=r[u];if(!o.childNodes[a])return null;o=o.childNodes[a]}return o}function C(n,t,e,r,i,o){var u,a=null!==(u=null==e?void 0:e.slice())&&void 0!==u?u:[],f=[];if(a.forEach((function(n){f.push({name:n.name,value:n.newValue,l:[],v:!1,h:[]})})),void 0!==t&&f.push({name:"children",value:t,l:[],v:!1,h:[]}),f.length){var c=r.get(n.cogAnchorId);if(null!==c.element)F(c,r,f,i,o);else{for(var s={},v=0;v<c.attributes.length;v++){var l=c.attributes[v];l.h&&l.h.length&&(s[l.name]=l.h)}for(var d=0;d<f.length;d++)for(var h=s[f[d].name],m=0;m<h.length;m++)F(r.get(h[m]),r,f,i,o)}}}function F(n,t,e,r,i){var o=function(n,t){for(var e=n.concat(t),r={},i=0;i<e.length;i++)r[e[i].name]=e[i];return Object.values(r)}(n.attributes,e);n.attributes=o,n.j=n.attributes.map((function(n){return s(n.name)})),B(t,n,r,i)}function H(n,t,e){var r;n.nodeType===Node.TEXT_NODE?n.textContent=t:(j(r=n,"click"),j(r,"change"),n.innerHTML=t,p(n,e))}function I(n,t){for(var e=0;e<t.length;e++)O(n,t[e]),n.setAttribute(t[e].name,t[e].newValue)}function U(n,t){for(var e=document.createDocumentFragment(),r=0;r<t.length;r++)e.appendChild(t[r]);n.appendChild(e)}function k(n,t){for(var e=0;e<t.length;e++)n.removeChild(t[e])}function L(n,t,e){var r=[],i=[];if(void 0!==n.O&&(i=n.O),void 0!==n.A)for(var o=0;o<n.A.length;o++){var u=T(n.A[o],t,e);u&&r.push(u)}return{M:i,T:r}}var B=function(n,t,e,r){var i=r.concat(t.j),o=e.value;if(e.S&&t.C&&e.S[t.C]){var u=e.S[t.C].customElements[t.id];o=Object.assign({},e.value,u)}t.j=[];var a=d(t.parentId,t.attributes,o,n.list,i),c=f(t.F,t.l,a,i),s=t.lastTemplateEvaluation.cloneNode(!0),v=w(c),l=M(s,v);l.length>0&&(t.lastTemplateEvaluation=v.cloneNode(!0),function(n,t,e,r,i,o,u,a){for(var f=0;f<n.length;f++){var c=n[f],s=T(c.node,e,r);if(b(c.node))C(s,c.content,c.attributes,o,u,a);else{var v=L(c,t,r),l=v.M,d=v.T;void 0!==c.content?H(s,c.content,i):void 0!==c.attributes?I(s,c.attributes):l.length?U(s,l):d.length&&k(s,d)}}}(l,s,v,t.element,a,n,e,r))};var G=function(){var n=null,t={H:0,list:[],index:{},get value(){return this.list},get:function(n){return this.list[this.index[n]]},add:function(n){this.list.push(n),this.index[n.id]=this.list.length-1},update:function(n,t,e){this.list[this.index[n]][t]=e},I:function(){this.list=this.list.filter((function(n){var t=n.element;return document.body.contains(t)})),this.index=this.list.reduce((function(n,t,e){return n[t.id]=e,n}),{})},id:function(){return this.H++},p:function(n,t,e,r){return{id:n,parentId:t,element:arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,F:arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",lastTemplateEvaluation:arguments.length>7&&void 0!==arguments[7]?arguments[7]:null,attributes:e,l:arguments.length>4&&void 0!==arguments[4]?arguments[4]:[],C:r,shouldUpdate:arguments.length>8&&void 0!==arguments[8]&&arguments[8],j:arguments.length>9&&void 0!==arguments[9]?arguments[9]:[]}}},e=null,r={state:null,S:null,U:[],k:{},get value(){return this.state||(this.state={}),this.state},L:function(n){return this.S||(this.S={}),this.S[n]},N:function(n,t){var e=this;if(this.S&&this.S[n]){this.S[n].customElements[t]={};for(var r=function(){var r=e.S[n].keys[i],o=e.S[n].B[r].value,u=e.S[n].B[r].G;if(u&&(o=u(r,o.slice(0))),o instanceof Function){var a=o;o=function(){for(var n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];return a.apply(void 0,e.concat(["cogId:".concat(t)]))}}e.S[n].customElements[t][r]={value:o,h:[],m:[],u:[]}},i=0;i<this.S[n].keys.length;i++)r()}},P:function(n,t,e,r){this.S||(this.S={}),this.S[n]||(this.S[n]={keys:[],B:{},customElements:{}}),this.S[n].B[t]={value:e,G:r},this.S[n].keys.push(t)},R:function(n,t,e,r){var i=this;this.S[n].customElements[t][e].value=r,this.S[n].customElements[t][e].m.forEach((function(n){i._(t,n)})),this._(t,e)},D:function(n,t){this.state||(this.state={}),this.state[n]?this.state[n].value=t:this.state[n]={value:t,h:[],m:[],u:[]}},J:function(n,t){var e=this;this.state[n].value=t,this.value[n].m.forEach((function(n){e.K(n)})),this.K(n)},K:function(n){var t=this,e=n.split(".");if(e.length>1){var r=e[1].split(":"),i=r[0],o=Number(r[1]);this._(o,i)}else this.value[n].h.forEach((function(e){t._(e,n)}))},_:function(n,t){-1===this.U.indexOf(n)&&(this.U.push(n),this.k[n]=[]),-1===this.k[n].indexOf(t)&&this.k[n].push(t)},V:function(){this.U=[],this.k={}}},i=0;function o(){null!==e&&cancelAnimationFrame(e),e=requestAnimationFrame((function(n){n-i>16.666666666666668&&(i=n,r.U.forEach((function(n){var e=t.get(n);B(t,e,r,r.k[n])})),r.V())}))}var u=function(t,e){return new Proxy(e,{get:function(e,i){var u=e[i];return"push"===i?function(){var i,a=null===(i=n)||void 0===i?void 0:i.split(".");if(a&&a.length>1){var f=Number(a[1].split(":")[1]);r._(f,t)}else r.value[t].m.forEach((function(n){r.K(n)})),r.K(t);o();for(var c=arguments.length,s=new Array(c),v=0;v<c;v++)s[v]=arguments[v];return u.apply(e,s)}:u}})};return{render:function(n){p(n,r.value),function(n,t,e){for(var r=y(n),i=0;i<r.length;i++){var o=e.id(),u=r[i];u.innerHTML=u.innerHTML.trim();for(var a=N(o,e,u,u.outerHTML,t),f=E(u,a),c=0;c<f.length;c++)O(a,f[c])}}(n,r.value,t),function(n,t,e){for(var r=g(n,"template"),i=document.createDocumentFragment(),o=0;o<r.length;o++){var u=r[o].getAttribute("id");if(u){if(r[o].innerHTML=r[o].innerHTML.replace(/[\r\n]+\s*/g,""),0===r[o].content.children.length)throw new Error("Template ".concat(u," should have a single HTML Element child"));S(u,r[o],t,e),i.appendChild(r[o])}}i.textContent=""}(n,r,t)},variable:function(t,e,i){var a=t;if(i&&(a="".concat(i,".").concat(t)),e instanceof Function&&(e=function(t,e){return function(r){for(var i=arguments.length,o=new Array(i>1?i-1:0),u=1;u<i;u++)o[u-1]=arguments[u];"string"==typeof r&&(0===r.indexOf("cogId:")?r=r.replace("cogId:",""):(o.unshift(r),r=null)),n=r?"".concat(t,":").concat(r):t;var a=e.apply(void 0,o);return n=null,a}}(a,e)),i){var f=void 0;Array.isArray(e)&&(f=u),r.P(i,t,e,f)}else Array.isArray(e)&&(e=u(t,e)),r.D(t,e);return{get value(){if(i){var e,o=(null===(e=n)||void 0===e?void 0:e.split(":"))||[],u=o[1]?Number(o[1]):null;if(null===u)throw new Error("Can't use outside of a template: ".concat(t," (for ").concat(i,")"));var a=o[0].split("."),f=a[0],c=a[1];if(f!==i)throw new Error("Can't use from another template: ".concat(t," (for ").concat(i,", used in ").concat(f,")"));var s=r.L(i).customElements[u][t];return c&&-1===s.m.indexOf(c)&&s.m.push(c),s.value}return null!==n&&-1===r.value[t].m.indexOf(n)&&r.value[t].m.push(n),r.value[t].value},set value(e){if(i){var u,a=null===(u=n)||void 0===u?void 0:u.split(":")[1];if(!a)throw new Error("Can't call outside of a template");r.R(i,Number(a),t,e)}else r.J(t,e);o()},set:function(e){if(i){var u,a=null===(u=n)||void 0===u?void 0:u.split(":")[1];if(!a)throw new Error("Can't call outside of a template");r.R(i,Number(a),t,e)}else r.J(t,e);o()}}}}}(),P=G.variable,R=G.render;document.addEventListener("DOMContentLoaded",(function(){R(document.getElementById("app"))}));var _=P("names",["Alice","Bob","Carol"]),D=P("count",0),z=P("checked",!0);P("isOk",(function(){return D.value%2==0})),window.toggleChecked=function(){z.value=!z.value},window.increment=function(){D.value++,_.value.push(function(){for(var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZ",e=0;e<5;e++)n+=t.charAt(Math.floor(26*Math.random()));return n}())},window.decrement=function(){D.value--};var J=P("fps",0),K=[];return function n(){window.requestAnimationFrame((function(){for(var t=performance.now();K.length>0&&K[0]<=t-1e3;)K.shift();K.push(t),J.value=K.length,n()}))}(),n})()));