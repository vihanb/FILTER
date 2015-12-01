# FILTER
FILTER is a high performance JavaScript library aiding in image and binary processing.

This *may* be merged with JAW, later on as development continues, but will remain seperate.

---
# Portability

FILTER doesn't use DOM JavaScript methods such as `canvas`, instead, FILTER uses, `ArrayBuffer`s, and Typed Arrays such as the `Uint8Array` to store RAW data and to handle them.

This means FILTER can run in almost any ECMAScript enviorment such as node.js, rhino, spidermonkey, and others.

FILTER, manually parses the image files, and using `$FILTER.Parse`, FILTER makes it easy to manually parse and edit images, and other files.

Due to JavaScript's 32-bit nature, buffers are limited to 4GB. An error will be thrown if an overflow occurs.

---
# Reference

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

Will add pretty pictures later.
