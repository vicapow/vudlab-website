var fs = require('fs');
var _ = require('underscore');

var input = JSON.parse(fs.readFileSync('./data/t-1.json'));
var output = [];

_.map(input.AVL, function(v){
  var entry = {
    name : v.NAME
    , cap : Number(v.OPER)
    , type: v.TYPE
  }
  if(v.TYPE === 'ON'){
    entry.ID = v.BFID
    var coords = v.LOC.split(',')
    entry.loc = [
      {lon: Number(coords[0]), lat: Number(coords[1])},
      {lon: Number(coords[2]), lat: Number(coords[3])}
    ]
  }
  else{
    entry.ID = v.BFID
    var coords = v.LOC.split(',')
    entry.loc = {lon: Number(coords[0]), lat: Number(coords[1])}  
  }
  output.push(entry);
})

fs.writeFileSync('./map/locs.json', JSON.stringify(output, null, 2))