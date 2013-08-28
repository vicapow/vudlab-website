var display = {}

var color = d3.scale.linear().range(["black", "#98fb98", "red"]).domain([0,0, 15*60])



var getLineWidth = d3.scale.pow().exponent(2).domain([11, 14, 20]).range([2, 6, 10])
var getStopRadius = d3.scale.pow().exponent(2).domain([11,13, 14, 20]).range([0,0,7.5,15])
var getStopBorder = d3.scale.pow().exponent(2).domain([11,13, 14, 20]).range([0,0,3,5])
var getBusRadius = d3.scale.pow().exponent(2).domain([0,13, 14, 20]).range([0,5,9.5,17])
var getBusBorder = d3.scale.pow().exponent(2).domain([0,13, 15, 20]).range([0,0,2.5,3])
// Catchment Areas Variables
var walkingSpeed = 4 / Math.sqrt(2) //[km/hr]
var catchmentStopId = null

var center
var catch1 = new google.maps.Circle()
var catch1Options = {fillColor:'gray',
                      fillOpacity:0.5,
                       strokeColor:"gray",
                       strokeOpacity:0.5,
                       strokeWeight:2
                    }


function resizeStops(){
  var radius = getStopRadius(map.getZoom())
  var border = getStopBorder(map.getZoom())
  d3.select("#OverlaySvg").selectAll(".stops").each(function(d){
    var d3Stop = d3.select(this)

    // Resize the svg container
    d3Stop.style("width",(2*(radius + border)) + "px")
      .style("height",(2*(radius + border)) + "px")

    // Resize the circle
    d3Stop.select("circle").datum(d).attr("r", radius)
      .attr("cx",(radius+border))
      .attr("cy",(radius+border))

    // Relocate the group
    d3Stop.select("g").attr("transform","translate("+(radius + border)+","+(radius + border)+")")
    relocate(this, pmTOlonlat(d.pm, shape))
  })
}

function resizeBuses(){
  var radius = 2 + getBusRadius(map.getZoom())
  var border = getBusBorder(map.getZoom())
  d3.select("#OverlaySvg").selectAll(".buses").each(function(d){
    var d3Bus = d3.select(this)

    // Resize the svg container
    d3Bus.style("width",(2*(2*radius + border)) + "px")
      .style("height",(2*(2*radius + border)) + "px")

    // Resize the circle
    d3Bus.select("circle").datum(d).attr("r", radius)
      .attr("cx",(2*radius+border))
      .attr("cy",(2*radius+border))
      .style("stroke-width",border)

    // Relocate the group for the icons

    d3.select(d3Bus.select(".BusStopDirection").node().parentNode)
      .attr("transform","translate("+(2*radius + border)+","+(2*radius + border)+")"+"scale("+(radius/16)+")rotate("+ (shapeDirection(d.pm, shape) - 180)+")")

    d3.select(d3Bus.select(".BusIcon").node().parentNode)
      .attr("transform","translate("+(2*radius + border)+","+(2*radius + border)+")"+"scale("+(radius/16)+")")

    if (map.getZoom() >= 14) {
      d3Bus.select(".BusIcon").style("opacity",1)
      d3Bus.select(".BusStopDirection").style("opacity",1)
    } else {
      d3Bus.select(".BusIcon").style("opacity",0)
      d3Bus.select(".BusStopDirection").style("opacity",0)
    }
    relocate(this, pmTOlonlat(d.pm, shape))
  })
}

function relocate(svg, array) {
  var xy = overlay.projection(array)
  d3.select(svg)
    .style("left",(xy[0] - d3.select(svg).style("width").slice(0,-2)/2) + "px")
    .style("top",(xy[1] - d3.select(svg).style("height").slice(0,-2)/2) + "px")
}

function locateBuses(){
  var radius = 2 + getBusRadius(map.getZoom())
  var border = getBusBorder(map.getZoom())
  
  var allBuses = d3.select("#busesOverlay").selectAll(".buses").data(pro.projectedBuses)
  
  allBuses.enter().append("svg")
    .attr("class","buses")
    .attr("id", function(b){return b.id})
    .each(addBus)
  
  allBuses.exit().remove()

  allBuses.each(function(bus){ 
    relocate(this, pmTOlonlat(bus.pm, shape))
    d3.select(d3.select(this).select(".BusStopDirection").node().parentNode)
      .attr("transform","translate("+(2*radius + border)+","+(2*radius + border)+")"+"scale("+(radius/16)+")rotate("+ (shapeDirection(bus.pm, shape) - 180)+")")
  })

}

function initializeStops(){
  d3.select("#stopsOverlay").selectAll(".stops").data(pro.stops).enter()
            .append("svg")
            .attr("class","stops")
            .attr("id",function(d,i){return "STOP"+d.id})
            .each(addStop)
            .each(function(d){ relocate(this, pmTOlonlat(d.pm, shape))})
}

function initializeBuses(){

  d3.select("#busesOverlay").selectAll(".buses").data(display.buses.filter(function(b,i,a) {return b.pm != undefined}))
    .enter().append("svg")
    .attr("class","buses")
    .attr("id", function(b){return b.id})
    .each(function(d){console.log(d)})
    .each(addBus)
}


function eraseCatchmentAreas(){
  catch1.setMap(null)
}

function setCatchmentAreas(){

  try {    
    var stop = pro.stops.filter(function(d){return d.id == catchmentStopId})[0]
    var timeLeft = predictions(stop.pm) / 60
    inter.subtitle.text("Next Arrival")
    inter.title.text(stop.name)
    if (timeLeft > 1) {
      inter.first.text(timeLeft.toFixed(0) + " min")
    } else {
      if (timeLeft < 0) {
        inter.first.text("No Service")
      } else {
        inter.first.text("Arriving")
      }
      
    }
    inter.second.text("")    

    catch1.setRadius(Math.max(10,1000*((timeLeft)/60)*walkingSpeed))
    catch1.setOptions(catch1Options)
    catch1.setCenter(center)
    catch1.setMap(map)

  } catch (err) {
    console.log('index not found')
  }  
}

function addStop(d) { // adds a circle (if there is not one there already) and resizes the svg so that the circle is in the center
  var radius = getStopRadius(map.getZoom())
  var border = getStopBorder(map.getZoom())
  var d3Stop = d3.select(this)

  d3Stop.selectAll("circle").data([d]).enter().append("circle").attr("r", radius)
    .attr("cx",(radius+border))
    .attr("cy",(radius+border))
    .on("click", function(d){
     
      if (catchmentStopId == null || catchmentStopId != d.id){ // if the active stop is not this
        
        d3.selectAll("circle").style("fill",null);

        console.log(d3Stop.selectAll("circle"));
        var coordinates = pmTOlonlat(d.pm, shape)
        center = new google.maps.LatLng(coordinates[1], coordinates[0])
        map.panTo(center)
        map.panBy(0, d3.select("#map-canvas").style("height").slice(0,-2)/6)
        catchmentStopId = d.id
        setCatchmentAreas()
        inter.show()
        d3.select(this).style("fill","green")

      } else { // if the active stop is this one then deativate it
        catchmentStopId = null
        eraseCatchmentAreas()
        inter.hide()
      }
      
    })
    .on("mouseover", function(){
      d3.select(this).style("fill", "navy").style("cursor","pointer")
    })
    .on("mouseout", function(){
      if (catchmentStopId == null || catchmentStopId != d.id){ // if the active stop is not this
        d3.select(this).style("fill", null)
      } 
    })

  d3Stop.style("width",(2*(radius + border)) + "px")
    .style("height",(2*(radius + border)) + "px")

  d3Stop.append("g").attr("transform","translate("+(radius + border)+","+(radius + border)+")")
  d3Stop.selectAll(".stops circle").style("stroke-width", border)
}

function addBus(d) { // adds a circle (if there is not one there already) and resizes the svg so that the circle is in the center
  var radius = 2 + getBusRadius(map.getZoom())
  var border = getBusBorder(map.getZoom())
  var d3Bus = d3.select(this)

  d3Bus.append("circle").attr("r", radius)
    .attr("cx",(2*radius+border))
    .attr("cy",(2*radius+border))
    .style("stroke-width", border)

  d3Bus.style("width",(2*(2*radius + border)) + "px")
    .style("height",(2*(2*radius + border)) + "px")

  d3Bus.append("g").attr("transform","translate("+(2*radius + border)+","+(2*radius + border)+")"+"scale("+(radius/16)+")rotate("+ (shapeDirection(d.pm, shape) - 180)+")")
  .append("path").attr("class","BusStopDirection").each(loadIcon)

  d3Bus.append("g").attr("transform","translate("+(2*radius + border)+","+(2*radius + border)+")"+"scale("+(radius/16)+")")
  .append("path").attr("class","BusIcon").each(loadIcon)

  if (map.getZoom() >= 14) {
    d3Bus.select(".BusIcon").style("opacity",1)
  } else {
    d3Bus.select(".BusIcon").style("opacity",0)
  }
  //d3Bus.selectAll(".buses circle")
}

function pmTOlonlat(pm, shape){
  //console.log(shape)
  if (pm == undefined){
    pm = 0
  }

  var coor = shape.geometry.coordinates
  var latScale = d3.scale.linear().domain(coor.map(function(d){return d[2]})).range(coor.map(function(d){return d[1]}))
  var lonScale = d3.scale.linear().domain(coor.map(function(d){return d[2]})).range(coor.map(function(d){return d[0]}))
        
  return [lonScale(pm), latScale(pm)]
}

function shapeLength(shape){
  var coor = shape.geometry.coordinates
  return d3.max(coor.map(function(d){return d[2]}))
}

function shapeDirection(pm, shape, dist){ // returns the direction of the shape in clockwise degrees (12 = 0º)
  if (dist == undefined) { dist = 0.100} // 100 meters because GTFS reports distance in km
  var P1 = pmTOlonlat(pm, shape)
  var P2 = pmTOlonlat(pm+dist, shape)

  var degrees = Math.atan2((P2[1]-P1[1]),(P2[0]-P1[0]))*180/Math.PI

  return 90 - degrees
}

function paintRoute(shape){
  // I need to check if is the correct shape
      var extBorder = 6
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

  if (canvas.node().getContext && pro.events != undefined) {
    var projectedLink = canvas.datum()
    var ctx = canvas.node().getContext("2d");
    var lingrad = ctx.createLinearGradient(projectedLink[0][0], projectedLink[0][1],projectedLink[1][0],projectedLink[1][1]);
    var linkLength = projectedLink[1][2]-projectedLink[0][2]

    pro.events.filter(function(d){return d.type == "bus"}).forEach(function(bus){
      if (projectedLink[0][2] <= bus.pm && bus.pm <= projectedLink[1][2]) {
        var loc = (bus.pm - projectedLink[0][2])/linkLength
        if (0 <= loc && loc <= 1) {
          var c1 = predictions(bus.pm - 0.001)
          if (!isNaN(c1)){lingrad.addColorStop(loc, color(c1))}
          var c2 = predictions(bus.pm + 0.001)
          if (!isNaN(c2)){lingrad.addColorStop(loc, color(c2))}
        } else {
          console.log(bus)
        }
      }
    })

    var c1 = (predictions(projectedLink[0][2]))
    var c2 = (predictions(projectedLink[1][2]))

    if (!isNaN(c1)){lingrad.addColorStop(0, color(c1))} else {lingrad.addColorStop(0, "black")}
    if (!isNaN(c2)){lingrad.addColorStop(1, color(c2)); } else {lingrad.addColorStop(0, "black")}

    ctx.lineWidth = getLineWidth(map.getZoom())
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = lingrad;
    ctx.beginPath();
    ctx.moveTo(projectedLink[0][0], projectedLink[0][1]);
    ctx.lineTo(projectedLink[1][0], projectedLink[1][1]);
    ctx.stroke();
  }
}