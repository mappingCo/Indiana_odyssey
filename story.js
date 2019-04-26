function Map() {
  console.log('leaflet version: '+L.version)

  var map = L.map('map').setView([36.7, -2.4], 8);

  var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: " &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors",
    maxZoom: 18
  });


  var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma", {
    layers: "OI.OrthoimageCoverage",//layer name (see get capabilities)
    format: 'image/jpeg',
    transparent: false,
    version: '1.3.0',//wms version (see get capabilities)
    attribution: "Ortofoto PNOA. Cedido por © Instituto Geográfico Nacional de España"
  })

  map.addLayer(osm);

  L.control.layers({'OSM':osm, 'Ortofoto':pnoa}, {}).addTo(map);

  // add intial markers
  var marker = new Array();
  var markers = [{"lat":"37.316814","lon":"-3.127156"},{"lat":"36.854746","lon":"-2.059867"},{"lat":"36.73068571671117","lon":"-2.14582085609436"}, {"lat":"36.83709580821883","lon":"-2.464486062526703"}, {"lat":"36.83995299684287","lon":"-2.4700275063514705"}]
  for(i=0;i<markers.length;i++){
    var myMarker = new L.marker([markers[i].lat, markers[i].lon]);
    marker.push(myMarker);
    map.addLayer(marker[i]);
  }

  //marker1 = new L.Marker(e.latlng, {draggable:true});
  //map.addLayer(marker);
  return map;

};

function Story() {

  var triggers = [];
  var currentState = null;

  function story(t) {
  }

  story.addState = function(a, b, opts) {
    var i = triggers.length;
    triggers.push({
      a: a,
      b: b,
      opts: opts
    });
    a.story(story, function() {
      if (story.state() !== i) {
        story.state(i);
        b();
      }
    });
    b.story(story, function() {
      if (story.state() !== i) {
        state.state(i);
        a();
      }
    });
    return story;
  };

  story.state = function(_) {
    if(_ === undefined) return currentState;
    currentState = _;
  };

  return story;


}

function map() {
  var map = Map()
  var story;

  function _m() {}

  _m.story = function(_) {
    story = _;
  };

  _m.moveTo = function(location, zoom, content) {
    var f = function() {
      /*map.panTo(location);
      map.setZoom(zoom);*/

      map.setView(location, zoom);
      L.marker(location).addTo(map)
        .bindPopup(content).openPopup();
      map.scrollWheelZoom.disable();

    };

    f.story = _m.story;
    return f;
  };
  return _m;
}

function StoryMapPluggin(m) {
}


function timeline() {
}



Scroll._scrolls = [];

function Scroll(el, px) {

  var story;
  var trigger;

  function scroll() {
  }
  scroll.el = el;
  scroll.px = px;

  if(Scroll._scrolls.length === 0) {
    window.addEventListener('scroll', function() {
      var t = null;
      Scroll._scrolls.forEach(function(s) {
        var e = document.getElementById(s.el);
        if(e.getBoundingClientRect().top < s.px) {
          t = s;
        }
      });
      if (t) {
        t.trigger();
      }
    });
  }

  Scroll._scrolls.push(scroll);

  scroll.inverse = function() {};
  scroll.trigger = function() { trigger(); };

  scroll.story = function(s, t) {
    story = s;
    trigger = t;
  };

  return scroll;
}
