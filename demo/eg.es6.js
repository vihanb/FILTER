// import * as $FILTER from '../FILTER.js'; // For Server Enviorments

/*
(function ($, $P) {

    $.Plugin("IMGSteg", function($IN, $OUT) {
        new $.Load( $IN[0] ).Submit( $.Buffer(function( $DATA ) {

            $OUT.BufferSet( $DATA.length );

            var _length = $P.Data.Signatures[ $P.Signature( $DATA ) ].length,
                _pad    = "0".repeat( $.$SIZE ),
                _ubytes = $IN[1].split("").map(function( ubt ) {
                    return ( _pad + ubt.charCodeAt().toString(2) ).slice( -$.$SIZE );
                }).join("");

            if (_length >= $.$MAX) // > 4GB ArrayBuffer
                return new $.Error("Buffer Overflow: ", _length).log();

            _length >>>= 0;

            var dtp = _length +  $IN[1].length * $.$SIZE,
                len = $DATA.length,
                i   = 0;

            for (; i < len; i++) {
                    if (i >= dtp) $DATA[i] &= -2;
                    if (i <  dtp) $DATA[i] ^= ( -_ubytes[ i - _length ] ^ $DATA[i] ) & 1;
                }
                $OUT.Buffer[i] = $ATA[i];
            }

            $OUT.Complete();

            // Outputting Result
            document.body.innerHTML += '<img src="' + ( "data:image/png;base:64," + btoa( String.fromCharCode.apply(null, $DATA) ) ) + '">';

        }));
    });
    // ["http://vihanserver.tk/src/error/img/404.png", "foo bar"]*/

$Plugin("PNGSteg", ($IN, $OUT) => new $Load($IN[0]).Submit($Buffer($DATA => {
    $OUT.SetBuffer($DATA.length);
})));