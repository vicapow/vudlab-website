app.factory('parsing', [, function() {
  function parseData(data) {
    data.forEach(function(d) {
      d.start = moment(d.start)
      // d['start'].setHours(d['start'].getHours() + 9)
      d['Battery Level'] = d.BatteryLevel
      delete d.BatteryLevel;
      d['Plug Status'] = d.Plug
      delete d.Plug;
      d.Wifi = d.Communication
      delete d.Communication;
      d.GPS = d.GPSComm
      delete d.GPSComm;
      d['Onboard Unit'] = d.OBUComm
      delete d.OBUComm;
      // accurately account for possible final null
      if (d.end != null) {
        d.end = moment(d.end);
      } else {
        d.end = moment();
      }
    }); //end of data.forEach
  };

  function parseDaily(data, keyRelabel) {
    data.forEach(function(d) {
      d.start = moment(d.date.$date);
      d.end = d.start.add("days", 1);
      d3.keys(keyRelabel).forEach(function(key, i) {
        d[keyRelabel[key]] = d[key];
        delete d.key;
      })
    })
    data = data.filter(function(d) {
      return d.start.isAfter(moment().subtract('days', 14).startOf('day'));
    })
  }

  function createTimes(data, measures) {
    var times = {};
    measures.map(function(measure) { //for each of the things we're checking
      times[measure] = [];
      var entry = {
        stat: data[0][measure],
        start: z.domain()[0],
        end: moment(),
        name: measure
      } //first entry
      // sort the data by start times
      data.sort(function(a, b) {
        return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
      });
      data.forEach(function(d) { //go through each data point in order
        if (entry.stat !== d[measure]) {
          entry.end = d['start'];
          times[measure].push(entry);
          entry = {
            stat: d[measure],
            start: d.start,
            end: moment(),
            name: measure
          };
        }
      });
      // handle final entry (not pushed yet)
      entry.end = moment();
      times[measure].push(entry);
    });
    return times;
  }
  return {
    'parseData': parseData(),
    'createTimes': createTimes(),
    'parseDaily': parseDaily()
  }
}]);