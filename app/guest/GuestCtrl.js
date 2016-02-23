/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.guest")
        .controller("GuestCtrl", ["$routeParams", "dataService", "cookieService", "redirectService", GuestCtrl]);

    function GuestCtrl($routeParams, dataService, cookieService, redirectService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.guestUsername = $routeParams.guestUsername;
        vm.requestMessage = "";

        vm. AddFriend = function(username) {
            vm.data.restCall.post("api/friendship/sendfriendrequest", "'" + request.Username + "'", RequestSuccessCallback, RequestErrorCallback);
            vm.guest.Relation = 3;
        };

        vm.RemoveFriendship = function(username) {
            vm.data.restCall.delete("api/friendship/removefriend/" + username, GenericSuccessCallback,GenericErrorCallback);
            if (vm.guest.FriendRequests != null) {
                vm.guest.FriendRequests = vm.guest.FriendRequests.filter(function (el) {
                    return el.Username != username;
                });
            }
            vm.guest.Relation = 4;
        };

        vm.AcceptRequest = function(request) {
            vm.data.restCall.post("api/friendship/acceptfriendrequest", "'" + request.Username + "'", GenericSuccessCallback, GenericErrorCallback);
            vm.guest.Relation = 1;
        };

        vm.SendRequest = function(username) {
            vm.data.restCall.post("api/friendship/sendfriendrequest", "'" + username + "'", GenericSuccessCallback, GenericErrorCallback);
            vm.guest.Relation = 3;
        };
        /*vm.RatingChange = function(confirmed) {
            console.log(confirmed);
        };
        vm.RatingClick = function(restaurantId) {
            console.log(restaurantId)
        };

        RatingSetup();*/

        var accessToken = cookieService.getItem("access_token");

        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        vm.user = cookieService.getItem("user");

        vm.guest = {};

        var uri = vm.guestUsername == null ? "api/guest/guest" : "api/guest/guest/" + vm.guestUsername;

        vm.data.restCall.get(uri, GetGuestSuccessCallback, GetGuestErrorCallback);

        function GetGuestSuccessCallback(response) {
            vm.guest = response.data
        }

        function GetGuestErrorCallback(response) {
            console.log("ERROR:" + response.data)
        }

        function GenericSuccessCallback(response) {

            vm.requestMessage = response.data.Message == null ? response.data : response.data.Message;
        }

        function GenericErrorCallback(response) {
            vm.requestMessage = response.data.Message == null ? response.data : response.data.Message;
        }

        /*function RatingSetup() {
            $(".rating input:radio").attr("checked", false);
            $('.rating input').click(function () {
                $(".rating span").removeClass('checked');
                $(this).parent().addClass('checked');
            });

            $('input:radio').change(
                function(){
                    var userRating = this.value;
                    alert(userRating);
                });
        }*/
    }
})()