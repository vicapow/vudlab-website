var margin = {top: 20, right: 10, bottom: 40, left: 40},
    width = 380 - margin.left - margin.right,
    height = 260 - margin.top - margin.bottom;


var blue = '#3498DB'
    , black = '#2C3E50'
    , red = '#E74C3C'
    , purple = '#9b59b6'
    , green = "#1abc9c"

var blueData = [
  {x: 1, y: 6, col: green},
  {x: 2, y: 7, col: green},
  {x: 3, y: 8, col: green},
  {x: 4, y: 9, col: green},
];

var redData = [
  {x: 8, y: 1, col: purple},
  {x: 9, y: 2, col: purple},
  {x: 10, y: 3, col: purple},
  {x: 11, y: 4, col: purple}
]

var x = d3.scale.linear()
  .domain([0,12])
  .range([0, width])

var y = d3.scale.linear()
  .domain([0,10])
  .range([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var svg = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class","svg-line")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var gYAxis = svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis)

gYAxis.append("text")
  .attr("transform", " translate(" + -28 + "," + height/2 + ") rotate(-90)")
  .style("text-anchor", "middle")
  .text("y");

var gXAxis = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

gXAxis.append("text")
  .attr("transform", " translate(" + width/2 + "," + 35 +  ")")
  .style("text-anchor", "middle")
  .text("x");

svg.append("path")
    .datum([
        {x: 7, y: 0},
        {x: 13, y: 6}
      ])
    .attr("class", "line")
    .attr("d", line)
    .attr("stroke",purple)
    .attr("stroke-width","1.5px")

svg.append("path")
    .datum([
        {x: 0, y: 8.2},
        {x: 13, y: 1}
      ])
    .attr("class", "trend-line")
    .attr("d", line)
    .attr("stroke", '#999')
    .attr("stroke-width","1.5px")
    .attr("stroke-dasharray","4, 3");

svg.append("path")
    .datum([
        {x: 0, y: 5},
        {x: 6, y: 11}
      ])    .attr("class", "line")
    .attr("d", line)
    .attr("stroke",green)
    .attr("stroke-width","1.5px");

svg.append("g")
  .attr("class","g-blue-circles")
  .selectAll("blue circles")
  .data(blueData)
  .enter()
  .append("svg:circle")
  .attr({
    class: "blue-cicles",
    r: 6,
    cx: function(d, i){
      return x(d.x);
    },
    cy: function(d, i){
      return y(d.y);
    },
    fill: green,
    stroke: 'white'
  });


svg.append("g")
  .attr("class","g-red-circles")
  .selectAll("red circles")
  .data(redData)
  .enter()
  .append("circle")
  .attr({
    r: 6,
    cx: function(d, i){
      return x(d.x);
    },
    cy: function(d, i){
      return y(d.y);
    },
    fill: purple,
    stroke: 'white'
  });


