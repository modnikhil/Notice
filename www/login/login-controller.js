'use strict';
//([\._a-zA-Z0-9-]+@d211.org)
angular.module('MyApp.controllers')
.controller('LoginCtrl', function($scope, $state, $ionicLoading, Auth, User, $rootScope) {
    $rootScope.user = {
      email: '',
      password: ''
    };
    $scope.errorMessage = null;
    
    // var userRef = new Firebase('https://noticeapp.firebaseio.com/user');
    // $rootScope.users = $firebase(userRef);
    
    $scope.login = function() {
      $scope.errorMessage = null;

      $ionicLoading.show({
        template: 'Please wait...'
      });
 
      Auth.login($rootScope.user.email, $rootScope.user.password)
          .then(User.loadCurrentUser)
          .then(redirectBasedOnStatus)
          .catch(handleError);
          
    };

    function redirectBasedOnStatus() {
      $ionicLoading.hide();
      
      if (User.hasChangedPassword()) {
        $state.go('app.dashboard');
      } else {
        $state.go('change-password');
      }
    }

    function handleError(error) {
      switch (error.code) {
        case 'INVALID_EMAIL':
        case 'INVALID_PASSWORD':
        case 'INVALID_USER':
          $scope.errorMessage = 'Email or password is incorrect';
          break;
        default:
          $scope.errorMessage = 'Error: [' + error.code + ']';
      }

      $ionicLoading.hide();
    }
  });
