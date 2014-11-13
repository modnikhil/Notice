"use strict";angular.module("devFlowApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","firebase.utils","simpleLogin"]),angular.module("devFlowApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("firebase.config",[]).constant("FBURL","https://trynotice.firebaseio.com").constant("SIMPLE_LOGIN_PROVIDERS",["password"]).constant("loginRedirectPath","/login"),angular.module("firebase.utils",["firebase","firebase.config"]).factory("fbutil",["$window","FBURL","$firebase",function(a,b,c){function d(a){for(var b=0;b<a.length;b++)if(angular.isArray(a[b]))a[b]=d(a[b]);else if("string"!=typeof a[b])throw new Error("Argument "+b+" to firebaseRef is not a string: "+a[b]);return a.join("/")}function e(){var c=new a.Firebase(b),e=Array.prototype.slice.call(arguments);return e.length&&(c=c.child(d(e))),c}function f(a,b){var d=e(a);return b=angular.extend({},b),angular.forEach(["limit","startAt","endAt"],function(a){if(b.hasOwnProperty(a)){var c=b[a];d=d[a].apply(d,angular.isArray(c)?c:[c]),delete b[a]}}),c(d,b)}return{syncObject:function(){return f.apply(null,arguments).$asObject()},syncArray:function(){return f.apply(null,arguments).$asArray()},ref:e}}]),angular.module("devFlowApp").controller("ChatCtrl",["$scope","fbutil","$timeout",function(a,b,c){function d(b){a.err=b,c(function(){a.err=null},5e3)}a.messages=b.syncArray("messages",{limit:10}),a.messages.$loaded().catch(d),a.addMessage=function(b){b&&a.messages.$add({text:b}).catch(d)}}]),angular.module("devFlowApp").filter("reverse",function(){return function(a){return angular.isArray(a)?a.slice().reverse():[]}}),function(){angular.module("simpleLogin",["firebase","firebase.utils","firebase.config"]).factory("authRequired",["simpleLogin","$q",function(a,b){return function(){return a.getUser().then(function(a){return a?a:b.reject({authRequired:!0})})}}]).factory("simpleLogin",["$firebaseSimpleLogin","fbutil","$q","$rootScope","createProfile","changeEmail",function(a,b,c,d,e,f){function g(){j.initialized=!0,j.user=h.user||null,angular.forEach(i,function(a){a(j.user)})}var h=a(b.ref()),i=[],j={user:null,initialized:!1,getUser:function(){return h.$getCurrentUser()},login:function(a,b){return h.$login(a,b)},logout:function(){h.$logout()},createAccount:function(a,b,c){return h.$createUser(a,b).then(function(){return j.login("password",{email:a,password:b})}).then(function(b){return e(b.uid,a,c).then(function(){return b})})},changePassword:function(a,b,c){return h.$changePassword(a,b,c)},changeEmail:function(a,b){return f(a,j.user.email,b,this)},removeUser:function(a,b){return h.$removeUser(a,b)},watch:function(a,b){i.push(a),j.getUser().then(function(b){a(b)});var c=function(){var b=i.indexOf(a);b>-1&&i.splice(b,1)};return b&&b.$on("$destroy",c),c}};return d.$on("$firebaseSimpleLogin:login",g),d.$on("$firebaseSimpleLogin:logout",g),d.$on("$firebaseSimpleLogin:error",g),h.$getCurrentUser(g),j}]).factory("createProfile",["fbutil","$q","$timeout",function(a,b,c){return function(d,e,f){function g(a){return h(a.substr(0,a.indexOf("@"))||"")}function h(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}var i=a.ref("users",d),j=b.defer();return i.set({email:e,name:f||g(e)},function(a){c(function(){a?j.reject(a):j.resolve(i)})}),j.promise}}]).factory("changeEmail",["fbutil","$q",function(a,b){return function(c,d,e,f){function g(){return f.login("password",{email:n.old.email,password:c}).then(function(a){n.old.uid=a.uid})}function h(){var c=b.defer();return n.old.ref=a.ref("users",n.old.uid),n.old.ref.once("value",function(a){var b=a.val();null===b?c.reject(d+" not found"):(n.old.name=b.name,n.curr.name=b.name,c.resolve())},function(a){c.reject(a)}),c.promise}function i(){return f.createAccount(n.curr.email,c,n.old.name).then(function(a){n.curr.uid=a.uid})}function j(){var c=b.defer();n.curr.ref=a.ref("users",n.curr.uid);var d={email:n.curr.email,name:n.curr.name};return n.curr.ref.set(d,function(a){a?c.reject(a):c.resolve()}),c.promise}function k(){var a=b.defer();return n.old.ref.remove(function(b){b?a.reject(b):a.resolve()}),a.promise}function l(){var a=b.defer();return f.removeUser(n.old.email,c).then(function(){a.resolve()},function(b){a.reject(b)}),a.promise}function m(){return f.login("password",{email:n.curr.email,password:c})}var n={old:{email:d},curr:{email:e}};return g().then(h).then(i).then(j).then(g).then(k).then(l).then(m).catch(function(a){return console.error(a),b.reject(a)})}}])}(),angular.module("devFlowApp").controller("LoginCtrl",["$scope","simpleLogin","$location",function(a,b,c){function d(d,e){a.err=null,b.login(d,e).then(function(){c.path("/account")},function(b){a.err=b})}a.passwordLogin=function(a,b){d("password",{email:a,password:b,rememberMe:!0})},a.createAccount=function(d,e,f){a.err=null,e?e!==f?a.err="Passwords do not match":b.createAccount(d,e).then(function(){c.path("/account")},function(b){a.err=b}):a.err="Please enter a password"}}]),angular.module("devFlowApp").controller("AccountCtrl",["$scope","user","simpleLogin","fbutil","$timeout",function(a,b,c,d,e){function f(a){h(a,"danger")}function g(a){h(a,"success")}function h(b,c){var d={text:b,type:c};a.messages.unshift(d),e(function(){a.messages.splice(a.messages.indexOf(d),1)},1e4)}function i(b){a.profile&&a.profile.$destroy(),d.syncObject("users/"+b.uid).$bindTo(a,"profile")}a.user=b,a.logout=c.logout,a.messages=[],i(b),a.changePassword=function(d,e,h){a.err=null,d&&e?e!==h?f("Passwords do not match"):c.changePassword(b.email,d,e).then(function(){g("Password changed")},f):f("Please enter all fields")},a.changeEmail=function(b,d){a.err=null,c.changeEmail(b,d).then(function(a){i(a),g("Email changed")}).catch(f)}}]),angular.module("devFlowApp").directive("ngShowAuth",["simpleLogin","$timeout",function(a,b){var c;return a.watch(function(a){c=!!a}),{restrict:"A",link:function(d,e){function f(){b(function(){e.toggleClass("ng-cloak",!c)},0)}e.addClass("ng-cloak"),a.watch(f,d),a.getUser(f)}}}]),angular.module("devFlowApp").directive("ngHideAuth",["simpleLogin","$timeout",function(a,b){var c;return a.watch(function(a){c=!!a}),{restrict:"A",link:function(d,e){function f(){b(function(){e.toggleClass("ng-cloak",c!==!1)},0)}e.addClass("ng-cloak"),a.watch(f,d),a.getUser(f)}}}]),angular.module("devFlowApp").config(["$routeProvider","SECURED_ROUTES",function(a,b){a.whenAuthenticated=function(c,d){return d.resolve=d.resolve||{},d.resolve.user=["authRequired",function(a){return a()}],a.when(c,d),b[c]=!0,a}}]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/chat",{templateUrl:"views/chat.html",controller:"ChatCtrl"}).whenAuthenticated("/account",{templateUrl:"views/account.html",controller:"AccountCtrl"}).when("/chat",{templateUrl:"views/chat.html",controller:"ChatCtrl"}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl"}).when("/profile/:name",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).when("/profile",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl"}).when("/profile",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","simpleLogin","SECURED_ROUTES","loginRedirectPath",function(a,b,c,d,e){function f(a){!a&&g(b.path())&&b.path(e)}function g(a){return d.hasOwnProperty(a)}c.watch(f,a),a.$on("$routeChangeError",function(a,c,d,f){angular.isObject(f)&&f.authRequired&&b.path(e)})}]).constant("SECURED_ROUTES",{}),angular.module("devFlowApp").controller("ProfileCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("devFlowApp").controller("DashboardCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);