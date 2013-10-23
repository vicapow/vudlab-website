
//=========thinking!=========
var timeRange = d3.range(0,600),
	times = _.map(timeRange, function(t){
		return {
			time: t,
			q: []
		}
	}),
	ddp = d3.range(200, 300), //"desired departure period"
	alpha = 1,
	beta = .5,
	gamma = -1.5,
	numAgents = 200,
	s = 1,
	agents = _.map(d3.range(numAgents), function(d,i){
		var index = Math.floor(i/numAgents * ddp.length)
		var w_time = ddp[index];
		return new Agent(w_time,i);
	}); //agents created

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function putAgentsToTimes(agent){
	var time = agent.a;
	times[time].q.push(agent);
}

var loopNumber = 0;

function Agent(w_time, index){
	//initialization
	this.w = w_time;
	this.a = w_time; //arrival time. start out trying to go when they want
	this.index = index;
	this.d = null; //departure time

	this.evalCost = function(){
		this.travel = (this.d - this.a);
		this.travelC = this.travel * alpha;
		this.delay = (this.w - this.d);
		this.delayC = (this.delay > 0) ? this.delay*beta : this.delay*gamma;
		this.C = (this.delayC + this.travelC);
	} //evalCost

	this.choose = function(){ 
		var choices = [],
			prospC = null,
			oldC = this.C,
			newC = oldC,
			w = this.w;

		//eval the prospectve cost at each time for this agent
		for (var i = 0; i < times.length; i++){
			var t = times[i],
				travel = t.q.length/s, //how long the travel cost would be
			  travelC = travel*alpha,
			  delay = w - (t.time + travel),
				delayC = (delay > 0) ? delay*beta : delay*gamma,
				prospC = travelC + delayC; //the prospective cost

			if(prospC < newC) {
				this.a = t.time;
				newC = prospC;
			}
			// if(this.index == 0) debugger;
		}; //END FOR LOOP


	} //choose

}//agent 

//now we decide who gets served when
function process(){ 
	times.forEach(function(interval,i){
		// if(interval.q.length == 0 ) return;
		var served = interval.q.slice(0, s); //select the first s travelers in the queue

		served.forEach(function(agent){ //give these served travelers this departure time
			agent.d = interval.time;
		})

		var spillover = interval.q.slice(s); //select the ones that didn't make it

		if(spillover.length>0) times[i+1].q = spillover.concat(times[i+1].q); //push whatever is left of the q to the next times' q
	})
}

//============the first run and the drawing ============

agents = shuffle(agents);

times.forEach(function(time){
	time.q = [];
})

agents.forEach(function(agent){
	putAgentsToTimes(agent);
})

process();

agents.slice(0,5).forEach(function(agent){
	agent.evalCost();
	agent.choose();
})

//=============drawing!===============

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1100 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.q.length); });

x.domain(d3.extent(times, function(d) { return d.time; }));
y.domain(d3.extent(times, function(d) { return d.q.length; }));

var gXAxis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var gYAxis = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("font-size","15px")
    .style("text-anchor", "end")
    .text("Queue size (# travelers)");

svg.append("rect") //color in the DDP
		.attr({
			x: x(ddp[0]),
			y: 0,
			height: y.range()[0],
			fill: "#999",
			opacity: 0.5,
			width: x(100)
		})

var path = svg.append("path")
    .datum(times)
    .attr("class", "line")
    .attr("d", line);

//==============the redraw function and transition=======

var transition = d3.transition()
    .duration()
    .ease("linear");

function redraw(){

	x.domain(d3.extent(times, function(d) { return d.time; }));
	y.domain(d3.extent(times, function(d) { return d.q.length; }));

	xAxis.scale(x);
	yAxis.scale(y);

	gXAxis.transition().call(xAxis);
	gYAxis.transition().call(yAxis);

	path.datum(times)
	.transition(3)
	.attr("d", line);
}

//=============loop the program!===============

setInterval(function(){

	times.forEach(function(time){
		time.q = [];
	})

	agents.forEach(function(agent){
		putAgentsToTimes(agent);
	})

	process();

	redraw();

	agents = shuffle(agents);

	agents.slice(0,5).forEach(function(agent){
		agent.evalCost();
		agent.choose();
	})


}, 5)
