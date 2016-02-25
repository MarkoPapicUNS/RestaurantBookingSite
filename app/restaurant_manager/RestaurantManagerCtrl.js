/**
 * Created by Marko on 2/25/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.restaurantmanager")
        .controller("RestaurantManagerCtrl", ["dataService", "cookieService", "redirectService", "loginService", RestaurantManagerCtrl]);

    function RestaurantManagerCtrl(dataService, cookieService, redirectService, loginService) {
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
        if (vm.role != "RestaurantManager") {
            vm.redirection.redirect("/home");
            return;
        }

        vm.RestaurantManager = {};
        vm.Restaurant = {};
        vm.loginErrorMessage = "";
        vm.mealToAdd = {};

        var uri = "api/restaurant/manager";

        vm.data.restCall.get(uri, GetManagerSuccessCallback, GetManagerErrorCallback);

        vm.AddMeal = function(meal) {
            if(meal == null) {
                return;
            }
            if(meal.Name == null) {
                vm.ErrorMessage = "Please select meal name.";
                return;
            }
            if(meal.Price == null) {
                vm.ErrorMessage = "Please select meal price.";
                return;
            }
            vm.mealToAdd = meal;
            var data = {
                "RestaurantId" : vm.Restaurant.RestaurantId,
                "Name" : meal.Name,
                "Description" : meal.Description,
                "Price" : meal.Price
            };
            vm.data.restCall.post("api/restaurant/addmeal", data, AddMealSuccessCallback, AddMealErrorCallback);
            document.getElementById('mealName').value = "";
            document.getElementById('mealDesc').value = "";
            document.getElementById('mealPrice').value = "";
        }

        vm.RemoveMeal = function(meal) {
            if(meal == null) {
                return;
            }
            if(meal.Name == null) {
                return;
            }
            vm.mealToAdd = meal;
            vm.data.restCall.delete("api/restaurant/removemeal/" + vm.Restaurant.RestaurantId + "/" + meal.Name , RemoveMealSuccessCallback, RemoveMealErrorCallback);
        }

        function GetManagerSuccessCallback(response) {
            vm.RestaurantManager = response.data;
            vm.data.restCall.get("api/restaurant/restaurant/" + vm.RestaurantManager.RestaurantId, GetRestaurantSuccessCallback, GetRestaurantErrorCallback);
        }

        function GetManagerErrorCallback(response) {
            console.log("ERROR:" + response.data)
        }

        function GetRestaurantSuccessCallback(response) {
            vm.Restaurant = response.data;
        }

        function GetRestaurantErrorCallback(response) {
            console.log(response.data);
        }

        function AddMealSuccessCallback(response) {
            var mealToAdd = {
                "RestaurantId": vm.RestaurantManager.RestaurantId,
                "Name": vm.mealToAdd.Name,
                "Description": vm.mealToAdd.Description,
                "Price": vm.mealToAdd.Price
            }
            vm.Restaurant.Menu.push(mealToAdd);
        }

        function AddMealErrorCallback(response) {
            vm.errorMessage = response.data.Message == null ? response.data : response.data.Message;
        }

        function RemoveMealSuccessCallback(response) {
            vm.Restaurant.Menu = vm.Restaurant.Menu.filter(function (el) {
                return el.Name != vm.mealToAdd.Name;
            });
        }

        function RemoveMealErrorCallback(response) {
            vm.errorMessage = response.data.Message == null ? response.data : response.data.Message;
        }
    }
})()