/**
 * Created by tarad on 23/02/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.guest")
        .controller("RestaurantsCtrl", ["dataService", "cookieService", "redirectService", "loginService", RestaurantsCtrl]);

    function RestaurantsCtrl(dataService, cookieService, redirectService, loginService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.login = loginService;

        vm.Logout = function() {
            vm.login.logout();
        };

        var accessToken = cookieService.getItem("access_token");

        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        vm.user = cookieService.getItem("user");

        vm.restaurants = [];

        var uri = "api/restaurant/restaurants";

        vm.data.restCall.get(uri, GetGuestsSuccessCallback, GetGuestsErrorCallback);

        function GetGuestsSuccessCallback(response) {
            vm.restaurants = response.data;
        }

        function GetGuestsErrorCallback(response) {
            console.log("ERROR:" + response.data)
        }
    }
})()