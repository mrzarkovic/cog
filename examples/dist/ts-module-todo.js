!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports["t"]=n():t["t"]=n()}(self,(()=>(()=>{"use strict";var t={};(t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"o",{value:!0})})(t);var n=function(t){return t.split("-").reduce((function(t,n,e){return t+(e?n[0].toUpperCase()+n.slice(1):n)}),"")},e=function(t,n){var e="return (state) => {".concat(Object.keys(n).map((function(t){return"const ".concat(t,' = state["').concat(t,'"];')})).join("\n")," return ").concat(t,"}");return Function(e)()};function r(t,n){try{var r=e(t,n)(n);return Array.isArray(r)&&(r=r.join("")),r}catch(n){throw new Error("Failed to create function from expression {{".concat(t,"}}: ").concat(n.message))}}function o(t,e){for(var o=Object.assign({},e),u=0;u<t.length;u++)o[n(t[u].name)]=t[u].u?r(t[u].value,e):t[u].value;return o}function u(t){for(var n=t.indexOf("{{"),e=0,r=n;r<t.length;r++)if("{{"===t.slice(r,r+2)?(e++,r++):"}}"===t.slice(r,r+2)&&(e--,r++),0===e)return{start:n,end:r};return{start:n,end:-1}}var a=function(t,n){for(var e,o,a=t,i=!0,c="";i;){var f=u(a),l=f.start,d=f.end;if(-1===d){i=!1;break}var v=a.slice(l+2,d-1),s=a.slice(0,l),m=a.slice(d+1),h=r((e=v,o=void 0,(o=document.createElement("div")).innerHTML=function(t){return t.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(e),o.textContent||o.innerText||""),n);c+="".concat(s).concat(h),a=m}return c+a},i=/\{\{(.+?)\}\}/,c=function(t){return Array.from(t.attributes).map((function(t){var n=i.exec(t.value);return{name:t.name,value:n?n[1]:t.value,u:!!n}}))},f={stack:[],get value(){return this.stack},add:function(t){this.stack.push(t)},i:function(){this.stack=this.stack.filter((function(t){var n=t.element;return document.body.contains(n)}))}};function l(t,n,e){function r(){return Reflect.construct(HTMLElement,[],r)}r.prototype=Object.create(HTMLElement.prototype),r.prototype.constructor=r,r.prototype.connectedCallback=function(){var t,r,u,i=this,l=c(i),d=document.createElement("div");d.innerHTML=n.innerHTML.replace(/\{\{\s*children\s*\}\}/g,i.innerHTML);var v=o(l,e.value),s=d.innerHTML,m=[];(null===(t=d.firstChild)||void 0===t?void 0:t.nodeType)!==Node.TEXT_NODE&&(m=c(d.firstChild));var h=a(d.innerHTML,v);d.innerHTML=h;var b=d.firstChild;null===(r=i.parentNode)||void 0===r||r.insertBefore(b,i),!i.dataset.l&&b&&(b.v=h,f.add({element:b,m:s,attributes:m,h:l}),f.i()),null===(u=i.parentNode)||void 0===u||u.removeChild(i)},customElements.define(t,r)}var d=function(t,n,r){var o=n.getAttribute("data-on-".concat(t));if(!o)throw new Error("Missing data-handler attribute");var u=e(o,r);return function(n){try{u(r),n.preventDefault()}catch(n){throw new Error("".concat(n.message,": data-on-").concat(t,"=").concat(o))}}};function v(t,n,e){t.querySelectorAll("[data-on-".concat(n,"]")).forEach((function(t){var r=d(n,t,e);t.addEventListener(n,r),t["".concat(n,"Handler")]=r}))}function s(t,n){v(t,"click",n),v(t,"change",n)}var m=function(t){return t.replace(/[\r\n]+\s*/g,"")},h=function(t){for(var n=[],e=document.evaluate("template",t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),r=e.iterateNext();r;)r.innerHTML=m(r.innerHTML),n.push(r),r=e.iterateNext();return n},b=function(t){return-1!==t.tagName.indexOf("-")},p=function(t){for(var n=[],e=document.evaluate("self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),r=e.iterateNext();r;){if(!b(r)){var o=c(r);n.push({element:r,m:r.innerHTML,attributes:o,h:[]})}r=e.iterateNext()}return n};function y(t,n){t.querySelectorAll("[data-on-".concat(n,"]")).forEach((function(t){var e=t["".concat(n,"Handler")];e&&t.removeEventListener(n,e)}))}function g(t,n){for(var e=[],r=0;r<t.attributes.length;r++){var o=t.attributes[r],u=n.getAttribute(o.name);u!==o.value&&e.push({name:o.name,newValue:u||""})}return e}function w(t,n){var e;if(t.nodeType===Node.TEXT_NODE)return t.textContent!==n.textContent?[{element:t,p:n,content:null!==(e=n.textContent)&&void 0!==e?e:""}]:[];t.innerHTML=m(t.innerHTML),n.innerHTML=m(n.innerHTML);for(var r=!1,o=[],u=0;u<t.childNodes.length;u++){var a=t.childNodes[u],i=n.childNodes[u];if(a.nodeType===Node.TEXT_NODE&&i&&i.nodeType===Node.TEXT_NODE){if(a.textContent!==i.textContent){r=!0;break}}else if(a.nodeType===Node.ELEMENT_NODE){var c=g(a,i);c.length>0&&o.push({element:a,p:i,attributes:c})}}if(r)return[{element:t,p:n,content:n.innerHTML}];for(var f=0;f<t.childNodes.length;f++){var l=w(t.childNodes[f],n.childNodes[f]);o=o.concat(l)}return o}function x(t){return(new DOMParser).parseFromString(t,"text/html").body.firstChild}var E=function(t,n){for(var e=0,u=function(){var u=t[e],i=u.element,c=u.m,f=u.attributes,l=o(u.h,n);if(f)for(var d=0;d<f.length;d++){var v=f[d].u?r(f[d].value,l):f[d].value;v!==i.getAttribute(f[d].name)&&i.setAttribute(f[d].name,v)}var m=a(c,l),h=x(m),p=x(i.v),g=w(p,h);g.length>0&&(i.v=m,g.map((function(t){var n,e,r=t.element,o=t.p,u=t.content,a=t.attributes,c=function(t,n,e){for(var r=[],o=t;o!==n;)r.unshift(Array.prototype.indexOf.call(o.parentNode.childNodes,o)),o=o.parentNode;for(var u=e,a=0,i=r;a<i.length;a++){var c=i[a];if(!u.childNodes[c])return null;u=u.childNodes[c]}return u}(r,p,i);c&&(r.nodeType!==Node.TEXT_NODE&&b(r)?null===(n=c.parentElement)||void 0===n||n.replaceChild(o,c):void 0!==u?c.nodeType===Node.TEXT_NODE?c.textContent=u:(y(e=c,"click"),y(e,"change"),c.innerHTML=u,s(c,l)):void 0!==a&&a.map((function(t){var n=t.name,e=t.newValue;c.setAttribute(n,e)})))})))};e<t.length;e++)u()},j=function(t){var n=[],e=function(t){return{element:null,get value(){if(this.element||(this.element=t.querySelector("#app")),!this.element)throw new Error("No app element found!");return this.element}}}(t),r={state:null,get value(){return this.state||(this.state={}),this.state},set:function(t,n){this.state||(this.state={}),this.state[t]=n}};function o(){E(n,r.value),E(f.value,r.value)}function u(t,n){setTimeout((function(){r.set(t,n),o()}),0)}var a=function(){n=p(e.value),h(e.value).forEach((function(t){var n=t.getAttribute("id");if(!n)throw new Error("Missing id attribute");if(1!==t.content.childNodes.length)throw new Error("Template ".concat(n," should have a single child"));l(n,t,r)})),s(e.value,r.value),o()},i=t.j;return i&&t.removeEventListener("DOMContentLoaded",i),t.addEventListener("DOMContentLoaded",a),t.j=a,{variable:function(t,n){return r.set(t,n),{set value(n){u(t,n)},get value(){return r.value[t]},set:function(n){u(t,n)}}}}}(document).variable;function A(t){return function(t){if(Array.isArray(t))return M(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,n){if(t){if("string"==typeof t)return M(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?M(t,n):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function M(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}var O=j("todos",[{text:"hello",done:!1}]);j("save",(function(){var t=document.querySelector("[data-input=todo");null!=t&&t.value&&(O.set([].concat(A(O.value),[{text:t.value,done:!1}])),t.value="")})),j("toggleTodo",(function(t){var n=A(O.value);n[t].done=!n[t].done,O.set(n)})),j("Checkbox",(function(t){var n=t.index,e=void 0===n?-1:n,r=t.checked,o=void 0!==r&&r;return'<input type="checkbox" id="todo'.concat(e,'" data-on-change="toggleTodo(').concat(e,')" ').concat(o?"checked":""," />")}));var k=j("counter",0);return j("increment",(function(){k.set(k.value+1)})),t})()));