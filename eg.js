(function ($) {
    
    $.Plugin("example", function($IN, $OUT) {
        new $.Load($IN).Submit($.Buffer(function($DATA) {
            $.Parse.Signature( $DATA, function( byte ) {
                $OUT.Buffer( byte.toString(2) ); // Buffer binary data
            });
            $OUT.Complete( "BUFFER", $OUT.GetBuffer );
        }, function(error) { $OUT.Error( new $.Error("Error buffer", error).prompt() ) }));
    });
    
}($FILTER));

/*
Usage:

$FILTER.example("path/to/image", function($BUFFER) {
    // Use $BUFFER
});

*/