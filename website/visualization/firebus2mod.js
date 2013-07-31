var pro = {}

//initialize firebase

//var fdata = new Firebase("https://transit.firebaseio.com/bear-transit/data");  

pro.cess = function(){
  // separating the buses from the stops
  //pro.buses = d3.values(pro.data).filter(function(d){return d.type == "bus"})
  //pro.stops = d3.values(pro.data).filter(function(d){return d.type == "stop"})
  
  pro.trips = {}
  pro.loops = []
  
  // pro.buses.forEach(function(bus){
  //   if (pro.trips[bus.trip] == undefined) {
  //     pro.trips[bus.trip] = []
  //   }
  //   pro.trips[bus.trip].push({"time":bus.ts, "pm": bus.pm, "type":"bus"})
  // })
  // pro.stops.forEach(function(stop){
  //   stop.arrivals.forEach(function(arrival){
  //     if (pro.trips[arrival.trip] == undefined) {
  //       pro.trips[arrival.trip] = []
  //     }
  //     pro.trips[arrival.trip].push({"time":arrival.time+stop.ts, "pm":stop.pm, "type":"stop"})
  //   })
  // })
  
  pro.nest = d3.nest()
    .key(function(d){ return d.trip_id})
    .entries(pro.data)

  // trips creates the trajectory for one trip, loops repeats this trajectory for every loops around the begining
  
  for (var trip_data in pro.nest){
    //console.log(trip_data)
    pro.trips[pro.nest[trip_data].key] = pro.nest[trip_data].values
    pro.trips[pro.nest[trip_data].key].forEach(function(d){
      d.type = "stop"
    })
  }  

  pro.nest = d3.nest()
    .key(function(d){ return d.stop_id})
    .entries(pro.data)
  
  pro.stops = []
  for (var stop_data in pro.nest){
    //console.log(trip_data)
    var arrivals = pro.nest[stop_data].values
    var pm = pro.nest[stop_data].values[0].pm

    if (pm > 5.3349382621026544) {
      pm = pm - 5.3349382621026544
    }
    arrivals.forEach(function(d){
      //d.time = +d.time / 1000
    })
    pro.stops.push({"pm":pm, "id":pro.nest[stop_data].values[0].stop_id, "ts":0, "arrivals":arrivals, "name": pro.nest[stop_data].values[0].name})
  }  

  pro.buses = []
  
  for (var trip in pro.trips) {
    pro.trips[trip].sort(function(a,b){
      if (a.time != b.time) {
        return a.time-b.time
      } else {
        return a.pm -b.pm
      }
    })
    
    // the first event on each trip should be the bus, if not it means that we have obsolete data.
    
    if (pro.trips[trip].filter(function(d){return d.type == "bus"}).length != 0) {
      // if there is a bus on the trip (meaning that the trip has already started) then the bus must be the first entry
      while (pro.trips[trip][0].type != "bus") {
        pro.trips[trip].shift() // eliminates all entries before the bus
      }
    }

    pro.trips[trip].forEach(function(d,i,a){ // check sequential
      if (a[i-1] != undefined) {
        //if (d.pm > 5.3349382621026544) {console.log("WTF")}
        while (a[i-1].pm > d.pm) {
          //console.log(d.pm, a[i-1].pm)
          d.pm = 5.3349382621026544 + d.pm
        }
      }
    })

    // verifying that the data makes sense
    pro.trips[trip].forEach(function(d,i,a){
      if (a[i-1] != undefined && a[i+1] != undefined){
        if (a[i-1].pm < d.pm && d.pm < a[i+1].pm) {
          // everything ok
        } else {
          console.log("WTF")
          pro.trips[trip].splice(i,1)
        }
      }
    })
    var loop = pro.trips[trip].map(function(d){
      return {"time":d.time, "pm":d.pm, "trip": trip}
    })
    pro.loops.push(loop)
    while (d3.max(loop.map(function(d){return d.pm})) > 5.3349382621026544) {
      loop = pro.trips[trip].map(function(d){
        return {"time":d.time, "pm":d.pm - 5.3349382621026544, "trip": trip}
      })
      pro.loops.push(loop)
    }
  };
}

pro.ject = function() {
  var time = displayTime

  var trajectories = pro.loops.map(function(tra){
    return {path: d3.scale.linear().domain(tra.map(function(d){return d.pm})).range(tra.map(function(d){return d.time})), trip: tra[0].trip}
  })

  pro.projectedBuses = trajectories.map(function(tra){return {pm: tra.path.invert(time), time: time, id: tra.trip, path: tra.path} })
    .filter(function(busloc){return (0 <= busloc.pm && busloc.pm <= 5.3349382621026544 && d3.min(busloc.path.domain()) <= busloc.pm && busloc.pm <= d3.max(busloc.path.domain()) )})
  
  var buslocs = pro.projectedBuses.map(function(d){ return d.pm})

  var domain = pro.stops.map(function(stop) { return stop.pm - 0.001})
  domain = domain.concat(pro.stops.map(function(stop) { return stop.pm + 0.001 }))
  domain = domain.concat(buslocs)
  domain = domain.concat([0,5.3349382621026544])
  
  domain.sort(function(a,b){return a-b})
  
  range = domain.map(function(pm){
    var output = d3.min(trajectories.map(function(tra){ 
      if (d3.min(tra.path.domain()) <= pm && pm <= d3.max(tra.path.domain())) {
        return tra.path(pm)
      } else {
        return -1
      }
    }).filter(function(predictedtime){return predictedtime > time})) 
    if (isNaN(output) || output == -1) {
      output = d3.min(trajectories.map(function(tra){ 
        if (d3.min(tra.path.domain()) <= pm && pm <= d3.max(tra.path.domain())) {
          return tra.path(pm)
        } else {
          return -1
        }}).filter(function(predictedtime){return predictedtime >= time}))
      if (isNaN(output)) {
        return -1 // means no service
      } else {
        return output
      }
    } else {
      return output
    } 
  })
  var output = domain.map(function(event, i){
    return {"pm":event, "time": range[i]}
  })
  buslocs.forEach(function(busloc){
    output.push({"pm":busloc, "time": time, type: "bus"})
  })
  pro.events = output.sort(function(a,b){
    if (a.pm != b.pm){
      return a.pm - b.pm
    } else {
      return b.time - a.time
    }
  })
  pro.predict = d3.scale.linear().domain(pro.events.map(function(e){return e.pm})).range(pro.events.map(function(e){return e.time}))
}

d3.json("data.json", function(data){
  d3.json("StopNames.json", function(names){
    console.log(names)
    pro.data = data
    pro.data.forEach(function(d){
      d.time = +d.time
      d.time = d.time / 1000
      d.name = names.filter(function(S){ return S.stop_id == d.stop_id})[0].stop_name
  })
  })
})

// fdata.once("value", function(s){
//   pro.data = s.val()
// })

// fdata.on("child_changed", function(s) {
//   pro.data[s.name()] = s.val()

// })
