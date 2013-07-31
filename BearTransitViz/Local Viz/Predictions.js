var preData = []
setInterval(function(){
	var time = new Date().getTime()/1000
	console.log(time)
	preData = []
	stops.forEach(function(stop){
		//console.log(stop)
		if (stop.arrivals != undefined){
			var arrivals = []

			stop.arrivals.forEach(function(arrival){
				//console.log(arrival)
				//console.log(time - stop.ts)
				//console.log(arrival - (time - stop.ts))
				if (arrival - (time - stop.ts) >= 0) {
					arrivals = arrivals.concat(arrival - (time - stop.ts))
				}
			})
			preData = preData.concat([[stop.pm, d3.min(arrivals)]])
			//stop.arrivals = stop.arrivals.filter(function(d){ return (d >= 0)})
		}
	})
	console.log(preData)
	predictions.range(preData.map(function(d){return d[1]})).domain(preData.map(function(d){return d[0]}))
	paintRoute(shape)

	//console.log(buses, stops)
},30000)