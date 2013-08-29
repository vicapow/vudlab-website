'use strict';

app.controller('MainCtrl', ['$scope', function($scope) {

  // acceptance rate for men who applied to the hard vs easy program
  // constant
  var rates = $scope.rates = {
      male: {
        // only ~25% of men that applied got accepted to the hard program
        hard: .256
        // ~62% of those that applied got accepted to the easy program
        , easy: .624
      }
        // acceptance rate for women who applied to the hard vs easy program
      , female: {
        // only ~26% of women that applied got accepted tot he hard program
        hard: .265
        // ~80% of those that applied got accepted to the easy program
        , easy: .797
      }
    }
    // the proportion of men and women that applied to the easy and hard programs
    // not constant. this data will change with the sliders
    , proportions = $scope.proportions = { 
      easy: { female: 0.6, male: 0.4 }
      , hard: { female: 0.4, male: 0.6 }
      // easy.female + hard.female must equal 1
      // easy.male + hard.male must equal 1
    }
    // total male and female applicants
    // constant
    , pop = $scope.pop = { male: 2691, female: 1835 }
    // department data
    // not constant. this will update with the slider and be used in the table
    , departments = $scope.departments = {
      easy: {
        male: {
          applied: pop.male * proportions.easy.male
          , admitted: pop.male * proportions.easy.male * rates.male.easy
        }
        , female: {
          applied: pop.female * proportions.easy.female
          , admitted: pop.female * proportions.easy.female * rates.female.easy
        }
      }
      , hard: {
        male: {
          applied: pop.male * proportions.hard.male
          , admitted: pop.male * proportions.hard.male * rates.male.hard
        }
        , female: {
          applied: pop.female * proportions.hard.female
          , admitted: pop.female * proportions.hard.female * rates.female.hard
        }
      }
    }
    , combined = $scope.combined = {
      male: {
        acceptance: (departments.easy.male.admitted + departments.hard.male.admitted) / pop.male
      }
      , female: {
        acceptance: (departments.easy.female.admitted + departments.hard.female.admitted) / pop.female
      }
    }

    $scope.pdox = "no";

    $scope.$watch("combined.male.acceptance+ combined.female.acceptance", function(val){
      if( combined.male.acceptance > combined.female.acceptance ) {
        $scope.pdox = "yes";
        console.log("LOG:","goodbye");
      }else{
        $scope.pdox = "no";
        console.log("LOG:","hello");
      }
    })

  $scope.updateProportions = function(p, gender){
    // adjust the ratio of women that applied to each department
    var p = Number(p) / 100

    proportions.easy[gender] = p
    proportions.hard[gender] = 1 - p

    departments.easy[gender].applied = pop[gender] * proportions.easy[gender]
    departments.easy[gender].admitted = pop[gender] * proportions.easy[gender] * rates[gender].easy

    departments.hard[gender].applied = pop[gender] * proportions.hard[gender]
    departments.hard[gender].admitted = pop[gender] * proportions.hard[gender] * rates[gender].hard

    combined[gender].acceptance = (departments.easy[gender].admitted + departments.hard[gender].admitted) / pop[gender]



  };
}]);