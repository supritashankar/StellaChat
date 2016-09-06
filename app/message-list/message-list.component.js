'use strict';

angular.
  module('messageList').
  component('messageList', {
    templateUrl: 'message-list/message-list.template.html',
    controller: ['Message',
      function MessageListController(Message) {
        this.messages = Message.query();
      }
    ]
  });
