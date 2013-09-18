function head(array){
	console.log("LOG:",array.slice(0,10));
}

var littleChart;

function draw(error, occs, pems){
	pems.forEach(function(d){
		d.time = new Date(d.time * 1000)
	});
	occs.forEach(function(d){
		d.time = new Date(d.time)
	});

  var px = crossfilter(pems);
  var ox = crossfilter(occs);

  var flowByTime = px.dimension(function(d) {return d.time; });
  var flowByTimeGroup = flowByTime.group().reduceSum(function(d){return d.flow; });

  var flowChart = dc.lineChart("#chart");

  var xFlow = d3.time.scale().domain([_.first(pems).time, _.last(pems).time])

  flowChart.width(960)
     .height(300)
     .margins({top: 50, right: 10, bottom: 20, left: 100})
     .dimension(flowByTime)
     .group(flowByTimeGroup)
     .transitionDuration(500)
     .brushOn(false)
   .elasticY(true)
   // .mouseZoomable(true)
   // .elasticX(true)
     .xAxisPadding(1)
     .x(xFlow) // scale and domain of the graph
     .xUnits(d3.time.day)
     .renderHorizontalGridLines(true)
     .renderVerticalGridLines(true)
     .renderArea(true);

  // flowByTime.filterRange([new Date("7/15/2013"), new Date("7/25/2013")])


   occByHour = ox.dimension(function(d) {return d.time; })
   occByOcc = ox.dimension(function(d){ return d.d_occ})
   occByHourGroup = occByHour.group().reduceSum(function(d){return d.d_occ; });
   occByHourGroup2 = occByHour.group().reduceSum(function(d){return d.occ; });
   occByDay = ox.dimension( function(d) {return d3.time.day(d.time); })
   occByDayGroup = occByDay.group().reduceSum( function(d){return d.occ; })

   // occByDay.filterRange([new Date("7/15/2013"), new Date("7/25/2013")])

   var occChart = dc.lineChart("#chart2");
   littleChart = dc.lineChart("#chart3");

   var xOccs = d3.time.scale().domain([_.first(occs).time, _.last(occs).time])

   var asdf = d3.time.scale().domain([_.first(occs).time, _.last(occs).time])

   occChart.width(960)
      .height(300)
      .margins({top: 50, right: 10, bottom: 20, left: 100})
      .dimension(occByHour)
      .group(occByHourGroup)
      .transitionDuration(500)
      // .mouseZoomable(true)
    .elasticY(true)
      .xAxisPadding(1)
      .yAxisPadding(500)
      .x(xOccs) // scale and domain of the graph
      .xUnits(d3.time.day)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .brushOn(false)
      .renderArea(true)
      .rangeChart(littleChart)
      .xAxis();

    littleChart.width(990)
        .height(180)
        .margins({top: 10, right: 10, bottom: 20, left: 100})
        .dimension(occByHour)
        .group(occByHourGroup2)
        .elasticX(true)
        // .mouseZoomable(true)
        .x(asdf)
        // .round(d3.time.day.round)
        .xUnits(d3.time.days);


    littleChart.render();
    occChart.render();
     flowChart.render();

    // debugger;
    console.log("LOG:",littleChart.filter());
    // d3.selectAll('#chart3').selectAll('.axis.y').remove();
}

queue()
  .defer(d3.json, '../../data/occ_data.json')
  .defer(d3.json, '../../data/pems.data.json')
  .await(draw)
