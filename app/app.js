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
        "app.guest",
        "app.restaurant"
    ]);

    app.config(["$routeProvider",
        function($routeProvider) {
            $routeProvider.
            when("/guest/:guestUsername?", {
                templateUrl: "app/guest/guestView.html",
                controller: "GuestCtrl"
            }).
            when("/guests", {
                templateUrl: "app/guest/allGuestsView.html",
                controller: "GuestsCtrl"
            }).
            when("/restaurant/:restaurantId", {
                templateUrl: "app/restaurant/restaurantView.html",
                controller: "GuestsCtrl"
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