/**
 * Created by marko.papic on 2/22/2016.
 */
/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.shared")
        .factory("redirectService",
            [
                "$location",
                redirectService
            ])

    function redirectService($location) {
        var rs = {};

        rs.redirect = function(path) {
            $location.path(path);
            return;
        }

        return rs;
    }
})()