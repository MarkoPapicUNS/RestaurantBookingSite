/**
 * Created by marko.papic on 2/26/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.systemmanager")
        .controller("SystemManagerCtrl", ["dataService", "cookieService", "redirectService", "loginService", SystemManagerCtrl]);

    function SystemManagerCtrl(dataService, cookieService, redirectService, loginService) {
        var vm = this;
        vm.data = dataService;
        vm.cookie = cookieService;
        vm.redirection = redirectService;
        vm.login = loginService;

        var accessToken = cookieService.getItem("access_token");
        if (accessToken == "null") {
            vm.redirection.redirect("/login");
            return;
        }

        vm.role = cookieService.getItem("role");
        if (vm.role != "SystemManager") {
            vm.redirection.redirect("/home");
            return;
        }

        vm.managerUsername = cookieService.getItem("user");

        vm.SystemManagers = [];
        vm.Restaurants = [];
        vm.SystemManager = {};
        vm.loginErrorMessage = "";
        vm.rManagerToAdd = {};
        vm.sManagerToAdd = {};

        var sysManagersUri = "api/system/managers";
        var restaurantsUri = "api/restaurant/restaurants";

        vm.data.restCall.get(sysManagersUri, GetManagersSuccessCallback, GetManagersErrorCallback);
        vm.data.restCall.get(restaurantsUri, GetRestaurantsSuccessCallback, GetRestaurantsErrorCallback);

        vm.AddSysManager = function(manager) {
            if(manager == null) {
                return;
            }
            if(manager.Name == null) {
                vm.ErrorMessage = "Please enter system manager username.";
                return;
            }
            if(manager.Password == null) {
                vm.ErrorMessage = "Please enter system manager password.";
                return;
            }
            vm.sManagerToAdd = {
                "Username" : manager.Name
            };
            //call register method
            document.getElementById('managerName').value = "";
            document.getElementById('managerPass').value = "";
            document.getElementById('managerPassConf').value = "";
            console.log(manager.Username + " added!");
        }

        vm.RemoveSysManager = function(manager) {
            if(manager == null) {
                return;
            }
            if(manager.Username == null) {
                return;
            }
            vm.sManagerToAdd = manager;
            //call unregister method
            console.log(manager.Username + " removed!");
        }

        vm.Logout = function() {
            vm.login.logout();
        };

        function GetManagersSuccessCallback(response) {
            vm.SystemManagers = response.data;
            vm.SystemManager = response.data.find(function (el) {
                return el.Username == vm.managerUsername;
            });
        }

        function GetManagersErrorCallback(response) {
            console.log("ERROR:" + response.data)
        }

        function GetRestaurantsSuccessCallback(response) {
            vm.Restaurants = response.data;
        }

        function GetRestaurantsErrorCallback(response) {
            console.log(response.data);
        }

        function RegisterSysManagerSuccessCallback(response) {
            vm.data.restCall.post("api/system/add", "'" + vm.sManagerToAdd.Username + "'", AddSysManagerSuccessCallback, AddSysManagerErrorCallback);
        }

        function RegisterSysManagerErrorCallback(response) {
            vm.errorMessage = response.data.Message == null ? response.data : response.data.Message;
        }

        function AddSysManagerSuccessCallback(response) {
            var sysManagerToAdd = {
                "Username": vm.sManagerToAdd.Username,
                "FirstName": null,
                "LastName": null,
                "Address": {
                    "Street": null,
                    "Number": 0,
                    "City": null,
                    "Zip": null
                },
                "Gender": 0,
                "Picture": null
            };
            vm.SystemManagers.push(sysManagerToAdd);
        }

        function AddSysManagerErrorCallback(response) {
            vm.errorMessage = response.data.Message == null ? response.data : response.data.Message;
        }

        /*function RemoveMealSuccessCallback(response) {
            vm.Restaurant.Menu = vm.Restaurant.Menu.filter(function (el) {
                return el.Name != vm.mealToAdd.Name;
            });
        }

        function RemoveMealErrorCallback(response) {
            vm.errorMessage = response.data.Message == null ? response.data : response.data.Message;
        }*/
    }
})()