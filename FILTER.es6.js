// Definitions
const $Filter$global  = window;
const $Filter$length  = 2;
const $Filter$IsClass = (variable, instance) => Object.prototype.toString.call(variable) === `[object ${instance}]`;

const $$MAX  = ( Number.MAX_SAFE_INTEGER + 1 || 9007199254740992 ) - 1 >>> 0;
const $$LEN  = $Filter$length || 2;
const $$BITS = 8;
const $$SIZE = $$BITS << $$LEN;

const $Data = {
    S: {
        PNG: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
        JPG: [0xFF, 0xD8, 0xFF, -0x1]
    }
};

// Definitions
class Filter {

}

const $Parse = {
    Signature(data) {
        let typse  = Object.keys($Data.s).filter(format => $Data.s[format].every((byte, point) => byte >>> 0 === byte || byte === data[point])),
            error = new $Error("File signature error: ");

        if (types.length >  1) error.set("Conflicting signatures", ...types).log();
        if (types.length <  1) error.set("Unknown type").log();

        return { type: type[0], types, error };
    }
};

const $Plugin = (name, func) => {
    if (!name || typeof func !== "function") return new $Error("Missing or invalid plugin data: ", "name or function").log();

    Filter[name] = (...args) => {
        const _INPUT = () => args.slice(0, args.includes("$OUT") ? -1 : void 0),
              vals   = new Map([["$IN", _INPUT],
                                ["$OUT", $Stream]]);

        func(...(func.toString()
                 .match(/\(([^\)]+)\)/)[1]
                 .match(/[A-Za-z$_]+[\w$]*/g) || []).map(source => vals.has(source) ? new (vals.get(source))(
            args.includes("$OUT") ? $Filter$IsClass(args.reverse()[0], "Array") ? args.reverse()[0][0] : args.reverse()[0] : undefined,
            args.includes("$OUT") && $Filter$IsClass(args.reverse()[0], "Array") ? args.reverse()[0][1] : undefined
        ) : null));
    }

    return Filter[name];
};

const $Buffer = (callback = () => {}, error = () => {}) => [(request = { response: null }, status = 0, event) => {
    let _error = new $Error("Buffer error: "),
        data   = request.response;
    if (status) {
        if ($Filter$IsClass(data, "ArrayBuffer")) {
            callback(new Uint8Array(data));
        } else {
            _error.set("Invalid Response", data).log();
        }
    } else {
        error(request, event);
        _error.set("A request error occured: ", request, `(${request.status})`).log();
    }
}, {}, null, "arraybuffer"];

class $Stream {
    constructor(finish, error) {
        this._buf   = new ArrayBuffer(0);
        this.Buffer = new Uint8Array(this._buf);

        this.onfinish = finish || ()=>{};
        this.onerror  = error  || ()=>{};

        this.status = 0;
        this._statusError = new Error("Status Error: ");
    }
    SetBuffer(length = 0) {
        this._buf   = new ArrayBuffer(length);
        this.Buffer = new Uint8Array(this._buf);
    }
    Close() {
        if (this.status) this._statusError.set("Stream has already closed", `(${this.status})`).log();
        else this.onfinish(this.status = 1);
    }
    Error() {
        if (this.status) this._statusError.set("Stream has already closed", `(${this.status})`).log();
        else this.onerror (this.status = 2);
    }
}

class $Load {
    constructor(path = "./", method = "GET") {
        this.path   = path;
        this.method = method.toUpperCase();
    }
    Submit(callback = () => {}, headers = {}, data = null, responseType = "") {
        if (Object.prototype.toString.call(callback) === "[object Array]") return this.Submit(...callback);

        let request = new XMLHttpRequest();

        request.onload  = (event) => callback(request, request.status === 200, event);
        request.onerror = (event) => callback(request, false, event);

        request.open(this.method, this.path);
        request.responseType = responseType;

        if (this.method === "POST") request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        for (let key of Object.keys(headers)) request.setRequestHeader(key, headers[key]);

        request.send();
    }
}

class $Error {
    constructor(error, ...data) {
        this.error = error;
        this.data  = data;
    }
    set(...data) {
        this.data = data;
    }
    from(error) {
        this.error = error.toString();
        this.data  = error;
        return this;
    }
    log(delimiter) {
        if ("console" in $Filter$global)
            console.error(this.error + this.data.join(delimiter || " "));
        return this;
    }
    prompt() {
        if ("console" in $Filter$global)
            console.log(this.error, ...this.data);
        if ("alert"   in $Filter$global)
            alert(`${this.name}\n${this.data.join(" ")}`);
        return this;
    }
};

/* export {
    Filter as default,
    $Load,
    $Error,
    $Plugin
}; // For Server Enviorments */