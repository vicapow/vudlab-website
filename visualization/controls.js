var icons

d3.json("icons.json", function(data){
	// loads the lineart for the icons
	icons = data
})

function loadIcon(){
	var item = d3.select(this)
	var icon = d3.select(this).attr("class")
	d3.timer(function(){
		if (icons != undefined){
			if (icons[icon] != undefined){
				item.attr("d",icons[icon])
				return true
			}
		}
	})
}

// the interphase consists of:
	// the menu that pops up with the information about the selected stop
	// the legend that shows the colorscale

var inter = {
	"window":0, //this is the d3 selection of the interphase popup menu (a <div> element)
	"svg":0,
	"subdiv":0, // the div where text is going to be displayed
}

// <div> #iwindow
// 	<svg> #iwindow svg
//  <div> #iwindo div 
//   <div> #iwindo div div


inter.window = d3.select("#iwindow")
	.style("opacity",0)
	.style("z-index",0)
	.on("click", function(){
		if (inter.window.style("opacity") == 0){
			// inter.show()
		} else {
			inter.hide()
		}
	})
	.on("mouseover",function(){ inter.window.style("cursor","pointer")})

inter.window.style("bottom", (+inter.window.style("bottom").slice(0,-2) - 300) + "px")

inter.subdiv = d3.select("#iwindow div")
	//.attr("id","isubdiv")
	

inter.svg = d3.select("#iwindow svg")


inter.g1 = d3.select("#iwindow svg").append("g").attr("transform", "translate(100,100)scale(2)")
inter.g2 = d3.select("#iwindow svg").append("g").attr("transform", "translate(100,100)scale(2)rotate(270)")

inter.g1.append("circle").attr("r", 20).attr("cx",0).attr("cy",0)

inter.g1.append("path")
	.attr("class","BusStop")
	.each(loadIcon)


inter.g2.append("path")
	.attr("class","BusStopDirection")
	.each(loadIcon)

d3.select("#iwindow div").append("div").attr("id","subdiv")

inter.title = d3.select("#iwindow #subdiv").append("p").text("Arrivals").style("font-weight","bold")
inter.subtitle = d3.select("#iwindow #subdiv").append("p").text("stop name")
inter.first = d3.select("#iwindow #subdiv").append("p").text("1 min")
inter.second = d3.select("#iwindow #subdiv").append("p").text("1 min")

d3.select("#isubdiv div").text("hello")

inter.hide = function(){
	if (inter.window.style("z-index") != 0) {
		inter.window.transition().style("bottom", (+inter.window.style("bottom").slice(0,-2) - 300) + "px").style("opacity",0).style("z-index",0)
	}
}

inter.show = function(){
	if (inter.window.style("z-index") == 0) {
		inter.window.transition().style("bottom", (+inter.window.style("bottom").slice(0,-2) + 300) + "px").style("opacity",1).style("z-index",1)
	}
}

var legend = {}

legend.append = function(){
legend.window =  d3.select(".legend")

legend.svg =  d3.select(".legend svg")

legend.width = +legend.window.style("width").slice(0,-2)
legend.height = +legend.window.style("height").slice(0,-2)

legend.background = legend.svg.append("rect").attr("width","100%").attr("height","100%").style("fill","whitesmoke").style("stroke","silver").attr({rx:'10px',ry:'10px'})

legend.rect = legend.svg.append("rect").attr("transform","translate("+(legend.width*0.3)+","+(legend.height*0.05)+")").attr("width","20%").attr("height","90%")

var gradient = legend.svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "90%")
    .attr("x2", "0%")
    .attr("y2", "10%")

color.domain().forEach(function(d,i){
var ext = d3.extent(color.domain())
var col = color.range()[i]

gradient.append("svg:stop")
    .attr("offset", function(){return ((d - ext[0])/(ext[1]-ext[0])*100) + "%" })
    .attr("stop-color", col)
    .attr("stop-opacity", 1);

})
colorscale = d3.scale.linear().domain([d3.min(color.domain().map(function(d){return d/60})), d3.max(color.domain().map(function(d){return d/60}))])
	.range([legend.height,0])

coloraxis = d3.svg.axis()
	    .scale(colorscale)
	    .orient("right")
	    .ticks(4);

legend.svg.append("g").attr("transform","translate("+(legend.width*0.5)+","+(legend.height*0.05)+")scale(0.9)")
	.attr("class", "axis")
	.call(coloraxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -legend.width*0.2)
		.attr("x", -legend.height/2)
		.attr("dy", "-.50em")
		.attr("font-size", "100%")
		.style("text-anchor", "middle")
		.text("Time until the next arrival (min)")

legend.rect.attr("fill","url(#gradient)")
}

legend.append()






