app.directive('occsChart', ['', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, elem, attrs, controller) {

			d3.select(elem[0]).select("svg").remove();

			// var dimension = attrs.dimension;
			// var group = attrs.group;
			// var rangeChart = attrs.rangeChart;

			//use directive-to-directive communication to do the filtering
			var chart = d3.select(elem[0]);

			chart.width(600)
			   .height(300)
			   .margins({top: 50, right: 10, bottom: 20, left: 100})
			   .dimension(occByHour)
			   .group(occByHourGroup)
			   .transitionDuration(500)
			   // .mouseZoomable(true)
			 .elasticY(true)
			   .xAxisPadding(1)
			   .yAxisPadding(500)
			   .x(xOccs) // scale and domain of the graph
			   .xUnits(d3.time.day)
			   .renderHorizontalGridLines(true)
			   .renderVerticalGridLines(true)
			   .brushOn(false)
			   .renderArea(true)
			   .rangeChart(littleChart)
			   .xAxis();

			scope.$watch('occs', function(){
					chart.render();
			})
		}
	};
}]);