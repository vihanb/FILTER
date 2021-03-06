# FILTER
FILTER is a high performance JavaScript library aiding in image and binary processing.

This *may* be merged with JAW, later on as development continues, but will remain seperate.

---
# What is FILTER? How will it help me and how can I use it?

Filter is a ECMAScript (JavaScript) library that can read/write files. Filter is designed for image proccesssing but supports features for most binary formats

---

Here's an example. This can proccess a PNG file after recieving binary data

```js
$Plugin("PNGSteg", ($IN, $OUT) => new $Load($IN[0]).Submit($Buffer($DATA => {
    $OUT.SetBuffer($DATA.length);

    // Helpers
    const FixedReduce = (len = 0, func = () => {}, prev) => {
        return Array(len).fill().reduce((p, _, i, a) => prev + func(i,a), prev);
    };

    // FILE CONSTANTS
    // Currently set to PNG Block data
    const LEN = 4;
    const TAG = 4;
    const PAD = 4;
    const RES = "IHDR|PLTE|IDAT|IEND|cHRM|gAMA|iCCP|sBIT|sRGB|bKGD|hIST|tRNS|pHYs|sPLT|tIME|iTXt|tEXt|zTXt".split`|`;// Reserved Chunk Names

    // Data
    const W_MAX = 32; // bits / char
    const W_PAD = "0".repeat(W_MAX);
    const write = [...$IN[1]].map(char => ( W_PAD + char.charCodeAt() ).slice(-W_MAX) ).join``.split``;

    // Variables
    let read  = $Parse.Signature($DATA).type,
        queue = read.length;

    for (let i = 0; i < $DATA.length; i++) {
        if (i === queue) {
            let [LENGTH, TYPE] = [
                FixedReduce(LEN, index => $DATA[i + index], 0),
                FixedReduce(TAG, index => String.fromCharCode($DATA[i + index + LEN]), "")
            ];

            if (TYPE !== "IEND") {
                if (LENGTH !== 0) {
                    let sbit = i + LEN + TAG; // Block data start indexs
                    // Check block name (TYPE), do something with sbit
                }
                queue += LENGTH + TAG + PAD; // Next Chunk
            }
        }
        $OUT.Buffer = $DATA[i];
    }
    $OUT.Close(btoa(Array.prototype.reduce.call($DATA, (prev, cur) => prev + String.fromCharCode(cur), "")));
})));
```


---
# Why is FILTER better than alternatives?
### Portability

FILTER doesn't use DOM JavaScript methods such as `canvas`, instead, FILTER uses, `ArrayBuffer`s, and Typed Arrays such as the `Uint8Array` to store RAW data and to handle them.

This means FILTER can run in almost any ECMAScript enviorment such as node.js, rhino, spidermonkey, and others.

FILTER, manually parses the image files, and using `Filter.Parse`, FILTER makes it easy to manually parse and edit images, and other files.

Due to JavaScript's 32-bit nature, buffers are limited to 4GB. An error will be thrown if an overflow occurs.

---
### Enviorments

All of FILTER's data is contained in either: a. the `Filter` global; or b., through the exported `FILTER`. Various enviorments have different support

#### Browser:

    window.$FILTER = Filter;
    
#### Server:

    import * as $FILTER from 'FILTER'

The only browser specific class is `$$Canvas`. For compatibility, the `$Parse` class wraps this up, `$Parse` will detect for the `document` global and various other canvas specific support to centeralize image parsing.

Image parsing on enviorments which don't support `$$Canvas`, use the `Filter.Parse` engine. This uses the `$Parse.Signature` to detect files and `$Parse.Read` to extract image data.

---
## Reference

 - `Plugin`
 - `Stream`
  - `SetBuffer`
  - `Finish`
  - `Error`
 - `Parse`
  - `Data`
    - `Signatures`
      - `PNG`
      - `JPG`
  - `Signature`
 - `Buffer`
 - `Load`
  - `Submit`
 - `Error`
  - `import`
  - `prompt`
  - `log`
  - `set`
  - `suppress`

---
# Further Examples

Loading an image and looping through bytes

```js
(function($) {
  new $.Load("my/image").Submit( $.Buffer(function($DATA) {
    for (var len = $DATA.length, i = 0; i < len; i++) {
      // Use: $DATA[i]
      // You may wrap in a $.Plugin()
      // Then you may use $OUT.Buffer()
    }
  }));
}($FILTER));
```

Using `$.Plugin`, and using `$.Parse.Signature`, buffer overflow protection

```js
(function($, $P) {
  $.Plugin("ex_plugin", function($IN, $OUT) {
    new $.Load($IN[0]).Submit( $.Buffer(function($DATA) {
      var signatureLength = $P.Data.Signatures[$P.Signature($DATA)].length,
          bufferLength    = $DATA.length,
          i               = 0,
          error           = new $.Error();
      
      if (bufferLength > $.$MAX) error.set("Buffer overflow: ", bufferLength).log();
      
      bufferLength >>>= 0; // Saftey case
      
      $OUT.SetBuffer(bufferLength);
      
      for (; i < bufferLength; i++) {
        if (i > signatureLength) {
          // Modify `$DATA[i - signatureLength]` safely
        }
        $OUT.Buffer($DATA[i]); // Send Output Data
      }
      $OUT.Finish()
    }));
  });
}($FILTER, $FILTER.Parse));

/* Usage */

$FILTER.ex_plugin("path/to/image", function($DATA) {
  // Received $DATA, from $OUT.Buffer
});

```

---

Will add pretty pictures later.
