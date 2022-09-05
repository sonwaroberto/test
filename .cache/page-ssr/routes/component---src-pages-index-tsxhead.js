exports.id = "component---src-pages-index-tsxhead";
exports.ids = ["component---src-pages-index-tsxhead"];
exports.modules = {

/***/ "./node_modules/@gatsbyjs/reach-router/lib/utils.js":
/*!**********************************************************!*\
  !*** ./node_modules/@gatsbyjs/reach-router/lib/utils.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.shallowCompare = exports.validateRedirect = exports.insertParams = exports.resolve = exports.match = exports.pick = exports.startsWith = undefined;

var _invariant = __webpack_require__(/*! invariant */ "./node_modules/invariant/invariant.js");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

////////////////////////////////////////////////////////////////////////////////
// startsWith(string, search) - Check if `string` starts with `search`
var startsWith = function startsWith(string, search) {
  return string.substr(0, search.length) === search;
};

////////////////////////////////////////////////////////////////////////////////
// pick(routes, uri)
//
// Ranks and picks the best route to match. Each segment gets the highest
// amount of points, then the type of segment gets an additional amount of
// points where
//
//     static > dynamic > splat > root
//
// This way we don't have to worry about the order of our routes, let the
// computers do it.
//
// A route looks like this
//
//     { path, default, value }
//
// And a returned match looks like:
//
//     { route, params, uri }
//
// I know, I should use TypeScript not comments for these types.
var pick = function pick(routes, uri) {
  var match = void 0;
  var default_ = void 0;

  var _uri$split = uri.split("?"),
      uriPathname = _uri$split[0];

  var uriSegments = segmentize(uriPathname);
  var isRootUri = uriSegments[0] === "";
  var ranked = rankRoutes(routes);

  for (var i = 0, l = ranked.length; i < l; i++) {
    var missed = false;
    var route = ranked[i].route;

    if (route.default) {
      default_ = {
        route: route,
        params: {},
        uri: uri
      };
      continue;
    }

    var routeSegments = segmentize(route.path);
    var params = {};
    var max = Math.max(uriSegments.length, routeSegments.length);
    var index = 0;

    for (; index < max; index++) {
      var routeSegment = routeSegments[index];
      var uriSegment = uriSegments[index];

      if (isSplat(routeSegment)) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/*
        var param = routeSegment.slice(1) || "*";
        params[param] = uriSegments.slice(index).map(decodeURIComponent).join("/");
        break;
      }

      if (uriSegment === undefined) {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true;
        break;
      }

      var dynamicMatch = paramRe.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        var matchIsNotReserved = reservedNames.indexOf(dynamicMatch[1]) === -1;
        !matchIsNotReserved ?  true ? (0, _invariant2.default)(false, "<Router> dynamic segment \"" + dynamicMatch[1] + "\" is a reserved name. Please use a different name in path \"" + route.path + "\".") : 0 : void 0;
        var value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true;
        break;
      }
    }

    if (!missed) {
      match = {
        route: route,
        params: params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }

  return match || default_ || null;
};

////////////////////////////////////////////////////////////////////////////////
// match(path, uri) - Matches just one path to a uri, also lol
var match = function match(path, uri) {
  return pick([{ path: path }], uri);
};

////////////////////////////////////////////////////////////////////////////////
// resolve(to, basepath)
//
// Resolves URIs as though every path is a directory, no files.  Relative URIs
// in the browser can feel awkward because not only can you be "in a directory"
// you can be "at a file", too. For example
//
//     browserSpecResolve('foo', '/bar/') => /bar/foo
//     browserSpecResolve('foo', '/bar') => /foo
//
// But on the command line of a file system, it's not as complicated, you can't
// `cd` from a file, only directories.  This way, links have to know less about
// their current path. To go deeper you can do this:
//
//     <Link to="deeper"/>
//     // instead of
//     <Link to=`{${props.uri}/deeper}`/>
//
// Just like `cd`, if you want to go deeper from the command line, you do this:
//
//     cd deeper
//     # not
//     cd $(pwd)/deeper
//
// By treating every path as a directory, linking to relative paths should
// require less contextual information and (fingers crossed) be more intuitive.
var resolve = function resolve(to, base) {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith(to, "/")) {
    return to;
  }

  var _to$split = to.split("?"),
      toPathname = _to$split[0],
      toQuery = _to$split[1];

  var _base$split = base.split("?"),
      basePathname = _base$split[0];

  var toSegments = segmentize(toPathname);
  var baseSegments = segmentize(basePathname);

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(basePathname, toQuery);
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith(toSegments[0], ".")) {
    var pathname = baseSegments.concat(toSegments).join("/");
    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }

  // ./         /users/123  =>  /users/123
  // ../        /users/123  =>  /users
  // ../..      /users/123  =>  /
  // ../../one  /a/b/c/d    =>  /a/b/one
  // .././one   /a/b/c/d    =>  /a/b/c/one
  var allSegments = baseSegments.concat(toSegments);
  var segments = [];
  for (var i = 0, l = allSegments.length; i < l; i++) {
    var segment = allSegments[i];
    if (segment === "..") segments.pop();else if (segment !== ".") segments.push(segment);
  }

  return addQuery("/" + segments.join("/"), toQuery);
};

////////////////////////////////////////////////////////////////////////////////
// insertParams(path, params)

var insertParams = function insertParams(path, params) {
  var _path$split = path.split("?"),
      pathBase = _path$split[0],
      _path$split$ = _path$split[1],
      query = _path$split$ === undefined ? "" : _path$split$;

  var segments = segmentize(pathBase);
  var constructedPath = "/" + segments.map(function (segment) {
    var match = paramRe.exec(segment);
    return match ? params[match[1]] : segment;
  }).join("/");
  var _params$location = params.location;
  _params$location = _params$location === undefined ? {} : _params$location;
  var _params$location$sear = _params$location.search,
      search = _params$location$sear === undefined ? "" : _params$location$sear;

  var searchSplit = search.split("?")[1] || "";
  constructedPath = addQuery(constructedPath, query, searchSplit);
  return constructedPath;
};

var validateRedirect = function validateRedirect(from, to) {
  var filter = function filter(segment) {
    return isDynamic(segment);
  };
  var fromString = segmentize(from).filter(filter).sort().join("/");
  var toString = segmentize(to).filter(filter).sort().join("/");
  return fromString === toString;
};

////////////////////////////////////////////////////////////////////////////////
// Junk
var paramRe = /^:(.+)/;

var SEGMENT_POINTS = 4;
var STATIC_POINTS = 3;
var DYNAMIC_POINTS = 2;
var SPLAT_PENALTY = 1;
var ROOT_POINTS = 1;

var isRootSegment = function isRootSegment(segment) {
  return segment === "";
};
var isDynamic = function isDynamic(segment) {
  return paramRe.test(segment);
};
var isSplat = function isSplat(segment) {
  return segment && segment[0] === "*";
};

var rankRoute = function rankRoute(route, index) {
  var score = route.default ? 0 : segmentize(route.path).reduce(function (score, segment) {
    score += SEGMENT_POINTS;
    if (isRootSegment(segment)) score += ROOT_POINTS;else if (isDynamic(segment)) score += DYNAMIC_POINTS;else if (isSplat(segment)) score -= SEGMENT_POINTS + SPLAT_PENALTY;else score += STATIC_POINTS;
    return score;
  }, 0);
  return { route: route, score: score, index: index };
};

var rankRoutes = function rankRoutes(routes) {
  return routes.map(rankRoute).sort(function (a, b) {
    return a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index;
  });
};

var segmentize = function segmentize(uri) {
  return uri
  // strip starting/ending slashes
  .replace(/(^\/+|\/+$)/g, "").split("/");
};

var addQuery = function addQuery(pathname) {
  for (var _len = arguments.length, query = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    query[_key - 1] = arguments[_key];
  }

  query = query.filter(function (q) {
    return q && q.length > 0;
  });
  return pathname + (query && query.length > 0 ? "?" + query.join("&") : "");
};

var reservedNames = ["uri", "path"];

/**
 * Shallow compares two objects.
 * @param {Object} obj1 The first object to compare.
 * @param {Object} obj2 The second object to compare.
 */
var shallowCompare = function shallowCompare(obj1, obj2) {
  var obj1Keys = Object.keys(obj1);
  return obj1Keys.length === Object.keys(obj2).length && obj1Keys.every(function (key) {
    return obj2.hasOwnProperty(key) && obj1[key] === obj2[key];
  });
};

////////////////////////////////////////////////////////////////////////////////
exports.startsWith = startsWith;
exports.pick = pick;
exports.match = match;
exports.resolve = resolve;
exports.insertParams = insertParams;
exports.validateRedirect = validateRedirect;
exports.shallowCompare = shallowCompare;

/***/ }),

/***/ "./node_modules/gatsby-page-utils/dist/apply-trailing-slash-option.js":
/*!****************************************************************************!*\
  !*** ./node_modules/gatsby-page-utils/dist/apply-trailing-slash-option.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.__esModule = true;
exports.applyTrailingSlashOption = void 0;

// TODO(v5): Remove legacy setting and default to "always"
const applyTrailingSlashOption = (input, option = `legacy`) => {
  const hasHtmlSuffix = input.endsWith(`.html`);
  const hasXmlSuffix = input.endsWith(`.xml`);
  const hasPdfSuffix = input.endsWith(`.pdf`);
  if (input === `/`) return input;

  if (hasHtmlSuffix || hasXmlSuffix || hasPdfSuffix) {
    option = `never`;
  }

  if (option === `always`) {
    return input.endsWith(`/`) ? input : `${input}/`;
  }

  if (option === `never`) {
    return input.endsWith(`/`) ? input.slice(0, -1) : input;
  }

  return input;
};

exports.applyTrailingSlashOption = applyTrailingSlashOption;

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.useScrollRestoration = exports.ScrollContext = void 0;

var _scrollHandler = __webpack_require__(/*! ./scroll-handler */ "./node_modules/gatsby-react-router-scroll/scroll-handler.js");

exports.ScrollContext = _scrollHandler.ScrollHandler;

var _useScrollRestoration = __webpack_require__(/*! ./use-scroll-restoration */ "./node_modules/gatsby-react-router-scroll/use-scroll-restoration.js");

exports.useScrollRestoration = _useScrollRestoration.useScrollRestoration;

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/scroll-handler.js":
/*!*******************************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/scroll-handler.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.ScrollHandler = exports.ScrollContext = void 0;

var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js"));

var _inheritsLoose2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inheritsLoose */ "./node_modules/@babel/runtime/helpers/inheritsLoose.js"));

var React = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js"));

var _sessionStorage = __webpack_require__(/*! ./session-storage */ "./node_modules/gatsby-react-router-scroll/session-storage.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ScrollContext = /*#__PURE__*/React.createContext(new _sessionStorage.SessionStorage());
exports.ScrollContext = ScrollContext;
ScrollContext.displayName = "GatsbyScrollContext";

var ScrollHandler = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(ScrollHandler, _React$Component);

  function ScrollHandler() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this._stateStorage = new _sessionStorage.SessionStorage();
    _this._isTicking = false;
    _this._latestKnownScrollY = 0;

    _this.scrollListener = function () {
      _this._latestKnownScrollY = window.scrollY;

      if (!_this._isTicking) {
        _this._isTicking = true;
        requestAnimationFrame(_this._saveScroll.bind((0, _assertThisInitialized2.default)(_this)));
      }
    };

    _this.windowScroll = function (position, prevProps) {
      if (_this.shouldUpdateScroll(prevProps, _this.props)) {
        window.scrollTo(0, position);
      }
    };

    _this.scrollToHash = function (hash, prevProps) {
      var node = document.getElementById(hash.substring(1));

      if (node && _this.shouldUpdateScroll(prevProps, _this.props)) {
        node.scrollIntoView();
      }
    };

    _this.shouldUpdateScroll = function (prevRouterProps, routerProps) {
      var shouldUpdateScroll = _this.props.shouldUpdateScroll;

      if (!shouldUpdateScroll) {
        return true;
      } // Hack to allow accessing this._stateStorage.


      return shouldUpdateScroll.call((0, _assertThisInitialized2.default)(_this), prevRouterProps, routerProps);
    };

    return _this;
  }

  var _proto = ScrollHandler.prototype;

  _proto._saveScroll = function _saveScroll() {
    var key = this.props.location.key || null;

    if (key) {
      this._stateStorage.save(this.props.location, key, this._latestKnownScrollY);
    }

    this._isTicking = false;
  };

  _proto.componentDidMount = function componentDidMount() {
    window.addEventListener("scroll", this.scrollListener);
    var scrollPosition;
    var _this$props$location = this.props.location,
        key = _this$props$location.key,
        hash = _this$props$location.hash;

    if (key) {
      scrollPosition = this._stateStorage.read(this.props.location, key);
    }

    if (scrollPosition) {
      this.windowScroll(scrollPosition, undefined);
    } else if (hash) {
      this.scrollToHash(decodeURI(hash), undefined);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this$props$location2 = this.props.location,
        hash = _this$props$location2.hash,
        key = _this$props$location2.key;
    var scrollPosition;

    if (key) {
      scrollPosition = this._stateStorage.read(this.props.location, key);
    }
    /**  There are two pieces of state: the browser url and
     * history state which keeps track of scroll position
     * Native behaviour prescribes that we ought to restore scroll position
     * when a user navigates back in their browser (this is the `POP` action)
     * Currently, reach router has a bug that prevents this at https://github.com/reach/router/issues/228
     * So we _always_ stick to the url as a source of truth — if the url
     * contains a hash, we scroll to it
     */


    if (hash) {
      this.scrollToHash(decodeURI(hash), prevProps);
    } else {
      this.windowScroll(scrollPosition, prevProps);
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement(ScrollContext.Provider, {
      value: this._stateStorage
    }, this.props.children);
  };

  return ScrollHandler;
}(React.Component);

exports.ScrollHandler = ScrollHandler;
ScrollHandler.propTypes = {
  shouldUpdateScroll: _propTypes.default.func,
  children: _propTypes.default.element.isRequired,
  location: _propTypes.default.object.isRequired
};

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/session-storage.js":
/*!********************************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/session-storage.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.__esModule = true;
exports.SessionStorage = void 0;
var STATE_KEY_PREFIX = "@@scroll|";
var GATSBY_ROUTER_SCROLL_STATE = "___GATSBY_REACT_ROUTER_SCROLL";

var SessionStorage = /*#__PURE__*/function () {
  function SessionStorage() {}

  var _proto = SessionStorage.prototype;

  _proto.read = function read(location, key) {
    var stateKey = this.getStateKey(location, key);

    try {
      var value = window.sessionStorage.getItem(stateKey);
      return value ? JSON.parse(value) : 0;
    } catch (e) {
      if (true) {
        console.warn("[gatsby-react-router-scroll] Unable to access sessionStorage; sessionStorage is not available.");
      }

      if (window && window[GATSBY_ROUTER_SCROLL_STATE] && window[GATSBY_ROUTER_SCROLL_STATE][stateKey]) {
        return window[GATSBY_ROUTER_SCROLL_STATE][stateKey];
      }

      return 0;
    }
  };

  _proto.save = function save(location, key, value) {
    var stateKey = this.getStateKey(location, key);
    var storedValue = JSON.stringify(value);

    try {
      window.sessionStorage.setItem(stateKey, storedValue);
    } catch (e) {
      if (window && window[GATSBY_ROUTER_SCROLL_STATE]) {
        window[GATSBY_ROUTER_SCROLL_STATE][stateKey] = JSON.parse(storedValue);
      } else {
        window[GATSBY_ROUTER_SCROLL_STATE] = {};
        window[GATSBY_ROUTER_SCROLL_STATE][stateKey] = JSON.parse(storedValue);
      }

      if (true) {
        console.warn("[gatsby-react-router-scroll] Unable to save state in sessionStorage; sessionStorage is not available.");
      }
    }
  };

  _proto.getStateKey = function getStateKey(location, key) {
    var stateKeyBase = "" + STATE_KEY_PREFIX + location.pathname;
    return key === null || typeof key === "undefined" ? stateKeyBase : stateKeyBase + "|" + key;
  };

  return SessionStorage;
}();

exports.SessionStorage = SessionStorage;

/***/ }),

/***/ "./node_modules/gatsby-react-router-scroll/use-scroll-restoration.js":
/*!***************************************************************************!*\
  !*** ./node_modules/gatsby-react-router-scroll/use-scroll-restoration.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;
exports.useScrollRestoration = useScrollRestoration;

var _scrollHandler = __webpack_require__(/*! ./scroll-handler */ "./node_modules/gatsby-react-router-scroll/scroll-handler.js");

var _react = __webpack_require__(/*! react */ "react");

var _reachRouter = __webpack_require__(/*! @gatsbyjs/reach-router */ "./node_modules/@gatsbyjs/reach-router/es/index.js");

function useScrollRestoration(identifier) {
  var location = (0, _reachRouter.useLocation)();
  var state = (0, _react.useContext)(_scrollHandler.ScrollContext);
  var ref = (0, _react.useRef)(null);
  (0, _react.useLayoutEffect)(function () {
    if (ref.current) {
      var position = state.read(location, identifier);
      ref.current.scrollTo(0, position || 0);
    }
  }, [location.key]);
  return {
    ref: ref,
    onScroll: function onScroll() {
      if (ref.current) {
        state.save(location, identifier, ref.current.scrollTop);
      }
    }
  };
}

/***/ }),

/***/ "./.cache/emitter.js":
/*!***************************!*\
  !*** ./.cache/emitter.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var mitt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mitt */ "./node_modules/mitt/dist/mitt.es.js");

const emitter = (0,mitt__WEBPACK_IMPORTED_MODULE_0__["default"])();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (emitter);

/***/ }),

/***/ "./.cache/find-path.js":
/*!*****************************!*\
  !*** ./.cache/find-path.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cleanPath": () => (/* binding */ cleanPath),
/* harmony export */   "findMatchPath": () => (/* binding */ findMatchPath),
/* harmony export */   "findPath": () => (/* binding */ findPath),
/* harmony export */   "grabMatchParams": () => (/* binding */ grabMatchParams),
/* harmony export */   "setMatchPaths": () => (/* binding */ setMatchPaths)
/* harmony export */ });
/* harmony import */ var _gatsbyjs_reach_router_lib_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @gatsbyjs/reach-router/lib/utils */ "./node_modules/@gatsbyjs/reach-router/lib/utils.js");
/* harmony import */ var _strip_prefix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./strip-prefix */ "./.cache/strip-prefix.js");
/* harmony import */ var _normalize_page_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./normalize-page-path */ "./.cache/normalize-page-path.js");
/* harmony import */ var _redirect_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./redirect-utils.js */ "./.cache/redirect-utils.js");




const pathCache = new Map();
let matchPaths = [];

const trimPathname = rawPathname => {
  let newRawPathname = rawPathname;
  const queryIndex = rawPathname.indexOf(`?`);

  if (queryIndex !== -1) {
    const [path, qs] = rawPathname.split(`?`);
    newRawPathname = `${path}?${encodeURIComponent(qs)}`;
  }

  const pathname = decodeURIComponent(newRawPathname); // Remove the pathPrefix from the pathname.

  const trimmedPathname = (0,_strip_prefix__WEBPACK_IMPORTED_MODULE_1__["default"])(pathname, decodeURIComponent("")) // Remove any hashfragment
  .split(`#`)[0];
  return trimmedPathname;
};

function absolutify(path) {
  // If it's already absolute, return as-is
  if (path.startsWith(`/`) || path.startsWith(`https://`) || path.startsWith(`http://`)) {
    return path;
  } // Calculate path relative to current location, adding a trailing slash to
  // match behavior of @reach/router


  return new URL(path, window.location.href + (window.location.href.endsWith(`/`) ? `` : `/`)).pathname;
}
/**
 * Set list of matchPaths
 *
 * @param {Array<{path: string, matchPath: string}>} value collection of matchPaths
 */


const setMatchPaths = value => {
  matchPaths = value;
};
/**
 * Return a matchpath url
 * if `match-paths.json` contains `{ "/foo*": "/page1", ...}`, then
 * `/foo?bar=far` => `/page1`
 *
 * @param {string} rawPathname A raw pathname
 * @return {string|null}
 */

const findMatchPath = rawPathname => {
  const trimmedPathname = cleanPath(rawPathname);
  const pickPaths = matchPaths.map(({
    path,
    matchPath
  }) => {
    return {
      path: matchPath,
      originalPath: path
    };
  });
  const path = (0,_gatsbyjs_reach_router_lib_utils__WEBPACK_IMPORTED_MODULE_0__.pick)(pickPaths, trimmedPathname);

  if (path) {
    return (0,_normalize_page_path__WEBPACK_IMPORTED_MODULE_2__["default"])(path.route.originalPath);
  }

  return null;
};
/**
 * Return a matchpath params from reach/router rules
 * if `match-paths.json` contains `{ ":bar/*foo" }`, and the path is /baz/zaz/zoo
 * then it returns
 *  { bar: baz, foo: zaz/zoo }
 *
 * @param {string} rawPathname A raw pathname
 * @return {object}
 */

const grabMatchParams = rawPathname => {
  const trimmedPathname = cleanPath(rawPathname);
  const pickPaths = matchPaths.map(({
    path,
    matchPath
  }) => {
    return {
      path: matchPath,
      originalPath: path
    };
  });
  const path = (0,_gatsbyjs_reach_router_lib_utils__WEBPACK_IMPORTED_MODULE_0__.pick)(pickPaths, trimmedPathname);

  if (path) {
    return path.params;
  }

  return {};
}; // Given a raw URL path, returns the cleaned version of it (trim off
// `#` and query params), or if it matches an entry in
// `match-paths.json`, its matched path is returned
//
// E.g. `/foo?bar=far` => `/foo`
//
// Or if `match-paths.json` contains `{ "/foo*": "/page1", ...}`, then
// `/foo?bar=far` => `/page1`

const findPath = rawPathname => {
  const trimmedPathname = trimPathname(absolutify(rawPathname));

  if (pathCache.has(trimmedPathname)) {
    return pathCache.get(trimmedPathname);
  }

  const redirect = (0,_redirect_utils_js__WEBPACK_IMPORTED_MODULE_3__.maybeGetBrowserRedirect)(rawPathname);

  if (redirect) {
    return findPath(redirect.toPath);
  }

  let foundPath = findMatchPath(trimmedPathname);

  if (!foundPath) {
    foundPath = cleanPath(rawPathname);
  }

  pathCache.set(trimmedPathname, foundPath);
  return foundPath;
};
/**
 * Clean a url and converts /index.html => /
 * E.g. `/foo?bar=far` => `/foo`
 *
 * @param {string} rawPathname A raw pathname
 * @return {string}
 */

const cleanPath = rawPathname => {
  const trimmedPathname = trimPathname(absolutify(rawPathname));
  let foundPath = trimmedPathname;

  if (foundPath === `/index.html`) {
    foundPath = `/`;
  }

  foundPath = (0,_normalize_page_path__WEBPACK_IMPORTED_MODULE_2__["default"])(foundPath);
  return foundPath;
};

/***/ }),

/***/ "./.cache/gatsby-browser-entry.js":
/*!****************************************!*\
  !*** ./.cache/gatsby-browser-entry.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Link": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "PageRenderer": () => (/* reexport default from dynamic */ _public_page_renderer__WEBPACK_IMPORTED_MODULE_2___default.a),
/* harmony export */   "Script": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.Script),
/* harmony export */   "ScriptStrategy": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.ScriptStrategy),
/* harmony export */   "StaticQuery": () => (/* binding */ StaticQuery),
/* harmony export */   "StaticQueryContext": () => (/* binding */ StaticQueryContext),
/* harmony export */   "collectedScriptsByPage": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.collectedScriptsByPage),
/* harmony export */   "graphql": () => (/* binding */ graphql),
/* harmony export */   "navigate": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.navigate),
/* harmony export */   "parsePath": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.parsePath),
/* harmony export */   "prefetchPathname": () => (/* binding */ prefetchPathname),
/* harmony export */   "scriptCache": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.scriptCache),
/* harmony export */   "scriptCallbackCache": () => (/* reexport safe */ gatsby_script__WEBPACK_IMPORTED_MODULE_6__.scriptCallbackCache),
/* harmony export */   "useScrollRestoration": () => (/* reexport safe */ gatsby_react_router_scroll__WEBPACK_IMPORTED_MODULE_1__.useScrollRestoration),
/* harmony export */   "useStaticQuery": () => (/* binding */ useStaticQuery),
/* harmony export */   "withAssetPrefix": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.withAssetPrefix),
/* harmony export */   "withPrefix": () => (/* reexport safe */ gatsby_link__WEBPACK_IMPORTED_MODULE_5__.withPrefix)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var gatsby_link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! gatsby-link */ "./node_modules/gatsby-link/dist/index.modern.mjs");
/* harmony import */ var gatsby_react_router_scroll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gatsby-react-router-scroll */ "./node_modules/gatsby-react-router-scroll/index.js");
/* harmony import */ var _public_page_renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./public-page-renderer */ "./.cache/public-page-renderer.js");
/* harmony import */ var _public_page_renderer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_public_page_renderer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./loader */ "./.cache/loader.js");
/* harmony import */ var gatsby_script__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! gatsby-script */ "./node_modules/gatsby-script/dist/index.modern.mjs");






const prefetchPathname = _loader__WEBPACK_IMPORTED_MODULE_3__["default"].enqueue;
const StaticQueryContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createContext({});

function StaticQueryDataRenderer({
  staticQueryData,
  data,
  query,
  render
}) {
  const finalData = data ? data.data : staticQueryData[query] && staticQueryData[query].data;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, finalData && render(finalData), !finalData && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "Loading (StaticQuery)"));
}

const StaticQuery = props => {
  const {
    data,
    query,
    render,
    children
  } = props;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StaticQueryContext.Consumer, null, staticQueryData => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StaticQueryDataRenderer, {
    data: data,
    query: query,
    render: render || children,
    staticQueryData: staticQueryData
  }));
};

const useStaticQuery = query => {
  var _context$query;

  if (typeof (react__WEBPACK_IMPORTED_MODULE_0___default().useContext) !== `function` && "development" === `development`) {
    throw new Error(`You're likely using a version of React that doesn't support Hooks\n` + `Please update React and ReactDOM to 16.8.0 or later to use the useStaticQuery hook.`);
  }

  const context = react__WEBPACK_IMPORTED_MODULE_0___default().useContext(StaticQueryContext); // query is a stringified number like `3303882` when wrapped with graphql, If a user forgets
  // to wrap the query in a grqphql, then casting it to a Number results in `NaN` allowing us to
  // catch the misuse of the API and give proper direction

  if (isNaN(Number(query))) {
    throw new Error(`useStaticQuery was called with a string but expects to be called using \`graphql\`. Try this:

import { useStaticQuery, graphql } from 'gatsby';

useStaticQuery(graphql\`${query}\`);
`);
  }

  if ((_context$query = context[query]) !== null && _context$query !== void 0 && _context$query.data) {
    return context[query].data;
  } else {
    throw new Error(`The result of this StaticQuery could not be fetched.\n\n` + `This is likely a bug in Gatsby and if refreshing the page does not fix it, ` + `please open an issue in https://github.com/gatsbyjs/gatsby/issues`);
  }
};

StaticQuery.propTypes = {
  data: (prop_types__WEBPACK_IMPORTED_MODULE_4___default().object),
  query: (prop_types__WEBPACK_IMPORTED_MODULE_4___default().string.isRequired),
  render: (prop_types__WEBPACK_IMPORTED_MODULE_4___default().func),
  children: (prop_types__WEBPACK_IMPORTED_MODULE_4___default().func)
};

function graphql() {
  throw new Error(`It appears like Gatsby is misconfigured. Gatsby related \`graphql\` calls ` + `are supposed to only be evaluated at compile time, and then compiled away. ` + `Unfortunately, something went wrong and the query was left in the compiled code.\n\n` + `Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.`);
}




/***/ }),

/***/ "./.cache/loader.js":
/*!**************************!*\
  !*** ./.cache/loader.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseLoader": () => (/* binding */ BaseLoader),
/* harmony export */   "PageResourceStatus": () => (/* binding */ PageResourceStatus),
/* harmony export */   "ProdLoader": () => (/* binding */ ProdLoader),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getStaticQueryResults": () => (/* binding */ getStaticQueryResults),
/* harmony export */   "publicLoader": () => (/* binding */ publicLoader),
/* harmony export */   "setLoader": () => (/* binding */ setLoader)
/* harmony export */ });
/* harmony import */ var _prefetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prefetch */ "./.cache/prefetch.js");
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./emitter */ "./.cache/emitter.js");
/* harmony import */ var _find_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./find-path */ "./.cache/find-path.js");



/**
 * Available resource loading statuses
 */

const PageResourceStatus = {
  /**
   * At least one of critical resources failed to load
   */
  Error: `error`,

  /**
   * Resources loaded successfully
   */
  Success: `success`
};

const stripSurroundingSlashes = s => {
  s = s[0] === `/` ? s.slice(1) : s;
  s = s.endsWith(`/`) ? s.slice(0, -1) : s;
  return s;
};

const createPageDataUrl = rawPath => {
  const [path, maybeSearch] = rawPath.split(`?`);
  const fixedPath = path === `/` ? `index` : stripSurroundingSlashes(path);
  return `${""}/page-data/${fixedPath}/page-data.json${maybeSearch ? `?${maybeSearch}` : ``}`;
};

function doFetch(url, method = `GET`) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open(method, url, true);

    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        resolve(req);
      }
    };

    req.send(null);
  });
}

const doesConnectionSupportPrefetch = () => {
  if (`connection` in navigator && typeof navigator.connection !== `undefined`) {
    if ((navigator.connection.effectiveType || ``).includes(`2g`)) {
      return false;
    }

    if (navigator.connection.saveData) {
      return false;
    }
  }

  return true;
}; // Regex that matches common search crawlers


const BOT_REGEX = /bot|crawler|spider|crawling/i;

const toPageResources = (pageData, component = null, head) => {
  const page = {
    componentChunkName: pageData.componentChunkName,
    path: pageData.path,
    webpackCompilationHash: pageData.webpackCompilationHash,
    matchPath: pageData.matchPath,
    staticQueryHashes: pageData.staticQueryHashes,
    getServerDataError: pageData.getServerDataError
  };
  return {
    component,
    head,
    json: pageData.result,
    page
  };
};

class BaseLoader {
  constructor(loadComponent, matchPaths) {
    this.inFlightNetworkRequests = new Map();
    // Map of pagePath -> Page. Where Page is an object with: {
    //   status: PageResourceStatus.Success || PageResourceStatus.Error,
    //   payload: PageResources, // undefined if PageResourceStatus.Error
    // }
    // PageResources is {
    //   component,
    //   json: pageData.result,
    //   page: {
    //     componentChunkName,
    //     path,
    //     webpackCompilationHash,
    //     staticQueryHashes
    //   },
    //   staticQueryResults
    // }
    this.pageDb = new Map();
    this.inFlightDb = new Map();
    this.staticQueryDb = {};
    this.pageDataDb = new Map();
    this.isPrefetchQueueRunning = false;
    this.prefetchQueued = [];
    this.prefetchTriggered = new Set();
    this.prefetchCompleted = new Set();
    this.loadComponent = loadComponent;
    (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.setMatchPaths)(matchPaths);
  }

  memoizedGet(url) {
    let inFlightPromise = this.inFlightNetworkRequests.get(url);

    if (!inFlightPromise) {
      inFlightPromise = doFetch(url, `GET`);
      this.inFlightNetworkRequests.set(url, inFlightPromise);
    } // Prefer duplication with then + catch over .finally to prevent problems in ie11 + firefox


    return inFlightPromise.then(response => {
      this.inFlightNetworkRequests.delete(url);
      return response;
    }).catch(err => {
      this.inFlightNetworkRequests.delete(url);
      throw err;
    });
  }

  setApiRunner(apiRunner) {
    this.apiRunner = apiRunner;
    this.prefetchDisabled = apiRunner(`disableCorePrefetching`).some(a => a);
  }

  fetchPageDataJson(loadObj) {
    const {
      pagePath,
      retries = 0
    } = loadObj;
    const url = createPageDataUrl(pagePath);
    return this.memoizedGet(url).then(req => {
      const {
        status,
        responseText
      } = req; // Handle 200

      if (status === 200) {
        try {
          const jsonPayload = JSON.parse(responseText);

          if (jsonPayload.path === undefined) {
            throw new Error(`not a valid pageData response`);
          }

          const maybeSearch = pagePath.split(`?`)[1];

          if (maybeSearch && !jsonPayload.path.includes(maybeSearch)) {
            jsonPayload.path += `?${maybeSearch}`;
          }

          return Object.assign(loadObj, {
            status: PageResourceStatus.Success,
            payload: jsonPayload
          });
        } catch (err) {// continue regardless of error
        }
      } // Handle 404


      if (status === 404 || status === 200) {
        // If the request was for a 404/500 page and it doesn't exist, we're done
        if (pagePath === `/404.html` || pagePath === `/500.html`) {
          return Object.assign(loadObj, {
            status: PageResourceStatus.Error
          });
        } // Need some code here to cache the 404 request. In case
        // multiple loadPageDataJsons result in 404s


        return this.fetchPageDataJson(Object.assign(loadObj, {
          pagePath: `/404.html`,
          notFound: true
        }));
      } // handle 500 response (Unrecoverable)


      if (status === 500) {
        return this.fetchPageDataJson(Object.assign(loadObj, {
          pagePath: `/500.html`,
          internalServerError: true
        }));
      } // Handle everything else, including status === 0, and 503s. Should retry


      if (retries < 3) {
        return this.fetchPageDataJson(Object.assign(loadObj, {
          retries: retries + 1
        }));
      } // Retried 3 times already, result is an error.


      return Object.assign(loadObj, {
        status: PageResourceStatus.Error
      });
    });
  }

  loadPageDataJson(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);

    if (this.pageDataDb.has(pagePath)) {
      const pageData = this.pageDataDb.get(pagePath);

      if (true) {
        return Promise.resolve(pageData);
      }
    }

    return this.fetchPageDataJson({
      pagePath
    }).then(pageData => {
      this.pageDataDb.set(pagePath, pageData);
      return pageData;
    });
  }

  findMatchPath(rawPath) {
    return (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findMatchPath)(rawPath);
  } // TODO check all uses of this and whether they use undefined for page resources not exist


  loadPage(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);

    if (this.pageDb.has(pagePath)) {
      const page = this.pageDb.get(pagePath);

      if (true) {
        if (page.error) {
          return {
            error: page.error,
            status: page.status
          };
        }

        return Promise.resolve(page.payload);
      }
    }

    if (this.inFlightDb.has(pagePath)) {
      return this.inFlightDb.get(pagePath);
    }

    const inFlightPromise = Promise.all([this.loadAppData(), this.loadPageDataJson(pagePath)]).then(allData => {
      const result = allData[1];

      if (result.status === PageResourceStatus.Error) {
        return {
          status: PageResourceStatus.Error
        };
      }

      let pageData = result.payload;
      const {
        componentChunkName,
        staticQueryHashes = []
      } = pageData;
      const finalResult = {}; // In develop we have separate chunks for template and Head components
      // to enable HMR (fast refresh requires single exports).
      // In production we have shared chunk with both exports. Double loadComponent here
      // will be deduped by webpack runtime resulting in single request and single module
      // being loaded for both `component` and `head`.

      const componentChunkPromise = Promise.all([this.loadComponent(componentChunkName), this.loadComponent(componentChunkName, `head`)]).then(([component, head]) => {
        finalResult.createdAt = new Date();
        let pageResources;

        if (!component || component instanceof Error) {
          finalResult.status = PageResourceStatus.Error;
          finalResult.error = component;
        } else {
          finalResult.status = PageResourceStatus.Success;

          if (result.notFound === true) {
            finalResult.notFound = true;
          }

          pageData = Object.assign(pageData, {
            webpackCompilationHash: allData[0] ? allData[0].webpackCompilationHash : ``
          });
          pageResources = toPageResources(pageData, component, head);
        } // undefined if final result is an error


        return pageResources;
      });
      const staticQueryBatchPromise = Promise.all(staticQueryHashes.map(staticQueryHash => {
        // Check for cache in case this static query result has already been loaded
        if (this.staticQueryDb[staticQueryHash]) {
          const jsonPayload = this.staticQueryDb[staticQueryHash];
          return {
            staticQueryHash,
            jsonPayload
          };
        }

        return this.memoizedGet(`${""}/page-data/sq/d/${staticQueryHash}.json`).then(req => {
          const jsonPayload = JSON.parse(req.responseText);
          return {
            staticQueryHash,
            jsonPayload
          };
        }).catch(() => {
          throw new Error(`We couldn't load "${""}/page-data/sq/d/${staticQueryHash}.json"`);
        });
      })).then(staticQueryResults => {
        const staticQueryResultsMap = {};
        staticQueryResults.forEach(({
          staticQueryHash,
          jsonPayload
        }) => {
          staticQueryResultsMap[staticQueryHash] = jsonPayload;
          this.staticQueryDb[staticQueryHash] = jsonPayload;
        });
        return staticQueryResultsMap;
      });
      return Promise.all([componentChunkPromise, staticQueryBatchPromise]).then(([pageResources, staticQueryResults]) => {
        let payload;

        if (pageResources) {
          payload = { ...pageResources,
            staticQueryResults
          };
          finalResult.payload = payload;
          _emitter__WEBPACK_IMPORTED_MODULE_1__["default"].emit(`onPostLoadPageResources`, {
            page: payload,
            pageResources: payload
          });
        }

        this.pageDb.set(pagePath, finalResult);

        if (finalResult.error) {
          return {
            error: finalResult.error,
            status: finalResult.status
          };
        }

        return payload;
      }) // when static-query fail to load we throw a better error
      .catch(err => {
        return {
          error: err,
          status: PageResourceStatus.Error
        };
      });
    });
    inFlightPromise.then(() => {
      this.inFlightDb.delete(pagePath);
    }).catch(error => {
      this.inFlightDb.delete(pagePath);
      throw error;
    });
    this.inFlightDb.set(pagePath, inFlightPromise);
    return inFlightPromise;
  } // returns undefined if the page does not exists in cache


  loadPageSync(rawPath, options = {}) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);

    if (this.pageDb.has(pagePath)) {
      const pageData = this.pageDb.get(pagePath);

      if (pageData.payload) {
        return pageData.payload;
      }

      if (options !== null && options !== void 0 && options.withErrorDetails) {
        return {
          error: pageData.error,
          status: pageData.status
        };
      }
    }

    return undefined;
  }

  shouldPrefetch(pagePath) {
    // Skip prefetching if we know user is on slow or constrained connection
    if (!doesConnectionSupportPrefetch()) {
      return false;
    } // Don't prefetch if this is a crawler bot


    if (navigator.userAgent && BOT_REGEX.test(navigator.userAgent)) {
      return false;
    } // Check if the page exists.


    if (this.pageDb.has(pagePath)) {
      return false;
    }

    return true;
  }

  prefetch(pagePath) {
    if (!this.shouldPrefetch(pagePath)) {
      return {
        then: resolve => resolve(false),
        abort: () => {}
      };
    }

    if (this.prefetchTriggered.has(pagePath)) {
      return {
        then: resolve => resolve(true),
        abort: () => {}
      };
    }

    const defer = {
      resolve: null,
      reject: null,
      promise: null
    };
    defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    this.prefetchQueued.push([pagePath, defer]);
    const abortC = new AbortController();
    abortC.signal.addEventListener(`abort`, () => {
      const index = this.prefetchQueued.findIndex(([p]) => p === pagePath); // remove from the queue

      if (index !== -1) {
        this.prefetchQueued.splice(index, 1);
      }
    });

    if (!this.isPrefetchQueueRunning) {
      this.isPrefetchQueueRunning = true;
      setTimeout(() => {
        this._processNextPrefetchBatch();
      }, 3000);
    }

    return {
      then: (resolve, reject) => defer.promise.then(resolve, reject),
      abort: abortC.abort.bind(abortC)
    };
  }

  _processNextPrefetchBatch() {
    const idleCallback = window.requestIdleCallback || (cb => setTimeout(cb, 0));

    idleCallback(() => {
      const toPrefetch = this.prefetchQueued.splice(0, 4);
      const prefetches = Promise.all(toPrefetch.map(([pagePath, dPromise]) => {
        // Tell plugins with custom prefetching logic that they should start
        // prefetching this path.
        if (!this.prefetchTriggered.has(pagePath)) {
          this.apiRunner(`onPrefetchPathname`, {
            pathname: pagePath
          });
          this.prefetchTriggered.add(pagePath);
        } // If a plugin has disabled core prefetching, stop now.


        if (this.prefetchDisabled) {
          return dPromise.resolve(false);
        }

        return this.doPrefetch((0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(pagePath)).then(() => {
          if (!this.prefetchCompleted.has(pagePath)) {
            this.apiRunner(`onPostPrefetchPathname`, {
              pathname: pagePath
            });
            this.prefetchCompleted.add(pagePath);
          }

          dPromise.resolve(true);
        });
      }));

      if (this.prefetchQueued.length) {
        prefetches.then(() => {
          setTimeout(() => {
            this._processNextPrefetchBatch();
          }, 3000);
        });
      } else {
        this.isPrefetchQueueRunning = false;
      }
    });
  }

  doPrefetch(pagePath) {
    const pageDataUrl = createPageDataUrl(pagePath);
    return (0,_prefetch__WEBPACK_IMPORTED_MODULE_0__["default"])(pageDataUrl, {
      crossOrigin: `anonymous`,
      as: `fetch`
    }).then(() => // This was just prefetched, so will return a response from
    // the cache instead of making another request to the server
    this.loadPageDataJson(pagePath));
  }

  hovering(rawPath) {
    this.loadPage(rawPath);
  }

  getResourceURLsForPathname(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);
    const page = this.pageDataDb.get(pagePath);

    if (page) {
      const pageResources = toPageResources(page.payload);
      return [...createComponentUrls(pageResources.page.componentChunkName), createPageDataUrl(pagePath)];
    } else {
      return null;
    }
  }

  isPageNotFound(rawPath) {
    const pagePath = (0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(rawPath);
    const page = this.pageDb.get(pagePath);
    return !page || page.notFound;
  }

  loadAppData(retries = 0) {
    return this.memoizedGet(`${""}/page-data/app-data.json`).then(req => {
      const {
        status,
        responseText
      } = req;
      let appData;

      if (status !== 200 && retries < 3) {
        // Retry 3 times incase of non-200 responses
        return this.loadAppData(retries + 1);
      } // Handle 200


      if (status === 200) {
        try {
          const jsonPayload = JSON.parse(responseText);

          if (jsonPayload.webpackCompilationHash === undefined) {
            throw new Error(`not a valid app-data response`);
          }

          appData = jsonPayload;
        } catch (err) {// continue regardless of error
        }
      }

      return appData;
    });
  }

}

const createComponentUrls = componentChunkName => (window.___chunkMapping[componentChunkName] || []).map(chunk => "" + chunk);

class ProdLoader extends BaseLoader {
  constructor(asyncRequires, matchPaths, pageData) {
    const loadComponent = chunkName => {
      if (!asyncRequires.components[chunkName]) {
        throw new Error(`We couldn't find the correct component chunk with the name ${chunkName}`);
      }

      return asyncRequires.components[chunkName]() // loader will handle the case when component is error
      .catch(err => err);
    };

    super(loadComponent, matchPaths);

    if (pageData) {
      this.pageDataDb.set((0,_find_path__WEBPACK_IMPORTED_MODULE_2__.findPath)(pageData.path), {
        pagePath: pageData.path,
        payload: pageData,
        status: `success`
      });
    }
  }

  doPrefetch(pagePath) {
    return super.doPrefetch(pagePath).then(result => {
      if (result.status !== PageResourceStatus.Success) {
        return Promise.resolve();
      }

      const pageData = result.payload;
      const chunkName = pageData.componentChunkName;
      const componentUrls = createComponentUrls(chunkName);
      return Promise.all(componentUrls.map(_prefetch__WEBPACK_IMPORTED_MODULE_0__["default"])).then(() => pageData);
    });
  }

  loadPageDataJson(rawPath) {
    return super.loadPageDataJson(rawPath).then(data => {
      if (data.notFound) {
        // check if html file exist using HEAD request:
        // if it does we should navigate to it instead of showing 404
        return doFetch(rawPath, `HEAD`).then(req => {
          if (req.status === 200) {
            // page (.html file) actually exist (or we asked for 404 )
            // returning page resources status as errored to trigger
            // regular browser navigation to given page
            return {
              status: PageResourceStatus.Error
            };
          } // if HEAD request wasn't 200, return notFound result
          // and show 404 page


          return data;
        });
      }

      return data;
    });
  }

}
let instance;
const setLoader = _loader => {
  instance = _loader;
};
const publicLoader = {
  enqueue: rawPath => instance.prefetch(rawPath),
  // Real methods
  getResourceURLsForPathname: rawPath => instance.getResourceURLsForPathname(rawPath),
  loadPage: rawPath => instance.loadPage(rawPath),
  // TODO add deprecation to v4 so people use withErrorDetails and then we can remove in v5 and change default behaviour
  loadPageSync: (rawPath, options = {}) => instance.loadPageSync(rawPath, options),
  prefetch: rawPath => instance.prefetch(rawPath),
  isPageNotFound: rawPath => instance.isPageNotFound(rawPath),
  hovering: rawPath => instance.hovering(rawPath),
  loadAppData: () => instance.loadAppData()
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (publicLoader);
function getStaticQueryResults() {
  if (instance) {
    return instance.staticQueryDb;
  } else {
    return {};
  }
}

/***/ }),

/***/ "./.cache/normalize-page-path.js":
/*!***************************************!*\
  !*** ./.cache/normalize-page-path.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pathAndSearch => {
  if (pathAndSearch === undefined) {
    return pathAndSearch;
  }

  let [path, search = ``] = pathAndSearch.split(`?`);

  if (search) {
    search = `?` + search;
  }

  if (path === `/`) {
    return `/` + search;
  }

  if (path.charAt(path.length - 1) === `/`) {
    return path.slice(0, -1) + search;
  }

  return path + search;
});

/***/ }),

/***/ "./.cache/prefetch.js":
/*!****************************!*\
  !*** ./.cache/prefetch.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const support = function (feature) {
  if (typeof document === `undefined`) {
    return false;
  }

  const fakeLink = document.createElement(`link`);

  try {
    if (fakeLink.relList && typeof fakeLink.relList.supports === `function`) {
      return fakeLink.relList.supports(feature);
    }
  } catch (err) {
    return false;
  }

  return false;
};

const linkPrefetchStrategy = function (url, options) {
  return new Promise((resolve, reject) => {
    if (typeof document === `undefined`) {
      reject();
      return;
    }

    const link = document.createElement(`link`);
    link.setAttribute(`rel`, `prefetch`);
    link.setAttribute(`href`, url);
    Object.keys(options).forEach(key => {
      link.setAttribute(key, options[key]);
    });
    link.onload = resolve;
    link.onerror = reject;
    const parentElement = document.getElementsByTagName(`head`)[0] || document.getElementsByName(`script`)[0].parentNode;
    parentElement.appendChild(link);
  });
};

const xhrPrefetchStrategy = function (url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(`GET`, url, true);

    req.onload = () => {
      if (req.status === 200) {
        resolve();
      } else {
        reject();
      }
    };

    req.send(null);
  });
};

const supportedPrefetchStrategy = support(`prefetch`) ? linkPrefetchStrategy : xhrPrefetchStrategy;
const preFetched = {};

const prefetch = function (url, options) {
  return new Promise(resolve => {
    if (preFetched[url]) {
      resolve();
      return;
    }

    supportedPrefetchStrategy(url, options).then(() => {
      resolve();
      preFetched[url] = true;
    }).catch(() => {}); // 404s are logged to the console anyway
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prefetch);

/***/ }),

/***/ "./.cache/public-page-renderer.js":
/*!****************************************!*\
  !*** ./.cache/public-page-renderer.js ***!
  \****************************************/
/***/ ((module) => {

const preferDefault = m => m && m.default || m;

if (false) {} else if (false) {} else {
  module.exports = () => null;
}

/***/ }),

/***/ "./.cache/redirect-utils.js":
/*!**********************************!*\
  !*** ./.cache/redirect-utils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "maybeGetBrowserRedirect": () => (/* binding */ maybeGetBrowserRedirect)
/* harmony export */ });
/* harmony import */ var _redirects_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./redirects.json */ "./.cache/redirects.json");
 // Convert to a map for faster lookup in maybeRedirect()

const redirectMap = new Map();
const redirectIgnoreCaseMap = new Map();
_redirects_json__WEBPACK_IMPORTED_MODULE_0__.forEach(redirect => {
  if (redirect.ignoreCase) {
    redirectIgnoreCaseMap.set(redirect.fromPath, redirect);
  } else {
    redirectMap.set(redirect.fromPath, redirect);
  }
});
function maybeGetBrowserRedirect(pathname) {
  let redirect = redirectMap.get(pathname);

  if (!redirect) {
    redirect = redirectIgnoreCaseMap.get(pathname.toLowerCase());
  }

  return redirect;
}

/***/ }),

/***/ "./.cache/strip-prefix.js":
/*!********************************!*\
  !*** ./.cache/strip-prefix.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ stripPrefix)
/* harmony export */ });
/**
 * Remove a prefix from a string. Return the input string if the given prefix
 * isn't found.
 */
function stripPrefix(str, prefix = ``) {
  if (!prefix) {
    return str;
  }

  if (str === prefix) {
    return `/`;
  }

  if (str.startsWith(`${prefix}/`)) {
    return str.slice(prefix.length);
  }

  return str;
}

/***/ }),

/***/ "./src/components/About.tsx":
/*!**********************************!*\
  !*** ./src/components/About.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ About)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");


function About() {
  const {
    findElementByKey
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_1__.useThemeContext)();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "wrapper bg-light",
    id: "nav_a_propos"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container py-2 py-md-16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gy-10 gy-sm-13 gx-md-8 gx-xl-12 align-items-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gx-md-5 gy-5"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("figure", {
    className: "rounded mx-5"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/about-us.svg",
    srcSet: "/img/photos/g8@2x.jpg 2x",
    alt: ""
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("figure", {
    className: "rounded"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/Good team-pana.svg",
    srcSet: "/img/photos/g9@2x.jpg 2x",
    alt: ""
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("figure", {
    className: "rounded"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/Back to back-pana.svg",
    srcSet: "/img/photos/g10@2x.jpg 2x",
    alt: ""
  }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", {
    className: "fs-16 text-uppercase text-center text-dark mb-3"
  }, findElementByKey('title_about')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "display-3 mb-10 text-center"
  }, findElementByKey('description_about1'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "fade-in"
  }, findElementByKey('description_about2'), ' '), findElementByKey('description_about')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gy-8"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/geo-fill.svg",
    className: "icon-svg icon-svg-xs solid-mono text-fuchsia me-4",
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "mb-1"
  }, ' ', findElementByKey('title_about1')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('description_titre1'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/person-hearts.svg",
    className: "icon-svg icon-svg-xs solid-mono text-violet me-4",
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "mb-1"
  }, findElementByKey('title_about2')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('description_titre2'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/shield-fill-check.svg",
    className: "icon-svg icon-svg-xs solid-mono text-orange me-4",
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "mb-1"
  }, findElementByKey('title_about3')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('description_titre3'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/crown-23.svg",
    className: "icon-svg icon-svg-xs solid-mono text-green me-4",
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "mb-1"
  }, findElementByKey('title_about4')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('description_titre4'))))))))));
}

/***/ }),

/***/ "./src/components/Contact.tsx":
/*!************************************!*\
  !*** ./src/components/Contact.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Contact)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");


function Contact() {
  const {
    findElementByKey
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_1__.useThemeContext)();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "wrapper bg-light",
    id: "nav_contact"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gx-3 gy-md-16 gy-8 mb-15 mb-md-18 align-items-center",
    id: "contact"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("figure", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    className: "img-fluid",
    src: "/img/3d3.png",
    srcSet: "/img/3d3@2x.png 2x",
    alt: ""
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-lg-5 ",
    style: {
      marginLeft: '3%'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", {
    className: "fs-16 text-uppercase text-dark mb-3 titleBlack"
  }, findElementByKey('contact_titre')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "display-4 mb-8"
  }, findElementByKey('contact_description')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/pin.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4",
    style: {
      width: '1.5rem',
      height: '1.5rem'
    },
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "mb-0"
  }, findElementByKey('contact_addresse')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("address", null, findElementByKey('addresse_value')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/rotary.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4",
    style: {
      width: '1.5rem',
      height: '1.5rem'
    },
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "mb-0"
  }, findElementByKey('contact_telephone')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("address", null, findElementByKey('telephone_value')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/emails.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4",
    style: {
      width: '1.5rem',
      height: '1.5rem'
    },
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "mb-0"
  }, findElementByKey('contact_email')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("address", null, ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "mailto:bill@blackwalker.com",
    className: "link-body"
  }, findElementByKey('email_value'))))))))));
}

/***/ }),

/***/ "./src/components/EstimationCar.tsx":
/*!******************************************!*\
  !*** ./src/components/EstimationCar.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EstimationCar)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_4239228642_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/4239228642.json */ "./public/page-data/sq/d/4239228642.json");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");



const queryAsset = "4239228642";
function EstimationCar() {
  const staticQuery = _public_page_data_sq_d_4239228642_json__WEBPACK_IMPORTED_MODULE_0__.data;
  const cars = staticQuery.allStrapiBwImage.nodes;
  const {
    findElementByKey
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_2__.useThemeContext)();
  const {
    0: selectedCar,
    1: setSelectedCar
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('prado-car');
  const {
    0: totalPrice,
    1: setTotalPrice
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(50000);
  const {
    0: numberDays,
    1: setNumberDays
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  const {
    0: locationReservation,
    1: setLocationReservation
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('enVille');
  const {
    0: dayTown,
    1: setDayTown
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  const {
    0: dayOutTown,
    1: setDayOutTown
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  const {
    0: slideIndex,
    1: setSlideIndex
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  let slides, dots;

  if (typeof window !== 'undefined') {
    slides = document.getElementsByClassName('mySlides');
    dots = document.getElementsByClassName('dot');
  }

  const {
    0: check,
    1: setCheck
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);

  const handleChange = event => {
    setLocationReservation(event.target.value);

    if (numberDays > 2) {
      setDayOutTown(1);
      setDayTown(numberDays - 1);
    } else {
      setDayOutTown(1);
      setDayTown(1);
    }

    setNumberDays(numberDays);
  };

  const resetPrice = () => {
    cars.map((car, i) => {
      if (locationReservation === 'enVille') {
        if (selectedCar === car.key) setTotalPrice(numberDays * car.price);
      } else if (locationReservation === 'horsVille') {
        if (selectedCar === car.key) setTotalPrice(numberDays * car.price + numberDays * 10000);
      } else {
        if (selectedCar === car.key) setTotalPrice(car.price + dayTown * car.price + dayTown * 10000);
      }
    });
  };

  const nextSlide = n => {
    setSlideIndex(slideIndex + n);
  };

  const prevSlide = n => {
    setSlideIndex(slideIndex - n);
  };

  const currentSlide = n => {
    setSlideIndex(n);
  };

  const showSlides = n => {
    if (n > slides.length) {
      setSlideIndex(1);
    }

    if (n < 1) {
      setSlideIndex(slides.length);
    }

    setCheck(n++);
  };

  const changeSlide = () => {
    let i;

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' activeSlide', '');
    }

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' activeSlide';
  };

  const changeSlideSelect = key => {
    cars.map((car, i) => {
      if (car.key === key) {
        setSlideIndex(++i);
      }
    });
  };

  const calculateTotalPrice = key => {
    cars.map((car, i) => {
      if (car.key === key) {
        let carPrice = car.price;

        if (locationReservation === 'enVille') {
          carPrice = carPrice * numberDays;
          setTotalPrice(carPrice);
        } else if (locationReservation === 'horsVille') {
          setTotalPrice(carPrice * numberDays + 10000 * numberDays);
        } else {
          carPrice = carPrice * dayTown + carPrice * dayOutTown + 10000 * dayOutTown;
          setTotalPrice(carPrice);
        }
      }
    });
  };

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    showSlides(slideIndex);
    cars.map((car, i) => {
      if (slideIndex === ++i) {
        setSelectedCar(car.key);
      }
    });
  }, [slideIndex]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    changeSlide();
  }, [check]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    changeSlideSelect(selectedCar);
    calculateTotalPrice(selectedCar);
  }, [selectedCar, numberDays, dayOutTown, dayTown]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    resetPrice();
  }, [locationReservation]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setNumberDays(dayOutTown + dayTown);
  }, [dayOutTown, dayTown]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (numberDays > 30) {
      setNumberDays(30);
    }

    if (dayOutTown + dayTown > 30) {
      setDayTown(1);
      setDayOutTown(29);
    }

    if (numberDays < 1 || dayOutTown < 1 || dayTown < 1 || String(numberDays) == 'NaN' || String(dayOutTown) == 'NaN' || String(dayTown) == 'NaN') {
      setDayTown(1);
      setDayOutTown(1);
      setNumberDays(1);
    }
  }, [numberDays, dayOutTown, dayTown]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("section", {
    className: "wrapper bg-dark bg-content text-black d-flex active"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "container d-flex justify-content-center flex-column my-6",
    style: {
      zIndex: 5,
      position: 'relative'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    id: "nav_estimation",
    className: "d-flex row align-items-center justify-content-between"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h1", {
    className: "title text--dark text-center text-uppercase"
  }, findElementByKey('estimation_cout_titre')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "col-10 col-md-6 col-lg-5 flex-grow-1 flex-grow-lg-0 content  text-lg-start",
    "data-group": "page-title"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "d-flex col-12 col-lg-8 justify-content-center justify-content-md-between"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("form", {
    action: "/"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    htmlFor: "feedback-user",
    className: "form-label"
  }, findElementByKey('label_choix_vehicule')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("select", {
    className: "form-select",
    "aria-label": "Default select example",
    onChange: e => {
      setSelectedCar(e.target.value);
    },
    value: selectedCar
  }, cars.map((car, i) => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("option", {
      key: i,
      value: car.key
    }, car.model);
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: ""
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    htmlFor: "feedback-user",
    className: "form-label d-block"
  }, findElementByKey('label_booking_options')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "d-flex flex-wrap"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "form-check form-check-inline",
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", {
    className: "form-check-input",
    type: "radio",
    id: "flexRadioDefault1",
    checked: locationReservation === 'enVille',
    value: "enVille",
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    className: "form-check-label",
    htmlFor: "flexRadioDefault1"
  }, findElementByKey('label_en_ville'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "form-check form-check-inline",
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", {
    className: "form-check-input",
    type: "radio",
    id: "flexRadioDefault2",
    onChange: handleChange,
    value: "horsVille",
    checked: locationReservation === 'horsVille'
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    className: "form-check-label",
    htmlFor: "flexRadioDefault2"
  }, findElementByKey('label_hors_ville'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "form-check form-check-inline",
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", {
    className: "form-check-input",
    type: "radio",
    id: "flexRadioDefault2",
    onChange: handleChange,
    value: "lesDeux",
    checked: locationReservation === 'lesDeux'
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    className: "form-check-label",
    htmlFor: "flexRadioDefault2"
  }, findElementByKey('label_les_deux'))))), locationReservation !== 'lesDeux' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    htmlFor: "feedback-user",
    className: "form-label"
  }, findElementByKey('label_nombre_jour')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", {
    type: "number",
    className: "form-control",
    id: "email",
    value: numberDays,
    placeholder: `${findElementByKey('label_nombre_jour')}`,
    name: "email",
    min: 1,
    max: 30,
    onChange: e => {
      setNumberDays(parseFloat(e.target.value));
    },
    disabled: locationReservation === 'lesDeux'
  })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "form-group col-12 col-md-6 col-lg-5"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    htmlFor: "feedback-user",
    className: "form-label"
  }, findElementByKey('label_nombre_jour_en_ville')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", {
    type: "number",
    className: "form-control",
    id: "email",
    value: dayTown,
    placeholder: `${findElementByKey('label_nombre_jour_en_ville')}`,
    name: "email",
    min: 1,
    max: 29,
    onChange: e => {
      setDayTown(parseFloat(e.target.value));
    },
    disabled: locationReservation !== 'lesDeux'
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "form-group col-12 col-md-6 col-lg-5"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", {
    htmlFor: "feedback-user",
    className: "form-label"
  }, findElementByKey('label_nombre_jour_hors_ville')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", {
    type: "number",
    className: "form-control",
    id: "email",
    value: dayOutTown,
    placeholder: `${findElementByKey('label_nombre_jour_hors_ville')}`,
    name: "email",
    min: 1,
    max: 29,
    onChange: e => {
      setDayOutTown(parseFloat(e.target.value));
    },
    disabled: locationReservation !== 'lesDeux'
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
    style: {
      fontSize: '0.75rem'
    },
    className: "msg_add_price_outTown"
  }, findElementByKey('msg_add_price_outTown')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "d-flex mt-4 align-items-center flex-column justify-content-between"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    style: {
      color: 'white',
      fontSize: 'larger'
    }
  }, findElementByKey('texte_total_estimation'), "\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", null, locationReservation === 'lesDeux' ? dayTown + dayOutTown : numberDays), "\xA0", findElementByKey('texte_total_estimation_suite'), "\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
    style: {
      fontSize: '12px'
    }
  }, ":\xA0", findElementByKey('monnaie_value')), ' ', totalPrice), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "mt-4 d-none d-lg-block",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("li", {
    className: "nav-item mt-4 btn-nav_reserver list-unstyled mt-lg-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "https://www.blackwalker.com/book-a-car/",
    className: "btn btn-md btn-light rounded nav-link",
    style: {
      color: '#343f52',
      width: '100%'
    }
  }, findElementByKey('nav_reserver')))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "col-md-5 offset-md-1 mt-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "card shadow-xl mt-md-n1 ",
    "data-nav": "true",
    "data-margin": "5"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "slideshow-container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null, cars.map((car, i) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "mySlides",
    key: i
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "numbertext"
  }, i + 1, " / ", cars.length), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("img", {
    className: "rounded d-block w-100",
    style: {
      width: '100%'
    },
    alt: "Image car",
    src: car.car_image.url
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("img", {
    src: "/img/toyota.png",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3",
    style: {
      width: '1.5rem',
      height: '1.5rem'
    },
    alt: ""
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "brand",
    style: {
      fontSize: 'bold'
    }
  }, car.brand), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "model"
  }, car.model))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    className: "prev",
    onClick: () => prevSlide(1)
  }, "\u276E"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    className: "next",
    onClick: () => nextSlide(1)
  }, "\u276F"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, cars.map((car, i) => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
      key: i,
      className: "dot",
      onClick: () => currentSlide(++i)
    });
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: "mt-4 d-block d-lg-none",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("li", {
    className: "nav-item mt-4 btn-nav_reserver list-unstyled mt-lg-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    href: "https://www.blackwalker.com/book-a-car/",
    className: "btn btn-md btn-light rounded nav-link",
    style: {
      color: '#343f52',
      width: '100%'
    }
  }, findElementByKey('nav_reserver'))))))));
}

/***/ }),

/***/ "./src/components/Footer.tsx":
/*!***********************************!*\
  !*** ./src/components/Footer.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");



const Footer = () => {
  const {
    findElementByKey,
    currentLanguage,
    setLanguage
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_1__.useThemeContext)();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("footer", {
    className: "bg-dark text-white"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container py-13 py-md-15"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gy-6 gy-lg-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4 col-lg-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "widget-title text-white mb-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", {
    className: "pe-xl-15 pe-xxl-17"
  }, "Logo"), ' ')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4 col-lg-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "widget"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "widget-title text-white  mb-3"
  }, findElementByKey('contact_us_footer')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row align-items-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/emails1.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4",
    style: {
      width: '1rem',
      height: '1rem'
    },
    alt: ""
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "mailto:bill@blackwalker.com",
    className: "link-body text-white"
  }, findElementByKey('email_value'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row align-items-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/rotary1.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-4",
    style: {
      width: '1rem',
      height: '1rem'
    },
    alt: ""
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "text-white",
    href: "tel:+237 698819611"
  }, findElementByKey('telephone_value'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4 col-lg-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "widget"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "widget-title text-white  mb-3"
  }, findElementByKey('learn_more_footer')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: "list-unstyled  mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "link scroll",
    href: "#nav_a_propos"
  }, findElementByKey('a_propos_footer'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "link scroll",
    href: "#nav_contact"
  }, findElementByKey('contact_us_footer'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "link scroll",
    href: "#nav_service"
  }, findElementByKey('nos_service_footer')))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-12 col-lg-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "widget"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h4", {
    className: "widget-title text-white  mb-3"
  }, findElementByKey('notre_bulletin_footer')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-5"
  }, findElementByKey('texte_bulletin_note_footer')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "newsletter-wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    id: "mc_embed_signup2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
    id: "mc-embedded-subscribe-form2",
    name: "mc-embedded-subscribe-form",
    className: "validate ",
    target: "_blank",
    noValidate: true
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    id: "mc_embed_signup_scroll2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "mc-field-group input-group form-floating"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
    type: "email",
    name: "EMAIL",
    className: "required email form-control",
    placeholder: "ADDRESSE EMAIL",
    id: "mce-EMAIL2"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
    htmlFor: "mce-EMAIL2"
  }, findElementByKey('address_mail_footer')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    name: "subscribe",
    id: "mc-embedded-subscribe2",
    className: "btn btn-dark btn-hover"
  }, findElementByKey('rejoindre_footer'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    id: "mce-responses2",
    className: "clear"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "response",
    id: "mce-error-response2",
    style: {
      display: 'none'
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "response",
    id: "mce-success-response2",
    style: {
      display: 'none'
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    style: {
      position: 'absolute',
      left: '-5000px'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
    type: "text",
    name: "b_ddc180777a163e0f9f66ee014_4b1bcfa0bc",
    tabIndex: -1,
    defaultValue: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "clear"
  })))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gy-6 gy-lg-0",
    style: {
      marginTop: '30px'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-5 col-lg-4 col-xl-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", {
    className: "nav social "
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/square-facebook-brands.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3",
    style: {
      width: '1rem',
      height: '1rem'
    },
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/linkedin-brands.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3",
    style: {
      width: '1rem',
      height: '1rem'
    },
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/square-twitter-brands.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3",
    style: {
      width: '1rem',
      height: '1rem'
    },
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/square-youtube-brands.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3",
    style: {
      width: '1rem',
      height: '1rem'
    },
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/square-instagram-brands.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3",
    style: {
      width: '1rem',
      height: '1rem'
    },
    alt: ""
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-12 col-md-7 col-lg-6 col-xl-5 d-flex mt-1"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", {
    className: "nav social flex-column flex-md-row d-flex"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    onClick: () => setLanguage(),
    className: "nav-link border-0 bg-transparent p-0 d-flex",
    style: {
      color: 'white'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/globe-solid.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-2",
    style: {
      width: '0.9rem',
      height: '0.9rem'
    },
    alt: ""
  }), ' ', currentLanguage)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex mx-0 mx-md-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/location-dot-solid.svg",
    className: "icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-2",
    style: {
      width: '0.9rem',
      height: '0.9rem'
    },
    alt: ""
  }), findElementByKey('addresse_value')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-12 col-lg-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex justify-content-center flex-column flex-xl-row align-items-start align-items-lg-center justify-content-lg-start",
    "data-cues": "slideInDown",
    "data-group": "page-title-buttons",
    "data-delay": "200"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "btn btn-dark btn-icon btn-icon-start rounded me-2 btn-footer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
    className: "uil uil-apple"
  }), " App Store")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "mt-4 mt-xl-0 googlePlay"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "btn btn-dark btn-icon btn-icon-start rounded btn-footer"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
    className: "uil uil-google-play"
  }), " Google Play"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gy-8 gy-lg-0",
    style: {
      marginTop: '60px'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    style: {
      fontSize: '12px',
      fontWeight: '300'
    }
  }, findElementByKey('copyright_footer'), "\xA0", findElementByKey('text_copyright'))))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer);

/***/ }),

/***/ "./src/components/Home.tsx":
/*!*********************************!*\
  !*** ./src/components/Home.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Home)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");


function Home() {
  const {
    findElementByKey,
    currentLanguage
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_1__.useThemeContext)();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "wrapper bg-gradient-dark",
    id: "nav_accueil"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container d-flex flex-column flex-lg-row pt-5 pb-15 py-lg-12 py-xl-14 mx-0 align-items-center justify-space-between"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-8 col-12",
    style: {
      marginTop: '64px'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/Component 6.svg",
    srcSet: "/img/Component 6.svg",
    "data-cue": "fadeIn",
    alt: "",
    style: {
      width: '100%'
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "text-center text-lg-start row col-12 col-lg-6 mt-4 mt-lg-4",
    "data-cues": "slideInDown",
    "data-group": "page-title",
    "data-delay": "600",
    style: {
      animationName: 'slideInDown',
      animationDuration: '700ms',
      animationTimingFunction: 'ease',
      animationDelay: '1200ms',
      animationDirection: 'normal',
      animationFillMode: 'both'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", {
    className: "display-2 mb-4 mx-sm-n2 mx-md-0 px-lg-0"
  }, findElementByKey('header_title'), " \xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, currentLanguage === 'FR' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "typer text-secondary text-nowrap",
    "data-delay": "100",
    "data-words": "simplicit\xE9.,s\xE9curit\xE9.,fiabilit\xE9.",
    style: {
      color: 'black'
    }
  }, "fast tr") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "typer text-secondary text-nowrap",
    "data-delay": "100",
    "data-words": "simplicity.,security.,fiability.",
    style: {
      color: 'black'
    }
  }, "fast tr"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "cursor text-secondary",
    "data-owner": "typer",
    style: {
      transition: 'all 0.1s ease 0s',
      opacity: '1'
    }
  }, "|"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "lead fs-lg mb-7 px-md-10 px-lg-0"
  }, findElementByKey('header_description')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex justify-content-center justify-content-lg-start p-0",
    "data-group": "page-title-buttons"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "btn-home"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "btn btn-dark btn-icon btn-icon-start rounded me-2 btn-home"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
    className: "uil uil-apple"
  }), " App Store")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
    className: "btn-home"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "btn btn-dark btn-icon btn-icon-start rounded btn-home"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
    className: "uil uil-google-play"
  }), " Google Play"))))));
}

/***/ }),

/***/ "./src/components/Layout.tsx":
/*!***********************************!*\
  !*** ./src/components/Layout.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_page_data_sq_d_1888145826_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../public/page-data/sq/d/1888145826.json */ "./public/page-data/sq/d/1888145826.json");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Navbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Navbar */ "./src/components/Navbar.tsx");
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Footer */ "./src/components/Footer.tsx");
/* harmony import */ var _static_css_plugins_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../static/css/plugins.css */ "./static/css/plugins.css");
/* harmony import */ var _static_css_plugins_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_static_css_plugins_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _static_css_style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../static/css/style.css */ "./static/css/style.css");
/* harmony import */ var _static_css_style_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_static_css_style_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _static_css_colors_aqua_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../static/css/colors/aqua.css */ "./static/css/colors/aqua.css");
/* harmony import */ var _static_css_colors_aqua_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_static_css_colors_aqua_css__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _static_css_fonts_thicccboi_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../static/css/fonts/thicccboi.css */ "./static/css/fonts/thicccboi.css");
/* harmony import */ var _static_css_fonts_thicccboi_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_static_css_fonts_thicccboi_css__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _style_style_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../style/style.css */ "./src/style/style.css");
/* harmony import */ var _style_style_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_style_style_css__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! gatsby */ "./.cache/gatsby-browser-entry.js");
/* harmony import */ var _Test__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Test */ "./src/components/Test.tsx");
/* harmony import */ var _utils_format__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/format */ "./src/utils/format.tsx");
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");













const queryAsset = "1888145826";

const Layout = ({
  children
}) => {
  if (typeof window !== 'undefined') {
    document.body.setAttribute('data-bs-spy', 'scroll');
  }

  const {
    0: jqueyLoaded,
    1: setJqueryLoaded
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const {
    0: pluginLoaded,
    1: setPluginLoaded
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const staticQuery = _public_page_data_sq_d_1888145826_json__WEBPACK_IMPORTED_MODULE_0__.data;
  const assets = staticQuery.allStrapiBwAsset.nodes;
  const {
    setValue
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(_utils_dataContext__WEBPACK_IMPORTED_MODULE_12__.datasContext);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setValue((0,_utils_format__WEBPACK_IMPORTED_MODULE_11__["default"])(assets));
  }, []);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_9__.Script, {
    src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
    integrity: "sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==",
    crossOrigin: "anonymous",
    onLoad: () => setJqueryLoaded(true)
  }), jqueyLoaded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_9__.Script, {
    src: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
    integrity: "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p",
    crossOrigin: "anonymous"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_9__.Script, {
    src: "/plugins.js",
    onLoad: () => setPluginLoaded(true)
  }), pluginLoaded && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(gatsby__WEBPACK_IMPORTED_MODULE_9__.Script, {
    src: "/theme.js"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Navbar__WEBPACK_IMPORTED_MODULE_2__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Test__WEBPACK_IMPORTED_MODULE_10__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null, children), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Footer__WEBPACK_IMPORTED_MODULE_3__["default"], null)));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layout);

/***/ }),

/***/ "./src/components/Navbar.tsx":
/*!***********************************!*\
  !*** ./src/components/Navbar.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");



const NavBar = () => {
  const {
    findElementByKey,
    currentLanguage,
    setLanguage
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_1__.useThemeContext)(); // const handleNav = () => {
  //   console.log('handleNav')
  //   $('.navbar-nav').on('click', function () {
  //     $('.nav-item a').find('.active').removeClass('active')
  //     $(this).parent().addClass('active')
  //   })
  // }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("header", {
    className: "wrapper"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("nav", {
    style: {
      position: 'fixed',
      background: '#f1f1f1'
    },
    className: "navbar navbar-expand-lg classic transparent navbar-light"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "container flex-lg-row flex-nowrap align-items-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "navbar-brand w-100"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    href: "demo6.html"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
    className: "h1"
  }, "LOGO"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    tabIndex: -1,
    className: "navbar-collapse offcanvas-nav"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "offcanvas-header d-lg-none d-xl-none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    href: "#",
    className: "navbar-link"
  }, "Logo"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
    type: "button",
    className: "btn-close btn-close-white offcanvas-close offcanvas-nav-close",
    "aria-label": "Close"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", {
    className: "navbar-nav"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item",
    "x-position": "done",
    onClick: e => console.log(e)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "nav-link scroll active",
    href: "#nav_accueil",
    onClick: e => console.log(e)
  }, findElementByKey('nav_accueil'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "nav-link scroll",
    href: "#nav_estimation"
  }, findElementByKey('nav_estimation'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "nav-link scroll",
    href: "#nav_service"
  }, findElementByKey('nav_service'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "nav-link scroll",
    href: "#nav_statistiques"
  }, findElementByKey('nav_statistiques'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "nav-link scroll",
    href: "#nav_a_propos"
  }, findElementByKey('nav_a_propos'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    className: "nav-link scroll",
    href: "#nav_contact"
  }, findElementByKey('nav_contact'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "navbar-other ms-lg-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("ul", {
    className: "navbar-nav flex-row align-items-center ms-auto",
    "data-sm-skip": "true"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
    onClick: () => setLanguage(),
    className: "nav-link border-0 bg-transparent"
  }, currentLanguage)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item btn-gen d-none d-md-block"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    href: "https://www.blackwalker.com/book-a-car/",
    className: "btn btn-sm btn-dark rounded"
  }, findElementByKey('nav_reserver'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("li", {
    className: "nav-item d-lg-none"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "navbar-hamburger"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
    className: "hamburger animate plain",
    "data-toggle": "offcanvas-nav"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null)))))))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NavBar);

/***/ }),

/***/ "./src/components/Service.tsx":
/*!************************************!*\
  !*** ./src/components/Service.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Service)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");


function Service() {
  const {
    findElementByKey
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_1__.useThemeContext)();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "wrapper bg-light",
    id: "nav_service"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container pt-12"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row text-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-10 offset-md-1 col-lg-8 offset-lg-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", {
    className: "fs-16 text-uppercase  mb-3 titleBlack"
  }, findElementByKey('title_service')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "display-4 mb-9 px-xl-11"
  }, findElementByKey('sous_titre_service')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gy-8 mb-17"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/car-front.svg",
    className: "icon-svg icon-svg-sm solid-duo text-grape-fuchsia me-4",
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "fs-22 mb-1"
  }, findElementByKey('titre_location_vehicule')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('description_location_car')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "more Hover",
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, findElementByKey('learn_more_footer'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/house-heart-fill.svg",
    className: "icon-svg icon-svg-sm solid-duo text-grape-fuchsia me-4",
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "fs-22 mb-1"
  }, findElementByKey('titre_location_appartement')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('description_location_appartment')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "more Hover",
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, findElementByKey('learn_more_footer'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
    src: "/img/svg/savings.svg",
    className: "icon-svg icon-svg-sm solid-duo text-grape-fuchsia me-4",
    alt: ""
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "fs-22 mb-1"
  }, findElementByKey('commission_titre')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('commission_description')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
    className: "more Hover",
    href: "https://www.facebook.com/blkwlkr",
    target: "_blank"
  }, findElementByKey('learn_more_footer'))))))));
}

/***/ }),

/***/ "./src/components/Statistique.tsx":
/*!****************************************!*\
  !*** ./src/components/Statistique.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Statistique)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");


function Statistique() {
  const {
    findElementByKey
  } = (0,_utils_dataContext__WEBPACK_IMPORTED_MODULE_1__.useThemeContext)();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", {
    className: "wrapper bg-light",
    id: "nav_statistiques"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container-card"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card image-wrapper bg-full bg-dark"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card-body py-14 px-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row gx-lg-8 gx-xl-12 gy-10 gy-lg-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-lg-4 text-center text-lg-start"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", {
    className: "display-4 mb-3 text-white pe-xxl-15"
  }, findElementByKey('stats_title')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "lead fs-lg mb-0 text-secondary pe-xxl-10"
  }, findElementByKey('stats_caption'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-lg-8 mt-lg-2"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row align-items-center counter-wrapper gy-6 text-center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "white",
    className: "bi bi-people-fill svg-inject icon-svg icon-svg-sm solid-duo text-grape-fuchsia mb-3",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    d: "M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "counter text-white"
  }, findElementByKey('stats_user_number')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0 text-white text-center"
  }, findElementByKey('stats_user_text'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "white",
    className: "bi bi-journal-check svg-inject icon-svg icon-svg-sm solid-duo text-grape-fuchsia mb-3",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    d: "M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "counter text-white"
  }, findElementByKey('stats_book')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0 text-white text-center"
  }, findElementByKey('stats_book_text'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "white",
    className: "bi bi-emoji-smile-fill svg-inject icon-svg icon-svg-sm solid-duo text-grape-fuchsia mb-3",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "counter text-white"
  }, findElementByKey('stats_client')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0 text-white text-center"
  }, findElementByKey('stats_client_text'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "white",
    className: "bi bi-car-front-fill svg-inject icon-svg icon-svg-sm solid-duo text-grape-fuchsia mb-3",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    d: "M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189l.956-1.913A.5.5 0 0 1 4.309 3h7.382a.5.5 0 0 1 .447.276l.956 1.913a.51.51 0 0 1-.497.731c-.91-.073-3.35-.17-4.597-.17-1.247 0-3.688.097-4.597.17a.51.51 0 0 1-.497-.731Z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "counter text-white"
  }, findElementByKey('stats_vehicle')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0 text-white text-center"
  }, findElementByKey('stats_vehicle_text'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "white",
    className: "bi bi-car-front svg-inject icon-svg icon-svg-sm solid-duo text-grape-fuchsia mb-3",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17 1.247 0 2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276Z"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    fillRule: "evenodd",
    d: "M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.807.807 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155 1.806 0 4.037-.084 5.592-.155A1.479 1.479 0 0 0 15 9.611v-.413c0-.099-.01-.197-.03-.294l-.335-1.68a.807.807 0 0 0-.43-.563 1.807 1.807 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3H4.82Z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "counter text-white"
  }, findElementByKey('stats_available_car')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0 text-white text-center"
  }, findElementByKey('stats_available_car_text')))))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "container"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "grid mb-8 mb-lg-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "row isotope gy-14 mt-n18"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "item col-md-6 col-xl-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card shadow-lg card-border-bottom border-soft-primary"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("blockquote", {
    className: "icon mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('review_text1')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "blockquote-details"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info ps-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "mb-1"
  }, findElementByKey('review_name1')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  }))))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "item col-md-6 col-xl-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card shadow-lg card-border-bottom border-soft-primary"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("blockquote", {
    className: "icon mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "\u201C", findElementByKey('review_text2')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "blockquote-details"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info ps-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "mb-1"
  }, findElementByKey('review_name2')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  }))))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "item col-md-6 col-xl-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card shadow-lg card-border-bottom border-soft-primary"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("blockquote", {
    className: "icon mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('review_text3')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "blockquote-details"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info ps-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "mb-1"
  }, findElementByKey('review_name3')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  }))))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "item col-md-6 col-xl-3"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card shadow-lg card-border-bottom border-soft-primary"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("blockquote", {
    className: "icon mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, findElementByKey('review_text4')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "blockquote-details"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "info ps-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {
    className: "mb-1"
  }, findElementByKey('review_name4')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
    className: "mb-0"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "#FFAE42",
    className: "bi bi-star-fill",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
  })))))))))))));
}

/***/ }),

/***/ "./src/components/Test.tsx":
/*!*********************************!*\
  !*** ./src/components/Test.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Test)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _About__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./About */ "./src/components/About.tsx");
/* harmony import */ var _Contact__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Contact */ "./src/components/Contact.tsx");
/* harmony import */ var _EstimationCar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EstimationCar */ "./src/components/EstimationCar.tsx");
/* harmony import */ var _Home__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Home */ "./src/components/Home.tsx");
/* harmony import */ var _Service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Service */ "./src/components/Service.tsx");
/* harmony import */ var _Statistique__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Statistique */ "./src/components/Statistique.tsx");







function Test() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Home__WEBPACK_IMPORTED_MODULE_4__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_EstimationCar__WEBPACK_IMPORTED_MODULE_3__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Service__WEBPACK_IMPORTED_MODULE_5__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Statistique__WEBPACK_IMPORTED_MODULE_6__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_About__WEBPACK_IMPORTED_MODULE_1__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Contact__WEBPACK_IMPORTED_MODULE_2__["default"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "progress-wrap"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", {
    className: "progress-circle svg-content",
    width: "100%",
    height: "100%",
    viewBox: "-1 -1 102 102"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", {
    d: "M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
  }))));
}

/***/ }),

/***/ "./src/pages/index.tsx?export=head":
/*!*****************************************!*\
  !*** ./src/pages/index.tsx?export=head ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Head": () => (/* binding */ Head),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Layout */ "./src/components/Layout.tsx");
/* harmony import */ var _utils_dataContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/dataContext */ "./src/utils/dataContext.tsx");




const IndexPage = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_utils_dataContext__WEBPACK_IMPORTED_MODULE_2__.DatasContextProvider, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_Layout__WEBPACK_IMPORTED_MODULE_1__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null)));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IndexPage);
const Head = () => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", null, "landing page");

/***/ }),

/***/ "./src/utils/dataContext.tsx":
/*!***********************************!*\
  !*** ./src/utils/dataContext.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DatasContextProvider": () => (/* binding */ DatasContextProvider),
/* harmony export */   "datasContext": () => (/* binding */ datasContext),
/* harmony export */   "useThemeContext": () => (/* binding */ useThemeContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const datasContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({
  setValue: () => null,
  datas: [],
  findElementByKey: key => '',
  currentLanguage: 'EN',
  setLanguage: () => null
});
const DatasContextProvider = ({
  children
}) => {
  const {
    0: datas,
    1: setDatas
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  let lang;

  if (typeof window !== `undefined`) {
    lang = localStorage.getItem('lang') || navigator.language.slice(0, 2).toUpperCase();
  } else {
    lang = 'FR';
  }

  const {
    0: currentLanguage,
    1: UpdateLanguage
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(lang);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let defaultLanguage = localStorage.getItem('defaultLanguage');

    if (!defaultLanguage) {
      const navigatorLanguage = navigator.language.slice(0, 2).toUpperCase();
      localStorage.setItem('defaultLanguage', navigatorLanguage);
      defaultLanguage = navigatorLanguage;
    }

    UpdateLanguage(defaultLanguage);
  }, []);

  const setValue = items => {
    setDatas(items);
  };

  const setLanguage = () => {
    if (currentLanguage === 'EN') {
      UpdateLanguage('FR');
      localStorage.setItem('defaultLanguage', 'FR');
    } else {
      UpdateLanguage('EN');
      localStorage.setItem('defaultLanguage', 'EN');
    }
  };

  const findElementByKey = key => {
    const value = datas.find(item => {
      return item.key === key;
    });
    if (!value) return null;

    if (currentLanguage === 'FR') {
      return value === null || value === void 0 ? void 0 : value.localizations['FR'].value;
    } else {
      return value === null || value === void 0 ? void 0 : value.localizations['EN'].value;
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(datasContext.Provider, {
    value: {
      datas,
      setValue,
      currentLanguage,
      setLanguage,
      findElementByKey
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, children));
};
const useThemeContext = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(datasContext);

/***/ }),

/***/ "./src/utils/format.tsx":
/*!******************************!*\
  !*** ./src/utils/format.tsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ formatData)
/* harmony export */ });
function formatData(assets) {
  const array = [];
  assets.map(asset => {
    array.push({
      id: asset.id,
      key: asset.key,
      localizations: {
        FR: {
          value: asset.value.data.value
        },
        EN: {
          value: asset.localizations.data[0].attributes.value
        }
      }
    });
  });
  return array;
}

/***/ }),

/***/ "./node_modules/mitt/dist/mitt.es.js":
/*!*******************************************!*\
  !*** ./node_modules/mitt/dist/mitt.es.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//      
// An event handler can take an optional event argument
// and should not return a value
                                          
                                                               

// An array of all currently registered event handlers for a type
                                            
                                                            
// A map of event types and their corresponding event handlers.
                        
                                 
                                   
  

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all                 ) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on: function on(type        , handler              ) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off: function off(type        , handler              ) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit: function emit(type        , evt     ) {
			(all[type] || []).slice().map(function (handler) { handler(evt); });
			(all['*'] || []).slice().map(function (handler) { handler(type, evt); });
		}
	};
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mitt);
//# sourceMappingURL=mitt.es.js.map


/***/ }),

/***/ "./src/style/style.css":
/*!*****************************!*\
  !*** ./src/style/style.css ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "./static/css/colors/aqua.css":
/*!************************************!*\
  !*** ./static/css/colors/aqua.css ***!
  \************************************/
/***/ (() => {



/***/ }),

/***/ "./static/css/fonts/thicccboi.css":
/*!****************************************!*\
  !*** ./static/css/fonts/thicccboi.css ***!
  \****************************************/
/***/ (() => {



/***/ }),

/***/ "./static/css/plugins.css":
/*!********************************!*\
  !*** ./static/css/plugins.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./static/css/style.css":
/*!******************************!*\
  !*** ./static/css/style.css ***!
  \******************************/
/***/ (() => {



/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/***/ ((module) => {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inheritsLoose.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inheritsLoose.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  setPrototypeOf(subClass, superClass);
}

module.exports = _inheritsLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/***/ ((module) => {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/gatsby-link/dist/index.modern.mjs":
/*!********************************************************!*\
  !*** ./node_modules/gatsby-link/dist/index.modern.mjs ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ w),
/* harmony export */   "navigate": () => (/* binding */ P),
/* harmony export */   "parsePath": () => (/* binding */ a),
/* harmony export */   "withAssetPrefix": () => (/* binding */ m),
/* harmony export */   "withPrefix": () => (/* binding */ h)
/* harmony export */ });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @gatsbyjs/reach-router */ "./node_modules/@gatsbyjs/reach-router/es/index.js");
/* harmony import */ var gatsby_page_utils_apply_trailing_slash_option__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! gatsby-page-utils/apply-trailing-slash-option */ "./node_modules/gatsby-page-utils/dist/apply-trailing-slash-option.js");
function i(){return i=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},i.apply(this,arguments)}function a(t){let e=t||"/",n="",r="";const o=e.indexOf("#");-1!==o&&(r=e.slice(o),e=e.slice(0,o));const s=e.indexOf("?");return-1!==s&&(n=e.slice(s),e=e.slice(0,s)),{pathname:e,search:"?"===n?"":n,hash:"#"===r?"":r}}const c=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=t=>{if("string"==typeof t)return!(t=>c.test(t))(t)},p=()=> true? true?"":0:0;function h(t,e=(()=> true? true?"":0:0)()){var n;if(!l(t))return t;if(t.startsWith("./")||t.startsWith("../"))return t;const r=null!=(n=null!=e?e:p())?n:"/";return`${null!=r&&r.endsWith("/")?r.slice(0,-1):r}${t.startsWith("/")?t:`/${t}`}`}const f=t=>null==t?void 0:t.startsWith("/"),u=()=> true?"legacy":0,_=(t,e)=>{if("number"==typeof t)return t;if(!l(t))return t;const{pathname:r,search:o,hash:i}=a(t),c=u();let p=t;return"always"!==c&&"never"!==c||(p=`${(0,gatsby_page_utils_apply_trailing_slash_option__WEBPACK_IMPORTED_MODULE_2__.applyTrailingSlashOption)(r,c)}${o}${i}`),f(p)?h(p):function(t,e){if(f(t))return t;const r=u(),o=(0,_gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__.resolve)(t,e);return"always"===r||"never"===r?(0,gatsby_page_utils_apply_trailing_slash_option__WEBPACK_IMPORTED_MODULE_2__.applyTrailingSlashOption)(o,r):o}(p,e)},d=["to","getProps","onClick","onMouseEnter","activeClassName","activeStyle","innerRef","partiallyActive","state","replace","_location"];function m(t){return h(t,p())}const y={activeClassName:prop_types__WEBPACK_IMPORTED_MODULE_3__.string,activeStyle:prop_types__WEBPACK_IMPORTED_MODULE_3__.object,partiallyActive:prop_types__WEBPACK_IMPORTED_MODULE_3__.bool};function v(t){/*#__PURE__*/return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__.Location,null,({location:n})=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(b,i({},t,{_location:n})))}class b extends react__WEBPACK_IMPORTED_MODULE_0__.Component{constructor(t){super(t),this.defaultGetProps=({isPartiallyCurrent:t,isCurrent:e})=>(this.props.partiallyActive?t:e)?{className:[this.props.className,this.props.activeClassName].filter(Boolean).join(" "),style:i({},this.props.style,this.props.activeStyle)}:null;let e=!1;"undefined"!=typeof window&&window.IntersectionObserver&&(e=!0),this.state={IOSupported:e},this.abortPrefetch=null,this.handleRef=this.handleRef.bind(this)}_prefetch(){let t=window.location.pathname+window.location.search;this.props._location&&this.props._location.pathname&&(t=this.props._location.pathname+this.props._location.search);const e=a(_(this.props.to,t)),n=e.pathname+e.search;if(t!==n)return ___loader.enqueue(n)}componentWillUnmount(){if(!this.io)return;const{instance:t,el:e}=this.io;this.abortPrefetch&&this.abortPrefetch.abort(),t.unobserve(e),t.disconnect()}handleRef(t){this.props.innerRef&&Object.prototype.hasOwnProperty.call(this.props.innerRef,"current")?this.props.innerRef.current=t:this.props.innerRef&&this.props.innerRef(t),this.state.IOSupported&&t&&(this.io=((t,e)=>{const n=new window.IntersectionObserver(n=>{n.forEach(n=>{t===n.target&&e(n.isIntersecting||n.intersectionRatio>0)})});return n.observe(t),{instance:n,el:t}})(t,t=>{t?this.abortPrefetch=this._prefetch():this.abortPrefetch&&this.abortPrefetch.abort()}))}render(){const t=this.props,{to:n,getProps:r=this.defaultGetProps,onClick:s,onMouseEnter:c,state:p,replace:h,_location:f}=t,u=function(t,e){if(null==t)return{};var n,r,o={},s=Object.keys(t);for(r=0;r<s.length;r++)e.indexOf(n=s[r])>=0||(o[n]=t[n]);return o}(t,d); false||l(n)||console.warn(`External link ${n} was detected in a Link component. Use the Link component only for internal links. See: https://gatsby.dev/internal-links`);const m=_(n,f.pathname);return l(m)?/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_gatsbyjs_reach_router__WEBPACK_IMPORTED_MODULE_1__.Link,i({to:m,state:p,getProps:r,innerRef:this.handleRef,onMouseEnter:t=>{c&&c(t);const e=a(m);___loader.hovering(e.pathname+e.search)},onClick:t=>{if(s&&s(t),!(0!==t.button||this.props.target||t.defaultPrevented||t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)){t.preventDefault();let e=h;const n=encodeURI(m)===f.pathname;"boolean"!=typeof h&&n&&(e=!0),window.___navigate(m,{state:p,replace:e})}return!0}},u)):/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("a",i({href:m},u))}}b.propTypes=i({},y,{onClick:prop_types__WEBPACK_IMPORTED_MODULE_3__.func,to:prop_types__WEBPACK_IMPORTED_MODULE_3__.string.isRequired,replace:prop_types__WEBPACK_IMPORTED_MODULE_3__.bool,state:prop_types__WEBPACK_IMPORTED_MODULE_3__.object});var w=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((t,n)=>/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(v,i({innerRef:n},t)));const P=(t,e)=>{window.___navigate(_(t,window.location.pathname),e)};
//# sourceMappingURL=index.modern.mjs.map


/***/ }),

/***/ "./.cache/redirects.json":
/*!*******************************!*\
  !*** ./.cache/redirects.json ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = [];

/***/ }),

/***/ "./public/page-data/sq/d/1888145826.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/1888145826.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"data":{"allStrapiBwAsset":{"nodes":[{"key":"a_propos_footer","id":"dd199064-20b3-5287-b723-6c05d6ce7982","localizations":{"data":[{"id":2,"attributes":{"value":"About us","key":"a_propos_footer"}}]},"value":{"data":{"value":"A propos de nous"}}},{"key":"addresse_value","id":"4656807d-c98b-5831-bd72-01eb311db09d","localizations":{"data":[{"id":6,"attributes":{"value":"Tradex-Emana, Yaoundé Cameroun","key":"addresse_value"}}]},"value":{"data":{"value":"Tradex-Emana, Yaoundé Cameroun"}}},{"key":"commission_description","id":"0b98e94e-57d6-535e-8ef5-3b4f9df8ec86","localizations":{"data":[{"id":8,"attributes":{"value":"BLACK WALKER offers the client the ability to make personal commissions through the driver during his trip.","key":"commission_description"}}]},"value":{"data":{"value":"BLACK WALKER offre au client la possibilité de faire des commissions personnelles par le chauffeur durant sa course."}}},{"key":"contact_addresse","id":"332ae058-b03d-5672-8c02-3dd0b242b779","localizations":{"data":[{"id":28,"attributes":{"value":"Address","key":"contact_addresse"}}]},"value":{"data":{"value":"Addresse"}}},{"key":"nav_accueil","id":"f53eeee8-2bff-53ec-87bf-9593e7f1f65f","localizations":{"data":[{"id":10,"attributes":{"value":"Home","key":"nav_accueil"}}]},"value":{"data":{"value":"Accueil"}}},{"key":"nav_estimation","id":"f2f29d85-0f54-541c-9e78-e6de442022ad","localizations":{"data":[{"id":12,"attributes":{"value":"Estimation","key":"nav_estimation"}}]},"value":{"data":{"value":"Estimation"}}},{"key":"nav_service","id":"923224e1-b42f-5fc9-a20f-2d00cc0d4476","localizations":{"data":[{"id":14,"attributes":{"value":"Services","key":"nav_service"}}]},"value":{"data":{"value":"Services"}}},{"key":"nav_statistiques","id":"2043c00e-023b-54fd-93c7-68e34c60eb60","localizations":{"data":[{"id":16,"attributes":{"value":"Statistics","key":"nav_statistiques"}}]},"value":{"data":{"value":"Statistiques"}}},{"key":"contact_telephone","id":"6cc41454-2d8d-5bd2-8d2e-46377990c92b","localizations":{"data":[{"id":30,"attributes":{"value":"Telephone","key":"contact_telephone"}}]},"value":{"data":{"value":"Téléphone"}}},{"key":"nav_a_propos","id":"8c1bd917-e0cd-58f5-bd05-6025d16b285b","localizations":{"data":[{"id":18,"attributes":{"value":"Abous Us","key":"nav_a_propos"}}]},"value":{"data":{"value":"A propos"}}},{"key":"nav_contact","id":"a0699902-fb19-54a7-bfeb-9b8850fbdf81","localizations":{"data":[{"id":20,"attributes":{"value":"Contact","key":"nav_contact"}}]},"value":{"data":{"value":"Contact"}}},{"key":"nav_reserver","id":"208d4ef7-a60e-5d8f-883c-4b8a4914db16","localizations":{"data":[{"id":22,"attributes":{"value":"Book","key":"nav_reserver"}}]},"value":{"data":{"value":"Reserver"}}},{"key":"label_nombre_jour_hors_ville","id":"6d16111c-6de3-5513-9d78-c2fa86819f93","localizations":{"data":[{"id":52,"attributes":{"value":"Days out of town","key":"label_nombre_jour_hors_ville"}}]},"value":{"data":{"value":"Jours hors ville"}}},{"key":"contact_titre","id":"9163e412-647c-5fba-a08b-40d10c752943","localizations":{"data":[{"id":24,"attributes":{"value":"CONTACT US","key":"contact_titre"}}]},"value":{"data":{"value":"CONTACTEZ NOUS"}}},{"key":"contact_description","id":"38274c0b-8a01-5cd6-b70e-cb5551362505","localizations":{"data":[{"id":26,"attributes":{"value":"Got any questions? Don\'t hesitate to get in touch.","key":"contact_titre"}}]},"value":{"data":{"value":"Avez-vous des questions? N\'hésitez pas à nous contacter."}}},{"key":"telephone_value","id":"dc3a5bcc-c7c5-5bf7-bb03-d1c72a3384de","localizations":{"data":[{"id":32,"attributes":{"value":"(+237) 698-819-611","key":"telephone_value"}}]},"value":{"data":{"value":"(+237) 698-819-611"}}},{"key":"contact_email","id":"3172059b-f325-5621-8c64-58207aeae935","localizations":{"data":[{"id":34,"attributes":{"value":"E-mail","key":"contact_email"}}]},"value":{"data":{"value":"E-mail"}}},{"key":"label_hors_ville","id":"69d1320a-6ac9-5708-8b84-195fa5cdcaba","localizations":{"data":[{"id":44,"attributes":{"value":"Out of town","key":"label_hors_ville"}}]},"value":{"data":{"value":"Hors ville"}}},{"key":"email_value","id":"5139f7cd-8c81-5560-996f-f25a57cc7f82","localizations":{"data":[{"id":36,"attributes":{"value":"bill@blackwalker.com","key":"email_value"}}]},"value":{"data":{"value":"bill@blackwalker.com"}}},{"key":"label_choix_vehicule","id":"9c3fdc9b-faea-5994-86b0-6c121db6bba1","localizations":{"data":[{"id":38,"attributes":{"value":"Choose a car","key":"label_choix_vehicule"}}]},"value":{"data":{"value":"Choix de la voiture"}}},{"key":"label_booking_options","id":"799d754b-465c-5767-a87a-19774d85a91a","localizations":{"data":[{"id":40,"attributes":{"value":"Booking options","key":"label_booking_options"}}]},"value":{"data":{"value":"Options de réservation"}}},{"key":"label_en_ville","id":"40479681-595e-5964-91f7-35fb4915de85","localizations":{"data":[{"id":42,"attributes":{"value":"In town","key":"label_en_ville"}}]},"value":{"data":{"value":"En ville"}}},{"key":"label_les_deux","id":"9feb31c7-0349-5611-9a1f-312c160dcb49","localizations":{"data":[{"id":46,"attributes":{"value":"Both","key":"label_les_deux"}}]},"value":{"data":{"value":"Les deux"}}},{"key":"label_nombre_jour","id":"24d57adc-6870-5f9a-8726-7b97408f1b62","localizations":{"data":[{"id":48,"attributes":{"value":"Number of days","key":"label_nombre_jour"}}]},"value":{"data":{"value":"Nombre de jours"}}},{"key":"label_nombre_jour_en_ville","id":"25c5382b-c8ef-5d04-8c28-54e87581f1e3","localizations":{"data":[{"id":50,"attributes":{"value":"Days in town","key":"label_nombre_jour_en_ville"}}]},"value":{"data":{"value":"Jours en ville"}}},{"key":"texte_total_estimation","id":"ef47f29e-c0e9-5cd3-a8cf-d490a1c9838f","localizations":{"data":[{"id":54,"attributes":{"value":"Total for","key":"texte_total_estimation"}}]},"value":{"data":{"value":"Total pour"}}},{"key":"monnaie_value","id":"7c316794-620a-5f6e-9398-f40506e21306","localizations":{"data":[{"id":56,"attributes":{"value":"XAF","key":"monnaie_value"}}]},"value":{"data":{"value":"XAF"}}},{"key":"copyright_footer","id":"79fc8809-2c7d-5329-8eda-1c78b34a0a7c","localizations":{"data":[{"id":60,"attributes":{"value":"© 2022 BLACK WALKER.","key":"copyright_footer"}}]},"value":{"data":{"value":"© 2022 BLACK WALKER."}}},{"key":"monnaie_value","id":"89daecd4-870f-5360-b613-0858c349ebfb","localizations":{"data":[{"id":61,"attributes":{"value":"XAF","key":"monnaie_value"}}]},"value":{"data":{"value":"XAF"}}},{"key":"estimation_cout_titre","id":"ab3a9458-86c3-5a06-b7d6-d4dfc60fa414","localizations":{"data":[{"id":64,"attributes":{"value":"COST ESTIMATION","key":"estimation_cout_titre"}}]},"value":{"data":{"value":"ESTIMATION DES COÛTS"}}},{"key":"text_copyright","id":"b9c8aaf0-7fc0-5191-a9c1-6ebb3d2dee6a","localizations":{"data":[{"id":68,"attributes":{"value":"All rights reserved.","key":"text_copyright"}}]},"value":{"data":{"value":"Tous les droits reservés."}}},{"key":"contact_us_footer","id":"2b5cb1c1-814c-5016-aa67-a0628483a339","localizations":{"data":[{"id":70,"attributes":{"value":"Contact us","key":"contact_us_footer"}}]},"value":{"data":{"value":"Contactez nous"}}},{"key":"learn_more_footer","id":"d2e5c41e-1370-5f8f-9e3f-71a5abe8c974","localizations":{"data":[{"id":72,"attributes":{"value":"Learn more","key":"learn_more_footer"}}]},"value":{"data":{"value":"En savoir plus"}}},{"key":"a_propos_footer","id":"d02e3e81-d228-50b4-b954-d8f34bc3de10","localizations":{"data":[{"id":74,"attributes":{"value":"About us","key":"a_propos_footer"}}]},"value":{"data":{"value":"A propos de nous"}}},{"key":"nos_service_footer","id":"ce93b2aa-3f2c-5aa5-a364-c094c638beb1","localizations":{"data":[{"id":76,"attributes":{"value":"Our services","key":"nos_service_footer"}}]},"value":{"data":{"value":"Nos services"}}},{"key":"notre_bulletin_footer","id":"94d97d25-5cc9-56f4-855f-ec1b006ac289","localizations":{"data":[{"id":78,"attributes":{"value":"Our report card","key":"notre_bulletin_footer"}}]},"value":{"data":{"value":"Notre bulletin de notes"}}},{"key":"texte_bulletin_note_footer","id":"ccea8ed7-3f67-547c-874b-dd248826a03f","localizations":{"data":[{"id":80,"attributes":{"value":"Sign up to our newsletter to receive our news and offers by email.","key":"texte_bulletin_note_footer"}}]},"value":{"data":{"value":"Inscrivez-vous à notre bulletin d\'information pour recevoir nos nouvelles et nos offres par courrier électronique."}}},{"key":"address_mail_footer","id":"416e0c2a-8fe5-58b4-b591-a854d1b76894","localizations":{"data":[{"id":82,"attributes":{"value":"Mail Address","key":"address_mail_footer"}}]},"value":{"data":{"value":"Addresse Email"}}},{"key":"review_text2","id":"af0f9e49-c2b1-51b2-83ca-964008738c74","localizations":{"data":[{"id":114,"attributes":{"value":"Everything went very well, after rental problems that we encountered on another platform, we were advised to the best and very professionally!","key":"review_text2"}}]},"value":{"data":{"value":"Tout s\'est très bien passé, après des problèmes de location que nous avons rencontré sur une autre plateforme, nous avons pu être conseillé au mieux et très professionnellement !"}}},{"key":"rejoindre_footer","id":"9da57af6-a592-5afb-8f9e-c215ea8d8938","localizations":{"data":[{"id":84,"attributes":{"value":"Join us","key":"rejoindre_footer"}}]},"value":{"data":{"value":"Rejoindre"}}},{"key":"texte_total_estimation_suite","id":"25b3aef8-93d9-5f08-9fbb-aa5ca12a71a1","localizations":{"data":[{"id":86,"attributes":{"value":"day(s)","key":"texte_total_estimation_suite"}}]},"value":{"data":{"value":"jour(s)"}}},{"key":"msg_add_price_outTown","id":"b256fba3-a3e6-512e-a153-b72f9ab29917","localizations":{"data":[{"id":88,"attributes":{"value":"XAF 10k more for city exits on all our vehicles.","key":"msg_add_price_outTown"}}]},"value":{"data":{"value":"XAF 10k de plus pour les sorties hors de la ville sur tous nos véhicules."}}},{"key":"review_name1","id":"c22e1a7c-6a64-5269-af9c-912dae5ec525","localizations":{"data":[{"id":110,"attributes":{"value":"Coriss Ambady","key":"review_name1"}}]},"value":{"data":{"value":"Coriss Ambady"}}},{"key":"title_service","id":"6be0f680-6470-5893-8f20-931ad1777823","localizations":{"data":[{"id":90,"attributes":{"value":"OUR SERVICES","key":"title_service"}}]},"value":{"data":{"value":"NOS SERVICES"}}},{"key":"sous_titre_service ","id":"e8e7b874-3d84-5559-aac9-e7d0f466b01a","localizations":{"data":[{"id":92,"attributes":{"value":"The services we offer are designed to fulfill the requirements of our clients.","key":"sous_titre_service"}}]},"value":{"data":{"value":"Les services que nous proposons sont conçus pour répondre à vos besoins."}}},{"key":"header_description","id":"232d8a1a-24c8-5a5d-9ce5-f8acc0174d59","localizations":{"data":[{"id":94,"attributes":{"value":"Blackwalker is now available to download on both App Store and Play Store.","key":"header_description"}}]},"value":{"data":{"value":"Blackwalker est désormais disponible en téléchargement sur l\'App Store et Play Store.."}}},{"key":"header_title2","id":"7f0f5548-04a5-51cf-9919-4753fd704118","localizations":{"data":[{"id":98,"attributes":{"value":"security.","key":"header_title2"}}]},"value":{"data":{"value":"sécurité."}}},{"key":"header_title3","id":"632a0d4f-e629-5c9b-a8fc-c9aeda777fa2","localizations":{"data":[{"id":96,"attributes":{"value":"reliability.","key":"header_title3"}}]},"value":{"data":{"value":"fiabilité."}}},{"key":"header_title1","id":"e40e90cf-c0ec-58ef-9f94-1baf5a50a001","localizations":{"data":[{"id":100,"attributes":{"value":"simplicity.","key":"header_title1"}}]},"value":{"data":{"value":"simplicité."}}},{"key":"header_title","id":"253c7ac7-a719-526c-9b65-96b2a0993b6f","localizations":{"data":[{"id":102,"attributes":{"value":"Book your vehicles online with all","key":"header_title"}}]},"value":{"data":{"value":"Reservez vos voitures en ligne en toute"}}},{"key":"review_name4","id":"3e11f033-edf0-51dd-8a2f-22f4894b9733","localizations":{"data":[{"id":104,"attributes":{"value":"Coriss Ambady","key":"review_name4"}}]},"value":{"data":{"value":"Coriss Ambady"}}},{"key":"review_text4","id":"4ea0df89-a189-59d2-8b4c-f94413829a75","localizations":{"data":[{"id":112,"attributes":{"value":"Everything went very well, after rental problems that we encountered on another platform, we were advised to the best and very professionally!","key":"review_text4"}}]},"value":{"data":{"value":"Tout s\'est très bien passé, après des problèmes de location que nous avons rencontré sur une autre plateforme, nous avons pu être conseillé au mieux et très professionnellement !"}}},{"key":"review_name3","id":"85bfd05e-4bd3-5b84-8fb3-0998d531120d","localizations":{"data":[{"id":106,"attributes":{"value":"Nikolas Brooten","key":"review_name3"}}]},"value":{"data":{"value":"Nikolas Brooten"}}},{"key":"review_name2","id":"a55c466c-ff6d-500f-aaf4-259408ed9758","localizations":{"data":[{"id":108,"attributes":{"value":"Cory Zamora","key":"review_name2"}}]},"value":{"data":{"value":"Cory Zamora"}}},{"key":"review_text3","id":"1730101a-dc27-597e-b8c7-f4ad702b9162","localizations":{"data":[{"id":116,"attributes":{"value":"Everything went very well, after rental problems that we encountered on another platform, we were advised to the best and very professionally!","key":"review_text3"}}]},"value":{"data":{"value":"Tout s\'est très bien passé, après des problèmes de location que nous avons rencontré sur une autre plateforme, nous avons pu être conseillé au mieux et très professionnellement !"}}},{"key":"review_text1","id":"bf29233e-6da6-530e-b24a-5f2aa248140d","localizations":{"data":[{"id":118,"attributes":{"value":"Everything went very well, after rental problems that we encountered on another platform, we were advised to the best and very professionally!","key":"review_text1"}}]},"value":{"data":{"value":"Tout s\'est très bien passé, après des problèmes de location que nous avons rencontré sur une autre plateforme, nous avons pu être conseillé au mieux et très professionnellement !"}}},{"key":"stats_available_car_text","id":"af30137c-725d-5a9d-9197-9631599e918b","localizations":{"data":[{"id":120,"attributes":{"value":"Available vehicles","key":"stats_available_car_text"}}]},"value":{"data":{"value":"Vehicules disponibles"}}},{"key":"stats_available_car","id":"ec5e522e-119e-5782-9d55-484a1bfa6f24","localizations":{"data":[{"id":122,"attributes":{"value":"2","key":"stats_available_car"}}]},"value":{"data":{"value":"2"}}},{"key":"stats_vehicle_text","id":"d639148b-defb-588d-b3bd-afccc34dc060","localizations":{"data":[{"id":124,"attributes":{"value":"Number of vehicles","key":"stats_vehicle_text"}}]},"value":{"data":{"value":"Nombres de vehicules"}}},{"key":"stats_vehicle","id":"a6981da0-7277-5a63-a5c5-3b3fbe858afc","localizations":{"data":[{"id":126,"attributes":{"value":"10","key":"stats_vehicle"}}]},"value":{"data":{"value":"10"}}},{"key":"stats_client_text","id":"87ca2d1a-51c4-516d-b65f-764e84ae392f","localizations":{"data":[{"id":128,"attributes":{"value":"Happy customers","key":"stats_client_text"}}]},"value":{"data":{"value":"Clients satisfaits"}}},{"key":"stats_client","id":"48381ee8-f894-5eaf-afdf-17e631684675","localizations":{"data":[{"id":130,"attributes":{"value":"99%","key":"stats_client"}}]},"value":{"data":{"value":"99%"}}},{"key":"stats_book_text","id":"061e3ba1-d142-5e42-bf61-adcfea1452f8","localizations":{"data":[{"id":132,"attributes":{"value":"Bookings completed","key":"stats_book_text"}}]},"value":{"data":{"value":"Réservations effectuées"}}},{"key":"title_about3","id":"4edb77a7-09cb-5682-ba7b-f479e47ca16c","localizations":{"data":[{"id":154,"attributes":{"value":"Your safety is our priority","key":"title_about3"}}]},"value":{"data":{"value":"Votre sécurité, notre priorité"}}},{"key":"stats_book","id":"8ff66c03-34c4-54dc-9027-fa5ff7f2687c","localizations":{"data":[{"id":134,"attributes":{"value":"500+","key":"stats_book"}}]},"value":{"data":{"value":"500+"}}},{"key":"stats_user_text","id":"5c61d0ad-3149-599c-8cf9-d6bb77a94a5f","localizations":{"data":[{"id":136,"attributes":{"value":"Number of users","key":"stats_user_text"}}]},"value":{"data":{"value":"Nombres d\'utilisateurs"}}},{"key":"stats_user_number","id":"7ca38611-0241-5648-9e26-18356de2e9e3","localizations":{"data":[{"id":138,"attributes":{"value":"1000+","key":"stats_user_number"}}]},"value":{"data":{"value":"1000+"}}},{"key":"stats_caption","id":"e2199809-03d2-573d-9c9d-13dc6ecc7c56","localizations":{"data":[{"id":140,"attributes":{"value":"We provide solutions to simplify our customers\' lives.","key":"stats_caption"}}]},"value":{"data":{"value":"Nous apportons des solutions pour simplifier la vie de nos clients."}}},{"key":"stats_title","id":"8ad477cf-c904-52ac-a25e-6ec38c7f587c","localizations":{"data":[{"id":142,"attributes":{"value":"We are proud of our achievements","key":"stats_title"}}]},"value":{"data":{"value":"Nous sommes fiers de nos réalisations"}}},{"key":"description_titre2","id":"81475f83-0835-5081-a7a2-f1cb2e59708a","localizations":{"data":[{"id":156,"attributes":{"value":"Rent a car online with a driver in a single click.","key":"description_titre2"}}]},"value":{"data":{"value":"Louer des véhicules en ligne en un clic avec chauffeur."}}},{"key":"description_about2","id":"8a130f11-f7f4-5b18-b103-d99f46145881","localizations":{"data":[{"id":144,"attributes":{"value":"solutions","key":"description_about2"}}]},"value":{"data":{"value":"solutions"}}},{"key":"description_about","id":"fb8ff17c-c9a7-5e4c-bd6f-5cb5107ace2b","localizations":{"data":[{"id":146,"attributes":{"value":"to make life easier for our clients.","key":"description_about"}}]},"value":{"data":{"value":"pour faciliter la vie de nos clients."}}},{"key":"description_titre4","id":"7c16587a-2d1c-5364-84fc-53a2098ec304","localizations":{"data":[{"id":148,"attributes":{"value":"We offer flexible and comfortable bookings.","key":"description_titre4"}}]},"value":{"data":{"value":"Nous offrons des réservations flexibles et confortables."}}},{"key":"title_about4","id":"7fefffb5-1390-5390-9e45-9b10e34aa6ac","localizations":{"data":[{"id":150,"attributes":{"value":"The customer is king","key":"title_about4"}}]},"value":{"data":{"value":"Le client est roi"}}},{"key":"description_titre3","id":"a01759c7-7acb-5da5-ab10-7e936d9e034e","localizations":{"data":[{"id":152,"attributes":{"value":"Skilled drivers and cars in perfect condition with Black Walker.","key":"description_titre3"}}]},"value":{"data":{"value":"Chauffeurs qualifiés et voitures en parfait état avec Black Walker."}}},{"key":"title_about2","id":"f9cc0560-4c22-5cbc-be2d-4227b5e2273d","localizations":{"data":[{"id":158,"attributes":{"value":"A unique experience","key":"title_about2"}}]},"value":{"data":{"value":"Une expérience unique"}}},{"key":"description_titre4","id":"dad20234-f9ac-5eb6-a3d9-aae42ba706ba","localizations":{"data":[{"id":162,"attributes":{"value":"We offer flexible and comfortable bookings.","key":"description_titre4"}}]},"value":{"data":{"value":"Nous offrons des réservations flexibles et confortables."}}},{"key":"title_about","id":"9fbf5e56-5dfd-5eff-a62c-cc8a65002e90","localizations":{"data":[{"id":178,"attributes":{"value":"WHAT MAKES US DIFFERENT?","key":"title_about"}}]},"value":{"data":{"value":"EN QUOI SOMMES NOUS DIFFERENTS?"}}},{"key":"titre_location_vehicule","id":"5a70c196-6a58-5e5f-b68a-edc1b8e40707","localizations":{"data":[{"id":180,"attributes":{"value":"Cars rental","key":"titre_location_vehicule"}}]},"value":{"data":{"value":"Location de Vehicules"}}},{"key":"description_titre2","id":"b713c2ba-3171-5d54-8adc-1de9c6d94e2b","localizations":{"data":[{"id":168,"attributes":{"value":"Rent a car online with a driver in a single click.","key":"description_titre2"}}]},"value":{"data":{"value":"Louer des véhicules en ligne en un clic avec chauffeur."}}},{"key":"title_about1","id":"aa36e6a3-a3ae-517d-85ed-3006d8d2e9f5","localizations":{"data":[{"id":174,"attributes":{"value":"Black Walker Close to You","key":"title_about1"}}]},"value":{"data":{"value":"Black Walker près de vous"}}},{"key":"description_titre1","id":"eab0b968-05a7-58b8-a49c-29bf214d28b5","localizations":{"data":[{"id":172,"attributes":{"value":"High quality service and a premium experience for our customers","key":"description_titre4"}}]},"value":{"data":{"value":"Service de haut niveau et experience premium pour nos clients"}}},{"key":"description_about1","id":"d80c18a1-cbdb-51a2-9019-26388f45ab43","localizations":{"data":[{"id":176,"attributes":{"value":"We bring ","key":"description_about1"}}]},"value":{"data":{"value":"De meilleures "}}},{"key":"description_location_car","id":"cc3a84b2-5b60-5034-82f4-8212134e0980","localizations":{"data":[{"id":182,"attributes":{"value":"BLACK WALKER offers a comfortable car rental service to suit your needs regardless of your location.","key":"description_location_car"}}]},"value":{"data":{"value":"BLACK WALKER offre un service de location de voitures comfortables en fonction de vos besoins quelque soit votre position."}}},{"key":"titre_location_appartement","id":"e38c9206-3a76-5eee-a5c3-61240b688233","localizations":{"data":[{"id":184,"attributes":{"value":"Apartment rental","key":"titre_location_appartement"}}]},"value":{"data":{"value":"Location d\'appartements"}}},{"key":"description_location_appartment","id":"c7e78f34-779d-528a-bf07-b794381c0ced","localizations":{"data":[{"id":186,"attributes":{"value":"BLACK WALKER also offers a comfortable furnished apartment rental service at awesome prices.","key":"description_location_appartment"}}]},"value":{"data":{"value":"BLACK WALKER offre aussi un service de location d\'appartement meublé confortables à des prix géniaux."}}},{"key":"commission_titre","id":"02551cbd-fbb6-5aba-ac39-5179506f2d6a","localizations":{"data":[{"id":188,"attributes":{"value":"Commissions","key":"commission_titre"}}]},"value":{"data":{"value":"Commissions"}}}]}}}');

/***/ }),

/***/ "./public/page-data/sq/d/4239228642.json":
/*!***********************************************!*\
  !*** ./public/page-data/sq/d/4239228642.json ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"data":{"allStrapiBwImage":{"nodes":[{"model":"Prado TXL","price":50000,"id":"e2296672-74d7-5e7e-a984-2e83fafa5794","color":"noire","brand":"Toyota","localizations":{"data":[{"attributes":{"color":"black"}}]},"car_image":{"url":"/uploads/Prado_fe9e9741e3.png"},"key":"PradoTXL1"},{"model":"Avensis II","price":25000,"id":"b2cffc9f-09bc-53a2-8150-1a2e748be23e","color":"bleue","brand":"Toyota","localizations":{"data":[{"attributes":{"color":"blue"}}]},"car_image":{"url":"/uploads/Avensis_4ac27d8d1a.png"},"key":"AvensisII"}]}}}');

/***/ })

};
;
//# sourceMappingURL=component---src-pages-index-tsxhead.js.map