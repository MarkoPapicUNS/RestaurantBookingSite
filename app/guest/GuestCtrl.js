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

        vm.DeclineRequest = function(username) {
            vm.data.restCall.delete("api/friendship/removefriend/" + username, CancelRequestSuccessCallback, CancelRequestErrorCallback);
        };
        vm.AcceptRequest = function(username) {
            console.log(username);
        };
        /*vm.RatingChange = function(confirmed) {
            console.log(confirmed);
        };
        vm.RatingClick = function(restaurantId) {
            console.log(restaurantId)
        };

        RatingSetup();*/

        var accessToken = cookieService.getItem("access_token");

        if (accessToken == "null")
            vm.redirection.redirect("/login");

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

        function CancelRequestSuccessCallback(response) {
            console.log(response.data)
        }

        function CancelRequestErrorCallback(response) {
            console.log(response.data)
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