var margin = {top: 20, right: 10, bottom: 40, left: 40},
    width = 380 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


var blue = '#3498DB',
 red = '#E74C3C';

var blueData = [
	{x: 1, y: 6, col: blue},
	{x: 2, y: 7, col: blue},
	{x: 3, y: 8, col: blue},
	{x: 4, y: 9, col: blue},
];

var redData = [
	{x: 8, y: 1, col: red},
	{x: 9, y: 2, col: red},
	{x: 10, y: 3, col: red},
	{x: 11, y: 4, col: red}
]

var x = d3.scale.linear()
		.domain([0,12])
    .range([0, width]);

var y = d3.scale.linear()
		.domain([0,10])
    .range([height, 0]);

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
  .attr("font-size","18px")
  .text("y");

var gXAxis = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

gXAxis.append("text")
  .attr("transform", " translate(" + width/2 + "," + (height + 35) +  ")")
  .style("text-anchor", "middle")
  .attr("font-size","18px")
  .text("x");

svg.append("path")
    .datum([
    		{x: 7, y: 0},
    		{x: 13, y: 6}
    	])
    .attr("class", "line")
    .attr("d", line)
    .attr("stroke",red)
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
    .attr("stroke",blue)
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
		fill: blue,
		stroke: '#2C3E50'
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
		fill: red,
		stroke: '#2C3E50'
	});


