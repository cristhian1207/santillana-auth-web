var app = angular.module('authApp', []);

app.controller('updateAuth', function($scope, $http, $location, $window) {
    var authID = $location.path().split('/')[1];
    var userID = $location.path().split('/')[2];
    var userName = $location.path().split('/')[3];
    var pathStatus = Number($location.path().split('/')[4]);
    var adds = {};
    uri_getAuthorization += authID;
    $http({
        method: 'GET',
        url: uri_getAuthorization
    }).then(function(response) {
        if (!response.data.success) {
            $window.location.href = '404.html';
        }

        var status = '';
        switch (response.data.data.status) {
            case 1:
                status = 'Aprobado';
                break;
            case 2:
                status = 'Rechazado';
                break;
        }
        adds.pending = (response.data.data.status === 0);
        adds.accepted = (response.data.data.status === 1);
        adds.refused = (response.data.data.status === 2);
        adds.status = status;
        $scope.auth = response.data.data;
        $scope.adds = adds;

        if ((pathStatus != 0) && (response.data.data.status == 0)) {
            response.data.data.status = pathStatus;
            response.data.data.approverUserID = userID;
            response.data.data.approverUserName = userName;
            updateAuth($http, $window, response.data.data);
        }
    });

    $scope.accept = function(auth) {
        auth.status = 1;
        auth.approverUserID = userID;
        auth.approverUserName = userName;
        updateAuth($http, $window, auth);
    }

    $scope.refuse = function(auth) {
        auth.status = 2;
        auth.approverUserID = userID;
        auth.approverUserName = userName;
        updateAuth($http, $window, auth);
    }
});

var updateAuth = function($http, $window, auth) {
    $http({
        method: 'POST',
        url: uri_updateAuthorization,
        data: auth
    }).then(function(response) {
        // alert(response.data.message);
        $window.location.reload();
    });
}