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
        vm.SuccessMessage = "";

        vm.InviteFriend = function() {
            if(vm.selectedFriend == null) {
                vm.ErrorMessage = "Please select guest.";
                return;
            }
            var data = {
                "ReservationId" : vm.reservationId,
                "InvitedGuestUsername" : vm.selectedFriend.Username
            };
            vm.data.restCall.post("api/reservation/invitefriend", data, InviteSuccessCallback, InviteErrorCallback);
        };

        vm.FriendSelected = function(friend) {
            vm.selectedFriend = friend;
            console.log(friend);
        };

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
            if (response.data.Message == null)
                vm.SuccessMessage = response.data;
            else
                vm.SuccessMessage = response.data.Message;
            vm.friends = vm.friends.filter(function (el) {
                return el.Username != vm.selectedFriend.Username;
            });
        }

        function InviteErrorCallback(response) {
            if (response.data.Message == null)
                vm.ErrorMessage = response.data;
            else
                vm.ErrorMessage = response.data.Message;
        }
    }
})()