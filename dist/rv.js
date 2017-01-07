/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // let tokenizer = require('./tokenizer')
	// let parser = require('./parser')

	// scope 作用域问题
	// expr : expr ? expr : expr
	//      | element &&

	// 为什么我们需要把数据处理写到jsx中
	// 按理说jsx应该是只一个view层，只负责数据的渲染吗？

	// 数据监听

	// 事件收发


	var _tokenizer = __webpack_require__(9);

	var _tokenizer2 = _interopRequireDefault(_tokenizer);

	var _parser = __webpack_require__(6);

	var _parser2 = _interopRequireDefault(_parser);

	var _transform2 = __webpack_require__(10);

	var _observe = __webpack_require__(5);

	var _pubsub = __webpack_require__(7);

	var _pubsub2 = _interopRequireDefault(_pubsub);

	var _util = __webpack_require__(11);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function DOMRender(Component, $parent) {
	    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


	    var fuck = new Component();
	    var data = fuck.data,
	        method = fuck.method,
	        template = fuck.template,
	        components = fuck.components;


	    var state = Object.assign({}, data);

	    var _Ob = Ob(state),
	        newState = _Ob.newState,
	        listeners = _Ob.listeners;

	    newState = Object.assign(newState, method);

	    // 更该function指向newState
	    for (var key in newState) {
	        if (newState.hasOwnProperty(key) && typeof newState[key] == 'function') {
	            newState[key] = newState[key].bind(newState);
	        }
	    }

	    ;['componentDidMount', 'componentWillMount', 'componentWillUnMount', 'componentDidUnMount'].forEach(function (key) {
	        var fun = fuck[key] || function () {};
	        newState[key] = fun.bind(newState);
	    });

	    newState.props = props;
	    newState.$set = _observe.setDataProperty;
	    newState.components = components;
	    newState.componentWillMount();

	    var tokens = (0, _tokenizer2.default)(addQuote(template));
	    var ast = (0, _parser2.default)(tokens);

	    var _transform = (0, _transform2.transform)(ast, newState, listeners, $parent, components, props),
	        refs = _transform.refs,
	        events = _transform.events,
	        children = _transform.children,
	        exprAtrributeQueue = _transform.exprAtrributeQueue,
	        $ele = _transform.$ele;

	    // 添加refs，组件不直接调用dom


	    newState.refs = refs;

	    // ele.appendChild(node)
	    newState.componentDidMount();

	    return _extends({}, newState, {
	        refs: refs,
	        events: events,
	        children: children,
	        exprAtrributeQueue: exprAtrributeQueue,
	        $ele: $ele
	    });
	}

	// 给标签内的字符串添加双引号，方便token解析
	function addQuote(template) {
	    var str = template.replace(/>([^<]+)</g, function ($0, $1) {
	        var str = $1.trim().replace(/\{([^}]+)\}/g, function ($0) {
	            return '"' + $0 + '"';
	        });

	        str = str ? '>"' + str + '"<' : $0;
	        return str.replace(/""/g, '');
	    });

	    return str;
	}

	// 生成可以observe的数据，并新增一个事件监听器，用来监听数据的变化
	function Ob(state) {
	    var listeners = new ExprAtrributeQueue();

	    var newState = new _observe.Observe(state, function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        listeners.cache.forEach(function (listener, index) {
	            listener.callback.apply(listener, args);
	        });
	    }, true);

	    return { newState: newState, listeners: listeners };
	}

	// 属性为一个表达式的情况
	// 一个组件的所有属性都在其中

	var ExprAtrributeQueue = function () {
	    function ExprAtrributeQueue() {
	        _classCallCheck(this, ExprAtrributeQueue);

	        this.cache = [];
	    }

	    _createClass(ExprAtrributeQueue, [{
	        key: 'push',
	        value: function push($ele, id, callback) {
	            this.cache.push({
	                id: id,
	                callback: callback,
	                $ele: $ele
	            });
	        }
	    }, {
	        key: 'remove',
	        value: function remove(id, callback) {
	            this.cache = this.cache.filter(function (i) {
	                if (callback) {
	                    return i.id != id && i.callback != callback;
	                }

	                return i.id != id;
	            });
	        }
	        // 卸载子元素上的无属性监听

	    }, {
	        key: 'unmountChildrenAttrs',
	        value: function unmountChildrenAttrs($parent) {
	            var _this = this;

	            $parent.children && [].concat(_toConsumableArray($parent.children)).forEach(function ($child) {
	                _this.unmount($child.__RVID);
	                _this.unmountElementAttrs($child);
	            });
	        }
	        // 卸载元素、及其子元素的属性监听

	    }, {
	        key: 'unmountElementAttrs',
	        value: function unmountElementAttrs($parent) {
	            this.unmount($parent.__RVID);
	            this.unmountChildrenAttrs($parent);
	        }
	        // 卸载指定id的事件监听

	    }, {
	        key: 'unmount',
	        value: function unmount(ID) {
	            this.remove(ID);
	        }
	    }, {
	        key: 'unmountAll',
	        value: function unmountAll() {
	            this.cache = [];
	        }
	    }]);

	    return ExprAtrributeQueue;
	}();

	// 组件卸载，移除事件监听，移除

	// 单组件可以运行，下面还是有组件嵌套，组件通信、样式隔离，作用域隔离等等

	var Component = function Component() {
	    _classCallCheck(this, Component);

	    console.log('初始化了');
	};

	function unmount(ele) {
	    ele.__Rv;
	}

	window.Rv = {
	    Component: Component,
	    DOMRender: DOMRender,
	    Observe: _observe.Observe,
	    util: _util2.default,
	    nextTick: function nextTick(fn) {
	        _transform2.tick.pushNextTick(fn);
	    },

	    unmount: _transform2.unmountElement,
	    set: _observe.setDataProperty,
	    ps: new _pubsub2.default(),
	    __id: 0
	};

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * [getWatchedVarible 获取表达式内可被监听的变量]
	 * @method getWatchedVarible
	 * @param  {[type]}          str [description]
	 * @return {[type]}              [description]
	 */
	function getWatchedVarible(str) {
	    var current = 0;
	    var token = [];

	    function next() {
	        return str[current++];
	    }
	    var char = next();

	    while (current <= str.length) {

	        var VARIABLE = /[a-zA-Z_$]/;
	        if (VARIABLE.test(char)) {
	            var chars = char;
	            char = next();
	            while (/[\w_$\.]/.test(char) && current <= str.length) {
	                chars += char;
	                char = next();
	            }

	            if (chars.endsWith('.')) {
	                throw new Error(chars + ' should not endsWith .');
	            }
	            token.push({
	                type: 'VARIABLE',
	                value: chars
	            });
	            continue;
	        }

	        var DOUBLE_QUET = /"/;
	        if (DOUBLE_QUET.test(char)) {
	            var _chars = '';
	            char = next();
	            while (!/"/.test(char) && current <= str.length) {
	                _chars += char;
	                char = next();
	            }
	            char = next();
	            token.push({
	                type: 'STRING',
	                value: _chars
	            });
	            continue;
	        }

	        var SINGLE_QUET = /'/;
	        if (SINGLE_QUET.test(char)) {
	            var _chars2 = '';
	            char = next();
	            while (!/'/.test(char) && current <= str.length) {
	                _chars2 += char;
	                char = next();
	            }
	            char = next();
	            token.push({
	                type: 'STRING',
	                value: _chars2
	            });
	            continue;
	        }

	        var OPERATOR = /[\+\-\*\/\%\!\=?:]/;
	        if (OPERATOR.test(char)) {
	            token.push({
	                type: 'OPERATOR',
	                value: char
	            });
	            char = next();
	            continue;
	        }

	        var AND = /&/;
	        if (AND.test(char)) {
	            char = next();
	            if (/&/.test(char)) {
	                char = next();
	                token.push({
	                    type: 'AND',
	                    value: '&&'
	                });
	                continue;
	            }
	            throw new Error('the behind of & should be a &');
	        }

	        var OR = /\|/;
	        if (OR.test(char)) {
	            char = next();
	            if (/\|/.test(char)) {
	                char = next();
	                token.push({
	                    type: 'OR',
	                    value: '||'
	                });
	                continue;
	            }
	            throw new Error('the behind of | should be a |');
	        }

	        var SPACE = /\s/;
	        if (SPACE.test(char)) {
	            char = next();
	            continue;
	        }

	        var DOT = /\./;
	        if (DOT.test(char)) {
	            token.push({
	                type: 'DOT',
	                value: char
	            });
	            char = next();
	            continue;
	        }

	        var NUMBER = /\d/;
	        if (NUMBER.test(char)) {
	            var _chars3 = char;
	            char = next();
	            while (/[\d\.]/.test(char)) {
	                _chars3 += char;
	                char = next();
	            }
	            token.push({
	                type: 'NUMBER',
	                value: _chars3
	            });
	            continue;
	        }

	        var EXPR_START = /\(/;
	        if (EXPR_START.test(char)) {
	            var _chars4 = '(';
	            char = next();
	            while (!/\)/.test(char) && current <= str.length) {
	                _chars4 += char;
	                char = next();
	            }
	            char = next();
	            token.push({
	                type: 'EXPR',
	                value: _chars4 + ')'
	            });
	            continue;
	        }

	        throw new Error('cannot handle ' + str + ' char ' + char + ' at ' + current);
	    }

	    return token.filter(function (i) {
	        return i.type == 'VARIABLE';
	    }).map(function (i) {
	        return i.value;
	    });
	}

	exports.default = getWatchedVarible;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.setDataProperty = exports.Observe = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(11);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // 监听数据变化
	// vue会追踪数据变化，react不会，react在setState的时候，就会更新页面，
	// 我们可以通过componentShouldUpdate方法来决定，是否更新组件
	// 本着自动化的目标，我们也期望对数据依赖做出追踪，然后当state变化的时候，自动更新

	// 主要是用来检验对象是不是一个被Observe过得对象
	var RvDataHook = function RvDataHook(deepObserve, observeKey) {
	    _classCallCheck(this, RvDataHook);

	    this.observeKey = observeKey;
	    this.deepObserve = deepObserve;
	};

	// 监听数据
	/**
	 * [observe description]
	 * @param  {[type]}   data                [需要监听的对象]
	 * @param  {Boolean}  [deepObserve=false] [是否深度监听]
	 * @param  {Function} callback            [数据变化后，的毁掉函数]
	 * @param  {String}   [prevKey='']        [传递完整的key->key->key]
	 * @return {[type]}                       [返回observe data]
	 */


	var __RvHook__ = '__RvHook__';

	var Observe = function () {
	    function Observe(data, callback) {
	        var deepObserve = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	        _classCallCheck(this, Observe);

	        _initialiseProps.call(this);

	        this.callback = callback;
	        var newData = this.observeObject(data, deepObserve);

	        var observeKey = this.observeKey,
	            triggerCallback = this.triggerCallback;
	        // 埋一个不可枚举的属性，用来添加新属性

	        Object.defineProperty(newData, __RvHook__, {
	            get: function get() {
	                return new RvDataHook(deepObserve, observeKey);
	            },

	            enumerable: false
	        });
	        return newData;
	    }

	    _createClass(Observe, [{
	        key: 'observeObject',
	        value: function observeObject(data) {
	            var deepObserve = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	            var _this = this;

	            var prevKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	            var isSet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	            var newData = {};
	            Object.keys(data).forEach(function (key) {
	                if (data.hasOwnProperty(key)) {
	                    var value = data[key];
	                    _this.observeKey(newData, key, value, deepObserve, prevKey, isSet);
	                }
	            });

	            return newData;
	        }
	    }, {
	        key: 'observeArray',
	        value: function observeArray(array, deepObserve, itemPrevKey) {
	            var that = this;
	            array = [].concat(_toConsumableArray(array))
	            // 监听数组push,pop,splice,reverse,shift,unshift
	            ;['push', 'pop', 'splice', 'reverse', 'shift', 'unshift'].forEach(function (key) {
	                Object.defineProperty(array, key, {
	                    get: function get() {
	                        return function () {
	                            var _Array$prototype$key;

	                            var oldValue = [].concat(_toConsumableArray(array));

	                            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                                args[_key] = arguments[_key];
	                            }

	                            var result = (_Array$prototype$key = Array.prototype[key]).call.apply(_Array$prototype$key, [array].concat(args));
	                            that.triggerCallback(itemPrevKey, array, oldValue);
	                            return result;
	                        };
	                    }
	                });
	            });

	            return array;
	        }
	    }]);

	    return Observe;
	}();

	/**
	 * [setDataProperty 给已被Observe的对象，添加新属性，新属性可以被继续监控]
	 * @method setDataProperty
	 * @param  {Object}        [data={}] [description]
	 * @param  {String}        [key='']  [description]
	 * @param  {[type]}        value     [description]
	 */


	var _initialiseProps = function _initialiseProps() {
	    var _this2 = this;

	    this.triggerCallback = function (itemPrevKey, array, oldValue) {
	        _this2.callback && _this2.callback(itemPrevKey, array, oldValue);
	    };

	    this.observeKey = function (newData, key, value) {
	        var deepObserve = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	        var prevKey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
	        var isSet = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	        var itemPrevKey = prevKey + key + ',';
	        // 深度监听
	        if (deepObserve) {
	            if (_util2.default.isObject(value)) {
	                value = _this2.observeObject(value, deepObserve, itemPrevKey, isSet);
	            } else if (_util2.default.isArray(value)) {
	                value = _this2.observeArray(value, deepObserve, itemPrevKey, isSet);
	            }
	        }

	        var that = _this2;
	        Object.defineProperty(newData, key, {
	            get: function get() {
	                return value;
	            },
	            set: function set(newValue) {

	                var oldValue = value;
	                value = newValue;

	                // 如果新值还是obj，那就继续监听
	                if (deepObserve) {
	                    if (_util2.default.isObject(value)) {
	                        value = that.observeObject(value, deepObserve, itemPrevKey, true);
	                    } else if (_util2.default.isArray(value)) {
	                        value = that.observeArray(value, deepObserve, itemPrevKey, true);
	                    }
	                }

	                // 回调函数
	                that.triggerCallback(itemPrevKey, newValue, oldValue);
	            },

	            enumerable: true
	        });

	        // 如果{info : {name: 1}} set info 后也会触发 info.name
	        isSet && _this2.triggerCallback(itemPrevKey, value);
	    };
	};

	function setDataProperty() {
	    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	    var value = arguments[2];

	    var info = data[__RvHook__];
	    if (info instanceof RvDataHook) {
	        var deepObserve = info.deepObserve,
	            observeKey = info.observeKey;

	        observeKey(data, key, value, deepObserve, '', true);
	    }
	    return data;
	}

	exports.Observe = Observe;
	exports.setDataProperty = setDataProperty;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * [parser 词法分析器]
	 * @method parser
	 * @param  {Array} token [token数组]
	 * @return {Object}       [AST Tree]
	 */
	function parser(tokens) {
	    var current = 0;
	    var token = tokens[current];
	    var ast = {
	        children: [],
	        type: 'root'
	    };
	    var currentNode = ast;

	    function next(index) {
	        if (index !== undefined) {
	            current = index;
	            return tokens[index];
	        }
	        return tokens[++current];
	    }

	    ELement();
	    function ELement() {
	        // openTag children closeTag
	        var cacheNode = currentNode;
	        currentNode = {
	            name: '',
	            children: [],
	            atrributes: {}
	        };

	        var openTag = OpenTag();
	        if (openTag) {
	            if (openTag.closeSelf) {
	                cacheNode.children.push(currentNode);
	                // console.log('闭合标签', JSON.stringify(cacheNode), JSON.stringify(currentNode))
	                currentNode = cacheNode;
	                return true;
	            }

	            while (Child()) {}

	            if (closeTag()) {
	                cacheNode.children.push(currentNode);
	                // console.log('闭合标签', JSON.stringify(cacheNode), JSON.stringify(currentNode))
	                currentNode = cacheNode;
	                return true;
	            }

	            throw new Error('cannot match a close tag');
	        }

	        currentNode = cacheNode;
	    }

	    function OpenTag() {
	        // OpenStart atrributes openEnd
	        var index = current;

	        if (OpenTagStart()) {
	            if (OpenTagName()) {
	                // 这里有个问题，你可以向前看，前面是不是符合某种要求
	                // 但如果不满足的话，指针是不能移动的，你的明白？
	                while (Attribute()) {}

	                if (openTagEnd()) {
	                    return {
	                        closeSelf: false
	                    };
	                }

	                if (closeSelfTagEnd()) {
	                    // console.info('close self')
	                    return {
	                        closeSelf: true
	                    };
	                }
	            }
	        }

	        token = next(index);

	        return false;
	    }

	    // 开始
	    function OpenTagStart() {
	        var index = current;

	        var _token = token,
	            type = _token.type,
	            value = _token.value;


	        if (type == 'ARROW_LEFT') {
	            token = next();
	            // 校验
	            return true;
	        }

	        token = next(index);
	        return false;
	    }

	    // 标签名
	    function OpenTagName() {
	        var _token2 = token,
	            type = _token2.type,
	            value = _token2.value;


	        if (type == 'VAR') {
	            currentNode.name = value;
	            // console.log('节点名称', token)
	            token = next();
	            return true;
	        }

	        return false;
	    }

	    // 属性
	    function Attribute() {
	        var _token3 = token,
	            type = _token3.type,
	            value = _token3.value;


	        if (AttributeName()) {
	            var attrValue = AttributesEnd();
	            if ((typeof attrValue === 'undefined' ? 'undefined' : _typeof(attrValue)) == 'object') {
	                currentNode.atrributes[value] = attrValue;
	                //  console.log('属性---------', value, JSON.stringify(currentNode), attrValue)
	                return true;
	            } else {
	                currentNode.atrributes[value] = undefined;
	                return true;
	            }
	        } else if (AttributeSpread()) {
	            currentNode.atrributes['spread'] = {
	                type: 'Expr',
	                value: value
	            };
	        }

	        return false;
	    }

	    // 属性名
	    function AttributeName() {
	        var _token4 = token,
	            type = _token4.type,
	            value = _token4.value;

	        if (type == 'VAR') {
	            token = next();
	            return value;
	        }
	    }

	    function AttributeSpread() {
	        var _token5 = token,
	            type = _token5.type,
	            value = _token5.value;

	        if (type == 'EXPR') {
	            token = next();
	            return value;
	        }
	    }

	    // 属性值
	    function AttributesEnd() {
	        var _token6 = token,
	            type = _token6.type,
	            value = _token6.value;


	        if (type == 'EQUAL') {
	            token = next();
	            var _token7 = token,
	                _type = _token7.type,
	                _value = _token7.value;

	            if (_type == 'String') {
	                token = next();
	                return { value: _value, type: 'String' };
	            }

	            if (_type == 'EXPR') {
	                token = next();
	                return { value: _value, type: 'Expr' };
	            }

	            var error = _type + 'parse error, 期望一个VAR';
	            throw new Error(error);
	        }

	        return true;
	    }

	    // 开标签结束
	    function openTagEnd() {
	        var _token8 = token,
	            type = _token8.type,
	            value = _token8.value;


	        if (type == 'ARROW_RIGHT') {
	            token = next();
	            return true;
	        }
	        return false;
	    }

	    function closeSelfTagEnd() {
	        var _token9 = token,
	            type = _token9.type,
	            value = _token9.value;


	        if (type == 'CLOSE_SELF_TAG_END') {
	            token = next();
	            return true;
	        }
	        return false;
	    }

	    function Child() {
	        var index = current;

	        if (ELement()) {
	            return true;
	        }
	        token = next(index);

	        var _token10 = token,
	            value = _token10.value,
	            type = _token10.type;

	        if (type == 'String') {

	            currentNode.children.push({
	                type: 'String',
	                value: value
	            });

	            token = next();

	            return true;
	        }

	        if (type == 'EXPR') {

	            currentNode.children.push({
	                type: 'Expr',
	                value: value
	            });

	            token = next();

	            return true;
	        }

	        token = next(index);

	        return false;
	    }

	    function closeTagStart() {
	        var _token11 = token,
	            type = _token11.type,
	            value = _token11.value;


	        if (type == 'CLOSE_TAG_START') {
	            token = next();
	            return true;
	        }

	        return false;
	    }

	    function CloseTagName() {
	        var _token12 = token,
	            type = _token12.type,
	            value = _token12.value;


	        if (type == 'VAR' && value == currentNode.name) {
	            token = next();
	            return true;
	        }

	        throw new Error('cannot match close tag of ' + currentNode.name);

	        return false;
	    }

	    function closeTag() {
	        var index = current;

	        if (closeTagStart()) {
	            var _token13 = token,
	                value = _token13.value,
	                type = _token13.type;

	            if (CloseTagName()) {
	                if (openTagEnd()) {
	                    return true;
	                }
	            }
	        }

	        token = next(index);
	        console.log('闭合', token, tokens[index - 1]);
	        return false;
	    }

	    return ast;
	}

	module.exports = parser;

	/**
	 * ELement : OpenE Child CloseE
	 * OpenE: < TagName {Attributes} >
	 * Child: ELement | String | Null
	 * CloseE: </ TagName >
	 *
	 * Attributes: AttributesName AttributesEnd
	 * AttributesEnd: = String
	 *              | NULL
	 *
	 * TagName : VAR
	 *
	 */

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 一个简单的事件广播，接收系统
	 * 需要这个玩意儿是为了，组件间通信，但是这么一来，组件的状态就似乎变得不可维护了
	 * 因为，我不太确定触发这个事件，哪个地方会受到影响
	 * 如此便有了flux/redux那一套东西，有一个统一的store，dispatch/action/reduce/store
	 * 同样的store，同样的状态，看起来很美好
	 */
	var Pubsub = function () {
	    function Pubsub() {
	        _classCallCheck(this, Pubsub);

	        this.listeners = {};
	    }
	    // 触发


	    _createClass(Pubsub, [{
	        key: 'trigger',
	        value: function trigger() {
	            var channel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	            var data = arguments[1];

	            var listener = this.listeners[channel];
	            listener && listener.forEach(function (callback) {
	                return callback(data);
	            });

	            return this;
	        }
	        // 监听

	    }, {
	        key: 'on',
	        value: function on() {
	            var channel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	            var callback = arguments[1];

	            var listener = this.listeners[channel] || [];
	            listener.push(callback);
	            this.listeners[channel] = listener;

	            return this;
	        }
	        // 关闭

	    }, {
	        key: 'off',
	        value: function off() {
	            var channel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	            var callback = arguments[1];

	            var listeners = this.listeners;
	            var listener = listeners[channel];

	            if (listener) {
	                listeners[channel] = listener.filter(function (ele) {
	                    // 如果callback不存在，就移除所有
	                    return callback ? callback != ele : false;
	                });
	                if (!listeners[channel].length) {
	                    delete listeners[channel];
	                }
	            }

	            return this;
	        }
	    }]);

	    return Pubsub;
	}();

	exports.default = Pubsub;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// dom渲染异步
	// 这里有一个bug
	// 同步任务结束之后，【收集变更异步、push也异步】何时执行是一个问题
	// 一个nextTick的push是同步的，因此此次的nextTick可能不在同步结束的回调上
	var Tick = function () {
	    function Tick() {
	        _classCallCheck(this, Tick);

	        this.queue = [];
	        this.nextTickQueue = [];
	    }

	    _createClass(Tick, [{
	        key: "push",
	        value: function push(fn) {
	            var _this = this;

	            var queue = this.queue;

	            queue.push(fn);

	            clearTimeout(this.setTimeout);
	            this.setTimeout = setTimeout(function () {
	                _this.exec();
	            }, 0);

	            return this;
	        }
	    }, {
	        key: "exec",
	        value: function exec() {
	            this.queue.forEach(function (fn) {
	                return fn();
	            });
	            this.queue = [];
	            this.nextTickQueue.forEach(function (fn) {
	                return fn();
	            });
	            this.nextTickQueue = [];
	            return this;
	        }
	    }, {
	        key: "pushNextTick",
	        value: function pushNextTick(fn) {
	            this.nextTickQueue.push(fn);
	            return this;
	        }
	    }, {
	        key: "forceTick",
	        value: function forceTick() {
	            this.exec();
	            return this;
	        }
	    }]);

	    return Tick;
	}();

	exports.default = Tick;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	function tokenizer(str) {
	    var current = 0;
	    var char = str[current];
	    var token = [];
	    var y = 0;
	    var x = 0;

	    function next() {
	        x++;
	        var char = str[++current];
	        if (char == '\n') {
	            y++;
	        }

	        return char;
	    }

	    while (current < str.length) {
	        // console.log(current, char)
	        var ARROW_LEFT = /</;
	        if (ARROW_LEFT.test(char)) {
	            char = next();

	            while (/\s/.test(char)) {
	                chars += char;
	                char = next();
	            }
	            // 匹配close tag
	            if (/\//.test(char)) {
	                char = next();

	                token.push({
	                    type: 'CLOSE_TAG_START',
	                    value: '</'
	                });
	            } else {
	                token.push({
	                    type: 'ARROW_LEFT',
	                    value: '<'
	                });
	            }

	            continue;
	        }

	        var ARROW_RIGHT = />/;
	        if (ARROW_RIGHT.test(char)) {
	            token.push({
	                type: 'ARROW_RIGHT',
	                value: char
	            });
	            char = next();
	            continue;
	        }

	        var SPACE = /\s/;
	        if (SPACE.test(char)) {
	            // token.push({
	            //     type: 'ARROW_RIGHT',
	            //     value: char
	            // })
	            char = next();
	            continue;
	        }

	        var SLASH = /\//;
	        if (SLASH.test(char)) {
	            char = next();

	            while (/\s/.test(char)) {
	                chars += char;
	                char = next();
	            }
	            // 匹配close tag
	            if (/>/.test(char)) {
	                char = next();

	                token.push({
	                    type: 'CLOSE_SELF_TAG_END',
	                    value: '/>'
	                });
	            } else {
	                token.push({
	                    type: 'SLASH',
	                    value: '/'
	                });
	            }
	            continue;
	        }

	        var QUOTE = /"/;
	        if (QUOTE.test(char)) {
	            char = next();
	            var _chars = '';
	            while (!QUOTE.test(char)) {
	                _chars += char;
	                char = next();
	            }
	            char = next();
	            token.push({
	                type: 'String',
	                value: _chars
	            });
	            continue;
	        }

	        var VAR = /[a-zA-Z]/;
	        if (VAR.test(char)) {
	            var _chars2 = char;
	            char = next();
	            while (/[a-zA-Z0-9\-]/.test(char)) {
	                _chars2 += char;
	                char = next();
	            }
	            token.push({
	                type: 'VAR',
	                value: _chars2
	            });
	            continue;
	        }

	        var EQUAL = /=/;
	        if (EQUAL.test(char)) {
	            token.push({
	                type: 'EQUAL',
	                value: char
	            });
	            char = next();
	            continue;
	        }

	        var EXPR_START = /\{/;
	        if (EXPR_START.test(char)) {
	            var _chars3 = "";
	            char = next();
	            while (!/\}/.test(char)) {
	                _chars3 += char;
	                char = next();
	            }
	            token.push({
	                type: 'EXPR',
	                value: _chars3
	            });
	            char = next();
	            continue;
	        }

	        throw new Error('cannot handle char ' + char);
	    }
	    return token;
	}

	module.exports = tokenizer;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.tick = exports.unmountElement = exports.transform = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _getDependenceVarible = __webpack_require__(4);

	var _getDependenceVarible2 = _interopRequireDefault(_getDependenceVarible);

	var _tick = __webpack_require__(8);

	var _tick2 = _interopRequireDefault(_tick);

	var _util = __webpack_require__(11);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var tick = new _tick2.default();
	/**
	 * [transform description]
	 * @method transform
	 * @param  {[type]}  ast [description]
	 * @return {[type]}      [description]
	 */
	function transform(ast, state, listeners, $parent, components, props) {
	    var IF = 'v-if';
	    var FOR = 'v-for';
	    var REF = 'ref';

	    var TYPE_TEXT_NODE = 'TEXT_NODE';
	    var TYPE_ATTR = 'ATTR';

	    // 处理子节点
	    function handleChildren(array, $ele, node, ctx) {
	        var FORatrribute = node.atrributes && node.atrributes[FOR];

	        if (FORatrribute) {
	            return handleVFor(FORatrribute, $ele, array[0], ctx);
	        }

	        var eles = array.map(function (i) {
	            return handleElement(i, [].concat(_toConsumableArray(ctx)), $ele);
	        });

	        return $ele;
	    }

	    // 处理元素节点
	    function handleElement(node, ctx, $parent) {
	        var isVIF = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	        // 可以访问父节点
	        var ele = void 0;
	        var children = node.children,
	            atrributes = node.atrributes,
	            name = node.name,
	            type = node.type;

	        if (name) {
	            // 处理子组件
	            if (/^[A-Z]/.test(name)) {
	                // throw new Error(`cannot handle tagName of ${name}`)
	                var _props = Object.assign({}, getAttributes(atrributes, ctx), {
	                    children: children,
	                    ctx: ctx
	                });
	                var child = window.Rv.DOMRender(components[name], $parent, _props);
	                // 子组件放在父组件的children中，方便卸载
	                // 组件卸载：事件 + dom
	                __children.push(child);
	                return;
	            }

	            // 处理slot
	            if (name == 'slot') {
	                handleChildren(props.children, $parent, node, props.ctx);
	                return;
	            }

	            // 处理if
	            if (!isVIF && atrributes[IF]) {
	                handleVIf(atrributes[IF], $parent, node, ctx);
	                return;
	            }

	            ele = document.createElement(name);
	            handleEvents(ele);
	            handleAttributes(atrributes, ele, ctx);
	            handleChildren(children, ele, node, [].concat(_toConsumableArray(ctx)));

	            if (isVIF) {
	                $parent.parentNode.insertBefore(ele, $parent);
	                return ele;
	            }
	        } else {
	            ele = handleTextNode(node, ctx);
	        }

	        $parent.appendChild(ele);

	        return ele;
	    }

	    // 处理文本节点
	    function handleTextNode(node, ctx) {
	        var type = node.type,
	            value = node.value;

	        var $ele = document.createTextNode("");
	        handleEvents($ele);
	        if (type == 'Expr') {
	            value = handleExpr(value, {
	                type: TYPE_TEXT_NODE,
	                $ele: $ele
	            }, ctx);
	        }
	        $ele.textContent = value;

	        return $ele;
	    }

	    // 处理for循环
	    function handleVFor(VFOR, $parent, node, ctx) {
	        var value = VFOR.value;

	        var arr = value.split(/\sin\s/g).filter(function (i) {
	            return i.trim();
	        });
	        var VAR = arr[0];
	        var LIST = arr[1];

	        function render(list) {
	            $parent.innerHTML = '';

	            var eles = list.map(function (i, index) {
	                var newCtx = {};
	                if (/^\([^\)]+\)$/.test(VAR)) {
	                    var _arr = VAR.slice(1, -1).split(/\s+/).filter(function (i) {
	                        return i;
	                    });

	                    var itemName = _arr[0];
	                    var indexName = _arr[1];

	                    itemName && (newCtx[itemName] = i);
	                    indexName && (newCtx[indexName] = index);
	                } else {
	                    newCtx[VAR] = i;
	                }

	                return handleElement(node, [].concat(_toConsumableArray(ctx), [newCtx]), $parent);
	            });

	            return $parent;
	        }

	        var result = handleExpr(LIST, {
	            attributeName: FOR,
	            $ele: $parent
	        }, ctx, function (matched, newValue, oldValue) {
	            // 监听数据变化
	            unmount.children($parent);
	            render(newValue);
	        });

	        render(result);
	    }

	    // 处理if指令，不管元素是否渲染，都会留下两个占位的注释节点
	    function handleVIf(VIF, $parent, node, ctx) {
	        // let
	        var commentStart = document.createComment('if-placeholder-start');
	        $parent.appendChild(commentStart);

	        var commentEnd = document.createComment('if-placeholder-end');
	        $parent.appendChild(commentEnd);

	        function render() {
	            // 如果comment节点后面是一个元素，就删除，然后把这个节点搞上去
	            return handleElement(node, ctx, commentEnd, true);
	        }

	        // 删除下一个元素
	        function deleteNextElement() {
	            var $ele = commentStart.nextSibling;
	            // 判断节点类型是不是元素节点
	            if ($ele.nodeType === 1) {
	                // 卸载元素
	                unmount.element($ele);
	                commentStart.parentNode.removeChild($ele);
	            }
	        }

	        var result = handleExpr(VIF.value, {
	            attributeName: IF,
	            $ele: $parent
	        }, ctx, function (matched, newValue, oldValue) {
	            // 监听数据变化
	            deleteNextElement();
	            newValue && render(newValue);
	        });

	        result && render();
	    }

	    // 处理表达式
	    function handleExpr(expr, watchParams, ctx, callback) {
	        var IS_LISTEN = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

	        var param = Object.assign.apply(Object, [{}].concat(_toConsumableArray(ctx)));
	        var a = new Function('param', '\n            with(param){\n                return ' + expr + '\n            }\n        ');

	        var exprKeys = Analysis(expr);

	        var $ele = watchParams.$ele,
	            type = watchParams.type,
	            attributeName = watchParams.attributeName;


	        var timeout = null;
	        IS_LISTEN && listeners.push($ele, $ele.__RVID, function (key, newValue, oldValue) {
	            var keys = key.split(',').filter(function (i) {
	                return i;
	            }).join('.');
	            var matched = exprKeys.some(function (i) {
	                return keys.startsWith(i);
	            });

	            // 数据来了
	            if (!matched) return;

	            // 数据更新后，惰性更新
	            clearTimeout(timeout);
	            timeout = setTimeout(function () {
	                tick.push(function () {
	                    var cacheAtrribute = watchParams.cacheAtrribute;

	                    var newCtx = ctx.slice(1);
	                    newCtx.unshift(state);

	                    var newParam = Object.assign.apply(Object, [{}].concat(_toConsumableArray(newCtx)));
	                    var newAttribute = watchParams.cacheAtrribute = a(newParam);

	                    // 处理回调
	                    if (callback) {
	                        return callback(matched, newAttribute, cacheAtrribute);
	                    }

	                    // 更新文本节点
	                    if (type == TYPE_TEXT_NODE) {
	                        $ele.textContent = newAttribute;
	                    }

	                    // 更新属性
	                    if (type == TYPE_ATTR) {
	                        handleSpecialAttr(attributeName, newAttribute || '', $ele, cacheAtrribute);
	                    }
	                });
	            });
	        });

	        // 去监听数据
	        watchParams.cacheAtrribute = a(param);
	        return watchParams.cacheAtrribute;
	    }

	    // expr : String
	    //      | Number
	    //      | Variables
	    //      | ()
	    // operator : + | - | * | / | && | || | ++ | -- | ! | !!!

	    function Analysis(expr) {
	        // 分析表达式，获取依赖被依赖属性数组，当数据发生变化的时候和数组进行比对，如果匹配成功就更新节点
	        return (0, _getDependenceVarible2.default)(expr);
	    }

	    // 获取所有属性的值
	    function getAttributes(atrributes, ctx) {
	        var atts = {};
	        Object.keys(atrributes).map(function (key) {
	            var v = atrributes[key];

	            if (!v) return;

	            var type = v.type,
	                value = v.value;

	            value = value || '';

	            if (type == 'String') {
	                atts[key] = value;
	            }

	            if (type == 'Expr') {
	                // 处理事件表达式，但这里不用监听表达式
	                var isSpread = false;
	                if (value.startsWith('...')) {
	                    isSpread = true;
	                    value = value.slice(3);
	                }
	                var result = handleExpr(value, {
	                    type: TYPE_ATTR,
	                    attributeName: key
	                }, ctx, null, false);

	                if (isSpread) {
	                    atts = Object.assign({}, atts, result);
	                } else {
	                    atts[key] = result;
	                }
	            }
	        });

	        return atts;
	    }

	    // 处理属性
	    function handleAttributes(atrributes, $ele, ctx) {
	        Object.keys(atrributes).filter(function (i) {
	            return i != FOR && i != IF;
	        }).map(function (key) {
	            var v = atrributes[key];
	            if (v) {
	                var type = v.type,
	                    value = v.value;

	                value = value || '';
	                if (type == 'String') {
	                    $ele.setAttribute(key, value);
	                }

	                if (type == 'Expr') {
	                    // 处理事件监听
	                    value = handleExpr(value, {
	                        type: TYPE_ATTR,
	                        $ele: $ele,
	                        attributeName: key
	                    }, ctx);
	                }

	                // 处理特殊的属性
	                handleSpecialAttr(key, value, $ele);
	            } else {
	                $ele.setAttribute(key, "");
	            }
	        });
	    }

	    // 处理特殊的属性
	    function handleSpecialAttr(key, value, $ele) {
	        if (key.startsWith('on')) {
	            // 移除掉之前的事件
	            events.off(key.slice(2).toLowerCase(), $ele.__RVID);

	            // 新增事件监听
	            _util2.default.isFunction(value) && events.on(key.slice(2).toLowerCase(), $ele.__RVID, value);
	        } else if (key == 'style') {
	            // 初始样式
	            handleStyle($ele, value);
	        } else if (key == 'complete-style') {
	            // 初始样式
	            setTimeout(function () {
	                $ele.clientWidth;
	                handleStyle($ele, value);
	            }, 0);
	        } else if (key == REF) {
	            refs[value] = $ele;
	        } else {
	            $ele.setAttribute(key, value);
	        }
	    }

	    function handleClass() {}

	    // 处理样式
	    function handleStyle($ele) {
	        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	        var style = '';
	        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	            for (var propertyName in value) {
	                if (value.hasOwnProperty(propertyName)) {
	                    // 处理驼峰形式的css
	                    var newPropertyName = propertyName.replace(/[A-Z]/g, function (char) {
	                        return '-' + char.toLowerCase();
	                    });
	                    style += ';' + newPropertyName + ' : ' + value[propertyName];
	                }
	            }
	        } else {
	            style = value || '';
	        }

	        $ele.style.cssText += style;
	    }

	    // 返回element list
	    // 每个组件在实例上都会维护一个事件委托
	    // 但是有些事件是可以委托的，有些事件是无法委托的：scroll onpause onplay等
	    function handleEvents($ele) {
	        // 每个元素的id应该是唯一的
	        $ele.__RVID = window.Rv.__id++;
	        if (events) {
	            return;
	        }
	        events = new Event($ele);
	        unmount = new Unmount(listeners, events, state);

	        $ele.__Rv = new RvElementHook(listeners, events, __children, state, function () {
	            unmount.element($ele);
	        });
	        __$ele = $ele;
	    }

	    var refs = {};
	    var ctx = [state];
	    var __$ele = void 0;
	    var events = void 0;
	    var unmount = void 0;
	    var __children = [];

	    handleChildren(ast.children, $parent, ast, ctx);
	    return {
	        refs: refs,
	        events: events,
	        children: __children,
	        $ele: __$ele
	    };
	}

	var RvElementHook = function RvElementHook(listeners, events, children, state, unmount) {
	    _classCallCheck(this, RvElementHook);

	    this.isComponentRoot = true;
	    this.listeners = listeners;
	    this.events = events;
	    this.unmount = unmount;
	    this.children = children, this.component = state;
	};

	// 卸载根组件


	function unmountElement($ele) {
	    if ($ele.__Rv instanceof RvElementHook) {
	        $ele.__Rv.unmount();
	        $ele.parentNode.removeChild($ele);
	    }
	}

	// 卸载组件

	var Unmount = function () {
	    function Unmount(listeners, events, component) {
	        _classCallCheck(this, Unmount);

	        this.listeners = listeners;
	        this.events = events;
	        this.component = component;
	    }

	    _createClass(Unmount, [{
	        key: 'element',
	        value: function element($parent) {
	            if ($parent.__Rv instanceof RvElementHook && $parent.__Rv.isComponentRoot) {
	                var _$parent$__Rv$compone = $parent.__Rv.component,
	                    componentWillUnMount = _$parent$__Rv$compone.componentWillUnMount,
	                    componentDidUnMount = _$parent$__Rv$compone.componentDidUnMount;
	                // 组件将要卸载

	                componentWillUnMount();

	                $parent.__Rv.listeners.unmountAll();
	                $parent.__Rv.events.unmountAll();

	                // throw new Error()
	                $parent.__Rv.children.forEach(function (component) {
	                    component.$ele.__Rv.unmount();
	                });
	                // 组件已卸载
	                componentDidUnMount();

	                return;
	            }
	            if ($parent.__RVID) {
	                this.listeners.unmount($parent.__RVID);
	                // 卸载事件
	                this.events.unmount($parent.__RVID);

	                this.children($parent);
	            }
	        }
	    }, {
	        key: 'children',
	        value: function children($parent) {
	            var _this = this;

	            $parent.children && [].concat(_toConsumableArray($parent.children)).forEach(function ($child) {
	                _this.element($child);
	            });
	        }
	    }]);

	    return Unmount;
	}();

	// 事件


	var Event = function () {
	    function Event($ele) {
	        _classCallCheck(this, Event);

	        this.cache = {};
	        this.$ele = $ele;
	    }

	    _createClass(Event, [{
	        key: 'off',
	        value: function off(type, id, callback) {
	            var arr = this.getTypeCache(type);
	            arr.filter(function (i) {
	                if (callback) {
	                    return i.id != id && i.callback != callback;
	                } else {
	                    return i.id != id;
	                }
	            });
	            this.cache[type] = arr;

	            return this;
	        }
	    }, {
	        key: 'on',
	        value: function on(type, id, callback) {
	            var arr = this.getTypeCache(type);
	            arr.push({
	                id: id,
	                callback: callback
	            });
	            this.cache[type] = arr;

	            this.addEventToParent(type, id, callback);

	            return this;
	        }
	    }, {
	        key: 'trigger',
	        value: function trigger(type, id) {}
	    }, {
	        key: 'addEventToParent',
	        value: function addEventToParent(type, id, callback) {
	            var _this2 = this;

	            if (this['__' + type]) return;

	            this['__' + type] = true;

	            this.$ele.addEventListener(type, function (event) {
	                // 在事件系统内冒泡上去到当前文件内
	                var target = event.target,
	                    currentTarget = event.currentTarget;

	                var cbs = [];

	                var _loop = function _loop() {
	                    var id = target.__RVID;
	                    _this2.cache[type].forEach(function (i) {
	                        if (i.id === id) {
	                            cbs.push(i.callback);
	                        }
	                    });
	                    target = target.parentElement;
	                };

	                while (target && target != currentTarget.parentElement) {
	                    _loop();
	                }
	                cbs.forEach(function (cb) {
	                    return cb(event);
	                });
	            });
	        }
	    }, {
	        key: 'unmount',
	        value: function unmount(ID) {
	            var cache = this.cache;

	            Object.keys(cache).forEach(function (i) {
	                cache[i] = cache[i].filter(function (ele) {
	                    return ele.id != ID;
	                });
	            });
	        }
	    }, {
	        key: 'unmountAll',
	        value: function unmountAll() {
	            this.cache = {};
	        }
	    }, {
	        key: 'getTypeCache',
	        value: function getTypeCache(type) {
	            var cache = this.cache;

	            return cache[type] || [];
	        }
	    }]);

	    return Event;
	}();

	exports.transform = transform;
	exports.unmountElement = unmountElement;
	exports.tick = tick;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function getType(obj) {
	    return Object.prototype.toString.call(obj).toLowerCase().split(' ')[1].slice(0, -1);
	}

	function isFunction(obj) {
	    return !!getType(obj).match('function');
	}

	function isObject(obj) {
	    return !!getType(obj).match('object');
	}

	function isArray(obj) {
	    return !!getType(obj).match('array');
	}

	function isBoolean(obj) {
	    return !!getType(obj).match('boolean');
	}

	function isPromise() {
	    return !!getType(obj).match('promise');
	}

	function isAsyncFunction() {
	    return !!getType(obj).match('asyncfunction');
	}

	function isGeneratorFunction() {
	    return !!getType(obj).match('generatorfunction');
	}

	exports.default = {
	    getType: getType,
	    isFunction: isFunction,
	    isObject: isObject,
	    isArray: isArray,
	    isBoolean: isBoolean,
	    isPromise: isPromise,
	    isAsyncFunction: isAsyncFunction,
	    isGeneratorFunction: isGeneratorFunction
	};

/***/ }
/******/ ]);