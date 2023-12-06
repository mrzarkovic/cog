(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Cog"] = factory();
	else
		root["Cog"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  init: () => (/* binding */ init),
  variable: () => (/* binding */ variable)
});

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
;// CONCATENATED MODULE: ./src/expressions/createExpressionScope.ts
var createExpressionScope = function createExpressionScope(expression, state) {
  var functionBody = "return (state) => {".concat(Object.keys(state).map(function (variable) {
    return "const ".concat(variable, " = state[\"").concat(variable, "\"];");
  }).join("\n"), " return ").concat(expression, "}");
  return Function(functionBody)();
};
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
var changedAttributesToAttributes = function changedAttributesToAttributes(changedAttributes) {
  return changedAttributes.map(function (attribute) {
    var reactiveMatch = templateExpressionRegex.exec(attribute.newValue);
    return {
      name: attribute.name,
      value: attribute.newValue,
      reactive: !!reactiveMatch
    };
  });
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
  var lastTemplateEvaluation = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var attributes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var parentId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  reactiveNodes.add({
    id: elementId,
    parentId: parentId,
    element: element,
    template: originalInvocation,
    lastTemplateEvaluation: lastTemplateEvaluation,
    attributes: attributes
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
function loadTemplates(rootElement, state, reactiveNodes) {
  var templates = findTemplates(rootElement);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < templates.length; i++) {
    var name = templates[i].getAttribute("id");
    if (name) {
      templates[i].innerHTML = sanitizeHtml(templates[i].innerHTML);
      if (templates[i].content.childNodes.length !== 1) {
        throw new Error("Template ".concat(name, " should have a single child"));
      }
      defineCustomElement(name, templates[i], state, reactiveNodes);
      fragment.appendChild(templates[i]);
    }
  }
  fragment.textContent = "";
}
function defineCustomElement(name, template, state, reactiveNodes) {
  function CustomElement() {
    return Reflect.construct(HTMLElement, [], CustomElement);
  }
  CustomElement.prototype = Object.create(HTMLElement.prototype);
  CustomElement.prototype.constructor = CustomElement;
  CustomElement.prototype.connectedCallback = registerCustomElement(template, state, reactiveNodes);
  customElements.define(name, CustomElement);
}
function getLocalState(parentId, attributes, globalState, reactiveNodes) {
  var parentNode = reactiveNodes.find(function (rn) {
    return rn.id === parentId;
  });
  if (!parentNode) {
    return attributesToState(attributes, globalState);
  }
  var parentState = getLocalState(parentNode.parentId, parentNode.attributes, globalState, reactiveNodes);
  return Object.assign({}, parentState, attributesToState(attributes, parentState));
}
function registerCustomElement(template, state, reactiveNodes) {
  return function () {
    var _this$parentElement;
    var elementId = reactiveNodes.id();
    var attributes = getAttributes(this);
    var templateWithChildren = template.innerHTML.replace(/\{\{\s*children\s*\}\}/g, this.innerHTML);
    var newElement = elementFromString(templateWithChildren);
    if (newElement.nodeType !== Node.TEXT_NODE) {
      var childElements = newElement.querySelectorAll("*");
      for (var i = 0; i < childElements.length; i++) {
        var child = childElements[i];
        if (child.tagName.includes("-")) {
          child.setAttribute("data-parent-id", String(elementId));
        }
      }
    }
    var refinedTemplate = newElement.outerHTML;
    if (!refinedTemplate) {
      refinedTemplate = newElement.textContent || "";
    }
    var parentId = this.dataset.parentId ? Number(this.dataset.parentId) : null;
    var evaluatedElement = elementFromString(refinedTemplate);
    try {
      var localState = getLocalState(parentId, attributes, state, reactiveNodes.list);
      var updatedContent = evaluateTemplate(refinedTemplate, localState);
      evaluatedElement = elementFromString(updatedContent);

      // eslint-disable-next-line no-empty
    } catch (e) {}
    evaluatedElement.cogAnchorId = elementId;
    (_this$parentElement = this.parentElement) === null || _this$parentElement === void 0 || _this$parentElement.replaceChild(evaluatedElement, this);
    registerReactiveNode(elementId, reactiveNodes, evaluatedElement, refinedTemplate, null, attributes, parentId);
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
    var elementId = reactiveNodes.id();
    var _element = elements[i];
    _element.innerHTML = sanitizeHtml(_element.innerHTML);
    registerReactiveNode(elementId, reactiveNodes, _element, _element.outerHTML, _element.outerHTML);
  }
};

// function generateUUID() {
//     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
//         /[xy]/g,
//         function (c) {
//             const r = (Math.random() * 16) | 0,
//                 v = c === "x" ? r : (r & 0x3) | 0x8;
//             return v.toString(16);
//         }
//     );
// }
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
  var toBeRemoved = [];
  var toBeAdded = [];
  var nodesLength = Math.max(oldNode.childNodes.length, newNode.childNodes.length);
  for (var i = 0; i < nodesLength; i++) {
    var oldChild = oldNode.childNodes[i];
    var newChild = newNode.childNodes[i];
    if (typeof oldChild !== "undefined" && oldChild.nodeType === Node.TEXT_NODE && typeof newChild !== "undefined" && newChild.nodeType === Node.TEXT_NODE) {
      var _oldChild$textContent, _newChild$textContent;
      if (((_oldChild$textContent = oldChild.textContent) === null || _oldChild$textContent === void 0 ? void 0 : _oldChild$textContent.trim()) !== ((_newChild$textContent = newChild.textContent) === null || _newChild$textContent === void 0 ? void 0 : _newChild$textContent.trim())) {
        differentChildren = true;
        break;
      }
    } else if (typeof oldChild === "undefined" && typeof newChild !== "undefined") {
      toBeAdded.push(newChild);
    } else if (typeof oldChild !== "undefined" && typeof newChild === "undefined") {
      toBeRemoved.push(oldChild);
    } else {
      changedChildren = changedChildren.concat(compareNodes(oldChild, newChild));
    }
  }
  if (toBeRemoved.length > 0) {
    changedChildren.push({
      node: oldNode,
      toBeRemoved: toBeRemoved
    });
  }
  if (toBeAdded.length > 0) {
    changedChildren.push({
      node: oldNode,
      toBeAdded: toBeAdded
    });
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
  for (var i = 0; i < pathInA.length; i++) {
    var index = pathInA[i];
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










var updateElement = function updateElement(originalNode, changedNode, content, attributes, addChildren, removeChildren, localState, reactiveNodes) {
  if (isCustomElement(changedNode)) {
    var _attributes$slice;
    var changedAttributes = (_attributes$slice = attributes === null || attributes === void 0 ? void 0 : attributes.slice()) !== null && _attributes$slice !== void 0 ? _attributes$slice : [];
    if (changedAttributes.length) {
      var newAttributes = changedAttributesToAttributes(changedAttributes);
      var nodeIndex = reactiveNodes.index[originalNode.cogAnchorId];
      var reactiveNode = reactiveNodes.list[nodeIndex];
      reactiveNodes.update(nodeIndex, "attributes", reactiveNode.attributes.concat(newAttributes));
    }
    return;
  }
  if (content !== undefined) {
    if (originalNode.nodeType === Node.TEXT_NODE) {
      originalNode.textContent = content;
    } else {
      removeAllEventListeners(originalNode);
      originalNode.innerHTML = content;
      addAllEventListeners(originalNode, localState);
    }
  } else if (attributes !== undefined) {
    for (var i = 0; i < attributes.length; i++) {
      handleBooleanAttribute(originalNode, attributes[i]);
      originalNode.setAttribute(attributes[i].name, attributes[i].newValue);
    }
  } else if (addChildren.length) {
    var fragment = document.createDocumentFragment();
    for (var _i = 0; _i < addChildren.length; _i++) {
      fragment.appendChild(addChildren[_i]);
    }
    originalNode.appendChild(fragment);
  } else if (removeChildren.length) {
    for (var _i2 = 0; _i2 < removeChildren.length; _i2++) {
      originalNode.removeChild(removeChildren[_i2]);
    }
  }
};
function reconcile_getLocalState(node, globalState, reactiveNodes) {
  if (node.parentId === null) {
    return attributesToState(node.attributes, globalState);
  }
  var parentNode = reactiveNodes.find(function (rn) {
    return rn.id === node.parentId;
  });
  var parentState = reconcile_getLocalState(parentNode, globalState, reactiveNodes);
  return Object.assign({}, parentState, attributesToState(node.attributes, parentState));
}
var reconcile = function reconcile(reactiveNodes, state) {
  for (var treeNodeIndex = 0; treeNodeIndex < reactiveNodes.value.length; treeNodeIndex++) {
    var _reactiveNodes$value$ = reactiveNodes.value[treeNodeIndex],
      id = _reactiveNodes$value$.id,
      element = _reactiveNodes$value$.element,
      template = _reactiveNodes$value$.template,
      lastTemplateEvaluation = _reactiveNodes$value$.lastTemplateEvaluation;
    var updatedContent = null;
    var localState = reconcile_getLocalState(reactiveNodes.value[treeNodeIndex], state, reactiveNodes.list);
    try {
      updatedContent = evaluateTemplate(template, localState);
    } catch (e) {
      console.error(e);
      continue;
    }
    var newElement = elementFromString(updatedContent);
    if (lastTemplateEvaluation === null) {
      var _element$parentNode;
      reactiveNodes.update(treeNodeIndex, "lastTemplateEvaluation", updatedContent);
      reactiveNodes.update(treeNodeIndex, "element", newElement);
      newElement.cogAnchorId = id;
      (_element$parentNode = element.parentNode) === null || _element$parentNode === void 0 || _element$parentNode.replaceChild(newElement, element);
    } else {
      var oldElement = elementFromString(lastTemplateEvaluation);
      var changedNodes = compareNodes(oldElement, newElement);
      if (changedNodes.length > 0) {
        reactiveNodes.update(treeNodeIndex, "lastTemplateEvaluation", updatedContent);
        for (var i = 0; i < changedNodes.length; i++) {
          var _originalNode$parentN;
          var originalNode = findCorrespondingNode(changedNodes[i].node, oldElement, element);
          var removeChildren = [];
          var addChildren = [];
          if (changedNodes[i].toBeAdded !== undefined) {
            addChildren = changedNodes[i].toBeAdded;
          }
          if (changedNodes[i].toBeRemoved !== undefined) {
            for (var j = 0; j < changedNodes[i].toBeRemoved.length; j++) {
              var child = findCorrespondingNode(changedNodes[i].toBeRemoved[j], oldElement, element);
              if (child) {
                removeChildren.push(child);
              }
            }
          }
          var clone = originalNode.cloneNode(true);
          updateElement(originalNode, changedNodes[i].node, changedNodes[i].content, changedNodes[i].attributes, addChildren, removeChildren, localState, reactiveNodes);
          (_originalNode$parentN = originalNode.parentNode) === null || _originalNode$parentN === void 0 || _originalNode$parentN.replaceChild(clone, originalNode);
        }
      }
    }
  }
  reactiveNodes.clean(reactiveNodes.list);
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
    return contains;
  });
};
;// CONCATENATED MODULE: ./src/createReactiveNodes.ts

function createReactiveNodes() {
  return {
    lastId: 0,
    list: [],
    index: {},
    get value() {
      return this.list;
    },
    add: function add(item) {
      this.list.push(item);
      this.index[item.id] = this.list.length - 1;
    },
    update: function update(index, property, value) {
      this.list[index][property] = value;
    },
    clean: function clean(list) {
      this.list = cleanReactiveNodesList(list);
      this.index = this.list.reduce(function (index, item, i) {
        index[item.id] = i;
        return index;
      }, {});
    },
    id: function id() {
      return this.lastId++;
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
    console.log("reRender", reactiveNodes.list.length);
    reconcile(reactiveNodes, state.value);
  }
  function updateState(name, value) {
    state.set(name, value);
    if (updateStateTimeout !== null) {
      clearTimeout(updateStateTimeout);
    }
    updateStateTimeout = setTimeout(function () {
      reRender();
    }, 0);
  }
  var onLoad = function onLoad() {
    registerNativeElements(rootElement.value, reactiveNodes);
    loadTemplates(rootElement.value, state.value, reactiveNodes);
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
      updateState(name, value);
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

/******/ 	return __webpack_exports__;
/******/ })()
;
});