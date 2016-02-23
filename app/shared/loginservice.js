/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.shared")
        .factory("loginService",
            [
                "$http",
                "appSettings",
                "cookieService",
                "redirectService",
                loginService
            ])

    function loginService($http, appSettings, cookieService, redirectService) {
        var ls = {};
        var cookies = cookieService;
        var redirection = redirectService;

        ls.login = function(username, password, successCB, errorCB) {
            $http({
                method: 'POST',
                url: appSettings.authorizationServerPath + appSettings.authorizationServerTokenUri,
                headers: {
                    "Accept" : "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                transformRequest : function (data, headersGetter) {
                    var str = [];
                    for (var d in data)
                        str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                    return str.join("&");
                },
                data: {
                    "username" : username,
                    "password" : password,
                    "grant_type" : "password",
                    "client_id" : appSettings.clientId
                }
            }).then(function successCallback(response) {
                cookies.putItem("access_token", response.data.access_token);
                cookies.putItem("refresh_token", response.data.refresh_token);
                cookies.putItem("user", response.data.userName);
                cookies.putItem("role", response.data.role);
                successCB(response);
            }, function errorCallback(response) {
                errorCB(response);
            });
        }

        ls.logout = function() {
            cookies.putItem("access_token", null);
            cookies.putItem("refresh_token", null);
            cookies.putItem("user", null);
            cookies.putItem("role", null);
            redirection.redirect("/login");
        }

        return ls;
    }
})()