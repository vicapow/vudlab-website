
//=========thinking!=========
var timeRange = d3.range(0,500),
	ddp = d3.range(200, 300), //"desired departure period"
	alpha = 1,
	beta = .5,
	gamma = -1.5,
	s = 8,
	classes = {"0.5": 400, "1": 300, "2": 300, "3": 100, "4": 50}, //adds up to 1600 of load
	agents = [];
//create the agents
_.map(classes, function(val,key){
		var load = Number(key);
		console.log("LOG:",load, val);
		var res = _.map(d3.range(val), function(d,i){
			var index = Math.floor(i/val * ddp.length)
			var w_time = ddp[index];
			return new Agent(w_time, load, i);
		});
		console.log("LOG:",res);
		agents = agents.concat(res);
}); //agents created

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function putAgentsToTimes(agent){
	var time = agent.a;
	times[time].q.push(agent);
	times[time].a.push(agent);
}

var loopNumber = 0;

function Agent(w_time, load, index){
	//initialization
	this.w = w_time;
	this.a = w_time; //arrival time. start out trying to go when they want
	this.index = index;
	this.d = null; //departure time
	this.load = load;
	this.loadLeft = load;

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
				travel=0;
			if(t.q.length>0){ //if there's a queue
				var lastOne = t.q[t.q.length - 1],  //look at the last guy
					travel = lastOne.travel + (this.load - lastOne.load)/s //how long it would've taken this guy 
					// if(isNaN(travel) || travel<0 ) debugger;
			}
			var  travelC = travel*alpha,
			  delay = w - (t.time + travel),
				delayC = (delay > 0) ? delay*beta : delay*gamma,
				prospC = travelC + delayC; //the prospective cost

			if(prospC < newC - 2) {
				this.a = t.time;
				newC = prospC;
			}
			// if(this.index == 0) debugger;
		}; //END FOR LOOP

	} //choose

}//agent 

//now we decide who gets served when
function process(){ 
	var cumA = 0,
		cumD = 0,
		cumDL = 0,
		cumAL = 0;

	times.forEach(function(interval,i){
		var capLeft = s; //the capacity left initalizes to the capacity;

		for (var j = 0; j < interval.q.length; j++) {
			var agent = interval.q[j]; //the agent
			if(capLeft >= agent.loadLeft ){ //if it can be processed right now
				capLeft = capLeft - agent.loadLeft; //carve off the capacity from the interval
				agent.d = interval.time; 
				cumDL+=agent.loadLeft; //update the cumulative load
				interval.d.push(agent); //give the interval this agent
				agent.loadLeft = agent.load; //restarting the agent's load counter
			}else{
				agent.loadLeft = agent.loadLeft - capLeft; //carve off that part of the agent's load that is served
				cumDL+=capLeft; //update the cumulative departed load
				capLeft = 0; //no more capacity

				//we don't give the agent this departure time or this interval
				var spillover = interval.q.slice(j); //select the ones that didn't make it, including this one?
				if(spillover.length>0) times[i+1].q = spillover.concat(times[i+1].q); //push whatever is left of the q to the next times' q
				break;
			}
		};

		//update the interval's counts of cumulative loads

		interval.a.forEach(function(agent){
			cumAL+= agent.load;
		})

		cumA+=interval.a.length;
		cumD+=interval.d.length;

		interval.cumA = cumA;
		interval.cumD = cumD;

		interval.cumAL = cumAL;

		interval.cumDL = cumDL;

	})
}

//============the first run and the drawing ============

agents = shuffle(agents);

times = _.map(timeRange, function(t){
	return {
		time: t,
		q: [],
		a: [],
		d: [],
		cumA: 0,
		cumD: 0,
		cumAL: 0,
		cumDL: 0
	};
});

agents.forEach(function(agent){
	putAgentsToTimes(agent);
})

process();


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

var lineD = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.cumDL); });

var lineA = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.cumAL); });

x.domain(d3.extent(times, function(d) { return d.time; }));
y.domain([0,2000]);

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
    .style("text-alonchor", "end")
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

var pathA = svg.append("path")
    .datum(times)
    .attr("class", "line A")
    .attr("d", lineA);

var pathD = svg.append("path")
    .datum(times)
    .attr("class", "line D")
    .attr("d", lineD);

//==============the redraw function and transition=======

var transition = d3.transition()
    .duration()
    .ease("linear");

function redraw(){

	pathA.datum(times)
	// .transition(3)
	.attr("d", lineA);

	pathD.datum(times)
	// .transition(3)
	.attr("d", lineD);

}

//=============loop the program!===============

setInterval(function(){

	agents = shuffle(agents);

	agents.forEach(function(agent){
		agent.evalCost();
	});

	agents.slice(0,1).forEach(function(agent){
		agent.choose();
	})

	times = _.map(timeRange, function(t){
		return {
			time: t,
			q: [],
			a: [],
			d: [],
			cumA: 0,
			cumD: 0,
			cumAL: 0,
			cumDL: 0
		};
	});

	agents.forEach(function(agent){
		putAgentsToTimes(agent);
	})

	process();

	redraw();

}, 1)
