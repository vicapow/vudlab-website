var fig = {}




var margin = {top: 0, right: 40, bottom: 0, left: 100},
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// SVG
fig.select = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 50)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// TITLE
// fig.title = fig.select.append("text")
//       .attr("class", "Message")
//       .attr("x", width/2)
//       .attr("text-anchor", "middle")
//       .text("Click on a curve in the next Figure to select an MFD (on display 4x4 MFD)") 

// SCALES
var Xscale = d3.scale.linear()
    .range([0, width])
    .domain([0,240])

var Yscale = d3.scale.linear()
    .range([height, 0])
    .domain([0,2000])

// AXIS
var Xaxis = d3.svg.axis()
    .scale(Xscale)
    .orient("bottom");

var Yaxis = d3.svg.axis()
    .scale(Yscale)
    .ticks(10)
    .tickFormat(function(d){return moment(d*1000).zone("-07:00").format("hh:mm:ss")})
    .orient("left");

// DATA SERIES
var series = d3.svg.line()
    .interpolate("linear")
    .x(function(datum) { return Xscale(datum.pm); })
    .y(function(datum) { return Yscale(datum.time); });

// DRAW

fig.redraw = function(){}

fig.draw = function(data){ 
  d3.json("P.json",function(data){
    //pre.links = data.features[0].geometry.coordinates.map(function(link){ return link[2]})
    Xscale.domain([0,5.3349382621026544])

  	fig.select.append("g")
        .attr("class", "x axis") // ATTENTION
        .attr("id","xaxis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(Xaxis)
      .append("text")
        .attr("x", width)
        .attr("dy", "2.00em")
        .attr("font-size", "18px")
        .style("text-anchor", "end")
        //.style("fill", "steelblue") // ATTENTION
        .text("stop location");

    fig.redraw = function(){
      var time = displayTime

      fig.select.selectAll(".prediction").remove()

      for (var trip in pro.trips) {
        fig.select.append("g")
          .attr("class", "prediction") // ATTENTION
          .append("path")
          .attr("class", "line")
          .attr("d", series(pro.trips[trip]))
          .style("stroke", "orange")
          .style("stroke-width", 4)
      //   fig.select.append("g")
      //     .attr("class", "prediction") // ATTENTION
      //     .append("path")
      //     .attr("class", "line")
      //     .attr("d", series(pro.copy[trip]))
      //     .style("stroke","purple")

      }
      // pro.loops.forEach(function(d) {
      //   fig.select.append("g")
      //     .attr("class", "prediction") // ATTENTION
      //     .append("path")
      //     .attr("class", "line")
      //     .attr("d", series(d))
      // })
      fig.select.append("g")
          .attr("class", "prediction") // ATTENTION
          .append("path")
          .attr("class", "line")
          .style("stroke","purple")
          .style("stroke-width",6)
          .attr("d", series(pro.events))

      try {
      fig.select.append("g")
          .attr("class", "prediction") // ATTENTION
          .append("path")
          .attr("class", "line")
          .attr("d", series(pre.events))
      } catch (err) {

      }
      d3.select("#yaxis").remove()

      Yscale.domain([time- 3000, time +3000])

      fig.select.append("g")
        .attr("class", "y axis")
        .attr("id","yaxis")
        .call(Yaxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-4.71em")
        .attr("font-size", "18px")
        .style("text-anchor", "end")
        .text("Time      ");

      fig.select.selectAll(".stops").remove()

      pro.stops.forEach(function(stop){
        stop.arrivals.forEach(function(arrival){
          fig.select.append("circle").attr("class", "stops")
            .attr("cx", Xscale(stop.pm))
            .attr("cy", Yscale(arrival.time+stop.ts))
            .attr("r", 3)
            .style("fill","red")
        })
      })

      fig.select.selectAll(".buses").remove()

      pro.buses.forEach(function(bus){
        //console.log(bus.ts)
        fig.select.append("circle").attr("class", "buses")
          .attr("cx", Xscale(bus.pm))
          .attr("cy", Yscale(bus.ts))
          .attr("r", 3)
          .style("fill","navy")
      })

    }
  })
}
fig.draw()
