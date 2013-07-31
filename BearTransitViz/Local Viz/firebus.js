
var shape
var color = d3.scale.linear().range(["green", "yellow", "red"]).domain([0, 5*60, 15*60])
var predictions = d3.scale.linear()
var buses = {}
var stops = {}
var walkingSpeed = 3 //[km/hr]
var catchmentStopId = null 
var catchmentActive = false
var center
var catch1 = new google.maps.Circle()
var catch2 = new google.maps.Circle()
var catch1Options = {fillColor:'gray',
                      fillOpacity:0.5,
                      strokeColor:"black",
                      strokeOpacity:1,
                      strokeWeight:2}
var catch2Options = {fillColor:'gray',
                      fillOpacity:0.25,
                      strokeColor:"black",
                      strokeOpacity:1,
                      strokeWeight:2}


function initializeFirebase() {
  var f = new Firebase("https://beartransitviz.firebaseio.com/bear-transit/raw_location");
  var fStops = new Firebase("https://beartransitviz.firebaseio.com/bear-transit/stops_prediction");
  d3.timer(function(){ // makes sure the div has been created, otherwise we would not be able to plot anything
    if (!d3.select("#Overlay").empty()) {

      f.once("value", function(s) { // downloads the list of buses, updates the list of buses, creates an svg for each bus (calls the add circle) and deletes any bus svg that already exists

        buses = s.val()
        console.log(s.val())
        var d3buses = d3.select("#OverlaySvg").selectAll(".buses").data(d3.entries(buses))
        
        d3buses.enter().append("svg")
          .attr("class","buses")
          .attr("id", function(d){return d.key})
          .each(addBus)
          .each(function(d){ relocate(this, [d.value.lon, d.value.lat])})

        d3buses.exit().remove()

        d3.json("P.json",function(data){
          data.features.forEach(function(s){ // for each shape
            shape = s
            predictions.domain(shape.geometry.coordinates.map(function(d){return d[2]}))
              .range(shape.geometry.coordinates.map(function(d,i){return i}))
            paintRoute(shape)
            
          })
        })
        d3.json("P_Stops.json", function(data){ // eventually this data will come from the firebase

        d3.select("#OverlaySvg").selectAll(".stops").data(data.features).enter()
          .append("svg")
          .attr("class","stops")
          .attr("id",function(d,i){return "STOP"+i})
          .each(addStop)
          .each(function(d){ relocate(this, d.geometry.coordinates)})
        })
      });
      
      f.on("child_changed", function(s) {
    
        buses[s.name()] = s.val()

        var d3buses = d3.select("#OverlaySvg").selectAll(".buses").data(d3.entries(buses))
        
        d3buses.enter().append("svg") // in case there was a new bus
          .attr("class","buses")
          .attr("id", function(d){return d.key})

        d3buses.exit().remove() // should never happen but in case one bus disapers this removes it

        d3.select("#" + s.name()).each(function(d){ relocate(this, [d.value.lon, d.value.lat])})
        d3.select("#" + s.name()).selectAll("circle").style("stroke", "gold")
        d3.select("#" + s.name()).selectAll("circle").transition().duration(10000).style("stroke", "white")

        if (catchmentActive == true && catchmentStopId != null) {
          console.log('catchment change')
          setCatchmentAreas(catchmentStopId,center)
        }
      });

      f.on("child_removed", function(s) {
        
        delete buses[s.name()];
        var d3buses = d3.select("#OverlaySvg").selectAll(".buses").data(d3.entries(buses))
        d3buses.exit().remove()
      });

      fStops.once("value",function(s){
        stops = s.val()
        console.log(stops)
        // for (var stop in stops) {
        //   stop.arrivals = [1,10,30]
        // } 
        
      })

      fStops.on("child_changed", function(s){
        //stops[s.name()] = s.val()
        //console.log(stops)
      })

      return true
    }
  })  
}

function setCatchmentAreas(stop_id,center){

  // Try to erase existing catchment ares
  catch1.setMap(null)
  catch2.setMap(null)
  

    try{
          arrivals = stops.filter(function(d){return d.id == catchmentStopId})[0].arrivals
          r1 = 1000*(arrivals[0]/3600)*walkingSpeed
          r2 = 1000*(arrivals[1]/3600)*walkingSpeed
          catch1.setRadius(r1)
          catch2.setRadius(r2)
          // Draw two concentric circles using google map API
          catch1.setOptions(catch1Options)
          catch1.setCenter(center)
          catch1.setMap(map)

          catch2.setOptions(catch2Options)
          catch2.setCenter(center)
          catch2.setMap(map)
        } catch (err) {
          console.log('index not found')
        }  
}

function relocate(svg, array) {
  var xy = overlay.projection(array)
  d3.select(svg)
    .style("left",(xy[0] - d3.select(svg).style("width").slice(0,-2)/2) + "px")
    .style("top",(xy[1] - d3.select(svg).style("height").slice(0,-2)/2) + "px")
}

function addStop(d) { // adds a circle (if there is not one there already) and resizes the svg so that the circle is in the center
  var radius = 7.5
  var border = 4
  var d3Stops = d3.select(this)

  d3Stops.selectAll("circle").data([d]).enter().append("circle").attr("r", radius)
    .attr("cx",(radius+border))
    .attr("cy",(radius+border))
    .on("click", function(d){
      center = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0])
      map.panTo(center)
      console.log(d)
      catchmentStopId = d.properties.stop_id
      setCatchmentAreas(d.properties.stop_id,center)
    })
    .on("mouseover", function(){
      d3.select(this).style("fill", "red").style("cursor","pointer")
    })
    .on("mouseout", function(){
      d3.select(this).style("fill", "navy")
    })

  d3.select(this)
    .style("width",(2*(radius + border)) + "px")
    .style("height",(2*(radius + border)) + "px")

  d3Stops.selectAll(".stops circle").style("fill","navy").style("stroke-width", border).style("stroke", "whitesmoke")
}

function addBus(d) { // adds a circle (if there is not one there already) and resizes the svg so that the circle is in the center
  var radius = 10
  var border = 5
  var d3buses = d3.select(this)

  d3buses.append("circle").attr("r", radius)
    .attr("cx",(radius+border))
    .attr("cy",(radius+border))
    
  d3.select(this)
    .style("width",(2*(radius + border)) + "px")
    .style("height",(2*(radius + border)) + "px")

  d3buses.selectAll(".buses circle").style("fill","gold").style("stroke-width", border).style("stroke", "navy")
}

function pmTOlonlat(pm, shape){
  //console.log(shape)
  shape.geometry.coordinates.forEach(function(d,i,a){
    //console.log(a.length)
    if (i + 1 < a.length){
      if (d[2] <= pm && pm <= a[i+1][2]){
        var latScale = d3.scale.linear().domain([d[2],a[i+1][2]]).range([d[1],a[i+1][1]])
        var lonScale = d3.scale.linear().domain([d[2],a[i+1][2]]).range([d[0],a[i+1][0]])
        console.log(latScale(d[2]))
        
        //return [lonScale(pm), latScale(pm)]
      }
    }
  })
}

function paintRoute(shape){
  // I need to check if is the correct shape
      var extBorder = 10
      var projectedCoordinates = shape.geometry.coordinates.map(function(d){return overlay.projection(d)}) 
      d3.selectAll(".links").remove()
      shape.geometry.coordinates.forEach(function(d,i,a){
        
        if (i + 1  < a.length) {
          var projectedLink = [projectedCoordinates[i], projectedCoordinates[i+1]]

          var canvas = d3.select("#OverlayCanvas").append("canvas").attr("class","links").attr("id","LINK"+i)
          var box = {
            "left": d3.min([projectedCoordinates[i][0], projectedCoordinates[i+1][0]]) - extBorder,
            "top": d3.min([projectedCoordinates[i][1], projectedCoordinates[i+1][1]]) - extBorder
          }
          box.width = d3.max([projectedCoordinates[i][0], projectedCoordinates[i+1][0]]) - box.left + extBorder 
          box.height = d3.max([projectedCoordinates[i][1], projectedCoordinates[i+1][1]]) - box.top + extBorder
          
          canvas.style("left", box.left + "px")
            .style("top", box.top + "px")
            .style("width", box.width + "px")
            .style("height", box.height + "px")

          canvas.node().width = box.width
          canvas.node().height = box.height
          
          canvas.datum(projectedLink.map(function(d){
            return [d[0] - box.left, d[1]- box.top ].concat(d.slice(2))
          }))

          paintLink(canvas)
        }
      })
}

function paintLink(canvas){
  if (canvas.node().getContext) {
    var projectedLink = canvas.datum()
    var ctx = canvas.node().getContext("2d");
    var lingrad = ctx.createLinearGradient(projectedLink[0][0], projectedLink[0][1],projectedLink[1][0],projectedLink[1][1]);
    lingrad.addColorStop(0, color(predictions(projectedLink[0][2])));
    // data.arrivals.forEach(function(d){
    //   if (d.length > 2) {
    //     if (routeProjected[i][2] <= d[0] && d[0] <= routeProjected[i+1][2]) {
    //       var loc = (d[0] - routeProjected[i][2])/(routeProjected[i+1][2]-routeProjected[i][2])
    //       lingrad.addColorStop(loc, color(d[1]));
    //       lingrad.addColorStop(loc, color(0));
    //     }
    //   }
    // })
    lingrad.addColorStop(1, color(predictions(projectedLink[1][2])));



    ctx.lineWidth = 8
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = lingrad;
    ctx.beginPath();
    ctx.moveTo(projectedLink[0][0], projectedLink[0][1]);
    ctx.lineTo(projectedLink[1][0], projectedLink[1][1]);
    ctx.stroke();
  }
}