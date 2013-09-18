var pemsData, sfParkData, ndx, cf, flowByDay, flowByDayGroup, occByPlace, occByPlaceGroup, occByHour, occByHourGroup, occByPlaceGroupTop;
var lets, places, nested;

  d3.csv("pems_output.csv", function(error, output) {

  var data = _.map(output, function(d){
    return {
      time: new Date(d['Hour']), // convert "Year" column to Date
      flow: +d['Flow (Veh/Hour)']
    }
  });

  ndx = crossfilter(data);

  // var all = ndx.groupAll();

  // define a dimension
  flowByDay = ndx.dimension(function(d) {return d3.time.day(d.time); });
  flowByDayGroup = flowByDay.group().reduceSum(function(d) {return d.flow; });

  var timeChart = dc.lineChart("#chart");

  var x = d3.time.scale().domain([_.first(data).time, _.last(data).time])

 timeChart.width(960)
    .height(300)
    .margins({top: 50, right: 10, bottom: 20, left: 100})
    .dimension(flowByDay)
    .group(flowByDayGroup)
    .transitionDuration(500)
  .elasticY(true)
  .elasticX(true)
    .xAxisPadding(1)
    .x(x) // scale and domain of the graph
    .xUnits(d3.time.day)
    .renderHorizontalGridLines(true)
    .renderVerticalGridLines(true)
    .renderArea(true);

  timeChart.render()

});

d3.csv('data.csv', function(error, output){
  var data = [];

  nested = {};

  _.map(output, function(d){
      var Time = new Date(d.time)
      nested[Time.getTime()] = {};
      _.map(d3.keys(d), function(v){
        if(v!=="time"){
          nested[Time.getTime()][v] = +d[v];
          var res = {
            place: v,
            occ: +d[v],
            time: Time,
            dOcc: 0
          };
          TimeB = Time.getTime() - 3600 * 1000;
          if(nested.hasOwnProperty(TimeB)) {
            res.dOcc = res.occ - nested[TimeB][v];
          }
          data.push(res);
        }
      })
  });

  console.log("LOG:",data);

  cf = crossfilter(data);

  occByHour = cf.dimension(function(d) {return d3.time.hour(d.time); });
  occByHourGroup = occByHour.group().reduceSum(function(d) {return d.occ; });

  var timeChart2 = dc.lineChart("#chart2", "chartGroup");

  var x2 = d3.time.scale().domain([_.first(data).time, _.last(data).time]);

  timeChart2.width(960)
     .height(300)
     .margins({top: 50, right: 10, bottom: 20, left: 100})
     .dimension(occByHour)
     .group(occByHourGroup)
     .transitionDuration(500)
   // .elasticY(true)
   // .elasticX(true)
     // .xAxisPadding(1)
     .x(x2) // scale and domain of the graph
     .renderHorizontalGridLines(true)
     .renderVerticalGridLines(true)
     .renderArea(true);

  timeChart2.render();

})


//potential bar chart
   // var barChart = dc.barChart("#chart3", "chartGroup");
  // occByPlace = cf.dimension(function(d) {return d.place; });
  // occByPlaceGroup = occByPlace.group().reduceSum(function(d) {return d.occ; });
 // barChart.width(1500)
 //   .height(250)
 //   .margins({top: 10, right: 10, bottom: 20, left: 40})
 //   .dimension(occByPlace)
 //   .group(occByPlaceGroup)
 //   .transitionDuration(500)
 //   .elasticY(true)
 //   .x(d3.scale.ordinal().domain(places))
 //   .xUnits(dc.units.ordinal); 
  // barChart.render();
