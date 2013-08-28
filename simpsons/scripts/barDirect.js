app.directive('bar', function(){

  var width = 50
    , height = 20
    //flatui colors
    , blue = '#3498DB'
    , black = '#2C3E50'
    , red = '#E74C3C'
    , purple = '#9b59b6'
    , green = '#27ae60'

  var x = d3.scale.linear()
            .range([0,width]);
  // Runs during compile
  return {
    restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
    , link: function(scope, elem, attrs) {
      var gender = attrs.gender //male vs female vs combined
        , measure = attrs.measure //applied vs admitted
        , program = attrs.program //easy vs hard
        , dept = scope.departments[program]
        , pop = scope.pop

      var x = d3.scale.linear()
                .domain([0, pop[gender]])
                .range([0,width])

      d3.select(elem[0]).select("svg").remove()
      
      var svg = d3.select(elem[0]).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + 0 + "," + 0 + ")")

      var data = dept[gender][measure]

      var band = svg.append('rect')
        .attr({
          width: width,
          height: height,
          fill: 'none',
          stroke: '#bdc3c7',
          "stroke-width": "2px"
        })

      var bar = svg
        .append("rect")
        .datum(data)
        .attr({
          width: x
          , height: height
          , fill: gender === 'female' ? green : purple
        })

      scope.$watch("proportions.easy.female + proportions.easy.male", function(val){
        data = dept[gender][measure]

        bar.datum(data)
          .transition()
          .duration(100)
          .attr("width",x)

      })
    }
  }
})

// <div bar measure="admitted/applied" gender="male" program = "easy/hard">