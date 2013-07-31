// Import libraries
var mongojs = require('mongojs');
var fs = require('fs');
var moment = require('moment');

// Note that the month is zero-indexed
var start = moment([2013, 6, 11]).zone('-07:00').hour(8).format('X') * 1000;
var end = moment([2013, 6, 11]).zone('-07:00').hour(10).format('X') * 1000;

console.log(start)
console.log(end)

// Parse the perimeter data
var perimeter = undefined;
fs.readFile('P.json', function(err,data){
	if (err) {
		console.log('Error: ' + err);
		return;
	}
	perimeter = JSON.parse(data);
	console.log(perimeter);
})


// Establish authenticated connection
var collection = ['event'];
var agency = ['beartransit']
var dbUrl = "mongodb://external:gobears@ds029297.mongolab.com:29297/beartransit";

// Var results contains the results of the query
var results;

var db = mongojs.connect(dbUrl,collection);

var mInterval = setInterval(function(){
	if (db != undefined && perimeter != undefined){
		
		db.event.find({'entity.trip_update.stop_time_update.arrival.time':{'$gte':start,'$lt':end},'entity.trip_update.trip.route_id':'P'}, function(err, docs) {
			// results = docs;
			results = docs.map(function(d){return {trip_id: d.entity.trip_update.trip.trip_id,
													stop_id: d.entity.trip_update.stop_time_update.stop_id,
													pm: perimeter.features[0].geometry.properties.stops.filter(function(p){return (p[1] === d.entity.trip_update.stop_time_update.stop_id);})[0][0],
													time: d.entity.trip_update.stop_time_update.arrival.time}});
			
			results.sort(function(a,b){return (a.trip_id + a.time < b.trip_id + b.time) ? -1 : 1});

			fs.writeFile("data.txt",JSON.stringify(results,null,1),function(err){
				if (err) {
					console.log(err);
				} else {
					console.log("File Saved!");
				}
			})
			db.close();
			clearInterval(mInterval);
		});

	} else {
		console.log('db not ready yet');
		console.log(db);
	}
},1000)




