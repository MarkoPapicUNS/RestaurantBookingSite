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
        "app.restaurant",
        "app.reservation",
        "app.restaurantmanager"
    ]);

    app.config(["$routeProvider",
        function($routeProvider) {
            $routeProvider.
            when("/home", {
                templateUrl: "app/shared/homeView.html",
                controller: "HomeCtrl"
            }).
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
                controller: "RestaurantCtrl"
            }).
            when("/restaurants", {
                templateUrl: "app/restaurant/allRestaurantsView.html",
                controller: "RestaurantsCtrl"
            }).
            when("/reservation/:restaurantId", {
                templateUrl: "app/reservation/makeReservationView.html",
                controller: "ReservationCtrl"
            }).
            when("/inviteFriend/:reservationId", {
                templateUrl: "app/reservation/inviteFriend.html",
                controller: "InviteCtrl"
            }).
            when("/restaurantmanager", {
                templateUrl: "app/restaurant_manager/restaurantmanagerView.html",
                controller: "RestaurantManagerCtrl"
            }).
            when("/login", {
                templateUrl: "app/login/loginView.html",
                controller: "LoginCtrl"
            }).
            otherwise({
                redirectTo: '/home'
            });
        }]);
})()