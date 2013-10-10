d3.chart = d3.chart || {};

d3.chart.chord = function(container) {
  var self = {};
  var rows = []

  var chord = d3.layout.chord()
    .padding(.05)
    .sortSubgroups(d3.descending)

var trans = svg.transition().duration(750),
    delay = function(d, i) { return i * 50; };

  var offset = 50;
  var w = parseInt(d3.select('#chord').style('width')) - offset,
      h = parseInt(d3.select('#chord').style('height')) - offset,
      r0 = Math.min(w, h) * .30,
      r1 = r0 * 1.2;
  var format = d3.format("3n")

  var fill = d3.scale.category20c();

  self.update = function(data) {
    chord.matrix(data);
    self.render();
  };

  self.clear = function() {
      d3.select(container).selectAll('svg').remove();
  };

  self.render = function() {
    self.clear();

    var svg = d3.select(container)
      .append("svg")
        .attr("class", "chordSVG")
        .attr("width", "100%")
        .attr("height", "100%")
      .append("g")
        .attr("transform", "translate(" + (offset + w) / 2 + "," + (offset + h) / 2 + ")");

    svg.append("g")
      .selectAll("path")
        .data(chord.groups)
      .enter().append("path")
        .attr("class", "chordBlock")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", d3.svg.arc().innerRadius(r0).outerRadius(r1))
        .on("mouseover", function(d,i) {
          var station = locs.filter(function(v){ return v.index == i; })[0];
          redraw(station, i);
          fade(.1, svg)(d,i)
        })
        .on("mouseout", function(d,i){
          undraw();
          fade(1, svg)(d,i);
        });
 
    var ticks = svg.append("g")
      .selectAll("g")
        .data(chord.groups)
      .enter().append("g")
        .attr("transform", function(d) {
          var rot = (d.startAngle + (d.endAngle - d.startAngle)/2) * 180 / Math.PI - 90
          //var rot = d.endAngle * 180 / Math.PI - 90
          //console.log(rot, d)
          var str = "rotate(" + ( rot) + ")"
          d.rot = rot;
          if(rot > 90) {
            str += "rotate(" + 180 + ")";
            str +=  "translate(" + (-r1 - 16) + ",0)";
            d3.select(this).classed("backwards", true);
          } else {
            str +=  "translate(" + r1 + ",0)";
          }
          return str
        })
    .append("text")
    .attr("x", 8)
        .attr("dy", ".35em")
    ticks
    .append("tspan")
    .text(function(d,i) { 
      if(d.rot < 90) {
        return rows[d.index] 
      }
      //  else {
      //   d3.select(this).classed("number", true)
      //   return format(Math.round(d.value))
      // }
    })
    ticks
    .append("tspan")
    .attr("dx", 5)
    .text(function(d,i) { 
      if(d.rot > 90) {
        return rows[d.index] 
      } 
      // else {
      //   d3.select(this).classed("number", true)
      //   return format(Math.round(d.value)) 
      // }
    })

      
      /*
      .selectAll("g")
        .data(groupTicks)
      .enter().append("g")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + r1 + ",0)";
        });

 
    ticks.append("line")
        .attr("x1", 1)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 0)
        .style("stroke", "#000");

    ticks.append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
          return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function(d) {
          return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
        })
        .text(function(d) { return d.label; });
  */
    svg.append("g")
        .attr("class", "chord")
      .selectAll("path")
        .data(chord.chords)
      .enter().append("path")
        .style("fill", function(d) { return fill(d.target.index); })
        .attr("d", d3.svg.chord().radius(r0))
        .style("opacity", 1);
  };

  self.rows = function(_) {
    if(!arguments.length) return rows;
    rows = _;
    return self;
  }

  return self;
};


/* Utility functions */

/** Returns an array of tick angles and labels, given a group. */
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, 20).map(function(v, i) {
    return {
      angle: v * k + d.startAngle,
      label: i % 5 ? null : v
    };
  });
}

/** Returns an event handler for fading a given chord group. */
function fade(opacity, svg) {
  return function(g, i) {
    svg.selectAll("g.chord path")
        .filter(function(d) {
          return d.source.index != i && d.target.index != i;
        })
        // .transition()
        // .duration()
        .style("opacity", opacity);
  };
}