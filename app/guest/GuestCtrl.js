/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.guest")
        .controller("GuestCtrl", ["dataService", "cookieService", "redirectService", GuestCtrl]);

    function GuestCtrl(dataService, cookieService, redirectService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;

        var accessToken = cookieService.getItem("access_token");

        if (accessToken == "null")
            vm.redirection.redirect("/login");

        vm.user = cookieService.getItem("user");

        vm.guest = {};

        vm.data.restCall.get("api/guest/guest", SuccessCallback, ErrorCallback);

        function SuccessCallback(response) {
            vm.guest = response.data
        }

        function ErrorCallback(response) {
            console.log("ERROR:" + response.data)
        }
    }
})()