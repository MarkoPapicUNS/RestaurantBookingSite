/**
 * Created by marko.papic on 2/23/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.restaurant")
        .controller("RestaurantCtrl", ["$routeParams", "dataService", "cookieService", "redirectService", RestaurantCtrl]);

    function RestaurantCtrl($routeParams, dataService, cookieService, redirectService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.restaurantId = $routeParams.restaurantId;

        var accessToken = cookieService.getItem("access_token");

        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        vm.user = cookieService.getItem("user");
        vm.userRole = cookieService.getItem("role");
        if (vm.userRole == null)
            redirection.redirect("/home");

        vm.restaurant = {
            "Name" : "Hi",
            "Nick" : "There"
        };

        var uri = "api/restaurant/restaurant/" + vm.restaurantId;

        vm.data.restCall.get(uri, GetRestaurantSuccessCallback, GetRestaurantErrorCallback);

        function GetRestaurantSuccessCallback(response) {
            vm.restaurant = response.data;
        }

        function GetRestaurantErrorCallback(response) {
            console.log("ERROR:" + response.data)
        }
    }
})()