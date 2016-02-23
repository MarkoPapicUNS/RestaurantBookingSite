/**
 * Created by tarad on 23/02/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.shared")
        .controller("HomeCtrl", ["cookieService", "redirectService", HomeCtrl]);

    function HomeCtrl(cookieService, redirectService) {
        var vm = this;
        vm.cookie = cookieService;
        vm.redirection = redirectService;

        var accessToken = cookieService.getItem("access_token");
        var role = cookieService.getItem("role");

        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        switch (role) {
            case 'Guest':
                vm.redirection.redirect("/guest");
                return;
                break;
            case 'RestaurantManager':
                vm.redirection.redirect("/restaurantManager");
                return;
                break;
            case 'SystemManager':
                vm.redirection.redirect("/systemManager");
                return;
                break;
            default:
                vm.redirection.redirect("/guest");
                return;
        }
    }
})()