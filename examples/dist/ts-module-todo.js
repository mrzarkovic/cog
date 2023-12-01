!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports["t"]=n():t["t"]=n()}(self,(()=>(()=>{"use strict";var t={};(t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"o",{value:!0})})(t);var n=function(t){return t.split("-").reduce((function(t,n,e){return t+(e?n[0].toUpperCase()+n.slice(1):n)}),"")},e=function(t,n){var e="return (state) => {".concat(Object.keys(n).map((function(t){return"const ".concat(t,' = state["').concat(t,'"];')})).join("\n")," return ").concat(t,"}");return Function(e)()};function r(t,n){try{var r=e(t,n)(n);return Array.isArray(r)&&(r=r.join("")),r}catch(n){throw new Error("Failed to create function from expression {{".concat(t,"}}: ").concat(n.message))}}function o(t,e){for(var o=Object.assign({},e),u=0;u<t.length;u++)o[n(t[u].name)]=t[u].u?r(t[u].value,e):t[u].value;return o}function u(t){for(var n=t.indexOf("{{"),e=0,r=n;r<t.length;r++)if("{{"===t.slice(r,r+2)?(e++,r++):"}}"===t.slice(r,r+2)&&(e--,r++),0===e)return{start:n,end:r};return{start:n,end:-1}}var a=function(t){return t.replace(/[\r\n]+\s*/g,"")},i=function(t,n){for(var e,o,i=t,c=!0,f="";c;){var l=u(i),d=l.start,s=l.end;if(-1===s){c=!1;break}var v=i.slice(d+2,s-1),h=i.slice(0,d),m=i.slice(s+1),p=r((e=a(v),o=void 0,(o=document.createElement("div")).innerHTML=function(t){return t.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(e),o.textContent||o.innerText||""),n);f+="".concat(h).concat(p),i=m}return f+i},c=/\{\{(.+?)\}\}/,f=function(t){return Array.from(t.attributes).map((function(t){var n=c.exec(t.value);return{name:t.name,value:n?n[1]:t.value,u:!!n}}))};function l(t,n,e){for(var r=function(t){for(var n=[],e=document.evaluate("template",t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),r=e.iterateNext();r;)n.push(r),r=e.iterateNext();return n}(t),o=document.createDocumentFragment(),u=0;u<r.length;u++){var i=r[u].getAttribute("id");if(i){if(r[u].innerHTML=a(r[u].innerHTML),1!==r[u].content.childNodes.length)throw new Error("Template ".concat(i," should have a single child"));d(i,r[u],n,e),o.appendChild(r[u])}}o.textContent=""}function d(t,n,e,r){function u(){return Reflect.construct(HTMLElement,[],u)}u.prototype=Object.create(HTMLElement.prototype),u.prototype.constructor=u,u.prototype.connectedCallback=function(t,n,e){return function(){var r,u,a=f(this),c=o(a,n),l=t.innerHTML.replace(/\{\{\s*children\s*\}\}/g,this.innerHTML),d=i(l,c),s=document.createElement("div");s.innerHTML=d;var v=s.firstChild;null===(r=this.parentNode)||void 0===r||r.insertBefore(v,this),e.add({element:v,i:l,l:d,v:a}),e.h(),null===(u=this.parentNode)||void 0===u||u.removeChild(this)}}(n,e,r),customElements.define(t,u)}var s=function(t,n,r){var o=n.getAttribute("data-on-".concat(t));if(!o)throw new Error("Missing data-handler attribute");var u=e(o,r);return function(n){try{u(r),n.preventDefault()}catch(n){throw new Error("".concat(n.message,": data-on-").concat(t,"=").concat(o))}}};function v(t,n,e){t.querySelectorAll("[data-on-".concat(n,"]")).forEach((function(t){var r=s(n,t,e);t.addEventListener(n,r),t["".concat(n,"Handler")]=r}))}function h(t,n){v(t,"click",n),v(t,"change",n)}var m=function(t){return t.nodeType!==Node.TEXT_NODE&&-1!==t.tagName.indexOf("-")},p=function(t,n){for(var e=document.evaluate("self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),r=e.iterateNext();r;)m(r)||n.add({element:r,i:r.outerHTML,l:r.outerHTML,v:[]}),r=e.iterateNext()};function b(t,n){t.querySelectorAll("[data-on-".concat(n,"]")).forEach((function(t){var e=t["".concat(n,"Handler")];e&&t.removeEventListener(n,e)}))}function y(t,n){if(t.nodeType===Node.TEXT_NODE)return function(t,n){var e;return t.textContent!==n.textContent?[{node:t,m:n,content:null!==(e=n.textContent)&&void 0!==e?e:""}]:[]}(t,n);t.innerHTML=a(t.innerHTML),n.innerHTML=a(n.innerHTML);var e=function(t,n){for(var e=[],r=0;r<t.attributes.length;r++){var o=t.attributes[r],u=n.getAttribute(o.name);u!==o.value&&e.push({name:o.name,newValue:u||""})}return e}(t,n);return(e.length>0?[{node:t,m:n,attributes:e}]:[]).concat(function(t,n){for(var e=[],r=0;r<t.childNodes.length;r++){var o=t.childNodes[r],u=n.childNodes[r];if(o.nodeType===Node.TEXT_NODE&&(null==u?void 0:u.nodeType)===Node.TEXT_NODE){if(o.textContent!==u.textContent){e.push({node:t,m:n,content:n.innerHTML});break}}else{var a=y(o,u);e=e.concat(a)}}return e}(t,n))}function g(t){return(new DOMParser).parseFromString(t,"text/html").body.firstChild}function w(t,n,e){for(var r=[],o=t;o!==n;)r.unshift(Array.prototype.indexOf.call(o.parentNode.childNodes,o)),o=o.parentNode;for(var u=e,a=0,i=r;a<i.length;a++){var c=i[a];if(!u.childNodes[c])return null;u=u.childNodes[c]}return u}var x=function(t,n,e,r,o){var u,a;if(m(n))null===(u=t.parentElement)||void 0===u||u.replaceChild(n,t);else if(void 0!==e)t.nodeType===Node.TEXT_NODE?t.textContent=e:(b(a=t,"click"),b(a,"change"),t.innerHTML=e,h(t,o));else if(void 0!==r)for(var i=0;i<r.length;i++)t.setAttribute(r[i].name,r[i].newValue)},E=function(t,n){for(var e=0;e<t.value.length;e++){var r=t.value[e],u=r.element,a=r.i,c=r.v,f=r.l,l=o(c,n),d=i(a,l),s=g(d),v=g(f),h=y(v,s);if(h.length>0){t.p(e,d);for(var m=0;m<h.length;m++){var p=w(h[m].node,v,u);x(p,h[m].m,h[m].content,h[m].attributes,l)}}}};function j(){return{list:[],get value(){return this.list},add:function(t){this.list.push(t)},p:function(t,n){this.list[t].l=n},h:function(){this.list=this.list.filter((function(t){var n=t.element;return document.body.contains(n)}))}}}var A=function(t){var n={list:[],get value(){return this.list},add:function(t){this.list.push(t)},p:function(t,n){this.list[t].l=n}},e=j(),r=function(t){return{element:null,get value(){if(this.element||(this.element=t.querySelector("#app")),!this.element)throw new Error("No app element found!");return this.element}}}(t),o={state:null,get value(){return this.state||(this.state={}),this.state},set:function(t,n){this.state||(this.state={}),this.state[t]=n}};function u(){E(n,o.value),E(e,o.value)}function a(t,n){setTimeout((function(){o.set(t,n),u()}),0)}var i=function(){l(r.value,o.value,e),p(r.value,n),console.log(n.value),h(r.value,o.value),u()},c=t.j;return c&&t.removeEventListener("DOMContentLoaded",c),t.addEventListener("DOMContentLoaded",i),t.j=i,{variable:function(t,n){return o.set(t,n),{set value(n){a(t,n)},get value(){return o.value[t]},set:function(n){a(t,n)}}}}}(document).variable;function T(t){return function(t){if(Array.isArray(t))return O(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,n){if(t){if("string"==typeof t)return O(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?O(t,n):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function O(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}var M=A("todos",[{text:"hello",done:!1}]);A("save",(function(){var t=document.querySelector("[data-input=todo");null!=t&&t.value&&(M.set([].concat(T(M.value),[{text:t.value,done:!1}])),t.value="")})),A("toggleTodo",(function(t){var n=T(M.value);n[t].done=!n[t].done,M.set(n)})),A("Checkbox",(function(t){var n=t.index,e=void 0===n?-1:n,r=t.checked,o=void 0!==r&&r;return'<input type="checkbox" id="todo'.concat(e,'" data-on-change="toggleTodo(').concat(e,')" ').concat(o?"checked":""," />")}));var N=A("counter",0);return A("increment",(function(){N.set(N.value+1)})),t})()));