function ready(error, locs, states){
  if(error) throw error
  var bisect = d3.bisector(function(d) { return d.time }).left
    // where the scale starts and ends
    , playback_speed = 2
    , mapStyles = [
      {
        "stylers": [
          { "visibility": "off" }
        ]
      }
      , {
        "featureType": "water",
        "elementType": "geometry.fill"
        , "stylers": [
          { "visibility": "on" }
          , { "color": "#ffffff" }
        ]
      }
      , {
        "featureType": "road"
        , "elementType": "geometry"
        , "stylers": [
          { "visibility": "on" }
          , { "color": "#aaaaaa" }
          , { "weight": 0.2 }
        ]
      }
      , {
        "featureType": "landscape"
        , "elementType": "geometry.fill"
        , "stylers": [
          { "visibility": "on" }
          , { "color": "#555555" }
        ]
      }
    ]
    , totalCap = locs.reduce(function(cap, loc){
        return cap + loc.cap
      }, 0)
    , maxLoc = locs.reduce(function(max, loc){
      return (loc.cap > max.cap) ? loc: max
    }, { cap: 0 })
    , scale = d3.scale.linear()
      .domain([0, maxLoc.cap])
      .range([0, 50000])
      // .range([100, 100])
      .clamp(false)
    , color = d3.scale.linear()
      .domain([0, 1])
      // white -> black
      // .range(['white', 'black'])
      // dark gray -> yellow
      .range(['#555', '#FFD540'])
      // 5 color range
      .domain([0, 0.25, 0.5, 0.75, 1])
      .range(["blue","cyan","white","yellow","red"])
      .interpolate(d3.interpolateHsl)
    , currentTime = d3.select('body').append('h1')
      .attr('id', 'current-time')
    , map = new google.maps.Map(d3.select("body").append('div')
      .attr('id', 'map')
      .style('width', window.innerWidth + 'px')
      .style('height', window.innerHeight + 'px')
      .node()
      , {
        zoom: 14
        , disableDefaultUI: true
        , zoomControl: true
        , center: new google.maps.LatLng(37.79097136482523, -122.41546057128903)
        , mapTypeId: google.maps.MapTypeId.ROADMAP
      })
    // the current time
    , time
    // the current state of the visualization (aka, a row in data.csv)
    , state
  
  window.map = map
  
  // so that the large cap locations will be drawn bellow others
  locs = locs.sort(function(a, b){ return b.cap - a.cap })
  
  states.forEach(function(state){
    state.time = moment(state.time)
  })
  
  function stepState(dt){
    // find the index in state that's the closest to now without going over
    if(time){
      time.add('milliseconds', dt)
      state = states[bisect(states, time)]
    }
    if(!state) {
      // Oh no! We've run out of time. loop over from the beginning
      state = states[0]
      time = state.time.clone()
    }
  }
  
  function updateMarkers(){
    d3.selectAll('.stations svg.marker circle')
    .transition()
    .duration()
    .attr("fill", function(d){
      if( Number(state[d.name]) / Number(d.cap) > 1){
        // console.log('occ', state[d.name], ' cap: ', d.cap);
        // console.log(d);
        return color(1)
      }else return color( Number(state[d.name]) / Number(d.cap) )
    })
    .attr('r', function(d){
      // set the _AREA_ of the circle
      return Math.sqrt( scale(Number(state[d.name])) / Math.PI )
    })
  }
  
  ;(function(){
    var min = Number(states[0].time.toDate())
      , max = Number(states[states.length -1].time.toDate())
    $("#slider").slider({
        value : 5
        , min : min
        , max : max
        , step : (max - min) / states.length
        , change : function(event, ui) {
          time = moment(new Date(ui.value))
          tick(0)
        }
    })
  })()
  
  function tick(dt){
    stepState(dt) // how much time to step forward in data
    d3.select("#current-time").text(time.format("dddd, MMMM Do, h:mm:ssa"))
    updateMarkers()
  }
  
  
  // change to `true` to have the animation `play`
  if(false){
    var start, stop
    (function loop(){
      start = new Date
      window.requestAnimationFrame(function(){
        stop = new Date
        dt = stop - start
        tick(dt * playback_speed)
        loop()
      })
    })()
  }
  
  
  map.setOptions({ styles: mapStyles })

  overlay = new google.maps.OverlayView()

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayLayer).append("div")
      .attr("class", "stations")
    // Draw each marker as a separate SVG element.
    this.draw = function() {
      var projection = this.getProjection()
        , padding = 10
        , marker = layer.selectAll("svg")
            .data(locs)
            // update existing markers
            .each(transform)
            .enter().append("svg")
              .each(transform)
              .attr("class", "marker")
              .attr("height", function(v){
                return scale(maxLoc.cap) * 2 + padding * 2
              })
              .attr("width", function(v){
                return scale(maxLoc.cap) * 2 + padding * 2
              })
              // Add a circle.
              .append("circle")
                .attr("r", function(d){ return Math.sqrt( scale(d.cap) / Math.PI )  })
                .attr("cx", function(d){ return padding + scale(maxLoc.cap) })
                .attr("cy", function(d){ return padding + scale(maxLoc.cap) })

      function transform(d) {
        if (d.loc instanceof Array){
          // convert to loc
          d.loc = {
            lon: d3.mean([d.loc[0].lon, d.loc[1].lon])
            , lat: d3.mean([d.loc[0].lat, d.loc[1].lat])
          }
        }
        var proj = new google.maps.LatLng(d.loc.lat, d.loc.lon)
        proj = projection.fromLatLngToDivPixel(proj)
        return d3.select(this)
          .style("left", (proj.x - scale(maxLoc.cap) - padding ) + "px")
          .style("top", (proj.y - scale(maxLoc.cap) - padding ) + "px")
      }
      
      // draw the scene for the first time
      tick(0)
    }
  }



  // Bind our overlay to the map…
  overlay.setMap(map)
}