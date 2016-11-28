/**
 * Created by dengjian on 2016-10-27.
 */
angular.module('detail.controller',[])
.controller('detailController',['$scope','$state','$stateParams', function ($scope,$state,$stateParams) {
/*    $scope.pushDate = "2016.9.20";
    $scope.messageContent = "从极光推送来的消息";*/
    $scope.pushDate = $stateParams.PushDate;
    $scope.messageContent = $stateParams.Content;
}]);