var tooltip = d3.select(".custom-tooltip")

var accOrRej = function(d){
  return (d.id===0) ? "Yes" : "No"
}


d3.select('.force-directed').selectAll("circle")
    .on("mousemove", function(d){
      tooltip.transition().duration(100)
        .style("opacity", .9)
      tooltip.html(
        '<table border="0" align="center" cellpadding="5" cellspacing="3">'
          + '<tbody>'
            + '<tr>'
              + '<td>Accepted?</td>'
              + '<td style="border-radius: 2px; background-color:' + colorScale(d.id)  + ';">'
                +  accOrRej(d)
              + '</td>'
            + '</tr>'
            +'<tr>'
              + '<td>Department: </td>' 
              + '<td>'+ d.department
            + '</tr>'
            +'<tr>'
              + '<td>Gender: </td>'
              + '<td>'+ d.sex + '</td>'
            + '</tr>'
          + '</tbody>'
        + '</table>')
        .style("left", (d3.event.pageX + 10)  + "px")
        .style("top", (d3.event.pageY - 110) + "px")

        d3.select(this).transition().duration(25)
          .attr('r', '6')
    })
    .on("mouseout", function(d) {
      tooltip.transition().duration(200)
        .style("opacity", 0);
      d3.select(this).transition().duration(50)
        // TODO: hardcoding the normal radius like this is sort of hacky
        // but it gets the job down for now.
        .attr('r', '2.2257336343115126')
    })

d3.select('.svg-line').selectAll('circle')
    .on("mousemove", function(d){
      tooltip.transition().duration(100)
        .style('opacity', 0.9)
      tooltip.html(
        '<table style="margin-bottom: 5px;" border="0" align="center" cellpadding="5" cellspacing="3">'
          + '<tbody>'
            + '<tr style="background-color:' + d.col + ';">'
              + '<td style="border-radius: 2px;">'
                + '( ' + d.x + ' , ' + d.y + ' )'
              + '</td>'
            + '</tr>'
          + '</tbody>'
        + '</table>')
        .style("left", (d3.event.pageX + 10)  + "px")
        .style("top", (d3.event.pageY - 70) + "px")

      d3.select(this).transition().duration(25)
        .attr('stroke', 'white')
        .attr('stroke-width','2px')
    })
    .on('mouseout', function(d) {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
      d3.select(this).transition().duration(25)
        .attr("stroke", "#2C3E50")
        .attr("stroke-width", "1px")
    })

d3.selectAll(".arc")
  .on("mousemove", function(d){
      tooltip.transition().duration(100)
        .style("opacity", .9);
      tooltip.html(
        '<table style="margin-bottom: 5px;" border="0" align="center" cellpadding="5" cellspacing="3">'
          + '<tbody>'
            + '<tr>'
              + '<td style="border-radius: 2px; font-weight: bold; background-color:' + color(d.data.accepted) + ';">'
                + d.data.accepted 
              + '</td>'
              + '<td>'
                + d.data.percent + '%'
              + '</td>'
            + '</tr>'
          + '</tbody>'
        + '</table>')
        .style("left", (d3.event.pageX + 10)  + "px")
        .style("top", (d3.event.pageY - 70) + "px")

    d3.select(this).select("path").transition().duration(50)
      .attr("stroke", "white")
      .attr("stroke-width","10px")
  })
  .on("mouseout", function(){
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
    d3.select(this).select("path").transition().duration(50)
      .attr("stroke", "white")
      .attr("stroke-width","1px")
  })  