/**
 * Created by tarad on 23/02/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.reservation")
        .controller("ReservationCtrl", ["$routeParams", "dataService", "cookieService", "redirectService", "loginService", ReservationCtrl]);

    function ReservationCtrl($routeParams, dataService, cookieService, redirectService, loginService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.restaurantId = $routeParams.restaurantId;
        vm.login = loginService;

        vm.restaurant = {};
        vm.freeTables = [];
        vm.ErrorMessage = "";

        vm.MakeReservation = function(tableNumber, time, hours) {
            if(time == null) {
                vm.ErrorMessage = "Please choose time.";
                return;
            }
            if (hours == null) {
                vm.ErrorMessage = "Please choose hours.";
                return;
            }
            if(tableNumber == null) {
                vm.ErrorMessage = "Please choose table number.";
                return;
            }
            var data = {
                "RestaurantId" : vm.restaurantId,
                "TableNumber" : tableNumber,
                "Time" : time,
                "Hours" : hours
            };
            vm.data.restCall.post("api/reservation/makereservation", data, MakeReservationSuccessCallback, MakeReservationErrorCallback);
        }

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
            vm.redirection.redirect("/home");

        var uri = "api/restaurant/restaurant/" + vm.restaurantId;
        vm.data.restCall.get(uri, GetRestaurantSuccessCallback, GetRestaurantErrorCallback);

        function GetRestaurantSuccessCallback(response) {
            vm.restaurant = response.data;
            vm.freeTables = vm.restaurant.Tables.filter(function (el) {
                return vm.restaurant.ReservedTables.indexOf(el.Number) == -1;
            });
        }

        function GetRestaurantErrorCallback(response) {
            vm.redirection.redirect("/restaurant/" + vm.restaurantId)
        }

        function MakeReservationSuccessCallback(response) {
            vm.redirection.redirect("/restaurant/" + vm.restaurantId)
        }

        function MakeReservationErrorCallback(response) {
           vm.ErrorMessage = response.data.Message;
        }
    }
})()