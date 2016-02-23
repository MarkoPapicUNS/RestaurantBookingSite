/**
 * Created by tarad on 23/02/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.reservation")
        .controller("InviteCtrl", ["$routeParams", "dataService", "cookieService", "redirectService", "loginService", InviteCtrl]);

    function InviteCtrl($routeParams, dataService, cookieService, redirectService, loginService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.reservationId = $routeParams.reservationId;
        vm.selectedFriend = {};
        vm.login = loginService;

        vm.friends = [];
        vm.ErrorMessage = "";

        vm.IviteFriend = function(guestUsername) {
            if(guestUsername == null) {
                vm.ErrorMessage = "Please select guest.";
                return;
            }
            var data = {
                "RestaurantId" : reservationId,
                "InvitedGuestUsername" : guestUsername,
                "Time" : time,
                "Hours" : hours
            };
            vm.data.restCall.post("api/reservation/makereservation", data, MakeReservationSuccessCallback, MakeReservationErrorCallback);
        }

        vm.FriendSelected = function(friend) {
            vm.selectedFriend = friend;
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

        var uri = "api/guest/friends";
        vm.data.restCall.get(uri, GetFriendsSuccessCallback, GetFriendsErrorCallback);

        function GetFriendsSuccessCallback(response) {
            vm.friends = response.data;
        }

        function GetFriendsErrorCallback(response) {
            vm.ErrorMessage = response.data.Message;
        }

        function InviteSuccessCallback(response) {
            vm.ErrorMessage = response.data.Message;
        }

        function MakeReservationErrorCallback(response) {
            vm.ErrorMessage = response.data.Message;
        }
    }
})()