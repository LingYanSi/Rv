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

	var _ = __webpack_require__(12);

	var _2 = _interopRequireDefault(_);

	var _Modal = __webpack_require__(13);

	var _Modal2 = _interopRequireDefault(_Modal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _window$Rv = window.Rv,
	    Component = _window$Rv.Component,
	    DOMRender = _window$Rv.DOMRender,
	    ps = _window$Rv.ps,
	    set = _window$Rv.set,
	    nextTick = _window$Rv.nextTick;


	var id = 0;
	var list = [{
	    title: '今天的哈哈哈',
	    content: "☺☺☺☺☺",
	    tag: 'today',
	    id: id++
	}];

	var Name = function (_Component) {
	    _inherits(Name, _Component);

	    function Name() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Name);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Name.__proto__ || Object.getPrototypeOf(Name)).call.apply(_ref, [this].concat(args))), _this), _this.template = '<span>Rv</span>', _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    _createClass(Name, [{
	        key: 'componentWillUnMount',
	        value: function componentWillUnMount() {
	            console.log('Name组件将要被卸载');
	        }
	    }, {
	        key: 'componentDidUnMount',
	        value: function componentDidUnMount() {
	            console.log('Name组件已经被卸载');
	        }
	    }]);

	    return Name;
	}(Component);

	var H1 = function (_Component2) {
	    _inherits(H1, _Component2);

	    function H1() {
	        var _ref2;

	        var _temp2, _this2, _ret2;

	        _classCallCheck(this, H1);

	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = H1.__proto__ || Object.getPrototypeOf(H1)).call.apply(_ref2, [this].concat(args))), _this2), _this2.template = '<h1 onclick={click} class="center"><Name />{state} {props.width} <slot></slot></h1>', _this2.data = {
	            state: ' Todo List'
	        }, _this2.components = { Name: Name }, _this2.method = {
	            click: function click() {
	                this.state += ' +1s';
	            }
	        }, _temp2), _possibleConstructorReturn(_this2, _ret2);
	    }

	    _createClass(H1, [{
	        key: 'componentWillMount',
	        value: function componentWillMount() {
	            console.log('组件将要加载');
	        }
	    }, {
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            ps.on('fuck', function (data) {
	                alert(data);
	            });
	            console.log('组件加载成功');
	        }
	    }, {
	        key: 'componentWillUnMount',
	        value: function componentWillUnMount() {
	            console.log('H1组件将要被卸载');
	        }
	    }, {
	        key: 'componentDidUnMount',
	        value: function componentDidUnMount() {
	            console.log(ps.off('fuck'));
	            console.log('H1组件已经被卸载');
	        }
	    }]);

	    return H1;
	}(Component);

	var Open = function (_Component3) {
	    _inherits(Open, _Component3);

	    function Open() {
	        var _ref3;

	        var _temp3, _this3, _ret3;

	        _classCallCheck(this, Open);

	        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	            args[_key3] = arguments[_key3];
	        }

	        return _ret3 = (_temp3 = (_this3 = _possibleConstructorReturn(this, (_ref3 = Open.__proto__ || Object.getPrototypeOf(Open)).call.apply(_ref3, [this].concat(args))), _this3), _this3.template = '\n        <div>\n            <p>{props.msg}</p>\n            <button onClick={close}>\u5173\u95ED</button>\n        </div>\n    ', _this3.method = {
	            close: function close() {
	                _Modal2.default.close();
	            }
	        }, _temp3), _possibleConstructorReturn(_this3, _ret3);
	    }

	    return Open;
	}(Component);

	var Item = function (_Component4) {
	    _inherits(Item, _Component4);

	    function Item() {
	        var _ref4;

	        var _temp4, _this4, _ret4;

	        _classCallCheck(this, Item);

	        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	            args[_key4] = arguments[_key4];
	        }

	        return _ret4 = (_temp4 = (_this4 = _possibleConstructorReturn(this, (_ref4 = Item.__proto__ || Object.getPrototypeOf(Item)).call.apply(_ref4, [this].concat(args))), _this4), _this4.template = '\n        <li style={styles} complete-style={complateStyle} onClick={fuck}>\n            {props.i + 1} : {props.item.title} : {props.item.content} <button onclick={props.del} data-index={props.item.id}>\u5220\u9664</button>\n        </li>\n    ', _this4.data = {
	            styles: {
	                background: 'rgb(144, 203, 132)',
	                height: '50px',
	                transition: 'all .8s'
	            },
	            complateStyle: {
	                background: 'red',
	                height: '30px'
	            }
	        }, _this4.method = {
	            fuck: function fuck() {
	                _Modal2.default.open('body', '', {
	                    Body: Open,
	                    props: {
	                        msg: 'test 组件传递是否正常'
	                    }
	                });
	            }
	        }, _temp4), _possibleConstructorReturn(_this4, _ret4);
	    }

	    return Item;
	}(Component);

	var App = function (_Component5) {
	    _inherits(App, _Component5);

	    function App() {
	        var _ref5;

	        var _temp5, _this5, _ret5;

	        _classCallCheck(this, App);

	        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	            args[_key5] = arguments[_key5];
	        }

	        return _ret5 = (_temp5 = (_this5 = _possibleConstructorReturn(this, (_ref5 = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref5, [this].concat(args))), _this5), _this5.template = '\n        <div aa="cc" dd={ 0 ? "\u6211\u600E\u4E48\u77E5\u9053\u5462" : 22} ee ff ssss="1111" onClick={parentClick}>\n            <H1 width="100">\n                <span onClick={slotClick}>\u6211\u662F\u6807\u9898</span>\n            </H1>\n            <input type="text" placeholder={name} value={input} v-if={vIf} onKeyUp={keyup} ref="input" />\n            <input type="text" style="border: 20px solid red; " placeholder={name} value={input} v-if={!vIf} onKeyUp={keyup} ref="input" />\n            <button onClick={add}>\u63D0\u4EA4</button>\n            <div style="line-height: 2;" v-click="11111" onclick={click} >{input}</div>\n            <ul v-for="(item i) in showList">\n                <Item i={i} item={item} del={del}></Item>\n            </ul>\n            <div>\n                <button class={currentFilter == \'today\' && \'current\' } onClick={filter.bind(this, \'today\')}>\u4ECA\u5929</button>\n                <button class={currentFilter == \'date\' && \'current\' } onClick={filter.bind(this, \'date\')}>\u672C\u5468</button>\n                <button class={currentFilter == \'month\' && \'current\' } onClick={filter.bind(this, \'month\')}>\u672C\u6708</button>\n                <button class={currentFilter == \'all\' && \'current\' } onClick={filter.bind(this, \'all\')}>\u5168\u90E8</button>\n            </div>\n            <p>\u5012\u8BA1\u65F6{time}\u79D2 <button onClick={reset}>reset</button></p>\n            <Nine></Nine>\n            <Modal></Modal>\n        </div>\n    ', _this5.components = { H1: H1, Name: Name, Item: Item, Nine: _2.default, Modal: _Modal2.default }, _this5.data = {
	            // name: '西方哪个国家',
	            input: '',
	            vIf: true,
	            ll: {
	                f: 1
	            },
	            list: list,
	            showList: list,
	            currentFilter: 'all',
	            time: 3,
	            left: 0
	        }, _this5.method = {
	            slotClick: function slotClick() {
	                alert('slotClick');
	            },
	            parentClick: function parentClick() {
	                console.log('播放啦');
	            },
	            keyup: function keyup(event) {
	                if (event.keyCode == 13) {
	                    this.add(event);
	                }
	                this.input = event.target.value;
	            },
	            del: function del(event) {
	                this.list = this.list.filter(function (ele) {
	                    return ele.id != +event.target.dataset['index'];
	                });
	                this.filter();
	            },
	            add: function add(event) {
	                this.list.push({
	                    title: '我是title',
	                    tag: this.currentFilter,
	                    content: this.refs.input.value,
	                    id: id++
	                });

	                this.input = this.refs.input.value = '';

	                this.filter();
	            },
	            filter: function filter(type) {
	                type = type || this.currentFilter;

	                this.showList = this.list.filter(function (i) {
	                    return type != 'all' ? i.tag == type : 1;
	                });

	                this.currentFilter = type;
	            },
	            click: function click() {
	                // ps.trigger('fuck', '哈哈哈哈')
	                this.vIf = !this.vIf;
	            },
	            reset: function reset() {
	                if (!this.time) {
	                    this.time = 3;
	                    this.startTime();
	                }
	            },
	            startTime: function startTime() {
	                var _this6 = this;

	                var interval = setInterval(function () {
	                    if (_this6.time == 0) return clearInterval(interval);
	                    _this6.time--;
	                    nextTick(function () {
	                        console.log('wocao');
	                    });
	                }, 1000);
	            }
	        }, _this5.events = {}, _temp5), _possibleConstructorReturn(_this5, _ret5);
	    }
	    // 事件监听


	    _createClass(App, [{
	        key: 'componentDidMount',

	        // 生命周期
	        value: function componentDidMount() {
	            var _this7 = this;

	            this.startTime();
	            ps.on('fuck:you', function (data) {
	                alert('wocao');
	            });

	            this.$set(this, 'name', 'fuck you bithc');

	            setTimeout(function () {
	                _this7.name = '哈哈哈';
	                console.log(_this7.refs.input.getAttribute('placeholder'));
	                // 此处有bug
	                nextTick(function () {
	                    console.log(_this7.refs.input.getAttribute('placeholder'));
	                });
	            }, 2000);
	        }
	    }]);

	    return App;
	}(Component);

	DOMRender(App, document.querySelector('#app'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".modal-warp p {\n  text-align: center;\n  padding: 10px; }\n\n.modal-warp div.bottom {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  border-top: 1px solid red; }\n  .modal-warp div.bottom button {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    line-height: 2;\n    border: 0;\n    background: none;\n    outline: none; }\n  .modal-warp div.bottom button + button {\n    border-left: 1px solid red; }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Component = window.Rv.Component;

	var Nine = function (_Component) {
	    _inherits(Nine, _Component);

	    function Nine() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Nine);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Nine.__proto__ || Object.getPrototypeOf(Nine)).call.apply(_ref, [this].concat(args))), _this), _this.template = "\n        <div v-for={x in list}>\n            <div>{x}</div>\n        </div>\n    ", _this.data = {
	            list: [1, 2, 3, 4, 5, 6, 7, 8, 9]
	        }, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    return Nine;
	}(Component);

	exports.default = Nine;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(14);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Component = window.Rv.Component;

	// 如何使用命令式方式打开一个Modal组件呢？
	// 如何把子组件传递进来？
	var Modal = function (_Component) {
	    _inherits(Modal, _Component);

	    function Modal() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Modal);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _this.template = '\n        <div style={warpStyle} class="modal-warp">\n            <div v-if={type} class="cancel" style={modalStyle} complete-style={modalStyleComplete} onClick={layerClose && close}></div>\n            <div v-if={type} style={contentStyle} complete-style={contentStyleComplete}>\n                <div v-if={type == "alert"}>\n                    <p>{msg}</p>\n                    <div class="bottom">\n                        <button onClick={close}>\u786E\u8BA4</button>\n                        <button onClick={close} class="cancel">\u53D6\u6D88</button>\n                    </div>\n                </div>\n                <div v-if={type == "tips"}>\n                    <p>{msg}</p>\n                </div>\n                <div v-if={type == "confirm"}>\n                    <p>{msg}</p>\n                    <div class="bottom">\n                        <button onClick={close}>\u786E\u8BA4</button>\n                    </div>\n                </div>\n                <div v-if={type == "body"}>\n                    <Body {...bodyData}></Body>\n                </div>\n            </div>\n        </div>\n    ', _this.data = {
	            warpStyle: {
	                display: 'none'
	            },
	            modalStyle: {
	                position: 'fixed',
	                top: '0',
	                left: '0',
	                width: '100%',
	                height: '100%',
	                background: 'rgba(0, 0, 0, 0)',
	                transition: 'all .4s'
	            },
	            modalStyleComplete: 'background: rgba(0, 0, 0, .6)',
	            contentStyle: 'width: 200px;\n            position: absolute; top: 50%; left: 50%;\n            background: #fff;\n            transition: all .4s;\n            transform: translate3d(-50%, -50%, 0) scale3d(.5, .5, 1);',
	            contentStyleComplete: 'transform: translate3d(-50%, -50%, 0) scale3d(1, 1, 1);',
	            type: 'alert',
	            msg: '',
	            layerClose: true,
	            bodyData: {}
	        }, _this.components = { Body: null }, _this.method = {
	            show: function show() {
	                this.warpStyle.display = 'block';
	            },
	            close: function close(event) {
	                var yes = event ? !event.target.classList.contains('cancel') : false;
	                this.warpStyle.display = 'none';
	                if (this.options) {
	                    var _options = this.options,
	                        submit = _options.submit,
	                        cancel = _options.cancel;

	                    yes ? submit && submit() : cancel && cancel();
	                    this.options = null;
	                }
	            }
	        }, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    _createClass(Modal, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            Modal.self = this;
	        }
	    }]);

	    return Modal;
	}(Component);

	Modal.open = function (type, msg) {
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    var self = Modal.self;
	    var _options$layerClose = options.layerClose,
	        layerClose = _options$layerClose === undefined ? true : _options$layerClose,
	        submit = options.submit,
	        cancel = options.cancel,
	        Body = options.Body,
	        props = options.props;

	    self.show();

	    self.type = type;
	    self.options = options;
	    self.layerClose = layerClose;

	    if (type == 'body') {
	        self.components.Body = Body;
	        self.bodyData = props;
	    } else {
	        self.msg = msg;

	        if (type == 'tips') {
	            setTimeout(function () {
	                self.type = '';
	            }, 2000);
	        }
	    }
	};

	Modal.close = function () {
	    Modal.self.close();
	};

	exports.default = Modal;


	window.Modal = Modal;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(1)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.1.2.1@postcss-loader/index.js!./../../node_modules/.4.1.1@sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../../node_modules/.0.26.1@css-loader/index.js!./../../node_modules/.1.2.1@postcss-loader/index.js!./../../node_modules/.4.1.1@sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }
/******/ ]);