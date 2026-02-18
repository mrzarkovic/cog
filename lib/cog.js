/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
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
/******/ 	var __webpack_modules__ = ({

/***/ "./src/attributes/attributesToState.ts":
/*!*********************************************!*\
  !*** ./src/attributes/attributesToState.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   attributesToState: () => (/* binding */ attributesToState)\n/* harmony export */ });\n/* harmony import */ var _html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../html/evaluateTemplate */ \"./src/html/evaluateTemplate.ts\");\n/* harmony import */ var _convertAttributeName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./convertAttributeName */ \"./src/attributes/convertAttributeName.ts\");\n/* harmony import */ var _convertAttributeValue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./convertAttributeValue */ \"./src/attributes/convertAttributeValue.ts\");\n\n\n\nfunction attributesToState(attributes, state) {\n  let stateChanges = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];\n  const localState = Object.assign({}, state);\n  for (let i = 0; i < attributes.length; i++) {\n    const attributeName = (0,_convertAttributeName__WEBPACK_IMPORTED_MODULE_1__.convertAttributeName)(attributes[i].name);\n    let value = attributes[i].value;\n    let parentStateDependencies = [];\n    if (attributes[i].reactive) {\n      parentStateDependencies = Array.from(new Set(attributes[i].expressions.map(expression => expression.dependencies).flat()));\n      value = (0,_html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_0__.evaluateTemplate)(attributes[i].value, attributes[i].expressions, state, stateChanges);\n    }\n    localState[attributeName] = {\n      value: (0,_convertAttributeValue__WEBPACK_IMPORTED_MODULE_2__.convertAttributeValue)(value),\n      dependents: [],\n      computants: [],\n      dependencies: parentStateDependencies\n    };\n  }\n  return localState;\n}\n\n//# sourceURL=webpack://Cog/./src/attributes/attributesToState.ts?");

/***/ }),

/***/ "./src/attributes/convertAttributeName.ts":
/*!************************************************!*\
  !*** ./src/attributes/convertAttributeName.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   convertAttributeName: () => (/* binding */ convertAttributeName)\n/* harmony export */ });\nconst convertAttributeName = attribute => {\n  return attribute.split(\"-\").reduce((result, part, index) => result + (index ? part[0].toUpperCase() + part.slice(1) : part), \"\");\n};\n\n//# sourceURL=webpack://Cog/./src/attributes/convertAttributeName.ts?");

/***/ }),

/***/ "./src/attributes/convertAttributeValue.ts":
/*!*************************************************!*\
  !*** ./src/attributes/convertAttributeValue.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   convertAttributeValue: () => (/* binding */ convertAttributeValue)\n/* harmony export */ });\nfunction convertAttributeValue(value) {\n  return value === \"true\" ? true : value === \"false\" ? false : value === \"null\" ? null : value === \"undefined\" ? undefined : value === \"\" ? \"\" : !isNaN(Number(value)) ? Number(value) : value;\n}\n\n//# sourceURL=webpack://Cog/./src/attributes/convertAttributeValue.ts?");

/***/ }),

/***/ "./src/attributes/getAttributes.ts":
/*!*****************************************!*\
  !*** ./src/attributes/getAttributes.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getAttributes: () => (/* binding */ getAttributes)\n/* harmony export */ });\n/* harmony import */ var _html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../html/evaluateTemplate */ \"./src/html/evaluateTemplate.ts\");\n\nconst getAttributes = (element, state) => {\n  const attributes = Array.from(element.attributes).map(attribute => {\n    const expressions = (0,_html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_0__.extractTemplateExpressions)(attribute.value, state);\n    return {\n      name: attribute.name,\n      value: attribute.value,\n      expressions,\n      reactive: !!expressions.length,\n      dependents: []\n    };\n  });\n  return attributes;\n};\n\n//# sourceURL=webpack://Cog/./src/attributes/getAttributes.ts?");

/***/ }),

/***/ "./src/attributes/getChangedAttributes.ts":
/*!************************************************!*\
  !*** ./src/attributes/getChangedAttributes.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getChangedAttributes: () => (/* binding */ getChangedAttributes)\n/* harmony export */ });\n/* harmony import */ var _convertAttributeValue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./convertAttributeValue */ \"./src/attributes/convertAttributeValue.ts\");\n\nfunction getChangedAttributes(oldElement, newElement) {\n  const changedAttributes = [];\n  for (let i = 0; i < oldElement.attributes.length; i++) {\n    const oldAttr = oldElement.attributes[i];\n    const newAttrValue = newElement.getAttribute(oldAttr.name);\n    if (newAttrValue !== oldAttr.value) {\n      changedAttributes.push({\n        name: oldAttr.name,\n        newValue: (0,_convertAttributeValue__WEBPACK_IMPORTED_MODULE_0__.convertAttributeValue)(newAttrValue || \"\")\n      });\n    }\n  }\n  return changedAttributes;\n}\n\n//# sourceURL=webpack://Cog/./src/attributes/getChangedAttributes.ts?");

/***/ }),

/***/ "./src/attributes/getLocalState.ts":
/*!*****************************************!*\
  !*** ./src/attributes/getLocalState.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getLocalState: () => (/* binding */ getLocalState)\n/* harmony export */ });\n/* harmony import */ var _attributesToState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attributesToState */ \"./src/attributes/attributesToState.ts\");\n\nfunction getLocalState(parentId, attributes, globalState, reactiveNodes) {\n  let stateChanges = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];\n  const parentNode = reactiveNodes.find(rn => rn.id === parentId);\n  if (!parentNode) {\n    return (0,_attributesToState__WEBPACK_IMPORTED_MODULE_0__.attributesToState)(attributes, globalState, stateChanges);\n  }\n  const parentState = getLocalState(parentNode.parentId, parentNode.attributes, globalState, reactiveNodes, stateChanges);\n  return Object.assign({}, parentState, (0,_attributesToState__WEBPACK_IMPORTED_MODULE_0__.attributesToState)(attributes, parentState, stateChanges));\n}\n\n//# sourceURL=webpack://Cog/./src/attributes/getLocalState.ts?");

/***/ }),

/***/ "./src/attributes/handleBooleanAttribute.ts":
/*!**************************************************!*\
  !*** ./src/attributes/handleBooleanAttribute.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handleBooleanAttribute: () => (/* binding */ handleBooleanAttribute)\n/* harmony export */ });\nfunction handleBooleanAttribute(changedNode, attribute) {\n  if (attribute.name.startsWith(\"data-attribute-\")) {\n    const optionalAttribute = attribute.name.substring(15); // \"data-attribute-\".length\n\n    if (attribute.newValue) {\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      changedNode[optionalAttribute] = true;\n      changedNode.setAttribute(optionalAttribute, attribute.newValue);\n    } else {\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      changedNode[optionalAttribute] = false;\n      changedNode.removeAttribute(optionalAttribute);\n    }\n  }\n}\n\n//# sourceURL=webpack://Cog/./src/attributes/handleBooleanAttribute.ts?");

/***/ }),

/***/ "./src/cog.ts":
/*!********************!*\
  !*** ./src/cog.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   init: () => (/* binding */ init),\n/* harmony export */   render: () => (/* binding */ render),\n/* harmony export */   variable: () => (/* binding */ variable)\n/* harmony export */ });\n/* harmony import */ var _createReactiveNodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createReactiveNodes */ \"./src/createReactiveNodes.ts\");\n/* harmony import */ var _createState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createState */ \"./src/createState.ts\");\n/* harmony import */ var _eventListeners_addAllEventListeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./eventListeners/addAllEventListeners */ \"./src/eventListeners/addAllEventListeners.ts\");\n/* harmony import */ var _nodes_reconcile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodes/reconcile */ \"./src/nodes/reconcile.ts\");\n/* harmony import */ var _nodes_registerNativeElements__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nodes/registerNativeElements */ \"./src/nodes/registerNativeElements.ts\");\n/* harmony import */ var _nodes_registerTemplates__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nodes/registerTemplates */ \"./src/nodes/registerTemplates.ts\");\n\n\n\n\n\n\nconst frameDelay = 1000 / 60;\nconst init = () => {\n  let stateFunctionExecuting = null;\n  const reactiveNodes = (0,_createReactiveNodes__WEBPACK_IMPORTED_MODULE_0__.createReactiveNodes)();\n  let updateStateTimeout = null;\n  const state = (0,_createState__WEBPACK_IMPORTED_MODULE_1__.createState)();\n  function reRender() {\n    state.updatedElements.forEach(elementId => {\n      const reactiveNode = reactiveNodes.get(elementId);\n      (0,_nodes_reconcile__WEBPACK_IMPORTED_MODULE_3__.reconcile)(reactiveNodes, reactiveNode, state, state.elementsUpdatedKeys[elementId]);\n    });\n    state.clearUpdates();\n  }\n  let lastFrameTime = 0;\n  function scheduleReRender() {\n    if (updateStateTimeout !== null) {\n      cancelAnimationFrame(updateStateTimeout);\n    }\n    updateStateTimeout = requestAnimationFrame(currentTime => {\n      if (currentTime - lastFrameTime > frameDelay) {\n        lastFrameTime = currentTime;\n        reRender();\n      }\n    });\n  }\n  const render = rootElement => {\n    (0,_eventListeners_addAllEventListeners__WEBPACK_IMPORTED_MODULE_2__.addAllEventListeners)(rootElement, state.value);\n    (0,_nodes_registerNativeElements__WEBPACK_IMPORTED_MODULE_4__.registerNativeElements)(rootElement, state.value, reactiveNodes);\n    (0,_nodes_registerTemplates__WEBPACK_IMPORTED_MODULE_5__.registerTemplates)(rootElement, state, reactiveNodes);\n  };\n  const getFunctionValue = (name, value) => function (cogId) {\n    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n      args[_key - 1] = arguments[_key];\n    }\n    if (typeof cogId === \"string\") {\n      if (cogId.indexOf(\"cogId:\") === 0) {\n        cogId = cogId.replace(\"cogId:\", \"\");\n      } else {\n        args.unshift(cogId);\n        cogId = null;\n      }\n    }\n    stateFunctionExecuting = cogId ? `${name}:${cogId}` : name;\n    const result = value(...args);\n    stateFunctionExecuting = null;\n    return result;\n  };\n  const arrayProxyConstructor = (name, value, template) => new Proxy(value, {\n    get(target, propKey) {\n      const originalMethod = target[propKey];\n      if (propKey === \"push\") {\n        return function () {\n          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {\n            args[_key2] = arguments[_key2];\n          }\n          originalMethod.apply(target, args);\n          if (template) {\n            const cogId = stateFunctionExecuting?.split(\":\")[1];\n            if (!cogId) {\n              throw new Error(\"Can't use outside of a template\");\n            }\n            state._registerStateUpdate(Number(cogId), name);\n          } else {\n            state.value[name].computants.forEach(computant => {\n              state._registerGlobalStateUpdate(computant);\n            });\n            state._registerGlobalStateUpdate(name);\n          }\n          scheduleReRender();\n          return;\n        };\n      }\n      return originalMethod;\n    }\n  });\n  const variable = (name, value, template) => {\n    let fullStateName = name;\n    if (template) {\n      fullStateName = `${template}.${name}`;\n    }\n    if (value instanceof Function) {\n      value = getFunctionValue(fullStateName, value);\n    }\n    if (template) {\n      state.initializeTemplateState(template, name, value, Array.isArray(value) ? arrayProxyConstructor : undefined);\n    } else {\n      if (Array.isArray(value)) {\n        value = arrayProxyConstructor(name, value, \"\");\n      }\n      state.initializeGlobalState(name, value);\n    }\n    return {\n      get value() {\n        if (template) {\n          const parts = stateFunctionExecuting?.split(\":\") || [];\n          const elementId = parts[1] ? Number(parts[1]) : null;\n          if (elementId === null) {\n            throw new Error(`Can't use outside of a template: ${name} (for ${template})`);\n          }\n          const callerParts = parts[0].split(\".\");\n          const callerTemplate = callerParts[0];\n          const functionName = callerParts[1];\n          if (callerTemplate !== template) {\n            throw new Error(`Can't use from another template: ${name} (for ${template}, used in ${callerTemplate})`);\n          }\n          const stateValue = state.getTemplateState(template).customElements[elementId][name];\n          if (functionName && stateValue.computants.indexOf(functionName) === -1) {\n            stateValue.computants.push(functionName);\n          }\n          return stateValue.value;\n        }\n        if (stateFunctionExecuting !== null && state.value[name].computants.indexOf(stateFunctionExecuting) === -1) {\n          state.value[name].computants.push(stateFunctionExecuting);\n        }\n        return state.value[name].value;\n      },\n      set value(newVal) {\n        if (template) {\n          const cogId = stateFunctionExecuting?.split(\":\")[1];\n          if (!cogId) {\n            throw new Error(\"Can't use outside of a template\");\n          }\n          state.updateTemplateState(template, Number(cogId), name, newVal);\n        } else {\n          state.updateGlobalState(name, newVal);\n        }\n        scheduleReRender();\n      },\n      set: newVal => {\n        if (template) {\n          const cogId = stateFunctionExecuting?.split(\":\")[1];\n          if (!cogId) {\n            throw new Error(\"Can't use outside of a template\");\n          }\n          state.updateTemplateState(template, Number(cogId), name, newVal);\n        } else {\n          state.updateGlobalState(name, newVal);\n        }\n        scheduleReRender();\n      }\n    };\n  };\n  return {\n    render,\n    variable\n  };\n};\nconst {\n  variable,\n  render\n} = init();\n\n//# sourceURL=webpack://Cog/./src/cog.ts?");

/***/ }),

/***/ "./src/createReactiveNodes.ts":
/*!************************************!*\
  !*** ./src/createReactiveNodes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createReactiveNodes: () => (/* binding */ createReactiveNodes)\n/* harmony export */ });\nfunction createReactiveNodes() {\n  return {\n    lastId: 0,\n    list: [],\n    index: {},\n    get value() {\n      return this.list;\n    },\n    get(id) {\n      return this.list[this.index[id]];\n    },\n    add(item) {\n      this.list.push(item);\n      this.index[item.id] = this.list.length - 1;\n    },\n    update(id, property, value) {\n      this.list[this.index[id]][property] = value;\n    },\n    remove(id) {\n      const index = this.index[id];\n      this.list.splice(index, 1);\n      this.index = this.list.reduce((index, item, i) => {\n        index[item.id] = i;\n        return index;\n      }, {});\n    },\n    id() {\n      return this.lastId++;\n    },\n    new(id, parentId, attributes, templateName) {\n      let expressions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];\n      let template = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : \"\";\n      let element = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;\n      let lastTemplateEvaluation = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;\n      let shouldUpdate = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : false;\n      let newAttributes = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : [];\n      return {\n        id,\n        parentId,\n        element,\n        template,\n        lastTemplateEvaluation,\n        attributes,\n        expressions,\n        templateName,\n        shouldUpdate,\n        newAttributes\n      };\n    }\n  };\n}\n\n//# sourceURL=webpack://Cog/./src/createReactiveNodes.ts?");

/***/ }),

/***/ "./src/createState.ts":
/*!****************************!*\
  !*** ./src/createState.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createState: () => (/* binding */ createState)\n/* harmony export */ });\nfunction createState() {\n  return {\n    state: null,\n    templates: null,\n    updatedElements: [],\n    elementsUpdatedKeys: {},\n    get value() {\n      if (!this.state) {\n        this.state = {};\n      }\n      return this.state;\n    },\n    getTemplateState(template) {\n      if (!this.templates) {\n        this.templates = {};\n      }\n      return this.templates[template];\n    },\n    registerTemplateState(template, elementId) {\n      if (this.templates && this.templates[template]) {\n        this.templates[template].customElements[elementId] = {};\n        for (let i = 0; i < this.templates[template].keys.length; i++) {\n          const stateKey = this.templates[template].keys[i];\n          let value = this.templates[template].initial[stateKey].value;\n          const proxy = this.templates[template].initial[stateKey].proxy;\n          if (proxy) {\n            value = proxy(stateKey, value.slice(0), template);\n          }\n          if (value instanceof Function) {\n            const originalFunction = value;\n            value = function () {\n              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n                args[_key] = arguments[_key];\n              }\n              return originalFunction(...args, `cogId:${elementId}`);\n            };\n          }\n          this.templates[template].customElements[elementId][stateKey] = {\n            value: value,\n            dependents: [],\n            computants: [],\n            dependencies: []\n          };\n        }\n      }\n    },\n    initializeTemplateState(template, stateKey, value, proxy) {\n      if (!this.templates) {\n        this.templates = {};\n      }\n      if (!this.templates[template]) {\n        this.templates[template] = {\n          keys: [],\n          initial: {},\n          customElements: {}\n        };\n      }\n      this.templates[template].initial[stateKey] = {\n        value,\n        proxy\n      };\n      this.templates[template].keys.push(stateKey);\n    },\n    updateTemplateState(template, elementId, stateKey, value) {\n      this.templates[template].customElements[elementId][stateKey].value = value;\n      this.templates[template].customElements[elementId][stateKey].computants.forEach(computant => {\n        this._registerStateUpdate(elementId, computant);\n      });\n      this._registerStateUpdate(elementId, stateKey);\n    },\n    initializeGlobalState(stateKey, value) {\n      if (!this.state) {\n        this.state = {};\n      }\n      if (!this.state[stateKey]) {\n        this.state[stateKey] = {\n          value,\n          dependents: [],\n          computants: [],\n          dependencies: []\n        };\n      } else {\n        this.state[stateKey].value = value;\n      }\n    },\n    updateGlobalState(stateKey, value) {\n      this.state[stateKey].value = value;\n      this.value[stateKey].computants.forEach(computant => {\n        this._registerGlobalStateUpdate(computant);\n      });\n      this._registerGlobalStateUpdate(stateKey);\n    },\n    _registerGlobalStateUpdate(stateKey) {\n      const parts = stateKey.split(\".\");\n\n      // If computant is a template state\n      if (parts.length > 1) {\n        const temp = parts[1].split(\":\");\n        const _stateKey = temp[0];\n        const elementId = Number(temp[1]);\n        this._registerStateUpdate(elementId, _stateKey);\n        return;\n      }\n      this.value[stateKey].dependents.forEach(dependent => {\n        this._registerStateUpdate(dependent, stateKey);\n      });\n    },\n    _registerStateUpdate(elementId, stateKey) {\n      if (this.updatedElements.indexOf(elementId) === -1) {\n        this.updatedElements.push(elementId);\n        this.elementsUpdatedKeys[elementId] = [];\n      }\n      if (this.elementsUpdatedKeys[elementId].indexOf(stateKey) === -1) {\n        this.elementsUpdatedKeys[elementId].push(stateKey);\n      }\n    },\n    clearUpdates() {\n      this.updatedElements = [];\n      this.elementsUpdatedKeys = {};\n    }\n  };\n}\n\n//# sourceURL=webpack://Cog/./src/createState.ts?");

/***/ }),

/***/ "./src/eventListeners/addAllEventListeners.ts":
/*!****************************************************!*\
  !*** ./src/eventListeners/addAllEventListeners.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addAllEventListeners: () => (/* binding */ addAllEventListeners)\n/* harmony export */ });\n/* harmony import */ var _addEventListeners__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addEventListeners */ \"./src/eventListeners/addEventListeners.ts\");\n\nfunction addAllEventListeners(parent, state) {\n  (0,_addEventListeners__WEBPACK_IMPORTED_MODULE_0__.addEventListeners)(parent, \"click\", state);\n  (0,_addEventListeners__WEBPACK_IMPORTED_MODULE_0__.addEventListeners)(parent, \"change\", state);\n}\n\n//# sourceURL=webpack://Cog/./src/eventListeners/addAllEventListeners.ts?");

/***/ }),

/***/ "./src/eventListeners/addEventListeners.ts":
/*!*************************************************!*\
  !*** ./src/eventListeners/addEventListeners.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addEventListeners: () => (/* binding */ addEventListeners)\n/* harmony export */ });\n/* harmony import */ var _makeEventHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./makeEventHandler */ \"./src/eventListeners/makeEventHandler.ts\");\n\nfunction addEventListeners(parent, eventName, state) {\n  parent.querySelectorAll(`[data-on-${eventName}]`).forEach(element => {\n    const handler = (0,_makeEventHandler__WEBPACK_IMPORTED_MODULE_0__.makeEventHandler)(eventName, element, state);\n    element.addEventListener(eventName, handler);\n    element[`${eventName}Handler`] = handler;\n  });\n}\n\n//# sourceURL=webpack://Cog/./src/eventListeners/addEventListeners.ts?");

/***/ }),

/***/ "./src/eventListeners/makeEventHandler.ts":
/*!************************************************!*\
  !*** ./src/eventListeners/makeEventHandler.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   makeEventHandler: () => (/* binding */ makeEventHandler)\n/* harmony export */ });\n/* harmony import */ var _expressions_createExpressionScope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expressions/createExpressionScope */ \"./src/expressions/createExpressionScope.ts\");\n\nconst makeEventHandler = (eventName, element, state) => {\n  const handler = element.getAttribute(`data-on-${eventName}`);\n  if (!handler) {\n    throw new Error(\"Missing data-handler attribute\");\n  }\n  const handlerWithScope = (0,_expressions_createExpressionScope__WEBPACK_IMPORTED_MODULE_0__.createExpressionScope)(handler, state);\n  return function (e) {\n    try {\n      handlerWithScope(state);\n      e.preventDefault();\n    } catch (e) {\n      throw new Error(`${e.message}: data-on-${eventName}=${handler}`);\n    }\n  };\n};\n\n//# sourceURL=webpack://Cog/./src/eventListeners/makeEventHandler.ts?");

/***/ }),

/***/ "./src/eventListeners/removeAllEventListeners.ts":
/*!*******************************************************!*\
  !*** ./src/eventListeners/removeAllEventListeners.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   removeAllEventListeners: () => (/* binding */ removeAllEventListeners)\n/* harmony export */ });\n/* harmony import */ var _removeEventListeners__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./removeEventListeners */ \"./src/eventListeners/removeEventListeners.ts\");\n\nfunction removeAllEventListeners(parent) {\n  (0,_removeEventListeners__WEBPACK_IMPORTED_MODULE_0__.removeEventListeners)(parent, \"click\");\n  (0,_removeEventListeners__WEBPACK_IMPORTED_MODULE_0__.removeEventListeners)(parent, \"change\");\n}\n\n//# sourceURL=webpack://Cog/./src/eventListeners/removeAllEventListeners.ts?");

/***/ }),

/***/ "./src/eventListeners/removeEventListeners.ts":
/*!****************************************************!*\
  !*** ./src/eventListeners/removeEventListeners.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   removeEventListeners: () => (/* binding */ removeEventListeners)\n/* harmony export */ });\nfunction removeEventListeners(parent, eventName) {\n  parent.querySelectorAll(`[data-on-${eventName}]`).forEach(element => {\n    const handler = element[`${eventName}Handler`];\n    if (handler) {\n      element.removeEventListener(eventName, handler);\n    }\n  });\n}\n\n//# sourceURL=webpack://Cog/./src/eventListeners/removeEventListeners.ts?");

/***/ }),

/***/ "./src/expressions/createExpressionScope.ts":
/*!**************************************************!*\
  !*** ./src/expressions/createExpressionScope.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createExpressionScope: () => (/* binding */ createExpressionScope)\n/* harmony export */ });\nconst functionCache = {};\nconst createExpressionScope = (expression, state) => {\n  const index = expression + JSON.stringify(Object.keys(state).join(\"\"));\n  if (!functionCache[index]) {\n    const functionBody = `return (state) => {${Object.keys(state).map(variable => `const ${variable} = state[\"${variable}\"].value;`).join(\"\\n\")} return ${expression}}`;\n    functionCache[index] = Function(functionBody)();\n  }\n  return functionCache[index];\n};\n\n//# sourceURL=webpack://Cog/./src/expressions/createExpressionScope.ts?");

/***/ }),

/***/ "./src/expressions/evaluateExpression.ts":
/*!***********************************************!*\
  !*** ./src/expressions/evaluateExpression.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   evaluateExpression: () => (/* binding */ evaluateExpression)\n/* harmony export */ });\nfunction evaluateExpression(expressionWithScope, state) {\n  let evaluated = expressionWithScope(state);\n  if (Array.isArray(evaluated)) {\n    evaluated = evaluated.join(\"\");\n  }\n  return evaluated;\n}\n\n//# sourceURL=webpack://Cog/./src/expressions/evaluateExpression.ts?");

/***/ }),

/***/ "./src/expressions/sanitizeExpression.ts":
/*!***********************************************!*\
  !*** ./src/expressions/sanitizeExpression.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   sanitizeExpression: () => (/* binding */ sanitizeExpression)\n/* harmony export */ });\nfunction sanitizeExpression(expression) {\n  return expression.replace(/[\\r\\n]+/g, \"\").trim();\n}\n\n//# sourceURL=webpack://Cog/./src/expressions/sanitizeExpression.ts?");

/***/ }),

/***/ "./src/html/evaluateTemplate.ts":
/*!**************************************!*\
  !*** ./src/html/evaluateTemplate.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   evaluateTemplate: () => (/* binding */ evaluateTemplate),\n/* harmony export */   extractTemplateExpressions: () => (/* binding */ extractTemplateExpressions)\n/* harmony export */ });\n/* harmony import */ var _expressions_createExpressionScope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../expressions/createExpressionScope */ \"./src/expressions/createExpressionScope.ts\");\n/* harmony import */ var _expressions_evaluateExpression__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../expressions/evaluateExpression */ \"./src/expressions/evaluateExpression.ts\");\n/* harmony import */ var _expressions_sanitizeExpression__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../expressions/sanitizeExpression */ \"./src/expressions/sanitizeExpression.ts\");\n/* harmony import */ var _html_removeTagsAndAttributeNames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../html/removeTagsAndAttributeNames */ \"./src/html/removeTagsAndAttributeNames.ts\");\n/* harmony import */ var _findNextTemplateExpression__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./findNextTemplateExpression */ \"./src/html/findNextTemplateExpression.ts\");\n/* harmony import */ var _htmlToText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./htmlToText */ \"./src/html/htmlToText.ts\");\n\n\n\n\n\n\nconst evaluateTemplate = function evaluateTemplate(template, expressions, state) {\n  let stateChanges = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];\n  let restOfContent = template;\n  let updatedContent = \"\";\n  for (let i = 0; i < expressions.length; i++) {\n    const {\n      start,\n      end,\n      value\n    } = expressions[i];\n    const before = restOfContent.slice(0, start);\n    const after = restOfContent.slice(end + 1);\n    let evaluated = expressions[i].evaluated;\n    const intersection = expressions[i].dependencies.filter(value => stateChanges.includes(value));\n    if (intersection.length || evaluated === null) {\n      const expressionWithScope = (0,_expressions_createExpressionScope__WEBPACK_IMPORTED_MODULE_0__.createExpressionScope)(value, state);\n      evaluated = (0,_expressions_evaluateExpression__WEBPACK_IMPORTED_MODULE_1__.evaluateExpression)(expressionWithScope, state);\n      expressions[i].evaluated = evaluated;\n    }\n    updatedContent += `${before}${evaluated}`;\n    restOfContent = after;\n  }\n  updatedContent += restOfContent;\n  return updatedContent;\n};\n\n/**\n * Extracts all template expressions from a template string.\n * start and end are relative to the last template expression.\n */\nconst extractTemplateExpressions = (template, state) => {\n  const expressions = [];\n  let restOfContent = String(template);\n  let hasTemplateExpression = true;\n  while (hasTemplateExpression) {\n    const {\n      start,\n      end\n    } = (0,_findNextTemplateExpression__WEBPACK_IMPORTED_MODULE_4__.findNextTemplateExpression)(restOfContent);\n    if (end === -1) {\n      hasTemplateExpression = false;\n      break;\n    }\n    const htmlValue = restOfContent.slice(start + 2, end - 1);\n    const after = restOfContent.slice(end + 1);\n    const value = (0,_expressions_sanitizeExpression__WEBPACK_IMPORTED_MODULE_2__.sanitizeExpression)((0,_htmlToText__WEBPACK_IMPORTED_MODULE_5__.htmlToText)(htmlValue));\n    const uniqueIndex = {};\n    const dependencies = new Set();\n    (0,_html_removeTagsAndAttributeNames__WEBPACK_IMPORTED_MODULE_3__.removeTagsAndAttributeNames)(value).split(\"@\").filter(wordFromExpression => uniqueIndex[wordFromExpression] ? false : uniqueIndex[wordFromExpression] = true).filter(wordFromExpression => state[wordFromExpression]).forEach(dependency => {\n      if (state[dependency].dependencies.length) {\n        state[dependency].dependencies.forEach(dep => dependencies.add(dep));\n      } else {\n        dependencies.add(dependency);\n      }\n    });\n    expressions.push({\n      start,\n      end,\n      value,\n      dependencies: Array.from(dependencies),\n      evaluated: null\n    });\n    restOfContent = after;\n  }\n  return expressions;\n};\n\n//# sourceURL=webpack://Cog/./src/html/evaluateTemplate.ts?");

/***/ }),

/***/ "./src/html/findNextTemplateExpression.ts":
/*!************************************************!*\
  !*** ./src/html/findNextTemplateExpression.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   findNextTemplateExpression: () => (/* binding */ findNextTemplateExpression)\n/* harmony export */ });\nfunction findNextTemplateExpression(htmlText) {\n  const start = htmlText.indexOf(\"{{\");\n  let stack = 0;\n  for (let i = start; i < htmlText.length; i++) {\n    if (htmlText[i] === \"{\" && htmlText[i + 1] === \"{\") {\n      stack++;\n      i++;\n    } else if (htmlText[i] === \"}\" && htmlText[i + 1] === \"}\") {\n      stack--;\n      i++;\n    }\n    if (stack === 0) {\n      return {\n        start,\n        end: i\n      };\n    }\n  }\n  return {\n    start,\n    end: -1\n  };\n}\n\n//# sourceURL=webpack://Cog/./src/html/findNextTemplateExpression.ts?");

/***/ }),

/***/ "./src/html/htmlToText.ts":
/*!********************************!*\
  !*** ./src/html/htmlToText.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   htmlToText: () => (/* binding */ htmlToText)\n/* harmony export */ });\nfunction escapeHtml(html) {\n  return html.replace(/<(?=[^<>]*>)/g, \"&lt;\").replace(/(?<=[^<>]*)>/g, \"&gt;\");\n}\nfunction htmlToText(html) {\n  const tmp = document.createElement(\"div\");\n  tmp.innerHTML = escapeHtml(html);\n  return tmp.textContent || tmp.innerText || \"\";\n}\n\n//# sourceURL=webpack://Cog/./src/html/htmlToText.ts?");

/***/ }),

/***/ "./src/html/removeTagsAndAttributeNames.ts":
/*!*************************************************!*\
  !*** ./src/html/removeTagsAndAttributeNames.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   removeTagsAndAttributeNames: () => (/* binding */ removeTagsAndAttributeNames)\n/* harmony export */ });\nconst tagRegex = /<\\/?[\\w-]+/g;\nconst attrRegex = /[\\w-]+(\\s*=\\s*(\"|')[^\"']*(\"|'))/g;\nconst specialCharRegex = /[^\\w\\s]/g;\nconst spaceRegex = /\\s+/g;\nfunction removeTagsAndAttributeNames(htmlString) {\n  return htmlString.replace(tagRegex, \"\").replace(attrRegex, \"$1\").replace(specialCharRegex, \" \").trim().replace(spaceRegex, \"@\");\n}\n\n//# sourceURL=webpack://Cog/./src/html/removeTagsAndAttributeNames.ts?");

/***/ }),

/***/ "./src/html/sanitizeHtml.ts":
/*!**********************************!*\
  !*** ./src/html/sanitizeHtml.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   sanitizeHtml: () => (/* binding */ sanitizeHtml)\n/* harmony export */ });\nconst sanitizeHtml = html => {\n  return html.replace(/[\\r\\n]+\\s*/g, \"\");\n};\n\n//# sourceURL=webpack://Cog/./src/html/sanitizeHtml.ts?");

/***/ }),

/***/ "./src/nodes/compareNodes.ts":
/*!***********************************!*\
  !*** ./src/nodes/compareNodes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   compareChildNodes: () => (/* binding */ compareChildNodes),\n/* harmony export */   compareCustomElementChildren: () => (/* binding */ compareCustomElementChildren),\n/* harmony export */   compareNodes: () => (/* binding */ compareNodes),\n/* harmony export */   compareTextNodes: () => (/* binding */ compareTextNodes)\n/* harmony export */ });\n/* harmony import */ var _attributes_getChangedAttributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../attributes/getChangedAttributes */ \"./src/attributes/getChangedAttributes.ts\");\n/* harmony import */ var _isCustomElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isCustomElement */ \"./src/nodes/isCustomElement.ts\");\n\n\nfunction compareTextNodes(oldNode, newNode) {\n  if (oldNode.textContent !== newNode.textContent) {\n    return [{\n      node: newNode,\n      content: newNode.textContent\n    }];\n  }\n  return [];\n}\nfunction compareChildNodes(oldNode, newNode) {\n  const toBeRemoved = [];\n  const toBeAdded = [];\n  const nodesLength = Math.max(oldNode.childNodes.length, newNode.childNodes.length);\n  let changedChildren = [];\n  for (let i = 0; i < nodesLength; i++) {\n    const oldChild = oldNode.childNodes[i];\n    const newChild = newNode.childNodes[i];\n    if (oldChild?.nodeType === Node.TEXT_NODE && newChild?.nodeType === Node.TEXT_NODE) {\n      if (oldChild.textContent?.trim() !== newChild.textContent?.trim()) {\n        return [{\n          node: newNode,\n          content: newNode.innerHTML\n        }];\n      }\n    } else if (!oldChild) {\n      toBeAdded.push(newChild);\n    } else if (!newChild) {\n      toBeRemoved.push(oldChild);\n    } else {\n      changedChildren = changedChildren.concat(compareNodes(oldChild, newChild));\n    }\n  }\n  if (toBeRemoved.length) {\n    changedChildren.push({\n      node: newNode,\n      toBeRemoved\n    });\n  }\n  if (toBeAdded.length) {\n    changedChildren.push({\n      node: newNode,\n      toBeAdded\n    });\n  }\n  return changedChildren;\n}\nfunction compareCustomElementChildren(oldElement, newElement) {\n  if (oldElement.innerHTML !== newElement.innerHTML) {\n    return [{\n      node: newElement,\n      content: newElement.innerHTML\n    }];\n  }\n  return [];\n}\nfunction compareNodes(oldNode, newNode) {\n  if (oldNode.nodeType === Node.TEXT_NODE) {\n    return compareTextNodes(oldNode, newNode);\n  }\n  const changedAttributes = (0,_attributes_getChangedAttributes__WEBPACK_IMPORTED_MODULE_0__.getChangedAttributes)(oldNode, newNode);\n  const changedChildren = changedAttributes.length > 0 ? [{\n    node: newNode,\n    attributes: changedAttributes\n  }] : [];\n  if ((0,_isCustomElement__WEBPACK_IMPORTED_MODULE_1__.isCustomElement)(oldNode)) {\n    return changedChildren.concat(compareCustomElementChildren(oldNode, newNode));\n  }\n  return changedChildren.concat(compareChildNodes(oldNode, newNode));\n}\n\n//# sourceURL=webpack://Cog/./src/nodes/compareNodes.ts?");

/***/ }),

/***/ "./src/nodes/elementFromString.ts":
/*!****************************************!*\
  !*** ./src/nodes/elementFromString.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   elementFromString: () => (/* binding */ elementFromString)\n/* harmony export */ });\nfunction elementFromString(htmlString) {\n  const parser = new DOMParser();\n  const newElementDoc = parser.parseFromString(htmlString, \"text/html\");\n  return newElementDoc.body.firstChild;\n}\n\n//# sourceURL=webpack://Cog/./src/nodes/elementFromString.ts?");

/***/ }),

/***/ "./src/nodes/findCorrespondingNode.ts":
/*!********************************************!*\
  !*** ./src/nodes/findCorrespondingNode.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   findCorrespondingNode: () => (/* binding */ findCorrespondingNode)\n/* harmony export */ });\nfunction findCorrespondingNode(nodeInA, rootA, rootB) {\n  const pathInA = [];\n  let temp = nodeInA;\n  while (temp !== rootA) {\n    pathInA.unshift(Array.prototype.indexOf.call(temp.parentNode.childNodes, temp));\n    temp = temp.parentNode;\n  }\n  let correspondingNodeInB = rootB;\n  for (let i = 0; i < pathInA.length; i++) {\n    const index = pathInA[i];\n    if (correspondingNodeInB.childNodes[index]) {\n      correspondingNodeInB = correspondingNodeInB.childNodes[index];\n    } else {\n      return null;\n    }\n  }\n  return correspondingNodeInB;\n}\n\n//# sourceURL=webpack://Cog/./src/nodes/findCorrespondingNode.ts?");

/***/ }),

/***/ "./src/nodes/findNodes.ts":
/*!********************************!*\
  !*** ./src/nodes/findNodes.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   findNodes: () => (/* binding */ findNodes),\n/* harmony export */   findReactiveNodes: () => (/* binding */ findReactiveNodes)\n/* harmony export */ });\n/* harmony import */ var _isCustomElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isCustomElement */ \"./src/nodes/isCustomElement.ts\");\n\nfunction findNodes(rootElement, xpath) {\n  let check = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : () => true;\n  const elements = [];\n  const result = document.evaluate(xpath, rootElement, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);\n  let element = result.iterateNext();\n  while (element) {\n    if (check(element)) {\n      elements.push(element);\n    }\n    element = result.iterateNext();\n  }\n  return elements;\n}\nconst findReactiveNodes = rootElement => {\n  const elements = findNodes(rootElement, \"self::*[text()[contains(., '{{')] and text()[contains(., '}}')]] | self::*[@*[contains(., '{{') and contains(., '}}')]] | .//*[text()[contains(., '{{')] and text()[contains(., '}}')]] | .//*[@*[contains(., '{{') and contains(., '}}')]]\", element => !(0,_isCustomElement__WEBPACK_IMPORTED_MODULE_0__.isCustomElement)(element));\n  return elements;\n};\n\n//# sourceURL=webpack://Cog/./src/nodes/findNodes.ts?");

/***/ }),

/***/ "./src/nodes/isCustomElement.ts":
/*!**************************************!*\
  !*** ./src/nodes/isCustomElement.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isCustomElement: () => (/* binding */ isCustomElement)\n/* harmony export */ });\nconst isCustomElement = element => {\n  return element.nodeType !== Node.TEXT_NODE && element.tagName.indexOf(\"-\") !== -1;\n};\n\n//# sourceURL=webpack://Cog/./src/nodes/isCustomElement.ts?");

/***/ }),

/***/ "./src/nodes/reconcile.ts":
/*!********************************!*\
  !*** ./src/nodes/reconcile.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   reconcile: () => (/* binding */ reconcile)\n/* harmony export */ });\n/* harmony import */ var _eventListeners_addAllEventListeners__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../eventListeners/addAllEventListeners */ \"./src/eventListeners/addAllEventListeners.ts\");\n/* harmony import */ var _eventListeners_removeAllEventListeners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../eventListeners/removeAllEventListeners */ \"./src/eventListeners/removeAllEventListeners.ts\");\n/* harmony import */ var _attributes_convertAttributeName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../attributes/convertAttributeName */ \"./src/attributes/convertAttributeName.ts\");\n/* harmony import */ var _attributes_getLocalState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../attributes/getLocalState */ \"./src/attributes/getLocalState.ts\");\n/* harmony import */ var _attributes_handleBooleanAttribute__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../attributes/handleBooleanAttribute */ \"./src/attributes/handleBooleanAttribute.ts\");\n/* harmony import */ var _html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../html/evaluateTemplate */ \"./src/html/evaluateTemplate.ts\");\n/* harmony import */ var _compareNodes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./compareNodes */ \"./src/nodes/compareNodes.ts\");\n/* harmony import */ var _elementFromString__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./elementFromString */ \"./src/nodes/elementFromString.ts\");\n/* harmony import */ var _findCorrespondingNode__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./findCorrespondingNode */ \"./src/nodes/findCorrespondingNode.ts\");\n/* harmony import */ var _isCustomElement__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./isCustomElement */ \"./src/nodes/isCustomElement.ts\");\n\n\n\n\n\n\n\n\n\n\nfunction mergeAttributes(oldArray, newArray) {\n  const merged = oldArray.concat(newArray);\n  const attributes = {};\n  for (let i = 0; i < merged.length; i++) {\n    attributes[merged[i].name] = merged[i];\n  }\n  return Object.values(attributes);\n}\nfunction updateCustomElement(originalNode, content, attributes, reactiveNodes, state, updatedKeys) {\n  const changedAttributes = attributes?.slice() ?? [];\n  const newAttributes = [];\n  changedAttributes.forEach(attribute => {\n    newAttributes.push({\n      name: attribute.name,\n      value: attribute.newValue,\n      expressions: [],\n      reactive: false,\n      dependents: []\n    });\n  });\n  if (content !== undefined) {\n    newAttributes.push({\n      name: \"children\",\n      value: content,\n      expressions: [],\n      reactive: false,\n      dependents: []\n    });\n  }\n  if (newAttributes.length) {\n    const reactiveNode = reactiveNodes.get(originalNode.cogAnchorId);\n    if (reactiveNode.element !== null) {\n      reconcileReactiveNode(reactiveNode, reactiveNodes, newAttributes, state, updatedKeys);\n    } else {\n      const attributesDependents = {};\n      for (let i = 0; i < reactiveNode.attributes.length; i++) {\n        const attribute = reactiveNode.attributes[i];\n        if (attribute.dependents && attribute.dependents.length) {\n          attributesDependents[attribute.name] = attribute.dependents;\n        }\n      }\n      for (let i = 0; i < newAttributes.length; i++) {\n        const attributeDependents = attributesDependents[newAttributes[i].name];\n        for (let j = 0; j < attributeDependents.length; j++) {\n          const _reactiveNode = reactiveNodes.get(attributeDependents[j]);\n          reconcileReactiveNode(_reactiveNode, reactiveNodes, newAttributes, state, updatedKeys);\n        }\n      }\n    }\n  }\n}\nfunction reconcileReactiveNode(reactiveNode, reactiveNodes, newAttributes, state, updatedKeys) {\n  const mergedAttributes = mergeAttributes(reactiveNode.attributes, newAttributes);\n  reactiveNode.attributes = mergedAttributes;\n  reactiveNode.newAttributes = reactiveNode.attributes.map(a => (0,_attributes_convertAttributeName__WEBPACK_IMPORTED_MODULE_2__.convertAttributeName)(a.name));\n  reconcile(reactiveNodes, reactiveNode, state, updatedKeys);\n}\nfunction handleContentChange(originalNode, content, localState) {\n  if (originalNode.nodeType === Node.TEXT_NODE) {\n    originalNode.textContent = content;\n  } else {\n    (0,_eventListeners_removeAllEventListeners__WEBPACK_IMPORTED_MODULE_1__.removeAllEventListeners)(originalNode);\n    originalNode.innerHTML = content;\n    (0,_eventListeners_addAllEventListeners__WEBPACK_IMPORTED_MODULE_0__.addAllEventListeners)(originalNode, localState);\n  }\n}\nfunction handleAttributeChange(originalNode, attributes) {\n  for (let i = 0; i < attributes.length; i++) {\n    (0,_attributes_handleBooleanAttribute__WEBPACK_IMPORTED_MODULE_4__.handleBooleanAttribute)(originalNode, attributes[i]);\n    originalNode.setAttribute(attributes[i].name, attributes[i].newValue);\n  }\n}\nfunction handleChildrenAddition(originalNode, addChildren) {\n  const fragment = document.createDocumentFragment();\n  for (let i = 0; i < addChildren.length; i++) {\n    fragment.appendChild(addChildren[i]);\n  }\n  originalNode.appendChild(fragment);\n}\nfunction handleChildrenRemoval(removeChildren, reactiveNodes) {\n  const fragment = document.createDocumentFragment();\n  for (let i = 0; i < removeChildren.length; i++) {\n    if (removeChildren[i].cogAnchorId) {\n      reactiveNodes.remove(removeChildren[i].cogAnchorId);\n    }\n    fragment.appendChild(removeChildren[i]);\n  }\n  fragment.textContent = \"\";\n}\nfunction handleNodeChanges(changedNodes, oldElement, newElement, element, localState, reactiveNodes, state, updatedKeys) {\n  for (let i = 0; i < changedNodes.length; i++) {\n    const change = changedNodes[i];\n    const originalNode = (0,_findCorrespondingNode__WEBPACK_IMPORTED_MODULE_8__.findCorrespondingNode)(change.node, newElement, element);\n    if ((0,_isCustomElement__WEBPACK_IMPORTED_MODULE_9__.isCustomElement)(change.node)) {\n      updateCustomElement(originalNode, change.content, change.attributes, reactiveNodes, state, updatedKeys);\n    } else {\n      const {\n        addChildren,\n        removeChildren\n      } = handleChildrenChanges(change, oldElement, element);\n      if (change.content !== undefined) {\n        handleContentChange(originalNode, change.content, localState);\n      } else if (change.attributes !== undefined) {\n        handleAttributeChange(originalNode, change.attributes);\n      } else if (addChildren.length) {\n        handleChildrenAddition(originalNode, addChildren);\n      } else if (removeChildren.length) {\n        handleChildrenRemoval(removeChildren, reactiveNodes);\n      }\n    }\n  }\n}\nfunction handleChildrenChanges(changedNode, oldElement, element) {\n  const removeChildren = [];\n  let addChildren = [];\n  if (changedNode.toBeAdded !== undefined) {\n    addChildren = changedNode.toBeAdded;\n  }\n  if (changedNode.toBeRemoved !== undefined) {\n    for (let i = 0; i < changedNode.toBeRemoved.length; i++) {\n      const child = (0,_findCorrespondingNode__WEBPACK_IMPORTED_MODULE_8__.findCorrespondingNode)(changedNode.toBeRemoved[i], oldElement, element);\n      if (child) {\n        removeChildren.push(child);\n      }\n    }\n  }\n  return {\n    addChildren,\n    removeChildren\n  };\n}\nconst reconcile = (reactiveNodes, reactiveNode, state, stateChanges) => {\n  const localStateChanges = stateChanges.concat(reactiveNode.newAttributes);\n  let completeState = state.value;\n  if (state.templates && reactiveNode.templateName && state.templates[reactiveNode.templateName]) {\n    const templateState = state.templates[reactiveNode.templateName].customElements[reactiveNode.id];\n    completeState = Object.assign({}, state.value, templateState);\n  }\n  reactiveNode.newAttributes = [];\n  const localState = (0,_attributes_getLocalState__WEBPACK_IMPORTED_MODULE_3__.getLocalState)(reactiveNode.parentId, reactiveNode.attributes, completeState, reactiveNodes.list, localStateChanges);\n  const updatedContent = (0,_html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_5__.evaluateTemplate)(reactiveNode.template, reactiveNode.expressions, localState, localStateChanges);\n  const oldElement = reactiveNode.lastTemplateEvaluation.cloneNode(true);\n  const newElement = (0,_elementFromString__WEBPACK_IMPORTED_MODULE_7__.elementFromString)(updatedContent);\n  const changedNodes = (0,_compareNodes__WEBPACK_IMPORTED_MODULE_6__.compareNodes)(oldElement, newElement);\n  if (changedNodes.length > 0) {\n    reactiveNode.lastTemplateEvaluation = newElement.cloneNode(true);\n    handleNodeChanges(changedNodes, oldElement, newElement, reactiveNode.element, localState, reactiveNodes, state, stateChanges);\n  }\n};\n\n//# sourceURL=webpack://Cog/./src/nodes/reconcile.ts?");

/***/ }),

/***/ "./src/nodes/registerNativeElements.ts":
/*!*********************************************!*\
  !*** ./src/nodes/registerNativeElements.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   registerNativeElements: () => (/* binding */ registerNativeElements)\n/* harmony export */ });\n/* harmony import */ var _attributes_getChangedAttributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../attributes/getChangedAttributes */ \"./src/attributes/getChangedAttributes.ts\");\n/* harmony import */ var _attributes_handleBooleanAttribute__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../attributes/handleBooleanAttribute */ \"./src/attributes/handleBooleanAttribute.ts\");\n/* harmony import */ var _findNodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./findNodes */ \"./src/nodes/findNodes.ts\");\n/* harmony import */ var _registerReactiveNode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./registerReactiveNode */ \"./src/nodes/registerReactiveNode.ts\");\n\n\n\n\nconst registerNativeElements = (rootElement, state, reactiveNodes) => {\n  const elements = (0,_findNodes__WEBPACK_IMPORTED_MODULE_2__.findReactiveNodes)(rootElement);\n  for (let i = 0; i < elements.length; i++) {\n    const elementId = reactiveNodes.id();\n    const element = elements[i];\n    element.innerHTML = element.innerHTML.trim();\n    const template = element.outerHTML;\n    const newElement = (0,_registerReactiveNode__WEBPACK_IMPORTED_MODULE_3__.registerReactiveNode)(elementId, reactiveNodes, element, template, state);\n    const attributes = (0,_attributes_getChangedAttributes__WEBPACK_IMPORTED_MODULE_0__.getChangedAttributes)(element, newElement);\n    for (let _i = 0; _i < attributes.length; _i++) {\n      (0,_attributes_handleBooleanAttribute__WEBPACK_IMPORTED_MODULE_1__.handleBooleanAttribute)(newElement, attributes[_i]);\n    }\n  }\n};\n\n//# sourceURL=webpack://Cog/./src/nodes/registerNativeElements.ts?");

/***/ }),

/***/ "./src/nodes/registerReactiveNode.ts":
/*!*******************************************!*\
  !*** ./src/nodes/registerReactiveNode.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   assignDependents: () => (/* binding */ assignDependents),\n/* harmony export */   registerReactiveNode: () => (/* binding */ registerReactiveNode)\n/* harmony export */ });\n/* harmony import */ var _attributes_convertAttributeName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../attributes/convertAttributeName */ \"./src/attributes/convertAttributeName.ts\");\n/* harmony import */ var _eventListeners_addAllEventListeners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../eventListeners/addAllEventListeners */ \"./src/eventListeners/addAllEventListeners.ts\");\n/* harmony import */ var _html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../html/evaluateTemplate */ \"./src/html/evaluateTemplate.ts\");\n/* harmony import */ var _elementFromString__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elementFromString */ \"./src/nodes/elementFromString.ts\");\n\n\n\n\nfunction assignDependents(elementId, expressions, state, attributes) {\n  expressions.map(expression => {\n    expression.dependencies.forEach(dependency => {\n      if (state[dependency].dependents.indexOf(elementId) === -1) {\n        state[dependency].dependents.push(elementId);\n      }\n      const attribute = attributes.find(attribute => (0,_attributes_convertAttributeName__WEBPACK_IMPORTED_MODULE_0__.convertAttributeName)(attribute.name) === dependency);\n      if (attribute) {\n        if (!attribute.dependents) {\n          attribute.dependents = [];\n        }\n        if (attribute.dependents.indexOf(elementId) === -1) {\n          attribute.dependents.push(elementId);\n        }\n      }\n    });\n  });\n}\nfunction registerReactiveNode(elementId, reactiveNodes, originalElement, template, state) {\n  let attributes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];\n  let parentId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;\n  let templateName = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;\n  const refinedTemplate = template.replace(/>\\s*([\\s\\S]*?)\\s*</g, \">$1<\");\n  const expressions = (0,_html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_2__.extractTemplateExpressions)(refinedTemplate, state);\n  const updatedContent = (0,_html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_2__.evaluateTemplate)(refinedTemplate, expressions, state, []);\n  const element = (0,_elementFromString__WEBPACK_IMPORTED_MODULE_3__.elementFromString)(updatedContent);\n  assignDependents(elementId, expressions, state, attributes);\n  reactiveNodes.add(reactiveNodes.new(elementId, parentId, attributes, templateName, expressions, refinedTemplate, element, element.cloneNode(true)));\n  console.log(element);\n  originalElement.parentElement?.appendChild(element);\n  if (element.nodeType !== Node.TEXT_NODE) {\n    (0,_eventListeners_addAllEventListeners__WEBPACK_IMPORTED_MODULE_1__.addAllEventListeners)(element.parentElement, state);\n  }\n  return element;\n}\n\n//# sourceURL=webpack://Cog/./src/nodes/registerReactiveNode.ts?");

/***/ }),

/***/ "./src/nodes/registerTemplates.ts":
/*!****************************************!*\
  !*** ./src/nodes/registerTemplates.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   registerTemplates: () => (/* binding */ registerTemplates)\n/* harmony export */ });\n/* harmony import */ var _attributes_attributesToState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../attributes/attributesToState */ \"./src/attributes/attributesToState.ts\");\n/* harmony import */ var _attributes_getAttributes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../attributes/getAttributes */ \"./src/attributes/getAttributes.ts\");\n/* harmony import */ var _attributes_getLocalState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../attributes/getLocalState */ \"./src/attributes/getLocalState.ts\");\n/* harmony import */ var _html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../html/evaluateTemplate */ \"./src/html/evaluateTemplate.ts\");\n/* harmony import */ var _html_sanitizeHtml__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../html/sanitizeHtml */ \"./src/html/sanitizeHtml.ts\");\n/* harmony import */ var _elementFromString__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./elementFromString */ \"./src/nodes/elementFromString.ts\");\n/* harmony import */ var _findNodes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./findNodes */ \"./src/nodes/findNodes.ts\");\n/* harmony import */ var _registerReactiveNode__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./registerReactiveNode */ \"./src/nodes/registerReactiveNode.ts\");\n\n\n\n\n\n\n\n\nfunction registerTemplates(rootElement, state, reactiveNodes) {\n  const templates = (0,_findNodes__WEBPACK_IMPORTED_MODULE_6__.findNodes)(rootElement, \"template\");\n  const fragment = document.createDocumentFragment();\n  for (let i = 0; i < templates.length; i++) {\n    const name = templates[i].getAttribute(\"id\");\n    if (name) {\n      templates[i].innerHTML = (0,_html_sanitizeHtml__WEBPACK_IMPORTED_MODULE_4__.sanitizeHtml)(templates[i].innerHTML);\n      if (templates[i].content.children.length !== 1) {\n        throw new Error(`Template ${name} should have a single HTML Element child`);\n      }\n      defineCustomElement(name, templates[i], state, reactiveNodes);\n      fragment.appendChild(templates[i]);\n    }\n  }\n  fragment.textContent = \"\";\n}\nfunction defineCustomElement(name, template, state, reactiveNodes) {\n  function CustomElement() {\n    return Reflect.construct(HTMLElement, [], CustomElement);\n  }\n  CustomElement.prototype = Object.create(HTMLElement.prototype);\n  CustomElement.prototype.constructor = CustomElement;\n  CustomElement.prototype.connectedCallback = registerCustomElement(template, state, reactiveNodes);\n  customElements.define(name, CustomElement);\n}\nfunction addParentId(element, parentId) {\n  if (element.tagName.includes(\"-\")) {\n    element.setAttribute(\"data-parent-id\", String(parentId));\n  }\n}\nfunction addParentIdToChildren(template, parentId) {\n  const newElement = (0,_elementFromString__WEBPACK_IMPORTED_MODULE_5__.elementFromString)(template);\n  if (newElement.nodeType !== Node.TEXT_NODE) {\n    addParentId(newElement, parentId);\n    const childElements = newElement.querySelectorAll(\"*\");\n    for (let i = 0; i < childElements.length; i++) {\n      const child = childElements[i];\n      addParentId(child, parentId);\n    }\n  }\n  let refinedTemplate = newElement.outerHTML;\n  if (!refinedTemplate) {\n    refinedTemplate = newElement.textContent;\n  }\n  return refinedTemplate;\n}\nfunction getCustomElementAttributes(element, state) {\n  const attributes = (0,_attributes_getAttributes__WEBPACK_IMPORTED_MODULE_1__.getAttributes)(element, state);\n  const childrenExpressions = (0,_html_evaluateTemplate__WEBPACK_IMPORTED_MODULE_3__.extractTemplateExpressions)(element.innerHTML, state);\n  attributes.push({\n    name: \"children\",\n    value: element.innerHTML,\n    expressions: childrenExpressions,\n    reactive: !!childrenExpressions.length,\n    dependents: []\n  });\n  return attributes;\n}\nfunction registerCustomElement(template, state, reactiveNodes) {\n  return function () {\n    const templateName = this.tagName.toLowerCase();\n    const elementId = reactiveNodes.id();\n    const parentId = this.dataset.parentId ? Number(this.dataset.parentId) : null;\n    const parentState = (0,_attributes_getLocalState__WEBPACK_IMPORTED_MODULE_2__.getLocalState)(parentId, [], state.value, reactiveNodes.list);\n    const refinedTemplate = addParentIdToChildren(template.innerHTML, elementId);\n    const attributes = getCustomElementAttributes(this, parentState);\n    const tempDiv = document.createElement(\"div\");\n    tempDiv.innerHTML = refinedTemplate;\n    reactiveNodes.add(reactiveNodes.new(elementId, parentId, attributes, templateName));\n    const elements = (0,_findNodes__WEBPACK_IMPORTED_MODULE_6__.findReactiveNodes)(tempDiv);\n    for (let i = 0; i < elements.length; i++) {\n      const element = elements[i];\n      registerChildReactiveNodes(element, parentId, templateName, attributes, parentState, reactiveNodes, state);\n    }\n    const contextEl = tempDiv.firstChild;\n    contextEl.cogAnchorId = elementId;\n    this.parentElement?.replaceChild(contextEl, this);\n  };\n}\nfunction registerChildReactiveNodes(element, parentId, templateName, attributes, parentState, reactiveNodes, state) {\n  const elementId = reactiveNodes.id();\n  const template = element.outerHTML;\n  state.registerTemplateState(templateName, elementId);\n  let templateState = {};\n  if (state.templates && state.templates[templateName]) {\n    templateState = state.templates[templateName].customElements[elementId];\n  }\n  const localState = (0,_attributes_attributesToState__WEBPACK_IMPORTED_MODULE_0__.attributesToState)(attributes, Object.assign({}, parentState, templateState));\n  const newElement = (0,_registerReactiveNode__WEBPACK_IMPORTED_MODULE_7__.registerReactiveNode)(elementId, reactiveNodes, element, template, localState, attributes, parentId, templateName);\n  newElement.cogAnchorId = elementId;\n}\n\n//# sourceURL=webpack://Cog/./src/nodes/registerTemplates.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/cog.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});