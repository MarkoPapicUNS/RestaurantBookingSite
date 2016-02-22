/**
 * Created by marko.papic on 2/22/2016.
 */
(function(){
    "use strict";

    angular.module("app.shared", [])
        .constant("appSettings",
            {
                serverPath: "http://localhost:8887/",
                authorizationServerPath: "https://localhost:44300/",
                authorizationServerTokenUri: "oauth2/token",
                clientId: "ab9da96ebf4c411eacdbc22b552724ed"
            })
})()