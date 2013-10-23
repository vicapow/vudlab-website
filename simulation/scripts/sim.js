var allTimes = d3.range(0,800),
	ddp = d3.range(300, 400),
	alpha = 1,
	beta = .5,
	gamma = 1.5,
	numAgents = 100,
	s = 5,
	classes = {'1': 200, '2': 300, '3': 50, '4': 200}

function agent(load){

	this.load = +load;
	this.w = ddp[Math.floor(Math.random()*ddp.length)]; 
	this.a = this.w;

} 

var Agents = [];

_.map(classes, function(val, key){
	d3.range(val).forEach(function(){
		Agents.push(new agent(key));
	});
});
