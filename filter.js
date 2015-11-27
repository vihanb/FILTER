(function($GLOBAL) {
    var Filter = {
        Error: function( error ) { this.error = error; this.data = Array.prototype.slice.call(arguments, 1) },
        Load:  function( file, method )  { this.path = file; this.method = method || "GET"; },
        // ImageBLOB ( callback )
        // Parse { PNG, JPEG }
    };

    /* == Constants == */
    Filter.$MAX = ( Number.MAX_SAFE_INTEGER || 9007199254740991 ) >>> 0;

    Filter.Parse = {
        Data: {
            Signatures: {
                PNG: "89 50 4E 47 0D 0A 1A 0A",
                JPG: "FF D8 FF ?"
            }
        },
        Signature: function(raw) {
            var error = new Filter.Error("File Signature Error: "),
                TYPE = Object.keys( Filter.Parse.Data.Signatures ).filter(function (_TYPE) {
                    return Filter.Parse.Data.Signatures[ _TYPE ].split(" ").every(function (hex, loc) {
                        return hex === "?" || raw[ loc ] === parseInt( hex, 16 );
                    });
                });

            if (TYPE.length > 1) error.set("Conflicting signatures", TYPE.join("|")).log();
            if (TYPE.length < 1) error.set("Unknown signature").log();
        }
    };

    Filter.Buffer = function(callback, error) {
        return [function(status, request, event) {
            var _error = new Filter.Error("Buffer error: "),
                data  = (request || {}).response || null;
            if (status === 1) {
                if ( Object.prototype.toString.call( data ) === "[object ArrayBuffer]") {

                    var _buffer = new Uint8Array( data ),
                        _length = _buffer.length >>> 0;
                    callback.call( Filter, _buffer );

                } else {
                    _error.set("Invalid Response", data).log();
                }
            } else {
                if (error) error.call(this, status, request, event);
            }
        }, {}, null, "arraybuffer"]
    };

    Filter.Load.prototype.Submit = function(callback, headers, data, responseType) {
        // ImageBLOB support
        if ( Object.prototype.toString.call( callback ) === "[object Array]" ) return Filter.Load.prototype.Submit.apply(this, callback);

        var self = this;
        this.request = new XMLHttpRequest();

        this.request.onreadystatechange = function(event) {
            if (this.readyState === 4) {
                callback.call(this, 0, self.request, event);

                if (this.status === 200) {
                    callback.call(this, 1, self.request, event);
                }
            }
        };

        if (this.request.onerror)
            this.request.onerror = function(event) { callback.call(this, -1, self.request, event) };

        this.request.open(this.method, this.path, true);

        this.request.responseType = responseType || "";

        if (this.method.toUpperCase() === "POST")
            this.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        (Object.keys(headers || {}) || []).forEach(function(name) {
            this.request.setRequestHeader(name, headers[name]);
        });

        this.request.send(data || null);
    };

    /* == Error Handling Class == */

    Filter.Error.prototype = {
        import: function( error ) {
            this.error = error.toString();
            this.data  = error;
            return this;
        },
        prompt: function() {
            if (console) // Node.js
                console.error.apply(this.data, [this.error, this.data]);
            if (alert) // JavaScript
                alert(this.data + "\n" + this.data);

            return this;
        },
        log: function(lim) {
            if (console)
                console.log(this.error + this.data.join(lim || " "));

            return this;
        },
        set: function() {
            this.data = this.data.concat(Array.prototype.slice.call(arguments) || []);
            return this;
        },
        suppress: function(func,scope) { try {func.call(scope || this)} catch(e) {this.import(e)}; return this; }
    };

    $GLOBAL.$FILTER = Filter;
}(window));