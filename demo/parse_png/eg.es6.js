// import * as $FILTER from '../FILTER.js'; // For Server Enviorments

$Plugin("PNGSteg", ($IN, $OUT) => new $Load($IN[0]).Submit($Buffer($DATA => {
    $OUT.SetBuffer($DATA.length);

    // Helpers
    const FixedReduce = (len = 0, func = () => {}, prev) => Array(len).fill().reduce((p, _, i, a) => prev + func(i,a), prev);

    // FILE CONSTANTS
    // Currently set to PNG Block data
    const LEN = 4;
    const TAG = 4;
    const PAD = 4;
    const RES = "IHDR|PLTE|IDAT|IEND|cHRM|gAMA|iCCP|sBIT|sRGB|bKGD|hIST|tRNS|pHYs|sPLT|tIME|iTXt|tEXt|zTXt".split`|`;// Reserved Chunk Names

    // Data
    const W_MAX = 32; // bits / char
    const W_PAD = "0".repeat(W_MAX);
    const write = [...$IN[1]].map(char => ( W_PAD + char.charCodeAt().toString(2) ).slice(-W_MAX) ).join``.split``;

    // Variables
    let read  = $Parse.Signature($DATA).type,
        queue = read.length;

    for (let i = 0; i < $DATA.length; i++) {
        if (i === queue) {
            let [LENGTH, TYPE] = [
                FixedReduce(LEN, index => $DATA[i + index], 0),
                Array(TAG).fill().reduce((prev, _, iter) => prev + String.fromCharCode($DATA[i + iter + LEN]), "")
            ];

            if (TYPE !== "IEND") {
                if (LENGTH !== 0) {
                    const sbit  = i + LEN + TAG + LENGTH - 1,
                          sbyte = $DATA[sbit];
                    if (!RES.includes(TYPE) && sbyte && write.length) {
                        if (TYPE.indexOf("[object Object]"))
                            console.log(String.fromCharCode($DATA[i + TYPE.indexOf("[object Object]") + LEN]));
                        $DATA[sbit] ^= (write.shift() ^ sbyte) & 1;
                    }
                }
                queue += LENGTH + TAG + PAD; // Next Chunk
            }
        }
        $OUT.Buffer = $DATA[i];
    }
    $OUT.Close(btoa(Array.prototype.reduce.call($DATA, (prev, cur) => prev + String.fromCharCode(cur), "")));
})));

// 300 

Filter.PNGSteg("https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", "Example Text to Encode", [(data, Stream) => {
    console.log(Stream.Buffer);
    document.body.innerHTML += `<img src="data:image/png;base64,${data}">`;
}]);