'use strict';

angular.
  module('stellachat').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/', {
          template: '<message-list>'
        }).
        otherwise('/');
    }
  ]);
