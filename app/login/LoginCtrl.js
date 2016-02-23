/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.login")
        .controller("LoginCtrl", ["loginService", "redirectService", "cookieService", LoginCtrl]);

    function LoginCtrl(loginService, redirectService, cookieService) {
        var vm = this;
        vm.redirection = redirectService;
        vm.cookie = cookieService;
        vm.loginErrorMessage = "";

        var accessToken = vm.cookie.getItem("access_token");

        if (accessToken != "null") {
            vm.redirection.redirect("/home");
            return;
        }

        vm.login = function (userModel) {
            loginService.login(userModel.name, userModel.password, SuccessCallback, ErrorCallback);
        };

        function SuccessCallback(response) {
            vm.redirection.redirect("/home");
            return;
        }

        function ErrorCallback(response) {
            vm.loginErrorMessage = response.data.error_description;
        }
    }
})()