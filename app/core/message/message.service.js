'use strict';

angular.
  module('core.message').
  factory('Message', ['$resource',
    function($resource) {
      return $resource('messages/:messageId.json', {}, {
        query: {
          method: 'GET',
          params: {messageId: 'messages'},
          isArray: true
        }
      });
    }
  ]);
