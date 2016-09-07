'use strict';

angular.
  module('messageList').
  component('messageList', {
    templateUrl: 'message-list/message-list.template.html',
    controller: ['Message',
      function MessageListController(Message) {
        this.messages = Message.query();
        this.showlogin = true;
        this.user = null;
        var ctrl = this;
        ctrl.login = function(user){
          this.user = user;
          this.showlogin = false;
        }

        ctrl.sendmessage = function(data){
          ctrl.newmessage = new Message({'data':data, 'user':this.user})
          ctrl.newmessage.$save(function(result){
            console.log(result);
            console.log('success message creation');
          });
          this.messages = Message.query();
        }
      }
    ]
  });
