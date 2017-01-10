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

	var _Nav = __webpack_require__(16);

	var _Nav2 = _interopRequireDefault(_Nav);

	var _Home = __webpack_require__(18);

	var _Home2 = _interopRequireDefault(_Home);

	var _Movies = __webpack_require__(19);

	var _Movies2 = _interopRequireDefault(_Movies);

	var _Mine = __webpack_require__(23);

	var _Mine2 = _interopRequireDefault(_Mine);

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

	var Page = function (_Component) {
	    _inherits(Page, _Component);

	    function Page() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Page);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Page.__proto__ || Object.getPrototypeOf(Page)).call.apply(_ref, [this].concat(args))), _this), _this.template = '<div style="padding-bottom: 50px;">\n        <div v-if={pageShow1}>\n            <Page1 ref="Page1"/>\n        </div>\n        <div v-if={pageShow2}>\n            <Page2 ref="Page2" />\n        </div>\n        <div v-if={pageShow3}>\n            <Page3 ref="Page3" />\n        </div>\n    </div>', _this.components = {
	            Page1: null
	        }, _this.data = {
	            pageShow1: false,
	            pageShow2: false,
	            pageShow3: false
	        }, _this.method = {}, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    _createClass(Page, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            Page.self = this;
	            this.cache = [];
	        }
	    }]);

	    return Page;
	}(Component);

	Page.update = function (Component) {
	    var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
	    var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	    var that = Page.self;

	    var cache = that.cache;

	    var pageIndex = 1;
	    var cacheScrollTop = 0;
	    var match = cache.some(function (item, index) {
	        if (url == item.url) {
	            pageIndex = item.pageIndex;
	            cacheScrollTop = item.scrollTop;
	            cache.splice(index, 1);
	            return true;
	        }
	    });

	    if (match) {
	        // that.refs[`Page${pageIndex}`].$ele += 'display: block;'
	        console.log('页面已经被缓存过');
	    } else {
	        if (cache.length < 3) {
	            pageIndex = cache.length + 1;
	            console.log('page新增一个');
	        } else {
	            pageIndex = cache[0].pageIndex;
	            cache.shift();
	            console.log('page新增一个，删除一个');
	        }
	        that.components['Page' + pageIndex] = Component;
	        that['pageShow' + pageIndex] = true;
	    }

	    if (that.prev) {
	        that.cache[that.cache.length - 1].scrollTop = document.body.scrollTop;
	    }
	    // 1 2 3 4 如果已经存在
	    // push(current) shift(0)
	    // 调整位置
	    // 如果页面已经缓存就从缓存内拿，如果不存在就从getNext()
	    nextTick(function () {
	        var prev = that.prev;
	        var current = that.refs['Page' + pageIndex];
	        if (prev) {
	            prev.$ele.style.cssText += 'display: none;';
	            prev.onHide && prev.onHide();
	        }

	        current.onShow && current.onShow();
	        current.$ele.style.cssText += 'display: block;';
	        that.prev = current;
	        that.cache.push({
	            url: url,
	            pageIndex: pageIndex
	        });

	        if (match) {
	            document.body.scrollTop = cacheScrollTop;
	        }
	    });

	    return that;
	};

	var App = function (_Component2) {
	    _inherits(App, _Component2);

	    function App() {
	        var _ref2;

	        var _temp2, _this2, _ret2;

	        _classCallCheck(this, App);

	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref2, [this].concat(args))), _this2), _this2.template = '\n        <div>\n            <Page></Page>\n            <Nav />\n            <Modal />\n        </div>\n    ', _this2.components = { Modal: _Modal2.default, Nav: _Nav2.default, Page: Page }, _temp2), _possibleConstructorReturn(_this2, _ret2);
	    }

	    return App;
	}(Component);

	window.router = function () {
	    var listenCaches = [];
	    var currentRouter = '';

	    window.addEventListener('popstate', function () {
	        render(location.pathname);
	    });

	    // 渲染页面
	    function render(url) {
	        var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	        currentRouter = url;

	        var Component = routers[url];
	        Page.update(Component, url, replace);

	        listenCaches.forEach(function (fn) {
	            return fn(url);
	        });
	    }

	    // 更改title
	    function changeDocumentTitle(title) {
	        document.title = title;
	        var UA = window.navigator.userAgent.toLowerCase();
	        if (UA.match('phone') && UA.match('micromessenger')) {
	            (function () {
	                var iframe = document.createElement('iframe');
	                iframe.src = '/package.json';

	                iframe.style.cssText = 'display: none';
	                var listener = function listener() {
	                    setTimeout(function () {
	                        iframe.removeEventListener('load', listener);
	                        setTimeout(function () {
	                            document.body.removeChild(iframe);
	                        }, 0);
	                    }, 0);
	                };
	                iframe.addEventListener('load', listener);
	                document.body.appendChild(iframe);
	            })();
	        }
	    }

	    var router = {
	        push: function push() {
	            var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
	            var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	            render(url);
	            history.pushState(title, null, url);
	            changeDocumentTitle(title);
	            return this;
	        },
	        replace: function replace() {
	            var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
	            var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	            render(url, true);
	            history.replaceState(title, null, url);
	            changeDocumentTitle(title);
	            return this;
	        },
	        getCurrentRouter: function getCurrentRouter() {
	            return currentRouter;
	        },
	        listen: function listen(fn) {
	            listenCaches.push(fn);
	            return this;
	        },
	        remove: function remove(fn) {
	            listenCaches = listenCaches.filter(function (i) {
	                return i !== fn;
	            });
	            return this;
	        }
	    };

	    return router;
	}();

	DOMRender(App, document.querySelector('#app'));

	router.replace('/', '首頁');

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

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "* {\n  -webkit-tap-highlight-color: rgba(255, 0, 0, 0); }\n\na:visited {\n  color: inherit; }\n\na:Link {\n  color: inherit; }\n\na:active {\n  color: inherit; }\n\nbutton {\n  line-height: 2;\n  padding: 0 1em;\n  outline: none;\n  border: 1px solid #787579;\n  background: inherit; }\n\n#nav {\n  height: 50px;\n  width: 100%;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  background: #bbb5cf;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex; }\n  #nav .item {\n    -webkit-box-flex: 1;\n    -webkit-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n    text-align: center;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n        -ms-flex-align: center;\n            align-items: center; }\n    #nav .item.current {\n      background: #a4e8f4; }\n", ""]);

	// exports


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = undefined;

	var _Link = __webpack_require__(25);

	var _Link2 = _interopRequireDefault(_Link);

	__webpack_require__(17);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Component = window.Rv.Component;

	var Nav = function (_Component) {
	    _inherits(Nav, _Component);

	    function Nav() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Nav);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Nav.__proto__ || Object.getPrototypeOf(Nav)).call.apply(_ref, [this].concat(args))), _this), _this.template = '\n        <div id="nav" v-for={item in items}>\n            <Link class="item" href={item.url} title={item.title} replace={false}>\n                <div>{item.title}</div>\n            </Link>\n        </div>\n    ', _this.components = { Link: _Link2.default }, _this.data = {
	            items: [{ title: '首页', url: '/' }, { title: '影院', url: '/movies' }, { title: '我的', url: '/mine' }]
	        }, _this.method = {
	            click: function click(event) {
	                var $this = event.target;
	                if (!$this.classList.contains('current')) {
	                    [].concat(_toConsumableArray($this.parentNode.children)).forEach(function (ele) {
	                        ele != $this ? ele.classList.remove('current') : ele.classList.add('current');
	                    });
	                    router.push($this.dataset['url']);
	                }
	            }
	        }, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    return Nav;
	}(Component);

	exports.default = Nav;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(15);
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

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

	        return _ret3 = (_temp3 = (_this3 = _possibleConstructorReturn(this, (_ref3 = Open.__proto__ || Object.getPrototypeOf(Open)).call.apply(_ref3, [this].concat(args))), _this3), _this3.template = '\n        <div>\n            <p>{props.msg}</p>\n            <input type="text" onInput={input} ref="title" value={props.title}/>\n            <div>{text}</div>\n            <input type="text" value={props.content} ref="content" />\n            <button onClick={submit}>\u63D0\u4EA4</button>\n        </div>\n    ', _this3.method = {
	            submit: function submit() {
	                var title = this.refs.title.value;
	                var content = this.refs.content.value;
	                ps.trigger('list::change', {
	                    title: title,
	                    content: content,
	                    id: this.props.id
	                });
	                _Modal2.default.close();
	            },
	            input: function input() {
	                this.text = this.refs.title.value;
	            }
	        }, _temp3), _possibleConstructorReturn(_this3, _ret3);
	    }

	    _createClass(Open, [{
	        key: 'data',
	        value: function data() {
	            return {
	                text: this.props.title
	            };
	        }
	    }]);

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

	        return _ret4 = (_temp4 = (_this4 = _possibleConstructorReturn(this, (_ref4 = Item.__proto__ || Object.getPrototypeOf(Item)).call.apply(_ref4, [this].concat(args))), _this4), _this4.template = '\n        <li style={styles} complete-style={complateStyle} >\n            <div>\n                <h4>{props.i + 1} : {props.title}</h4>\n                <p>\n                    {props.content}\n                </p>\n            </div>\n            <button onclick={props.del} data-index={props.id}>\u5220\u9664</button>\n            <button onclick={edit}>\u7F16\u8F91</button>\n        </li>\n    ', _this4.data = {
	            styles: {
	                background: '',
	                padding: '10px',
	                borderBottom: '1px solid #fff',
	                transition: 'all .8s'
	            },
	            complateStyle: {
	                background: 'rgb(144, 212, 143)'
	            }
	        }, _this4.method = {
	            edit: function edit() {
	                _Modal2.default.open('body', '', {
	                    Body: Open,
	                    props: this.props
	                });
	            }
	        }, _temp4), _possibleConstructorReturn(_this4, _ret4);
	    }

	    return Item;
	}(Component);

	var Home = function (_Component5) {
	    _inherits(Home, _Component5);

	    function Home() {
	        var _ref5;

	        var _temp5, _this5, _ret5;

	        _classCallCheck(this, Home);

	        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	            args[_key5] = arguments[_key5];
	        }

	        return _ret5 = (_temp5 = (_this5 = _possibleConstructorReturn(this, (_ref5 = Home.__proto__ || Object.getPrototypeOf(Home)).call.apply(_ref5, [this].concat(args))), _this5), _this5.template = '<div>\n        <header>\n            Rv\n        </header>\n        <H1 width="100">\n            <span onClick={slotClick}>\u6211\u662F\u6807\u9898</span>\n        </H1>\n        <input type="text" placeholder={name} value={input} v-if={vIf} onKeyUp={keyup} ref="input" />\n        <input type="text" style="border: 20px solid red; " placeholder={name} value={input} v-if={!vIf} onKeyUp={keyup} ref="input" />\n        <button onClick={add}>\u63D0\u4EA4</button>\n        <div style="line-height: 2;" v-click="11111" onclick={click} >{input}</div>\n        <ul v-for="(item i) in showList">\n            <Item i={i} {...item} del={del} />\n        </ul>\n        <div>\n            <button class={currentFilter == \'today\' && \'current\' } onClick={filter.bind(this, \'today\')}>\u4ECA\u5929</button>\n            <button class={currentFilter == \'date\' && \'current\' } onClick={filter.bind(this, \'date\')}>\u672C\u5468</button>\n            <button class={currentFilter == \'month\' && \'current\' } onClick={filter.bind(this, \'month\')}>\u672C\u6708</button>\n            <button class={currentFilter == \'all\' && \'current\' } onClick={filter.bind(this, \'all\')}>\u5168\u90E8</button>\n        </div>\n        <p>\u5012\u8BA1\u65F6{time}\u79D2 <button onClick={reset}>reset</button></p>\n    </div>', _this5.data = {
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
	        }, _this5.components = { H1: H1, Name: Name, Item: Item }, _this5.method = {
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
	                var _this6 = this;

	                _Modal2.default.open('alert', '确定要删除?', {
	                    submit: function submit() {
	                        _this6.list = _this6.list.filter(function (ele) {
	                            return ele.id != +event.target.dataset['index'];
	                        });
	                        _this6.filter();
	                    }
	                });
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
	                var _this7 = this;

	                var interval = setInterval(function () {
	                    if (_this7.time == 0) return clearInterval(interval);
	                    _this7.time--;
	                    nextTick(function () {
	                        console.log('wocao');
	                    });
	                }, 1000);
	            },
	            onShow: function onShow() {
	                console.log('页面onshoe了');
	            }
	        }, _this5.events = {}, _temp5), _possibleConstructorReturn(_this5, _ret5);
	    }
	    // 事件监听


	    _createClass(Home, [{
	        key: 'componentDidMount',

	        // 生命周期
	        value: function componentDidMount() {
	            var _this8 = this;

	            this.startTime();
	            ps.on('list::change', function (data) {
	                var id = data.id,
	                    title = data.title,
	                    content = data.content;

	                var index = void 0;
	                var item = void 0;
	                var match = _this8.list.some(function (_item, _index) {
	                    if (_item.id === id) {
	                        index = _index;
	                        item = _item;
	                        return true;
	                    }
	                });

	                if (match) {
	                    item = Object.assign(item, {
	                        title: title,
	                        content: content
	                    });
	                    _this8.list.splice(index, 1, item);
	                    _this8.filter();
	                }
	            });

	            this.$set(this, 'name', 'fuck you bithc');

	            setTimeout(function () {
	                _this8.name = '哈哈哈';
	                console.log('placeholder', _this8.refs.input.getAttribute('placeholder'));
	                // 此处有bug
	                nextTick(function () {
	                    console.log('placeholder', _this8.refs.input.getAttribute('placeholder'));
	                });
	            }, 2000);
	        }
	    }]);

	    return Home;
	}(Component);

	routers['/'] = Home;
	exports.default = Home;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(21);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Component = window.Rv.Component;

	var Movies = function (_Component) {
	    _inherits(Movies, _Component);

	    function Movies() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Movies);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Movies.__proto__ || Object.getPrototypeOf(Movies)).call.apply(_ref, [this].concat(args))), _this), _this.template = '<div id="movies" v-for={item in list}>\n        <div class="item" style={\'background-image:url(\' + item.poster + \')\'}>\n            <p>{item.title}</p>\n        </div>\n    </div>', _this.data = {
	            list: [{
	                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
	                title: 'i的 是的发生的的风格'
	            }, {
	                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
	                title: 'i的 是的发生的的风格'
	            }, {
	                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
	                title: 'i的 是的发生的的风格'
	            }, {
	                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
	                title: 'i的 是的发生的的风格'
	            }, {
	                poster: 'http://ww1.sinaimg.cn/mw1024/61ca8acdgw1fbkgbck9wkj20go0b7gnq.jpg',
	                title: 'i的 是的发生的的风格'
	            }]
	        }, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    _createClass(Movies, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            console.log('电影组件加载成功');
	        }
	    }, {
	        key: 'componentDidUnMount',
	        value: function componentDidUnMount() {
	            console.log('电影组件卸载了');
	        }
	    }]);

	    return Movies;
	}(Component);

	routers['/movies'] = Movies;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#movies .item {\n  padding-top: 60%;\n  background-color: #048488;\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center;\n  position: relative; }\n  #movies .item p {\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    height: 50px;\n    width: 100%;\n    background-color: rgba(0, 0, 0, 0.6);\n    color: #fff; }\n", ""]);

	// exports


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(1)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.2.1@postcss-loader/index.js!./../../../node_modules/.4.1.1@sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.2.1@postcss-loader/index.js!./../../../node_modules/.4.1.1@sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "#page-mine {\n  padding-top: 10%;\n  text-align: center; }\n  #page-mine .avatar {\n    height: 100px;\n    width: 100px;\n    border-radius: 100%;\n    background-size: cover;\n    background-image: url(http://ww2.sinaimg.cn/mw690/61ca8acdgw1fbkfr9mjtij20go0b440g.jpg);\n    margin: 0 auto 5%; }\n", ""]);

	// exports


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(24);

	var _Link = __webpack_require__(25);

	var _Link2 = _interopRequireDefault(_Link);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Component = window.Rv.Component;

	var Mine = function (_Component) {
	    _inherits(Mine, _Component);

	    function Mine() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Mine);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Mine.__proto__ || Object.getPrototypeOf(Mine)).call.apply(_ref, [this].concat(args))), _this), _this.template = '<div id="page-mine">\n        <div class="avatar"></div>\n        <p>\u5343\u5E74\u5C38\u738B\u6BDB\u6DA6\u4E4B</p>\n        <p>\u8FD9\u662F\u4E00\u4E2A\u7B80\u5355\u7684App</p>\n        <Link href="/" class="">\u53BB\u9996\u9875</Link>\n        <Link href="/mine" class="">\u6211\u7684</Link>\n    </div>', _this.components = { Link: _Link2.default }, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    return Mine;
	}(Component);

	routers['/mine'] = Mine;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(22);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(1)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.2.1@postcss-loader/index.js!./../../../node_modules/.4.1.1@sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../../../node_modules/.0.26.1@css-loader/index.js!./../../../node_modules/.1.2.1@postcss-loader/index.js!./../../../node_modules/.4.1.1@sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tap = __webpack_require__(26);

	var _tap2 = _interopRequireDefault(_tap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Component = window.Rv.Component;


	var CURRENT = ' current';

	var Link = function (_Component) {
	    _inherits(Link, _Component);

	    function Link() {
	        var _ref;

	        var _temp, _this, _ret;

	        _classCallCheck(this, Link);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref, [this].concat(args))), _this), _this.template = '<a href="javascript:void(0);"\n            style="text-decoration: none;"\n            data-href={props.href}\n            class={props.class + current}\n            {...onTap(change)}>\n        <slot></slot>\n    </a>', _this.data = {
	            current: ''
	        }, _this.method = {
	            onTap: _tap2.default,
	            handleRouterChange: function handleRouterChange(url) {
	                if (url === this.props.href) {
	                    this.current = CURRENT;
	                } else {
	                    this.current = '';
	                }
	            },
	            change: function change(event) {
	                var _props = this.props,
	                    href = _props.href,
	                    title = _props.title,
	                    replace = _props.replace;

	                if (!event.target.classList.contains('current')) {
	                    replace ? router.replace(href, title) : router.push(href, title);
	                }
	            }
	        }, _temp), _possibleConstructorReturn(_this, _ret);
	    }

	    _createClass(Link, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.current = this.props.href == router.getCurrentRouter() ? CURRENT : '';
	            router.listen(this.handleRouterChange);
	        }
	    }, {
	        key: 'componentDidUnMount',
	        value: function componentDidUnMount() {
	            router.remove(this.handleRouterChange);
	        }
	    }]);

	    return Link;
	}(Component);

	exports.default = Link;

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	// 用于监听页面是否滚动，因为移动端页面滚动时，会阻塞js执行，因此我们使用一个异步事件，用来在scroll结束的时候执行
	// 点击事件和滚动手势是两个独立的事件
	var scroll = false;
	window.addEventListener('touchmove', function () {
	    scroll = true;
	});

	window.addEventListener('touchend', function () {
	    setTimeout(function () {
	        scroll = false;
	    }, 0);
	});

	function onTap(func) {
	    // 判断及其类型
	    // 只支持单指点击，有效时间间隔为200ms
	    if (window.navigator.userAgent.toLowerCase().match(/phone|android|ipad|ipod/g)) {
	        var notMove = true;
	        var startTime = 0;

	        return {
	            onTouchStart: function onTouchStart(event) {
	                notMove = true;
	                if (event.touches.length == 1) {
	                    startTime = new Date().getTime();
	                } else {
	                    notMove = false;
	                }
	            },
	            onTouchMove: function onTouchMove() {
	                notMove = false;
	            },
	            onTouchEnd: function onTouchEnd() {
	                if (scroll) return;
	                notMove && new Date().getTime() - startTime < 600 && func.apply(undefined, arguments);
	            }
	        };
	    } else {
	        return {
	            onClick: func
	        };
	    }
	}

	exports.default = onTap;

/***/ }
/******/ ]);