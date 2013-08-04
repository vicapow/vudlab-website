'use strict';

var app = angular.module('mainApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/learn', {
        templateUrl: 'views/learn.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
