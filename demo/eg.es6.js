// import * as $FILTER from '../FILTER.js'; // For Server Enviorments

$Plugin("PNGSteg", ($IN, $OUT) => new $Load($IN[0]).Submit($Buffer($DATA => {
    $OUT.SetBuffer($DATA.length);

    // FILE CONSTANTS
    // Currently set to PNG Block data
    const LEN  = 4;
    const NAME = 4;
    const PAD  = 4;
    
    const RES  = ["IHDR", "PLTE", "IDAT", "IEND", "cHRM", "gAMA", "iCCP", "sBIT", "sRGB", "bKGD", "hIST", "tRNS", "pHYs", "sPLT", "tIME", "iTXt", "tEXt", "zTXt"];
          
    // Tests
    let types = {};
    RES.forEach(name => types[name] = 0);

    // Variables
    let read  = $Parse.Signature($DATA).type,
        queue = read.length;

    for (let i = 0; i < $DATA.length; i++) {
        if (i === queue) {
            let [LENGTH, TYPE] = [
                Array(LEN) .fill().reduce((prev, _, iter) => prev + $DATA[i + iter], 0),
                Array(NAME).fill().reduce((prev, _, iter) => prev + String.fromCharCode($DATA[i + iter + LEN]), "")
            ];

            if (TYPE !== "IEND" && LENGTH !== 0) {
                if (!types[TYPE]) types[TYPE] = 0;
                types[TYPE]++;
                if (!RES.includes(TYPE) && $DATA[i + LEN + NAME + LENGTH - 1]) {
                    $DATA[i + LEN + NAME + LENGTH - 2] ^= (0 ^ $DATA[i + LEN + NAME + LENGTH - 1]) & 1;
                    console.log("RAN");
                }

                // Next Chunk
                queue += LENGTH + NAME + PAD;
            }
        }
        $OUT.Buffer = $DATA[i];
    }
    console.log(types);

    $OUT.Close(btoa(Array.prototype.reduce.call($DATA, (prev, cur) => prev + String.fromCharCode(cur), "")));
})));

// 300 

Filter.PNGSteg("https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", "Example Text to Encode", [(data, Stream) => {
    console.log(Stream.Buffer);
    document.body.innerHTML += `<img src="data:image/png;base64,${data}">`;
}]);