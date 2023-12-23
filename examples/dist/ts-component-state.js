(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ts-component-state"] = factory();
	else
		root["ts-component-state"] = factory();
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
  return expression.replace(/[\r\n]+/g, "").trim();
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
;// CONCATENATED MODULE: ./src/html/removeTagsAndAttributeNames.ts
var tagRegex = /<\/?[\w-]+/g;
var attrRegex = /[\w-]+(\s*=\s*("|')[^"']*("|'))/g;
var specialCharRegex = /[^\w\s]/g;
var spaceRegex = /\s+/g;
function removeTagsAndAttributeNames(htmlString) {
  return htmlString.replace(tagRegex, "").replace(attrRegex, "$1").replace(specialCharRegex, " ").trim().replace(spaceRegex, "@");
}
;// CONCATENATED MODULE: ./src/html/evaluateTemplate.ts






var evaluateTemplate = function evaluateTemplate(template, expressions, state) {
  var stateChanges = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var restOfContent = template;
  var updatedContent = "";
  for (var i = 0; i < expressions.length; i++) {
    var _expressions$i = expressions[i],
      start = _expressions$i.start,
      end = _expressions$i.end,
      value = _expressions$i.value;
    var before = restOfContent.slice(0, start);
    var after = restOfContent.slice(end + 1);
    var evaluated = expressions[i].evaluated;
    var intersection = expressions[i].dependencies.filter(function (value) {
      return stateChanges.includes(value);
    });
    if (intersection.length || evaluated === null) {
      var expressionWithScope = createExpressionScope(value, state);
      evaluated = evaluateExpression(expressionWithScope, state);
      expressions[i].evaluated = evaluated;
    }
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
var extractTemplateExpressions = function extractTemplateExpressions(template, state) {
  var expressions = [];
  var restOfContent = String(template);
  var hasTemplateExpression = true;
  var _loop = function _loop() {
    var _findNextTemplateExpr = findNextTemplateExpression(restOfContent),
      start = _findNextTemplateExpr.start,
      end = _findNextTemplateExpr.end;
    if (end === -1) {
      hasTemplateExpression = false;
      return 1; // break
    }
    var htmlValue = restOfContent.slice(start + 2, end - 1);
    var after = restOfContent.slice(end + 1);
    var value = sanitizeExpression(htmlToText(htmlValue));
    var uniqueIndex = {};
    var dependencies = new Set();
    removeTagsAndAttributeNames(value).split("@").filter(function (wordFromExpression) {
      return uniqueIndex[wordFromExpression] ? false : uniqueIndex[wordFromExpression] = true;
    }).filter(function (wordFromExpression) {
      return state[wordFromExpression];
    }).forEach(function (dependency) {
      if (state[dependency].dependencies.length) {
        state[dependency].dependencies.forEach(function (dep) {
          return dependencies.add(dep);
        });
      } else {
        dependencies.add(dependency);
      }
    });
    expressions.push({
      start: start,
      end: end,
      value: value,
      dependencies: Array.from(dependencies),
      evaluated: null
    });
    restOfContent = after;
  };
  while (hasTemplateExpression) {
    if (_loop()) break;
  }
  return expressions;
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



function attributesToState(attributes, state) {
  var stateChanges = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var localState = Object.assign({}, state);
  for (var i = 0; i < attributes.length; i++) {
    var attributeName = convertAttributeName(attributes[i].name);
    var value = attributes[i].value;
    var parentStateDependencies = [];
    if (attributes[i].reactive) {
      parentStateDependencies = Array.from(new Set(attributes[i].expressions.map(function (expression) {
        return expression.dependencies;
      }).flat()));
      value = evaluateTemplate(attributes[i].value, attributes[i].expressions, state, stateChanges);
    }
    localState[attributeName] = {
      value: convertAttributeValue(value),
      dependents: [],
      computants: [],
      dependencies: parentStateDependencies
    };
  }
  return localState;
}
;// CONCATENATED MODULE: ./src/attributes/getAttributes.ts

var getAttributes = function getAttributes(element, state) {
  var attributes = Array.from(element.attributes).map(function (attribute) {
    var expressions = extractTemplateExpressions(attribute.value, state);
    return {
      name: attribute.name,
      value: attribute.value,
      expressions: expressions,
      reactive: !!expressions.length,
      dependents: []
    };
  });
  return attributes;
};
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
;// CONCATENATED MODULE: ./src/attributes/getLocalState.ts

function getLocalState(parentId, attributes, globalState, reactiveNodes) {
  var stateChanges = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var parentNode = reactiveNodes.find(function (rn) {
    return rn.id === parentId;
  });
  if (!parentNode) {
    return attributesToState(attributes, globalState, stateChanges);
  }
  var parentState = getLocalState(parentNode.parentId, parentNode.attributes, globalState, reactiveNodes, stateChanges);
  return Object.assign({}, parentState, attributesToState(attributes, parentState, stateChanges));
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
;// CONCATENATED MODULE: ./src/nodes/isCustomElement.ts
var isCustomElement = function isCustomElement(element) {
  return element.nodeType !== Node.TEXT_NODE && element.tagName.indexOf("-") !== -1;
};
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
var findReactiveNodes = function findReactiveNodes(rootElement) {
  var elements = findNodes(rootElement, "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]", function (element) {
    return !isCustomElement(element);
  });
  return elements;
};
;// CONCATENATED MODULE: ./src/nodes/registerReactiveNode.ts



function assignDependents(elementId, expressions, state, attributes) {
  expressions.map(function (expression) {
    expression.dependencies.forEach(function (dependency) {
      if (state[dependency].dependents.indexOf(elementId) === -1) {
        state[dependency].dependents.push(elementId);
      }
      var attribute = attributes.find(function (attribute) {
        return convertAttributeName(attribute.name) === dependency;
      });
      if (attribute) {
        if (!attribute.dependents) {
          attribute.dependents = [];
        }
        if (attribute.dependents.indexOf(elementId) === -1) {
          attribute.dependents.push(elementId);
        }
      }
    });
  });
}
function registerReactiveNode(elementId, reactiveNodes, originalElement, template, state) {
  var _originalElement$pare;
  var attributes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var parentId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var templateName = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  var refinedTemplate = template.replace(/>\s*([\s\S]*?)\s*</g, ">$1<");
  var expressions = extractTemplateExpressions(refinedTemplate, state);
  var updatedContent = evaluateTemplate(refinedTemplate, expressions, state, []);
  var element = elementFromString(updatedContent);
  assignDependents(elementId, expressions, state, attributes);
  reactiveNodes.add(reactiveNodes["new"](elementId, parentId, attributes, templateName, expressions, refinedTemplate, element, element.cloneNode(true)));
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
      if (templates[i].content.children.length !== 1) {
        throw new Error("Template ".concat(name, " should have a single HTML Element child"));
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
function getCustomElementAttributes(element, state) {
  var attributes = getAttributes(element, state);
  var childrenExpressions = extractTemplateExpressions(element.innerHTML, state);
  attributes.push({
    name: "children",
    value: element.innerHTML,
    expressions: childrenExpressions,
    reactive: !!childrenExpressions.length,
    dependents: []
  });
  return attributes;
}
function registerCustomElement(template, state, reactiveNodes) {
  return function () {
    var _this$parentElement;
    var templateName = this.tagName.toLowerCase();
    var elementId = reactiveNodes.id();
    var parentId = this.dataset.parentId ? Number(this.dataset.parentId) : null;
    var parentState = getLocalState(parentId, [], state.value, reactiveNodes.list);
    var refinedTemplate = addParentIdToChildren(template.innerHTML, elementId);
    var attributes = getCustomElementAttributes(this, parentState);
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = refinedTemplate;
    reactiveNodes.add(reactiveNodes["new"](elementId, parentId, attributes, templateName));
    var elements = findReactiveNodes(tempDiv);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      registerChildReactiveNodes(element, parentId, templateName, attributes, parentState, reactiveNodes, state);
    }
    var contextEl = tempDiv.firstChild;
    contextEl.cogAnchorId = elementId;
    (_this$parentElement = this.parentElement) === null || _this$parentElement === void 0 || _this$parentElement.replaceChild(contextEl, this);
  };
}
function registerChildReactiveNodes(element, parentId, templateName, attributes, parentState, reactiveNodes, state) {
  var elementId = reactiveNodes.id();
  var template = element.outerHTML;
  state.registerTemplateState(templateName, elementId);
  var templateState = {};
  if (state.templates && state.templates[templateName]) {
    templateState = state.templates[templateName].customElements[elementId];
  }
  var localState = attributesToState(attributes, Object.assign({}, parentState, templateState));
  var newElement = registerReactiveNode(elementId, reactiveNodes, element, template, localState, attributes, parentId, templateName);
  if (newElement.nodeType !== Node.TEXT_NODE) {
    addAllEventListeners(newElement.parentElement, localState);
  }
  var newAttributes = getChangedAttributes(element, newElement);
  for (var i = 0; i < newAttributes.length; i++) {
    handleBooleanAttribute(newElement, newAttributes[i]);
  }
  newElement.cogAnchorId = elementId;
}
;// CONCATENATED MODULE: ./src/nodes/registerNativeElements.ts




var registerNativeElements = function registerNativeElements(rootElement, state, reactiveNodes) {
  var elements = findReactiveNodes(rootElement);
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
function updateCustomElement(originalNode, content, attributes, reactiveNodes, state, updatedKeys) {
  var _attributes$slice;
  var changedAttributes = (_attributes$slice = attributes === null || attributes === void 0 ? void 0 : attributes.slice()) !== null && _attributes$slice !== void 0 ? _attributes$slice : [];
  var newAttributes = [];
  changedAttributes.forEach(function (attribute) {
    newAttributes.push({
      name: attribute.name,
      value: attribute.newValue,
      expressions: [],
      reactive: false,
      dependents: []
    });
  });
  if (content !== undefined) {
    newAttributes.push({
      name: "children",
      value: content,
      expressions: [],
      reactive: false,
      dependents: []
    });
  }
  if (newAttributes.length) {
    var reactiveNode = reactiveNodes.get(originalNode.cogAnchorId);
    if (!reactiveNode) {
      throw new Error("Reactive node not found: ".concat(originalNode.nodeName));
    }
    if (reactiveNode.element !== null) {
      reconcileReactiveNode(reactiveNode, reactiveNodes, newAttributes, state, updatedKeys);
    } else {
      var attributesDependents = {};
      for (var i = 0; i < reactiveNode.attributes.length; i++) {
        var attribute = reactiveNode.attributes[i];
        if (attribute.dependents && attribute.dependents.length) {
          attributesDependents[attribute.name] = attribute.dependents;
        }
      }
      for (var _i = 0; _i < newAttributes.length; _i++) {
        var attributeDependents = attributesDependents[newAttributes[_i].name];
        for (var j = 0; j < attributeDependents.length; j++) {
          var _reactiveNode = reactiveNodes.get(attributeDependents[j]);
          reconcileReactiveNode(_reactiveNode, reactiveNodes, newAttributes, state, updatedKeys);
        }
      }
    }
  }
}
function reconcileReactiveNode(reactiveNode, reactiveNodes, newAttributes, state, updatedKeys) {
  var mergedAttributes = mergeAttributes(reactiveNode.attributes, newAttributes);
  reactiveNode.attributes = mergedAttributes;
  reactiveNode.newAttributes = reactiveNode.attributes.map(function (a) {
    return convertAttributeName(a.name);
  });
  reconcile(reactiveNodes, reactiveNode, state, updatedKeys);
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
function handleNodeChanges(changedNodes, oldElement, newElement, element, localState, reactiveNodes, state, updatedKeys) {
  for (var i = 0; i < changedNodes.length; i++) {
    var change = changedNodes[i];
    var originalNode = findCorrespondingNode(change.node, newElement, element);
    if (isCustomElement(change.node)) {
      updateCustomElement(originalNode, change.content, change.attributes, reactiveNodes, state, updatedKeys);
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
var reconcile = function reconcile(reactiveNodes, reactiveNode, state, stateChanges) {
  var localStateChanges = stateChanges.concat(reactiveNode.newAttributes);
  var completeState = state.value;
  if (state.templates && reactiveNode.templateName && state.templates[reactiveNode.templateName]) {
    var templateState = state.templates[reactiveNode.templateName].customElements[reactiveNode.id];
    completeState = Object.assign({}, state.value, templateState);
  }
  reactiveNode.newAttributes = [];
  var localState = getLocalState(reactiveNode.parentId, reactiveNode.attributes, completeState, reactiveNodes.list, localStateChanges);
  var updatedContent = evaluateTemplate(reactiveNode.template, reactiveNode.expressions, localState, localStateChanges);
  var oldElement = reactiveNode.lastTemplateEvaluation.cloneNode(true);
  var newElement = elementFromString(updatedContent);
  var changedNodes = compareNodes(oldElement, newElement);
  if (changedNodes.length > 0) {
    reactiveNode.lastTemplateEvaluation = newElement.cloneNode(true);
    handleNodeChanges(changedNodes, oldElement, newElement, reactiveNode.element, localState, reactiveNodes, state, stateChanges);
  }
};
;// CONCATENATED MODULE: ./src/createState.ts
function createState() {
  return {
    state: null,
    templates: null,
    updatedElements: [],
    elementsUpdatedKeys: {},
    get value() {
      if (!this.state) {
        this.state = {};
      }
      return this.state;
    },
    getTemplateState: function getTemplateState(template) {
      if (!this.templates) {
        this.templates = {};
      }
      return this.templates[template];
    },
    registerTemplateState: function registerTemplateState(template, elementId) {
      var _this = this;
      if (this.templates && this.templates[template]) {
        this.templates[template].customElements[elementId] = {};
        var _loop = function _loop() {
          var stateKey = _this.templates[template].keys[i];
          var value = _this.templates[template].initial[stateKey].value;
          var proxy = _this.templates[template].initial[stateKey].proxy;
          if (proxy) {
            value = proxy(stateKey, value.slice(0));
          }
          if (value instanceof Function) {
            var originalFunction = value;
            value = function value() {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              return originalFunction.apply(void 0, args.concat(["cogId:".concat(elementId)]));
            };
          }
          _this.templates[template].customElements[elementId][stateKey] = {
            value: value,
            dependents: [],
            computants: [],
            dependencies: []
          };
        };
        for (var i = 0; i < this.templates[template].keys.length; i++) {
          _loop();
        }
      }
    },
    initializeTemplateState: function initializeTemplateState(template, stateKey, value, proxy) {
      if (!this.templates) {
        this.templates = {};
      }
      if (!this.templates[template]) {
        this.templates[template] = {
          keys: [],
          initial: {},
          customElements: {}
        };
      }
      this.templates[template].initial[stateKey] = {
        value: value,
        proxy: proxy
      };
      this.templates[template].keys.push(stateKey);
    },
    updateTemplateState: function updateTemplateState(template, elementId, stateKey, value) {
      var _this2 = this;
      this.templates[template].customElements[elementId][stateKey].value = value;
      this.templates[template].customElements[elementId][stateKey].computants.forEach(function (computant) {
        _this2._registerStateUpdate(elementId, computant);
      });
      this._registerStateUpdate(elementId, stateKey);
    },
    initializeGlobalState: function initializeGlobalState(stateKey, value) {
      if (!this.state) {
        this.state = {};
      }
      if (!this.state[stateKey]) {
        this.state[stateKey] = {
          value: value,
          dependents: [],
          computants: [],
          dependencies: []
        };
      } else {
        this.state[stateKey].value = value;
      }
    },
    updateGlobalState: function updateGlobalState(stateKey, value) {
      var _this3 = this;
      this.state[stateKey].value = value;
      this.value[stateKey].computants.forEach(function (computant) {
        _this3._registerGlobalStateUpdate(computant);
      });
      this._registerGlobalStateUpdate(stateKey);
    },
    _registerGlobalStateUpdate: function _registerGlobalStateUpdate(stateKey) {
      var _this4 = this;
      var parts = stateKey.split(".");

      // If computant is a template state
      if (parts.length > 1) {
        var temp = parts[1].split(":");
        var _stateKey = temp[0];
        var elementId = Number(temp[1]);
        this._registerStateUpdate(elementId, _stateKey);
        return;
      }
      this.value[stateKey].dependents.forEach(function (dependent) {
        _this4._registerStateUpdate(dependent, stateKey);
      });
    },
    _registerStateUpdate: function _registerStateUpdate(elementId, stateKey) {
      if (this.updatedElements.indexOf(elementId) === -1) {
        this.updatedElements.push(elementId);
        this.elementsUpdatedKeys[elementId] = [];
      }
      if (this.elementsUpdatedKeys[elementId].indexOf(stateKey) === -1) {
        this.elementsUpdatedKeys[elementId].push(stateKey);
      }
    },
    clearUpdates: function clearUpdates() {
      this.updatedElements = [];
      this.elementsUpdatedKeys = {};
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
    },
    "new": function _new(id, parentId, attributes, templateName) {
      var expressions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
      var template = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
      var element = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
      var lastTemplateEvaluation = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
      var shouldUpdate = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : false;
      var newAttributes = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : [];
      return {
        id: id,
        parentId: parentId,
        element: element,
        template: template,
        lastTemplateEvaluation: lastTemplateEvaluation,
        attributes: attributes,
        expressions: expressions,
        templateName: templateName,
        shouldUpdate: shouldUpdate,
        newAttributes: newAttributes
      };
    }
  };
}
;// CONCATENATED MODULE: ./src/cog.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }






var init = function init() {
  var stateFunctionExecuting = null;
  var reactiveNodes = createReactiveNodes();
  var updateStateTimeout = null;
  var state = createState();
  var components = {};
  function reRender() {
    state.updatedElements.forEach(function (elementId) {
      var reactiveNode = reactiveNodes.get(elementId);
      reconcile(reactiveNodes, reactiveNode, state, state.elementsUpdatedKeys[elementId]);
    });

    // TODO: Figure this one out
    // reactiveNodes.clean();
    state.clearUpdates();
  }
  var lastFrameTime = 0;
  var frameDelay = 1000 / 60;
  function scheduleReRender() {
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
  var render = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(rootElement) {
      var componentNames, i, componentName, response, data, j, templateName, _response, _data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            componentNames = Object.keys(components);
            i = 0;
          case 2:
            if (!(i < componentNames.length)) {
              _context.next = 27;
              break;
            }
            componentName = componentNames[i];
            _context.next = 6;
            return fetch("components/".concat(componentName, "/index.html"));
          case 6:
            response = _context.sent;
            _context.next = 9;
            return response.text();
          case 9:
            data = _context.sent;
            rootElement.innerHTML += data;
            j = 0;
          case 12:
            if (!(j < components[componentName].length)) {
              _context.next = 24;
              break;
            }
            templateName = components[componentName][j];
            _context.next = 16;
            return fetch("components/".concat(componentName, "/").concat(templateName, ".html"));
          case 16:
            _response = _context.sent;
            _context.next = 19;
            return _response.text();
          case 19:
            _data = _context.sent;
            rootElement.innerHTML += _data;
          case 21:
            j++;
            _context.next = 12;
            break;
          case 24:
            i++;
            _context.next = 2;
            break;
          case 27:
            addAllEventListeners(rootElement, state.value);
            registerNativeElements(rootElement, state.value, reactiveNodes);
            registerTemplates(rootElement, state, reactiveNodes);
          case 30:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function render(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var component = function component(name, templates) {
    components[name] = templates || [];
  };
  var getFunctionValue = function getFunctionValue(name, value) {
    return function (cogId) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (typeof cogId === "string") {
        if (cogId.indexOf("cogId:") === 0) {
          cogId = cogId.replace("cogId:", "");
        } else {
          args.unshift(cogId);
          cogId = null;
        }
      }
      stateFunctionExecuting = cogId ? "".concat(name, ":").concat(cogId) : name;
      var result = value.apply(void 0, args);
      stateFunctionExecuting = null;
      return result;
    };
  };
  var getArrayValue = function getArrayValue(name, value) {
    return new Proxy(value, {
      get: function get(target, propKey) {
        var originalMethod = target[propKey];
        if (propKey === "push") {
          return function () {
            var _stateFunctionExecuti;
            var parts = (_stateFunctionExecuti = stateFunctionExecuting) === null || _stateFunctionExecuti === void 0 ? void 0 : _stateFunctionExecuti.split(".");
            if (parts && parts.length > 1) {
              var elementId = Number(parts[1].split(":")[1]);
              state._registerStateUpdate(elementId, name);
            } else {
              state.value[name].computants.forEach(function (computant) {
                state._registerGlobalStateUpdate(computant);
              });
              state._registerGlobalStateUpdate(name);
            }
            scheduleReRender();
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }
            return originalMethod.apply(target, args);
          };
        }
        return originalMethod;
      }
    });
  };
  var variable = function variable(name, value, template) {
    var fullStateName = name;
    if (template) {
      fullStateName = "".concat(template, ".").concat(name);
    }
    if (value instanceof Function) {
      value = getFunctionValue(fullStateName, value);
    }
    if (template) {
      var valueProxy = undefined;
      if (Array.isArray(value)) {
        valueProxy = getArrayValue;
      }
      state.initializeTemplateState(template, name, value, valueProxy);
    } else {
      if (Array.isArray(value)) {
        value = getArrayValue(name, value);
      }
      state.initializeGlobalState(name, value);
    }
    return {
      get value() {
        if (template) {
          var _stateFunctionExecuti2;
          var parts = ((_stateFunctionExecuti2 = stateFunctionExecuting) === null || _stateFunctionExecuti2 === void 0 ? void 0 : _stateFunctionExecuti2.split(":")) || [];
          var elementId = parts[1] ? Number(parts[1]) : null;
          if (elementId === null) {
            throw new Error("Can't use outside of a template: ".concat(name, " (for ").concat(template, ")"));
          }
          var callerParts = parts[0].split(".");
          var callerTemplate = callerParts[0];
          var functionName = callerParts[1];
          if (callerTemplate !== template) {
            throw new Error("Can't use from another template: ".concat(name, " (for ").concat(template, ", used in ").concat(callerTemplate, ")"));
          }
          var stateValue = state.getTemplateState(template).customElements[elementId][name];
          if (functionName && stateValue.computants.indexOf(functionName) === -1) {
            stateValue.computants.push(functionName);
          }
          return stateValue.value;
        }
        if (stateFunctionExecuting !== null && state.value[name].computants.indexOf(stateFunctionExecuting) === -1) {
          state.value[name].computants.push(stateFunctionExecuting);
        }
        return state.value[name].value;
      },
      set value(newVal) {
        if (template) {
          var _stateFunctionExecuti3;
          var cogId = (_stateFunctionExecuti3 = stateFunctionExecuting) === null || _stateFunctionExecuti3 === void 0 ? void 0 : _stateFunctionExecuti3.split(":")[1];
          if (!cogId) {
            throw new Error("Can't call outside of a template");
          }
          state.updateTemplateState(template, Number(cogId), name, newVal);
        } else {
          state.updateGlobalState(name, newVal);
        }
        scheduleReRender();
      },
      set: function set(newVal) {
        if (template) {
          var _stateFunctionExecuti4;
          var cogId = (_stateFunctionExecuti4 = stateFunctionExecuting) === null || _stateFunctionExecuti4 === void 0 ? void 0 : _stateFunctionExecuti4.split(":")[1];
          if (!cogId) {
            throw new Error("Can't call outside of a template");
          }
          state.updateTemplateState(template, Number(cogId), name, newVal);
        } else {
          state.updateGlobalState(name, newVal);
        }
        scheduleReRender();
      }
    };
  };
  return {
    render: render,
    variable: variable,
    component: component
  };
};
var _init = init(),
  variable = _init.variable,
  render = _init.render,
  component = _init.component;

;// CONCATENATED MODULE: ./examples/src/ts-component-state.ts

document.addEventListener("DOMContentLoaded", function () {
  render(document.getElementById("app"));
});
var count = variable("count", 0, "my-counter");
variable("increment", function () {
  return count.value++;
}, "my-counter");
variable("isEven", function () {
  return count.value % 2 === 0;
}, "my-counter");

// global computed from global state
// variable("isEven", () => globalCount.value % 2 === 0);

// template computed from global state
// variable("isEven", () => globalCount.value % 2 === 0, "my-counter");

// global computed from template state not allowed
// variable("isEven", () => count.value % 2 === 0);
/******/ 	return __webpack_exports__;
/******/ })()
;
});