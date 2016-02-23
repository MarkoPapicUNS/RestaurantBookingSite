/**
 * Created by marko.papic on 2/23/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.guest")
        .controller("GuestsCtrl", ["dataService", "cookieService", "redirectService", GuestsCtrl]);

    function GuestsCtrl(dataService, cookieService, redirectService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;

        var accessToken = cookieService.getItem("access_token");

        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        vm.user = cookieService.getItem("user");

        vm.guests = [];

        var uri = "api/guest/guests";

        vm.data.restCall.get(uri, GetGuestsSuccessCallback, GetGuestsErrorCallback);

        function GetGuestsSuccessCallback(response) {
            vm.guests = response.data;
        }

        function GetGuestsErrorCallback(response) {
            console.log("ERROR:" + response.data)
        }
}
})()