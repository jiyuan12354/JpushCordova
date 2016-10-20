/**
 * Created by dengjian on 2016-10-17.
 */
angular.module('home.controllers', [])
    .controller('homeController',
        ['$scope', '$state', function($scope, $state) {
            $scope.title = "1234567890";
        }]);