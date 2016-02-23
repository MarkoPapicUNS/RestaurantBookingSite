/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    var app = angular.module("app", [
        "ngRoute",
        "ngCookies",
        "app.shared",
        "app.login",
        "app.guest"
    ]);

    app.config(["$routeProvider",
        function($routeProvider) {
            $routeProvider.
            when("/guest/:guestUsername?", {
                templateUrl: "app/guest/guestView.html",
                controller: "GuestCtrl"
            }).
            when("/login", {
                templateUrl: "app/login/loginView.html",
                controller: "LoginCtrl"
            }).
            otherwise({
                redirectTo: '/guest'
            });
        }]);
})()