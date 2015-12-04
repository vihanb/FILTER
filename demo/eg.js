/* Generated by Babel */
// import * as $FILTER from '../FILTER.js'; // For Server Enviorments

"use strict";

$Plugin("PNGSteg", function ($IN, $OUT) {
  return new $Load($IN[0]).Submit($Buffer(function ($DATA) {
    $OUT.SetBuffer($DATA.length);

    var read = $Parse.Signature($DATA).type;

    for (var i = 0; i < $DATA.length; i++) {
      // if (i >= read) { }
      $OUT.Buffer = $DATA[i];
    }

    $OUT.Close();
  }));
});

Filter.PNGSteg("https://lh4.ggpht.com/wKrDLLmmxjfRG2-E-k5L5BUuHWpCOe4lWRF7oVs1Gzdn5e5yvr8fj-ORTlBF43U47yI=w300", [function (data, Stream) {
  console.log(data);
}]);