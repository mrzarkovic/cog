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

;// CONCATENATED MODULE: ./src/cog.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
    var _value = htmlToText(htmlValue);
    var evaluated = evaluateExpression(_value, state);
    updatedContent += "".concat(before).concat(evaluated);
    restOfContent = after;
  }
  updatedContent += restOfContent;
  return updatedContent;
};
var render = function render(tree, state) {
  // TODO: special render for templates tree
  // to compare last template evaluation with current one
  // Example:
  // "<div><x-child data-child="{{ dataParent }}"></x-child></div>"
  // "<div><x-child data-child="0"></x-child></div>"

  var treeNodeIndex = 0;
  var _loop = function _loop() {
    var localState = _objectSpread({}, state);
    var _tree$treeNodeIndex = tree[treeNodeIndex],
      element = _tree$treeNodeIndex.element,
      template = _tree$treeNodeIndex.template,
      attributes = _tree$treeNodeIndex.attributes,
      parentAttributes = _tree$treeNodeIndex.parentAttributes;
    if (parentAttributes) {
      var i = 0;
      for (i; i < parentAttributes.length; i++) {
        var attribute = parentAttributes[i];
        var _name = attribute.name;
        var _value2 = attribute.value;
        var reactive = attribute.reactive;
        var evaluated = reactive ? evaluateExpression(_value2, localState) : _value2;
        localState[convertAttribute(_name)] = evaluated;
      }
    }
    if (attributes) {
      var _i = 0;
      for (_i; _i < attributes.length; _i++) {
        var _attribute = attributes[_i];
        var _name2 = _attribute.name;
        var _value3 = _attribute.value;
        var _reactive = _attribute.reactive;
        var _evaluated = _reactive ? evaluateExpression(_value3, localState) : _value3;
        if (_evaluated !== element.getAttribute(_name2)) {
          element.setAttribute(_name2, _evaluated);
        }
      }
    }
    var updatedContent = evaluateTemplate(template, localState);
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
            addAllEventListeners(element, localState);
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
  };
  for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
    _loop();
  }
};
var renderTemplates = function renderTemplates(tree, state) {
  // TODO: special render for templates tree
  // to compare last template evaluation with current one
  // Example:
  // "<div><x-child data-child="{{ dataParent }}"></x-child></div>"
  // "<div><x-child data-child="0"></x-child></div>"

  var treeNodeIndex = 0;
  for (treeNodeIndex; treeNodeIndex < tree.length; treeNodeIndex++) {
    var localState = _objectSpread({}, state);
    var _tree$treeNodeIndex2 = tree[treeNodeIndex],
      element = _tree$treeNodeIndex2.element,
      template = _tree$treeNodeIndex2.template,
      attributes = _tree$treeNodeIndex2.attributes,
      parentAttributes = _tree$treeNodeIndex2.parentAttributes;
    if (parentAttributes) {
      var i = 0;
      for (i; i < parentAttributes.length; i++) {
        var attribute = parentAttributes[i];
        var _name3 = attribute.name;
        var _value4 = attribute.value;
        var reactive = attribute.reactive;
        var evaluated = reactive ? evaluateExpression(_value4, localState) : _value4;
        localState[convertAttribute(_name3)] = evaluated;
      }
    }
    if (attributes) {
      var _i2 = 0;
      for (_i2; _i2 < attributes.length; _i2++) {
        var _attribute2 = attributes[_i2];
        var _name4 = _attribute2.name;
        var _value5 = _attribute2.value;
        var _reactive2 = _attribute2.reactive;
        var _evaluated2 = _reactive2 ? evaluateExpression(_value5, localState) : _value5;
        if (_evaluated2 !== element.getAttribute(_name4)) {
          element.setAttribute(_name4, _evaluated2);
        }
      }
    }
    var updatedContent = evaluateTemplate(template, localState);
    var changedElements = findChangedTemplateElements(element.lastTemplateEvaluation, updatedContent);
    if (changedElements.length > 0) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(updatedContent, "text/html");
      var newElement = doc.body.firstChild;
      element.lastTemplateEvaluation = updatedContent;
      // newElement.originalTemplateInvocation = template;

      // Version with replacing the whole template invocation
      // And triggering callback for custom templates
      // element.parentNode?.replaceChild(newElement, element);

      element.innerHTML = newElement.innerHTML;

      // changedElements.map(({ element, content, attributes }) => {
      // TODO: find exact changed element in template and replace
      // only that element with original part of the template
      // For example, findCahngedTemplateElements can return index
      // of changed child node
      // removeAllEventListeners(element);

      // if (content !== undefined) {
      //     element.innerHTML = content;
      // } else if (attributes !== undefined) {
      //     attributes.map(({ name, newValue }) => {
      //         element.setAttribute(name, newValue);
      //     });
      // }
      // addAllEventListeners(element, localState);
      // });
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
var sanitizeHtml = function sanitizeHtml(html) {
  return html.replace(/[\r\n]+\s*/g, "");
};
function findChangedTemplateElements(oldHtml, newHtml) {
  var oldElement = document.createElement("div");
  oldElement.innerHTML = oldHtml;
  var newElement = document.createElement("div");
  newElement.innerHTML = newHtml;
  function compareNodes(oldNode, newNode) {
    if (oldNode.nodeType === Node.TEXT_NODE) {
      if (oldNode.textContent !== newNode.textContent) {
        return [{
          element: oldNode,
          content: newNode.innerHTML
        }];
      }
      return [];
    } else {
      // const oldNodeSanitized = oldNode.innerHTML.replace(/\r?\n|\r/g, "");
      // const newNodeSanitized = newNode.innerHTML.replace(/\r?\n|\r/g, "");

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
        for (var _i3 = 0; _i3 < oldNode.childNodes.length; _i3++) {
          var changes = compareNodes(oldNode.childNodes[_i3], newNode.childNodes[_i3]);
          changedChildren = changedChildren.concat(changes);
        }
        return changedChildren;
      }
    }
  }
  return compareNodes(oldElement, newElement);
}
function findChangedElements(oldElement, newHtml) {
  var newElement = oldElement.cloneNode();
  newElement.innerHTML = newHtml;
  function compareNodes(oldNode, newNode) {
    if (oldNode.nodeType === Node.TEXT_NODE) {
      if (oldNode.textContent !== newNode.textContent) {
        return [{
          element: oldNode,
          content: newNode.innerHTML
        }];
      }
      return [];
    } else {
      // const oldNodeSanitized = oldNode.innerHTML.replace(/\r?\n|\r/g, "");
      // const newNodeSanitized = newNode.innerHTML.replace(/\r?\n|\r/g, "");

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
        for (var _i4 = 0; _i4 < oldNode.childNodes.length; _i4++) {
          var changes = compareNodes(oldNode.childNodes[_i4], newNode.childNodes[_i4]);
          changedChildren = changedChildren.concat(changes);
        }
        return changedChildren;
      }
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
    element.innerHTML = sanitizeHtml(element.innerHTML);
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
var cleanTemplatesTree = function cleanTemplatesTree(templatesTree) {
  return templatesTree.filter(function (_ref3) {
    var element = _ref3.element;
    return document.body.contains(element);
  });
};
var init = function init(document) {
  var state = {};
  var tree = [];
  var templates = [];
  var templatesTree = [];
  function defineCustomElement(name) {
    function CustomElement() {
      return Reflect.construct(HTMLElement, [], CustomElement);
    }
    CustomElement.prototype = Object.create(HTMLElement.prototype);
    CustomElement.prototype.constructor = CustomElement;
    CustomElement.prototype.connectedCallback = function () {
      var _customElement$parent, _customElement$parent2;
      console.log("new custom element added to DOM", name);
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var customElement = this;
      var template = templates.find(function (template) {
        return template.getAttribute("id") === customElement.tagName.toLowerCase();
      });
      var attributes = getAttributes(customElement);
      // Create a temporary div element
      var tempDiv = document.createElement("div");
      // Set its innerHTML to the HTML string
      tempDiv.innerHTML = template.innerHTML.replace(/\{\{\s*children\s*\}\}/g, customElement.innerHTML);

      // Parse all the expressions in template
      // and replace them with their evaluated value

      var localState = _objectSpread({}, state);
      var _iterator = _createForOfIteratorHelper(attributes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var attribute = _step.value;
          var attributeValue = attribute.value;
          if (attribute.reactive) {
            attributeValue = evaluateExpression(attributeValue, state);
          }
          localState[convertAttribute(attribute.name)] = attributeValue;
        }

        // const xpathResult = document.evaluate(
        //     "//*[contains(name(), '-')]",
        //     tempDiv,
        //     null,
        //     XPathResult.ANY_TYPE,
        //     null
        // );

        // let customChildElement = xpathResult.iterateNext();
        // const customChildElements = [];

        // while (customChildElement) {
        //     customChildElements.push(customChildElement);
        //     customChildElement = xpathResult.iterateNext();
        // }

        // for (const customChildElement of customChildElements) {
        //     (customChildElement as HTMLElement).setAttribute(
        //         "data-child-of",
        //         name
        //     );
        // }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var originalInvocation = tempDiv.innerHTML;
      var evaluatedTemplate = evaluateTemplate(tempDiv.innerHTML, localState);

      // console.log(evaluatedTemplate);
      tempDiv.innerHTML = evaluatedTemplate;

      // const lastTemplateEvaluation = evaluatedTemplate;
      //     const customElementAttributes = getAttributes(
      //         customChildElement as HTMLElement
      //     );
      //     for (const attribute of customElementAttributes) {
      //         if (attribute.reactive) {
      //             const attributeValue = evaluateExpression(
      //                 attribute.value,
      //                 localState
      //             );
      //             (customChildElement as HTMLElement).setAttribute(
      //                 attribute.name,
      //                 attributeValue
      //             );
      //         }
      //     }
      // }

      // Replace the current element with each of the new elements
      // while (tempDiv.firstChild) {
      var newElement = tempDiv.firstChild;
      // console.log(newElement);

      (_customElement$parent = customElement.parentNode) === null || _customElement$parent === void 0 || _customElement$parent.insertBefore(newElement, customElement);
      if (!customElement.dataset.childOf && newElement) {
        if (newElement.nodeType === Node.TEXT_NODE) {
          var _newElement$textConte;
          var textContent = (_newElement$textConte = newElement.textContent) !== null && _newElement$textConte !== void 0 ? _newElement$textConte : "";
          var hasTemplateExpression = templateExpressionRegex.test(textContent);
          if (hasTemplateExpression) {
            templatesTree.push({
              element: newElement,
              template: textContent,
              attributes: [],
              parentAttributes: attributes
              // lastEvaluation: textContent,
            });
          }
        } else {
          newElement.lastTemplateEvaluation = evaluatedTemplate;
          if (!isCustomElement(newElement)) {
            templatesTree.push({
              element: newElement,
              template: originalInvocation,
              // lastEvaluation: lastTemplateEvaluation,
              attributes: getAttributes(newElement),
              parentAttributes: attributes
            });
          }
        }

        // const newTree = loadTree(AppElement.value, []);
        templatesTree = cleanTemplatesTree(templatesTree);
        console.log("tree", templatesTree);
        // render(newTree, state);
      }
      // }

      (_customElement$parent2 = customElement.parentNode) === null || _customElement$parent2 === void 0 || _customElement$parent2.removeChild(customElement);
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
  function reRender() {
    render(tree, state);
    // templatesTree = cleanTemplatesTree(templatesTree);
    // console.log(templatesTree);
    renderTemplates(templatesTree, state);
  }
  function updateState(name, value) {
    setTimeout(function () {
      state[name] = value;
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
      defineCustomElement(name);
    });
  }
  var onLoad = function onLoad() {
    tree = loadTree(AppElement.value, []);
    templates = loadTemplates(AppElement.value);
    defineCustomElements(templates);
    addAllEventListeners(AppElement.value, state);
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