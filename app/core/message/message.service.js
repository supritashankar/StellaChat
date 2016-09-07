'use strict';

angular.
  module('core.message').
  factory('Message', ['$resource',
    function($resource) {
      return $resource('/messages', {id: '@_id'}, {
        query: {
          method: 'GET',
          isArray: true
        }
      });
    }
  ]);
