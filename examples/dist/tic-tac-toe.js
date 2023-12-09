!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["t"]=t():n["t"]=t()}(self,(()=>(()=>{"use strict";var n={};function t(n,t){var r=n(t);return Array.isArray(r)&&(r=r.join("")),r}function r(n){for(var t=n.indexOf("{{"),r=0,e=t;e<n.length;e++)if("{"===n[e]&&"{"===n[e+1]?(r++,e++):"}"===n[e]&&"}"===n[e+1]&&(r--,e++),0===r)return{start:t,end:e};return{start:t,end:-1}}(n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"o",{value:!0})})(n);var e={},o=function(n,t){try{var r=n+JSON.stringify(Object.keys(t).join(""));if(!e[r]){var o="return (state) => {".concat(Object.keys(t).map((function(n){return"const ".concat(n,' = state["').concat(n,'"];')})).join("\n")," return ").concat(n,"}");e[r]=Function(o)()}return e[r]}catch(t){throw new Error("Failed to create function from expression {{".concat(n,"}}: ").concat(t.message))}},u=function(n,r,e){for(var u=n,i="",a=0;a<r.length;a++){var f=r[a],c=f.start,l=f.end,v=f.value,d=u.slice(0,c),s=u.slice(l+1),h=t(o(v,e),e);i+="".concat(d).concat(h),u=s}return i+u},i=function(n){for(var t,e,o=[],u=String(n),i=!0;i;){var a=r(u),f=a.start,c=a.end;if(-1===c){i=!1;break}var l=u.slice(f+2,c-1),v=u.slice(c+1),d=(t=l,e=void 0,(e=document.createElement("div")).innerHTML=function(n){return n.replace(/<(?=[^<>]*>)/g,"&lt;").replace(/(?<=[^<>]*)>/g,"&gt;")}(t),(e.textContent||e.innerText||"").replace(/[\r\n]+/g,""));o.push({start:f,end:c,value:d}),u=v}return o},a=function(n){return Array.from(n.attributes).map((function(n){var t=i(n.value);return{name:n.name,value:n.value,u:t,i:!!t.length}}))},f=function(n){return n.split("-").reduce((function(n,t,r){return n+(r?t[0].toUpperCase()+t.slice(1):t)}),"")};function c(n){return"true"===n||"false"!==n&&("null"===n?null:"undefined"===n?void 0:""===n?"":isNaN(Number(n))?n:Number(n))}var l={};function v(n,t){var r=JSON.stringify(n)+JSON.stringify(t);if(!l[r]){for(var e=Object.assign({},t),o=0;o<n.length;o++)e[f(n[o].name)]=c(n[o].i?u(n[o].value,n[o].u,t):n[o].value);l[r]=e}return l[r]}function d(n,t,r,e){var o=e.find((function(t){return t.id===n}));if(!o)return v(t,r);var u=d(o.parentId,o.attributes,r,e);return Object.assign({},u,v(t,u))}function s(n){return(new DOMParser).parseFromString(n,"text/html").body.firstChild}function h(n,t){for(var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){return!0},e=[],o=document.evaluate(t,n,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null),u=o.iterateNext();u;)r(u)&&e.push(u),u=o.iterateNext();return e}function m(n,t,r){if(null===n)return t;var e=r.find((function(t){return t.id===n}));return m(e.parentId,e.attributes,r).concat(t)}var b=/<\/?[\w-]+/g,p=/[\w-]+(\s*=\s*("|')[^"']*("|'))/g,y=/[^\w\s()]/g,w=/\s+/g;function g(n,t,r,e,o){var a,f=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],c=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,l=e.replace(/>\s*([\s\S]*?)\s*</g,">$1<"),v=i(l),d=u(l,v,o),h=s(d),g=l+" "+m(c,f,t.list).map((function(n){return n.value})).join(" "),O=i(g).map((function(n){return n.value})).join(" ").replace(b,"").replace(p,"$1").replace(y," ").replace(w," ");return t.add({id:n,parentId:c,element:h,l,lastTemplateEvaluation:d,v:O,attributes:f,u:v,shouldUpdate:!1}),null===(a=r.parentElement)||void 0===a||a.replaceChild(h,r),h}function O(n,t,r,e){function o(){return Reflect.construct(HTMLElement,[],o)}o.prototype=Object.create(HTMLElement.prototype),o.prototype.constructor=o,o.prototype.connectedCallback=function(n,t,r){return function(){var e=r.id(),o=function(n){var t=a(n),r=i(n.innerHTML);return t.push({name:"children",value:n.innerHTML,u:r,i:!!r.length}),t}(this),u=function(n,t){var r=s(n);if(r.nodeType!==Node.TEXT_NODE){x(r,t);for(var e=r.querySelectorAll("*"),o=0;o<e.length;o++)x(e[o],t)}var u=r.outerHTML;return u||(u=r.textContent||""),u}(n.innerHTML,e),f=this.dataset.parentId?Number(this.dataset.parentId):null,c=d(f,o,t,r.list);g(e,r,this,u,c,o,f).cogAnchorId=e}}(t,r,e),customElements.define(n,o)}function x(n,t){n.tagName.includes("-")&&n.setAttribute("data-parent-id",String(t))}var j=function(n,t,r){var e=t.getAttribute("data-on-".concat(n));if(!e)throw new Error("Missing data-handler attribute");var u=o(e,r);return function(t){try{u(r),t.preventDefault()}catch(t){throw new Error("".concat(t.message,": data-on-").concat(n,"=").concat(e))}}};function N(n,t,r){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var e=j(t,n,r);n.addEventListener(t,e),n["".concat(t,"Handler")]=e}))}function S(n,t){N(n,"click",t),N(n,"change",t)}function A(n,t){for(var r=[],e=0;e<n.attributes.length;e++){var o=n.attributes[e],u=t.getAttribute(o.name);u!==o.value&&r.push({name:o.name,newValue:c(u||"")})}return r}function E(n,t){if(t.name.startsWith("data-attribute-")){var r=t.name.substring(15);t.newValue?(n[r]=!0,n.setAttribute(r,t.newValue)):(n[r]=!1,n.removeAttribute(r))}}var M=function(n){return n.nodeType!==Node.TEXT_NODE&&-1!==n.tagName.indexOf("-")};function I(n,t){n.querySelectorAll("[data-on-".concat(t,"]")).forEach((function(n){var r=n["".concat(t,"Handler")];r&&n.removeEventListener(t,r)}))}function T(n,t){if(n.nodeType===Node.TEXT_NODE)return function(n,t){var r;return n.textContent!==t.textContent?[{node:n,content:null!==(r=t.textContent)&&void 0!==r?r:""}]:[]}(n,t);var r,e=A(n,t),o=e.length>0?[{node:t,attributes:e}]:[];return M(n)?o.concat((r=t,n.innerHTML!==r.innerHTML?[{node:r,content:r.innerHTML}]:[])):o.concat(function(n,t){for(var r=[],e=[],o=Math.max(n.childNodes.length,t.childNodes.length),u=[],i=0;i<o;i++){var a,f,c=n.childNodes[i],l=t.childNodes[i];if((null==c?void 0:c.nodeType)===Node.TEXT_NODE&&(null==l?void 0:l.nodeType)===Node.TEXT_NODE){if((null===(a=c.textContent)||void 0===a?void 0:a.trim())!==(null===(f=l.textContent)||void 0===f?void 0:f.trim()))return[{node:t,content:t.innerHTML}]}else c?l?u=u.concat(T(c,l)):r.push(c):e.push(l)}return r.length&&u.push({node:t,h:r}),e.length&&u.push({node:t,m:e}),u}(n,t))}function C(n,t,r){for(var e=[],o=n;o!==t;)e.unshift(Array.prototype.indexOf.call(o.parentNode.childNodes,o)),o=o.parentNode;for(var u=r,i=0;i<e.length;i++){var a=e[i];if(!u.childNodes[a])return null;u=u.childNodes[a]}return u}var X=function(n,t,r,e,o,u,i,f){M(t)?function(n,t,r,e,o){var u,i=[];if((null!==(u=null==e?void 0:e.slice())&&void 0!==u?u:[]).length&&(i=a(n)),void 0!==r&&i.push({name:"children",value:r,u:[],i:!1}),i.length){var f=o.index[t.cogAnchorId],c=function(n,t){for(var r=n.concat(t),e={},o=0;o<r.length;o++)e[r[o].name]=r[o];return Object.values(e)}(o.list[f].attributes,i);o.update(f,"attributes",c)}}(t,n,r,e,f):void 0!==r?function(n,t,r){var e;n.nodeType===Node.TEXT_NODE?n.textContent=t:(I(e=n,"click"),I(e,"change"),n.innerHTML=t,S(n,r))}(n,r,i):void 0!==e?function(n,t){for(var r=0;r<t.length;r++)E(n,t[r]),n.setAttribute(t[r].name,t[r].newValue)}(n,e):o.length?function(n,t){for(var r=document.createDocumentFragment(),e=0;e<t.length;e++)r.appendChild(t[e]);n.appendChild(r)}(n,o):u.length&&function(n,t){for(var r=0;r<t.length;r++)n.removeChild(t[r])}(n,u)},k=function(n){return new RegExp("\\b".concat(n,"\\b|[^\\w]").concat(n,"[^\\w]"),"gm")};function F(n,t,r,e,o,u){for(var i=0;i<n.length;i++){var a=C(n[i].node,r,e),f=H(n[i],t,e),c=f.p,l=f.O;X(a,n[i].node,n[i].content,n[i].attributes,c,l,o,u)}}function H(n,t,r){var e=[],o=[];if(void 0!==n.m&&(o=n.m),void 0!==n.h)for(var u=0;u<n.h.length;u++){var i=C(n.h[u],t,r);i&&e.push(i)}return{p:o,O:e}}function R(n,t){return!!t.shouldUpdate||function(n,t){return n.map(k).some((function(n){return n.test(t)}))}(n,t.v)}var U=function(){var n={j:0,list:[],index:{},get value(){return this.list},add:function(n){this.list.push(n),this.index[n.id]=this.list.length-1},update:function(n,t,r){"attributes"===t&&(this.list[n].shouldUpdate=!0),this.list[n][t]=r},N:function(){this.list=this.list.filter((function(n){var t=n.element;return document.body.contains(t)})),this.index=this.list.reduce((function(n,t,r){return n[t.id]=r,n}),{})},id:function(){return this.j++}},t=null,r={state:null,S:[],get value(){return this.state||(this.state={}),this.state},set:function(n,t){this.state||(this.state={}),this.state[n]=t,this.S.push(n)},A:function(){this.S=[]}};var e=0;function o(o,i){r.set(o,i),null!==t&&cancelAnimationFrame(t),t=requestAnimationFrame((function(t){t-e>16.666666666666668&&(e=t,function(n,t,r){for(var e=0;e<n.value.length;e++){var o=n.value[e],i=o.parentId,a=o.attributes,f=o.element,c=o.l,l=o.lastTemplateEvaluation,v=o.u;if(R(r,n.value[e])){n.update(e,"shouldUpdate",!1);var h=d(i,a,t,n.list),m=u(c,v,h),b=s(m),p=s(l),y=T(p,b);y.length>0&&(n.update(e,"lastTemplateEvaluation",m),F(y,p,b,f,h,n))}}}(n,r.value,r.S),n.N(),r.A())}))}return{render:function(t){!function(n,t,r){for(var e=h(n,"self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]",(function(n){return!M(n)})),o=0;o<e.length;o++){var u=r.id(),i=e[o];i.innerHTML=i.innerHTML.trim();for(var a=g(u,r,i,i.outerHTML,t),f=A(i,a),c=0;c<f.length;c++)E(a,f[c])}}(t,r.value,n),function(n,t,r){for(var e=h(n,"template"),o=document.createDocumentFragment(),u=0;u<e.length;u++){var i=e[u].getAttribute("id");if(i){if(e[u].innerHTML=e[u].innerHTML.replace(/[\r\n]+\s*/g,""),1!==e[u].content.childNodes.length)throw new Error("Template ".concat(i," should have a single child"));O(i,e[u],t,r),o.appendChild(e[u])}}o.textContent=""}(t,r.value,n),S(t,r.value)},variable:function(n,t){return r.set(n,t),{set value(t){o(n,t)},get value(){return r.value[n]},set:function(t){o(n,t)}}}}}(),D=U.variable,J=U.render;function L(n,t){return function(n){if(Array.isArray(n))return n}(n)||function(n,t){var r=null==n?null:"undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(null!=r){var e,o,u,i,a=[],f=!0,c=!1;try{if(u=(r=r.call(n)).next,0===t){if(Object(r)!==r)return;f=!1}else for(;!(f=(e=u.call(r)).done)&&(a.push(e.value),a.length!==t);f=!0);}catch(n){c=!0,o=n}finally{try{if(!f&&null!=r.M&&(i=r.M(),Object(i)!==i))return}finally{if(c)throw o}}return a}}(n,t)||$(n,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function $(n,t){if(n){if("string"==typeof n)return q(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);return"Object"===r&&n.constructor&&(r=n.constructor.name),"Map"===r||"Set"===r?Array.from(n):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?q(n,t):void 0}}function q(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}document.addEventListener("DOMContentLoaded",(function(){J(document.getElementById("app"))}));var B=D("history",[Array(9).fill("")]),P=0,_=function(){return P%2==0},K=D("status","Next player: X"),V=D("squares",B.value[0]);function W(n){for(var t=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],r=0;r<t.length;r++){var e=L(t[r],3),o=e[0],u=e[1],i=e[2];if(n[o]&&n[o]===n[u]&&n[o]===n[i])return K.set("Winner: "+n[o]),n[o]}return 10===B.value.length?(K.set("Draw"),null):(K.set("Next player: "+(_()?"X":"O")),null)}return window.jumpTo=function(n){P=n,V.set(B.value[P]),K.set("Next player: "+(_()?"X":"O"))},window.handleClick=function(n){if(!W(V.value)&&!V.value[n]){var t=V.value.slice();_()?t[n]="X":t[n]="O",function(n){var t,r=[].concat(function(n){if(Array.isArray(n))return q(n)}(t=B.value.slice(0,P+1))||function(n){if("undefined"!=typeof Symbol&&null!=n[Symbol.iterator]||null!=n["@@iterator"])return Array.from(n)}(t)||$(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),[n]);P=r.length-1,B.set(r),V.set(n),W(n)}(t)}},n})()));