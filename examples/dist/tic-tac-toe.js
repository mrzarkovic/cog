(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tic-tac-toe"] = factory();
	else
		root["tic-tac-toe"] = factory();
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
  try {
    var index = expression + JSON.stringify(Object.keys(state).join(""));
    if (!functionCache[index]) {
      var functionBody = "return (state) => {".concat(Object.keys(state).map(function (variable) {
        return "const ".concat(variable, " = state[\"").concat(variable, "\"];");
      }).join("\n"), " return ").concat(expression, "}");
      functionCache[index] = Function(functionBody)();
    }
    return functionCache[index];
  } catch (e) {
    throw new Error("Failed to create function from expression {{".concat(expression, "}}: ").concat(e.message));
  }
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



var attributesToStates = {};
function attributesToState(attributes, state) {
  var key = JSON.stringify(attributes) + JSON.stringify(state);
  if (!attributesToStates[key]) {
    var localState = Object.assign({}, state);
    for (var i = 0; i < attributes.length; i++) {
      localState[convertAttribute(attributes[i].name)] = convertAttributeValue(attributes[i].reactive ? evaluateTemplate(attributes[i].value, attributes[i].expressions, state) : attributes[i].value);
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
;// CONCATENATED MODULE: ./src/nodes/registerReactiveNode.ts


function registerReactiveNode(elementId, reactiveNodes, originalElement, template, state) {
  var _originalElement$pare;
  var attributes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var parentId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var expressions = extractTemplateExpressions(template);
  var updatedContent = evaluateTemplate(template, expressions, state);
  var element = elementFromString(updatedContent);
  reactiveNodes.add({
    id: elementId,
    parentId: parentId,
    element: element,
    template: template,
    lastTemplateEvaluation: updatedContent,
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
    refinedTemplate = newElement.textContent || "";
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
;// CONCATENATED MODULE: ./src/nodes/loadNativeElements.ts





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
    var _newNode$textContent;
    return [{
      node: oldNode,
      content: (_newNode$textContent = newNode.textContent) !== null && _newNode$textContent !== void 0 ? _newNode$textContent : ""
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
function handleCustomElement(changedNode, originalNode, content, attributes, reactiveNodes) {
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
    var nodeIndex = reactiveNodes.index[originalNode.cogAnchorId];
    var reactiveNode = reactiveNodes.list[nodeIndex];
    var mergedAttributes = mergeAttributes(reactiveNode.attributes, newAttributes);
    reactiveNodes.update(nodeIndex, "attributes", mergedAttributes);
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
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < addChildren.length; i++) {
    fragment.appendChild(addChildren[i]);
  }
  originalNode.appendChild(fragment);
}
function handleChildrenRemoval(originalNode, removeChildren) {
  for (var i = 0; i < removeChildren.length; i++) {
    originalNode.removeChild(removeChildren[i]);
  }
}
var updateElement = function updateElement(originalNode, changedNode, content, attributes, addChildren, removeChildren, localState, reactiveNodes) {
  if (isCustomElement(changedNode)) {
    handleCustomElement(changedNode, originalNode, content, attributes, reactiveNodes);
    return;
  }
  if (content !== undefined) {
    handleContentChange(originalNode, content, localState);
  } else if (attributes !== undefined) {
    handleAttributeChange(originalNode, attributes);
  } else if (addChildren.length) {
    handleChildrenAddition(originalNode, addChildren);
  } else if (removeChildren.length) {
    handleChildrenRemoval(originalNode, removeChildren);
  }
};
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
var stateVariableUsageRegex = function stateVariableUsageRegex(key) {
  return new RegExp("\\b".concat(key, "\\b|[^\\w]").concat(key, "[^\\w]"), "gm");
};
function checkIfChangedStateIsUsedInExpression(updatedStateKeys, expression) {
  return updatedStateKeys.map(stateVariableUsageRegex).some(function (re) {
    return re.test(expression);
  });
}
function handleNodeChanges(changedNodes, oldElement, newElement, element, localState, reactiveNodes) {
  for (var i = 0; i < changedNodes.length; i++) {
    var originalNode = findCorrespondingNode(changedNodes[i].node, newElement, element);
    var _handleChildrenChange = handleChildrenChanges(changedNodes[i], oldElement, element),
      addChildren = _handleChildrenChange.addChildren,
      removeChildren = _handleChildrenChange.removeChildren;
    updateElement(originalNode, changedNodes[i].node, changedNodes[i].content, changedNodes[i].attributes, addChildren, removeChildren, localState, reactiveNodes);
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
function nodeNeedsUpdate(updatedStateKeys, node, nodes) {
  if (node.shouldUpdate) {
    return true;
  }
  var attributesRecursive = getAttributesRecursive(node.parentId, node.attributes, nodes);
  var template = node.template + " " + attributesRecursive.map(function (a) {
    return a.value;
  }).join(" ");
  var expression = extractTemplateExpressions(template).map(function (e) {
    return e.value;
  }).join(" ");
  return checkIfChangedStateIsUsedInExpression(updatedStateKeys, expression);
}
var reconcile = function reconcile(reactiveNodes, state, updatedStateKeys) {
  for (var nodeIndex = 0; nodeIndex < reactiveNodes.value.length; nodeIndex++) {
    var _reactiveNodes$value$ = reactiveNodes.value[nodeIndex],
      parentId = _reactiveNodes$value$.parentId,
      attributes = _reactiveNodes$value$.attributes,
      element = _reactiveNodes$value$.element,
      template = _reactiveNodes$value$.template,
      lastTemplateEvaluation = _reactiveNodes$value$.lastTemplateEvaluation,
      expressions = _reactiveNodes$value$.expressions;
    var shouldUpdate = nodeNeedsUpdate(updatedStateKeys, reactiveNodes.value[nodeIndex], reactiveNodes.value);
    if (!shouldUpdate) {
      continue;
    } else {
      reactiveNodes.update(nodeIndex, "shouldUpdate", false);
    }
    var localState = getLocalState(parentId, attributes, state, reactiveNodes.list);
    var updatedContent = evaluateTemplate(template, expressions, localState);
    var newElement = elementFromString(updatedContent);
    var oldElement = elementFromString(lastTemplateEvaluation);
    var changedNodes = compareNodes(oldElement, newElement);
    if (changedNodes.length > 0) {
      reactiveNodes.update(nodeIndex, "lastTemplateEvaluation", updatedContent);
      handleNodeChanges(changedNodes, oldElement, newElement, element, localState, reactiveNodes);
    }
  }
};
;// CONCATENATED MODULE: ./src/state.ts
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
      this.state[key] = value;
      this.updatedKeys.push(key);
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
    add: function add(item) {
      this.list.push(item);
      this.index[item.id] = this.list.length - 1;
    },
    update: function update(index, property, value) {
      if (property === "attributes") {
        this.list[index].shouldUpdate = true;
      }
      this.list[index][property] = value;
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
  var reactiveNodes = createReactiveNodes();
  var updateStateTimeout = null;
  var state = createState();
  function reRender() {
    reconcile(reactiveNodes, state.value, state.updatedKeys);
    reactiveNodes.clean();
    state.clearUpdates();
  }
  function updateState(name, value) {
    state.set(name, value);
    if (updateStateTimeout !== null) {
      cancelAnimationFrame(updateStateTimeout);
    }
    updateStateTimeout = requestAnimationFrame(function () {
      reRender();
    });
  }
  var render = function render(rootElement) {
    registerNativeElements(rootElement, state.value, reactiveNodes);
    registerTemplates(rootElement, state.value, reactiveNodes);
    addAllEventListeners(rootElement, state.value);
  };
  return {
    render: render,
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
var _init = init(),
  variable = _init.variable,
  render = _init.render;

;// CONCATENATED MODULE: ./examples/src/tic-tac-toe.ts
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

document.addEventListener("DOMContentLoaded", function () {
  render(document.getElementById("app"));
});

// Initialize the game's state
var tic_tac_toe_history = variable("history", [Array(9).fill("")]); // The history of the game's moves
var currentMove = 0; // The current move number
var xIsNext = function xIsNext() {
  return currentMove % 2 === 0;
}; // Function to determine if it's X's turn
var tic_tac_toe_status = variable("status", "Next player: X"); // The status message
var squares = variable("squares", tic_tac_toe_history.value[0]); // The current state of the game board

// Function to calculate the winner of the game
function calculateWinner(squares) {
  // All possible winning combinations
  var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  // Check each winning combination
  for (var i = 0; i < lines.length; i++) {
    var _lines$i = _slicedToArray(lines[i], 3),
      a = _lines$i[0],
      b = _lines$i[1],
      c = _lines$i[2];
    // If all squares in a combination are filled by the same player, that player wins
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      tic_tac_toe_status.set("Winner: " + squares[a]);
      return squares[a];
    }
  }

  // If all squares are filled and there's no winner, it's a draw
  if (tic_tac_toe_history.value.length === 10) {
    tic_tac_toe_status.set("Draw");
    return null;
  }

  // If the game is still ongoing, update the status message to indicate whose turn is next
  tic_tac_toe_status.set("Next player: " + (xIsNext() ? "X" : "O"));
  return null;
}

// Function to handle a play
function handlePlay(nextSquares) {
  // Create a new history array with the current state of the game board
  var nextHistory = [].concat(_toConsumableArray(tic_tac_toe_history.value.slice(0, currentMove + 1)), [nextSquares]);

  // Update the current move to the latest one
  currentMove = nextHistory.length - 1;

  // Update the history and squares variables with the new state
  tic_tac_toe_history.set(nextHistory);
  squares.set(nextSquares);

  // Check if the game has ended
  calculateWinner(nextSquares);
}

// Function to jump to a specific move in the game's history
window.jumpTo = function (nextMove) {
  // Update the current move
  currentMove = nextMove;

  // Update the squares variable to the state of the game board at the specified move
  squares.set(tic_tac_toe_history.value[currentMove]);

  // Update the status message to indicate whose turn is next
  tic_tac_toe_status.set("Next player: " + (xIsNext() ? "X" : "O"));
};

// Function to handle a click on a square
window.handleClick = function (i) {
  // If the game has already ended or the clicked square is already filled, do nothing
  if (calculateWinner(squares.value) || squares.value[i]) {
    return;
  }

  // Create a copy of the current state of the game board
  var nextSquares = squares.value.slice();

  // If it's X's turn, fill the clicked square with an X; otherwise, fill it with an O
  if (xIsNext()) {
    nextSquares[i] = "X";
  } else {
    nextSquares[i] = "O";
  }

  // Handle the play with the updated state of the game board
  handlePlay(nextSquares);
};
/******/ 	return __webpack_exports__;
/******/ })()
;
});