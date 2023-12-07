!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["t"]=t():n["t"]=t()}(self,(()=>(()=>{"use strict";var n={};function t(n,t){var r=n(t);return Array.isArray(r)&&(r=r.join("")),r}function r(n){for(var t=n.indexOf("{{"),r=0,e=t;e<n.length;e++)if("{"===n[e]&&"{"===n[e+1]?(r++,e++):"}"===n[e]&&"}"===n[e+1]&&(r--,e++),0===r)return{start:t,end:e};return{start:t,end:-1}}(n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"i",{value:!0})})(n);var e={},i=function(n,t){try{var r=n+JSON.stringify(Object.keys(t).join(""));if(!e[r]){var i="return (state) => {".concat(Object.keys(t).map((function(n){return"const ".concat(n,' = state["').concat(n,'"];')})).join("\n")," return ").concat(n,"}");e[r]=Function(i)()}return e[r]}catch(t){throw new Error("Failed to create function from expression {{".concat(n,"}}: ").concat(t.message))}},u=function(n,r,e){for(var u=n,o="",a=0;a<r.length;a++){var f=r[a],c=f.start,l=f.end,v=f.value,s=u.slice(0,c),d=u.slice(l+1),h=t(i(v,e),e);o+="".concat(s).concat(h),u=d}return o+u},o=function(n){for(var t,e,i=[],u=String(n),o=!0;o;){var a=r(u),f=a.start,c=a.end;if(-1===c){o=!1;break}var l=u.slice(f+2,c-1),v=u.slice(c+1),s=(t=l,e=void 0,(e=document.createElement("div")).innerHTML=function(n){return n.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(t),(e.textContent||e.innerText||"").replace(/[\r\n]+/g,""));i.push({start:f,end:c,value:s}),u=v}return i},a=function(n){return n.split("-").reduce((function(n,t,r){return n+(r?t[0].toUpperCase()+t.slice(1):t)}),"")};function f(n){return"true"===n||"false"!==n&&("null"===n?null:"undefined"===n?void 0:""===n?"":isNaN(Number(n))?n:Number(n))}var c={};function l(n,t){var r=JSON.stringify(n)+JSON.stringify(t);if(!c[r]){for(var e=Object.assign({},t),i=0;i<n.length;i++)e[a(n[i].name)]=f(n[i].u?u(n[i].value,n[i].o,t):n[i].value);c[r]=e}return c[r]}var v=function(n){return Array.from(n.attributes).map((function(n){var t=o(n.value);return{name:n.name,value:n.value,o:t,u:!!t.length}}))},s=function(n){return n.replace(/[\r\n]+\s*/g,"")};function d(n){return(new DOMParser).parseFromString(n,"text/html").body.firstChild}function h(n,t,r,e,i){var u=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],o=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,a=arguments.length>7&&void 0!==arguments[7]?arguments[7]:[];t.add({id:n,parentId:o,element:r,l:e,lastTemplateEvaluation:i,attributes:u,o:a,shouldUpdate:!1})}function m(n,t,r){for(var e=function(n){for(var t=[],r=document.evaluate("template",n,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),e=r.iterateNext();e;)t.push(e),e=r.iterateNext();return t}(n),i=document.createDocumentFragment(),u=0;u<e.length;u++){var o=e[u].getAttribute("id");if(o){if(e[u].innerHTML=s(e[u].innerHTML),1!==e[u].content.childNodes.length)throw new Error("Template ".concat(o," should have a single child"));p(o,e[u],t,r),i.appendChild(e[u])}}i.textContent=""}function p(n,t,r,e){function i(){return Reflect.construct(HTMLElement,[],i)}i.prototype=Object.create(HTMLElement.prototype),i.prototype.constructor=i,i.prototype.connectedCallback=function(n,t,r){return function(){var e,i=r.id(),a=v(this),f=o(this.innerHTML);a.push({name:"children",value:this.innerHTML,o:f,u:!!f.length});var c=d(n.innerHTML);if(c.nodeType!==Node.TEXT_NODE)for(var l=c.querySelectorAll("*"),s=0;s<l.length;s++){var m=l[s];m.tagName.includes("-")&&m.setAttribute("data-parent-id",String(i))}var p=c.outerHTML;p||(p=c.textContent||"");var g=this.dataset.parentId?Number(this.dataset.parentId):null,w=d(p),y=o(p);try{var x=b(g,a,t,r.list);w=d(u(p,y,x))}catch(n){}w.cogAnchorId=i,null===(e=this.parentElement)||void 0===e||e.replaceChild(w,this),h(i,r,w,p,null,a,g,y)}}(t,r,e),customElements.define(n,i)}function b(n,t,r,e){var i=e.find((function(t){return t.id===n}));if(!i)return l(t,r);var u=b(i.parentId,i.attributes,r,e);return Object.assign({},u,l(t,u))}var g=function(n,t,r){var e=t.getAttribute("data-on-".concat(n));if(!e)throw new Error("Missing data-handler attribute");var u=i(e,r);return function(t){try{u(r),t.preventDefault()}catch(t){throw new Error("".concat(t.message,": data-on-").concat(n,"=").concat(e))}}};function w(n,t,r){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var e=g(t,n,r);n.addEventListener(t,e),n["".concat(t,"Handler")]=e}))}function y(n,t){w(n,"click",t),w(n,"change",t)}var x=function(n){return n.nodeType!==Node.TEXT_NODE&&-1!==n.tagName.indexOf("-")},N=function(n,t){for(var r=[],e=document.evaluate("self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",n,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),i=e.iterateNext();i;)x(i)||r.push(i),i=e.iterateNext();for(var u=0;u<r.length;u++){var a=t.id(),f=r[u];f.innerHTML=f.innerHTML.trim();var c=f.outerHTML,l=o(c);h(a,t,f,c,-1!==c.indexOf("data-attribute")?c:null,[],null,l)}};function O(n,t){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var r=n["".concat(t,"Handler")];r&&n.removeEventListener(t,r)}))}function j(n,t){if(n.nodeType===Node.TEXT_NODE)return function(n,t){var r;return n.textContent!==t.textContent?[{node:n,content:null!==(r=t.textContent)&&void 0!==r?r:""}]:[]}(n,t);n.innerHTML=s(n.innerHTML),t.innerHTML=s(t.innerHTML);var r=function(n,t){for(var r=[],e=0;e<n.attributes.length;e++){var i=n.attributes[e],u=t.getAttribute(i.name);u!==i.value&&r.push({name:i.name,newValue:f(u||"")})}return r}(n,t);return(r.length>0?[{node:n,attributes:r}]:[]).concat(function(n,t){for(var r=[],e=!1,i=[],u=[],o=Math.max(n.childNodes.length,t.childNodes.length),a=0;a<o;a++){var f,c,l=n.childNodes[a],v=t.childNodes[a];if(void 0!==l&&l.nodeType===Node.TEXT_NODE&&void 0!==v&&v.nodeType===Node.TEXT_NODE){if((null===(f=l.textContent)||void 0===f?void 0:f.trim())!==(null===(c=v.textContent)||void 0===c?void 0:c.trim())){e=!0;break}}else void 0===l&&void 0!==v?u.push(v):void 0!==l&&void 0===v?i.push(l):r=r.concat(j(l,v))}return i.length>0&&r.push({node:n,v:i}),u.length>0&&r.push({node:n,h:u}),e?[{node:n,content:t.innerHTML}]:r}(n,t))}function E(n,t,r){for(var e=[],i=n;i!==t;)e.unshift(Array.prototype.indexOf.call(i.parentNode.childNodes,i)),i=i.parentNode;for(var u=r,o=0;o<e.length;o++){var a=e[o];if(!u.childNodes[a])return null;u=u.childNodes[a]}return u}function S(n,t){if(t.name.startsWith("data-attribute-")){var r=t.name.substring(15);t.newValue?(n[r]=!0,n.setAttribute(r,t.newValue)):(n[r]=!1,n.removeAttribute(r))}}var M=function(n,t,r,e,i,u,a,f){if(x(t)){var c,l=null!==(c=null==e?void 0:e.slice())&&void 0!==c?c:[];if(void 0!==r&&l.push({name:"children",newValue:r}),l.length){var v=function(n){return n.map((function(n){var t=o(n.newValue);return{name:n.name,value:n.newValue,o:t,u:!!t.length}}))}(l),s=f.index[n.cogAnchorId],d=f.list[s];f.update(s,"attributes",function(n,t){for(var r=n.concat(t),e={},i=0;i<r.length;i++)e[r[i].name]=r[i];return Object.values(e)}(d.attributes,v))}}else{if(void 0!==r)n.nodeType===Node.TEXT_NODE?n.textContent=r:(O(g=n,"click"),O(g,"change"),n.innerHTML=r,y(n,a));else if(void 0!==e)for(var h=0;h<e.length;h++)S(n,e[h]),n.setAttribute(e[h].name,e[h].newValue);else if(i.length){for(var m=document.createDocumentFragment(),p=0;p<i.length;p++)m.appendChild(i[p]);n.appendChild(m)}else if(u.length)for(var b=0;b<u.length;b++)n.removeChild(u[b]);var g}};function A(n,t,r,e){if(null===n)return l(t,r);var i=e.find((function(t){return t.id===n})),u=A(i.parentId,i.attributes,r,e);return Object.assign({},u,l(t,u))}function T(n,t,r){if(null===n)return t;var e=r.find((function(t){return t.id===n}));return T(e.parentId,e.attributes,r).concat(t)}var k=function(n,t){return n.some((function(n){return new RegExp("(\\s".concat(n,"\\s|{").concat(n,"\\s|\\s").concat(n,"}|{").concat(n,"}|(").concat(n,"))"),"gm").test(t)}))};function R(){return{m:0,list:[],index:{},get value(){return this.list},add:function(n){this.list.push(n),this.index[n.id]=this.list.length-1},update:function(n,t,r){"attributes"===t&&(this.list[n].shouldUpdate=!0),this.list[n][t]=r},p:function(n){this.list=n.filter((function(n){var t=n.element;return document.body.contains(t)})),this.index=this.list.reduce((function(n,t,r){return n[t.id]=r,n}),{})},id:function(){return this.m++}}}var F=(0,function(n){var t=R(),r=function(n){return{element:null,get value(){if(this.element||(this.element=n.querySelector("#app")),!this.element)throw new Error("No app element found!");return this.element}}}(n),e=null,i={state:null,N:[],get value(){return this.state||(this.state={}),this.state},set:function(n,t){this.state||(this.state={}),this.state[n]=t,this.N.push(n)},O:function(){this.N=[]}};function o(n,r){i.set(n,r),null!==e&&cancelAnimationFrame(e),e=requestAnimationFrame((function(){!function(n,t,r){for(var e=0;e<n.value.length;e++){var i=n.value[e],o=i.id,a=i.parentId,f=i.attributes,c=i.element,l=i.l,v=i.lastTemplateEvaluation,s=i.o,h=i.shouldUpdate,m=T(a,f,n.list);if(k(r,l+" "+m.map((function(n){return n.value})).join(" "))||h){h&&n.update(e,"shouldUpdate",!1);var p=null,b=A(a,f,t,n.list);try{p=u(l,s,b)}catch(n){console.error(n);continue}var g=d(p);if(null===v){var w;n.update(e,"lastTemplateEvaluation",p),n.update(e,"element",g),g.cogAnchorId=o,null===(w=c.parentNode)||void 0===w||w.replaceChild(g,c)}else{var y=d(v),x=j(y,g);if(x.length>0){n.update(e,"lastTemplateEvaluation",p);for(var N=0;N<x.length;N++){var O=E(x[N].node,y,c),S=[],R=[];if(void 0!==x[N].h&&(R=x[N].h),void 0!==x[N].v)for(var F=0;F<x[N].v.length;F++){var H=E(x[N].v[F],y,c);H&&S.push(H)}M(O,x[N].node,x[N].content,x[N].attributes,R,S,b,n)}}}}}n.p(n.list)}(t,i.value,i.N),i.O()}))}return N(r.value,t),m(r.value,i.value,t),y(r.value,i.value),{variable:function(n,t){return o(n,t),{set value(t){o(n,t)},get value(){return i.value[n]},set:function(t){o(n,t)}}}}}(document).variable)("checked",!1);return window.toggleChecked=function(){F.value=!F.value},n})()));