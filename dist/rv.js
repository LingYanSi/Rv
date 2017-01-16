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


	var _tokenizer = __webpack_require__(15);

	var _tokenizer2 = _interopRequireDefault(_tokenizer);

	var _parser = __webpack_require__(12);

	var _parser2 = _interopRequireDefault(_parser);

	var _transform2 = __webpack_require__(16);

	var _observe = __webpack_require__(11);

	var _pubsub = __webpack_require__(13);

	var _pubsub2 = _interopRequireDefault(_pubsub);

	var _util = __webpack_require__(17);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ps = new _pubsub2.default();
	function DOMRender(Component, $parent) {
	    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


	    var fuck = new Component();
	    var _fuck$data = fuck.data,
	        data = _fuck$data === undefined ? {} : _fuck$data,
	        method = fuck.method,
	        template = fuck.template,
	        components = fuck.components,
	        _fuck$event = fuck.event,
	        event = _fuck$event === undefined ? {} : _fuck$event;

	    var that = Object.assign({}, { props: props }, method, { components: components });

	    if (_util2.default.isFunction(data)) {
	        data = data.call(that);
	    }

	    var _Ob = Ob(data),
	        newState = _Ob.newState,
	        listeners = _Ob.listeners,
	        triggerCallback = _Ob.triggerCallback;

	    that = Object.assign(newState, that);

	    // 更该function指向newState
	    for (var key in that) {
	        if (that.hasOwnProperty(key) && typeof that[key] == 'function') {
	            that[key] = that[key].bind(that);
	        }
	    }

	    ;['componentDidMount', 'componentWillMount', 'componentWillUnMount', 'componentDidUnMount'].forEach(function (key) {
	        var fun = fuck[key] || function () {};
	        that[key] = fun.bind(newState);
	    });

	    that.__triggerCallback = triggerCallback;
	    that.$set = _observe.setDataProperty;

	    that.componentWillMount();

	    var tokens = (0, _tokenizer2.default)(addQuote(template));
	    var ast = (0, _parser2.default)(tokens);

	    handlePSEvents(that, event);

	    var _transform = (0, _transform2.transform)(ast, that, listeners, $parent, components, props),
	        refs = _transform.refs,
	        events = _transform.events,
	        children = _transform.children,
	        exprAtrributeQueue = _transform.exprAtrributeQueue,
	        $ele = _transform.$ele;

	    // 添加refs，组件不直接调用dom


	    that.refs = refs;
	    that.$ps = ps;
	    // ele.appendChild(node)
	    that.componentDidMount();

	    return _extends({}, that, {
	        refs: refs,
	        events: events,
	        children: children,
	        exprAtrributeQueue: exprAtrributeQueue,
	        $ele: $ele
	    });
	}

	function handlePSEvents(that, events) {
	    var isOn = false;
	    that.__events = {};
	    function onPS() {
	        if (isOn) return;
	        isOn = true;
	        // 监听
	        Object.keys(events).forEach(function (key) {
	            var fn = events[key].bind(that);
	            // 监听
	            ps.on(key, fn);
	            that.__events[key] = fn;
	            return fn;
	        });
	    }

	    function offPS() {
	        if (!isOn) return;
	        isOn = false;
	        // 卸载
	        Object.keys(that.__events).forEach(function (key) {
	            var fn = that.__events[key];
	            // 监听
	            ps.off(key, fn);
	        });
	    }

	    onPS();

	    that.onPS = onPS;
	    that.offPS = offPS;

	    return {
	        onPS: onPS,
	        offPS: offPS
	    };
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

	    var _ref = new _observe.Observe(state, function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        listeners.cache.forEach(function (listener, index) {
	            listener.callback.apply(listener, args);
	        });
	    }, true),
	        newData = _ref.newData,
	        triggerCallback = _ref.triggerCallback;

	    return { newState: newData, listeners: listeners, triggerCallback: triggerCallback };
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

	window.Rv = {
	    Component: Component,
	    DOMRender: DOMRender,
	    Observe: _observe.Observe,
	    util: _util2.default,
	    nextTick: function nextTick(fn) {
	        _transform2.tick.pushNextTick(fn);
	    },

	    tick: _transform2.tick,
	    unmount: _transform2.unmountElement,
	    set: _observe.setDataProperty,
	    ps: ps,
	    __id: 0
	};

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// 处理dom
	var $ = {
	    remove: function remove($ele) {
	        $ele.parentNode.removeChild($ele);
	    },
	    insert: function insert($parent, $ele, index) {
	        var children = [].concat(_toConsumableArray($parent.children));
	        if (index >= children.length) {
	            $parent.appendChild($ele);
	        } else {
	            $parent.insertBefore($ele, children[index]);
	        }
	    },
	    move: function move($parent, currentIndex, targetIndex) {
	        var children = [].concat(_toConsumableArray($parent.children));
	        var child = children[currentIndex];
	        $parent.removeChild(child);
	        this.insert($parent, child, targetIndex);
	    }
	};

	exports.default = $;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _util = __webpack_require__(17);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * [diff 比较数组，返回数组的修改意见]
	 * @method diff
	 * @param  {Array}  [newList=[]] [description]
	 * @param  {Array}  [oldList=[]] [description]
	 * @return {[type]}              [description]
	 */
	function diff() {
	    var NEW_LIST = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var OLD_LIST = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	    var isHaveKey = arguments[2];

	    // old: [10, 1, 2, 3, 4]
	    // new: [2, 1, 5, 4, 3, 11, 22]
	    // 删除 -> 移动 -> 新增
	    var newList = _util2.default.uniqueArray([].concat(_toConsumableArray(NEW_LIST)), isHaveKey && 'key');
	    var oldList = _util2.default.uniqueArray([].concat(_toConsumableArray(OLD_LIST)), isHaveKey && 'key');

	    // 删除元素
	    var needDeleteList = [];
	    oldList = oldList.filter(function (item, index) {
	        if (!newList.includes(item)) {
	            needDeleteList.push({
	                index: index,
	                item: item
	            });
	            return false;
	        }
	        return true;
	    });

	    // 移动元素

	    var _move = move(newList, oldList),
	        needMoveList = _move.needMoveList,
	        movedList = _move.movedList;

	    // 新增元素


	    var needAddList = [];

	    newList.forEach(function (item, index) {
	        if (!movedList.includes(item)) {
	            needAddList.push({
	                index: index,
	                item: item
	            });
	        }
	    });

	    return {
	        needDeleteList: needDeleteList,
	        needMoveList: needMoveList,
	        needAddList: needAddList
	    };
	}

	function move() {
	    var NEW_LIST = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var OLD_LIST = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	    var newList = [].concat(_toConsumableArray(NEW_LIST));
	    var oldList = [].concat(_toConsumableArray(OLD_LIST));
	    var needMoveList = [];

	    var target = void 0;
	    var targetPrev = void 0;
	    var current = void 0;
	    var currentPrev = void 0;
	    var currentPrevPrev = void 0;

	    var index = 0;
	    var LEN = newList.length;
	    while (index < LEN) {
	        target = newList[index];
	        targetPrev = newList[index - 1];
	        current = target;
	        var oldIndex = oldList.indexOf(current);

	        if (oldIndex > -1) {
	            currentPrev = oldList[oldIndex - 1];
	            currentPrevPrev = oldList[oldIndex - 2];
	            // 为了避免每次数组更新都需要移动节点
	            // 我们发现，如果比较current/target前一个元素是否相等，就可以避免不必要的移动
	            // old [1, 2, 3, 4, 5]
	            // new [5, 1, 2, 3, 4]
	            // 如上只需要移动一次即可
	            //
	            // 然而对于
	            // old [5, 1, 2, 3, 4]
	            // new [1, 2, 3, 4, 5]
	            // 按照上面的方法还是会移动5次
	            // 因此，我们会忽略第一次比较
	            if (targetPrev !== currentPrev && (!currentPrev || currentPrevPrev !== targetPrev)) {
	                oldList.splice(oldIndex, 1);
	                oldList.splice(index, 0, target);
	                needMoveList.push({
	                    oldIndex: oldIndex,
	                    index: index
	                });
	                // console.log(current, `${oldIndex}移动等到${index}`)
	            }
	        }

	        index++;
	    }

	    return {
	        needMoveList: needMoveList,
	        movedList: oldList
	    };
	}

	// diff([3, 1, 2, 5, 7, 8], [1, 2, 3, 4])

	exports.default = diff;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// 事件
	var Event = function () {
	    function Event($ele) {
	        _classCallCheck(this, Event);

	        this.cache = {};
	        this.$ele = $ele;
	    }

	    _createClass(Event, [{
	        key: "off",
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
	        key: "on",
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
	        key: "trigger",
	        value: function trigger(type, id) {}
	    }, {
	        key: "addEventToParent",
	        value: function addEventToParent(type, id, callback) {
	            var _this = this;

	            if (this["__" + type]) return;

	            this["__" + type] = true;

	            this.$ele.addEventListener(type, function (event) {
	                // 在事件系统内冒泡上去到当前文件内
	                var target = event.target,
	                    currentTarget = event.currentTarget;

	                var cbs = [];

	                var _loop = function _loop() {
	                    var id = target.__RVID;
	                    _this.cache[type].forEach(function (i) {
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
	        key: "unmount",
	        value: function unmount(ID) {
	            var cache = this.cache;

	            Object.keys(cache).forEach(function (i) {
	                cache[i] = cache[i].filter(function (ele) {
	                    return ele.id != ID;
	                });
	            });
	        }
	    }, {
	        key: "unmountAll",
	        value: function unmountAll() {
	            this.cache = {};
	        }
	    }, {
	        key: "getTypeCache",
	        value: function getTypeCache(type) {
	            var cache = this.cache;

	            return cache[type] || [];
	        }
	    }]);

	    return Event;
	}();

	exports.default = Event;

/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.setDataProperty = exports.Observe = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(17);

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
	        var newData = this.newData = this.observeObject(data, deepObserve);

	        var observeKey = this.observeKey,
	            triggerCallback = this.triggerCallback;
	        // 埋一个不可枚举的属性，用来添加新属性

	        Object.defineProperty(newData, __RvHook__, {
	            get: function get() {
	                return new RvDataHook(deepObserve, observeKey);
	            },

	            enumerable: false
	        });
	        // return newData
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
	                        var oldValue = [].concat(_toConsumableArray(array));
	                        return function () {
	                            var _Array$prototype$key;

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

	    this.triggerCallback = function () {
	        _this2.callback && _this2.callback.apply(_this2, arguments);
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
/* 12 */
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

	            throw new Error('cannot match a close tag of ' + JSON.stringify(openTag));
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
	            return true;
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
/* 13 */
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
/* 14 */
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
	        value: function push(keys, fn) {
	            var _this = this;

	            var queue = this.queue;

	            queue.push({ keys: keys, fn: fn });

	            clearTimeout(this.setTimeout);
	            this.setTimeout = setTimeout(function () {
	                _this.exec();
	            }, 0);

	            return this;
	        }
	    }, {
	        key: "exec",
	        value: function exec() {
	            var _this2 = this;

	            // 先缓存，后执行，方便后续添加
	            var cacheQueue = this.queue;
	            var cacheNextTickQueue = this.nextTickQueue;

	            this.queue = [];
	            this.nextTickQueue = [];

	            cacheQueue.forEach(function (item) {
	                item.fn();
	            });
	            // 执行所有id小于this.setTimeout的毁掉函数
	            cacheNextTickQueue.forEach(function (item) {
	                var id = item.id,
	                    fn = item.fn;

	                id <= _this2.setTimeout && fn();
	            });

	            return this;
	        }
	    }, {
	        key: "pushNextTick",
	        value: function pushNextTick(fn) {
	            this.nextTickQueue.push({
	                id: this.setTimeout || -1,
	                fn: fn
	            });
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
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.tick = exports.unmountElement = exports.transform = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _getDependenceVarible = __webpack_require__(10);

	var _getDependenceVarible2 = _interopRequireDefault(_getDependenceVarible);

	var _tick = __webpack_require__(14);

	var _tick2 = _interopRequireDefault(_tick);

	var _util = __webpack_require__(17);

	var _util2 = _interopRequireDefault(_util);

	var _diff2 = __webpack_require__(8);

	var _diff3 = _interopRequireDefault(_diff2);

	var _$ = __webpack_require__(7);

	var _$2 = _interopRequireDefault(_$);

	var _domEvent = __webpack_require__(9);

	var _domEvent2 = _interopRequireDefault(_domEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var tick = new _tick2.default();

	var IF = 'v-if';
	var FOR = 'v-for';
	var REF = 'ref';

	var TYPE_TEXT_NODE = 'TEXT_NODE';
	var TYPE_ATTR = 'ATTR';

	/**
	 * [transform description]
	 * @method transform
	 * @param  {[type]}  ast [description]
	 * @return {[type]}      [description]
	 */
	function transform(ast, state, listeners, $parent, components, props) {

	    // 处理子节点
	    function handleChildren(array, $ele, node, ctx) {

	        var eles = array.map(function (i) {
	            return handleElement(i, [].concat(_toConsumableArray(ctx)), $ele);
	        });

	        return $ele;
	    }

	    // 处理元素节点
	    function handleElement(node, ctx, $parent) {
	        var isVIF = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	        var isVFOR = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	        // 可以访问父节点
	        $parent = $parent || document.createDocumentFragment();

	        var ele = void 0;
	        var children = node.children,
	            atrributes = node.atrributes,
	            name = node.name,
	            type = node.type;

	        if (name) {

	            // 处理slot
	            if (name == 'slot') {
	                handleChildren(props.children, $parent, node, props.ctx);
	                return;
	            }

	            var FORatrribute = node.atrributes && node.atrributes[FOR];

	            if (!isVFOR && FORatrribute) {
	                return handleVFor(FORatrribute, $parent, node, ctx);
	            }

	            // 处理if
	            if (!isVIF && atrributes[IF]) {
	                handleVIf(atrributes[IF], $parent, node, ctx);
	                return;
	            }

	            // 处理子组件
	            if (/^[A-Z]/.test(name)) {
	                var _ret = function () {
	                    // throw new Error(`cannot handle tagName of ${name}`)
	                    var props = Object.assign({}, getAttributes(atrributes, ctx), { children: children, ctx: ctx });
	                    var child = window.Rv.DOMRender(components[name], $parent, props);
	                    // 处理ref
	                    if (props.ref) {
	                        refs[props.ref] = child;
	                    }
	                    // 子组件放在父组件的children中，方便卸载
	                    // 组件卸载：事件 + dom
	                    __children.push(child);

	                    // 不处理for循环里的属性
	                    if (!atrributes[FOR]) {
	                        // 处理props
	                        handleAttributes(atrributes, child.$ele, ctx, true, function (key, newValue, oldValue) {
	                            handlePropsUpdate(child, key, newValue, oldValue);
	                        }, CTXX);
	                    }

	                    return {
	                        v: child.$ele
	                    };
	                }();

	                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	            }

	            ele = document.createElement(name);
	            handleEvents(ele);
	            handleAttributes(atrributes, ele, ctx, false, null, CTXX);
	            handleChildren(children, ele, node, [].concat(_toConsumableArray(ctx)));

	            if (isVIF) {
	                $parent.parentNode.insertBefore(ele, $parent);
	                return ele;
	            }
	        } else {
	            ele = handleTextNode(node, ctx, CTXX);
	        }

	        $parent.appendChild(ele);

	        return ele;
	    }

	    // 处理文本节点
	    function handleTextNode(node, ctx, CTXX) {
	        var type = node.type,
	            value = node.value;

	        var $ele = document.createTextNode("");
	        handleEvents($ele);
	        if (type == 'Expr') {
	            value = handleExpr(value, {
	                type: TYPE_TEXT_NODE,
	                $ele: $ele
	            }, ctx, null, true, CTXX);
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

	        // console.log(node.atrributes)
	        var isHaveKey = !!node.atrributes['key'];

	        function render(list) {
	            $parent.innerHTML = '';

	            // 目前不支持Object更新
	            // 是否使用key进行更新过
	            // 如果使用key，则会先进性一边数组去重
	            var isArray = _util2.default.isArray(list);
	            if (!isArray) {
	                throw new Error(VFOR + ' type need be a Array');
	            }

	            if (isHaveKey) {
	                list = getUniqueArray(list, node, ctx, VAR);
	            }

	            var eles = Object.keys(list).forEach(function (key) {
	                var newCtx = {};
	                key = isArray ? +key : key;
	                var item = list[key];

	                if (/^\([^\)]+\)$/.test(VAR)) {
	                    var _arr = VAR.slice(1, -1).split(/\s+/).filter(function (i) {
	                        return i;
	                    });

	                    var itemName = _arr[0];
	                    var indexName = _arr[1];

	                    itemName && (newCtx[itemName] = item);
	                    indexName && (newCtx[indexName] = key);
	                } else {
	                    newCtx[VAR] = item;
	                }

	                var attributes = getAttributes(node.atrributes, [].concat(_toConsumableArray(ctx), [newCtx]));

	                return handleElement(node, [].concat(_toConsumableArray(ctx), [newCtx]), $parent, false, true);
	            });

	            return $parent;
	        }

	        var result = handleExpr(LIST, {
	            attributeName: FOR,
	            $ele: $parent
	        }, ctx, function (matched, newValue, oldValue) {
	            // 处理列表变化
	            handleList(newValue, oldValue, $parent, node, VAR, ctx, isHaveKey);
	        }, true, CTXX);

	        render(result);
	    }

	    // 使用key有个问题在于，直接更新数组
	    // 单后两次有key相同，但数据其实已经变化的情况
	    // 于此的解决方案：id + updateTime来解决，不然队列就不更新了，蜜汁尴尬
	    function getUniqueArray(list, node, ctx, VAR) {
	        var newList = list.map(function (item, index) {
	            var newCtx = {};

	            if (/^\([^\)]+\)$/.test(VAR)) {
	                var arr = VAR.slice(1, -1).split(/\s+/).filter(function (i) {
	                    return i;
	                });

	                var itemName = arr[0];
	                var indexName = arr[1];

	                itemName && (newCtx[itemName] = item);
	                indexName && (newCtx[indexName] = index);
	            } else {
	                newCtx[VAR] = item;
	            }

	            var attributes = getAttributes(node.atrributes, [].concat(_toConsumableArray(ctx), [newCtx]));

	            return {
	                key: attributes['key'],
	                item: item
	            };
	        });

	        return _util2.default.uniqueArray(newList, 'key').map(function (i) {
	            return i.item;
	        });
	    }

	    // 处理list
	    function handleList(newValue, oldValue, $parent, node, VAR, ctx, isHaveKey) {
	        // 处理key
	        if (isHaveKey) {
	            newValue = getUniqueArray(newValue, node, ctx, VAR);
	            oldValue = getUniqueArray(oldValue, node, ctx, VAR);
	        }

	        var _diff = (0, _diff3.default)(newValue, oldValue),
	            needDeleteList = _diff.needDeleteList,
	            needMoveList = _diff.needMoveList,
	            needAddList = _diff.needAddList;

	        var childNodes = $parent.children;

	        // 需要删除的列表
	        var cacheList = [].concat(_toConsumableArray(childNodes));
	        needDeleteList.forEach(function (item) {
	            cacheList.forEach(function ($child, index) {
	                if (index == item.index) {
	                    unmount.element($child);
	                    _$2.default.remove($child);
	                }
	            });
	        });

	        // 处理需要移动元素
	        needMoveList.forEach(function (item) {
	            [].concat(_toConsumableArray(childNodes)).forEach(function ($child, index) {
	                if (index == item.oldIndex) {
	                    _$2.default.move($parent, index, item.index);
	                    // 需要更新index
	                }
	            });
	        });

	        // 处理添加元素
	        needAddList.forEach(function (data) {
	            var newCtx = {};
	            if (/^\([^\)]+\)$/.test(VAR)) {
	                var arr = VAR.slice(1, -1).split(/\s+/).filter(function (i) {
	                    return i;
	                });

	                var itemName = arr[0];
	                var indexName = arr[1];

	                itemName && (newCtx[itemName] = data.item);
	                indexName && (newCtx[indexName] = data.index);
	            } else {
	                newCtx[VAR] = data.item;
	            }

	            var $ele = handleElement(node, [].concat(_toConsumableArray(ctx), [newCtx]), null, false, true);
	            _$2.default.insert($parent, $ele, data.index);
	        })

	        //  暂时只能去更新index属性，但其实是不应该如此的;
	        ;[].concat(_toConsumableArray($parent.children)).forEach(function ($child, index) {
	            if (/^\([^\)]+\)$/.test(VAR)) {
	                var arr = VAR.slice(1, -1).split(/\s+/).filter(function (i) {
	                    return i;
	                });

	                var itemName = arr[0];
	                var indexName = arr[1];

	                triggerCallback($child, indexName, index, CTXX);
	            }
	        });
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

	        var result = handleExpr(VIF.value, {
	            attributeName: IF,
	            $ele: $parent
	        }, ctx, function (matched, newValue, oldValue) {
	            // 监听数据变化
	            deleteNextElement(commentStart, CTXX);
	            newValue && render();
	        }, true, CTXX);

	        result && render();
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
	        events = new _domEvent2.default($ele);
	        unmount = new Unmount(listeners, events, state);

	        $ele.__Rv = new RvElementHook(listeners, events, __children, state, function () {
	            unmount.element($ele);
	        });
	        __$ele = $ele;

	        CTXX = {
	            events: events,
	            unmount: unmount,
	            $ele: $ele,
	            ctx: ctx,
	            state: state,
	            refs: refs,
	            listeners: listeners,
	            children: __children
	        };
	    }

	    var CTXX = {};
	    var refs = {};
	    var ctx = [state];
	    var __$ele = void 0;
	    var events = void 0;
	    var unmount = void 0;
	    var __children = [];

	    handleChildren(ast.children, $parent, ast, ctx);
	    return { refs: refs, events: events, children: __children, $ele: __$ele };
	}

	// 删除下一个元素
	function deleteNextElement(NODE, CTXX) {
	    var $ele = NODE.nextSibling;
	    var unmount = CTXX.unmount;
	    // 判断节点类型是不是元素节点

	    if ($ele.nodeType === 1) {
	        // 卸载元素
	        unmount.element($ele);
	        NODE.parentNode.removeChild($ele);
	    }
	}

	// 更新for循环内的元素
	function triggerCallback($ele, indexName, index, CTXX) {
	    var state = CTXX.state;

	    var newCtx = {};
	    newCtx[indexName] = index;

	    state.__triggerCallback('' + indexName, index, 0, $ele.__RVID, newCtx);
	    if (!($ele.__Rv instanceof RvElementHook)) {
	        var children = [].concat(_toConsumableArray($ele.childNodes));
	        children.length && children.forEach(function ($child) {
	            triggerCallback($child, indexName, index, CTXX);
	        });
	    }
	}

	// 处理表达式
	function handleExpr(expr, watchParams, ctx, callback) {
	    var IS_LISTEN = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
	    var CTXX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

	    // const { listeners, events} = CTXX
	    var param = Object.assign.apply(Object, [{}].concat(_toConsumableArray(ctx)));
	    var a = new Function('param', '\n            with(param){\n                return ' + expr + '\n            }\n        ');

	    var exprKeys = Analysis(expr);

	    var $ele = watchParams.$ele,
	        type = watchParams.type,
	        attributeName = watchParams.attributeName;


	    var timeout = null;
	    IS_LISTEN && CTXX.listeners.push($ele, $ele.__RVID, function (key, newValue, oldValue) {
	        var RVID = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
	        var newCtx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	        // newCtx 用来更新上下文
	        // RVID 用来更新指定节点
	        var keys = key.split(',').filter(function (i) {
	            return i;
	        }).join('.');
	        var matched = exprKeys.some(function (i) {
	            return keys.startsWith(i);
	        });

	        // 数据来了
	        if (!matched) return;
	        if (RVID !== undefined && $ele.__RVID !== RVID) return;

	        var cacheAtrribute = watchParams.cacheAtrribute;
	        // 数据更新后，惰性更新
	        // clearTimeout(timeout)
	        // timeout = setTimeout(()=>{
	        //
	        // })

	        tick.push(keys, function () {

	            var Ctx = ctx.slice(1);
	            Ctx.unshift(CTXX.state);

	            var newParam = Object.assign.apply(Object, [{}].concat(_toConsumableArray(Ctx), [newCtx]));
	            var newAttribute = watchParams.cacheAtrribute = a(newParam);

	            // 处理回调
	            if (callback) {
	                // 对于数组来说，我们需要newValue与oldValue，而不是with下的表达式的值
	                if (attributeName == FOR) {
	                    callback(keys, newValue, oldValue);
	                } else {
	                    callback(keys, newAttribute, cacheAtrribute);
	                }
	                return;
	            }

	            // 更新文本节点
	            if (type == TYPE_TEXT_NODE) {
	                $ele.textContent = newAttribute;
	            }

	            // 更新属性
	            if (type == TYPE_ATTR) {
	                handleSpecialAttr(attributeName, newAttribute || '', $ele, cacheAtrribute, CTXX);
	            }
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

	/**
	     * [Analysis 分析表达式，获取依赖数组]
	     * @method Analysis
	     * @param  {String} expr [description]
	     */
	function Analysis() {
	    var expr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	    // 分析表达式，获取依赖被依赖属性数组，当数据发生变化的时候和数组进行比对，如果匹配成功就更新节点
	    return (0, _getDependenceVarible2.default)(expr);
	}

	/**
	     * [handlePropsUpdate 处理props更新]
	     * @method handlePropsUpdate
	     * @return {[type]}          [description]
	     */
	function handlePropsUpdate(component, key, newValue, oldValue) {
	    component.props[key] = newValue;
	    component.__triggerCallback('props,' + key, newValue, oldValue);
	}

	/**
	     * [getAttributes 获取所有属性的值]
	     * @method getAttributes
	     * @param  {Object}      [atrributes={}] [description]
	     * @param  {Array}       [ctx=[]]        [description]
	     * @return {Array}                      [description]
	     */
	function getAttributes() {
	    var atrributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

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

	/**
	     * [handleAttributes 处理属性]
	     * @method handleAttributes
	     * @param  {Object}         [atrributes={}] [description]
	     * @param  {Dom}            $ele            [description]
	     * @param  {Array}          ctx             [上下文环境]
	     * @return {[type]}                         [description]
	     */
	function handleAttributes() {
	    var atrributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var $ele = arguments[1];
	    var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	    var isComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
	    var callback = arguments[4];
	    var CTXX = arguments[5];

	    // 需要先处理object spread
	    Object.keys(atrributes).filter(function (i) {
	        return i != FOR && i != IF;
	    }).map(function (key) {
	        var v = atrributes[key];
	        if (v) {
	            var type = v.type,
	                value = v.value;

	            value = value || '';
	            if (type == 'String') {
	                !isComponent && $ele.setAttribute(key, value);
	            }

	            if (type == 'Expr') {
	                // 处理Object spread
	                if (value.startsWith('...')) {
	                    var _ret2 = function () {
	                        value = value.slice(3);

	                        // 暂不支持对spread props的变更追踪
	                        var result = handleExpr(value, {
	                            type: TYPE_ATTR,
	                            $ele: $ele,
	                            attributeName: key
	                        }, ctx, isComponent && callback, true, CTXX);

	                        Object.keys(result).forEach(function (key) {
	                            handleSpecialAttr(key, result[key], $ele, CTXX);
	                        });
	                        return {
	                            v: void 0
	                        };
	                    }();

	                    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	                } else {
	                    value = handleExpr(value, {
	                        type: TYPE_ATTR,
	                        $ele: $ele,
	                        attributeName: key
	                    }, ctx, isComponent && callback, true, CTXX);
	                }
	            }

	            // 处理特殊的属性
	            !isComponent && handleSpecialAttr(key, value, $ele, CTXX);
	        } else {
	            !isComponent && $ele.setAttribute(key, "");
	        }
	    });
	}

	/**
	     * [handleSpecialAttr 处理特殊属性]
	     * @method handleSpecialAttr
	     * @param  {String}          key   [description]
	     * @param  {*}          value [description]
	     * @param  {Dom}          $ele  [description]
	     * @return {[type]}                [description]
	     */
	function handleSpecialAttr() {
	    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var value = arguments[1];
	    var $ele = arguments[2];
	    var CTXX = arguments[3];
	    var events = CTXX.events,
	        refs = CTXX.refs;

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
	    } else if (key == 'class') {
	        // 初始样式
	        handleClass($ele, value);
	    } else if (key == REF) {
	        refs[value] = $ele;
	    } else {
	        $ele.setAttribute(key, value);
	    }
	}

	/**
	     * [handleClass 处理className]
	     * @method handleClass
	     * @param  {Dom}    $ele       [description]
	     * @param  {String}    [value=''] [description]
	     * @return {String}               [description]
	     */
	function handleClass($ele) {
	    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	    var className = '';
	    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	        className = Object.keys(value).map(function (key) {
	            var newKey = key.replace(/[A-Z]/g, function (char) {
	                return '-' + char.toLowerCase();
	            });
	            return value[key] ? newKey : '';
	        }).filter(function (key) {
	            return key;
	        }).join(' ');
	    } else {
	        className = value || '';
	    }

	    $ele.className = className;
	    return className;
	}

	/**
	     * [handleStyle 处理样式Style]
	     * @method handleStyle
	     * @param  {Dom}    $ele       [description]
	     * @param  {String}    [value=''] [description]
	     * @return {String}               [description]
	     */
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

	    return style;
	}

	/**
	 * 在元素上留一个钩子，方便直到其是否为组件根元素
	 */

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
	    // 卸载元素


	    _createClass(Unmount, [{
	        key: 'element',
	        value: function element($parent) {
	            if ($parent.__Rv instanceof RvElementHook && $parent.__Rv.isComponentRoot) {
	                var _$parent$__Rv$compone = $parent.__Rv.component,
	                    componentWillUnMount = _$parent$__Rv$compone.componentWillUnMount,
	                    componentDidUnMount = _$parent$__Rv$compone.componentDidUnMount,
	                    offPS = _$parent$__Rv$compone.offPS;
	                // 组件将要卸载

	                componentWillUnMount();

	                this.listeners.unmount($parent.__RVID);

	                $parent.__Rv.listeners.unmountAll();
	                $parent.__Rv.events.unmountAll();

	                // throw new Error()
	                $parent.__Rv.children.forEach(function (component) {
	                    component.$ele.__Rv.unmount();
	                });
	                offPS();
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
	        // 卸载子元素

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

	// 还需要一个事件管理系统，在这个事件系统内，事件也可以冒泡传递
	// 组件创建完成后开始监听
	// 组件销毁掉后，关闭监听

	exports.transform = transform;
	exports.unmountElement = unmountElement;
	exports.tick = tick;

/***/ },
/* 17 */
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

	function isPromise(obj) {
	    return !!getType(obj).match('promise');
	}

	function isAsyncFunction(obj) {
	    return !!getType(obj).match('asyncfunction');
	}

	function isGeneratorFunction(obj) {
	    return !!getType(obj).match('generatorfunction');
	}

	/**
	 * [uniqueArray 数组去重]
	 * @method uniqueArray
	 * @param  {Array}     [arr=[]] [description]
	 * @param  {String}    [key=''] [description]
	 * @return {Array}             [description]
	 */
	function uniqueArray() {
	    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	    var newArr = [];
	    var keyArr = [];
	    arr.forEach(function (item) {
	        if (key && keyArr.indexOf(item[key]) < 0) {
	            keyArr.push(item[key]);
	            newArr.push(item);
	        }

	        if (!key && newArr.indexOf(item) < 0) {
	            newArr.push(item);
	        }
	    });

	    newArr.length != arr.length && console.error('the value of key should be unique');
	    return newArr;
	}

	exports.default = {
	    getType: getType,
	    isFunction: isFunction,
	    isObject: isObject,
	    isArray: isArray,
	    isBoolean: isBoolean,
	    isPromise: isPromise,
	    isAsyncFunction: isAsyncFunction,
	    isGeneratorFunction: isGeneratorFunction,
	    uniqueArray: uniqueArray
	};

/***/ }
/******/ ]);