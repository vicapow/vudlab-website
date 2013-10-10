var app = angular.module('bart', [])

app.controller( 'MainCtrl', function( $scope, $q ) {

  queue()
  .defer(d3.json, 'data/chord_ridership.json')
  .defer(d3.json, 'data/chordStations.json')
  .await(drawChord);

  

});

/*
app.directive('map', ['$timeout', function($timeout){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, elem, attrs) {
			
		}
	};
}]);
*/