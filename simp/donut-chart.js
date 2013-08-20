var width = 400,
    height = 600,
    radius = Math.min(width, height) / 2 * .7;

var blue = '#3498DB',
  black = '#2C3E50',
 red = '#E74C3C';

var maleData = [
	{accepted: 'accepted', percent: 44 },
	{accepted: 'rejected', percent: 56 }
];

var femaleData = [
	{accepted: 'accepted', percent: 35 },
	{accepted: 'rejected', percent: 65 }
];

var color = d3.scale.ordinal()
		.domain(['accepted', 'rejected'])
    .range([red, blue]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.percent; });

var svg = d3.select("#donut-chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 4 + ")");

var gMale = svg.selectAll("arc")
     .data(pie(maleData))
   .enter().append("g")
     .attr("class", "arc");

 gMale.append("path")
     .attr("d", arc)
     .style("fill", function(d) { return color(d.data.accepted); })
     .attr("stroke",black);

 gMale.append("text")
     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
     .attr("dy", ".35em")
     .attr("fill",'white')
     .attr("font-size","24px")
     .style("text-anchor", "middle")
     .text(function(d) { return d.data.percent + "%" ; });

	gMale.append('text')
		.text("men")
		.attr("dy", ".35em")
		.attr({
			fill: black,
			"font-size":" 24px",
			"text-anchor": "middle"
		});

var gFemale = svg.selectAll("arc")
     .data(pie(femaleData))
   .enter().append("g")
     .attr("class", "arc")
     .attr("transform","translate(" + 0 + "," + height/2 + ")");

 gFemale.append("path")
     .attr("d", arc)
     .style("fill", function(d) { return color(d.data.accepted); })
     .attr("stroke",black);

 gFemale.append("text")
     .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
     .attr("dy", ".35em")
     .attr("fill",'white')
     .attr("font-size","24px")
     .style("text-anchor", "middle")
     .text(function(d) { return d.data.percent + "%" ; });

	gFemale.append('text')
		.text("women")
		.attr("dy", ".35em")
		.attr({
			"font-size":" 24px",
			"text-anchor": "middle"
		});

d3.selectAll(".arc")
	.on("mouseover", function(){
		d3.select(this).select("path").transition().duration(50)
			.attr("stroke", "white")
			.attr("stroke-width","10px")
	})
	.on("mouseout", function(){
		d3.select(this).select("path").transition().duration(50)
			.attr("stroke", "white")
			.attr("stroke-width","1px")
	})	


var legend = svg.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(" + (width/2 + - 16) +  "," + (-height/4 + i * 20 ) + ")"; });

legend.append("rect")
    .attr("x", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", -6 )
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });