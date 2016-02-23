/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular
        .module("app.shared")
        .factory("dataService",
            [
                "$http",
                "appSettings",
                "cookieService",
                "redirectService",
                dataService
            ]
        )

    function dataService($http, appSettings, cookieService, redirectService) {
        var httpRequest = {};
        httpRequest.restCall = {};
        var cookies = cookieService;
        var redirection = redirectService;

        httpRequest.restCall.get = function(uri, successCB, errorCB) {
            var access_token = cookies.getItem("access_token");
            var refresh_token_id = cookies.getItem("refresh_token")
            if (access_token == "null") {
                redirection.redirect("/login");
                return;
            }

            $http({
                method : "GET",
                url : appSettings.serverPath + uri,
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            }).then(function successCallback(response) {
                successCB(response);
            }, function errorCallback(response) {
                if (response.status == 401) {
                    if (refresh_token_id == "null") {
                        redirection.redirect("/login");
                        return;
                    }
                    if (requestRefreshToken(refresh_token_id)) {
                        $http({
                            method : "GET",
                            url : appSettings.serverPath + uri
                        }).then(function retrySuccessCallback(response) {
                            successCB(response);
                        }, function retryErrorCallback(response) {
                            if (response.status == 401) {
                                redirection.redirect("/login");
                                return;
                            }
                            else
                                errorCB(response);
                        });
                    }
                }
                else {
                    errorCB(response);
                }
            });
        }

        //httpRequest.restCall.post = function(uri, data, successCB, errorCB) //implement this

        httpRequest.restCall.delete = function(uri, successCB, errorCB) {
            var access_token = cookies.getItem("access_token");
            var refresh_token_id = cookies.getItem("refresh_token")
            if (access_token == "null") {
                redirection.redirect("/login");
                return;
            }

            $http({
                method : "DELETE",
                url : appSettings.serverPath + uri,
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            }).then(function successCallback(response) {
                successCB(response);
            }, function errorCallback(response) {
                if (response.status == 401) {
                    if (refresh_token_id == "null") {
                        redirection.redirect("/login");
                        return;
                    }
                    if (requestRefreshToken(refresh_token_id)) {
                        $http({
                            method : "GET",
                            url : appSettings.serverPath + uri
                        }).then(function retrySuccessCallback(response) {
                            successCB(response);
                        }, function retryErrorCallback(response) {
                            if (response.status == 401) {
                                redirection.redirect("/login");
                                return;
                            }
                            else
                                errorCB(response);
                        });
                    }
                }
                else {
                    errorCB(response);
                }
            });
        }

        function requestRefreshToken(refreshTokenId) {
            $http({
                method: 'POST',
                url: appSettings.authorizationServerPath + appSettings.authorizationServerTokenUri,
                headers: {
                    'Content-Type': "application/json"
                },
                data: {
                    "refresh_token" : refreshTokenId,
                    "grant_type" : "refresh_token",
                    "client_id" : appSettings.clientId
                }
            }).then(function successCallback(response) {
                cookies.putItem("access_token", response.data.access_token);
                cookies.putItem("refresh_token", response.data.refresh_token);
                return true;
            }, function errorCallback(response) {
                cookies.putItem("access_token", null);
                cookies.putItem("refresh_token", null);
                return false;
            });
        }

        return httpRequest;
    }
})()