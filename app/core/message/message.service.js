'use strict';

angular.
  module('core.message').
  factory('Message', ['$resource',
    function($resource) {
      return $resource('/messages', {}, {
        query: {
          method: 'GET',
          isArray: true
        }
      });
    }
  ]);
