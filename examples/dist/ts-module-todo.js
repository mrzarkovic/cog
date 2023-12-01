(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ts-module-todo"] = factory();
	else
		root["ts-module-todo"] = factory();
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

;// CONCATENATED MODULE: ./src/util/appElement.ts
function createAppElement(document) {
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
;// CONCATENATED MODULE: ./src/util/helpers/convertAttribute.ts
var convertAttribute = function convertAttribute(attribute) {
  return attribute.split("-").reduce(function (result, part, index) {
    return result + (index ? part[0].toUpperCase() + part.slice(1) : part);
  }, "");
};
;// CONCATENATED MODULE: ./src/util/helpers/createExpressionScope.ts
var createExpressionScope = function createExpressionScope(expression, state) {
  var functionBody = "return (state) => {".concat(Object.keys(state).map(function (variable) {
    return "const ".concat(variable, " = state[\"").concat(variable, "\"];");
  }).join("\n"), " return ").concat(expression, "}");
  return Function(functionBody)();
};
;// CONCATENATED MODULE: ./src/util/helpers/evaluateExpression.ts

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
;// CONCATENATED MODULE: ./src/util/helpers/attributesToState.ts


function attributesToState(attributes, state) {
  var localState = Object.assign({}, state);
  for (var i = 0; i < attributes.length; i++) {
    localState[convertAttribute(attributes[i].name)] = attributes[i].reactive ? evaluateExpression(attributes[i].value, state) : attributes[i].value;
  }
  return localState;
}
;// CONCATENATED MODULE: ./src/util/helpers/findNextTemplateExpression.ts
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
;// CONCATENATED MODULE: ./src/util/helpers/htmlToText.ts
function escapeHtml(html) {
  return html.replace(/<(?=[^<>]*>)/g, "&lt;").replace(/(?<=[^<>]*)>/g, "&gt;");
}
function htmlToText(html) {
  var tmp = document.createElement("div");
  tmp.innerHTML = escapeHtml(html);
  return tmp.textContent || tmp.innerText || "";
}
;// CONCATENATED MODULE: ./src/util/helpers/sanitizeHtml.ts
var sanitizeHtml = function sanitizeHtml(html) {
  return html.replace(/[\r\n]+\s*/g, "");
};
;// CONCATENATED MODULE: ./src/util/helpers/evaluateTemplate.ts




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
;// CONCATENATED MODULE: ./src/util/helpers/templateExpressionRegex.ts
var templateExpressionRegex = /\{\{(.+?)\}\}/;
;// CONCATENATED MODULE: ./src/util/helpers/getAttributes.ts

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
;// CONCATENATED MODULE: ./src/util/helpers/cleanTemplatesTree.ts
// TODO: rename, not a tree

var cleanTemplatesTree = function cleanTemplatesTree(templatesTree) {
  return templatesTree.filter(function (_ref) {
    var element = _ref.element;
    return document.body.contains(element);
  });
};
;// CONCATENATED MODULE: ./src/util/templatesStack.ts

var templatesStack = {
  stack: [],
  get value() {
    return this.stack;
  },
  add: function add(item) {
    this.stack.push(item);
  },
  clean: function clean() {
    this.stack = cleanTemplatesTree(this.stack);
  }
};
;// CONCATENATED MODULE: ./src/util/defineCustomElement.ts




function defineCustomElement(name, template, state) {
  function CustomElement() {
    return Reflect.construct(HTMLElement, [], CustomElement);
  }
  CustomElement.prototype = Object.create(HTMLElement.prototype);
  CustomElement.prototype.constructor = CustomElement;
  CustomElement.prototype.connectedCallback = function () {
    var _tempDiv$firstChild, _customElement$parent, _customElement$parent2;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var customElement = this;
    var attributes = getAttributes(customElement);
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = template.innerHTML.replace(/\{\{\s*children\s*\}\}/g, customElement.innerHTML);
    var localState = attributesToState(attributes, state.value);
    var originalInvocation = tempDiv.innerHTML;
    var newElementAttributes = [];
    if (((_tempDiv$firstChild = tempDiv.firstChild) === null || _tempDiv$firstChild === void 0 ? void 0 : _tempDiv$firstChild.nodeType) !== Node.TEXT_NODE) {
      newElementAttributes = getAttributes(tempDiv.firstChild);
    }
    var evaluatedTemplate = evaluateTemplate(tempDiv.innerHTML, localState);
    tempDiv.innerHTML = evaluatedTemplate;
    var newElement = tempDiv.firstChild;
    (_customElement$parent = customElement.parentNode) === null || _customElement$parent === void 0 || _customElement$parent.insertBefore(newElement, customElement);
    if (!customElement.dataset.childOf && newElement) {
      newElement.lastTemplateEvaluation = evaluatedTemplate;
      templatesStack.add({
        element: newElement,
        template: originalInvocation,
        attributes: newElementAttributes,
        parentAttributes: attributes
      });
      templatesStack.clean();
    }
    (_customElement$parent2 = customElement.parentNode) === null || _customElement$parent2 === void 0 || _customElement$parent2.removeChild(customElement);
  };
  customElements.define(name, CustomElement);
}
;// CONCATENATED MODULE: ./src/util/eventListeners/makeEventHandler.ts

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
;// CONCATENATED MODULE: ./src/util/eventListeners/addEventListeners.ts

function addEventListeners(parent, eventName, state) {
  parent.querySelectorAll("[data-on-".concat(eventName, "]")).forEach(function (element) {
    var handler = makeEventHandler(eventName, element, state);
    element.addEventListener(eventName, handler);
    element["".concat(eventName, "Handler")] = handler;
  });
}
;// CONCATENATED MODULE: ./src/util/eventListeners/addAllEventListeners.ts

function addAllEventListeners(parent, state) {
  addEventListeners(parent, "click", state);
  addEventListeners(parent, "change", state);
}
;// CONCATENATED MODULE: ./src/util/loadTemplates.ts

var loadTemplates = function loadTemplates(rootElement) {
  var templates = [];
  var xpath = "template";
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    element.innerHTML = sanitizeHtml(element.innerHTML);
    templates.push(element);
    element = result.iterateNext();
  }
  return templates;
};
;// CONCATENATED MODULE: ./src/util/helpers/isCustomElement.ts
var isCustomElement = function isCustomElement(element) {
  return element.tagName.indexOf("-") !== -1;
};
;// CONCATENATED MODULE: ./src/util/loadTree.ts
// TODO: rename, not a tree



var loadTree = function loadTree(rootElement) {
  var tree = [];
  var xpath = "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]";
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    if (!isCustomElement(element)) {
      var attributes = getAttributes(element);
      tree.push({
        element: element,
        template: element.outerHTML,
        attributes: attributes,
        parentAttributes: []
      });
    }
    element = result.iterateNext();
  }
  return tree;
};
;// CONCATENATED MODULE: ./src/util/eventListeners/removeEventListeners.ts
function removeEventListeners(parent, eventName) {
  parent.querySelectorAll("[data-on-".concat(eventName, "]")).forEach(function (element) {
    var handler = element["".concat(eventName, "Handler")];
    if (handler) {
      element.removeEventListener(eventName, handler);
    }
  });
}
;// CONCATENATED MODULE: ./src/util/eventListeners/removeAllEventListeners.ts

function removeAllEventListeners(parent) {
  removeEventListeners(parent, "click");
  removeEventListeners(parent, "change");
}
;// CONCATENATED MODULE: ./src/util/helpers/getChangedAttributes.ts
function getChangedAttributes(oldElement, newElement) {
  var changedAttributes = [];
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var oldAttr = oldElement.attributes[i];
    var newAttrValue = newElement.getAttribute(oldAttr.name);
    if (newAttrValue !== oldAttr.value) {
      changedAttributes.push({
        name: oldAttr.name,
        newValue: newAttrValue || ""
      });
    }
  }
  return changedAttributes;
}
;// CONCATENATED MODULE: ./src/util/helpers/compareNodes.ts


function compareNodes(oldNode, newNode) {
  // TODO: changed custom element like <my-element></my-element> will
  // be returned twice if both attributes and content changed.
  // But either way the entire element will be updated, so it's suboptimal
  // because the loop with changed elements will be longer for no reason.

  if (oldNode.nodeType === Node.TEXT_NODE) {
    if (oldNode.textContent !== newNode.textContent) {
      var _newNode$textContent;
      return [{
        element: oldNode,
        newElement: newNode,
        content: (_newNode$textContent = newNode.textContent) !== null && _newNode$textContent !== void 0 ? _newNode$textContent : ""
      }];
    }
    return [];
  } else {
    oldNode.innerHTML = sanitizeHtml(oldNode.innerHTML);
    newNode.innerHTML = sanitizeHtml(newNode.innerHTML);
    var textContentChanged = false;
    var changedChildren = [];
    for (var i = 0; i < oldNode.childNodes.length; i++) {
      var oldChild = oldNode.childNodes[i];
      var newChild = newNode.childNodes[i];
      if (oldChild.nodeType === Node.TEXT_NODE && newChild && newChild.nodeType === Node.TEXT_NODE) {
        if (oldChild.textContent !== newChild.textContent) {
          textContentChanged = true;
          break;
        }
      } else if (oldChild.nodeType === Node.ELEMENT_NODE) {
        var changedAttributes = getChangedAttributes(oldChild, newChild);
        if (changedAttributes.length > 0) {
          changedChildren.push({
            element: oldChild,
            newElement: newChild,
            attributes: changedAttributes
          });
        }
      }
    }
    if (textContentChanged) {
      return [{
        element: oldNode,
        newElement: newNode,
        content: newNode.innerHTML
      }];
    } else {
      for (var _i = 0; _i < oldNode.childNodes.length; _i++) {
        var changes = compareNodes(oldNode.childNodes[_i], newNode.childNodes[_i]);
        changedChildren = changedChildren.concat(changes);
      }
      return changedChildren;
    }
  }
}
;// CONCATENATED MODULE: ./src/util/helpers/elementFromString.ts
function elementFromString(htmlString) {
  var parser = new DOMParser();
  var newElementDoc = parser.parseFromString(htmlString, "text/html");
  return newElementDoc.body.firstChild;
}
;// CONCATENATED MODULE: ./src/util/helpers/findCorrespondingNode.ts
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
;// CONCATENATED MODULE: ./src/util/renderTemplates.ts









var renderTemplates = function renderTemplates(tree, state) {
  var treeNodeIndex = 0;
  var _loop = function _loop() {
    var _element$lastTemplate;
    var _tree$treeNodeIndex = tree[treeNodeIndex],
      element = _tree$treeNodeIndex.element,
      template = _tree$treeNodeIndex.template,
      attributes = _tree$treeNodeIndex.attributes,
      parentAttributes = _tree$treeNodeIndex.parentAttributes;
    var localState = attributesToState(parentAttributes, state);
    if (attributes) {
      var i = 0;
      for (i; i < attributes.length; i++) {
        var evaluated = attributes[i].reactive ? evaluateExpression(attributes[i].value, localState) : attributes[i].value;
        if (evaluated !== element.getAttribute(attributes[i].name)) {
          element.setAttribute(attributes[i].name, evaluated);
        }
      }
    }
    var updatedContent = evaluateTemplate(template, localState);
    var newElement = elementFromString(updatedContent);
    var oldElement = elementFromString((_element$lastTemplate = element.lastTemplateEvaluation) !== null && _element$lastTemplate !== void 0 ? _element$lastTemplate : element.outerHTML);
    var changedElements = compareNodes(oldElement, newElement);
    console.log(oldElement, newElement);
    if (changedElements.length > 0) {
      element.lastTemplateEvaluation = updatedContent;
      changedElements.map(function (_ref) {
        var changedTarget = _ref.element,
          newElement = _ref.newElement,
          content = _ref.content,
          attributes = _ref.attributes;
        var changedElement = findCorrespondingNode(changedTarget, oldElement, element);
        if (changedElement) {
          if (changedTarget.nodeType !== Node.TEXT_NODE && isCustomElement(changedTarget)) {
            var _changedElement$paren;
            (_changedElement$paren = changedElement.parentElement) === null || _changedElement$paren === void 0 || _changedElement$paren.replaceChild(newElement, changedElement);
          } else {
            if (content !== undefined) {
              if (changedElement.nodeType === Node.TEXT_NODE) {
                changedElement.textContent = content;
              } else {
                removeAllEventListeners(changedElement);
                changedElement.innerHTML = content;
                addAllEventListeners(changedElement, localState);
              }
            } else if (attributes !== undefined) {
              attributes.map(function (_ref2) {
                var name = _ref2.name,
                  newValue = _ref2.newValue;
                changedElement.setAttribute(name, newValue);
              });
            }
          }
        }
      });
    }
  };
  for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
    _loop();
  }
};
;// CONCATENATED MODULE: ./src/util/state.ts
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
;// CONCATENATED MODULE: ./src/cog.ts








var init = function init(document) {
  var tree = [];
  var templates = [];
  var appElement = createAppElement(document);
  var state = createState();
  function reRender() {
    renderTemplates(tree, state.value);
    renderTemplates(templatesStack.value, state.value);
  }
  function updateState(name, value) {
    setTimeout(function () {
      state.set(name, value);
      reRender();
    }, 0);
  }
  function defineCustomElements(templates) {
    templates.forEach(function (template) {
      var name = template.getAttribute("id");
      if (!name) {
        throw new Error("Missing id attribute");
      }
      if (template.content.childNodes.length !== 1) {
        throw new Error("Template ".concat(name, " should have a single child"));
      }
      defineCustomElement(name, template, state);
    });
  }
  var onLoad = function onLoad() {
    tree = loadTree(appElement.value);
    templates = loadTemplates(appElement.value);
    defineCustomElements(templates);
    addAllEventListeners(appElement.value, state.value);
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

;// CONCATENATED MODULE: ./examples/src/ts-module-todo.ts
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

var todos = variable("todos", [{
  text: "hello",
  done: false
}]);
variable("save", function () {
  var todo = document.querySelector("[data-input=todo");
  if (todo !== null && todo !== void 0 && todo.value) {
    todos.set([].concat(_toConsumableArray(todos.value), [{
      text: todo.value,
      done: false
    }]));
    todo.value = "";
  }
});
variable("toggleTodo", function (index) {
  var newTodos = _toConsumableArray(todos.value);
  newTodos[index].done = !newTodos[index].done;
  todos.set(newTodos);
});
variable("Checkbox", function (_ref) {
  var _ref$index = _ref.index,
    index = _ref$index === void 0 ? -1 : _ref$index,
    _ref$checked = _ref.checked,
    checked = _ref$checked === void 0 ? false : _ref$checked;
  return "<input type=\"checkbox\" id=\"todo".concat(index, "\" data-on-change=\"toggleTodo(").concat(index, ")\" ").concat(checked ? "checked" : "", " />");
});
var counter = variable("counter", 0);
variable("increment", function () {
  counter.set(counter.value + 1);
});
/******/ 	return __webpack_exports__;
/******/ })()
;
});