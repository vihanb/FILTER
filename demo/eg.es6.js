// import * as $FILTER from '../FILTER.js'; // For Server Enviorments

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

    // Variables
    let read  = $Parse.Signature($DATA).type,
        queue = read.length;

    for (let i = 0; i < $DATA.length; i++) {
        if (i === queue) {
            let [LENGTH, TYPE] = [
                FixedReduce(LEN, index => $DATA[i + index], 0),
                FixedReduce(TAG, index => String.fromCharCode($DATA[i + index + LEN]), "")
            ];

            if (TYPE !== "IEND" && LENGTH !== 0) {
                if (!RES.includes(TYPE) && $DATA[i + LEN + TAG + LENGTH - 1]) {
                    $DATA[i + LEN + TAG + LENGTH - 1] ^= (1 ^ $DATA[i + LEN + TAG + LENGTH - 1]) & 1;
                    console.log("RAN");
                }

                // Next Chunk
                queue += LENGTH + TAG + PAD;
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