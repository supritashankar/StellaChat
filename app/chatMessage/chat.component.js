'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
  module('chat').
  component('chat', {
    templateUrl: 'chat/chat.template.html',
    controller: ['Message',
      function MessageListController(Message) {
        this.messages = Message.query();
      }
    ]
  });
