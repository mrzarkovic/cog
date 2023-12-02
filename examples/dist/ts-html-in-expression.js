(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ts-html-in-expression"] = factory();
	else
		root["ts-html-in-expression"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/rootElement.ts
function createRootElement(document) {
  return {
    element: null,
    get value() {
      if (!this.element) {
        this.element = document.querySelector("#app");
      }
      if (!this.element) {
        throw new Error("No app element found!");
      }
      return this.element;
    }
  };
}
;// CONCATENATED MODULE: ./src/attributes/convertAttribute.ts
var convertAttribute = function convertAttribute(attribute) {
  return attribute.split("-").reduce(function (result, part, index) {
    return result + (index ? part[0].toUpperCase() + part.slice(1) : part);
  }, "");
};
;// CONCATENATED MODULE: ./src/attributes/convertAttributeValue.ts
function convertAttributeValue(value) {
  return value === "true" ? true : value === "false" ? false : !isNaN(Number(value)) ? Number(value) : value;
}
;// CONCATENATED MODULE: ./src/expressions/createExpressionScope.ts
var createExpressionScope = function createExpressionScope(expression, state) {
  var functionBody = "return (state) => {".concat(Object.keys(state).map(function (variable) {
    return "const ".concat(variable, " = state[\"").concat(variable, "\"];");
  }).join("\n"), " return ").concat(expression, "}");
  return Function(functionBody)();
};
;// CONCATENATED MODULE: ./src/expressions/evaluateExpression.ts

function evaluateExpression(expression, state) {
  try {
    var expressionWithScope = createExpressionScope(expression, state);
    var evaluated = expressionWithScope(state);
    if (Array.isArray(evaluated)) {
      evaluated = evaluated.join("");
    }
    return evaluated;
  } catch (e) {
    throw new Error("Failed to create function from expression {{".concat(expression, "}}: ").concat(e.message));
  }
}
;// CONCATENATED MODULE: ./src/attributes/attributesToState.ts



function attributesToState(attributes, state) {
  var localState = Object.assign({}, state);
  for (var i = 0; i < attributes.length; i++) {
    localState[convertAttribute(attributes[i].name)] = convertAttributeValue(attributes[i].reactive ? evaluateExpression(attributes[i].value, state) : attributes[i].value);
  }
  return localState;
}
;// CONCATENATED MODULE: ./src/html/findNextTemplateExpression.ts
function findNextTemplateExpression(htmlText) {
  var start = htmlText.indexOf("{{");
  var stack = 0;
  for (var i = start; i < htmlText.length; i++) {
    if (htmlText.slice(i, i + 2) === "{{") {
      stack++;
      i++;
    } else if (htmlText.slice(i, i + 2) === "}}") {
      stack--;
      i++;
    }
    if (stack === 0) {
      return {
        start: start,
        end: i
      };
    }
  }
  return {
    start: start,
    end: -1
  };
}
;// CONCATENATED MODULE: ./src/html/htmlToText.ts
function escapeHtml(html) {
  return html.replace(/<(?=[^<>]*>)/g, "&lt;").replace(/(?<=[^<>]*)>/g, "&gt;");
}
function htmlToText(html) {
  var tmp = document.createElement("div");
  tmp.innerHTML = escapeHtml(html);
  return tmp.textContent || tmp.innerText || "";
}
;// CONCATENATED MODULE: ./src/html/sanitizeHtml.ts
var sanitizeHtml = function sanitizeHtml(html) {
  return html.replace(/[\r\n]+\s*/g, "");
};
;// CONCATENATED MODULE: ./src/html/evaluateTemplate.ts




var evaluateTemplate = function evaluateTemplate(template, state) {
  var restOfContent = template;
  var hasTemplateExpression = true;
  var updatedContent = "";
  while (hasTemplateExpression) {
    var _findNextTemplateExpr = findNextTemplateExpression(restOfContent),
      start = _findNextTemplateExpr.start,
      end = _findNextTemplateExpr.end;
    if (end === -1) {
      hasTemplateExpression = false;
      break;
    }
    var htmlValue = restOfContent.slice(start + 2, end - 1);
    var before = restOfContent.slice(0, start);
    var after = restOfContent.slice(end + 1);
    var value = htmlToText(sanitizeHtml(htmlValue));
    var evaluated = evaluateExpression(value, state);
    updatedContent += "".concat(before).concat(evaluated);
    restOfContent = after;
  }
  updatedContent += restOfContent;
  return updatedContent;
};
;// CONCATENATED MODULE: ./src/expressions/templateExpressionRegex.ts
var templateExpressionRegex = /\{\{(.+?)\}\}/;
;// CONCATENATED MODULE: ./src/attributes/getAttributes.ts

var getAttributes = function getAttributes(element) {
  var attributes = Array.from(element.attributes).map(function (attribute) {
    var reactiveMatch = templateExpressionRegex.exec(attribute.value);
    return {
      name: attribute.name,
      value: reactiveMatch ? reactiveMatch[1] : attribute.value,
      reactive: !!reactiveMatch
    };
  });
  return attributes;
};
;// CONCATENATED MODULE: ./src/nodes/loadTemplates.ts
function loadTemplates(rootElement) {
  var xpath = "template";
  var templates = [];
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    templates.push(element);
    element = result.iterateNext();
  }
  return templates;
}
;// CONCATENATED MODULE: ./src/nodes/loadCustomElements.ts





function loadCustomElements(rootElement, state, customElements) {
  var templates = loadTemplates(rootElement);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < templates.length; i++) {
    var name = templates[i].getAttribute("id");
    if (name) {
      templates[i].innerHTML = sanitizeHtml(templates[i].innerHTML);
      if (templates[i].content.childNodes.length !== 1) {
        throw new Error("Template ".concat(name, " should have a single child"));
      }
      defineCustomElement(name, templates[i], state, customElements);
      fragment.appendChild(templates[i]);
    }
  }
  fragment.textContent = "";
}
function defineCustomElement(name, template, state, customElementsList) {
  function CustomElement() {
    return Reflect.construct(HTMLElement, [], CustomElement);
  }
  CustomElement.prototype = Object.create(HTMLElement.prototype);
  CustomElement.prototype.constructor = CustomElement;
  CustomElement.prototype.connectedCallback = renderCustomElement(template, state, customElementsList);
  customElements.define(name, CustomElement);
}
function renderCustomElement(template, state, customElements) {
  return function () {
    var _this$parentNode, _this$parentNode2;
    var attributes = getAttributes(this);
    var localState = attributesToState(attributes, state);
    var originalInvocation = template.innerHTML.replace(/\{\{\s*children\s*\}\}/g, this.innerHTML);
    var evaluatedTemplate = evaluateTemplate(originalInvocation, localState);
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = evaluatedTemplate;
    var newElement = tempDiv.firstChild;
    (_this$parentNode = this.parentNode) === null || _this$parentNode === void 0 || _this$parentNode.insertBefore(newElement, this);
    customElements.add({
      element: newElement,
      template: originalInvocation,
      lastTemplateEvaluation: evaluatedTemplate,
      parentAttributes: attributes
    });
    customElements.clean();
    (_this$parentNode2 = this.parentNode) === null || _this$parentNode2 === void 0 || _this$parentNode2.removeChild(this);
  };
}
;// CONCATENATED MODULE: ./src/eventListeners/makeEventHandler.ts

var makeEventHandler = function makeEventHandler(eventName, element, state) {
  var handler = element.getAttribute("data-on-".concat(eventName));
  if (!handler) {
    throw new Error("Missing data-handler attribute");
  }
  var handlerWithScope = createExpressionScope(handler, state);
  return function (e) {
    try {
      handlerWithScope(state);
      e.preventDefault();
    } catch (e) {
      throw new Error("".concat(e.message, ": data-on-").concat(eventName, "=").concat(handler));
    }
  };
};
;// CONCATENATED MODULE: ./src/eventListeners/addEventListeners.ts

function addEventListeners(parent, eventName, state) {
  parent.querySelectorAll("[data-on-".concat(eventName, "]")).forEach(function (element) {
    var handler = makeEventHandler(eventName, element, state);
    element.addEventListener(eventName, handler);
    element["".concat(eventName, "Handler")] = handler;
  });
}
;// CONCATENATED MODULE: ./src/eventListeners/addAllEventListeners.ts

function addAllEventListeners(parent, state) {
  addEventListeners(parent, "click", state);
  addEventListeners(parent, "change", state);
}
;// CONCATENATED MODULE: ./src/nodes/isCustomElement.ts
var isCustomElement = function isCustomElement(element) {
  return element.nodeType !== Node.TEXT_NODE && element.tagName.indexOf("-") !== -1;
};
;// CONCATENATED MODULE: ./src/nodes/loadNativeElements.ts

var loadNativeElements = function loadNativeElements(rootElement, nativeElements) {
  var xpath = "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]";
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    if (!isCustomElement(element)) {
      nativeElements.add({
        element: element,
        template: element.outerHTML,
        lastTemplateEvaluation: element.outerHTML,
        parentAttributes: []
      });
    }
    element = result.iterateNext();
  }
};
;// CONCATENATED MODULE: ./src/eventListeners/removeEventListeners.ts
function removeEventListeners(parent, eventName) {
  parent.querySelectorAll("[data-on-".concat(eventName, "]")).forEach(function (element) {
    var handler = element["".concat(eventName, "Handler")];
    if (handler) {
      element.removeEventListener(eventName, handler);
    }
  });
}
;// CONCATENATED MODULE: ./src/eventListeners/removeAllEventListeners.ts

function removeAllEventListeners(parent) {
  removeEventListeners(parent, "click");
  removeEventListeners(parent, "change");
}
;// CONCATENATED MODULE: ./src/attributes/getChangedAttributes.ts

function getChangedAttributes(oldElement, newElement) {
  var changedAttributes = [];
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var oldAttr = oldElement.attributes[i];
    var newAttrValue = newElement.getAttribute(oldAttr.name);
    if (newAttrValue !== oldAttr.value) {
      changedAttributes.push({
        name: oldAttr.name,
        newValue: convertAttributeValue(newAttrValue || "")
      });
    }
  }
  return changedAttributes;
}
;// CONCATENATED MODULE: ./src/nodes/compareNodes.ts



// TODO: changed custom element like <my-element></my-element> will
// be returned twice if both attributes and content changed.
// But either way the entire element will be updated, so it's suboptimal
// because the loop with changed elements will be longer for no reason.

function compareTextNodes(oldNode, newNode) {
  if (oldNode.textContent !== newNode.textContent) {
    var _newNode$textContent;
    return [{
      node: oldNode,
      newNode: newNode,
      content: (_newNode$textContent = newNode.textContent) !== null && _newNode$textContent !== void 0 ? _newNode$textContent : ""
    }];
  }
  return [];
}
function compareChildNodes(oldNode, newNode) {
  var changedChildren = [];
  for (var i = 0; i < oldNode.childNodes.length; i++) {
    var oldChild = oldNode.childNodes[i];
    var newChild = newNode.childNodes[i];
    if (oldChild.nodeType === Node.TEXT_NODE && (newChild === null || newChild === void 0 ? void 0 : newChild.nodeType) === Node.TEXT_NODE) {
      if (oldChild.textContent !== newChild.textContent) {
        changedChildren.push({
          node: oldNode,
          newNode: newNode,
          content: newNode.innerHTML
        });
        break;
      }
    } else {
      var changes = compareNodes(oldChild, newChild);
      changedChildren = changedChildren.concat(changes);
    }
  }
  return changedChildren;
}
function compareNodes(oldNode, newNode) {
  if (oldNode.nodeType === Node.TEXT_NODE) {
    return compareTextNodes(oldNode, newNode);
  }
  oldNode.innerHTML = sanitizeHtml(oldNode.innerHTML);
  newNode.innerHTML = sanitizeHtml(newNode.innerHTML);
  var changedAttributes = getChangedAttributes(oldNode, newNode);
  var changedChildren = changedAttributes.length > 0 ? [{
    node: oldNode,
    newNode: newNode,
    attributes: changedAttributes
  }] : [];
  return changedChildren.concat(compareChildNodes(oldNode, newNode));
}
;// CONCATENATED MODULE: ./src/nodes/elementFromString.ts
function elementFromString(htmlString) {
  var parser = new DOMParser();
  var newElementDoc = parser.parseFromString(htmlString, "text/html");
  return newElementDoc.body.firstChild;
}
;// CONCATENATED MODULE: ./src/nodes/findCorrespondingNode.ts
function findCorrespondingNode(nodeInA, rootA, rootB) {
  var pathInA = [];
  var temp = nodeInA;
  while (temp !== rootA) {
    pathInA.unshift(Array.prototype.indexOf.call(temp.parentNode.childNodes, temp));
    temp = temp.parentNode;
  }
  var correspondingNodeInB = rootB;
  for (var _i = 0, _pathInA = pathInA; _i < _pathInA.length; _i++) {
    var index = _pathInA[_i];
    if (correspondingNodeInB.childNodes[index]) {
      correspondingNodeInB = correspondingNodeInB.childNodes[index];
    } else {
      return null;
    }
  }
  return correspondingNodeInB;
}
;// CONCATENATED MODULE: ./src/nodes/reconcile.ts








var updateElement = function updateElement(changedNode, newNode, content, attributes, localState) {
  if (isCustomElement(newNode)) {
    var _changedNode$parentEl;
    (_changedNode$parentEl = changedNode.parentElement) === null || _changedNode$parentEl === void 0 || _changedNode$parentEl.replaceChild(newNode, changedNode);
  } else {
    if (content !== undefined) {
      if (changedNode.nodeType === Node.TEXT_NODE) {
        changedNode.textContent = content;
      } else {
        removeAllEventListeners(changedNode);
        changedNode.innerHTML = content;
        addAllEventListeners(changedNode, localState);
      }
    } else if (attributes !== undefined) {
      for (var i = 0; i < attributes.length; i++) {
        if (attributes[i].name.startsWith("data-attribute-")) {
          var optionalAttribute = attributes[i].name.substring(15); // "data-attribute-".length
          if (attributes[i].newValue) {
            changedNode.setAttribute(optionalAttribute, attributes[i].newValue);
          } else {
            changedNode.removeAttribute(optionalAttribute);
          }
        }
        changedNode.setAttribute(attributes[i].name, attributes[i].newValue);
      }
    }
  }
};
var reconcile = function reconcile(reactiveNodes, state) {
  for (var treeNodeIndex = 0; treeNodeIndex < reactiveNodes.value.length; treeNodeIndex++) {
    var _reactiveNodes$value$ = reactiveNodes.value[treeNodeIndex],
      element = _reactiveNodes$value$.element,
      template = _reactiveNodes$value$.template,
      parentAttributes = _reactiveNodes$value$.parentAttributes,
      lastTemplateEvaluation = _reactiveNodes$value$.lastTemplateEvaluation;
    var localState = attributesToState(parentAttributes, state);
    var updatedContent = evaluateTemplate(template, localState);
    var newElement = elementFromString(updatedContent);
    var oldElement = elementFromString(lastTemplateEvaluation);
    var changedNodes = compareNodes(oldElement, newElement);
    if (changedNodes.length > 0) {
      reactiveNodes.updateLastTemplateEvaluation(treeNodeIndex, updatedContent);
      for (var i = 0; i < changedNodes.length; i++) {
        var oldNode = findCorrespondingNode(changedNodes[i].node, oldElement, element);
        updateElement(oldNode, changedNodes[i].newNode, changedNodes[i].content, changedNodes[i].attributes, localState);
      }
    }
  }
};
;// CONCATENATED MODULE: ./src/state.ts
function createState() {
  return {
    state: null,
    get value() {
      if (!this.state) {
        this.state = {};
      }
      return this.state;
    },
    set: function set(key, value) {
      if (!this.state) {
        this.state = {};
      }
      this.state[key] = value;
    }
  };
}
;// CONCATENATED MODULE: ./src/nodes/cleanReactiveNodesList.ts
var cleanReactiveNodesList = function cleanReactiveNodesList(reactiveNodes) {
  return reactiveNodes.filter(function (_ref) {
    var element = _ref.element;
    return document.body.contains(element);
  });
};
;// CONCATENATED MODULE: ./src/customElements.ts

function createCustomElements() {
  return {
    list: [],
    get value() {
      return this.list;
    },
    add: function add(item) {
      this.list.push(item);
    },
    updateLastTemplateEvaluation: function updateLastTemplateEvaluation(index, value) {
      this.list[index].lastTemplateEvaluation = value;
    },
    clean: function clean() {
      this.list = cleanReactiveNodesList(this.list);
    }
  };
}
;// CONCATENATED MODULE: ./src/nativeElements.ts
function createNativeElements() {
  return {
    list: [],
    get value() {
      return this.list;
    },
    add: function add(item) {
      this.list.push(item);
    },
    updateLastTemplateEvaluation: function updateLastTemplateEvaluation(index, value) {
      this.list[index].lastTemplateEvaluation = value;
    }
  };
}
;// CONCATENATED MODULE: ./src/cog.ts








var init = function init(document) {
  var nativeElements = createNativeElements();
  var customElements = createCustomElements();
  var rootElement = createRootElement(document);
  var state = createState();
  function reRender() {
    reconcile(nativeElements, state.value);
    reconcile(customElements, state.value);
  }
  function updateState(name, value) {
    setTimeout(function () {
      state.set(name, value);
      reRender();
    }, 0);
  }
  var onLoad = function onLoad() {
    loadCustomElements(rootElement.value, state.value, customElements);
    loadNativeElements(rootElement.value, nativeElements);
    addAllEventListeners(rootElement.value, state.value);
    reRender();
  };
  var onLoadHandler = document["onLoadHandler"];
  if (onLoadHandler) {
    document.removeEventListener("DOMContentLoaded", onLoadHandler);
  }
  document.addEventListener("DOMContentLoaded", onLoad);
  document["onLoadHandler"] = onLoad;
  return {
    variable: function variable(name, value) {
      state.set(name, value);
      return {
        set value(newVal) {
          updateState(name, newVal);
        },
        get value() {
          return state.value[name];
        },
        set: function set(newVal) {
          updateState(name, newVal);
        }
      };
    }
  };
};
var _init = init(document),
  variable = _init.variable;

;// CONCATENATED MODULE: ./examples/src/ts-html-in-expression.ts

variable("names", ["Alice", "Bob", "Carol"]);
var count = variable("count", 0);
window.increment = function () {
  count.value++;
};
/******/ 	return __webpack_exports__;
/******/ })()
;
});