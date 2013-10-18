var _ = require('underscore');
var d3 = require('d3');
var queue = require('queue-async');
var fs = require('fs');

queue()
.defer(fs.readFile, '../data/bart_stations.json')
.defer(fs.readFile, '../data/ridership_exits.json')
.defer(fs.readFile, '../data/ridership_entries.json')
.await(parse)


function parse(err, bart_stations, exits_raw, entries_raw){

	var locs = JSON.parse(bart_stations);
	var dExits = JSON.parse(exits_raw);
	var dEntries = JSON.parse(entries_raw);

  locs.forEach(function(d, i){
    //now add the ridership in
    var id = d.id;

    var Xits = dExits.filter(function(v){ return v.name == id})[0];
    var Ntries = dEntries.filter(function(v){ return v.name == id})[0];

    d['total_exits'] = Xits.Exits;
    d['total_entries'] = Ntries.Entries;
    d['exits'] = Xits;
    d['entries'] = Ntries;
    delete d.exits.name;
    delete d.exits.Exits;
    delete d.entries.name;
    delete d.entries.Entries;

  });

	fs.writeFile('../data/locs.json', JSON.stringify(locs), 'utf8')

}