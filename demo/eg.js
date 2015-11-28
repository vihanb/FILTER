(function ($, $IN) {

    $.Plugin("PNGSteg", function($IN, $OUT) {
        new $.Load( $IN[0] ).Submit( $.Buffer(function( $DATA ) {
            var _length = $.Parse.Data.Signatures[ $.Parse.Signature( $DATA ) ].length,
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
                if (i >= _length) {
                    if (i >= dtp) $DATA[i] &= -2;
                    if (i < dtp)  $DATA[i] ^= ( -_ubytes[ i - _length ] ^ $DATA[i] ) & 1;
                }   
            }

            // Outputting Result

            document.body.innerHTML += '<img src="' + ( "data:image/png;base:64," + btoa( String.fromCharCode.apply(null, $DATA) ) ) + '">';

        }));
    });

}($FILTER, ["http://vihanserver.tk/src/error/img/404.png", "foo bar"]));