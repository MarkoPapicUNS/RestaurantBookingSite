/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.login")
        .controller("LoginCtrl", ["loginService", "redirectService", LoginCtrl]);

    function LoginCtrl(loginService, redirectService) {
        var vm = this;
        vm.redirection = redirectService;
        vm.loginErrorMessage = "";

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