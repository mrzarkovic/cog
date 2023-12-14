(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ts-custom-element-children"] = factory();
	else
		root["ts-custom-element-children"] = factory();
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

;// CONCATENATED MODULE: ./src/expressions/evaluateExpression.ts
function evaluateExpression(expressionWithScope, state) {
  var evaluated = expressionWithScope(state);
  if (Array.isArray(evaluated)) {
    evaluated = evaluated.join("");
  }
  return evaluated;
}
;// CONCATENATED MODULE: ./src/html/findNextTemplateExpression.ts
function findNextTemplateExpression(htmlText) {
  var start = htmlText.indexOf("{{");
  var stack = 0;
  for (var i = start; i < htmlText.length; i++) {
    if (htmlText[i] === "{" && htmlText[i + 1] === "{") {
      stack++;
      i++;
    } else if (htmlText[i] === "}" && htmlText[i + 1] === "}") {
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
;// CONCATENATED MODULE: ./src/expressions/sanitizeExpression.ts
function sanitizeExpression(expression) {
  return expression.replace(/[\r\n]+/g, "");
}
;// CONCATENATED MODULE: ./src/expressions/createExpressionScope.ts
var functionCache = {};
var createExpressionScope = function createExpressionScope(expression, state) {
  var index = expression + JSON.stringify(Object.keys(state).join(""));
  if (!functionCache[index]) {
    var functionBody = "return (state) => {".concat(Object.keys(state).map(function (variable) {
      return "const ".concat(variable, " = state[\"").concat(variable, "\"].value;");
    }).join("\n"), " return ").concat(expression, "}");
    functionCache[index] = Function(functionBody)();
  }
  return functionCache[index];
};
;// CONCATENATED MODULE: ./src/html/evaluateTemplate.ts





var evaluateTemplate = function evaluateTemplate(template, expressions, state) {
  var restOfContent = template;
  var updatedContent = "";
  for (var i = 0; i < expressions.length; i++) {
    var _expressions$i = expressions[i],
      start = _expressions$i.start,
      end = _expressions$i.end,
      value = _expressions$i.value;
    var before = restOfContent.slice(0, start);
    var after = restOfContent.slice(end + 1);
    var expressionWithScope = createExpressionScope(value, state);
    var evaluated = evaluateExpression(expressionWithScope, state);
    updatedContent += "".concat(before).concat(evaluated);
    restOfContent = after;
  }
  updatedContent += restOfContent;
  return updatedContent;
};

/**
 * Extracts all template expressions from a template string.
 * start and end are relative to the last template expression.
 */
var extractTemplateExpressions = function extractTemplateExpressions(template) {
  var expressions = [];
  var restOfContent = String(template);
  var hasTemplateExpression = true;
  while (hasTemplateExpression) {
    var _findNextTemplateExpr = findNextTemplateExpression(restOfContent),
      start = _findNextTemplateExpr.start,
      end = _findNextTemplateExpr.end;
    if (end === -1) {
      hasTemplateExpression = false;
      break;
    }
    var htmlValue = restOfContent.slice(start + 2, end - 1);
    var after = restOfContent.slice(end + 1);
    var value = sanitizeExpression(htmlToText(htmlValue));
    expressions.push({
      start: start,
      end: end,
      value: value
    });
    restOfContent = after;
  }
  return expressions;
};
;// CONCATENATED MODULE: ./src/attributes/getAttributes.ts

var getAttributes = function getAttributes(element) {
  var attributes = Array.from(element.attributes).map(function (attribute) {
    var expressions = extractTemplateExpressions(attribute.value);
    return {
      name: attribute.name,
      value: attribute.value,
      expressions: expressions,
      reactive: !!expressions.length
    };
  });
  return attributes;
};
;// CONCATENATED MODULE: ./src/attributes/convertAttributeName.ts
var convertAttributeName = function convertAttributeName(attribute) {
  return attribute.split("-").reduce(function (result, part, index) {
    return result + (index ? part[0].toUpperCase() + part.slice(1) : part);
  }, "");
};
;// CONCATENATED MODULE: ./src/attributes/convertAttributeValue.ts
function convertAttributeValue(value) {
  return value === "true" ? true : value === "false" ? false : value === "null" ? null : value === "undefined" ? undefined : value === "" ? "" : !isNaN(Number(value)) ? Number(value) : value;
}
;// CONCATENATED MODULE: ./src/attributes/attributesToState.ts



var attributesToStates = {};
function attributesToState(attributes, state) {
  var key = JSON.stringify(attributes) + JSON.stringify(state);
  if (!attributesToStates[key]) {
    var localState = Object.assign({}, state);
    for (var i = 0; i < attributes.length; i++) {
      localState[convertAttributeName(attributes[i].name)] = {
        value: convertAttributeValue(evaluateTemplate(attributes[i].value, attributes[i].expressions, state)),
        dependents: [],
        computants: []
      };
    }
    attributesToStates[key] = localState;
  }
  return attributesToStates[key];
}
;// CONCATENATED MODULE: ./src/attributes/getLocalState.ts

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
;// CONCATENATED MODULE: ./src/nodes/findNodes.ts
function findNodes(rootElement, xpath) {
  var check = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return true;
  };
  var elements = [];
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    if (check(element)) {
      elements.push(element);
    }
    element = result.iterateNext();
  }
  return elements;
}
;// CONCATENATED MODULE: ./src/attributes/getAttributesRecursive.ts
function getAttributesRecursive(parentId, attributes, reactiveNodes) {
  if (parentId === null) {
    return attributes;
  }
  var parentNode = reactiveNodes.find(function (rn) {
    return rn.id === parentId;
  });
  var parentAttributes = getAttributesRecursive(parentNode.parentId, parentNode.attributes, reactiveNodes);
  return parentAttributes.concat(attributes);
}
;// CONCATENATED MODULE: ./src/html/removeTagsAndAttributeNames.ts
var tagRegex = /<\/?[\w-]+/g;
var attrRegex = /[\w-]+(\s*=\s*("|')[^"']*("|'))/g;
var specialCharRegex = /[^\w\s]/g;
var spaceRegex = /\s+/g;
function removeTagsAndAttributeNames(htmlString) {
  return htmlString.replace(tagRegex, "").replace(attrRegex, "$1").replace(specialCharRegex, " ").trim().replace(spaceRegex, "@");
}
;// CONCATENATED MODULE: ./src/nodes/registerReactiveNode.ts




function assignDependents(elementId, state, parentId, attributes, reactiveNodes, template) {
  var attributesRecursive = getAttributesRecursive(parentId, attributes, reactiveNodes);
  var templateAndAttributesString = template + " " + attributesRecursive.map(function (a) {
    return a.value;
  }).join(" ");
  var uniqueIndex = {};
  extractTemplateExpressions(templateAndAttributesString).map(function (expression) {
    return removeTagsAndAttributeNames(expression.value).split("@").filter(function (wordFromExpression) {
      return uniqueIndex[wordFromExpression] ? false : uniqueIndex[wordFromExpression] = true;
    }).filter(function (wordFromExpression) {
      return state[wordFromExpression] && state[wordFromExpression].dependents.indexOf(elementId) === -1;
    }).forEach(function (wordFromExpression) {
      state[wordFromExpression].dependents.push(elementId);
    });
  });
}
function registerReactiveNode(elementId, reactiveNodes, originalElement, template, state) {
  var _originalElement$pare;
  var attributes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var parentId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var refinedTemplate = template.replace(/>\s*([\s\S]*?)\s*</g, ">$1<");
  var expressions = extractTemplateExpressions(refinedTemplate);
  var updatedContent = evaluateTemplate(refinedTemplate, expressions, state);
  var element = elementFromString(updatedContent);
  assignDependents(elementId, state, parentId, attributes, reactiveNodes.list, refinedTemplate);
  reactiveNodes.add({
    id: elementId,
    parentId: parentId,
    element: element,
    template: refinedTemplate,
    lastTemplateEvaluation: element.cloneNode(true),
    attributes: attributes,
    expressions: expressions,
    shouldUpdate: false
  });
  (_originalElement$pare = originalElement.parentElement) === null || _originalElement$pare === void 0 || _originalElement$pare.replaceChild(element, originalElement);
  return element;
}
;// CONCATENATED MODULE: ./src/nodes/registerTemplates.ts







function registerTemplates(rootElement, state, reactiveNodes) {
  var templates = findNodes(rootElement, "template");
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
function addParentId(element, parentId) {
  if (element.tagName.includes("-")) {
    element.setAttribute("data-parent-id", String(parentId));
  }
}
function addParentIdToChildren(template, parentId) {
  var newElement = elementFromString(template);
  if (newElement.nodeType !== Node.TEXT_NODE) {
    addParentId(newElement, parentId);
    var childElements = newElement.querySelectorAll("*");
    for (var i = 0; i < childElements.length; i++) {
      var child = childElements[i];
      addParentId(child, parentId);
    }
  }
  var refinedTemplate = newElement.outerHTML;
  if (!refinedTemplate) {
    refinedTemplate = newElement.textContent;
  }
  return refinedTemplate;
}
function getCustomElementAttributes(element) {
  var attributes = getAttributes(element);
  var childrenExpressions = extractTemplateExpressions(element.innerHTML);
  attributes.push({
    name: "children",
    value: element.innerHTML,
    expressions: childrenExpressions,
    reactive: !!childrenExpressions.length
  });
  return attributes;
}
function registerCustomElement(template, state, reactiveNodes) {
  return function () {
    var elementId = reactiveNodes.id();
    var attributes = getCustomElementAttributes(this);
    var refinedTemplate = addParentIdToChildren(template.innerHTML, elementId);
    var parentId = this.dataset.parentId ? Number(this.dataset.parentId) : null;
    var localState = getLocalState(parentId, attributes, state, reactiveNodes.list);
    var newElement = registerReactiveNode(elementId, reactiveNodes, this, refinedTemplate, localState, attributes, parentId);
    newElement.cogAnchorId = elementId;
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
;// CONCATENATED MODULE: ./src/attributes/handleBooleanAttribute.ts
function handleBooleanAttribute(changedNode, attribute) {
  if (attribute.name.startsWith("data-attribute-")) {
    var optionalAttribute = attribute.name.substring(15); // "data-attribute-".length

    if (attribute.newValue) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      changedNode[optionalAttribute] = true;
      changedNode.setAttribute(optionalAttribute, attribute.newValue);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      changedNode[optionalAttribute] = false;
      changedNode.removeAttribute(optionalAttribute);
    }
  }
}
;// CONCATENATED MODULE: ./src/nodes/isCustomElement.ts
var isCustomElement = function isCustomElement(element) {
  return element.nodeType !== Node.TEXT_NODE && element.tagName.indexOf("-") !== -1;
};
;// CONCATENATED MODULE: ./src/nodes/registerNativeElements.ts





var registerNativeElements = function registerNativeElements(rootElement, state, reactiveNodes) {
  var elements = findNodes(rootElement, "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]", function (element) {
    return !isCustomElement(element);
  });
  for (var i = 0; i < elements.length; i++) {
    var elementId = reactiveNodes.id();
    var element = elements[i];
    element.innerHTML = element.innerHTML.trim();
    var template = element.outerHTML;
    var newElement = registerReactiveNode(elementId, reactiveNodes, element, template, state);
    var attributes = getChangedAttributes(element, newElement);
    for (var _i = 0; _i < attributes.length; _i++) {
      handleBooleanAttribute(newElement, attributes[_i]);
    }
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
;// CONCATENATED MODULE: ./src/nodes/compareNodes.ts


function compareTextNodes(oldNode, newNode) {
  if (oldNode.textContent !== newNode.textContent) {
    return [{
      node: newNode,
      content: newNode.textContent
    }];
  }
  return [];
}
function compareChildNodes(oldNode, newNode) {
  var toBeRemoved = [];
  var toBeAdded = [];
  var nodesLength = Math.max(oldNode.childNodes.length, newNode.childNodes.length);
  var changedChildren = [];
  for (var i = 0; i < nodesLength; i++) {
    var oldChild = oldNode.childNodes[i];
    var newChild = newNode.childNodes[i];
    if ((oldChild === null || oldChild === void 0 ? void 0 : oldChild.nodeType) === Node.TEXT_NODE && (newChild === null || newChild === void 0 ? void 0 : newChild.nodeType) === Node.TEXT_NODE) {
      var _oldChild$textContent, _newChild$textContent;
      if (((_oldChild$textContent = oldChild.textContent) === null || _oldChild$textContent === void 0 ? void 0 : _oldChild$textContent.trim()) !== ((_newChild$textContent = newChild.textContent) === null || _newChild$textContent === void 0 ? void 0 : _newChild$textContent.trim())) {
        return [{
          node: newNode,
          content: newNode.innerHTML
        }];
      }
    } else if (!oldChild) {
      toBeAdded.push(newChild);
    } else if (!newChild) {
      toBeRemoved.push(oldChild);
    } else {
      changedChildren = changedChildren.concat(compareNodes(oldChild, newChild));
    }
  }
  if (toBeRemoved.length) {
    changedChildren.push({
      node: newNode,
      toBeRemoved: toBeRemoved
    });
  }
  if (toBeAdded.length) {
    changedChildren.push({
      node: newNode,
      toBeAdded: toBeAdded
    });
  }
  return changedChildren;
}
function compareCustomElementChildren(oldElement, newElement) {
  if (oldElement.innerHTML !== newElement.innerHTML) {
    return [{
      node: newElement,
      content: newElement.innerHTML
    }];
  }
  return [];
}
function compareNodes(oldNode, newNode) {
  if (oldNode.nodeType === Node.TEXT_NODE) {
    return compareTextNodes(oldNode, newNode);
  }
  var changedAttributes = getChangedAttributes(oldNode, newNode);
  var changedChildren = changedAttributes.length > 0 ? [{
    node: newNode,
    attributes: changedAttributes
  }] : [];
  if (isCustomElement(oldNode)) {
    return changedChildren.concat(compareCustomElementChildren(oldNode, newNode));
  }
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
;// CONCATENATED MODULE: ./src/nodes/reconcile.ts










function mergeAttributes(oldArray, newArray) {
  var merged = oldArray.concat(newArray);
  var attributes = {};
  for (var i = 0; i < merged.length; i++) {
    attributes[merged[i].name] = merged[i];
  }
  return Object.values(attributes);
}
function updateCustomElement(changedNode, originalNode, content, attributes, reactiveNodes, nodesToReconcile) {
  var _attributes$slice;
  var changedAttributes = (_attributes$slice = attributes === null || attributes === void 0 ? void 0 : attributes.slice()) !== null && _attributes$slice !== void 0 ? _attributes$slice : [];
  var newAttributes = [];
  if (changedAttributes.length) {
    newAttributes = getAttributes(changedNode);
  }
  if (content !== undefined) {
    newAttributes.push({
      name: "children",
      value: content,
      expressions: [],
      reactive: false
    });
  }
  if (newAttributes.length) {
    var reactiveNode = reactiveNodes.get(originalNode.cogAnchorId);
    var mergedAttributes = mergeAttributes(reactiveNode.attributes, newAttributes);
    reactiveNode.attributes = mergedAttributes;
    if (nodesToReconcile.filter(function (n) {
      return n.id === reactiveNode.id;
    }).length == 0) {
      nodesToReconcile.push(reactiveNode);
    }
  }
}
function handleContentChange(originalNode, content, localState) {
  if (originalNode.nodeType === Node.TEXT_NODE) {
    originalNode.textContent = content;
  } else {
    removeAllEventListeners(originalNode);
    originalNode.innerHTML = content;
    addAllEventListeners(originalNode, localState);
  }
}
function handleAttributeChange(originalNode, attributes) {
  for (var i = 0; i < attributes.length; i++) {
    handleBooleanAttribute(originalNode, attributes[i]);
    originalNode.setAttribute(attributes[i].name, attributes[i].newValue);
  }
}
function handleChildrenAddition(originalNode, addChildren) {
  for (var i = 0; i < addChildren.length; i++) {
    originalNode.appendChild(addChildren[i]);
  }
}
function handleChildrenRemoval(originalNode, removeChildren) {
  for (var i = 0; i < removeChildren.length; i++) {
    originalNode.removeChild(removeChildren[i]);
  }
}
function handleNodeChanges(changedNodes, oldElement, newElement, element, localState, reactiveNodes, nodesToReconcile) {
  for (var i = 0; i < changedNodes.length; i++) {
    var change = changedNodes[i];
    var originalNode = findCorrespondingNode(change.node, newElement, element);
    if (isCustomElement(change.node)) {
      updateCustomElement(change.node, originalNode, change.content, change.attributes, reactiveNodes, nodesToReconcile);
    } else {
      var _handleChildrenChange = handleChildrenChanges(change, oldElement, element),
        addChildren = _handleChildrenChange.addChildren,
        removeChildren = _handleChildrenChange.removeChildren;
      if (change.content !== undefined) {
        handleContentChange(originalNode, change.content, localState);
      } else if (change.attributes !== undefined) {
        handleAttributeChange(originalNode, change.attributes);
      } else if (addChildren.length) {
        handleChildrenAddition(originalNode, addChildren);
      } else if (removeChildren.length) {
        handleChildrenRemoval(originalNode, removeChildren);
      }
    }
  }
}
function handleChildrenChanges(changedNode, oldElement, element) {
  var removeChildren = [];
  var addChildren = [];
  if (changedNode.toBeAdded !== undefined) {
    addChildren = changedNode.toBeAdded;
  }
  if (changedNode.toBeRemoved !== undefined) {
    for (var i = 0; i < changedNode.toBeRemoved.length; i++) {
      var child = findCorrespondingNode(changedNode.toBeRemoved[i], oldElement, element);
      if (child) {
        removeChildren.push(child);
      }
    }
  }
  return {
    addChildren: addChildren,
    removeChildren: removeChildren
  };
}
var reconcile = function reconcile(reactiveNodes, nodesToReconcile, state) {
  for (var nodeIndex = 0; nodeIndex < nodesToReconcile.length; nodeIndex++) {
    var reactiveNode = nodesToReconcile[nodeIndex];
    var localState = getLocalState(reactiveNode.parentId, reactiveNode.attributes, state, nodesToReconcile);
    var updatedContent = evaluateTemplate(reactiveNode.template, reactiveNode.expressions, localState);
    var oldElement = reactiveNode.lastTemplateEvaluation.cloneNode(true);
    var newElement = elementFromString(updatedContent);
    var changedNodes = compareNodes(oldElement, newElement);
    if (changedNodes.length > 0) {
      nodesToReconcile[nodeIndex].lastTemplateEvaluation = newElement.cloneNode(true);
      handleNodeChanges(changedNodes, oldElement, newElement, reactiveNode.element, localState, reactiveNodes, nodesToReconcile);
    }
  }
};
;// CONCATENATED MODULE: ./src/createState.ts
function createState() {
  return {
    state: null,
    updatedKeys: [],
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
      if (!this.state[key]) {
        this.state[key] = {
          value: value,
          dependents: [],
          computants: []
        };
      } else {
        this.state[key].value = value;
      }
    },
    registerUpdate: function registerUpdate(key) {
      if (this.updatedKeys.indexOf(key) === -1) {
        this.updatedKeys.push(key);
      }
    },
    clearUpdates: function clearUpdates() {
      this.updatedKeys = [];
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
    get: function get(id) {
      return this.list[this.index[id]];
    },
    add: function add(item) {
      this.list.push(item);
      this.index[item.id] = this.list.length - 1;
    },
    update: function update(id, property, value) {
      this.list[this.index[id]][property] = value;
    },
    clean: function clean() {
      this.list = cleanReactiveNodesList(this.list);
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






var init = function init() {
  var stateFunctionExecuting = null;
  var reactiveNodes = createReactiveNodes();
  var updateStateTimeout = null;
  var state = createState();
  function reRender() {
    var uniqueKeys = {};
    state.updatedKeys.map(function (stateKey) {
      return state.value[stateKey].dependents;
    }).flat().forEach(function (id) {
      return uniqueKeys[id] = true;
    });
    var uniqueDependents = Object.keys(uniqueKeys);
    var nodesToReconcile = uniqueDependents.map(function (id) {
      return reactiveNodes.get(Number(id));
    });
    reconcile(reactiveNodes, nodesToReconcile, state.value);
    reactiveNodes.clean();
    state.clearUpdates();
  }
  var lastFrameTime = 0;
  var frameDelay = 1000 / 60;
  function scheduleReRender(stateKey) {
    state.value[stateKey].computants.forEach(function (computant) {
      state.registerUpdate(computant);
    });
    state.registerUpdate(stateKey);
    if (updateStateTimeout !== null) {
      cancelAnimationFrame(updateStateTimeout);
    }
    updateStateTimeout = requestAnimationFrame(function (currentTime) {
      if (currentTime - lastFrameTime > frameDelay) {
        lastFrameTime = currentTime;
        reRender();
      }
    });
  }
  var render = function render(rootElement) {
    registerNativeElements(rootElement, state.value, reactiveNodes);
    registerTemplates(rootElement, state.value, reactiveNodes);
    addAllEventListeners(rootElement, state.value);
  };
  var setFunctionValue = function setFunctionValue(name, value) {
    state.set(name, function () {
      stateFunctionExecuting = name;
      var result = value.apply(void 0, arguments);
      stateFunctionExecuting = null;
      return result;
    });
  };
  var setArrayValue = function setArrayValue(name, value) {
    var valueProxy = new Proxy(value, {
      get: function get(target, propKey) {
        var originalMethod = target[propKey];
        if (propKey === "push") {
          return function () {
            scheduleReRender(name);
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            return originalMethod.apply(target, args);
          };
        }
        return originalMethod;
      }
    });
    state.set(name, valueProxy);
  };
  var variable = function variable(name, value) {
    if (value instanceof Function) {
      setFunctionValue(name, value);
    } else if (Array.isArray(value)) {
      setArrayValue(name, value);
    } else {
      state.set(name, value);
    }
    return {
      get value() {
        if (stateFunctionExecuting !== null && state.value[name].computants.indexOf(stateFunctionExecuting) === -1) {
          state.value[name].computants.push(stateFunctionExecuting);
        }
        return state.value[name].value;
      },
      set value(newVal) {
        state.set(name, newVal);
        scheduleReRender(name);
      },
      set: function set(newVal) {
        state.set(name, newVal);
        scheduleReRender(name);
      }
    };
  };
  return {
    render: render,
    variable: variable
  };
};
var _init = init(),
  variable = _init.variable,
  render = _init.render;

;// CONCATENATED MODULE: ./examples/src/ts-custom-element-children.ts

document.addEventListener("DOMContentLoaded", function () {
  render(document.getElementById("app"));
});
var count = variable("count", 1);
window.increment = function () {
  count.value++;
};
/******/ 	return __webpack_exports__;
/******/ })()
;
});