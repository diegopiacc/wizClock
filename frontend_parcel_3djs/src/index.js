import "./styles.css";
import Gl from "./gl";
import WIZDATA_URL from "./constants.js"

const scene = new Gl();
scene.init();

var jquery = require("jquery");
window.$ = window.jQuery = jquery

$(function() {
  console.log('ERODE 1 '. WIZDATA_URL);
  $.ajax({
    method: "GET",
    url: WIZDATA_URL,
    //dataType: "json",
    error: function(xhr, status, error) {
        // var err = eval("(" + xhr.responseText + ")");
        console.log('ERODE 666')
        console.log(xhr.responseText, status, error);
      }
  }, function( data ) {
    console.log('ERODE 2', data );
    alert( "Load was performed." );
  });
});
