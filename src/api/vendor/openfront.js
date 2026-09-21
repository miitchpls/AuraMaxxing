// Generated from OpenFront (AGPL-3.0); see openfront-LICENSE and openfront-sources.json.
// node_modules/dompurify/dist/purify.es.mjs
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ;
      else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
var entries = Object.entries;
var setPrototypeOf = Object.setPrototypeOf;
var isFrozen = Object.isFrozen;
var getPrototypeOf = Object.getPrototypeOf;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var freeze = Object.freeze;
var seal = Object.seal;
var create = Object.create;
var _ref = typeof Reflect !== "undefined" && Reflect;
var apply = _ref.apply;
var construct = _ref.construct;
if (!freeze) {
  freeze = function freeze2(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal2(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySplice = unapply(Array.prototype.splice);
var arrayIsArray = Array.isArray;
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var numberToString = unapply(Number.prototype.toString);
var booleanToString = unapply(Boolean.prototype.toString);
var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var objectToString = unapply(Object.prototype.toString);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set, null);
  }
  if (!arrayIsArray(array)) {
    return set;
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const _ref2 of entries(object)) {
    var _ref3 = _slicedToArray(_ref2, 2);
    const property = _ref3[0];
    const value = _ref3[1];
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (arrayIsArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function stringifyValue(value) {
  switch (typeof value) {
    case "string": {
      return value;
    }
    case "number": {
      return numberToString(value);
    }
    case "boolean": {
      return booleanToString(value);
    }
    case "bigint": {
      return bigintToString ? bigintToString(value) : "0";
    }
    case "symbol": {
      return symbolToString ? symbolToString(value) : "Symbol()";
    }
    case "undefined": {
      return objectToString(value);
    }
    case "function":
    case "object": {
      if (value === null) {
        return objectToString(value);
      }
      const valueAsRecord = value;
      const valueToString = lookupGetter(valueAsRecord, "toString");
      if (typeof valueToString === "function") {
        const stringified = valueToString(valueAsRecord);
        return typeof stringified === "string" ? stringified : objectToString(stringified);
      }
      return objectToString(value);
    }
    default: {
      return objectToString(value);
    }
  }
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
function isRegex(value) {
  try {
    regExpTest(value, "");
    return true;
  } catch (_unused) {
    return false;
  }
}
var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
var text = freeze(["#text"]);
var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
var COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
var FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
var SELF_CLOSING_TAG = seal(/\/>/i);
var NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
};
var getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html2) {
        return html2;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
var _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
var _resolveSetOption = function _resolveSetOption2(cfg, key, fallback, options) {
  return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.4.13";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let document = window2.document;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  window2.DocumentFragment;
  const HTMLTemplateElement = window2.HTMLTemplateElement, Node = window2.Node, Element = window2.Element, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap;
  _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap;
  window2.HTMLFormElement;
  const DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
  const getAttributes = lookupGetter(ElementPrototype, "attributes");
  const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
  const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
  const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
  if (typeof HTMLTemplateElement === "function") {
    const template = document.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  let defaultTrustedTypesPolicy;
  let defaultTrustedTypesPolicyResolved = false;
  let IN_TRUSTED_TYPES_POLICY = 0;
  const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy2() {
    if (IN_TRUSTED_TYPES_POLICY > 0) {
      throw typeErrorCreate('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
    }
  };
  const _createTrustedHTML = function _createTrustedHTML2(html2) {
    _assertNotInTrustedTypesPolicy();
    IN_TRUSTED_TYPES_POLICY++;
    try {
      return trustedTypesPolicy.createHTML(html2);
    } finally {
      IN_TRUSTED_TYPES_POLICY--;
    }
  };
  const _createTrustedScriptURL = function _createTrustedScriptURL2(scriptUrl) {
    _assertNotInTrustedTypesPolicy();
    IN_TRUSTED_TYPES_POLICY++;
    try {
      return trustedTypesPolicy.createScriptURL(scriptUrl);
    } finally {
      IN_TRUSTED_TYPES_POLICY--;
    }
  };
  const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy2() {
    if (!defaultTrustedTypesPolicyResolved) {
      defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      defaultTrustedTypesPolicyResolved = true;
    }
    return defaultTrustedTypesPolicy;
  };
  const _document = document, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
  const importNode = originalDocument.importNode;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
  let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let SET_CONFIG_ALLOWED_TAGS = null;
  let SET_CONFIG_ALLOWED_ATTR = null;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
    // the UA (customizable <select>) — including any on* handlers — and the
    // engine re-mirrors synchronously whenever a removal changes which
    // option/selectedcontent is current, even inside DOMPurify's inert
    // DOMParser document. Hoisting its children on removal re-inserts a fresh
    // mirror target ahead of the walk, which the engine refills, looping
    // forever (DoS) and amplifying output. Dropping its content on removal
    // (rather than hoisting) breaks that cascade; the content is a duplicate
    // of the option, which is sanitized on its own. See campaign-3 F1/F6.
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze(["mi", "mo", "mn", "ms", "mtext"]);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
  const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, {
      transform: transformCaseFunc
    });
    ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, {
      transform: transformCaseFunc
    });
    ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, {
      transform: stringToString
    });
    URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
      transform: transformCaseFunc,
      base: DEFAULT_URI_SAFE_ATTRIBUTES
    });
    DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
      transform: transformCaseFunc,
      base: DEFAULT_DATA_URI_TAGS
    });
    FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, {
      transform: transformCaseFunc
    });
    FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), {
      transform: transformCaseFunc
    });
    FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), {
      transform: transformCaseFunc
    });
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
    NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
    HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
    const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
    CUSTOM_ELEMENT_HANDLING = create(null);
    if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
    }
    if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
    }
    if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
    }
    seal(CUSTOM_ELEMENT_HANDLING);
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = create(null);
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    EXTRA_ELEMENT_HANDLING.tagCheck = null;
    EXTRA_ELEMENT_HANDLING.attributeCheck = null;
    if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else if (arrayIsArray(cfg.ADD_TAGS)) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else if (arrayIsArray(cfg.ADD_ATTR)) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      const previousTrustedTypesPolicy = trustedTypesPolicy;
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      try {
        emptyHTML = _createTrustedHTML("");
      } catch (error) {
        trustedTypesPolicy = previousTrustedTypesPolicy;
        throw error;
      }
    } else if (cfg.TRUSTED_TYPES_POLICY === null) {
      trustedTypesPolicy = void 0;
      emptyHTML = "";
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
      }
      if (trustedTypesPolicy && typeof emptyHTML === "string") {
        emptyHTML = _createTrustedHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkSvgNamespace = function _checkSvgNamespace2(tagName, parent, parentTagName) {
    if (parent.namespaceURI === HTML_NAMESPACE) {
      return tagName === "svg";
    }
    if (parent.namespaceURI === MATHML_NAMESPACE) {
      return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
    }
    return Boolean(ALL_SVG_TAGS[tagName]);
  };
  const _checkMathMlNamespace = function _checkMathMlNamespace2(tagName, parent, parentTagName) {
    if (parent.namespaceURI === HTML_NAMESPACE) {
      return tagName === "math";
    }
    if (parent.namespaceURI === SVG_NAMESPACE) {
      return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
    }
    return Boolean(ALL_MATHML_TAGS[tagName]);
  };
  const _checkHtmlNamespace = function _checkHtmlNamespace2(tagName, parent, parentTagName) {
    if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
      return false;
    }
    if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
      return false;
    }
    return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
  };
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      return _checkSvgNamespace(tagName, parent, parentTagName);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      return _checkMathMlNamespace(tagName, parent, parentTagName);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      return _checkHtmlNamespace(tagName, parent, parentTagName);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
      if (!getParentNode(node)) {
        throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
      }
    }
  };
  const _neutralizeRoot = function _neutralizeRoot2(root) {
    _neutralizeSubtree(root);
    const childNodes = getChildNodes(root);
    if (childNodes) {
      const snapshot = [];
      arrayForEach(childNodes, (child) => {
        arrayPush(snapshot, child);
      });
      arrayForEach(snapshot, (child) => {
        try {
          remove(child);
        } catch (_) {
        }
      });
    }
    const attributes = getAttributes(root);
    if (attributes) {
      for (let i = attributes.length - 1; i >= 0; --i) {
        const attribute = attributes[i];
        const name = attribute && attribute.name;
        if (typeof name === "string") {
          try {
            root.removeAttribute(name);
          } catch (_) {
          }
        }
      }
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_) {
        }
      }
    }
  };
  const _stripDisallowedAttributes = function _stripDisallowedAttributes2(element) {
    const attributes = getAttributes(element);
    if (!attributes) {
      return;
    }
    for (let i = attributes.length - 1; i >= 0; --i) {
      const attribute = attributes[i];
      const name = attribute && attribute.name;
      if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) {
        continue;
      }
      try {
        element.removeAttribute(name);
      } catch (_) {
      }
    }
  };
  const _neutralizeSubtree = function _neutralizeSubtree2(root) {
    const stack2 = [root];
    while (stack2.length > 0) {
      const node = stack2.pop();
      const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
      if (nodeType === NODE_TYPE.element) {
        _stripDisallowedAttributes(node);
      }
      const childNodes = getChildNodes(node);
      if (childNodes) {
        for (let i = childNodes.length - 1; i >= 0; --i) {
          stack2.push(childNodes[i]);
        }
      }
    }
  };
  const _neutralizePatchLinkage = function _neutralizePatchLinkage2(root) {
    if (!SAFE_FOR_XML) {
      return;
    }
    const stack2 = [root];
    while (stack2.length > 0) {
      const node = stack2.pop();
      const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
      if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
        try {
          remove(node);
        } catch (_) {
        }
        continue;
      }
      if (nodeType === NODE_TYPE.element) {
        const element = node;
        const lcTag = transformCaseFunc(getNodeName ? getNodeName(node) : node.nodeName);
        try {
          if (element.hasAttribute && element.hasAttribute("patchsrc")) {
            element.removeAttribute("patchsrc");
          }
          if (element.hasAttribute && element.hasAttribute("for") && lcTag !== "label" && lcTag !== "output") {
            element.removeAttribute("for");
          }
        } catch (_) {
        }
      }
      const childNodes = getChildNodes(node);
      if (childNodes) {
        for (let i = childNodes.length - 1; i >= 0; --i) {
          stack2.push(childNodes[i]);
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
    return createNodeIterator.call(
      doc || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _stripTemplateExpressions = function _stripTemplateExpressions2(value) {
    value = stringReplace(value, MUSTACHE_EXPR$1, " ");
    value = stringReplace(value, ERB_EXPR$1, " ");
    value = stringReplace(value, TMPLIT_EXPR$1, " ");
    return value;
  };
  const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
    var _node$querySelectorAl;
    node.normalize();
    const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
    const walker = createNodeIterator.call(
      doc || node,
      node,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      currentNode.data = _stripTemplateExpressions(currentNode.data);
      currentNode = walker.nextNode();
    }
    const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
    if (templates) {
      arrayForEach(templates, (tmpl) => {
        if (_isDocumentFragment(tmpl.content)) {
          _scrubTemplateExpressions2(tmpl.content);
        }
      });
    }
  };
  const _isClobbered = function _isClobbered2(element) {
    const realTagName = getNodeName ? getNodeName(element) : null;
    if (typeof realTagName !== "string") {
      return false;
    }
    if (transformCaseFunc(realTagName) !== "form") {
      return false;
    }
    return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    element.nodeType !== getNodeType(element) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    element.childNodes !== getChildNodes(element);
  };
  const _isDocumentFragment = function _isDocumentFragment2(value) {
    if (!getNodeType || typeof value !== "object" || value === null) {
      return false;
    }
    try {
      return getNodeType(value) === NODE_TYPE.documentFragment;
    } catch (_) {
      return false;
    }
  };
  const _isNode = function _isNode2(value) {
    if (!getNodeType || typeof value !== "object" || value === null) {
      return false;
    }
    try {
      return typeof getNodeType(value) === "number";
    } catch (_) {
      return false;
    }
  };
  function _executeHooks(hooks2, currentNode, data) {
    if (hooks2.length === 0) {
      return;
    }
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _isUnsafeNode = function _isUnsafeNode2(currentNode, tagName) {
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) {
      return true;
    }
    if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) {
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.processingInstruction) {
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) {
      return true;
    }
    return false;
  };
  const _sanitizeDisallowedNode = function _sanitizeDisallowedNode2(currentNode, tagName, root) {
    if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
      if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
        return false;
      }
      if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
        return false;
      }
    }
    if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
      const parentNode = getParentNode(currentNode);
      const childNodes = getChildNodes(currentNode);
      if (childNodes && parentNode) {
        const childCount = childNodes.length;
        for (let i = childCount - 1; i >= 0; --i) {
          const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
          parentNode.insertBefore(hoisted, getNextSibling(currentNode));
        }
      }
    }
    _forceRemove(currentNode);
    return true;
  };
  const _forkSharedAllowlist = function _forkSharedAllowlist2(hookList, set, defaultSet, setConfigSet) {
    if (hookList.length === 0) {
      return set;
    }
    return set === defaultSet || set === setConfigSet ? clone(set) : set;
  };
  const _sanitizeElements = function _sanitizeElements2(currentNode, root) {
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (currentNode !== root && getParentNode(currentNode) === null) {
      if (IN_PLACE) {
        _neutralizeSubtree(currentNode);
      }
      return true;
    }
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(getNodeName ? getNodeName(currentNode) : currentNode.nodeName);
    ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (currentNode !== root && getParentNode(currentNode) === null) {
      if (IN_PLACE) {
        _neutralizeSubtree(currentNode);
      }
      return true;
    }
    if (_isUnsafeNode(currentNode, tagName)) {
      _forceRemove(currentNode);
      return true;
    }
    if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
      const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
      if (removed === false) {
        _executeHooks(hooks.afterSanitizeElements, currentNode, null);
      }
      return removed;
    }
    const nt = getNodeType ? getNodeType(currentNode) : currentNode.nodeType;
    if (nt === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      const content = _stripTemplateExpressions(currentNode.textContent);
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (FORBID_ATTR[lcName]) {
      return false;
    }
    if (SAFE_FOR_XML && lcName === "patchsrc") {
      return false;
    }
    if (SAFE_FOR_XML && lcName === "for" && lcTag !== "label" && lcTag !== "output") {
      return false;
    }
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document || value in formElement)) {
      return false;
    }
    const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
    if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ;
    else if (!nameIsPermitted) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]);
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
  };
  const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute2(lcTag, lcName, namespaceURI, value) {
    if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) {
      switch (trustedTypes.getAttributeType(lcTag, lcName)) {
        case "TrustedHTML": {
          return _createTrustedHTML(value);
        }
        case "TrustedScriptURL": {
          return _createTrustedScriptURL(value);
        }
      }
    }
    return value;
  };
  const _setAttributeValue = function _setAttributeValue2(currentNode, name, namespaceURI, value) {
    try {
      if (namespaceURI) {
        currentNode.setAttributeNS(namespaceURI, name, value);
      } else {
        currentNode.setAttribute(name, value);
      }
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
      } else {
        arrayPop(DOMPurify.removed);
      }
    } catch (_) {
      _removeAttribute(name, currentNode);
    }
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const attributes = currentNode.attributes;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l = attributes.length;
    const lcTag = transformCaseFunc(currentNode.nodeName);
    while (l--) {
      const attr = attributes[l];
      const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        value = _stripTemplateExpressions(value);
      }
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
      if (value !== initValue) {
        _setAttributeValue(currentNode, name, namespaceURI, value);
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode, fragment);
      _sanitizeAttributes(shadowNode);
      if (_isDocumentFragment(shadowNode.content)) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
      const shadowNodeType = getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType;
      if (shadowNodeType === NODE_TYPE.element) {
        const innerSr = getShadowRoot(shadowNode);
        if (_isDocumentFragment(innerSr)) {
          _sanitizeAttachedShadowRoots(innerSr);
          _sanitizeShadowDOM2(innerSr);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots2(root) {
    const stack2 = [{
      node: root,
      shadow: null
    }];
    while (stack2.length > 0) {
      const item = stack2.pop();
      if (item.shadow) {
        _sanitizeShadowDOM2(item.shadow);
        continue;
      }
      const node = item.node;
      const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
      const isElement = nodeType === NODE_TYPE.element;
      const childNodes = getChildNodes(node);
      if (childNodes) {
        for (let i = childNodes.length - 1; i >= 0; --i) {
          stack2.push({
            node: childNodes[i],
            shadow: null
          });
        }
      }
      if (isElement) {
        const rootName = getNodeName ? getNodeName(node) : null;
        if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
          const content = node.content;
          if (_isDocumentFragment(content)) {
            stack2.push({
              node: content,
              shadow: null
            });
          }
        }
      }
      if (isElement) {
        const sr = getShadowRoot(node);
        if (_isDocumentFragment(sr)) {
          stack2.push({
            node: null,
            shadow: sr
          }, {
            node: sr,
            shadow: null
          });
        }
      }
    }
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      dirty = stringifyValue(dirty);
      if (typeof dirty !== "string") {
        throw typeErrorCreate("dirty is not a string, aborting");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (SET_CONFIG) {
      ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
      ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
    } else {
      _parseConfig(cfg);
    }
    if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) {
      ALLOWED_TAGS = clone(ALLOWED_TAGS);
    }
    if (hooks.uponSanitizeAttribute.length > 0) {
      ALLOWED_ATTR = clone(ALLOWED_ATTR);
    }
    DOMPurify.removed = [];
    const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
    if (inPlace) {
      _neutralizePatchLinkage(dirty);
      const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
      if (typeof nn === "string") {
        const tagName = transformCaseFunc(nn);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          _neutralizeRoot(dirty);
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
      if (_isClobbered(dirty)) {
        _neutralizeRoot(dirty);
        throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
      }
      try {
        _sanitizeAttachedShadowRoots(dirty);
      } catch (error) {
        _neutralizeRoot(dirty);
        throw error;
      }
    } else if (_isNode(dirty)) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
      _sanitizeAttachedShadowRoots(importedNode);
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const walkRoot = inPlace ? dirty : body;
    try {
      const nodeIterator = _createNodeIterator(walkRoot);
      while (currentNode = nodeIterator.nextNode()) {
        _sanitizeElements(currentNode, walkRoot);
        _sanitizeAttributes(currentNode);
        if (_isDocumentFragment(currentNode.content)) {
          _sanitizeShadowDOM2(currentNode.content);
        }
      }
    } catch (error) {
      if (inPlace) {
        _neutralizeRoot(dirty);
        arrayForEach(DOMPurify.removed, (entry) => {
          if (entry.element) {
            _neutralizeSubtree(entry.element);
          }
        });
      }
      throw error;
    }
    if (inPlace) {
      arrayForEach(DOMPurify.removed, (entry) => {
        if (entry.element) {
          _neutralizeSubtree(entry.element);
        }
      });
      if (SAFE_FOR_TEMPLATES) {
        _scrubTemplateExpressions2(dirty);
      }
      return dirty;
    }
    if (RETURN_DOM) {
      if (SAFE_FOR_TEMPLATES) {
        _scrubTemplateExpressions2(body);
      }
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      serializedHTML = _stripTemplateExpressions(serializedHTML);
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
    SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
    SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
    SET_CONFIG_ALLOWED_TAGS = null;
    SET_CONFIG_ALLOWED_ATTR = null;
    trustedTypesPolicy = defaultTrustedTypesPolicy;
    emptyHTML = "";
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    if (!objectHasOwnProperty(hooks, entryPoint)) {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (!objectHasOwnProperty(hooks, entryPoint)) {
      return void 0;
    }
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    if (!objectHasOwnProperty(hooks, entryPoint)) {
      return;
    }
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

// src/core/DetMath.ts
var f64 = new Float64Array(1);
var u32 = new Uint32Array(f64.buffer);
f64[0] = 1;
var HI = u32[1] === 1072693248 ? 1 : 0;
var LO = 1 - HI;

// src/core/Util.ts
function within(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
var emojiTable = [
  ["\u{1F600}", "\u{1F60A}", "\u{1F970}", "\u{1F607}", "\u{1F60E}"],
  ["\u{1F61E}", "\u{1F97A}", "\u{1F62D}", "\u{1F631}", "\u{1F621}"],
  ["\u{1F608}", "\u{1F921}", "\u{1F971}", "\u{1FAE1}", "\u{1F595}"],
  ["\u{1F44B}", "\u{1F44F}", "\u270B", "\u{1F64F}", "\u{1F4AA}"],
  ["\u{1F44D}", "\u{1F44E}", "\u{1FAF4}", "\u{1F90C}", "\u{1F926}\u200D\u2642\uFE0F"],
  ["\u{1F91D}", "\u{1F198}", "\u{1F54A}\uFE0F", "\u{1F3F3}\uFE0F", "\u23F3"],
  ["\u{1F525}", "\u{1F4A5}", "\u{1F480}", "\u2622\uFE0F", "\u26A0\uFE0F"],
  ["\u2196\uFE0F", "\u2B06\uFE0F", "\u2197\uFE0F", "\u{1F451}", "\u{1F947}"],
  ["\u2B05\uFE0F", "\u{1F3AF}", "\u27A1\uFE0F", "\u{1F948}", "\u{1F949}"],
  ["\u2199\uFE0F", "\u2B07\uFE0F", "\u2198\uFE0F", "\u2764\uFE0F", "\u{1F494}"],
  ["\u{1F4B0}", "\u2693", "\u26F5", "\u{1F3E1}", "\u{1F6E1}\uFE0F"],
  ["\u{1F3ED}", "\u{1F682}", "\u2753", "\u{1F414}", "\u{1F400}"]
];
var flattenedEmojiTable = emojiTable.flat();
var CLAN_TAG_CHARS = "a-zA-Z0-9";
var CLAN_TAG_INVALID_CHARS = new RegExp(`[^${CLAN_TAG_CHARS}]`, "g");

// src/core/game/Game.ts
function unitTypeGroup(types) {
  return {
    types,
    has(type) {
      return types.includes(type);
    }
  };
}
var Nukes = unitTypeGroup([
  "Atom Bomb" /* AtomBomb */,
  "Hydrogen Bomb" /* HydrogenBomb */,
  "MIRV Warhead" /* MIRVWarhead */,
  "MIRV" /* MIRV */
]);
var BuildableAttacks = unitTypeGroup([
  "Atom Bomb" /* AtomBomb */,
  "Hydrogen Bomb" /* HydrogenBomb */,
  "MIRV" /* MIRV */,
  "Warship" /* Warship */
]);
var Structures = unitTypeGroup([
  "City" /* City */,
  "Defense Post" /* DefensePost */,
  "SAM Launcher" /* SAMLauncher */,
  "Missile Silo" /* MissileSilo */,
  "Port" /* Port */,
  "Factory" /* Factory */
]);
var BuildMenus = unitTypeGroup([
  ...Structures.types,
  ...BuildableAttacks.types
]);
var PlayerBuildable = unitTypeGroup([
  ...BuildMenus.types,
  "Transport" /* TransportShip */
]);
function isUnit(unit) {
  return unit && typeof unit === "object" && "isUnit" in unit && typeof unit.isUnit === "function" && unit.isUnit();
}

// src/core/PseudoRandom.ts
var PseudoRandom = class _PseudoRandom {
  static {
    this.POW36_8 = 2821109907456;
  }
  // 36 ** 8
  constructor(seed) {
    let h = seed | 0;
    const split = () => {
      h = h + 2654435769 | 0;
      let t = h ^ h >>> 16;
      t = Math.imul(t, 569420461);
      t = t ^ t >>> 15;
      t = Math.imul(t, 1935289751);
      return t ^ t >>> 15 | 0;
    };
    this.s0 = split();
    this.s1 = split();
    this.s2 = split();
    this.s3 = split();
    for (let i = 0; i < 12; i++) {
      this.next();
    }
  }
  // Generates the next pseudorandom number between 0 and 1.
  next() {
    const t = (this.s0 + this.s1 | 0) + this.s3 | 0;
    this.s3 = this.s3 + 1 | 0;
    this.s0 = this.s1 ^ this.s1 >>> 9;
    this.s1 = this.s2 + (this.s2 << 3) | 0;
    this.s2 = this.s2 << 21 | this.s2 >>> 11;
    this.s2 = this.s2 + t | 0;
    return (t >>> 0) / 4294967296;
  }
  // Generates a random integer between min (inclusive) and max (exclusive).
  nextInt(min, max) {
    const lo = Math.floor(min);
    const hi = Math.floor(max);
    return Math.floor(this.next() * (hi - lo)) + lo;
  }
  // Generates a random float between min (inclusive) and max (exclusive).
  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }
  // Generates a random ID (8 characters, alphanumeric).
  nextID() {
    return Math.floor(this.next() * _PseudoRandom.POW36_8).toString(36).padStart(8, "0");
  }
  // Selects a random element from an array.
  randElement(arr) {
    if (arr.length === 0) {
      throw new Error("array must not be empty");
    }
    return arr[this.nextInt(0, arr.length)];
  }
  // Selects a random element from a set.
  randFromSet(set) {
    const size = set.size;
    if (size === 0) {
      throw new Error("set must not be empty");
    }
    const index = this.nextInt(0, size);
    let i = 0;
    for (const item of set) {
      if (i === index) {
        return item;
      }
      i++;
    }
    throw new Error("Unexpected error selecting element from set");
  }
  // Returns true with probability 1/odds.
  chance(odds) {
    return this.nextInt(0, odds) === 0;
  }
  // Returns a shuffled copy of the array using Fisher-Yates algorithm.
  shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
};

// src/core/utilities/DebugSpan.ts
var stack = [];
function isEnabled() {
  return globalThis.__DEBUG_SPAN_ENABLED__ === true;
}
var DebugSpan = {
  isEnabled,
  enable() {
    globalThis.__DEBUG_SPAN_ENABLED__ = true;
  },
  disable() {
    globalThis.__DEBUG_SPAN_ENABLED__ = false;
  },
  start(name) {
    if (!isEnabled()) return;
    const span = {
      name,
      timeStart: performance.now(),
      data: {},
      children: []
    };
    const parent = stack[stack.length - 1];
    parent?.children.push(span);
    stack.push(span);
  },
  end(name) {
    if (!isEnabled()) return;
    if (stack.length === 0) {
      const payload = name ? `"${name}"` : "";
      throw new Error(`DebugSpan.end(${payload}): no open span`);
    }
    if (name) {
      while (stack.length > 0) {
        const span2 = stack.pop();
        span2.timeEnd = performance.now();
        span2.duration = span2.timeEnd - span2.timeStart;
        if (stack.length === 0) {
          DebugSpan.storeSpan(span2);
        }
        if (span2.name === name) break;
      }
      return;
    }
    const span = stack.pop();
    span.timeEnd = performance.now();
    span.duration = span.timeEnd - span.timeStart;
    if (stack.length === 0) {
      DebugSpan.storeSpan(span);
    }
  },
  storeSpan(span) {
    if (!isEnabled()) return;
    globalThis.__DEBUG_SPANS__ = globalThis.__DEBUG_SPANS__ ?? [];
    globalThis.__DEBUG_SPANS__.push(span);
    const extractData = (span2) => {
      return Object.fromEntries(
        Object.entries(span2.data).filter(
          ([key]) => typeof key === "string" && key.startsWith("$")
        )
      );
    };
    const properties = {
      timings: { total: span.duration },
      data: extractData(span)
    };
    if (span.children.length > 0) {
      const getChildren = (span2) => span2.children.flatMap((child) => [child, ...getChildren(child)]);
      const children = getChildren(span);
      for (const childSpan of children) {
        properties.timings[childSpan.name] = childSpan.duration;
        const childData = extractData(childSpan);
        for (const key of Object.keys(childData)) {
          properties.data[key] = childData[key];
        }
      }
    }
    try {
      performance.measure(span.name, {
        start: span.timeStart,
        end: span.timeEnd,
        detail: properties
      });
    } catch (err) {
      console.error("DebugSpan.storeSpan: performance.measure failed", err);
      console.error("Span:", span);
    }
    while (globalThis.__DEBUG_SPANS__.length > 100) {
      globalThis.__DEBUG_SPANS__.shift();
    }
  },
  wrap(name, fn) {
    this.start(name);
    try {
      return fn();
    } finally {
      this.end(name);
    }
  },
  set(key, valueFn, root = true) {
    if (!isEnabled()) return;
    if (stack.length === 0) {
      throw new Error(`DebugSpan.set("${key}"): no open span`);
    }
    const span = root ? stack[0] : stack[stack.length - 1];
    span.data[key] = valueFn(span.data[key]);
  },
  getLastSpan(name) {
    if (!isEnabled()) return;
    globalThis.__DEBUG_SPANS__ = globalThis.__DEBUG_SPANS__ ?? [];
    if (name) {
      for (let i = globalThis.__DEBUG_SPANS__.length - 1 || 0; i >= 0; i--) {
        const span = globalThis.__DEBUG_SPANS__[i];
        if (span.name === name) {
          return span;
        }
      }
      return void 0;
    }
    return globalThis.__DEBUG_SPANS__[globalThis.__DEBUG_SPANS__.length - 1];
  }
};

// src/core/pathfinding/algorithms/PriorityQueue.ts
var MinHeap = class {
  constructor(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.heap = new Int32Array(capacity);
    this.priorities = new Float32Array(capacity);
  }
  push(node, priority) {
    if (this.size >= this.capacity) {
      console.error(
        `MinHeap capacity exceeded (${this.capacity}). Resizing, but this indicates a bug. Please investigate.`
      );
      this.capacity *= 2;
      const newHeap = new Int32Array(this.capacity);
      const newPri = new Float32Array(this.capacity);
      newHeap.set(this.heap);
      newPri.set(this.priorities);
      this.heap = newHeap;
      this.priorities = newPri;
    }
    let i = this.size++;
    this.heap[i] = node;
    this.priorities[i] = priority;
    while (i > 0) {
      const parent = i - 1 >> 1;
      if (this.priorities[parent] <= this.priorities[i]) break;
      const tmpNode = this.heap[parent];
      const tmpPri = this.priorities[parent];
      this.heap[parent] = this.heap[i];
      this.priorities[parent] = this.priorities[i];
      this.heap[i] = tmpNode;
      this.priorities[i] = tmpPri;
      i = parent;
    }
  }
  pop() {
    const result = this.heap[0];
    this.size--;
    if (this.size > 0) {
      this.heap[0] = this.heap[this.size];
      this.priorities[0] = this.priorities[this.size];
      let i = 0;
      while (true) {
        const left = (i << 1) + 1;
        const right = left + 1;
        let smallest = i;
        if (left < this.size && this.priorities[left] < this.priorities[smallest]) {
          smallest = left;
        }
        if (right < this.size && this.priorities[right] < this.priorities[smallest]) {
          smallest = right;
        }
        if (smallest === i) break;
        const tmpNode = this.heap[smallest];
        const tmpPri = this.priorities[smallest];
        this.heap[smallest] = this.heap[i];
        this.priorities[smallest] = this.priorities[i];
        this.heap[i] = tmpNode;
        this.priorities[i] = tmpPri;
        i = smallest;
      }
    }
    return result;
  }
  isEmpty() {
    return this.size === 0;
  }
  clear() {
    this.size = 0;
  }
};
var BucketQueue = class {
  constructor(maxPriority) {
    this.stamp = 0;
    this.maxBucket = maxPriority + 1;
    this.buckets = new Array(this.maxBucket);
    this.bucketSizes = new Int32Array(this.maxBucket);
    this.bucketStamp = new Uint32Array(this.maxBucket);
    this.minBucket = this.maxBucket;
    this.size = 0;
  }
  push(node, priority) {
    const bucket = Math.min(priority | 0, this.maxBucket - 1);
    if (!this.buckets[bucket]) {
      this.buckets[bucket] = new Int32Array(64);
    }
    const size = this.bucketStamp[bucket] === this.stamp ? this.bucketSizes[bucket] : 0;
    if (size >= this.buckets[bucket].length) {
      const newBucket = new Int32Array(this.buckets[bucket].length * 2);
      newBucket.set(this.buckets[bucket]);
      this.buckets[bucket] = newBucket;
    }
    this.buckets[bucket][size] = node;
    this.bucketSizes[bucket] = size + 1;
    this.bucketStamp[bucket] = this.stamp;
    this.size++;
    if (bucket < this.minBucket) {
      this.minBucket = bucket;
    }
  }
  pop() {
    while (this.minBucket < this.maxBucket) {
      if (this.bucketStamp[this.minBucket] === this.stamp) {
        const size = this.bucketSizes[this.minBucket];
        if (size > 0) {
          this.bucketSizes[this.minBucket]--;
          this.size--;
          return this.buckets[this.minBucket][size - 1];
        }
      }
      this.minBucket++;
    }
    return -1;
  }
  isEmpty() {
    return this.size === 0;
  }
  clear() {
    this.stamp++;
    if (this.stamp > 4294967295) {
      this.bucketStamp.fill(0);
      this.stamp = 1;
    }
    this.minBucket = this.maxBucket;
    this.size = 0;
  }
};

// src/core/pathfinding/algorithms/AStar.ts
var AStar = class {
  constructor(config) {
    this.stamp = 1;
    this.adapter = config.adapter;
    this.maxIterations = config.maxIterations ?? 5e5;
    this.neighborBuffer = new Int32Array(this.adapter.maxNeighbors());
    this.closedStamp = new Uint32Array(this.adapter.numNodes());
    this.gScoreStamp = new Uint32Array(this.adapter.numNodes());
    this.gScore = new Uint32Array(this.adapter.numNodes());
    this.cameFrom = new Int32Array(this.adapter.numNodes());
    this.queue = new BucketQueue(this.adapter.maxPriority());
  }
  findPath(start, goal) {
    this.stamp++;
    if (this.stamp > 4294967295) {
      this.closedStamp.fill(0);
      this.gScoreStamp.fill(0);
      this.stamp = 1;
    }
    const stamp = this.stamp;
    const adapter = this.adapter;
    const closedStamp = this.closedStamp;
    const gScoreStamp = this.gScoreStamp;
    const gScore = this.gScore;
    const cameFrom = this.cameFrom;
    const queue = this.queue;
    const buffer = this.neighborBuffer;
    queue.clear();
    const starts = Array.isArray(start) ? start : [start];
    for (const s of starts) {
      gScore[s] = 0;
      gScoreStamp[s] = stamp;
      cameFrom[s] = -1;
      queue.push(s, adapter.heuristic(s, goal));
    }
    let iterations = this.maxIterations;
    while (!queue.isEmpty()) {
      if (--iterations <= 0) {
        return null;
      }
      const current = queue.pop();
      if (closedStamp[current] === stamp) continue;
      closedStamp[current] = stamp;
      if (current === goal) {
        return this.buildPath(goal);
      }
      const currentG = gScore[current];
      const prev = cameFrom[current];
      const count = adapter.neighbors(current, buffer);
      for (let i = 0; i < count; i++) {
        const neighbor = buffer[i];
        if (closedStamp[neighbor] === stamp) continue;
        const tentativeG = currentG + adapter.cost(current, neighbor, prev === -1 ? void 0 : prev);
        if (gScoreStamp[neighbor] !== stamp || tentativeG < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeG;
          gScoreStamp[neighbor] = stamp;
          queue.push(neighbor, tentativeG + adapter.heuristic(neighbor, goal));
        }
      }
    }
    return null;
  }
  buildPath(goal) {
    const path = [];
    let current = goal;
    while (current !== -1) {
      path.push(current);
      current = this.cameFrom[current];
    }
    path.reverse();
    return path;
  }
};

// src/core/pathfinding/algorithms/AStar.Rail.ts
var AStarRail = class {
  constructor(gameMap) {
    const adapter = new RailAdapter(gameMap);
    this.aStar = new AStar({ adapter });
  }
  findPath(from, to) {
    return DebugSpan.wrap(
      "AStar.Rail:findPath",
      () => this.aStar.findPath(from, to)
    );
  }
};
var RailAdapter = class {
  constructor(gameMap) {
    this.waterPenalty = 5;
    this.heuristicWeight = 2;
    this.directionChangePenalty = 3;
    this.gameMap = gameMap;
    this.width = gameMap.width();
    this.height = gameMap.height();
    this._numNodes = this.width * this.height;
  }
  numNodes() {
    return this._numNodes;
  }
  maxNeighbors() {
    return 4;
  }
  maxPriority() {
    const maxCost = 1 + this.waterPenalty + this.directionChangePenalty;
    return this.heuristicWeight * (this.width + this.height) * maxCost;
  }
  neighbors(node, buffer) {
    let count = 0;
    const x = node % this.width;
    const fromShoreline = this.gameMap.isShoreline(node);
    const isImpassable = this.gameMap.isImpassable(node);
    if (node >= this.width) {
      const n = node - this.width;
      if (this.isTraversable(n, fromShoreline, isImpassable))
        buffer[count++] = n;
    }
    if (node < this._numNodes - this.width) {
      const n = node + this.width;
      if (this.isTraversable(n, fromShoreline, isImpassable))
        buffer[count++] = n;
    }
    if (x !== 0) {
      const n = node - 1;
      if (this.isTraversable(n, fromShoreline, isImpassable))
        buffer[count++] = n;
    }
    if (x !== this.width - 1) {
      const n = node + 1;
      if (this.isTraversable(n, fromShoreline, isImpassable))
        buffer[count++] = n;
    }
    return count;
  }
  isTraversable(to, fromShoreline, isImpassable) {
    if (isImpassable) return false;
    const toWater = this.gameMap.isWater(to);
    if (!toWater) return true;
    return fromShoreline || this.gameMap.isShoreline(to);
  }
  cost(from, to, prev) {
    const penalized = this.gameMap.isWater(to) || this.gameMap.isShoreline(to);
    let c = penalized ? 1 + this.waterPenalty : 1;
    if (prev !== void 0) {
      const d1 = from - prev;
      const d2 = to - from;
      if (d1 !== d2) {
        c += this.directionChangePenalty;
      }
    }
    return c;
  }
  heuristic(node, goal) {
    const nx = node % this.width;
    const ny = node / this.width | 0;
    const gx = goal % this.width;
    const gy = goal / this.width | 0;
    return this.heuristicWeight * (Math.abs(nx - gx) + Math.abs(ny - gy));
  }
};

// src/core/pathfinding/algorithms/AStar.Water.ts
var LAND_BIT = 7;
var MAGNITUDE_MASK = 31;
var COST_SCALE = 100;
var BASE_COST = 1 * COST_SCALE;
function getMagnitudePenalty(magnitude) {
  if (magnitude < 3) return 10 * COST_SCALE;
  if (magnitude <= 10) return 0;
  return 1 * COST_SCALE;
}
var AStarWater = class {
  constructor(map, config) {
    this.stamp = 1;
    this.terrain = map.terrain;
    this.width = map.width();
    this.numNodes = map.width() * map.height();
    this.heuristicWeight = config?.heuristicWeight ?? 5;
    this.maxIterations = config?.maxIterations ?? 1e6;
    this.closedStamp = new Uint32Array(this.numNodes);
    this.gScoreStamp = new Uint32Array(this.numNodes);
    this.gScore = new Uint32Array(this.numNodes);
    this.cameFrom = new Int32Array(this.numNodes);
    this.queue = new MinHeap(this.numNodes);
  }
  findPath(start, goal) {
    this.stamp++;
    if (this.stamp > 4294967295) {
      this.closedStamp.fill(0);
      this.gScoreStamp.fill(0);
      this.stamp = 1;
    }
    const stamp = this.stamp;
    const width = this.width;
    const numNodes = this.numNodes;
    const terrain = this.terrain;
    const closedStamp = this.closedStamp;
    const gScoreStamp = this.gScoreStamp;
    const gScore = this.gScore;
    const cameFrom = this.cameFrom;
    const queue = this.queue;
    const weight = this.heuristicWeight;
    const landMask = 1 << LAND_BIT;
    const goalX = goal % width;
    const goalY = goal / width | 0;
    queue.clear();
    const starts = Array.isArray(start) ? start : [start];
    const s0 = starts[0];
    const startX = s0 % width;
    const startY = s0 / width | 0;
    const dxGoal = goalX - startX;
    const dyGoal = goalY - startY;
    const crossNorm = Math.max(1, Math.abs(dxGoal) + Math.abs(dyGoal));
    const crossTieBreaker = (nx, ny) => {
      const dxN = nx - goalX;
      const dyN = ny - goalY;
      const cross = Math.abs(dxGoal * dyN - dyGoal * dxN);
      return Math.floor(cross * (COST_SCALE - 1) / crossNorm / crossNorm);
    };
    for (const s of starts) {
      gScore[s] = 0;
      gScoreStamp[s] = stamp;
      cameFrom[s] = -1;
      const sx = s % width;
      const sy = s / width | 0;
      const h = weight * BASE_COST * (Math.abs(sx - goalX) + Math.abs(sy - goalY));
      queue.push(s, h);
    }
    let iterations = this.maxIterations;
    while (!queue.isEmpty()) {
      if (--iterations <= 0) {
        return null;
      }
      const current = queue.pop();
      if (closedStamp[current] === stamp) continue;
      closedStamp[current] = stamp;
      if (current === goal) {
        return this.buildPath(goal);
      }
      const currentG = gScore[current];
      const currentX = current % width;
      const currentY = current / width | 0;
      if (current >= width) {
        const neighbor = current - width;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighbor] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const magnitude = neighborTerrain & MAGNITUDE_MASK;
          const cost = BASE_COST + getMagnitudePenalty(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighbor] !== stamp || tentativeG < gScore[neighbor]) {
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentativeG;
            gScoreStamp[neighbor] = stamp;
            const ny = currentY - 1;
            const h = weight * BASE_COST * (Math.abs(currentX - goalX) + Math.abs(ny - goalY));
            const f = tentativeG + h + crossTieBreaker(currentX, ny);
            queue.push(neighbor, f);
          }
        }
      }
      if (current < numNodes - width) {
        const neighbor = current + width;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighbor] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const magnitude = neighborTerrain & MAGNITUDE_MASK;
          const cost = BASE_COST + getMagnitudePenalty(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighbor] !== stamp || tentativeG < gScore[neighbor]) {
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentativeG;
            gScoreStamp[neighbor] = stamp;
            const ny = currentY + 1;
            const h = weight * BASE_COST * (Math.abs(currentX - goalX) + Math.abs(ny - goalY));
            const f = tentativeG + h + crossTieBreaker(currentX, ny);
            queue.push(neighbor, f);
          }
        }
      }
      if (currentX !== 0) {
        const neighbor = current - 1;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighbor] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const magnitude = neighborTerrain & MAGNITUDE_MASK;
          const cost = BASE_COST + getMagnitudePenalty(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighbor] !== stamp || tentativeG < gScore[neighbor]) {
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentativeG;
            gScoreStamp[neighbor] = stamp;
            const nx = currentX - 1;
            const h = weight * BASE_COST * (Math.abs(nx - goalX) + Math.abs(currentY - goalY));
            const f = tentativeG + h + crossTieBreaker(nx, currentY);
            queue.push(neighbor, f);
          }
        }
      }
      if (currentX !== width - 1) {
        const neighbor = current + 1;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighbor] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const magnitude = neighborTerrain & MAGNITUDE_MASK;
          const cost = BASE_COST + getMagnitudePenalty(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighbor] !== stamp || tentativeG < gScore[neighbor]) {
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentativeG;
            gScoreStamp[neighbor] = stamp;
            const nx = currentX + 1;
            const h = weight * BASE_COST * (Math.abs(nx - goalX) + Math.abs(currentY - goalY));
            const f = tentativeG + h + crossTieBreaker(nx, currentY);
            queue.push(neighbor, f);
          }
        }
      }
    }
    return null;
  }
  buildPath(goal) {
    const path = [];
    let current = goal;
    while (current !== -1) {
      path.push(current);
      current = this.cameFrom[current];
    }
    path.reverse();
    return path;
  }
};

// src/core/pathfinding/PathFinder.Air.ts
var AirPathFinder = class {
  constructor(game) {
    this.game = game;
    this.seed = game.ticks();
  }
  findPath(from, to) {
    if (Array.isArray(from)) {
      throw new Error("AirPathFinder does not support multiple start points");
    }
    const random = new PseudoRandom(this.seed);
    const path = [from];
    let current = from;
    while (current !== to) {
      const next = this.computeNext(current, to, random);
      if (next === current) break;
      current = next;
      path.push(current);
    }
    return path;
  }
  computeNext(from, to, random) {
    const x = this.game.x(from);
    const y = this.game.y(from);
    const dstX = this.game.x(to);
    const dstY = this.game.y(to);
    if (x === dstX && y === dstY) {
      return to;
    }
    let nextX = x;
    let nextY = y;
    const ratio = Math.floor(1 + Math.abs(dstY - y) / (Math.abs(dstX - x) + 1));
    if (x === dstX) {
      nextY += y < dstY ? 1 : -1;
    } else if (y === dstY) {
      nextX += x < dstX ? 1 : -1;
    } else {
      if (random.chance(ratio)) {
        nextX += x < dstX ? 1 : -1;
      } else {
        nextY += y < dstY ? 1 : -1;
      }
    }
    return this.game.ref(nextX, nextY);
  }
};

// src/core/utilities/Line.ts
var DistanceBasedBezierCurve = class _DistanceBasedBezierCurve {
  constructor(p0, p1, p2, p3, distanceIncrement) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.cachedPoints = [];
    this.currentIndex = 0;
    this.pixelSpacingScaled = 1;
    this.accumulatedDistanceScaled = 0;
    this.computeAllPoints(distanceIncrement);
  }
  static {
    this.SUB_SCALE = 256;
  }
  /**
   * Statically compute the full length of a bezier curve without allocating any points.
   */
  static getLength(p0, p1, p2, p3) {
    const scale = 256;
    const p0x = Math.round(p0.x) * scale;
    const p0y = Math.round(p0.y) * scale;
    const p3x = Math.round(p3.x) * scale;
    const p3y = Math.round(p3.y) * scale;
    const st = { lastX: p0x, lastY: p0y, accumDist: 0 };
    _DistanceBasedBezierCurve.sharedSubdivide(
      p0x,
      p0y,
      Math.round(p1.x) * scale,
      Math.round(p1.y) * scale,
      Math.round(p2.x) * scale,
      Math.round(p2.y) * scale,
      p3x,
      p3y,
      0,
      st
    );
    const edx = p3x - st.lastX;
    const edy = p3y - st.lastY;
    st.accumDist += Math.floor(Math.sqrt(edx * edx + edy * edy));
    return st.accumDist / scale;
  }
  getAllPoints() {
    return this.cachedPoints;
  }
  /**
   * Move forward along the curve by the given distance/speed step.
   * Returns the next cached point, or null if at the end.
   */
  increment(distance = 1) {
    this.accumulatedDistanceScaled += Math.max(
      1,
      Math.round(distance * _DistanceBasedBezierCurve.SUB_SCALE)
    );
    while (this.currentIndex < this.cachedPoints.length - 1 && this.accumulatedDistanceScaled >= this.pixelSpacingScaled) {
      this.currentIndex++;
      this.accumulatedDistanceScaled -= this.pixelSpacingScaled;
    }
    if (this.currentIndex >= this.cachedPoints.length - 1) {
      return null;
    }
    return this.cachedPoints[this.currentIndex];
  }
  getCurrentIndex() {
    return this.currentIndex;
  }
  /**
   * Precompute curve points using Single-Pass In-Order Recursive De Casteljau Subdivision.
   * Uses IEEE 754 exact-rounded Math.floor(Math.sqrt(...)) for deterministic integer distance accumulation.
   */
  computeAllPoints(pixelSpacing) {
    this.cachedPoints = [];
    this.currentIndex = 0;
    this.accumulatedDistanceScaled = 0;
    this.pixelSpacingScaled = Math.max(
      _DistanceBasedBezierCurve.SUB_SCALE,
      Math.round(pixelSpacing * _DistanceBasedBezierCurve.SUB_SCALE)
    );
    const scale = _DistanceBasedBezierCurve.SUB_SCALE;
    const stepThreshold = this.pixelSpacingScaled;
    const p0x = Math.round(this.p0.x) * scale;
    const p0y = Math.round(this.p0.y) * scale;
    const p3x = Math.round(this.p3.x) * scale;
    const p3y = Math.round(this.p3.y) * scale;
    const st = {
      lastX: p0x,
      lastY: p0y,
      accumDist: 0,
      stepThreshold,
      cachedPoints: this.cachedPoints
    };
    this.cachedPoints.push({
      x: p0x + 128 >> 8,
      y: p0y + 128 >> 8
    });
    _DistanceBasedBezierCurve.sharedSubdivide(
      p0x,
      p0y,
      Math.round(this.p1.x) * scale,
      Math.round(this.p1.y) * scale,
      Math.round(this.p2.x) * scale,
      Math.round(this.p2.y) * scale,
      p3x,
      p3y,
      0,
      st
    );
    const lastPt = {
      x: p3x + 128 >> 8,
      y: p3y + 128 >> 8
    };
    const lastIndex = this.cachedPoints.length - 1;
    if (lastIndex >= 0) {
      const endCached = this.cachedPoints[lastIndex];
      if (endCached.x !== lastPt.x || endCached.y !== lastPt.y) {
        this.cachedPoints.push(lastPt);
      }
    } else {
      this.cachedPoints.push(lastPt);
    }
  }
  static sharedSubdivide(ax, ay, bx, by, cx, cy, dx, dy, depth, st) {
    const dist = Math.abs(bx - ax) + Math.abs(by - ay) + Math.abs(cx - bx) + Math.abs(cy - by) + Math.abs(dx - cx) + Math.abs(dy - cy);
    if (dist <= 256 || depth >= 10) {
      const edx = ax - st.lastX;
      const edy = ay - st.lastY;
      st.accumDist += Math.floor(Math.sqrt(edx * edx + edy * edy));
      st.lastX = ax;
      st.lastY = ay;
      if (st.stepThreshold !== void 0 && st.cachedPoints !== void 0) {
        while (st.accumDist >= st.stepThreshold) {
          st.cachedPoints.push({
            x: ax + 128 >> 8,
            y: ay + 128 >> 8
          });
          st.accumDist -= st.stepThreshold;
        }
      }
      return;
    }
    const m01_x = ax + bx >> 1;
    const m01_y = ay + by >> 1;
    const m12_x = bx + cx >> 1;
    const m12_y = by + cy >> 1;
    const m23_x = cx + dx >> 1;
    const m23_y = cy + dy >> 1;
    const m012_x = m01_x + m12_x >> 1;
    const m012_y = m01_y + m12_y >> 1;
    const m123_x = m12_x + m23_x >> 1;
    const m123_y = m12_y + m23_y >> 1;
    const mx = m012_x + m123_x >> 1;
    const my = m012_y + m123_y >> 1;
    _DistanceBasedBezierCurve.sharedSubdivide(
      ax,
      ay,
      m01_x,
      m01_y,
      m012_x,
      m012_y,
      mx,
      my,
      depth + 1,
      st
    );
    _DistanceBasedBezierCurve.sharedSubdivide(
      mx,
      my,
      m123_x,
      m123_y,
      m23_x,
      m23_y,
      dx,
      dy,
      depth + 1,
      st
    );
  }
};

// src/core/pathfinding/PathFinder.Parabola.ts
var PARABOLA_MIN_HEIGHT = 50;
function getParabolaControlPoints(gameMap, from, to, options) {
  const distanceBasedHeight = options?.distanceBasedHeight ?? true;
  const directionUp = options?.directionUp ?? true;
  const ignoreMapBounds = options?.ignoreMapBounds ?? false;
  const p0 = { x: gameMap.x(from), y: gameMap.y(from) };
  const p3 = { x: gameMap.x(to), y: gameMap.y(to) };
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxHeight = distanceBasedHeight ? Math.max(distance / 3, PARABOLA_MIN_HEIGHT) : 0;
  const heightMult = directionUp ? -1 : 1;
  const mapHeight = gameMap.height();
  const p1y = p0.y + dy / 4 + heightMult * maxHeight;
  const p2y = p0.y + dy * 3 / 4 + heightMult * maxHeight;
  const p1 = {
    x: p0.x + dx / 4,
    y: ignoreMapBounds ? p1y : within(p1y, 0, mapHeight - 1)
  };
  const p2 = {
    x: p0.x + dx * 3 / 4,
    y: ignoreMapBounds ? p2y : within(p2y, 0, mapHeight - 1)
  };
  return [p0, p1, p2, p3];
}
var ParabolaUniversalPathFinder = class {
  constructor(gameMap, options) {
    this.gameMap = gameMap;
    this.options = options;
    this.curve = null;
    this.lastTo = null;
  }
  createCurve(from, to) {
    const increment = this.options?.increment ?? 3;
    const [p0, p1, p2, p3] = getParabolaControlPoints(
      this.gameMap,
      from,
      to,
      this.options
    );
    return new DistanceBasedBezierCurve(p0, p1, p2, p3, increment);
  }
  findPath(from, to) {
    if (Array.isArray(from)) {
      throw new Error(
        "ParabolaUniversalPathFinder does not support multiple start points"
      );
    }
    const curve = this.createCurve(from, to);
    return curve.getAllPoints().map((p) => this.gameMap.ref(Math.floor(p.x), Math.floor(p.y)));
  }
  next(from, to, speed) {
    if (this.lastTo !== to) {
      this.curve = this.createCurve(from, to);
      this.lastTo = to;
    }
    const nextPoint = this.curve.increment(speed ?? 1);
    if (!nextPoint) {
      return { status: 2 /* COMPLETE */, node: to };
    }
    const tile = this.gameMap.ref(
      Math.floor(nextPoint.x),
      Math.floor(nextPoint.y)
    );
    return { status: 0 /* NEXT */, node: tile };
  }
  invalidate() {
    this.curve = null;
    this.lastTo = null;
  }
  currentIndex() {
    return this.curve?.getCurrentIndex() ?? 0;
  }
};

// src/core/pathfinding/PathFinder.Station.ts
var StationPathFinder = class {
  constructor(game) {
    this.manager = game.railNetwork().stationManager();
    const adapter = new StationGraphAdapter(game, this.manager);
    this.aStar = new AStar({ adapter });
  }
  findPath(from, to) {
    const toCluster = to.getCluster();
    const fromArray = Array.isArray(from) ? from : [from];
    const sameCluster = fromArray.filter((s) => s.getCluster() === toCluster);
    if (sameCluster.length === 0) return null;
    const fromIds = sameCluster.map((s) => s.id);
    const path = this.aStar.findPath(fromIds, to.id);
    if (!path) return null;
    return path.map((id) => this.manager.getById(id));
  }
};
var StationGraphAdapter = class {
  constructor(game, manager) {
    this.game = game;
    this.manager = manager;
  }
  numNodes() {
    return this.manager.count();
  }
  maxNeighbors() {
    return 32;
  }
  maxPriority() {
    return this.game.map().width() + this.game.map().height();
  }
  neighbors(node, buffer) {
    const station = this.manager.getById(node);
    if (!station) return 0;
    let count = 0;
    for (const n of station.neighbors()) {
      buffer[count++] = n.id;
    }
    return count;
  }
  cost() {
    return 1;
  }
  heuristic(node, goal) {
    const a = this.manager.getById(node);
    const b = this.manager.getById(goal);
    if (!a || !b) return 0;
    const ax = this.game.x(a.tile());
    const ay = this.game.y(a.tile());
    const bx = this.game.x(b.tile());
    const by = this.game.y(b.tile());
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }
};

// src/core/pathfinding/PathFinderStepper.ts
var PathFinderStepper = class {
  constructor(finder, config = { equals: (a, b) => a === b }) {
    this.finder = finder;
    this.config = config;
    // Numeric paths (TileRefs) are stored as a Uint32Array: steppers hold their
    // whole path for the unit's entire journey, and paths across large maps run
    // to thousands of nodes, so halving the per-node size matters in aggregate.
    this.path = null;
    this.pathIndex = 0;
    this.lastTo = null;
  }
  /**
   * Get the next step on the path from `from` to `to`.
   * Returns PathResult with status and optional next node.
   */
  next(from, to, dist) {
    if (this.config.preCheck) {
      const result = this.config.preCheck(from, to);
      if (result) return result;
    }
    if (this.config.equals(from, to)) {
      return { status: 2 /* COMPLETE */, node: to };
    }
    if (dist !== void 0 && dist > 0 && this.config.distance) {
      if (this.config.distance(from, to) <= dist) {
        return { status: 2 /* COMPLETE */, node: from };
      }
    }
    if (this.lastTo === null || !this.config.equals(this.lastTo, to)) {
      this.path = null;
      this.pathIndex = 0;
      this.lastTo = to;
    }
    if (this.path === null) {
      let path;
      try {
        path = this.finder.findPath(from, to);
      } catch (err) {
        console.error("PathFinder threw an error during findPath", err);
        return { status: 3 /* NOT_FOUND */ };
      }
      if (path === null) {
        return { status: 3 /* NOT_FOUND */ };
      }
      this.path = path.length > 0 && typeof path[0] === "number" ? new Uint32Array(path) : path;
      this.pathIndex = 0;
      if (path.length > 0 && this.config.equals(path[0], from)) {
        this.pathIndex = 1;
      }
    }
    const expectedPos = this.path[this.pathIndex - 1];
    if (this.pathIndex > 0 && !this.config.equals(from, expectedPos)) {
      this.invalidate();
      this.lastTo = to;
      return this.next(from, to, dist);
    }
    if (this.pathIndex >= this.path.length) {
      return { status: 2 /* COMPLETE */, node: to };
    }
    const nextNode = this.path[this.pathIndex];
    this.pathIndex++;
    return { status: 0 /* NEXT */, node: nextNode };
  }
  invalidate() {
    this.path = null;
    this.pathIndex = 0;
    this.lastTo = null;
  }
  /**
   * Returns a copy of the active path beginning at the node most recently
   * returned by next(). Returns null when there is no active traversal.
   */
  pathAfterNext() {
    if (this.path === null || this.pathIndex === 0) return null;
    return this.path.slice(this.pathIndex - 1);
  }
  /** Computes a one-shot route without changing the cached route. */
  findPath(from, to) {
    if (this.config.preCheck) {
      const fromArray = Array.isArray(from) ? from : [from];
      const allFailed = fromArray.every((f) => {
        const result = this.config.preCheck(f, to);
        return result?.status === 3 /* NOT_FOUND */;
      });
      if (allFailed) {
        return null;
      }
    }
    return this.finder.findPath(from, to);
  }
};

// src/core/pathfinding/PathFinderBuilder.ts
var PathFinderBuilder = class _PathFinderBuilder {
  constructor(core) {
    this.core = core;
    this.wrappers = [];
  }
  static create(core) {
    return new _PathFinderBuilder(core);
  }
  wrap(factory) {
    this.wrappers.push(factory);
    return this;
  }
  build() {
    const pathFinder = this.wrappers.reduce(
      (pf, wrapper) => wrapper(pf),
      this.core
    );
    const _findPath = pathFinder.findPath;
    pathFinder.findPath = function(from, to) {
      return DebugSpan.wrap("findPath", () => _findPath.call(this, from, to));
    };
    return pathFinder;
  }
  /**
   * Build and wrap with PathFinderStepper for step-by-step traversal.
   */
  buildWithStepper(config) {
    return new PathFinderStepper(this.build(), config);
  }
};

// src/core/pathfinding/transformers/ComponentCheckTransformer.ts
var ComponentCheckTransformer = class {
  constructor(inner, getComponent) {
    this.inner = inner;
    this.getComponent = getComponent;
  }
  findPath(from, to) {
    const toComponent = this.getComponent(to);
    const fromArray = Array.isArray(from) ? from : [from];
    const validSources = fromArray.filter(
      (f) => this.getComponent(f) === toComponent
    );
    if (validSources.length === 0) {
      return null;
    }
    const delegateFrom = validSources.length === 1 ? validSources[0] : validSources;
    return this.inner.findPath(delegateFrom, to);
  }
};

// src/core/pathfinding/transformers/MiniMapTransformer.ts
var MiniMapTransformer = class {
  constructor(inner, map, miniMap) {
    this.inner = inner;
    this.map = map;
    this.miniMap = miniMap;
  }
  findPath(from, to) {
    const fromArray = Array.isArray(from) ? from : [from];
    const miniFromArray = fromArray.map(
      (f) => this.miniMap.ref(
        Math.floor(this.map.x(f) / 2),
        Math.floor(this.map.y(f) / 2)
      )
    );
    const miniFrom = miniFromArray.length === 1 ? miniFromArray[0] : miniFromArray;
    const miniTo = this.miniMap.ref(
      Math.floor(this.map.x(to) / 2),
      Math.floor(this.map.y(to) / 2)
    );
    const path = this.inner.findPath(miniFrom, miniTo);
    if (!path || path.length === 0) {
      return null;
    }
    const upscaledPath = this.upscalePath(path);
    let srcRef;
    if (Array.isArray(from)) {
      if (upscaledPath.length > 0) {
        const startX = this.map.x(upscaledPath[0]);
        const startY = this.map.y(upscaledPath[0]);
        let minDist = Infinity;
        for (const f of from) {
          const dist = Math.abs(this.map.x(f) - startX) + Math.abs(this.map.y(f) - startY);
          if (dist < minDist) {
            minDist = dist;
            srcRef = f;
          }
        }
      }
    } else {
      srcRef = from;
    }
    return this.fixExtremes(upscaledPath, to, srcRef);
  }
  /**
   * Scale a minimap path up to main-map refs, inserting interpolated points
   * so consecutive path tiles stay adjacent.
   */
  upscalePath(path, scaleFactor = 2) {
    const mini = this.miniMap;
    const main = this.map;
    const smoothPath = [];
    for (let i = 0; i < path.length - 1; i++) {
      const curX = mini.x(path[i]) * scaleFactor;
      const curY = mini.y(path[i]) * scaleFactor;
      const nextX = mini.x(path[i + 1]) * scaleFactor;
      const nextY = mini.y(path[i + 1]) * scaleFactor;
      smoothPath.push(main.ref(curX, curY));
      const dx = nextX - curX;
      const dy = nextY - curY;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      for (let step = 1; step < steps; step++) {
        smoothPath.push(
          main.ref(
            Math.round(curX + dx * step / steps),
            Math.round(curY + dy * step / steps)
          )
        );
      }
    }
    if (path.length > 0) {
      const last = path[path.length - 1];
      smoothPath.push(
        main.ref(mini.x(last) * scaleFactor, mini.y(last) * scaleFactor)
      );
    }
    return smoothPath;
  }
  fixExtremes(upscaled, dst, src) {
    if (src !== void 0) {
      const srcIndex = upscaled.indexOf(src);
      if (srcIndex === -1) {
        upscaled.unshift(src);
      } else if (srcIndex !== 0) {
        upscaled = upscaled.slice(srcIndex);
      }
    }
    const dstIndex = upscaled.indexOf(dst);
    if (dstIndex === -1) {
      upscaled.push(dst);
    } else if (dstIndex !== upscaled.length - 1) {
      upscaled = upscaled.slice(0, dstIndex + 1);
    }
    return upscaled;
  }
};

// src/core/pathfinding/transformers/ShoreCoercingTransformer.ts
var NEIGHBOR_SCRATCH = [0, 0, 0, 0];
var NEIGHBOR_SCRATCH_INNER = [0, 0, 0, 0];
var ShoreCoercingTransformer = class {
  constructor(inner, map) {
    this.inner = inner;
    this.map = map;
  }
  findPath(from, to) {
    const fromArray = Array.isArray(from) ? from : [from];
    const waterToOriginal = /* @__PURE__ */ new Map();
    const waterFrom = [];
    for (const f of fromArray) {
      if (this.map.isWater(f)) {
        waterFrom.push(f);
        waterToOriginal.delete(f);
      } else {
        const water = this.bestWaterNeighbor(f);
        if (water !== -1) {
          waterFrom.push(water);
          waterToOriginal.set(water, f);
        }
      }
    }
    if (waterFrom.length === 0) {
      return null;
    }
    let waterTo = to;
    let originalTo = -1;
    if (!this.map.isWater(to)) {
      waterTo = this.bestWaterNeighbor(to);
      if (waterTo === -1) {
        return null;
      }
      originalTo = to;
    }
    const fromTiles = waterFrom.length === 1 ? waterFrom[0] : waterFrom;
    const path = this.inner.findPath(fromTiles, waterTo);
    if (!path || path.length === 0) {
      return null;
    }
    const originalShore = waterToOriginal.get(path[0]);
    if (originalShore !== void 0) {
      path.unshift(originalShore);
    }
    if (originalTo !== -1 && path[path.length - 1] !== originalTo) {
      path.push(originalTo);
    }
    return path;
  }
  /**
   * Best adjacent water neighbor of a shore tile (highest water-neighbor
   * connectivity, first wins on ties), or -1 if it has none.
   */
  bestWaterNeighbor(tile) {
    let best = -1;
    let maxScore = -1;
    const nbuf = NEIGHBOR_SCRATCH;
    const numNeighbors = this.map.neighbors4(tile, nbuf);
    for (let i = 0; i < numNeighbors; i++) {
      const n = nbuf[i];
      if (!this.map.isWater(n)) continue;
      const score = this.countWaterNeighbors(n);
      if (score > maxScore) {
        maxScore = score;
        best = n;
      }
    }
    return best;
  }
  countWaterNeighbors(tile) {
    let count = 0;
    const nbuf = NEIGHBOR_SCRATCH_INNER;
    const numNeighbors = this.map.neighbors4(tile, nbuf);
    for (let i = 0; i < numNeighbors; i++) {
      if (this.map.isWater(nbuf[i])) count++;
    }
    return count;
  }
};

// src/core/pathfinding/algorithms/AStar.WaterBounded.ts
var LAND_BIT2 = 7;
var MAGNITUDE_MASK2 = 31;
var COST_SCALE2 = 100;
var BASE_COST2 = 1 * COST_SCALE2;
function getMagnitudePenalty2(magnitude) {
  if (magnitude < 3) return 3 * COST_SCALE2;
  if (magnitude <= 10) return 0;
  return 1 * COST_SCALE2;
}
var AStarWaterBounded = class {
  constructor(map, maxSearchArea, config) {
    this.stamp = 1;
    this.terrain = map.terrain;
    this.mapWidth = map.width();
    this.heuristicWeight = config?.heuristicWeight ?? 3;
    this.maxIterations = config?.maxIterations ?? 1e5;
    this.closedStamp = new Uint32Array(maxSearchArea);
    this.gScoreStamp = new Uint32Array(maxSearchArea);
    this.gScore = new Uint32Array(maxSearchArea);
    this.cameFrom = new Int32Array(maxSearchArea);
    this.queue = new MinHeap(maxSearchArea * 4);
  }
  findPath(start, goal) {
    const starts = Array.isArray(start) ? start : [start];
    const goalX = goal % this.mapWidth;
    const goalY = goal / this.mapWidth | 0;
    let minX = goalX;
    let maxX = goalX;
    let minY = goalY;
    let maxY = goalY;
    for (const s of starts) {
      const sx = s % this.mapWidth;
      const sy = s / this.mapWidth | 0;
      minX = Math.min(minX, sx);
      maxX = Math.max(maxX, sx);
      minY = Math.min(minY, sy);
      maxY = Math.max(maxY, sy);
    }
    return this.searchBounded(starts, goal, {
      minX,
      maxX,
      minY,
      maxY
    });
  }
  searchBounded(start, goal, bounds) {
    this.stamp++;
    if (this.stamp > 4294967295) {
      this.closedStamp.fill(0);
      this.gScoreStamp.fill(0);
      this.stamp = 1;
    }
    const stamp = this.stamp;
    const mapWidth = this.mapWidth;
    const terrain = this.terrain;
    const closedStamp = this.closedStamp;
    const gScoreStamp = this.gScoreStamp;
    const gScore = this.gScore;
    const cameFrom = this.cameFrom;
    const queue = this.queue;
    const weight = this.heuristicWeight;
    const landMask = 1 << LAND_BIT2;
    const { minX, maxX, minY, maxY } = bounds;
    const boundsWidth = maxX - minX + 1;
    const goalX = goal % mapWidth;
    const goalY = goal / mapWidth | 0;
    const boundsHeight = maxY - minY + 1;
    const numLocalNodes = boundsWidth * boundsHeight;
    if (numLocalNodes > this.closedStamp.length) {
      return null;
    }
    const toLocal = (tile, clamp = false) => {
      let x = tile % mapWidth;
      let y = tile / mapWidth | 0;
      if (clamp) {
        x = Math.max(minX, Math.min(maxX, x));
        y = Math.max(minY, Math.min(maxY, y));
      }
      return (y - minY) * boundsWidth + (x - minX);
    };
    const toGlobal = (local) => {
      const localX = local % boundsWidth;
      const localY = local / boundsWidth | 0;
      return (localY + minY) * mapWidth + (localX + minX);
    };
    const goalLocal = toLocal(goal, true);
    if (goalLocal < 0 || goalLocal >= numLocalNodes) {
      return null;
    }
    queue.clear();
    const starts = Array.isArray(start) ? start : [start];
    const s0 = starts[0];
    const startX = s0 % mapWidth;
    const startY = s0 / mapWidth | 0;
    const dxGoal = goalX - startX;
    const dyGoal = goalY - startY;
    const crossNorm = Math.max(1, Math.abs(dxGoal) + Math.abs(dyGoal));
    const crossTieBreaker = (nx, ny) => {
      const dxN = nx - goalX;
      const dyN = ny - goalY;
      const cross = Math.abs(dxGoal * dyN - dyGoal * dxN);
      return Math.floor(cross * (COST_SCALE2 - 1) / crossNorm / crossNorm);
    };
    for (const s of starts) {
      const startLocal = toLocal(s, true);
      if (startLocal < 0 || startLocal >= numLocalNodes) {
        continue;
      }
      gScore[startLocal] = 0;
      gScoreStamp[startLocal] = stamp;
      cameFrom[startLocal] = -1;
      const sx = s % mapWidth;
      const sy = s / mapWidth | 0;
      const h = weight * BASE_COST2 * (Math.abs(sx - goalX) + Math.abs(sy - goalY));
      queue.push(startLocal, h);
    }
    let iterations = this.maxIterations;
    while (!queue.isEmpty()) {
      if (--iterations <= 0) {
        return null;
      }
      const currentLocal = queue.pop();
      if (closedStamp[currentLocal] === stamp) continue;
      closedStamp[currentLocal] = stamp;
      if (currentLocal === goalLocal) {
        return this.buildPath(goalLocal, toGlobal, numLocalNodes);
      }
      const currentG = gScore[currentLocal];
      const current = toGlobal(currentLocal);
      const currentX = current % mapWidth;
      const currentY = current / mapWidth | 0;
      if (currentY > minY) {
        const neighbor = current - mapWidth;
        const neighborLocal = currentLocal - boundsWidth;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighborLocal] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const ny = currentY - 1;
          const distToGoal = Math.abs(currentX - goalX) + Math.abs(ny - goalY);
          const magnitude = neighborTerrain & MAGNITUDE_MASK2;
          const cost = BASE_COST2 + getMagnitudePenalty2(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighborLocal] !== stamp || tentativeG < gScore[neighborLocal]) {
            cameFrom[neighborLocal] = currentLocal;
            gScore[neighborLocal] = tentativeG;
            gScoreStamp[neighborLocal] = stamp;
            const h = weight * BASE_COST2 * distToGoal;
            const f = tentativeG + h + crossTieBreaker(currentX, ny);
            queue.push(neighborLocal, f);
          }
        }
      }
      if (currentY < maxY) {
        const neighbor = current + mapWidth;
        const neighborLocal = currentLocal + boundsWidth;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighborLocal] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const ny = currentY + 1;
          const distToGoal = Math.abs(currentX - goalX) + Math.abs(ny - goalY);
          const magnitude = neighborTerrain & MAGNITUDE_MASK2;
          const cost = BASE_COST2 + getMagnitudePenalty2(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighborLocal] !== stamp || tentativeG < gScore[neighborLocal]) {
            cameFrom[neighborLocal] = currentLocal;
            gScore[neighborLocal] = tentativeG;
            gScoreStamp[neighborLocal] = stamp;
            const h = weight * BASE_COST2 * distToGoal;
            const f = tentativeG + h + crossTieBreaker(currentX, ny);
            queue.push(neighborLocal, f);
          }
        }
      }
      if (currentX > minX) {
        const neighbor = current - 1;
        const neighborLocal = currentLocal - 1;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighborLocal] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const nx = currentX - 1;
          const distToGoal = Math.abs(nx - goalX) + Math.abs(currentY - goalY);
          const magnitude = neighborTerrain & MAGNITUDE_MASK2;
          const cost = BASE_COST2 + getMagnitudePenalty2(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighborLocal] !== stamp || tentativeG < gScore[neighborLocal]) {
            cameFrom[neighborLocal] = currentLocal;
            gScore[neighborLocal] = tentativeG;
            gScoreStamp[neighborLocal] = stamp;
            const h = weight * BASE_COST2 * distToGoal;
            const f = tentativeG + h + crossTieBreaker(nx, currentY);
            queue.push(neighborLocal, f);
          }
        }
      }
      if (currentX < maxX) {
        const neighbor = current + 1;
        const neighborLocal = currentLocal + 1;
        const neighborTerrain = terrain[neighbor];
        if (closedStamp[neighborLocal] !== stamp && (neighbor === goal || (neighborTerrain & landMask) === 0)) {
          const nx = currentX + 1;
          const distToGoal = Math.abs(nx - goalX) + Math.abs(currentY - goalY);
          const magnitude = neighborTerrain & MAGNITUDE_MASK2;
          const cost = BASE_COST2 + getMagnitudePenalty2(magnitude);
          const tentativeG = currentG + cost;
          if (gScoreStamp[neighborLocal] !== stamp || tentativeG < gScore[neighborLocal]) {
            cameFrom[neighborLocal] = currentLocal;
            gScore[neighborLocal] = tentativeG;
            gScoreStamp[neighborLocal] = stamp;
            const h = weight * BASE_COST2 * distToGoal;
            const f = tentativeG + h + crossTieBreaker(nx, currentY);
            queue.push(neighborLocal, f);
          }
        }
      }
    }
    return null;
  }
  buildPath(goalLocal, toGlobal, maxPathLength) {
    const path = [];
    let current = goalLocal;
    let iterations = 0;
    while (current !== -1 && iterations < maxPathLength) {
      path.push(toGlobal(current));
      current = this.cameFrom[current];
      iterations++;
    }
    path.reverse();
    return path;
  }
};

// src/core/pathfinding/transformers/SmoothingWaterTransformer.ts
var ENDPOINT_REFINEMENT_TILES = 50;
var LOCAL_ASTAR_MAX_AREA = 100 * 100;
var LOS_MIN_MAGNITUDE_PASS1 = 2;
var LOS_MIN_MAGNITUDE_PASS2 = 3;
var MAGNITUDE_MASK3 = 31;
var SmoothingWaterTransformer = class {
  constructor(inner, map, isTraversable = (t) => map.isWater(t)) {
    this.inner = inner;
    this.map = map;
    this.mapWidth = map.width();
    this.localAStar = new AStarWaterBounded(map, LOCAL_ASTAR_MAX_AREA);
    this.terrain = map.terrain;
    this.isTraversable = isTraversable;
  }
  findPath(from, to) {
    const path = this.inner.findPath(from, to);
    return DebugSpan.wrap(
      "smoothingTransformer",
      () => path ? this.smooth(path) : null
    );
  }
  smooth(path) {
    if (path.length <= 2) {
      return path;
    }
    let smoothed = DebugSpan.wrap(
      "smoother:los",
      () => this.losSmooth(path, LOS_MIN_MAGNITUDE_PASS1)
    );
    smoothed = DebugSpan.wrap(
      "smoother:refine",
      () => this.refineEndpoints(smoothed)
    );
    smoothed = DebugSpan.wrap(
      "smoother:los2",
      () => this.losSmooth(smoothed, LOS_MIN_MAGNITUDE_PASS2)
    );
    return smoothed;
  }
  losSmooth(path, minMagnitude) {
    const result = [path[0]];
    let current = 0;
    while (current < path.length - 1) {
      let lo = current + 1;
      let hi = path.length - 1;
      let farthest = lo;
      while (lo <= hi) {
        const mid = lo + hi >>> 1;
        if (this.canSee(path[current], path[mid], minMagnitude)) {
          farthest = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (farthest > current + 1) {
        const trace = this.tracePath(path[current], path[farthest]);
        if (trace) {
          for (let i = 1; i < trace.length - 1; i++) {
            result.push(trace[i]);
          }
        }
      }
      current = farthest;
      if (current < path.length - 1) {
        result.push(path[current]);
      }
    }
    result.push(path[path.length - 1]);
    return result;
  }
  refineEndpoints(path) {
    if (path.length <= 2) {
      return path;
    }
    const refineDist = ENDPOINT_REFINEMENT_TILES;
    let result = path;
    const startEndIdx = this.findTileAtDistance(path, 0, refineDist, true);
    if (startEndIdx > 1) {
      const startSegment = this.refineSegment(path[0], path[startEndIdx]);
      if (startSegment && startSegment.length > 0) {
        result = [...startSegment.slice(0, -1), ...result.slice(startEndIdx)];
      }
    }
    const endStartIdx = this.findTileAtDistance(
      result,
      result.length - 1,
      refineDist,
      false
    );
    if (endStartIdx < result.length - 2) {
      const endSegment = this.refineSegment(
        result[result.length - 1],
        result[endStartIdx]
      );
      if (endSegment && endSegment.length > 0) {
        endSegment.reverse();
        result = [...result.slice(0, endStartIdx), ...endSegment];
      }
    }
    return result;
  }
  findTileAtDistance(path, startIdx, distance, forward) {
    let cumDist = 0;
    let idx = startIdx;
    if (forward) {
      while (idx < path.length - 1 && cumDist < distance) {
        cumDist += this.manhattanDist(path[idx], path[idx + 1]);
        idx++;
      }
    } else {
      while (idx > 0 && cumDist < distance) {
        cumDist += this.manhattanDist(path[idx], path[idx - 1]);
        idx--;
      }
    }
    return idx;
  }
  refineSegment(from, to) {
    const x0 = this.map.x(from);
    const y0 = this.map.y(from);
    const x1 = this.map.x(to);
    const y1 = this.map.y(to);
    const padding = 10;
    const bounds = {
      minX: Math.max(0, Math.min(x0, x1) - padding),
      maxX: Math.min(this.map.width() - 1, Math.max(x0, x1) + padding),
      minY: Math.max(0, Math.min(y0, y1) - padding),
      maxY: Math.min(this.map.height() - 1, Math.max(y0, y1) + padding)
    };
    return this.localAStar.searchBounded(from, to, bounds);
  }
  canSee(from, to, minMagnitude) {
    const x0 = from % this.mapWidth;
    const y0 = from / this.mapWidth | 0;
    const x1 = to % this.mapWidth;
    const y1 = to / this.mapWidth | 0;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;
    const maxTiles = 1e5;
    let iterations = 0;
    while (true) {
      if (iterations++ > maxTiles) return false;
      const tile = y * this.mapWidth + x;
      if (!this.isTraversable(tile)) return false;
      const magnitude = this.terrain[tile] & MAGNITUDE_MASK3;
      if (magnitude < minMagnitude) return false;
      if (x === x1 && y === y1) return true;
      const e2 = 2 * err;
      const shouldMoveX = e2 > -dy;
      const shouldMoveY = e2 < dx;
      if (shouldMoveX && shouldMoveY) {
        x += sx;
        err -= dy;
        const intermediateTile = y * this.mapWidth + x;
        const intMag = this.terrain[intermediateTile] & MAGNITUDE_MASK3;
        if (!this.isTraversable(intermediateTile) || intMag < minMagnitude) {
          x -= sx;
          err += dy;
          y += sy;
          err += dx;
          const altTile = y * this.mapWidth + x;
          const altMag = this.terrain[altTile] & MAGNITUDE_MASK3;
          if (!this.isTraversable(altTile) || altMag < minMagnitude)
            return false;
          x += sx;
          err -= dy;
        } else {
          y += sy;
          err += dx;
        }
      } else {
        if (shouldMoveX) {
          x += sx;
          err -= dy;
        }
        if (shouldMoveY) {
          y += sy;
          err += dx;
        }
      }
    }
  }
  tracePath(from, to) {
    const x0 = from % this.mapWidth;
    const y0 = from / this.mapWidth | 0;
    const x1 = to % this.mapWidth;
    const y1 = to / this.mapWidth | 0;
    const tiles = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;
    const maxTiles = 1e5;
    let iterations = 0;
    while (true) {
      if (iterations++ > maxTiles) return null;
      const tile = y * this.mapWidth + x;
      if (!this.isTraversable(tile)) return null;
      tiles.push(tile);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      const shouldMoveX = e2 > -dy;
      const shouldMoveY = e2 < dx;
      if (shouldMoveX && shouldMoveY) {
        x += sx;
        err -= dy;
        const intermediateTile = y * this.mapWidth + x;
        if (!this.isTraversable(intermediateTile)) {
          x -= sx;
          err += dy;
          y += sy;
          err += dx;
          const altTile = y * this.mapWidth + x;
          if (!this.isTraversable(altTile)) return null;
          tiles.push(altTile);
          x += sx;
          err -= dy;
        } else {
          tiles.push(intermediateTile);
          y += sy;
          err += dx;
        }
      } else {
        if (shouldMoveX) {
          x += sx;
          err -= dy;
        }
        if (shouldMoveY) {
          y += sy;
          err += dx;
        }
      }
    }
    return tiles;
  }
  manhattanDist(a, b) {
    const ax = a % this.mapWidth;
    const ay = a / this.mapWidth | 0;
    const bx = b % this.mapWidth;
    const by = b / this.mapWidth | 0;
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }
};

// src/core/pathfinding/PathFinder.ts
var _waterChainCache = /* @__PURE__ */ new WeakMap();
function buildWaterChain(game) {
  const hpa = game.miniWaterHPA();
  const graph = game.miniWaterGraph();
  const miniMap = game.miniMap();
  if (!hpa || !graph || graph.nodeCount < 100) {
    const simple = new AStarWater(miniMap);
    return PathFinderBuilder.create(simple).wrap((pf) => new ShoreCoercingTransformer(pf, miniMap)).wrap((pf) => new MiniMapTransformer(pf, game.map(), miniMap)).build();
  }
  const componentCheckFn = (t) => graph.getComponentId(t);
  return PathFinderBuilder.create(hpa).wrap((pf) => new ComponentCheckTransformer(pf, componentCheckFn)).wrap((pf) => new SmoothingWaterTransformer(pf, miniMap)).wrap((pf) => new ShoreCoercingTransformer(pf, miniMap)).wrap((pf) => new MiniMapTransformer(pf, game.map(), miniMap)).build();
}
var WaterPathMemo = class _WaterPathMemo {
  constructor(inner, numTiles, currentWaterVersion, maxBytes = _WaterPathMemo.DEFAULT_MAX_BYTES) {
    this.inner = inner;
    this.numTiles = numTiles;
    this.currentWaterVersion = currentWaterVersion;
    this.maxBytes = maxBytes;
    this.paths = /* @__PURE__ */ new Map();
    this.liveBytes = 0;
    this.waterVersion = currentWaterVersion();
  }
  static {
    this.DEFAULT_MAX_BYTES = 24e6;
  }
  /** Observability for tests: entries currently stored. */
  get entryCount() {
    return this.paths.size;
  }
  /** Observability for tests: live bytes the stored paths account for. */
  get byteCount() {
    return this.liveBytes;
  }
  findPath(from, to) {
    const wv = this.currentWaterVersion();
    if (wv !== this.waterVersion) {
      this.waterVersion = wv;
      this.paths.clear();
      this.liveBytes = 0;
    }
    if (typeof from !== "number") return this.inner.findPath(from, to);
    const key = from * this.numTiles + to;
    const hit = this.paths.get(key);
    if (hit !== void 0) {
      this.paths.delete(key);
      this.paths.set(key, hit);
      return hit === null ? null : Array.from(hit);
    }
    const path = this.inner.findPath(from, to);
    const stored = path === null ? null : Uint32Array.from(path);
    this.liveBytes += stored === null ? 16 : stored.byteLength;
    this.paths.set(key, stored);
    while (this.liveBytes > this.maxBytes) {
      const oldestKey = this.paths.keys().next().value;
      const oldest = this.paths.get(oldestKey);
      this.paths.delete(oldestKey);
      this.liveBytes -= oldest === null || oldest === void 0 ? 16 : oldest.byteLength;
    }
    return path;
  }
};
function sharedWaterChain(game, memoized = false) {
  const version = game.waterGraphVersion();
  let cached = _waterChainCache.get(game);
  if (!cached || cached.version !== version) {
    const chain = buildWaterChain(game);
    cached = {
      version,
      chain,
      memo: new WaterPathMemo(
        chain,
        game.map().width() * game.map().height(),
        () => game.map().waterVersion()
      )
    };
    _waterChainCache.set(game, cached);
  }
  return memoized ? cached.memo : cached.chain;
}
var PathFinding = class _PathFinding {
  static Water(game) {
    return new PathFinderStepper(
      sharedWaterChain(game),
      tileStepperConfig(game)
    );
  }
  static WaterSimple(game) {
    return _PathFinding.Water(game);
  }
  static Rail(game) {
    const miniMap = game.miniMap();
    const pf = new AStarRail(miniMap);
    return PathFinderBuilder.create(pf).wrap((pf2) => new MiniMapTransformer(pf2, game.map(), miniMap)).buildWithStepper(tileStepperConfig(game));
  }
  static Stations(game) {
    const pf = new StationPathFinder(game);
    return PathFinderBuilder.create(pf).buildWithStepper({
      equals: (a, b) => a.id === b.id,
      distance: (a, b) => game.manhattanDist(a.tile(), b.tile())
    });
  }
  static Air(game) {
    const pf = new AirPathFinder(game);
    return PathFinderBuilder.create(pf).buildWithStepper({
      equals: (a, b) => a === b
    });
  }
};
var WaterPathFinder = class {
  /**
   * @param stagger - How many ticks to wait before rebuilding when the water
   *   graph changes.  0 = immediate (default).  Pass a value spread across
   *   [0, STAGGER_SPREAD) to distribute rebuilds over time.
   */
  constructor(game, _stagger = 0, _memoized = false) {
    this.game = game;
    this._stagger = _stagger;
    this._memoized = _memoized;
    this._rebuilt = false;
    this._pendingVersion = -1;
    this.stepper = new PathFinderStepper(
      sharedWaterChain(game, _memoized),
      tileStepperConfig(game)
    );
    this._waterGraphVersion = game.waterGraphVersion();
    this._staggerCountdown = 0;
  }
  static {
    /** Spread to use when auto-staggering ship pathfinders */
    this.STAGGER_SPREAD = 50;
  }
  /** True if the pathfinder was rebuilt since the last call to `rebuilt`. Resets on read. */
  get rebuilt() {
    this.ensureFresh();
    const v = this._rebuilt;
    this._rebuilt = false;
    return v;
  }
  ensureFresh() {
    const v = this.game.waterGraphVersion();
    if (v === this._waterGraphVersion) return;
    if (this._pendingVersion !== v) {
      this._pendingVersion = v;
      this._staggerCountdown = this._stagger;
    }
    if (this._staggerCountdown > 0) {
      this._staggerCountdown--;
      return;
    }
    this._waterGraphVersion = v;
    this.stepper = new PathFinderStepper(
      sharedWaterChain(this.game, this._memoized),
      tileStepperConfig(this.game)
    );
    this._rebuilt = true;
  }
  next(from, to, dist) {
    this.ensureFresh();
    return this.stepper.next(from, to, dist);
  }
  /** Runs a one-shot query without changing the path consumed by next(). */
  findPath(from, to) {
    this.ensureFresh();
    return this.stepper.findPath(from, to);
  }
  /**
   * Returns the route following a successful next() call, starting at `from`.
   * If refreshing the water graph replaced the stepper, fall back to the same
   * one-shot query used before traversal paths were reusable.
   */
  pathForTraversal(from, to) {
    this.ensureFresh();
    const path = this.stepper.pathAfterNext() ?? this.stepper.findPath(from, to);
    if (path === null || path.length === 0) return [from];
    return path[0] === from ? path : [from, ...path];
  }
  invalidate() {
    this.stepper.invalidate();
  }
};
function tileStepperConfig(game) {
  return {
    equals: (a, b) => a === b,
    distance: (a, b) => game.manhattanDist(a, b),
    preCheck: (from, to) => typeof from !== "number" || typeof to !== "number" || !game.isValidRef(from) || !game.isValidRef(to) ? { status: 3 /* NOT_FOUND */ } : null
  };
}

// src/core/execution/SAMMissileExecution.ts
var SAMMissileExecution = class {
  constructor(spawn, _owner, ownerUnit, target, targetTile) {
    this.spawn = spawn;
    this._owner = _owner;
    this.ownerUnit = ownerUnit;
    this.target = target;
    this.targetTile = targetTile;
    this.active = true;
    this.speed = 0;
  }
  init(mg, ticks) {
    this.pathFinder = PathFinding.Air(mg);
    this.mg = mg;
    this.speed = this.mg.config().defaultSamMissileSpeed();
    this.tick(ticks);
  }
  tick(ticks) {
    this.SAMMissile ??= this._owner.buildUnit("SAMMissile" /* SAMMissile */, this.spawn, {
      targetUnit: this.target
    });
    if (!this.SAMMissile.isActive()) {
      this.active = false;
      return;
    }
    const nukesWhitelist = [
      "Atom Bomb" /* AtomBomb */,
      "Hydrogen Bomb" /* HydrogenBomb */,
      "MIRV Warhead" /* MIRVWarhead */
    ];
    if (!this.target.isActive() || !this.ownerUnit.isActive() || this.target.owner() === this.SAMMissile.owner() || !nukesWhitelist.includes(this.target.type())) {
      if (this.target.isActive()) {
        this.target.setTargetedBySAM(false);
      }
      this.SAMMissile.delete(false);
      this.active = false;
      return;
    }
    for (let i = 0; i < this.speed; i++) {
      const result = this.pathFinder.next(
        this.SAMMissile.tile(),
        this.targetTile
      );
      if (result.status === 2 /* COMPLETE */) {
        this.mg.displayMessage(
          "events_display.missile_intercepted",
          10 /* SAM_HIT */,
          this._owner.id(),
          void 0,
          { unit: this.target.type() }
        );
        this.active = false;
        this.target.delete(true, this._owner);
        this.SAMMissile.delete(false);
        this.mg.stats().bombIntercept(this._owner, this.target.type(), 1);
        return;
      } else if (result.status === 0 /* NEXT */) {
        this.SAMMissile.move(result.node);
      }
    }
  }
  isActive() {
    return this.active;
  }
  activeDuringSpawnPhase() {
    return false;
  }
};

// src/core/execution/SAMLauncherExecution.ts
var SAMTargetingSystem = class {
  constructor(mg, sam) {
    this.mg = mg;
    this.sam = sam;
    // Cached interception states indexed by nuke ID to avoid per-tick recomputation.
    this.precomputedNukes = /* @__PURE__ */ new Map();
    this.isTargetableNearbyUnit = ({
      unit
    }) => {
      return this.isValidNukeTarget(unit);
    };
    this.missileSpeed = this.mg.config().defaultSamMissileSpeed();
    this.isTargetableNearbyUnit = this.isTargetableNearbyUnit.bind(this);
  }
  onLevelUp() {
    for (const [id, cached] of this.precomputedNukes) {
      if (cached.tick === -1) {
        this.precomputedNukes.delete(id);
      }
    }
  }
  updateUnreachableNukes(currentTick) {
    for (const [id, cached] of this.precomputedNukes) {
      if (cached.lastSeenTick !== currentTick) {
        this.precomputedNukes.delete(id);
      }
    }
  }
  tickToReach(currentTile, tile) {
    return Math.ceil(
      this.mg.manhattanDist(currentTile, tile) / this.missileSpeed
    );
  }
  checkDetonationInterception(unit, samTile, ticks) {
    const trajectory = unit.trajectory();
    const maxIdx = trajectory.length - 2;
    const finalTile = trajectory[trajectory.length - 1];
    if (!finalTile?.targetable) return void 0;
    const curIdx = unit.trajectoryIndex();
    const waitTicks = unit.nukeState().waitTicks ?? 0;
    const expTicks = trajectory.length - 1 - curIdx + waitTicks;
    const range = this.mg.config().dynamicSamRange(this.sam, ticks + expTicks);
    if (this.mg.euclideanDistSquared(samTile, finalTile.tile) > range * range) {
      return void 0;
    }
    const flightTile = trajectory[maxIdx];
    if (!flightTile?.targetable) return void 0;
    const nukeTicks = maxIdx - curIdx + waitTicks;
    const samTicks = this.tickToReach(samTile, flightTile.tile);
    const tickBeforeShooting = nukeTicks - samTicks;
    return tickBeforeShooting >= 0 ? { tick: tickBeforeShooting, tile: flightTile.tile } : void 0;
  }
  computeInterceptionTile(unit, samTile, ticks) {
    const trajectory = unit.trajectory();
    const curIdx = unit.trajectoryIndex();
    const waitTicks = unit.nukeState().waitTicks ?? 0;
    const maxIdx = trajectory.length - 2;
    const maxSamRangeSq = this.mg.config().maxSamRange() ** 2;
    let minDistSq = Infinity;
    let closestTile = samTile;
    let incSteps = 0;
    let lastDistSq = -1;
    for (let i = curIdx; i <= maxIdx; i++) {
      const tile = trajectory[i];
      const distSq = this.mg.euclideanDistSquared(samTile, tile.tile);
      if (distSq < minDistSq) {
        minDistSq = distSq;
        closestTile = tile.tile;
      }
      incSteps = lastDistSq !== -1 && distSq > lastDistSq ? incSteps + 1 : 0;
      lastDistSq = distSq;
      const nukeTicks = i - curIdx + waitTicks;
      const samTicks = this.tickToReach(samTile, tile.tile);
      const allowed = this.mg.config().dynamicSamRange(this.sam, ticks + nukeTicks);
      if (tile.targetable && distSq <= allowed * allowed && nukeTicks >= samTicks) {
        return {
          tick: nukeTicks - samTicks,
          tile: tile.tile,
          minDistSq,
          lastSeenTick: ticks
        };
      }
      if (incSteps > 3 && distSq > maxSamRangeSq) break;
    }
    const det = this.checkDetonationInterception(unit, samTile, ticks);
    if (det) {
      return { tick: det.tick, tile: det.tile, minDistSq, lastSeenTick: ticks };
    }
    return {
      tick: minDistSq > maxSamRangeSq ? -2 : -1,
      tile: closestTile,
      minDistSq,
      lastSeenTick: ticks
    };
  }
  isValidNukeTarget(unit) {
    if (!isUnit(unit) || unit.targetedBySAM() || unit.owner() === this.sam.owner()) {
      return false;
    }
    const samOwner = this.sam.owner();
    const nukeOwner = unit.owner();
    if (samOwner.isFriendly(nukeOwner)) {
      const gameOver = this.mg.getWinner() !== null && this.mg.config().gameConfig().gameType !== "Singleplayer" /* Singleplayer */;
      return gameOver && samOwner.isOnSameTeam(nukeOwner);
    }
    return true;
  }
  computeTargetScore(target) {
    const samTile = this.sam.tile();
    const unit = target.unit;
    const trajectory = unit.trajectory();
    const currentIndex = unit.trajectoryIndex();
    const timeToExplode = Math.max(1, trajectory.length - currentIndex);
    const targetTile = unit.targetTile() ?? (trajectory.length > 0 ? trajectory[trajectory.length - 1].tile : samTile);
    const distToSilo = this.mg.manhattanDist(samTile, targetTile);
    const typeBonus = unit.type() === "Hydrogen Bomb" /* HydrogenBomb */ ? 70001 : 0;
    const distanceBonus = Math.max(0, 2e5 - distToSilo * 1e3);
    const urgencyBonus = Math.max(0, 1e4 - timeToExplode * 100);
    return typeBonus + distanceBonus + urgencyBonus;
  }
  sortTargets(targets) {
    if (targets.length <= 1) return targets;
    for (const target of targets) {
      target.score = this.computeTargetScore(target);
    }
    return targets.sort((a, b) => b.score - a.score);
  }
  getValidTargets(ticks) {
    const samTile = this.sam.tile();
    const detectionRange = this.mg.config().maxSamRange() * 4;
    const nukes = this.mg.nearbyUnits(
      samTile,
      detectionRange,
      ["Atom Bomb" /* AtomBomb */, "Hydrogen Bomb" /* HydrogenBomb */, "MIRV Warhead" /* MIRVWarhead */],
      this.isTargetableNearbyUnit
    );
    const targets = [];
    for (const nuke of nukes) {
      const id = nuke.unit.id();
      const cached = this.precomputedNukes.get(id);
      if (cached !== void 0) {
        cached.lastSeenTick = ticks;
        if (cached.tick === -2 || cached.tick === -1) continue;
        if (cached.tick === ticks || cached.tick === ticks + 1) {
          targets.push({ tile: cached.tile, unit: nuke.unit });
          this.precomputedNukes.delete(id);
          continue;
        }
        if (cached.tick > ticks) continue;
        this.precomputedNukes.delete(id);
      }
      const res = this.computeInterceptionTile(nuke.unit, samTile, ticks);
      if (res.tick >= 0 && res.tick <= 1) {
        targets.push({ unit: nuke.unit, tile: res.tile });
      } else {
        this.precomputedNukes.set(id, {
          tick: res.tick >= 0 ? res.tick + ticks : res.tick,
          tile: res.tile,
          minDistSq: res.minDistSq,
          lastSeenTick: ticks
        });
      }
    }
    this.updateUnreachableNukes(ticks);
    return this.sortTargets(targets);
  }
};
var SAMLauncherExecution = class {
  constructor(player, tile, sam = null) {
    this.player = player;
    this.tile = tile;
    this.sam = sam;
    this.active = true;
    this.lastLevel = 1;
    if (sam !== null) {
      this.tile = sam.tile();
    }
  }
  init(mg, ticks) {
    this.mg = mg;
  }
  tick(ticks) {
    if (this.mg === null || this.player === null) {
      throw new Error("Not initialized");
    }
    if (this.sam === null) {
      if (this.tile === null) {
        throw new Error("tile is null");
      }
      const spawnTile = this.player.canBuild("SAM Launcher" /* SAMLauncher */, this.tile);
      if (spawnTile === false) {
        console.warn("cannot build SAM Launcher");
        this.active = false;
        return;
      }
      this.sam = this.player.buildUnit("SAM Launcher" /* SAMLauncher */, spawnTile, {});
    }
    this.targetingSystem ??= new SAMTargetingSystem(this.mg, this.sam);
    if (this.lastLevel !== this.sam.level()) {
      this.lastLevel = this.sam.level();
      this.targetingSystem.onLevelUp();
    }
    if (this.sam.isUnderConstruction()) {
      return;
    }
    if (!this.sam.isActive()) {
      this.active = false;
      return;
    }
    if (this.player !== this.sam.owner()) {
      this.player = this.sam.owner();
    }
    while (this.sam.missileTimerQueue().length > 0) {
      const frontTime = this.sam.missileTimerQueue()[0];
      const cooldown = this.mg.config().SAMCooldown() - (this.mg.ticks() - frontTime);
      if (cooldown > 0) {
        break;
      }
      this.sam.reloadMissile();
    }
    if (this.sam.isInCooldown()) {
      return;
    }
    this.pseudoRandom ??= new PseudoRandom(this.sam.id());
    if (this.mg.unitCount("Atom Bomb" /* AtomBomb */) === 0 && this.mg.unitCount("Hydrogen Bomb" /* HydrogenBomb */) === 0 && this.mg.unitCount("MIRV Warhead" /* MIRVWarhead */) === 0) {
      return;
    }
    const targets = this.targetingSystem.getValidTargets(ticks);
    for (const target of targets) {
      if (this.sam.isInCooldown()) {
        break;
      }
      this.sam.launch();
      target.unit.setTargetedBySAM(true);
      this.mg.addExecution(
        new SAMMissileExecution(
          this.sam.tile(),
          this.sam.owner(),
          this.sam,
          target.unit,
          target.tile
        )
      );
    }
  }
  isActive() {
    return this.active;
  }
  activeDuringSpawnPhase() {
    return false;
  }
};

// src/core/game/UnitGrid.ts
var UnitGrid = class {
  constructor(gm) {
    this.gm = gm;
    this.cellSize = 100;
    this.grid = Array(Math.ceil(gm.height() / this.cellSize)).fill(null).map(
      () => Array(Math.ceil(gm.width() / this.cellSize)).fill(null).map(() => /* @__PURE__ */ new Map())
    );
  }
  // Get grid coordinates from pixel coordinates
  getGridCoords(x, y) {
    return [Math.floor(x / this.cellSize), Math.floor(y / this.cellSize)];
  }
  // Add a unit to the grid
  addUnit(unit) {
    const tile = unit.tile();
    const [gridX, gridY] = this.getGridCoords(this.gm.x(tile), this.gm.y(tile));
    if (this.isValidCell(gridX, gridY)) {
      const unitSet = this.grid[gridY][gridX].get(unit.type());
      if (unitSet !== void 0) {
        unitSet.add(unit);
      } else {
        this.grid[gridY][gridX].set(
          unit.type(),
          /* @__PURE__ */ new Set([unit])
        );
      }
    }
  }
  // Remove a unit from the grid
  removeUnit(unit) {
    const tile = unit.tile();
    this.removeUnitByTile(unit, tile);
  }
  removeUnitByTile(unit, tile) {
    const [gridX, gridY] = this.getGridCoords(this.gm.x(tile), this.gm.y(tile));
    if (this.isValidCell(gridX, gridY)) {
      const unitSet = this.grid[gridY][gridX].get(unit.type());
      if (unitSet !== void 0) {
        unitSet.delete(unit);
      }
    }
  }
  /**
   * Move an unit to its new cell if it changed
   */
  updateUnitCell(unit) {
    const newTile = unit.tile();
    const oldTile = unit.lastTile();
    if (newTile === oldTile) return;
    const cs = this.cellSize;
    const gridX = Math.floor(this.gm.x(oldTile) / cs);
    const gridY = Math.floor(this.gm.y(oldTile) / cs);
    const newGridX = Math.floor(this.gm.x(newTile) / cs);
    const newGridY = Math.floor(this.gm.y(newTile) / cs);
    if (gridX !== newGridX || gridY !== newGridY) {
      this.removeUnitByTile(unit, oldTile);
      this.addUnit(unit);
    }
  }
  isValidCell(gridX, gridY) {
    return gridX >= 0 && gridX < this.grid[0].length && gridY >= 0 && gridY < this.grid.length;
  }
  // Compute the exact cells in range of tile
  getCellsInRange(tile, range) {
    const x = this.gm.x(tile);
    const y = this.gm.y(tile);
    const cellSize = this.cellSize;
    const [gridX, gridY] = this.getGridCoords(x, y);
    const startGridX = Math.max(
      0,
      gridX - Math.ceil((range - x % cellSize) / cellSize)
    );
    const endGridX = Math.min(
      this.grid[0].length - 1,
      gridX + Math.ceil((range - (cellSize - x % cellSize)) / cellSize)
    );
    const startGridY = Math.max(
      0,
      gridY - Math.ceil((range - y % cellSize) / cellSize)
    );
    const endGridY = Math.min(
      this.grid.length - 1,
      gridY + Math.ceil((range - (cellSize - y % cellSize)) / cellSize)
    );
    return { startGridX, endGridX, startGridY, endGridY };
  }
  squaredDistanceFromTile(unit, tile) {
    const x = this.gm.x(tile);
    const y = this.gm.y(tile);
    const tileX = this.gm.x(unit.tile());
    const tileY = this.gm.y(unit.tile());
    const dx = tileX - x;
    const dy = tileY - y;
    const distSquared = dx * dx + dy * dy;
    return distSquared;
  }
  // Get all units within range of a point
  // Returns [unit, distanceSquared] pairs for efficient filtering
  nearbyUnits(tile, searchRange, types, predicate, includeUnderConstruction = false) {
    const nearby = [];
    const gm = this.gm;
    const x = gm.x(tile);
    const y = gm.y(tile);
    const { startGridX, endGridX, startGridY, endGridY } = this.getCellsInRange(
      tile,
      searchRange
    );
    const rangeSquared = searchRange * searchRange;
    if (Array.isArray(types)) {
      for (let cy = startGridY; cy <= endGridY; cy++) {
        for (let cx = startGridX; cx <= endGridX; cx++) {
          const cell = this.grid[cy][cx];
          for (const type2 of types) {
            const unitSet = cell.get(type2);
            if (unitSet === void 0) continue;
            for (const unit of unitSet) {
              if (!unit.isActive()) continue;
              if (!includeUnderConstruction && unit.isUnderConstruction())
                continue;
              const unitTile = unit.tile();
              const dx = gm.x(unitTile) - x;
              const dy = gm.y(unitTile) - y;
              const distSquared = dx * dx + dy * dy;
              if (distSquared > rangeSquared) continue;
              const value = { unit, distSquared };
              if (predicate !== void 0 && !predicate(value)) continue;
              nearby.push(value);
            }
          }
        }
      }
      return nearby;
    }
    const type = types;
    for (let cy = startGridY; cy <= endGridY; cy++) {
      for (let cx = startGridX; cx <= endGridX; cx++) {
        const unitSet = this.grid[cy][cx].get(type);
        if (unitSet === void 0) continue;
        for (const unit of unitSet) {
          if (!unit.isActive()) continue;
          if (!includeUnderConstruction && unit.isUnderConstruction()) continue;
          const unitTile = unit.tile();
          const dx = gm.x(unitTile) - x;
          const dy = gm.y(unitTile) - y;
          const distSquared = dx * dx + dy * dy;
          if (distSquared > rangeSquared) continue;
          const value = { unit, distSquared };
          if (predicate !== void 0 && !predicate(value)) continue;
          nearby.push(value);
        }
      }
    }
    return nearby;
  }
  unitIsInRange(unit, tile, rangeSquared, playerId, includeUnderConstruction = false) {
    if (!unit.isActive()) {
      return false;
    }
    if (!includeUnderConstruction && unit.isUnderConstruction()) {
      return false;
    }
    if (playerId !== void 0 && unit.owner().id() !== playerId) {
      return false;
    }
    const distSquared = this.squaredDistanceFromTile(unit, tile);
    return distSquared <= rangeSquared;
  }
  // Return true if it finds an owned specific unit in range
  hasUnitNearby(tile, searchRange, type, playerId, includeUnderConstruction = false) {
    const { startGridX, endGridX, startGridY, endGridY } = this.getCellsInRange(
      tile,
      searchRange
    );
    const rangeSquared = searchRange * searchRange;
    for (let cy = startGridY; cy <= endGridY; cy++) {
      for (let cx = startGridX; cx <= endGridX; cx++) {
        const unitSet = this.grid[cy][cx].get(type);
        if (unitSet === void 0) continue;
        for (const unit of unitSet) {
          if (this.unitIsInRange(
            unit,
            tile,
            rangeSquared,
            playerId,
            includeUnderConstruction
          )) {
            return true;
          }
        }
      }
    }
    return false;
  }
  // Return true if any unit of the given types matches the predicate
  anyUnitNearby(tile, searchRange, types, predicate, playerId, includeUnderConstruction = false) {
    const { startGridX, endGridX, startGridY, endGridY } = this.getCellsInRange(
      tile,
      searchRange
    );
    const rangeSquared = searchRange * searchRange;
    for (let cy = startGridY; cy <= endGridY; cy++) {
      for (let cx = startGridX; cx <= endGridX; cx++) {
        for (const type of types) {
          const unitSet = this.grid[cy][cx].get(type);
          if (unitSet === void 0) continue;
          for (const unit of unitSet) {
            if (!this.unitIsInRange(
              unit,
              tile,
              rangeSquared,
              playerId,
              includeUnderConstruction
            )) {
              continue;
            }
            if (predicate(unit)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
};
export {
  ParabolaUniversalPathFinder,
  SAMLauncherExecution,
  UnitGrid
};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.13 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.13/LICENSE *)
*/
