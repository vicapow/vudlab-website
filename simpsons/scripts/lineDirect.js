app.directive('lineChart', function(){

  var margin = { top: 40, right: 20, bottom: 55, left: 45 }
    , width = 320 - margin.left - margin.right
    , height = 300 - margin.top - margin.bottom
    //flatui colors
    , blue = '#3498DB'
    , black = '#2C3E50'
    , red = '#E74C3C'
    , purple = '#9b59b6'
    , green = '#1abc9c'

    , x = d3.scale.linear()
      .domain([0,100])
      .range([0, width])

    , y = d3.scale.linear()
      .domain([0,100])
      .range([height, 0])

    , xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

    , yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")

    , line = d3.svg.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.y) })

  // Runs during compile
  return {
    restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
    , link: function(scope, elem, attrs) {
      var rates = scope.rates
        , proportions = scope.proportions

      d3.select(elem[0]).select("svg").remove()

      var svg = d3.select(elem[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class","svg-line")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var gYAxis = svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)

      gYAxis.append("text")
        .attr("transform", " translate(" + (-35) + "," + (height / 2) + ") rotate(-90)")
        .style("text-anchor", "middle")
        .text("% admitted")

      var gXAxis = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

      gXAxis.append("text")
        .attr("transform", " translate(" + (width / 2) + "," + (40) +  ")")
        .style("text-anchor", "middle")
        .text('% applied to easy department')
        .classed('x-axis-label')


      function addDashedLine(g){
        return g.append('path')
          .datum([
            { x: 0, y: 0 }
            , { x: 100, y: 0 }
          ]).attr('class','line')
          .attr('d', line)
          .attr('stroke', black)
          .attr('stroke-width', '1.5px')
          .attr('stroke-dasharray', '5,5')
      }

      var redBallLine = addDashedLine(svg)
      var blueBallLine = addDashedLine(svg)

      // women line
      svg.append("path")
        .datum([
          { x: 0, y: rates.female.hard * 100 }
          , { x: 100, y: rates.female.easy * 100 }
        ])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", green)
        .attr("stroke-width","1.5px")

      // men line
      svg.append("path")
        .datum([
          { x: 0, y: rates.male.hard * 100 }
          , { x: 100, y: rates.male.easy * 100 }
        ])
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", purple)
        .attr("stroke-width", "1.5px")

      // men ball
      svg.append("g")
        .attr("class","g-blue-circles")
        .selectAll("blue circles")
        .data([proportions.easy])
        .enter()
        .append('circle')
        .attr({
          'class': 'blue-circles'
          , r: 6
          , fill: purple
          , stroke: "white"
        })

      // women ball
      svg.append("g")
        .attr("class","g-red-circles")
        .selectAll("red circles")
        .data([proportions.easy])
        .enter()
        .append("circle")
        .attr({
          class: "red-circles",
          r: 6
          , fill: green
          , stroke: 'white'
        })

      scope.$watch("proportions.easy.female + proportions.easy.male", function (val){
        var proportions = scope.proportions
          , svg = d3.select(elem[0])
          , admitted, applied
          , depts = scope.departments

        // women
        admitted = depts.easy.female.admitted + depts.hard.female.admitted
        applied = depts.easy.female.applied + depts.hard.female.applied

        var redBallData = {
          x: proportions.easy.female * 100
          , y: (admitted / applied) * 100
        }
        svg.select(".red-circles")
          .data([redBallData])
          .attr({
            cx: function(d){ return x(d.x) }
            , cy: function(d){ return y(d.y) }
          })

        // men
        admitted = depts.easy.male.admitted + depts.hard.male.admitted
        applied = depts.easy.male.applied + depts.hard.male.applied
        var blueBallData = {
          x: proportions.easy.male * 100
          , y: (admitted / applied) * 100
        }
        svg.select(".blue-circles")
          .data([blueBallData])
          .attr({
            cx: function(d){ return x(d.x) }
            , cy: function(d){ return y(d.y) }
          })

        redBallLine.datum([
          { x: 0, y: redBallData.y }
          , { x: redBallData.x, y: redBallData.y }
        ]).attr('d', line)

        blueBallLine.datum([
          { x: 0, y: blueBallData.y }
          , { x: blueBallData.x, y: blueBallData.y }
        ]).attr('d', line)

      })
    }
  }
})