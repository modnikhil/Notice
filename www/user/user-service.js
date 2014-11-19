'use strict';

angular.module('MyApp.services').service('User',
  function($q, $firebase, FIREBASE_ROOT, Auth, $rootScope) {
    var usersRef = new Firebase(FIREBASE_ROOT + '/users');
    var currentUser = null;
    var subscribed = "1234";
    
    this.loadCurrentUser = function() {
      var defer = $q.defer();
      var currentUserRef = usersRef.child(Auth.currentUser.uid);
      
      currentUser = $firebase(currentUserRef);
      currentUser.$on('loaded', defer.resolve);

      return defer.promise;
    };

    this.create = function(id, email) {
      var users = $firebase(usersRef);
      return users.$child(id).$set({ email: email });
    };
    
    // this.addName = function(firstName, lastName) {
    //   var users = $firebase(usersRef);
    //   return users.$child(id).$add({ first: firstName, last:lastName });
    // };
    
    this.recordPasswordChange = function() {
      var now = Math.floor(Date.now() / 1000);
      
      return currentUser.$update({ passwordLastChangedAt: now });
    };

    this.hasChangedPassword = function() {
      return angular.isDefined(currentUser.passwordLastChangedAt);
    };
    
    this.manageSubscriptions = function(subs) {
      var users = $firebase(usersRef);
      
      for (var key in users) {
            var obj = users[key];
            if (key.toLowerCase() === Auth.currentUser.uid) {
               subscribed = subs;
               console.log(subscribed);
            }
      }
      
      return users.$child(Auth.currentUser.uid).$set({ subscribed: subs });
    };
  });
