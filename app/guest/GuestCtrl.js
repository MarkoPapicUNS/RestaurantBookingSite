/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.guest")
        .controller("GuestCtrl", ["$routeParams", "dataService", "cookieService", "redirectService", "loginService", GuestCtrl]);

    function GuestCtrl($routeParams, dataService, cookieService, redirectService, loginService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.login = loginService;
        vm.guestUsername = $routeParams.guestUsername;
        vm.successMessage = "";
        vm.errorMessage = "";
        vm.ratingEditing = "";

        /*vm. AddFriend = function(username) {
            vm.data.restCall.post("api/friendship/sendfriendrequest", "'" + request.Username + "'", RequestSuccessCallback, RequestErrorCallback);
            if (username == vm.guestUsername)
                vm.guest.Relation = 3;
        };*/

        vm.RemoveFriendship = function(username) {
            vm.data.restCall.delete("api/friendship/removefriend/" + username, GenericSuccessCallback,GenericErrorCallback);
            if (vm.guest.FriendRequests != null) {
                vm.guest.FriendRequests = vm.guest.FriendRequests.filter(function (el) {
                    return el.Username != username;
                });
            }
            if (username == vm.guestUsername)
                vm.guest.Relation = 4;
        };

        vm.AcceptRequest = function(request) {
            vm.data.restCall.post("api/friendship/acceptfriendrequest", "'" + request.Username + "'", GenericSuccessCallback, GenericErrorCallback);
            if (vm.guest.FriendRequests != null) {
                vm.guest.FriendRequests = vm.guest.FriendRequests.filter(function (el) {
                    return el.Username != request.Username;
                });
            }
            if (request.Username == vm.guestUsername)
                vm.guest.Relation = 1;
        };

        vm.SendRequest = function(username) {
            vm.data.restCall.post("api/friendship/sendfriendrequest", "'" + username + "'", GenericSuccessCallback, GenericErrorCallback);
            if (username == vm.guestUsername)
                vm.guest.Relation = 3;
        };

        vm.SendRating = function(restaurantId, grade, comment) {
            var data = {
                "RestaurantId" : restaurantId,
                "Rating" : grade,
                "Comment" : comment
            }
            vm.data.restCall.post("api/rating/rate", data, GenericSuccessCallback, GenericErrorCallback);
            console.log("Rated with rating " + grade + " and comment " + comment);
            vm.ratingEditing = "";
            var i;
            for (i = 0; i < vm.guest.Ratings.length; i++) {
                if (vm.guest.Ratings[i].RestaurantId == restaurantId) {
                    vm.guest.Ratings[i].Rating = grade;
                    vm.guest.Ratings[i].Comment = comment;
                    vm.guest.Ratings[i].Rated = true;
                }
            }
        };

        vm.CancelRating = function() {
            vm.ratingEditing = "";
        };

        vm.OpenRatingForm = function(rating) {
            console.log(rating);
            vm.ratingEditing = rating.RestaurantId;
        };

        vm.AcceptInvitation = function(reservationId) {
            vm.data.restCall.post("api/reservation/acceptinvitation", "'" + reservationId + "'", GenericSuccessCallback, GenericErrorCallback);
            var i;
            for (i = 0; i < vm.guest.ReservationInvitations.length; i++) {
                if (vm.guest.ReservationInvitations[i].GuestReservationId == reservationId) {
                    vm.guest.ReservationInvitations[i].Status = 1;
                }
            }
        };

        vm.DeclineInvitation = function(reservationId) {
            vm.data.restCall.post("api/reservation/declineinvitation", "'" + reservationId + "'", GenericSuccessCallback, GenericErrorCallback);
            vm.guest.ReservationInvitations = vm.guest.ReservationInvitations.filter(function (el) {
                return el.GuestReservationId != reservationId;
            });
        };

        vm.Logout = function() {
            vm.login.logout();
        };

        /*vm.RatingChange = function(confirmed) {
            console.log(confirmed);
        };
        vm.RatingClick = function(restaurantId) {
            console.log(restaurantId)
        };

        RatingSetup();*/

        var accessToken = cookieService.getItem("access_token");
        var role = cookieService.getItem("role");

        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        if (role != "Guest") {
            vm.redirection.redirect("/home");
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

            vm.successMessage = response.data.Message == null ? response.data : response.data.Message;
        }

        function GenericErrorCallback(response) {
            vm.errorMessage = response.data.Message == null ? response.data : response.data.Message;
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