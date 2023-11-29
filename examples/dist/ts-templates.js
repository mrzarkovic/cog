!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports["t"]=n():t["t"]=n()}(self,(()=>(()=>{"use strict";var t={};function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function r(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=new Array(n);r<n;r++)e[r]=t[r];return e}function e(t,n){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(t);n&&(e=e.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),r.push.apply(r,e)}return r}function o(t){for(var r=1;r<arguments.length;r++){var o=null!=arguments[r]?arguments[r]:{};r%2?e(Object(o),!0).forEach((function(r){var e,i,a;e=t,i=r,a=o[r],(i=function(t){var r=function(t,r){if("object"!==n(t)||null===t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var o=e.call(t,"string");if("object"!==n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"===n(r)?r:String(r)}(i))in e?Object.defineProperty(e,i,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[i]=a})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(o,n))}))}return t}(t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"o",{value:!0})})(t);var i=/\{\{(.+?)\}\}/,a=function(t,n){var r="return (state) => {".concat(Object.keys(n).map((function(t){return"const ".concat(t,' = state["').concat(t,'"];')})).join("\n")," return ").concat(t,"}");return Function(r)()};function u(t,n){try{var r=a(t,n)(n);return Array.isArray(r)&&(r=r.join("")),r}catch(n){throw new Error("Failed to create function from expression {{".concat(t,"}}: ").concat(n.message))}}function f(t){for(var n=t.indexOf("{{"),r=0,e=n;e<t.length;e++)if("{{"===t.slice(e,e+2)?(r++,e++):"}}"===t.slice(e,e+2)&&(r--,e++),0===r)return{start:n,end:e};return{start:n,end:-1}}var c=function(t){return t.split("-").reduce((function(t,n,r){return t+(r?n[0].toUpperCase()+n.slice(1):n)}),"")},v=function(t){return t.tagName.includes("-")},l=function(t,n){for(var r=t,e=!0,o="";e;){var i=f(r),a=i.start,c=i.end;if(-1===c){e=!1;break}var v=r.slice(a+2,c-1),l=r.slice(0,a),d=r.slice(c+1),s=u((b=v,m=void 0,(m=document.createElement("div")).innerHTML=function(t){return t.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(b),m.textContent||m.innerText||""),n);o+="".concat(l).concat(s),r=d}var b,m;return o+r};function d(t,n){for(var r=[],e=0;e<t.attributes.length;e++){var o=t.attributes[e],i=n.getAttribute(o.name);i!==o.value&&r.push({name:o.name,newValue:i||""})}return r}var s=function(t){return t.replace(/[\r\n]+\s*/g,"")};function b(t,n){var r=document.createElement("div");r.innerHTML=t;var e=document.createElement("div");return e.innerHTML=n,function t(n,r){if(n.nodeType===Node.TEXT_NODE)return n.textContent!==r.textContent?[{element:n,content:r.innerHTML}]:[];n.innerHTML=s(n.innerHTML),r.innerHTML=s(r.innerHTML);for(var e=!1,o=[],i=0;i<n.childNodes.length;i++){var a=n.childNodes[i],u=r.childNodes[i];if(a.nodeType===Node.TEXT_NODE&&u&&u.nodeType===Node.TEXT_NODE){if(a.textContent!==u.textContent){e=!0;break}}else if(a.nodeType===Node.ELEMENT_NODE){var f=d(a,u);f.length>0&&o.push({element:a,attributes:f})}}if(e)return[{element:n,content:r.innerHTML}];for(var c=0;c<n.childNodes.length;c++){var v=t(n.childNodes[c],r.childNodes[c]);o=o.concat(v)}return o}(r,e)}var m=function(t){return Array.from(t.attributes).map((function(t){var n=i.exec(t.value);return{name:t.name,value:n?n[1]:t.value,i:!!n}}))},y=function(t,n){for(var r=[],e=document.evaluate("self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),o=e.iterateNext();o;){if(!v(o)){var i=m(o);r.push({element:o,u:o.innerHTML,attributes:i,v:n})}o=e.iterateNext()}return r},p=function(t){for(var n=[],r=document.evaluate("template",t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),e=r.iterateNext();e;)e.innerHTML=s(e.innerHTML),n.push(e),e=r.iterateNext();return n};function h(t,n){j(t,"click",n),j(t,"change",n)}function j(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"click",r=arguments.length>2?arguments[2]:void 0;t.querySelectorAll("[data-on-".concat(n,"]")).forEach((function(t){var e=O(n,t,r);t.addEventListener(n,e),t["".concat(n,"Handler")]=e}))}function w(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"click";null==t||t.querySelectorAll("[data-on-".concat(n,"]")).forEach((function(t){var r=t["".concat(n,"Handler")];r&&t.removeEventListener(n,r)}))}var O=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"click",n=arguments.length>2?arguments[2]:void 0,r=(arguments.length>1?arguments[1]:void 0).getAttribute("data-on-".concat(t));if(!r)throw new Error("Missing data-handler attribute");var e=a(r,n);return function(o){try{e(n),o.preventDefault()}catch(o){throw new Error("".concat(o.message,": data-on-").concat(t,"=").concat(r))}}},g=function(t){return t.filter((function(t){var n=t.element;return document.body.contains(n)}))},S=function(t){var n={},e=[],i=[],a=[];function f(e){function f(){return Reflect.construct(HTMLElement,[],f)}f.prototype=Object.create(HTMLElement.prototype),f.prototype.constructor=f,f.prototype.connectedCallback=function(){var e,f,v,d=this,s=i.find((function(t){return t.getAttribute("id")===d.tagName.toLowerCase()})),b=m(d),y=t.createElement("div");y.innerHTML=s.innerHTML.replace(/\{\{\s*children\s*\}\}/g,d.innerHTML);var p,h=o({},n),j=function(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return r(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?r(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var o=0,i=function(){};return{s:i,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,f=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return u=t.done,t},e:function(t){f=!0,a=t},f:function(){try{u||null==e.l||e.l()}finally{if(f)throw a}}}}(b);try{for(j.s();!(p=j.n()).done;){var w=p.value,O=w.value;w.i&&(O=u(O,n)),h[c(w.name)]=O}}catch(t){j.e(t)}finally{j.f()}var S=y.innerHTML,N=[];(null===(e=y.firstChild)||void 0===e?void 0:e.nodeType)!==Node.TEXT_NODE&&(N=m(y.firstChild));var A=l(y.innerHTML,h);y.innerHTML=A;var E=y.firstChild;null===(f=d.parentNode)||void 0===f||f.insertBefore(E,d),!d.dataset.m&&E&&(E.p=A,a.push({element:E,u:S,attributes:N,v:b}),a=g(a)),null===(v=d.parentNode)||void 0===v||v.removeChild(d)},customElements.define(e,f)}var v={element:null,get value(){if(this.element||(this.element=t.querySelector("#app")),!this.element)throw new Error("No app element found!");return this.element}};function j(){(function(t,n){for(var r=0,e=function(){var e=o({},n),i=t[r],a=i.element,f=i.u,v=i.attributes,b=i.v;if(b)for(var m=0;m<b.length;m++){var y=b[m],p=y.name,j=y.value,O=y.i?u(j,e):j;e[c(p)]=O}if(v)for(var g=0;g<v.length;g++){var S=v[g],N=S.name,A=S.value,E=S.i?u(A,e):A;E!==a.getAttribute(N)&&a.setAttribute(N,E)}var M,x,k,T=l(f,e);if(a.nodeType===Node.TEXT_NODE)a.textContent!==T&&(a.textContent=T);else{var C=(x=T,(k=(M=a).cloneNode()).innerHTML=x,function t(n,r){if(n.nodeType===Node.TEXT_NODE)return n.textContent!==r.textContent?[{element:n,content:r.innerHTML}]:[];n.innerHTML=s(n.innerHTML),r.innerHTML=s(r.innerHTML);for(var e=!1,o=[],i=0;i<n.childNodes.length;i++){var a=n.childNodes[i],u=r.childNodes[i];if(a.nodeType===Node.TEXT_NODE&&u&&u.nodeType===Node.TEXT_NODE){if(a.textContent!==u.textContent){e=!0;break}}else if(a.nodeType===Node.ELEMENT_NODE){var f=d(a,u);f.length>0&&o.push({element:a,attributes:f})}}if(e)return[{element:n,content:r.innerHTML}];for(var c=0;c<n.childNodes.length;c++){var v=t(n.childNodes[c],r.childNodes[c]);o=o.concat(v)}return o}(M,k));C.length>0&&C.map((function(t){var n,r=t.element,o=t.content,i=t.attributes;void 0!==o?(w(n=r,"click"),w(n,"change"),r.innerHTML=o,h(r,e)):void 0!==i&&i.map((function(t){var n=t.name,e=t.newValue;r.setAttribute(n,e)}))}))}};r<t.length;r++)e()})(e,n),function(t,n){for(var r=0;r<t.length;r++){var e=o({},n),i=t[r],a=i.element,f=i.u,v=i.attributes,d=i.v;if(d)for(var s=0;s<d.length;s++){var m=d[s],y=m.name,p=m.value,h=m.i?u(p,e):p;e[c(y)]=h}if(v)for(var j=0;j<v.length;j++){var w=v[j],O=w.name,g=w.value,S=w.i?u(g,e):g;S!==a.getAttribute(O)&&a.setAttribute(O,S)}var N=l(f,e);if(b(a.p,N).length>0)if(a.p=N,a.nodeType===Node.TEXT_NODE)a.textContent=N;else{var A=(new DOMParser).parseFromString(N,"text/html").body.firstChild;a.innerHTML=A.innerHTML}}}(a,n)}function O(t,r){setTimeout((function(){n[t]=r,j()}),0)}var S=function(){e=y(v.value,[]),function(t){t.forEach((function(t){var n=t.getAttribute("id");if(!n)throw new Error("Missing id attribute");if(1!==t.content.childNodes.length)throw new Error("Template ".concat(n," should have a single child"));f(n)}))}(i=p(v.value)),h(v.value,n),j()},N=t.h;return N&&t.removeEventListener("DOMContentLoaded",N),t.addEventListener("DOMContentLoaded",S),t.h=S,{variable:function(t,r){return n[t]=r,{set value(n){O(t,n)},get value(){return n[t]},set:function(n){O(t,n)}}}}}(document).variable;S("foo","bar"),S("myValue","My Attribute");var N=S("count",0);return window.increment=function(){N.value++},S("names",["Alice","Bob","Carol"]),t})()));