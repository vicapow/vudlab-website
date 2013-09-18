queue()
  .defer(d3.json, "../data/locs.json")
  .defer(d3.json, "../data/occ_data.json")
  .defer(d3.json, "../data/pems_data.json")
  .await(ready)

  var colors = d3.scale.category20();
  var keyColor = function(d, i) {return colors(d.key)};

function ready(error, l, o, p){

  var o = _.groupBy(o, 'loc')
  var i = 0
  var occs = _.map(o, function(array, loc){
    i=i+1;
    var data = _.map(array, function(d){
      return {x: d.time, y: d.occ}
    });

    return {
      key: loc,
      values: data,
      // seriesIndex: i
    }
  });

  console.log("LOG:",occs);

  var occs = _.map(o, function(array, loc){
    i=i+1;
    var data = _.map(array, function(d){
      return {x: d.time, y: d.d_occ}
    });

    return {
      key: loc,
      values: data,
      // seriesIndex: i
    }
  });

  var pems = _.map(p, function(d){
    return {x: d.time, y: d.flow}
  });

  nv.addGraph(function() {
    var chart = nv.models.lineWithFocusChart()
                  .color(keyColor)
                  .transitionDuration(300);

    chart.xAxis
      .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
      
    chart.x2Axis
      .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

    d3.select("#area")
        .datum(occs)
        .transition().duration(500)
        .call(chart);

    console.log("LOG:",occs);


      nv.utils.windowResize(chart.update);

      return chart;
  });


}



