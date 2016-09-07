'use strict';

angular.
  module('messageList').
  component('messageList', {
    templateUrl: 'message-list/message-list.template.html',
    controller: ['Message',
      function MessageListController(Message) {
        this.messages = Message.query();
        this.showlogin = true;

        var ctrl = this;
        ctrl.login = function(user){
          console.log(user);
          this.showlogin = false;
        }

        ctrl.sendmessage = function(data){
          ctrl.newmessage = new Message(data)
          ctrl.newmessage.$save(function(){
            console.log('success message creation');
          })
        }
      }
    ]
  });
