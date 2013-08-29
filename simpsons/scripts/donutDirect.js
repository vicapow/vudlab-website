app.directive('donut', function(){

  var width = 85
    , height = 85
    , radius = width / 2.3
    , highlightRadius = width / 2.1

    //flatui colors
    , blue = '#3498DB'
    , black = '#2C3E50'
    , red = '#E74C3C'
    , green = '#1abc9c'
    , labelSize = 12
    , middleText = 18

    , color = d3.scale.ordinal()
      .domain(['accepted', 'rejected'])
      .range([blue, red])

    , donutArc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius - 10)

    , textArc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 35)

    , pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.percent })


  // Runs during compile
  return {
    restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
    , link: function(scope, elem, attrs) {
      var gender = attrs.gender
        , oppGender = gender === 'female' ? 'male' : 'female'
        , rates = scope.rates
        , dept = attrs.department
        , depts = scope.departments

      scope.$watch("proportions.easy.female + proportions.easy.male", function(val){
        d3.select(elem[0]).select("svg").remove()
        var admitted, oppAdmitted, applied, oppApplied, highlight

        if(dept === 'combined'){
          admitted = depts.easy[gender].admitted + depts.hard[gender].admitted
          applied = depts.easy[gender].applied + depts.hard[gender].applied
          oppAdmitted = depts.easy[oppGender].admitted + depts.hard[oppGender].admitted
          oppApplied = depts.easy[oppGender].applied + depts.hard[oppGender].applied
        }else{ 
          admitted = rates[gender][dept]
          applied = 1
          oppAdmitted = rates[oppGender][dept]
          oppApplied = 1
        }

        highlight = ( admitted / applied ) > ( oppAdmitted / oppApplied ) ? 0.6 : 0
        
        var data = [{ 
            accepted: 'rejected'
            , percent: (applied - admitted) / applied * 100
          }
          , { 
            accepted: 'accepted'
            , percent: admitted / applied * 100
          }]
          , svg = d3.select(elem[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        svg.append("circle")
          .attr("r", highlightRadius)
          .style('opacity', highlight)
          .style("fill", 'none') 
          .style('stroke', '#333')
          .style('stroke-width', '4px')

        var group = svg.selectAll("arc")
            .data(pie(data)).enter().append("g")
            .attr("class", "arc")

        group.append("path")
          .attr("d", donutArc)
          .style("fill", function(d) { return color(d.data.accepted) })
          .attr("stroke", black)

        group.append("text")
           .attr("transform", function(d) { return "translate(" + textArc.centroid(d) + ")" })
           .attr("dy", ".35em")
           .attr("fill", '#34495e')
           .attr("font-size", labelSize)
           .style("text-anchor", "middle")
           .text(function(d) { return d3.round(d.data.percent) + "%" })


      })
    }
  }
})