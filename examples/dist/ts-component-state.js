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






var evaluateTemplate = function evaluateTemplate(template, expressions, state, stateChanges) {
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



function attributesToState(attributes, state, stateChanges) {
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
      reactive: !!expressions.length
    };
  });
  return attributes;
};
;// CONCATENATED MODULE: ./src/attributes/getLocalState.ts

function getLocalState(parentId, attributes, globalState, stateChanges, reactiveNodes) {
  var parentNode = reactiveNodes.find(function (rn) {
    return rn.id === parentId;
  });
  if (!parentNode) {
    return attributesToState(attributes, globalState, stateChanges);
  }
  var parentState = getLocalState(parentNode.parentId, parentNode.attributes, globalState, stateChanges, reactiveNodes);
  return Object.assign({}, parentState, attributesToState(attributes, parentState, stateChanges));
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


function assignDependents(elementId, expressions, state) {
  expressions.map(function (expression) {
    expression.dependencies.forEach(function (dependency) {
      if (state[dependency].dependents.indexOf(elementId) === -1) {
        state[dependency].dependents.push(elementId);
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
  assignDependents(elementId, expressions, state);
  reactiveNodes.add({
    id: elementId,
    parentId: parentId,
    element: element,
    template: refinedTemplate,
    lastTemplateEvaluation: element.cloneNode(true),
    attributes: attributes,
    expressions: expressions,
    shouldUpdate: false,
    newAttributes: [],
    templateName: templateName
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
function getCustomElementAttributes(element, state) {
  var attributes = getAttributes(element, state);
  var childrenExpressions = extractTemplateExpressions(element.innerHTML, state);
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
    var templateName = this.tagName.toLowerCase();
    var elementId = reactiveNodes.id();
    var parentId = this.dataset.parentId ? Number(this.dataset.parentId) : null;
    state.registerTemplateState(templateName, elementId);
    var completeState = state.value;
    if (state.templates && state.templates[templateName]) {
      var templateState = state.templates[templateName].customElements[elementId];
      Object.keys(templateState).forEach(function (key) {
        if (templateState[key].value instanceof Function) {
          var originalFunction = templateState[key].value;
          templateState[key].value = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            return originalFunction.apply(void 0, args.concat(["cogId:".concat(elementId)]));
          };
        }
      });
      completeState = Object.assign({}, state.value, templateState);
    }
    var parentState = getLocalState(parentId, [], completeState, [], reactiveNodes.list);
    var attributes = getCustomElementAttributes(this, parentState);
    var refinedTemplate = addParentIdToChildren(template.innerHTML, elementId);
    var localState = attributesToState(attributes, parentState, []);
    var newElement = registerReactiveNode(elementId, reactiveNodes, this, refinedTemplate, localState, attributes, parentId, templateName);
    if (newElement.nodeType !== Node.TEXT_NODE) {
      addAllEventListeners(newElement, completeState);
    }
    newElement.cogAnchorId = elementId;
  };
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
function updateCustomElement(originalNode, content, attributes, reactiveNodes, state, updatedKeys) {
  var _attributes$slice;
  var changedAttributes = (_attributes$slice = attributes === null || attributes === void 0 ? void 0 : attributes.slice()) !== null && _attributes$slice !== void 0 ? _attributes$slice : [];
  var newAttributes = [];
  changedAttributes.forEach(function (attribute) {
    newAttributes.push({
      name: attribute.name,
      value: attribute.newValue,
      expressions: [],
      reactive: false
    });
  });
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
    reactiveNode.newAttributes = reactiveNode.attributes.map(function (a) {
      return convertAttributeName(a.name);
    });
    reconcile(reactiveNodes, reactiveNode, state, updatedKeys);
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
  var localState = getLocalState(reactiveNode.parentId, reactiveNode.attributes, completeState, localStateChanges, reactiveNodes.list);
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
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
      if (this.templates && this.templates[template]) {
        this.templates[template].customElements[elementId] = {};
        for (var i = 0; i < this.templates[template].keys.length; i++) {
          var stateKey = this.templates[template].keys[i];
          var value = this.templates[template].initial[stateKey].value;
          var proxy = this.templates[template].initial[stateKey].proxy;
          if (proxy) {
            value = proxy(stateKey, _toConsumableArray(value));
          }
          this.templates[template].customElements[elementId][stateKey] = {
            value: value,
            dependents: [],
            computants: [],
            dependencies: []
          };
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
      var _this = this;
      this.templates[template].customElements[elementId][stateKey].value = value;
      this.templates[template].customElements[elementId][stateKey].computants.forEach(function (computant) {
        _this._registerStateUpdate(elementId, computant);
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
      var _this2 = this;
      this.state[stateKey].value = value;
      this.value[stateKey].computants.forEach(function (computant) {
        _this2._registerGlobalStateUpdate(computant);
      });
      this._registerGlobalStateUpdate(stateKey);
    },
    _registerGlobalStateUpdate: function _registerGlobalStateUpdate(stateKey) {
      var _this3 = this;
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
        _this3._registerStateUpdate(dependent, stateKey);
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
    state.updatedElements.forEach(function (elementId) {
      var reactiveNode = reactiveNodes.get(elementId);
      reconcile(reactiveNodes, reactiveNode, state, state.elementsUpdatedKeys[elementId]);
    });
    reactiveNodes.clean();
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
  var render = function render(rootElement) {
    addAllEventListeners(rootElement, state.value);
    registerNativeElements(rootElement, state.value, reactiveNodes);
    registerTemplates(rootElement, state, reactiveNodes);
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
    variable: variable
  };
};
var _init = init(),
  variable = _init.variable,
  render = _init.render;

;// CONCATENATED MODULE: ./examples/src/ts-component-state.ts

document.addEventListener("DOMContentLoaded", function () {
  render(document.getElementById("app"));
});
function generateRandomString() {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
variable("count", 100);
var count = variable("count", 0, "my-counter");
var names = variable("names", ["Alice", "Bob", "Carol"], "my-counter");
variable("increment", function () {
  names.value.push(generateRandomString());
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