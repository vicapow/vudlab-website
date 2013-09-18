'use strict';

app.controller('MainCtrl', ['$scope', '$q', function(scope, q) {

  function getData(){
    d3.json("../../data/occ_data.json", function(data){
      data.forEach(function(d){
        d.time = new Date(d.time);
      })
      scope.occs = data;
    })
    d3.json("../../data/pems_data.json", function(data){
      data.forEach(function(d){
        d.time = new Date(d.time * 1000);
      })
      scope.pems = data;
    })
  }

  getData();

}]);