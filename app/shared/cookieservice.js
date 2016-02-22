/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.shared")
        .factory("cookieService",["$cookies",cookieService])

    function cookieService($cookies) {
        var cookieRepo = {};
        cookieRepo.getItem = function(itemName) {
            return $cookies.get(itemName);
        }

        cookieRepo.removeItem = function(itemName) {
            $cookies.remove(itemName);
        }

        cookieRepo.putItem = function(itemName, item) {
            $cookies.put(itemName, item);
        }
        return cookieRepo;
    }
})()