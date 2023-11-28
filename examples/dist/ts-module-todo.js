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

;// CONCATENATED MODULE: ./src/cog.ts
var templateExpressionRegex = /\{\{(.+?)\}\}/;
var createExpressionScope = function createExpressionScope(expression, state) {
  var functionBody = "return (state) => {".concat(Object.keys(state).map(function (variable) {
    return "const ".concat(variable, " = state[\"").concat(variable, "\"];");
  }).join("\n"), " return ").concat(expression, "}");
  return Function(functionBody)();
};
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
var convertAttribute = function convertAttribute(attribute) {
  return attribute.split("-").reduce(function (result, part, index) {
    return result + (index ? part[0].toUpperCase() + part.slice(1) : part);
  }, "");
};
var isCustomElement = function isCustomElement(element) {
  return element.tagName.includes("-");
};
var render = function render(tree, state) {
  var treeNodeIndex = 0;
  for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
    var _tree$treeNodeIndex = tree[treeNodeIndex],
      element = _tree$treeNodeIndex.element,
      template = _tree$treeNodeIndex.template,
      attributes = _tree$treeNodeIndex.attributes,
      parentAttributes = _tree$treeNodeIndex.parentAttributes;
    var updatedContent = "";
    var restOfContent = template;
    var hasTemplateExpression = true;
    if (attributes) {
      var i = 0;
      for (i; i < attributes.length; i++) {
        var attribute = attributes[i];
        var _name = attribute.name;
        var _value = attribute.value;
        var reactive = attribute.reactive;
        var evaluated = reactive ? evaluateExpression(_value, state) : _value;
        if (evaluated !== element.getAttribute(_name)) {
          element.setAttribute(_name, evaluated);
        }
      }
    }
    if (parentAttributes) {
      var _i = 0;
      for (_i; _i < parentAttributes.length; _i++) {
        var _attribute = parentAttributes[_i];
        var _name2 = _attribute.name;
        var _value2 = _attribute.value;
        var _reactive = _attribute.reactive;
        var _evaluated = _reactive ? evaluateExpression(_value2, state) : _value2;
        state[convertAttribute(_name2)] = _evaluated;
      }
    }
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
      var _value3 = htmlToText(htmlValue);
      var _evaluated2 = evaluateExpression(_value3, state);
      updatedContent += "".concat(before).concat(_evaluated2);
      restOfContent = after;
    }
    updatedContent += restOfContent;
    if (element.nodeType === Node.TEXT_NODE) {
      if (element.textContent !== updatedContent) {
        element.textContent = updatedContent;
      }
    } else {
      var changedElements = findChangedElements(element, updatedContent);
      if (changedElements.length > 0) {
        changedElements.map(function (_ref) {
          var element = _ref.element,
            content = _ref.content,
            attributes = _ref.attributes;
          if (content !== undefined) {
            removeAllEventListeners(element);
            element.innerHTML = content;
            addAllEventListeners(element, state);
          } else if (attributes !== undefined) {
            attributes.map(function (_ref2) {
              var name = _ref2.name,
                newValue = _ref2.newValue;
              element.setAttribute(name, newValue);
            });
          }
        });
      }
    }
  }
};
function escapeHtml(html) {
  return html.replace(/<(?=[^<>]*>)/g, "&lt;").replace(/(?<=[^<>]*)>/g, "&gt;");
}
function htmlToText(html) {
  var tmp = document.createElement("div");
  tmp.innerHTML = escapeHtml(html);
  return tmp.textContent || tmp.innerText || "";
}

// function attributesChanged(
//     oldElement: HTMLElement,
//     newElement: HTMLElement
// ): boolean {
//     for (let i = 0; i < oldElement.attributes.length; i++) {
//         const oldAttr = oldElement.attributes[i];
//         const newAttr = newElement.getAttribute(oldAttr.name);
//         if (newAttr !== oldAttr.value) {
//             return true;
//         }
//     }
//     return false;
// }

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
function findChangedElements(oldElement, newHtml) {
  var newElement = oldElement.cloneNode();
  newElement.innerHTML = newHtml;
  function compareNodes(oldNode, newNode) {
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
      } else {
        var changedAttributes = getChangedAttributes(oldChild, newChild);
        if (changedAttributes.length > 0) {
          changedChildren.push({
            element: oldChild,
            attributes: changedAttributes
          });
        }
      }
    }
    if (textContentChanged) {
      return [{
        element: oldNode,
        content: newNode.innerHTML
      }];
    } else {
      for (var _i2 = 0; _i2 < oldNode.childNodes.length; _i2++) {
        var changes = compareNodes(oldNode.childNodes[_i2], newNode.childNodes[_i2]);
        changedChildren = changedChildren.concat(changes);
      }
      return changedChildren;
    }
  }
  return compareNodes(oldElement, newElement);
}
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
var loadTree = function loadTree(rootElement, parentAttributes) {
  var tree = [];
  var xpath = "self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]";
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    if (!isCustomElement(element)) {
      // template =
      //     templates.find(
      //         (template) =>
      //             template.getAttribute("id") ===
      //             element.tagName.toLowerCase()
      //     )?.innerHTML || "";
      var attributes = getAttributes(element);
      tree.push({
        element: element,
        template: element.innerHTML,
        attributes: attributes,
        parentAttributes: parentAttributes
      });
    }
    element = result.iterateNext();
  }
  return tree;
};
var loadTemplates = function loadTemplates(rootElement) {
  var templates = [];
  var xpath = "template";
  var result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  var element = result.iterateNext();
  while (element) {
    templates.push(element);
    element = result.iterateNext();
  }
  return templates;
};
function addAllEventListeners(parent, state) {
  addEventListeners(parent, "click", state);
  addEventListeners(parent, "change", state);
}
function removeAllEventListeners(parent) {
  removeEventListeners(parent, "click");
  removeEventListeners(parent, "change");
}
function addEventListeners(parent) {
  var eventName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "click";
  var state = arguments.length > 2 ? arguments[2] : undefined;
  parent.querySelectorAll("[data-on-".concat(eventName, "]")).forEach(function (element) {
    var handler = makeEventHandler(eventName, element, state);
    element.addEventListener(eventName, handler);
    element["".concat(eventName, "Handler")] = handler;
  });
}
function removeEventListeners(parent) {
  var eventName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "click";
  parent === null || parent === void 0 || parent.querySelectorAll("[data-on-".concat(eventName, "]")).forEach(function (element) {
    var handler = element["".concat(eventName, "Handler")];
    if (handler) {
      element.removeEventListener(eventName, handler);
    }
  });
}
var makeEventHandler = function makeEventHandler() {
  var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "click";
  var element = arguments.length > 1 ? arguments[1] : undefined;
  var state = arguments.length > 2 ? arguments[2] : undefined;
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
var init = function init(document) {
  var state = {};
  var tree = [];
  var templates = [];
  function defineCustomElement(name, innerHTML) {
    function CustomElement() {
      return Reflect.construct(HTMLElement, [], CustomElement);
    }
    CustomElement.prototype = Object.create(HTMLElement.prototype);
    CustomElement.prototype.constructor = CustomElement;
    CustomElement.prototype.connectedCallback = function () {
      var attributes = getAttributes(this);

      // Create a temporary div element
      var tempDiv = document.createElement("div");
      // Set its innerHTML to the HTML string
      tempDiv.innerHTML = innerHTML.replace(/\{\{\s*children\s*\}\}/g, this.innerHTML);

      // Replace the current element with each of the new elements
      while (tempDiv.firstChild) {
        var newElement = tempDiv.firstChild;
        this.parentNode.insertBefore(newElement, this);
        if (newElement.nodeType === Node.TEXT_NODE) {
          var _textContent;
          var textContent = (_textContent = newElement.textContent) !== null && _textContent !== void 0 ? _textContent : "";
          var hasTemplateExpression = templateExpressionRegex.test(textContent);
          if (hasTemplateExpression) {
            var _textContent2;
            tree.push({
              element: newElement,
              template: (_textContent2 = newElement.textContent) !== null && _textContent2 !== void 0 ? _textContent2 : "",
              attributes: [],
              parentAttributes: attributes
            });
          }
        } else {
          if (!isCustomElement(newElement)) {
            tree = tree.concat(loadTree(newElement, attributes));
          }
        }
      }
      this.parentNode.removeChild(this);
    };
    customElements.define(name, CustomElement);
  }
  var AppElement = {
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
  function updateState(name, value) {
    setTimeout(function () {
      state[name] = value;
      render(tree, state);
    }, 0);
  }
  function defineCustomElements(templates) {
    templates.forEach(function (template) {
      var name = template.getAttribute("id");
      if (!name) {
        throw new Error("Missing id attribute");
      }
      defineCustomElement(name, template.innerHTML);
    });
  }
  var onLoad = function onLoad() {
    tree = loadTree(AppElement.value, []);
    templates = loadTemplates(AppElement.value);
    defineCustomElements(templates);
    console.log(tree);
    addAllEventListeners(AppElement.value, state);
    render(tree, state);
  };
  var onLoadHandler = document["onLoadHandler"];
  if (onLoadHandler) {
    document.removeEventListener("DOMContentLoaded", onLoadHandler);
  }
  document.addEventListener("DOMContentLoaded", onLoad);
  document["onLoadHandler"] = onLoad;
  return {
    variable: function variable(name, value) {
      state[name] = value;
      return {
        set value(newVal) {
          updateState(name, newVal);
        },
        get value() {
          return state[name];
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