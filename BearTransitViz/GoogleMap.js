// Enable the visual refresh
google.maps.visualRefresh = true;

var map;
var overlay;


function initializeOverlay() {
	overlay = new google.maps.OverlayView();

	overlay.onAdd = function() {
		
		var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("id","Overlay").style("opacity",0.85)
		layer.append("div").attr("id","OverlayCanvas")
		layer.append("div").attr("id","CatchmentAreas")
		layer.append("div").attr("id","OverlaySvg")
		
		d3.select("#OverlaySvg").append("div").attr("id","stopsOverlay")
		d3.select("#OverlaySvg").append("div").attr("id","busesOverlay")

		overlay.draw = function() {
	      	
	      	overlay.projection = function (coordinates) { // [LON, LAT]
	        	var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
	        	var pixelCoordinates = this.getProjection().fromLatLngToDivPixel(googleCoordinates);        
	        	return [pixelCoordinates.x, pixelCoordinates.y].concat(coordinates.slice(2));
	      	}
	      	reprojectOverlays()
	      		  	
		}
	}	
	overlay.setMap(map)
}





function initializeMap() {
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(37.87, -122.26),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  initializeOverlay()
}

function reprojectOverlays(){
	console.log(map.getZoom())
	resizeStops() //this function is defined in firebus.js
	resizeBuses()
	d3.selectAll(".catchment").each(function(d){ relocate(this, d.geometry.coordinates)})
	if (shape != undefined) {paintRoute(shape)} // this function is defined in firebus.js
}

google.maps.event.addDomListener(window, 'load', initializeMap);

