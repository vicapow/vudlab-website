function head(array){
	console.log("LOG:",array.slice(0,10));
}

function draw(error, occs, pems){
	pems.forEach(function(d){
		d.time = new Date(d.time * 1000)
	});
	occs.forEach(function(d){
		d.time = new Date(d.time)
	});

  px = crossfilter(pems);
  ox = crossfilter(occs);

  flowByTime = px.dimension(function(d) {return d3.time.hour(d.time); });
  flowByTimeGroup = flowByTime.group().reduceSum(function(d){return d.flow; });

  var flowChart = dc.lineChart("#chart");
  var littleFlowChart = dc.lineChart("#chart4");


  var xFlow = d3.time.scale().domain([_.first(pems).time, _.last(pems).time])
  var xFlow2 = d3.time.scale().domain([_.first(pems).time, _.last(pems).time])

  flowChart.width(960)
     .height(300)
     .margins({top: 50, right: 10, bottom: 20, left: 100})
     .dimension(flowByTime)
     .group(flowByTimeGroup)
     .transitionDuration(500)
     .mouseZoomable(true)
   .elasticY(true)
   // .elasticX(true)
     // .xAxisPadding(1)
     .x(xFlow) // scale and domain of the graph
     .rangeChart(littleFlowChart)
     .xUnits(d3.time.day)
     .renderHorizontalGridLines(true)
     .renderVerticalGridLines(true)
     .brushOn(false)
     .renderArea(true)
     // .xAxis();

     littleFlowChart.width(990)
         .height(120)
         .margins({top: 10, right: 10, bottom: 20, left: 100})
         .dimension(flowByTime)
         .group(flowByTimeGroup)
         // .centerBar(true)
         // .gap(1)
         .x(xFlow2)
         // .round(d3.time.day.round)
         .xUnits(d3.time.days);

   flowChart.render()
   littleFlowChart.render()


   occByHour = ox.dimension(function(d) {return d3.time.hour(d.time); })
   occByOcc = ox.dimension(function(d){ return d.d_occ})
   occByHourGroup = occByHour.group().reduceSum(function(d){return d.d_occ; });
    occByHourGroup2 = occByHour.group().reduceSum(function(d){return d.occ; });
   occByDay = ox.dimension( function(d) {return d3.time.day(d.time); })
   occByDayGroup = occByDay.group().reduceSum( function(d){return d.occ; })

   // occByOcc.filter(function(d){return Math.abs(d) < 750;})

   var occChart = dc.lineChart("#chart2");
   var littleChart = dc.lineChart("#chart3");

   var xOccs = d3.time.scale().domain([_.first(occs).time, _.last(occs).time])

   var asdf = d3.time.scale().domain([_.first(occs).time, _.last(occs).time])

   occChart.width(960)
      .height(300)
      .margins({top: 50, right: 10, bottom: 20, left: 100})
      .dimension(occByHour)
      .group(occByHourGroup)
      .transitionDuration(500)
      .mouseZoomable(true)
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
        .height(120)
        .margins({top: 10, right: 10, bottom: 20, left: 100})
        .dimension(occByHour)
        .group(occByHourGroup2)
        // .centerBar(true)
        // .gap(1)
        .x(asdf)
        // .round(d3.time.day.round)
        .xUnits(d3.time.days);


    littleChart.render();
    occChart.render();
    // d3.selectAll('#chart3').selectAll('.axis.y').remove();
}

queue()
	.defer(d3.json, '../data/occ_data.json')
	.defer(d3.json, '../data/pems.data.json')
	.await(draw)
