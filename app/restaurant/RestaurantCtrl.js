/**
 * Created by marko.papic on 2/23/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.restaurant")
        .controller("RestaurantCtrl", ["$routeParams", "dataService", "cookieService", "redirectService", "loginService", RestaurantCtrl]);

    function RestaurantCtrl($routeParams, dataService, cookieService, redirectService, loginService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.login = loginService;
        vm.restaurantId = $routeParams.restaurantId;

        vm.Logout = function() {
            vm.login.logout();
        };

        var accessToken = cookieService.getItem("access_token");

        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        vm.user = cookieService.getItem("user");
        vm.userRole = cookieService.getItem("role");
        if (vm.userRole == null)
            redirection.redirect("/home");

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