(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["optional-attributes"] = factory();
	else
		root["optional-attributes"] = factory();
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
;// CONCATENATED MODULE: ./src/expressions/templateExpressionRegex.ts
var templateExpressionRegex = /\{\{(.+?)\}\}/;
;// CONCATENATED MODULE: ./src/attributes/getAttributes.ts

var getAttributes = function getAttributes(element) {
  var attributes = Array.from(element.attributes).map(function (attribute) {
    var reactiveMatch = templateExpressionRegex.exec(attribute.value);
    return {
      name: attribute.name,
      value: attribute.value,
      reactive: !!reactiveMatch
    };
  });
  return attributes;
};
;// CONCATENATED MODULE: ./src/html/sanitizeHtml.ts
var sanitizeHtml = function sanitizeHtml(html) {
  return html.replace(/[\r\n]+\s*/g, "");
};
;// CONCATENATED MODULE: ./src/nodes/elementFromString.ts
function elementFromString(htmlString) {
  var parser = new DOMParser();
  var newElementDoc = parser.parseFromString(htmlString, "text/html");
  return newElementDoc.body.firstChild;
}
;// CONCATENATED MODULE: ./src/nodes/registerReactiveNode.ts
function registerReactiveNode(elementId, reactiveNodes, element, originalInvocation) {
  var attributes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var parentId = element.dataset.parentId ? Number(element.dataset.parentId) : null;
  console.log("register", element.nodeName, elementId, parentId);
  reactiveNodes.add({
    id: elementId,
    parentId: parentId,
    element: element,
    template: originalInvocation,
    lastTemplateEvaluation: null,
    attributes: attributes
  });
  reactiveNodes.clean(reactiveNodes.list);
  console.log({
    reactiveNodes: reactiveNodes
  });
}
;// CONCATENATED MODULE: ./src/nodes/loadCustomElements.ts




function findTemplates(rootElement) {
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
function loadTemplates(rootElement, reactiveNodes) {
  var templates = findTemplates(rootElement);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < templates.length; i++) {
    var name = templates[i].getAttribute("id");
    if (name) {
      templates[i].innerHTML = sanitizeHtml(templates[i].innerHTML);
      if (templates[i].content.childNodes.length !== 1) {
        throw new Error("Template ".concat(name, " should have a single child"));
      }
      defineCustomElement(name, templates[i], reactiveNodes);
      fragment.appendChild(templates[i]);
    }
  }
  fragment.textContent = "";
}
function defineCustomElement(name, template, reactiveNodes) {
  function CustomElement() {
    return Reflect.construct(HTMLElement, [], CustomElement);
  }
  CustomElement.prototype = Object.create(HTMLElement.prototype);
  CustomElement.prototype.constructor = CustomElement;
  CustomElement.prototype.connectedCallback = registerCustomElement(template, reactiveNodes);
  customElements.define(name, CustomElement);
}
function registerCustomElement(template, reactiveNodes) {
  return function () {
    var _this$parentElement;
    var elementId = reactiveNodes.list.length + 1;
    var attributes = getAttributes(this);
    var templateWithChildren = template.innerHTML.replace(/\{\{\s*children\s*\}\}/g, this.innerHTML);
    var newElement = elementFromString(templateWithChildren);
    var childElements = newElement.querySelectorAll("*");
    childElements.forEach(function (child) {
      if (child.tagName.includes("-")) {
        child.setAttribute("data-parent-id", String(elementId));
      }
    });
    console.log("custom", newElement.innerHTML);
    var originalInvocation = this.outerHTML;
    (_this$parentElement = this.parentElement) === null || _this$parentElement === void 0 || _this$parentElement.replaceChild(newElement, this);
    registerReactiveNode(elementId, reactiveNodes, newElement, originalInvocation, attributes);
  };
}
;// CONCATENATED MODULE: ./src/expressions/createExpressionScope.ts
var createExpressionScope = function createExpressionScope(expression, state) {
  var functionBody = "return (state) => {".concat(Object.keys(state).map(function (variable) {
    return "const ".concat(variable, " = state[\"").concat(variable, "\"];");
  }).join("\n"), " return ").concat(expression, "}");
  return Function(functionBody)();
};
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


var registerNativeElements = function registerNativeElements(rootElement, reactiveNodes) {
  var elements = [];
  var xpath = "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]";
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    if (!isCustomElement(element)) {
      elements.push(element);
    }
    element = result.iterateNext();
  }
  for (var i = 0; i < elements.length; i++) {
    var elementId = reactiveNodes.list.length + 1;
    console.log("native", elements[i]);
    registerReactiveNode(elementId, reactiveNodes, elements[i], elements[i].outerHTML);
  }
};
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === "x" ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
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
;// CONCATENATED MODULE: ./src/expressions/sanitizeExpression.ts
function sanitizeExpression(expression) {
  return expression.replace(/[\r\n]+/g, "");
}
;// CONCATENATED MODULE: ./src/expressions/evaluateExpression.ts


function evaluateExpression(expression, state) {
  try {
    var expressionWithScope = createExpressionScope(sanitizeExpression(expression), state);
    var evaluated = expressionWithScope(state);
    if (Array.isArray(evaluated)) {
      evaluated = evaluated.join("");
    }
    return evaluated;
  } catch (e) {
    throw new Error("Failed to create function from expression {{".concat(expression, "}}: ").concat(e.message));
  }
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
;// CONCATENATED MODULE: ./src/html/evaluateTemplate.ts



// import { sanitizeHtml } from "./sanitizeHtml";

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
    var value = htmlToText(htmlValue);
    var evaluated = evaluateExpression(value, state);
    updatedContent += "".concat(before).concat(evaluated);
    restOfContent = after;
  }
  updatedContent += restOfContent;
  return updatedContent;
};
;// CONCATENATED MODULE: ./src/attributes/convertAttribute.ts
var convertAttribute = function convertAttribute(attribute) {
  return attribute.split("-").reduce(function (result, part, index) {
    return result + (index ? part[0].toUpperCase() + part.slice(1) : part);
  }, "");
};
;// CONCATENATED MODULE: ./src/attributes/convertAttributeValue.ts
function convertAttributeValue(value) {
  return value === "true" ? true : value === "false" ? false : value === "null" ? null : value === "undefined" ? undefined : value === "" ? "" : !isNaN(Number(value)) ? Number(value) : value;
}
;// CONCATENATED MODULE: ./src/attributes/attributesToState.ts



function attributesToState(attributes, state) {
  var localState = Object.assign({}, state);
  for (var i = 0; i < attributes.length; i++) {
    localState[convertAttribute(attributes[i].name)] = convertAttributeValue(attributes[i].reactive ? evaluateTemplate(attributes[i].value, state) : attributes[i].value);
  }
  return localState;
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


function compareTextNodes(oldNode, newNode) {
  if (oldNode.textContent !== newNode.textContent) {
    var _newNode$textContent;
    return [{
      node: oldNode,
      content: (_newNode$textContent = newNode.textContent) !== null && _newNode$textContent !== void 0 ? _newNode$textContent : ""
    }];
  }
  return [];
}
function compareChildNodes(oldNode, newNode) {
  var changedChildren = [];
  var differentChildren = false;
  var nodesLength = Math.max(oldNode.childNodes.length, newNode.childNodes.length);
  for (var i = 0; i < nodesLength; i++) {
    var oldChild = oldNode.childNodes[i];
    var newChild = newNode.childNodes[i];
    if (typeof oldChild !== "undefined" && oldChild.nodeType === Node.TEXT_NODE && typeof newChild !== "undefined" && newChild.nodeType === Node.TEXT_NODE) {
      if (oldChild.textContent !== newChild.textContent) {
        differentChildren = true;
        break;
      }
    } else if (typeof oldChild === "undefined" || typeof newChild === "undefined") {
      differentChildren = true;
      break;
    } else {
      changedChildren = changedChildren.concat(compareNodes(oldChild, newChild));
    }
  }
  if (differentChildren) {
    return [{
      node: oldNode,
      content: newNode.innerHTML
    }];
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
    attributes: changedAttributes
  }] : [];
  return changedChildren.concat(compareChildNodes(oldNode, newNode));
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
;// CONCATENATED MODULE: ./src/attributes/handleBooleanAttribute.ts
function handleBooleanAttribute(changedNode, attribute) {
  if (attribute.name.startsWith("data-attribute-")) {
    var optionalAttribute = attribute.name.substring(15); // "data-attribute-".length

    if (attribute.newValue) {
      changedNode.setAttribute(optionalAttribute, attribute.newValue);
    } else {
      changedNode.removeAttribute(optionalAttribute);
    }
  }
}
;// CONCATENATED MODULE: ./src/nodes/reconcile.ts








var updateElement = function updateElement(changedNode, content, attributes, localState) {
  if (content !== undefined) {
    if (changedNode.nodeType === Node.TEXT_NODE) {
      changedNode.textContent = content;
    } else {
      removeAllEventListeners(changedNode);
      console.log({
        content: content
      });
      changedNode.innerHTML = content;
      addAllEventListeners(changedNode, localState);
    }
  } else if (attributes !== undefined) {
    for (var i = 0; i < attributes.length; i++) {
      handleBooleanAttribute(changedNode, attributes[i]);
      changedNode.setAttribute(attributes[i].name, attributes[i].newValue);
    }
  }
};
function getLocalState(node, globalState, reactiveNodes) {
  if (node.parentId === null) {
    return attributesToState(node.attributes, globalState);
  }
  var parentNode = reactiveNodes.find(function (rn) {
    return rn.id === node.parentId;
  });
  var parentState = getLocalState(parentNode, globalState, reactiveNodes);
  return Object.assign({}, parentState, attributesToState(node.attributes, parentState));
}
var reconcile = function reconcile(reactiveNodes, state) {
  for (var treeNodeIndex = 0; treeNodeIndex < reactiveNodes.value.length; treeNodeIndex++) {
    var _reactiveNodes$value$ = reactiveNodes.value[treeNodeIndex],
      element = _reactiveNodes$value$.element,
      template = _reactiveNodes$value$.template,
      lastTemplateEvaluation = _reactiveNodes$value$.lastTemplateEvaluation;
    var localState = getLocalState(reactiveNodes.value[treeNodeIndex], state, reactiveNodes.list);
    var updatedContent = evaluateTemplate(template, localState);
    var newElement = elementFromString(updatedContent);
    if (lastTemplateEvaluation === null) {
      var _element$parentNode;
      console.log("first render", element.nodeName);
      reactiveNodes.update(treeNodeIndex, "lastTemplateEvaluation", updatedContent);
      reactiveNodes.update(treeNodeIndex, "element", newElement);
      (_element$parentNode = element.parentNode) === null || _element$parentNode === void 0 || _element$parentNode.replaceChild(newElement, element);
    } else {
      var oldElement = elementFromString(lastTemplateEvaluation);
      var changedNodes = compareNodes(oldElement, newElement);
      console.log("comparing", newElement.innerHTML, oldElement.innerHTML, changedNodes);
      if (changedNodes.length > 0) {
        reactiveNodes.update(treeNodeIndex, "lastTemplateEvaluation", updatedContent);
        for (var i = 0; i < changedNodes.length; i++) {
          var oldNode = findCorrespondingNode(changedNodes[i].node, oldElement, element);
          updateElement(oldNode, changedNodes[i].content, changedNodes[i].attributes, localState);
        }
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
    var contains = document.body.contains(element);
    console.log("contains", contains, element);
    return contains;
  });
};
;// CONCATENATED MODULE: ./src/customElements.ts

function createReactiveNodes() {
  return {
    list: [],
    get value() {
      return this.list;
    },
    add: function add(item) {
      this.list.push(item);
    },
    update: function update(index, property, value) {
      this.list[index][property] = value;
    },
    clean: function clean(list) {
      this.list = cleanReactiveNodesList(list);
    }
  };
}
;// CONCATENATED MODULE: ./src/cog.ts







var init = function init(document) {
  var reactiveNodes = createReactiveNodes();
  var rootElement = createRootElement(document);
  var updateStateTimeout = null;
  var state = createState();
  function reRender() {
    reconcile(reactiveNodes, state.value);
  }
  function updateState(name, value) {
    state.set(name, value);
    if (updateStateTimeout !== null) {
      clearTimeout(updateStateTimeout);
    }
    updateStateTimeout = setTimeout(function () {
      console.log("rerendering");
      reRender();
    }, 0);
  }
  var onLoad = function onLoad() {
    loadTemplates(rootElement.value, reactiveNodes);
    registerNativeElements(rootElement.value, reactiveNodes);
    addAllEventListeners(rootElement.value, state.value);
  };
  onLoad();

  // const onLoadHandler = (document as DocumentWithHandler)["onLoadHandler"];
  // if (onLoadHandler) {
  //     document.removeEventListener("DOMContentLoaded", onLoadHandler);
  // }
  // document.addEventListener("DOMContentLoaded", onLoad);
  // (document as DocumentWithHandler)["onLoadHandler"] = onLoad;

  return {
    variable: function variable(name, value) {
      // updateState(name, value);
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

;// CONCATENATED MODULE: ./examples/src/optional-attributes.ts

var checked = variable("checked", false);
window.toggleChecked = function () {
  checked.value = !checked.value;
};
/******/ 	return __webpack_exports__;
/******/ })()
;
});