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
      .when('/workouts', {
        templateUrl: 'views/workouts.html'
      })
      .when('/events', {
        templateUrl: 'views/event.html'
      })
      .when('/test', {
        templateUrl: 'views/bartest.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
