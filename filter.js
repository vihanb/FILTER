/* Generated by Babel */
// Definitions
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $Filter$global = window;
var $Filter$length = 2;
var $Filter$IsClass = function $Filter$IsClass(variable, instance) {
    return Object.prototype.toString.call(variable) === "[object " + instance + "]";
};

var $$MAX = (Number.MAX_SAFE_INTEGER + 1 || 9007199254740992) - 1 >>> 0;
var $$LEN = $Filter$length || 2;
var $$BITS = 8;
var $$SIZE = $$BITS << $$LEN;

var $Data = {
    S: {
        PNG: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        JPG: [0xFF, 0xD8, 0xFF, -0x1]
    }
};

// Definitions

var Filter = function Filter() {
    _classCallCheck(this, Filter);
};

var $Parse = {
    Signature: function Signature(data) {
        var typse = Object.keys($Data.s).filter(function (format) {
            return $Data.s[format].every(function (byte, point) {
                return byte >>> 0 === byte || byte === data[point];
            });
        }),
            error = new $Error("File signature error: ");

        if (types.length > 1) error.set.apply(error, ["Conflicting signatures"].concat(_toConsumableArray(types))).log();
        if (types.length < 1) error.set("Unknown type").log();

        return { type: type[0], types: types, error: error };
    }
};

var $Plugin = function $Plugin(name, func) {
    if (!name || typeof func !== "function") return new $Error("Missing or invalid plugin data: ", "name or function").log();

    Filter[name] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _INPUT = function _INPUT() {
            return args.slice(0, args.includes("$OUT") ? -1 : void 0);
        },
            vals = new Map([["$IN", _INPUT], ["$OUT", $Stream]]);

        func.apply(undefined, _toConsumableArray((func.toString().match(/\(([^\)]+)\)/)[1].match(/[A-Za-z$_]+[\w$]*/g) || []).map(function (source) {
            return vals.has(source) ? new (vals.get(source))(args.includes("$OUT") ? $Filter$IsClass(args.reverse()[0], "Array") ? args.reverse()[0][0] : args.reverse()[0] : undefined, args.includes("$OUT") && $Filter$IsClass(args.reverse()[0], "Array") ? args.reverse()[0][1] : undefined) : null;
        })));
    };

    return Filter[name];
};

var $Buffer = function $Buffer() {
    var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
    var error = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
    return [function (request, status, event) {
        if (request === undefined) request = { response: null };
        if (status === undefined) status = 0;

        var _error = new $Error("Buffer error: "),
            data = request.response;
        if (status) {
            if ($Filter$IsClass(data, "ArrayBuffer")) {
                callback(new Uint8Array(data));
            } else {
                _error.set("Invalid Response", data).log();
            }
        } else {
            error(request, event);
            _error.set("A request error occured: ", request, "(" + request.status + ")").log();
        }
    }, {}, null, "arraybuffer"];
};

var $Stream = (function () {
    function $Stream(finish, error) {
        _classCallCheck(this, $Stream);

        this._buf = new ArrayBuffer(0);
        this.Buffer = new Uint8Array(this._buf);

        this.onfinish = finish || function () {};
        this.onerror = error || function () {};

        this.status = 0;
        this._statusError = new Error("Status Error: ");
    }

    _createClass($Stream, [{
        key: "SetBuffer",
        value: function SetBuffer() {
            var length = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this._buf = new ArrayBuffer(length);
            this.Buffer = new Uint8Array(this._buf);
        }
    }, {
        key: "Close",
        value: function Close() {
            if (this.status) this._statusError.set("Stream has already closed", "(" + this.status + ")").log();else this.onfinish(this.status = 1);
        }
    }, {
        key: "Error",
        value: function Error() {
            if (this.status) this._statusError.set("Stream has already closed", "(" + this.status + ")").log();else this.onerror(this.status = 2);
        }
    }]);

    return $Stream;
})();

var $Load = (function () {
    function $Load() {
        var path = arguments.length <= 0 || arguments[0] === undefined ? "./" : arguments[0];
        var method = arguments.length <= 1 || arguments[1] === undefined ? "GET" : arguments[1];

        _classCallCheck(this, $Load);

        this.path = path;
        this.method = method.toUpperCase();
    }

    _createClass($Load, [{
        key: "Submit",
        value: function Submit() {
            var callback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
            var headers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var data = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var responseType = arguments.length <= 3 || arguments[3] === undefined ? "" : arguments[3];

            if (Object.prototype.toString.call(callback) === "[object Array]") return this.Submit.apply(this, _toConsumableArray(callback));

            var request = new XMLHttpRequest();

            request.onload = function (event) {
                return callback(request, request.status === 200, event);
            };
            request.onerror = function (event) {
                return callback(request, false, event);
            };

            request.open(this.method, this.path);
            request.responseType = responseType;

            if (this.method === "POST") request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(headers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;
                    request.setRequestHeader(key, headers[key]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            request.send();
        }
    }]);

    return $Load;
})();

var $Error = (function () {
    function $Error(error) {
        _classCallCheck(this, $Error);

        this.error = error;

        for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            data[_key2 - 1] = arguments[_key2];
        }

        this.data = data;
    }

    _createClass($Error, [{
        key: "set",
        value: function set() {
            for (var _len3 = arguments.length, data = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                data[_key3] = arguments[_key3];
            }

            this.data = data;
        }
    }, {
        key: "from",
        value: function from(error) {
            this.error = error.toString();
            this.data = error;
            return this;
        }
    }, {
        key: "log",
        value: function log(delimiter) {
            if ("console" in $Filter$global) console.error(this.error + this.data.join(delimiter || " "));
            return this;
        }
    }, {
        key: "prompt",
        value: function prompt() {
            if ("console" in $Filter$global) console.log.apply(console, [this.error].concat(_toConsumableArray(this.data)));
            if ("alert" in $Filter$global) alert(this.name + "\n" + this.data.join(" "));
            return this;
        }
    }]);

    return $Error;
})();

;

/* export {
    Filter as default,
    $Load,
    $Error,
    $Plugin
}; // For Server Enviorments */