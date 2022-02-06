import "./styles.css";
import Gl from "./gl";
import { WIZDATA_URL } from "./constants.js"

const scene = new Gl();
scene.init();

var jquery = require("jquery");
window.$ = window.jQuery = jquery

$(function() {
  console.log(' [ Debug API] url: ', WIZDATA_URL);

  let places = [
    {
      lat: 44.690368658383264,
      lon: 11.782798106212221,
      radius: 1,
      label: "Casa",
      hour: 1
    },
    {
      lat: 44.690368658383264,
      lon: 11.782798106212221,
      radius: 1,
      label: "Nonni",
      hour: 2
    }
  ];

  let coordinatesToHour = function(lat, lon) {
    for(let i=0; i<places.length; i++) {
      const place = places[i];
      let dst = Math.sqrt((lat-place.lat)*(lat-place.lat) + (lon-place.lon)*(lon-place.lon));
      if(dst < place.radius) {
        return place.hour;
      }
    };
    // nothing found?
    return 12;
  }




  $.ajax({
    method: "GET",
    url: WIZDATA_URL,
    crossDomain: true,
    dataType: "json",
    headers: {
      "accept": "application/json",
      "Access-Control-Allow-Origin":"*"
    },
	  //dataType: "json",
    error: function(xhr, status, error) {
        // var err = eval("(" + xhr.responseText + ")");
        console.error('Error on API call')
        console.log(xhr.responseText, status, error);
      }
  }).done(function( data ) {
    if(!data.Items) {
      console.error('Error - no Items on data returned - data:', data)
      return;
    }

    data.Items.forEach((el, idx) => {
      let hr = coordinatesToHour(el.lastLat, el.lastLon);
      console.log(' [ Debug position ] ', el, hr );
      scene.setHandHour(idx+1, hr)
    });

  });
});
