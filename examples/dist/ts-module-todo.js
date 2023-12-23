!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["t"]=t():n["t"]=t()}(self,(()=>(()=>{"use strict";var n={};function t(n,t){var e=n(t);return Array.isArray(e)&&(e=e.join("")),e}(n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"i",{value:!0})})(n);var e={},r=function(n,t){var r=n+JSON.stringify(Object.keys(t).join(""));if(!e[r]){var i="return (state) => {".concat(Object.keys(t).map((function(n){return"const ".concat(n,' = state["').concat(n,'"].value;')})).join("\n")," return ").concat(n,"}");e[r]=Function(i)()}return e[r]},i=/<\/?[\w-]+/g,o=/[\w-]+(\s*=\s*("|')[^"']*("|'))/g,u=/[^\w\s]/g,a=/\s+/g,f=function(n,e,i){for(var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],u=n,a="",f=0;f<e.length;f++){var c=e[f],l=c.start,v=c.end,d=c.value,s=u.slice(0,l),h=u.slice(v+1),m=e[f].o,p=e[f].u.filter((function(n){return o.includes(n)}));(p.length||null===m)&&(m=t(r(d,i),i),e[f].o=m),a+="".concat(s).concat(m),u=h}return a+u},c=function(n,t){for(var e=[],r=String(n),f=!0,c=function(){var n=function(n){for(var t=n.indexOf("{{"),e=0,r=t;r<n.length;r++)if("{"===n[r]&&"{"===n[r+1]?(e++,r++):"}"===n[r]&&"}"===n[r+1]&&(e--,r++),0===e)return{start:t,end:r};return{start:t,end:-1}}(r),c=n.start,l=n.end;if(-1===l)return f=!1,1;var v,d,s,h=r.slice(c+2,l-1),m=r.slice(l+1),p=(v=h,(d=document.createElement("div")).innerHTML=function(n){return n.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(v),(d.textContent||d.innerText||"").replace(/[\r\n]+/g,"").trim()),b={},y=new Set;(s=p,s.replace(i,"").replace(o,"$1").replace(u," ").trim().replace(a,"@")).split("@").filter((function(n){return!b[n]&&(b[n]=!0)})).filter((function(n){return t[n]})).forEach((function(n){t[n].u.length?t[n].u.forEach((function(n){return y.add(n)})):y.add(n)})),e.push({start:c,end:l,value:p,u:Array.from(y),o:null}),r=m};f&&!c(););return e},l=function(n){return n.split("-").reduce((function(n,t,e){return n+(e?t[0].toUpperCase()+t.slice(1):t)}),"")};function v(n){return"true"===n||"false"!==n&&("null"===n?null:"undefined"===n?void 0:""===n?"":isNaN(Number(n))?n:Number(n))}function d(n,t){for(var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],r=Object.assign({},t),i=0;i<n.length;i++){var o=l(n[i].name),u=n[i].value,a=[];n[i].l&&(a=Array.from(new Set(n[i].v.map((function(n){return n.u})).flat())),u=f(n[i].value,n[i].v,t,e)),r[o]={value:v(u),h:[],m:[],u:a}}return r}function s(n,t,e,r){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:[],o=r.find((function(t){return t.id===n}));if(!o)return d(t,e,i);var u=s(o.parentId,o.attributes,e,r,i);return Object.assign({},u,d(t,u,i))}var h=function(n,t,e){var i=t.getAttribute("data-on-".concat(n));if(!i)throw new Error("Missing data-handler attribute");var o=r(i,e);return function(t){try{o(e),t.preventDefault()}catch(t){throw new Error("".concat(t.message,": data-on-").concat(n,"=").concat(i))}}};function m(n,t,e){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var r=h(t,n,e);n.addEventListener(t,r),n["".concat(t,"Handler")]=r}))}function p(n,t){m(n,"click",t),m(n,"change",t)}function b(n){return(new DOMParser).parseFromString(n,"text/html").body.firstChild}var y=function(n){return n.nodeType!==Node.TEXT_NODE&&-1!==n.tagName.indexOf("-")};function g(n,t){for(var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return!0},r=[],i=document.evaluate(t,n,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),o=i.iterateNext();o;)e(o)&&r.push(o),o=i.iterateNext();return r}var w=function(n){return g(n,"self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",(function(n){return!y(n)}))};function S(n,t,e,r,i){var o,u=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,v=arguments.length>7&&void 0!==arguments[7]?arguments[7]:null,d=r.replace(/>\s*([\s\S]*?)\s*</g,">$1<"),s=c(d,i),h=b(f(d,s,i,[]));return function(n,t,e,r){t.map((function(t){t.u.forEach((function(t){-1===e[t].h.indexOf(n)&&e[t].h.push(n);var i=r.find((function(n){return l(n.name)===t}));i&&(i.h||(i.h=[]),-1===i.h.indexOf(n)&&i.h.push(n))}))}))}(n,s,i,u),t.add(t.p(n,a,u,v,s,d,h,h.cloneNode(!0))),null===(o=e.parentElement)||void 0===o||o.replaceChild(h,e),h}function x(n,t,e,r){function i(){return Reflect.construct(HTMLElement,[],i)}i.prototype=Object.create(HTMLElement.prototype),i.prototype.constructor=i,i.prototype.connectedCallback=function(n,t,e){return function(){var r,i=this.tagName.toLowerCase(),o=e.id(),u=this.dataset.parentId?Number(this.dataset.parentId):null,a=s(u,[],t.value,e.list),f=function(n,t){var e=b(n);if(e.nodeType!==Node.TEXT_NODE){A(e,t);for(var r=e.querySelectorAll("*"),i=0;i<r.length;i++)A(r[i],t)}var o=e.outerHTML;return o||(o=e.textContent),o}(n.innerHTML,o),l=function(n,t){var e=function(n,t){return Array.from(n.attributes).map((function(n){var e=c(n.value,t);return{name:n.name,value:n.value,v:e,l:!!e.length,h:[]}}))}(n,t),r=c(n.innerHTML,t);return e.push({name:"children",value:n.innerHTML,v:r,l:!!r.length,h:[]}),e}(this,a),v=document.createElement("div");v.innerHTML=f,e.add(e.p(o,u,l,i));for(var d=w(v),h=0;h<d.length;h++)N(d[h],u,i,l,a,e,t);var m=v.firstChild;m.cogAnchorId=o,null===(r=this.parentElement)||void 0===r||r.replaceChild(m,this)}}(t,e,r),customElements.define(n,i)}function A(n,t){n.tagName.includes("-")&&n.setAttribute("data-parent-id",String(t))}function N(n,t,e,r,i,o,u){var a=o.id(),f=n.outerHTML;u.S(e,a);var c={};u.A&&u.A[e]&&(c=u.A[e].customElements[a]);var l=d(r,Object.assign({},i,c)),v=S(a,o,n,f,l,r,t,e);v.nodeType!==Node.TEXT_NODE&&p(v.parentElement,l),v.cogAnchorId=a}function j(n,t){for(var e=[],r=0;r<n.attributes.length;r++){var i=n.attributes[r],o=t.getAttribute(i.name);o!==i.value&&e.push({name:i.name,newValue:v(o||"")})}return e}function E(n,t){if(t.name.startsWith("data-attribute-")){var e=t.name.substring(15);t.newValue?(n[e]=!0,n.setAttribute(e,t.newValue)):(n[e]=!1,n.removeAttribute(e))}}function O(n,t){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var e=n["".concat(t,"Handler")];e&&n.removeEventListener(t,e)}))}function T(n,t){if(n.nodeType===Node.TEXT_NODE)return function(n,t){return n.textContent!==t.textContent?[{node:t,content:t.textContent}]:[]}(n,t);var e,r=j(n,t),i=r.length>0?[{node:t,attributes:r}]:[];return y(n)?i.concat((e=t,n.innerHTML!==e.innerHTML?[{node:e,content:e.innerHTML}]:[])):i.concat(function(n,t){for(var e=[],r=[],i=Math.max(n.childNodes.length,t.childNodes.length),o=[],u=0;u<i;u++){var a,f,c=n.childNodes[u],l=t.childNodes[u];if((null==c?void 0:c.nodeType)===Node.TEXT_NODE&&(null==l?void 0:l.nodeType)===Node.TEXT_NODE){if((null===(a=c.textContent)||void 0===a?void 0:a.trim())!==(null===(f=l.textContent)||void 0===f?void 0:f.trim()))return[{node:t,content:t.innerHTML}]}else c?l?o=o.concat(T(c,l)):e.push(c):r.push(l)}return e.length&&o.push({node:t,N:e}),r.length&&o.push({node:t,j:r}),o}(n,t))}function M(n,t,e){for(var r=[],i=n;i!==t;)r.unshift(Array.prototype.indexOf.call(i.parentNode.childNodes,i)),i=i.parentNode;for(var o=e,u=0;u<r.length;u++){var a=r[u];if(!o.childNodes[a])return null;o=o.childNodes[a]}return o}function C(n,t,e,r,i,o){var u,a=null!==(u=null==e?void 0:e.slice())&&void 0!==u?u:[],f=[];if(a.forEach((function(n){f.push({name:n.name,value:n.newValue,v:[],l:!1,h:[]})})),void 0!==t&&f.push({name:"children",value:t,v:[],l:!1,h:[]}),f.length){var c=r.get(n.cogAnchorId);if(null!==c.element)I(c,r,f,i,o);else{for(var l={},v=0;v<c.attributes.length;v++){var d=c.attributes[v];d.h&&d.h.length&&(l[d.name]=d.h)}for(var s=0;s<f.length;s++)for(var h=l[f[s].name],m=0;m<h.length;m++)I(r.get(h[m]),r,f,i,o)}}}function I(n,t,e,r,i){var o=function(n,t){for(var e=n.concat(t),r={},i=0;i<e.length;i++)r[e[i].name]=e[i];return Object.values(r)}(n.attributes,e);n.attributes=o,n.O=n.attributes.map((function(n){return l(n.name)})),_(t,n,r,i)}function k(n,t,e){var r;n.nodeType===Node.TEXT_NODE?n.textContent=t:(O(r=n,"click"),O(r,"change"),n.innerHTML=t,p(n,e))}function U(n,t){for(var e=0;e<t.length;e++)E(n,t[e]),n.setAttribute(t[e].name,t[e].newValue)}function F(n,t){for(var e=document.createDocumentFragment(),r=0;r<t.length;r++)e.appendChild(t[r]);n.appendChild(e)}function H(n,t){for(var e=0;e<t.length;e++)n.removeChild(t[e])}function L(n,t,e){var r=[],i=[];if(void 0!==n.j&&(i=n.j),void 0!==n.N)for(var o=0;o<n.N.length;o++){var u=M(n.N[o],t,e);u&&r.push(u)}return{T:i,M:r}}var _=function(n,t,e,r){var i=r.concat(t.O),o=e.value;if(e.A&&t.C&&e.A[t.C]){var u=e.A[t.C].customElements[t.id];o=Object.assign({},e.value,u)}t.O=[];var a=s(t.parentId,t.attributes,o,n.list,i),c=f(t.I,t.v,a,i),l=t.lastTemplateEvaluation.cloneNode(!0),v=b(c),d=T(l,v);d.length>0&&(t.lastTemplateEvaluation=v.cloneNode(!0),function(n,t,e,r,i,o,u,a){for(var f=0;f<n.length;f++){var c=n[f],l=M(c.node,e,r);if(y(c.node))C(l,c.content,c.attributes,o,u,a);else{var v=L(c,t,r),d=v.T,s=v.M;void 0!==c.content?k(l,c.content,i):void 0!==c.attributes?U(l,c.attributes):d.length?F(l,d):s.length&&H(l,s)}}}(d,l,v,t.element,a,n,e,r))};var G=function(){var n=null,t={k:0,list:[],index:{},get value(){return this.list},get:function(n){return this.list[this.index[n]]},add:function(n){this.list.push(n),this.index[n.id]=this.list.length-1},update:function(n,t,e){this.list[this.index[n]][t]=e},U:function(){this.list=this.list.filter((function(n){var t=n.element;return document.body.contains(t)})),this.index=this.list.reduce((function(n,t,e){return n[t.id]=e,n}),{})},id:function(){return this.k++},p:function(n,t,e,r){return{id:n,parentId:t,element:arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,I:arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",lastTemplateEvaluation:arguments.length>7&&void 0!==arguments[7]?arguments[7]:null,attributes:e,v:arguments.length>4&&void 0!==arguments[4]?arguments[4]:[],C:r,shouldUpdate:arguments.length>8&&void 0!==arguments[8]&&arguments[8],O:arguments.length>9&&void 0!==arguments[9]?arguments[9]:[]}}},e=null,r={state:null,A:null,F:[],H:{},get value(){return this.state||(this.state={}),this.state},L:function(n){return this.A||(this.A={}),this.A[n]},S:function(n,t){var e=this;if(this.A&&this.A[n]){this.A[n].customElements[t]={};for(var r=function(){var r=e.A[n].keys[i],o=e.A[n]._[r].value,u=e.A[n]._[r].G;if(u&&(o=u(r,o.slice(0))),o instanceof Function){var a=o;o=function(){for(var n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];return a.apply(void 0,e.concat(["cogId:".concat(t)]))}}e.A[n].customElements[t][r]={value:o,h:[],m:[],u:[]}},i=0;i<this.A[n].keys.length;i++)r()}},P:function(n,t,e,r){this.A||(this.A={}),this.A[n]||(this.A[n]={keys:[],_:{},customElements:{}}),this.A[n]._[t]={value:e,G:r},this.A[n].keys.push(t)},R:function(n,t,e,r){var i=this;this.A[n].customElements[t][e].value=r,this.A[n].customElements[t][e].m.forEach((function(n){i.$(t,n)})),this.$(t,e)},B:function(n,t){this.state||(this.state={}),this.state[n]?this.state[n].value=t:this.state[n]={value:t,h:[],m:[],u:[]}},D:function(n,t){var e=this;this.state[n].value=t,this.value[n].m.forEach((function(n){e.q(n)})),this.q(n)},q:function(n){var t=this,e=n.split(".");if(e.length>1){var r=e[1].split(":"),i=r[0],o=Number(r[1]);this.$(o,i)}else this.value[n].h.forEach((function(e){t.$(e,n)}))},$:function(n,t){-1===this.F.indexOf(n)&&(this.F.push(n),this.H[n]=[]),-1===this.H[n].indexOf(t)&&this.H[n].push(t)},J:function(){this.F=[],this.H={}}},i=0;function o(){null!==e&&cancelAnimationFrame(e),e=requestAnimationFrame((function(n){n-i>16.666666666666668&&(i=n,r.F.forEach((function(n){var e=t.get(n);_(t,e,r,r.H[n])})),r.J())}))}var u=function(t,e){return new Proxy(e,{get:function(e,i){var u=e[i];return"push"===i?function(){var i,a=null===(i=n)||void 0===i?void 0:i.split(".");if(a&&a.length>1){var f=Number(a[1].split(":")[1]);r.$(f,t)}else r.value[t].m.forEach((function(n){r.q(n)})),r.q(t);o();for(var c=arguments.length,l=new Array(c),v=0;v<c;v++)l[v]=arguments[v];return u.apply(e,l)}:u}})};return{render:function(n){p(n,r.value),function(n,t,e){for(var r=w(n),i=0;i<r.length;i++){var o=e.id(),u=r[i];u.innerHTML=u.innerHTML.trim();for(var a=S(o,e,u,u.outerHTML,t),f=j(u,a),c=0;c<f.length;c++)E(a,f[c])}}(n,r.value,t),function(n,t,e){for(var r=g(n,"template"),i=document.createDocumentFragment(),o=0;o<r.length;o++){var u=r[o].getAttribute("id");if(u){if(r[o].innerHTML=r[o].innerHTML.replace(/[\r\n]+\s*/g,""),0===r[o].content.children.length)throw new Error("Template ".concat(u," should have a single HTML Element child"));x(u,r[o],t,e),i.appendChild(r[o])}}i.textContent=""}(n,r,t)},variable:function(t,e,i){var a=t;if(i&&(a="".concat(i,".").concat(t)),e instanceof Function&&(e=function(t,e){return function(r){for(var i=arguments.length,o=new Array(i>1?i-1:0),u=1;u<i;u++)o[u-1]=arguments[u];"string"==typeof r&&(0===r.indexOf("cogId:")?r=r.replace("cogId:",""):(o.unshift(r),r=null)),n=r?"".concat(t,":").concat(r):t;var a=e.apply(void 0,o);return n=null,a}}(a,e)),i){var f=void 0;Array.isArray(e)&&(f=u),r.P(i,t,e,f)}else Array.isArray(e)&&(e=u(t,e)),r.B(t,e);return{get value(){if(i){var e,o=(null===(e=n)||void 0===e?void 0:e.split(":"))||[],u=o[1]?Number(o[1]):null;if(null===u)throw new Error("Can't use outside of a template: ".concat(t," (for ").concat(i,")"));var a=o[0].split("."),f=a[0],c=a[1];if(f!==i)throw new Error("Can't use from another template: ".concat(t," (for ").concat(i,", used in ").concat(f,")"));var l=r.L(i).customElements[u][t];return c&&-1===l.m.indexOf(c)&&l.m.push(c),l.value}return null!==n&&-1===r.value[t].m.indexOf(n)&&r.value[t].m.push(n),r.value[t].value},set value(e){if(i){var u,a=null===(u=n)||void 0===u?void 0:u.split(":")[1];if(!a)throw new Error("Can't call outside of a template");r.R(i,Number(a),t,e)}else r.D(t,e);o()},set:function(e){if(i){var u,a=null===(u=n)||void 0===u?void 0:u.split(":")[1];if(!a)throw new Error("Can't call outside of a template");r.R(i,Number(a),t,e)}else r.D(t,e);o()}}}}}(),P=G.variable,R=G.render;function $(n){return function(n){if(Array.isArray(n))return z(n)}(n)||function(n){if("undefined"!=typeof Symbol&&null!=n[Symbol.iterator]||null!=n["@@iterator"])return Array.from(n)}(n)||function(n,t){if(n){if("string"==typeof n)return z(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);return"Object"===e&&n.constructor&&(e=n.constructor.name),"Map"===e||"Set"===e?Array.from(n):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?z(n,t):void 0}}(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function z(n,t){(null==t||t>n.length)&&(t=n.length);for(var e=0,r=new Array(t);e<t;e++)r[e]=n[e];return r}document.addEventListener("DOMContentLoaded",(function(){R(document.getElementById("app"))}));var B=P("todos",[{text:"hello",done:!1}]);P("save",(function(){var n=document.querySelector("[data-input=todo");null!=n&&n.value&&(B.set([].concat($(B.value),[{text:n.value,done:!1}])),n.value="")})),P("toggleTodo",(function(n){var t=$(B.value);t[n].done=!t[n].done,B.set(t)})),P("Checkbox",(function(n){var t=n.index,e=void 0===t?-1:t,r=n.checked,i=void 0!==r&&r;return'<input type="checkbox" id="todo'.concat(e,'" data-on-change="toggleTodo(').concat(e,')" ').concat(i?"checked":""," />")}));var D=P("counter",0);return P("increment",(function(){D.set(D.value+1)})),n})()));